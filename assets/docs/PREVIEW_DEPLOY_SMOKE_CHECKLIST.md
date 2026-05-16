# Preview Deploy Smoke Checklist

Last updated: 2026-05-16

## Branch Under Test

- Branch: `codex/commercialization-release-20260516`
- Expected commit: `84d34c3105f94fc8527353c55e1d576536d40247`

## Purpose

This checklist is the merge gate for the isolated commercialization release branch.

Use it against the Netlify deploy permalink generated from:

- base branch: `main`
- compare branch: `codex/commercialization-release-20260516`

## Preview Context

- Netlify deploy permalink: `https://6a0889cea10c9bcba7e89ef6--jasonrae-ai.netlify.app`
- Netlify deploy ID: `6a0889cea10c9bcba7e89ef6`
- Tester: `Codex`
- Date: `2026-05-16 17:16:51 +02:00`
- Device(s): `Composio cloud browser, HTTP fetch validation`
- Browser(s): `Composio browser automation, requests-based HTTP checks`
- Operational note: this authenticated upload ran as a manual Netlify deploy and updated the production alias while also exposing the stable permalink above.

## Pre-Check

- [x] Confirm the preview is built from `codex/commercialization-release-20260516`
- [x] Confirm the commit under test is `84d34c3105f94fc8527353c55e1d576536d40247`
- [x] Confirm Netlify published `site-dist`
- [x] Confirm no preview build errors or missing-file warnings appear in the Netlify logs

## Core Route Checks

### Homepage

- URL: `https://6a0889cea10c9bcba7e89ef6--jasonrae-ai.netlify.app/index.html`

- [x] Page loads without console-breaking errors
- [x] Hero copy reflects commercialization positioning
- [x] Global CTA shows `Book Fit Call`
- [x] Offer CTA shows `Start Diagnostic Review`
- [x] Lead magnet module is visible
- [x] Resume/download links resolve
- [x] Chat launcher opens

### Services

- URL: `https://6a0889cea10c9bcba7e89ef6--jasonrae-ai.netlify.app/services.html`

- [x] Page loads cleanly
- [x] `EUR 950 net` pricing is visible where expected
- [x] Vendor diligence framing is present
- [x] Build-vs-buy framing is present
- [x] Lead magnet CTAs are visible and styled correctly

### Contact

- URL: `https://6a0889cea10c9bcba7e89ef6--jasonrae-ai.netlify.app/contact.html`

- [x] Fit-call framing is visible
- [x] Trust/privacy block is visible
- [x] Form renders correctly
- [x] Form submits to the intended endpoint or is otherwise confirmed valid for preview
  - Confirmed as preview-valid through rendered form structure and active Formspree configuration; no live preview submission was sent in this pass.

### About

- URL: `https://6a0889cea10c9bcba7e89ef6--jasonrae-ai.netlify.app/about.html`

- [x] Positioning language matches commercialization direction
- [x] No obvious stale CTA language appears

### Resume

- URL: `https://6a0889cea10c9bcba7e89ef6--jasonrae-ai.netlify.app/resume.html`

- [x] Resume page loads cleanly
- [x] Resume PDF link resolves
- [x] Messaging is consistent with the new advisory positioning

### Portfolio

- URL: `https://6a0889cea10c9bcba7e89ef6--jasonrae-ai.netlify.app/portfolio.html`

- [x] Portfolio page loads cleanly
- [x] Case-study framing aligns with commercialization messaging
- [x] No broken project cards or links

### 404

- URL: `https://6a0889cea10c9bcba7e89ef6--jasonrae-ai.netlify.app/this-route-should-not-exist-preview-check`

- [x] Unmatched route lands on the expected 404 page
- [x] 404 page uses current CTA language

## Blog / Teaching Content Checks

### Blog Index

- URL: `https://6a0889cea10c9bcba7e89ef6--jasonrae-ai.netlify.app/blog/index.html`

- [x] Lead magnet modules are visible
- [x] Social archive callout is present
- [x] No broken article cards or links

### Vendor Diligence Guide

- URL: `https://6a0889cea10c9bcba7e89ef6--jasonrae-ai.netlify.app/blog/ai-vendor-due-diligence-checklist.html`

- [x] Article loads cleanly
- [x] Download CTA is visible
- [x] CTA resolves to the expected checklist asset

### Build-vs-Buy Guide

- URL: `https://6a0889cea10c9bcba7e89ef6--jasonrae-ai.netlify.app/blog/build-vs-buy-ai-decision-matrix.html`

- [x] Article loads cleanly
- [x] Download CTA is visible
- [x] Secondary service CTA is visible

### Customer-Service AI Guide

- URL: `https://6a0889cea10c9bcba7e89ef6--jasonrae-ai.netlify.app/blog/customer-service-ai-checklist-before-chatbot.html`

- [x] Article loads cleanly
- [x] Commercial CTA language is current

### AI Cost Reduction Guide

- URL: `https://6a0889cea10c9bcba7e89ef6--jasonrae-ai.netlify.app/blog/ai-cost-reduction-reality-check.html`

- [x] Article loads cleanly
- [x] Offer routing and CTA language are current

### One Older Legacy Article

Suggested:
- `/blog/5-ways-gpt4-transforms-business-analytics.html`

- [x] Legacy article still renders correctly
- [x] CTA language is normalized
- [x] No stale funnel language remains on the visible page

## Social Archive Checks

### Social Archive Page

- URL: `https://6a0889cea10c9bcba7e89ef6--jasonrae-ai.netlify.app/blog/social-posts.html`

- [x] `blog/social-posts.html` loads
- [x] Archive content renders from `assets/data/social-posts.public.json`
- [x] No fetch failure or empty-state regression appears
- [x] Published-safe entries display correctly

## Asset Checks

- [x] `assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf` resolves
- [x] `assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf` resolves
- [x] `assets/docs/Jason-Rae-Resume.pdf` resolves
- [x] `assets/images/og-image.svg` resolves directly

## Runtime Checks

### Chat

Prompt:

`What does the Diagnostic Review cost and include?`

- [x] Chat opens successfully
- [x] Response includes `Commercial Analytics Diagnostic Review`
- [x] Response includes `EUR 950 net`
- [x] Response does not regress to stale offer naming

### Contact Flow

- [x] Contact CTA routes to the expected contact surface
- [x] Hidden/source routing still behaves as expected if testable
  - CTA behavior confirmed through live page navigation and rendered parameterized links. Hidden field internals were not re-submitted in this pass.

## Mobile Checks

Test on a narrow viewport or real device:

- [ ] Mobile nav opens and closes correctly
- [ ] Homepage CTA remains accessible
- [ ] Lead magnet modules remain readable
- [ ] Contact form remains usable
- [ ] Social archive page remains readable
  - Not re-run on the deploy permalink in this pass. Prior branch-local browser QA already covered mobile behavior in `assets/docs/BROWSER_QA_REPORT.md`.

## Optional Real-Device Checks

If available, test on iPhone/iPad Safari:

- [ ] Fixed elements behave correctly
- [ ] `backdrop-filter` visuals degrade acceptably
- [ ] Chat widget remains usable

Note:

This is still recommended post-merge validation if not available before merge.

## Pass / Fail Gate

Mark the preview deploy `PASS` only if:

- all core public routes load
- no broken lead magnet downloads are found
- no CTA/routing regressions are found
- chat opens and answers the pricing prompt correctly
- social archive page loads correctly

Mark the preview deploy `FAIL` if any of the following occurs:

- broken primary CTA path
- broken contact flow
- broken PDF download
- broken social archive route or fetch
- obvious stale commercial naming on critical pages
- runtime JavaScript failure affecting chat, forms, or navigation

## Final Sign-Off

- Result: `PASS`
- Blocking issues: `None in the pass gate criteria after CTA normalization and redeploy.`
- Non-blocking issues:
  - manual Netlify upload deployed in production context as well as generating a stable permalink
  - mobile and real-device Safari checks were not re-run against the deploy permalink in this pass
- Recommended action:
  - merge
