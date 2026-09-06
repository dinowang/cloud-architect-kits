# GitHub Workflow - Conditional Release

**Date**: 2024-11-24  
**Purpose**: Only create GitHub Release when build output has changes

## Changes Summary

### 1. Added Change Detection Step

New step `Check for changes in dist` that:

1. **Gets latest release tag**
   ```bash
   LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
   ```

2. **Calculates checksums of current build**
   ```bash
   cd dist
   sha256sum * | sort > /tmp/current-checksums.txt
   ```

3. **Downloads previous release assets**
   ```bash
   gh release download $LATEST_TAG --pattern "*.zip" --pattern "*.vsix" --dir /tmp/previous-dist
   ```

4. **Compares checksums**
   ```bash
   diff /tmp/current-checksums.txt /tmp/previous-checksums.txt
   ```

5. **Sets output variable**
   - `has_changes=true` → Create release
   - `has_changes=false` → Skip release

### 2. Conditional Release Creation

```yaml
- name: Create GitHub Release
  if: steps.check_changes.outputs.has_changes == 'true'
  uses: softprops/action-gh-release@v1
```

Only runs when changes are detected.

### 3. Skip Message

```yaml
- name: Skip release message
  if: steps.check_changes.outputs.has_changes != 'true'
  run: |
    echo "No changes detected in build output."
    echo "Skipping release creation."
```

Provides clear feedback when release is skipped.

## Workflow Logic

```
1. Download icon sources
2. Build all plugins to out/
3. Package to dist/
4. Check for changes:
   ├─ No previous release → CREATE RELEASE
   ├─ Checksums identical → SKIP RELEASE
   └─ Checksums different → CREATE RELEASE
5. Upload artifact (always)
6. Create release (conditional)
```

## Benefits

✅ **Avoid duplicate releases**: Don't create release if nothing changed  
✅ **Save resources**: Skip unnecessary release creation  
✅ **Clear feedback**: Show why release was skipped  
✅ **Artifacts always saved**: Build artifacts uploaded regardless  
✅ **Checksum comparison**: Reliable change detection  

## Example Scenarios

### Scenario 1: First Release
```
No previous release found.
→ has_changes=true
→ Create release v202411241200
```

### Scenario 2: No Changes
```
Latest release: v202411241200
Build output checksums: IDENTICAL
→ has_changes=false
→ Skip release, upload artifact only
```

### Scenario 3: Icon Updates
```
Latest release: v202411241200
Build output checksums: DIFFERENT
→ has_changes=true
→ Create release v202411241530
```

### Scenario 4: Code Changes
```
Latest release: v202411241530
VSCode extension size changed: 9.3MB → 9.4MB
→ has_changes=true
→ Create release v202411241800
```

## Testing

Can be tested by:
1. Running workflow twice without changes
2. First run: Creates release
3. Second run: Skips release (checksums identical)

## Artifact Retention

Build artifacts are always uploaded with 30-day retention, regardless of whether a release is created. This allows manual inspection of builds even when no release is published.

## Environment Requirements

- `GH_TOKEN`: Uses `secrets.GITHUB_TOKEN` (automatically available)
- `gh` CLI: Available in GitHub Actions ubuntu-latest runner
