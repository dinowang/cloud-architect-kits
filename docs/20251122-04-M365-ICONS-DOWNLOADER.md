# Microsoft 365 圖示下載腳本

## 概述

建立了自動化下載腳本 `scripts/download-m365-icons.sh`，用於從 Microsoft 官方網站下載最新的 Microsoft 365 內容圖示集。

## 腳本資訊

### 檔案位置
```
scripts/download-m365-icons.sh
```

### 功能特色

- ✅ 自動解析最新下載連結
- ✅ 顯示彩色進度提示
- ✅ 自動建立目錄結構
- ✅ 清理舊有檔案
- ✅ 統計圖示數量
- ✅ 錯誤處理機制

## 使用方式

### 基本執行

```bash
# 從專案根目錄執行
./scripts/download-m365-icons.sh

# 或從任意位置執行
bash /path/to/scripts/download-m365-icons.sh
```

### 輸出位置

```
temp/
├── m365-icons.zip          # 下載的壓縮檔
└── m365-icons/             # 解壓縮後的圖示
    ├── Microsoft Blue/
    ├── Microsoft Purple/
    ├── Planner Green/
    ├── Project Green/
    ├── SharePoint Teal/
    └── Teams Purple/
```

## 執行流程

### 步驟說明

1. **建立目錄** - 建立 `temp/` 目錄
2. **解析 URL** - 從重定向連結取得實際下載 URL
3. **下載檔案** - 下載 ZIP 檔案到 `temp/m365-icons.zip`
4. **解壓縮** - 解壓縮到 `temp/m365-icons/`
5. **統計摘要** - 顯示檔案統計資訊

### 執行範例輸出

```
==================================
Microsoft 365 Icons Downloader
==================================

[1/5] Creating temp directory...
✓ Directory created: /Users/dinowang/Support/figma-azure/temp

[2/5] Resolving download URL...
✓ Download URL: https://download.microsoft.com/download/.../2024-microsoft-365-content-icons.zip

[3/5] Downloading Microsoft 365 icons...
################################################# 100.0%
✓ Downloaded: /Users/dinowang/Support/figma-azure/temp/m365-icons.zip (696K)

[4/5] Extracting icons...
✓ Extracted to: /Users/dinowang/Support/figma-azure/temp/m365-icons

[5/5] Summary...
✓ Total files: 1011
✓ SVG files: 963
✓ PNG files: 48

Contents:
  • Microsoft Blue
  • Microsoft Purple
  • Planner Green
  • Project Green
  • SharePoint Teal
  • Teams Purple

==================================
Download Complete!
==================================

Next steps:
  1. Check contents: ls -la /Users/dinowang/Support/figma-azure/temp/m365-icons
  2. Process icons for Figma plugin
```

## 圖示集結構

### 產品分類

| 分類 | 說明 | SVG 數量 |
|------|------|---------|
| **Microsoft Blue** | Microsoft 通用圖示（藍色系） | ~150 |
| **Microsoft Purple** | Microsoft 通用圖示（紫色系） | ~150 |
| **Teams Purple** | Microsoft Teams 圖示 | ~400 |
| **SharePoint Teal** | SharePoint 圖示（青色系） | ~100 |
| **Planner Green** | Microsoft Planner 圖示 | ~80 |
| **Project Green** | Microsoft Project 圖示 | ~80 |

### 圖示變體

每個產品分類包含不同顏色變體：

```
Microsoft Blue/
├── 48x48 Dark Blue Icon/      # 深藍色版本
├── 48x48 Grey & Blue Icon/    # 灰藍色版本
└── 48x48 Light Blue Icon/     # 淡藍色版本

Teams Purple/
├── 48x48 Dark Purple Icon/    # 深紫色版本
├── 48x48 Grey & Purple Icon/  # 灰紫色版本
└── 48x48 Light Purple Icon/   # 淡紫色版本

Planner Green/
├── 48x48 PNG Icons/           # PNG 格式
└── 48x48 SVG Icons/           # SVG 格式
```

### 圖示範例

```
Teams Purple/48x48 Grey & Purple Icon/
├── Cloud Add.svg
├── Search.svg
├── Organization Horizontal.svg
├── Receipt.svg
├── Payment.svg
├── Mail Error.svg
└── Tablet Laptop.svg

SharePoint Teal/48x48 SVG Icon/
├── Organization_Light.svg
├── Organization_Gray.svg
└── Organization_Dark.svg
```

## 技術細節

### 下載來源

**官方頁面：**
- https://learn.microsoft.com/en-us/microsoft-365/solutions/architecture-icons-templates?view=o365-worldwide

**重定向連結：**
- https://go.microsoft.com/fwlink/?linkid=869455

**實際下載 URL：**
- https://download.microsoft.com/download/2/F/3/2F346655-1F7E-4F5E-BE78-82DA3D507F3A/2024-microsoft-365-content-icons.zip

### 依賴工具

- `curl` - 下載檔案
- `unzip` - 解壓縮
- `find` - 檔案搜尋
- `awk` / `grep` - 文字處理

### 錯誤處理

```bash
set -e  # 遇到錯誤立即退出

# URL 解析失敗處理
if [ -z "$DOWNLOAD_URL" ]; then
    echo "✗ Failed to resolve download URL"
    exit 1
fi

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

- **檔案大小：** 696 KB (壓縮)
- **總檔案數：** 1,011
- **SVG 檔案：** 963
- **PNG 檔案：** 48

### 圖示尺寸

- **標準尺寸：** 48x48 pixels
- **格式：** SVG (向量圖) + PNG (點陣圖)
- **顏色變體：** Light / Dark / Grey 混合

## 與 Azure 圖示的差異

| 特性 | Azure Icons | Microsoft 365 Icons |
|------|------------|-------------------|
| **數量** | ~705 | ~963 |
| **分類** | 按服務類別 | 按產品線 + 顏色 |
| **尺寸** | 多種尺寸 | 統一 48x48 |
| **格式** | 主要 SVG | SVG + PNG |
| **用途** | 雲端架構圖 | 協作工具圖示 |

## 後續應用

### 整合到 Figma 插件

1. **處理腳本**
   ```bash
   # 建立類似 process-icons.js 的處理程式
   node scripts/process-m365-icons.js
   ```

2. **合併到現有插件**
   - 新增 M365 分類
   - 保留顏色變體資訊
   - 統一命名規則

3. **UI 調整**
   - 新增產品線過濾器
   - 顏色變體選擇器
   - 整合搜尋功能

### 獨立插件選項

考慮建立獨立的 Microsoft 365 圖示插件：

```
figma-m365/
├── src/
│   ├── code.ts
│   ├── ui.html
│   ├── process-icons.js
│   └── build.js
├── manifest.json
└── package.json
```

## 維護建議

### 定期更新

```bash
# 每季執行一次更新
./scripts/download-m365-icons.sh
```

### 版本追蹤

建議在下載後記錄版本資訊：

```bash
# 記錄下載日期
echo "Downloaded: $(date +%Y-%m-%d)" > temp/m365-icons/VERSION.txt

# 記錄下載 URL
echo "$DOWNLOAD_URL" >> temp/m365-icons/VERSION.txt
```

### 變更檢查

```bash
# 比較新舊版本的檔案數量
OLD_COUNT=$(find temp/m365-icons.old -name "*.svg" | wc -l)
NEW_COUNT=$(find temp/m365-icons -name "*.svg" | wc -l)
echo "Change: $((NEW_COUNT - OLD_COUNT)) files"
```

## 授權資訊

**Microsoft 圖示使用條款：**
- 圖示來自 Microsoft 官方
- 遵循 Microsoft 品牌指南
- 僅用於 Microsoft 產品相關設計
- 參考官方授權文件

## 疑難排解

### 下載失敗

```bash
# 手動檢查 URL
curl -I "https://go.microsoft.com/fwlink/?linkid=869455"

# 使用瀏覽器下載
open "https://learn.microsoft.com/en-us/microsoft-365/solutions/architecture-icons-templates?view=o365-worldwide"
```

### 解壓縮錯誤

```bash
# 驗證 ZIP 檔案完整性
unzip -t temp/m365-icons.zip

# 重新下載
rm temp/m365-icons.zip
./scripts/download-m365-icons.sh
```

### 權限問題

```bash
# 確保腳本可執行
chmod +x scripts/download-m365-icons.sh

# 檢查目錄權限
ls -la temp/
```

## 參考資源

- [Microsoft 365 Icons - Official Page](https://learn.microsoft.com/en-us/microsoft-365/solutions/architecture-icons-templates?view=o365-worldwide)
- [Microsoft Design Guidelines](https://developer.microsoft.com/en-us/fluentui)
- [Azure Architecture Icons](https://learn.microsoft.com/en-us/azure/architecture/icons/)

## 總結

此腳本提供了一個簡單、可靠的方式來獲取最新的 Microsoft 365 圖示集，為後續整合到 Figma 插件或其他設計工具奠定基礎。

**主要優勢：**
- ✅ 全自動化流程
- ✅ 友善的輸出介面
- ✅ 完善的錯誤處理
- ✅ 詳細的統計資訊
- ✅ 易於維護和擴充
