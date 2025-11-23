# 20251123-09-RENAME-TO-CLOUD-ARCHITECT-KIT

## 異動日期
2025-11-23

## 異動目的
統一命名規範，將所有 `cloudarchitect-kit` 改為 `cloud-architect-kit`，使專案名稱更符合標準命名慣例（使用連字符分隔）。

## 異動範圍

### 1. 工作流程檔案 (Workflow)
**檔案**: `.github/workflows/build-and-release.yml`

#### 修改項目
- **Artifact 名稱**: `cloudarchitect-kit-${BRANCH_NAME}` → `cloud-architect-kit-${BRANCH_NAME}`
- **Release 檔案名稱**:
  - `cloudarchitect-kit-figma-plugin.zip` → `cloud-architect-kit-figma-plugin.zip`
  - `cloudarchitect-kit-powerpoint-addin.zip` → `cloud-architect-kit-powerpoint-addin.zip`
- **Release 說明文件**: 更新所有檔案名稱引用

#### 修正內容
同時修正了 "Check for changes in dist" 步驟中的結構問題：
- 原本只還原 3 個 Figma 檔案到 `dist/` 根目錄
- 現在正確還原完整目錄結構 `dist/figma-plugin/` 和 `dist/powerpoint-addin/`
- 包含所有 Figma Plugin 和 PowerPoint Add-in 檔案

### 2. 建置腳本
**檔案**: `scripts/build-and-release.sh`

#### 修改項目
- **壓縮檔名稱**:
  - Line 108: `cloudarchitect-kit-figma-plugin.zip` → `cloud-architect-kit-figma-plugin.zip`
  - Line 109: `cloudarchitect-kit-powerpoint-addin.zip` → `cloud-architect-kit-powerpoint-addin.zip`
- **使用說明**: 更新安裝指示中的檔案名稱

### 3. 文件檔案

#### README.md
- **專案結構圖**: `cloudarchitect-kits/` → `cloud-architect-kits/`

#### src/figma/INSTALL.md
- **安裝指示**: `cloudarchitect-kit-figma-plugin.zip` → `cloud-architect-kit-figma-plugin.zip`

### 4. 實際檔案
**目錄**: `dist/`

#### 重新命名
```bash
cloudarchitect-kit-figma-plugin.zip → cloud-architect-kit-figma-plugin.zip
cloudarchitect-kit-powerpoint-addin.zip → cloud-architect-kit-powerpoint-addin.zip
```

## 影響範圍

### GitHub Actions
- ✅ Artifact 上傳/下載：使用新名稱
- ✅ Release 檔案：使用新名稱
- ✅ Release 說明：更新所有引用

### 本地建置
- ✅ `build-and-release.sh`：產生新檔名
- ✅ 安裝指示：參照新檔名

### 文件
- ✅ 所有說明文件：使用新檔名
- ✅ 安裝指南：參照新檔名

## 測試建議

### 1. GitHub Actions 測試
```bash
# 觸發工作流程
gh workflow run build-and-release.yml

# 檢查產生的 artifacts
# - 名稱應為: cloud-architect-kit-{timestamp}-ci

# 檢查 release 檔案
# - cloud-architect-kit-figma-plugin.zip
# - cloud-architect-kit-powerpoint-addin.zip
```

### 2. 本地建置測試
```bash
# 執行建置腳本
./scripts/build-and-release.sh

# 檢查產生的檔案
ls -lh dist/*.zip
# 應顯示:
# - cloud-architect-kit-figma-plugin.zip
# - cloud-architect-kit-powerpoint-addin.zip
```

### 3. 結構測試
```bash
# 檢查 dist 目錄結構
tree dist/
# 應包含:
# dist/
# ├── figma-plugin/
# │   ├── manifest.json
# │   ├── code.js
# │   └── ui-built.html
# └── powerpoint-addin/
#     ├── manifest.xml
#     ├── taskpane-built.html
#     ├── commands.html
#     ├── staticwebapp.config.json
#     └── assets/
```

## 向後相容性

### 破壞性變更
⚠️ **檔案名稱變更**：使用舊版檔名的腳本或文件需要更新

### 受影響項目
1. **下載腳本**：若有自動化下載腳本，需更新檔名
2. **部署流程**：若依賴檔名的部署腳本需要修改
3. **文件連結**：指向舊檔名的連結需更新

### 建議措施
- 搜尋所有專案中的 `cloudarchitect-kit` 參照
- 更新自動化腳本中的檔名
- 檢查 CI/CD 流程中的相依性

## 檔案變更統計

```
.github/workflows/build-and-release.yml | 42 ++++++++++++++++++++++++++----------------
README.md                               |  2 +-
scripts/build-and-release.sh            |  6 +++---
src/figma/INSTALL.md                    |  2 +-
4 files changed, 31 insertions(+), 21 deletions(-)
```

## 關聯文件
- `.github/workflows/build-and-release.yml`
- `scripts/build-and-release.sh`
- `README.md`
- `src/figma/INSTALL.md`

## 備註

1. **命名一致性**：現在所有檔案都使用 `cloud-architect-kit` 前綴
2. **結構修正**：同時修正了 workflow 中 dist 目錄結構的問題
3. **完整性**：包含 Figma Plugin 和 PowerPoint Add-in 的完整檔案
4. **可維護性**：統一命名提升專案可維護性
