# Copilot Instructions Rewrite

## 異動摘要

重寫 `.github/copilot-instructions.md`，從原本簡單的目錄清單升級為完整的架構文件。

## 異動檔案

- `.github/copilot-instructions.md` — 完整重寫

## 新增內容

1. **Architecture** — prebuild → plugin 的資料流圖與模板消費方式
2. **Plugin directory layout** — 各 plugin 的 source/out 路徑與 build tool 對照表
3. **Template consumption patterns** — 每個 plugin 如何使用 prebuild 模板（inline / separate / split / copy）
4. **Platform-specific icon insertion** — 各平台插入 SVG 的 API 與單位差異
5. **Build commands** — 完整建置指令（含 prebuild 前置需求）
6. **Key conventions** — 無 bundler、cache busting、SVG 正規化、命名規則、長寬比保持
7. **CI/CD** — workflow 觸發條件、checksum 比對邏輯、release tag 格式
8. **Change guidelines** — 修改後需同步更新文件的提醒
