#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TARGET_DIR="$PROJECT_ROOT/temp/thesvg-icons"
REPO_URL="https://github.com/glincker/thesvg"
ICONS_PATH="public/icons"
# Track the last-downloaded commit to skip re-downloads
COMMIT_FILE="$TARGET_DIR/.last-commit"

mkdir -p "$TARGET_DIR"

# Check if source has changed since last download
if [ -f "$COMMIT_FILE" ]; then
    echo "==> TheSVG icons already exist at $TARGET_DIR"
    echo "==> Checking for updates..."

    LOCAL_HEAD=$(cat "$COMMIT_FILE")
    REMOTE_HEAD=$(git ls-remote "$REPO_URL" HEAD | awk '{print $1}')

    if [ "$LOCAL_HEAD" = "$REMOTE_HEAD" ]; then
        echo "==> Already up to date (${LOCAL_HEAD:0:8}), skipping download"
        ICON_COUNT=$(find "$TARGET_DIR" -maxdepth 1 -name "*.svg" | wc -l | tr -d ' ')
        echo "==> Total SVG files: $ICON_COUNT"
        exit 0
    fi

    echo "==> Remote has new commits, re-downloading..."
fi

echo "==> Downloading TheSVG icons from GitHub..."

TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

cd "$TEMP_DIR"
git init -q
git remote add origin "$REPO_URL"
git config core.sparseCheckout true
echo "$ICONS_PATH/*" > .git/info/sparse-checkout
git pull --depth=1 origin main

cd "$PROJECT_ROOT"

# Each icon lives in public/icons/{name}/ with variants (default.svg, dark.svg, light.svg, mono.svg).
# Extract default.svg from each subdirectory, renamed to {name}.svg.
echo "==> Extracting default.svg from each icon directory..."
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

for icon_dir in "$TEMP_DIR/$ICONS_PATH"/*/; do
    icon_name=$(basename "$icon_dir")

    # Skip cloud provider icons already covered by dedicated packs
    case "$icon_name" in
        gcp-*|azure-*|aws-*) continue ;;
    esac

    svg_file="$icon_dir/default.svg"
    if [ -f "$svg_file" ]; then
        cp "$svg_file" "$TARGET_DIR/${icon_name}.svg"
    fi
done

# Record the downloaded commit for future skip checks
git ls-remote "$REPO_URL" HEAD | awk '{print $1}' > "$COMMIT_FILE"

ICON_COUNT=$(find "$TARGET_DIR" -maxdepth 1 -name "*.svg" | wc -l | tr -d ' ')
echo "==> TheSVG icons downloaded successfully to: $TARGET_DIR"
echo "==> Total SVG files: $ICON_COUNT"
