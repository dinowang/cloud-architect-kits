const fs = require('fs');
const path = require('path');

const prebuildDir = path.resolve(__dirname, '..', '..', 'prebuild');
const templatesDir = path.join(prebuildDir, 'templates');
const iconsDataPath = path.join(templatesDir, 'icons-data.js');
const outDir = path.resolve(__dirname, 'out');

console.log('Building Figma plugin...');

// Create out directory
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Read icons-data.js
const iconsDataContent = fs.readFileSync(iconsDataPath, 'utf-8');
const hashMatch = iconsDataContent.match(/\/\/ Hash: ([a-f0-9]+)/);
const hash = hashMatch ? hashMatch[1] : 'unknown';
console.log(`Using icons data with hash: ${hash}`);

// Build UI HTML
const uiBaseHtml = fs.readFileSync(path.join(templatesDir, 'ui-base.html'), 'utf-8');
const uiBaseCss = fs.readFileSync(path.join(templatesDir, 'ui-base.css'), 'utf-8');
const uiBaseJs = fs.readFileSync(path.join(templatesDir, 'ui-base.js'), 'utf-8');
const uiPlatformJs = fs.readFileSync(path.join(__dirname, 'ui-platform.js'), 'utf-8');

let html = uiBaseHtml;

// Replace PLATFORM_HEAD_PLACEHOLDER
html = html.replace(
  '<!-- PLATFORM_HEAD_PLACEHOLDER -->',
  `<style>
:root {
  --font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --primary-color: #18a0fb;
  --header-bg: #e5f3ff;
  --hover-bg: #e5f3ff;
}
${uiBaseCss}
</style>`
);

// Replace SIZE_UNIT_PLACEHOLDER
html = html.replace('<!-- SIZE_UNIT_PLACEHOLDER -->', 'px');

// Replace PLATFORM_SCRIPTS_PLACEHOLDER
html = html.replace(
  '<!-- PLATFORM_SCRIPTS_PLACEHOLDER -->',
  `<script>
${iconsDataContent}
</script>
<script>
${uiBaseJs}
</script>
<script>
${uiPlatformJs}
</script>`
);

const uiHtmlPath = path.join(outDir, 'ui.html');
fs.writeFileSync(uiHtmlPath, html);
const uiHtmlSize = (fs.statSync(uiHtmlPath).size / 1024 / 1024).toFixed(2);
console.log(`✓ Built: ui.html (${uiHtmlSize} MB)`);

// Note: code.js will be compiled by TypeScript directly to out/

// Copy manifest.json
fs.copyFileSync(path.join(__dirname, 'manifest.json'), path.join(outDir, 'manifest.json'));
console.log('✓ Copied: manifest.json');

console.log('Build complete!');
