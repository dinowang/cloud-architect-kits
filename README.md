# Cloud Architect Kits

A comprehensive toolkit bringing **4,300+ professional cloud architecture and technology icons** directly into your favorite design and presentation tools.

## 🎯 What's Included

- **🎨 [Figma Plugin](./src/figma)** - Insert icons into Figma designs
- **📊 [PowerPoint Add-in](./src/powerpoint)** - Add icons to PowerPoint presentations
- **🔧 Unified Icon System** - Consistent library across all platforms
- **☁️ Azure Deployment** - Host PowerPoint add-in on Azure Static Web Apps

## ✨ Icon Library

### 4,323 Professional Icons From:

| Source | Count | Description |
|--------|-------|-------------|
| **Azure Architecture** | ~705 | Official Azure service icons |
| **Microsoft 365** | ~963 | Office and productivity icons |
| **Gilbarbara Logos** | ~1,839 | Technology company logos |
| **Lobe Icons** | ~723 | Machine learning icons |
| **Kubernetes** | ~39 | Container orchestration icons |
| **Dynamics 365** | ~38 | Business application icons |
| **Power Platform** | ~9 | Low-code platform icons |
| **Microsoft Entra** | ~7 | Identity and access icons |

## 🚀 Quick Start

### For Figma Users

```bash
cd src/figma/plugin
npm install
npm run build
```

Then import `manifest.json` in Figma Desktop App.

📖 [Detailed Figma Instructions →](./src/figma/INSTALL.md)

### For PowerPoint Users

```bash
cd src/powerpoint/add-in
npm install
npm run build
npm run serve
```

Then sideload `manifest.xml` in PowerPoint.

📖 [Detailed PowerPoint Instructions →](./src/powerpoint/INSTALL.md)

## ✨ Features

- **🔍 Smart Search** - Filter by name, source, or category
- **📐 Aspect Ratio Preserved** - Icons maintain proper proportions
- **⚡ Fast Performance** - Optimized for quick insertion
- **📊 Live Filtering** - Real-time icon count updates
- **🔝 Smart Navigation** - Sticky headers keep you oriented
- **🎯 One-Click Insert** - Intuitive workflow
- **48x48 Previews** - Clear icon thumbnails

## 🏗️ Architecture

### Unified Icon Processing

```
┌─────────────────────────────────────────┐
│  Icon Sources (Official Repositories)   │
└────────────────┬────────────────────────┘
                 │
          ┌──────▼──────┐
          │   Prebuild   │  ← Process once
          │   System     │     Normalize
          └──────┬──────┘     Index
                 │
       ┌─────────┴─────────┐
       │                   │
  ┌────▼─────┐      ┌─────▼──────┐
  │  Figma   │      │ PowerPoint │
  │  Plugin  │      │  Add-in    │
  └──────────┘      └────────────┘
```

**Benefits:**
- ✅ **Consistency** - Same icons across all platforms
- ⚡ **Efficiency** - Icons processed once, used everywhere
- 🔄 **Easy Updates** - Update icons in one place
- 📦 **Maintainability** - Single source of truth

## 📦 Project Structure

```
cloudarchitect-kits/
├── README.md                  # This file
├── INSTALL.md                 # Installation index
├── src/
│   ├── prebuild/              # Unified icon processing
│   │   ├── process-icons.js  # Icon normalization
│   │   └── icons/ + icons.json (generated)
│   │
│   ├── figma/                 # Figma plugin
│   │   ├── README.md         # Plugin docs
│   │   ├── INSTALL.md        # Install guide
│   │   └── plugin/           # Plugin code
│   │       ├── manifest.json # Figma manifest
│   │       ├── code.ts       # Backend logic
│   │       └── ui.html       # UI interface
│   │
│   └── powerpoint/            # PowerPoint add-in
│       ├── README.md         # Add-in docs
│       ├── INSTALL.md        # Install guide
│       ├── add-in/           # Add-in code
│       │   ├── manifest.xml  # Office manifest
│       │   └── taskpane.*    # UI files
│       └── terraform/        # Azure infrastructure
│
├── scripts/                   # Download & build scripts
├── temp/                      # Downloaded sources
└── dist/                      # Release packages
```

## 🛠️ Development

### Full Build Process

```bash
# Download icons + Build everything
./scripts/build-and-release.sh
```

### Individual Components

```bash
# 1. Prebuild icons
cd src/prebuild
npm run build

# 2. Build Figma plugin
cd ../figma/plugin
npm run build

# 3. Build PowerPoint add-in
cd ../../powerpoint/add-in
npm run build
```

## 📚 Documentation

- **[Installation Guide](./INSTALL.md)** - Choose your platform
- **[Figma Plugin](./src/figma/README.md)** - Figma-specific docs
- **[PowerPoint Add-in](./src/powerpoint/README.md)** - PowerPoint-specific docs
- **[Prebuild System](./src/prebuild/README.md)** - Icon processing docs

## 🎯 Use Cases

### For Designers (Figma)

- **System Diagrams** - Architecture documentation
- **Design Systems** - Consistent icon libraries
- **UI/UX Design** - Cloud service representations
- **Wireframes** - Technology stack visualization

### For Presenters (PowerPoint)

- **Architecture Presentations** - Technical diagrams
- **Executive Briefings** - High-level overviews
- **Training Materials** - Educational content
- **Documentation** - Technical specifications

## 🔧 Requirements

### Figma Plugin

- **Node.js** 14+
- **Figma Desktop App** (for development)
- **npm**

### PowerPoint Add-in

- **Node.js** 14+
- **PowerPoint** (Office 365 or 2016+)
- **npm**
- **Azure subscription** (optional, for deployment)

## 📄 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: See individual plugin READMEs
- **Questions**: Create a Discussion

---

**Made with ❤️ for cloud architects, designers, and presenters**
