# Installation Guide - Cloud Architect Kits VSCode Extension

## Prerequisites

- VSCode version 1.80.0 or higher
- Node.js 18.x or higher
- npm or yarn package manager

## Installation Methods

### Method 1: Install from VSIX File (Recommended)

1. Download the latest `.vsix` file from the releases
2. Open VSCode
3. Open the Command Palette (`Cmd+Shift+P` on macOS or `Ctrl+Shift+P` on Windows/Linux)
4. Type "Extensions: Install from VSIX..."
5. Select the downloaded `.vsix` file
6. Restart VSCode

### Method 2: Build from Source



#### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd cloud-architect-kits
```

#### Step 2: Install Dependencies

```bash
cd src/vscode/extension
npm install
```

#### Step 3: Compile the Extension

```bash
npm run compile
```

#### Step 4: Package the Extension (Optional)

```bash
npm run package
```

This creates a `.vsix` file in the current directory.

#### Step 5: Install in VSCode

**Option A: Install via VSIX**
1. Follow Method 1 above using the generated `.vsix` file

**Option B: Run in Development Mode**
1. Open the `src/vscode/extension` folder in VSCode
2. Press `F5` to launch the Extension Development Host
3. Test the extension in the new VSCode window

## Verify Installation

1. Open VSCode
2. Open the Command Palette
3. Type "Cloud Architect Kits"
4. You should see "Cloud Architect Kits: Insert Icon" command

## Troubleshooting

### Extension Not Found in Command Palette

- Make sure VSCode is restarted after installation
- Check if the extension is enabled in the Extensions view (`Cmd+Shift+X` or `Ctrl+Shift+X`)

### Icons Not Loading

- Make sure the extension was built properly (`npm run compile`)
- Verify that the `resources/` and `webview/` directories exist after build
- Check VSCode Developer Console for errors (Help > Toggle Developer Tools)
- Try rebuilding: `cd src/vscode/extension && npm run compile`

### Build Errors

Make sure you have the correct Node.js version:
```bash
node --version  # Should be 18.x or higher
```

Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Uninstallation

1. Open VSCode Extensions view (`Cmd+Shift+X` or `Ctrl+Shift+X`)
2. Find "Cloud Architect Kits"
3. Click the gear icon and select "Uninstall"
4. Restart VSCode

## Updates

### From VSIX

1. Uninstall the current version
2. Install the new `.vsix` file following Method 1

### From Source

```bash
cd src/vscode/extension
git pull
npm install
npm run compile
npm run package
```

Then reinstall the new `.vsix` file.

## Support

For issues or questions, please open an issue in the project repository.
