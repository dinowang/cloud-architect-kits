import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface Icon {
  id: number;
  name: string;
  source: string;
  category: string;
  file: string;
}

let lastActiveEditor: vscode.TextEditor | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
  // Track the active editor
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      // Only track text editors, not the webview panel
      if (editor && editor.document.uri.scheme === 'file') {
        lastActiveEditor = editor;
      }
    })
  );

  // Register webview view provider for sidebar
  const provider = new IconsViewProvider(context.extensionUri);
  
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'cloudArchitectKits.iconsView',
      provider
    )
  );

  // Keep the command for backward compatibility
  const insertIconCommand = vscode.commands.registerCommand(
    'cloudArchitectKits.insertIcon',
    () => {
      // This command now just focuses the sidebar view
      vscode.commands.executeCommand('cloudArchitectKits.iconsView.focus');
    }
  );

  context.subscriptions.push(insertIconCommand);
}

class IconsViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, 'webview')
      ]
    };

    webviewView.webview.html = getWebviewContent(this._extensionUri, webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async message => {
      switch (message.command) {
        case 'insertIcon':
          await insertIcon(message.icon);
          break;
      }
    });
  }
}

function getWebviewContent(extensionUri: vscode.Uri, webview: vscode.Webview): string {
  const webviewUri = vscode.Uri.joinPath(extensionUri, 'webview');
  
  const htmlPath = vscode.Uri.joinPath(webviewUri, 'ui-base.html').fsPath;
  const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewUri, 'ui-base.css'));
  const jsUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewUri, 'ui-base.js'));
  const iconsDataUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewUri, 'icons-data.js'));

  let html = fs.readFileSync(htmlPath, 'utf-8');

  // Replace PLATFORM_HEAD_PLACEHOLDER
  html = html.replace(
    '<!-- PLATFORM_HEAD_PLACEHOLDER -->',
    `<link rel="stylesheet" href="${cssUri}">
    <style>
      :root {
        --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        --primary-color: #007acc;
        --header-bg: #e8f4fd;
        --hover-bg: #e8f4fd;
      }
      body {
        padding: 12px;
      }
    </style>`
  );

  // Replace SIZE_UNIT_PLACEHOLDER
  html = html.replace('<!-- SIZE_UNIT_PLACEHOLDER -->', 'px');

  // Replace PLATFORM_SCRIPTS_PLACEHOLDER
  html = html.replace(
    '<!-- PLATFORM_SCRIPTS_PLACEHOLDER -->',
    `<script src="${iconsDataUri}"></script>
    <script src="${jsUri}"></script>
    <script>
      const vscode = acquireVsCodeApi();
      
      function handleIconClick(icon) {
        const size = document.getElementById('icon-size').value;
        vscode.postMessage({
          command: 'insertIcon',
          icon: icon,
          size: parseInt(size) || 64
        });
      }
      
      window.addEventListener('DOMContentLoaded', () => {
        initializeIcons();
        setupEventListeners();
      });
    </script>`
  );

  return html;
}

async function insertIcon(iconData: any) {
  // Try to use the active editor first, fallback to last active editor
  let editor = vscode.window.activeTextEditor;
  
  // If current active is the webview, use the last tracked editor
  if (!editor || editor.document.uri.scheme !== 'file') {
    editor = lastActiveEditor;
  }

  if (!editor) {
    vscode.window.showErrorMessage('No text editor found. Please open a file first.');
    return;
  }

  try {
    // The icon SVG is already in base64 format in iconData.svg
    if (!iconData.svg) {
      vscode.window.showErrorMessage(`Icon data not found: ${iconData.file}`);
      return;
    }

    const languageId = editor.document.languageId;
    const position = editor.selection.active;
    let contentToInsert: string;

    // Determine what to insert based on file type
    if (isMarkdownLanguage(languageId)) {
      // Markdown/Marp: Ask user preference - file reference or base64
      const choice = await vscode.window.showQuickPick(
        [
          { label: 'Save as file and reference', value: 'file', description: 'Save SVG to ./assets/ and insert ![](path)' },
          { label: 'Embed as base64', value: 'base64', description: 'Insert as <img> tag with data URI' }
        ],
        { placeHolder: 'How would you like to insert the icon?' }
      );

      if (!choice) {
        return; // User cancelled
      }

      if (choice.value === 'file') {
        // Save SVG file and insert relative path reference with size
        const size = iconData.size || 64;
        const svgContent = Buffer.from(iconData.svg, 'base64').toString('utf-8');
        const dimensions = extractSvgDimensions(svgContent);
        
        const relativePath = await saveSvgFile(editor, iconData);
        if (relativePath) {
          // Determine which dimension to constrain based on aspect ratio
          let sizeLabel = 'width';
          if (dimensions) {
            const aspectRatio = dimensions.width / dimensions.height;
            if (aspectRatio < 1) {
              sizeLabel = 'height';
            }
          }
          
          contentToInsert = `![${sizeLabel}:${size}](${relativePath})`;
        } else {
          return; // Failed to save file
        }
      } else {
        // Embed as base64 with size constraint on longest side
        const size = iconData.size || 64;
        const svgContent = Buffer.from(iconData.svg, 'base64').toString('utf-8');
        const dimensions = extractSvgDimensions(svgContent);
        
        // Determine width/height based on aspect ratio
        let widthAttr = '';
        let heightAttr = '';
        
        if (dimensions) {
          const aspectRatio = dimensions.width / dimensions.height;
          if (aspectRatio >= 1) {
            // Landscape or square: constrain width
            widthAttr = `width="${size}"`;
          } else {
            // Portrait: constrain height
            heightAttr = `height="${size}"`;
          }
        } else {
          // Default to width if dimensions cannot be determined
          widthAttr = `width="${size}"`;
        }
        
        const sizeAttrs = [widthAttr, heightAttr].filter(x => x).join(' ');
        contentToInsert = `<img src="data:image/svg+xml;base64,${iconData.svg}" alt="${iconData.name}" ${sizeAttrs} />`;
      }
    } else if (isMarkupLanguage(languageId)) {
      // HTML/XML: Insert raw SVG with size applied
      let svgContent = Buffer.from(iconData.svg, 'base64').toString('utf-8');
      
      // Apply size if specified
      if (iconData.size && iconData.size !== 64) {
        svgContent = svgContent.replace(
          /<svg([^>]*)>/,
          `<svg$1 width="${iconData.size}" height="${iconData.size}">`
        );
      }
      
      contentToInsert = svgContent;
    } else {
      // Other files: Just insert the icon name
      contentToInsert = iconData.name;
    }

    // Show the editor and insert
    await vscode.window.showTextDocument(editor.document, editor.viewColumn);
    
    await editor.edit(editBuilder => {
      editBuilder.insert(position, contentToInsert);
    });

    vscode.window.showInformationMessage(`Inserted ${iconData.name} icon for ${languageId}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to insert icon: ${error}`);
    console.error(error);
  }
}

async function saveSvgFile(editor: vscode.TextEditor, iconData: any): Promise<string | null> {
  try {
    let svgContent = Buffer.from(iconData.svg, 'base64').toString('utf-8');
    
    // Apply size constraint to longest side if specified
    if (iconData.size && iconData.size !== 64) {
      const dimensions = extractSvgDimensions(svgContent);
      if (dimensions) {
        const aspectRatio = dimensions.width / dimensions.height;
        let newWidth: number;
        let newHeight: number;
        
        if (aspectRatio >= 1) {
          // Landscape or square: constrain width
          newWidth = iconData.size;
          newHeight = iconData.size / aspectRatio;
        } else {
          // Portrait: constrain height
          newHeight = iconData.size;
          newWidth = iconData.size * aspectRatio;
        }
        
        svgContent = svgContent.replace(
          /<svg([^>]*)>/,
          `<svg$1 width="${newWidth}" height="${newHeight}">`
        );
      }
    }
    
    // Get the directory of the current file
    const currentFileUri = editor.document.uri;
    const currentFileDir = path.dirname(currentFileUri.fsPath);
    
    // Create assets directory if it doesn't exist
    const assetsDir = path.join(currentFileDir, 'assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    // Generate filename from icon name (sanitize)
    const sanitizedName = iconData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Add timestamp to avoid conflicts
    const timestamp = Date.now();
    const filename = `${sanitizedName}-${timestamp}.svg`;
    const filePath = path.join(assetsDir, filename);
    
    // Write the SVG file
    fs.writeFileSync(filePath, svgContent, 'utf-8');
    
    // Return relative path
    return `./assets/${filename}`;
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to save SVG file: ${error}`);
    console.error(error);
    return null;
  }
}

function extractSvgDimensions(svgContent: string): { width: number; height: number } | null {
  // Try to extract width and height from SVG tag
  const svgMatch = svgContent.match(/<svg[^>]*>/);
  if (!svgMatch) {
    return null;
  }
  
  const svgTag = svgMatch[0];
  const widthMatch = svgTag.match(/width=["']?(\d+(?:\.\d+)?)/);
  const heightMatch = svgTag.match(/height=["']?(\d+(?:\.\d+)?)/);
  
  if (widthMatch && heightMatch) {
    return {
      width: parseFloat(widthMatch[1]),
      height: parseFloat(heightMatch[1])
    };
  }
  
  // Try to extract from viewBox
  const viewBoxMatch = svgTag.match(/viewBox=["']?[\d\s]+\s+([\d.]+)\s+([\d.]+)/);
  if (viewBoxMatch) {
    return {
      width: parseFloat(viewBoxMatch[1]),
      height: parseFloat(viewBoxMatch[2])
    };
  }
  
  return null;
}

function isMarkdownLanguage(languageId: string): boolean {
  const markdownLanguages = [
    'markdown',
    'marp',
    'mdx',
    'markdown-math',
    'rmd'
  ];
  return markdownLanguages.includes(languageId);
}

function isMarkupLanguage(languageId: string): boolean {
  const markupLanguages = [
    'html',
    'xml',
    'xhtml',
    'svg',
    'vue',
    'svelte',
    'jsx',
    'tsx',
    'javascriptreact',
    'typescriptreact'
  ];
  return markupLanguages.includes(languageId);
}

export function deactivate() {
  // Cleanup if needed
}
