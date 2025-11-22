# GitHub Workflow 分離 Release 階段

**日期**: 2025-11-22  
**類型**: CI/CD 重構

## 概述

將 GitHub Actions workflow 重構為兩個獨立的 Jobs：`build` 和 `release`。Release Job 僅在 Build Job 偵測到變更時才執行，提升工作流程的可讀性與維護性。

## 變更背景

### 原有架構

單一 `build` Job 包含所有步驟：
```
build Job:
  ├─ Checkout & Setup
  ├─ Download icons
  ├─ Build plugin
  ├─ Check changes
  ├─ Commit & Upload artifact
  ├─ Create release archive
  ├─ Generate release tag
  └─ Create GitHub Release
```

**問題**：
- 所有步驟混在一起，不易維護
- Release 相關步驟使用條件判斷，但仍在同一 Job
- 難以追蹤 Build 與 Release 的分界
- 無法單獨重試 Release 步驟

### 期望架構

分離為兩個獨立 Jobs：
```
build Job → release Job
   ↓           ↑
outputs    needs: build
```

**優點**：
- 責任明確分離
- Release Job 可獨立重試
- 易於擴展（未來可加入更多 Jobs）
- 符合 CI/CD 最佳實踐

## 解決方案

### 架構設計

```yaml
jobs:
  build:
    outputs:
      has_changes: ${{ steps.check_changes.outputs.has_changes }}
      branch_name: ${{ steps.create_branch.outputs.branch_name }}
    steps:
      # Build 相關步驟
      
  release:
    needs: build
    if: needs.build.outputs.has_changes == 'true'
    steps:
      # Release 相關步驟
```

### Build Job 變更

#### 1. 新增 outputs 定義

```yaml
build:
  runs-on: ubuntu-latest
  outputs:
    has_changes: ${{ steps.check_changes.outputs.has_changes }}
    branch_name: ${{ steps.create_branch.outputs.branch_name }}
```

**說明**：
- `has_changes`: 傳遞變更偵測結果給 Release Job
- `branch_name`: 傳遞分支名稱（用於下載 Artifact 與命名 Release）

#### 2. Create CI branch 新增輸出

```yaml
- name: Create CI branch
  id: create_branch
  run: |
    BRANCH_NAME="$(date -u +'%Y%m%d%H%M')-ci"
    echo "BRANCH_NAME=$BRANCH_NAME" >> $GITHUB_ENV
    echo "branch_name=$BRANCH_NAME" >> $GITHUB_OUTPUT  # 新增
```

**變更**：
- 新增 `id: create_branch`
- 輸出 `branch_name` 至 `GITHUB_OUTPUT`

#### 3. 移除 Release 相關步驟

移除以下步驟（移至 Release Job）：
- Create release archive
- Generate release tag
- Create GitHub Release

### Release Job 建立

#### 1. Job 定義

```yaml
release:
  runs-on: ubuntu-latest
  needs: build
  if: needs.build.outputs.has_changes == 'true'
```

**說明**：
- `needs: build`: 依賴 Build Job 完成
- `if`: 僅在有變更時執行

#### 2. 步驟定義

##### Step 1: Download artifact

```yaml
- name: Download artifact
  uses: actions/download-artifact@v4
  with:
    name: figma-cloudarchitect-${{ needs.build.outputs.branch_name }}
    path: dist/
```

**功能**：
- 下載 Build Job 上傳的 Artifact
- 使用 `needs.build.outputs.branch_name` 取得正確名稱

##### Step 2: Create release archive

```yaml
- name: Create release archive
  run: |
    cd dist
    zip -r ../dist.zip .
    cd ..
    echo "Release archive created: dist.zip"
    ls -lh dist.zip
```

**功能**：
- 壓縮 `dist/` 目錄為 `dist.zip`
- 與原有邏輯相同

##### Step 3: Generate release tag

```yaml
- name: Generate release tag
  id: release_tag
  run: |
    RELEASE_TAG="v-${{ needs.build.outputs.branch_name }}"
    echo "RELEASE_TAG=$RELEASE_TAG" >> $GITHUB_ENV
    echo "Release tag: $RELEASE_TAG"
```

**功能**：
- 使用 `needs.build.outputs.branch_name` 產生 Tag
- 移除條件判斷（由 Job level 控制）

##### Step 4: Create GitHub Release

```yaml
- name: Create GitHub Release
  uses: softprops/action-gh-release@v1
  with:
    tag_name: ${{ env.RELEASE_TAG }}
    name: Release ${{ env.RELEASE_TAG }}
    body: |
      ## Figma Cloud Architect Plugin - Build ${{ needs.build.outputs.branch_name }}
      
      ### Build Information
      - **Build Time**: ${{ needs.build.outputs.branch_name }}
      - **Commit**: ${{ github.sha }}
      - **Branch**: ${{ needs.build.outputs.branch_name }}
      
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

**變更**：
- 使用 `needs.build.outputs.branch_name` 取代 `env.BRANCH_NAME`
- 移除條件判斷

## 資料流向

### 變數傳遞

```
Build Job                    Release Job
─────────                    ───────────
Create CI branch
  ├─ BRANCH_NAME → ENV
  └─ branch_name → OUTPUT ──→ needs.build.outputs.branch_name

Check for changes
  └─ has_changes → OUTPUT ──→ needs.build.outputs.has_changes
                                     ↓
                              if: needs.build.outputs.has_changes == 'true'
```

### Artifact 傳遞

```
Build Job                    Release Job
─────────                    ───────────
Upload artifact
  └─ name: figma-cloudarchitect-{branch_name}
          path: dist/
                ↓
          [GitHub Storage]
                ↓
         Download artifact ←─┐
           name: figma-cloudarchitect-{needs.build.outputs.branch_name}
           path: dist/
```

## 執行流程

### 情境 A：有變更

```
1. Build Job 開始
2. Build & Check changes → has_changes=true
3. Commit & Upload artifact
4. Build Job 完成 ✓
5. Release Job 開始（條件符合）
6. Download artifact
7. Create release archive
8. Generate release tag
9. Create GitHub Release
10. Release Job 完成 ✓
```

**GitHub UI 顯示**：
```
Build and Release
├─ build ✓ (5m 32s)
└─ release ✓ (1m 15s)
```

### 情境 B：無變更

```
1. Build Job 開始
2. Build & Check changes → has_changes=false
3. Skip commit & upload
4. Build Job 完成 ✓
5. Release Job 跳過（條件不符合）
```

**GitHub UI 顯示**：
```
Build and Release
├─ build ✓ (5m 32s)
└─ release ⊘ (skipped)
```

### 情境 C：Build 失敗

```
1. Build Job 開始
2. Build error → Job fails ✗
3. Release Job 不執行（依賴未完成）
```

**GitHub UI 顯示**：
```
Build and Release
├─ build ✗ (3m 45s)
└─ release ⊘ (skipped)
```

## 技術細節

### Job Outputs

#### 定義 Outputs

```yaml
jobs:
  build:
    outputs:
      has_changes: ${{ steps.check_changes.outputs.has_changes }}
      branch_name: ${{ steps.create_branch.outputs.branch_name }}
```

**注意事項**：
- 必須參照 step 的 `outputs`
- Step 必須有 `id` 才能被參照
- 格式：`${{ steps.<step_id>.outputs.<output_name> }}`

#### 使用 Outputs

```yaml
jobs:
  release:
    needs: build
    if: needs.build.outputs.has_changes == 'true'
```

**格式**：
- `needs.<job_id>.outputs.<output_name>`
- 可用於 `if` 條件判斷
- 可用於 step 的參數

### Artifacts 傳遞

#### Upload（Build Job）

```yaml
- name: Upload artifact
  uses: actions/upload-artifact@v4
  with:
    name: figma-cloudarchitect-${{ env.BRANCH_NAME }}
    path: dist/
    retention-days: 30
```

#### Download（Release Job）

```yaml
- name: Download artifact
  uses: actions/download-artifact@v4
  with:
    name: figma-cloudarchitect-${{ needs.build.outputs.branch_name }}
    path: dist/
```

**注意**：
- 名稱必須完全一致
- 在同一個 workflow run 內有效
- 不需要等待（自動等待依賴完成）

### Job 依賴

```yaml
release:
  needs: build
  if: needs.build.outputs.has_changes == 'true'
```

**行為**：
- Release Job 等待 Build Job 完成
- Build Job 成功才執行 Release Job
- Build Job 失敗則跳過 Release Job
- 條件不符合也跳過 Release Job

## 優勢

### 1. 職責分離
- Build Job 專注於建置與測試
- Release Job 專注於發布
- 易於理解與維護

### 2. 可重試性
- Release 失敗可單獨重試
- 不需要重新執行整個建置
- 節省時間與資源

### 3. 易於擴展
- 可輕鬆加入更多 Jobs
- 例如：test Job、deploy Job
- 保持每個 Job 簡潔

### 4. 可讀性
- GitHub UI 清楚顯示兩個階段
- 易於追蹤各階段狀態
- 日誌分離，易於除錯

### 5. 最佳實踐
- 符合 CI/CD pipeline 設計原則
- 單一責任原則
- 依賴關係明確

## 監控與除錯

### GitHub UI

**正常流程（有變更）**：
```
Build and Release
├─ build ✓ 5m 32s
└─ release ✓ 1m 15s
   Total: 6m 47s
```

**跳過 Release（無變更）**：
```
Build and Release
├─ build ✓ 5m 32s
└─ release ⊘ skipped
   Total: 5m 32s
```

**Build 失敗**：
```
Build and Release
├─ build ✗ 3m 45s
└─ release ⊘ skipped
   Total: 3m 45s
```

### 日誌關鍵字

**Build Job 輸出**：
```
Set output: branch_name=202511221430-ci
Set output: has_changes=true
```

**Release Job 日誌**：
```
Download artifact 'figma-cloudarchitect-202511221430-ci'
Release archive created: dist.zip
Release tag: v202511221430-ci
Published release v202511221430-ci
```

### 除錯技巧

#### 問題：Release Job 沒有執行

**檢查**：
1. Build Job 是否成功完成
2. `has_changes` 輸出是否為 `true`
3. 條件判斷是否正確

**日誌位置**：
```
Build Job → Set up job → View raw logs
查找：has_changes=true
```

#### 問題：Download artifact 失敗

**可能原因**：
- Artifact 名稱不一致
- Build Job 未上傳 Artifact
- Artifact 已過期（30 天）

**檢查**：
```
Build Job → Upload artifact
Release Job → Download artifact
比對名稱是否一致
```

#### 問題：Release 建立失敗

**可能原因**：
- Tag 已存在
- Token 權限不足
- 網路問題

**解決**：
- 刪除既有 Tag 後重試
- 確認 permissions: contents: write
- 檢查 GitHub 狀態頁面

## 與舊版本的差異

| 項目 | 舊版（單一 Job） | 新版（分離 Jobs） |
|------|-----------------|------------------|
| **結構** | 所有步驟在一個 Job | Build + Release 兩個 Jobs |
| **條件判斷** | 每個 Release 步驟都有 if | Job level 條件判斷 |
| **重試** | 需重新執行所有步驟 | 可單獨重試 Release Job |
| **可讀性** | 較難區分階段 | 清楚的階段劃分 |
| **擴展性** | 較難加入新階段 | 易於加入新 Jobs |
| **執行時間** | 相同 | 相同 |
| **資源使用** | 相同 | 相同 |

## 測試驗證

### 測試案例 1：首次執行（有變更）

**預期**：
- Build Job 完成 ✓
- has_changes=true
- Release Job 執行 ✓
- 建立 Release

### 測試案例 2：連續執行（無變更）

**預期**：
- Build Job 完成 ✓
- has_changes=false
- Release Job 跳過 ⊘

### 測試案例 3：Build 失敗

**預期**：
- Build Job 失敗 ✗
- Release Job 跳過 ⊘

### 測試案例 4：手動重試 Release

**操作**：
1. 完整執行一次
2. 從 GitHub UI 重試 Release Job

**預期**：
- 僅 Release Job 重新執行
- 不重新執行 Build Job

## 相關文件

- [20251122-08-BUILD-WORKFLOW.md](./20251122-08-BUILD-WORKFLOW.md) - 建置工作流程
- [20251122-09-WORKFLOW-MANUAL-TRIGGER.md](./20251122-09-WORKFLOW-MANUAL-TRIGGER.md) - 手動觸發機制
- [20251122-10-CHANGE-DETECTION.md](./20251122-10-CHANGE-DETECTION.md) - 變更偵測
- [20251122-11-AUTO-RELEASE.md](./20251122-11-AUTO-RELEASE.md) - 自動 Release
- [GitHub Actions - Using jobs](https://docs.github.com/actions/using-jobs)

## 後續優化建議

1. **加入 Test Job**
   - 在 Build 與 Release 之間
   - 執行自動化測試
   - 測試通過才執行 Release

2. **加入 Notify Job**
   - 在 Release 之後
   - 發送通知（Slack/Discord/Email）
   - 使用 `if: always()` 確保執行

3. **矩陣建置**
   - 支援多個環境/版本
   - 平行執行加速建置
   - 統一 Release

4. **快取優化**
   - 快取 node_modules
   - 快取已下載的圖示
   - 加速後續建置

5. **條件式 Release**
   - 根據變更類型決定 Release 類型
   - 主要變更：正式版
   - 次要變更：預覽版
   - 自動判斷版本號
