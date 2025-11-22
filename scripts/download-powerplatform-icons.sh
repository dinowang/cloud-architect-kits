#!/usr/bin/env bash

# Power Platform Icons Downloader
# Downloads the latest Power Platform SVG icons package

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
ZIP_FILE="$TEMP_DIR/powerplatform-icons.zip"
EXTRACT_DIR="$TEMP_DIR/powerplatform-icons"

# Power Platform icons download URL
PP_PAGE_URL="https://learn.microsoft.com/zh-tw/power-platform/guidance/icons"
PP_DOWNLOAD_URL="https://download.microsoft.com/download/e/f/4/ef434e60-8cdc-4dd1-9d9f-e58670e57ec1/Power_Platform_scalable.zip"

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}Power Platform Icons Downloader${NC}"
echo -e "${BLUE}==========================================${NC}"
echo ""

# Create temp directory
echo -e "${YELLOW}[1/4]${NC} Creating temp directory..."
mkdir -p "$TEMP_DIR"
echo -e "${GREEN}✓${NC} Directory created: $TEMP_DIR"
echo ""

# Check if already downloaded
if [ -d "$EXTRACT_DIR" ] && [ -n "$(ls -A "$EXTRACT_DIR" 2>/dev/null)" ]; then
    echo -e "${BLUE}ℹ${NC} Icons already exist, checking for updates..."
fi

# Download the ZIP file
echo -e "${YELLOW}[2/4]${NC} Checking Power Platform icons..."
echo -e "${BLUE}ℹ${NC} Source: $PP_DOWNLOAD_URL"
echo ""

DOWNLOAD_NEEDED=true
if [ -f "$ZIP_FILE" ]; then
    REMOTE_SIZE=$(curl -sI "$PP_DOWNLOAD_URL" | grep -i "content-length:" | awk '{print $2}' | tr -d '\r')
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
    curl -L -o "$ZIP_FILE" "$PP_DOWNLOAD_URL" --progress-bar
    
    if [ ! -f "$ZIP_FILE" ]; then
        echo -e "${RED}✗${NC} Download failed"
        echo -e "${YELLOW}ℹ${NC} Visit: $PP_PAGE_URL"
        exit 1
    fi
    
    FILE_SIZE=$(ls -lh "$ZIP_FILE" | awk '{print $5}')
    echo -e "${GREEN}✓${NC} Downloaded: $ZIP_FILE ($FILE_SIZE)"
    echo ""
    
    # Extract the ZIP file
    echo -e "${YELLOW}[3/4]${NC} Extracting icons..."
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
    echo -e "${YELLOW}[3/4]${NC} Skipping extraction (using cached files)"
    echo ""
fi

# Summary
echo -e "${YELLOW}[4/4]${NC} Summary..."
SVG_COUNT=$(find "$EXTRACT_DIR" -name "*.svg" | wc -l | xargs)
PNG_COUNT=$(find "$EXTRACT_DIR" -name "*.png" | wc -l | xargs)
AI_COUNT=$(find "$EXTRACT_DIR" -name "*.ai" | wc -l | xargs)
TOTAL_FILES=$(find "$EXTRACT_DIR" -type f | wc -l | xargs)

echo -e "${GREEN}✓${NC} Total files: $TOTAL_FILES"
echo -e "${GREEN}✓${NC} SVG files: $SVG_COUNT"
if [ "$PNG_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} PNG files: $PNG_COUNT"
fi
if [ "$AI_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} AI files: $AI_COUNT"
fi
echo ""

# List top-level contents
echo -e "${BLUE}Contents:${NC}"
ls -1 "$EXTRACT_DIR" | head -15 | while read item; do
    if [ -d "$EXTRACT_DIR/$item" ]; then
        ITEM_COUNT=$(find "$EXTRACT_DIR/$item" -type f | wc -l | xargs)
        echo -e "  📁 $item ($ITEM_COUNT files)"
    else
        echo -e "  📄 $item"
    fi
done

ITEM_COUNT=$(ls -1 "$EXTRACT_DIR" | wc -l | xargs)
if [ "$ITEM_COUNT" -gt 15 ]; then
    echo -e "  ${YELLOW}... and $((ITEM_COUNT - 15)) more${NC}"
fi

echo ""

# Show sample SVG files
echo -e "${BLUE}Sample SVG Icons:${NC}"
find "$EXTRACT_DIR" -name "*.svg" -type f | head -10 | while read file; do
    filename=$(basename "$file")
    echo -e "  • $filename"
done

SVG_TOTAL=$(find "$EXTRACT_DIR" -name "*.svg" | wc -l | xargs)
if [ "$SVG_TOTAL" -gt 10 ]; then
    echo -e "  ${YELLOW}... and $((SVG_TOTAL - 10)) more SVG files${NC}"
fi

echo ""
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}Download Complete!${NC}"
echo -e "${GREEN}==========================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Check contents: ${YELLOW}ls -la $EXTRACT_DIR${NC}"
echo -e "  2. Process icons for Figma plugin"
echo -e "  3. Visit documentation: ${YELLOW}$PP_PAGE_URL${NC}"
echo ""
