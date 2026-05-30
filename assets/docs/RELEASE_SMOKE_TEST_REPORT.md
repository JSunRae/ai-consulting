# Release Smoke Test Report

Last updated: 2026-05-29

## Release-Candidate Smoke Test

- Environment: local static host at `http://127.0.0.1:4173`
- Browser surface: VS Code in-app browser
- Scope: commercialization release-candidate smoke test only
- Constraint followed: no broad content edits

## Summary

- Recommendation: GO
- Release blockers found: none
- Product fixes applied: none
- Documentation updated: `assets/docs/RELEASE_SMOKE_TEST_REPORT.md`

## Results By Required Path

| Path | Required checks | Result | Evidence |
| --- | --- | --- | --- |
| `/index.html` | nav CTA visible; hero CTA visible; lead-magnet section visible; chat launches and answers one pricing prompt | PASS | Mobile nav menu rendered `Book Fit Call`; hero CTA rendered `Start Diagnostic Review`; homepage lead-magnet content rendered; AI Decision Assistant opened and answered pricing prompt with `Commercial Analytics Diagnostic Review: EUR 950 net`. |
| `/services.html` | pricing block visible; vendor diligence and build-vs-buy lead magnets visible | PASS | Rendered page showed `EUR 950 net`, `AI Vendor Due Diligence Checklist`, and `Build-vs-Buy AI Decision Matrix`. |
| `/contact.html` | fit-call framing visible; trust block visible; form renders correctly | PASS | Rendered page showed `Fit Call Intake` / `Book A Fit Call`, `Trust & Privacy`, and a visible `#contact-form` posting to Formspree. |
| `/blog/index.html` | lead magnets visible; archive callout visible | PASS | Rendered page showed both lead magnets and the `Social Signals Archive` callout with `Open the Archive`. |
| `/blog/build-vs-buy-ai-decision-matrix.html` | download CTA visible; secondary service CTA visible | PASS | Rendered article showed `Download Decision Matrix` and `Start Diagnostic Review`. |
| Asset: `/assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf` | PDF resolves | PASS | Browser navigation triggered a download flow; in-browser fetch returned `200 OK` with `application/pdf`. |
| Asset: `/assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf` | PDF resolves | PASS | Browser navigation triggered a download flow; in-browser fetch returned `200 OK` with `application/pdf`. |

## Chat Verification

- Launch path: homepage assistant launcher
- Prompt used: `What does the Diagnostic Review cost and include?` via the rendered `Diagnostic price?` quick-prompt
- Result: pass
- Response included the expected commercialization pricing language:
  - `Book Fit Call: qualification only`
  - `Commercial Analytics Diagnostic Review: EUR 950 net`
  - downstream offers described as scoped after diagnosis

## Defects Found

- None during this smoke test.

## Release Impact

- Blocking defects: none
- Non-blocking defects: none observed in tested scope

## Exact Files Changed

- `assets/docs/RELEASE_SMOKE_TEST_REPORT.md`

## Notes

- The VS Code in-app browser surface remained narrow during this run, so the homepage navigation CTA was validated in the rendered mobile menu state rather than a wide desktop header layout.
- This does not conflict with the earlier desktop confirmation already recorded in `assets/docs/BROWSER_QA_REPORT.md`; the current release-candidate run still verified the CTA in a live rendered state.

## Supplemental Local Revalidation - 2026-05-28

- Environment: local static host at `http://127.0.0.1:4175`
- Browser surface: shared VS Code in-app browser pages
- Scope: branch-level local preview-style smoke verification on `codex/commercialization-release-20260516`
- Constraint followed: no git staging, commit, or branch mutation

### Additional Route Checks

| Path | Checks | Result | Evidence |
| --- | --- | --- | --- |
| `/about.html` | advisory positioning present; no stale Health Check language; profile image resolves in page | PASS | The rendered page title matched the advisory-positioning About page; visible page contained no `Health Check` copy; `jason-profile-photo.jpg` rendered on-page. |
| `/resume.html` | advisory positioning present; 13+ years language present; resume PDF linked | PASS | The rendered page title matched the advisory-positioning Resume page; visible page contained `13+ years`; page included a link to `assets/docs/Jason-Rae-Resume.pdf`. |
| `/portfolio.html` | page loads cleanly; commercialization framing intact; project cards render | PASS | The rendered page title matched the proof-of-work portfolio page; rendered page contained commercial case-study framing and 9 project or article cards without broken placeholder text. |
| `/blog/ai-vendor-due-diligence-checklist.html` | article loads; checklist CTA visible; fit-call CTA visible | PASS | Rendered article showed `Download Checklist`, `Book Fit Call`, and the expected article title. |
| `/blog/customer-service-ai-checklist-before-chatbot.html` | article loads; CTA language current | PASS | Rendered article showed current workflow-oriented language and current commercial CTA text. |
| `/blog/ai-cost-reduction-reality-check.html` | article loads; offer routing and CTA language current | PASS | Rendered article contained current cost-reduction framing and current CTA language. |
| `/blog/5-ways-llm-workflows-transform-business-analytics.html` | legacy-style article renders; CTA language normalized; no stale Health Check text | PASS | Rendered article title showed the current LLM-workflows slug and no visible `Health Check` language remained. |
| `/blog/social-posts.html` | archive loads; public-safe archive data renders; no empty-state regression | PASS | Rendered page contained 24 post cards and no empty-state text. |
| `/404.html` | custom 404 page renders; CTA language current | PASS | The rendered custom 404 page included `Book Fit Call` in navigation and a current `Get in Touch` CTA. |

### Asset And Runtime Checks

- Homepage assistant launcher: PASS
  - The homepage assistant launcher opened successfully.
  - The rendered assistant state exposed Diagnostic Review pricing prompts.
- Built bundle completeness: PASS
  - `site-dist` contains the critical HTML routes, PDFs, OG asset, and `assets/data/social-posts.public.json` required for preview deploy.
  - The built `site-dist/js/social-archive.js` runtime fetches `../assets/data/social-posts.public.json` as intended.
- Asset fetches from the live page: PASS
  - `/assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf` returned `200 OK` with `application/pdf`
  - `/assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf` returned `200 OK` with `application/pdf`
  - `/assets/docs/Jason-Rae-Resume.pdf` returned `200 OK` with `application/pdf`
  - `/assets/images/og-image.svg` returned `200 OK` with `image/svg+xml`
- Mobile-width sanity pass: PASS
  - Homepage retained `Book Fit Call`, `Start Diagnostic Review`, and lead-magnet visibility at narrow viewport width.
  - Contact page retained visible form and `Trust & Privacy` content at narrow viewport width.
  - Social archive remained populated at narrow viewport width.

### Local-Host Limitation

- Unmatched-route 404 handling on the local static host: needs hosted-preview confirmation
  - Requesting `/does-not-exist` on the local server returned the generic server `Error response` page instead of automatically serving `404.html`.
  - The custom `404.html` file itself renders correctly and uses current CTA language.
  - Treat this as a host-behavior check to confirm on the real preview or deployment target rather than as a confirmed content regression in the repo.

## CTA Normalization Follow-Up - 2026-05-29

- Environment: local branch validation plus rebuilt `site-dist`
- Scope: close-out fix after live smoke exposed stale `Start Conversation` CTA text in current release files
- Constraint followed: root-cause fix only; legacy alias kept in `js/main.js` for compatibility

### Fix Applied

- Normalized remaining public `Start Conversation` labels and matching `cta=` query parameters to `Book Fit Call` across the release source files.
- Updated `assets/data/projects.json` so regenerated portfolio detail pages keep the normalized label.
- Rebuilt the public bundle with `npm run build` after the source fix.

### Validation Results

| Check | Result | Evidence |
| --- | --- | --- |
| Source search excluding built output and internal docs | PASS | Only intentional legacy alias remained: `js/main.js` contains the compatibility check for the legacy `Start Conversation` label. |
| Rebuilt `site-dist` search excluding `site-dist/js/main.js` | PASS | No remaining `Start Conversation` strings were found in built public output. |
| Homepage output | PASS | `site-dist/index.html` contains `Book Fit Call` in nav CTA and vendor-diligence secondary CTA. |
| Services output | PASS | `site-dist/services.html` shows `Book Fit Call` across nav and service CTA blocks. |
| Build-vs-buy article output | PASS | `site-dist/blog/build-vs-buy-ai-decision-matrix.html` shows `Book Fit Call` in nav and secondary CTA. |
| Portfolio project data output | PASS | `site-dist/assets/data/projects.json` uses `Book Fit Call` for the fit-call CTA labels that drive generated portfolio detail pages. |

### Remaining External Gate

- Hosted preview verification is still required for final release confidence, especially unmatched-route 404 behavior and one last hosted browser pass through the preview checklist.
