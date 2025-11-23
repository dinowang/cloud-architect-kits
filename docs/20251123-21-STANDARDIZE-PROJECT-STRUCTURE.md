# 20251123-21-STANDARDIZE-PROJECT-STRUCTURE

## 異動日期
2025-11-23

## 異動目的
統一所有插件（Figma Plugin, PowerPoint Add-in, Google Slides Add-on）的專案結構，將 README.md 放置於各插件的根目錄，遵循一致的專案組織規範。

## 問題背景

### 初始結構

Google Slides Add-on 最初將 README.md 放在 `addon/` 子目錄中：

```
src/google-slides/
└── addon/
    ├── README.md          # ❌ 位於子目錄
    ├── Code.gs
    ├── Sidebar.html
    └── ...
```

### 其他插件的結構

Figma 和 PowerPoint 的 README.md 都放在插件根目錄：

```
src/figma/
├── README.md              # ✅ 位於根目錄
├── INSTALL.md
└── plugin/
    ├── code.ts
    └── ...

src/powerpoint/
├── README.md              # ✅ 位於根目錄
├── INSTALL.md
├── add-in/
│   └── ...
└── terraform/
    └── ...
```

## 解決方案

### 統一結構規範

所有插件採用相同的目錄結構：

```
src/{plugin-name}/
├── README.md              # 主要說明文件（根目錄）
├── INSTALL.md             # 安裝指南（根目錄）
└── {implementation}/      # 實作目錄
    ├── 程式碼檔案
    ├── 設定檔
    └── ...
```

### 實際結構對比

#### 修改前
```
src/google-slides/
└── addon/
    ├── README.md          # ❌ 錯誤位置
    ├── Code.gs
    ├── Sidebar.html
    ├── SidebarScript.html
    ├── build.js
    ├── package.json
    └── appsscript.json
```

#### 修改後
```
src/google-slides/
├── README.md              # ✅ 移到根目錄
├── INSTALL.md             # TODO: 待建立
└── addon/
    ├── Code.gs
    ├── Sidebar.html
    ├── SidebarScript.html
    ├── build.js
    ├── package.json
    └── appsscript.json
```

## 執行步驟

### 1. 移動 README.md

```bash
mv src/google-slides/addon/README.md src/google-slides/README.md
```

### 2. 更新 README 內容

調整 README.md 使其與其他插件保持一致的格式和結構。

#### 主要更新項目

##### A. 標題和描述
```markdown
# Cloud Architect Kits - Google Slides Add-on

A Google Slides Add-on that allows you to quickly insert cloud 
architecture and technology icons into your presentations.
```

##### B. 功能特色（統一格式）
```markdown
## Features

- 🔍 **Search through 4,300+ icons** from multiple sources
- 📐 **Flexible sizing** - Adjustable icon sizes from 16pt to 512pt
- 🎨 **Organized by source and category** - Easy navigation
- ⚡ **Fast keyword search** - Search by icon name, source, or category
- 🎯 **Auto-center** - Icons automatically centered on the slide
```

##### C. 圖示來源（新增）
```markdown
## Icon Sources

This add-on includes icons from:

- **Azure Architecture Icons** (~705 icons)
- **Microsoft 365 Icons** (~963 icons)
- **Dynamics 365 Icons** (~38 icons)
- **Microsoft Entra Icons** (~7 icons)
- **Power Platform Icons** (~9 icons)
- **Kubernetes Icons** (~39 icons)
- **Gilbarbara Logos** (~1,839 icons)
- **Lobe Icons** (~723 icons)

**Total: ~4,323 icons**
```

##### D. 專案結構（新增）
```markdown
## Project Structure

\`\`\`
src/google-slides/
├── README.md              # This file
├── INSTALL.md             # Detailed installation guide (TODO)
└── addon/                 # Google Slides Add-on source
    ├── Code.gs            # Server-side code (Apps Script)
    ├── Sidebar.html       # UI template
    ├── SidebarScript.html # Client-side JavaScript
    ├── IconsData.html     # Generated icons data (~26 MB)
    ├── appsscript.json    # Apps Script manifest
    ├── build.js           # Build script
    ├── package.json       # Dependencies
    ├── .clasp.json        # Clasp configuration (generated)
    ├── .claspignore       # Files to ignore when pushing
    ├── icons/             # Icon SVG files (from prebuild)
    └── icons.json         # Icon metadata (from prebuild)
\`\`\`
```

##### E. 平台比較（新增）
```markdown
## Platform Comparison

### Cloud Architect Kits Ecosystem

\`\`\`
Cloud Architect Kits
├── Figma Plugin          # Design tool
├── PowerPoint Add-in     # Microsoft presentations
└── Google Slides Add-on  # Google presentations
\`\`\`

### Feature Comparison

| Feature | Figma | PowerPoint | Google Slides |
|---------|-------|-----------|---------------|
| **Platform** | Figma Plugin API | Office.js | Apps Script |
| **Deployment** | Figma Community | Azure Static Web Apps | Google Drive |
| **Icon Storage** | Plugin bundle | External JS file | Inline HTML |
```

##### F. 技術棧（新增）
```markdown
## Technical Stack

- **Frontend**: HTML5, CSS3, jQuery 3.6.0
- **Backend**: Google Apps Script (V8 runtime)
- **Build**: Node.js, Clasp CLI
- **APIs**: Google Slides API, HTML Service
```

## 統一的專案結構

### 所有插件的標準結構

```
src/
├── figma/
│   ├── README.md          # Figma 插件說明
│   ├── INSTALL.md         # Figma 安裝指南
│   └── plugin/            # Figma 插件實作
│       ├── code.ts
│       ├── ui.html
│       ├── build.js
│       └── ...
│
├── powerpoint/
│   ├── README.md          # PowerPoint 增益集說明
│   ├── INSTALL.md         # PowerPoint 安裝指南
│   ├── add-in/            # PowerPoint 增益集實作
│   │   ├── manifest.xml
│   │   ├── taskpane.html
│   │   ├── taskpane.js
│   │   ├── build.js
│   │   └── ...
│   └── terraform/         # Azure 部署設定
│       ├── main.tf
│       └── ...
│
└── google-slides/
    ├── README.md          # Google Slides 附加元件說明
    ├── INSTALL.md         # Google Slides 安裝指南 (TODO)
    └── addon/             # Google Slides 附加元件實作
        ├── Code.gs
        ├── Sidebar.html
        ├── build.js
        └── ...
```

### 目錄命名規範

| 插件 | 實作目錄名稱 | 說明 |
|-----|------------|------|
| Figma | `plugin/` | Figma 官方術語 |
| PowerPoint | `add-in/` | Office 官方術語 (Add-in) |
| Google Slides | `addon/` | Google 官方術語 (Add-on) |

### 文件命名規範

所有插件根目錄都包含：

1. **README.md** (必須)
   - 插件概述
   - 功能特色
   - 快速開始
   - 使用說明
   - 故障排除

2. **INSTALL.md** (建議)
   - 詳細安裝步驟
   - 環境設定
   - 部署指南
   - 常見問題

## README.md 標準章節

### 標準章節順序

1. **標題** - `# Cloud Architect Kits - {Plugin Name}`
2. **描述** - 一句話說明插件用途
3. **Features** - 功能特色列表（使用 emoji）
4. **Icon Sources** - 圖示來源統計
5. **Prerequisites** - 前置需求
6. **Project Structure** - 專案結構
7. **Quick Start** - 快速開始
8. **Installation** - 安裝步驟
9. **Usage** - 使用方式
10. **Development** - 開發指南
11. **Platform Comparison** - 平台比較
12. **Technical Stack** - 技術棧
13. **Troubleshooting** - 故障排除
14. **Related** - 相關專案
15. **License** - 授權條款
16. **Support** - 支援資訊

### 必須章節

- ✅ 標題和描述
- ✅ Features
- ✅ Icon Sources
- ✅ Project Structure
- ✅ Quick Start
- ✅ Installation

### 建議章節

- 📋 Usage
- 📋 Development
- 📋 Platform Comparison
- 📋 Technical Stack
- 📋 Troubleshooting

## 文件內容一致性

### 圖示數量統計

所有插件都應該列出相同的圖示統計：

```markdown
## Icon Sources

- **Azure Architecture Icons** (~705 icons)
- **Microsoft 365 Icons** (~963 icons)
- **Dynamics 365 Icons** (~38 icons)
- **Microsoft Entra Icons** (~7 icons)
- **Power Platform Icons** (~9 icons)
- **Kubernetes Icons** (~39 icons)
- **Gilbarbara Logos** (~1,839 icons)
- **Lobe Icons** (~723 icons)

**Total: ~4,323 icons**
```

### 功能特色格式

使用一致的格式和 emoji：

```markdown
## Features

- 🔍 **Search** - Description
- 📐 **Feature** - Description
- 🎨 **Feature** - Description
```

### 前置需求

列出明確的版本需求：

```markdown
## Prerequisites

- Tool Name (v14 or higher)
- Tool Name
- Account/Subscription
```

## 實施檢查清單

### Figma Plugin
- ✅ README.md 位於 `src/figma/`
- ✅ INSTALL.md 位於 `src/figma/`
- ✅ 實作在 `src/figma/plugin/`
- ✅ 格式符合標準

### PowerPoint Add-in
- ✅ README.md 位於 `src/powerpoint/`
- ✅ INSTALL.md 位於 `src/powerpoint/`
- ✅ 實作在 `src/powerpoint/add-in/`
- ✅ 格式符合標準

### Google Slides Add-on
- ✅ README.md 位於 `src/google-slides/` (已移動)
- ⏳ INSTALL.md 位於 `src/google-slides/` (待建立)
- ✅ 實作在 `src/google-slides/addon/`
- ✅ 格式已更新符合標準

## 優點

### 1. 一致性
- 所有插件遵循相同的結構
- 容易找到文件和程式碼
- 降低認知負擔

### 2. 可維護性
- 統一的更新流程
- 容易複製最佳實踐
- 簡化文件維護

### 3. 專業性
- 符合業界標準
- 清晰的專案組織
- 良好的文件結構

### 4. 易用性
- 使用者快速找到說明
- 開發者容易上手
- 減少文件搜尋時間

## 未來工作

### 待完成項目

1. **建立 INSTALL.md**
   ```bash
   # 為 Google Slides 建立詳細的安裝指南
   touch src/google-slides/INSTALL.md
   ```

2. **標準化所有 README**
   - 確保所有插件的 README 包含相同的章節
   - 統一圖示數量統計
   - 統一功能描述格式

3. **建立 README 範本**
   ```markdown
   # Cloud Architect Kits - {Plugin Name} Template
   
   可供未來新插件使用的標準範本
   ```

4. **文件自動化檢查**
   - 建立腳本驗證文件結構
   - 檢查章節完整性
   - 驗證圖示數量一致性

## 檔案變更統計

```
移動檔案:
src/google-slides/addon/README.md → src/google-slides/README.md

更新檔案:
src/google-slides/README.md
  - 更新標題和描述格式
  - 新增圖示來源章節
  - 新增專案結構章節
  - 新增平台比較章節
  - 新增技術棧章節
  - 統一功能特色格式
  
docs/20251123-21-STANDARDIZE-PROJECT-STRUCTURE.md (新增)
```

## 目錄結構驗證

### 驗證指令

```bash
# 檢查所有 README 位置
find src -maxdepth 2 -name "README.md" -type f

# 預期輸出:
# src/figma/README.md
# src/powerpoint/README.md
# src/google-slides/README.md
```

### 驗證腳本

```bash
#!/bin/bash
# verify-structure.sh

echo "Verifying project structure..."

errors=0

# Check Figma
if [ ! -f "src/figma/README.md" ]; then
  echo "❌ Missing: src/figma/README.md"
  errors=$((errors + 1))
fi

# Check PowerPoint
if [ ! -f "src/powerpoint/README.md" ]; then
  echo "❌ Missing: src/powerpoint/README.md"
  errors=$((errors + 1))
fi

# Check Google Slides
if [ ! -f "src/google-slides/README.md" ]; then
  echo "❌ Missing: src/google-slides/README.md"
  errors=$((errors + 1))
fi

if [ $errors -eq 0 ]; then
  echo "✅ All README files in correct locations"
else
  echo "❌ Found $errors error(s)"
  exit 1
fi
```

## 參考資源

### 業界標準

- [GitHub Repository Structure Best Practices](https://github.com/github/docs)
- [Microsoft Open Source Guidelines](https://opensource.microsoft.com/)
- [Google Open Source Docs](https://opensource.google/)

### 類似專案

- [Figma Community Plugins](https://www.figma.com/community/plugins)
- [Office Add-ins Samples](https://github.com/OfficeDev/Office-Add-in-samples)
- [Google Workspace Add-ons](https://developers.google.com/workspace/add-ons)

## 結論

### 完成項目

- ✅ 統一所有插件的專案結構
- ✅ 移動 Google Slides README 到根目錄
- ✅ 更新 README 內容符合標準格式
- ✅ 建立專案結構規範文件

### 標準化成果

```
所有插件現在遵循統一結構:
├── README.md              # 根目錄說明文件
├── INSTALL.md             # 根目錄安裝指南
└── {implementation}/      # 實作程式碼目錄
```

### 效益

- **一致性**: 所有插件結構一致
- **可維護性**: 容易更新和維護
- **專業性**: 符合業界標準
- **易用性**: 使用者容易找到文件

現在所有插件都遵循相同的專案組織規範！
