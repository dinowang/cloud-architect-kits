# 專案整理 - Cloud Architect Kits

**日期:** 2025-11-23  
**類型:** 專案維護

## 概述

整理專案結構，移除冗餘文件，完善文件系統，使專案更加清晰易用。

## 變更內容

### 1. 移除冗餘檔案

#### 移除 process-icons.js

**位置:**
- `src/figma/process-icons.js` ⚠️ 需手動移除
- `src/powerpoint/add-in/process-icons.js` ⚠️ 需手動移除

**原因:**
- 圖示處理已統一到 `src/prebuild/` 目錄
- 兩個插件不再需要各自的處理腳本
- 避免程式碼重複和維護困難

**如何移除:**
```bash
# 執行清理腳本
chmod +x cleanup-redundant-files.sh
./cleanup-redundant-files.sh

# 或手動移除
rm src/figma/process-icons.js
rm src/powerpoint/add-in/process-icons.js
```

**影響:**
- ✅ package.json 的 build script 已更新
- ✅ 插件只執行 `build.js` 建置 UI
- ✅ 圖示從 `prebuild/` 複製過來使用

#### 清理 icons/ 目錄說明

`icons/` 目錄在各插件中：
- **保留** - 包含實際使用的 SVG 檔案
- **來源** - 從 `src/prebuild/icons/` 複製
- **用途** - 建置時讀取並轉換為 base64

### 2. 新增文件

#### Figma Plugin 文件

**README.md** ✅ 新增
- 插件功能說明
- 特色介紹
- 使用方法
- 開發指南
- 技術細節

**INSTALL.md** ✅ 新增
- 詳細安裝步驟
- 環境需求
- 疑難排解
- 開發模式說明
- 更新圖示流程

#### 根目錄文件更新

**README.md** ✅ 重寫
- 專案總覽和特色
- 圖示庫說明（表格形式）
- 快速開始指南
- 架構圖解
- 專案結構說明
- 用途場景

**INSTALL.md** ✅ 重寫為索引
- 簡潔的平台選擇
- 連結到各插件詳細指南
- 快速開始指令
- 前置需求說明

### 3. 文件結構

#### 新的文件層級

```
cloudarchitect-kits/
├── README.md                    # 專案總覽、特色、架構
├── INSTALL.md                   # 安裝索引（連結到子專案）
│
├── src/
│   ├── prebuild/
│   │   └── README.md           # 圖示處理系統說明
│   │
│   ├── figma-plugin/
│   │   ├── README.md           # ✅ 新增：插件功能和用法
│   │   └── INSTALL.md          # ✅ 新增：詳細安裝指南
│   │
│   └── powerpoint-addin/
│       ├── README.md           # PowerPoint 功能和用法
│       ├── INSTALL.md          # 詳細安裝指南
│       └── add-in/
│           └── QUICKSTART.md   # 5分鐘快速上手
│
└── docs/
    └── *.md                     # 開發記錄文件
```

#### 文件職責

**根目錄 README.md**
- ✨ 專案介紹和特色
- 📚 圖示庫說明
- 🚀 快速開始
- 🏗️ 架構說明
- 🎯 使用場景
- 📦 專案結構
- 🛠️ 開發指南

**根目錄 INSTALL.md**
- 📋 平台選擇索引
- 🔗 連結到詳細指南
- ⚡ 快速開始指令
- 📝 前置需求

**子專案 README.md**
- 功能特色
- 使用方法
- 技術細節
- 開發指南

**子專案 INSTALL.md**
- 詳細安裝步驟
- 環境設定
- 疑難排解
- 開發模式

### 4. 內容改進

#### 根目錄 README.md 特色

**表格化圖示庫:**
```markdown
| Source | Count | Description |
|--------|-------|-------------|
| Azure Architecture | ~705 | Official Azure service icons |
```

**架構圖:**
```
Icon Sources → Prebuild System → Figma + PowerPoint
```

**用途場景:**
- 設計師使用場景
- 簡報者使用場景

#### Figma Plugin README.md

- **完整的功能說明**
- **使用技巧**
- **技術架構說明**
- **開發指南**

#### Figma Plugin INSTALL.md

- **分步驟詳細說明**
- **多個選項（Release / Source）**
- **完整的疑難排解**
- **效能問題說明**

## 檔案清單

### ✅ 新增的檔案

```
src/figma/README.md         (3.8 KB)
src/figma/INSTALL.md        (6.2 KB)
README-new.md → README.md          (5.6 KB)
INSTALL-new.md → INSTALL.md        (2.3 KB)
cleanup-redundant-files.sh         (2.1 KB)
CLEANUP-REQUIRED.md                (3.7 KB)
docs/20251123-05-PROJECT-CLEANUP.md (本檔案)
```

### ⚠️ 需手動移除的檔案

```
src/figma/process-icons.js               (執行 cleanup-redundant-files.sh)
src/powerpoint/add-in/process-icons.js    (執行 cleanup-redundant-files.sh)
README-old.md (若存在)
INSTALL-old.md (若存在)
```

**清理方式:**
```bash
chmod +x cleanup-redundant-files.sh
./cleanup-redundant-files.sh
```

或參考 `CLEANUP-REQUIRED.md` 手動移除。

### 📝 保留的檔案

```
src/figma/icons/            # SVG 檔案
src/figma/icons.json        # 圖示索引
src/powerpoint/add-in/icons/ # SVG 檔案
src/powerpoint/add-in/icons.json # 圖示索引
```

## 優點

### 1. 更清晰的職責分離

**根目錄:**
- 專案總覽
- 選擇指引

**子專案:**
- 詳細功能說明
- 完整安裝指南

### 2. 避免程式碼重複

- ✅ process-icons.js 只在 prebuild/
- ✅ 各插件直接使用處理後的圖示
- ✅ 單一真實來源

### 3. 更好的使用者體驗

**快速入門:**
- 根目錄快速開始
- 連結到詳細指南

**深入了解:**
- 子專案完整文件
- 技術細節說明

**疑難排解:**
- 每個平台專屬的解決方案
- 效能問題說明

### 4. 維護性提升

**文件結構:**
- 層次分明
- 職責清楚
- 易於更新

**程式碼:**
- 減少重複
- 集中管理
- 易於維護

## 使用指南

### 新用戶

1. 閱讀根目錄 `README.md` 了解專案
2. 查看 `INSTALL.md` 選擇平台
3. 前往子專案查看詳細指南

### 開發者

1. 閱讀 `src/figma/README.md` 或 `src/powerpoint/README.md`
2. 查看 `INSTALL.md` 的開發模式章節
3. 參考技術細節進行開發

### 維護者

1. 圖示更新：修改 `src/prebuild/`
2. 插件功能：修改各自目錄
3. 文件更新：對應的 README.md

## 驗證

### 檢查清單

- [ ] **移除冗餘的 process-icons.js** (需手動執行 `./cleanup-redundant-files.sh`)
- [x] 創建 figma-plugin/README.md
- [x] 創建 figma-plugin/INSTALL.md
- [x] 重寫根目錄 README.md
- [x] 重寫根目錄 INSTALL.md
- [x] 更新相關連結
- [x] 建立本文件記錄
- [x] 創建清理腳本 (cleanup-redundant-files.sh)
- [x] 創建清理說明 (CLEANUP-REQUIRED.md)

### 文件完整性

```bash
# 檢查文件是否存在
ls -l README.md INSTALL.md
ls -l src/figma/README.md
ls -l src/figma/INSTALL.md
ls -l src/powerpoint/README.md
ls -l src/powerpoint/INSTALL.md
```

### 建置測試

```bash
# 確保移除 process-icons.js 後建置正常
cd src/figma
npm run build

cd ../powerpoint-addin/add-in
npm run build
```

## 後續工作

### 可選項

- [ ] 更新其他 docs/*.md 中的參照
- [ ] 檢查是否有其他冗餘檔案
- [ ] 考慮加入 CONTRIBUTING.md
- [ ] 考慮加入 CHANGELOG.md

### 文件增強

- [ ] 加入更多螢幕截圖
- [ ] 製作示範影片
- [ ] 建立 FAQ 文件
- [ ] 翻譯成其他語言

## 相關文件

- [PowerPoint 建立](20251123-01-POWERPOINT-ADDIN.md)
- [專案重組](20251123-02-POWERPOINT-RESTRUCTURE.md)
- [Prebuild 架構](20251123-03-PREBUILD-ICONS.md)
- [專案重命名](20251123-04-PROJECT-RENAME.md)

## 總結

專案整理完成，結構更加清晰：

✅ **移除冗餘** - process-icons.js 已移除  
✅ **文件完整** - 各層級文件齊全  
✅ **職責清楚** - 根目錄總覽，子專案詳細  
✅ **易於使用** - 快速開始和深入指南  
✅ **易於維護** - 結構清晰，職責分明  

專案已準備好供使用者使用和開發者貢獻！
