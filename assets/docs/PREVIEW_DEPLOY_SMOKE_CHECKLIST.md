# Preview Deploy Smoke Checklist

Last updated: 2026-05-16

## Branch Under Test

- Branch: `codex/commercialization-release-20260516`
- Expected commit: `391529af4b3876f5dd96f4cda37060a0d8dd0f70`

## Purpose

This checklist is the merge gate for the isolated commercialization release branch.

Use it against the Netlify preview deploy generated from:

- base branch: `main`
- compare branch: `codex/commercialization-release-20260516`

## Preview Context

Fill these in when the preview is live:

- Netlify preview URL:
- Preview deploy ID:
- Tester:
- Date:
- Device(s):
- Browser(s):

## Pre-Check

- [ ] Confirm the preview is built from `codex/commercialization-release-20260516`
- [ ] Confirm the commit under test is `f8fe73dbe333c3817bee1b9ce6e6e9f33d2cc3dc`
- [ ] Confirm Netlify published `site-dist`
- [ ] Confirm no preview build errors or missing-file warnings appear in the Netlify logs

## Core Route Checks

### Homepage

URL:

- [ ] Page loads without console-breaking errors
- [ ] Hero copy reflects commercialization positioning
- [ ] Global CTA shows `Book Fit Call`
- [ ] Offer CTA shows `Start Diagnostic Review`
- [ ] Lead magnet module is visible
- [ ] Resume/download links resolve
- [ ] Chat launcher opens

### Services

URL:

- [ ] Page loads cleanly
- [ ] `EUR 950 net` pricing is visible where expected
- [ ] Vendor diligence framing is present
- [ ] Build-vs-buy framing is present
- [ ] Lead magnet CTAs are visible and styled correctly

### Contact

URL:

- [ ] Fit-call framing is visible
- [ ] Trust/privacy block is visible
- [ ] Form renders correctly
- [ ] Form submits to the intended endpoint or is otherwise confirmed valid for preview

### About

URL:

- [ ] Positioning language matches commercialization direction
- [ ] No obvious stale CTA language appears

### Resume

URL:

- [ ] Resume page loads cleanly
- [ ] Resume PDF link resolves
- [ ] Messaging is consistent with the new advisory positioning

### Portfolio

URL:

- [ ] Portfolio page loads cleanly
- [ ] Case-study framing aligns with commercialization messaging
- [ ] No broken project cards or links

### 404

URL:

- [ ] Unmatched route lands on the expected 404 page
- [ ] 404 page uses current CTA language

## Blog / Teaching Content Checks

### Blog Index

URL:

- [ ] Lead magnet modules are visible
- [ ] Social archive callout is present
- [ ] No broken article cards or links

### Vendor Diligence Guide

URL:

- [ ] Article loads cleanly
- [ ] Download CTA is visible
- [ ] CTA resolves to the expected checklist asset

### Build-vs-Buy Guide

URL:

- [ ] Article loads cleanly
- [ ] Download CTA is visible
- [ ] Secondary service CTA is visible

### Customer-Service AI Guide

URL:

- [ ] Article loads cleanly
- [ ] Commercial CTA language is current

### AI Cost Reduction Guide

URL:

- [ ] Article loads cleanly
- [ ] Offer routing and CTA language are current

### One Older Legacy Article

Suggested:
- `/blog/5-ways-gpt4-transforms-business-analytics.html`

- [ ] Legacy article still renders correctly
- [ ] CTA language is normalized
- [ ] No stale funnel language remains on the visible page

## Social Archive Checks

### Social Archive Page

URL:

- [ ] `blog/social-posts.html` loads
- [ ] Archive content renders from `assets/data/social-posts.public.json`
- [ ] No fetch failure or empty-state regression appears
- [ ] Published-safe entries display correctly

## Asset Checks

- [ ] `assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf` resolves
- [ ] `assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf` resolves
- [ ] `assets/docs/Jason-Rae-Resume.pdf` resolves
- [ ] `assets/images/og-image.svg` resolves directly

## Runtime Checks

### Chat

Prompt:

`What does the Diagnostic Review cost and include?`

- [ ] Chat opens successfully
- [ ] Response includes `Commercial Analytics Diagnostic Review`
- [ ] Response includes `EUR 950 net`
- [ ] Response does not regress to stale offer naming

### Contact Flow

- [ ] Contact CTA routes to the expected contact surface
- [ ] Hidden/source routing still behaves as expected if testable

## Mobile Checks

Test on a narrow viewport or real device:

- [ ] Mobile nav opens and closes correctly
- [ ] Homepage CTA remains accessible
- [ ] Lead magnet modules remain readable
- [ ] Contact form remains usable
- [ ] Social archive page remains readable

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

- Result: `PASS / FAIL`
- Blocking issues:
- Non-blocking issues:
- Recommended action:
  - merge
  - fix and redeploy
  - defer
