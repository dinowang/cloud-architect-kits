#!/bin/bash

set -e

REPO_URL="https://github.com/kubernetes/community"
ICONS_PATH="icons/svg"
OUTPUT_DIR="./temp/kubernetes-icons"

echo "Downloading Kubernetes icons..."

mkdir -p "$OUTPUT_DIR"

# Always use fresh remote content
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

cd "$TEMP_DIR"

echo "Cloning repository with sparse checkout..."
git init
git remote add origin "$REPO_URL"
git config core.sparseCheckout true
echo "$ICONS_PATH/*" > .git/info/sparse-checkout

git pull --depth=1 origin main

cd -

echo "Copying SVG files..."
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

find "$TEMP_DIR/$ICONS_PATH" -name "*.svg" -exec cp {} "$OUTPUT_DIR/" \;

ICON_COUNT=$(find "$OUTPUT_DIR" -name "*.svg" | wc -l)
echo "Downloaded $ICON_COUNT SVG icons to $OUTPUT_DIR"
