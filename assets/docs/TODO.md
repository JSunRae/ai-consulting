# Pre-Launch Checklist & Audit Log

_Last updated: 2026-05-16._

This file tracks the remaining non-blocking operational work around the current website launch. The repo-side commercialization implementation and release isolation are complete.

## Status

- Workstream status: **Repo-side implementation and release isolation complete**
- Autonomous content and positioning work: **Complete**
- Public contact and newsletter web submissions: **Live via Formspree**
- Static-site release blockers requiring owner input: **None**
- Remaining owner or post-launch decisions: **Booking preference, LinkedIn tracking choice, physical-device Safari pass, broader phone rollout inputs**

## Post-Release Owner Decisions

- [ ] **Confirm the final booking flow** (`contact.html`, optional future direct-booking links)
      The current site is valid with email-led scheduling. Only replace the current flow if direct Calendly booking is being enabled.

- [ ] **Decide on LinkedIn tracking** (`index.html`, `about.html`, `contact.html`, `services.html`, `resume.html`, `portfolio.html`, `404.html`, `blog/*.html`, `portfolio/*.html`)
      Tracking is currently disabled, which is acceptable for launch. Only add the LinkedIn Insight Tag back if campaigns require it and a real partner ID is available.

- [ ] **Run a physical-device Safari smoke test**
      Verify `backdrop-filter`, fixed elements, and the chat widget on a real iPhone or iPad. This is now a post-release validation item, not a release blocker.

- [ ] **Decide how far to backfill historical short-form posts into the archive** (`assets/data/social-posts.json`, `blog/social-posts.html`, `scripts/social_archive_import.py`, `scripts/extract_linkedin_saved_activity.py`)
      The public archive is launch-safe as shipped. Additional X-history or broader LinkedIn backfill is optional.

- [ ] **Decide whether to expand phone rollout inputs beyond the current repo-side preparation**
      The static site can ship without this. Treat it as a separate activation track.

## Completed Repo-Side Work

- [x] **Release scope isolated from unrelated repo changes**
      Preserved full local state on `codex/snapshot-all-changes-20260516` and created the clean release branch `codex/commercialization-release-20260516`.

- [x] **Finalize public-safe source data** (`assets/data/resume.json`, `assets/data/projects.json`)
      Verified that chatbot source files match the current public resume, portfolio framing, case-study coverage, and downloadable asset references.

- [x] **Finish the remaining brand-positioning sweep** (`about.html`, `privacy.html`, `blog/*.html`, `portfolio/*.html`)
      Remaining legacy phrasing on the public conversion surface was normalized to the current commercial analytics and applied AI positioning.

- [x] **Run a final blog QA pass** (`blog/*.html`)
      Article copy, internal links, and footer links were checked after the recent blog expansion and positioning refresh.

- [x] **Decide the production posting route for X and LinkedIn** (`assets/docs/SOCIAL_CONTENT_OPERATING_PLAN.md`, `scripts/social_buffer_publish.py`)
      Buffer is the chosen repo-side broker. Any remaining work is external credential setup, not architecture.

## Optional Polish

- [ ] **Optional: add richer hero media** (`index.html`)
      Only do this if you want an intro video or avatar later as a design enhancement.

- [ ] **Replace the profile photo placeholder** (`about.html`, `assets/images/`)
      Replace `profile-placeholder.svg` with the final headshot asset if desired.

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
