# Agent Assignments Ledger

Use this ledger to track which AI agent (or human) is working on which task to avoid conflicts.

- 2026-05-07 | Copilot | GitHub Actions social draft runtime and secure archive sync | ✅ Done | `.github/workflows/social-draft.yml`, `scripts/social_draft_pipeline.py`, `assets/data/social-sources.json`, `.env.example`, `README.md`, `assets/docs/SOCIAL_CONTENT_OPERATING_PLAN.md`, `assets/docs/TODO.md`, `assets/docs/AGENT_LEDGER.md`
- 2026-04-24 | Copilot | Brand brief audit, repo reference note, and integration checklist | ✅ Done | `assets/docs/BRAND_INTELLIGENCE_BRIEF.md`, `assets/docs/TODO.md`, `assets/docs/AGENT_LEDGER.md`
- 2026-05-07 | Copilot | Social content automation plan and archive hardening | ✅ Done | `assets/docs/SOCIAL_CONTENT_OPERATING_PLAN.md`, `assets/docs/TODO.md`, `assets/data/social-posts.json`, `blog/social-posts.html`, `js/social-archive.js`, `README.md`, `assets/docs/AGENT_LEDGER.md`
- 2026-01-19 | Copilot | Created TODO and Ledger | ✅ Done | `assets/docs/TODO.md`, `assets/docs/AGENT_LEDGER.md`
- 2026-01-20 | Copilot | Forms Configuration | ✅ Done | `js/forms.js`
- 2026-01-20 | Copilot | Write blog: Evaluating AI ROI | ✅ Done | `blog/how-to-evaluate-ai-projects-roi.html`
- 2026-01-20 | Copilot | Update Project Links | ✅ Done | `assets/data/projects.json`

## How to use

1. **Claim a task**: Add your name and the task description. Mark Status as "🚧 In Progress".
2. **Execute**: Perform the work.
3. **Complete**: Update Status to "✅ Done" and list modified files.

## Active Rules

- **One file, one agent**: Do not edit a file if another agent has it "In Progress".
- **Read before write**: Always read `TODO.md` before starting work to ensure you aren't doing duplicate work.
