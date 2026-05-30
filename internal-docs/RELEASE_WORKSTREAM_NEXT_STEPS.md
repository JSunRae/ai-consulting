# Release Workstream Next Steps

Last updated: 2026-05-29

## Goal

Move this workstream from release analysis into a deploy-safe public bundle path.

## Next Steps

### 1. Make the public release boundary executable

Reason:

- the repo already has release guidance, but the build path was still copying broad public directories
- that makes the deploy artifact drift from the reviewed release scope

Addressed:

- `scripts/build_public_bundle.py` now copies an explicit public runtime file set for:
  - root pages
  - blog routes
  - portfolio routes
  - required CSS and JS
  - public data assets

Result:

- the build now follows an explicit route manifest instead of directory-level copying for `blog/`, `css/`, `js/`, and `portfolio/`

### 2. Keep internal and helper docs out of the public-served bundle

Reason:

- the site only links directly to the public lead-magnet PDFs and the resume PDF
- helper `.md`, `.html`, and printable variants under `internal-docs/` create unnecessary exposure in a static deploy

Addressed:

- the public bundle now includes only:
  - `assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf`
  - `assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf`
  - `assets/docs/Jason-Rae-Resume.pdf`

Result:

- internal release docs and helper collateral variants are no longer part of the public bundle path by default

### 3. Validate the bundle path end to end

Reason:

- after tightening the bundle scope, the next check is whether the production-style build still completes and contains the expected public assets

Addressed:

- run the public bundle build
- verify required runtime assets exist in `site-dist`
- confirm internal release-management docs are absent from the output

## Remaining Human Decisions

These are still valid decisions, but they are separate from the executable next steps above:

- whether the release branch should stage the minimal public-site set or the broader commercialization asset set
- whether both LLM workflow article slugs should remain public, or whether one should replace the other canonically
- whether any additional public collateral variants should intentionally stay reachable

## Recommended Immediate Path

Use the tightened public bundle path for deploy validation, then keep branch staging aligned to the minimal public-site release unless a human explicitly approves the broader commercialization asset release.

## Current Status

- explicit public bundle path: `Done`
- internal helper docs excluded from public bundle by default: `Done`
- local bundle validation and CTA normalization follow-up: `Done`
- remaining workstream gate: hosted preview smoke and sign-off using `internal-docs/PREVIEW_DEPLOY_SMOKE_CHECKLIST.md`
