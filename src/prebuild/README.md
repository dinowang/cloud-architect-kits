# Cloud Architect Kits - Prebuild

This directory contains the icon processing pipeline that generates the preprocessed icons and shared UI templates used by all platform plugins (Figma, PowerPoint, Google Slides, Draw.io).

## Purpose

1. **Icon Processing**: Pre-processes icons from multiple sources into a standardized format
   - Processes SVG files (removes fixed dimensions, ensures viewBox)
   - Organizes by source and category
   - Generates `icons.json` index
   - Creates normalized SVG files in `icons/` directory

2. **Shared UI Templates**: Provides reusable UI components
   - `templates/ui-base.html` - Common HTML structure
   - `templates/ui-base.css` - Shared styling
   - `templates/ui-base.js` - Common UI logic (search, render, etc.)
   - `templates/icons-data.js` - Icon data with embedded SVG (base64)
   - `templates/icons-data.hash` - MD5 hash (8 chars) for cache busting
   
   Each platform adapts these templates with platform-specific:
   - Styling (brand colors, fonts)
   - Icon insertion logic
   - Event handling

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
5. Generate `templates/icons-data.js` with embedded icon data
6. Generate `templates/icons-data.hash` containing MD5 hash for cache busting

### Use in Plugins

After building, copy to plugins:

**Figma Plugin:**
```bash
cp -r icons ../figma-plugin/icons
cp icons.json ../figma-plugin/icons.json
```

**PowerPoint Add-in:**
```bash
cp -r icons ../powerpoint/add-in/icons
cp icons.json ../powerpoint/add-in/icons.json
```

**Google Slides Add-on:**
```bash
cp -r icons ../google-slides/addon/icons
cp icons.json ../google-slides/addon/icons.json
```

**Draw.io Icon Library:**
```bash
# Icons are embedded into Draw.io XML format during build
```

## Output

- `icons/` - ~8,642 processed SVG files
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
- `templates/icons-data.js` - JavaScript file with embedded icon data (~26MB)
  ```javascript
  window.iconsData = [
    {
      "id": 0,
      "name": "Icon Name",
      "source": "Azure",
      "category": "compute",
      "svg": "PHN2ZyB4bWxucz0i..." // base64 encoded SVG
    }
  ];
  ```
- `templates/icons-data.hash` - Hash value for cache busting (e.g., `46b94727`)
  - Used as query parameter: `icons-data.js?v=46b94727`
  - Ensures browsers reload the file when content changes

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
7. Generates JavaScript file with embedded icon data (base64 encoded SVGs)
8. Creates `.hash` file containing MD5 hash for cache busting
9. Cleans up old hashed `.js` files before generating new ones

## File Structure

```
prebuild/
├── package.json          # Build configuration
├── process-icons.js      # Icon processing script
├── README.md             # This file
├── .gitignore           # Ignore generated files
├── templates/            # Shared UI templates
│   ├── README.md        # Templates documentation
│   ├── ui-base.html     # Common HTML structure
│   ├── ui-base.css      # Shared styles
│   ├── ui-base.js       # Common UI logic
│   ├── icons-data.js    # Generated: Icon data with embedded SVG
│   └── icons-data.hash  # Generated: Hash for cache busting
├── icons/               # Generated: processed SVGs
└── icons.json           # Generated: icon index
```

## Shared Templates Usage

The templates in `templates/` provide a common foundation that platforms can adapt:

- **Figma**: Inline everything into a single HTML file (no external resources allowed)
- **PowerPoint**: Use separate CSS/JS files with Office.js integration
- **Google Slides**: Use Google Apps Script template includes (<?!= include() ?>)
- **Draw.io**: Not applicable (uses XML format)

Each platform's build script customizes these templates with platform-specific requirements.
