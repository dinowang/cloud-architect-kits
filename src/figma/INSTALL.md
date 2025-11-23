# Cloud Architect Kits - Figma Plugin Installation Guide

This guide provides detailed instructions for installing and using the Figma plugin.

## Prerequisites

- **Node.js** 14 or higher
- **npm** (comes with Node.js)
- **Figma Desktop App** (required for plugin development)

## Installation Steps

### 1. Get the Plugin Files

#### Option A: From Release

1. Download the latest release from GitHub
2. Extract `cloud-architect-kit-figma-plugin.zip`

#### Option B: Build from Source

1. Clone the repository
2. Navigate to the plugin directory:
   ```bash
   cd src/figma-plugin
   ```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- TypeScript compiler
- Figma plugin type definitions
- Development dependencies

### 3. Get Icon Data

Icons are preprocessed by the unified prebuild system. You have two options:

#### Option A: Use Pre-built Icons (Recommended)

If icons are already built at `../prebuild/`:

```bash
# Copy from prebuild
cp -r ../prebuild/icons ./icons
cp ../prebuild/icons.json ./icons.json
```

#### Option B: Build Icons Yourself

```bash
# Navigate to prebuild
cd ../prebuild

# Run icon processing
npm run build

# Copy back to figma-plugin
cd ../figma-plugin
cp -r ../prebuild/icons ./icons
cp ../prebuild/icons.json ./icons.json
```

### 4. Build the Plugin

```bash
npm run build
```

This will:
1. Process icons data and generate `icons-data.*.js` (~26MB)
2. Create `ui-built.html` (production build)
3. Create `ui-dev.html` (development build)
4. Compile TypeScript to JavaScript

Build output:
```
✓ icons-data.{hash}.js created (~26 MB)
✓ ui-built.html created (inline JS, ~26 MB)
✓ ui-dev.html created (references external JS, 4.6 KB)
✓ code.js compiled
```

### 5. Load Plugin in Figma

#### For Development

1. Open **Figma Desktop App** (plugins don't work in browser for development)
2. Go to **Menu → Plugins → Development → Import plugin from manifest...**
3. Navigate to the `figma-plugin` directory
4. Select `manifest.json`
5. The plugin will appear in your plugins list

#### For Production Use

If you're distributing the plugin:

1. Package the built files:
   - manifest.json
   - code.js
   - ui-built.html

2. Share with users or submit to Figma Community

## Usage

### Running the Plugin

1. Open any Figma file
2. Right-click or use Menu → Plugins
3. Select "Cloud Architect Kits"
4. The plugin panel will open

### Inserting Icons

1. **Search**: Type keywords to filter icons
2. **Browse**: Scroll through organized categories
3. **Click**: Click any icon to insert it
4. **Resize**: Adjust the size input (default: 64px)

### Features

- **Search**: Filter by name, source, or category
- **Size Control**: Set custom size (16-512px)
- **Aspect Ratio**: Icons maintain proportions
- **Sticky Headers**: Source names stay visible
- **Icon Counts**: See filtered/total counts

## Troubleshooting

### Build Issues

**Problem**: `icons.json not found`
```bash
# Solution: Copy from prebuild
cp ../prebuild/icons.json ./icons.json
```

**Problem**: `icons/ directory not found`
```bash
# Solution: Copy from prebuild
cp -r ../prebuild/icons ./icons
```

**Problem**: TypeScript errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Figma Issues

**Problem**: Plugin doesn't appear in Figma

1. Make sure you're using Figma Desktop App (not browser)
2. Check that `manifest.json` exists in the plugin directory
3. Try removing and re-importing the plugin

**Problem**: UI doesn't load

1. Check browser console in Figma for errors
2. Verify `ui-built.html` exists
3. Try rebuilding: `npm run build`

**Problem**: Icons don't appear

1. Check that `icons-data.*.js` was generated
2. Verify file size (~26MB)
3. Check browser console for loading errors

### Performance Issues

**Problem**: Plugin loads slowly

- Expected: First load processes 4,300+ icons
- Icons are base64-encoded in JavaScript
- Subsequent loads use cached data

**Problem**: High memory usage

- Expected: Plugin holds ~26MB of icon data
- This is normal for 4,300+ icons
- Figma manages memory automatically

## Development

### Development Mode

For active development:

```bash
# Start TypeScript watch mode
npm run watch
```

This compiles TypeScript on file changes.

After code changes:
1. Make your changes to `code.ts` or `ui.html`
2. Run `npm run build`
3. In Figma, right-click the plugin → Reload plugin

### File Structure

```
figma-plugin/
├── manifest.json       # Plugin configuration
├── code.ts            # Backend logic (TypeScript)
├── code.js            # Compiled backend (generated)
├── ui.html            # UI template
├── ui-built.html      # Production UI (generated)
├── ui-dev.html        # Development UI (generated)
├── build.js           # Build script
├── package.json       # npm configuration
├── tsconfig.json      # TypeScript configuration
├── icons/             # SVG files (from prebuild)
├── icons.json         # Icon metadata (from prebuild)
└── icons-data.*.js    # Generated icon data
```

### Making Changes

1. **Backend changes**: Edit `code.ts`
2. **UI changes**: Edit `ui.html`
3. **Build changes**: Edit `build.js`
4. Rebuild: `npm run build`
5. Reload plugin in Figma

## Updating Icons

Icons are managed by the unified prebuild system:

```bash
# Update icons
cd ../../
./scripts/build-and-release.sh

# Or manually
cd src/prebuild
npm run build
cd ../figma-plugin
cp -r ../prebuild/icons ./icons
cp ../prebuild/icons.json ./icons.json
npm run build
```

## Uninstalling

### From Figma

1. Go to Menu → Plugins → Development → Manage plugins
2. Find "Cloud Architect Kits"
3. Click Remove

### From Filesystem

```bash
# Remove plugin directory
cd src
rm -rf figma-plugin
```

## Next Steps

- See [README.md](README.md) for plugin features
- Check [../../README.md](../../README.md) for project overview
- View [../powerpoint-addin/](../powerpoint-addin/) for PowerPoint version

## Support

For issues or questions:
- Check troubleshooting section above
- Review Figma plugin documentation
- Check project documentation

---

**Note**: This plugin requires the Figma Desktop App for development. Published plugins can run in the browser.
