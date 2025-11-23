#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMP_DIR="$PROJECT_ROOT/temp"
FABRIC_ICONS_DIR="$TEMP_DIR/fabric-icons"

# GitHub raw URL for the Icons.zip file
ZIP_URL="https://github.com/microsoft/fabric-samples/raw/main/docs-samples/Icons.zip"

mkdir -p "$TEMP_DIR"

# Check if already downloaded
if [ -d "$FABRIC_ICONS_DIR" ] && [ -n "$(ls -A "$FABRIC_ICONS_DIR" 2>/dev/null)" ]; then
    echo "==> Fabric icons already exist at $FABRIC_ICONS_DIR"
    echo "==> Checking for updates..."
fi

echo "==> Downloading Microsoft Fabric icons from GitHub..."
ZIP_FILE="$TEMP_DIR/fabric-icons.zip"

# Check if ZIP needs download
DOWNLOAD_NEEDED=true
if [ -f "$ZIP_FILE" ]; then
    REMOTE_SIZE=$(curl -sI "$ZIP_URL" | grep -i "content-length:" | awk '{print $2}' | tr -d '\r')
    LOCAL_SIZE=$(stat -f%z "$ZIP_FILE" 2>/dev/null || stat -c%s "$ZIP_FILE" 2>/dev/null)
    if [ "$REMOTE_SIZE" = "$LOCAL_SIZE" ]; then
        echo "==> ZIP file is up to date, skipping download"
        DOWNLOAD_NEEDED=false
    fi
fi

if [ "$DOWNLOAD_NEEDED" = true ]; then
    echo "==> Downloading Fabric icons..."
    curl -L -o "$ZIP_FILE" "$ZIP_URL"
    
    if [ -d "$FABRIC_ICONS_DIR" ]; then
        echo "==> Cleaning existing fabric-icons directory..."
        rm -rf "$FABRIC_ICONS_DIR"
    fi
    
    echo "==> Extracting /icons/package/dist/svg/ to $FABRIC_ICONS_DIR..."
    unzip -q "$ZIP_FILE" "icons/package/dist/svg/*" -d "$TEMP_DIR"
    mkdir -p "$FABRIC_ICONS_DIR"
    mv "$TEMP_DIR/icons/package/dist/svg/"* "$FABRIC_ICONS_DIR/"
    rm -rf "$TEMP_DIR/icons"
    
    echo "==> Filtering to keep only *_48_color.svg files..."
    
    # Remove all files that don't match *_48_color.svg pattern
    find "$FABRIC_ICONS_DIR" -type f -name "*.svg" ! -name "*_48_color.svg" -delete
    
    echo "==> Renaming files to remove _48_color suffix..."
    # Rename files: remove _48_color before .svg
    find "$FABRIC_ICONS_DIR" -type f -name "*_48_color.svg" | while read -r file; do
        newname=$(echo "$file" | sed 's/_48_color\.svg$/.svg/')
        mv "$file" "$newname"
    done
    
    # Clean up empty directories
    find "$FABRIC_ICONS_DIR" -type d -empty -delete
fi

echo "==> Microsoft Fabric icons downloaded successfully to: $FABRIC_ICONS_DIR"
echo "==> Total SVG files: $(find "$FABRIC_ICONS_DIR" -type f -name "*.svg" | wc -l)"
