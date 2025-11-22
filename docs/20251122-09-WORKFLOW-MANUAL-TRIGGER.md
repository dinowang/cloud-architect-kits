# GitHub Workflow 改為手動觸發並建立 CI 分支

**日期**: 2025-11-22  
**類型**: CI/CD 調整

## 概述

將 GitHub Actions workflow 改為僅手動觸發，執行時自動建立時間戳記命名的 CI 分支，並將所有建置產物提交至該分支。

## 變更內容

### 1. 移除自動觸發

**原本觸發條件**：
- Push 到 main/master 分支
- Pull Request 至 main/master 分支
- 手動觸發（workflow_dispatch）
- Tag 推送（用於 Release）

**調整後**：
- **僅手動觸發**（workflow_dispatch）

### 2. 新增 CI 分支建立機制

**分支命名規則**：
- 格式：`YYYYMMDDHHmm-ci`
- 使用 UTC 時間
- 範例：`202511221252-ci`

**實作方式**：
```yaml
- name: Create CI branch
  run: |
    BRANCH_NAME="$(date -u +'%Y%m%d%H%M')-ci"
    echo "BRANCH_NAME=$BRANCH_NAME" >> $GITHUB_ENV
    git config user.name "github-actions[bot]"
    git config user.email "github-actions[bot]@users.noreply.github.com"
    git checkout -b "$BRANCH_NAME"
```

### 3. 智慧差異偵測

**新增步驟**：
```yaml
- name: Check for changes in dist
  id: check_changes
  run: |
    # 尋找最近的 CI 分支
    LATEST_CI_BRANCH=$(git branch -r | grep 'origin/.*-ci$' | grep -v "${{ env.BRANCH_NAME }}" | sort -r | head -1)
    
    # 比對 dist 目錄差異
    if diff -qr dist/ dist_old/ > /dev/null 2>&1; then
      echo "has_changes=false" >> $GITHUB_OUTPUT
    else
      echo "has_changes=true" >> $GITHUB_OUTPUT
    fi
```

**偵測邏輯**：
- 自動抓取前一版 CI 分支的 `dist/` 目錄
- 使用 `diff` 完整比對檔案內容
- 若無差異則終止建置流程
- 首次建置或比對失敗則自動繼續

### 4. 建置產物提交至 CI 分支

**新增步驟**（僅在有變更時執行）：
```yaml
- name: Commit and push to CI branch
  if: steps.check_changes.outputs.has_changes == 'true'
  run: |
    git add -A
    git commit -m "CI Build - ${{ env.BRANCH_NAME }}" || echo "No changes to commit"
    git push origin "${{ env.BRANCH_NAME }}"
```

**提交內容**：
- 所有下載的圖示來源（`temp/` 目錄）
- 建置產物（`dist/` 目錄）
- 處理後的圖示與索引（`src/figma-cloudarchitect/icons/`, `icons.json` 等）
- Node.js 編譯結果（`code.js`, `ui-built.html`）

### 5. 移除 Release 相關功能

**移除步驟**：
- Create release archive（建立 ZIP 壓縮檔）
- Create Release（GitHub Release 發布）

**保留功能**（僅在有變更時執行）：
- Upload artifact（上傳建置產物，保留 30 天）
- Artifact 命名改用分支名稱：`figma-cloudarchitect-{BRANCH_NAME}`

## 工作流程

### 執行方式

1. 前往 GitHub Repository
2. 點選 **Actions** 標籤
3. 選擇 **Build and Release** workflow
4. 點選 **Run workflow** 按鈕
5. 確認執行

### 執行步驟

```
1. Checkout repository
2. Create CI branch (YYYYMMDDHHmm-ci)
   ├─ 設定 Git 使用者資訊
   └─ 建立並切換至新分支
3. Setup Node.js (v20)
4. Download icons (7 sources)
   ├─ Azure Architecture Icons
   ├─ Microsoft 365 Icons
   ├─ Dynamics 365 Icons
   ├─ Microsoft Entra Icons
   ├─ Power Platform Icons
   ├─ Kubernetes Icons
   └─ Gilbarbara Logos
5. Install dependencies (npm ci)
6. Build plugin
   ├─ Process icons
   ├─ Build UI
   └─ Compile TypeScript
7. Prepare distribution
8. Check for changes in dist ⭐ 新增
   ├─ Fetch previous CI branches
   ├─ Compare dist with latest CI branch
   └─ Set has_changes flag
9. [條件] 若有變更：
   ├─ Commit and push to CI branch
   └─ Upload artifact (30 days retention)
10. [條件] 若無變更：
    └─ Skip and exit (顯示警告訊息)
```

### 建置結果

**CI 分支內容**：
- 完整的原始碼
- 所有下載的圖示來源
- 編譯後的程式碼
- Distribution 檔案
- Node modules（如果包含在 commit 中）

**Artifact 內容**：
- `dist/` 目錄內所有檔案
- 可直接下載使用
- 保留 30 天

## 優勢

### 1. 可控性
- 完全控制建置時機
- 避免不必要的自動建置
- 節省 GitHub Actions 使用額度

### 2. 可追溯性
- 每次建置獨立分支
- 時間戳記清楚標示建置時間點
- 完整保留建置產物與來源

### 3. 版本管理
- CI 分支可用於測試驗證
- 需要時可 merge 回主分支
- 歷史記錄完整保存

### 4. 協作友善
- 多人可同時執行建置（不同時間戳記）
- 不影響主分支
- 易於比對不同時間點的建置差異

### 5. 智慧效率 ⭐ 新增
- 自動偵測 `dist/` 內容變更
- 無變更時跳過 commit 與 artifact 上傳
- 避免產生冗餘的 CI 分支
- 節省儲存空間與 Actions 配額

## 分支管理建議

### 定期清理舊分支

```bash
# 列出所有 CI 分支
git branch -r | grep '-ci$'

# 刪除本地 CI 分支（超過 30 天）
git branch | grep '-ci$' | while read branch; do
  git branch -d $branch
done

# 刪除遠端 CI 分支（範例）
git push origin --delete 202511221252-ci
```

### 自動化清理（可選）

可考慮建立另一個 GitHub Action 定期清理舊的 CI 分支：
- 每週執行一次
- 刪除超過 30 天的 CI 分支
- 保留最近 5 個 CI 分支

## 使用情境

### 情境 1：定期建置
手動觸發建置，產生最新版本供測試使用。

### 情境 2：圖示更新
Microsoft 更新圖示後，手動執行建置更新所有圖示。

### 情境 3：緊急修復
修改程式碼後，立即手動建置驗證修正結果。

### 情境 4：版本發布準備
發布前手動建置，從 CI 分支取得 distribution 檔案進行最終測試。

### 情境 5：驗證無變更 ⭐ 新增
懷疑圖示來源未更新時，執行建置驗證是否有實際變更。若無變更，系統自動跳過 release。

## 文件更新

### README.md
更新 GitHub Actions 說明，移除自動觸發相關描述。

### docs/20251122-08-BUILD-WORKFLOW.md
更新建置流程說明，反映手動觸發與 CI 分支機制。

## 相關文件

- [20251122-08-BUILD-WORKFLOW.md](./20251122-08-BUILD-WORKFLOW.md) - 建置工作流程說明
- [README.md](../README.md) - 專案說明
- [GitHub Actions 文件](https://docs.github.com/actions)
