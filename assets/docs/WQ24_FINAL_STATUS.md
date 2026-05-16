# WQ-24 Final Status

Last updated: 2026-05-15

## Decision

WQ-24 remains `In Progress`.

## Why It Is Not Done

The required evidence does not support closing the item yet.

### Decision Test

- unrelated repo changes are clearly separated from release scope: `No`
  - `assets/docs/DEPLOY_SCOPE_MANIFEST.md` defines the intended release files.
  - The current `git status --short --untracked-files=all` still shows many unrelated tracked and untracked changes in the same worktree.
  - No isolated staged pathspec, clean release branch, or equivalent operational separation is recorded.
- a safe staging procedure exists: `Yes`
  - `assets/docs/DEPLOY_SCOPE_MANIFEST.md` requires intentional selective staging.
  - `assets/docs/DEPLOY_AND_AUTOMATION_RUNBOOK.md` documents preflight and deploy discipline.
  - `assets/docs/RELEASE_STAGE_COMMANDS.md` and `npm run check:release-scope` now provide a concrete scope-check and staging helper for the dirty worktree.
- release smoke test passed or only non-blocking issues remain: `Not fully evidenced`
  - `assets/docs/BROWSER_QA_REPORT.md` records passing desktop, mobile, chat, lead-magnet, and contact-form checks.
  - `assets/docs/RELEASE_SCOPE_AUDIT.md` and `assets/docs/RELEASE_STAGE_COMMANDS.md` are now present.
  - `assets/docs/RELEASE_SMOKE_TEST_REPORT.md` is still not present.
  - `assets/docs/TODO.md` still lists an open physical-device Safari smoke test.
- no unresolved needs-human-decision items block the release candidate: `Not fully evidenced`
  - `assets/docs/TODO.md` still labels external launch inputs as blockers.
  - Some of those items may be non-blocking for a static-site release, but the current written status does not retire them clearly enough to treat the release candidate as fully clear.

## What Remains

1. Operationally isolate the intended release scope from unrelated repo changes.
2. Record that isolation through a reviewed staged pathspec, a clean release branch, or equivalent release-candidate evidence.
3. Close, waive, or explicitly downgrade the remaining launch-input and Safari-smoke items so the release gate is unambiguous.
4. If a release-specific smoke-test report is required, add it after the real-device Safari pass or explicitly document why the browser QA report is the canonical substitute.

## Tracker Alignment

- `07-IMPLEMENTATION-WORKQUEUE.md`: WQ-24 remains `In Progress`
- `09-LAUNCH-CHECKLIST.md`: `Deploy scope isolated from unrelated changes` remains `In Progress`

These trackers now match this memo.
