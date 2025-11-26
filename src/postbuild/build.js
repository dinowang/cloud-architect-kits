const fs = require('fs');
const path = require('path');

console.log('Building postbuild aggregation...');

const rootDir = path.resolve(__dirname, '../..');
const outDir = path.resolve(__dirname, 'out');

// Create output directory
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Plugin configurations
const plugins = [
  {
    name: 'figma',
    displayName: 'Figma Plugin',
    sourcePath: path.join(rootDir, 'src/figma/plugin/out'),
    description: 'Cloud Architect Kits plugin for Figma design tool'
  },
  {
    name: 'powerpoint',
    displayName: 'PowerPoint Add-in',
    sourcePath: path.join(rootDir, 'src/powerpoint/add-in/out'),
    description: 'Cloud Architect Kits add-in for Microsoft PowerPoint'
  },
  {
    name: 'google-slides',
    displayName: 'Google Slides Add-on',
    sourcePath: path.join(rootDir, 'src/google-slides/addon/out'),
    description: 'Cloud Architect Kits add-on for Google Slides'
  },
  {
    name: 'drawio',
    displayName: 'Draw.io Icon Library',
    sourcePath: path.join(rootDir, 'src/drawio/iconlib/out'),
    description: 'Cloud Architect Kits icon libraries for Draw.io'
  }
];

// Copy plugin outputs
plugins.forEach(plugin => {
  const targetDir = path.join(outDir, plugin.name);
  
  if (fs.existsSync(plugin.sourcePath)) {
    console.log(`Copying ${plugin.displayName}...`);
    fs.cpSync(plugin.sourcePath, targetDir, { recursive: true });
    console.log(`  ✓ Copied to: ${plugin.name}/`);
  } else {
    console.warn(`  ⚠ Source not found: ${plugin.sourcePath}`);
  }
});

// Generate index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cloud Architect Kits - Plugins & Add-ins</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    
    .subtitle {
      font-size: 1.2em;
      opacity: 0.9;
    }
    
    main {
      padding: 40px;
    }
    
    .intro {
      text-align: center;
      margin-bottom: 50px;
      font-size: 1.1em;
      color: #666;
    }
    
    .plugins-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-bottom: 50px;
    }
    
    .plugin-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 30px;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    
    .plugin-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      border-color: #667eea;
    }
    
    .plugin-card h2 {
      color: #667eea;
      margin-bottom: 15px;
      font-size: 1.5em;
    }
    
    .plugin-card p {
      color: #666;
      margin-bottom: 20px;
    }
    
    .plugin-links {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .btn {
      display: inline-block;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .btn-primary {
      background: #667eea;
      color: white;
    }
    
    .btn-primary:hover {
      background: #5568d3;
    }
    
    .btn-secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }
    
    .btn-secondary:hover {
      background: #667eea;
      color: white;
    }
    
    footer {
      background: #f8f9fa;
      padding: 30px 40px;
      text-align: center;
      color: #666;
      border-top: 1px solid #e0e0e0;
    }
    
    .footer-links {
      margin-top: 15px;
    }
    
    .footer-links a {
      color: #667eea;
      text-decoration: none;
      margin: 0 15px;
    }
    
    .footer-links a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      h1 {
        font-size: 2em;
      }
      
      .plugins-grid {
        grid-template-columns: 1fr;
      }
      
      main {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>☁️ Cloud Architect Kits</h1>
      <p class="subtitle">Comprehensive cloud architecture icon collection for multiple platforms</p>
    </header>
    
    <main>
      <div class="intro">
        <p>Access cloud architecture icons across your favorite design and presentation tools.</p>
        <p>Choose your platform below to get started.</p>
      </div>
      
      <div class="plugins-grid">
        ${plugins.map(plugin => `
        <div class="plugin-card">
          <h2>${plugin.displayName}</h2>
          <p>${plugin.description}</p>
          <div class="plugin-links">
            <a href="${plugin.name}/" class="btn btn-primary">Open</a>
            <a href="https://github.com/dinowang/cloud-architect-kits/tree/main/src/${plugin.name}" class="btn btn-secondary" target="_blank">Source</a>
          </div>
        </div>
        `).join('')}
      </div>
      
      <div class="intro">
        <h3 style="margin-bottom: 20px;">Icon Sources</h3>
        <p>Our collection includes icons from AWS, Azure, Google Cloud, Microsoft 365, Kubernetes, and more.</p>
        <p>Total: <strong>4600+</strong> cloud architecture icons</p>
      </div>
    </main>
    
    <footer>
      <p>&copy; ${new Date().getFullYear()} Cloud Architect Kits</p>
      <div class="footer-links">
        <a href="https://github.com/dinowang/cloud-architect-kits" target="_blank">GitHub</a>
        <a href="https://github.com/dinowang/cloud-architect-kits/blob/main/README.md" target="_blank">Documentation</a>
        <a href="https://github.com/dinowang/cloud-architect-kits/releases" target="_blank">Releases</a>
      </div>
    </footer>
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, 'index.html'), indexHtml);
console.log('✓ Generated: index.html');

// Copy assets if exist
const assetsSource = path.join(__dirname, 'assets');
const assetsDest = path.join(outDir, 'assets');
if (fs.existsSync(assetsSource)) {
  fs.cpSync(assetsSource, assetsDest, { recursive: true });
  console.log('✓ Copied: assets/');
}

console.log('\nPostbuild aggregation complete!');
console.log(`Output directory: ${outDir}`);
