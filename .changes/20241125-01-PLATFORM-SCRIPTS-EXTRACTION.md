# Platform Scripts Extraction

**Date**: 2024-11-25  
**Purpose**: Extract platform-specific scripts from build.js to separate files

## Problem

Previously, platform-specific scripts (like `handleIconClick`) were hardcoded directly in build.js files:

```javascript
// In build.js
html = html.replace(
  '<!-- PLATFORM_SCRIPTS_PLACEHOLDER -->',
  `<script>
  function handleIconClick(icon) {
    // Platform-specific code hardcoded here
    parent.postMessage({ ... });
  }
  </script>`
);
```

**Issues:**
- ❌ Hard to maintain - JavaScript embedded in strings
- ❌ No syntax highlighting or linting
- ❌ Build scripts become cluttered
- ❌ Can't easily test platform scripts independently

## Solution

Extract platform scripts to separate source files that build.js references:

### Figma Plugin
**Created:** `src/figma/plugin/ui-platform.js`
```javascript
function handleIconClick(icon) {
  const size = document.getElementById('icon-size').value;
  parent.postMessage({
    pluginMessage: {
      type: 'insert-icon',
      icon: icon,
      size: parseInt(size) || 64
    }
  }, '*');
}

window.addEventListener('DOMContentLoaded', () => {
  initializeIcons();
  setupEventListeners();
});
```

**Updated build.js:**
```javascript
const uiPlatformJs = fs.readFileSync(path.join(__dirname, 'ui-platform.js'), 'utf-8');

html = html.replace(
  '<!-- PLATFORM_SCRIPTS_PLACEHOLDER -->',
  `<script>${iconsDataContent}</script>
   <script>${uiBaseJs}</script>
   <script>${uiPlatformJs}</script>`
);
```

### PowerPoint Add-in
**Already existed:** `src/powerpoint/add-in/taskpane-platform.js`
- Already properly separated (95 lines)
- Build.js already references it correctly
- No changes needed ✓

### Google Slides Add-on
**Created:** `src/google-slides/addon/SidebarPlatform-source.html`
```html
<script>
function handleIconClick(icon) {
  const size = document.getElementById('icon-size').value;
  google.script.run
    .withSuccessHandler(() => showStatusMessage('Icon inserted!', 'success'))
    .withFailureHandler((error) => showStatusMessage('Failed: ' + error, 'error'))
    .insertIcon(icon, parseInt(size) || 64);
}

function showStatusMessage(message, type = 'success') {
  const statusEl = document.getElementById('status-message');
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.className = 'status-message show ' + type;
    setTimeout(() => statusEl.classList.remove('show'), 3000);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initializeIcons();
  setupEventListeners();
});
</script>
```

**Updated build.js:**
```javascript
const platformSource = fs.readFileSync(
  path.join(__dirname, 'SidebarPlatform-source.html'), 
  'utf-8'
);
fs.writeFileSync(path.join(outDir, 'SidebarPlatform.html'), platformSource);
```

### VSCode Extension
**N/A** - VSCode extension loads resources differently:
- Uses `out/webview/` directory structure
- Platform logic is in TypeScript (`extension.ts`)
- No embedded scripts in HTML

## Benefits

✅ **Cleaner build scripts**: Less code, easier to read  
✅ **Proper syntax highlighting**: IDE support for JavaScript  
✅ **Easier to maintain**: Edit platform code in dedicated files  
✅ **Version control friendly**: Meaningful diffs for platform changes  
✅ **Testable**: Can lint/test platform scripts independently  
✅ **Reusable**: Same pattern across all plugins  

## File Structure

```
src/
├── figma/plugin/
│   ├── ui-platform.js         # ← New platform script
│   ├── build.js               # References ui-platform.js
│   └── out/
│       └── ui.html            # Includes platform script
│
├── powerpoint/add-in/
│   ├── taskpane-platform.js   # ← Already existed
│   ├── build.js               # References taskpane-platform.js
│   └── out/
│       └── taskpane-platform.js
│
├── google-slides/addon/
│   ├── SidebarPlatform-source.html  # ← New platform script
│   ├── build.js                      # References source
│   └── out/
│       └── SidebarPlatform.html     # Copied from source
│
└── vscode/extension/
    ├── src/extension.ts       # Platform logic in TypeScript
    └── out/
        └── extension.js
```

## Build Process

### Before
```javascript
// Hardcoded in build.js
html = html.replace('...', `<script>
  function handleIconClick(icon) {
    // 20+ lines of hardcoded JavaScript
  }
</script>`);
```

### After
```javascript
// Read from source file
const platformJs = fs.readFileSync('ui-platform.js', 'utf-8');
html = html.replace('...', `<script>${platformJs}</script>`);
```

## Testing

All plugins tested and working:

```bash
# Figma
cd src/figma/plugin && npm run build
# ✓ Built: ui.html (25.87 MB)
# ✓ Copied: code.js
# ✓ Copied: manifest.json

# PowerPoint
cd src/powerpoint/add-in && npm run build
# ✓ Built: taskpane.html
# ✓ Copied: taskpane-platform.js

# Google Slides
cd src/google-slides/addon && npm run build
# ✓ Built: Sidebar.html
# ✓ Copied: SidebarPlatform.html
```

## Maintenance

To update platform-specific behavior:

**Before:** Edit build.js, find string, update embedded JavaScript  
**After:** Edit `*-platform.js`, run build

Much simpler and IDE-friendly!

## Conclusion

Platform-specific scripts are now properly separated from build logic. This makes the codebase more maintainable and follows the single responsibility principle: build scripts handle building, platform scripts handle platform logic.
