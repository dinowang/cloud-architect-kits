#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_URL="https://github.com/gilbarbara/logos"
TARGET_DIR="$PROJECT_ROOT/temp/gilbarbara-icons"

if [ -d "$TARGET_DIR/.git" ]; then
  echo "==> Repository exists. Pulling latest changes..."
  cd "$TARGET_DIR" && git pull
else
  echo "==> Cloning repository..."
  git clone "$REPO_URL" "$TARGET_DIR"
fi

echo "==> Done!"
echo "    Repository at: $TARGET_DIR"
