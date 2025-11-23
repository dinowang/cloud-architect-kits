# Scripts

Collection of automation scripts for downloading and processing cloud architecture icons.

## Available Scripts

### build-and-release.sh

Main script that builds and packages all components for distribution.

**Usage:**
```bash
./scripts/build-and-release.sh
```

**Build Process:**
1. Download all icon sources
2. Pre-build icons (normalize & index)
3. Build Figma plugin
4. Build PowerPoint add-in
5. Build Google Slides add-on
6. Build Draw.io icon library
7. Package release archives

**Output:**
- `dist/figma-plugin/` - Figma plugin files
- `dist/powerpoint-addin/` - PowerPoint add-in files
- `dist/google-slides-addon/` - Google Slides add-on files
- `dist/drawio-iconlib/` - Draw.io icon library files
- `dist/cloud-architect-kit-figma-plugin.zip`
- `dist/cloud-architect-kit-powerpoint-addin.zip`
- `dist/cloud-architect-kit-google-slides-addon.zip`
- `dist/cloud-architect-kit-drawio-iconlib.zip`

---

## Icon Download Scripts

### download-azure-icons.sh

Downloads Azure Architecture icon set.

**Usage:**
```bash
./scripts/download-azure-icons.sh
```

**Statistics:**
- SVG files: ~705
- File size: ~3 MB

---

### download-m365-icons.sh

Downloads Microsoft 365 icon set.

**Usage:**
```bash
./scripts/download-m365-icons.sh
```

**Statistics:**
- Total files: 1,011
- SVG files: 963
- PNG files: 48
- File size: 696 KB

**Icon Categories:**
- Microsoft Blue
- Microsoft Purple  
- Teams Purple
- SharePoint Teal
- Planner Green
- Project Green

---

### download-powerplatform-icons.sh

Downloads Power Platform product icon set.

**Usage:**
```bash
./scripts/download-powerplatform-icons.sh
```

**Statistics:**
- Total files: 11
- SVG files: 9
- PDF files: 2
- File size: 165 KB

**Included Products:**
- Power Platform
- Power BI
- Power Apps
- Power Automate
- Power Pages
- Dataverse
- Copilot Studio
- Power Fx
- AI Builder

---

### download-d365-icons.sh

Downloads Dynamics 365 icon set.

**Usage:**
```bash
./scripts/download-d365-icons.sh
```

**Statistics:**
- SVG files: ~38

---

### download-entra-icons.sh

Downloads Microsoft Entra icon set.

**Usage:**
```bash
./scripts/download-entra-icons.sh
```

**Statistics:**
- SVG files: ~7

---

### download-kubernetes-icons.sh

Downloads Kubernetes icon set.

**Usage:**
```bash
./scripts/download-kubernetes-icons.sh
```

**Statistics:**
- SVG files: ~39

---

### download-gilbarbara-icons.sh

Downloads Gilbarbara technology logo icon set.

**Usage:**
```bash
./scripts/download-gilbarbara-icons.sh
```

**Statistics:**
- SVG files: ~1,839

---

### download-lobe-icons.sh

Downloads Lobe Icons set.

**Usage:**
```bash
./scripts/download-lobe-icons.sh
```

**Statistics:**
- SVG files: ~723

---

### download-fabric-icons.sh

Downloads Microsoft Fabric icon set.

**Usage:**
```bash
./scripts/download-fabric-icons.sh
```

**Statistics:**
- SVG files: ~80+
- Resolution: 48x48 color icons

**Included Services:**
- Fabric workspace icons
- Data Factory
- Synapse Analytics
- Data Lake
- Power BI integration
- And more data analytics services

---

## Output Locations

All download scripts save files to the `temp/` directory:

```
temp/
├── azure-icons/
├── m365-icons/
├── d365-icons/
├── entra-icons/
├── powerplatform-icons/
├── fabric-icons/
├── kubernetes-icons/
├── gilbarbara-icons/
└── lobe-icons/
```

Pre-build system processes icons into:

```
src/prebuild/
├── icons/             # Normalized SVG files (~4,400+ files)
├── icons.json         # Icon index and metadata
└── templates/         # Shared UI templates
    ├── icons-data.js  # Minified icon data
    ├── icons-data.hash # Cache-busting hash
    ├── ui-base.html   # Base UI template
    └── ui-base.css    # Base UI styles
```

## Quick Start

### Full Build Process

```bash
# Run complete build (recommended)
./scripts/build-and-release.sh
```

### Download Icons Only

```bash
# Download all icon sources
./scripts/download-azure-icons.sh
./scripts/download-m365-icons.sh
./scripts/download-d365-icons.sh
./scripts/download-entra-icons.sh
./scripts/download-powerplatform-icons.sh
./scripts/download-fabric-icons.sh
./scripts/download-kubernetes-icons.sh
./scripts/download-gilbarbara-icons.sh
./scripts/download-lobe-icons.sh
```

## Documentation

For detailed development documentation, see the `docs/` directory.
