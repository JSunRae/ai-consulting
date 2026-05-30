# Goal

Prepare or review the isolated commercialization release branch without disturbing unrelated local work.

This procedure is documentation-only. Do not use `git add .`, `git commit -a`, `git stash --all`, `git reset --hard`, or any blanket staging command.

This file now assumes the controlling release surface is the dedicated branch:

- branch: `codex/commercialization-release-20260516`
- base: `main`
- release audit: `internal-docs/RELEASE_SCOPE_AUDIT.md`
- manifest: `internal-docs/DEPLOY_SCOPE_MANIFEST.md`

## Branch Context

The release branch already exists. Do not create a replacement branch as part of this procedure.

Use this file to:

- inspect the isolated branch scope
- stage the intended release set precisely if needed
- re-check the index before commit or PR review

## Branch Release Scope

Use this scope for the current isolated release candidate.

Why this scope exists:

- it matches the branch diff against `main`
- it includes the public/runtime files intentionally isolated for the release branch
- it excludes unrelated career, research, operator, phone, and automation work still present elsewhere in the repo

Recommended staged file set:

```powershell
$releaseScope = @(
  '404.html'
  'index.html'
  'services.html'
  'contact.html'
  'about.html'
  'resume.html'
  'portfolio.html'
  'privacy.html'
  'blog/index.html'
  'blog/5-ways-gpt4-transforms-business-analytics.html'
  'blog/5-ways-llm-workflows-transform-business-analytics.html'
  'blog/deterministic-llm-programming-production-ai.html'
  'blog/enterprise-ai-adoption-commercial-analytics.html'
  'blog/how-to-evaluate-ai-projects-roi.html'
  'blog/pl-attribution-fx-errors-data-analytics.html'
  'blog/power-bi-vs-tableau-2024-comparison.html'
  'blog/reducing-report-volume-95-percent-case-study.html'
  'blog/ai-vendor-due-diligence-checklist.html'
  'blog/build-vs-buy-ai-decision-matrix.html'
  'blog/customer-service-ai-checklist-before-chatbot.html'
  'blog/ai-cost-reduction-reality-check.html'
  'blog/social-posts.html'
  'js/main.js'
  'js/forms.js'
  'js/chatbot.js'
  'js/decision-network.js'
  'js/portfolio.js'
  'js/social-archive.js'
  'css/style.css'
  'css/components.css'
  'assets/data/projects.json'
  'assets/data/resume.json'
  'assets/data/social-posts.public.json'
  'assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf'
  'assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf'
  'assets/docs/Jason-Rae-Resume.pdf'
  'assets/images/og-image.svg'
  'portfolio/ai-desktop-agent-orchestrator.html'
  'portfolio/ai-memoir-narrative-pipeline.html'
  'portfolio/algorithmic-trading-ai.html'
  'portfolio/multilingual-travel-authorization-saas.html'
  'netlify.toml'
  'scripts/build_public_bundle.py'
  'sitemap.xml'
)

$releaseSupportDocs = @(
  'internal-docs/DEPLOY_SCOPE_MANIFEST.md'
  'internal-docs/PREVIEW_DEPLOY_SMOKE_CHECKLIST.md'
  'internal-docs/RELEASE_PR_DESCRIPTION.md'
  'internal-docs/RELEASE_SCOPE_AUDIT.md'
  'internal-docs/RELEASE_STAGE_COMMANDS.md'
)
```

Notes:

- `blog/social-posts.html`, `js/social-archive.js`, and `assets/data/social-posts.public.json` are intentionally included because the branch now serves a published-safe social archive.
- `scripts/build_public_bundle.py` and `netlify.toml` are included because the branch’s release flow expects the built public bundle path.
- `blog/5-ways-gpt4-transforms-business-analytics.html` is intentionally retained as a redirect-preservation route. The canonical article path is `blog/5-ways-llm-workflows-transform-business-analytics.html`.
- Only the three PDF downloads under `internal-docs/` are runtime-critical. Printable HTML, Markdown source, and release-control docs should stay out of the minimal public stage set.
- `robots.txt` is not modified relative to `main`, so it is not part of the current stage list.

## Exact Staging Commands

Use PowerShell from the repository root.

Review the current isolated scope:

```powershell
git status --short
git diff --name-status main...HEAD
git diff --name-status -- $releaseScope
```

Stage the current release scope precisely:

```powershell
git add -- $releaseScope
git diff --cached --name-status
```

If you want the review-support docs in the same PR without treating them as public runtime, stage them separately:

```powershell
git add -- $releaseSupportDocs
git diff --cached --name-status
```

Pathspec alternative if you do not want arrays persisted in the shell:

```powershell
git add -- 404.html index.html services.html contact.html about.html resume.html portfolio.html privacy.html blog/index.html blog/5-ways-gpt4-transforms-business-analytics.html blog/5-ways-llm-workflows-transform-business-analytics.html blog/deterministic-llm-programming-production-ai.html blog/enterprise-ai-adoption-commercial-analytics.html blog/how-to-evaluate-ai-projects-roi.html blog/pl-attribution-fx-errors-data-analytics.html blog/power-bi-vs-tableau-2024-comparison.html blog/reducing-report-volume-95-percent-case-study.html blog/ai-vendor-due-diligence-checklist.html blog/build-vs-buy-ai-decision-matrix.html blog/customer-service-ai-checklist-before-chatbot.html blog/ai-cost-reduction-reality-check.html blog/social-posts.html js/main.js js/forms.js js/chatbot.js js/decision-network.js js/portfolio.js js/social-archive.js css/style.css css/components.css assets/data/projects.json assets/data/resume.json assets/data/social-posts.public.json assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf assets/docs/Jason-Rae-Resume.pdf assets/images/og-image.svg portfolio/ai-desktop-agent-orchestrator.html portfolio/ai-memoir-narrative-pipeline.html portfolio/algorithmic-trading-ai.html portfolio/multilingual-travel-authorization-saas.html netlify.toml scripts/build_public_bundle.py sitemap.xml
```

Optional review-support docs:

```powershell
git add -- internal-docs/DEPLOY_SCOPE_MANIFEST.md internal-docs/PREVIEW_DEPLOY_SMOKE_CHECKLIST.md internal-docs/RELEASE_PR_DESCRIPTION.md internal-docs/RELEASE_SCOPE_AUDIT.md internal-docs/RELEASE_STAGE_COMMANDS.md
```

Rollback-safe unstage examples if you stage the wrong path:

```powershell
git restore --staged -- blog/social-posts.html
git restore --staged -- js/social-archive.js
git restore --staged -- assets/data/social-posts.public.json
git restore --staged -- $releaseScope
```

These commands only modify the index. They do not discard worktree changes.

## Verification Commands

Run this sequence after staging and before any commit:

```powershell
git diff --cached --name-status
git diff --cached --stat
git diff --cached --check
git commit --dry-run
npm run check:preflight
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
git diff --name-status -- $releaseScope
git add -- $releaseScope
git diff --cached --name-status
git diff --cached -- <one-path-you-want-to-review>
git restore --staged -- <one-path-you-do-not-want>
git diff --cached --name-status
```

## Do Not Stage

Keep these paths out of the commercialization release candidate unless you intentionally split a separate infrastructure or content branch.

Observed unrelated or higher-risk paths from current `git status --short`:

- repository meta and instructions
  - `.github/copilot-instructions.md`
  - `.gitignore`
  - `README.md`
  - `LINK_AUDIT.md`
- infrastructure, automation, and backend work
  - `.env.example`
  - `.github/workflows/`
  - `.netlify/`
  - `netlify/`
  - `package.json`
  - `package-lock.json`
  - `requirements-dev.txt`
  - `phonebot/`
  - `scripts/`
- internal planning, applications, and research
  - `03-Challenger-Audit-Core-Pages-Handover.md`
  - `Research and Documentation/`
  - `ai_analytics_affiliation_application_status_20260510.md`
  - `ai_analytics_institutional_affiliation_plan_for_jason_20260510.json`
  - `ai_analytics_institutional_affiliation_plan_for_jason_20260510.md`
  - `internal-docs/applications/checkmk-head-of-data-analytics-cover-letter.md`
- internal or optional docs not required for this release candidate
  - `internal-docs/AGENT_LEDGER.md`
  - `internal-docs/BRAND_INTELLIGENCE_BRIEF.md`
  - `internal-docs/SETUP_GUIDE.md`
  - `internal-docs/TODO.md`
  - `internal-docs/CHALLENGER_LINKEDIN_LAUNCH_PLAN.md`
  - `internal-docs/Customer-Service-AI-Checklist.md`
  - `internal-docs/DEPLOY_AND_AUTOMATION_RUNBOOK.md`
  - `internal-docs/GERMAN_LOCALIZATION_ROADMAP.md`
  - `internal-docs/OFFER_OPERATING_PLAYBOOK.md`
  - `internal-docs/REPO_FINISH_PROMPTS.md`
  - `internal-docs/SOCIAL_AUTOMATION_IMPLEMENTATION_BRIEF.md`
  - `internal-docs/SOCIAL_CONTENT_OPERATING_PLAN.md`
  - `internal-docs/TWILIO_OPENAI_SIP_PHASE1_PLAN.md`
  - `internal-docs/VOICE_CALL_AGENT_IMPLEMENTATION_BRIEF.md`
  - `internal-docs/VOICE_CALL_OPERATING_PLAYBOOK.md`
  - `internal-docs/VOICE_CALL_TEST_PLAN.md`
  - `internal-docs/RELEASE_STAGE_COMMANDS.md`

## Current Next Steps

1. Keep the release branch diff aligned with `main` using `git diff --name-status main...HEAD` as the control check.
2. Use `npm run check:preflight` before any PR update or deploy handoff.
3. Treat `internal-docs/PREVIEW_DEPLOY_SMOKE_CHECKLIST.md` as the final merge gate after preview deploy is live.

The last item is deliberate: this helper file is useful operationally, but it sits under a public-served path. Leave it out of the site release candidate unless you explicitly want it published.

## Risks

- `blog/index.html` now introduces a social archive dependency. If you stage `blog/index.html` without `blog/social-posts.html`, `js/social-archive.js`, and `assets/data/social-posts.public.json`, you risk a broken public link or a non-functional archive page.
- Lead magnet links on `index.html`, `services.html`, and blog pages point to the PDF assets. Omitting those PDFs from the staged set will create broken downloads.
- `about.html` now depends on `assets/images/jason-profile-photo.jpg`. Omitting the image will create a broken public portrait.
- `npm run check:preflight` scans for stale copy and key string expectations. Treat any error as release-blocking and review warnings before commit.
- This repository contains unrelated modified and untracked files across automation, portfolio generation, personal applications, and internal docs. A blanket add will contaminate the release candidate.
- Several internal docs live under `internal-docs/`, which is a public-served directory on a static host. Be intentional about which docs you publish.
