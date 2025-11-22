const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'icons');
const iconsJson = path.join(__dirname, 'icons.json');

console.log('驗證 SVG 圖示正規化...\n');

// Load icons metadata
const icons = JSON.parse(fs.readFileSync(iconsJson, 'utf-8'));
console.log(`總共 ${icons.length} 個圖示\n`);

let totalChecked = 0;
let withViewBox = 0;
let withoutViewBox = 0;
let withFixedSize = 0;
let errors = [];

icons.forEach((icon, index) => {
  const svgPath = path.join(iconsDir, icon.file);
  
  if (!fs.existsSync(svgPath)) {
    errors.push(`❌ 檔案不存在: ${icon.file} (${icon.name})`);
    return;
  }
  
  const content = fs.readFileSync(svgPath, 'utf-8');
  const firstThreeLines = content.split('\n').slice(0, 3).join('\n');
  
  totalChecked++;
  
  // Check for viewBox
  if (firstThreeLines.includes('viewBox=')) {
    withViewBox++;
  } else {
    withoutViewBox++;
    errors.push(`⚠️  缺少 viewBox: ${icon.file} (${icon.name} - ${icon.source})`);
  }
  
  // Check for fixed width/height in <svg> tag
  const svgTagMatch = content.match(/<svg[^>]*>/);
  if (svgTagMatch) {
    const svgTag = svgTagMatch[0];
    if (svgTag.match(/\swidth=["'][^"']*["']/) || svgTag.match(/\sheight=["'][^"']*["']/)) {
      withFixedSize++;
      errors.push(`❌ 包含固定尺寸: ${icon.file} (${icon.name} - ${icon.source})`);
    }
  }
  
  // Progress indicator
  if ((index + 1) % 500 === 0) {
    console.log(`  已檢查 ${index + 1}/${icons.length}...`);
  }
});

console.log('\n========== 驗證結果 ==========\n');
console.log(`總共檢查: ${totalChecked} 個圖示`);
console.log(`有 viewBox: ${withViewBox} (${(withViewBox/totalChecked*100).toFixed(1)}%)`);
console.log(`無 viewBox: ${withoutViewBox} (${(withoutViewBox/totalChecked*100).toFixed(1)}%)`);
console.log(`有固定尺寸: ${withFixedSize} (${(withFixedSize/totalChecked*100).toFixed(1)}%)`);

if (errors.length > 0) {
  console.log(`\n發現 ${errors.length} 個問題:\n`);
  errors.slice(0, 10).forEach(error => console.log(error));
  if (errors.length > 10) {
    console.log(`\n... 還有 ${errors.length - 10} 個問題\n`);
  }
} else {
  console.log('\n✅ 所有圖示都已正確正規化！');
}

console.log('\n==============================\n');

// Exit with error code if there are issues
process.exit(withFixedSize > 0 || withoutViewBox > 10 ? 1 : 0);
