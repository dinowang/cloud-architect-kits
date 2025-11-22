# 重構專案為 figma-cloudarchitect

**日期:** 2025-11-22  
**類型:** 重構 / 功能擴充

## 概述

將 `figma-azure` 專案重構為 `figma-cloudarchitect`，擴充圖示來源從單一 Azure 擴展為 5 個來源，並優化 UI 結構以支援多層級組織。

## 主要變更

### 1. 專案重新命名

- **套件名稱**: `figma-azure` → `figma-cloudarchitect`
- **版本號**: `1.0.0` → `2.0.0`
- **Plugin 名稱**: "Azure Icons" → "Cloud Architect Icons"
- **Plugin ID**: `figma-azure` → `figma-cloudarchitect`

### 2. 圖示來源擴充

新增支援 5 個圖示來源，總計 **3,554 個圖示**：

| 來源 | 圖示數量 | 格式 | 位置 |
|------|---------|------|------|
| Gilbarbara | 1,839 | SVG | `temp/gilbarbara-icons/` |
| Microsoft 365 | 963 | SVG | `temp/m365-icons/` |
| Azure | 705 | SVG | `temp/azure-icons/` |
| Dynamics 365 | 38 | SVG | `temp/d365-icons/` |
| Power Platform | 9 | SVG | `temp/powerplatform-icons/` |

**重要**: 只使用 `.svg` 格式，排除所有 `.png` 檔案。

### 3. 圖示資料結構更新

在 `icons.json` 中新增 `source` 欄位：

```json
{
  "id": 0,
  "name": "Virtual Machine",
  "source": "Azure",
  "category": "Compute",
  "file": "0.svg"
}
```

### 4. UI 階層調整

UI 組織結構從原本的兩層改為三層：

**原始結構:**
- Category → Icons

**新結構:**
- **Source** (來源)
  - Category (分類)
    - Icons (圖示)

### 5. 檔案修改清單

#### `package.json`
- 更新套件名稱和版本號

#### `manifest.json`
- 更新 Plugin 名稱和 ID

#### `process-icons.js`
- 完全重寫以支援多來源處理
- 新增 `sources` 配置陣列
- 實作 `normalizeFileName()` 函數統一檔名處理
- 為每個來源自訂分類提取邏輯
- 過濾只處理 `.svg` 檔案

#### `build.js`
- 在圖示資料中保留 `source` 欄位

#### `ui.html`
- 新增 `source-section` 和 `source-header` 樣式
- 重構 JavaScript 邏輯以支援三層結構
- 更新資料組織: `organizedIcons[source][category][]`
- 優化搜尋功能支援來源層級搜尋
- 更新搜尋框提示文字

#### `README.md`
- 更新專案說明和功能清單
- 擴充圖示來源章節，詳列所有來源資訊
- 更新專案結構說明
- 修改使用說明

#### `INSTALL.md`
- 更新建置說明（圖示數量、檔案大小）
- 調整執行 Plugin 的說明
- 更新疑難排解和圖示更新流程
- 補充授權資訊

## 技術細節

### 圖示處理邏輯

```javascript
const sources = [
  {
    name: 'Azure',
    path: path.join(tempDir, 'azure-icons/Azure_Public_Service_Icons/Icons'),
    getCategoryFromPath: (relativePath) => path.dirname(relativePath),
  },
  // ... 其他來源
];
```

每個來源可自訂：
- `name`: 顯示名稱
- `path`: 檔案系統路徑
- `getCategoryFromPath`: 從檔案路徑提取分類的函數

### 檔名正規化

統一處理不同來源的檔名格式：

```javascript
function normalizeFileName(fileName) {
  return fileName
    .replace(/^\d+-icon-service-/, '')  // Azure 格式
    .replace(/_scalable$/, '')          // Microsoft 格式
    .replace(/_/g, ' ')                 // 底線轉空格
    .replace(/-/g, ' ')                 // 連字號轉空格
    .trim();
}
```

### UI 資料結構

```javascript
organizedIcons = {
  "Azure": {
    "Compute": [icon1, icon2, ...],
    "Storage": [icon3, icon4, ...]
  },
  "Microsoft 365": {
    "Teams Purple": [icon5, icon6, ...],
    "SharePoint Teal": [icon7, icon8, ...]
  }
}
```

## 建置結果

執行 `npm run build` 後：

```
Processing Azure...
  Added 705 icons from Azure
Processing Microsoft 365...
  Added 963 icons from Microsoft 365
Processing Dynamics 365...
  Added 38 icons from Dynamics 365
Processing Power Platform...
  Added 9 icons from Power Platform
Processing Gilbarbara...
  Added 1839 icons from Gilbarbara

Total processed: 3554 icons

Icon data file: icons-data.670574b8.js (23.14 MB)
Build complete!
```

## 向下相容性

**不相容變更**:
- Plugin ID 已變更，需要在 Figma 中重新匯入
- 目錄結構變更: `src/figma-azure/` → `src/figma-cloudarchitect/`
- 資料格式變更: `icons.json` 新增 `source` 欄位

## 測試建議

1. 驗證所有來源的圖示都能正確載入
2. 測試搜尋功能（來源、分類、圖示名稱）
3. 確認圖示插入功能正常（64x64px）
4. 檢查 UI 顯示效能（3500+ 圖示）
5. 驗證各來源的分類正確性

## 後續改善建議

1. 考慮加入圖示預覽放大功能
2. 實作我的最愛/常用圖示功能
3. 支援批次插入多個圖示
4. 加入圖示顏色/尺寸自訂選項
5. 優化大量圖示的載入效能（虛擬捲動）

## 檔案清單

### 修改檔案
- `src/figma-cloudarchitect/package.json`
- `src/figma-cloudarchitect/manifest.json`
- `src/figma-cloudarchitect/process-icons.js`
- `src/figma-cloudarchitect/build.js`
- `src/figma-cloudarchitect/ui.html`
- `README.md`
- `INSTALL.md`

### 新增檔案
- `docs/20251122-01-REFACTOR-TO-CLOUDARCHITECT.md` (本文件)

### 產生檔案（建置後）
- `src/figma-cloudarchitect/icons.json`
- `src/figma-cloudarchitect/icons/*.svg` (3554 個檔案)
- `src/figma-cloudarchitect/icons-data.670574b8.js`
- `src/figma-cloudarchitect/ui-built.html`
- `src/figma-cloudarchitect/ui-dev.html`
- `src/figma-cloudarchitect/code.js`
