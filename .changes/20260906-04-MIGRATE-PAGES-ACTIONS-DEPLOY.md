# Migrate GitHub Pages deploy to the GitHub Actions method

## Context
After bumping our own workflow actions to Node 24, a Node 20 deprecation warning still
appeared — but in a *different*, GitHub-managed workflow: **"pages build and
deployment"** (`github-pages[bot]`, dynamic). That pipeline runs automatically because
the repo's Pages was in **legacy** mode (deploy from the `gh-pages` branch), and it
uses `actions/upload-artifact@v4` (Node 20) internally, which we cannot edit.

## Change
Switched Pages publishing from the legacy branch method (`peaceiris/actions-gh-pages`)
to the official **GitHub Actions** deployment, eliminating the managed legacy pipeline.

`.github/workflows/build-and-release.yml`:
- Added job permissions `pages: write` and `id-token: write` (kept `contents: write`).
- Added the `github-pages` environment to the `build` job with
  `url: ${{ steps.deployment.outputs.page_url }}`.
- Replaced the `peaceiris/actions-gh-pages@v4` step with:
  - `actions/upload-pages-artifact@v5` (path `./src/postbuild/out`)
  - `actions/deploy-pages@v5` (id `deployment`)
  - Both keep the existing `is_main && has_changes` guards.

Repo setting:
- Flipped Pages `build_type` from `legacy` to `workflow` via
  `gh api -X PUT repos/dinowang/cloud-architect-kits/pages -f build_type=workflow`.

## Verification
- Confirmed runtimes are Node 24: `deploy-pages@v5` = `node24`;
  `upload-pages-artifact@v5` is composite and internally uses
  `actions/upload-artifact@v7` (node24).
- `python3 yaml.safe_load` on the workflow: YAML OK.
- `gh api .../pages` now reports `build_type: workflow`.
- No `peaceiris` / `gh-pages` branch references remain in the workflow.

## Note
The old `gh-pages` branch is now unused for serving; it can be deleted later if desired.
The next main run with changes will deploy via the new pipeline and the legacy
"pages build and deployment" workflow will no longer run.
