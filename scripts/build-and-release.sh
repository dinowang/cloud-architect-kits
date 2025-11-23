#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PREBUILD_DIR="$PROJECT_ROOT/src/prebuild"
FIGMA_DIR="$PROJECT_ROOT/src/figma/plugin"
PPT_DIR="$PROJECT_ROOT/src/powerpoint/add-in"
GSLIDES_DIR="$PROJECT_ROOT/src/google-slides/addon"
DRAWIO_DIR="$PROJECT_ROOT/src/drawio/iconlib"
DIST_DIR="$PROJECT_ROOT/dist"

echo "=========================================="
echo "Cloud Architect Kits - Full Build"
echo "=========================================="
echo ""

# Step 1: Download all icon sources
echo "==> Step 1: Downloading all icon sources..."
echo ""

echo "--- Downloading Azure icons..."
"$SCRIPT_DIR/download-azure-icons.sh"
echo ""

echo "--- Downloading Microsoft 365 icons..."
"$SCRIPT_DIR/download-m365-icons.sh"
echo ""

echo "--- Downloading Dynamics 365 icons..."
"$SCRIPT_DIR/download-d365-icons.sh"
echo ""

echo "--- Downloading Entra icons..."
"$SCRIPT_DIR/download-entra-icons.sh"
echo ""

echo "--- Downloading Power Platform icons..."
"$SCRIPT_DIR/download-powerplatform-icons.sh"
echo ""

echo "--- Downloading Kubernetes icons..."
"$SCRIPT_DIR/download-kubernetes-icons.sh"
echo ""

echo "--- Downloading Gilbarbara icons..."
"$SCRIPT_DIR/download-gilbarbara-icons.sh"
echo ""

echo "--- Downloading Lobe icons..."
"$SCRIPT_DIR/download-lobe-icons.sh"
echo ""

# Step 2: Prebuild icons
echo "==> Step 2: Pre-building icons..."
cd "$PREBUILD_DIR"
npm run build
echo ""

# Step 3: Plugins now use shared templates from prebuild
echo "==> Step 3: Plugins use shared templates from prebuild..."
echo "(No copying needed - plugins reference prebuild/templates directly)"
echo ""

# Step 4: Install dependencies and build Figma plugin
echo "==> Step 4: Building Figma plugin..."
cd "$FIGMA_DIR"
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
echo ""

# Step 5: Build PowerPoint add-in
echo "==> Step 5: Building PowerPoint add-in..."
cd "$PPT_DIR"
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
echo ""

# Step 6: Build Google Slides add-on
echo "==> Step 6: Building Google Slides add-on..."
cd "$GSLIDES_DIR"
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
echo ""

# Step 7: Build Draw.io icon libraries
echo "==> Step 7: Building Draw.io icon libraries..."
cd "$DRAWIO_DIR"
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
echo ""

# Step 8: Prepare distribution
echo "==> Step 8: Preparing distribution..."
mkdir -p "$DIST_DIR/figma-plugin"
mkdir -p "$DIST_DIR/powerpoint-addin"
mkdir -p "$DIST_DIR/google-slides-addon"

echo "--- Packaging Figma plugin..."
cp "$FIGMA_DIR/manifest.json" "$DIST_DIR/figma-plugin/"
cp "$FIGMA_DIR/code.js" "$DIST_DIR/figma-plugin/"
cp "$FIGMA_DIR/ui.html" "$DIST_DIR/figma-plugin/"

echo "--- Packaging PowerPoint add-in..."
cp "$PPT_DIR/manifest.xml" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/taskpane.html" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/taskpane.css" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/taskpane.js" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/icons-data.js" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/commands.html" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/staticwebapp.config.json" "$DIST_DIR/powerpoint-addin/"
cp -r "$PPT_DIR/assets" "$DIST_DIR/powerpoint-addin/"

echo "--- Packaging Google Slides add-on..."
cp "$GSLIDES_DIR/appsscript.json" "$DIST_DIR/google-slides-addon/"
cp "$GSLIDES_DIR/Code.gs" "$DIST_DIR/google-slides-addon/"
cp "$GSLIDES_DIR/Sidebar.html" "$DIST_DIR/google-slides-addon/"
cp "$GSLIDES_DIR/SidebarScript.html" "$DIST_DIR/google-slides-addon/"
cp "$GSLIDES_DIR/SidebarData.html" "$DIST_DIR/google-slides-addon/"
cp "$GSLIDES_DIR/SidebarPlatform.html" "$DIST_DIR/google-slides-addon/"

# Create zip files
echo "--- Creating release archives..."
cd "$DIST_DIR"
(cd figma-plugin && zip -r ../cloud-architect-kit-figma-plugin.zip .)
(cd powerpoint-addin && zip -r ../cloud-architect-kit-powerpoint-addin.zip .)
(cd google-slides-addon && zip -r ../cloud-architect-kit-google-slides-addon.zip .)
(cd drawio-iconlib && zip -r ../cloud-architect-kit-drawio-iconlib.zip .)

echo ""
echo "=========================================="
echo "Build completed successfully!"
echo "=========================================="
echo ""
echo "Distribution files are in: $DIST_DIR"
echo ""
echo "Figma Plugin:"
ls -lh "$DIST_DIR/figma-plugin"
echo ""
echo "PowerPoint Add-in:"
ls -lh "$DIST_DIR/powerpoint-addin"
echo ""
echo "Google Slides Add-on:"
ls -lh "$DIST_DIR/google-slides-addon"
echo ""
echo "Draw.io Icon Libraries:"
ls -lh "$DIST_DIR/drawio-iconlib" | head -15
echo ""
echo "Release archives:"
ls -lh "$DIST_DIR"/*.zip
echo ""
echo "To install Figma plugin:"
echo "  1. Open Figma Desktop App"
echo "  2. Go to Plugins → Development → Import plugin from manifest..."
echo "  3. Select: $DIST_DIR/figma-plugin/manifest.json"
echo ""
echo "To install PowerPoint add-in:"
echo "  1. Extract cloud-architect-kit-powerpoint-addin.zip"
echo "  2. Deploy to Azure Static Web Apps or local server"
echo "  3. Sideload manifest.xml in PowerPoint"
echo ""
echo "To install Google Slides add-on:"
echo "  1. Extract cloud-architect-kit-google-slides-addon.zip"
echo "  2. Use clasp to push to Google Apps Script"
echo "  3. Run from Extensions → Cloud Architect Kits"
echo ""
echo "To use Draw.io icon libraries:"
echo "  1. Open Draw.io (https://app.diagrams.net)"
echo "  2. Go to File → Open Library from → Device"
echo "  3. Select a library file from: $DIST_DIR/drawio-iconlib/"
echo ""
