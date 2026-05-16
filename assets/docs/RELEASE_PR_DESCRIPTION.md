# PR Title

`feat: isolate commercialization release branch`

## Suggested Base / Compare

- Base: `main`
- Compare: `codex/commercialization-release-20260516`

## Summary

This PR isolates the commercialization website release into a clean branch built from the pre-snapshot `main` base.

The release scope includes only changed public/runtime files that materially affect:

- live UX
- routing
- public downloads
- chatbot/runtime behavior
- public shareability assets

It intentionally excludes unrelated personal, research, automation, and prototype work that was present in the original mixed worktree.

## Why This PR Exists

The repo previously had a large mixed worktree containing both the commercialization site work and unrelated local changes.

To avoid losing any work while still producing a clean release candidate:

1. the full dirty worktree was preserved on `codex/snapshot-all-changes-20260516`
2. that snapshot branch was pushed to `origin`
3. this release branch was created from the pre-snapshot `main` base
4. only approved public/runtime files were copied into this branch

This gives us a release candidate that is reviewable and deployable without dragging unrelated changes into production.

## Included In Scope

### Core public pages

- `404.html`
- `about.html`
- `contact.html`
- `index.html`
- `portfolio.html`
- `privacy.html`
- `resume.html`
- `services.html`

### Blog and teaching content

- `blog/index.html`
- `blog/5-ways-gpt4-transforms-business-analytics.html`
- `blog/5-ways-llm-workflows-transform-business-analytics.html`
- `blog/ai-cost-reduction-reality-check.html`
- `blog/ai-vendor-due-diligence-checklist.html`
- `blog/build-vs-buy-ai-decision-matrix.html`
- `blog/customer-service-ai-checklist-before-chatbot.html`
- `blog/deterministic-llm-programming-production-ai.html`
- `blog/enterprise-ai-adoption-commercial-analytics.html`
- `blog/how-to-evaluate-ai-projects-roi.html`
- `blog/pl-attribution-fx-errors-data-analytics.html`
- `blog/power-bi-vs-tableau-2024-comparison.html`
- `blog/reducing-report-volume-95-percent-case-study.html`
- `blog/social-posts.html`

### Portfolio detail pages

- `portfolio/ai-desktop-agent-orchestrator.html`
- `portfolio/ai-memoir-narrative-pipeline.html`
- `portfolio/algorithmic-trading-ai.html`
- `portfolio/multilingual-travel-authorization-saas.html`

### Runtime assets and data

- `css/components.css`
- `css/style.css`
- `js/chatbot.js`
- `js/decision-network.js`
- `js/forms.js`
- `js/main.js`
- `js/portfolio.js`
- `js/social-archive.js`
- `assets/data/projects.json`
- `assets/data/resume.json`
- `assets/data/social-posts.public.json`

### Public downloads and share assets

- `assets/docs/AI-Vendor-Due-Diligence-Checklist-Printable.html`
- `assets/docs/AI-Vendor-Due-Diligence-Checklist.html`
- `assets/docs/AI-Vendor-Due-Diligence-Checklist.md`
- `assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf`
- `assets/docs/Build-vs-Buy-AI-Decision-Matrix-Printable.html`
- `assets/docs/Build-vs-Buy-AI-Decision-Matrix.md`
- `assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf`
- `assets/docs/Jason-Rae-Resume.pdf`
- `assets/images/og-image.svg`

### Routing and release-control docs

- `netlify.toml`
- `sitemap.xml`
- `scripts/build_public_bundle.py`
- `assets/docs/BROWSER_QA_REPORT.md`
- `assets/docs/DEPLOY_SCOPE_MANIFEST.md`
- `assets/docs/RELEASE_SCOPE_AUDIT.md`
- `assets/docs/RELEASE_SMOKE_TEST_REPORT.md`
- `assets/docs/RELEASE_STAGE_COMMANDS.md`
- `assets/docs/TODO.md`
- `assets/docs/WQ24_FINAL_STATUS.md`

## Explicitly Out Of Scope

This PR does not include:

- career and application materials under `Research and Documentation/`
- social automation and operator tooling
- voice backend and phonebot implementation
- broad internal repo-support docs and scripts that do not affect the live website
- local generated artifacts such as `site-dist/`, `tmp/`, `artifacts/`, `.netlify/`, and `__pycache__/`

## Validation Already Completed

### Branch / release control

- Full mixed worktree preserved and pushed on `codex/snapshot-all-changes-20260516`
- Clean release branch created as `codex/commercialization-release-20260516`
- Release-scope docs reconciled and updated
- Workqueue and launch checklist updated so WQ-24 is now closed

### Lightweight technical checks

- JSON parse passed for:
  - `assets/data/projects.json`
  - `assets/data/resume.json`
  - `assets/data/social-posts.public.json`
- `node --check` passed for:
  - `js/chatbot.js`
  - `js/forms.js`
  - `js/main.js`
  - `js/social-archive.js`

### Browser / smoke evidence in repo

- `assets/docs/BROWSER_QA_REPORT.md`
- `assets/docs/RELEASE_SMOKE_TEST_REPORT.md`

## Reviewer Focus

Please review this PR primarily for:

1. release scope correctness
2. homepage / services / contact messaging quality
3. lead magnet download behavior
4. chat and social archive runtime behavior
5. any accidental inclusion or omission in the isolated release branch

## Preview Deploy Gate

Do not merge until the Netlify preview deploy passes the checklist in:

- `assets/docs/PREVIEW_DEPLOY_SMOKE_CHECKLIST.md`

## Known Non-Blocking Follow-Ups

These remain open but are not blockers for merging this static-site release:

- final booking-flow preference
- LinkedIn tracking decision
- physical-device Safari smoke test
- broader phone rollout inputs
- optional further social archive backfill

## Merge Recommendation

Merge this PR if:

- preview deploy succeeds
- the checklist passes on key public paths
- no broken download, routing, or CTA regression is found

Do not merge the snapshot branch. It exists only as a preservation branch for the original mixed worktree.
