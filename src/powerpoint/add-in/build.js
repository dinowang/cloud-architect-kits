const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('Loading icons data...');
const iconsData = JSON.parse(fs.readFileSync('icons.json', 'utf8'));
console.log(`Processing ${iconsData.length} icons...`);

// Read SVG files and encode to base64
const iconsWithSvg = iconsData.map(icon => {
  const svgPath = path.join('icons', icon.file);
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  const base64 = Buffer.from(svgContent).toString('base64');
  
  return {
    ...icon,
    svg: base64
  };
});

// Generate hash from data
const dataHash = crypto.createHash('md5')
  .update(JSON.stringify(iconsWithSvg))
  .digest('hex')
  .substring(0, 8);

const jsContent = `window.iconsData = ${JSON.stringify(iconsWithSvg)};`;
const jsFilename = `icons-data.${dataHash}.js`;

console.log('Generating icons data JS file...');
fs.writeFileSync(jsFilename, jsContent, 'utf8');
console.log(`Icons data saved to: ${jsFilename}`);

// Build HTML files
console.log('Building HTML files...');

const templateHtml = fs.readFileSync('taskpane.html', 'utf8');

// Development build (references external JS file)
const devHtml = templateHtml.replace('/*ICONS_JS_PATH*/', jsFilename);
fs.writeFileSync('taskpane-dev.html', devHtml, 'utf8');
console.log(`Development build: taskpane-dev.html (references external JS)`);

// Production build (inline JS)
const prodHtml = templateHtml.replace(
  '<script src="/*ICONS_JS_PATH*/"></script>',
  `<script>${jsContent}</script>`
);
fs.writeFileSync('taskpane-built.html', prodHtml, 'utf8');
console.log(`Production build: taskpane-built.html (inline JS)`);

// File size info
const jsSize = (fs.statSync(jsFilename).size / 1024 / 1024).toFixed(2);
console.log(`Icon data file: ${jsFilename} (${jsSize} MB)`);

console.log('Build complete!');
