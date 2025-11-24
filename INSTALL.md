# Cloud Architect Kits - Installation Guide

Choose your platform to get started:

## 🎨 Figma Plugin

For inserting icons into Figma designs.

**[→ Figma Plugin Installation Guide](./src/figma/INSTALL.md)**

Quick start:
```bash
cd src/figma/plugin
npm install
npm run build
# Then import manifest.json in Figma Desktop App
```

## 📊 PowerPoint Add-in

For adding icons to PowerPoint presentations.

**[→ PowerPoint Add-in Installation Guide](./src/powerpoint/INSTALL.md)**

Quick start:
```bash
cd src/powerpoint/add-in
npm install
npm run build
npm run serve
# Then sideload manifest.xml in PowerPoint
```

## 📈 Google Slides Add-on

For adding icons to Google Slides presentations.

**[→ Google Slides Add-on Installation Guide](./src/google-slides/INSTALL.md)**

Quick start:
```bash
cd src/google-slides/addon
npm install
npm run build
clasp push
# Then use from Extensions menu in Google Slides
```

## 📐 Draw.io Icon Libraries

For importing icons into Draw.io diagrams.

**[→ Draw.io Icon Libraries Installation Guide](./src/drawio/INSTALL.md)**

Quick start:
```bash
cd src/drawio/iconlib
npm install
npm run build
# Then load XML files from dist/drawio-iconlib/ in Draw.io
```

## 💻 VSCode Extension

For inserting icons into text files.

**[→ VSCode Extension Installation Guide](./src/vscode/INSTALL.md)**

Quick start:
```bash
cd src/vscode/extension
npm install
npm run compile
npm run package
# Then install the .vsix file in VSCode
```

## 📋 Prerequisites

Both platforms require:
- **Node.js** 14 or higher
- **npm** (comes with Node.js)

### Additional Requirements

**For Figma:**
- Figma Desktop App (for development)

**For PowerPoint:**
- PowerPoint (Office 365 or Office 2016+)
- Azure subscription (optional, for cloud deployment)

**For Google Slides:**
- Google Account (for deployment)
- @google/clasp CLI tool (`npm install -g @google/clasp`)

**For Draw.io:**
- Web browser or Draw.io Desktop App

**For VSCode:**
- Visual Studio Code 1.80.0 or higher

## 🔧 Development Setup

### Full Build (All Components)

```bash
# Build icons + both plugins
./scripts/build-and-release.sh
```

### Individual Components

#### 1. Prebuild Icons (Required First)

```bash
cd src/prebuild
npm run build
```

This processes ~4,300 icons from downloaded sources.

#### 2. Figma Plugin

```bash
cd src/figma/plugin
npm install
npm run build
```

The build script automatically copies templates from prebuild.

#### 3. PowerPoint Add-in

```bash
cd src/powerpoint/add-in
npm install
npm run build
```

The build script automatically copies templates from prebuild.

#### 4. Google Slides Add-on

```bash
cd src/google-slides/addon
npm install
npm run build
```

The build script automatically copies templates from prebuild.

#### 5. Draw.io Icon Libraries

```bash
cd src/drawio/iconlib
npm install
npm run build
```

#### 6. VSCode Extension

```bash
cd src/vscode/extension
npm install
npm run compile
```

The build script automatically copies icons from prebuild.

## 📚 Detailed Documentation

- **[Figma Plugin README](./src/figma/README.md)** - Features and usage
- **[Figma Plugin INSTALL](./src/figma/INSTALL.md)** - Step-by-step guide
- **[PowerPoint Add-in README](./src/powerpoint/README.md)** - Features and usage
- **[PowerPoint Add-in INSTALL](./src/powerpoint/INSTALL.md)** - Step-by-step guide
- **[Draw.io Icon Libraries README](./src/drawio/README.md)** - Features and usage
- **[Draw.io Icon Libraries INSTALL](./src/drawio/INSTALL.md)** - Step-by-step guide
- **[Google Slides Add-on README](./src/google-slides/README.md)** - Features and usage
- **[Google Slides Add-on INSTALL](./src/google-slides/INSTALL.md)** - Step-by-step guide
- **[VSCode Extension README](./src/vscode/README.md)** - Features and usage
- **[VSCode Extension INSTALL](./src/vscode/INSTALL.md)** - Step-by-step guide
- **[Prebuild System](./src/prebuild/README.md)** - Icon processing details

## 🆘 Need Help?

1. Check the platform-specific installation guides above
2. Review troubleshooting sections in each guide
3. See the [main README](./README.md) for project overview
4. Open an issue on GitHub

---

**Ready to start?** Pick your platform and follow the detailed guide!
