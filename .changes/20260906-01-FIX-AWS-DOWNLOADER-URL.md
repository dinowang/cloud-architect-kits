# Fix AWS Architecture Icons downloader (broken CI)

## Context
`Build and Release` CI run #88 failed at the **Download icon sources** step.
`scripts/download-aws-icons.sh` exited 1 with "Could not find Asset Package ZIP URL".
Because it is the first downloader and GitHub Actions runs steps with `set -e`, its
failure aborted the whole step, so the remaining 11 downloaders never executed.

## Root cause
AWS relocated the icon package on https://aws.amazon.com/tw/architecture/icons/.
The ZIP URL path changed:

- Old: `https://d1.awsstatic.com/.../architecture-icons/Icon-package_*.zip`
- New: `https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_*.zip`

The script's regex hard-coded the old `architecture-icons/Icon-package_` path segment,
so it no longer matched.

## Change
`scripts/download-aws-icons.sh`: relaxed the `ZIP_URL` regex to match by the stable
filename prefix `Icon-package_`, independent of the directory path:

```
https://d1\.awsstatic\.com/[^"]*Icon-package_[^"]*\.zip
```

This still excludes the sibling `Microsoft-PPTx-toolkits_*.zip` asset.

## Verification
Ran `scripts/download-aws-icons.sh` locally end-to-end: found the new URL, downloaded
(~14M) and extracted the package successfully (8277 files, 3620 SVGs).

## Scope
Other downloaders were reviewed and are unaffected — they use generic `\.zip` matches,
Microsoft fwlink redirects, or hard-coded/GitHub-based URLs.

## Note
Also migrated prior change records from `.history/` to `.changes/` per repo convention.
