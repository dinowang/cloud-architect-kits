const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = __dirname;
const iconsJsonPath = path.join(rootDir, 'icons.json');
const iconsDir = path.join(rootDir, 'icons');
const uiTemplatePath = path.join(__dirname, 'ui.html');
const outputPath = path.join(rootDir, 'ui-built.html');

console.log('Loading icons data...');
const icons = JSON.parse(fs.readFileSync(iconsJsonPath, 'utf-8'));

console.log(`Processing ${icons.length} icons...`);
const iconsWithSvg = icons.map(icon => {
  const svgPath = path.join(iconsDir, icon.file);
  const svgContent = fs.readFileSync(svgPath, 'utf-8');
  const svgBase64 = Buffer.from(svgContent).toString('base64');
  
  return {
    id: icon.id,
    name: icon.name,
    source: icon.source,
    category: icon.category,
    svg: svgBase64
  };
});

console.log('Generating icons data JS file...');
const iconsJsContent = `window.iconsData = ${JSON.stringify(iconsWithSvg)};`;
const hash = crypto.createHash('md5').update(iconsJsContent).digest('hex').substring(0, 8);
const iconsJsFilename = `icons-data.${hash}.js`;
const iconsJsPath = path.join(rootDir, iconsJsFilename);

fs.writeFileSync(iconsJsPath, iconsJsContent);
console.log(`Icons data saved to: ${iconsJsFilename}`);

// Clean up old icons-data files
const files = fs.readdirSync(rootDir);
files.forEach(file => {
  if (file.startsWith('icons-data.') && file.endsWith('.js') && file !== iconsJsFilename) {
    fs.unlinkSync(path.join(rootDir, file));
    console.log(`Removed old file: ${file}`);
  }
});

console.log('Building HTML files...');
let htmlContent = fs.readFileSync(uiTemplatePath, 'utf-8');

// For development: reference external JS file with hash
const devHtml = htmlContent.replace(
  '/*ICONS_JS_PATH*/',
  iconsJsFilename
);
const devOutputPath = path.join(rootDir, 'ui-dev.html');
fs.writeFileSync(devOutputPath, devHtml);
console.log('Development build: ui-dev.html (references external JS)');

// For production: inline the JS content
const inlineScript = `<script>${iconsJsContent}</script>`;
const prodHtml = htmlContent.replace(
  '<script src="/*ICONS_JS_PATH*/"></script>',
  inlineScript
);
fs.writeFileSync(outputPath, prodHtml);
console.log('Production build: ui-built.html (inline JS)');

console.log(`Icon data file: ${iconsJsFilename} (${(iconsJsContent.length / 1024 / 1024).toFixed(2)} MB)`);
console.log('Build complete!');
