#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PREBUILD_DIR="$PROJECT_ROOT/src/prebuild"
FIGMA_DIR="$PROJECT_ROOT/src/figma/plugin"
PPT_DIR="$PROJECT_ROOT/src/powerpoint/add-in"
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

# Step 3: Copy icons to plugins
echo "==> Step 3: Copying icons to plugins..."
echo "--- Copying to Figma plugin..."
cp -r "$PREBUILD_DIR/icons" "$FIGMA_DIR/icons"
cp "$PREBUILD_DIR/icons.json" "$FIGMA_DIR/icons.json"

echo "--- Copying to PowerPoint add-in..."
cp -r "$PREBUILD_DIR/icons" "$PPT_DIR/icons"
cp "$PREBUILD_DIR/icons.json" "$PPT_DIR/icons.json"
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

# Step 6: Prepare distribution
echo "==> Step 6: Preparing distribution..."
mkdir -p "$DIST_DIR/figma-plugin"
mkdir -p "$DIST_DIR/powerpoint-addin"

echo "--- Packaging Figma plugin..."
cp "$FIGMA_DIR/manifest.json" "$DIST_DIR/figma-plugin/"
cp "$FIGMA_DIR/code.js" "$DIST_DIR/figma-plugin/"
cp "$FIGMA_DIR/ui-built.html" "$DIST_DIR/figma-plugin/"

echo "--- Packaging PowerPoint add-in..."
cp "$PPT_DIR/manifest.xml" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/taskpane-built.html" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/commands.html" "$DIST_DIR/powerpoint-addin/"
cp "$PPT_DIR/staticwebapp.config.json" "$DIST_DIR/powerpoint-addin/"
cp -r "$PPT_DIR/assets" "$DIST_DIR/powerpoint-addin/"

# Create zip files
echo "--- Creating release archives..."
cd "$DIST_DIR"
(cd figma-plugin && zip -r ../cloud-architect-kit-figma-plugin.zip .)
(cd powerpoint-addin && zip -r ../cloud-architect-kit-powerpoint-addin.zip .)

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
