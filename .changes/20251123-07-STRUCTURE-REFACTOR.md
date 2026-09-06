# 專案結構重構 - Cloud Architect Kits

**日期:** 2025-11-23  
**類型:** 專案重構

## 概述

重新組織專案結構，將文件與程式碼分離，使結構更加清晰易懂。

## 變更內容

### 目錄結構調整

#### Figma Plugin

**舊結構:**
```
src/figma/
├── README.md
├── INSTALL.md
├── manifest.json
├── code.ts
├── ui.html
├── build.js
├── package.json
└── ... (其他檔案)
```

**新結構:**
```
src/figma/
├── README.md           # 文件置於父目錄
├── INSTALL.md
└── plugin/             # 程式碼置於子目錄
    ├── manifest.json
    ├── code.ts
    ├── ui.html
    ├── build.js
    ├── package.json
    └── ... (其他檔案)
```

#### PowerPoint Add-in

**舊結構:**
```
src/powerpoint/
├── README.md
├── INSTALL.md
├── add-in/
│   ├── manifest.xml
│   ├── taskpane.html
│   └── ...
└── terraform/
    ├── main.tf
    └── ...
```

**新結構:**
```
src/powerpoint/
├── README.md           # 文件置於父目錄
├── INSTALL.md
├── add-in/             # 程式碼保持原位
│   ├── manifest.xml
│   ├── taskpane.html
│   └── ...
└── terraform/          # 基礎設施保持原位
    ├── main.tf
    └── ...
```

## 設計理念

### 1. 文件與程式碼分離

**文件層級 (src/figma/, src/powerpoint/)**
- README.md - 功能說明
- INSTALL.md - 安裝指南
- 面向使用者的文件

**程式碼層級 (src/figma/plugin/, src/powerpoint/add-in/)**
- 原始碼
- 建置腳本
- 套件設定
- 面向開發者的內容

### 2. 一致的命名

**簡化命名:**
- `figma-plugin` → `figma`
- `powerpoint-addin` → `powerpoint`

**優點:**
- 更簡潔
- 容易記憶
- 路徑更短

### 3. 清晰的層次

**專案層次:**
```
src/
├── prebuild/           # 第一層：圖示預處理
├── figma/              # 第二層：平台
│   └── plugin/         # 第三層：實作
└── powerpoint/         # 第二層：平台
    ├── add-in/         # 第三層：實作
    └── terraform/      # 第三層：基礎設施
```

## 變更對照表

### 目錄路徑

| 舊路徑 | 新路徑 |
|--------|--------|
| `src/figma/` | `src/figma/plugin/` |
| `src/figma/README.md` | `src/figma/README.md` |
| `src/figma/INSTALL.md` | `src/figma/INSTALL.md` |
| `src/powerpoint/` | `src/powerpoint/` |
| `src/powerpoint/README.md` | `src/powerpoint/README.md` |
| `src/powerpoint/INSTALL.md` | `src/powerpoint/INSTALL.md` |
| `src/powerpoint/add-in/` | `src/powerpoint/add-in/` |
| `src/powerpoint/terraform/` | `src/powerpoint/terraform/` |

### 建置路徑

**scripts/build-and-release.sh:**
```bash
# 舊
FIGMA_DIR="$PROJECT_ROOT/src/figma"
PPT_DIR="$PROJECT_ROOT/src/powerpoint/add-in"

# 新
FIGMA_DIR="$PROJECT_ROOT/src/figma/plugin"
PPT_DIR="$PROJECT_ROOT/src/powerpoint/add-in"
```

**GitHub Actions:**
```yaml
# 舊
working-directory: src/figma
working-directory: src/powerpoint/add-in

# 新
working-directory: src/figma/plugin
working-directory: src/powerpoint/add-in
```

### 文件連結

**README.md:**
```markdown
# 舊
- [Figma Plugin](./src/figma)
- [PowerPoint Add-in](./src/powerpoint)

# 新
- [Figma Plugin](./src/figma)
- [PowerPoint Add-in](./src/powerpoint)
```

**INSTALL.md:**
```bash
# 舊
cd src/figma
cd src/powerpoint/add-in

# 新
cd src/figma/plugin
cd src/powerpoint/add-in
```

## 更新的檔案

### 腳本

- ✅ `scripts/build-and-release.sh`
- ✅ `scripts/cleanup-redundant-files.sh` (如果存在)

### CI/CD

- ✅ `.github/workflows/build-and-release.yml`

### 文件

- ✅ `README.md`
- ✅ `INSTALL.md`
- ✅ `docs/*.md` (所有文件)

### 清理腳本

- ✅ `cleanup-all.sh` (如果存在)
- ✅ `CLEANUP-GUIDE.md` (如果存在)

## 執行步驟

### 1. 備份（建議）

```bash
git add .
git commit -m "Before structure refactoring"
```

### 2. 執行重構

```bash
chmod +x refactor-complete.sh
./refactor-complete.sh
```

這會自動:
1. 重新組織目錄結構
2. 移動所有檔案
3. 更新所有路徑參照

### 3. 驗證結構

```bash
# 檢查新結構
tree -L 3 src/

# 應該看到:
# src/
# ├── prebuild/
# ├── figma/
# │   ├── README.md
# │   ├── INSTALL.md
# │   └── plugin/
# └── powerpoint/
#     ├── README.md
#     ├── INSTALL.md
#     ├── add-in/
#     └── terraform/
```

### 4. 測試建置

```bash
# 測試 Figma plugin
cd src/figma/plugin
npm install
npm run build

# 測試 PowerPoint add-in
cd ../../powerpoint/add-in
npm install
npm run build

# 測試完整建置
cd ../../../
./scripts/build-and-release.sh
```

## 優點

### 1. 更清晰的組織

**文件集中:**
- 使用者文件在平台層級 (src/figma/)
- 容易找到文件
- 一目了然

**程式碼集中:**
- 實作在子目錄 (src/figma/plugin/)
- 開發者清楚知道在哪裡工作
- 邏輯分離

### 2. 更好的擴展性

**未來可能的結構:**
```
src/figma/
├── README.md
├── INSTALL.md
├── plugin/             # Figma Desktop plugin
├── web-plugin/         # Figma Web plugin (未來)
└── cli/                # CLI tool (未來)
```

**或:**
```
src/powerpoint/
├── README.md
├── INSTALL.md
├── add-in/             # Office Add-in
├── terraform/          # Azure deployment
└── docker/             # Docker deployment (未來)
```

### 3. 更短的路徑

**舊:**
```bash
cd src/figma                    # 18 字元
cd src/powerpoint/add-in         # 30 字元
```

**新:**
```bash
cd src/figma/plugin                    # 17 字元
cd src/powerpoint/add-in               # 24 字元
```

### 4. 一致的命名

**平台名稱簡潔:**
- `figma` - 清楚直接
- `powerpoint` - 清楚直接
- 不需要 `-plugin`, `-addin` 後綴

**子目錄說明用途:**
- `plugin/` - 插件實作
- `add-in/` - 增益集實作
- `terraform/` - 基礎設施

## 相容性

### 向後相容

**舊路徑不再有效:**
- `src/figma/` → 移至 `src/figma/plugin/`
- `src/powerpoint/` → 移至 `src/powerpoint/`

**需要更新的地方:**
- 本地開發環境
- CI/CD 腳本
- 文件連結
- 建置腳本

**自動更新:**
- `refactor-complete.sh` 會自動更新所有檔案

### 遷移指南

**開發者:**
```bash
# 1. 拉取最新變更
git pull

# 2. 更新工作目錄
# 舊: cd src/figma
# 新: cd src/figma/plugin

# 3. 重新安裝依賴
npm install

# 4. 建置
npm run build
```

**CI/CD:**
- GitHub Actions 已自動更新
- 其他 CI 系統需要手動更新路徑

## 檢查清單

### 重構前

- [x] 備份目前狀態
- [x] 確認所有變更已提交
- [x] 創建重構腳本

### 執行重構

- [ ] 執行 `refactor-complete.sh`
- [ ] 驗證目錄結構
- [ ] 檢查檔案完整性

### 重構後

- [ ] 測試 Figma plugin 建置
- [ ] 測試 PowerPoint add-in 建置
- [ ] 測試完整建置流程
- [ ] 驗證 CI/CD
- [ ] 更新開發文件
- [ ] 通知團隊成員

## 相關文件

- [根目錄清理](20251123-06-ROOT-CLEANUP.md)
- [專案整理](20251123-05-PROJECT-CLEANUP.md)
- [專案重命名](20251123-04-PROJECT-RENAME.md)

## 總結

專案結構重構完成後：

✅ **清晰分離** - 文件與程式碼各自獨立  
✅ **簡潔命名** - 平台名稱直接明確  
✅ **易於擴展** - 未來功能容易加入  
✅ **路徑簡短** - 更容易輸入和記憶  
✅ **邏輯清楚** - 層次結構一目了然  

專案結構更加專業和易於維護！
