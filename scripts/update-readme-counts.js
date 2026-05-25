#!/usr/bin/env node
// Updates README.md icon counts from prebuild's icons-summary.json

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const summaryPath = path.join(rootDir, 'src/prebuild/icons-summary.json');
const readmePath = path.join(rootDir, 'README.md');

if (!fs.existsSync(summaryPath)) {
  console.error('Error: icons-summary.json not found. Run prebuild first.');
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
const readme = fs.readFileSync(readmePath, 'utf-8');

// Source display names and descriptions
const sourceInfo = {
  'TheSVG':                    { display: 'TheSVG',                    desc: 'Technology and brand SVG icons' },
  'Gilbarbara':                { display: 'Gilbarbara Logos',          desc: 'Technology company logos' },
  'Microsoft 365':             { display: 'Microsoft 365',             desc: 'Office and productivity icons' },
  'Lobe-icons':                { display: 'Lobe Icons',                desc: 'Machine learning icons' },
  'Microsoft Azure':           { display: 'Azure Architecture',        desc: 'Official Azure service icons' },
  'AWS':                       { display: 'AWS Architecture',          desc: 'Official AWS service icons' },
  'Google Cloud Platform':     { display: 'GCP (Google Cloud Platform)', desc: 'Official GCP service icons' },
  'CNCF Kubernetes':           { display: 'Kubernetes',                desc: 'Container orchestration icons' },
  'Microsoft Dynamics 365':    { display: 'Dynamics 365',              desc: 'Business application icons' },
  'Microsoft Fabric':          { display: 'Microsoft Fabric',          desc: 'Data analytics and BI icons' },
  'Microsoft Power Platform':  { display: 'Power Platform',            desc: 'Low-code platform icons' },
  'Microsoft Entra':           { display: 'Microsoft Entra',           desc: 'Identity and access icons' },
};

// Build table rows sorted by count descending
const totalFormatted = summary.total.toLocaleString();
const rows = summary.sources.map(s => {
  const info = sourceInfo[s.name] || { display: s.name, desc: '' };
  return `| **${info.display}** | ${s.count.toLocaleString()} | ${info.desc} |`;
});

const tableSection = `### ${totalFormatted} Professional Icons From:

| Source | Count | Description |
| :----- | ----: | :---------- |
${rows.join('\n')}`;

// Replace content between markers
const startMarker = '<!-- ICON_COUNTS_START -->';
const endMarker = '<!-- ICON_COUNTS_END -->';
const startIdx = readme.indexOf(startMarker);
const endIdx = readme.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Error: ICON_COUNTS markers not found in README.md');
  process.exit(1);
}

const newReadme = readme.substring(0, startIdx + startMarker.length) +
  '\n' + tableSection + '\n' +
  readme.substring(endIdx);

if (newReadme === readme) {
  console.log('README.md is already up to date.');
} else {
  fs.writeFileSync(readmePath, newReadme);
  console.log(`Updated README.md: ${totalFormatted} icons from ${summary.sources.length} sources`);
}
