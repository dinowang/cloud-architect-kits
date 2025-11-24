const fs = require('fs');
const path = require('path');

const prebuildDir = path.resolve(__dirname, '..', '..', 'prebuild');

console.log('Building VSCode extension resources...');

// Copy templates
const templatesDir = path.join(prebuildDir, 'templates');
const webviewDir = path.join(__dirname, 'webview');

if (!fs.existsSync(webviewDir)) {
  fs.mkdirSync(webviewDir, { recursive: true });
}

// Copy templates files
['ui-base.html', 'ui-base.css', 'ui-base.js', 'icons-data.js'].forEach(file => {
  const src = path.join(templatesDir, file);
  const dest = path.join(webviewDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file}`);
  }
});

console.log('Build complete!');
