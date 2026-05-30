# Pre-Launch Checklist & Audit Log

_Last updated: 2026-05-29._

This file tracks the remaining open work around the current website launch using the current branch boundary. The repo-side commercialization implementation, CTA normalization, and release isolation are complete.

Use this file as the categorized open-work checklist for the isolated commercialization release branch. For branch-close status, defer to `assets/docs/WQ24_FINAL_STATUS.md`. For workstream posture and default decisions, defer to `assets/docs/WORKSTREAM_NEXT_STEPS.md`.

## Status

- Workstream status: **Repo-side implementation and release isolation complete**
- Autonomous content and positioning work: **Complete**
- Public contact and newsletter web submissions: **Live via Formspree**
- Release gate still pending outside repo-local execution: **Hosted preview sign-off only**
- Recommended non-blocking closeout validation still open: **Physical-device Safari pass**

## Release Gate

- [ ] **Complete hosted preview deploy sign-off** (`assets/docs/PREVIEW_DEPLOY_SMOKE_CHECKLIST.md`)
      This is the final merge gate for the isolated commercialization release branch. Keep this limited to preview verification rather than reopening repo-local implementation scope.

## Recommended But Non-Blocking Validation

- [ ] **Run a physical-device Safari smoke test**
      Verify `backdrop-filter`, fixed elements, and the chat widget on a real iPhone or iPad. This is recommended closeout validation, not part of the release definition of done.

## Immediate Operational Defaults And Follow-Ups

- [x] **Keep the current booking flow as email-led for this workstream** (`contact.html`)
      No direct-booking change is needed. Only revisit this if a future Calendly rollout becomes a separate commercial decision.

- [x] **Keep LinkedIn tracking disabled for this workstream** (`index.html`, `about.html`, `contact.html`, `services.html`, `resume.html`, `portfolio.html`, `404.html`, `blog/*.html`, `portfolio/*.html`)
      The current public pages intentionally ship without the Insight Tag. Only add it later if campaigns require it and a real partner ID is available.

- [x] **Freeze social-history scope at the current imported archive** (`assets/data/social-posts.public.json`, `blog/social-posts.html`)
      The LinkedIn history currently on hand is already in the public archive. Additional X-history or deeper backfill is deferred to a separate content-maintenance task.

- [x] **Defer broader phone rollout beyond repo-side preparation**
      The static site does not need a public phone number to complete this workstream. Treat phone activation as a separate track.

- [x] **Keep Buffer credentialing out of this release definition of done** (`scripts/social_buffer_publish.py`, GitHub/Buffer secrets)
      Buffer remains the chosen social broker, but credential setup and first live scheduling runs are operational follow-up work, not launch gating.

## Completed Repo-Side Work

- [x] **Release scope isolated from unrelated repo changes**
      Preserved full local state on `codex/snapshot-all-changes-20260516` and created the clean release branch `codex/commercialization-release-20260516`.

- [x] **Finalize public-safe source data** (`assets/data/resume.json`, `assets/data/projects.json`)
      Verified that chatbot source files match the current public resume, portfolio framing, case-study coverage, and downloadable asset references.

- [x] **Finish the remaining brand-positioning sweep** (`about.html`, `privacy.html`, `blog/*.html`, `portfolio/*.html`)
      Remaining legacy phrasing on the public conversion surface was normalized to the current commercial analytics and applied AI positioning.

- [x] **Run a final blog QA pass** (`blog/*.html`)
      Article copy, internal links, and footer links were checked after the recent blog expansion and positioning refresh.

- [x] **Normalize tracked CTA routing across older portfolio and blog surfaces** (`portfolio.html`, `portfolio/*.html`, selected `blog/*.html`, `generate_portfolio_pages.py`, `assets/data/projects.json`)
      Older generic service-only contact links were upgraded to tracked service-specific routes, and generated portfolio surfaces now keep those conversion links after rebuilds.

- [x] **Decide the production posting route for X and LinkedIn** (`assets/docs/SOCIAL_CONTENT_OPERATING_PLAN.md`, `scripts/social_buffer_publish.py`)
      Buffer is the chosen repo-side broker. Any remaining work is external credential setup, not architecture.

## Later Backlog Or Separate Workstreams

- [ ] **Expand social automation beyond the current repo-side scaffolding**
      Treat secret provisioning, first real scheduling cycles, X expansion, and autonomous-drafting restoration as a separate social-operations workstream.

- [ ] **Decide whether to deepen the public social archive later** (`assets/data/social-posts.public.json`, `blog/social-posts.html`)
      X-history backfill and broader activity-policy changes remain backlog decisions rather than launch work.

- [ ] **Handle phone intake as a separate activation track** (`phonebot/`)
      Public phone rollout, Twilio/OpenAI runtime work, and end-to-end call QA stay outside this release branch definition of done.

- [ ] **Optional: add richer hero media** (`index.html`)
      Only do this if you want an intro video or avatar later as a design enhancement.

- [ ] **Upgrade the current profile photo if desired** (`about.html`, `assets/images/`)
      `about.html` now uses `jason-profile-photo.jpg`. Replace it with a stronger formal headshot later only if you want a more polished public portrait.

- [ ] **Add public project URLs where appropriate** (`assets/data/projects.json`)
      Restore live demo or code links for any projects Jason wants to expose publicly.

## Historical Completion Record

- [x] **Commercial analytics positioning applied to core pages** (`index.html`, `services.html`, `contact.html`, `portfolio.html`, parts of `about.html` and `resume.html`)
- [x] **Services repackaged into productized offers** (`services.html`)
- [x] **Contact intake rebuilt around diagnostic buying signals** (`contact.html`)
- [x] **Sanitized commercial analytics case studies added** (`portfolio.html`, `blog/*.html`)
- [x] **Portfolio projects reframed as business-relevant proof of work** (`portfolio.html`, `assets/data/projects.json`)
- [x] **Portfolio data, chatbot retrieval, sitemap, and case-study pages aligned** (`portfolio.html`, `assets/data/projects.json`, `js/chatbot.js`, `sitemap.xml`, `portfolio/*.html`)
- [x] **Blog index and related-post links updated** (`blog/index.html`, existing blog posts)
- [x] **Open Graph images verified as absolute URLs**
- [x] **Homepage structured data expanded** (`index.html`)
- [x] **Projects data reconciled with shipped SVG assets** (`assets/data/projects.json`)
- [x] **Font/privacy implementation aligned** (`css/style.css`, `privacy.html`)
- [x] **Local git repository initialized with GitHub origin**
