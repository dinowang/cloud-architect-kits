# AWS Icons Download Script

**Date**: 2024-11-25  
**Purpose**: Add AWS Architecture Icons download script

## Overview

Created a new download script for AWS Architecture Icons to expand icon coverage beyond Microsoft ecosystem.

## Implementation

### Script: `scripts/download-aws-icons.sh`

**Features:**
- ✅ Automatic URL detection from AWS website
- ✅ Dynamic ZIP filename handling
- ✅ Cache mechanism to avoid re-downloads
- ✅ Progress bar for download
- ✅ Extraction with file count
- ✅ Comprehensive error handling

### How It Works

1. **Fetch Download Page**
   ```bash
   PAGE_URL="https://aws.amazon.com/tw/architecture/icons/"
   PAGE_CONTENT=$(curl -sL "$PAGE_URL")
   ```

2. **Extract ZIP URL**
   - Pattern: `https://d1.awsstatic.com/.../Asset-Package_*.zip`
   - Example: `Asset-Package_07312025.49d3aab7f9e6131e51ade8f7c6c8b961ee7d3bb1.zip`
   - AWS includes build date and hash in filename

3. **Check Cache**
   ```bash
   CACHE_FILE="$TEMP_DIR/.aws-icons-cache"
   # Compare current URL with cached URL
   # Skip download if identical and files exist
   ```

4. **Download & Extract**
   ```bash
   curl -L --progress-bar -o "$ZIP_FILE" "$ZIP_URL"
   unzip -q "$ZIP_FILE" -d "$EXTRACT_DIR"
   ```

5. **Save Cache**
   ```bash
   echo "$ZIP_URL" > "$CACHE_FILE"
   ```

## Download Results

**Package Information:**
- **Source**: AWS Official Architecture Icons
- **URL Pattern**: `Asset-Package_MMDDYYYY.{hash}.zip`
- **Size**: ~15 MB
- **Total Files**: 8,454 files
- **SVG Icons**: 3,712 icons
- **Location**: `temp/aws-icons/`

**Icon Categories:**
```
aws-icons/
├── Architecture-Group-Icons_07312025/    # Service group icons
├── Architecture-Service-Icons_07312025/  # Individual service icons
├── Category-Icons_07312025/              # Category icons
└── Resource-Icons_07312025/              # Resource-level icons
    ├── Res_IoT/
    ├── Res_Compute/
    ├── Res_Storage/
    └── ... (many categories)
```

## Cache Mechanism

**First Run:**
```bash
./scripts/download-aws-icons.sh
# Downloads ZIP, extracts, saves cache
```

**Subsequent Runs:**
```bash
./scripts/download-aws-icons.sh
# Checks cache, finds match
# ✓ AWS icons already up to date
# Skipping download.
```

**Force Re-download:**
```bash
rm temp/.aws-icons-cache
./scripts/download-aws-icons.sh
```

## Integration

### Updated `build-and-release.sh`

Added AWS download step:
```bash
echo "--- Downloading AWS icons..."
"$SCRIPT_DIR/download-aws-icons.sh"
echo ""

echo "--- Downloading Azure icons..."
"$SCRIPT_DIR/download-azure-icons.sh"
# ...
```

### Updated GitHub Workflow

Added AWS download to CI/CD:
```yaml
- name: Download icon sources
  run: |
    ./scripts/download-aws-icons.sh      # ← New
    ./scripts/download-azure-icons.sh
    ./scripts/download-m365-icons.sh
    # ...
```

## Icon Coverage Summary

With AWS icons added, total coverage:

| Source | Icons | Status |
|--------|-------|--------|
| **AWS** | **3,712** | **✅ New** |
| Azure | 705 | ✅ |
| Microsoft 365 | 963 | ✅ |
| Dynamics 365 | 38 | ✅ |
| Entra | 7 | ✅ |
| Power Platform | 9 | ✅ |
| Fabric | 11 | ✅ |
| Kubernetes | 39 | ✅ |
| Gilbarbara | 1,839 | ✅ |
| Lobe Icons | 723 | ✅ |
| **Total** | **~8,046+** | **✅** |

## Next Steps

To use AWS icons in plugins:

1. **Update prebuild configuration** (`src/prebuild/process-icons.js`):
   ```javascript
   {
     name: 'aws',
     displayName: 'AWS',
     path: 'temp/aws-icons',
     patterns: [
       'Architecture-Service-Icons_*/**/*.svg',
       'Resource-Icons_*/**/*.svg'
     ]
   }
   ```

2. **Rebuild icons**:
   ```bash
   cd src/prebuild
   npm run build
   ```

3. **Rebuild plugins**:
   ```bash
   ./scripts/build-and-release.sh
   ```

## Script Features

### Error Handling
- ✅ Checks if ZIP URL found
- ✅ Verifies download completed
- ✅ Validates extraction succeeded
- ✅ Clear error messages

### User Experience
- 📊 Progress bar for download
- 📦 Shows package filename
- 📂 Shows extraction location
- 📈 Shows file counts
- 💡 Helpful next steps

### Performance
- 🚀 Skips download if cached
- ⚡ Only extracts if needed
- 💾 Efficient caching strategy
- 🔄 Easy cache invalidation

## Example Output

**First Run:**
```
==========================================
Downloading AWS Architecture Icons
==========================================

🔍 Fetching download page...
🔍 Looking for Asset Package ZIP...
✓ Found: https://d1.awsstatic.com/.../Asset-Package_07312025.*.zip
📦 Package: Asset-Package_07312025.49d3aab7f9e6131e51ade8f7c6c8b961ee7d3bb1.zip

📥 Downloading AWS Architecture Icons...
   From: https://d1.awsstatic.com/.../Asset-Package_07312025.*.zip
   To: /path/to/temp/aws-icons.zip

################################################# 100.0%
✓ Downloaded:  15M

📂 Extracting to: /path/to/temp/aws-icons
✓ Extracted: 8454 files (3712 SVGs)

==========================================
✅ AWS Architecture Icons downloaded
==========================================

📦 Package: Asset-Package_07312025.49d3aab7f9e6131e51ade8f7c6c8b961ee7d3bb1.zip
📂 Location: /path/to/temp/aws-icons
📊 Files: 8454 total, 3712 SVGs

Next steps:
  1. Update prebuild configuration if needed
  2. Run: cd src/prebuild && npm run build
==========================================
```

**Cached Run:**
```
==========================================
Downloading AWS Architecture Icons
==========================================

🔍 Fetching download page...
🔍 Looking for Asset Package ZIP...
✓ Found: https://d1.awsstatic.com/.../Asset-Package_07312025.*.zip
📦 Package: Asset-Package_07312025.49d3aab7f9e6131e51ade8f7c6c8b961ee7d3bb1.zip

✓ AWS icons already up to date
  Cached: Asset-Package_07312025.49d3aab7f9e6131e51ade8f7c6c8b961ee7d3bb1.zip
  Skipping download.

To force re-download, run:
  rm /path/to/temp/.aws-icons-cache
==========================================
```

## Benefits

✅ **AWS Coverage**: 3,712 professional AWS service icons  
✅ **Automatic Updates**: Detects new versions automatically  
✅ **Efficient**: Caching prevents unnecessary downloads  
✅ **Reliable**: Official AWS source  
✅ **Complete**: All service categories included  
✅ **CI/CD Ready**: Integrated into build workflow  

## Conclusion

The AWS icons download script successfully adds comprehensive AWS architecture icon support to Cloud Architect Kits, bringing total icon coverage to over 8,000 icons across multiple cloud platforms and technology providers.
