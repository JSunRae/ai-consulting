# Deploy Scope Manifest

Last updated: 2026-05-12

## Scope Basis

- Basis used for this manifest: actual `git status --short` in `C:\Users\Pilot\Documents\Vs Code Projects\AI_Consulting` on 2026-05-12.
- `assets/docs/RELEASE_SCOPE_AUDIT.md` is not present in the repo.
- This file supersedes the earlier directional manifest. It is now an exact staging guide for WQ-24.

## What Changed Since The Previous Manifest

The prior manifest was too directional for release use.

- It named files that are not currently dirty, for example `robots.txt`.
- It missed dirty public files that now matter to release control, including `404.html`, portfolio detail pages, `assets/images/og-image.svg`, the social-archive surface, and several blog pages.
- It did not separate internal operating docs, automation tooling, local-state files, and unrelated personal/application materials.
- It was not safe enough for another agent to stage from without re-checking the whole worktree.

## Current Dirty Worktree Classification

Use the exact buckets below. Do not bulk-stage the repo root.

### Must-Stage

These are the safest public-site files to stage for a minimal commercialization release that avoids unrelated repo noise.

- `404.html`
- `about.html`
- `contact.html`
- `index.html`
- `portfolio.html`
- `privacy.html`
- `resume.html`
- `services.html`
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
- `css/components.css`
- `css/style.css`
- `js/chatbot.js`
- `js/decision-network.js`
- `js/forms.js`
- `js/main.js`
- `js/portfolio.js`
- `assets/data/projects.json`
- `assets/data/resume.json`
- `assets/docs/AI-Vendor-Due-Diligence-Checklist-Printable.html`
- `assets/docs/AI-Vendor-Due-Diligence-Checklist.html`
- `assets/docs/AI-Vendor-Due-Diligence-Checklist.md`
- `assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf`
- `assets/docs/Build-vs-Buy-AI-Decision-Matrix-Printable.html`
- `assets/docs/Build-vs-Buy-AI-Decision-Matrix.md`
- `assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf`
- `assets/docs/Jason-Rae-Resume.pdf`
- `assets/images/og-image.svg`
- `netlify.toml`

### Optional-But-Related

These files are related to the commercialization pass, but they are not required for the safe minimal public release above.

Operational and repo-support files:

- `.gitignore`
- `LINK_AUDIT.md`
- `README.md`
- `generate_portfolio_pages.py`
- `package.json`
- `package-lock.json`
- `requirements-dev.txt`

Internal commercialization docs and handover assets:

- `assets/docs/AGENT_LEDGER.md`
- `assets/docs/BRAND_INTELLIGENCE_BRIEF.md`
- `assets/docs/BROWSER_QA_REPORT.md`
- `assets/docs/CHALLENGER_DISCOVERY_CALL_SCRIPT.md`
- `assets/docs/CHALLENGER_LINKEDIN_LAUNCH_PLAN.md`
- `assets/docs/CHALLENGER_PAGE_AUDIT.md`
- `assets/docs/CHALLENGER_PROPOSAL_TEMPLATE.md`
- `assets/docs/CHAT_VOICE_ALIGNMENT_AUDIT.md`
- `assets/docs/Customer-Service-AI-Checklist.md`
- `assets/docs/DEPLOY_AND_AUTOMATION_RUNBOOK.md`
- `assets/docs/GERMAN_LOCALIZATION_ROADMAP.md`
- `assets/docs/LAUNCH_HARDENING_HANDOVER.md`
- `assets/docs/LEAD_MAGNET_TRACKING_HOOKS.md`
- `assets/docs/OBJECTION_HANDLING_LIBRARY.md`
- `assets/docs/OFFER_OPERATING_PLAYBOOK.md`
- `assets/docs/POST_CALL_SUMMARY_TEMPLATE.md`
- `assets/docs/RECOMMENDATION_MEMO_TEMPLATE.md`
- `assets/docs/REPO_FINISH_PROMPTS.md`
- `assets/docs/SETUP_GUIDE.md`
- `assets/docs/SOCIAL_AUTOMATION_IMPLEMENTATION_BRIEF.md`
- `assets/docs/SOCIAL_CONTENT_OPERATING_PLAN.md`
- `assets/docs/TWILIO_OPENAI_SIP_PHASE1_PLAN.md`
- `assets/docs/VOICE_CALL_AGENT_IMPLEMENTATION_BRIEF.md`
- `assets/docs/VOICE_CALL_OPERATING_PLAYBOOK.md`
- `assets/docs/VOICE_CALL_TEST_PLAN.md`

Automation and operator tooling:

- `.env.example`
- `.github/workflows/social-draft.yml`
- `.github/workflows/social-publish.yml`
- `assets/data/social-channels.example.json`
- `assets/data/social-guidance.json`
- `assets/data/social-history-template.csv`
- `assets/data/social-sources.json`
- `scripts/extract_linkedin_saved_activity.py`
- `scripts/generate_social_content_batch.py`
- `scripts/import_linkedin_activity_markdown.py`
- `scripts/import_linkedin_public_activity_json.py`
- `scripts/repo_preflight.py`
- `scripts/social_archive_admin.py`
- `scripts/social_archive_import.py`
- `scripts/social_buffer_publish.py`
- `scripts/social_draft_pipeline.py`

### Do-Not-Stage

These files are unrelated, local-state, scratch, or clearly outside the current commercialization release scope.

- `.github/copilot-instructions.md`
- `.netlify/state.json`
- `03-Challenger-Audit-Core-Pages-Handover.md`
- `Research and Documentation/`
- `ai_analytics_affiliation_application_status_20260510.md`
- `ai_analytics_institutional_affiliation_plan_for_jason_20260510.json`
- `ai_analytics_institutional_affiliation_plan_for_jason_20260510.md`
- `assets/docs/TODO.md`
- `assets/docs/applications/checkmk-head-of-data-analytics-cover-letter.md`
- `scripts/__pycache__/`
- `scripts/generate_job_application_docs.py`

### Needs Human Decision Before Release

These are not safe to auto-stage because they change what becomes publicly reachable or they introduce deploy-surface and operational behavior that may not be intended for this release.

Public social-archive feature set:

- `blog/index.html`
- `blog/social-posts.html`
- `js/social-archive.js`
- `assets/data/social-posts.json`
- `assets/data/social-posts.public.json`
- `sitemap.xml`

Reason:

- `assets/data/social-posts.json` remains the internal operational state store and still contains `ready`, `queue`, and `draft` records.
- `assets/data/social-posts.public.json` is the public projection and must remain limited to published-safe records.
- `blog/social-posts.html` and `js/social-archive.js` must read the public projection only.
- `blog/index.html` and `sitemap.xml` now surface that page publicly.
- Release this set only with the isolated `site-dist` bundle flow in place. Do not bypass the build step or publish the repo root directly.

Voice and phone intake surface:

- `assets/data/voice-intake-playbook.json`
- `netlify/functions/_shared/voice-agent.mjs`
- `netlify/functions/voice-incoming.mjs`
- `netlify/functions/voice-summary.mjs`
- `phonebot/.env.example`
- `phonebot/README.md`
- `phonebot/openai-connector.js`
- `phonebot/server.js`

Reason:

- These files create or document a voice/phone workflow surface that is operational, environment-dependent, and not required for the safe minimal site release.
- They are commercialization-related, but they are not part of the default public deploy scope.

## Commercialization-Related But Internal-Only

Treat the following as internal-only unless the user explicitly wants repo history, operator docs, and automation assets included in the release branch.

- All files under `assets/docs/` listed in `Optional-But-Related`, except the public-facing lead magnet and resume assets listed in `Must-Stage`
- `.env.example`
- `.github/workflows/social-draft.yml`
- `.github/workflows/social-publish.yml`
- `assets/data/social-channels.example.json`
- `assets/data/social-guidance.json`
- `assets/data/social-history-template.csv`
- `assets/data/social-sources.json`
- All staged-safe script files listed in `Optional-But-Related`
- All voice and phone files listed under `Needs Human Decision Before Release`

These files support commercialization operations, QA, content systems, sales process, or future automation. They are not required to put the public site live.

## Exact Release Recommendation

### Safe Minimal Release Scope

Default recommendation for WQ-24.

- Stage only `Must-Stage`.
- Do not stage anything in `Do-Not-Stage`.
- Leave all `Needs Human Decision Before Release` files out of the release until explicitly approved.

PowerShell staging command:

```powershell
git add -- `
  404.html `
  about.html `
  contact.html `
  index.html `
  portfolio.html `
  privacy.html `
  resume.html `
  services.html `
  blog/5-ways-gpt4-transforms-business-analytics.html `
  blog/5-ways-llm-workflows-transform-business-analytics.html `
  blog/ai-cost-reduction-reality-check.html `
  blog/ai-vendor-due-diligence-checklist.html `
  blog/build-vs-buy-ai-decision-matrix.html `
  blog/customer-service-ai-checklist-before-chatbot.html `
  blog/deterministic-llm-programming-production-ai.html `
  blog/enterprise-ai-adoption-commercial-analytics.html `
  blog/how-to-evaluate-ai-projects-roi.html `
  blog/pl-attribution-fx-errors-data-analytics.html `
  blog/power-bi-vs-tableau-2024-comparison.html `
  blog/reducing-report-volume-95-percent-case-study.html `
  css/components.css `
  css/style.css `
  js/chatbot.js `
  js/decision-network.js `
  js/forms.js `
  js/main.js `
  js/portfolio.js `
  assets/data/projects.json `
  assets/data/resume.json `
  assets/docs/AI-Vendor-Due-Diligence-Checklist-Printable.html `
  assets/docs/AI-Vendor-Due-Diligence-Checklist.html `
  assets/docs/AI-Vendor-Due-Diligence-Checklist.md `
  assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf `
  assets/docs/Build-vs-Buy-AI-Decision-Matrix-Printable.html `
  assets/docs/Build-vs-Buy-AI-Decision-Matrix.md `
  assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf `
  assets/docs/Jason-Rae-Resume.pdf `
  assets/images/og-image.svg `
  netlify.toml
```

### Fuller Release Scope If Docs And Operational Assets Are Wanted

Use this only if the user wants internal provenance, QA evidence, repo tooling, and commercialization operations versioned in the same release branch.

- Stage everything in `Must-Stage`.
- Add files from `Optional-But-Related`.
- Keep `Do-Not-Stage` excluded.
- Keep `Needs Human Decision Before Release` excluded until explicitly approved.

This is the correct choice if the goal is not just a public-site deploy, but also a fuller repo-state handover of commercialization operations.

## Final Judgment

- WQ-24 status: manifest is now exact enough for intentional staging.
- Safe default: `Must-Stage` only.
- Biggest release risk still open: the social-archive feature currently exposes non-published social records and therefore remains a human-decision gate.
- Separate risk bucket: voice and phone workflow files are commercialization-related but not part of the default public deploy.
