# 20251123-16-AUTO-DEPLOY-ON-RELEASE

## 異動日期
2025-11-23

## 異動目的
驗證並說明 PowerPoint Add-in 自動部署機制，當 repository 有新的 Release 時自動觸發 Azure 部署。

## 現況確認

### 工作流程已經配置完成

經檢查，`deploy-ppt-addin-to-azure.yml` 已經正確配置自動部署觸發器：

```yaml
on:
  release:
    types: [published]
  workflow_dispatch:
    inputs:
      release_tag:
        description: "Release tag to deploy (e.g., v202511230630)"
        required: true
        type: string
```

**✅ 結論**: 工作流程已經支援自動部署，無需修改。

## 自動部署流程

### 完整流程圖

```
1. 手動觸發或定時觸發
   └─> build-and-release.yml
       │
2. 建置所有元件
   ├─ 下載圖示來源
   ├─ 預建置圖示
   ├─ 建置 Figma plugin
   ├─ 建置 PowerPoint add-in
   └─ 打包 ZIP 檔案
       │
3. 檢查變更 & 提交
   ├─ 比較 dist/ 目錄
   ├─ 建立 CI branch
   └─ 提交變更
       │
4. 建立 GitHub Release
   ├─ 生成 release tag (v{timestamp})
   ├─ 上傳 ZIP 檔案
   │   ├─ cloud-architect-kit-figma-plugin.zip
   │   └─ cloud-architect-kit-powerpoint-addin.zip
   └─ 發布 Release
       │
5. 觸發自動部署 (自動)
   └─> deploy-ppt-addin-to-azure.yml
       │
6. 檢查 Release 資產
   ├─ 取得 release tag
   ├─ 檢查 PowerPoint add-in ZIP 是否存在
   └─ 取得下載 URL
       │
7. 部署到 Azure (如果有 ZIP)
   ├─ 下載並解壓縮 ZIP
   ├─ 建立 index.html
   ├─ 還原 Terraform state
   ├─ Terraform init/plan/apply
   ├─ 儲存 Terraform state
   ├─ 取得 Static Web App token
   └─ 部署到 Azure Static Web Apps
       │
8. 完成 ✅
```

## 觸發條件

### 1. 自動觸發 (Release Published)

```yaml
on:
  release:
    types: [published]
```

**觸發時機**:
- 當 `build-and-release.yml` 建立並發布新的 Release 時
- Release 狀態必須是 `published` (不是 draft)

**自動執行**:
```
build-and-release.yml (完成)
  └─> 建立 Release (tag: v202511230630)
      └─> 發布 Release (published)
          └─> 自動觸發 deploy-ppt-addin-to-azure.yml ✅
```

### 2. 手動觸發 (Workflow Dispatch)

```yaml
on:
  workflow_dispatch:
    inputs:
      release_tag:
        description: "Release tag to deploy (e.g., v202511230630)"
        required: true
        type: string
```

**使用情境**:
- 重新部署特定版本
- 測試部署流程
- 修正部署問題後重試

**手動執行**:
```bash
# 使用 GitHub CLI
gh workflow run deploy-ppt-addin-to-azure.yml \
  -f release_tag=v202511230630

# 或透過 GitHub Web UI
Actions → Deploy PPT Addin to Azure → Run workflow
→ 輸入 release_tag: v202511230630
```

## 工作流程步驟詳解

### Job 1: check-release

**目的**: 檢查 Release 是否包含 PowerPoint add-in 資產

#### Step 1: Get release tag
```yaml
- name: Get release tag
  run: |
    if [ "${{ github.event_name }}" == "workflow_dispatch" ]; then
      RELEASE_TAG="${{ inputs.release_tag }}"
    else
      RELEASE_TAG="${{ github.event.release.tag_name }}"
    fi
```

**功能**:
- 自動觸發: 從 `github.event.release.tag_name` 取得
- 手動觸發: 從輸入參數 `inputs.release_tag` 取得

#### Step 2: Check for PowerPoint add-in asset
```yaml
- name: Check for PowerPoint add-in asset
  run: |
    ASSET_URL=$(gh api /repos/${{ github.repository }}/releases/tags/$RELEASE_TAG \
      | jq -r '.assets[] | select(.name == "cloud-architect-kit-powerpoint-addin.zip") | .browser_download_url')
```

**檢查邏輯**:
- 使用 GitHub API 取得 Release 資訊
- 尋找名為 `cloud-architect-kit-powerpoint-addin.zip` 的資產
- 如果找到: 設定 `has_ppt_asset=true` 並取得下載 URL
- 如果沒找到: 設定 `has_ppt_asset=false` 並跳過部署

**輸出**:
- `has_ppt_asset`: true/false
- `download_url`: ZIP 檔案的下載連結
- `release_tag`: Release 標籤

### Job 2: deploy

**條件**: `needs.check-release.outputs.has_ppt_asset == 'true'`

**環境**: `production-ppt` (需要設定 secrets 和 variables)

#### Step 1: Download PowerPoint add-in
```yaml
- name: Download PowerPoint add-in
  run: |
    curl -L -o cloud-architect-kit-powerpoint-addin.zip "${{ needs.check-release.outputs.download_url }}"
    unzip -q cloud-architect-kit-powerpoint-addin.zip -d ppt-addin
```

#### Step 2: Create index.html
```yaml
- name: Download PowerPoint add-in
  run: |
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

**目的**: 滿足 Azure Static Web Apps 的預設檔案要求

#### Step 3-5: Terraform 部署
```yaml
- name: Restore Terraform state      # 從 GitHub Actions Cache 還原
- name: Terraform Init               # 初始化 Terraform
- name: Terraform Plan               # 規劃變更
- name: Terraform Apply              # 套用變更
- name: Save Terraform state         # 儲存狀態到 Cache
```

#### Step 6: Deploy to Azure Static Web Apps
```yaml
- name: Deploy to Azure Static Web Apps
  uses: Azure/static-web-apps-deploy@v1
  with:
    azure_static_web_apps_api_token: ${{ steps.swa_token.outputs.swa_token }}
    app_location: "ppt-addin"
    skip_app_build: true
    skip_api_build: true
```

### Job 3: skip-deployment

**條件**: `needs.check-release.outputs.has_ppt_asset == 'false'`

**功能**: 顯示跳過部署的原因和建議操作

## 必要的設定

### GitHub Secrets

在 repository 的 Settings → Secrets and variables → Actions 中設定：

```
Secrets:
├── AZURE_CLIENT_ID          # Azure Service Principal Client ID
├── AZURE_TENANT_ID          # Azure Tenant ID
└── AZURE_SUBSCRIPTION_ID    # Azure Subscription ID
```

### GitHub Variables

在 repository 的 Settings → Secrets and variables → Actions → Variables 中設定：

```
Variables:
├── CODENAME              # 專案代號 (例如: pptcloud)
├── AZURE_LOCATION        # Azure 資源位置 (例如: eastasia)
├── SWA_LOCATION          # Static Web App 位置 (例如: eastasia)
├── ENVIRONMENT           # 環境名稱 (例如: production)
├── SKU_TIER              # SKU 層級 (例如: Free)
└── SKU_SIZE              # SKU 大小 (例如: Free)
```

### Environment 設定

在 repository 的 Settings → Environments 中建立 `production-ppt` 環境：

```
Environment: production-ppt
├── Protection rules (optional)
│   ├── Required reviewers
│   └── Wait timer
└── Environment secrets (if needed)
```

## 部署驗證

### 自動部署成功標誌

#### 1. GitHub Actions 狀態
```
Actions → Deploy PPT Addin to Azure Static Webapp
└─> 最新執行顯示 ✅ 綠色勾勾
```

#### 2. Release 頁面
```
Releases → 最新 Release
└─> 顯示 "Deployed to production-ppt" 標籤
```

#### 3. Azure Portal
```
Static Web Apps → 檢查最新部署
└─> Status: Ready
└─> Updated: [最新時間]
```

### 測試部署結果

```bash
# 1. 取得 Static Web App URL (從 Terraform output 或 Azure Portal)
SWA_URL="https://your-app.azurestaticapps.net"

# 2. 測試檔案可存取
curl -I "$SWA_URL/index.html"
curl -I "$SWA_URL/taskpane-built.html"
curl -I "$SWA_URL/taskpane.js"
curl -I "$SWA_URL/icons-data.*.js"
curl -I "$SWA_URL/manifest.xml"

# 3. 檢查重導向
curl -L "$SWA_URL/" | grep "taskpane-built.html"

# 4. 在 PowerPoint 中測試
# - 更新 manifest.xml 的 URL
# - 側載 manifest.xml
# - 測試 Add-in 功能
```

## 常見問題與解決方案

### 問題 1: 部署被跳過

**現象**:
```
⚠️ Deployment Skipped
PowerPoint add-in asset not found in release
```

**原因**:
- Release 中沒有 `cloud-architect-kit-powerpoint-addin.zip` 檔案
- 檔案名稱不符合預期
- Release 是 draft 狀態

**解決方案**:
```bash
# 1. 檢查 Release 資產
gh release view v202511230630 --json assets

# 2. 確認檔案存在
gh release view v202511230630 --json assets | jq -r '.assets[].name'

# 3. 如果缺少，重新執行 build-and-release.yml
gh workflow run build-and-release.yml
```

### 問題 2: Terraform State 衝突

**現象**:
```
Error: State lock conflict
```

**原因**:
- 多個部署同時執行
- 前一次部署未完成

**解決方案**:
```yaml
# 在 workflow 中加入 concurrency 控制
concurrency:
  group: deploy-ppt-${{ vars.CODENAME }}
  cancel-in-progress: false
```

### 問題 3: Azure 認證失敗

**現象**:
```
Error: Failed to authenticate with Azure
```

**原因**:
- Secrets 未設定或過期
- Service Principal 權限不足

**解決方案**:
```bash
# 1. 檢查 Service Principal
az ad sp show --id $AZURE_CLIENT_ID

# 2. 檢查權限
az role assignment list --assignee $AZURE_CLIENT_ID

# 3. 重新設定 Secrets
# Settings → Secrets and variables → Actions → Update secrets
```

### 問題 4: 部署檔案缺失

**現象**:
```
Failed to find a default file in the app artifacts folder
```

**原因**:
- index.html 未正確建立
- ZIP 檔案內容不完整

**解決方案**:
- ✅ 已在工作流程中加入 index.html 建立步驟
- 檢查 ZIP 檔案內容：`unzip -l cloud-architect-kit-powerpoint-addin.zip`

## 監控與維護

### GitHub Actions 監控

```bash
# 查看最近的執行
gh run list --workflow=deploy-ppt-addin-to-azure.yml --limit 10

# 查看特定執行的日誌
gh run view <run-id> --log

# 重新執行失敗的 workflow
gh run rerun <run-id>
```

### Azure 監控

```bash
# 使用 Azure CLI 檢查 Static Web App
az staticwebapp show \
  --name <app-name> \
  --resource-group <rg-name>

# 檢查最新部署
az staticwebapp show \
  --name <app-name> \
  --resource-group <rg-name> \
  --query "defaultHostname"
```

### Cache 管理

```bash
# 查看 Terraform state cache
gh cache list --key terraform-state-ppt

# 刪除過時的 cache (如果需要強制重建)
gh cache delete <cache-id>
```

## 部署時程

### 預期執行時間

```
build-and-release.yml:        ~5-10 分鐘
  ├─ 下載圖示                 ~1 分鐘
  ├─ 預建置圖示               ~1 分鐘
  ├─ 建置 plugins             ~2 分鐘
  └─ 建立 Release             ~1 分鐘

deploy-ppt-addin-to-azure.yml: ~3-5 分鐘
  ├─ 檢查 Release             ~10 秒
  ├─ 下載 ZIP                 ~10 秒
  ├─ Terraform 部署           ~1-2 分鐘
  └─ Static Web App 部署      ~1-2 分鐘

總計: ~8-15 分鐘
```

### 觸發頻率建議

- **自動觸發**: 每次 Release 都會自動部署
- **手動觸發**: 
  - 測試環境: 隨時可觸發
  - 生產環境: 建議在低流量時段

## 最佳實踐

### 1. 使用環境保護

```yaml
environment: production-ppt
```

**設定保護規則**:
- Required reviewers: 需要審核才能部署
- Wait timer: 延遲部署時間
- Branch protection: 限制觸發分支

### 2. 版本管理

```bash
# Release tag 格式: v{timestamp}
v202511230630
  │    │ │ │
  │    │ │ └─ 分鐘 (30)
  │    │ └─── 小時 (06)
  │    └───── 日期 (23)
  └────────── 年月 (202511)
```

### 3. 回滾策略

```bash
# 如果新版本有問題，重新部署舊版本
gh workflow run deploy-ppt-addin-to-azure.yml \
  -f release_tag=v202511220800
```

### 4. 通知設定

考慮加入 Slack 或 Email 通知：
```yaml
- name: Notify deployment result
  if: always()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Deployment ${{ job.status }}: ${{ needs.check-release.outputs.release_tag }}"
      }
```

## 文件參考

- [GitHub Actions - Events](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#release)
- [Azure Static Web Apps Deploy Action](https://github.com/Azure/static-web-apps-deploy)
- [Terraform with GitHub Actions](https://developer.hashicorp.com/terraform/tutorials/automation/github-actions)

## 結論

### 現況確認
✅ **工作流程已完整配置**
- `on: release: types: [published]` 自動觸發已設定
- Release 檢查邏輯完整
- Terraform state 管理完善
- 部署步驟完整

### 執行流程
1. **建置** → `build-and-release.yml` 建立 Release
2. **觸發** → Release published 事件自動觸發
3. **檢查** → 確認 PowerPoint add-in ZIP 存在
4. **部署** → 自動部署到 Azure Static Web Apps
5. **完成** → 驗證部署成功

### 無需額外修改
當前配置已經完整支援自動部署，無需進行任何修改。

### 下一步
1. 設定必要的 Secrets 和 Variables
2. 建立 `production-ppt` 環境（可選）
3. 執行第一次手動觸發測試
4. 確認自動觸發正常運作
