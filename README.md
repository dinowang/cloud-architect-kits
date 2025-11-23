# Cloud Architect Kits

A comprehensive toolkit bringing **4,400+ professional cloud architecture and technology icons** directly into your favorite design and presentation tools.

## 🎯 What's Included

- **🎨 [Figma Plugin](./src/figma)** - Insert icons into Figma designs
- **📊 [PowerPoint Add-in](./src/powerpoint)** - Add icons to PowerPoint presentations
- **📈 [Google Slides Add-on](./src/google-slides)** - Add icons to Google Slides presentations
- **📐 [Draw.io Icon Libraries](./src/drawio)** - Import icons into Draw.io diagrams
- **🔧 Unified Icon System** - Consistent library across all platforms
- **☁️ Azure Deployment** - Host PowerPoint add-in on Azure Static Web Apps

## ✨ Icon Library

### 4,400+ Professional Icons From:

| Source | Count | Description |
|--------|-------|-------------|
| **Azure Architecture** | ~705 | Official Azure service icons |
| **Microsoft 365** | ~963 | Office and productivity icons |
| **Gilbarbara Logos** | ~1,839 | Technology company logos |
| **Lobe Icons** | ~723 | Machine learning icons |
| **Microsoft Fabric** | ~80+ | Data analytics and BI icons |
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

### For Google Slides Users

```bash
cd src/google-slides/addon
npm install
npm run build
```

Then deploy with `clasp push` to Google Apps Script.

📖 [Detailed Google Slides Instructions →](./src/google-slides/INSTALL.md)

### For Draw.io Users

```bash
cd src/drawio/iconlib
npm install
npm run build
```

Then load library files from `dist/drawio-iconlib/` in Draw.io.

📖 [Detailed Draw.io Instructions →](./src/drawio/INSTALL.md)

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
          │   System     │     - Normalize SVGs
          └──────┬──────┘     - Generate templates
                 │            - Create icons-data.js
       ┌─────────┴─────────────────┐
       │         │         │        │
  ┌────▼─────┐ ┌▼──────┐ ┌▼──────┐ ┌▼──────┐
  │  Figma   │ │ PPT   │ │Google │ │Draw.io│
  │  Plugin  │ │Add-in │ │Slides │ │Library│
  └──────────┘ └───────┘ └───────┘ └───────┘
```

**Benefits:**
- ✅ **Consistency** - Same icons across all platforms
- ⚡ **Efficiency** - Icons processed once, used everywhere
- 🔄 **Easy Updates** - Update icons in one place
- 📦 **Maintainability** - Single source of truth

## 📦 Project Structure

```
cloud-architect-kits/
├── README.md                    # This file
├── INSTALL.md                   # Installation index
├── src/
│   ├── prebuild/                # Unified icon processing
│   │   ├── process-icons.js    # Icon normalization
│   │   ├── templates/          # Shared UI templates
│   │   │   ├── ui-base.html    # HTML structure
│   │   │   ├── ui-base.css     # Styles
│   │   │   ├── ui-base.js      # UI logic
│   │   │   ├── icons-data.js   # Icon data (~26MB)
│   │   │   └── icons-data.hash # Cache-busting hash
│   │   └── icons/ + icons.json (generated)
│   │
│   ├── figma/                   # Figma plugin
│   │   ├── README.md           # Plugin docs
│   │   ├── INSTALL.md          # Install guide
│   │   └── plugin/             # Plugin code
│   │       ├── manifest.json   # Figma manifest
│   │       ├── code.ts         # Backend logic
│   │       ├── ui.html         # Generated UI (standalone)
│   │       └── build.js        # Build script
│   │
│   ├── powerpoint/              # PowerPoint add-in
│   │   ├── README.md           # Add-in docs
│   │   ├── INSTALL.md          # Install guide
│   │   ├── add-in/             # Add-in code
│   │   │   ├── manifest.xml    # Office manifest
│   │   │   ├── taskpane.html   # Generated UI
│   │   │   ├── taskpane.css    # Generated styles
│   │   │   ├── taskpane.js     # Generated logic
│   │   │   ├── icons-data.js   # Generated data
│   │   │   └── build.js        # Build script
│   │   └── terraform/          # Azure infrastructure
│   │
│   ├── google-slides/           # Google Slides add-on
│   │   ├── README.md           # Add-on docs
│   │   ├── INSTALL.md          # Install guide
│   │   └── addon/              # Add-on code
│   │       ├── appsscript.json # Apps Script config
│   │       ├── Code.gs         # Server-side code
│   │       ├── Sidebar*.html   # Generated UI parts
│   │       └── build.js        # Build script
│   │
│   └── drawio/                  # Draw.io icon libraries
│       ├── README.md           # Library docs
│       ├── INSTALL.md          # Install guide
│       └── iconlib/            # Generator code
│           ├── generate-library.js
│           └── build.js        # Build script
│
├── scripts/                     # Download & build scripts
│   ├── download-*.sh           # Icon source downloaders
│   └── build-and-release.sh    # Unified build script
├── temp/                        # Downloaded sources
└── dist/                        # Release packages
    ├── figma-plugin/
    ├── powerpoint-addin/
    ├── google-slides-addon/
    └── drawio-iconlib/
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

# 4. Build Google Slides add-on
cd ../../google-slides/addon
npm run build

# 5. Build Draw.io icon libraries
cd ../../drawio/iconlib
npm run build
```

## 📚 Documentation

- **[Installation Guide](./INSTALL.md)** - Choose your platform
- **[Figma Plugin](./src/figma/README.md)** - Figma-specific docs
- **[PowerPoint Add-in](./src/powerpoint/README.md)** - PowerPoint-specific docs
- **[Google Slides Add-on](./src/google-slides/README.md)** - Google Slides-specific docs
- **[Draw.io Icon Libraries](./src/drawio/README.md)** - Draw.io-specific docs
- **[Prebuild System](./src/prebuild/README.md)** - Icon processing docs

## 🎯 Use Cases

### For Designers (Figma)

- **System Diagrams** - Architecture documentation
- **Design Systems** - Consistent icon libraries
- **UI/UX Design** - Cloud service representations
- **Wireframes** - Technology stack visualization

### For Presenters (PowerPoint & Google Slides)

- **Architecture Presentations** - Technical diagrams
- **Executive Briefings** - High-level overviews
- **Training Materials** - Educational content
- **Documentation** - Technical specifications
- **Collaborative Presentations** - Cloud-based editing

### For Diagram Makers (Draw.io)

- **System Architecture** - Cloud infrastructure diagrams
- **Network Diagrams** - Network topology visualization
- **Data Flow Diagrams** - Information flow documentation
- **Process Flows** - Business and technical processes
- **Documentation** - Visual technical documentation

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

### Google Slides Add-on

- **Node.js** 14+
- **Google Account** (for deployment)
- **npm**
- **@google/clasp** (for deployment)

### Draw.io Icon Libraries

- **Node.js** 14+
- **npm**
- **Web browser** or **Draw.io Desktop App**

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
