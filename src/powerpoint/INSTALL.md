# PowerPoint Cloud Architect Add-in - Installation Guide

## Prerequisites

- Node.js 18 or higher
- npm
- PowerPoint (Office 365 or Office 2016+)
- Azure subscription (for production deployment)
- Terraform (for infrastructure deployment)

## Project Structure

```
src/powerpoint/
├── README.md              # Project overview
├── INSTALL.md             # This installation guide
├── add-in/                # PowerPoint Add-in source
│   ├── manifest.xml      # Office Add-in manifest
│   ├── taskpane.html     # UI template
│   ├── taskpane.js       # Application logic
│   ├── build.js          # Build script
│   └── ...               # Other add-in files
└── terraform/             # Infrastructure as Code
    ├── main.tf           # Main Terraform configuration
    └── ...               # Other Terraform files
```

## Quick Start

### Build from Source

Icons are automatically copied from the prebuild system:

#### 1. Build everything from project root

```bash
# From project root
./scripts/build-and-release.sh
```

This will:
1. Download all icon sources
2. Prebuild and normalize icons
3. Copy icons to PowerPoint add-in
4. Install dependencies
5. Build the add-in
6. Create distribution packages

#### 2. Or build PowerPoint add-in only

```bash
cd src/powerpoint/add-in
npm install
npm run build
```

This generates:
- `taskpane.html` (4.6 KB, references external JS)
- `taskpane-dev.html` (4.6 KB, development)
- `icons-data.*.js` (~26 MB, with hash for caching)

## Local Development

### 1. Start Local Server

```bash
npm run serve
```

The add-in will be available at `http://localhost:3000`

### 2. Update Manifest for Local Development

Edit `manifest.xml` and change all URLs to use `localhost:3000`:

```xml
<SourceLocation DefaultValue="http://localhost:3000/taskpane.html"/>
```

```xml
<bt:Url id="Taskpane.Url" DefaultValue="http://localhost:3000/taskpane.html"/>
<bt:Url id="Commands.Url" DefaultValue="http://localhost:3000/commands.html"/>
```

```xml
<bt:Image id="Icon.16x16" DefaultValue="http://localhost:3000/assets/icon-16.png"/>
<bt:Image id="Icon.32x32" DefaultValue="http://localhost:3000/assets/icon-32.png"/>
<bt:Image id="Icon.80x80" DefaultValue="http://localhost:3000/assets/icon-80.png"/>
```

### 3. Sideload Add-in in PowerPoint

#### Windows

1. Open PowerPoint
2. Go to **Insert** > **Get Add-ins**
3. Click **My Add-ins** tab
4. In the bottom-right corner, click **Upload My Add-in**
5. Browse to your `manifest.xml` file and select it
6. Click **Upload**

#### macOS

1. Open PowerPoint
2. Go to **Insert** > **Add-ins** > **My Add-ins**
3. Click the dropdown in the top-right corner
4. Select **Add from file...**
5. Browse to your `manifest.xml` file and select it

#### Web

1. Open PowerPoint Online
2. Go to **Insert** > **Add-ins**
3. Click **Upload My Add-in** (bottom-right)
4. Browse to your `manifest.xml` file and upload

### 4. Test the Add-in

1. In PowerPoint ribbon, you should see **Cloud Icons** group
2. Click **Show Icons** button
3. Task pane opens with icon browser
4. Search and insert icons into your slide

## Production Deployment to Azure

### Step 1: Deploy Infrastructure with Terraform

```bash
cd terraform

# Login to Azure
az login

# Initialize Terraform
terraform init

# Review plan
terraform plan

# Deploy
terraform apply
```

After deployment, save these outputs:

```bash
# Get Static Web App URL
terraform output static_web_app_url

# Get deployment token (save securely)
terraform output -raw static_web_app_api_key
```

### Step 2: Update Manifest for Production

Update `add-in/manifest.xml` with your Static Web App URL:

```bash
# Get your URL
WEBAPP_URL=$(cd ../terraform && terraform output -raw static_web_app_url)
echo "Your Static Web App URL: https://$WEBAPP_URL"
```

Edit `add-in/manifest.xml` and replace all `localhost:3000` with `https://YOUR-SWA-URL.azurestaticapps.net`

### Step 3: Deploy Application to Azure

#### Option A: Using Azure Static Web Apps CLI

```bash
cd add-in

# Install SWA CLI
npm install -g @azure/static-web-apps-cli

# Get deployment token from Terraform
DEPLOYMENT_TOKEN=$(cd ../terraform && terraform output -raw static_web_app_api_key)

# Deploy
swa deploy \
  --app-location . \
  --output-location . \
  --deployment-token $DEPLOYMENT_TOKEN
```

#### Option B: Using GitHub Actions

1. Add deployment token to GitHub Secrets:
   - Go to repository Settings > Secrets > Actions
   - Add secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: output from `terraform output -raw static_web_app_api_key`

2. Push code to main branch or manually trigger workflow:
   - Go to Actions > Deploy PowerPoint Add-in to Azure
   - Click "Run workflow"

### Step 4: Distribute Manifest

After deployment, distribute the updated `add-in/manifest.xml` to users:

#### For Organization (Centralized Deployment)

1. Upload to SharePoint catalog
2. Configure in Microsoft 365 Admin Center
3. Users will see add-in automatically in PowerPoint

#### For Individual Users

1. Send manifest.xml file
2. Users follow sideloading instructions above
3. They can install from the file

## Troubleshooting

### Build Issues

**Problem:** `Error: Cannot find module 'icons.json'`

**Solution:** 
```bash
# Build Figma plugin first
cd ../figma-cloudarchitect
npm run build

# Copy icons
cd ../powerpoint-cloudarchitect
cp -r ../figma-cloudarchitect/icons ./icons
cp ../figma-cloudarchitect/icons.json ./icons.json
```

**Problem:** Build produces small files

**Solution:** Check that icons directory has ~4300 SVG files:
```bash
ls icons/*.svg | wc -l
# Should output: 4323
```

### Add-in Loading Issues

**Problem:** Add-in not showing in PowerPoint

**Solution:**
- Check manifest.xml URLs are correct
- Ensure server is running (`npm run serve`)
- Clear Office cache (Windows: `%LOCALAPPDATA%\Microsoft\Office\16.0\Wef\`)
- Try a different PowerPoint application (Desktop/Web)

**Problem:** Icons not displaying

**Solution:**
- Open browser console (F12) in task pane
- Check for CORS errors
- Verify `taskpane.html` is ~52MB
- Verify `icons-data.*.js` exists

### Deployment Issues

**Problem:** Terraform authentication failed

**Solution:**
```bash
az login
az account show
az account set --subscription <subscription-id>
```

**Problem:** Static Web App deployment fails

**Solution:**
- Check deployment token is correct
- Verify files are built before deploying
- Check Azure subscription limits

**Problem:** CORS errors in production

**Solution:** Check `staticwebapp.config.json` includes proper CORS headers:
```json
{
  "routes": [{
    "route": "/*",
    "headers": {
      "Access-Control-Allow-Origin": "*"
    }
  }]
}
```

## File Checklist

After build, verify these files exist:

- [ ] `icons/` directory with ~4300 SVG files
- [ ] `icons.json` (~550KB)
- [ ] `icons-data.*.js` (~26MB)
- [ ] `taskpane.html` (~52MB)
- [ ] `taskpane-dev.html`
- [ ] `manifest.xml` (updated with correct URLs)
- [ ] `assets/icon-*.png` (4 files)

## Performance Tips

### For Large Icon Libraries

The add-in includes 4300+ icons, which results in large files:

1. **Use production build:** `taskpane.html` has all icons embedded
2. **Lazy loading:** Icons are loaded on-demand during scrolling
3. **Search debouncing:** Search is debounced by 300ms for performance
4. **Limited initial render:** Only first 100 icons rendered initially

### For Faster Development

During development:
- Use `taskpane-dev.html` which references external JS file
- Only rebuild when icon data changes
- Use browser caching

## Updating Icons

When icon library is updated:

```bash
# Rebuild Figma plugin
cd ../figma-cloudarchitect
npm run build

# Copy new icons
cd ../powerpoint-cloudarchitect
rm -rf icons icons.json icons-data.*.js
cp -r ../figma-cloudarchitect/icons ./icons
cp ../figma-cloudarchitect/icons.json ./icons.json

# Rebuild add-in
npm run build

# Redeploy to Azure
swa deploy --app-location . --output-location . --deployment-token $DEPLOYMENT_TOKEN
```

## Security Considerations

### Manifest Security

- Use HTTPS in production (required by Office)
- Keep deployment tokens secure
- Don't commit tokens to Git

### Content Security Policy

The add-in includes CSP headers in `staticwebapp.config.json`:

```json
{
  "globalHeaders": {
    "content-security-policy": "default-src 'self' https://appsforoffice.microsoft.com; ..."
  }
}
```

Adjust as needed for your security requirements.

## Support

For issues:
1. Check browser console for errors
2. Review [Office Add-ins documentation](https://docs.microsoft.com/office/dev/add-ins/)
3. Check Azure Static Web Apps logs in Azure Portal
4. Review Terraform state for infrastructure issues

## Next Steps

After installation:
1. Test in PowerPoint Desktop
2. Test in PowerPoint Online
3. Test in PowerPoint for Mac
4. Set up CI/CD with GitHub Actions
5. Configure custom domain (Standard tier only)
6. Set up monitoring in Azure
