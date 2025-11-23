# Cloud Architect Kits - Google Slides Add-on

A Google Slides Add-on that allows you to quickly insert cloud architecture and technology icons into your presentations.

## Features

- 🔍 **Search through 4,300+ icons** from multiple sources
- 📐 **Flexible sizing** - Adjustable icon sizes from 16pt to 512pt
- 🎨 **Organized by source and category** - Easy navigation
- ⚡ **Fast keyword search** - Search by icon name, source, or category
- 🎯 **Auto-center** - Icons automatically centered on the slide
- 📊 **Real-time icon count** - See filtered/total counts
- 🔝 **Sticky source headers** - Source info stays visible while scrolling
- 🖼️ **Aspect ratio maintained** - Original icon proportions preserved

## Icon Sources

This add-on includes icons from:

- **Azure Architecture Icons** (~705 icons)
- **Microsoft 365 Icons** (~963 icons)
- **Dynamics 365 Icons** (~38 icons)
- **Microsoft Entra Icons** (~7 icons)
- **Power Platform Icons** (~9 icons)
- **Kubernetes Icons** (~39 icons)
- **Gilbarbara Logos** (~1,839 icons)
- **Lobe Icons** (~723 icons)

**Total: ~4,323 icons**

## Prerequisites

- Google Account
- Node.js (v14 or higher)
- npm
- Google Apps Script CLI (`clasp`)

## Project Structure

```
src/google-slides/
├── README.md              # This file
├── INSTALL.md             # Detailed installation guide (TODO)
└── addon/                 # Google Slides Add-on source
    ├── Code.gs            # Server-side code (Apps Script)
    ├── Sidebar.html       # UI template
    ├── SidebarScript.html # Client-side JavaScript
    ├── IconsData.html     # Generated icons data (~26 MB)
    ├── appsscript.json    # Apps Script manifest
    ├── build.js           # Build script
    ├── package.json       # Dependencies
    ├── .clasp.json        # Clasp configuration (generated)
    ├── .claspignore       # Files to ignore when pushing
    ├── icons/             # Icon SVG files (from prebuild)
    └── icons.json         # Icon metadata (from prebuild)
```

## Quick Start

See [INSTALL.md](INSTALL.md) for detailed installation instructions (coming soon).

### 1. Install Dependencies

```bash
cd src/google-slides/addon
npm install
```

### 2. Install Google Apps Script CLI

```bash
npm install -g @google/clasp
```

### 3. Login to Google

```bash
clasp login
```

### 4. Build the Add-on

```bash
npm run build
```

This will:
- Copy icons from the prebuild system
- Generate `IconsData.html` with all icon data (~26 MB)
- Prepare files for deployment

### 5. Create Apps Script Project

```bash
clasp create --type standalone --title "Cloud Architect Kits"
```

This creates:
- `.clasp.json`: Project configuration
- Apps Script project in your Google Drive

### 6. Push Code to Google

```bash
npm run push
```

or

```bash
clasp push
```

### 7. Open in Apps Script Editor

```bash
clasp open
```

## Usage

### In Google Slides

1. Open a Google Slides presentation
2. Click **Add-ons** → **Cloud Architect Kits** → **Show Icons**
3. Browse or search for icons
4. Click an icon to insert it into the current slide
5. Adjust size using the size controls

### Size Controls

- **Input field**: Enter custom size (16-512 pt)
- **Preset buttons**: Quick sizes (32, 64, 128, 256 pt)

### Search

- Type in the search box to filter icons
- Searches: icon name, category, and source
- Real-time filtering

## Project Structure

```
src/google-slides/addon/
├── Code.gs                 # Main server-side code
├── Sidebar.html            # UI template
├── SidebarScript.html      # Client-side JavaScript
├── IconsData.html          # Generated icons data (~26 MB)
├── appsscript.json         # Apps Script manifest
├── build.js                # Build script
├── package.json            # Dependencies
├── .clasp.json            # Clasp configuration (generated)
├── .claspignore           # Files to ignore when pushing
└── README.md              # This file
```

## Development

### Local Development

```bash
# Watch for changes and auto-push
clasp push --watch
```

### Testing

1. Open the Apps Script editor: `clasp open`
2. Click **Run** → **onOpen**
3. Test in a Google Slides presentation

### Debugging

- Use `Logger.log()` in `.gs` files
- Use `console.log()` in HTML files
- View logs: `clasp logs`
- Or in Apps Script editor: **View** → **Logs**

## API Reference

### Server-Side Functions (Code.gs)

#### `insertIcon(svgXml, name, size)`

Inserts an SVG icon into the current slide.

**Parameters**:
- `svgXml` (string): SVG XML content
- `name` (string): Icon name for logging
- `size` (number): Icon size in points

**Returns**: Object with `success` boolean and `message` or `error`

#### `getSlideDimensions()`

Gets the current slide dimensions.

**Returns**: Object with `width` and `height` in points

### Client-Side Functions (SidebarScript.html)

#### `insertIcon(icon)`

Client-side function to trigger icon insertion.

**Parameters**:
- `icon` (object): Icon object with `svg`, `name`, etc.

#### `renderIcons(query)`

Renders the icon list with optional search filter.

**Parameters**:
- `query` (string): Search query

## Deployment

### Test Deployment

```bash
clasp deploy --description "Test deployment"
```

### Production Deployment

```bash
clasp deploy --description "v1.0.0"
```

### List Deployments

```bash
clasp deployments
```

### Publish as Add-on

1. In Apps Script editor, click **Publish** → **Deploy from manifest**
2. Choose **Install add-on**
3. Or publish to Google Workspace Marketplace

## Technical Details

### Google Apps Script Quotas

- **Script runtime**: 6 minutes per execution
- **URL Fetch calls**: 20,000 per day
- **Script trigger total runtime**: 90 minutes per day

### File Size Limits

- **IconsData.html**: ~26 MB (within limits)
- **Total project**: ~30 MB (within 50 MB limit)

### OAuth Scopes

Required scopes (in `appsscript.json`):
- `presentations.currentonly`: Access current presentation
- `script.container.ui`: Show sidebar UI

## Troubleshooting

### Icons not loading

**Issue**: Sidebar shows "Loading icons..." forever

**Solution**:
1. Check if `IconsData.html` exists
2. Rebuild: `npm run build`
3. Push again: `clasp push`

### Insert fails

**Issue**: "No slide selected" error

**Solution**: Click on a slide in the main presentation area

### Clasp login fails

**Issue**: Can't authenticate with Google

**Solution**:
```bash
clasp login --creds <path-to-credentials.json>
```

Or use OAuth2: `clasp login`

### Push fails

**Issue**: "Push failed" error

**Solution**:
1. Check `.claspignore` is correct
2. Ensure you have write permissions
3. Try: `clasp pull` then `clasp push`

## Platform Comparison

### Cloud Architect Kits Ecosystem

```
Cloud Architect Kits
├── Figma Plugin          # Design tool
├── PowerPoint Add-in     # Microsoft presentations
└── Google Slides Add-on  # Google presentations
```

### Feature Comparison

| Feature | Figma | PowerPoint | Google Slides |
|---------|-------|-----------|---------------|
| **Platform** | Figma Plugin API | Office.js | Apps Script |
| **Deployment** | Figma Community | Azure Static Web Apps | Google Drive |
| **Icon Storage** | Plugin bundle | External JS file | Inline HTML |
| **API** | figma.createNodeFromSvg | Office.CoercionType.XmlSvg | SlidesApp.insertImage |
| **Updates** | Manual publish | Auto-update | Manual push |
| **Offline** | Yes | No (needs URL) | Yes (code in Drive) |
| **Search** | ✅ | ✅ | ✅ |
| **Auto-center** | ❌ | ✅ | ✅ |

## Related

- [PowerPoint Add-in](../powerpoint/) - PowerPoint version
- [Figma Plugin](../figma/) - Figma version
- [Prebuild System](../prebuild/) - Icon processing

## Technical Stack

- **Frontend**: HTML5, CSS3, jQuery 3.6.0
- **Backend**: Google Apps Script (V8 runtime)
- **Build**: Node.js, Clasp CLI
- **APIs**: Google Slides API, HTML Service

## License

ISC

## Support

For issues or questions, please open an issue on GitHub.
