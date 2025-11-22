#!/usr/bin/env bash

# Microsoft 365 Icons Downloader
# Downloads the latest Microsoft 365 SVG icons package

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Paths
TEMP_DIR="$PROJECT_ROOT/temp"
ZIP_FILE="$TEMP_DIR/m365-icons.zip"
EXTRACT_DIR="$TEMP_DIR/m365-icons"

# Microsoft 365 icons download URL
M365_PAGE_URL="https://learn.microsoft.com/en-us/microsoft-365/solutions/architecture-icons-templates?view=o365-worldwide"
M365_DOWNLOAD_REDIRECT="https://go.microsoft.com/fwlink/?linkid=869455"

echo -e "${BLUE}==================================${NC}"
echo -e "${BLUE}Microsoft 365 Icons Downloader${NC}"
echo -e "${BLUE}==================================${NC}"
echo ""

# Create temp directory
echo -e "${YELLOW}[1/5]${NC} Creating temp directory..."
mkdir -p "$TEMP_DIR"
echo -e "${GREEN}✓${NC} Directory created: $TEMP_DIR"
echo ""

# Get actual download URL
echo -e "${YELLOW}[2/5]${NC} Resolving download URL..."
DOWNLOAD_URL=$(curl -sI "$M365_DOWNLOAD_REDIRECT" | grep -i "^location:" | awk '{print $2}' | tr -d '\r')

if [ -z "$DOWNLOAD_URL" ]; then
    echo -e "${RED}✗${NC} Failed to resolve download URL"
    echo -e "${YELLOW}ℹ${NC} Visit: $M365_PAGE_URL"
    exit 1
fi

echo -e "${GREEN}✓${NC} Download URL: $DOWNLOAD_URL"
echo ""

# Check if already downloaded
if [ -d "$EXTRACT_DIR" ] && [ -n "$(ls -A "$EXTRACT_DIR" 2>/dev/null)" ]; then
    echo -e "${BLUE}ℹ${NC} Icons already exist, checking for updates..."
fi

# Download the ZIP file
echo -e "${YELLOW}[3/5]${NC} Checking Microsoft 365 icons..."

DOWNLOAD_NEEDED=true
if [ -f "$ZIP_FILE" ]; then
    REMOTE_SIZE=$(curl -sI "$DOWNLOAD_URL" | grep -i "content-length:" | awk '{print $2}' | tr -d '\r')
    LOCAL_SIZE=$(stat -f%z "$ZIP_FILE" 2>/dev/null || stat -c%s "$ZIP_FILE" 2>/dev/null)
    if [ "$REMOTE_SIZE" = "$LOCAL_SIZE" ]; then
        echo -e "${GREEN}✓${NC} ZIP file is up to date, skipping download"
        DOWNLOAD_NEEDED=false
    fi
fi

if [ "$DOWNLOAD_NEEDED" = true ]; then
    if [ -f "$ZIP_FILE" ]; then
        echo -e "${YELLOW}ℹ${NC} Removing existing file: $ZIP_FILE"
        rm -f "$ZIP_FILE"
    fi
    
    echo -e "${YELLOW}Downloading...${NC}"
    curl -L -o "$ZIP_FILE" "$DOWNLOAD_URL" --progress-bar
    
    if [ ! -f "$ZIP_FILE" ]; then
        echo -e "${RED}✗${NC} Download failed"
        exit 1
    fi
    
    FILE_SIZE=$(ls -lh "$ZIP_FILE" | awk '{print $5}')
    echo -e "${GREEN}✓${NC} Downloaded: $ZIP_FILE ($FILE_SIZE)"
    echo ""
    
    # Extract the ZIP file
    echo -e "${YELLOW}[4/5]${NC} Extracting icons..."
    if [ -d "$EXTRACT_DIR" ]; then
        echo -e "${YELLOW}ℹ${NC} Removing existing directory: $EXTRACT_DIR"
        rm -rf "$EXTRACT_DIR"
    fi
    
    mkdir -p "$EXTRACT_DIR"
    unzip -q "$ZIP_FILE" -d "$EXTRACT_DIR"
    
    echo -e "${GREEN}✓${NC} Extracted to: $EXTRACT_DIR"
    echo ""
else
    echo ""
    echo -e "${YELLOW}[4/5]${NC} Skipping extraction (using cached files)"
    echo ""
fi

# Summary
echo -e "${YELLOW}[5/5]${NC} Summary..."
SVG_COUNT=$(find "$EXTRACT_DIR" -name "*.svg" | wc -l | xargs)
PNG_COUNT=$(find "$EXTRACT_DIR" -name "*.png" | wc -l | xargs)
TOTAL_FILES=$(find "$EXTRACT_DIR" -type f | wc -l | xargs)

echo -e "${GREEN}✓${NC} Total files: $TOTAL_FILES"
echo -e "${GREEN}✓${NC} SVG files: $SVG_COUNT"
echo -e "${GREEN}✓${NC} PNG files: $PNG_COUNT"
echo ""

# List top-level contents
echo -e "${BLUE}Contents:${NC}"
ls -1 "$EXTRACT_DIR" | head -10 | while read item; do
    echo -e "  • $item"
done

ITEM_COUNT=$(ls -1 "$EXTRACT_DIR" | wc -l | xargs)
if [ "$ITEM_COUNT" -gt 10 ]; then
    echo -e "  ${YELLOW}... and $((ITEM_COUNT - 10)) more${NC}"
fi

echo ""
echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}Download Complete!${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Check contents: ${YELLOW}ls -la $EXTRACT_DIR${NC}"
echo -e "  2. Process icons for Figma plugin"
echo ""
