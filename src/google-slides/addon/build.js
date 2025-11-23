const fs = require('fs');
const path = require('path');

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

// Generate IconsData.html (included in Sidebar.html)
const iconsDataJs = `window.iconsData = ${JSON.stringify(iconsWithSvg)};`;
fs.writeFileSync('IconsData.html', `<script>\n${iconsDataJs}\n</script>`, 'utf8');
console.log('Icons data saved to: IconsData.html');

// Generate include function for Code.gs if not exists
const includeFunction = `
/**
 * Include HTML file content
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
`;

// Note: include() function should be manually added to Code.gs
// The function is needed for Sidebar.html template system:
// function include(filename) {
//   return HtmlService.createHtmlOutputFromFile(filename).getContent();
// }

// File size info
const iconsDataSize = (fs.statSync('IconsData.html').size / 1024 / 1024).toFixed(2);

console.log(`Icon data file: IconsData.html (${iconsDataSize} MB)`);
console.log('Build complete!');
console.log('\nNext steps:');
console.log('1. Run: clasp login (if not logged in)');
console.log('2. Run: clasp create --type standalone --title "Cloud Architect Kits"');
console.log('3. Run: clasp push');
console.log('4. Open the Apps Script editor: clasp open');
console.log('5. Test the add-on in Google Slides');
