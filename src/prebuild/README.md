# Cloud Architect Kits - Prebuild

This directory contains the icon processing pipeline that generates the preprocessed icons used by both Figma and PowerPoint plugins.

## Purpose

Pre-processes icons from multiple sources into a standardized format:
- Processes SVG files (removes fixed dimensions, ensures viewBox)
- Organizes by source and category
- Generates `icons.json` index
- Creates normalized SVG files in `icons/` directory

## Icon Sources

The icons are downloaded from these sources (see `../../scripts/download-*.sh`):
- Azure Architecture Icons
- Microsoft 365 Icons
- Dynamics 365 Icons
- Microsoft Entra Icons
- Power Platform Icons
- Kubernetes Icons
- Gilbarbara Logos
- Lobe Icons

## Usage

### Build Icons

```bash
npm run build
```

This will:
1. Read icons from `../../temp/*-icons/` directories
2. Process and normalize all SVG files
3. Generate `icons/` directory with processed SVGs
4. Create `icons.json` index file

### Use in Plugins

After building, copy to plugins:

**Figma Plugin:**
```bash
cp -r icons ../figma-plugin/icons
cp icons.json ../figma-plugin/icons.json
```

**PowerPoint Add-in:**
```bash
cp -r icons ../powerpoint-addin/add-in/icons
cp icons.json ../powerpoint-addin/add-in/icons.json
```

## Output

- `icons/` - ~4,323 processed SVG files
- `icons.json` - Icon metadata (~550KB)
  ```json
  [
    {
      "id": 0,
      "name": "Icon Name",
      "source": "Azure",
      "category": "compute",
      "file": "0.svg"
    }
  ]
  ```

## Integration

This prebuild step is integrated into:
- `scripts/build-and-release.sh` - Full build process
- `.github/workflows/build-and-release.yml` - CI/CD pipeline

## Processing Details

The `process-icons.js` script:
1. Scans `../../temp/` for icon source directories
2. Filters for SVG files only
3. Removes fixed width/height attributes
4. Ensures viewBox attribute exists
5. Indexes icons by source and category
6. Outputs to standardized format

## File Structure

```
prebuild/
├── package.json          # Build configuration
├── process-icons.js      # Icon processing script
├── README.md             # This file
├── .gitignore           # Ignore generated files
├── icons/               # Generated: processed SVGs
└── icons.json           # Generated: icon index
```
