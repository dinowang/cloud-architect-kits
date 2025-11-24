# Cloud Architect Kits - VSCode Extension

A VSCode extension that allows you to insert cloud architecture icons (Azure, AWS, GCP) directly into text files.

## Features

- **Sidebar Integration**: Access icons panel directly from VSCode Activity Bar (left sidebar)
- **Rich UI Interface**: Webview-based UI with visual icon browsing (same UI as other platform plugins)
- **Quick Icon Search**: Quickly search and filter through thousands of cloud architecture icons
- **Multi-Cloud Support**: Includes icons from Azure, AWS, GCP, and other cloud providers
- **Smart Insertion**: Different formats based on file type
  - **Markdown/Marp**: Choose between file reference or base64 embed
    - File reference: Saves SVG to `./assets/` and inserts `![width:64](./assets/icon.svg)` or `![height:64](./assets/icon.svg)` based on aspect ratio
    - Base64 embed: Inserts `<img>` tag with data URI, width/height constrained by aspect ratio
  - **HTML/XML/JSX/Vue/Svelte**: Raw SVG code
  - **Other files**: Icon name only
- **Category Filtering**: Icons are organized by source and service categories for easy navigation
- **Size Control**: Adjust icon size before insertion (16px - 512px)

## Usage

### Method 1: Sidebar (Recommended)

1. Click the Cloud Architect Kits icon in the Activity Bar (left sidebar)
2. The icons panel will open in the sidebar
3. Browse or search for icons
4. Click on an icon to insert it at the cursor position

### Method 2: Command Palette

1. Open any text file in VSCode
2. Place your cursor where you want to insert an icon
3. Open the Command Palette (`Cmd+Shift+P` on macOS or `Ctrl+Shift+P` on Windows/Linux)
4. Type "Cloud Architect Kits: Insert Icon" and press Enter
5. The sidebar view will open automatically

### Using the Icons Panel

1. The icons panel shows all available icons organized by source and category
2. Use the search box to filter icons by name, source, or category
3. Optionally adjust the icon size (default: 64px) before insertion
4. Click on an icon to insert its SVG content at the cursor position in the active editor

### Keyboard Shortcut (Optional)

You can assign a custom keyboard shortcut:

1. Open Keyboard Shortcuts (`Cmd+K Cmd+S` on macOS or `Ctrl+K Ctrl+S` on Windows/Linux)
2. Search for "Cloud Architect Kits: Insert Icon"
3. Assign your preferred shortcut

## Icon Sources

The extension includes icons from:
- Microsoft Azure
- Amazon Web Services (AWS)
- Google Cloud Platform (GCP)
- And more...

## Requirements

- VSCode version 1.80.0 or higher

## Extension Structure

```
src/vscode/extension/
├── src/
│   └── extension.ts       # Main extension code
├── build.js               # Build script to prepare resources
├── package.json
├── tsconfig.json
├── resources/             # Generated at build time (gitignored)
│   ├── icons.json
│   └── icons/
└── webview/               # Generated at build time (gitignored)
    ├── ui-base.html
    ├── ui-base.css
    ├── ui-base.js
    └── icons-data.js
```

## Development

To build and test the extension locally:

```bash
cd src/vscode/extension
npm install
npm run compile
```

To package the extension:

```bash
npm run package
```

This will create a `.vsix` file that can be installed in VSCode.

## License

See the root project LICENSE file for details.
