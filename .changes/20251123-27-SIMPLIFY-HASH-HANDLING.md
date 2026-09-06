# 20251123-27-SIMPLIFY-HASH-HANDLING

## 變更說明

重構 prebuild 圖示資料的 hash 處理機制，從生成帶有 hash 的檔名改為使用 query parameter 的方式進行 cache busting。

## 主要變更

### 1. Prebuild 處理邏輯 (`src/prebuild/process-icons.js`)

**變更前:**
- 生成 `icons-data.js`
- 生成 `icons-data.{hash}.js` (帶 hash 的檔名)
- 每次建置會遺留多個舊的 hashed 檔案

**變更後:**
- 只生成 `icons-data.js`
- 生成 `icons-data.hash` 檔案包含 MD5 hash 值 (8字元)
- 在建置前自動清理舊的 `icons-data.*.js` 檔案

### 2. PowerPoint Add-in 建置 (`src/powerpoint/add-in/build.js`)

**變更前:**
```javascript
// 尋找 hashed 檔案
const iconsDataFiles = fs.readdirSync(PREBUILD_TEMPLATES)
  .filter(f => f.startsWith('icons-data.') && f.endsWith('.js'));
const iconsDataFile = iconsDataFiles[0];

// HTML 引用
<script src="icons-data.7b4b152a.js"></script>
```

**變更後:**
```javascript
// 讀取 hash 檔案
const hash = fs.readFileSync(hashFile, 'utf8').trim();

// HTML 引用 (使用 query parameter)
<script src="icons-data.js?v=dfe85581"></script>

// 複製固定檔名
fs.copyFileSync('icons-data.js', 'icons-data.js');
```

### 3. Google Slides Add-on 建置 (`src/google-slides/addon/build.js`)

- 新增讀取 hash 檔案用於 logging
- Apps Script 不需要 cache busting (server-side template)

### 4. Figma Plugin 建置 (`src/figma/plugin/build.js`)

- 新增讀取 hash 檔案用於 logging  
- Standalone HTML 不需要 cache busting (一個檔案)

### 5. 建置腳本更新 (`scripts/build-and-release.sh`)

**變更前:**
```bash
cp "$PPT_DIR/"icons-data.*.js "$DIST_DIR/powerpoint-addin/"
```

**變更後:**
```bash
cp "$PPT_DIR/icons-data.js" "$DIST_DIR/powerpoint-addin/"
```

### 6. 文件更新 (`src/prebuild/README.md`)

更新以下內容說明:
- 生成 `icons-data.hash` 而非 `icons-data.{hash}.js`
- Hash 作為 query parameter 使用
- 建置前自動清理舊檔案

## 優點

1. **簡化檔案管理**: 只有一個 `icons-data.js` 檔案，不會累積舊的 hashed 檔案
2. **統一命名**: 所有平台都使用相同的檔名 `icons-data.js`
3. **有效的 cache busting**: 透過 query parameter `?v={hash}` 達到相同效果
4. **易於維護**: 不需要在多處追蹤和複製不同 hash 的檔案
5. **自動清理**: 建置前自動移除舊的 hashed 檔案

## 測試結果

執行完整建置流程驗證:
```bash
./scripts/build-and-release.sh
```

✅ Prebuild 正確生成 `icons-data.js` 和 `icons-data.hash`  
✅ PowerPoint add-in 正確引用 `icons-data.js?v=dfe85581`  
✅ Google Slides add-on 正常建置  
✅ Figma plugin 正常建置  
✅ 所有平台 dist 檔案正確打包

## 檔案清單

變更的檔案:
- `src/prebuild/process-icons.js`
- `src/prebuild/README.md`
- `src/powerpoint/add-in/build.js`
- `src/google-slides/addon/build.js`
- `src/figma/plugin/build.js`
- `scripts/build-and-release.sh`

清理的檔案:
- `src/powerpoint/add-in/icons-data.*.js` (舊的 hashed 檔案)
- `dist/powerpoint-addin/icons-data.*.js` (舊的 hashed 檔案)
