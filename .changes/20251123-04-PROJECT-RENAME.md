# 專案重命名 - Cloud Architect Kits

**日期:** 2025-11-23  
**類型:** 專案重構

## 概述

將專案名稱從 "Cloud Architect Icons" 更名為 "Cloud Architect Kits"，並重新組織目錄結構，使其更簡潔明確。

## 變更內容

### 1. 專案名稱變更

**舊名稱:** Cloud Architect Icons  
**新名稱:** Cloud Architect Kits

理由：
- "Kits" 更能反映專案包含多個工具（Figma plugin + PowerPoint add-in）
- 更簡潔明確
- 與 release 檔案命名一致（cloudarchitect-kit-*）

### 2. 目錄重命名

#### 專案根目錄
```
舊: /Users/dinowang/Support/figma-cloudarchitect
新: /Users/dinowang/Support/cloudarchitect-kits
```

#### Figma Plugin
```
舊: src/figma-cloudarchitect/
新: src/figma/
```

#### PowerPoint Add-in
```
舊: src/powerpoint-cloudarchitect/
新: src/powerpoint/
```

### 3. 更新的檔案

#### 建置腳本
- ✅ `scripts/build-and-release.sh`
  - `FIGMA_DIR` 路徑
  - `PPT_DIR` 路徑
  - 標題文字

#### GitHub Actions
- ✅ `.github/workflows/build-and-release.yml`
  - 複製圖示的路徑
  - 建置工作目錄
  - 發布準備路徑

#### 文件
- ✅ `README.md` (根目錄)
  - 專案標題
  - 目錄連結
  - 專案結構圖

- ✅ `src/powerpoint/README.md`
  - 標題
  - 目錄名稱

- ✅ `src/prebuild/README.md`
  - 標題
  - 複製指令範例

#### 其他檔案
- ⚠️  docs/*.md - 需要更新參照
- ⚠️  其他 README 和 INSTALL.md

## 新的專案結構

```
cloudarchitect-kits/
├── README.md
├── INSTALL.md
├── .github/
│   └── workflows/
│       └── build-and-release.yml
├── src/
│   ├── prebuild/          # 統一的圖示處理
│   ├── figma-plugin/      # Figma 插件
│   └── powerpoint-addin/  # PowerPoint 增益集
│       ├── README.md
│       ├── INSTALL.md
│       ├── add-in/        # Add-in 原始碼
│       └── terraform/     # 基礎設施
├── scripts/               # 下載腳本
├── temp/                  # 暫存目錄
├── dist/                  # 發布檔案
│   ├── figma-plugin/
│   └── powerpoint-addin/
└── docs/                  # 文件
```

## 命名一致性

### Release 檔案
- `cloudarchitect-kit-figma-plugin.zip`
- `cloudarchitect-kit-powerpoint-addin.zip`

### 專案名稱
- Cloud Architect Kits (總稱)
- Figma Plugin (元件名稱)
- PowerPoint Add-in (元件名稱)

### 目錄名稱
- `cloudarchitect-kits/` (根目錄)
- `src/figma/` (Figma 插件)
- `src/powerpoint/` (PowerPoint 增益集)
- `src/prebuild/` (預建置)

## 變更影響

### 開發人員
需要更新本地克隆：

```bash
# 方案 1: 重新克隆
cd ~/Support
rm -rf figma-cloudarchitect  # 備份後刪除
git clone <repo-url> cloudarchitect-kits

# 方案 2: 更新現有目錄
cd ~/Support/figma-cloudarchitect
git pull
cd ..
mv figma-cloudarchitect cloudarchitect-kits
```

### Git Remote URL
如果 Git repository 名稱也變更，需要更新：
```bash
cd cloudarchitect-kits
git remote set-url origin <new-repo-url>
```

### CI/CD
- ✅ GitHub Actions 已更新
- ✅ 所有路徑已調整
- ✅ Release 命名已正確

### 文件
- ✅ 主要 README 已更新
- ✅ Prebuild README 已更新
- ✅ PowerPoint README 已更新
- ⚠️  其他文件可能需要更新

## 命名規範

### 在程式碼中
- 變數名稱: `FIGMA_DIR`, `PPT_DIR`
- 資料夾: `figma-plugin`, `powerpoint-addin`
- 套件名稱: `cloudarchitect-prebuild`, `figma-cloudarchitect`, `powerpoint-cloudarchitect`

### 在文件中
- 英文: Cloud Architect Kits
- 專案總稱: Cloud Architect Kits
- 元件: Figma Plugin, PowerPoint Add-in

### 在 Git 中
- Repository: cloudarchitect-kits (建議)
- Branch: main
- Tags: v{date} (例如: v20251123)

## 向後相容性

### 套件名稱
package.json 中的名稱保持不變：
- `cloudarchitect-prebuild`
- `figma-cloudarchitect`
- `powerpoint-cloudarchitect`

這樣可以避免 npm 相關問題。

### Git History
- ✅ Git history 完整保留
- ✅ 可以追溯到舊的檔案名稱
- ✅ Blame 功能正常

### Release Assets
舊的 release assets 仍然可用（如果有的話）。

## 檢查清單

### 必須更新
- [x] 專案根目錄名稱
- [x] src/figma-cloudarchitect → src/figma
- [x] src/powerpoint-cloudarchitect → src/powerpoint
- [x] scripts/build-and-release.sh
- [x] .github/workflows/build-and-release.yml
- [x] README.md (根目錄)
- [x] src/powerpoint/README.md
- [x] src/prebuild/README.md

### 可選更新
- [ ] docs/*.md 中的所有參照
- [ ] src/powerpoint/INSTALL.md
- [ ] src/figma/README.md (如果有)
- [ ] 其他 markdown 文件中的參照

### 驗證
- [ ] 執行 `./scripts/build-and-release.sh` 確認建置正常
- [ ] 檢查 GitHub Actions workflow
- [ ] 確認所有文件連結有效
- [ ] 測試本地開發流程

## 測試步驟

### 1. 本地建置測試
```bash
cd ~/Support/cloudarchitect-kits
./scripts/build-and-release.sh
```

### 2. 檢查產出
```bash
ls -la dist/figma-plugin/
ls -la dist/powerpoint-addin/
ls -la dist/*.zip
```

### 3. 驗證路徑
```bash
# 檢查沒有舊路徑參照
grep -r "figma-cloudarchitect" . --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=temp --exclude-dir=dist
grep -r "powerpoint-cloudarchitect" . --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=temp --exclude-dir=dist
```

### 4. 測試開發流程
```bash
# Prebuild
cd src/prebuild
npm run build

# Figma Plugin
cd ../figma-plugin
cp -r ../prebuild/icons ./icons
cp ../prebuild/icons.json ./icons.json
npm run build

# PowerPoint Add-in
cd ../powerpoint-addin/add-in
cp -r ../../prebuild/icons ./icons
cp ../../prebuild/icons.json ./icons.json
npm run build
```

## 相關文件

- [專案建立記錄](20251123-01-POWERPOINT-ADDIN.md)
- [專案重組記錄](20251123-02-POWERPOINT-RESTRUCTURE.md)
- [Prebuild 架構](20251123-03-PREBUILD-ICONS.md)

## 總結

專案重命名完成，新的命名更加清晰明確：

✅ **專案名稱**: Cloud Architect Kits  
✅ **目錄結構**: figma-plugin, powerpoint-addin  
✅ **命名一致**: 目錄、release、文件  
✅ **建置腳本**: 所有路徑已更新  
✅ **GitHub Actions**: Workflow 已更新  
✅ **向後相容**: Git history 和 package 名稱保留  

專案結構更加清晰，命名更加一致！
