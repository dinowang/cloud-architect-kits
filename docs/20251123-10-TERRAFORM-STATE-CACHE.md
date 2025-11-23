# 20251123-10-TERRAFORM-STATE-CACHE

## 異動日期
2025-11-23

## 異動目的
1. 在 `deploy-ppt-addin-to-azure.yml` 工作流程中使用 GitHub Actions Cache 保存 Terraform 狀態檔，使 Terraform 可以在多次部署之間保持狀態追蹤，避免重複建立資源
2. 修正 Azure Static Web Apps 部署驗證錯誤，新增 `index.html` 檔案

## 異動內容

### 檔案
`.github/workflows/deploy-ppt-addin-to-azure.yml`

### 新增步驟

#### 1. 建立 index.html (在 Download PowerPoint add-in 步驟中)

Azure Static Web Apps 部署驗證需要 `index.html` 作為預設檔案，否則會出現以下錯誤：
```
Failed to find a default file in the app artifacts folder (ppt-addin). 
Valid default files: index.html,Index.html.
```

**解決方案**：在解壓縮後動態建立 `index.html`，重導向至 `taskpane-built.html`：

```bash
cat > ppt-addin/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=/taskpane-built.html">
  <title>Cloud Architect Kit - PowerPoint Add-in</title>
</head>
<body>
  <p>Redirecting to PowerPoint Add-in...</p>
</body>
</html>
EOF
```

**功能**：
- 滿足 Azure Static Web Apps 的預設檔案要求
- 自動重導向至實際的 PowerPoint Add-in 頁面
- 不影響 Office Add-in 的正常運作（manifest.xml 仍指向 taskpane-built.html）

#### 2. Restore Terraform State (在 Terraform Init 之前)
```yaml
- name: Restore Terraform state
  uses: actions/cache/restore@v4
  id: cache-terraform-state
  with:
    path: src/powerpoint/terraform/terraform.tfstate
    key: terraform-state-ppt-${{ vars.CODENAME }}
```

**位置**: 在 `Azure Login` 之後，`Terraform Init` 之前

**功能**:
- 從 GitHub Actions Cache 還原上次儲存的 Terraform 狀態檔
- 使用 `CODENAME` 變數作為 cache key 的一部分，確保不同專案使用獨立的狀態
- 若無快取則為首次部署，Terraform 會建立新資源

#### 3. Save Terraform State (在 Terraform Apply 之後)
```yaml
- name: Save Terraform state
  uses: actions/cache/save@v4
  if: always()
  with:
    path: src/powerpoint/terraform/terraform.tfstate
    key: terraform-state-ppt-${{ vars.CODENAME }}
```

**位置**: 在 `Terraform Apply` 之後，`Get Static Web App deployment token` 之前

**功能**:
- 將 Terraform 狀態檔儲存到 GitHub Actions Cache
- `if: always()`: 即使前面步驟失敗也會執行，確保狀態不會遺失
- 使用相同的 cache key，下次部署時可以還原

## 技術細節

### Cache Key 設計
```
terraform-state-ppt-${{ vars.CODENAME }}
```

**組成元素**:
- `terraform-state-ppt`: 固定前綴，識別這是 PPT add-in 的 Terraform 狀態
- `${{ vars.CODENAME }}`: 專案代號，確保不同專案使用獨立的狀態檔

### 狀態檔路徑
```
src/powerpoint/terraform/terraform.tfstate
```

這是 Terraform local backend 的預設狀態檔位置。

### 執行流程

#### 首次部署
1. **Restore**: 無快取，跳過
2. **Init**: 初始化 Terraform
3. **Plan**: 規劃建立所有資源
4. **Apply**: 建立資源，生成 `terraform.tfstate`
5. **Save**: 儲存狀態檔到 Cache

#### 後續部署
1. **Restore**: 還原上次的狀態檔
2. **Init**: 初始化 Terraform
3. **Plan**: 比較狀態與設定，只規劃變更部分
4. **Apply**: 只套用變更，不重建既有資源
5. **Save**: 更新狀態檔到 Cache

## 優點

### 1. 避免重複建立資源
- 有狀態追蹤，Terraform 知道哪些資源已存在
- 只會更新或建立缺少的資源
- 不會因為重新部署而產生衝突

### 2. 成本節省
- 不需要另外建立 Azure Storage Account 來存放狀態
- 使用 GitHub Actions 提供的免費 Cache

### 3. 簡化設定
- 不需要設定 Azure backend configuration
- 不需要管理 Storage Account 的存取權限
- 減少需要的 secrets 和 variables

### 4. 安全性
- 狀態檔儲存在 GitHub Actions Cache，受 GitHub 安全保護
- 與其他專案隔離，使用 CODENAME 區分

## 限制與注意事項

### 1. Cache 保留期限
- GitHub Actions Cache 預設保留 **7 天**
- 超過 7 天未使用會被自動刪除
- 定期部署可維持狀態，長期未使用需重新建立資源

### 2. Cache 大小限制
- 單一 Cache 項目最大 **10 GB**
- Terraform 狀態檔通常很小（KB 等級），不會有問題
- 總 Cache 大小有 repository 層級的限制（10 GB）

### 3. 並行部署
- 多個 workflow 同時執行可能產生狀態衝突
- 建議使用 `concurrency` 限制同時只有一個部署

### 4. 狀態遺失情境
- Cache 過期（超過 7 天）
- 手動清除 Cache
- 變更 CODENAME 變數

### 5. 不適合多人協作
- 每個人/分支都會有獨立的 Cache
- 建議生產環境使用 Azure Storage backend

## 建議改進

### 1. 增加並行控制
```yaml
concurrency:
  group: deploy-ppt-${{ vars.CODENAME }}
  cancel-in-progress: false
```

### 2. 狀態檔備份
定期將狀態檔備份到其他地方（如 GitHub Artifacts）：
```yaml
- name: Backup Terraform state
  uses: actions/upload-artifact@v4
  with:
    name: terraform-state-backup-${{ github.run_number }}
    path: src/powerpoint/terraform/terraform.tfstate
    retention-days: 30
```

### 3. 狀態檔鎖定
使用 Azure Storage backend 可提供狀態鎖定功能，防止並行修改。

## 使用說明

### 查看快取狀態
```bash
# 使用 GitHub CLI
gh cache list --repo <owner>/<repo>

# 查看特定 key
gh cache list --repo <owner>/<repo> --key terraform-state-ppt
```

### 清除快取（強制重建）
```bash
# 刪除快取
gh cache delete <cache-id> --repo <owner>/<repo>

# 或透過 GitHub Web UI
# Settings → Actions → Caches → Delete
```

### 本地測試
```bash
# 模擬首次部署（無狀態檔）
cd src/powerpoint/terraform
rm -f terraform.tfstate terraform.tfstate.backup
terraform init
terraform plan

# 模擬後續部署（有狀態檔）
terraform plan  # 會顯示 "No changes"
```

## 測試驗證

### 首次部署
```bash
gh workflow run deploy-ppt-addin-to-azure.yml

# 檢查:
# - Restore 步驟顯示 "Cache not found"
# - Apply 步驟建立所有資源
# - Save 步驟成功儲存
```

### 第二次部署
```bash
gh workflow run deploy-ppt-addin-to-azure.yml

# 檢查:
# - Restore 步驟顯示 "Cache restored"
# - Plan 步驟顯示 "No changes" 或只有變更部分
# - Apply 步驟不重建既有資源
# - Save 步驟更新快取
```

## 相關資源

- [GitHub Actions Cache](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [actions/cache documentation](https://github.com/actions/cache)
- [Terraform State](https://developer.hashicorp.com/terraform/language/state)
- [Terraform Backends](https://developer.hashicorp.com/terraform/language/settings/backends/configuration)

## 部署驗證問題

### 問題描述
Azure Static Web Apps 部署時出現錯誤：
```
Failed to find a default file in the app artifacts folder (ppt-addin). 
Valid default files: index.html,Index.html.
```

### 原因分析
- Azure Static Web Apps 需要預設檔案（`index.html`）才能通過驗證
- PowerPoint Add-in 使用 `taskpane-built.html` 作為主要檔案
- `staticwebapp.config.json` 中的 `navigationFallback` 設定在驗證階段不會被考慮

### 解決方案
在部署前動態建立 `index.html`：
1. 建立簡單的 HTML 頁面
2. 使用 `<meta http-equiv="refresh">` 自動重導向
3. 重導向目標為 `taskpane-built.html`

### 影響評估
- ✅ 不影響 Office Add-in 功能（manifest.xml 仍指向 taskpane-built.html）
- ✅ 符合 Azure Static Web Apps 的驗證要求
- ✅ 使用者直接訪問根路徑會自動重導向到正確頁面
- ✅ 不需要修改現有的建置流程

## 檔案變更統計

```
.github/workflows/deploy-ppt-addin-to-azure.yml | 29 +++++++++++++++++++++++
1 file changed, 29 insertions(+)
```

## 備註

1. **適用場景**: 適合個人專案或小型團隊的持續部署
2. **生產環境**: 建議使用 Azure Storage backend 獲得更好的可靠性和協作能力
3. **狀態保護**: `if: always()` 確保即使部署失敗也能保存最新狀態
4. **Cache Key**: 使用 CODENAME 區分不同專案的狀態，避免衝突
