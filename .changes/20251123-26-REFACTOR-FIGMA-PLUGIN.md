# Figma Plugin Refactoring

**日期**: 2025-11-23  
**序號**: 26  
**目的**: REFACTOR-FIGMA-PLUGIN

## 概述

重構 Figma 插件，使其使用 prebuild/templates 的共用 UI 模板，消除重複代碼並簡化維護。

## 變更內容

### 1. 新增建置腳本

**檔案**: `src/figma/plugin/build-ui.js`

- 從 prebuild/templates 讀取共用模板
- 產生 Figma 專用的平台實作代碼
- 將所有內容合併為單一 HTML 檔案 (standalone)
- 包含內嵌的 CSS、JS 和圖示資料

### 2. 移除舊檔案

刪除以下不再需要的檔案：

- `build.js` - 舊建置腳本
- `ui-dev.html` - 開發版 UI
- `ui-built.html` - 生產版 UI  
- `icons-data.*.js` - 圖示資料 JS
- `icons.json` - 圖示清單
- `icons/` - 圖示目錄

### 3. 更新配置檔案

**package.json**:
```json
"scripts": {
  "build": "node build-ui.js && npx tsc -p tsconfig.json"
}
```

**.gitignore**:
```
node_modules/
ui.html
.DS_Store
*.log
```

**verify-icons.js**:
- 更新路徑指向 `../../prebuild/icons` 和 `../../prebuild/icons.json`

### 4. 更新建置腳本

**scripts/build-and-release.sh**:

- 移除 Step 3 的圖示複製邏輯
- 更新 Step 8 的打包邏輯使用 `ui.html` 而非 `ui-built.html`

### 5. 更新 GitHub Workflow

**.github/workflows/build-and-release.yml**:

- 更新 Prepare distribution 步驟使用 `ui.html`
- 移除對 `ui-built.html` 的引用

## 技術實作

### 平台專用代碼

```javascript
function handleIconClick(icon) {
  const sizeInput = document.getElementById('icon-size');
  const size = parseInt(sizeInput ? sizeInput.value : 64);
  const svgData = atob(icon.svg);
  
  parent.postMessage({ 
    pluginMessage: { 
      type: 'insert-icon',
      svgData: svgData,
      name: icon.name,
      size: size
    } 
  }, '*');
}
```

### CSS 變數

```css
:root {
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --primary-color: #18a0fb;
  --header-bg: #e5f4ff;
  --hover-bg: #e5f4ff;
}
```

## 優點

1. **消除重複**: 不再維護多份相似的 UI 代碼
2. **集中管理**: 所有 UI 改進在 prebuild/templates 統一進行
3. **簡化建置**: 建置腳本更簡潔，專注於平台整合
4. **檔案減少**: Figma 插件目錄更乾淨，只保留必要檔案
5. **加速開發**: 新增或修改功能時只需更新共用模板

## 建置產出

執行 `npm run build` 後產生：

- `ui.html` (26 MB) - 包含所有 CSS、JS 和圖示資料的單一檔案
- `code.js` - TypeScript 編譯後的插件主程式

## 測試結果

✅ 成功建置 Figma 插件 UI  
✅ 檔案大小: 25.97 MB  
✅ 包含所有必要的 HTML、CSS、JS 和圖示資料  
✅ 使用 Figma 風格的 UI (Inter 字體、#18a0fb 主色)

## 後續工作

- PowerPoint 和 Google Slides 插件採用相同的重構模式
- 確保所有平台都能正確使用共用模板
- 持續優化 prebuild/templates 以支援更多平台
