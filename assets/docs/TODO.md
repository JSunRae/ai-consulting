# Pre-Launch Checklist & Audit Log

_Last updated: 2026-05-12._

This file tracks the remaining work needed to consider the current website workstream launch-ready. The repo-side commercial analytics refresh is complete; what remains is mostly external launch configuration, final asset swaps, and last-mile QA.

## Status

- Workstream status: **Repo-side implementation closed; handoff items remain**
- Autonomous content and positioning work: **Complete**
- Public contact and newsletter web submissions: **Live via Formspree**
- Launch blockers requiring external inputs: **Booking choice, social credentials, phone rollout inputs**

## 🔴 P0 — Launch Inputs (Owner decisions before going live)

- [x] **Connect Cloudflare DNS for `jasonrae.ai` to the production host**
      The production domain is live and responding on Netlify at `https://jasonrae.ai`.

- [x] **Activate direct web-form posting at launch** (`js/forms.js`, `contact.html`, `index.html`, `blog/index.html`)
      Contact and newsletter forms now submit live via Formspree. Public copy and markup were aligned with the active endpoint on 2026-05-07.

- [ ] **Confirm the final booking flow** (`contact.html`, optional future direct-booking links)
      The current site is valid with email-led scheduling. Only replace the current flow if direct Calendly booking is being enabled.

- [ ] **Decide on LinkedIn tracking** (`index.html`, `about.html`, `contact.html`, `services.html`, `resume.html`, `portfolio.html`, `404.html`, `blog/*.html`, `portfolio/*.html`)
      Tracking is currently disabled, which is acceptable for launch. Only add the LinkedIn Insight Tag back if campaigns require it and a real partner ID is available.

## 🟠 P1 — High Priority (Complete before first user traffic)

- [x] **Finalize public-safe source data** (`assets/data/resume.json`, `assets/data/projects.json`)
      Verified that chatbot source files match the current public resume, portfolio framing, case-study coverage, and downloadable asset references.

- [x] **Finish the remaining brand-positioning sweep** (`about.html`, `privacy.html`, `blog/*.html`, `portfolio/*.html`)
      Replace the remaining legacy phrasing in metadata, article copy, and portfolio detail pages with the canonical commercial analytics and applied AI positioning.

- [x] **Run a final blog QA pass** (`blog/*.html`)
      Confirm article copy, internal links, and footer links are correct after the recent blog expansion and positioning refresh.

- [ ] **Run a physical-device Safari smoke test**
      Verify `backdrop-filter`, fixed elements, and the chat widget on a real iPhone or iPad.

- [x] **Decide the production posting route for X and LinkedIn** (`assets/docs/SOCIAL_CONTENT_OPERATING_PLAN.md`, `scripts/social_buffer_publish.py`)
      Buffer is now the chosen repo-side broker. The remaining work is external credential setup, not architectural decision-making.

- [ ] **Backfill historical short-form posts into the archive** (`assets/data/social-posts.json`, `blog/social-posts.html`, `scripts/social_archive_import.py`, `scripts/extract_linkedin_saved_activity.py`)
      The supplied LinkedIn exports are now reconciled: the saved HTML contains `10` unique activity items and those entries are in the archive. The remaining gap is X post history if you want both channels represented more fully.

## 🟡 P2 — Medium Priority (Polish before or shortly after launch)

- [ ] **Optional: add richer hero media** (`index.html`)
      There is no live hero video placeholder blocking launch in the current homepage HTML. Only do this if you want to add an intro video or avatar later as a design enhancement.

- [ ] **Replace the profile photo placeholder** (`about.html`, `assets/images/`)
      Replace `profile-placeholder.svg` with the final headshot asset.

- [ ] **Add public project URLs where appropriate** (`assets/data/projects.json`)
      Restore live demo or code links for any projects Jason wants to expose publicly.

- [x] **Extend the social workflow from draft generation to posting** (`scripts/social_buffer_publish.py`, `.github/workflows/social-publish.yml`)
      Approved posts can now be scheduled and synced through Buffer while preserving the approval-first archive model.

## 🟢 P3 — Enhancement (Optional post-launch)

- [ ] **Upgrade newsletter handling**
      Consider replacing the current email/Formspree hybrid with Mailchimp, ConvertKit, or a dedicated CRM workflow.

- [x] **Run a post-deploy Lighthouse pass**
      Completed on `2026-05-12`. Current scores are strong on accessibility / best practices / SEO, while performance remains the only worthwhile tuning target. See `Research and Documentation/Lighthouse Summary - 2026-05-12.md`.

## ✅ Completed In This Workstream

- [x] **Commercial analytics positioning applied to core pages** (`index.html`, `services.html`, `contact.html`, `portfolio.html`, parts of `about.html` and `resume.html`)
- [x] **Services repackaged into productized offers** (`services.html`)
- [x] **Contact intake rebuilt around diagnostic buying signals** (`contact.html`)
- [x] **Sanitized commercial analytics case studies added** (`portfolio.html`, `blog/*.html`)
- [x] **Portfolio projects reframed as business-relevant proof of work** (`portfolio.html`, `assets/data/projects.json`)
- [x] **Portfolio data, chatbot retrieval, sitemap, and case-study pages aligned** (`portfolio.html`, `assets/data/projects.json`, `js/chatbot.js`, `sitemap.xml`, `portfolio/*.html`)
- [x] **Three new blog posts added** (`blog/pl-attribution-fx-errors-data-analytics.html`, `blog/deterministic-llm-programming-production-ai.html`, `blog/enterprise-ai-adoption-commercial-analytics.html`)
- [x] **Blog index and related-post links updated** (`blog/index.html`, existing blog posts)
- [x] **Open Graph images verified as absolute URLs**
- [x] **Homepage structured data expanded** (`index.html`)
- [x] **Projects data reconciled with shipped SVG assets** (`assets/data/projects.json`)
- [x] **Font/privacy implementation aligned** (`css/style.css`, `privacy.html`)
- [x] **Local git repository initialized with GitHub origin**
- [x] **Draft-only social automation runtime implemented** (`scripts/social_draft_pipeline.py`, `.github/workflows/social-draft.yml`, `assets/data/social-sources.json`, `README.md`, `assets/docs/SOCIAL_CONTENT_OPERATING_PLAN.md`)
- [x] **Repo-side social posting bridge implemented** (`scripts/social_buffer_publish.py`, `.github/workflows/social-publish.yml`, `assets/docs/DEPLOY_AND_AUTOMATION_RUNBOOK.md`)
- [x] **Voice intake backend scaffold added** (`netlify/functions/voice-incoming.mjs`, `netlify/functions/voice-summary.mjs`, `assets/docs/VOICE_CALL_TEST_PLAN.md`)
