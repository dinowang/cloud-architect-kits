import { normalizeTitle } from './support.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;
const tempDir = path.join(rootDir, '../../temp');
const outputDir = path.join(rootDir, 'icons');
const outputJson = path.join(rootDir, 'icons.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function findAllSvgFiles(dir, baseDir, fileList = [], pathAndFileFilter = null) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findAllSvgFiles(filePath, baseDir, fileList, pathAndFileFilter);
    } else if (file.endsWith('.svg')) {
      // Apply path and file filter if provided
      if (pathAndFileFilter) {
        const relativePath = path.relative(baseDir, path.dirname(filePath));
        const fileName = path.basename(filePath, '.svg');
        const shouldInclude = pathAndFileFilter(relativePath, fileName);
        if (!shouldInclude) {
          return; // Skip this file
        }
      }
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function normalizeFileName(fileName) {
  return fileName
    .replace(/^\d+-icon-service-/, '')
    .replace(/_scalable$/, '')
    .replace(/[-_]/g, ' ')  // Combined: replace both - and _ with space
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
    name: 'AWS',
    path: path.join(tempDir, 'aws-icons'),
    getCategoryFromPath: (relativePath) => {
      const parts = relativePath.split(path.sep);
      // Extract category from path like "Architecture-Service-Icons_07312025/Arch_Compute/..."
      if (parts.length > 1) {
        // Return the second-level folder (e.g., "Arch_Compute")
        return parts[1] || null;
      }
      return null;
    },
    // Filter: Exclude Dark, Light, 16/32 size variants, keep only 48/64 colored icons
    pathAndFileFilter: (relativePath, fileName) => {
      const normalizedPath = relativePath.toLowerCase();
      const normalizedFile = fileName.toLowerCase();
      
      // Exclude files with double underscore
      if (normalizedFile.includes('__')) return false;
      
      // Exclude logo files with size suffix
      if (/-logo[_-]\d+$/.test(normalizedFile)) return false;
      
      // Only include Architecture-* folders
      if (!/^architecture-/.test(normalizedPath)) return false;
      
      // Keep only _32 size variants
      if (/_32$/.test(normalizedFile)) return true;

      return false;
    },
    // Rename categories
    categoryRename: (category) => {
      if (!category) return null;
      // Remove prefix and date suffix
      var n = category
                .replace(/^(Arch\-Category_|Res_Amazon\-|Arch[\-_ ])/gi, '')
                .replace(/_\d+\.svg/, '')
                .replace(/[-_]/g, ' ')
                .trim();

      return normalizeTitle(n); 
    },
    // Rename icons
    iconRename: (name) => {
      // Remove prefixes and clean up
      var n = name
                .replace(/^(Arch\-Category_|Res_Amazon\-|Arch[\-_ ])/gi, '')
                .replace(/[ _](16|32|48|64)$/gi, '')
                .replace(/[\-_]/g, ' ')
                .trim();

      return normalizeTitle(n);
    },
  },
  {
    name: 'Microsoft Azure',
    path: path.join(tempDir, 'azure-icons/Azure_Public_Service_Icons/Icons'),
    getCategoryFromPath: (relativePath) => normalizeTitle(path.dirname(relativePath)),
  },
  {
    name: 'Microsoft Entra',
    path: path.join(tempDir, 'entra-icons/Microsoft Entra architecture icons - Oct 2023/Microsoft Entra color icons SVG'),
    getCategoryFromPath: (relativePath) => normalizeTitle(path.dirname(relativePath)),
    // Rename icons
    iconRename: (name) => {
      // Remove prefixes and clean up
      return name
        .replace(/\s?color\sicon\s?/gi, '')
        .trim();
    },
  },
  {
    name: 'Microsoft Fabric',
    path: path.join(tempDir, 'fabric-icons'),
    getCategoryFromPath: (relativePath) => null,
    iconRename: (name) => normalizeTitle(name),
  },
  {
    name: 'Microsoft 365',
    path: path.join(tempDir, 'm365-icons'),
    getCategoryFromPath: (relativePath) => {
      const parts = relativePath.split(path.sep);
      return parts[0] || null;
    },
  },
  {
    name: 'Microsoft Dynamics 365',
    path: path.join(tempDir, 'd365-icons/Dynamics_365_Icons_scalable'),
    getCategoryFromPath: (relativePath) => null,
    iconRename: (name) => normalizeTitle(name),
  },
  {
    name: 'Microsoft Power Platform',
    path: path.join(tempDir, 'powerplatform-icons/Power_Platform_scalable'),
    getCategoryFromPath: (relativePath) => null,
    iconRename: (name) => normalizeTitle(name),
  },
  {
    name: 'CNCF Kubernetes',
    path: path.join(tempDir, 'kubernetes-icons'),
    getCategoryFromPath: (relativePath) => null,
  },
  {
    name: 'GitHub Gilbarbara',
    path: path.join(tempDir, 'gilbarbara-icons/logos'),
    getCategoryFromPath: (relativePath) => null,
    pathAndFileFilter: (relativePath, fileName) => {
      const normalizedFile = fileName.toLowerCase();
      // Exclude aws* files
      if (normalizedFile.startsWith('aws')) return false;

      return true;
    },
  },
  {
    name: 'GitHub Lobe-icons',
    path: path.join(tempDir, 'lobe-icons/packages/static-svg/icons/'),
    getCategoryFromPath: (relativePath) => null,
  },
  {
    name: 'Google Cloud Platform',
    path: path.join(tempDir, 'gcp-icons'),
    getCategoryFromPath: (relativePath) => {
      const parts = relativePath.split(path.sep);
      // Extract category from folder structure
      if (parts.length > 0) {
        return parts[0] || null;
      }

      return null;
    },
    pathAndFileFilter: (relativePath, fileName) => {
      // Only process .svg files (already filtered by findAllSvgFiles)
      return true;
    },
    categoryRename: (category) => {
      if (!category) return null;
      return normalizeTitle(category);
    },
    iconRename: (name) => {
      return name.replace(/(\s(512|rgb|color))*/g, '').trim();
    },
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
  const svgFiles = findAllSvgFiles(source.path, source.path, [], source.pathAndFileFilter);
  
  svgFiles.forEach((filePath) => {
    const relativePath = path.relative(source.path, filePath);
    let category = source.getCategoryFromPath(relativePath);
    const fileName = path.basename(filePath, '.svg');
    let serviceName = normalizeFileName(fileName);
    
    // Apply category rename if provided
    if (source.categoryRename && category) {
      category = source.categoryRename(category);
    }
    
    // Apply icon rename if provided
    if (source.iconRename) {
      serviceName = source.iconRename(serviceName);
    }
    
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
const hash = crypto.createHash('md5').update(iconsDataJs).digest('hex').substring(0, 8);
const iconsDataHashPath = path.join(templatesDir, 'icons-data.hash');
fs.writeFileSync(iconsDataHashPath, hash);
console.log(`  Created: ${iconsDataHashPath} (hash: ${hash})`);

console.log('\nIcon data files generated successfully!');
