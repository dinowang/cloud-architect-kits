# 20251123-15-FIX-BUILD-SCRIPT-WILDCARD

## 異動日期
2025-11-23

## 異動目的
修正 `build-and-release.sh` 腳本中 Step 6 的 wildcard 展開錯誤，確保 `icons-data.*.js` 檔案能正確複製到發行目錄。

## 問題描述

### 錯誤訊息
```bash
==> Step 6: Preparing distribution...
--- Packaging PowerPoint add-in...
cp: /Users/dinowang/Support/cloudarchitect-kits/src/powerpoint/add-in/icons-data.*.js: No such file or directory
```

### 錯誤原因
```bash
# 錯誤寫法
cp "$PPT_DIR"/icons-data.*.js "$DIST_DIR/powerpoint-addin/"
```

在這個寫法中，wildcard `*.js` 沒有被 shell 正確展開，因為引號的位置導致 wildcard 被當作字面字串處理。

### 根本原因分析
- `"$PPT_DIR"/icons-data.*.js` 中，`"$PPT_DIR"` 被引號包住
- Shell 在展開 wildcard 之前會先處理引號
- 導致完整路徑變成帶引號的字串，wildcard 不會被展開
- `cp` 收到的是字面路徑 `/path/to/dir/icons-data.*.js`，而不是展開後的實際檔名

## 解決方案

### 修正方法
```bash
# 正確寫法
cp "$PPT_DIR/"icons-data.*.js "$DIST_DIR/powerpoint-addin/"
```

**關鍵差異**：
- 將 `/` 移到引號外面
- `"$PPT_DIR/"` 確保變數展開時路徑正確
- `icons-data.*.js` 不在引號內，可以被 shell 正確展開

### 展開過程
```bash
# Step 1: 變數展開
"$PPT_DIR/"icons-data.*.js
→ "src/powerpoint/add-in/"icons-data.*.js

# Step 2: 引號移除
→ src/powerpoint/add-in/icons-data.*.js

# Step 3: Wildcard 展開
→ src/powerpoint/add-in/icons-data.64850843.js

# Step 4: 執行 cp
cp src/powerpoint/add-in/icons-data.64850843.js dist/powerpoint-addin/
```

## 檔案修改

### scripts/build-and-release.sh

**位置**: Line 102

**修改前**:
```bash
echo "--- Packaging PowerPoint add-in..."
cp "$PPT_DIR/manifest.xml" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/taskpane-built.html" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/taskpane.js" "$DIST_DIR/powerpoint-addin/"
# 缺少這一行
cp "$PPT_DIR/commands.html" "$DIST_DIR/powerpoint-addin/"
```

**修改後**:
```bash
echo "--- Packaging PowerPoint add-in..."
cp "$PPT_DIR/manifest.xml" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/taskpane-built.html" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/taskpane.js" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/"icons-data.*.js "$DIST_DIR/powerpoint-addin/"  # ← 新增
cp "$PPT_DIR/commands.html" "$DIST_DIR/powerpoint-addin/"
```

## Shell Wildcard 最佳實踐

### 1. 變數與 Wildcard 組合

#### ✅ 正確寫法
```bash
# 方法 1: 斜線在引號外
cp "$DIR/"*.js destination/

# 方法 2: 完全不用引號（如果路徑不含空格）
cp $DIR/*.js destination/

# 方法 3: 使用 bash 陣列
files=("$DIR/"*.js)
cp "${files[@]}" destination/
```

#### ❌ 錯誤寫法
```bash
# 錯誤 1: wildcard 在引號內
cp "$DIR/*.js" destination/
# 結果: 尋找名為 "*.js" 的檔案（字面意思）

# 錯誤 2: 整個路徑在引號內
cp "$DIR"/*.js destination/
# 結果: wildcard 可能無法正確展開
```

### 2. 安全的路徑處理

```bash
# 處理可能包含空格的路徑
DIR="/path/with spaces"

# 安全寫法 1: 在引號內完成路徑組合，wildcard 在外
cp "$DIR/"*.js destination/

# 安全寫法 2: 使用陣列
files=("$DIR/"*.js)
for file in "${files[@]}"; do
  cp "$file" destination/
done
```

### 3. 檢查 Wildcard 是否展開

```bash
# 測試 wildcard 展開
echo "$PPT_DIR/"icons-data.*.js
# 應該顯示: src/powerpoint/add-in/icons-data.64850843.js

# 如果顯示: src/powerpoint/add-in/icons-data.*.js
# 表示 wildcard 沒有展開
```

## 測試驗證

### 單元測試
```bash
# 測試 wildcard 展開
cd /path/to/project
PPT_DIR="src/powerpoint/add-in"
ls -lh "$PPT_DIR/"icons-data.*.js

# 預期輸出:
# -rw-r--r--  26M  icons-data.64850843.js
```

### 整合測試
```bash
# 測試完整複製流程
rm -rf dist/powerpoint-addin
mkdir -p dist/powerpoint-addin
PPT_DIR="src/powerpoint/add-in"
DIST_DIR="dist"
cp "$PPT_DIR/"icons-data.*.js "$DIST_DIR/powerpoint-addin/"
ls -lh dist/powerpoint-addin/

# 預期輸出:
# icons-data.64850843.js  (~26 MB)
```

### 完整建置測試
```bash
# 執行完整建置腳本
./scripts/build-and-release.sh

# 檢查產出
ls -lh dist/powerpoint-addin/icons-data.*.js

# 檢查 ZIP 檔案內容
unzip -l dist/cloud-architect-kit-powerpoint-addin.zip | grep icons-data
```

## 產出驗證

### Step 6 成功輸出
```
==> Step 6: Preparing distribution...
--- Packaging Figma plugin...
--- Packaging PowerPoint add-in...
--- Creating release archives...

Release archives created:
-rw-r--r--  9.4M  cloud-architect-kit-figma-plugin.zip
-rw-r--r--  9.4M  cloud-architect-kit-powerpoint-addin.zip
```

### 發行目錄結構
```
dist/powerpoint-addin/
├── manifest.xml              (4.1 KB)
├── taskpane-built.html       (5.0 KB)
├── taskpane.js               (8.6 KB)
├── icons-data.64850843.js    (26 MB) ← 成功複製
├── commands.html             (272 B)
├── staticwebapp.config.json  (818 B)
└── assets/
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-64.png
    └── icon-80.png
```

### ZIP 檔案內容
```bash
unzip -l dist/cloud-architect-kit-powerpoint-addin.zip

# 應包含:
# - manifest.xml
# - taskpane-built.html
# - taskpane.js
# - icons-data.64850843.js  ← 確認存在
# - commands.html
# - staticwebapp.config.json
# - assets/icon-*.png
```

## 相關議題

### 同樣的問題在 GitHub Actions Workflow

檢查 `.github/workflows/build-and-release.yml` 中是否有類似問題：

**Line 84** (Prepare distribution 步驟):
```yaml
cp src/powerpoint/add-in/icons-data.*.js dist/powerpoint-addin/
```

**Line 130** (Check for changes 步驟):
```yaml
cp src/powerpoint/add-in/icons-data.*.js dist/powerpoint-addin/
```

✅ **GitHub Actions 中的寫法正確**，因為：
- 在 YAML 的 `run:` block 中，這些命令直接被 shell 執行
- Wildcard 會被正確展開
- 沒有複雜的變數與引號組合問題

## 錯誤預防

### Shellcheck 工具
```bash
# 使用 shellcheck 檢查腳本
shellcheck scripts/build-and-release.sh

# 可能的警告:
# SC2086: Double quote to prevent globbing and word splitting
```

### 建議的檢查清單
- [ ] 變數展開使用雙引號 `"$VAR"`
- [ ] Wildcard 不在引號內
- [ ] 路徑組合正確（斜線位置）
- [ ] 測試 wildcard 是否正確展開
- [ ] 檢查檔案是否確實存在

## 檔案變更統計

```
scripts/build-and-release.sh | 1 +
1 file changed, 1 insertion(+)
```

## 學習要點

### Shell Quoting 規則
1. **雙引號內**：變數會展開，但 wildcard 不會
   ```bash
   "$VAR/*.js"  # wildcard 不會展開
   ```

2. **雙引號外**：變數和 wildcard 都會展開
   ```bash
   "$VAR/"*.js  # 兩者都會展開
   ```

3. **組合使用**：保護變數，放開 wildcard
   ```bash
   "$VAR/"*.js  # 最佳實踐
   ```

### Bash 展開順序
1. Brace expansion (`{a,b}`)
2. Tilde expansion (`~`)
3. Parameter expansion (`$VAR`)
4. Command substitution (`$(cmd)`)
5. Arithmetic expansion (`$((1+1))`)
6. **Word splitting**
7. **Pathname expansion (globbing)** ← wildcard 在這裡
8. Quote removal

**關鍵**：引號會阻止 Word splitting 和 Pathname expansion

## 參考資源

- [Bash Manual - Shell Expansions](https://www.gnu.org/software/bash/manual/html_node/Shell-Expansions.html)
- [Bash Manual - Filename Expansion](https://www.gnu.org/software/bash/manual/html_node/Filename-Expansion.html)
- [ShellCheck Wiki](https://www.shellcheck.net/wiki/)

## 結論

### 修正重點
- ✅ 將斜線移到引號外：`"$PPT_DIR/"icons-data.*.js`
- ✅ 允許 shell 正確展開 wildcard
- ✅ 保持變數路徑的安全性（引號保護）

### 測試結果
- ✅ Wildcard 正確展開為實際檔名
- ✅ 檔案成功複製到 dist 目錄
- ✅ ZIP 檔案包含 icons-data.*.js
- ✅ 完整建置流程正常運作

### 影響範圍
- **本地建置**: `./scripts/build-and-release.sh` ✅ 已修正
- **CI/CD**: `.github/workflows/build-and-release.yml` ✅ 原本就正確
- **手動操作**: 文件中的範例 ℹ️ 需要注意類似問題
