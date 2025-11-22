#!/bin/bash

set -e

REPO_URL="https://github.com/kubernetes/community"
ICONS_PATH="icons/svg"
OUTPUT_DIR="./temp/kubernetes-icons"

echo "Downloading Kubernetes icons..."

mkdir -p "$OUTPUT_DIR"

# Check if already downloaded
if [ -d "$OUTPUT_DIR/.git" ]; then
    echo "Repository exists, checking for updates..."
    cd "$OUTPUT_DIR"
    
    REMOTE_COMMIT=$(git ls-remote "$REPO_URL" refs/heads/master | cut -f1)
    LOCAL_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "")
    
    if [ "$REMOTE_COMMIT" = "$LOCAL_COMMIT" ]; then
        ICON_COUNT=$(find "$OUTPUT_DIR" -name "*.svg" | wc -l)
        echo "Icons are up to date ($ICON_COUNT SVG files)"
        exit 0
    fi
    
    echo "Updates available, pulling changes..."
    git pull --depth=1 origin master
    cd -
    
    ICON_COUNT=$(find "$OUTPUT_DIR" -name "*.svg" | wc -l)
    echo "Updated $ICON_COUNT SVG icons in $OUTPUT_DIR"
else
    TEMP_DIR=$(mktemp -d)
    trap "rm -rf $TEMP_DIR" EXIT
    
    cd "$TEMP_DIR"
    
    echo "Cloning repository with sparse checkout..."
    git init
    git remote add origin "$REPO_URL"
    git config core.sparseCheckout true
    echo "$ICONS_PATH/*" > .git/info/sparse-checkout
    
    git pull --depth=1 origin master
    
    cd -
    
    echo "Copying SVG files..."
    rm -rf "$OUTPUT_DIR"
    mkdir -p "$OUTPUT_DIR"
    
    cp -r "$TEMP_DIR/.git" "$OUTPUT_DIR/"
    find "$TEMP_DIR/$ICONS_PATH" -name "*.svg" -exec cp {} "$OUTPUT_DIR/" \;
    
    ICON_COUNT=$(find "$OUTPUT_DIR" -name "*.svg" | wc -l)
    echo "Downloaded $ICON_COUNT SVG icons to $OUTPUT_DIR"
fi
