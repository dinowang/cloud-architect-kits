# 根目錄清理 - Cloud Architect Kits

**日期:** 2025-11-23  
**類型:** 專案維護

## 概述

清理根目錄中不再需要的驗證腳本和舊文件，重新整理剩餘文件的命名和結構。

## 現況分析

### 當前根目錄檔案

```
cloudarchitect-kits/
├── .DS_Store                          (系統檔案)
├── .git/                              (Git 目錄)
├── .github/                           (GitHub Actions)
├── .gitignore                         (Git 設定)
├── README.md                          ✅ 保留
├── README-new.md                      ❌ 移除 (重複)
├── INSTALL.md                         ✅ 保留
├── INSTALL-new.md                     ❌ 移除 (重複)
├── CLEANUP-REQUIRED.md                ⚠️  暫時保留 (清理後移除)
├── cleanup-redundant-files.sh         ➡️  移至 scripts/
├── verify-powerpoint-project.sh       ❌ 移除 (舊版)
├── verify-powerpoint-project-v2.sh    ❌ 移除 (舊版)
├── verify-prebuild-structure.sh       ❌ 移除 (舊版)
├── verify-rename.sh                   ❌ 移除 (舊版)
├── dist/                              ✅ 保留
├── docs/                              ✅ 保留
├── prompts/                           ✅ 保留
├── scripts/                           ✅ 保留
├── src/                               ✅ 保留
└── temp/                              ✅ 保留
```

## 清理計劃

### 1. 移除重複檔案

**README-new.md**
- 原因: 與 `README.md` 重複
- 內容已合併到 `README.md`
- 可安全移除

**INSTALL-new.md**
- 原因: 與 `INSTALL.md` 重複
- 內容已合併到 `INSTALL.md`
- 可安全移除

### 2. 移除舊驗證腳本

這些是開發過程中用於驗證的臨時腳本：

**verify-powerpoint-project.sh**
- 用途: 驗證 PowerPoint 專案建立
- 狀態: 已完成驗證，不再需要
- 動作: 移除

**verify-powerpoint-project-v2.sh**
- 用途: PowerPoint 專案驗證 v2
- 狀態: 已完成驗證，不再需要
- 動作: 移除

**verify-prebuild-structure.sh**
- 用途: 驗證 Prebuild 架構
- 狀態: 已完成驗證，不再需要
- 動作: 移除

**verify-rename.sh**
- 用途: 驗證專案重命名
- 狀態: 已完成驗證，不再需要
- 動作: 移除

### 3. 重新組織維護腳本

**cleanup-redundant-files.sh**
- 現況: 在根目錄
- 新位置: `scripts/cleanup-redundant-files.sh`
- 原因: 維護腳本應統一在 `scripts/` 目錄

**cleanup-root-directory.sh**
- 現況: 在根目錄
- 新位置: `scripts/cleanup-root-directory.sh`
- 原因: 維護腳本應統一在 `scripts/` 目錄

### 4. 臨時文件處理

**CLEANUP-REQUIRED.md**
- 狀態: 暫時保留
- 用途: 說明需要清理 process-icons.js
- 處理: 執行清理後移除
- 時機: 執行 `scripts/cleanup-redundant-files.sh` 後

## 整理後的結構

### 根目錄檔案 (精簡版)

```
cloudarchitect-kits/
├── README.md                # 專案總覽
├── INSTALL.md               # 安裝索引
├── .gitignore               # Git 設定
├── .github/                 # CI/CD
├── dist/                    # 發布檔案
├── docs/                    # 文件
├── scripts/                 # 所有腳本
│   ├── download-*.sh       # 下載腳本
│   ├── build-and-release.sh # 建置腳本
│   ├── cleanup-redundant-files.sh  # 清理 process-icons
│   └── cleanup-root-directory.sh   # 清理根目錄
├── src/                     # 原始碼
│   ├── prebuild/           # 圖示預處理
│   ├── figma-plugin/       # Figma 插件
│   └── powerpoint-addin/   # PowerPoint 增益集
└── temp/                    # 暫存目錄
```

### scripts/ 目錄內容

```
scripts/
├── download-azure-icons.sh
├── download-m365-icons.sh
├── download-d365-icons.sh
├── download-entra-icons.sh
├── download-powerplatform-icons.sh
├── download-kubernetes-icons.sh
├── download-gilbarbara-icons.sh
├── download-lobe-icons.sh
├── build-and-release.sh
├── cleanup-redundant-files.sh      # 新增
└── cleanup-root-directory.sh       # 新增
```

## 執行步驟

### 步驟 1: 清理根目錄

```bash
chmod +x cleanup-root-directory.sh
./cleanup-root-directory.sh
```

這會:
- 移除重複的 README-new.md, INSTALL-new.md
- 移除舊的驗證腳本 (4 個)
- 移動 cleanup-redundant-files.sh 到 scripts/

### 步驟 2: 清理 process-icons.js

```bash
chmod +x scripts/cleanup-redundant-files.sh
./scripts/cleanup-redundant-files.sh
```

這會:
- 移除 src/figma/process-icons.js
- 移除 src/powerpoint/add-in/process-icons.js

### 步驟 3: 移除臨時文件

```bash
rm CLEANUP-REQUIRED.md
rm cleanup-root-directory.sh  # 本腳本也可移除
```

### 步驟 4: 驗證結果

```bash
# 檢查根目錄是否乾淨
ls -la | grep -E "\.sh$|\.md$"

# 應該只看到:
# README.md
# INSTALL.md
```

## 檔案移動記錄

### 移除的檔案

```
❌ README-new.md                     (重複)
❌ INSTALL-new.md                    (重複)
❌ verify-powerpoint-project.sh      (舊驗證)
❌ verify-powerpoint-project-v2.sh   (舊驗證)
❌ verify-prebuild-structure.sh      (舊驗證)
❌ verify-rename.sh                  (舊驗證)
```

### 移動的檔案

```
➡️  cleanup-redundant-files.sh  
   從: ./cleanup-redundant-files.sh
   至: scripts/cleanup-redundant-files.sh

➡️  cleanup-root-directory.sh
   從: ./cleanup-root-directory.sh
   至: scripts/cleanup-root-directory.sh
```

### 保留的檔案

```
✅ README.md                   # 專案總覽
✅ INSTALL.md                  # 安裝索引
✅ .gitignore                  # Git 設定
✅ dist/                       # 發布檔案
✅ docs/                       # 文件
✅ scripts/                    # 腳本目錄
✅ src/                        # 原始碼
✅ temp/                       # 暫存目錄
✅ .github/                    # GitHub Actions
```

## 命名規範

### 根目錄檔案

- **README.md** - 大寫，Markdown 格式
- **INSTALL.md** - 大寫，Markdown 格式
- **.gitignore** - 小寫，點開頭

### 腳本命名

在 `scripts/` 目錄：
- **kebab-case** - 使用連字符
- **.sh 副檔名** - Shell script
- **動詞開頭** - download-, build-, cleanup-

範例：
- `download-azure-icons.sh`
- `build-and-release.sh`
- `cleanup-redundant-files.sh`

### 文件命名

在 `docs/` 目錄：
- **日期前綴** - YYYYMMDD-NN-TITLE.md
- **大寫** - 標題部分大寫
- **連字符** - 單字間用連字符

範例：
- `20251123-01-POWERPOINT-ADDIN.md`
- `20251123-06-ROOT-CLEANUP.md`

## 優點

### 1. 更乾淨的根目錄

**清理前:**
- 20+ 個檔案和目錄
- 多個驗證腳本
- 重複的文件

**清理後:**
- 核心文件 (README, INSTALL)
- 標準目錄 (src, docs, scripts)
- 結構清晰

### 2. 更好的組織

**腳本集中:**
- 所有腳本在 `scripts/`
- 依功能命名
- 易於找到和維護

**文件集中:**
- 所有文件在 `docs/`
- 按日期排序
- 易於追蹤歷史

### 3. 易於維護

**清楚的結構:**
- 根目錄只有必要檔案
- 開發工具在適當位置
- 新人容易理解

## 檢查清單

### 清理前檢查

- [ ] 確認所有驗證腳本已完成任務
- [ ] 確認 README.md 和 INSTALL.md 是最新版本
- [ ] 備份重要資料（如有需要）

### 執行清理

- [ ] 執行 `cleanup-root-directory.sh`
- [ ] 執行 `scripts/cleanup-redundant-files.sh`
- [ ] 移除 CLEANUP-REQUIRED.md
- [ ] 移除 cleanup-root-directory.sh

### 清理後驗證

- [ ] 檢查根目錄是否乾淨
- [ ] 確認 scripts/ 目錄內容正確
- [ ] 測試建置流程正常
- [ ] 確認文件連結有效

## 相關文件

- [專案整理](20251123-05-PROJECT-CLEANUP.md)
- [專案重命名](20251123-04-PROJECT-RENAME.md)
- [Prebuild 架構](20251123-03-PREBUILD-ICONS.md)

## 總結

根目錄清理完成後：

✅ **精簡結構** - 只保留必要檔案  
✅ **清楚組織** - 腳本和文件集中  
✅ **易於維護** - 結構一目了然  
✅ **專業呈現** - 乾淨的根目錄  
✅ **易於理解** - 新人友善  

專案外觀將更加專業和易於維護！
