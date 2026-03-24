# VS Code Extension Installation Guide

## Prerequisites

- Visual Studio Code 1.80.0 or higher
- `cloud-architect-kits-vscode-extension-1.0.0.vsix` from [Releases](https://github.com/dinowang/cloud-architect-kits/releases)

## Installation Steps

### Option 1: Install from VSIX File

1. **Download the extension**
   ```bash
   wget https://github.com/dinowang/cloud-architect-kits/releases/latest/download/cloud-architect-kits-vscode-extension-1.0.0.vsix
   ```

2. **Install in VS Code**
   - Open VS Code
   - Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac) to open Extensions view
   - Click the **"..."** menu at the top
   - Select **Install from VSIX...**
   - Navigate to the downloaded `.vsix` file
   - Click **Open**

3. **Reload VS Code**
   - VS Code will prompt you to reload
   - Click **Reload Now**

4. **Verify installation**
   - Look for the Cloud Architect Kits icon in the Activity Bar (left sidebar)

### Option 2: Install from Command Line

```bash
code --install-extension cloud-architect-kits-vscode-extension-1.0.0.vsix
```

### Option 3: Build from Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/dinowang/cloud-architect-kits.git
   cd cloud-architect-kits
   ```

2. **Download icon sources and prebuild**
   ```bash
   ./scripts/download-azure-icons.sh
   # ... (download other sources)
   
   cd src/prebuild
   npm install
   npm run build
   ```

3. **Build the extension**
   ```bash
   cd ../vscode/extension
   npm install
   npm run package
   ```

4. **Install the generated VSIX**
   ```bash
   code --install-extension cloud-architect-kits-vscode-extension-1.0.0.vsix
   ```

## Usage

### Opening the Extension

1. Click the **Cloud Architect Kits** icon in the Activity Bar (left sidebar)
2. The icon browser will open in the sidebar

### Browsing Icons

- **Search**: Type in the search box to filter icons by name
- **Filter by Source**: Select a cloud provider (Azure, AWS, etc.)
- **Filter by Category**: Select a service category
- **Adjust Size**: Use the size slider (16-512px)

### Inserting Icons

Click on any icon to insert it into the active editor. The insertion format depends on the file type:

#### Markdown Files (`.md`, `.marp`, `.mdx`)

You'll be prompted to choose:

1. **Save as file and reference**
   - SVG saved to `./assets/{icon-name}-{timestamp}.svg`
   - Inserts: `![width:64](./assets/icon.svg)` or `![height:64](./assets/icon.svg)`
   - Automatically constrains longest side
   - File is sized according to your selection

2. **Embed as base64**
   - Inserts: `<img src="data:image/svg+xml;base64,..." alt="Icon Name" width="64" />`
   - No external file created
   - Constrained by width or height based on aspect ratio

#### HTML/XML Files (`.html`, `.xml`, `.jsx`, `.tsx`, `.vue`, `.svelte`)

- Inserts raw SVG code
- Width and height attributes applied based on size selection

#### Other Files (`.txt`, `.js`, `.py`, `.json`, etc.)

- Inserts icon name only
- Example: `Azure Virtual Machine`

## Features

- **8,642+ Icons** from 12 sources
- **Sidebar View** with visual icon browser
- **Smart Search** with real-time filtering
- **Category Filtering** by source and service
- **Size Control** from 16px to 512px
- **Smart Insertion** based on file type
- **Aspect Ratio Aware** - constrains longest side
- **File or Embed** options for Markdown

## Keyboard Shortcuts

- `Ctrl+Shift+P` / `Cmd+Shift+P` → Type "Cloud Architect Kits" to access commands
- No default shortcuts (can be customized in VS Code settings)

## Configuration

Currently no configurable settings. Future versions may include:
- Default icon size
- Default insertion format
- Assets directory location

## Troubleshooting

### Extension doesn't appear

- **Solution**: Check Extensions view (`Ctrl+Shift+X`) for "Cloud Architect Kits"
- **Verify**: Extension is enabled (not disabled)

### Icons not loading in sidebar

- **Solution**: Reload VS Code (`Ctrl+R` / `Cmd+R`)
- **Check**: Developer Console for errors (`Help` → `Toggle Developer Tools`)

### "No active editor found" error

- **Solution**: Click into a text file before inserting an icon
- **Note**: The extension tracks the last active editor even when sidebar is focused

### Assets folder not created (Markdown file insertion)

- **Solution**: Ensure you have write permissions in the file's directory
- **Check**: The directory exists and is not read-only

### Build from source fails

- **Solution**: Ensure prebuild step completed successfully
- **Check**: `src/prebuild/templates/icons-data.js` exists (~26MB)
- **Verify**: Node.js 20+ is installed

## File Structure

```
src/vscode/extension/
├── out/                         # Build output (gitignored)
│   ├── extension.js            # Compiled TypeScript
│   └── webview/                # Webview resources
│       ├── ui-base.html        # UI template
│       ├── ui-base.css         # Styles
│       ├── ui-base.js          # UI logic
│       └── icons-data.js       # Icon data (~26MB)
├── src/
│   └── extension.ts            # Extension logic
├── resources/
│   └── icon.svg                # Extension icon
├── build.js                    # Prebuild script
├── package.json                # Extension manifest
└── tsconfig.json               # TypeScript config
```

## Development

### Watch mode
```bash
cd src/vscode/extension
npm run watch  # Watches for TypeScript changes
```

### Debug
1. Open `src/vscode/extension` in VS Code
2. Press `F5` to launch Extension Development Host
3. Test the extension in the new window

### Rebuild
```bash
npm run compile
npm run package
```

### Clean build
```bash
rm -rf out
npm run package
```

## Uninstallation

1. Open Extensions view (`Ctrl+Shift+X`)
2. Find "Cloud Architect Kits"
3. Click the gear icon → **Uninstall**

Or via command line:
```bash
code --uninstall-extension cloud-architect-kits-vscode-extension
```

## Support

- **Issues**: [GitHub Issues](https://github.com/dinowang/cloud-architect-kits/issues)
- **Documentation**: [README.md](README.md)
- **Source**: [GitHub Repository](https://github.com/dinowang/cloud-architect-kits)
