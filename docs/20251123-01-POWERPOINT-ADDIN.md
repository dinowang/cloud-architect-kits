# PowerPoint Cloud Architect Add-in 建立記錄

**日期:** 2025-11-23  
**類型:** 新功能開發

## 概述

建立了 PowerPoint Add-in `powerpoint-cloudarchitect`，功能與介面比照 Figma plugin `figma-cloudarchitect`，讓使用者可以在 PowerPoint 中快速插入雲端架構圖示。

## 專案結構

```
src/powerpoint-cloudarchitect/
├── README.md                 # 專案說明文件
├── INSTALL.md                # 安裝指南
├── add-in/                   # PowerPoint Add-in 原始碼
│   ├── manifest.xml         # Office Add-in 清單檔
│   ├── package.json         # 專案設定
│   ├── taskpane.html        # UI 介面範本
│   ├── taskpane.js          # 主要應用程式邏輯
│   ├── commands.html        # 命令頁面
│   ├── process-icons.js     # 圖示處理腳本
│   ├── build.js             # 建置腳本
│   ├── deploy.sh            # 部署腳本
│   ├── staticwebapp.config.json # Azure Static Web Apps 設定
│   ├── .gitignore           # Git 忽略檔案
│   ├── QUICKSTART.md        # 快速上手指南
│   ├── assets/              # 靜態資源
│   │   ├── icon-16.png     # 16x16 圖示
│   │   ├── icon-32.png     # 32x32 圖示
│   │   ├── icon-64.png     # 64x64 圖示
│   │   └── icon-80.png     # 80x80 圖示
│   ├── icons/               # 處理後的圖示檔案
│   ├── icons.json          # 圖示索引
│   ├── icons-data.*.js     # 產生的圖示資料 (~26MB)
│   ├── taskpane-built.html # 正式版建置 (~26MB)
│   └── taskpane-dev.html   # 開發版建置
└── terraform/                # Terraform IaC
    ├── main.tf              # 主要設定
    ├── variables.tf         # 變數定義
    ├── outputs.tf           # 輸出值
    ├── .gitignore           # Terraform 忽略檔案
    └── README.md            # Terraform 說明
```

## 主要功能

### 1. UI 介面 (taskpane.html)
- 搜尋框：支援關鍵字搜尋 (名稱、來源、分類)
- 大小控制：16-512px，含快速預設按鈕 (32, 64, 128, 256)
- 圖示清單：48x48 預覽，按來源和分類組織
- 固定標題：捲動時來源標題保持可見
- 即時計數：顯示篩選後/總數量

### 2. 應用程式邏輯 (taskpane.js)
- Office.js 整合
- 圖示資料載入與組織
- 搜尋與篩選功能
- 延遲載入優化
- SVG 圖示插入到投影片
- 智慧縮放：依長邊等比例縮放

### 3. 建置流程 (build.js)
- 讀取 icons.json
- 將 SVG 編碼為 base64
- 產生帶 hash 的 JS 檔案
- 建立開發版和正式版 HTML

### 4. Terraform 基礎設施
- Azure Resource Group
- Azure Static Web App (Free tier)
- 隨機命名後綴
- 輸出部署資訊

## 技術規格

### 前端技術
- **框架:** 原生 JavaScript (無框架)
- **Office API:** Office.js
- **PowerPoint API:** PowerPoint JavaScript API
- **樣式:** 內嵌 CSS (Fluent Design System 風格)

### 圖示資料
- **來源:** 8 個圖示庫 (與 Figma plugin 相同)
- **總數:** 4,323 個圖示
- **格式:** SVG (base64 編碼)
- **檔案大小:** 
  - icons.json: ~550KB
  - icons-data.*.js: ~26MB
  - taskpane-built.html: ~52MB

### Azure 部署
- **服務:** Azure Static Web Apps
- **定價層:** Free (可升級至 Standard)
- **功能:** 
  - 自動 SSL
  - 全球 CDN
  - 自訂網域 (Standard tier)
  - CI/CD 整合

## 關鍵檔案說明

### manifest.xml
Office Add-in 的清單檔，定義：
- Add-in 基本資訊 (ID, 名稱, 描述)
- 支援的 Office 應用程式 (PowerPoint)
- 權限 (ReadWriteDocument)
- UI 元素 (按鈕, 圖示, 命令)
- 資源位置 (HTML, 圖片)

### taskpane.js
主要功能實作：
```javascript
// Office.js 初始化
Office.onReady((info) => {
  if (info.host === Office.HostType.PowerPoint) {
    loadIcons();
  }
});

// 插入圖示到投影片
async function insertSvgAsImage(svgData, name, size) {
  return PowerPoint.run(async (context) => {
    // 取得當前投影片
    // 建立 SVG Blob
    // 插入為圖片
    // 智慧縮放 (保持比例)
    // 置中對齊
  });
}
```

### staticwebapp.config.json
Azure Static Web Apps 設定：
- CORS 標頭
- MIME 類型
- Content Security Policy
- 路由規則

### terraform/main.tf
基礎設施定義：
```hcl
# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "rg-${var.codename}-${random_id.project_suffix.hex}"
  location = var.location
}

# Static Web App
resource "azurerm_static_web_app" "main" {
  name                = "swa-${var.codename}-${random_id.project_suffix.hex}"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.swa_location
  sku_tier            = var.sku_tier
  sku_size            = var.sku_size
}
```

## 部署流程

### 本地開發
1. 複製圖示：`cd add-in && cp -r ../../figma-cloudarchitect/icons .`
2. 安裝依賴：`npm install`
3. 建置：`npm run build`
4. 啟動伺服器：`npm run serve`
5. 在 PowerPoint 中側載 add-in/manifest.xml

### Azure 部署
1. 部署基礎設施：`cd terraform && terraform apply`
2. 取得部署 token：`terraform output -raw static_web_app_api_key`
3. 更新 add-in/manifest.xml 為正式 URL
4. 部署應用程式：`cd ../add-in && swa deploy --deployment-token <token>`

### GitHub Actions
- 工作流程：`.github/workflows/deploy-powerpoint-addin.yml`
- 觸發條件：push to main 或手動觸發
- 建置步驟：
  1. 建置 Figma plugin (取得圖示)
  2. 複製圖示到 PowerPoint add-in
  3. 建置 PowerPoint add-in
  4. 部署到 Azure Static Web Apps

## 與 Figma Plugin 的差異

| 特性 | Figma Plugin | PowerPoint Add-in |
|------|--------------|-------------------|
| 平台 | Figma Desktop | PowerPoint (Desktop/Web) |
| API | Figma Plugin API | Office.js + PowerPoint API |
| 部署 | Figma Plugin Store | Azure Static Web Apps |
| 載入方式 | Figma 內建 | Sideload 或企業部署 |
| 圖示插入 | `figma.createNodeFromSvg()` | `slide.shapes.addImage()` |
| 大小設定 | `node.resize()` | `image.width/height` |
| 檔案結構 | code.ts + ui.html | taskpane.js + taskpane.html |

## 相同功能

1. **圖示庫**：相同的 4,323 個圖示
2. **UI 設計**：相同的搜尋、篩選、大小控制
3. **智慧縮放**：依長邊等比例縮放
4. **固定標題**：捲動時保持可見
5. **即時計數**：顯示篩選結果
6. **延遲載入**：優化效能

## 開發挑戰與解決方案

### 挑戰 1: SVG 插入
PowerPoint API 不直接支援 SVG 文字插入，需要轉換為 Blob URL。

**解決方案:**
```javascript
const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
const svgUrl = URL.createObjectURL(svgBlob);
const image = slide.shapes.addImage(svgUrl);
URL.revokeObjectURL(svgUrl); // 清理
```

### 挑戰 2: 智慧縮放
需要在插入後才能取得原始尺寸。

**解決方案:**
```javascript
const image = slide.shapes.addImage(svgUrl);
await context.sync(); // 同步以取得尺寸

const longerSide = Math.max(image.width, image.height);
const scale = size / longerSide;
image.width = image.width * scale;
image.height = image.height * scale;
```

### 挑戰 3: 大檔案載入
52MB 的 HTML 檔案可能導致載入緩慢。

**解決方案:**
- 延遲載入圖示
- 搜尋時才載入更多
- 使用 document fragment 批次插入
- Debounce 搜尋輸入

### 挑戰 4: CORS 設定
需要允許 Office.js 和其他 Microsoft 服務存取。

**解決方案:**
```json
{
  "globalHeaders": {
    "content-security-policy": "default-src 'self' https://appsforoffice.microsoft.com; ..."
  }
}
```

## 測試建議

### 本地測試
- [ ] PowerPoint Desktop (Windows)
- [ ] PowerPoint Desktop (macOS)
- [ ] PowerPoint Web
- [ ] 搜尋功能
- [ ] 大小調整
- [ ] 圖示插入
- [ ] 多個圖示插入

### Azure 測試
- [ ] 靜態網站可存取
- [ ] HTTPS 正常運作
- [ ] CORS 設定正確
- [ ] CSP 不阻擋資源
- [ ] manifest.xml 可載入

### 效能測試
- [ ] 首次載入時間
- [ ] 搜尋回應時間
- [ ] 捲動流暢度
- [ ] 圖示插入速度
- [ ] 記憶體使用

## 未來改進

### 功能增強
1. **批次插入**: 選擇多個圖示一次插入
2. **自訂大小**: 記住使用者偏好的大小
3. **最近使用**: 記錄最近插入的圖示
4. **收藏功能**: 標記常用圖示
5. **匯出功能**: 匯出圖示到本地

### 效能優化
1. **虛擬捲動**: 只渲染可見區域
2. **Web Workers**: 在背景處理圖示
3. **Progressive Loading**: 分批載入圖示
4. **Service Worker**: 離線快取支援
5. **Image Sprites**: 合併小圖示

### 部署優化
1. **CDN 加速**: 使用 Azure CDN
2. **自訂網域**: 配置專屬網域
3. **A/B Testing**: 測試不同版本
4. **Analytics**: 追蹤使用情況
5. **Error Tracking**: 錯誤監控

## 相關文件

- [README.md](../src/powerpoint-cloudarchitect/README.md) - 專案說明
- [INSTALL.md](../src/powerpoint-cloudarchitect/INSTALL.md) - 安裝指南
- [terraform/README.md](../src/powerpoint-cloudarchitect/terraform/README.md) - Terraform 說明
- [Office Add-ins 文件](https://docs.microsoft.com/office/dev/add-ins/)
- [Azure Static Web Apps 文件](https://docs.microsoft.com/azure/static-web-apps/)

## 總結

成功建立了 PowerPoint Cloud Architect Add-in，完整實現了以下目標：

✅ **功能完整**: 與 Figma plugin 功能對等  
✅ **UI 一致**: 相同的介面設計與操作體驗  
✅ **圖示完整**: 4,323 個圖示完整移植  
✅ **Azure 部署**: 包含完整的 Terraform IaC  
✅ **文件齊全**: README, INSTALL, Terraform 說明  
✅ **CI/CD**: GitHub Actions 自動部署  
✅ **可擴展**: 架構支援未來功能擴充  

專案已準備好進行本地開發和 Azure 部署。
