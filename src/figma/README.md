# Cloud Architect Kits - Figma Plugin

A Figma plugin that allows you to quickly insert cloud architecture and technology icons into your designs.

## Features

- 🔍 **Search through 8,642+ icons** from multiple sources
- 📐 **Customizable icon size** - Default 64px, maintains aspect ratio
- 🎨 **Organized by source and category** - Easy navigation
- ⚡ **Fast keyword search** - Search by icon name, source, or category
- 🎯 **One-click insertion** - Insert icons directly into your canvas
- 📊 **Real-time icon count** - See filtered/total counts
- 🔝 **Sticky source headers** - Source info stays visible while scrolling
- 📦 **48x48 preview thumbnails** - Clear icon preview

## Icon Sources

This plugin includes icons from:

- **TheSVG** (3,999 icons)
- **Gilbarbara Logos** (1,776 icons)
- **Microsoft 365 Icons** (963 icons)
- **Lobe Icons** (727 icons)
- **Azure Architecture Icons** (705 icons)
- **AWS Architecture Icons** (321 icons)
- **GCP Icons** (45 icons)
- **Kubernetes Icons** (39 icons)
- **Dynamics 365 Icons** (38 icons)
- **Microsoft Fabric Icons** (13 icons)
- **Power Platform Icons** (9 icons)
- **Microsoft Entra Icons** (7 icons)

**Total: 8,642 icons**

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
1. Copy UI templates from `../../prebuild/templates/`
2. Copy icons data from `../../prebuild/templates/icons-data.js`
3. Generate `ui.html` with inline icons and styles
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
├── code.js               # Compiled backend code
├── ui.html               # Generated UI (standalone with inline icons)
├── build.js              # Build script
└── package.json          # Dependencies
```

**Note:** Icons and UI templates come from the prebuild system at `../../prebuild/templates/`

## Technical Details

### Build Process

The build script (`build.js`):
1. Copies base UI templates from `../../prebuild/templates/`
   - `ui-base.html` - HTML structure
   - `ui-base.css` - Styles
   - `ui-base.js` - UI logic
   - `icons-data.js` - Icon data (~26 MB)
2. Combines all into a single `ui.html` (Figma requires standalone HTML)
3. Compiles TypeScript to JavaScript

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
