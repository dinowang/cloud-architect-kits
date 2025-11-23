# Figma Cloud Architect Icons Plugin

A Figma plugin that allows you to quickly insert cloud architecture and technology icons into your designs.

## Features

- 🔍 Search through 4300+ icons from multiple sources
- 📐 Customizable icon size (default 64px, maintains aspect ratio)
- 🎨 Organized by source and category
- ⚡ Fast keyword search by icon name, source, or category
- 🎯 One-click icon insertion
- 📊 Real-time icon count display (filtered/total)
- 🔝 Sticky source headers for easy navigation
- 📦 Automated icon download scripts

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the plugin:
   ```bash
   npm run build
   ```

3. Load the plugin in Figma:
   - Open Figma Desktop App
   - Go to Menu > Plugins > Development > Import plugin from manifest...
   - Select the `manifest.json` file from this directory

## Development

### Build Process

The plugin build process:
1. Downloads icons from Microsoft's official repositories
2. Processes and normalizes all SVG icons (removes fixed width/height, ensures viewBox)
3. Indexes icons by source and category
4. Embeds icons into the UI HTML file as base64
5. Compiles TypeScript code

### Commands

- `./scripts/build-and-release.sh` - **Complete workflow** (download all icons, install dependencies, build, create distribution)
- `npm run build` - Full build (process icons, build UI, compile code)
- `npm run watch` - Watch mode for TypeScript changes
- `npm run verify` - Verify icons integrity

### Download Scripts

- `./scripts/download-azure-icons.sh` - Download Azure Architecture Icons
- `./scripts/download-m365-icons.sh` - Download Microsoft 365 Icons
- `./scripts/download-d365-icons.sh` - Download Dynamics 365 Icons
- `./scripts/download-entra-icons.sh` - Download Microsoft Entra Icons
- `./scripts/download-powerplatform-icons.sh` - Download Power Platform Icons
- `./scripts/download-kubernetes-icons.sh` - Download Kubernetes Icons
- `./scripts/download-gilbarbara-icons.sh` - Download Gilbarbara Logos
- `./scripts/download-lobe-icons.sh` - Download Lobe Icons

### Automated Build (GitHub Actions)

The repository includes a GitHub Actions workflow for manual builds with two stages:

**Build Stage:**
- Downloads all icon sources
- Builds the plugin
- Creates distribution packages
- **Smart change detection**: Compares with previous build
- Commits to timestamped CI branch (format: `YYYYMMDDHHmm-ci`) only if changes detected
- Uploads build artifacts (retained for 30 days) only if changes detected

**Release Stage** (only if changes detected):
- Downloads build artifact
- Creates `dist.zip` archive
- **Creates GitHub Release** (format: `vYYYYMMDDHHmm`) with `dist.zip`

Trigger: Go to Actions → Build and Release → Run workflow

**Note**: If no changes are detected in `./dist/`, the workflow will skip creating the CI branch, uploading artifacts, and the entire release stage.

**Permissions**: The workflow requires `contents: write` permission to create branches and push changes. This is configured in the workflow file. For more details, see [docs/20251122-11-GITHUB-ACTIONS-PERMISSIONS.md](docs/20251122-11-GITHUB-ACTIONS-PERMISSIONS.md).

### Project Structure

```
figma-azure/
├── manifest.json          # Figma plugin manifest
├── src/
│   └── figma-cloudarchitect/
│       ├── code.ts           # Plugin backend code
│       ├── ui.html           # UI template
│       ├── ui-built.html     # Built UI (production)
│       ├── ui-dev.html       # Built UI (development)
│       ├── icons-data.*.js   # Icons data with hash
│       ├── process-icons.js  # Icon processing script
│       ├── build.js          # UI build script
│       └── icons/            # Processed icon files
├── temp/                  # Downloaded icon sources
│   ├── azure-icons/       # Azure Architecture Icons
│   ├── m365-icons/        # Microsoft 365 Icons
│   ├── d365-icons/        # Dynamics 365 Icons
│   ├── entra-icons/       # Microsoft Entra Icons
│   ├── powerplatform-icons/ # Power Platform Icons
│   ├── kubernetes-icons/  # Kubernetes Icons
│   ├── gilbarbara-icons/  # Gilbarbara logos
│   └── lobe-icons/        # Lobe Icons
├── scripts/               # Download scripts
├── dist/                  # Distribution files
└── docs/                  # Documentation
```

## Icon Sources

### Azure Architecture Icons
- **URL:** https://learn.microsoft.com/en-us/azure/architecture/icons/
- **Count:** ~705 icons
- **Format:** SVG
- **Categories:** Compute, Networking, Storage, Databases, AI + ML, etc.

### Microsoft 365 Icons
- **URL:** https://learn.microsoft.com/en-us/microsoft-365/solutions/architecture-icons-templates
- **Count:** ~963 icons
- **Format:** SVG
- **Categories:** Teams, SharePoint, Office apps, etc.

### Dynamics 365 Icons
- **URL:** https://learn.microsoft.com/en-us/dynamics365/get-started/icons
- **Count:** ~38 icons
- **Format:** SVG
- **Categories:** CRM, ERP, Business Central, etc.

### Power Platform Icons
- **URL:** https://learn.microsoft.com/en-us/power-platform/
- **Count:** ~9 icons
- **Format:** SVG
- **Categories:** Power BI, Power Apps, Power Automate, etc.

### Microsoft Entra Icons
- **URL:** https://learn.microsoft.com/en-us/entra/
- **Count:** ~7 icons
- **Format:** SVG
- **Categories:** Identity and access management

### Kubernetes Icons
- **URL:** https://github.com/kubernetes/community
- **Count:** ~39 icons
- **Format:** SVG
- **Categories:** Container orchestration and cloud-native

### Gilbarbara Logos
- **URL:** https://github.com/gilbarbara/logos
- **Count:** ~1839 icons
- **Format:** SVG
- **Categories:** Technology company logos and brand icons

### Lobe Icons
- **URL:** https://github.com/lobehub/lobe-icons
- **Count:** ~723 icons
- **Format:** SVG
- **Categories:** Modern icon library for applications

## Usage

1. Open Figma and run the plugin (Plugins > Development > Cloud Architect Icons)
2. Browse icons organized by source (Azure, Microsoft 365, Dynamics 365, Entra, Power Platform, Kubernetes, Gilbarbara, Lobe)
3. Use the search box to find icons by name, source, or category
4. Adjust the icon size (16-512px) using the size control or preset buttons (32, 64, 128, 256)
5. Click on an icon to insert it into your canvas at the specified size (maintains aspect ratio)
6. Icons are displayed at 48x48px in the selection list for better browsing
7. Source headers show real-time icon counts (filtered/total) and stay visible while scrolling

## License

ISC

## UI Features

- **Icon Preview**: Icons displayed at 48x48px in selection list
- **Size Control**: Adjustable output size (16-512px) with quick preset buttons
- **Smart Scaling**: Icons maintain aspect ratio based on longest side
- **Sticky Headers**: Source headers stay visible while scrolling for easy navigation
- **Icon Count Display**: Shows filtered/total icon count per source
- **Auto Scroll**: Automatically scrolls to top when search query changes
- **Fast Search**: Debounced search with optimized rendering for 4300+ icons

## Notes

- All icons are embedded in the plugin for offline use
- No network access required after initial build
- Only SVG format icons are used (PNG files are excluded)
- Icons are organized hierarchically: Source → Category → Individual Icons
- Total icon count: ~4,323 icons from 8 different sources
- Built UI file size: ~52MB (includes all embedded icons)
