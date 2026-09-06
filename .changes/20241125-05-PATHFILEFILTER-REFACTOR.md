# pathAndFileFilter Refactoring

**Date**: 2024-11-25  
**Purpose**: Refactor pathAndFileFilter to accept two separate parameters

## Overview

Refactored `pathAndFileFilter` function signature from accepting a single `filePath` parameter to accepting two separate parameters: `relativePath` and `fileName`. This provides cleaner separation of concerns and more flexible filtering logic.

## Changes Made

### Function Signature Change

**Before**:
```javascript
pathAndFileFilter: (filePath) => {
  const normalized = filePath.toLowerCase();
  // Filter based on full path
}
```

**After**:
```javascript
pathAndFileFilter: (relativePath, fileName) => {
  const normalizedPath = relativePath.toLowerCase();
  const normalizedFile = fileName.toLowerCase();
  // Filter based on path and filename separately
}
```

### Modified Functions

#### 1. `findAllSvgFiles()` - Parameter Updates

```javascript
// Before
function findAllSvgFiles(dir, fileList = [], pathAndFileFilter = null) {
  // ...
  if (pathAndFileFilter) {
    const shouldInclude = pathAndFileFilter(filePath);
    // ...
  }
}

// After
function findAllSvgFiles(dir, baseDir, fileList = [], pathAndFileFilter = null) {
  // ...
  if (pathAndFileFilter) {
    const relativePath = path.relative(baseDir, path.dirname(filePath));
    const fileName = path.basename(filePath, '.svg');
    const shouldInclude = pathAndFileFilter(relativePath, fileName);
    // ...
  }
}
```

**Key changes**:
- Added `baseDir` parameter to calculate relative paths
- Extract `relativePath` (directory path relative to source base)
- Extract `fileName` (base name without `.svg` extension)
- Pass both to `pathAndFileFilter`

#### 2. Function Call Updates

```javascript
// Before
const svgFiles = findAllSvgFiles(source.path, [], source.pathAndFileFilter);

// After
const svgFiles = findAllSvgFiles(source.path, source.path, [], source.pathAndFileFilter);
```

### Updated Source Configurations

#### AWS Source

**Before**:
```javascript
pathAndFileFilter: (filePath) => {
  const normalized = filePath.toLowerCase();
  if (normalized.includes('__')) return false;
  if (/-logo_\d+\.svg$/.test(normalized)) return false;
  if (!/aws-icons\/architecture-/.test(normalized)) return false;
  if (/_32\.svg$/.test(normalized)) return true;
  return false;
}
```

**After**:
```javascript
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
}
```

**Benefits**:
- ✅ Clearer path vs filename checks
- ✅ More readable regex patterns
- ✅ Easier to understand filter logic
- ✅ Better separation of concerns

#### Gilbarbara Source

**Before**:
```javascript
pathAndFileFilter: (filePath) => {
  const normalized = filePath.toLowerCase();
  if (normalized.includes('/aws\s')) return false;
  return true;
}
```

**After**:
```javascript
pathAndFileFilter: (relativePath, fileName) => {
  const normalizedFile = fileName.toLowerCase();
  // Exclude aws* files
  if (normalizedFile.startsWith('aws')) return false;
  return true;
}
```

**Benefits**:
- ✅ Direct filename check (no path parsing needed)
- ✅ More precise filtering
- ✅ Simpler logic

## Example Usage

### Test Cases

```javascript
const testCases = [
  // [relativePath, fileName] -> result
  ['Architecture-Service-Icons_07312025/Arch_Analytics/32', 'Arch_AWS-Clean-Rooms_32'],  // ✅ Included
  ['Category-Icons_07312025/Arch-Category_32', 'Arch-Category_Containers_32'],           // ❌ Not Architecture-*
  ['Resource-Icons_07312025/Res_IoT', 'Res_AWS-IoT_Thing_32'],                          // ❌ Not Architecture-*
];

// AWS Filter
pathAndFileFilter(
  'Architecture-Service-Icons_07312025/Arch_Analytics/32',
  'Arch_AWS-Clean-Rooms_32'
);
// ✅ Included: Architecture-* folder + _32 suffix

pathAndFileFilter(
  'Category-Icons_07312025/Arch-Category_32',
  'Arch-Category_Containers_32'
);
// ❌ Excluded: Not Architecture-* folder

// Gilbarbara Filter
pathAndFileFilter('', 'aws-lambda');
// ❌ Excluded: Starts with 'aws'

pathAndFileFilter('', 'react');
// ✅ Included: Does not start with 'aws'
```

## Processing Results

### Icon Count by Source

```
Source                  | Icons  | Notes
------------------------|--------|----------------------------------
Microsoft 365           | 963    | No filter
Gilbarbara              | 1,776  | Filtered: excluded AWS icons
Azure                   | 705    | No filter
Lobe-icons              | 723    | No filter
AWS                     | 321    | Filtered: Architecture-* + _32 only
Kubernetes              | 39     | No filter
Dynamics 365            | 38     | No filter
Power Platform          | 9      | No filter
Entra                   | 7      | No filter
------------------------|--------|----------------------------------
Total                   | 4,581  |
```

### AWS Filtering Details

```
Total AWS _32.svg files: 683

Filter rules:
  ✅ Must be in Architecture-* folder
  ✅ Must have _32 suffix
  ❌ Exclude __ double underscore
  ❌ Exclude logo files

Results:
  Included: 321 icons (47%)
  Excluded: 362 icons (53%)
    - Category-Icons folder
    - Resource-Icons folder
    - Architecture-Group-Icons folder
```

### Gilbarbara Filtering Details

```
Original Gilbarbara icons: ~1,839
AWS icons in Gilbarbara: ~63
After filtering: 1,776

Filter rule:
  ❌ Exclude files starting with 'aws'

Result:
  ✅ All AWS duplicates removed
```

## Benefits

### 1. Cleaner Code
- ✅ Separate path and filename logic
- ✅ More readable filter conditions
- ✅ Easier to debug

### 2. Better Flexibility
- ✅ Can filter by directory structure
- ✅ Can filter by filename pattern
- ✅ Can combine both independently

### 3. Improved Maintainability
- ✅ Clear parameter names
- ✅ Self-documenting code
- ✅ Easier to extend

### 4. More Precise Filtering
- ✅ Direct filename checks (no path parsing)
- ✅ Accurate path matching
- ✅ No false positives/negatives

## Migration Guide

For existing or new source configurations:

### Before (old way)
```javascript
{
  name: 'My Source',
  path: '/path/to/icons',
  pathAndFileFilter: (filePath) => {
    // Parse full path to get parts
    const parts = filePath.split('/');
    const file = parts[parts.length - 1];
    const dir = parts[parts.length - 2];
    
    // Check conditions
    if (dir === 'excluded') return false;
    if (file.includes('_old')) return false;
    return true;
  }
}
```

### After (new way)
```javascript
{
  name: 'My Source',
  path: '/path/to/icons',
  pathAndFileFilter: (relativePath, fileName) => {
    // Path is already relative, filename already extracted
    
    // Check conditions
    if (relativePath.includes('excluded')) return false;
    if (fileName.includes('_old')) return false;
    return true;
  }
}
```

## Common Patterns

### Filter by Directory
```javascript
pathAndFileFilter: (relativePath, fileName) => {
  // Include only specific folders
  if (!/^(icons|assets)/.test(relativePath)) return false;
  return true;
}
```

### Filter by Filename Pattern
```javascript
pathAndFileFilter: (relativePath, fileName) => {
  // Exclude test/mock files
  if (fileName.endsWith('-test')) return false;
  if (fileName.endsWith('-mock')) return false;
  return true;
}
```

### Filter by Size Suffix
```javascript
pathAndFileFilter: (relativePath, fileName) => {
  // Keep only 32px and 64px
  if (!/_32$/.test(fileName) && !/_64$/.test(fileName)) return false;
  return true;
}
```

### Combine Path and Filename
```javascript
pathAndFileFilter: (relativePath, fileName) => {
  // Different rules for different folders
  if (relativePath.startsWith('v1')) {
    // v1: keep all sizes
    return true;
  } else if (relativePath.startsWith('v2')) {
    // v2: only keep large icons
    return /_48$|_64$/.test(fileName);
  }
  return false;
}
```

## Backward Compatibility

⚠️ **Breaking Change**

This is a **breaking change** for any custom pathAndFileFilter implementations. All existing filters must be updated to accept two parameters instead of one.

**Migration checklist**:
1. ✅ Update function signature: `(filePath)` → `(relativePath, fileName)`
2. ✅ Replace full path parsing with direct parameter usage
3. ✅ Test filter logic with sample files
4. ✅ Verify icon counts are as expected

## Testing

### Verification Steps

1. **Run process-icons.js**
   ```bash
   cd src/prebuild
   node process-icons.js
   ```

2. **Check icon counts**
   ```bash
   node -e "console.log(require('./icons.json').length)"
   ```

3. **Verify filtering worked**
   ```bash
   # Check AWS icons
   node -e "console.log(require('./icons.json').filter(i => i.source === 'AWS').length)"
   
   # Check Gilbarbara has no AWS
   node -e "console.log(require('./icons.json').filter(i => i.source.includes('Gilbarbara') && i.name.toLowerCase().includes('aws')).length)"
   ```

### Expected Results

```bash
# Total icons
4581

# AWS icons (Architecture-* _32 only)
321

# Gilbarbara with no AWS duplicates
1776

# No AWS icons in Gilbarbara
0
```

## Conclusion

The refactored `pathAndFileFilter` provides:
- **Cleaner separation** of path and filename filtering
- **Better readability** with explicit parameters
- **More flexibility** for complex filtering rules
- **Easier maintenance** with self-documenting code

This change improves the icon processing pipeline and makes it easier to add new sources with custom filtering requirements.
