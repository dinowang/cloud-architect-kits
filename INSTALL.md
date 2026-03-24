# Installation Guide

This document provides installation instructions for all Cloud Architect Kits packages.

## Table of Contents

- [Figma Plugin](#figma-plugin)
- [PowerPoint Add-in](#powerpoint-add-in)
- [Google Slides Add-on](#google-slides-add-on)
- [Draw.io Icon Libraries](#drawio-icon-libraries)
- [VS Code Extension](#vs-code-extension)

---

## Figma Plugin

### Installation

1. Download `cloud-architect-kits-figma-plugin.zip` from [Releases](https://github.com/dinowang/cloud-architect-kits/releases)
2. Extract the ZIP file
3. In Figma, go to **Menu** → **Plugins** → **Development** → **Import plugin from manifest**
4. Select the `manifest.json` file from the extracted folder
5. The plugin will appear in **Menu** → **Plugins** → **Cloud Architect Kits**

### Usage

1. Open Figma and create or open a file
2. Go to **Menu** → **Plugins** → **Cloud Architect Kits**
3. Browse icons using search and filters
4. Adjust size (16-512px)
5. Click an icon to insert it onto the canvas

For detailed instructions, see [src/figma/INSTALL.md](src/figma/INSTALL.md)

---

## PowerPoint Add-in

### Installation Options

#### Option 1: Sideload from File (Desktop)
1. Download `cloud-architect-kits-powerpoint-addin.zip`
2. Extract to a web server or use Azure Static Web Apps
3. Edit `manifest.xml` with your hosting URL
4. In PowerPoint, go to **Insert** → **Get Add-ins** → **Upload My Add-in**
5. Upload the `manifest.xml` file

#### Option 2: Deploy to Azure Static Web Apps
1. Extract the ZIP file
2. Deploy to Azure Static Web Apps:
   ```bash
   az staticwebapp create --name my-addin --resource-group my-rg --source .
   ```
3. Use Azure Static Web App URL in manifest.xml
4. Sideload the manifest

### Usage

1. Open PowerPoint
2. Go to **Insert** → **My Add-ins**
3. Select **Cloud Architect Kits**
4. Browse and insert icons from the taskpane

For detailed instructions, see [src/powerpoint/INSTALL.md](src/powerpoint/INSTALL.md)

---

## Google Slides Add-on

### Installation

1. Download `cloud-architect-kits-google-slides-addon.zip`
2. Extract the files
3. Install [clasp](https://github.com/google/clasp):
   ```bash
   npm install -g @google/clasp
   ```
4. Login and create project:
   ```bash
   clasp login
   clasp create --type slides --title "Cloud Architect Kits"
   ```
5. Push files:
   ```bash
   clasp push
   ```
6. Deploy as add-on:
   ```bash
   clasp deploy
   ```

### Usage

1. Open Google Slides
2. Go to **Extensions** → **Cloud Architect Kits** → **Show Sidebar**
3. Browse and insert icons from the sidebar

For detailed instructions, see [src/google-slides/INSTALL.md](src/google-slides/INSTALL.md)

---

## Draw.io Icon Libraries

### Installation

1. Download `cloud-architect-kits-drawio-iconlib.zip`
2. Extract the ZIP file (contains 9 XML library files)
3. Open Draw.io (desktop or web)
4. Go to **File** → **Open Library from** → **Device...**
5. Select one or more XML files to import

### Available Libraries

- `cloud-architect-thesvg.xml` (3,999 icons)
- `cloud-architect-gilbarbara.xml` (1,776 icons)
- `cloud-architect-microsoft-365.xml` (963 icons)
- `cloud-architect-lobe-icons.xml` (727 icons)
- `cloud-architect-azure.xml` (705 icons)
- `cloud-architect-aws.xml` (321 icons)
- `cloud-architect-gcp.xml` (45 icons)
- `cloud-architect-kubernetes.xml` (39 icons)
- `cloud-architect-dynamics-365.xml` (38 icons)
- `cloud-architect-fabric.xml` (13 icons)
- `cloud-architect-power-platform.xml` (9 icons)
- `cloud-architect-entra.xml` (7 icons)

### Usage

1. Libraries appear in the left sidebar
2. Drag and drop icons onto the canvas
3. Resize and style as needed

For detailed instructions, see [src/drawio/INSTALL.md](src/drawio/INSTALL.md)

---

## VS Code Extension

### Installation

1. Download `cloud-architect-kits-vscode-extension-1.0.0.vsix`
2. Open VS Code
3. Go to **Extensions** view (Ctrl+Shift+X / Cmd+Shift+X)
4. Click the **"..."** menu → **Install from VSIX...**
5. Select the downloaded `.vsix` file
6. Reload VS Code

### Usage

1. Open a file in VS Code
2. Open the **Cloud Architect Kits** sidebar (click icon in activity bar)
3. Browse icons with search and filters
4. Adjust size (16-512px)
5. Click an icon to insert

**Insertion behavior varies by file type:**
- **Markdown**: Choose between file reference (`![](./assets/icon.svg)`) or base64 embed
- **HTML/XML/JSX/Vue/Svelte**: Raw SVG code
- **Other files**: Icon name only

For detailed instructions, see [src/vscode/INSTALL.md](src/vscode/INSTALL.md)

---

## Troubleshooting

### General Issues

**Icons not loading:**
- Check internet connection (for web-based add-ins)
- Verify files are properly extracted
- Try reloading/restarting the application

**Build from source:**
```bash
# Clone repository
git clone https://github.com/dinowang/cloud-architect-kits.git
cd cloud-architect-kits

# Build all packages
./scripts/build-and-release.sh

# Packages will be in dist/
```

### Platform-Specific

- **Figma**: Make sure you're using Figma Desktop or Figma in browser
- **PowerPoint**: Add-in requires Microsoft 365 or PowerPoint 2016+
- **Google Slides**: Requires Google Apps Script API enabled
- **Draw.io**: Compatible with desktop app and web version
- **VS Code**: Requires VS Code 1.80.0 or higher

---

## Support

- **Issues**: [GitHub Issues](https://github.com/dinowang/cloud-architect-kits/issues)
- **Documentation**: [README.md](README.md)
- **Source**: [GitHub Repository](https://github.com/dinowang/cloud-architect-kits)

---

## License

See [LICENSE](LICENSE) for details.
