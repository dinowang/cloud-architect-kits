# GitHub Actions 權限設定

**日期**: 2025-11-22  
**類型**: CI/CD 配置

## 概述

為了讓 GitHub Actions workflow 能夠在執行過程中建立分支並推送變更，需要明確設定 `contents: write` 權限。

## 問題背景

### 原本問題

GitHub Actions 的預設權限政策從 2023 年開始改變：
- 新建立的 repository 預設使用**唯讀權限**（`contents: read`）
- 工作流程無法執行 `git push` 或建立分支
- 會出現權限拒絕錯誤（Permission denied）

### 錯誤訊息範例

```
remote: Permission to user/repo.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/user/repo/': The requested URL returned error: 403
```

## 解決方案

### 在 Workflow 中設定權限

在 `.github/workflows/build-and-release.yml` 中新增 `permissions` 區段：

```yaml
name: Build and Release

on:
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # ... 其他步驟
```

### 權限說明

#### `contents: write`
- **用途**: 允許工作流程讀取和寫入 repository 內容
- **操作權限**:
  - ✅ 建立分支（`git checkout -b`）
  - ✅ 提交變更（`git commit`）
  - ✅ 推送至 repository（`git push`）
  - ✅ 建立標籤（`git tag`）
  - ✅ 讀取檔案內容

#### 其他常見權限

```yaml
permissions:
  contents: write        # 讀寫 repository 內容
  pull-requests: write   # 建立和更新 PR
  issues: write          # 建立和更新 Issue
  actions: read          # 讀取 Actions 執行記錄
```

## 實際應用場景

### 本專案使用情境

在 `build-and-release.yml` workflow 中：

1. **建立 CI 分支**（需要 `contents: write`）
```yaml
- name: Create CI branch
  run: |
    BRANCH_NAME="$(date -u +'%Y%m%d%H%M')-ci"
    git config user.name "github-actions[bot]"
    git config user.email "github-actions[bot]@users.noreply.github.com"
    git checkout -b "$BRANCH_NAME"
```

2. **提交並推送變更**（需要 `contents: write`）
```yaml
- name: Commit and push to CI branch
  run: |
    git add -A
    git commit -m "CI Build - ${{ env.BRANCH_NAME }}"
    git push origin "${{ env.BRANCH_NAME }}"
```

## 安全性考量

### 最小權限原則

只授予工作流程所需的最小權限：
- ✅ **正確**: 僅設定 `contents: write`（本專案需求）
- ❌ **不建議**: 使用過度寬鬆的權限
- ❌ **避免**: 不設定權限導致無法執行

### Repository 設定

#### 檢查 Repository 權限設定

1. 前往 GitHub Repository
2. Settings → Actions → General
3. 找到 "Workflow permissions" 區段
4. 確認設定為以下之一：
   - **Read and write permissions** - 適用於舊 repository
   - **Read repository contents and packages permissions** - 新 repository（需要在 workflow 中明確設定權限）

#### 建議設定

對於新 repository：
- 保持預設的 "Read repository contents and packages permissions"
- 在 workflow YAML 中明確設定所需權限（如本專案）
- 這樣更符合安全最佳實踐

## 權限範圍

### Workflow 層級

在 workflow 檔案頂層設定（本專案採用）：
```yaml
permissions:
  contents: write

jobs:
  # 所有 job 都繼承此權限
```

### Job 層級

針對特定 job 設定權限：
```yaml
jobs:
  build:
    permissions:
      contents: write
    steps:
      # 僅此 job 擁有 write 權限
```

### 差異比較

| 設定層級 | 影響範圍 | 使用時機 |
|---------|---------|---------|
| Workflow | 所有 jobs | 所有 jobs 都需要相同權限 |
| Job | 單一 job | 只有特定 job 需要特殊權限 |

**本專案選擇**: Workflow 層級，因為只有一個 job 且需要 write 權限。

## 常見問題

### Q1: 為什麼之前不需要設定權限？

**A**: GitHub 在 2023 年改變了新 repository 的預設權限政策。舊 repository 可能仍使用舊的預設設定（自動擁有 write 權限）。

### Q2: 沒有設定權限會發生什麼？

**A**: Workflow 只能讀取內容，無法：
- 建立或推送分支
- 建立 Pull Request
- 建立 Release
- 修改檔案

### Q3: 可以不設定 permissions 而改用 PAT (Personal Access Token) 嗎？

**A**: 可以，但不建議：
- PAT 管理較複雜
- 需要額外的 Secret 設定
- 使用 `GITHUB_TOKEN` 更安全且方便
- 明確設定 `permissions` 是最佳實踐

### Q4: 設定 `contents: write` 是否有安全風險？

**A**: 在正常情況下是安全的：
- 權限僅限於當前 repository
- 僅 workflow 執行時有效
- GitHub Actions 有完整的稽核記錄
- 建議定期檢查 workflow 執行記錄

## 驗證方式

### 檢查權限是否正確設定

1. **查看 Workflow 檔案**
```bash
cat .github/workflows/build-and-release.yml | grep -A 2 "permissions:"
```

2. **執行 Workflow**
   - 前往 Actions → Build and Release → Run workflow
   - 觀察 "Create CI branch" 步驟是否成功
   - 觀察 "Commit and push to CI branch" 步驟是否成功

3. **檢查結果**
   - 確認新的 CI 分支已建立
   - 確認 commit 已推送至遠端

## 相關資源

### GitHub 官方文件
- [Workflow syntax - permissions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions)
- [Automatic token authentication](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [Setting permissions for GITHUB_TOKEN](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)

### 相關文件
- [20251122-08-BUILD-WORKFLOW.md](./20251122-08-BUILD-WORKFLOW.md) - 建置工作流程說明
- [20251122-09-WORKFLOW-MANUAL-TRIGGER.md](./20251122-09-WORKFLOW-MANUAL-TRIGGER.md) - 手動觸發與 CI 分支機制
- [README.md](../README.md) - 專案說明

## 總結

### 必要設定

為了在 GitHub Actions 中建立分支並推送變更，必須：

1. ✅ 在 workflow 檔案中加入 `permissions: contents: write`
2. ✅ 確保 Git 使用者資訊正確設定
3. ✅ 使用 `GITHUB_TOKEN` 進行認證（自動提供）

### 本專案實作

```yaml
permissions:
  contents: write
```

這個簡單的設定讓 workflow 能夠：
- 建立時間戳記命名的 CI 分支
- 提交建置產物至分支
- 推送至遠端 repository
- 實現完整的自動化建置流程

### 安全建議

- ✅ 僅授予必要權限（本專案僅需 `contents: write`）
- ✅ 在 workflow 檔案中明確宣告權限
- ✅ 定期檢視 Actions 執行記錄
- ✅ 了解每個權限的用途
