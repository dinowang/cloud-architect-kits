# Installation Guide

## System Requirements

- Node.js 14 or higher
- npm
- Figma Desktop App

## Quick Start

### Method 1: One-Click Full Build (Recommended)

```bash
./scripts/build-and-release.sh
```

This script will automatically complete the following steps:
- Download all icon sources (Azure, M365, D365, Entra, Power Platform, Kubernetes, Gilbarbara, Lobe)
- Install dependencies
- Build the plugin
- Generate distribution to `./dist/` directory

### Method 2: Manual Build

#### 1. Download Icon Sources

```bash
./scripts/download-azure-icons.sh
./scripts/download-m365-icons.sh
./scripts/download-d365-icons.sh
./scripts/download-entra-icons.sh
./scripts/download-powerplatform-icons.sh
./scripts/download-kubernetes-icons.sh
./scripts/download-gilbarbara-icons.sh
./scripts/download-lobe-icons.sh
```

#### 2. Install Dependencies

```bash
cd src/figma-cloudarchitect
npm install
```

#### 3. Build the Plugin

```bash
npm run build
```

This command will:
- Process icons from all sources (Azure, M365, D365, Entra, Power Platform, Kubernetes, Gilbarbara, Lobe)
- Build UI interface (with all icons embedded)
- Compile TypeScript code

After building, the following files will be generated:
- `src/figma-cloudarchitect/code.js` - Plugin main program
- `src/figma-cloudarchitect/ui-built.html` - Built UI interface (~52MB, includes all icons)
- `src/figma-cloudarchitect/icons-data.*.js` - Icon data file with hash (~26MB)
- `src/figma-cloudarchitect/icons/` - Processed icon files (SVG only)
- `src/figma-cloudarchitect/icons.json` - Icon index (includes source and category info)
- `./dist/` - Complete distribution files (when using Method 1)

### 4. Load into Figma

1. Open **Figma Desktop App** (Note: Must be the desktop version, browser version cannot load development plugins)

2. Go to menu:
   ```
   Plugins → Development → Import plugin from manifest...
   ```

3. Select file:
   - Method 1 (One-click build): Select `./dist/manifest.json`
   - Method 2 (Manual build): Select `manifest.json` in project root

4. After successful loading, the plugin will appear in the Development plugins list

### 5. Run the Plugin

1. In Figma, select:
   ```
   Plugins → Development → Cloud Architect Icons
   ```

2. The plugin window will open, displaying all icon sources (organized by source and category)

3. Adjust icon size using the size control input or preset buttons (32, 64, 128, 256)

4. Use the search box to find icons (searchable by name, source, or category)
   - Search results automatically scroll to top
   - Source headers show filtered/total icon count

5. Click an icon to insert it onto the canvas at the specified size
   - Icons maintain aspect ratio based on longest side
   - Icons are displayed at 48x48px in the list for better browsing

## Development Mode

If you want to modify the code, you can use watch mode:

```bash
npm run watch
```

This will watch for TypeScript file changes and automatically compile.

After modifying UI or icons, you need to re-run:

```bash
npm run build
```

## Troubleshooting

### Build Failed

If the build fails, please check:
- Node.js version meets requirements (`node --version`)
- `npm install` has been executed
- `temp/` directory contains all icon sources
- Confirm at least one icon source directory exists and contains SVG files

### Cannot Load Plugin

Please check:
- Using Figma Desktop App (not browser version)
- `manifest.json` path is correct
- `code.js` and `ui-built.html` have been generated

### Icons Not Displaying

Please check:
- `ui-built.html` file size is approximately 52MB (includes all icons)
- `icons-data.*.js` file size is approximately 26MB
- No error messages during build process
- Confirm `temp/` directory contains all icon sources (8 sources: Azure, M365, D365, Entra, Power Platform, Kubernetes, Gilbarbara, Lobe)
- Try re-running `npm run build`

## Updating Icons

If you need to update any icon sources:

1. Download new icons and extract to corresponding directory in `temp/`
   - `temp/azure-icons/`
   - `temp/m365-icons/`
   - `temp/d365-icons/`
   - `temp/entra-icons/`
   - `temp/powerplatform-icons/`
   - `temp/kubernetes-icons/`
   - `temp/gilbarbara-icons/`
   - `temp/lobe-icons/`

2. Delete old processed results:
   ```bash
   rm -rf icons icons.json icons-data.*.js
   ```

3. Rebuild:
   ```bash
   npm run build
   ```

4. Reload the plugin in Figma

## File Description

| File | Description |
| ---- | ----------- |
| `manifest.json` | Figma plugin configuration file |
| `src/figma-cloudarchitect/code.ts` | Plugin main program (TypeScript) |
| `src/figma-cloudarchitect/ui.html` | UI interface template |
| `src/figma-cloudarchitect/process-icons.js` | Icon processing script (multi-source support) |
| `src/figma-cloudarchitect/build.js` | UI build script |
| `src/figma-cloudarchitect/code.js` | Compiled main program |
| `src/figma-cloudarchitect/ui-built.html` | Built UI (with all icons embedded) |
| `src/figma-cloudarchitect/icons.json` | Icon index data (includes source and category) |
| `temp/` | Icon source directory |

## Technical Support

If you encounter issues, please check:
1. Error messages during build process
2. Figma Desktop App Console (Plugins → Development → Open Console)
3. Project README.md and documentation

## New Features (v2.0.0)

- **Smart Icon Scaling**: Icons now maintain aspect ratio based on longest side (no more distortion)
- **48x48 Preview Size**: Better icon browsing experience with optimized preview size
- **Sticky Source Headers**: Source headers stay visible while scrolling for easy navigation
- **Icon Count Display**: Real-time display of filtered/total icons per source (e.g., "12 / 705")
- **Auto-Scroll to Top**: Search results automatically scroll to top for better UX
- **8 Icon Sources**: Now includes 4,323 icons from Azure, M365, D365, Entra, Power Platform, Kubernetes, Gilbarbara, and Lobe
- **Customizable Size**: Adjustable output size (16-512px) with preset buttons (32, 64, 128, 256)

## License

This project uses the ISC license.
- Azure, Microsoft 365, Dynamics 365, Entra, Power Platform icons are copyright of Microsoft
- Kubernetes icons follow their original license terms
- Gilbarbara logos follow their original license terms
- Lobe icons follow their original license terms
