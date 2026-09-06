# Figma Azure Icons Plugin - 圖示資料外部化重構

## 修改目的

將原本內嵌在 HTML 中的大量圖示資料（約 2.2MB）分離到獨立的 JavaScript 檔案，並加入檔案 hash 機制以支援 CDN 快取控制。

## 主要變更

### 1. UI 模板調整 (ui.html)

**修改前：**
```javascript
const iconsData = /*ICONS_DATA*/[];

async function loadIcons() {
  allIcons = iconsData;
  renderIcons(allIcons);
}
```

**修改後：**
```javascript
<script src="/*ICONS_JS_PATH*/"></script>
<script>
  async function loadIcons() {
    allIcons = window.iconsData || [];
    renderIcons(allIcons);
  }
</script>
```

**改善點：**
- 圖示資料從外部 JS 檔案載入
- 使用 `window.iconsData` 全域變數接收資料
- HTML 檔案大小從 2.2MB 降至 4KB

### 2. 建置流程重構 (build.js)

#### 新增功能

1. **生成帶 Hash 的 JS 檔案**
   ```javascript
   const iconsJsContent = `window.iconsData = ${JSON.stringify(iconsWithSvg)};`;
   const hash = crypto.createHash('md5').update(iconsJsContent).digest('hex').substring(0, 8);
   const iconsJsFilename = `icons-data.${hash}.js`;
   ```

2. **自動清理舊版本檔案**
   ```javascript
   files.forEach(file => {
     if (file.startsWith('icons-data.') && file.endsWith('.js') && file !== iconsJsFilename) {
       fs.unlinkSync(path.join(rootDir, file));
     }
   });
   ```

3. **雙版本輸出**
   - **開發版 (ui-dev.html)**：引用外部 JS 檔案，方便開發除錯
   - **生產版 (ui-built.html)**：內嵌 JS 內容，符合 Figma 插件限制

#### 建置輸出

```
Loading icons data...
Processing 705 icons...
Generating icons data JS file...
Icons data saved to: icons-data.be7f6047.js
Building HTML files...
Development build: ui-dev.html (references external JS)
Production build: ui-built.html (inline JS)
Icon data file: icons-data.be7f6047.js (2.18 MB)
Build complete!
```

### 3. 檔案結構變化

**建置後檔案：**
```
src/figma-azure/
├── icons-data.be7f6047.js    # 圖示資料 (2.2MB) - 含 hash
├── ui-dev.html               # 開發版 (4KB) - 引用外部 JS
├── ui-built.html             # 生產版 (2.2MB) - 內嵌 JS
└── ...
```

**打包內容（不變）：**
```
dist/figma-azure/
├── manifest.json
├── code.js
└── ui-built.html             # 生產版（內嵌完整資料）
```

## 技術細節

### Hash 機制

- **演算法**：MD5
- **長度**：8 字元（前 8 位）
- **用途**：內容變更時自動產生新檔名，實現快取破壞 (cache busting)

### Figma 插件限制

Figma 插件的 `manifest.json` 設定 `networkAccess.allowedDomains: ["none"]`，表示：
- ❌ 無法從外部 URL 載入資源
- ❌ 無法載入相對路徑的外部 JS 檔案
- ✅ 必須將所有資源內嵌到 HTML 中

因此生產版 (ui-built.html) 仍採用內嵌方式。

### 雙版本策略

| 版本 | 檔案大小 | 載入方式 | 用途 |
|------|---------|---------|------|
| ui-dev.html | 4KB | 引用外部 JS | 開發除錯、快速重建 |
| ui-built.html | 2.2MB | 內嵌 JS | Figma 插件發布 |

## 優勢分析

### 1. 開發體驗提升
- HTML 模板輕量化，開啟速度快
- 圖示資料變更時，HTML 不需重建
- 便於使用瀏覽器 DevTools 除錯

### 2. CDN 友善
- Hash 檔名確保版本唯一性
- 支援長期快取策略（未來若改用 CDN）
- 自動清理舊版本，避免檔案累積

### 3. 建置效率
- 圖示資料僅需處理一次
- 開發版與生產版並行生成
- 清楚區分用途，減少混淆

## 使用方式

### 開發時
```bash
npm run build
# 使用 ui-dev.html + icons-data.{hash}.js
```

### 打包發布
```bash
npm run build
# 使用 ui-built.html（內嵌版本）
```

### 部署到 CDN（未來擴充）

若未來需要支援 CDN 載入，需調整：

1. 修改 `manifest.json` 允許特定網域
   ```json
   "networkAccess": {
     "allowedDomains": ["cdn.example.com"]
   }
   ```

2. 更新 `ui.html` 使用絕對 URL
   ```html
   <script src="https://cdn.example.com/icons-data.be7f6047.js"></script>
   ```

3. 建置時上傳 JS 檔案到 CDN

## 測試驗證

### 建置測試
```bash
✅ npm run build 執行成功
✅ 生成 icons-data.be7f6047.js (2.2MB)
✅ 生成 ui-dev.html (4KB)
✅ 生成 ui-built.html (2.2MB)
✅ 舊版本檔案自動清理
```

### 內容驗證
```bash
✅ ui-dev.html 包含: src="icons-data.be7f6047.js"
✅ ui-built.html 包含: <script>window.iconsData = [...]</script>
✅ icons-data.*.js 包含: window.iconsData = [{id:..., name:..., ...}]
```

### 打包測試
```bash
✅ dist/figma-azure-plugin.zip (676KB)
✅ 包含 manifest.json, code.js, ui-built.html
✅ 壓縮率約 70%
```

## 向後相容性

✅ **完全相容** - 生產版 (ui-built.html) 行為與原版本相同，不影響現有使用者。

## 未來改進

1. **分塊載入**：將 705 個圖示分成多個檔案，實現按需載入
2. **WebP 格式**：考慮將 SVG 轉 WebP 減少檔案大小
3. **索引檔案**：建立輕量級索引，延遲載入完整資料
4. **Service Worker**：在支援的環境中實現離線快取

## 總結

透過這次重構，我們在保持 Figma 插件功能完整性的前提下，實現了：
- ✅ 圖示資料模組化
- ✅ Hash 快取機制
- ✅ 開發/生產雙版本
- ✅ 自動化建置流程
- ✅ 為未來 CDN 部署做好準備

此架構兼顧了當前需求與未來擴充性，是一個穩健的技術方案。
