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
cp -r ../../prebuild/icons ./icons
cp ../../prebuild/icons.json ./icons.json
npm install
npm run build
```

#### 3. PowerPoint Add-in

```bash
cd src/powerpoint/add-in
cp -r ../../prebuild/icons ./icons
cp ../../prebuild/icons.json ./icons.json
npm install
npm run build
```

## 📚 Detailed Documentation

- **[Figma Plugin README](./src/figma/README.md)** - Features and usage
- **[Figma Plugin INSTALL](./src/figma/INSTALL.md)** - Step-by-step guide
- **[PowerPoint Add-in README](./src/powerpoint/README.md)** - Features and usage
- **[PowerPoint Add-in INSTALL](./src/powerpoint/INSTALL.md)** - Step-by-step guide
- **[Prebuild System](./src/prebuild/README.md)** - Icon processing details

## 🆘 Need Help?

1. Check the platform-specific installation guides above
2. Review troubleshooting sections in each guide
3. See the [main README](./README.md) for project overview
4. Open an issue on GitHub

---

**Ready to start?** Pick your platform and follow the detailed guide!
