# WQ-24 Next Steps

Last updated: 2026-05-28

## Purpose

This memo records the next steps for the isolated commercialization release branch and the action taken on each step on 2026-05-28.

## Step 1

Reconfirm the branch still passes the technical release gate.

Status: addressed

Evidence:

- `python .\scripts\repo_preflight.py` passed
- `npm run check:preflight` passed

Meaning:

- the isolated release branch still passes the repo-level integrity checks

## Step 2

Reconfirm that the branch diff against `main` is still coherent release scope.

Status: addressed

Evidence:

- reviewed `git diff --name-status main...HEAD`

Meaning:

- the branch diff remains concentrated in public pages, runtime assets, social archive public payload, release-control docs, and build-path files
- no unrelated career-material tree or scratch files are part of the branch diff

## Step 3

Reconfirm that the social archive is safe for the public release branch.

Status: addressed

Evidence:

- `blog/social-posts.html` describes the archive as published-only
- `js/social-archive.js` defaults to authored posts and renders published status only
- `assets/data/social-posts.public.json` contains published entries only
- repo preflight passed with the public archive payload in place

Meaning:

- the public archive is no longer a release blocker on this branch
- `assets/data/social-posts.json` remains internal and should not be treated as a public release asset

## Step 4

Keep the release-control docs aligned with the branch reality.

Status: addressed

Evidence:

- verified `internal-docs/PREVIEW_DEPLOY_SMOKE_CHECKLIST.md` still points at the current branch and current `HEAD`
- corrected `internal-docs/RELEASE_STAGE_COMMANDS.md` to use the actual npm preflight command

Meaning:

- the next operator can use the release docs without hitting a stale command mismatch

## Step 5

Define the true remaining gate for this workstream.

Status: addressed

Meaning:

- the remaining merge gate is the Netlify preview deploy smoke check in `internal-docs/PREVIEW_DEPLOY_SMOKE_CHECKLIST.md`
- this is no longer a repo-cleanliness or scope-investigation problem
- if the preview deploy passes, the workstream can proceed to review and merge

## Current Recommendation

- Workstream state: ready for preview-deploy sign-off
- Next operator action: run the preview checklist against the Netlify deploy for `codex/commercialization-release-20260516`
- Merge condition: preview checklist passes without a broken CTA, broken download, broken contact flow, or chat/social runtime regression

## Execution Update

Local preview-equivalent validation was run on 2026-05-28 against `site-dist`.

What was fixed during that pass:

- normalized public CTA wording from `Start Conversation` to `Book Fit Call` in the release runtime and contact-page framing
- added `js/decision-network.js` to `scripts/build_public_bundle.py` so the built bundle no longer 404s that runtime asset
- removed the stale `Book Fit Call` forbidden-string rule from `scripts/repo_preflight.py` so the supported preflight matches the approved branch wording

What passed after those fixes:

- `npm run build`
- `npm run check:preflight`
- homepage rendered `Book Fit Call` and `Start Diagnostic Review`
- contact page rendered `Fit Call Intake`, `Book A Fit Call`, trust block, and form
- social archive rendered published entries and `Book Fit Call` CTA language on the fresh bundle
- build-vs-buy page rendered download and service CTAs correctly
- `js/decision-network.js` resolved from the built bundle
- lead-magnet PDFs and resume PDF resolved with `200 OK`
- homepage assistant pricing response included `Book Fit Call: qualification only` and `Commercial Analytics Diagnostic Review: EUR 950 net`

What still remains:

- Netlify preview deploy sign-off using `internal-docs/PREVIEW_DEPLOY_SMOKE_CHECKLIST.md`
