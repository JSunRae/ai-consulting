# Deploy Scope Manifest

Last updated: 2026-05-16

## Scope Basis

- Base commit for release isolation: `c96ededc0421f8246c4c789c7f2f0d6d3527f495`
- Safety snapshot branch preserving the full dirty worktree: `codex/snapshot-all-changes-20260516`
- Isolated release branch: `codex/commercialization-release-20260516`
- Release principle approved by owner:
  - include all changed public/runtime files that materially affect live UX, routing, or shareability
  - preserve unrelated work separately rather than mixing it into the release branch

## Release Model

This branch is the operational isolation for WQ-24.

- Unrelated tracked work was preserved on the snapshot branch and pushed to `origin`.
- The release branch was created from the pre-snapshot base commit.
- Only the approved public/runtime files and the release-control evidence files were brought onto this branch.
- Local untracked artifacts such as `site-dist/`, `tmp/`, `artifacts/`, and `__pycache__/` are not part of the release scope and must not be staged.

## Included Release Scope

### Core pages

- `404.html`
- `about.html`
- `contact.html`
- `index.html`
- `portfolio.html`
- `privacy.html`
- `resume.html`
- `services.html`

### Blog and content routes

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

### Front-end runtime assets

- `css/components.css`
- `css/style.css`
- `js/chatbot.js`
- `js/decision-network.js`
- `js/forms.js`
- `js/main.js`
- `js/portfolio.js`
- `js/social-archive.js`

### Public runtime data

- `assets/data/projects.json`
- `assets/data/resume.json`
- `assets/data/social-posts.public.json`

### Public downloadable and share assets

- `assets/docs/AI-Vendor-Due-Diligence-Checklist-Printable.html`
- `assets/docs/AI-Vendor-Due-Diligence-Checklist.html`
- `assets/docs/AI-Vendor-Due-Diligence-Checklist.md`
- `assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf`
- `assets/docs/Build-vs-Buy-AI-Decision-Matrix-Printable.html`
- `assets/docs/Build-vs-Buy-AI-Decision-Matrix.md`
- `assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf`
- `assets/docs/Jason-Rae-Resume.pdf`
- `assets/images/og-image.svg`

### Routing and deploy control

- `netlify.toml`
- `sitemap.xml`

### Release evidence and control docs

- `assets/docs/BROWSER_QA_REPORT.md`
- `assets/docs/RELEASE_SCOPE_AUDIT.md`
- `assets/docs/RELEASE_SMOKE_TEST_REPORT.md`
- `assets/docs/RELEASE_STAGE_COMMANDS.md`
- `assets/docs/WQ24_FINAL_STATUS.md`
- `assets/docs/TODO.md`

## Explicit Exclusions

Do not include these classes of files in this release branch:

- career and job-application material under `Research and Documentation/`
- social automation and operator tooling
- voice backend and phonebot implementation files
- repo support files that do not affect the live site runtime
- local generated artifacts and caches
- any file not explicitly copied onto `codex/commercialization-release-20260516`

## Resolved Scope Decisions

- `404.html`: included because it is public-facing and changed.
- `assets/data/projects.json`: included because portfolio pages and chatbot runtime depend on it.
- `assets/data/resume.json`: included because resume content and chatbot runtime depend on it.
- `assets/docs/Jason-Rae-Resume.pdf`: included because it is linked from `index.html` and `resume.html`.
- `assets/images/og-image.svg`: included because it affects public shareability and brand presentation.
- `blog/social-posts.html` and `js/social-archive.js`: included because `blog/index.html` links to the archive.
- `assets/data/social-posts.public.json`: included because the public archive reads this file directly.

## Non-Blocking Launch Inputs

These items remain operational or post-launch concerns, but they do not block the static-site commercialization release branch:

- final booking-flow preference
- LinkedIn tracking decision
- physical-device Safari smoke test
- broader phone rollout inputs

They should remain tracked, but they do not reopen WQ-24.
