# Cloud Architect Kits - PowerPoint Add-in

A PowerPoint Add-in that allows you to quickly insert cloud architecture and technology icons into your presentations.

## Features

- 🔍 Search through 4300+ icons from multiple sources
- 📐 Customizable icon size (default 64px, maintains aspect ratio)
- 🎨 Organized by source and category
- ⚡ Fast keyword search by icon name, source, or category
- 🎯 One-click icon insertion
- 📊 Real-time icon count display (filtered/total)
- 🔝 Sticky source headers for easy navigation
- ☁️ Deployed on Azure Static Web Apps

## Prerequisites

- Node.js (v14 or higher)
- npm
- PowerPoint (Office 365 or Office 2016+)
- Azure subscription (for deployment)
- Terraform (for infrastructure deployment)

## Project Structure

```
src/powerpoint/
├── README.md              # This file
├── INSTALL.md             # Detailed installation guide
├── add-in/                # PowerPoint Add-in source
│   ├── manifest.xml      # Office Add-in manifest
│   ├── package.json      # Dependencies
│   ├── taskpane.html     # Generated UI
│   ├── taskpane.css      # Generated styles
│   ├── taskpane.js       # Generated app logic
│   ├── icons-data.js     # Generated icons data (~26 MB)
│   ├── commands.html     # Commands page
│   ├── build.js          # Build script
│   ├── assets/           # Icons for manifest
│   └── staticwebapp.config.json # Azure config
└── terraform/             # Infrastructure as Code
    ├── main.tf           # Main configuration
    ├── variables.tf      # Variables
    ├── outputs.tf        # Outputs
    └── README.md         # Terraform guide
```

**Note:** UI files are generated from `../../prebuild/templates/` during build

## Quick Start

### Local Development (5 minutes)

```bash
cd add-in
./deploy.sh
npm run serve
```

Then sideload `add-in/manifest.xml` in PowerPoint.

For detailed instructions, see [add-in/QUICKSTART.md](add-in/QUICKSTART.md)

### Azure Deployment

```bash
cd terraform
terraform init
terraform apply
```

For detailed instructions, see [INSTALL.md](INSTALL.md)

## Local Development Details

### 1. Install Dependencies

```bash
cd add-in
npm install
```

### 2. Build Add-in

UI and icons are generated from the prebuild system during the build process:

```bash
# From project root
./scripts/build-and-release.sh

# Or manually
cd add-in
npm run build
```

This will:
1. Copy UI templates from `../../prebuild/templates/`
2. Copy icons data with cache-busting hash
3. Generate platform-specific files

### 3. Start Local Server

```bash
npm run serve
```

The add-in will be available at `http://localhost:3000`

### 4. Sideload in PowerPoint

1. Open PowerPoint
2. Go to Insert > My Add-ins > Manage My Add-ins
3. Click "Upload My Add-in"
4. Browse to `add-in/manifest.xml` and upload

**Note:** For local development, update `add-in/manifest.xml` to use `http://localhost:3000` instead of production URL.

## Azure Deployment

### Infrastructure Setup with Terraform

1. Navigate to terraform directory:

```bash
cd terraform
```

2. Initialize Terraform:

```bash
terraform init
```

3. Plan deployment:

```bash
terraform plan
```

4. Apply infrastructure:

```bash
terraform apply
```

5. Get deployment token:

```bash
terraform output -raw static_web_app_api_key
```

6. Get Static Web App URL:

```bash
terraform output static_web_app_url
```

### Deploy Application

#### Option 1: Using Azure CLI

```bash
cd add-in

# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy \
  --app-location . \
  --output-location . \
  --deployment-token <YOUR_DEPLOYMENT_TOKEN>
```

#### Option 2: Using GitHub Actions

Create `.github/workflows/azure-static-web-apps.yml`:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Build
        run: |
          cd src/powerpoint-cloudarchitect
          npm install
          npm run build
      
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "src/powerpoint-cloudarchitect/add-in"
          output_location: ""
```

### Update Manifest for Production

After deployment, update `add-in/manifest.xml` with your Static Web App URL:

```xml
<SourceLocation DefaultValue="https://your-swa-url.azurestaticapps.net/taskpane.html"/>
```

## Directory Structure Details

### add-in/
Contains the PowerPoint Add-in source code:
- `manifest.xml` - Office Add-in manifest
- `package.json` - Node.js dependencies
- `taskpane.html` - Generated UI (from prebuild templates)
- `taskpane.css` - Generated styles (from prebuild templates)
- `taskpane.js` - Generated app logic (from prebuild templates)
- `icons-data.js` - Generated icons data (~26 MB)
- `commands.html` - Commands page
- `build.js` - Build script
- `staticwebapp.config.json` - Azure Static Web Apps config
- `assets/` - Manifest icons

## Icon Sources

This add-in uses the same icon library as the Figma Cloud Architect plugin:

- Azure Architecture Icons (~705)
- Microsoft 365 Icons (~963)
- Dynamics 365 Icons (~38)
- Microsoft Entra Icons (~7)
- Power Platform Icons (~9)
- Kubernetes Icons (~39)
- Gilbarbara Logos (~1839)
- Lobe Icons (~723)

**Total: ~4,323 icons**

## Configuration

### Terraform Variables

Edit `terraform/variables.tf` or create `terraform.tfvars`:

```hcl
codename    = "pptcloudarch"
location    = "East Asia"
environment = "production"
sku_tier    = "Free"
sku_size    = "Free"
```

### Static Web App Configuration

Edit `add-in/staticwebapp.config.json` to customize:
- CORS headers
- MIME types
- Content Security Policy
- Route handling

## Usage

1. Open PowerPoint
2. Click "Cloud Icons" in the Home ribbon
3. Browse icons organized by source and category
4. Use the search box to find specific icons
5. Adjust icon size (16-512px) using presets or manual input
6. Click an icon to insert it into your slide

## Features

- **Smart Scaling**: Icons maintain aspect ratio based on longest side
- **48x48 Preview**: Optimized preview size for better browsing
- **Sticky Headers**: Source headers stay visible while scrolling
- **Icon Count Display**: Real-time filtered/total count per source
- **Auto-Scroll**: Search results automatically scroll to top
- **Lazy Loading**: Optimized rendering for 4300+ icons

## Troubleshooting

### Add-in Not Loading

- Check manifest.xml URLs match your deployment
- Verify Static Web App is deployed and accessible
- Check browser console for errors
- Ensure Office version supports add-ins

### Icons Not Displaying

- Check `icons-data.js` exists and is ~26 MB
- Verify `taskpane.html` references `icons-data.js?v={hash}`
- Check prebuild icons exist: `ls ../../prebuild/templates/icons-data.js`
- Run `npm run build` to regenerate

### Terraform Issues

- Ensure Azure CLI is logged in: `az login`
- Check subscription: `az account show`
- Verify resource group doesn't already exist
- Check quota limits for Static Web Apps

## Development Commands

```bash
npm run build      # Build add-in
npm run serve      # Start local server
npm run validate   # Validate manifest
```

## License

ISC

## Notes

- Icons are loaded from external JS file (~26 MB) with browser caching
- Cache busting via `icons-data.js?v={hash}` query parameter
- Static Web App deployment supports custom domains
- Free tier Static Web Apps have bandwidth limits
- Icons maintain aspect ratio when inserted
- `taskpane.html`: ~5 KB (references external icons-data.js)
- `icons-data.js`: ~26 MB (cached by browser)

## Related Projects

- [Figma Plugin](../figma/) - Figma version of icon library
- [Prebuild System](../prebuild/) - Unified icon processing
