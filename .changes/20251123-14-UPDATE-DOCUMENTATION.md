# 20251123-14-UPDATE-DOCUMENTATION

## 異動日期
2025-11-23

## 異動目的
更新所有 README.md 和 INSTALL.md 文件，移除過時資訊，確保文件與當前專案結構和功能一致。

## 更新檔案清單

### 1. src/figma/README.md

#### 更新內容
- **路徑修正**: `figma-plugin/` → `src/figma/plugin/`
- **檔案結構**: 更新專案結構說明，標註檔案大小
- **相關連結**: 修正指向其他模組的路徑

#### 主要變更
```markdown
# 修改前
figma-plugin/
├── icons-data.*.js       # Generated icons data

# 修改後  
src/figma/plugin/
├── icons-data.*.js       # Generated icons data (~26 MB)
├── ui-built.html         # Production build (inline icons)
├── ui-dev.html           # Development build (references external JS)
```

### 2. src/figma/INSTALL.md

#### 更新內容
- **建置輸出說明**: 更新檔案大小資訊

#### 主要變更
```markdown
# 修改前
✓ icons-data.{hash}.js created (25.8 MB)
✓ ui-built.html created (inline JS)

# 修改後
✓ icons-data.{hash}.js created (~26 MB)
✓ ui-built.html created (inline JS, ~26 MB)
✓ ui-dev.html created (references external JS, 4.6 KB)
```

### 3. src/powerpoint/README.md

#### 更新內容
- **專案結構**: 更新檔案列表，移除過時檔案
- **圖示處理**: 修正圖示來源說明
- **檔案大小**: 更新為正確的檔案大小
- **技術細節**: 說明新的外部 JS 檔案架構

#### 主要變更

##### 專案結構
```markdown
# 修改前
powerpoint-addin/
├── deploy.sh         # Deployment script
└── QUICKSTART.md     # 5-minute quick start

# 修改後
src/powerpoint/
├── add-in/
│   ├── icons-data.*.js   # Generated icons data (~26 MB)
│   ├── taskpane-built.html # Production build (4.6 KB)
│   ├── taskpane-dev.html   # Development build
│   └── staticwebapp.config.json # Azure config
```

##### 圖示處理
```markdown
# 修改前
Copy icons from the Figma plugin:
cp -r ../../figma-cloudarchitect/icons ./icons

# 修改後
Icons are copied from the prebuild system during the build process:
./scripts/build-and-release.sh
```

##### 檔案大小說明
```markdown
# 修改前
Built UI file: ~52MB (includes all icons)

# 修改後
taskpane-built.html: 4.6 KB (references external icons-data.*.js)
icons-data.*.js: ~26 MB (cached by browser)
```

### 4. src/powerpoint/INSTALL.md

#### 更新內容
- **專案結構**: 更新路徑名稱
- **建置流程**: 簡化並更新為當前流程
- **檔案說明**: 更新產出檔案清單與大小

#### 主要變更

##### 專案結構
```markdown
# 修改前
powerpoint-cloudarchitect/

# 修改後
src/powerpoint/
```

##### 建置流程
```markdown
# 修改前
./deploy.sh
# Copy icons from Figma plugin

# 修改後
./scripts/build-and-release.sh
# Icons are automatically copied from prebuild system
```

##### 產出檔案
```markdown
# 修改前
- `taskpane-built.html` (~52MB, production)
- `icons-data.*.js` (~26MB)

# 修改後
- `taskpane-built.html` (4.6 KB, references external JS)
- `icons-data.*.js` (~26 MB, with hash for caching)
```

### 5. scripts/README.md

#### 更新內容
- **新增主腳本**: 加入 `build-and-release.sh` 說明
- **補充下載腳本**: 加入所有下載腳本說明
- **輸出位置**: 更新完整的目錄結構
- **快速使用**: 加入實用的使用範例

#### 主要變更

##### 新增主腳本說明
```markdown
### build-and-release.sh

完整建置並打包所有元件的主要腳本。

執行流程：
1. 下載所有圖示來源
2. 預建置圖示 (normalize & index)
3. 複製圖示到各 plugin
4. 建置 Figma plugin
5. 建置 PowerPoint add-in
6. 打包發行檔案
```

##### 補充所有下載腳本
```markdown
### download-d365-icons.sh
### download-entra-icons.sh
### download-kubernetes-icons.sh
### download-gilbarbara-icons.sh
### download-lobe-icons.sh
```

##### 更新輸出結構
```markdown
temp/
├── azure-icons/
├── m365-icons/
├── d365-icons/
├── entra-icons/
├── powerplatform-icons/
├── kubernetes-icons/
├── gilbarbara-icons/
└── lobe-icons/

src/prebuild/
├── icons/        # ~4,323 個 SVG
└── icons.json    # 圖示索引
```

## 更新原因分析

### 1. 專案結構變更
- 從 `figma-cloudarchitect/` 改為 `src/figma/plugin/`
- 從 `powerpoint-cloudarchitect/` 改為 `src/powerpoint/`
- 引入統一的 `src/prebuild/` 系統

### 2. 建置流程優化
- 不再需要手動複製圖示
- 統一使用 `build-and-release.sh`
- 自動化處理所有步驟

### 3. 檔案架構改變
- PowerPoint taskpane-built.html 從 26 MB → 4.6 KB
- Icons data 改為外部 JS 檔案 (icons-data.*.js, ~26 MB)
- 支援瀏覽器快取機制

### 4. 功能增強
- 新增多個圖示來源 (8 個來源，~4,323 個圖示)
- Hash 檔名支援版本控制
- 優化的建置輸出

## 未更新的檔案

### 保持不變的文件
以下文件因為資訊仍然正確而不需要更新：

1. **根目錄 README.md** - 概述資訊正確
2. **根目錄 INSTALL.md** - 安裝指引正確
3. **src/prebuild/README.md** - 預建置系統說明正確
4. **src/powerpoint/terraform/README.md** - Terraform 說明正確

### temp/ 目錄下的 README
- `temp/` 下的 README 檔案來自第三方 repository
- 不應修改這些檔案

## 文件一致性檢查

### 路徑引用
- ✅ 所有內部連結使用正確的相對路徑
- ✅ 模組間引用指向正確位置
- ✅ 範例程式碼使用正確的目錄名稱

### 檔案大小
- ✅ taskpane-built.html: 4.6 KB (PowerPoint)
- ✅ ui-built.html: ~26 MB (Figma, inline)
- ✅ icons-data.*.js: ~26 MB (兩者共用)

### 命令範例
- ✅ 所有 `cd` 命令使用正確路徑
- ✅ 建置命令反映當前流程
- ✅ 部署說明符合當前架構

### 功能說明
- ✅ 圖示數量: ~4,323
- ✅ 圖示來源: 8 個來源
- ✅ 建置產出: 符合實際輸出

## 驗證步驟

### 1. 檢查連結
```bash
# 檢查所有文件中的內部連結
grep -r "](\.\./" --include="*.md" src/
```

### 2. 驗證路徑
```bash
# 驗證範例命令中的路徑
grep -r "cd " --include="*.md" src/ | grep -E "(figma|powerpoint)"
```

### 3. 檢查檔案大小
```bash
# 實際檢查檔案大小
ls -lh src/figma/plugin/ui-built.html
ls -lh src/powerpoint/add-in/taskpane-built.html
ls -lh src/*/*/icons-data.*.js
```

## 文件維護建議

### 定期更新
建議在以下情況更新文件：
1. 專案結構變更
2. 建置流程修改
3. 新增或移除功能
4. 檔案大小顯著變化
5. 圖示來源增減

### 版本記錄
重大文件更新應記錄在 `docs/` 目錄：
- 格式: `YYYYMMDD-NN-DESCRIPTION.md`
- 包含修改原因、影響範圍、測試建議

### 一致性檢查
定期檢查項目：
- [ ] 所有 README 引用正確的路徑
- [ ] INSTALL 指引反映當前建置流程
- [ ] 檔案大小資訊準確
- [ ] 範例程式碼可執行
- [ ] 內部連結正確

## 檔案變更統計

```
src/figma/README.md          | 修改 3 處
src/figma/INSTALL.md         | 修改 1 處
src/powerpoint/README.md     | 修改 5 處
src/powerpoint/INSTALL.md    | 修改 3 處
scripts/README.md            | 修改 3 處
5 files changed, ~40 lines modified
```

## 結論

### 完成項目
- ✅ 移除所有過時路徑引用
- ✅ 更新檔案大小資訊
- ✅ 修正建置流程說明
- ✅ 更新專案結構圖
- ✅ 補充缺少的腳本說明

### 文件品質提升
- **準確性**: 所有資訊反映當前狀態
- **完整性**: 涵蓋所有主要功能和檔案
- **可用性**: 範例程式碼可直接執行
- **一致性**: 統一的術語和路徑引用

### 後續維護
建議定期檢查並更新文件，確保與專案實際狀態保持同步。
