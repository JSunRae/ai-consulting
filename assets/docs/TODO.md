# Pre-Launch Checklist & Audit Log

_Last updated: 2026-04-26._

This file tracks the remaining work needed to consider the current website workstream launch-ready. The repo-side commercial analytics refresh is complete; what remains is mostly external launch configuration, final asset swaps, and last-mile QA.

## Status

- Workstream status: **Repo-side implementation closed; handoff items remain**
- Autonomous content and positioning work: **Complete**
- Public contact and newsletter fallback paths: **Operational**
- Launch blockers requiring external inputs: **Still open**

## 🔴 P0 — Launch Inputs (Owner decisions before going live)

- [ ] **Connect Cloudflare DNS for `jasonrae.ai` to the production host**
      Domain ownership is now complete. The remaining infrastructure step is to add `jasonrae.ai` in Netlify and create the DNS records in Cloudflare that Netlify provides.

- [ ] **Decide whether direct web-form posting is needed at launch** (`js/forms.js`)
      Contact and newsletter forms already fall back to prefilled email drafts. Only replace `'xeqkyzoq'` with real Formspree IDs if direct in-browser submission should be live on day one.

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

## 🟡 P2 — Medium Priority (Polish before or shortly after launch)

- [ ] **Replace the hero video placeholder** (`index.html`)
      Swap the placeholder block for the final intro video or approved avatar embed.

- [ ] **Replace the profile photo placeholder** (`about.html`, `assets/images/`)
      Replace `profile-placeholder.svg` with the final headshot asset.

- [ ] **Add public project URLs where appropriate** (`assets/data/projects.json`)
      Restore live demo or code links for any projects Jason wants to expose publicly.

## 🟢 P3 — Enhancement (Optional post-launch)

- [ ] **Upgrade newsletter handling**
      Consider replacing the current email/Formspree hybrid with Mailchimp, ConvertKit, or a dedicated CRM workflow.

- [ ] **Run a post-deploy Lighthouse pass**
      Audit the live site and optimize the heaviest assets to keep performance above 90.

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
