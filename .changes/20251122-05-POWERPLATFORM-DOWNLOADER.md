# Power Platform 圖示下載腳本

## 概述

建立了自動化下載腳本 `scripts/download-powerplatform-icons.sh`，用於從 Microsoft 官方網站下載 Power Platform 產品圖示集。

## 腳本資訊

### 檔案位置
```
scripts/download-powerplatform-icons.sh
```

### 功能特色

- ✅ 直接下載連結（無需解析重定向）
- ✅ 顯示彩色進度提示
- ✅ 自動建立目錄結構
- ✅ 清理舊有檔案
- ✅ 統計圖示數量
- ✅ 顯示檔案結構

## 使用方式

### 基本執行

```bash
# 從專案根目錄執行
./scripts/download-powerplatform-icons.sh

# 或從任意位置執行
bash /path/to/scripts/download-powerplatform-icons.sh
```

### 輸出位置

```
temp/
├── powerplatform-icons.zip     # 下載的壓縮檔
└── powerplatform-icons/        # 解壓縮後的圖示
    └── Power_Platform_scalable/
        ├── PowerBI_scalable.svg
        ├── PowerAutomate_scalable.svg
        ├── PowerApps_scalable.svg
        ├── PowerPages_scalable.svg
        ├── Dataverse_scalable.svg
        ├── CopilotStudio_scalable.svg
        ├── PowerFx_scalable.svg
        ├── AIBuilder_scalable.svg
        ├── PowerPlatform_scalable.svg
        ├── Power_Platform_Icons_FAQ.pdf
        └── CELA_Licenses_Public_Use_Icons.pdf
```

## 執行流程

### 步驟說明

1. **建立目錄** - 建立 `temp/` 目錄
2. **下載檔案** - 下載 ZIP 檔案到 `temp/powerplatform-icons.zip`
3. **解壓縮** - 解壓縮到 `temp/powerplatform-icons/`
4. **統計摘要** - 顯示檔案統計資訊

### 執行範例輸出

```
==========================================
Power Platform Icons Downloader
==========================================

[1/4] Creating temp directory...
✓ Directory created: /Users/dinowang/Support/figma-azure/temp

[2/4] Downloading Power Platform icons...
ℹ Source: https://download.microsoft.com/download/.../Power_Platform_scalable.zip

################################################# 100.0%
✓ Downloaded: /Users/dinowang/Support/figma-azure/temp/powerplatform-icons.zip (165K)

[3/4] Extracting icons...
✓ Extracted to: /Users/dinowang/Support/figma-azure/temp/powerplatform-icons

[4/4] Summary...
✓ Total files: 11
✓ SVG files: 9

Contents:
  📁 Power_Platform_scalable (11 files)

Sample SVG Icons:
  • PowerBI_scalable.svg
  • PowerAutomate_scalable.svg
  • Dataverse_scalable.svg
  • PowerApps_scalable.svg
  • PowerPages_scalable.svg
  • CopilotStudio_scalable.svg
  • PowerFx_scalable.svg
  • AIBuilder_scalable.svg
  • PowerPlatform_scalable.svg

==========================================
Download Complete!
==========================================

Next steps:
  1. Check contents: ls -la /Users/dinowang/Support/figma-azure/temp/powerplatform-icons
  2. Process icons for Figma plugin
  3. Visit documentation: https://learn.microsoft.com/zh-tw/power-platform/guidance/icons
```

## 圖示集內容

### Power Platform 產品圖示

| 圖示檔案 | 產品 | 說明 |
|---------|------|------|
| **PowerPlatform_scalable.svg** | Power Platform | Power Platform 整體標誌 |
| **PowerBI_scalable.svg** | Power BI | 商業智慧與資料視覺化 |
| **PowerApps_scalable.svg** | Power Apps | 低程式碼應用程式開發 |
| **PowerAutomate_scalable.svg** | Power Automate | 工作流程自動化 |
| **PowerPages_scalable.svg** | Power Pages | 低程式碼網站建置 |
| **Dataverse_scalable.svg** | Dataverse | 資料平台 |
| **CopilotStudio_scalable.svg** | Copilot Studio | AI Copilot 建置工具 |
| **PowerFx_scalable.svg** | Power Fx | 低程式碼公式語言 |
| **AIBuilder_scalable.svg** | AI Builder | AI 模型建置工具 |

### 附加文件

- **Power_Platform_Icons_FAQ.pdf** - 圖示使用常見問答
- **CELA_Licenses_Public_Use_Icons.pdf** - 授權條款文件

## 技術細節

### 下載來源

**官方頁面：**
- https://learn.microsoft.com/zh-tw/power-platform/guidance/icons

**直接下載 URL：**
- https://download.microsoft.com/download/e/f/4/ef434e60-8cdc-4dd1-9d9f-e58670e57ec1/Power_Platform_scalable.zip

### 依賴工具

- `curl` - 下載檔案
- `unzip` - 解壓縮
- `find` - 檔案搜尋
- `awk` - 文字處理

### 錯誤處理

```bash
set -e  # 遇到錯誤立即退出

# 下載失敗處理
if [ ! -f "$ZIP_FILE" ]; then
    echo "✗ Download failed"
    exit 1
fi
```

### 檔案管理

```bash
# 清理舊檔案
if [ -f "$ZIP_FILE" ]; then
    rm -f "$ZIP_FILE"
fi

# 清理舊目錄
if [ -d "$EXTRACT_DIR" ]; then
    rm -rf "$EXTRACT_DIR"
fi
```

## 統計資訊

### 下載資料

- **檔案大小：** 165 KB (壓縮)
- **總檔案數：** 11
- **SVG 檔案：** 9
- **PDF 文件：** 2

### 圖示特性

- **格式：** SVG (向量圖，可無限縮放)
- **命名規則：** `[ProductName]_scalable.svg`
- **適用場景：** 產品架構圖、簡報、文件

## 與其他圖示集的比較

| 特性 | Azure Icons | Microsoft 365 Icons | Power Platform Icons |
|------|------------|-------------------|-------------------|
| **數量** | ~705 | ~963 | 9 |
| **焦點** | 雲端服務 | 協作工具 | 低程式碼平台 |
| **分類** | 服務類別 | 產品線 + 顏色 | 產品標誌 |
| **尺寸** | 多種 | 48x48 | 可縮放 |
| **用途** | 架構圖 | UI 設計 | 產品識別 |

## 圖示使用場景

### 架構圖

Power Platform 圖示適合用於展示解決方案架構：

```
[Power Apps] → [Power Automate] → [Dataverse]
                       ↓
                  [Power BI]
```

### 簡報投影片

- 產品介紹
- 解決方案展示
- 技術架構說明

### 文件與教學

- 技術文件
- 使用者指南
- 教學材料

## 授權與使用條款

### 包含的授權文件

1. **Power_Platform_Icons_FAQ.pdf**
   - 圖示使用常見問題
   - 最佳實踐建議

2. **CELA_Licenses_Public_Use_Icons.pdf**
   - Microsoft 企業與法律事務部授權
   - 公開使用條款
   - 使用限制說明

### 使用原則

- ✅ 可用於產品文件
- ✅ 可用於教育材料
- ✅ 可用於技術簡報
- ⚠️  需遵循品牌指南
- ⚠️  不可修改或重新著色
- ❌ 不可用於誤導性內容

## 後續應用

### 整合到 Figma 插件

由於 Power Platform 圖示數量較少（僅 9 個），可以考慮：

1. **整合到現有插件**
   ```javascript
   // 新增 Power Platform 分類
   const categories = [
     'Azure Services',
     'Microsoft 365',
     'Power Platform'  // 新增
   ];
   ```

2. **獨立的產品標誌插件**
   - 合併 Power Platform、Microsoft 365、Azure 的主要產品標誌
   - 提供快速插入常用產品圖示的功能

### 處理建議

由於圖示數量少且已經是標準化的產品標誌，建議：

1. **直接使用原始檔案**
   - 無需複雜的處理流程
   - 保持原始向量品質

2. **簡單的索引**
   ```javascript
   const powerPlatformIcons = [
     { name: 'Power Platform', file: 'PowerPlatform_scalable.svg' },
     { name: 'Power BI', file: 'PowerBI_scalable.svg' },
     { name: 'Power Apps', file: 'PowerApps_scalable.svg' },
     // ...
   ];
   ```

## 維護建議

### 檢查更新

Power Platform 是持續發展的產品線，建議：

```bash
# 每半年檢查一次
./scripts/download-powerplatform-icons.sh

# 比較檔案變更
diff -r temp/powerplatform-icons.old temp/powerplatform-icons
```

### 新產品追蹤

關注 Microsoft 公告的新 Power Platform 產品：
- Power Platform 官方部落格
- Microsoft Learn 更新
- 產品發布會

## 疑難排解

### 下載失敗

```bash
# 檢查連線
curl -I "https://download.microsoft.com/download/e/f/4/ef434e60-8cdc-4dd1-9d9f-e58670e57ec1/Power_Platform_scalable.zip"

# 使用瀏覽器下載
open "https://learn.microsoft.com/zh-tw/power-platform/guidance/icons"
```

### PDF 無法開啟

```bash
# 檢查 PDF 檔案
file temp/powerplatform-icons/Power_Platform_scalable/*.pdf

# 使用系統預設程式開啟
open temp/powerplatform-icons/Power_Platform_scalable/Power_Platform_Icons_FAQ.pdf
```

### 解壓縮錯誤

```bash
# 驗證 ZIP 檔案
unzip -t temp/powerplatform-icons.zip

# 手動解壓縮
unzip temp/powerplatform-icons.zip -d temp/powerplatform-icons-manual
```

## 擴充功能建議

### 包含其他 Microsoft 產品標誌

可以考慮加入：
- Dynamics 365 圖示
- GitHub 圖示
- Visual Studio 圖示

### 自動化版本檢查

```bash
#!/bin/bash
# 下載並比較 hash 值
curl -sI "$PP_DOWNLOAD_URL" | grep -i "Last-Modified"
```

## 參考資源

- [Power Platform Icons - Official Page](https://learn.microsoft.com/zh-tw/power-platform/guidance/icons)
- [Power Platform Documentation](https://learn.microsoft.com/zh-tw/power-platform/)
- [Microsoft Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks)

## 總結

此腳本提供了快速獲取 Power Platform 產品圖示的方式，雖然圖示數量不多，但都是重要的產品標誌，適合用於架構圖和技術文件中。

**主要特色：**
- ✅ 簡單直接的下載流程
- ✅ 包含授權文件
- ✅ 高品質 SVG 格式
- ✅ 涵蓋完整 Power Platform 產品線
- ✅ 適合架構圖使用

**建議用途：**
- 解決方案架構圖
- 技術簡報
- 教學文件
- 產品介紹材料
