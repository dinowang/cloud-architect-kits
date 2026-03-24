# Draw.io Icon Library - Installation Guide

Complete guide to building and using Cloud Architect Kits icon libraries in Draw.io.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Building Libraries](#building-libraries)
- [Using Libraries](#using-libraries)
- [Hosting for URL Access](#hosting-for-url-access)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### For Building

- Node.js (v14 or higher)
- npm

### For Using

- Web browser (Chrome, Firefox, Edge, Safari)
- OR Draw.io Desktop App (optional)

## Building Libraries

### Option 1: Build All (Recommended)

Build all outputs including Draw.io libraries:

```bash
# From project root
./scripts/build-and-release.sh
```

This generates:
- `dist/drawio-iconlib/*.xml` - All library files
- `dist/drawio-iconlib/README.md` - Library documentation

### Option 2: Build Draw.io Only

Build only the Draw.io libraries:

```bash
cd src/drawio/iconlib
npm install
npm run build
```

### Build Output

After building, you'll find these files in `dist/drawio-iconlib/`:

```
dist/drawio-iconlib/
├── cloud-architect-azure.xml (~10 MB)
├── cloud-architect-microsoft-365.xml (~15 MB)
├── cloud-architect-dynamics-365.xml (~0.5 MB)
├── cloud-architect-microsoft-entra.xml (~0.1 MB)
├── cloud-architect-power-platform.xml (~0.1 MB)
├── cloud-architect-kubernetes.xml (~0.5 MB)
├── cloud-architect-gilbarbara-logos.xml (~25 MB)
├── cloud-architect-lobe-icons.xml (~10 MB)
├── cloud-architect-all.xml (~70 MB)
└── README.md
```

### Validation

Validate generated libraries:

```bash
cd src/drawio/iconlib
npm run validate
```

Expected output:
```
✅ All libraries are valid!
```

## Using Libraries

### Method 1: Load from Local File (Easiest)

Perfect for personal use or testing.

#### Online Version

1. Open Draw.io: https://app.diagrams.net
2. Click **File** > **Open Library from** > **Device**
3. Navigate to `dist/drawio-iconlib/`
4. Select a library file (e.g., `cloud-architect-azure.xml`)
5. Click **Open**

#### Desktop App

1. Launch Draw.io Desktop App
2. Click **File** > **Open Library from** > **Device**
3. Navigate to `dist/drawio-iconlib/`
4. Select a library file
5. Click **Open**

#### Tips

- Start with source-specific libraries (faster loading)
- Use `cloud-architect-all.xml` only if you need all icons
- Libraries remain loaded until you close the diagram

### Method 2: Load from URL (For Teams)

Best for sharing with teams or public use.

#### Prerequisites

- Host library files on a web server
- Enable CORS (see [Hosting](#hosting-for-url-access))

#### Steps

1. Open Draw.io: https://app.diagrams.net
2. Click **File** > **Open Library from** > **URL**
3. Enter library URL:
   ```
   https://your-domain.com/libs/cloud-architect-azure.xml
   ```
4. Click **Open**

#### Direct Link

Create a link that opens Draw.io with library pre-loaded:

```
https://app.diagrams.net/?splash=0&clibs=Uhttps%3A%2F%2Fyour-domain.com%2Flibs%2Fcloud-architect-azure.xml
```

**Note:** URL must be URL-encoded. Use `encodeURIComponent()` in JavaScript.

### Method 3: Load Multiple Libraries

Load several libraries at once:

```
https://app.diagrams.net/?splash=0&clibs=U<URL1>;U<URL2>;U<URL3>
```

Example:
```
https://app.diagrams.net/?splash=0&clibs=Uhttps%3A%2F%2Fyour-domain.com%2Flibs%2Fcloud-architect-azure.xml;Uhttps%3A%2F%2Fyour-domain.com%2Flibs%2Fcloud-architect-kubernetes.xml
```

## Using Icons in Diagrams

### Basic Usage

1. **Find Icon**: Browse library in left sidebar
2. **Drag & Drop**: Drag icon onto canvas
3. **Resize**: Drag corners (maintains aspect ratio)
4. **Style**: Use format panel on right

### Searching Icons

Draw.io doesn't have built-in library search, but you can:

1. Use browser search (Ctrl+F / Cmd+F)
2. Search for icon title in sidebar
3. Use source-specific libraries to narrow down

### Customizing Icons

Icons can be customized using Draw.io's format panel:

- **Size**: Drag corners or set precise dimensions
- **Colors**: Use "Edit Style" to modify SVG colors
- **Opacity**: Adjust transparency
- **Effects**: Add shadows, borders, etc.

### Tips

- Icons maintain aspect ratio (can't distort)
- Group related icons for easy management
- Save frequently used icons as custom shapes
- Use layers to organize complex diagrams

## Hosting for URL Access

### Option 1: GitHub Pages (Free)

Perfect for open-source projects.

#### Setup

1. Create `docs/libs/` in your repository:
   ```bash
   mkdir -p docs/libs
   ```

2. Copy library files:
   ```bash
   cp dist/drawio-iconlib/*.xml docs/libs/
   ```

3. Enable GitHub Pages:
   - Go to repository Settings
   - Scroll to "Pages"
   - Source: Deploy from branch
   - Branch: main, folder: /docs
   - Click Save

4. Access libraries:
   ```
   https://your-username.github.io/your-repo/libs/cloud-architect-azure.xml
   ```

#### CORS Headers

GitHub Pages automatically enables CORS, so libraries work with Draw.io.

### Option 2: Azure Static Web Apps

Host on Azure for enterprise use.

#### Setup with Terraform

Use the provided Terraform configuration:

```bash
cd src/drawio/terraform
terraform init
terraform plan
terraform apply
```

#### Manual Setup

1. Create Static Web App in Azure Portal
2. Upload library files to the app
3. Ensure CORS is enabled

#### Access

```
https://your-app.azurestaticapps.net/cloud-architect-azure.xml
```

### Option 3: Custom Web Server

Host on your own infrastructure.

#### Requirements

- Static file hosting
- HTTPS enabled (recommended)
- CORS headers configured

#### CORS Configuration

**Nginx:**
```nginx
location /libs/ {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods GET;
}
```

**Apache:**
```apache
<Directory "/path/to/libs">
    Header set Access-Control-Allow-Origin "*"
</Directory>
```

**Azure Static Web Apps** (`staticwebapp.config.json`):
```json
{
  "globalHeaders": {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET"
  }
}
```

## Recommended Libraries by Use Case

### Cloud Architecture Diagrams

Load these libraries:
- `cloud-architect-azure.xml` (Azure resources)
- `cloud-architect-kubernetes.xml` (Kubernetes)
- `cloud-architect-gilbarbara-logos.xml` (Technology logos)

### Microsoft Ecosystem

Load these libraries:
- `cloud-architect-microsoft-365.xml` (Microsoft 365)
- `cloud-architect-azure.xml` (Azure)
- `cloud-architect-power-platform.xml` (Power Platform)
- `cloud-architect-dynamics-365.xml` (Dynamics 365)

### General Technology Diagrams

Load these libraries:
- `cloud-architect-gilbarbara-logos.xml` (Company logos)
- `cloud-architect-lobe-icons.xml` (Modern icons)

### Everything

Use the combined library (warning: large file):
- `cloud-architect-all.xml` (All 8,642 icons)

## Troubleshooting

### Library Won't Load from URL

**Symptom:** Error message when loading from URL

**Solutions:**
1. Check URL is accessible (open in browser)
2. Verify CORS headers are set
3. Ensure URL is properly URL-encoded
4. Try loading from local file first
5. Check browser console for errors

### Library Too Large / Slow Loading

**Symptom:** Draw.io freezes or loads slowly

**Solutions:**
1. Use source-specific libraries instead of `cloud-architect-all.xml`
2. Use Draw.io desktop app (better performance)
3. Close unused libraries
4. Clear browser cache
5. Use a faster internet connection

### Icons Not Displaying

**Symptom:** Library loads but icons don't appear

**Solutions:**
1. Check library XML format with `npm run validate`
2. Verify SVG data is properly base64-encoded
3. Try regenerating libraries: `npm run build`
4. Check browser console for errors

### Can't Find Specific Icon

**Symptom:** Icon exists but hard to locate

**Solutions:**
1. Use browser search (Ctrl+F / Cmd+F) while sidebar is visible
2. Check source-specific library instead of combined
3. Look in `dist/drawio-iconlib/README.md` for icon counts
4. Search original `icons.json` for icon metadata

### Libraries Not Persisting

**Symptom:** Libraries disappear when reopening Draw.io

**Solutions:**
- Libraries are per-diagram, not global
- Save diagram with libraries loaded
- Re-load libraries for new diagrams
- Consider URL method for team sharing

### Build Errors

**Symptom:** `npm run build` fails

**Solutions:**
1. Check Node.js version: `node --version` (need v14+)
2. Verify prebuild icons exist: `ls ../../prebuild/icons/`
3. Ensure icons.json exists: `ls ../../prebuild/icons.json`
4. Run from correct directory: `cd src/drawio/iconlib`
5. Clean and retry: `rm -rf node_modules && npm install && npm run build`

## Performance Tips

### For Users

- Load only needed libraries
- Use source-specific libraries
- Close unused libraries
- Use desktop app for large libraries
- Enable hardware acceleration in browser

### For Developers

- Generate source-specific libraries
- Don't include unused icons
- Optimize SVG size before encoding
- Consider lazy loading for large sets

## Updates and Maintenance

### Updating Libraries

When icon sources are updated:

```bash
# Update prebuild icons
cd src/prebuild
npm run build

# Rebuild Draw.io libraries
cd ../drawio/iconlib
npm run build

# Validate
npm run validate
```

### Version Control

Recommended `.gitignore`:
```
dist/drawio-iconlib/*.xml
dist/drawio-iconlib/README.md
node_modules/
```

Keep source files in Git, generate outputs during build.

## Related Documentation

- **[README.md](README.md)** - Features and overview
- **[Prebuild System](../prebuild/README.md)** - Icon processing
- **[Draw.io Documentation](https://www.diagrams.net/doc/)** - Official Draw.io docs
- **[Custom Libraries Guide](https://www.diagrams.net/doc/faq/custom-libraries)** - Draw.io custom libraries

## Support

For issues with:
- **Building libraries**: Check this guide and prebuild documentation
- **Using in Draw.io**: See Draw.io official documentation
- **Icon content**: Check original icon sources
- **Performance**: Use source-specific libraries or desktop app

## Next Steps

1. ✅ Build libraries: `npm run build`
2. ✅ Validate: `npm run validate`
3. ✅ Test locally: Open in Draw.io from device
4. ✅ (Optional) Host: Deploy to GitHub Pages or Azure
5. ✅ Share: Distribute XML files or URLs to team

Happy diagramming! 🎨
