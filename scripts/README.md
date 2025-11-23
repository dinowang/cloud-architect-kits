# Scripts

自動化腳本集合，用於下載和處理 Microsoft 圖示資源。

## 可用腳本

### build-and-release.sh

完整建置並打包所有元件的主要腳本。

**使用方式：**
```bash
./scripts/build-and-release.sh
```

**執行流程：**
1. 下載所有圖示來源
2. 預建置圖示 (normalize & index)
3. 複製圖示到各 plugin
4. 建置 Figma plugin
5. 建置 PowerPoint add-in
6. 打包發行檔案

**產出：**
- `dist/figma-plugin/` - Figma plugin 檔案
- `dist/powerpoint-addin/` - PowerPoint add-in 檔案
- `dist/cloud-architect-kit-figma-plugin.zip`
- `dist/cloud-architect-kit-powerpoint-addin.zip`

---

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

### download-d365-icons.sh

下載 Dynamics 365 圖示集。

**使用方式：**
```bash
./scripts/download-d365-icons.sh
```

**統計資訊：**
- SVG 檔案：~38

---

### download-entra-icons.sh

下載 Microsoft Entra 圖示集。

**使用方式：**
```bash
./scripts/download-entra-icons.sh
```

**統計資訊：**
- SVG 檔案：~7

---

### download-kubernetes-icons.sh

下載 Kubernetes 圖示集。

**使用方式：**
```bash
./scripts/download-kubernetes-icons.sh
```

**統計資訊：**
- SVG 檔案：~39

---

### download-gilbarbara-icons.sh

下載 Gilbarbara 技術標誌圖示集。

**使用方式：**
```bash
./scripts/download-gilbarbara-icons.sh
```

**統計資訊：**
- SVG 檔案：~1,839

---

### download-lobe-icons.sh

下載 Lobe Icons 圖示集。

**使用方式：**
```bash
./scripts/download-lobe-icons.sh
```

**統計資訊：**
- SVG 檔案：~723

---

## 輸出位置

所有下載腳本將檔案下載到 `temp/` 目錄：

```
temp/
├── azure-icons/
├── m365-icons/
├── d365-icons/
├── entra-icons/
├── powerplatform-icons/
├── kubernetes-icons/
├── gilbarbara-icons/
└── lobe-icons/
```

預建置系統處理後的圖示位於：

```
src/prebuild/
├── icons/        # 正規化的 SVG 檔案 (~4,323 個)
└── icons.json    # 圖示索引與 metadata
```

## 快速使用

### 完整建置流程

```bash
# 執行完整建置（推薦）
./scripts/build-and-release.sh
```

### 單獨下載圖示

```bash
# 下載所有圖示來源
./scripts/download-azure-icons.sh
./scripts/download-m365-icons.sh
./scripts/download-d365-icons.sh
./scripts/download-entra-icons.sh
./scripts/download-powerplatform-icons.sh
./scripts/download-kubernetes-icons.sh
./scripts/download-gilbarbara-icons.sh
./scripts/download-lobe-icons.sh
```

## 詳細文件

相關開發文件位於 `docs/` 目錄。
