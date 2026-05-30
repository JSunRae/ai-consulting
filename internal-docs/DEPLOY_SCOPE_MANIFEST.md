# Deploy Scope Manifest

Last updated: 2026-05-29

## Current Control State

This manifest now reflects the isolated release branch, not the original mixed dirty worktree.

- branch under release control: `codex/commercialization-release-20260516`
- base branch: `main`
- current head: `7258edd8c560648929669d1c49ad9b3ab1438fcb`
- controlling staging guide: `internal-docs/RELEASE_STAGE_COMMANDS.md`
- controlling audit: `internal-docs/RELEASE_SCOPE_AUDIT.md`

The older 2026-05-12 mixed-worktree analysis is no longer the active release-control basis for WQ-24.

## Workstream Next Steps

These are the true next steps for WQ-24 on the isolated branch.

1. Reconfirm the branch still passes the release gates.
2. Reconfirm the branch diff against `main` is still coherent release scope.
3. Reconfirm the public social archive is published-safe.
4. Keep release-control docs aligned with the live branch state.
5. Treat preview deploy smoke validation as the final merge gate.

## Status Of Those Next Steps

1. Release gates rechecked: `Done`

- `python scripts/repo_preflight.py` passed on 2026-05-28.
- `npm run check:preflight` passed on 2026-05-28.
- `npm run build` passed on 2026-05-29.

1. Branch diff rechecked: `Done`

- `git diff --name-status main...HEAD` still shows a coherent branch-level release surface.

1. Public social archive rechecked: `Done`

- public archive payload is `assets/data/social-posts.public.json`
- no `draft`, `queue`, `ready`, or `scheduled` statuses appear in that public file
- public route files remain:
  - `blog/social-posts.html`
  - `js/social-archive.js`
  - `assets/data/social-posts.public.json`

1. Release-control docs refreshed: `Done`

- this manifest now points to the branch-isolated control state
- `internal-docs/RELEASE_SCOPE_AUDIT.md` is refreshed to the same branch basis
- `internal-docs/RELEASE_SMOKE_TEST_REPORT.md` now records the 2026-05-29 CTA-normalization follow-up

1. Final merge gate identified: `Done`

- the remaining gate is `internal-docs/PREVIEW_DEPLOY_SMOKE_CHECKLIST.md`
- this is now an external validation step, not a repo-hygiene investigation step
- branch-local runtime cleanup and rebuilt-bundle verification are complete

## Branch Release Scope

Use the branch-specific release scope below. Do not use blanket staging commands.

### Must-Stage

These are the current release-branch runtime and public-surface files.

- `404.html`
- `about.html`
- `contact.html`
- `index.html`
- `portfolio.html`
- `privacy.html`
- `resume.html`
- `services.html`
- `blog/index.html`
- `blog/social-posts.html`
- `blog/5-ways-gpt4-transforms-business-analytics.html` (legacy redirect shim to the canonical LLM article)
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
- `js/social-archive.js`
- `assets/data/projects.json`
- `assets/data/resume.json`
- `assets/data/social-posts.public.json`
- `assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf`
- `assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf`
- `assets/docs/Jason-Rae-Resume.pdf`
- `assets/images/og-image.svg`
- `portfolio/ai-desktop-agent-orchestrator.html`
- `portfolio/ai-memoir-narrative-pipeline.html`
- `portfolio/algorithmic-trading-ai.html`
- `portfolio/multilingual-travel-authorization-saas.html`
- `netlify.toml`
- `scripts/build_public_bundle.py`
- `sitemap.xml`

Public social archive files are intentionally included on this branch because the archive now ships from a published-safe dataset.

- `blog/social-posts.html`
- `js/social-archive.js`
- `assets/data/social-posts.public.json`

Public `internal-docs/` payload is intentionally limited to the three PDF downloads above. Helper HTML, Markdown, and release-control docs under `internal-docs/` are branch-support files only and must not be treated as public runtime.

### Optional-But-Related

These files support the release process or preserve internal provenance, but they are not required for the public runtime payload.

Release-control and repo-support files:

- `.gitignore`
- `LINK_AUDIT.md`
- `README.md`
- `generate_portfolio_pages.py`
- `package.json`
- `package-lock.json`
- `requirements-dev.txt`
- `internal-docs/BROWSER_QA_REPORT.md`
- `internal-docs/DEPLOY_SCOPE_MANIFEST.md`
- `internal-docs/PREVIEW_DEPLOY_SMOKE_CHECKLIST.md`
- `internal-docs/RELEASE_PR_DESCRIPTION.md`
- `internal-docs/RELEASE_SCOPE_AUDIT.md`
- `internal-docs/RELEASE_SMOKE_TEST_REPORT.md`
- `internal-docs/RELEASE_STAGE_COMMANDS.md`
- `internal-docs/WQ24_FINAL_STATUS.md`

Internal commercialization docs and handover assets:

- `internal-docs/AGENT_LEDGER.md`
- `internal-docs/BRAND_INTELLIGENCE_BRIEF.md`
- `internal-docs/CHALLENGER_DISCOVERY_CALL_SCRIPT.md`
- `internal-docs/CHALLENGER_LINKEDIN_LAUNCH_PLAN.md`
- `internal-docs/CHALLENGER_PAGE_AUDIT.md`
- `internal-docs/CHALLENGER_PROPOSAL_TEMPLATE.md`
- `internal-docs/CHAT_VOICE_ALIGNMENT_AUDIT.md`
- `internal-docs/Customer-Service-AI-Checklist.md`
- `internal-docs/DEPLOY_AND_AUTOMATION_RUNBOOK.md`
- `internal-docs/GERMAN_LOCALIZATION_ROADMAP.md`
- `internal-docs/LAUNCH_HARDENING_HANDOVER.md`
- `internal-docs/LEAD_MAGNET_TRACKING_HOOKS.md`
- `internal-docs/OBJECTION_HANDLING_LIBRARY.md`
- `internal-docs/OFFER_OPERATING_PLAYBOOK.md`
- `internal-docs/POST_CALL_SUMMARY_TEMPLATE.md`
- `internal-docs/RECOMMENDATION_MEMO_TEMPLATE.md`
- `internal-docs/REPO_FINISH_PROMPTS.md`
- `internal-docs/SETUP_GUIDE.md`
- `internal-docs/SOCIAL_AUTOMATION_IMPLEMENTATION_BRIEF.md`
- `internal-docs/SOCIAL_CONTENT_OPERATING_PLAN.md`
- `internal-docs/TWILIO_OPENAI_SIP_PHASE1_PLAN.md`
- `internal-docs/VOICE_CALL_AGENT_IMPLEMENTATION_BRIEF.md`
- `internal-docs/VOICE_CALL_OPERATING_PLAYBOOK.md`
- `internal-docs/VOICE_CALL_TEST_PLAN.md`

Automation and operator tooling that remain outside the public runtime payload:

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

These files are unrelated, local-state, scratch, or outside the isolated website-release branch scope.

- `.github/copilot-instructions.md`
- `.netlify/state.json`
- `03-Challenger-Audit-Core-Pages-Handover.md`
- `Research and Documentation/`
- `ai_analytics_affiliation_application_status_20260510.md`
- `ai_analytics_institutional_affiliation_plan_for_jason_20260510.json`
- `ai_analytics_institutional_affiliation_plan_for_jason_20260510.md`
- `internal-docs/TODO.md`
- `internal-docs/applications/checkmk-head-of-data-analytics-cover-letter.md`
- `scripts/__pycache__/`
- `scripts/generate_job_application_docs.py`

### Needs Human Decision Before Release

These are commercialization-adjacent files that are still intentionally outside the current release scope.

Internal social-automation state:

- `assets/data/social-posts.json`

Reason:

- the public branch now uses `assets/data/social-posts.public.json`
- `assets/data/social-posts.json` remains internal operating state and should not be published as part of this workstream

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

- All files under `internal-docs/` listed in `Optional-But-Related`, except the public-facing lead magnet and resume assets listed in `Must-Stage`
- `.env.example`
- `.github/workflows/social-draft.yml`
- `.github/workflows/social-publish.yml`
- `assets/data/social-channels.example.json`
- `assets/data/social-guidance.json`
- `assets/data/social-history-template.csv`
- `assets/data/social-sources.json`
- `assets/data/social-posts.json`
- All staged-safe script files listed in `Optional-But-Related`
- All voice and phone files listed under `Needs Human Decision Before Release`

These files support commercialization operations, QA, content systems, sales process, or future automation. They are not required to put the public site live.

## Exact Release Recommendation

### Safe Minimal Release Scope

Current recommendation for WQ-24 on this branch.

- Stage only `Must-Stage`.
- Optionally include release-control docs from `Optional-But-Related` if the PR should carry its audit trail.
- Do not stage anything in `Do-Not-Stage`.
- Leave `assets/data/social-posts.json` and the voice/phone track out of the release.

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
  js/social-archive.js `
  assets/data/projects.json `
  assets/data/resume.json `
  assets/data/social-posts.public.json `
  assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf `
  assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf `
  assets/docs/Jason-Rae-Resume.pdf `
  assets/images/og-image.svg `
  portfolio/ai-desktop-agent-orchestrator.html `
  portfolio/ai-memoir-narrative-pipeline.html `
  portfolio/algorithmic-trading-ai.html `
  portfolio/multilingual-travel-authorization-saas.html `
  blog/social-posts.html `
  netlify.toml `
  scripts/build_public_bundle.py `
  sitemap.xml
```

### Fuller Release Scope If Docs And Operational Assets Are Wanted

Use this only if the user wants internal provenance, QA evidence, and release-control documentation versioned alongside the public branch payload.

- Stage everything in `Must-Stage`.
- Add files from `Optional-But-Related`.
- Keep `Do-Not-Stage` excluded.
- Keep `Needs Human Decision Before Release` excluded until explicitly approved.

This is the correct choice if the goal is not just a public-site deploy, but also a fuller repo-state handover of commercialization operations.

## Final Judgment

- WQ-24 status: branch-side repo hygiene work is complete.
- Safe default: stage the branch release scope only.
- Remaining merge gate: preview deploy smoke validation.
- Separate risk bucket: internal social state plus voice and phone workflow files remain outside this release branch scope.
