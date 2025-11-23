const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const tempDir = path.join(rootDir, '../../temp');
const outputDir = path.join(rootDir, 'icons');
const outputJson = path.join(rootDir, 'icons.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function findAllSvgFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findAllSvgFiles(filePath, fileList);
    } else if (file.endsWith('.svg')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function normalizeFileName(fileName) {
  return fileName
    .replace(/^\d+-icon-service-/, '')
    .replace(/_scalable$/, '')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .trim();
}

function normalizeSvgSize(svgContent) {
  // Parse SVG and fix size issues
  // Remove fixed width/height attributes and ensure viewBox exists
  let normalized = svgContent;
  
  // Extract viewBox if it exists
  const viewBoxMatch = normalized.match(/viewBox=["']([^"']+)["']/);
  
  if (viewBoxMatch) {
    const viewBox = viewBoxMatch[1];
    // Remove width and height attributes, keep viewBox
    normalized = normalized.replace(/<svg([^>]*?)width=["'][^"']*["']([^>]*?)>/i, '<svg$1$2>');
    normalized = normalized.replace(/<svg([^>]*?)height=["'][^"']*["']([^>]*?)>/i, '<svg$1$2>');
  } else {
    // If no viewBox, try to extract from width/height and create one
    const widthMatch = normalized.match(/width=["']([^"']+)["']/);
    const heightMatch = normalized.match(/height=["']([^"']+)["']/);
    
    if (widthMatch && heightMatch) {
      const width = widthMatch[1];
      const height = heightMatch[1];
      const viewBox = `0 0 ${width} ${height}`;
      
      // Add viewBox and remove width/height
      normalized = normalized.replace(/<svg/, `<svg viewBox="${viewBox}"`);
      normalized = normalized.replace(/width=["'][^"']*["']/i, '');
      normalized = normalized.replace(/height=["'][^"']*["']/i, '');
    }
  }
  
  return normalized;
}

const sources = [
  {
    name: 'Azure',
    path: path.join(tempDir, 'azure-icons/Azure_Public_Service_Icons/Icons'),
    getCategoryFromPath: (relativePath) => path.dirname(relativePath),
  },
  {
    name: 'Entra',
    path: path.join(tempDir, 'entra-icons/Microsoft Entra architecture icons - Oct 2023/Microsoft Entra color icons SVG'),
    getCategoryFromPath: (relativePath) => path.dirname(relativePath),
  },
  {
    name: 'Fabric',
    path: path.join(tempDir, 'fabric-icons'),
    getCategoryFromPath: (relativePath) => 'Icons',
  },
  {
    name: 'Microsoft 365',
    path: path.join(tempDir, 'm365-icons'),
    getCategoryFromPath: (relativePath) => {
      const parts = relativePath.split(path.sep);
      return parts[0] || 'General';
    },
  },
  {
    name: 'Dynamics 365',
    path: path.join(tempDir, 'd365-icons/Dynamics_365_Icons_scalable'),
    getCategoryFromPath: (relativePath) => 'Icons'
  },
  {
    name: 'Power Platform',
    path: path.join(tempDir, 'powerplatform-icons/Power_Platform_scalable'),
    getCategoryFromPath: (relativePath) => 'Icons',
  },
  {
    name: 'Kubernetes',
    path: path.join(tempDir, 'kubernetes-icons'),
    getCategoryFromPath: (relativePath) => 'Icons',
  },
  {
    name: 'Gilbarbara',
    path: path.join(tempDir, 'gilbarbara-icons/logos'),
    getCategoryFromPath: (relativePath) => 'Logos',
  },
  {
    name: 'Lobe-icons',
    path: path.join(tempDir, 'lobe-icons/packages/static-svg/icons/'),
    getCategoryFromPath: (relativePath) => 'Icons',
  },
];

const icons = [];
let iconIndex = 0;

sources.forEach(source => {
  if (!fs.existsSync(source.path)) {
    console.warn(`Warning: Source path not found: ${source.path}`);
    return;
  }

  console.log(`Processing ${source.name}...`);
  const svgFiles = findAllSvgFiles(source.path);
  
  svgFiles.forEach((filePath) => {
    const relativePath = path.relative(source.path, filePath);
    const category = source.getCategoryFromPath(relativePath);
    const fileName = path.basename(filePath, '.svg');
    const serviceName = normalizeFileName(fileName);
    
    // Read, normalize, and save SVG
    const newFileName = `${iconIndex}.svg`;
    const destPath = path.join(outputDir, newFileName);
    const svgContent = fs.readFileSync(filePath, 'utf-8');
    const normalizedSvg = normalizeSvgSize(svgContent);
    fs.writeFileSync(destPath, normalizedSvg);
    
    icons.push({
      id: iconIndex,
      name: serviceName,
      source: source.name,
      category: category,
      file: newFileName
    });
    
    iconIndex++;
  });
  
  console.log(`  Added ${svgFiles.length} icons from ${source.name}`);
});

fs.writeFileSync(outputJson, JSON.stringify(icons, null, 2));
console.log(`\nTotal processed: ${icons.length} icons`);

// Generate icons data JavaScript file with embedded SVG data
console.log('\nGenerating icons data JavaScript files...');

// Read all SVG files and embed as base64 in icons array
const iconsWithSvg = icons.map(icon => {
  const svgPath = path.join(outputDir, icon.file);
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

// Generate minified icons-data.js file
const iconsDataJs = `window.iconsData=${JSON.stringify(iconsWithSvg)};`;

const templatesDir = path.join(rootDir, 'templates');
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// Clean up old hashed icon-data files
const existingFiles = fs.readdirSync(templatesDir);
existingFiles.forEach(file => {
  if (file.match(/^icons-data\.[a-f0-9]{8}\.js$/)) {
    const oldFilePath = path.join(templatesDir, file);
    fs.unlinkSync(oldFilePath);
    console.log(`  Removed old file: ${file}`);
  }
});

// Generate icons-data.js
const iconsDataPath = path.join(templatesDir, 'icons-data.js');
fs.writeFileSync(iconsDataPath, iconsDataJs);
console.log(`  Created: ${iconsDataPath}`);

// Generate hash for cache busting
const crypto = require('crypto');
const hash = crypto.createHash('md5').update(iconsDataJs).digest('hex').substring(0, 8);
const iconsDataHashPath = path.join(templatesDir, 'icons-data.hash');
fs.writeFileSync(iconsDataHashPath, hash);
console.log(`  Created: ${iconsDataHashPath} (hash: ${hash})`);

console.log('\nIcon data files generated successfully!');
