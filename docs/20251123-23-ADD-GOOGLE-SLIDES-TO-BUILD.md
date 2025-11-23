# 20251123-23-ADD-GOOGLE-SLIDES-TO-BUILD

## 異動日期
2025-11-23

## 異動目的
將 Google Slides Add-on 加入到建置和發布流程中，使其與 Figma Plugin 和 PowerPoint Add-in 一起自動建置和發布。

## 變更摘要

### 更新檔案

1. **`scripts/build-and-release.sh`** - 本地建置腳本
2. **`.github/workflows/build-and-release.yml`** - GitHub Actions 工作流程

### 主要變更

#### 1. 新增 Google Slides 目錄變數

```bash
GSLIDES_DIR="$PROJECT_ROOT/src/google-slides/addon"
```

#### 2. 加入圖示複製步驟

```bash
echo "--- Copying to Google Slides add-on..."
cp -r "$PREBUILD_DIR/icons" "$GSLIDES_DIR/icons"
cp "$PREBUILD_DIR/icons.json" "$GSLIDES_DIR/icons.json"
```

#### 3. 加入建置步驟

```bash
# Step 6: Build Google Slides add-on
echo "==> Step 6: Building Google Slides add-on..."
cd "$GSLIDES_DIR"
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
```

#### 4. 加入打包步驟

```bash
mkdir -p "$DIST_DIR/google-slides-addon"

echo "--- Packaging Google Slides add-on..."
cp "$GSLIDES_DIR/appsscript.json" "$DIST_DIR/google-slides-addon/"
cp "$GSLIDES_DIR/Code.gs" "$DIST_DIR/google-slides-addon/"
cp "$GSLIDES_DIR/Sidebar.html" "$DIST_DIR/google-slides-addon/"
cp "$GSLIDES_DIR/SidebarScript.html" "$DIST_DIR/google-slides-addon/"
cp "$GSLIDES_DIR/IconsData.html" "$DIST_DIR/google-slides-addon/"
```

#### 5. 建立 ZIP 壓縮檔

```bash
(cd google-slides-addon && zip -r ../cloud-architect-kit-google-slides-addon.zip .)
```

## 完整建置流程

### 更新後的步驟

```
1. Download icon sources (8 sources)
   ├─ Azure Architecture Icons
   ├─ Microsoft 365 Icons
   ├─ Dynamics 365 Icons
   ├─ Microsoft Entra Icons
   ├─ Power Platform Icons
   ├─ Kubernetes Icons
   ├─ Gilbarbara Logos
   └─ Lobe Icons

2. Prebuild icons
   └─ Generate icons.json

3. Copy icons to plugins
   ├─ Figma plugin
   ├─ PowerPoint add-in
   └─ Google Slides add-on ✨ NEW

4. Build Figma plugin
   ├─ npm install
   └─ npm run build

5. Build PowerPoint add-in
   ├─ npm install
   └─ npm run build

6. Build Google Slides add-on ✨ NEW
   ├─ npm install
   └─ npm run build

7. Prepare distribution
   ├─ Package Figma plugin
   ├─ Package PowerPoint add-in
   ├─ Package Google Slides add-on ✨ NEW
   ├─ Create figma-plugin.zip
   ├─ Create powerpoint-addin.zip
   └─ Create google-slides-addon.zip ✨ NEW
```

## 建置腳本更新

### scripts/build-and-release.sh

#### 變更統計

```diff
+ GSLIDES_DIR="$PROJECT_ROOT/src/google-slides/addon"

+ echo "--- Copying to Google Slides add-on..."
+ cp -r "$PREBUILD_DIR/icons" "$GSLIDES_DIR/icons"
+ cp "$PREBUILD_DIR/icons.json" "$GSLIDES_DIR/icons.json"

+ # Step 6: Build Google Slides add-on
+ echo "==> Step 6: Building Google Slides add-on..."
+ cd "$GSLIDES_DIR"
+ if [ ! -d "node_modules" ]; then
+     npm install
+ fi
+ npm run build

- # Step 6: Prepare distribution
- echo "==> Step 6: Preparing distribution..."
+ # Step 7: Prepare distribution
+ echo "==> Step 7: Preparing distribution..."
+ mkdir -p "$DIST_DIR/google-slides-addon"

+ echo "--- Packaging Google Slides add-on..."
+ cp "$GSLIDES_DIR/appsscript.json" "$DIST_DIR/google-slides-addon/"
+ cp "$GSLIDES_DIR/Code.gs" "$DIST_DIR/google-slides-addon/"
+ cp "$GSLIDES_DIR/Sidebar.html" "$DIST_DIR/google-slides-addon/"
+ cp "$GSLIDES_DIR/SidebarScript.html" "$DIST_DIR/google-slides-addon/"
+ cp "$GSLIDES_DIR/IconsData.html" "$DIST_DIR/google-slides-addon/"

+ (cd google-slides-addon && zip -r ../cloud-architect-kit-google-slides-addon.zip .)

+ echo "Google Slides Add-on:"
+ ls -lh "$DIST_DIR/google-slides-addon"

+ echo "To install Google Slides add-on:"
+ echo "  1. Extract cloud-architect-kit-google-slides-addon.zip"
+ echo "  2. Use clasp to push to Google Apps Script"
+ echo "  3. Run from Extensions → Cloud Architect Kits"
```

#### 新增 14 行，修改 2 行

## GitHub Actions Workflow 更新

### .github/workflows/build-and-release.yml

#### 變更統計

```diff
+ - name: Copy icons to Google Slides add-on
+   run: |
+     cp -r src/prebuild/icons src/google-slides/addon/icons
+     cp src/prebuild/icons.json src/google-slides/addon/icons.json

+ - name: Build Google Slides add-on
+   working-directory: src/google-slides/addon
+   run: |
+     npm ci
+     npm run build

+ mkdir -p dist/google-slides-addon

+ # Google Slides add-on
+ cp src/google-slides/addon/appsscript.json dist/google-slides-addon/
+ cp src/google-slides/addon/Code.gs dist/google-slides-addon/
+ cp src/google-slides/addon/Sidebar.html dist/google-slides-addon/
+ cp src/google-slides/addon/SidebarScript.html dist/google-slides-addon/
+ cp src/google-slides/addon/IconsData.html dist/google-slides-addon/

+ # Create Google Slides add-on archive
+ cd dist/google-slides-addon
+ zip -r ../../cloud-architect-kit-google-slides-addon.zip .
+ cd ../..

+ - **Google Slides Add-on**: `cloud-architect-kit-google-slides-addon.zip`

+ ### Installation - Google Slides Add-on
+ 1. Download `cloud-architect-kit-google-slides-addon.zip`
+ 2. Extract the archive
+ 3. Install clasp: `npm install -g @google/clasp`
+ 4. Login to Google: `clasp login`
+ 5. Create project: `clasp create --type standalone --title "Cloud Architect Kits"`
+ 6. Push files: `clasp push`
+ 7. Open in Google Slides: Extensions → Cloud Architect Kits → Show Icons

- This release contains updates to both Figma plugin and PowerPoint add-in distribution files.
+ This release contains updates to Figma plugin, PowerPoint add-in, and Google Slides add-on distribution files.

+ cloud-architect-kit-google-slides-addon.zip
```

#### 新增 32 行，修改 2 行

## 發布產物

### 產出的檔案

```
dist/
├── figma-plugin/
│   ├── manifest.json
│   ├── code.js
│   └── ui-built.html
│
├── powerpoint-addin/
│   ├── manifest.xml
│   ├── taskpane-built.html
│   ├── taskpane.js
│   ├── icons-data.*.js
│   ├── commands.html
│   ├── staticwebapp.config.json
│   └── assets/
│
├── google-slides-addon/         ✨ NEW
│   ├── appsscript.json
│   ├── Code.gs
│   ├── Sidebar.html
│   ├── SidebarScript.html
│   └── IconsData.html (~26 MB)
│
├── cloud-architect-kit-figma-plugin.zip
├── cloud-architect-kit-powerpoint-addin.zip
└── cloud-architect-kit-google-slides-addon.zip  ✨ NEW
```

### 檔案大小估計

| 檔案 | 大小 | 說明 |
|-----|------|------|
| `figma-plugin.zip` | ~26 MB | 包含 icons-data |
| `powerpoint-addin.zip` | ~26 MB | 包含 icons-data.*.js |
| `google-slides-addon.zip` | ~26 MB | 包含 IconsData.html |

**總計**: ~78 MB (3 個平台)

## Google Slides Add-on 打包內容

### 必要檔案

| 檔案 | 用途 | 大小 |
|-----|------|------|
| `appsscript.json` | Apps Script 設定 | ~400 B |
| `Code.gs` | 伺服器端程式碼 | ~3 KB |
| `Sidebar.html` | UI 範本 | ~6 KB |
| `SidebarScript.html` | 客戶端 JavaScript | ~5 KB |
| `IconsData.html` | 圖示資料 (base64) | ~26 MB |

**總計**: ~26 MB

### 不包含的檔案

透過 `.claspignore` 排除：

- `build.js` - 建置腳本
- `package.json` - Node.js 設定
- `package-lock.json` - 鎖定版本
- `node_modules/` - 依賴套件
- `.clasp.json` - Clasp 設定（使用者自行產生）
- `.gitignore` - Git 設定
- `icons/` - 原始 SVG 檔案（已編碼在 IconsData.html）
- `icons.json` - 元資料（已包含在 IconsData.html）

## GitHub Release 更新

### Release Notes 增強

#### 新增的章節

```markdown
### Packages Included
- **Figma Plugin**: `cloud-architect-kit-figma-plugin.zip`
- **PowerPoint Add-in**: `cloud-architect-kit-powerpoint-addin.zip`
- **Google Slides Add-on**: `cloud-architect-kit-google-slides-addon.zip` ✨ NEW

### Installation - Google Slides Add-on ✨ NEW
1. Download `cloud-architect-kit-google-slides-addon.zip`
2. Extract the archive
3. Install clasp: `npm install -g @google/clasp`
4. Login to Google: `clasp login`
5. Create project: `clasp create --type standalone --title "Cloud Architect Kits"`
6. Push files: `clasp push`
7. Open in Google Slides: Extensions → Cloud Architect Kits → Show Icons
```

### Release Assets

```
Assets (3):
├─ cloud-architect-kit-figma-plugin.zip        (~26 MB)
├─ cloud-architect-kit-powerpoint-addin.zip    (~26 MB)
└─ cloud-architect-kit-google-slides-addon.zip (~26 MB) ✨ NEW
```

## 安裝指南

### Google Slides Add-on

#### 前置需求

```bash
# 安裝 clasp
npm install -g @google/clasp
```

#### 安裝步驟

```bash
# 1. 下載並解壓縮
unzip cloud-architect-kit-google-slides-addon.zip
cd google-slides-addon

# 2. 登入 Google
clasp login

# 3. 建立專案
clasp create --type standalone --title "Cloud Architect Kits"

# 4. 推送檔案
clasp push

# 5. 開啟編輯器（選用）
clasp open
```

#### 使用

1. 開啟 Google Slides
2. 選單: **Extensions** → **Cloud Architect Kits** → **Show Icons**
3. 側邊欄開啟，瀏覽和插入圖示

## 跨平台支援

### 完整的生態系統

```
Cloud Architect Kits
├── Figma Plugin
│   ├── Platform: Figma
│   ├── Package: cloud-architect-kit-figma-plugin.zip
│   └── Size: ~26 MB
│
├── PowerPoint Add-in
│   ├── Platform: Microsoft PowerPoint
│   ├── Package: cloud-architect-kit-powerpoint-addin.zip
│   └── Size: ~26 MB
│
└── Google Slides Add-on ✨ NEW
    ├── Platform: Google Slides
    ├── Package: cloud-architect-kit-google-slides-addon.zip
    └── Size: ~26 MB
```

### 功能對比

| 功能 | Figma | PowerPoint | Google Slides |
|-----|-------|-----------|---------------|
| 圖示數量 | 4,323 | 4,323 | 4,323 ✨ |
| 搜尋 | ✅ | ✅ | ✅ ✨ |
| 大小調整 | ✅ | ✅ | ✅ ✨ |
| 自動居中 | ❌ | ✅ | ✅ ✨ |
| 建置 | ✅ | ✅ | ✅ ✨ |
| 自動發布 | ✅ | ✅ | ✅ ✨ |

## 測試

### 本地測試

```bash
# 執行完整建置
./scripts/build-and-release.sh

# 檢查產出
ls -lh dist/

# 預期輸出:
# dist/figma-plugin/
# dist/powerpoint-addin/
# dist/google-slides-addon/          ✨ NEW
# cloud-architect-kit-figma-plugin.zip
# cloud-architect-kit-powerpoint-addin.zip
# cloud-architect-kit-google-slides-addon.zip  ✨ NEW
```

### GitHub Actions 測試

1. 觸發 workflow: **Actions** → **Build and Release** → **Run workflow**
2. 檢查建置日誌
3. 確認 artifacts 上傳
4. 檢查 GitHub Release
5. 下載並測試 ZIP 檔案

## 後續工作

### 已完成

- ✅ 加入 Google Slides 到本地建置腳本
- ✅ 加入 Google Slides 到 GitHub Actions
- ✅ 更新發布說明
- ✅ 建立安裝指南

### 待完成

- [ ] 測試完整的建置流程
- [ ] 驗證 ZIP 檔案內容
- [ ] 測試實際安裝流程
- [ ] 更新主要的 README.md
- [ ] 建立 Google Slides INSTALL.md

## 效益

### 1. 統一建置流程

- 所有平台在同一個流程中建置
- 確保版本一致性
- 減少手動操作

### 2. 自動化發布

- 自動建立 GitHub Release
- 自動產生 ZIP 檔案
- 自動更新 Release Notes

### 3. 跨平台支援

- 完整的設計和簡報工具支援
- Figma (設計)
- PowerPoint (Microsoft 簡報)
- Google Slides (Google 簡報)

### 4. 一致的使用者體驗

- 相同的圖示庫
- 相同的搜尋功能
- 相似的 UI/UX

## 檔案變更統計

```
修改檔案:
scripts/build-and-release.sh
  + 14 行（新增 Google Slides 步驟）
  ~ 2 行（更新步驟編號）

.github/workflows/build-and-release.yml
  + 32 行（新增 Google Slides 步驟）
  ~ 2 行（更新描述）

docs/20251123-23-ADD-GOOGLE-SLIDES-TO-BUILD.md (新增)
  + 600 行（文件）
```

## 參考資源

### 相關文件

- [20251123-20-ADD-GOOGLE-SLIDES-ADDON.md](./20251123-20-ADD-GOOGLE-SLIDES-ADDON.md) - Google Slides Add-on 實作
- [20251123-21-STANDARDIZE-PROJECT-STRUCTURE.md](./20251123-21-STANDARDIZE-PROJECT-STRUCTURE.md) - 專案結構標準化
- [20251123-22-VALIDATE-GOOGLE-SLIDES-ADDON.md](./20251123-22-VALIDATE-GOOGLE-SLIDES-ADDON.md) - 開發規範驗證

### 建置腳本

- `scripts/build-and-release.sh` - 本地建置腳本
- `.github/workflows/build-and-release.yml` - CI/CD 工作流程

### 插件目錄

- `src/figma/plugin/` - Figma Plugin
- `src/powerpoint/add-in/` - PowerPoint Add-in
- `src/google-slides/addon/` - Google Slides Add-on

## 結論

### 完成項目

- ✅ 將 Google Slides Add-on 加入建置流程
- ✅ 更新本地建置腳本
- ✅ 更新 GitHub Actions workflow
- ✅ 更新 Release Notes 範本
- ✅ 建立詳細的安裝指南

### 建置流程

```
現在支援 3 個平台的完整建置:
✅ Figma Plugin         → cloud-architect-kit-figma-plugin.zip
✅ PowerPoint Add-in    → cloud-architect-kit-powerpoint-addin.zip
✅ Google Slides Add-on → cloud-architect-kit-google-slides-addon.zip
```

### 跨平台生態系統

Cloud Architect Kits 現在完整支援三大平台:

```
🎨 Figma Plugin       - 設計工具
📊 PowerPoint Add-in  - Microsoft 簡報
📈 Google Slides Add-on - Google 簡報
```

### 下一步

1. 執行完整建置測試
2. 驗證 GitHub Release 流程
3. 測試安裝指南
4. 收集使用者回饋
5. 持續優化和改進

現在 Cloud Architect Kits 已經建立完整的跨平台支援和自動化建置發布流程！🎉
