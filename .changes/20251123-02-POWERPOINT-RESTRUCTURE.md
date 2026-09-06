# PowerPoint Cloud Architect Add-in 專案重組

**日期:** 2025-11-23  
**類型:** 專案重構

## 概述

重新組織 PowerPoint Cloud Architect Add-in 的專案結構，將 Terraform 基礎設施和 Add-in 原始碼分離到不同的目錄。

## 變更前後對照

### 舊結構
```
src/powerpoint-cloudarchitect/
├── README.md
├── INSTALL.md
├── QUICKSTART.md
├── manifest.xml
├── package.json
├── taskpane.html
├── taskpane.js
├── build.js
├── deploy.sh
├── staticwebapp.config.json
├── assets/
├── icons/
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── README.md
└── ... (其他檔案)
```

### 新結構
```
src/powerpoint-cloudarchitect/
├── README.md              ← 保留在根目錄
├── INSTALL.md             ← 保留在根目錄
├── add-in/                ← 新增：Add-in 原始碼目錄
│   ├── manifest.xml
│   ├── package.json
│   ├── taskpane.html
│   ├── taskpane.js
│   ├── build.js
│   ├── deploy.sh
│   ├── staticwebapp.config.json
│   ├── QUICKSTART.md     ← 移至 add-in 目錄
│   ├── assets/
│   ├── icons/
│   └── ... (其他檔案)
└── terraform/             ← 保持在根目錄
    ├── main.tf
    ├── variables.tf
    ├── outputs.tf
    └── README.md
```

## 變更內容

### 1. 目錄結構調整

#### 新增目錄
- `add-in/` - 包含所有 PowerPoint Add-in 相關檔案

#### 移動檔案
移動至 `add-in/` 目錄：
- manifest.xml
- package.json
- taskpane.html
- taskpane.js
- commands.html
- process-icons.js
- build.js
- deploy.sh
- staticwebapp.config.json
- QUICKSTART.md
- assets/
- icons/
- 所有產生的檔案 (taskpane-built.html, icons-data.*.js 等)

#### 保留位置
在根目錄保留：
- README.md (專案總覽)
- INSTALL.md (安裝指南)
- terraform/ (基礎設施)

### 2. 文件更新

#### README.md
- ✅ 新增專案結構說明
- ✅ 更新所有路徑參照 (`add-in/manifest.xml`)
- ✅ 調整快速開始指令 (`cd add-in`)
- ✅ 更新 GitHub Actions 設定範例

#### INSTALL.md
- ✅ 新增專案結構圖
- ✅ 更新所有命令路徑
  - `cd add-in` 進入 Add-in 目錄
  - `cd ../terraform` 進入 Terraform 目錄
- ✅ 調整檔案複製指令
  - `cp -r ../../figma-cloudarchitect/icons ./icons`

#### add-in/QUICKSTART.md
- ✅ 更新路徑說明
- ✅ 調整相對路徑參照
  - `../README.md`
  - `../INSTALL.md`
  - `../terraform/`

#### add-in/deploy.sh
- ✅ 更新圖示複製路徑
  - `../../figma-cloudarchitect/icons`
- ✅ 調整 Terraform 目錄路徑
  - `cd ../terraform`

### 3. GitHub Actions 更新

#### .github/workflows/deploy-powerpoint-addin.yml
- ✅ 更新圖示複製路徑
  - `src/powerpoint-cloudarchitect/add-in/icons`
- ✅ 調整建置路徑
  - `cd src/powerpoint-cloudarchitect/add-in`
- ✅ 更新 artifact 上傳路徑
  - `path: src/powerpoint-cloudarchitect/add-in/`
- ✅ 調整觸發路徑
  - `src/powerpoint-cloudarchitect/add-in/**`
  - `src/powerpoint-cloudarchitect/terraform/**`

### 4. 文件記錄更新

#### docs/20251123-01-POWERPOINT-ADDIN.md
- ✅ 更新專案結構說明
- ✅ 調整部署流程路徑

## 變更原因

### 1. 職責分離 (Separation of Concerns)
- **Add-in 程式碼** (`add-in/`): 應用程式邏輯、UI、建置腳本
- **基礎設施** (`terraform/`): Azure 資源定義、部署設定
- **文件** (根目錄): 專案說明、安裝指南

### 2. 更清晰的專案結構
- 一眼就能看出專案包含哪些主要元件
- 減少根目錄的檔案數量
- 更容易理解專案組織

### 3. 更好的可維護性
- Add-in 相關變更集中在 `add-in/` 目錄
- Infrastructure 變更集中在 `terraform/` 目錄
- 減少檔案衝突的可能性

### 4. 符合業界慣例
- 前端專案通常有獨立的 `src/` 或應用程式目錄
- Infrastructure as Code 通常獨立於應用程式碼
- 文件在根目錄便於快速查閱

## 影響範圍

### 開發人員
需要更新本地路徑：
```bash
# 舊方式
cd src/powerpoint-cloudarchitect
npm run build

# 新方式
cd src/powerpoint-cloudarchitect/add-in
npm run build
```

### CI/CD Pipeline
- ✅ GitHub Actions workflow 已更新
- ✅ 所有建置路徑已調整

### 文件連結
- ✅ 所有內部文件連結已更新
- ✅ 相對路徑已調整

## 驗證

### 檔案完整性檢查
執行驗證腳本：
```bash
./verify-powerpoint-project-v2.sh
```

結果：
```
✓ All checks passed!
Icons: 4323 SVG files
taskpane-built.html: 26M
icons-data.js: 26M
```

### 功能測試
- ✅ Add-in 建置正常
- ✅ 圖示資料完整
- ✅ 所有腳本可執行
- ✅ 文件連結有效

## 遷移步驟 (針對現有環境)

如果你有本地的工作副本，請執行以下步驟遷移：

### 1. 備份現有工作
```bash
cd src/powerpoint-cloudarchitect
cp -r . ../powerpoint-cloudarchitect-backup
```

### 2. 拉取最新程式碼
```bash
git pull origin main
```

### 3. 清理舊建置產物
```bash
cd add-in
rm -rf node_modules icons icons-data.*.js taskpane-*.html
```

### 4. 重新建置
```bash
./deploy.sh
```

## 最佳實踐建議

### 開發工作流程

1. **開發 Add-in**
   ```bash
   cd src/powerpoint-cloudarchitect/add-in
   npm run build
   npm run serve
   ```

2. **管理基礎設施**
   ```bash
   cd src/powerpoint-cloudarchitect/terraform
   terraform plan
   terraform apply
   ```

3. **查看文件**
   ```bash
   cd src/powerpoint-cloudarchitect
   cat README.md
   cat INSTALL.md
   ```

### Git 工作流程

建議 commit 訊息格式：
```
feat(add-in): 新增功能說明
fix(terraform): 修正基礎設施問題
docs: 更新文件
```

使用路徑過濾 commit:
```bash
# 只看 add-in 的變更
git log -- add-in/

# 只看 terraform 的變更
git log -- terraform/
```

## 相關文件

- [專案建立記錄](20251123-01-POWERPOINT-ADDIN.md)
- [專案 README](../src/powerpoint-cloudarchitect/README.md)
- [安裝指南](../src/powerpoint-cloudarchitect/INSTALL.md)
- [快速上手](../src/powerpoint-cloudarchitect/add-in/QUICKSTART.md)

## 總結

重組後的專案結構更加清晰、易於維護：

✅ **職責明確**: Add-in 程式碼和基礎設施分離  
✅ **結構清楚**: 一目了然的目錄組織  
✅ **易於維護**: 變更影響範圍明確  
✅ **符合慣例**: 遵循業界最佳實踐  
✅ **文件完整**: 所有路徑和說明已更新  
✅ **功能驗證**: 建置和執行正常  

專案已準備好繼續開發和部署！
