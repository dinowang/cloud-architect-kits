# Scripts

自動化腳本集合，用於下載和處理 Microsoft 圖示資源。

## 可用腳本

### download-azure-icons.sh

下載 Azure Architecture 圖示集。

**使用方式：**
```bash
./scripts/download-azure-icons.sh
```

**統計資訊：**
- SVG 檔案：~705
- 檔案大小：~3 MB

---

### download-m365-icons.sh

下載 Microsoft 365 圖示集。

**使用方式：**
```bash
./scripts/download-m365-icons.sh
```

**統計資訊：**
- 總檔案：1,011
- SVG 檔案：963
- PNG 檔案：48
- 檔案大小：696 KB

**圖示分類：**
- Microsoft Blue
- Microsoft Purple  
- Teams Purple
- SharePoint Teal
- Planner Green
- Project Green

---

### download-powerplatform-icons.sh

下載 Power Platform 產品圖示集。

**使用方式：**
```bash
./scripts/download-powerplatform-icons.sh
```

**統計資訊：**
- 總檔案：11
- SVG 檔案：9
- PDF 文件：2
- 檔案大小：165 KB

**包含產品：**
- Power Platform
- Power BI
- Power Apps
- Power Automate
- Power Pages
- Dataverse
- Copilot Studio
- Power Fx
- AI Builder

---

## 輸出位置

所有腳本將檔案下載到 `temp/` 目錄：

```
temp/
├── azure-icons/
├── m365-icons/
└── powerplatform-icons/
```

## 詳細文件

- Azure Icons: `docs/20251122-01-FIGMA-AZURE-PLUGIN.md`
- M365 Icons: `docs/20251122-04-M365-ICONS-DOWNLOADER.md`
- Power Platform Icons: `docs/20251122-05-POWERPLATFORM-DOWNLOADER.md`
