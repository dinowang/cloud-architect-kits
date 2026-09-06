# Documentation Update

**Date**: 2024-11-25  
**Purpose**: Update all README.md and INSTALL.md files to reflect current build system and features

## Updated Files

### Root Documentation

1. **`INSTALL.md`** (New comprehensive installation guide)
   - Installation instructions for all 5 plugins
   - Troubleshooting section
   - Platform-specific requirements
   - Links to detailed plugin docs

### Plugin Documentation

2. **`src/figma/INSTALL.md`**
   - Updated with `out/` directory structure
   - Installation from release package
   - Build from source instructions
   - File structure diagram
   - Development workflow

3. **`src/vscode/INSTALL.md`**
   - Complete installation guide
   - Smart insertion behavior explanation
   - Markdown file reference vs embed options
   - Aspect ratio aware sizing
   - Troubleshooting section
   - Development workflow

## Key Updates

### Build System Changes

All documentation now reflects:
- ✅ Build to `out/` directories
- ✅ Package from `out/` to `dist/`
- ✅ All `out/` directories are gitignored
- ✅ Separate platform scripts (`*-platform.js`)

### Feature Documentation

#### Figma Plugin
- 4,334+ icons from 9 sources
- Visual browser with 48x48 previews
- Size control: 16-512px
- One-click insertion

#### PowerPoint Add-in
- Web-based Office Add-in
- SVG insertion with size control
- Azure Static Web Apps deployment
- Centered placement

#### Google Slides Add-on
- Apps Script add-on
- Sidebar UI
- Size adjustment: 16-512pt
- Server-side insertion

#### Draw.io Libraries
- 9 XML library files
- Organized by source
- Drag-and-drop icons
- 4,334+ icons total

#### VS Code Extension
- **Smart insertion**:
  - Markdown: Choose file reference or base64
  - HTML/XML: Raw SVG
  - Other: Icon name
- **Aspect ratio aware**:
  - Landscape: constrain width
  - Portrait: constrain height
- **File reference format**:
  - `![width:64](./assets/icon.svg)`
  - `![height:64](./assets/icon.svg)`

### Installation Methods

Each plugin now documents:
1. **Install from release package** (recommended)
2. **Build from source** (for developers)
3. **Development mode** (for contributors)

### Troubleshooting

Added common issues and solutions:
- Plugin doesn't appear
- Icons not loading
- Build failures
- Permission issues
- Platform-specific problems

## File Locations

```
.
├── README.md                      # Main project readme (already good)
├── INSTALL.md                     # ✅ Updated - Installation index
├── src/
│   ├── figma/
│   │   ├── README.md             # Plugin features
│   │   └── INSTALL.md            # ✅ Updated - Installation guide
│   ├── powerpoint/
│   │   ├── README.md             # Add-in features
│   │   └── INSTALL.md            # Installation guide
│   ├── google-slides/
│   │   ├── README.md             # Add-on features
│   │   └── INSTALL.md            # Installation guide
│   ├── drawio/
│   │   ├── README.md             # Library features
│   │   └── INSTALL.md            # Installation guide
│   ├── vscode/
│   │   ├── README.md             # Extension features  
│   │   └── INSTALL.md            # ✅ Updated - Installation guide
│   └── prebuild/
│       └── README.md             # Prebuild system docs
└── scripts/
    └── README.md                  # Build scripts docs
```

## Documentation Structure

Each plugin's INSTALL.md follows consistent structure:

1. **Prerequisites** - Requirements and dependencies
2. **Installation Steps** - Step-by-step guide
   - Option 1: Install from release
   - Option 2: Build from source
3. **Usage** - How to use the plugin
4. **Features** - What the plugin can do
5. **Troubleshooting** - Common issues
6. **File Structure** - Directory layout
7. **Development** - For contributors
8. **Support** - Where to get help

## Benefits

✅ **Consistency**: All plugins follow same documentation pattern  
✅ **Completeness**: Every plugin has installation guide  
✅ **Accuracy**: Reflects current build system (November 2024)  
✅ **Usability**: Clear step-by-step instructions  
✅ **Maintainability**: Easy to update when features change  

## Next Steps

Future documentation improvements:
- [ ] Add video tutorials
- [ ] Create troubleshooting FAQ
- [ ] Add architecture diagrams
- [ ] Document CI/CD workflow
- [ ] Create contributor guide

## Conclusion

All documentation has been updated to accurately reflect:
- Current build system with `out/` directories
- Latest features (smart insertion, aspect ratio, etc.)
- Platform-specific scripts separation
- Consistent installation patterns

Users can now confidently install and use any plugin following the updated guides.
