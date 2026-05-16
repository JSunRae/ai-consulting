Last updated: 2026-05-12

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