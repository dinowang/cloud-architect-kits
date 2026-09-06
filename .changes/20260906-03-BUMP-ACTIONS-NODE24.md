# Bump GitHub Actions to Node 24 runtime versions

## Context
The `Build and Release` workflow emitted a deprecation annotation:

> Node.js 20 is deprecated. The following actions target Node.js 20 but are being
> forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4,
> actions/upload-artifact@v4, peaceiris/actions-gh-pages@v3,
> softprops/action-gh-release@v1.

Node 20 becomes fully unsupported on GitHub-hosted runners in late 2026, so the pinned
action majors need to move to versions whose `action.yml` declares `using: node24`.

## Change
`.github/workflows/build-and-release.yml` — bumped all five action refs:

| Action                        | Before | After |
| ----------------------------- | ------ | ----- |
| actions/checkout              | v4     | v5    |
| actions/setup-node            | v4     | v5    |
| actions/upload-artifact       | v4     | v7    |
| peaceiris/actions-gh-pages    | v3     | v4    |
| softprops/action-gh-release   | v1     | v3    |

## Verification
- Confirmed each target tag's `action.yml` declares `runs.using: node24` by fetching
  the raw files (checkout/setup-node/upload-artifact v5, peaceiris v4 / v4.1.0,
  softprops v3 / v3.0.3). Note: upload-artifact **v5 is still node20**; v6/v7 are
  node24, so v7 (latest, v7.0.1) was chosen.
- Confirmed the existing `with:` inputs remain compatible:
  - upload-artifact@v7: name / path / retention-days
  - peaceiris@v4: github_token / publish_dir / publish_branch / force_orphan
  - softprops@v3: tag_name / name / body_path / files / draft / prerelease
- `python3 -c "yaml.safe_load(...)"` on the workflow: YAML OK.
