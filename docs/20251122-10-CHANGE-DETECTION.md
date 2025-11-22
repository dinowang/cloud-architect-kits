# GitHub Workflow 新增智慧變更偵測

**日期**: 2025-11-22  
**類型**: CI/CD 優化

## 概述

在 GitHub Actions workflow 中新增智慧變更偵測機制，自動比對 `./dist/` 目錄與前一版 CI 分支的差異。若無變更則跳過 CI 分支建立與 Artifact 上傳，避免產生冗餘的建置結果。

## 問題背景

### 原有問題
- 每次手動觸發建置都會建立新的 CI 分支
- 即使圖示來源未更新，仍會產生新的建置產物
- 浪費 GitHub 儲存空間與 Actions 配額
- 難以快速識別是否有實際更新

### 期望目標
- 自動偵測建置結果是否有實際變更
- 無變更時跳過 CI 分支建立與上傳
- 明確告知使用者無變更的情況

## 解決方案

### 新增步驟：Check for changes in dist

位於 **Prepare distribution** 之後，**Commit and push** 之前。

#### 實作邏輯

```yaml
- name: Check for changes in dist
  id: check_changes
  run: |
    # 1. 抓取所有遠端 CI 分支
    git fetch origin '+refs/heads/*-ci:refs/remotes/origin/*-ci' || true
    
    # 2. 尋找最近的 CI 分支（排除當前分支）
    LATEST_CI_BRANCH=$(git branch -r | grep 'origin/.*-ci$' | grep -v "${{ env.BRANCH_NAME }}" | sort -r | head -1 | sed 's/^[[:space:]]*//')
    
    # 3. 若無前版，視為有變更
    if [ -z "$LATEST_CI_BRANCH" ]; then
      echo "No previous CI branch found, proceeding with release"
      echo "has_changes=true" >> $GITHUB_OUTPUT
      exit 0
    fi
    
    # 4. 從前版 CI 分支取出 dist 目錄
    git checkout "$LATEST_CI_BRANCH" -- dist/ 2>/dev/null || {
      echo "Could not checkout dist from previous branch, proceeding with release"
      echo "has_changes=true" >> $GITHUB_OUTPUT
      git checkout "${{ env.BRANCH_NAME }}"
      exit 0
    }
    
    # 5. 備份舊版 dist
    mv dist dist_old
    
    # 6. 重新產生當前 dist
    mkdir -p dist
    cp manifest.json dist/
    cp src/figma-cloudarchitect/code.js dist/
    cp src/figma-cloudarchitect/ui-built.html dist/
    cp src/figma-cloudarchitect/icons.json dist/ || true
    cp -r src/figma-cloudarchitect/icons dist/ || true
    cp README.md dist/
    cp INSTALL.md dist/
    
    # 7. 使用 diff 比對差異
    if diff -qr dist/ dist_old/ > /dev/null 2>&1; then
      echo "No changes detected in dist folder"
      echo "has_changes=false" >> $GITHUB_OUTPUT
    else
      echo "Changes detected in dist folder"
      echo "has_changes=true" >> $GITHUB_OUTPUT
    fi
    
    # 8. 清理
    rm -rf dist_old
```

### 條件式執行

#### Commit and push to CI branch
```yaml
- name: Commit and push to CI branch
  if: steps.check_changes.outputs.has_changes == 'true'
  run: |
    git add -A
    git commit -m "CI Build - ${{ env.BRANCH_NAME }}" || echo "No changes to commit"
    git push origin "${{ env.BRANCH_NAME }}"
```

#### Skip build (no changes)
```yaml
- name: Skip build (no changes)
  if: steps.check_changes.outputs.has_changes == 'false'
  run: |
    echo "⚠️ No changes detected in dist folder compared to previous build"
    echo "Skipping commit and artifact upload"
    echo "CI branch ${{ env.BRANCH_NAME }} will not be created"
```

#### Upload artifact
```yaml
- name: Upload artifact
  if: steps.check_changes.outputs.has_changes == 'true'
  uses: actions/upload-artifact@v4
  with:
    name: figma-cloudarchitect-${{ env.BRANCH_NAME }}
    path: dist/
    retention-days: 30
```

## 技術細節

### 分支抓取策略

```bash
git fetch origin '+refs/heads/*-ci:refs/remotes/origin/*-ci'
```
- 使用萬用字元 `*-ci` 抓取所有 CI 分支
- `+` 強制更新本地參考
- `|| true` 容錯處理（首次執行無分支時）

### 分支篩選與排序

```bash
LATEST_CI_BRANCH=$(git branch -r | grep 'origin/.*-ci$' | grep -v "$BRANCH_NAME" | sort -r | head -1)
```
- `grep 'origin/.*-ci$'` - 過濾 CI 分支
- `grep -v "$BRANCH_NAME"` - 排除當前分支
- `sort -r` - 反向排序（最新在前）
- `head -1` - 取第一個（最新）

### 差異比對方法

使用 `diff -qr` 進行遞迴比對：
- `-q` - 安靜模式（僅輸出是否有差異）
- `-r` - 遞迴比對子目錄
- 比對內容包含：
  - 檔案內容（位元組層級）
  - 檔案結構（新增/刪除/重新命名）
  - 子目錄結構

### 容錯處理

#### 情境 1：首次建置（無前版）
```bash
if [ -z "$LATEST_CI_BRANCH" ]; then
  echo "has_changes=true" >> $GITHUB_OUTPUT
  exit 0
fi
```
**處理**：視為有變更，繼續建置。

#### 情境 2：無法取得前版 dist
```bash
git checkout "$LATEST_CI_BRANCH" -- dist/ 2>/dev/null || {
  echo "has_changes=true" >> $GITHUB_OUTPUT
  git checkout "${{ env.BRANCH_NAME }}"
  exit 0
}
```
**處理**：視為有變更，繼續建置。

#### 情境 3：比對過程發生錯誤
預設行為會中斷執行，確保不會在不確定的情況下跳過建置。

## 工作流程範例

### 情境 A：有變更

```
1. 執行建置
2. 準備 dist
3. 檢查變更 → 偵測到差異
4. ✅ 提交至 CI 分支 202511221255-ci
5. ✅ 上傳 Artifact
6. 完成
```

**結果**：
- 建立新的 CI 分支
- 上傳 Artifact
- 可從 Actions 頁面下載

### 情境 B：無變更

```
1. 執行建置
2. 準備 dist
3. 檢查變更 → 無差異
4. ⚠️ 顯示警告訊息
5. ⏭️ 跳過提交與上傳
6. 完成（不建立分支）
```

**結果**：
- 不建立 CI 分支
- 不上傳 Artifact
- Actions 日誌顯示跳過原因

### 情境 C：首次建置

```
1. 執行建置
2. 準備 dist
3. 檢查變更 → 無前版可比對
4. ℹ️ 顯示首次建置訊息
5. ✅ 提交至 CI 分支 202511221300-ci
6. ✅ 上傳 Artifact
7. 完成
```

**結果**：
- 視為有變更
- 建立第一個 CI 分支
- 上傳 Artifact

## 效益

### 1. 節省資源
- 避免產生冗餘的 CI 分支
- 減少 GitHub 儲存空間使用
- 降低 Actions 執行時間（跳過 push 與 upload）

### 2. 明確回饋
- 清楚告知使用者無變更
- Actions 日誌可快速識別結果
- 避免誤以為建置失敗

### 3. 版本管理
- 只保留有實際變更的版本
- CI 分支數量更有意義
- 易於追蹤真正的更新歷程

### 4. 開發體驗
- 可安心多次執行建置
- 不擔心產生大量無用分支
- 快速驗證圖示是否更新

## 測試驗證

### 測試案例 1：連續執行兩次建置（無程式碼變更）
**預期**：第二次執行應跳過 commit 與 upload

### 測試案例 2：修改 manifest.json 後建置
**預期**：偵測到變更，正常建立 CI 分支

### 測試案例 3：僅修改 README.md（不影響 dist）
**預期**：dist 無變更，跳過 release

### 測試案例 4：圖示來源更新後建置
**預期**：dist 有變更，正常建立 CI 分支

### 測試案例 5：首次執行 workflow
**預期**：無前版可比對，正常建立 CI 分支

## 監控建議

### GitHub Actions 日誌關鍵字

**有變更時**：
```
Changes detected in dist folder
✓ Commit and push to CI branch
✓ Upload artifact
```

**無變更時**：
```
No changes detected in dist folder
⚠️ No changes detected in dist folder compared to previous build
Skipping commit and artifact upload
CI branch 202511221255-ci will not be created
```

**首次建置時**：
```
No previous CI branch found, proceeding with release
✓ Commit and push to CI branch
✓ Upload artifact
```

## 相關文件

- [20251122-08-BUILD-WORKFLOW.md](./20251122-08-BUILD-WORKFLOW.md) - 建置工作流程說明
- [20251122-09-WORKFLOW-MANUAL-TRIGGER.md](./20251122-09-WORKFLOW-MANUAL-TRIGGER.md) - 手動觸發機制
- [README.md](../README.md) - 專案說明

## 後續優化建議

1. **差異摘要**：輸出變更的檔案清單
2. **變更統計**：顯示新增/修改/刪除的檔案數量
3. **大小比較**：顯示 dist 目錄大小變化
4. **雜湊驗證**：使用 SHA256 加速比對（大檔案場景）
5. **通知機制**：無變更時可選擇性發送通知
