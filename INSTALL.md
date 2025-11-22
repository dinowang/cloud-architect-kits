# 安裝指南

## 系統需求

- Node.js 14 或更高版本
- npm
- Figma Desktop App

## 快速開始

### 方法一：一鍵完整建置（推薦）

```bash
./scripts/run-full-steps.sh
```

此腳本會自動完成以下步驟：
- 下載所有圖示來源（Azure, M365, D365, Entra, Power Platform, Kubernetes, Gilbarbara）
- 安裝依賴套件
- 建置 Plugin
- 產生 distribution 到 `./dist/` 目錄

### 方法二：手動建置

#### 1. 下載圖示來源

```bash
./scripts/download-azure-icons.sh
./scripts/download-m365-icons.sh
./scripts/download-d365-icons.sh
./scripts/download-entra-icons.sh
./scripts/download-powerplatform-icons.sh
./scripts/download-kubernetes-icons.sh
./scripts/download-gilbarbara-icons.sh
```

#### 2. 安裝依賴套件

```bash
cd src/figma-cloudarchitect
npm install
```

#### 3. 建置 Plugin

```bash
npm run build
```

此命令會：
- 處理所有來源的圖示（Azure, M365, D365, Entra, Power Platform, Kubernetes, Gilbarbara）
- 建置 UI 介面（內嵌所有圖示）
- 編譯 TypeScript 程式碼

建置完成後會產生以下檔案：
- `src/figma-cloudarchitect/code.js` - Plugin 主程式
- `src/figma-cloudarchitect/ui-built.html` - UI 介面（約 23MB）
- `src/figma-cloudarchitect/icons/` - 處理後的圖示檔案（僅 SVG）
- `src/figma-cloudarchitect/icons.json` - 圖示索引（包含來源、分類資訊）
- `./dist/` - 完整的 distribution 檔案（使用方法一時）

### 4. 載入到 Figma

1. 開啟 **Figma Desktop App**（注意：必須是桌面版，瀏覽器版無法載入開發中的 plugin）

2. 點選選單：
   ```
   Plugins → Development → Import plugin from manifest...
   ```

3. 選擇檔案：
   - 使用方法一（一鍵建置）：選擇 `./dist/manifest.json`
   - 使用方法二（手動建置）：選擇專案根目錄的 `manifest.json`

4. Plugin 載入成功後，會出現在 Development plugins 清單中

### 5. 執行 Plugin

1. 在 Figma 中，點選：
   ```
   Plugins → Development → Cloud Architect Icons
   ```

2. Plugin 視窗會開啟，顯示所有來源的圖示（依來源和分類組織）

3. 使用搜尋框尋找需要的圖示（可搜尋名稱、來源或分類）

4. 點擊圖示即可插入到畫布上（64x64px）

## 開發模式

如果要修改程式碼，可以使用 watch 模式：

```bash
npm run watch
```

這會監看 TypeScript 檔案的變更並自動編譯。

修改 UI 或圖示後，需要重新執行：

```bash
npm run build
```

## 疑難排解

### 建置失敗

如果建置失敗，請確認：
- Node.js 版本是否符合需求（`node --version`）
- 是否已執行 `npm install`
- `temp/` 目錄下是否有所有圖示來源
- 確認至少有一個圖示來源目錄存在且包含 SVG 檔案

### 無法載入 Plugin

請確認：
- 使用的是 Figma Desktop App（不是瀏覽器版）
- `manifest.json` 路徑是否正確
- `code.js` 和 `ui-built.html` 是否已生成

### 圖示無法顯示

請確認：
- `ui-built.html` 檔案大小約 23MB（包含所有圖示）
- 建置過程沒有錯誤訊息
- 確認 `temp/` 目錄下有所有圖示來源
- 嘗試重新執行 `npm run build`

## 更新圖示

如果需要更新任何圖示來源：

1. 下載新的圖示並解壓到 `temp/` 對應目錄
   - `temp/azure-icons/`
   - `temp/m365-icons/`
   - `temp/d365-icons/`
   - `temp/powerplatform-icons/`
   - `temp/gilbarbara-icons/`

2. 刪除舊的處理結果：
   ```bash
   rm -rf icons icons.json icons-data.*.js
   ```

3. 重新建置：
   ```bash
   npm run build
   ```

4. 在 Figma 中重新載入 Plugin

## 檔案說明

| 檔案 | 說明 |
|------|------|
| `manifest.json` | Figma plugin 設定檔 |
| `src/figma-cloudarchitect/code.ts` | Plugin 主程式（TypeScript）|
| `src/figma-cloudarchitect/ui.html` | UI 介面範本 |
| `src/figma-cloudarchitect/process-icons.js` | 圖示處理腳本（支援多來源）|
| `src/figma-cloudarchitect/build.js` | UI 建置腳本 |
| `src/figma-cloudarchitect/code.js` | 編譯後的主程式 |
| `src/figma-cloudarchitect/ui-built.html` | 建置後的 UI（內嵌所有圖示）|
| `src/figma-cloudarchitect/icons.json` | 圖示索引資料（含來源、分類）|
| `temp/` | 圖示來源目錄 |

## 技術支援

如遇到問題，請檢查：
1. 建置過程的錯誤訊息
2. Figma Desktop App 的 Console（Plugins → Development → Open Console）
3. 專案的 README.md 和文件

## 授權

本專案使用 ISC 授權。
- Azure, Microsoft 365, Dynamics 365, Power Platform 圖示版權屬於 Microsoft
- Gilbarbara logos 遵循其原始授權條款
