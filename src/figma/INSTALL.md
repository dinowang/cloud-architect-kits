# Figma Plugin Installation Guide

## Prerequisites

- Figma Desktop App or Figma in browser
- `cloud-architect-kits-figma-plugin.zip` from [Releases](https://github.com/dinowang/cloud-architect-kits/releases)

## Installation Steps

### Option 1: Install from Release Package

1. **Download the plugin**
   ```bash
   # Download from GitHub Releases
   wget https://github.com/dinowang/cloud-architect-kits/releases/latest/download/cloud-architect-kits-figma-plugin.zip
   ```

2. **Extract the ZIP file**
   ```bash
   unzip cloud-architect-kits-figma-plugin.zip -d figma-plugin
   cd figma-plugin
   ```

3. **Import into Figma**
   - Open Figma Desktop App
   - Go to **Menu** → **Plugins** → **Development** → **Import plugin from manifest...**
   - Navigate to the extracted folder
   - Select `manifest.json`
   - Click **Open**

4. **Verify installation**
   - The plugin should now appear in **Menu** → **Plugins** → **Cloud Architect Kits**

### Option 2: Build from Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/dinowang/cloud-architect-kits.git
   cd cloud-architect-kits
   ```

2. **Download icon sources**
   ```bash
   ./scripts/download-azure-icons.sh
   ./scripts/download-m365-icons.sh
   ./scripts/download-d365-icons.sh
   ./scripts/download-entra-icons.sh
   ./scripts/download-powerplatform-icons.sh
   ./scripts/download-kubernetes-icons.sh
   ./scripts/download-gilbarbara-icons.sh
   ./scripts/download-lobe-icons.sh
   ./scripts/download-fabric-icons.sh
   ```

3. **Prebuild icons**
   ```bash
   cd src/prebuild
   npm install
   npm run build
   ```

4. **Build the plugin**
   ```bash
   cd ../figma/plugin
   npm install
   npm run build
   ```

5. **Import into Figma**
   - In Figma, go to **Menu** → **Plugins** → **Development** → **Import plugin from manifest...**
   - Navigate to `src/figma/plugin/out/`
   - Select `manifest.json`

## Usage

1. **Open the plugin**
   - In Figma, go to **Menu** → **Plugins** → **Cloud Architect Kits**

2. **Browse icons**
   - Use the search box to filter by name
   - Select a source from the dropdown (Azure, Microsoft 365, etc.)
   - Select a category to further filter icons

3. **Insert an icon**
   - Adjust the size using the size control (16-512px)
   - Click on any icon to insert it onto the canvas
   - The icon will be inserted at the center of your viewport

## Features

- **8,642+ Icons** from 12 sources
- **Visual Browser** with 48x48 previews
- **Smart Search** with real-time filtering
- **Category Filtering** by source and service
- **Size Control** from 16px to 512px
- **One-Click Insert** directly onto canvas
- **Aspect Ratio Preserved** automatically

## Troubleshooting

### Plugin doesn't appear in menu

- **Solution**: Make sure you imported from the correct `manifest.json` file
- **Check**: **Menu** → **Plugins** → **Development** → **View dev plugins**

### Icons not loading

- **Solution**: Check that `ui.html` is in the same directory as `manifest.json`
- **Check**: The `out/` directory should contain:
  - `manifest.json`
  - `ui.html` (~26MB)
  - `code.js`

### Plugin crashes on launch

- **Solution**: Try removing and re-importing the plugin
- **Check**: Figma Desktop App is up to date

### Build fails

- **Solution**: Make sure you ran `src/prebuild/build.js` first
- **Check**: `src/prebuild/templates/icons-data.js` exists

## File Structure

```
src/figma/plugin/
├── out/                    # Build output (gitignored)
│   ├── manifest.json       # Figma plugin manifest
│   ├── ui.html            # Plugin UI (~26MB, includes all icons)
│   └── code.js            # Plugin backend logic
├── src/
│   ├── code.ts            # TypeScript source
│   └── ui-platform.js     # Figma-specific UI logic
├── build.js               # Build script
├── tsconfig.json          # TypeScript config
└── package.json
```

## Development

### Watch mode
```bash
cd src/figma/plugin
npm run dev  # Watches for TypeScript changes
```

### Rebuild
```bash
npm run build
```

### Clean build
```bash
rm -rf out
npm run build
```

## Support

- **Issues**: [GitHub Issues](https://github.com/dinowang/cloud-architect-kits/issues)
- **Documentation**: [README.md](README.md)
- **Source**: [GitHub Repository](https://github.com/dinowang/cloud-architect-kits)
