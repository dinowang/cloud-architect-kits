# Build System Refactoring

**Date**: 2024-11-24  
**Purpose**: Refactor build system to use `out/` directories for all plugins

## Changes Summary

### 1. Directory Structure

All plugins now build to `out/` directory:

```
src/
├── figma/plugin/
│   ├── src/           # Source files
│   ├── out/           # Build output (gitignored)
│   └── build.js
├── powerpoint/add-in/
│   ├── src files      # Source files
│   ├── out/           # Build output (gitignored)
│   └── build.js
├── google-slides/addon/
│   ├── src files      # Source files
│   ├── out/           # Build output (gitignored)
│   └── build.js
├── drawio/iconlib/
│   ├── out/           # Build output (gitignored)
│   └── generate-library.js
└── vscode/extension/
    ├── src/           # TypeScript source
    ├── out/           # Build output (gitignored)
    │   ├── extension.js
    │   └── webview/   # Webview resources
    ├── resources/     # Static assets
    └── build.js
```

### 2. Build Process

**Step 1: Prebuild** (`src/prebuild`)
- Generates `icons.json`
- Generates `icons/*.svg` files
- Generates `templates/icons-data.js`
- Generates `templates/ui-base.*` files

**Step 2: Plugin Builds** (each to their `out/` directory)
- Figma → `out/ui.html`, `out/code.js`, `out/manifest.json`
- PowerPoint → `out/taskpane.*`, `out/manifest.xml`, `out/assets/`
- Google Slides → `out/Sidebar*.html`, `out/Code.gs`, `out/appsscript.json`
- Draw.io → `out/cloud-architect-*.xml` (9 library files)
- VSCode → `out/extension.js` + `webview/*` → `.vsix`

**Step 3: Package to dist**
- Zip each `out/` directory
- Copy VSCode `.vsix`
- All packages in `dist/`

### 3. Updated Files

#### .gitignore Files
- `src/figma/plugin/.gitignore` → Added `out/`
- `src/powerpoint/add-in/.gitignore` → Added `out/`
- `src/google-slides/addon/.gitignore` → Added `out/`
- `src/drawio/iconlib/.gitignore` → Created with `out/`
- `src/vscode/extension/.gitignore` → Updated for `out/`
- `dist/.gitignore` → Ignore all except `.gitignore`

#### Build Scripts
- `src/figma/plugin/build.js` → Build to `out/`
- `src/powerpoint/add-in/build.js` → Build to `out/`
- `src/google-slides/addon/build.js` → Build to `out/`
- `src/drawio/iconlib/generate-library.js` → Generate to `out/`
- `src/vscode/extension/build.js` → Copy to `webview/`

#### Package Scripts
- All `package.json` updated with correct `build` scripts
- Figma: `node build.js && npx tsc -p tsconfig.json`
- PowerPoint: `node build.js`
- Google Slides: `node build.js`
- Draw.io: `node generate-library.js`
- VSCode: `npm run prebuild && tsc -p ./` (unchanged)

#### Main Build Scripts
- `scripts/build-and-release.sh` → Refactored to use `out/` directories
- `.github/workflows/build-and-release.yml` → Updated for new structure

### 4. Build Output Sizes

| Plugin | Build Output | Package Size |
|--------|-------------|--------------|
| Figma | `out/ui.html` (26MB), `code.js`, `manifest.json` | 9.4 MB (zip) |
| PowerPoint | `out/taskpane.*`, `manifest.xml`, `assets/` | 9.4 MB (zip) |
| Google Slides | `out/Sidebar*.html`, `Code.gs` | 9.4 MB (zip) |
| Draw.io | `out/*.xml` (9 files, ~19MB total) | 6.6 MB (zip) |
| VSCode | Compiled TypeScript + webview | 9.3 MB (.vsix) |

### 5. Advantages

✅ **Clean Separation**: Source files separate from build artifacts  
✅ **No Cross-Dependencies**: `out/` is self-contained  
✅ **Simplified Packaging**: Zip `out/` directly  
✅ **Version Control**: All `out/` directories gitignored  
✅ **CI/CD Ready**: Clear build → package flow  
✅ **Consistent Structure**: All plugins follow same pattern  

### 6. Testing

All plugins tested and working:
- ✅ Figma plugin builds successfully
- ✅ PowerPoint add-in builds successfully
- ✅ Google Slides add-on builds successfully
- ✅ Draw.io libraries generated (9 files)
- ✅ VSCode extension packages to .vsix
- ✅ All packages created in `dist/`

### 7. Commands

```bash
# Build all plugins
./scripts/build-and-release.sh

# Build individual plugins
cd src/figma/plugin && npm run build
cd src/powerpoint/add-in && npm run build
cd src/google-slides/addon && npm run build
cd src/drawio/iconlib && npm run build
cd src/vscode/extension && npm run package

# Clean all build artifacts
rm -rf src/*/plugin/out src/*/add-in/out src/*/addon/out src/*/iconlib/out dist
```

## Conclusion

Build system successfully refactored. All plugins now build to `out/` directories, providing clean separation between source and build artifacts. The packaging process is simplified and consistent across all platforms.
