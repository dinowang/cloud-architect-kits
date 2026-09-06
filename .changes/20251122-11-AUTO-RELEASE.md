# GitHub Workflow 新增自動 Release 功能

**日期**: 2025-11-22  
**類型**: CI/CD 增強

## 概述

在 GitHub Actions workflow 中新增自動 Release 功能，當 `./dist/` 有變更時，自動建立 GitHub Release，包含 `dist.zip` 壓縮檔，方便使用者直接下載完整的 plugin distribution。

## 需求背景

### 原有問題
- Artifact 僅保留 30 天後自動刪除
- 使用者需要從 Actions 頁面尋找並下載 Artifact
- 無法追蹤穩定的版本發布點
- 缺少易於分享的下載連結

### 期望目標
- 自動建立永久保留的 Release
- 提供易於下載的 ZIP 檔案
- 使用時間戳記命名便於識別
- 僅在有實際變更時才建立 Release

## 解決方案

### 新增步驟

#### 1. Create release archive

建立 `dist.zip` 壓縮檔：

```yaml
- name: Create release archive
  if: steps.check_changes.outputs.has_changes == 'true'
  run: |
    cd dist
    zip -r ../dist.zip .
    cd ..
    echo "Release archive created: dist.zip"
    ls -lh dist.zip
```

**功能**：
- 進入 `dist/` 目錄
- 使用 `zip -r` 遞迴壓縮所有內容
- 輸出至專案根目錄的 `dist.zip`
- 顯示檔案大小資訊

#### 2. Generate release tag

產生 Release 標籤：

```yaml
- name: Generate release tag
  if: steps.check_changes.outputs.has_changes == 'true'
  id: release_tag
  run: |
    RELEASE_TAG="v-${{ env.BRANCH_NAME }}"
    echo "RELEASE_TAG=$RELEASE_TAG" >> $GITHUB_ENV
    echo "Release tag: $RELEASE_TAG"
```

**命名規則**：
- 格式：`vYYYYMMDDHHmm`
- 範例：`v202511221330`
- 使用 CI 分支名稱加上 `v-` 前綴

#### 3. Create GitHub Release

建立 GitHub Release：

```yaml
- name: Create GitHub Release
  if: steps.check_changes.outputs.has_changes == 'true'
  uses: softprops/action-gh-release@v1
  with:
    tag_name: ${{ env.RELEASE_TAG }}
    name: Release ${{ env.RELEASE_TAG }}
    body: |
      ## Figma Cloud Architect Plugin - Build ${{ env.BRANCH_NAME }}
      
      ### Build Information
      - **Build Time**: ${{ env.BRANCH_NAME }}
      - **Commit**: ${{ github.sha }}
      - **Branch**: ${{ env.BRANCH_NAME }}
      
      ### Installation
      1. Download `dist.zip`
      2. Extract the archive
      3. Open Figma Desktop App
      4. Go to Plugins → Development → Import plugin from manifest...
      5. Select the extracted `manifest.json` file
      
      ### Changes
      This release contains updates to the plugin distribution files.
    files: dist.zip
    draft: false
    prerelease: false
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**設定說明**：
- `tag_name`: Release 標籤（`vYYYYMMDDHHmm`）
- `name`: Release 名稱
- `body`: Release 說明（Markdown 格式）
- `files`: 附加的檔案（`dist.zip`）
- `draft`: 非草稿（立即發布）
- `prerelease`: 非預覽版本（正式版）

## 條件式執行

所有新增步驟都使用條件判斷：

```yaml
if: steps.check_changes.outputs.has_changes == 'true'
```

**邏輯**：
- ✅ **有變更**：執行 Release 相關步驟
- ⏭️ **無變更**：跳過 Release 相關步驟
- ✅ **首次建置**：執行 Release（視為有變更）
- ✅ **比對失敗**：執行 Release（保守策略）

## 工作流程

### 完整流程（有變更時）

```
1. Build & Prepare dist
2. Check for changes → 有差異
3. Commit to CI branch (202511221330-ci)
4. Upload artifact (保留 30 天)
5. Create release archive (dist.zip)
6. Generate release tag (v202511221330)
7. Create GitHub Release ⭐
   ├─ Tag: v202511221330
   ├─ File: dist.zip
   └─ Description: 建置資訊與安裝指南
8. 完成
```

### 簡化流程（無變更時）

```
1. Build & Prepare dist
2. Check for changes → 無差異
3. Skip all releases steps
4. 完成（不建立 Release）
```

## Release 內容

### Release 頁面

- **標籤**: `v202511221330`
- **標題**: `Release v202511221330`
- **說明**:
  ```markdown
  ## Figma Cloud Architect Plugin - Build 202511221330
  
  ### Build Information
  - **Build Time**: 202511221330
  - **Commit**: abc123def456...
  - **Branch**: 202511221330-ci
  
  ### Installation
  1. Download `dist.zip`
  2. Extract the archive
  3. Open Figma Desktop App
  4. Go to Plugins → Development → Import plugin from manifest...
  5. Select the extracted `manifest.json` file
  
  ### Changes
  This release contains updates to the plugin distribution files.
  ```

### 附加檔案

**dist.zip** 內容結構：
```
dist.zip
├── manifest.json
├── code.js
├── ui-built.html
├── icons.json
├── icons/
│   ├── azure/
│   ├── m365/
│   ├── d365/
│   ├── entra/
│   ├── powerplatform/
│   ├── kubernetes/
│   └── gilbarbara/
├── README.md
└── INSTALL.md
```

## 與 Artifact 的差異

| 項目 | Artifact | GitHub Release |
|------|----------|----------------|
| **保留期限** | 30 天 | 永久 |
| **存取方式** | Actions 頁面 | Releases 頁面 |
| **命名** | `figma-cloudarchitect-202511221330-ci` | `v202511221330` |
| **格式** | ZIP | ZIP |
| **說明文件** | 無 | Markdown 格式安裝指南 |
| **分享** | 需登入 GitHub | 公開連結 |
| **版本追蹤** | 無 | Git tag |

## 使用情境

### 情境 1：下載最新版本

1. 前往 GitHub Repository
2. 點選 **Releases** 標籤
3. 找到最新的 Release（如 `v202511221330`）
4. 下載 `dist.zip`
5. 解壓縮後載入至 Figma

### 情境 2：追蹤穩定版本

- 每個 Release 都有明確的時間戳記
- 可快速識別哪個時間點的建置
- 易於回溯到特定版本

### 情境 3：分享給團隊

- 複製 Release 頁面連結
- 團隊成員可直接下載使用
- 無需 GitHub Actions 存取權限

### 情境 4：文件參考

- Release 說明包含安裝步驟
- 新使用者可快速上手
- 建置資訊完整記錄

## 技術細節

### ZIP 壓縮方式

```bash
cd dist
zip -r ../dist.zip .
```

**參數說明**：
- `-r`: 遞迴壓縮子目錄
- `../dist.zip`: 輸出至上層目錄
- `.`: 壓縮當前目錄的所有內容

**優點**：
- 壓縮檔內不包含 `dist/` 頂層目錄
- 解壓後直接得到 plugin 檔案
- 符合 Figma plugin 載入結構

### Release Tag 命名

```bash
RELEASE_TAG="v-${{ env.BRANCH_NAME }}"
```

**設計考量**：
- 使用 `v-` 前綴標示版本
- 保持與 CI 分支的對應關係
- 時間戳記確保唯一性
- 易於排序與搜尋

### GitHub Token

```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**說明**：
- 使用 GitHub 自動提供的 Token
- 無需手動設定 Secret
- 自動擁有建立 Release 的權限

## 效益

### 1. 永久保留
- Release 不會自動刪除
- 歷史版本可隨時取得
- 符合長期維護需求

### 2. 易於存取
- Releases 頁面集中管理
- 直接下載連結
- 無需瀏覽 Actions 歷史記錄

### 3. 版本追蹤
- Git tag 標記每個版本
- 時間戳記清楚標示
- 可與 commit 對應

### 4. 使用者友善
- 包含安裝指南
- 單一壓縮檔下載
- 開箱即用

### 5. 自動化
- 僅在有變更時建立
- 無需手動操作
- 與 CI/CD 整合

## 監控與驗證

### 檢查 Release 是否建立

**GitHub UI**：
1. 前往 Repository 首頁
2. 點選右側 **Releases** 區塊
3. 查看最新的 Release

**GitHub CLI**：
```bash
gh release list
```

**預期輸出**（有變更時）：
```
v202511221330  Release v202511221330  Latest  about 1 minute ago
v202511221200  Release v202511221200          about 2 hours ago
```

### Actions 日誌關鍵字

**有變更時**：
```
✓ Create release archive
Release archive created: dist.zip
-rw-r--r-- 1 runner docker 23M Nov 22 13:30 dist.zip

✓ Generate release tag
Release tag: v202511221330

✓ Create GitHub Release
Published release v202511221330
```

**無變更時**：
```
⏭ Create release archive (skipped)
⏭ Generate release tag (skipped)
⏭ Create GitHub Release (skipped)
```

## 測試驗證

### 測試案例 1：首次執行
**預期**：建立第一個 Release `v202511221330`

### 測試案例 2：連續執行（無變更）
**預期**：不建立新的 Release

### 測試案例 3：有變更後執行
**預期**：建立新的 Release `v202511221345`

### 測試案例 4：檢查 ZIP 內容
**操作**：
```bash
unzip -l dist.zip
```
**預期**：包含所有 dist 檔案，無頂層目錄

### 測試案例 5：下載與安裝
**操作**：
1. 從 Release 下載 `dist.zip`
2. 解壓縮
3. 在 Figma 中載入 `manifest.json`

**預期**：Plugin 正常載入與執行

## 安全性考量

### Token 權限
- 使用內建 `GITHUB_TOKEN`
- 權限範圍：Repository 內
- 自動輪換，無洩漏風險

### Release 可見性
- 公開 Repository：Release 公開可見
- 私有 Repository：僅有權限者可見
- 符合 Repository 設定

### 檔案完整性
- ZIP 由 GitHub Actions 建立
- 建置環境隔離且一致
- 可追溯至特定 commit

## 故障排除

### 問題 1：Release 建立失敗

**可能原因**：
- Tag 已存在
- Token 權限不足
- 網路問題

**解決方式**：
```yaml
# 檢查 Actions 日誌
# 確認 GITHUB_TOKEN 有正確設定
# 檢查 tag 是否重複
```

### 問題 2：ZIP 檔案損壞

**檢查**：
```bash
# 在本地測試壓縮
cd dist
zip -r ../test.zip .
unzip -t ../test.zip
```

### 問題 3：Release 說明未正確顯示

**原因**：Markdown 格式錯誤

**檢查**：
- 確認縮排正確
- YAML 多行字串使用 `|`
- 特殊字元正確轉義

## 相關文件

- [20251122-08-BUILD-WORKFLOW.md](./20251122-08-BUILD-WORKFLOW.md) - 建置工作流程
- [20251122-09-WORKFLOW-MANUAL-TRIGGER.md](./20251122-09-WORKFLOW-MANUAL-TRIGGER.md) - 手動觸發機制
- [20251122-10-CHANGE-DETECTION.md](./20251122-10-CHANGE-DETECTION.md) - 變更偵測
- [GitHub Actions - Creating releases](https://docs.github.com/actions/use-cases-and-examples/publishing-packages/creating-releases)

## 後續優化建議

1. **Release Notes 自動生成**
   - 列出變更的檔案清單
   - 顯示圖示數量變化
   - 比對與前版的差異

2. **版本號管理**
   - 支援語意化版本（Semantic Versioning）
   - 主版本、次版本、修訂號
   - 自動遞增版本號

3. **多格式支援**
   - 除了 ZIP，提供 tar.gz
   - 分離文件與程式檔案
   - 提供 checksum 檔案

4. **通知機制**
   - Release 建立後發送通知
   - Slack / Discord / Email 整合
   - 團隊即時收到更新通知

5. **Release 分類**
   - 標記為 stable / beta / alpha
   - 根據變更規模自動判斷
   - 使用 prerelease 標記測試版本
