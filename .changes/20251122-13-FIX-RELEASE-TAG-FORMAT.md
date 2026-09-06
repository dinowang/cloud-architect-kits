# 修正 Release Tag 格式

**日期**: 2025-11-22  
**類型**: Bug Fix

## 概述

修正 GitHub Release tag 命名格式，從 `v-YYYYMMDDHHmm-ci` 改為正確的 `vYYYYMMDDHHmm` 格式。

## 問題描述

### 原有問題

Release Job 的 `Generate release tag` 步驟使用了錯誤的格式：

```yaml
RELEASE_TAG="v-${{ needs.build.outputs.branch_name }}"
```

**結果**：
- Branch name: `202511221342-ci`
- Release tag: `v-202511221342-ci` ❌

**問題**：
- 包含不必要的破折號 (`-`)
- 包含 CI 分支後綴 (`-ci`)
- 不符合預期的版本標籤格式

### 期望格式

Release tag 應該是：
- 格式：`vYYYYMMDDHHmm`
- 範例：`v202511221342`

## 解決方案

### Workflow 修正

修改 `.github/workflows/build-and-release.yml` 中的 `Generate release tag` 步驟：

```yaml
- name: Generate release tag
  id: release_tag
  run: |
    # Extract timestamp from branch name (remove -ci suffix)
    TIMESTAMP="${{ needs.build.outputs.branch_name }}"
    TIMESTAMP="${TIMESTAMP%-ci}"
    RELEASE_TAG="v${TIMESTAMP}"
    echo "RELEASE_TAG=$RELEASE_TAG" >> $GITHUB_ENV
    echo "Release tag: $RELEASE_TAG"
```

**變更說明**：
1. 從 `branch_name` 移除 `-ci` 後綴
2. 組合 `v` 前綴與時間戳記（無破折號）
3. 產生正確格式：`vYYYYMMDDHHmm`

### 技術細節

#### Bash 字串處理

```bash
TIMESTAMP="${{ needs.build.outputs.branch_name }}"  # 202511221342-ci
TIMESTAMP="${TIMESTAMP%-ci}"                         # 202511221342
RELEASE_TAG="v${TIMESTAMP}"                          # v202511221342
```

**語法說明**：
- `${TIMESTAMP%-ci}`: 移除結尾的 `-ci` 後綴
- `v${TIMESTAMP}`: 直接串接，無破折號

### 文檔更新

批量更新所有文檔中的 tag 格式參考：

```bash
sed -i '' 's/v-YYYYMMDDHHmm/vYYYYMMDDHHmm/g' README.md docs/20251122-*.md
sed -i '' 's/v-202511\([0-9]\{6\}\)/v202511\1/g' docs/20251122-*.md
```

**更新的文件**：
- `README.md`
- `docs/20251122-08-BUILD-WORKFLOW.md`
- `docs/20251122-09-WORKFLOW-MANUAL-TRIGGER.md`
- `docs/20251122-11-AUTO-RELEASE.md`
- `docs/20251122-12-SEPARATE-RELEASE-STAGE.md`

## 驗證結果

### 流程驗證

```
Input:  branch_name = "202511221342-ci"
        ↓
Step 1: TIMESTAMP = "202511221342-ci"
        ↓
Step 2: TIMESTAMP = "202511221342"    (remove -ci)
        ↓
Step 3: RELEASE_TAG = "v202511221342"
        ↓
Output: v202511221342 ✓
```

### 範例輸出

**正確的 Release 資訊**：
- Tag: `v202511221342`
- Name: `Release v202511221342`
- Branch: `202511221342-ci`
- Artifact: `figma-cloudarchitect-202511221342-ci`

## 命名對應關係

| 項目 | 格式 | 範例 | 說明 |
|------|------|------|------|
| **時間戳記** | `YYYYMMDDHHmm` | `202511221342` | UTC 時間 |
| **CI 分支** | `YYYYMMDDHHmm-ci` | `202511221342-ci` | Build Job 建立 |
| **Artifact** | `figma-cloudarchitect-YYYYMMDDHHmm-ci` | `figma-cloudarchitect-202511221342-ci` | Build Job 上傳 |
| **Release Tag** | `vYYYYMMDDHHmm` | `v202511221342` | Release Job 建立 ✓ |

## 影響範圍

### 正面影響

1. **命名一致性**
   - Release tag 格式統一
   - 符合語意化版本規範
   - 易於識別與排序

2. **易讀性**
   - 無多餘的破折號
   - 更簡潔的版本號
   - 符合直覺

3. **自動化友善**
   - 易於解析與比對
   - 支援版本號提取
   - 便於腳本處理

### 向下相容性

**注意**：此變更不影響既有的 Release

- 舊格式 Release（如有）將保持不變
- 新 Release 使用新格式
- 不需要遷移既有資料

## 測試案例

### 測試案例 1：正常建置

**輸入**：
- Branch: `202511221342-ci`

**預期輸出**：
- Release Tag: `v202511221342`
- Release Name: `Release v202511221342`

### 測試案例 2：邊界情況

**不同時間戳記**：
- `202511221200-ci` → `v202511221200`
- `202511222359-ci` → `v202511222359`
- `202512010000-ci` → `v202512010000`

**驗證**：
- 所有情況下 `-ci` 正確移除
- `v` 前綴正確添加
- 無多餘破折號

## 相關文件

- [20251122-11-AUTO-RELEASE.md](./20251122-11-AUTO-RELEASE.md) - 自動 Release 功能
- [20251122-12-SEPARATE-RELEASE-STAGE.md](./20251122-12-SEPARATE-RELEASE-STAGE.md) - Release 階段分離
- [README.md](../README.md) - 專案說明

## 後續追蹤

### 監控要點

1. **下次 Release 執行時檢查**
   - 確認 tag 格式正確
   - 驗證 Release 名稱
   - 檢查是否有錯誤訊息

2. **GitHub Releases 頁面**
   - 確認新 Release 使用正確格式
   - 驗證下載連結正常
   - 檢查說明文件顯示

### 驗證指令

```bash
# 列出所有 Release tags
gh release list

# 檢查最新 Release
gh release view --json tagName,name

# 預期輸出
{
  "tagName": "v202511221342",
  "name": "Release v202511221342"
}
```
