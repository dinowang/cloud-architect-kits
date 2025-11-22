# Figma Azure Icons Plugin - 專案建立紀錄

## 專案概述

建立了一個 Figma plugin，讓使用者可以在 Figma 畫布上快速搜尋並插入 Azure 資源圖示。

## 功能特色

- ✅ 從 Microsoft 官方來源下載 661 個 Azure 服務圖示
- ✅ 提供關鍵字搜尋功能（可搜尋服務名稱或類別）
- ✅ 圖示縮圖以 32x32 大小顯示，每排 10 個
- ✅ 插入畫布時預設為 64x64 大小
- ✅ 所有圖示內嵌於 plugin，無需網路連線

## 技術架構

### 檔案結構

```
figma-azure/
├── manifest.json          # Figma plugin 設定檔
├── src/
│   └── code.ts           # Plugin 後端程式碼（TypeScript）
├── ui.html               # UI 介面範本
├── ui-built.html         # 建置後的 UI（內嵌圖示資料）
├── process-icons.js      # 處理圖示的 Node.js 腳本
├── build.js              # 建置 UI 的 Node.js 腳本
├── icons/                # 處理後的圖示檔案（自動生成）
├── icons.json            # 圖示索引資料（自動生成）
└── azure-icons/          # 下載的原始圖示（自動生成）
```

### 建置流程

1. **下載圖示**：從 Microsoft Learn 下載官方 Azure Architecture Icons ZIP 檔
2. **處理圖示**：`process-icons.js` 掃描所有 SVG 檔案，建立索引並重新命名
3. **建置 UI**：`build.js` 將所有圖示轉為 Base64 並內嵌到 HTML 中
4. **編譯程式碼**：使用 TypeScript 編譯器編譯 plugin 主程式

### 核心技術

- **Figma Plugin API**：使用 `createNodeFromSvg()` 將 SVG 插入畫布
- **Base64 編碼**：所有圖示以 Base64 格式內嵌，避免外部檔案依賴
- **TypeScript**：提供型別安全的開發體驗
- **純 JavaScript UI**：UI 不依賴任何框架，保持輕量

## 關鍵實作細節

### 1. 圖示處理 (process-icons.js)

- 遞迴掃描所有子目錄找出 SVG 檔案
- 從檔名提取服務名稱（移除數字前綴）
- 保留類別資訊（來自目錄名稱）
- 重新命名為連續數字（0.svg, 1.svg...）

### 2. UI 建置 (build.js)

- 讀取所有 SVG 檔案內容
- 轉換為 Base64 編碼
- 將資料以 JSON 格式注入到 HTML 模板中
- 最終 HTML 檔案約 2MB（包含所有圖示）

### 3. Plugin 主程式 (code.ts)

```typescript
figma.showUI(__html__, { width: 640, height: 480 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'insert-icon') {
    const { svgData, name } = msg;
    const node = figma.createNodeFromSvg(svgData);
    node.resize(64, 64);
    figma.currentPage.appendChild(node);
    figma.viewport.scrollAndZoomIntoView([node]);
    figma.currentPage.selection = [node];
    figma.notify(`Added ${name} icon`);
  }
};
```

### 4. UI 介面 (ui.html)

- **搜尋功能**：即時過濾圖示（比對名稱和類別）
- **網格佈局**：使用 CSS Grid，10 欄自動排列
- **懸停效果**：顯示完整服務名稱的 tooltip
- **點擊事件**：傳送 Base64 解碼後的 SVG 給 plugin 主程式

## 使用方式

### 開發者設定

```bash
# 安裝依賴
npm install

# 建置 plugin
npm run build

# 開發模式（監看 TypeScript 變更）
npm run watch
```

### Figma 中載入 Plugin

1. 開啟 Figma Desktop App
2. 選單：Plugins > Development > Import plugin from manifest...
3. 選擇此專案的 `manifest.json` 檔案

### 使用 Plugin

1. 在 Figma 中執行 plugin
2. 在搜尋框輸入關鍵字（如 "storage", "virtual", "cosmos"）
3. 點擊圖示即可插入到畫布

## 圖示來源

- **官方來源**：https://learn.microsoft.com/en-us/azure/architecture/icons/
- **版本**：Azure Public Service Icons V18
- **數量**：661 個圖示
- **格式**：SVG
- **分類**：包含所有 Azure 服務類別（AI/ML、資料庫、網路、運算等）

## 開發考量

### 效能優化

- 圖示預先處理並內嵌，避免執行時讀取檔案
- 使用 CSS Grid 提供高效的響應式佈局
- 搜尋採用簡單的字串比對，速度快

### 使用者體驗

- 搜尋框置頂且 sticky，方便長列表操作
- 懸停放大效果讓小圖示更容易識別
- 插入後自動選取並置中，方便後續操作
- 提供友善的通知訊息

### 維護性

- 建置流程自動化，更新圖示只需重新下載並執行 `npm run build`
- TypeScript 提供型別檢查，減少執行時錯誤
- 模組化的腳本設計，各司其職

## 未來改進方向

1. **分類篩選**：新增類別選單，可按類別過濾圖示
2. **最近使用**：記錄使用者最常用的圖示
3. **批次插入**：支援一次選取多個圖示
4. **顏色客製化**：允許修改圖示顏色
5. **尺寸預設**：記憶使用者偏好的插入尺寸

## 測試狀態

- ✅ 圖示處理腳本正常運作（處理 661 個圖示）
- ✅ UI 建置腳本正常運作（生成 2MB HTML）
- ✅ TypeScript 編譯成功
- ✅ 所有建置檔案生成正確（code.js, ui-built.html, manifest.json）
- ⚠️  需在 Figma Desktop App 中測試實際功能

## 總結

成功建立了一個功能完整的 Figma plugin，提供快速、便利的 Azure 圖示插入體驗。所有技術要求皆已達成，並具備良好的擴充性。
