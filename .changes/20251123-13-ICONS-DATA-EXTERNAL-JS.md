# 20251123-13-ICONS-DATA-EXTERNAL-JS

## 異動日期
2025-11-23

## 異動目的
將 PowerPoint Add-in 的圖形資料改為使用帶有 hash 值命名的外部 JS 檔案 (`icons-data.{hash}.js`)，不再內嵌到 HTML 文件中。採用與 `taskpane-dev.html` 相同的策略。

## 問題分析

### 原先設計
```
taskpane-built.html (26 MB)
├─ 內嵌: <script>window.iconsData = [...];</script> (25.88 MB)
├─ 引用: taskpane.js (8.6 KB)
└─ 總大小: 26 MB
```

**缺點**:
- HTML 檔案過大 (26 MB)
- 無法利用瀏覽器快取機制
- 每次載入都要傳輸整個 HTML 檔案
- 不利於部署和更新

### 新設計
```
taskpane-built.html (4.6 KB)
├─ 引用: icons-data.64850843.js (25.88 MB)
├─ 引用: taskpane.js (8.6 KB)
└─ 總大小: 4.6 KB (HTML)
```

**優點**:
- ✅ HTML 檔案輕量化 (4.6 KB)
- ✅ 可利用瀏覽器快取 (icons-data.{hash}.js)
- ✅ 支援 CDN 加速
- ✅ Hash 值確保版本控制
- ✅ 更新 HTML 不影響快取的圖示資料

## 修改內容

### 1. Build Script 修改

**檔案**: `src/powerpoint/add-in/build.js`

#### 原始程式碼 (Line 45-50)
```javascript
// Production build (inline JS)
const prodHtml = templateHtml.replace(
  '<script src="/*ICONS_JS_PATH*/"></script>',
  `<script>${jsContent}</script>`
);
fs.writeFileSync('taskpane-built.html', prodHtml, 'utf8');
console.log(`Production build: taskpane-built.html (inline JS)`);
```

#### 修改後程式碼
```javascript
// Production build (references external JS file with hash)
const prodHtml = templateHtml.replace('/*ICONS_JS_PATH*/', jsFilename);
fs.writeFileSync('taskpane-built.html', prodHtml, 'utf8');
console.log(`Production build: taskpane-built.html (references ${jsFilename})`);
```

**變更說明**:
- 不再將 `jsContent` 內嵌到 HTML
- 改為引用外部檔案 `icons-data.{hash}.js`
- 與 `taskpane-dev.html` 使用相同的策略

### 2. GitHub Actions Workflow 修改

**檔案**: `.github/workflows/build-and-release.yml`

#### 位置 1: "Prepare distribution" 步驟
```yaml
# PowerPoint add-in
cp src/powerpoint/add-in/manifest.xml dist/powerpoint-addin/
cp src/powerpoint/add-in/taskpane-built.html dist/powerpoint-addin/
cp src/powerpoint/add-in/taskpane.js dist/powerpoint-addin/
cp src/powerpoint/add-in/icons-data.*.js dist/powerpoint-addin/  # ← 新增
cp src/powerpoint/add-in/commands.html dist/powerpoint-addin/
cp src/powerpoint/add-in/staticwebapp.config.json dist/powerpoint-addin/
cp -r src/powerpoint/add-in/assets dist/powerpoint-addin/
```

#### 位置 2: "Check for changes in dist" 步驟
```yaml
# PowerPoint add-in
cp src/powerpoint/add-in/manifest.xml dist/powerpoint-addin/
cp src/powerpoint/add-in/taskpane-built.html dist/powerpoint-addin/
cp src/powerpoint/add-in/taskpane.js dist/powerpoint-addin/
cp src/powerpoint/add-in/icons-data.*.js dist/powerpoint-addin/  # ← 新增
cp src/powerpoint/add-in/commands.html dist/powerpoint-addin/
cp src/powerpoint/add-in/staticwebapp.config.json dist/powerpoint-addin/
cp -r src/powerpoint/add-in/assets dist/powerpoint-addin/
```

### 3. 本地建置腳本修改

**檔案**: `scripts/build-and-release.sh`

```bash
echo "--- Packaging PowerPoint add-in..."
cp "$PPT_DIR/manifest.xml" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/taskpane-built.html" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/taskpane.js" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR"/icons-data.*.js "$DIST_DIR/powerpoint-addin/"  # ← 新增
cp "$PPT_DIR/commands.html" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/staticwebapp.config.json" "$DIST_DIR/powerpoint-addin/"
cp -r "$PPT_DIR/assets" "$DIST_DIR/powerpoint-addin/"
```

## 產出檔案結構

### 完整檔案清單
```
dist/powerpoint-addin/
├── manifest.xml                (4.1 KB)
├── taskpane-built.html         (4.6 KB) ← 從 26 MB 減少到 4.6 KB
├── taskpane.js                 (8.6 KB)
├── icons-data.64850843.js      (25.88 MB) ← 新增獨立檔案
├── commands.html               (272 B)
├── staticwebapp.config.json    (818 B)
└── assets/
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-64.png
    └── icon-80.png
```

### 檔案大小對比

#### 修改前
```
taskpane-built.html:  26 MB (內嵌 icons data)
總大小:               26 MB
```

#### 修改後
```
taskpane-built.html:       4.6 KB (引用外部檔案)
icons-data.64850843.js:    25.88 MB
taskpane.js:               8.6 KB
總大小:                    25.89 MB (幾乎相同)
```

## 技術優勢

### 1. 瀏覽器快取機制
```html
<!-- taskpane-built.html -->
<script src="icons-data.64850843.js"></script>
```

**優點**:
- 瀏覽器會快取 `icons-data.64850843.js`
- 後續載入只需下載 4.6 KB 的 HTML
- Icons data (25.88 MB) 從快取讀取

### 2. Hash 值版本控制
```
icons-data.64850843.js
           ^^^^^^^^
           MD5 hash (前 8 碼)
```

**優點**:
- 內容變更時 hash 值自動改變
- 確保瀏覽器載入最新版本
- 避免快取問題 (cache busting)
- 可設定長期快取策略

### 3. CDN 友善
```
https://cdn.example.com/icons-data.64850843.js
```

**優點**:
- 可將 icons-data.js 部署到 CDN
- 利用 CDN 全球節點加速
- 減少主伺服器負載
- 支援並行下載

### 4. 獨立更新
```
更新 HTML:   只需部署 4.6 KB
更新圖示:   只需更新 icons-data.{new-hash}.js
```

**優點**:
- HTML 和圖示資料可獨立更新
- 減少部署傳輸量
- 更快的更新速度

## Azure Static Web Apps 快取策略

### staticwebapp.config.json 建議
```json
{
  "routes": [
    {
      "route": "/icons-data.*.js",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    }
  ]
}
```

**說明**:
- `max-age=31536000`: 快取一年 (檔名有 hash 值)
- `immutable`: 告知瀏覽器內容不會改變
- 新版本會使用新的 hash 值，不受影響

## 載入流程

### 瀏覽器載入順序
```
1. 下載 taskpane-built.html (4.6 KB) ← 快速
2. 解析 HTML
3. 下載 office.js (從 Microsoft CDN)
4. 下載 icons-data.64850843.js (25.88 MB) ← 可快取
5. 下載 taskpane.js (8.6 KB)
6. 執行 JavaScript
7. Office.onReady() 初始化
8. 載入並顯示圖示
```

### 第二次載入 (已快取)
```
1. 下載 taskpane-built.html (4.6 KB) ← 快速
2. 解析 HTML
3. 下載 office.js (從快取或 CDN)
4. icons-data.64850843.js (從快取) ← 不需下載
5. taskpane.js (從快取) ← 不需下載
6. 執行 JavaScript
7. 幾乎瞬間完成
```

## 效能提升評估

### 首次載入
- **修改前**: 下載 26 MB HTML
- **修改後**: 下載 4.6 KB HTML + 25.88 MB JS
- **差異**: 幾乎相同 (但 JS 可快取)

### 重複載入
- **修改前**: 每次下載 26 MB
- **修改後**: 只下載 4.6 KB (快取 25.88 MB)
- **差異**: **節省 99.98% 傳輸量**

### 更新部署
- **修改前**: 更新任何內容都需重新下載 26 MB
- **修改後**: 
  - 更新 HTML: 只需 4.6 KB
  - 更新圖示: 新檔名，舊版本仍可用
- **差異**: **大幅減少部署影響**

## 測試驗證

### 本地測試
```bash
# 1. 重新建置
cd src/powerpoint/add-in
node build.js

# 2. 檢查產出
ls -lh taskpane-built.html icons-data.*.js

# 3. 驗證 HTML 引用
grep "icons-data" taskpane-built.html

# 4. 本地伺服器測試
python3 -m http.server 3000
# 在瀏覽器開啟: http://localhost:3000/taskpane-built.html
# 檢查 Network tab，確認 icons-data.*.js 被載入
```

### 快取測試
```bash
# 1. 首次載入 (Chrome DevTools Network tab)
# - taskpane-built.html: 4.6 KB
# - icons-data.64850843.js: 25.88 MB (Status: 200)

# 2. 重新整理 (Disable cache 取消勾選)
# - taskpane-built.html: 4.6 KB (Status: 200)
# - icons-data.64850843.js: (from disk cache)

# 3. 驗證快取有效
```

## 部署影響

### GitHub Actions
- ✅ 自動複製 icons-data.*.js 到 dist/
- ✅ 包含在發行 ZIP 檔案中
- ✅ 部署到 Azure Static Web Apps

### Azure Static Web Apps
- ✅ 所有檔案都會被上傳
- ✅ icons-data.*.js 可被快取
- ✅ 符合 Office Add-in 規範

### Manifest.xml
- ✅ 不需要修改
- ✅ 仍然指向 taskpane-built.html
- ✅ 符合 Office Add-in 規範

## 向後相容性

### ✅ 完全相容
- Office Add-in 載入方式不變
- 功能行為完全相同
- 只是改變資料載入方式

### 無影響項目
- ❌ manifest.xml (不需修改)
- ❌ 使用者體驗 (功能相同)
- ❌ Office Add-in 規範 (符合標準)

## 檔案變更統計

```
.github/workflows/build-and-release.yml | 2 ++
scripts/build-and-release.sh            | 1 +
src/powerpoint/add-in/build.js          | 4 ++--
3 files changed, 5 insertions(+), 2 deletions(-)
```

## 相關文件

- `build.js`: 建置腳本邏輯
- `taskpane.html`: HTML 範本
- `taskpane-built.html`: 產出的 HTML (引用外部 JS)
- `taskpane-dev.html`: 開發版本 (相同策略)

## 未來優化建議

### 1. 壓縮優化
```bash
# 使用 gzip 或 brotli 壓縮 icons-data.js
# 可減少約 70-80% 大小
icons-data.64850843.js      (25.88 MB)
icons-data.64850843.js.br   (~5-7 MB)  ← 使用 Brotli 壓縮
```

### 2. 分片載入
```javascript
// 依需求動態載入特定來源的圖示
import(`/icons-data-azure.js`);
import(`/icons-data-m365.js`);
```

### 3. Service Worker
```javascript
// 使用 Service Worker 預快取
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('icons-v1').then((cache) => {
      return cache.add('/icons-data.64850843.js');
    })
  );
});
```

## 結論

### 主要改進
1. **HTML 輕量化**: 從 26 MB 減少到 4.6 KB
2. **快取優化**: 利用瀏覽器快取機制
3. **版本控制**: Hash 值確保版本一致性
4. **部署效率**: 減少更新時的傳輸量

### 效能提升
- **首次載入**: 相同
- **重複載入**: **節省 99.98% 傳輸量**
- **更新部署**: **只需傳輸變更的檔案**

### 建議
此修改顯著改善 PowerPoint Add-in 的效能和可維護性，建議立即部署。
