# Release Scope Audit

Last updated: 2026-05-16

## Objective

Reconcile the previous release-scope disagreements and record the final include/exclude decisions used to create the isolated release branch.

## Branch Evidence

- Full local work preserved and synced on `origin/codex/snapshot-all-changes-20260516`
- Clean release branch created from base commit `c96ededc0421f8246c4c789c7f2f0d6d3527f495`
- Isolated release branch name: `codex/commercialization-release-20260516`

## Final Inclusion Rule

Include changed files only when they materially affect one of the following:

- live user experience
- public routing
- chatbot or page runtime behavior
- public downloads
- public shareability metadata/assets
- release-control evidence required to prove the branch is isolated

## Resolved Previously Disputed Files

- `404.html`: include
  - Public route and CTA surface changed.
- `assets/data/projects.json`: include
  - Required by portfolio rendering and chatbot data loading.
- `assets/data/resume.json`: include
  - Required by resume content and chatbot data loading.
- `assets/docs/Jason-Rae-Resume.pdf`: include
  - Linked directly from `index.html` and `resume.html`.
- `assets/images/og-image.svg`: include
  - Public-facing sharing asset with updated branding.
- `blog/social-posts.html`: include
  - Linked from `blog/index.html`.
- `js/social-archive.js`: include
  - Runtime dependency of the public social archive page.
- `assets/data/social-posts.public.json`: include
  - Public archive data source used by `js/social-archive.js`.
- portfolio detail pages under `portfolio/`: include
  - Public routes changed and should remain consistent with the new portfolio framing.

## Included Release Scope

The full included scope is defined in:

- `assets/docs/DEPLOY_SCOPE_MANIFEST.md`

That manifest is now the authoritative file list for the release branch.

## Excluded Scope Classes

The following remain intentionally excluded:

- personal and career application materials
- social automation infrastructure
- voice backend and phonebot implementation
- internal strategy docs not needed for runtime or release proof
- local generated artifacts, caches, screenshots, and `site-dist` output

## Reconciliation Outcome

The earlier disagreement between `Must-Stage` and `Needs-Human-Decision` is resolved.

- The public/runtime files listed above are now explicitly approved and included.
- The excluded classes remain out of scope.
- No unresolved file-level release decision remains for WQ-24.

## Remaining Non-Scope Concerns

These items remain operational follow-ups, not release-scope blockers:

- owner decision on direct booking versus email-led scheduling
- LinkedIn tracking reintroduction decision
- physical-device Safari smoke test
- expanded short-form social backfill
