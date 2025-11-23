# 建立 Prebuild Icons 流程

**日期:** 2025-11-23  
**類型:** 架構改進

## 概述

將圖示處理流程獨立出來，建立統一的 prebuild 階段，讓 Figma plugin 和 PowerPoint add-in 共用相同的處理後圖示。

## 變更動機

### 問題
1. **重複處理**: Figma plugin 和 PowerPoint add-in 各自處理圖示
2. **不一致性**: 兩個專案可能使用不同版本的圖示
3. **建置時間**: 每次建置都要重新處理 4,323 個圖示
4. **維護困難**: 圖示處理邏輯重複維護

### 解決方案
建立統一的 prebuild 階段：
1. 一次處理所有圖示
2. 產生標準化的 `icons/` 和 `icons.json`
3. 兩個專案直接複製使用
4. 確保一致性

## 新架構

### 目錄結構
```
src/
├── prebuild/              ← 新增：統一的圖示處理
│   ├── package.json
│   ├── process-icons.js
│   ├── README.md
│   ├── icons/            (產生)
│   └── icons.json        (產生)
├── figma-cloudarchitect/
│   ├── icons/            ← 從 prebuild 複製
│   └── icons.json        ← 從 prebuild 複製
└── powerpoint-cloudarchitect/
    └── add-in/
        ├── icons/        ← 從 prebuild 複製
        └── icons.json    ← 從 prebuild 複製
```

### 處理流程

```
下載圖示來源
    ↓
temp/*-icons/
    ↓
[Prebuild Stage]
src/prebuild/process-icons.js
    ↓
src/prebuild/icons/
src/prebuild/icons.json
    ↓
    ├─→ 複製到 figma-cloudarchitect/
    └─→ 複製到 powerpoint-cloudarchitect/add-in/
    ↓
各專案建置
```

## 實作細節

### 1. 建立 prebuild 專案

#### src/prebuild/package.json
```json
{
  "name": "cloudarchitect-prebuild",
  "scripts": {
    "build": "node process-icons.js"
  }
}
```

#### src/prebuild/process-icons.js
- 從 figma-cloudarchitect 複製
- 掃描 `../../temp/*-icons/`
- 處理 SVG (移除固定尺寸、確保 viewBox)
- 產生 `icons/` 和 `icons.json`

### 2. 更新建置腳本

#### scripts/build-and-release.sh
```bash
# 舊流程
下載圖示 → 建置 Figma plugin

# 新流程
下載圖示 → Prebuild 圖示 → 複製到各專案 → 建置各專案
```

變更：
```bash
# Step 2: Prebuild icons
cd "$PREBUILD_DIR"
npm run build

# Step 3: Copy icons to plugins
cp -r "$PREBUILD_DIR/icons" "$FIGMA_DIR/icons"
cp "$PREBUILD_DIR/icons.json" "$FIGMA_DIR/icons.json"
cp -r "$PREBUILD_DIR/icons" "$PPT_DIR/icons"
cp "$PREBUILD_DIR/icons.json" "$PPT_DIR/icons.json"

# Step 4-5: Build plugins
```

### 3. 更新 GitHub Actions

#### .github/workflows/build-and-release.yml

```yaml
- name: Prebuild icons
  working-directory: src/prebuild
  run: npm run build

- name: Copy icons to Figma plugin
  run: |
    cp -r src/prebuild/icons src/figma-cloudarchitect/icons
    cp src/prebuild/icons.json src/figma-cloudarchitect/icons.json

- name: Copy icons to PowerPoint add-in
  run: |
    cp -r src/prebuild/icons src/powerpoint-cloudarchitect/add-in/icons
    cp src/prebuild/icons.json src/powerpoint-cloudarchitect/add-in/icons.json
```

### 4. 更新 Release 命名

Release 檔案名稱變更：
- `dist.zip` → `cloudarchitect-kit-figma-plugin.zip`
- 新增：`cloudarchitect-kit-powerpoint-addin.zip`

## 優點

### 1. 單一真實來源 (Single Source of Truth)
- 圖示只處理一次
- 確保兩個專案使用相同版本
- 減少不一致的可能性

### 2. 提升建置效率
```
舊方式:
  下載圖示 → 處理 (Figma) → 建置 Figma
           → 處理 (PPT)   → 建置 PPT
  時間: ~4 分鐘 + ~4 分鐘 = ~8 分鐘

新方式:
  下載圖示 → Prebuild → 複製 → 建置 Figma + PPT
  時間: ~4 分鐘 + 1 秒 + ~2 分鐘 = ~6 分鐘
```

### 3. 簡化維護
- 圖示處理邏輯集中在一個地方
- 只需維護一份 `process-icons.js`
- 新增圖示來源只需修改一次

### 4. 更清晰的職責
- `prebuild/`: 圖示處理
- `figma-cloudarchitect/`: Figma plugin 建置
- `powerpoint-cloudarchitect/add-in/`: PowerPoint add-in 建置

### 5. 便於測試
```bash
# 單獨測試圖示處理
cd src/prebuild
npm run build

# 驗證圖示
ls icons/ | wc -l  # 應該是 4323
cat icons.json | jq length  # 應該是 4323
```

## 使用方式

### 本地開發

#### 選項 1: 使用完整建置腳本
```bash
./scripts/build-and-release.sh
```

#### 選項 2: 手動步驟
```bash
# 1. 下載圖示來源
./scripts/download-azure-icons.sh
./scripts/download-m365-icons.sh
# ... (其他來源)

# 2. Prebuild 圖示
cd src/prebuild
npm run build

# 3. 複製到 Figma plugin
cd ../figma-cloudarchitect
cp -r ../prebuild/icons ./icons
cp ../prebuild/icons.json ./icons.json

# 4. 複製到 PowerPoint add-in
cd ../powerpoint-cloudarchitect/add-in
cp -r ../../prebuild/icons ./icons
cp ../../prebuild/icons.json ./icons.json

# 5. 建置各專案
cd ../../figma-cloudarchitect
npm run build

cd ../powerpoint-cloudarchitect/add-in
npm run build
```

### CI/CD

GitHub Actions 會自動執行完整流程：
1. 下載所有圖示來源
2. Prebuild 圖示
3. 複製到兩個專案
4. 建置兩個專案
5. 產生 release 檔案

## 檔案大小

### Prebuild 輸出
- `icons/`: ~4,323 個 SVG 檔案 (~50MB)
- `icons.json`: ~550KB

### Release 檔案
- `cloudarchitect-kit-figma-plugin.zip`: ~10MB
  - manifest.json
  - code.js
  - ui-built.html (~26MB 壓縮後 ~10MB)

- `cloudarchitect-kit-powerpoint-addin.zip`: ~52MB
  - manifest.xml
  - taskpane-built.html (~26MB)
  - commands.html
  - staticwebapp.config.json
  - assets/

## 向後相容性

### Figma Plugin
- ✅ 不需要變更
- ✅ 仍然使用本地 `icons/` 和 `icons.json`
- ✅ `build.js` 保持不變

### PowerPoint Add-in
- ✅ 不需要變更
- ✅ 仍然使用本地 `icons/` 和 `icons.json`
- ✅ `build.js` 保持不變

### 開發人員
- ⚠️ 需要執行 prebuild 或完整建置
- ✅ 或手動複製圖示檔案

## 測試驗證

### Prebuild 測試
```bash
cd src/prebuild
npm run build

# 驗證
ls icons/*.svg | wc -l
# 預期: 4323

cat icons.json | jq 'length'
# 預期: 4323

cat icons.json | jq '.[0]'
# 預期: {"id":0,"name":"...","source":"...","category":"...","file":"0.svg"}
```

### 整合測試
```bash
./scripts/build-and-release.sh

# 驗證
ls -lh dist/figma-plugin/
ls -lh dist/powerpoint-addin/
ls -lh dist/*.zip
```

### GitHub Actions
- ✅ Workflow 更新
- ✅ Release 檔案命名正確
- ✅ 兩個 zip 檔案都產生

## 未來改進

### 1. 快取機制
如果圖示來源沒變，可以跳過 prebuild：
```bash
# 計算 temp/ 的 hash
TEMP_HASH=$(find temp -type f -exec md5sum {} \; | md5sum)

# 比較與上次的 hash
if [ "$TEMP_HASH" == "$LAST_HASH" ]; then
  echo "Icons unchanged, skipping prebuild"
else
  npm run build
fi
```

### 2. 增量更新
只處理變更的圖示來源：
```bash
# 偵測哪些來源有更新
changed_sources=$(git diff --name-only temp/)

# 只重新處理變更的來源
for source in $changed_sources; do
  process_source $source
done
```

### 3. 並行處理
平行處理多個圖示來源：
```javascript
const sources = ['azure', 'm365', 'd365', ...];
await Promise.all(sources.map(processSource));
```

### 4. CDN 發布
將 prebuild 結果發布到 CDN：
```bash
# 上傳到 CDN
aws s3 sync icons/ s3://cdn.example.com/icons/

# 各專案從 CDN 下載
wget https://cdn.example.com/icons.tar.gz
```

## 相關文件

- [Prebuild README](../src/prebuild/README.md)
- [專案建立記錄](20251123-01-POWERPOINT-ADDIN.md)
- [專案重組記錄](20251123-02-POWERPOINT-RESTRUCTURE.md)

## 總結

建立統一的 prebuild 流程帶來多項好處：

✅ **一致性**: 兩個專案使用相同圖示  
✅ **效率**: 減少重複處理時間  
✅ **維護性**: 集中管理圖示處理邏輯  
✅ **清晰性**: 職責分離更明確  
✅ **可測試**: 獨立測試圖示處理  
✅ **Release**: 改進的命名和打包  

專案架構更加完善，建置流程更加高效！
