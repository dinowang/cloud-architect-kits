#!/bin/bash

# Download GCP Icons
# Source: https://cloud.google.com/icons

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMP_DIR="$PROJECT_ROOT/temp"
CACHE_FILE="$TEMP_DIR/.gcp-icons-cache"
CATEGORY_ZIP="$TEMP_DIR/gcp-icons.category.zip"
CORE_ZIP="$TEMP_DIR/gcp-icons.core.zip"
EXTRACT_DIR="$TEMP_DIR/gcp-icons"

# GCP Icon URLs
CATEGORY_URL="https://services.google.com/fh/files/misc/category-icons.zip"
CORE_URL="https://services.google.com/fh/files/misc/core-products-icons.zip"

echo "=========================================="
echo "Downloading GCP Icons"
echo "=========================================="
echo ""

# Create temp directory
mkdir -p "$TEMP_DIR"

# Function to get file hash
get_file_hash() {
  if [ -f "$1" ]; then
    if command -v md5sum >/dev/null 2>&1; then
      md5sum "$1" | cut -d' ' -f1
    else
      md5 -q "$1"
    fi
  fi
}

# Function to get remote file size
get_remote_size() {
  curl -sI "$1" | grep -i content-length | awk '{print $2}' | tr -d '\r'
}

# Check if already downloaded
NEED_DOWNLOAD=false

if [ -f "$CACHE_FILE" ]; then
  CACHED_CATEGORY_SIZE=$(sed -n '1p' "$CACHE_FILE")
  CACHED_CORE_SIZE=$(sed -n '2p' "$CACHE_FILE")
  
  REMOTE_CATEGORY_SIZE=$(get_remote_size "$CATEGORY_URL")
  REMOTE_CORE_SIZE=$(get_remote_size "$CORE_URL")
  
  if [ "$CACHED_CATEGORY_SIZE" != "$REMOTE_CATEGORY_SIZE" ] || [ "$CACHED_CORE_SIZE" != "$REMOTE_CORE_SIZE" ]; then
    NEED_DOWNLOAD=true
  elif [ ! -f "$CATEGORY_ZIP" ] || [ ! -f "$CORE_ZIP" ] || [ ! -d "$EXTRACT_DIR" ]; then
    NEED_DOWNLOAD=true
  fi
else
  NEED_DOWNLOAD=true
fi

if [ "$NEED_DOWNLOAD" = false ]; then
  echo "✓ GCP icons already up to date"
  echo "  Category: $(basename "$CATEGORY_ZIP")"
  echo "  Core: $(basename "$CORE_ZIP")"
  echo "  Skipping download."
  echo ""
  echo "To force re-download, run:"
  echo "  rm $CACHE_FILE"
  echo "=========================================="
  exit 0
fi

# Download Category Icons
echo "📥 Downloading GCP Category Icons..."
echo "   From: $CATEGORY_URL"
echo "   To: $CATEGORY_ZIP"
echo ""

curl -L --retry 5 --retry-delay 3 --retry-connrefused --retry-all-errors --progress-bar -o "$CATEGORY_ZIP" "$CATEGORY_URL"

if [ ! -f "$CATEGORY_ZIP" ]; then
  echo "❌ Error: Category icons download failed"
  exit 1
fi

CATEGORY_SIZE=$(du -h "$CATEGORY_ZIP" | cut -f1)
echo "✓ Downloaded Category Icons: $CATEGORY_SIZE"

# Download Core Products Icons
echo ""
echo "📥 Downloading GCP Core Products Icons..."
echo "   From: $CORE_URL"
echo "   To: $CORE_ZIP"
echo ""

curl -L --retry 5 --retry-delay 3 --retry-connrefused --retry-all-errors --progress-bar -o "$CORE_ZIP" "$CORE_URL"

if [ ! -f "$CORE_ZIP" ]; then
  echo "❌ Error: Core products icons download failed"
  exit 1
fi

CORE_SIZE=$(du -h "$CORE_ZIP" | cut -f1)
echo "✓ Downloaded Core Products Icons: $CORE_SIZE"

# Extract the ZIP files
echo ""
echo "📂 Extracting to: $EXTRACT_DIR"

# Remove old extraction directory
rm -rf "$EXTRACT_DIR"
mkdir -p "$EXTRACT_DIR"

# Extract Category Icons
echo "   Extracting category icons..."
unzip -q "$CATEGORY_ZIP" -d "$EXTRACT_DIR/category"

# Extract Core Products Icons
echo "   Extracting core products icons..."
unzip -q "$CORE_ZIP" -d "$EXTRACT_DIR/core"

# Count extracted files
CATEGORY_FILES=$(find "$EXTRACT_DIR/category" -type f | wc -l | tr -d ' ')
CATEGORY_SVGS=$(find "$EXTRACT_DIR/category" -type f -name "*.svg" | wc -l | tr -d ' ')
CORE_FILES=$(find "$EXTRACT_DIR/core" -type f | wc -l | tr -d ' ')
CORE_SVGS=$(find "$EXTRACT_DIR/core" -type f -name "*.svg" | wc -l | tr -d ' ')

TOTAL_FILES=$((CATEGORY_FILES + CORE_FILES))
TOTAL_SVGS=$((CATEGORY_SVGS + CORE_SVGS))

echo "✓ Extracted: $TOTAL_FILES files ($TOTAL_SVGS SVGs)"
echo "  - Category: $CATEGORY_FILES files ($CATEGORY_SVGS SVGs)"
echo "  - Core: $CORE_FILES files ($CORE_SVGS SVGs)"

# Save cache
REMOTE_CATEGORY_SIZE=$(get_remote_size "$CATEGORY_URL")
REMOTE_CORE_SIZE=$(get_remote_size "$CORE_URL")
echo "$REMOTE_CATEGORY_SIZE" > "$CACHE_FILE"
echo "$REMOTE_CORE_SIZE" >> "$CACHE_FILE"

echo ""
echo "=========================================="
echo "✅ GCP Icons downloaded"
echo "=========================================="
echo ""
echo "📂 Location: $EXTRACT_DIR"
echo "📊 Files: $TOTAL_FILES total, $TOTAL_SVGS SVGs"
echo "   - Category: $CATEGORY_SIZE"
echo "   - Core: $CORE_SIZE"
echo ""
echo "Next steps:"
echo "  1. Update prebuild configuration if needed"
echo "  2. Run: cd src/prebuild && npm run build"
echo "=========================================="
