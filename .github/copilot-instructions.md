# Cloud Architect Kits — Copilot Instructions

## Architecture

This is a multi-plugin project that delivers 8,642+ cloud architecture icons to 5 platforms. All plugins share a **single prebuild pipeline** that processes icon sources into reusable templates.

```
Icon Sources (12 packs in temp/)
        │
        ▼
  src/prebuild/process-icons.js    ← Normalizes SVGs, generates icons-data.js (~28 MB base64)
        │
        ▼
  src/prebuild/templates/          ← ui-base.html/css/js + icons-data.js + icons-data.hash
        │
  ┌─────┼──────┬──────────┬────────────┐
  ▼     ▼      ▼          ▼            ▼
Figma  PPT  Google     Draw.io     VS Code
       Slides
```

Each plugin's `build.js` reads from `src/prebuild/templates/` and assembles platform-specific output. The shared `ui-base.html` uses placeholders (`PLATFORM_HEAD_PLACEHOLDER`, `SIZE_UNIT_PLACEHOLDER`, `PLATFORM_SCRIPTS_PLACEHOLDER`) replaced at build time.

### Plugin directory layout

| Plugin        | Source                     | Out                            | Build tool                 |
| ------------- | -------------------------- | ------------------------------ | -------------------------- |
| Figma         | `src/figma/plugin/`        | `src/figma/plugin/out/`        | `node build.js && tsc`     |
| PowerPoint    | `src/powerpoint/add-in/`   | `src/powerpoint/add-in/out/`   | `node build.js`            |
| Google Slides | `src/google-slides/addon/` | `src/google-slides/addon/out/` | `node build.js`            |
| Draw.io       | `src/drawio/iconlib/`      | `src/drawio/iconlib/out/`      | `node generate-library.js` |
| VS Code       | `src/vscode/extension/`    | `src/vscode/extension/out/`    | `tsc && vsce package`      |

### How each plugin consumes templates

- **Figma**: Inlines everything into a single `ui.html` (CSS, JS, icons-data all embedded)
- **PowerPoint**: Separates into `taskpane.html` + `.css` + `.js` + `icons-data.js` (served via web server)
- **Google Slides**: Splits into `Sidebar*.html` files using Apps Script `<?!= include() ?>` pattern
- **Draw.io**: Uses only `icons.json` + raw SVG files (no UI templates); generates XML library files
- **VS Code**: Copies templates to `out/webview/`, loads dynamically in webview panel

### Platform-specific icon insertion

- **Figma**: `figma.createNodeFromSvg(svgString)` — uses px
- **PowerPoint**: `Office.CoercionType.XmlSvg` via Office.js — uses pt
- **Google Slides**: `SlidesApp.insertImage(blob)` via Apps Script — uses pt
- **VS Code**: Context-sensitive: Markdown gets file ref or base64 `<img>`, HTML/XML gets raw SVG, others get icon name

## Build commands

```bash
# Full build (downloads icons + builds all plugins)
./scripts/build-and-release.sh

# Prebuild only (must run first before any plugin build)
cd src/prebuild && npm ci && npm run build

# Individual plugins (each requires prebuild to have run)
cd src/figma/plugin && npm ci && npm run build
cd src/powerpoint/add-in && npm ci && npm run build
cd src/google-slides/addon && npm ci && npm run build
cd src/drawio/iconlib && npm ci && npm run build
cd src/vscode/extension && npm ci && npm run compile   # or: npm run package (creates .vsix)
```

There are no test or lint commands in this project. Draw.io has `npm run validate` to check library XML format.

## Key conventions

- **No bundlers**: Build scripts are plain Node.js file operations (`fs.readFileSync/writeFileSync`). No webpack, esbuild, or Rollup.
- **Cache busting**: `icons-data.hash` contains an 8-char MD5 of icons-data.js content, used as `?v={hash}` in script references.
- **SVG normalization**: `process-icons.js` strips fixed `width`/`height` from SVGs and ensures `viewBox` exists for scalability.
- **Icon naming**: `support.js::normalizeTitle()` splits words and uppercases 78 known initialisms (API, ML, IoT, etc.).
- **Aspect ratio**: All plugins extract `viewBox` from SVG and calculate dimensions preserving aspect ratio.
- **Postbuild** (`src/postbuild/`): Aggregates all plugin outputs into a GitHub Pages site; replaces `localhost:3000` in PowerPoint manifest with the production URL.

## CI/CD

- **Build & Release**: `.github/workflows/build-and-release.yml` — runs on manual dispatch or weekly (Friday 18:00 UTC). Compares SHA256 checksums against the last release and skips if unchanged.
- **Azure deploy**: `.github/workflows/deploy-ppt-addin-to-azure.yml` — deploys PowerPoint add-in to Azure Static Web Apps via Terraform (`src/powerpoint/terraform/`).
- Release tags follow `v{YYYYMMDDHHMM}` format.

## When making changes

- After modifying icon sources or features, update **both** the plugin's `README.md`/`INSTALL.md` and the root `README.md`/`INSTALL.md`.
- Always rebuild from prebuild through affected plugins to verify: `cd src/prebuild && npm run build`, then rebuild the target plugin.
- `dist/` contains final packaged ZIPs/VSIX for distribution — built by CI, not checked in.
