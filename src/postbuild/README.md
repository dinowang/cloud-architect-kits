# Postbuild Aggregation

This project aggregates all static HTML-based plugins into a single deployable directory structure for GitHub Pages.

## Structure

```
out/
├── index.html           # Landing page with plugin links
├── figma/              # Figma plugin files
├── powerpoint/         # PowerPoint add-in files
├── google-slides/      # Google Slides add-on files
└── drawio/             # Draw.io icon libraries
```

## Build

```bash
npm run build
```

This will:
1. Copy built outputs from each plugin's `out` directory
2. Generate an index.html landing page
3. Create the aggregated structure in `./out/`

## Deployment

The `out/` directory is deployed to GitHub Pages via the build-and-release workflow.

## Adding New Plugins

Edit `build.js` and add a new entry to the `plugins` array:

```javascript
{
  name: 'plugin-folder-name',
  displayName: 'Plugin Display Name',
  sourcePath: path.join(rootDir, 'src/plugin-folder/out'),
  description: 'Plugin description'
}
```
