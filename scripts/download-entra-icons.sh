#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMP_DIR="$PROJECT_ROOT/temp"
ENTRA_ICONS_DIR="$TEMP_DIR/entra-icons"

ICONS_PAGE_URL="https://learn.microsoft.com/en-us/entra/architecture/architecture-icons"

mkdir -p "$TEMP_DIR"

# Check if already downloaded
if [ -d "$ENTRA_ICONS_DIR" ] && [ -n "$(ls -A "$ENTRA_ICONS_DIR" 2>/dev/null)" ]; then
    echo "==> Entra icons already exist at $ENTRA_ICONS_DIR"
    echo "==> Checking for updates..."
fi

echo "==> Fetching Entra icons download URL from Microsoft Learn..."
ZIP_URL=$(curl -s "$ICONS_PAGE_URL" | grep -oE 'https://[^"]+\.zip' | head -1)

if [ -z "$ZIP_URL" ]; then
    echo "Error: Could not find Entra icons ZIP download link"
    exit 1
fi

echo "==> Found ZIP URL: $ZIP_URL"
ZIP_FILE="$TEMP_DIR/entra-icons.zip"

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
    echo "==> Downloading Entra icons..."
    curl -L -o "$ZIP_FILE" "$ZIP_URL"
    
    if [ -d "$ENTRA_ICONS_DIR" ]; then
        echo "==> Cleaning existing entra-icons directory..."
        rm -rf "$ENTRA_ICONS_DIR"
    fi
    
    echo "==> Extracting to $ENTRA_ICONS_DIR..."
    unzip -q "$ZIP_FILE" -d "$ENTRA_ICONS_DIR"
fi

echo "==> Entra icons downloaded successfully to: $ENTRA_ICONS_DIR"
ls -la "$ENTRA_ICONS_DIR"
