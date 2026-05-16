# Goal

Prepare a commercialization release candidate without disturbing unrelated work in the current dirty worktree.

This procedure is documentation-only. Do not use `git add .`, `git commit -a`, `git stash --all`, `git reset --hard`, or any blanket staging command in this repository state.

The current release helper is based on:

- `assets/docs/DEPLOY_SCOPE_MANIFEST.md`
- `assets/docs/RELEASE_SCOPE_AUDIT.md`
- `npm run check:release-scope`
- current `git status --short`
- public-link dependency checks for blog index, lead magnets, and social archive assets

## Recommended Branch Name

Recommended release branch name:

```powershell
release/commercialization-launch-2026-05-12
```

Do not create the branch as part of this procedure unless explicitly authorized.

## Minimal Release Scope

Use this option for the smallest safe public-site release candidate.

Why this scope exists:

- includes the core public pages in the commercialization manifest
- includes only the public-facing assets required to avoid broken links
- excludes internal commercialization collateral, automation, voice backend, portfolio rebuilds, and unrelated content work

Recommended staged file set:

```powershell
$minimalRelease = @(
  'index.html'
  'services.html'
  'contact.html'
  'about.html'
  'resume.html'
  'portfolio.html'
  'privacy.html'
  'blog/index.html'
  'blog/ai-vendor-due-diligence-checklist.html'
  'blog/build-vs-buy-ai-decision-matrix.html'
  'blog/customer-service-ai-checklist-before-chatbot.html'
  'blog/ai-cost-reduction-reality-check.html'
  'blog/social-posts.html'
  'js/main.js'
  'js/forms.js'
  'js/chatbot.js'
  'js/social-archive.js'
  'css/style.css'
  'css/components.css'
  'package.json'
  'netlify.toml'
  'assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf'
  'assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf'
  'assets/data/social-posts.json'
  'assets/data/social-posts.public.json'
  'scripts/build_public_bundle.py'
  'scripts/public_social_archive.py'
  'scripts/repo_preflight.py'
  'sitemap.xml'
)
```

Notes:

- `blog/social-posts.html`, `js/social-archive.js`, `assets/data/social-posts.json`, and `assets/data/social-posts.public.json` are included because `blog/index.html` now links to the social archive and the public page now consumes the published-only export.
- `package.json`, `netlify.toml`, `scripts/build_public_bundle.py`, and `scripts/public_social_archive.py` are included because they enforce the isolated `site-dist` publish surface.
- `robots.txt` is in the deploy manifest but is not currently modified, so it does not need staging for this release candidate.
- the PDF lead magnets are included because the public pages link to them directly

## Full Release Scope

Use this option for the broader commercialization asset release candidate.

Why this scope exists:

- includes the minimal public-site release
- includes the lead magnet source files and printable variants
- includes commercialization operating assets and launch handover materials named in the deploy manifest
- keeps unrelated infrastructure, backend, portfolio, and personal-job-search material out of the release

Recommended staged file set:

```powershell
$fullRelease = $minimalRelease + @(
  'assets/docs/AI-Vendor-Due-Diligence-Checklist.md'
  'assets/docs/AI-Vendor-Due-Diligence-Checklist.html'
  'assets/docs/AI-Vendor-Due-Diligence-Checklist-Printable.html'
  'assets/docs/Build-vs-Buy-AI-Decision-Matrix.md'
  'assets/docs/Build-vs-Buy-AI-Decision-Matrix-Printable.html'
  'assets/docs/CHALLENGER_PROPOSAL_TEMPLATE.md'
  'assets/docs/CHALLENGER_DISCOVERY_CALL_SCRIPT.md'
  'assets/docs/OBJECTION_HANDLING_LIBRARY.md'
  'assets/docs/POST_CALL_SUMMARY_TEMPLATE.md'
  'assets/docs/RECOMMENDATION_MEMO_TEMPLATE.md'
  'assets/docs/CHAT_VOICE_ALIGNMENT_AUDIT.md'
  'assets/docs/CHALLENGER_PAGE_AUDIT.md'
  'assets/docs/BROWSER_QA_REPORT.md'
  'assets/docs/LAUNCH_HARDENING_HANDOVER.md'
  'assets/docs/LEAD_MAGNET_TRACKING_HOOKS.md'
  'assets/data/social-guidance.json'
  'assets/data/social-sources.json'
  'assets/data/voice-intake-playbook.json'
)
```

Do not automatically add other untracked files under `assets/docs/` just because they look launch-related. The current worktree also contains docs for voice, social automation, setup, and internal planning that are not required for this commercialization release candidate.

## Exact Staging Commands

Use PowerShell from the repository root.

Minimal public-site release:

```powershell
git status --short
git diff --name-status -- $minimalRelease
git add -- $minimalRelease
git diff --cached --name-status
```

Full commercialization asset release:

```powershell
git status --short
git diff --name-status -- $fullRelease
git add -- $fullRelease
git diff --cached --name-status
```

Pathspec alternative if you do not want arrays persisted in the shell:

```powershell
git add -- index.html services.html contact.html about.html resume.html portfolio.html privacy.html blog/index.html blog/ai-vendor-due-diligence-checklist.html blog/build-vs-buy-ai-decision-matrix.html blog/customer-service-ai-checklist-before-chatbot.html blog/ai-cost-reduction-reality-check.html blog/social-posts.html js/main.js js/forms.js js/chatbot.js js/social-archive.js css/style.css css/components.css package.json netlify.toml assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf assets/data/social-posts.json assets/data/social-posts.public.json scripts/build_public_bundle.py scripts/public_social_archive.py scripts/repo_preflight.py sitemap.xml
```

Rollback-safe unstage examples if you stage the wrong path:

```powershell
git restore --staged -- blog/social-posts.html
git restore --staged -- js/social-archive.js
git restore --staged -- assets/data/social-posts.json
git restore --staged -- assets/data/social-posts.public.json
git restore --staged -- $minimalRelease
```

These commands only modify the index. They do not discard worktree changes.

## Verification Commands

Run this sequence after staging and before any commit:

```powershell
git diff --cached --name-status
git diff --cached --stat
git diff --cached --check
git commit --dry-run
npm run verify
```

Before staging in a dirty worktree, run:

```powershell
npm run check:release-scope
```

If you want a local production-style render check, run:

```powershell
npx serve . -l 4173
```

Then manually verify these URLs in a browser:

```text
http://127.0.0.1:4173/
http://127.0.0.1:4173/services.html
http://127.0.0.1:4173/contact.html
http://127.0.0.1:4173/blog/
http://127.0.0.1:4173/blog/ai-vendor-due-diligence-checklist.html
http://127.0.0.1:4173/blog/build-vs-buy-ai-decision-matrix.html
http://127.0.0.1:4173/blog/customer-service-ai-checklist-before-chatbot.html
http://127.0.0.1:4173/blog/ai-cost-reduction-reality-check.html
http://127.0.0.1:4173/blog/social-posts.html
```

Recommended rollback-safe review sequence in a dirty worktree:

```powershell
git status --short
git diff --name-status -- $minimalRelease
git add -- $minimalRelease
git diff --cached --name-status
git diff --cached -- <one-path-you-want-to-review>
git restore --staged -- <one-path-you-do-not-want>
git diff --cached --name-status
```

If using the full scope, replace `$minimalRelease` with `$fullRelease` in the same sequence.

## Do Not Stage

Keep these paths out of the commercialization release candidate unless you intentionally split a separate infrastructure or content branch.

Observed unrelated or higher-risk paths from current `git status --short`:

- repository meta and instructions
  - `.github/copilot-instructions.md`
  - `.gitignore`
  - `README.md`
  - `LINK_AUDIT.md`
- unrelated public pages and content backlog
  - `404.html`
  - `blog/5-ways-gpt4-transforms-business-analytics.html`
  - `blog/deterministic-llm-programming-production-ai.html`
  - `blog/enterprise-ai-adoption-commercial-analytics.html`
  - `blog/how-to-evaluate-ai-projects-roi.html`
  - `blog/pl-attribution-fx-errors-data-analytics.html`
  - `blog/power-bi-vs-tableau-2024-comparison.html`
  - `blog/reducing-report-volume-95-percent-case-study.html`
- portfolio rebuild and generator work
  - `assets/data/projects.json`
  - `assets/data/resume.json`
  - `generate_portfolio_pages.py`
  - `portfolio/ai-desktop-agent-orchestrator.html`
  - `portfolio/ai-memoir-narrative-pipeline.html`
  - `portfolio/algorithmic-trading-ai.html`
  - `portfolio/multilingual-travel-authorization-saas.html`
  - `js/portfolio.js`
- infrastructure, automation, and backend work
  - `.env.example`
  - `.github/workflows/`
  - `.netlify/`
  - `netlify/`
  - `netlify.toml`
  - `package.json`
  - `package-lock.json`
  - `requirements-dev.txt`
  - `phonebot/`
  - `scripts/`
  - `js/decision-network.js`
- internal planning, applications, and research
  - `03-Challenger-Audit-Core-Pages-Handover.md`
  - `Research and Documentation/`
  - `ai_analytics_affiliation_application_status_20260510.md`
  - `ai_analytics_institutional_affiliation_plan_for_jason_20260510.json`
  - `ai_analytics_institutional_affiliation_plan_for_jason_20260510.md`
  - `assets/docs/applications/checkmk-head-of-data-analytics-cover-letter.md`
- internal or optional docs not required for this release candidate
  - `assets/docs/AGENT_LEDGER.md`
  - `assets/docs/BRAND_INTELLIGENCE_BRIEF.md`
  - `assets/docs/SETUP_GUIDE.md`
  - `assets/docs/TODO.md`
  - `assets/docs/CHALLENGER_LINKEDIN_LAUNCH_PLAN.md`
  - `assets/docs/Customer-Service-AI-Checklist.md`
  - `assets/docs/DEPLOY_AND_AUTOMATION_RUNBOOK.md`
  - `assets/docs/GERMAN_LOCALIZATION_ROADMAP.md`
  - `assets/docs/OFFER_OPERATING_PLAYBOOK.md`
  - `assets/docs/REPO_FINISH_PROMPTS.md`
  - `assets/docs/SOCIAL_AUTOMATION_IMPLEMENTATION_BRIEF.md`
  - `assets/docs/SOCIAL_CONTENT_OPERATING_PLAN.md`
  - `assets/docs/TWILIO_OPENAI_SIP_PHASE1_PLAN.md`
  - `assets/docs/VOICE_CALL_AGENT_IMPLEMENTATION_BRIEF.md`
  - `assets/docs/VOICE_CALL_OPERATING_PLAYBOOK.md`
  - `assets/docs/VOICE_CALL_TEST_PLAN.md`
  - `assets/docs/RELEASE_STAGE_COMMANDS.md`

The last item is deliberate: this helper file is useful operationally, but it sits under a public-served path. Leave it out of the site release candidate unless you explicitly want it published.

## Risks

- The requested file `assets/docs/RELEASE_SCOPE_AUDIT.md` is missing. If that file exists outside the current workspace, reconcile this procedure against it before cutting a release branch.
- `blog/index.html` now introduces a social archive dependency. If you stage `blog/index.html` without `blog/social-posts.html`, `js/social-archive.js`, and `assets/data/social-posts.public.json`, you risk a broken public link or a non-functional archive page.
- If you stage public-page changes without `netlify.toml`, `package.json`, and the bundle scripts, you risk falling back to repo-root publishing and re-exposing internal docs or source files.
- Lead magnet links on `index.html`, `services.html`, and blog pages point to the PDF assets. Omitting those PDFs from the staged set will create broken downloads.
- `npm run verify` now covers preflight, build, Python compile, JavaScript syntax, and automated voice-summary tests. Treat any error as release-blocking and review warnings before commit.
- This repository contains unrelated modified and untracked files across automation, portfolio generation, personal applications, and internal docs. A blanket add will contaminate the release candidate.
- Several internal docs live under `assets/docs/`, which is a public-served directory on a static host. Be intentional about which docs you publish.
