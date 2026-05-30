# Release Scope Audit

Last updated: 2026-05-28

## Current Branch Context

- Branch under audit: `codex/commercialization-release-20260516`
- Audit basis:
  - `git rev-parse HEAD`
  - `git diff --name-status main...HEAD`
  - `python scripts/repo_preflight.py`
  - `npm run check:preflight`
  - `internal-docs/DEPLOY_SCOPE_MANIFEST.md`
  - `internal-docs/RELEASE_STAGE_COMMANDS.md`
  - `internal-docs/PREVIEW_DEPLOY_SMOKE_CHECKLIST.md`
- Branch head at refresh time: `7258edd8c560648929669d1c49ad9b3ab1438fcb`

## Next Steps For This Workstream

The next steps are release-control checks, not feature work.

1. Reconfirm the branch still passes the technical release gates.
2. Reconfirm the branch diff against `main` is still coherent release scope.
3. Reconfirm the public social archive is safe for public release.
4. Keep release-control docs aligned with the live branch state.
5. Treat preview deploy validation as the final merge gate.

## Status Of Those Next Steps

1. Technical release gates rechecked: `Done`

- `python scripts/repo_preflight.py` passed on 2026-05-28.
- `npm run check:preflight` passed on 2026-05-28.

1. Branch diff rechecked: `Done`

- `git diff --name-status main...HEAD` still shows a coherent website-release branch.
- The branch diff remains concentrated in public pages, runtime assets, published-safe social archive files, release-control docs, and build-path files.

1. Public social archive rechecked: `Done`

- `assets/data/social-posts.public.json` contains published entries only.
- No `draft`, `queue`, `ready`, or `scheduled` statuses appear in the public archive payload.
- `assets/data/social-posts.json` remains internal operating state and is outside the public release scope.

1. Release-control docs refreshed: `Done`

- `internal-docs/DEPLOY_SCOPE_MANIFEST.md` now reflects the branch-isolated control state.
- `internal-docs/RELEASE_STAGE_COMMANDS.md` remains the pathspec source of truth for staging the branch payload.

1. Final merge gate identified: `Done`

- `internal-docs/PREVIEW_DEPLOY_SMOKE_CHECKLIST.md` is the remaining merge gate.
- This is now an external validation step, not a repo-scope investigation step.

## Current Judgment

The workstream has moved from repo-hygiene cleanup into release-candidate control.

That means:

- the release branch is already the isolation mechanism
- the public social archive is no longer a blocker on this branch because it ships from a published-safe payload
- the remaining gate is preview deploy validation, not further triage of unrelated repo files

## Branch Release Scope Summary

Current release-branch payload includes:

- core public pages:
  - `404.html`
  - `index.html`
  - `services.html`
  - `contact.html`
  - `about.html`
  - `resume.html`
  - `portfolio.html`
  - `privacy.html`
- blog and teaching pages:
  - `blog/index.html`
  - `blog/5-ways-gpt4-transforms-business-analytics.html` (legacy redirect shim to `blog/5-ways-llm-workflows-transform-business-analytics.html`)
  - `blog/5-ways-llm-workflows-transform-business-analytics.html`
  - `blog/deterministic-llm-programming-production-ai.html`
  - `blog/enterprise-ai-adoption-commercial-analytics.html`
  - `blog/how-to-evaluate-ai-projects-roi.html`
  - `blog/pl-attribution-fx-errors-data-analytics.html`
  - `blog/power-bi-vs-tableau-2024-comparison.html`
  - `blog/reducing-report-volume-95-percent-case-study.html`
  - `blog/ai-vendor-due-diligence-checklist.html`
  - `blog/build-vs-buy-ai-decision-matrix.html`
  - `blog/customer-service-ai-checklist-before-chatbot.html`
  - `blog/ai-cost-reduction-reality-check.html`
  - `blog/social-posts.html`
- public runtime assets:
  - `css/style.css`
  - `css/components.css`
  - `js/main.js`
  - `js/forms.js`
  - `js/chatbot.js`
  - `js/decision-network.js`
  - `js/portfolio.js`
  - `js/social-archive.js`
  - `assets/data/projects.json`
  - `assets/data/resume.json`
  - `assets/data/social-posts.public.json`
  - `assets/images/og-image.svg`
- public collateral:
  - `assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf`
  - `assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf`
  - `assets/docs/Jason-Rae-Resume.pdf`
- portfolio case-study pages:
  - `portfolio/ai-desktop-agent-orchestrator.html`
  - `portfolio/ai-memoir-narrative-pipeline.html`
  - `portfolio/algorithmic-trading-ai.html`
  - `portfolio/multilingual-travel-authorization-saas.html`
- release/runtime support:
  - `netlify.toml`
  - `scripts/build_public_bundle.py`
  - `sitemap.xml`

Notes:

- The old GPT-4 blog slug now exists only as a redirect-preservation route; the canonical article URL is `blog/5-ways-llm-workflows-transform-business-analytics.html`.
- The build path only publishes the three PDF files under `internal-docs/`; helper HTML, Markdown, and release-control docs are not public-runtime critical.

## Explicitly Out Of Scope For This Workstream

Keep these outside the WQ-24 website release branch scope:

- internal social state:
  - `assets/data/social-posts.json`
- voice and phone rollout:
  - `phonebot/`
  - `netlify/functions/`
  - `assets/data/voice-intake-playbook.json`
- broader automation and ops tracks:
  - `.github/workflows/`
  - `.env.example`
  - most files under `scripts/` other than `scripts/build_public_bundle.py`
- career, research, and application materials:
  - `Research and Documentation/`
  - `internal-docs/applications/`
  - affiliation-planning files

## Recommended Operator Action

Use the branch-specific pathspec flow in `internal-docs/RELEASE_STAGE_COMMANDS.md`.

Do not reopen WQ-24 by expanding into voice, internal social automation state, or unrelated job-search materials.

The correct remaining action is:

1. deploy the branch preview
2. run `internal-docs/PREVIEW_DEPLOY_SMOKE_CHECKLIST.md`
3. merge only if that checklist passes
