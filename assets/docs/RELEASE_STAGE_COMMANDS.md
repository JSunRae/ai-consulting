# Release Stage Commands

Last updated: 2026-05-16

## Goal

Record the non-destructive branch strategy used to preserve all local work and isolate the commercialization release candidate.

## Actual Branch Strategy

### 1. Preserve the full local state

```powershell
git switch -c codex/snapshot-all-changes-20260516
git add -A
git commit -m "chore: snapshot all current local changes before release isolation"
git push -u origin codex/snapshot-all-changes-20260516
```

Outcome:

- all meaningful tracked and unignored local work was committed
- the snapshot branch was pushed to `origin`
- unrelated work is recoverable independently of the release branch

### 2. Create the clean release branch from the pre-snapshot base

```powershell
git switch -c codex/commercialization-release-20260516 c96ededc0421f8246c4c789c7f2f0d6d3527f495
```

### 3. Copy only the approved release files from the snapshot branch

Use the branch-local manifest in:

- `assets/docs/DEPLOY_SCOPE_MANIFEST.md`

The actual branch was populated by checking out only the approved public/runtime and release-control files from:

- `codex/snapshot-all-changes-20260516`

## Verification Commands

Run these from `C:\Users\Pilot\Documents\Vs Code Projects\AI_Consulting`:

```powershell
git branch --show-current
git status --short --untracked-files=all
```

Expected interpretation:

- current branch should be `codex/commercialization-release-20260516`
- tracked changes should reflect only the release branch scope
- unrelated local artifacts may still exist as untracked files, but they are not part of the release candidate
- historical preflight evidence was recorded before isolation on the broader snapshot branch; the release branch intentionally omits internal automation-only helper scripts

## Do Not Stage

Do not stage:

- `site-dist/`
- `tmp/`
- `artifacts/`
- `__pycache__/`
- career or application material under `Research and Documentation/`
- voice backend and phonebot files
- social automation/operator tooling not included in the release manifest

## Release Interpretation

This document no longer describes a hypothetical staging flow. It records the safer branch-based isolation path that was actually chosen and executed.
