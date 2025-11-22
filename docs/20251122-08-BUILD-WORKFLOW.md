# 建立完整建置工作流程

**日期**: 2025-11-22  
**類型**: 建置自動化

## 概述

建立完整的建置工作流程，包含本機執行的 Shell Script 版本與 GitHub Actions 自動化版本，實現從下載圖示、建置到發布的完整自動化流程。

## 變更內容

### 1. Shell Script 版本 (`./scripts/run-full-steps.sh`)

創建一鍵完整建置腳本，自動執行：

- **下載所有圖示來源**
  - Azure Architecture Icons
  - Microsoft 365 Icons
  - Dynamics 365 Icons
  - Microsoft Entra Icons
  - Power Platform Icons
  - Kubernetes Icons
  - Gilbarbara Logos

- **安裝依賴套件**
  - 自動檢測 `node_modules` 是否存在
  - 僅在需要時執行 `npm install`

- **建置 Plugin**
  - 處理所有圖示
  - 建置 UI 介面
  - 編譯 TypeScript 程式碼

- **產生 Distribution**
  - 複製所有必要檔案至 `./dist/` 目錄
  - 包含 `manifest.json`, `code.js`, `ui-built.html`
  - 包含圖示檔案與索引
  - 包含文件（README.md, INSTALL.md）

### 2. GitHub Actions 工作流程

創建 `.github/workflows/build-and-release.yml`：

**觸發條件**：
- 僅手動觸發（workflow_dispatch）

**建置步驟**：
1. Checkout 程式碼
2. 建立時間戳記 CI 分支（格式：`YYYYMMDDHHmm-ci`）
3. 設定 Node.js 環境（v20）
4. 下載所有圖示來源（7個來源）
5. 安裝依賴套件（使用 npm ci）
6. 建置 Plugin
7. 準備 Distribution 檔案
8. **檢查變更**：比對 `./dist/` 與前一版 CI 分支
9. 若有變更：提交至 CI 分支並上傳產物（保留 30 天）
10. 若無變更：跳過提交與上傳

**功能特色**：
- 使用 NPM cache 加速建置
- 自動建立獨立的 CI 分支
- 時間戳記命名便於追蹤
- **智慧差異偵測**：自動比對與前一版的變更
- 僅在有變更時才建立 CI 分支與上傳產物

### 3. 新增下載腳本

新增 `./scripts/download-entra-icons.sh`：
- 從 Microsoft Learn 自動抓取下載網址
- 比較檔案大小避免重複下載
- 自動解壓至 `./temp/entra-icons/`

### 4. 文件更新

#### README.md
- 新增完整建置命令說明
- 列出所有下載腳本（7個）
- 說明 GitHub Actions 自動化功能

#### INSTALL.md
- 新增「方法一：一鍵完整建置」（推薦）
- 保留「方法二：手動建置」（進階使用）
- 更新載入 Figma 的路徑說明
- 修正重複內容

## 檔案結構

```
figma-cloudarchitect/
├── .github/
│   └── workflows/
│       └── build-and-release.yml    # GitHub Actions 工作流程
├── scripts/
│   ├── run-full-steps.sh            # 完整建置腳本（本機使用）
│   ├── download-azure-icons.sh
│   ├── download-m365-icons.sh
│   ├── download-d365-icons.sh
│   ├── download-entra-icons.sh      # 新增
│   ├── download-powerplatform-icons.sh
│   ├── download-kubernetes-icons.sh
│   └── download-gilbarbara-icons.sh
├── dist/                            # 建置產物目錄
│   ├── manifest.json
│   ├── code.js
│   ├── ui-built.html
│   ├── icons/
│   ├── icons.json
│   ├── README.md
│   └── INSTALL.md
└── temp/                            # 圖示來源暫存
    ├── azure-icons/
    ├── m365-icons/
    ├── d365-icons/
    ├── entra-icons/                 # 新增
    ├── powerplatform-icons/
    ├── kubernetes-icons/
    └── gilbarbara-icons/
```

## 使用方式

### 本機建置

```bash
# 一鍵完整建置（推薦）
./scripts/run-full-steps.sh

# 建置完成後，在 Figma 中載入
# Plugins → Development → Import plugin from manifest...
# 選擇：./dist/manifest.json
```

### GitHub Actions

**手動觸發**（僅手動執行）：
1. 前往 GitHub Repository
2. 點選 Actions 標籤
3. 選擇 "Build and Release"
4. 點選 "Run workflow"

**工作流程**：
1. 建立時間戳記分支（格式：`YYYYMMDDHHmm-ci`，如 `202511221252-ci`）
2. 下載所有圖示來源
3. 建置 Plugin
4. 產生 Distribution 檔案
5. 比對 `./dist/` 與前一版 CI 分支的差異
6. 若有變更：提交至 CI 分支並上傳產物
7. 若無變更：跳過提交與上傳，終止建置

## 技術細節

### Shell Script 特色
- 使用 `set -e` 確保錯誤時中止
- 自動偵測專案路徑
- 智慧跳過已安裝的依賴
- 完整的進度提示訊息
- 建置完成後顯示檔案清單

### GitHub Actions 優化
- 使用 NPM cache 加速依賴安裝
- 使用 `npm ci` 確保一致性建置
- 分離建置與發布步驟
- 條件式執行 Release（僅 Tag 時）
- 產物保留 30 天供下載

### 錯誤處理
- 下載腳本：檔案大小比對
- 依賴安裝：自動偵測跳過
- 檔案複製：使用 `|| true` 容錯處理
- 首次建置：無前版可比對時自動繼續
- 比對失敗：無法取得前版時自動繼續

## 效益

1. **簡化操作**：從多個步驟簡化為一個命令
2. **自動化**：減少人工介入與錯誤
3. **一致性**：本機與 CI/CD 使用相同流程
4. **可追溯**：GitHub Actions 記錄完整建置歷程，每次建置獨立分支
5. **易於管理**：時間戳記分支命名，清楚標示建置時間點

## 智慧差異偵測機制

### 運作原理

1. **尋找前一版本**
   - 抓取所有遠端 `-ci` 結尾的分支
   - 排除當前建置分支
   - 依時間戳記排序，取最新一個

2. **比對差異**
   - 從前版 CI 分支取出 `dist/` 目錄
   - 使用 `diff -qr` 遞迴比對所有檔案
   - 包含檔案內容與檔案結構

3. **決策邏輯**
   - **有差異**：建立 CI 分支、提交變更、上傳 Artifact
   - **無差異**：輸出警告訊息、跳過後續步驟
   - **無前版**：視為有差異（首次建置）
   - **比對失敗**：視為有差異（保守策略）

### 優勢

- 🎯 避免產生無意義的 CI 分支
- 💾 節省儲存空間與 Artifact 配額
- ⚡ 快速識別實際更新
- 🔍 完整比對（不僅檔案時間戳記）

## 後續建議

1. 考慮加入建置快取機制（快取已下載的圖示）
2. 可新增測試步驟驗證圖示完整性
3. 可設定 Schedule 定期檢查圖示更新
4. 考慮加入 Changelog 自動生成
5. 可加入差異摘要輸出（列出變更的檔案）

## 相關文件

- [README.md](../README.md) - 專案說明
- [INSTALL.md](../INSTALL.md) - 安裝指南
- [GitHub Actions 文件](https://docs.github.com/actions)
