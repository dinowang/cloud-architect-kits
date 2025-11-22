#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC_DIR="$PROJECT_ROOT/src/figma-cloudarchitect"
DIST_DIR="$PROJECT_ROOT/dist"

echo "=========================================="
echo "Figma Cloud Architect - Full Build"
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

# Step 2: Install dependencies
echo "==> Step 2: Installing dependencies..."
cd "$SRC_DIR"
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "Dependencies already installed, skipping..."
fi
echo ""

# Step 3: Build the plugin
echo "==> Step 3: Building Figma plugin..."
(cd $SRC_DIR && npm run build)
echo ""

# Step 4: Prepare distribution
echo "==> Step 4: Preparing distribution..."
mkdir -p "$DIST_DIR"

# Copy necessary files to dist
echo "--- Copying manifest.json..."
cp "$SRC_DIR/manifest.json" "$DIST_DIR/"

echo "--- Copying built files..."
cp "$SRC_DIR/code.js" "$DIST_DIR/"
cp "$SRC_DIR/ui-built.html" "$DIST_DIR/"

# echo "--- Copying icons.json..."
# if [ -f "$SRC_DIR/icons.json" ]; then
#     cp "$SRC_DIR/icons.json" "$DIST_DIR/"
# fi

# echo "--- Copying icons directory..."
# if [ -d "$SRC_DIR/icons" ]; then
#     cp -r "$SRC_DIR/icons" "$DIST_DIR/"
# fi

# Copy documentation
# echo "--- Copying documentation..."
# cp "$PROJECT_ROOT/README.md" "$DIST_DIR/"
# cp "$PROJECT_ROOT/INSTALL.md" "$DIST_DIR/"

echo ""
echo "=========================================="
echo "Build completed successfully!"
echo "=========================================="
echo ""
echo "Distribution files are in: $DIST_DIR"
echo ""
ls -lh "$DIST_DIR"
echo ""
echo "To install in Figma:"
echo "  1. Open Figma Desktop App"
echo "  2. Go to Plugins → Development → Import plugin from manifest..."
echo "  3. Select: $DIST_DIR/manifest.json"
echo ""
