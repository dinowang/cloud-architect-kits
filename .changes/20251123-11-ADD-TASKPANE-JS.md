# 20251123-11-ADD-TASKPANE-JS

## 異動日期
2025-11-23

## 異動目的
修正 PowerPoint Add-in 發行時缺少 `taskpane.js` 檔案的問題。該檔案包含 UI 邏輯，為 Add-in 正常運作所必需。

## 問題描述

### 症狀
PowerPoint Add-in 部署後無法正常運作，因為 `taskpane-built.html` 引用的 `taskpane.js` 檔案不存在。

### 檔案結構
```
taskpane.html (開發範本)
  ├─ 引用: icons-data.*.js (由 build.js 產生)
  └─ 引用: taskpane.js (UI 邏輯)

taskpane-built.html (發行版本)
  ├─ 內嵌: icons data (inline JavaScript)
  └─ 引用: taskpane.js (UI 邏輯) ← 缺少此檔案
```

### 原因分析
在 `build.js` 建置流程中：
1. `taskpane-built.html` 將 `icons-data.*.js` 內容內嵌為 inline script
2. 但 `taskpane.js` 仍然是外部引用：`<script src="taskpane.js"></script>`
3. 發行打包時只複製了 `taskpane-built.html`，沒有包含 `taskpane.js`

### 影響範圍
- PowerPoint Add-in 無法載入 UI 邏輯
- 搜尋、圖示顯示、插入功能無法運作
- 瀏覽器 Console 會顯示 404 錯誤：`taskpane.js not found`

## 解決方案

### 修改檔案

#### 1. GitHub Actions Workflow
**檔案**: `.github/workflows/build-and-release.yml`

**位置 1**: "Prepare distribution" 步驟
```yaml
# PowerPoint add-in
cp src/powerpoint/add-in/manifest.xml dist/powerpoint-addin/
cp src/powerpoint/add-in/taskpane-built.html dist/powerpoint-addin/
cp src/powerpoint/add-in/taskpane.js dist/powerpoint-addin/  # ← 新增
cp src/powerpoint/add-in/commands.html dist/powerpoint-addin/
cp src/powerpoint/add-in/staticwebapp.config.json dist/powerpoint-addin/
cp -r src/powerpoint/add-in/assets dist/powerpoint-addin/
```

**位置 2**: "Check for changes in dist" 步驟中的還原區塊
```yaml
# PowerPoint add-in
cp src/powerpoint/add-in/manifest.xml dist/powerpoint-addin/
cp src/powerpoint/add-in/taskpane-built.html dist/powerpoint-addin/
cp src/powerpoint/add-in/taskpane.js dist/powerpoint-addin/  # ← 新增
cp src/powerpoint/add-in/commands.html dist/powerpoint-addin/
cp src/powerpoint/add-in/staticwebapp.config.json dist/powerpoint-addin/
cp -r src/powerpoint/add-in/assets dist/powerpoint-addin/
```

#### 2. 本地建置腳本
**檔案**: `scripts/build-and-release.sh`

```bash
echo "--- Packaging PowerPoint add-in..."
cp "$PPT_DIR/manifest.xml" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/taskpane-built.html" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/taskpane.js" "$DIST_DIR/powerpoint-addin/"  # ← 新增
cp "$PPT_DIR/commands.html" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/staticwebapp.config.json" "$DIST_DIR/powerpoint-addin/"
cp -r "$PPT_DIR/assets" "$DIST_DIR/powerpoint-addin/"
```

## 檔案說明

### taskpane.js 內容
該檔案包含 PowerPoint Add-in 的核心 UI 邏輯：

```javascript
// 主要功能
1. Office.onReady() - Office Add-in 初始化
2. loadIcons() - 載入並顯示圖示
3. setupSearch() - 設定搜尋功能
4. filterIcons() - 圖示過濾邏輯
5. insertIcon() - 插入圖示到 PowerPoint
6. updateCounts() - 更新圖示計數
```

### 檔案大小
- `taskpane.js`: ~8.6 KB
- 包含完整的 UI 互動邏輯
- 相對於 `taskpane-built.html` (27 MB) 非常小

## 驗證測試

### 本地測試
```bash
# 執行建置腳本
./scripts/build-and-release.sh

# 檢查 taskpane.js 是否存在
ls -lh dist/powerpoint-addin/taskpane.js

# 驗證檔案內容
head -20 dist/powerpoint-addin/taskpane.js
```

### 解壓縮檔案檢查
```bash
# 解壓縮發行檔案
unzip -l dist/cloud-architect-kit-powerpoint-addin.zip

# 應包含以下檔案：
# - manifest.xml
# - taskpane-built.html
# - taskpane.js  ← 確認存在
# - commands.html
# - staticwebapp.config.json
# - assets/
```

### 部署後測試
```bash
# 部署到 Azure Static Web Apps
# 檢查檔案是否可存取
curl https://<your-swa-url>/taskpane.js

# 應返回 JavaScript 內容，而非 404
```

## 發行檔案清單

### 完整 PowerPoint Add-in 發行檔案
```
powerpoint-addin/
├── manifest.xml              # Office Add-in 清單
├── taskpane-built.html       # 主要 UI (含內嵌 icons data)
├── taskpane.js               # UI 邏輯 ← 本次新增
├── commands.html             # Ribbon 命令
├── staticwebapp.config.json  # Azure Static Web Apps 設定
└── assets/                   # 圖示資源
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-64.png
    └── icon-80.png
```

## 影響評估

### 正面影響
- ✅ PowerPoint Add-in 可以正常運作
- ✅ 所有 UI 功能完整可用
- ✅ 修正後可立即部署

### 檔案大小影響
- 發行檔案增加 ~8.6 KB
- 相對於 27 MB 的 HTML 檔案，增加幅度可忽略
- ZIP 壓縮後影響更小

### 向後相容性
- ✅ 不影響現有部署
- ✅ 新版本覆蓋部署即可修正問題
- ✅ 不需要修改 manifest.xml

## 相關檔案

### 需要同步更新的位置
1. `.github/workflows/build-and-release.yml` (2 處)
   - "Prepare distribution" 步驟
   - "Check for changes in dist" 步驟
2. `scripts/build-and-release.sh` (1 處)
   - 本地建置流程

### 不需要修改的檔案
- ❌ `src/powerpoint/add-in/build.js` - 建置邏輯正確
- ❌ `src/powerpoint/add-in/taskpane.html` - 範本正確
- ❌ `src/powerpoint/add-in/manifest.xml` - 不受影響

## 檔案變更統計

```
.github/workflows/build-and-release.yml | 2 ++
scripts/build-and-release.sh            | 1 +
2 files changed, 3 insertions(+)
```

## 未來建議

### 1. 考慮將 taskpane.js 也內嵌
修改 `build.js` 將 `taskpane.js` 內容也內嵌到 `taskpane-built.html`：

**優點**：
- 減少 HTTP 請求
- 單一檔案部署更簡單
- 不會有遺漏檔案的問題

**缺點**：
- HTML 檔案會更大（增加 8.6 KB）
- 除錯時較不方便

### 2. 自動化驗證
在 CI/CD 中加入驗證步驟：
```yaml
- name: Validate distribution files
  run: |
    # 檢查必要檔案是否存在
    test -f dist/powerpoint-addin/taskpane.js || exit 1
    test -f dist/powerpoint-addin/taskpane-built.html || exit 1
    echo "✅ All required files present"
```

### 3. 建置文件清單
在 `build.js` 或建置流程中產生檔案清單：
```json
{
  "files": [
    "manifest.xml",
    "taskpane-built.html",
    "taskpane.js",
    "commands.html",
    "staticwebapp.config.json"
  ],
  "build_time": "2025-11-23T08:10:00Z"
}
```

## 測試檢查清單

- [ ] 本地建置包含 `taskpane.js`
- [ ] GitHub Actions 建置包含 `taskpane.js`
- [ ] ZIP 檔案包含 `taskpane.js`
- [ ] Azure 部署後可存取 `taskpane.js`
- [ ] PowerPoint Add-in 載入成功
- [ ] 搜尋功能正常
- [ ] 圖示顯示正常
- [ ] 插入圖示功能正常

## 備註

1. **立即性**: 此為必要修正，應優先部署
2. **簡單性**: 修改僅涉及複製指令，風險極低
3. **完整性**: 確保 PowerPoint Add-in 所有必要檔案都被包含
4. **一致性**: 與 Figma Plugin 的打包方式保持一致（包含所有必要檔案）
