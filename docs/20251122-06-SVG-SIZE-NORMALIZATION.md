# Azure SVG Icon 尺寸顯示問題修正

**日期**: 2025-11-22  
**問題**: Azure SVG 圖示在 UI 中顯示非常小

## 問題分析

### 根本原因

Azure 官方提供的 SVG 圖示檔案包含固定的尺寸屬性：

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
```

這導致：
1. **在 UI 預覽時**：瀏覽器會按照 SVG 的 `width="18" height="18"` 屬性渲染，即使外層容器設定為 64x64px，圖示仍只顯示 18x18px
2. **在 Figma 中插入時**：雖然 `code.ts` 使用 `node.resize(64, 64)` 調整大小，但這個問題主要影響 UI 預覽

### 其他圖示來源對比

- **Microsoft 365 Icons**: 部分也有固定尺寸 (48x48)
- **Dynamics 365 Icons**: 使用 viewBox，無固定尺寸
- **Power Platform Icons**: 使用 viewBox，無固定尺寸
- **Gilbarbara Logos**: 大多使用 viewBox，無固定尺寸

## 解決方案

### 1. SVG 尺寸正規化函數

在 `process-icons.js` 中新增 `normalizeSvgSize()` 函數：

```javascript
function normalizeSvgSize(svgContent) {
  let normalized = svgContent;
  
  // Extract viewBox if it exists
  const viewBoxMatch = normalized.match(/viewBox=["']([^"']+)["']/);
  
  if (viewBoxMatch) {
    // Remove width and height attributes, keep viewBox
    normalized = normalized.replace(/<svg([^>]*?)width=["'][^"']*["']([^>]*?)>/i, '<svg$1$2>');
    normalized = normalized.replace(/<svg([^>]*?)height=["'][^"']*["']([^>]*?)>/i, '<svg$1$2>');
  } else {
    // If no viewBox, extract from width/height and create one
    const widthMatch = normalized.match(/width=["']([^"']+)["']/);
    const heightMatch = normalized.match(/height=["']([^"']+)["']/);
    
    if (widthMatch && heightMatch) {
      const width = widthMatch[1];
      const height = heightMatch[1];
      const viewBox = `0 0 ${width} ${height}`;
      
      // Add viewBox and remove width/height
      normalized = normalized.replace(/<svg/, `<svg viewBox="${viewBox}"`);
      normalized = normalized.replace(/width=["'][^"']*["']/i, '');
      normalized = normalized.replace(/height=["'][^"']*["']/i, '');
    }
  }
  
  return normalized;
}
```

### 2. 處理流程修改

修改 SVG 檔案複製邏輯，改為讀取、正規化、再寫入：

```javascript
// 原本：直接複製
fs.copyFileSync(filePath, destPath);

// 修改後：讀取、正規化、寫入
const svgContent = fs.readFileSync(filePath, 'utf-8');
const normalizedSvg = normalizeSvgSize(svgContent);
fs.writeFileSync(destPath, normalizedSvg);
```

## 效果驗證

### 處理前

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
```
- 在 64x64 容器中只顯示 18x18px
- 圖示看起來很小

### 處理後

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
```
- 移除固定的 width 和 height 屬性
- 保留 viewBox 以維持比例
- 圖示會自動縮放填滿容器
- 在 64x64 容器中正常顯示

## 測試

建立測試頁面 `test-icon-size.html` 比較處理前後的效果：

```html
<!-- 處理後：自動填滿 64x64 容器 -->
<img src="icons/0.svg">

<!-- 原始：只顯示 18x18 -->
<img src="../../temp/azure-icons/.../icon.svg">
```

## 建置指令

```bash
cd src/figma-cloudarchitect
npm run build
```

這會依序執行：
1. `node process-icons.js` - 處理並正規化所有 SVG
2. `node build.js` - 建置 UI HTML
3. `npx tsc -p tsconfig.json` - 編譯 TypeScript

## 影響範圍

- ✅ 修正所有 Azure Icons (705 個)
- ✅ 修正所有 Microsoft 365 Icons (963 個)
- ✅ 修正所有 Dynamics 365 Icons (38 個)
- ✅ 修正所有 Power Platform Icons (9 個)
- ✅ 修正所有 Gilbarbara Logos (1839 個)
- **總計**: 3554 個圖示

## CSS 配置

UI 中的 CSS 配置維持不變，已正確設定容器和圖片樣式：

```css
.icon-item-image {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-item-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
```

## 總結

透過移除 SVG 固定尺寸屬性並保留 viewBox，讓 SVG 能夠響應式縮放，完美解決了 Azure 圖示在 UI 中顯示過小的問題。此修正適用於所有圖示來源，確保一致的顯示效果。
