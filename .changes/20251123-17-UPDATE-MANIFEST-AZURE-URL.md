# 20251123-17-UPDATE-MANIFEST-AZURE-URL

## 異動日期
2025-11-23

## 異動目的
在部署 PowerPoint Add-in 到 Azure Static Web Apps 時，自動更新 manifest.xml 中的主機位置，使用 Terraform 部署後取得的實際 Azure URL，而非 localhost 開發位址。

## 問題描述

### 原始狀況
PowerPoint Add-in 的 `manifest.xml` 檔案包含 9 處 `https://localhost:3000` 的參考：

```xml
<!-- Line 12-13: Icon URLs -->
<IconUrl DefaultValue="https://localhost:3000/assets/icon-32.png"/>
<HighResolutionIconUrl DefaultValue="https://localhost:3000/assets/icon-64.png"/>

<!-- Line 16: App Domain -->
<AppDomain>https://localhost:3000</AppDomain>

<!-- Line 22: Source Location -->
<SourceLocation DefaultValue="https://localhost:3000/taskpane-built.html"/>

<!-- Line 68-70: Resource Images -->
<bt:Image id="Icon.16x16" DefaultValue="https://localhost:3000/assets/icon-16.png"/>
<bt:Image id="Icon.32x32" DefaultValue="https://localhost:3000/assets/icon-32.png"/>
<bt:Image id="Icon.80x80" DefaultValue="https://localhost:3000/assets/icon-80.png"/>

<!-- Line 74-75: Resource URLs -->
<bt:Url id="Commands.Url" DefaultValue="https://localhost:3000/commands.html"/>
<bt:Url id="Taskpane.Url" DefaultValue="https://localhost:3000/taskpane-built.html"/>
```

### 問題影響
- 部署到 Azure 後，manifest.xml 仍指向 localhost
- Add-in 無法在生產環境中正常載入
- 需要手動更新 manifest.xml 才能使用

## 解決方案

### 新增步驟：自動更新 manifest.xml

在 Terraform 部署完成並取得 Static Web App URL 後，自動更新 manifest.xml 中的所有 localhost URL。

**位置**: `.github/workflows/deploy-ppt-addin-to-azure.yml`

**插入位置**: 在 "Get Static Web App name" 之後，"Deploy to Azure Static Web Apps" 之前

```yaml
- name: Update manifest.xml with Azure URL
  run: |
    SWA_URL="https://${{ steps.swa_name.outputs.swa_url }}"
    echo "Updating manifest.xml with Static Web App URL: $SWA_URL"
    
    # Update all localhost:3000 URLs to the actual Azure URL
    sed -i "s|https://localhost:3000|$SWA_URL|g" ppt-addin/manifest.xml
    
    # Verify the update
    echo "Updated manifest.xml URLs:"
    grep -E "(IconUrl|SourceLocation|AppDomain)" ppt-addin/manifest.xml | head -5
```

## 技術細節

### 執行流程

```
1. Terraform Apply
   └─> 建立 Azure Static Web App
       │
2. Get Static Web App name (現有步驟)
   ├─> SWA_NAME=$(terraform output -raw static_web_app_name)
   └─> SWA_URL=$(terraform output -raw static_web_app_default_hostname)
       │
3. Update manifest.xml (新增步驟) ✨
   ├─> 取得 Azure URL: https://xxx.azurestaticapps.net
   ├─> 替換所有 localhost:3000 URL
   └─> 驗證更新結果
       │
4. Deploy to Azure Static Web Apps
   └─> 部署包含更新後 manifest.xml 的 add-in
```

### sed 命令說明

```bash
sed -i "s|https://localhost:3000|$SWA_URL|g" ppt-addin/manifest.xml
```

**參數說明**:
- `-i`: In-place 編輯，直接修改檔案
- `s|old|new|g`: 替換命令
  - `s`: substitute (替換)
  - `|`: 分隔符號（使用 `|` 而非 `/` 避免 URL 中的 `/` 衝突）
  - `g`: global (全域替換，所有出現的地方)

**替換範圍**:
```
https://localhost:3000/assets/icon-32.png
→ https://xxx.azurestaticapps.net/assets/icon-32.png

https://localhost:3000/taskpane-built.html
→ https://xxx.azurestaticapps.net/taskpane-built.html

https://localhost:3000/commands.html
→ https://xxx.azurestaticapps.net/commands.html
```

### 替換的 URL 清單

| 位置 | 原始 URL | 用途 |
|-----|---------|------|
| Line 12 | `https://localhost:3000/assets/icon-32.png` | 標準圖示 |
| Line 13 | `https://localhost:3000/assets/icon-64.png` | 高解析度圖示 |
| Line 16 | `https://localhost:3000` | App Domain |
| Line 22 | `https://localhost:3000/taskpane-built.html` | 預設來源位置 |
| Line 68 | `https://localhost:3000/assets/icon-16.png` | 16x16 圖示資源 |
| Line 69 | `https://localhost:3000/assets/icon-32.png` | 32x32 圖示資源 |
| Line 70 | `https://localhost:3000/assets/icon-80.png` | 80x80 圖示資源 |
| Line 74 | `https://localhost:3000/commands.html` | Commands URL |
| Line 75 | `https://localhost:3000/taskpane-built.html` | Taskpane URL |

**總計**: 9 處 URL 會被自動更新

## 驗證機制

### 步驟輸出

```bash
Updating manifest.xml with Static Web App URL: https://xxx.azurestaticapps.net
Updated manifest.xml URLs:
  <IconUrl DefaultValue="https://xxx.azurestaticapps.net/assets/icon-32.png"/>
  <HighResolutionIconUrl DefaultValue="https://xxx.azurestaticapps.net/assets/icon-64.png"/>
  <AppDomain>https://xxx.azurestaticapps.net</AppDomain>
  <SourceLocation DefaultValue="https://xxx.azurestaticapps.net/taskpane-built.html"/>
```

### 檢查方法

#### 1. GitHub Actions Log
```
Actions → Deploy PPT Addin to Azure → 展開 "Update manifest.xml with Azure URL"
→ 檢查輸出的 URL 是否正確
```

#### 2. 下載部署後的檔案
```bash
# 從 Azure Static Web App 下載 manifest.xml
curl https://xxx.azurestaticapps.net/manifest.xml -o manifest.xml

# 檢查 URL
grep "localhost" manifest.xml
# 應該沒有任何結果

grep "azurestaticapps.net" manifest.xml
# 應該顯示 9 處 Azure URL
```

#### 3. PowerPoint 中測試
```
1. 下載部署後的 manifest.xml
2. 在 PowerPoint 中側載此 manifest
3. 檢查 Add-in 是否正常載入
4. 驗證所有功能正常運作
```

## 部署後的 manifest.xml

### 更新後的內容範例

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OfficeApp xmlns="http://schemas.microsoft.com/office/appforoffice/1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bt="http://schemas.microsoft.com/office/officeappbasictypes/1.0"
  xmlns:ov="http://schemas.microsoft.com/office/taskpaneappversionoverrides" xsi:type="TaskPaneApp">
  <Id>12345678-1234-1234-1234-123456789abc</Id>
  <Version>1.0.0.0</Version>
  <ProviderName>Cloud Architect</ProviderName>
  <DefaultLocale>en-US</DefaultLocale>
  <DisplayName DefaultValue="Cloud Architect Kits"/>
  <Description DefaultValue="Insert cloud architecture and technology icons into your presentations"/>
  <!-- ✨ 已更新為 Azure URL -->
  <IconUrl DefaultValue="https://xxx.azurestaticapps.net/assets/icon-32.png"/>
  <HighResolutionIconUrl DefaultValue="https://xxx.azurestaticapps.net/assets/icon-64.png"/>
  <SupportUrl DefaultValue="https://github.com"/>
  <AppDomains>
    <!-- ✨ 已更新為 Azure URL -->
    <AppDomain>https://xxx.azurestaticapps.net</AppDomain>
  </AppDomains>
  <Hosts>
    <Host Name="Presentation"/>
  </Hosts>
  <DefaultSettings>
    <!-- ✨ 已更新為 Azure URL -->
    <SourceLocation DefaultValue="https://xxx.azurestaticapps.net/taskpane-built.html"/>
  </DefaultSettings>
  <Permissions>ReadWriteDocument</Permissions>
  <VersionOverrides xmlns="http://schemas.microsoft.com/office/taskpaneappversionoverrides" xsi:type="VersionOverridesV1_0">
    <!-- ... -->
    <Resources>
      <bt:Images>
        <!-- ✨ 已更新為 Azure URL -->
        <bt:Image id="Icon.16x16" DefaultValue="https://xxx.azurestaticapps.net/assets/icon-16.png"/>
        <bt:Image id="Icon.32x32" DefaultValue="https://xxx.azurestaticapps.net/assets/icon-32.png"/>
        <bt:Image id="Icon.80x80" DefaultValue="https://xxx.azurestaticapps.net/assets/icon-80.png"/>
      </bt:Images>
      <bt:Urls>
        <bt:Url id="GetStarted.LearnMoreUrl" DefaultValue="https://go.microsoft.com/fwlink/?LinkId=276812"/>
        <!-- ✨ 已更新為 Azure URL -->
        <bt:Url id="Commands.Url" DefaultValue="https://xxx.azurestaticapps.net/commands.html"/>
        <bt:Url id="Taskpane.Url" DefaultValue="https://xxx.azurestaticapps.net/taskpane-built.html"/>
      </bt:Urls>
      <!-- ... -->
    </Resources>
  </VersionOverrides>
</OfficeApp>
```

## 本地開發 vs 生產環境

### 開發環境 (src/powerpoint/add-in/manifest.xml)

```xml
<!-- 保持 localhost 以便本地測試 -->
<IconUrl DefaultValue="https://localhost:3000/assets/icon-32.png"/>
<SourceLocation DefaultValue="https://localhost:3000/taskpane-built.html"/>
```

**用途**:
- 本地開發和測試
- npm run serve 時使用
- 不受部署影響

### 生產環境 (部署到 Azure 的 manifest.xml)

```xml
<!-- 自動更新為 Azure URL -->
<IconUrl DefaultValue="https://xxx.azurestaticapps.net/assets/icon-32.png"/>
<SourceLocation DefaultValue="https://xxx.azurestaticapps.net/taskpane-built.html"/>
```

**特點**:
- 自動從 Terraform output 取得 URL
- 每次部署都會更新
- 不需要手動維護

## 使用說明

### 開發者工作流程

#### 1. 本地開發
```bash
cd src/powerpoint/add-in
npm run serve

# manifest.xml 使用 localhost:3000
# 在 PowerPoint 中側載本地 manifest.xml 測試
```

#### 2. 建置與發布
```bash
# 觸發建置
gh workflow run build-and-release.yml

# 自動建立 Release
# 自動觸發 deploy-ppt-addin-to-azure.yml
```

#### 3. 自動部署 (無需人工介入)
```
1. Terraform 建立/更新 Azure 資源
2. 取得 Static Web App URL ✅
3. 自動更新 manifest.xml ✨ (新增)
4. 部署到 Azure
5. manifest.xml 已包含正確的 Azure URL
```

#### 4. 使用生產環境 Add-in
```bash
# 1. 從 Azure 下載 manifest.xml
curl https://xxx.azurestaticapps.net/manifest.xml -o manifest-prod.xml

# 2. 在 PowerPoint 中側載
# Insert → My Add-ins → Upload My Add-in → 選擇 manifest-prod.xml

# 3. Add-in 自動從 Azure 載入
```

## 錯誤處理

### 問題 1: sed 命令在 macOS 上失敗

**現象**:
```
sed: 1: "ppt-addin/manifest.xml": invalid command code p
```

**原因**: macOS 的 sed 與 Linux sed 語法不同

**解決方案**: 
✅ 在 GitHub Actions (Ubuntu) 上運行，不會有此問題
✅ 如需本地測試，使用 `sed -i ''` (macOS)

### 問題 2: URL 未正確替換

**檢查步驟**:
```bash
# 1. 檢查 Terraform output
terraform output static_web_app_default_hostname

# 2. 檢查 workflow 變數
echo "${{ steps.swa_name.outputs.swa_url }}"

# 3. 檢查 manifest.xml
grep "localhost" ppt-addin/manifest.xml
```

### 問題 3: 部分 URL 未更新

**原因**: manifest.xml 中有不同格式的 localhost URL

**檢查方法**:
```bash
# 搜尋所有 localhost 變體
grep -i "localhost" ppt-addin/manifest.xml
grep "127.0.0.1" ppt-addin/manifest.xml
```

**解決方案**: 確保 manifest.xml 統一使用 `https://localhost:3000` 格式

## 安全考量

### 1. URL 驗證

建議加入 URL 驗證步驟：
```yaml
- name: Validate Azure URL
  run: |
    SWA_URL="${{ steps.swa_name.outputs.swa_url }}"
    if [[ ! "$SWA_URL" =~ ^[a-zA-Z0-9-]+\.azurestaticapps\.net$ ]]; then
      echo "❌ Invalid Azure Static Web App URL: $SWA_URL"
      exit 1
    fi
    echo "✅ Valid Azure URL: $SWA_URL"
```

### 2. 備份原始 manifest

```yaml
- name: Update manifest.xml with Azure URL
  run: |
    # 備份原始 manifest
    cp ppt-addin/manifest.xml ppt-addin/manifest.xml.backup
    
    # 執行更新
    SWA_URL="https://${{ steps.swa_name.outputs.swa_url }}"
    sed -i "s|https://localhost:3000|$SWA_URL|g" ppt-addin/manifest.xml
```

## 相關文件

### Office Add-in Manifest Schema
- [Office Add-ins XML manifest](https://docs.microsoft.com/en-us/office/dev/add-ins/develop/add-in-manifests)
- [Manifest element reference](https://docs.microsoft.com/en-us/office/dev/add-ins/develop/manifest-element-reference)

### Azure Static Web Apps
- [Custom domains](https://docs.microsoft.com/en-us/azure/static-web-apps/custom-domain)
- [Deployment tokens](https://docs.microsoft.com/en-us/azure/static-web-apps/deployment-token-management)

## 檔案變更統計

```
.github/workflows/deploy-ppt-addin-to-azure.yml | 12 ++++++++++++
1 file changed, 12 insertions(+)
```

## 測試清單

部署後驗證：
- [ ] 檢查 workflow log，確認 URL 更新成功
- [ ] 下載部署後的 manifest.xml
- [ ] 驗證所有 9 處 URL 都已更新為 Azure URL
- [ ] 確認沒有殘留的 localhost 參考
- [ ] 在 PowerPoint 中側載 manifest.xml
- [ ] 測試 Add-in 載入和運作
- [ ] 驗證圖示正確顯示
- [ ] 測試插入圖示功能

## 結論

### 主要改進
- ✅ 自動化 manifest.xml URL 更新
- ✅ 無需手動編輯設定檔
- ✅ 確保部署後立即可用
- ✅ 支援多環境部署

### 效益
1. **自動化**: 完全自動更新，無需人工介入
2. **準確性**: 直接從 Terraform output 取得 URL，避免錯誤
3. **可維護性**: 一次設定，每次部署自動套用
4. **開發友善**: 本地開發不受影響

### 工作流程完整性
```
建置 → 發布 Release → 自動部署 → 更新 manifest → 部署到 Azure → 即可使用 ✅
```

現在 PowerPoint Add-in 部署後，manifest.xml 會自動包含正確的 Azure URL，無需任何手動調整！
