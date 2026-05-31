#!/usr/bin/env node
// Generates release notes by diffing current icons.json vs previous icons-manifest.json
// Usage: node generate-release-notes.js [--previous <path>] [--output <path>]

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(name);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const rootDir = path.resolve(__dirname, '..');
const currentPath = path.join(rootDir, 'src/prebuild/icons.json');
const previousPath = getArg('--previous') || path.join(rootDir, '/tmp/prev-icons-manifest.json');
const outputPath = getArg('--output') || path.join(rootDir, 'src/prebuild/release-notes.md');
const MAX_ITEMS = 10;

if (!fs.existsSync(currentPath)) {
  console.error('Error: current icons.json not found. Run prebuild first.');
  process.exit(1);
}

const current = JSON.parse(fs.readFileSync(currentPath, 'utf-8'));

// Build lookup: key = "source::name"
function buildIndex(icons) {
  const map = new Map();
  icons.forEach(icon => map.set(`${icon.source}::${icon.name}`, icon));
  return map;
}

// Get all unique sources
function getSources(icons) {
  const sources = new Set();
  icons.forEach(icon => sources.add(icon.source));
  return [...sources].sort();
}

// Format icon list with truncation
function formatList(prefix, items) {
  if (items.length === 0) return [];
  const shown = items.slice(0, MAX_ITEMS);
  const lines = shown.map(name => `  ${prefix} ${name}`);
  if (items.length > MAX_ITEMS) {
    lines.push(`  ${prefix} ...and ${items.length - MAX_ITEMS} more`);
  }
  return lines;
}

// --- No previous manifest: first release ---
if (!fs.existsSync(previousPath)) {
  console.log('No previous manifest found — generating first-release notes.');

  const sourceCounts = {};
  current.forEach(icon => {
    sourceCounts[icon.source] = (sourceCounts[icon.source] || 0) + 1;
  });

  const lines = [
    `## Cloud Architect Kits - Release \${RELEASE_TAG}`,
    '',
    `### 🎉 First Release — ${current.length.toLocaleString()} Icons`,
    '',
    '| Source | Icons |',
    '| :----- | ----: |',
  ];

  Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([source, count]) => {
      lines.push(`| ${source} | ${count.toLocaleString()} |`);
    });

  lines.push('', '### Packages Included', '');
  lines.push(...packagesList());

  const md = lines.join('\n');
  fs.writeFileSync(outputPath, md);
  console.log(`Generated first-release notes: ${outputPath}`);
  process.exit(0);
}

// --- Diff mode ---
const previous = JSON.parse(fs.readFileSync(previousPath, 'utf-8'));
const currentIndex = buildIndex(current);
const previousIndex = buildIndex(previous);

const allSources = new Set([...getSources(current), ...getSources(previous)]);
const sortedSources = [...allSources].sort();

const totalPrev = previous.length;
const totalCurr = current.length;
const totalAdded = totalCurr - totalPrev;

const changeBlocks = [];
let hasAnyChanges = false;

sortedSources.forEach(source => {
  const prevIcons = previous.filter(i => i.source === source);
  const currIcons = current.filter(i => i.source === source);
  const prevNames = new Set(prevIcons.map(i => i.name));
  const currNames = new Set(currIcons.map(i => i.name));

  const added = [...currNames].filter(n => !prevNames.has(n)).sort();
  const removed = [...prevNames].filter(n => !currNames.has(n)).sort();

  if (added.length === 0 && removed.length === 0) return;
  hasAnyChanges = true;

  const parts = [];
  if (added.length > 0) parts.push(`+${added.length}`);
  if (removed.length > 0) parts.push(`-${removed.length}`);

  const block = [`**${source}** (${parts.join(', ')})`];
  block.push(...formatList('+', added));
  block.push(...formatList('-', removed));

  changeBlocks.push(block.join('\n'));
});

// Build final markdown
const lines = [
  `## Cloud Architect Kits - Release \${RELEASE_TAG}`,
  '',
];

if (hasAnyChanges) {
  const sign = totalAdded >= 0 ? '+' : '';
  lines.push(
    `### 📦 Icon Changes (${totalPrev.toLocaleString()} → ${totalCurr.toLocaleString()}, ${sign}${totalAdded.toLocaleString()})`,
    '',
  );
  changeBlocks.forEach(block => {
    lines.push(block, '');
  });
} else {
  lines.push(
    `### 📦 ${totalCurr.toLocaleString()} Icons (no icon changes)`,
    '',
  );
}

lines.push('### Packages Included', '');
lines.push(...packagesList());

const md = lines.join('\n');
fs.writeFileSync(outputPath, md);
console.log(`Generated release notes: ${outputPath}`);
if (hasAnyChanges) {
  console.log(`  Changes: ${totalPrev} → ${totalCurr} icons`);
} else {
  console.log('  No icon changes detected.');
}

function packagesList() {
  return [
    '- **Figma Plugin**: `cloud-architect-kits-figma-plugin.zip`',
    '- **PowerPoint Add-in**: `cloud-architect-kits-powerpoint-addin.zip`',
    '- **Google Slides Add-on**: `cloud-architect-kits-google-slides-addon.zip`',
    '- **Draw.io Icon Libraries**: `cloud-architect-kits-drawio-iconlib.zip`',
    '- **VSCode Extension**: `cloud-architect-kits-vscode-extension-1.0.0.vsix`',
    '',
    '### Installation Instructions',
    '',
    'See README.md for detailed installation instructions for each platform.',
  ];
}
