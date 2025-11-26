#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PREBUILD_DIR="$PROJECT_ROOT/src/prebuild"
FIGMA_DIR="$PROJECT_ROOT/src/figma/plugin"
PPT_DIR="$PROJECT_ROOT/src/powerpoint/add-in"
GSLIDES_DIR="$PROJECT_ROOT/src/google-slides/addon"
DRAWIO_DIR="$PROJECT_ROOT/src/drawio/iconlib"
VSCODE_DIR="$PROJECT_ROOT/src/vscode/extension"
DIST_DIR="$PROJECT_ROOT/dist"

echo "=========================================="
echo "Cloud Architect Kits - Full Build"
echo "=========================================="
echo ""

# Step 1: Download all icon sources
echo "==> Step 1: Downloading all icon sources..."
echo ""

echo "--- Downloading AWS icons..."
"$SCRIPT_DIR/download-aws-icons.sh"
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

echo "--- Downloading Microsoft Fabric icons..."
"$SCRIPT_DIR/download-fabric-icons.sh"
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

echo "--- Downloading Fabric icons..."
"$SCRIPT_DIR/download-fabric-icons.sh"
echo ""

echo "--- Downloading GCP icons..."
"$SCRIPT_DIR/download-gcp-icons.sh"
echo ""

# Step 2: Prebuild icons and templates
echo "==> Step 2: Pre-building icons and templates..."
cd "$PREBUILD_DIR"
npm run build
echo ""

# Step 3: Build Figma plugin
echo "==> Step 3: Building Figma plugin..."
cd "$FIGMA_DIR"
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
echo ""

# Step 4: Build PowerPoint add-in
echo "==> Step 4: Building PowerPoint add-in..."
cd "$PPT_DIR"
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
echo ""

# Step 5: Build Google Slides add-on
echo "==> Step 5: Building Google Slides add-on..."
cd "$GSLIDES_DIR"
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
echo ""

# Step 6: Build Draw.io icon libraries
echo "==> Step 6: Building Draw.io icon libraries..."
cd "$DRAWIO_DIR"
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
echo ""

# Step 7: Build VSCode extension
echo "==> Step 7: Building VSCode extension..."
cd "$VSCODE_DIR"
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run package
echo ""

# Step 8: Build postbuild aggregation
echo "==> Step 8: Building postbuild aggregation..."
cd "$PROJECT_ROOT/src/postbuild"
npm run build
echo ""

# Step 9: Package to dist
echo "==> Step 9: Packaging to dist..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Package Figma plugin
echo "--- Packaging Figma plugin..."
cd "$FIGMA_DIR/out"
zip -r "$DIST_DIR/cloud-architect-kits-figma-plugin.zip" .
echo "✓ Created: cloud-architect-kits-figma-plugin.zip"

# Package PowerPoint add-in
echo "--- Packaging PowerPoint add-in..."
cd "$PPT_DIR/out"
zip -r "$DIST_DIR/cloud-architect-kits-powerpoint-addin.zip" .
echo "✓ Created: cloud-architect-kits-powerpoint-addin.zip"

# Package Google Slides add-on
echo "--- Packaging Google Slides add-on..."
cd "$GSLIDES_DIR/out"
zip -r "$DIST_DIR/cloud-architect-kits-google-slides-addon.zip" .
echo "✓ Created: cloud-architect-kits-google-slides-addon.zip"

# Package Draw.io libraries
echo "--- Packaging Draw.io libraries..."
cd "$DRAWIO_DIR/out"
zip -r "$DIST_DIR/cloud-architect-kits-drawio-iconlib.zip" .
echo "✓ Created: cloud-architect-kits-drawio-iconlib.zip"

# Copy VSCode extension .vsix
echo "--- Packaging VSCode extension..."
if [ -f "$VSCODE_DIR"/*.vsix ]; then
  cp "$VSCODE_DIR"/*.vsix "$DIST_DIR/"
  echo "✓ Copied: $(basename "$VSCODE_DIR"/*.vsix)"
fi

echo ""
echo "=========================================="
echo "Build completed successfully!"
echo "=========================================="
echo ""
echo "Distribution files in: $DIST_DIR"
ls -lh "$DIST_DIR"
echo ""
