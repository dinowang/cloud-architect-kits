# Harden icon downloaders against transient network resets

## Context
`Build and Release` failed at the **Download icon sources** step with:

```
[2/4] Checking Power Platform icons...
Downloading...
curl: (35) Recv failure: Connection reset by peer
Error: Process completed with exit code 35.
```

Earlier sources (AWS, Azure, M365, D365, Entra) downloaded fine — the AWS URL fix
worked. This failure is a transient TLS/connection reset from `download.microsoft.com`
mid-transfer, not a code defect. Because Actions runs the step with `set -e`, one
transient reset aborts the whole release.

## Change
Added retry/backoff to every ZIP-download curl across the downloader scripts:

```
--retry 5 --retry-delay 3 --retry-connrefused --retry-all-errors
```

Files touched (download-transfer curl only; probe/`-sI` calls left as-is):
- download-aws-icons.sh
- download-azure-icons.sh
- download-entra-icons.sh
- download-fabric-icons.sh
- download-d365-icons.sh
- download-m365-icons.sh
- download-powerplatform-icons.sh
- download-gcp-icons.sh (both category + core downloads)

`--retry-all-errors` (curl >= 7.71.0) ensures curl also retries hard transfer errors
like (35). GitHub runners ship curl 8.x, so the flags are supported.

## Verification
- `curl --version` = 8.22.0 locally (runner has 8.x).
- Re-ran `download-powerplatform-icons.sh` locally end-to-end: downloaded and extracted
  successfully.

## Note
This is a transient-failure mitigation; the specific run can also simply be re-run.
