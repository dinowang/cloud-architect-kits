# Add TheSVG Icon Source

## 異動摘要

新增 TheSVG 為第 12 個圖示來源，總圖示數從 4,637 提升至 8,642。

## 異動檔案

### 新增
- `scripts/download-thesvg-icons.sh` — TheSVG 圖示下載腳本

### 修改（核心）
- `src/prebuild/process-icons.js` — 新增 TheSVG source 設定

### 修改（建置腳本）
- `scripts/build-and-release.sh` — 加入 TheSVG 下載步驟，移除重複的 Fabric 下載
- `.github/workflows/build-and-release.yml` — 加入 TheSVG 下載步驟

### 修改（文件）
- `README.md` — 更新總數、圖示來源表
- `INSTALL.md` — 更新 Draw.io library 清單
- `.github/copilot-instructions.md` — 更新總數與來源數
- `src/figma/README.md`, `src/figma/INSTALL.md`
- `src/powerpoint/README.md`, `src/powerpoint/INSTALL.md`
- `src/google-slides/README.md`
- `src/drawio/README.md`, `src/drawio/INSTALL.md`
- `src/vscode/INSTALL.md`
- `src/prebuild/README.md`

## TheSVG 來源說明

- 來源: https://github.com/glincker/thesvg
- 結構: `public/icons/{name}/default.svg`（每個圖示有 default/dark/light/mono 變體，取 default）
- 排除: `gcp-*`, `azure-*`, `aws-*` 前綴（已由專屬來源覆蓋）
- 圖示數: 3,999
- 快取機制: 比對遠端 HEAD commit，未更新時跳過下載
