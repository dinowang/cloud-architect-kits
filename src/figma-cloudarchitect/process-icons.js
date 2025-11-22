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
    getCategoryFromPath: (relativePath) => {
      const parts = relativePath.split(path.sep);
      return parts[0] || 'General';
    },
  },
  {
    name: 'Power Platform',
    path: path.join(tempDir, 'powerplatform-icons/Power_Platform_scalable'),
    getCategoryFromPath: (relativePath) => 'Power Platform',
  },
  {
    name: 'Gilbarbara',
    path: path.join(tempDir, 'gilbarbara-icons/logos'),
    getCategoryFromPath: (relativePath) => 'Logos',
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
