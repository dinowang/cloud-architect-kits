# Cloud Architect Kits - Figma Plugin

A Figma plugin that allows you to quickly insert cloud architecture and technology icons into your designs.

## Features

- 🔍 **Search through 4,300+ icons** from multiple sources
- 📐 **Customizable icon size** - Default 64px, maintains aspect ratio
- 🎨 **Organized by source and category** - Easy navigation
- ⚡ **Fast keyword search** - Search by icon name, source, or category
- 🎯 **One-click insertion** - Insert icons directly into your canvas
- 📊 **Real-time icon count** - See filtered/total counts
- 🔝 **Sticky source headers** - Source info stays visible while scrolling
- 📦 **48x48 preview thumbnails** - Clear icon preview

## Icon Sources

This plugin includes icons from:

- **Azure Architecture Icons** (~705 icons)
- **Microsoft 365 Icons** (~963 icons)
- **Dynamics 365 Icons** (~38 icons)
- **Microsoft Entra Icons** (~7 icons)
- **Power Platform Icons** (~9 icons)
- **Kubernetes Icons** (~39 icons)
- **Gilbarbara Logos** (~1,839 icons)
- **Lobe Icons** (~723 icons)

**Total: ~4,323 icons**

## Installation

See [INSTALL.md](INSTALL.md) for detailed installation instructions.

### Quick Start

1. Clone the repository
2. Navigate to `src/figma/plugin` directory
3. Install dependencies: `npm install`
4. Build the plugin: `npm run build`
5. Load in Figma: Plugins → Development → Import plugin from manifest...

## Usage

1. Open Figma
2. Run the plugin from Plugins menu
3. Search for icons using the search box
4. Click on an icon to insert it into your canvas
5. Adjust the size using the size input (default: 64px)

### Tips

- Use the search box to filter icons by name, source, or category
- Icons maintain their aspect ratio when resized
- The size setting applies to the longer dimension of the icon
- Source headers stick to the top while scrolling for easy navigation

## Development

### Build

```bash
npm run build
```

This will:
1. Process icons data from `icons.json`
2. Generate `icons-data.*.js` with icon base64 data
3. Create `ui-built.html` (production) and `ui-dev.html` (development)
4. Compile TypeScript to JavaScript

### Watch Mode

```bash
npm run watch
```

### Project Structure

```
src/figma/plugin/
├── manifest.json          # Figma plugin manifest
├── code.ts               # Plugin backend code
├── ui.html               # UI template
├── build.js              # Build script
├── package.json          # Dependencies
├── icons/                # Icon SVG files (from prebuild)
├── icons.json            # Icon metadata (from prebuild)
├── icons-data.*.js       # Generated icons data (~26 MB)
├── ui-built.html         # Production build (inline icons)
├── ui-dev.html           # Development build (references external JS)
└── code.js               # Compiled backend code
```

## Technical Details

### Icon Processing

Icons are preprocessed by the unified prebuild system at `../../prebuild/`:
1. Icons are downloaded from various sources
2. SVGs are normalized (remove fixed dimensions, ensure viewBox)
3. Metadata is generated in `icons.json`
4. Processed icons are copied to this plugin

### Build Process

The build script (`build.js`):
1. Reads `icons.json` metadata
2. Loads SVG files from `icons/` directory
3. Converts SVGs to base64
4. Generates JavaScript with icon data
5. Creates HTML files with inlined or referenced JS

### Plugin Architecture

- **Backend (code.ts)**: Handles icon insertion into Figma canvas
- **Frontend (ui.html)**: Search, filter, and display icons
- **Communication**: PostMessage API between backend and frontend

## Requirements

- Node.js 14 or higher
- npm
- Figma Desktop App

## License

ISC

## Related

- [PowerPoint Add-in](../powerpoint/) - Insert icons into PowerPoint
- [Prebuild System](../prebuild/) - Unified icon processing
- [Project Root](../../README.md) - Cloud Architect Kits overview
