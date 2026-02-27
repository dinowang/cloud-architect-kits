#!/bin/bash

# Download AWS Architecture Icons
# Source: https://aws.amazon.com/tw/architecture/icons/

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMP_DIR="$PROJECT_ROOT/temp"
CACHE_FILE="$TEMP_DIR/.aws-icons-cache"
ZIP_FILE="$TEMP_DIR/aws-icons.zip"
EXTRACT_DIR="$TEMP_DIR/aws-icons"

echo "=========================================="
echo "Downloading AWS Architecture Icons"
echo "=========================================="
echo ""

# Create temp directory
mkdir -p "$TEMP_DIR"

# Fetch the download page
echo "🔍 Fetching download page..."
PAGE_URL="https://aws.amazon.com/tw/architecture/icons/"
PAGE_CONTENT=$(curl -sL "$PAGE_URL")

# Extract the Asset Package ZIP URL
echo "🔍 Looking for Asset Package ZIP..."
ZIP_URL=$(echo "$PAGE_CONTENT" | grep -oE 'https://d1\.awsstatic\.com/[^"]*architecture-icons/Icon-package_[^"]*\.zip' | head -n 1)

if [ -z "$ZIP_URL" ]; then
  echo "❌ Error: Could not find Asset Package ZIP URL"
  echo "   The page structure might have changed."
  exit 1
fi

echo "✓ Found: $ZIP_URL"

# Extract filename and timestamp from URL
ZIP_FILENAME=$(basename "$ZIP_URL")
echo "📦 Package: $ZIP_FILENAME"

# Check if already downloaded (compare with cache)
if [ -f "$CACHE_FILE" ]; then
  CACHED_URL=$(cat "$CACHE_FILE")
  if [ "$CACHED_URL" = "$ZIP_URL" ] && [ -f "$ZIP_FILE" ] && [ -d "$EXTRACT_DIR" ]; then
    echo ""
    echo "✓ AWS icons already up to date"
    echo "  Cached: $ZIP_FILENAME"
    echo "  Skipping download."
    echo ""
    echo "To force re-download, run:"
    echo "  rm $CACHE_FILE"
    echo "=========================================="
    exit 0
  fi
fi

# Download the ZIP file
echo ""
echo "📥 Downloading AWS Architecture Icons..."
echo "   From: $ZIP_URL"
echo "   To: $ZIP_FILE"
echo ""

curl -L --progress-bar -o "$ZIP_FILE" "$ZIP_URL"

if [ ! -f "$ZIP_FILE" ]; then
  echo "❌ Error: Download failed"
  exit 1
fi

ZIP_SIZE=$(du -h "$ZIP_FILE" | cut -f1)
echo "✓ Downloaded: $ZIP_SIZE"

# Extract the ZIP file
echo ""
echo "📂 Extracting to: $EXTRACT_DIR"

# Remove old extraction directory
rm -rf "$EXTRACT_DIR"
mkdir -p "$EXTRACT_DIR"

unzip -q "$ZIP_FILE" -d "$EXTRACT_DIR"

# Count extracted files
TOTAL_FILES=$(find "$EXTRACT_DIR" -type f | wc -l | tr -d ' ')
SVG_FILES=$(find "$EXTRACT_DIR" -type f -name "*.svg" | wc -l | tr -d ' ')

echo "✓ Extracted: $TOTAL_FILES files ($SVG_FILES SVGs)"

# Save cache
echo "$ZIP_URL" > "$CACHE_FILE"

echo ""
echo "=========================================="
echo "✅ AWS Architecture Icons downloaded"
echo "=========================================="
echo ""
echo "📦 Package: $ZIP_FILENAME"
echo "📂 Location: $EXTRACT_DIR"
echo "📊 Files: $TOTAL_FILES total, $SVG_FILES SVGs"
echo ""
echo "Next steps:"
echo "  1. Update prebuild configuration if needed"
echo "  2. Run: cd src/prebuild && npm run build"
echo "=========================================="
