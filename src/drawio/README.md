# Cloud Architect Kits - Draw.io Icon Libraries

Custom icon libraries for Draw.io (diagrams.net) containing cloud architecture and technology icons.

## Features

- 📚 8,642+ icons organized by source
- 🔍 Separate libraries for each icon source
- 📦 Combined library with all icons
- ⚡ Standard Draw.io XML library format
- 🎨 SVG vector graphics with fixed aspect ratio
- 🌐 Compatible with both online and desktop versions
- 🔒 No external dependencies - all icons embedded

## Prerequisites

- Web browser (for Draw.io online)
- OR Draw.io Desktop App (optional)

## Project Structure

```
src/drawio/
├── README.md              # This file
├── INSTALL.md             # Detailed installation guide
└── iconlib/               # Library generator
    ├── package.json       # Build configuration
    ├── generate-library.js # Library generator script
    └── validate-library.js # Validation script
```

## Quick Start

### Option 1: Use Online (Recommended)

1. Open Draw.io: https://app.diagrams.net
2. Go to **File** > **Open Library from** > **URL**
3. Enter the library URL (if hosted)
4. Click **Open**

### Option 2: Use Local File

1. Build the libraries (see [Build](#build))
2. Go to Draw.io: https://app.diagrams.net
3. Go to **File** > **Open Library from** > **Device**
4. Select the `.xml` file from `dist/drawio-iconlib/`
5. Click **Open**

For detailed instructions, see [INSTALL.md](INSTALL.md)

## Build

Build the icon libraries from the prebuild system:

```bash
# From project root
./scripts/build-and-release.sh

# Or manually
cd src/drawio/iconlib
npm install
npm run build
```

This generates:
- `dist/drawio-iconlib/cloud-architect-{source}.xml` - Individual source libraries
- `dist/drawio-iconlib/cloud-architect-all.xml` - Combined library (all sources)
- `dist/drawio-iconlib/README.md` - Library documentation

## Available Libraries

Libraries are generated for each icon source:

| Library | Icons | Description |
|---------|-------|-------------|
| `cloud-architect-thesvg.xml` | 3,999 | TheSVG Technology Icons |
| `cloud-architect-gilbarbara-logos.xml` | 1,776 | Gilbarbara Technology Logos |
| `cloud-architect-microsoft-365.xml` | 963 | Microsoft 365 Icons |
| `cloud-architect-lobe-icons.xml` | 727 | Lobe Icons |
| `cloud-architect-azure.xml` | 705 | Azure Architecture Icons |
| `cloud-architect-aws.xml` | 321 | AWS Architecture Icons |
| `cloud-architect-gcp.xml` | 45 | Google Cloud Platform Icons |
| `cloud-architect-kubernetes.xml` | 39 | Kubernetes Icons |
| `cloud-architect-dynamics-365.xml` | 38 | Dynamics 365 Icons |
| `cloud-architect-fabric.xml` | 13 | Microsoft Fabric Icons |
| `cloud-architect-power-platform.xml` | 9 | Power Platform Icons |
| `cloud-architect-microsoft-entra.xml` | 7 | Microsoft Entra Icons |
| `cloud-architect-all.xml` | **8,642** | **All icons (combined)** |

## Usage in Draw.io

### Loading a Library

1. **From URL** (if hosted):
   - File > Open Library from > URL
   - Enter library URL
   - Click Open

2. **From Device**:
   - File > Open Library from > Device
   - Select `.xml` file
   - Click Open

### Using Icons

1. Once loaded, the library appears in the left sidebar
2. Drag and drop icons onto your diagram
3. Icons maintain aspect ratio (fixed)
4. Resize by dragging corners
5. Change colors using the style panel

### Loading Multiple Libraries

Open Draw.io with multiple libraries pre-loaded:

```
https://app.diagrams.net/?splash=0&clibs=U<URL1>;U<URL2>;U<URL3>
```

Example (if hosted on GitHub Pages):
```
https://app.diagrams.net/?splash=0&clibs=Uhttps%3A%2F%2Fyour-org.github.io%2Fcloud-architect-kits%2Flibs%2Fcloud-architect-azure.xml
```

## Library Format

Libraries follow the standard Draw.io XML format:

```xml
<mxlibrary>[
  {
    "data": "data:image/svg+xml;base64,...",
    "w": 64,
    "h": 64,
    "title": "Icon Name",
    "aspect": "fixed"
  },
  ...
]</mxlibrary>
```

Properties:
- `data` - Base64-encoded SVG data URI
- `w` - Width in pixels
- `h` - Height in pixels
- `title` - Icon name (shown on hover)
- `aspect` - "fixed" maintains aspect ratio

## Development Commands

```bash
npm run build      # Generate libraries
npm run validate   # Validate generated libraries
```

## Icon Sources

This library uses icons from:

- **TheSVG**: Technology and brand SVG icons (3,999)
- **Gilbarbara Logos**: Technology company logos (1,776)
- **Microsoft 365**: Official Microsoft 365 Icons (963)
- **Lobe Icons**: Modern icon set (727)
- **Azure**: Official Azure Architecture Icons (705)
- **AWS**: Official AWS Architecture Icons (321)
- **GCP**: Official Google Cloud Platform Icons (45)
- **Kubernetes**: Official Kubernetes Icons (39)
- **Dynamics 365**: Official Dynamics 365 Icons (38)
- **Microsoft Fabric**: Official Microsoft Fabric Icons (13)
- **Power Platform**: Official Power Platform Icons (9)
- **Microsoft Entra**: Official Microsoft Entra Icons (7)

**Total: 8,642 icons**

## Performance Notes

- **Individual Libraries**: Load quickly, recommended for most use cases
- **Combined Library**: Large file (~50+ MB), may take time to load
- **Recommendation**: Use source-specific libraries for better performance

## Troubleshooting

### Library Won't Load

- Check file is valid XML format
- Verify file size (very large files may timeout)
- Try clearing browser cache
- Use desktop app for large libraries

### Icons Not Displaying

- Ensure library is properly loaded (check left sidebar)
- Verify XML structure with `npm run validate`
- Check browser console for errors

### Slow Performance

- Use source-specific libraries instead of combined
- Close unused libraries
- Use Draw.io desktop app for better performance

## Hosting Libraries

To host libraries for URL loading:

### GitHub Pages

1. Create `docs/libs/` directory
2. Copy `.xml` files to `docs/libs/`
3. Enable GitHub Pages
4. Use URL: `https://your-org.github.io/your-repo/libs/cloud-architect-azure.xml`

### Static Web Server

1. Deploy `.xml` files to web server
2. Enable CORS headers:
   ```
   Access-Control-Allow-Origin: *
   ```
3. Use URL: `https://your-domain.com/libs/cloud-architect-azure.xml`

## Related Projects

- [Figma Plugin](../figma/) - Figma version of icon library
- [PowerPoint Add-in](../powerpoint/) - PowerPoint version
- [Google Slides Add-on](../google-slides/) - Google Slides version
- [Prebuild System](../prebuild/) - Unified icon processing

## License

ISC

## Resources

- [Draw.io](https://app.diagrams.net) - Online diagramming tool
- [Draw.io Desktop](https://github.com/jgraph/drawio-desktop) - Desktop version
- [Draw.io Custom Libraries](https://www.diagrams.net/doc/faq/custom-libraries) - Official documentation
- [drawio-libs Repository](https://github.com/jgraph/drawio-libs) - Official library examples
