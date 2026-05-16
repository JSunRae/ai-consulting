# Launch Hardening Handover

Last updated: 2026-05-12

## Scope Closed In This Pass

- metadata and structured-data hardening on critical public pages
- sitemap correction for missing public blog coverage
- first-party event taxonomy and front-end tracking hooks
- privacy and trust-copy update for downloads, chat usage, and tracked CTA behavior
- services-to-checklist internal-link path
- repo hygiene improvement for transient tmp outputs

## Tracking Model

The site now uses a simple first-party event layer in the front end.

Implementation intent:

- standardize event names before any analytics vendor is connected
- keep payloads limited to route, label, asset name, offer, section, and high-level chat intent
- avoid sending full free-text form or chat content through analytics hooks
- remain compatible with static-site deployment

Primary events:

- `cta_click`
  - trigger: prominent button or contact-route click
  - payload: `cta_label`, `destination`, `offer`, `section`
- `checklist_download_click`
  - trigger: AI vendor checklist PDF click
  - payload: `asset_name`, `asset_format`, `section`
- `resume_download_click`
  - trigger: resume PDF click
  - payload: `asset_name`, `asset_format`
- `contact_form_submit_success`
  - trigger: successful contact form submission
  - payload: `inquiry`, `preferred_step`, `timeline`, `callback_preference`, `source_offer`, `source_cta`
- `newsletter_form_submit_success`
  - trigger: successful newsletter submission
  - payload: `source_page`
- `chat_open`
  - trigger: chatbot launcher opened
  - payload: `assistant_title`, `page_variant`
- `chat_prompt_submitted`
  - trigger: user sends a chat message
  - payload: `intent_tag`, `prompt_length`, `page_variant`
- `chat_suggestion_click`
  - trigger: suggestion chip clicked
  - payload: `suggestion_label`, `intent_tag`, `page_variant`

Compatibility notes:

- the event layer is usable now even without a live analytics vendor
- events are dispatched as browser events and can be consumed later by `dataLayer`, `gtag`, Plausible, or another lightweight platform
- if a vendor is added later, keep the privacy position: event-level signals only, not full message content

## QA Notes

Verified on local production-style host:

- homepage renders with correct global CTA language
- services page includes a direct checklist route for the vendor-diligence path
- contact page renders with live Formspree intake and explicit trust copy
- blog index renders and links correctly
- vendor diligence, customer-service AI, and AI cost-reduction articles render with article metadata and internal cross-links

Still manual / human-device only:

- physical iPhone / iPad Safari pass
- final analytics-vendor verification if an external measurement platform is connected later

## Discoverability Notes

- `assets/docs/` remains blocked from indexing in `robots.txt`; this is correct for downloadable assets
- the discoverable canonical page for the checklist remains the blog article, not the raw asset URL
- the sitemap now includes the previously missing public blog URL

## Repo Hygiene Notes

- transient `tmp/` outputs are now ignored at the repo level
- unrelated existing tmp artifacts were not deleted automatically in this pass
- deploy from an intentionally reviewed scope rather than from the full dirty worktree

## Deferred SEO Page Recommendations

1. AI software consultant
   - recommended format: dedicated service page
   - likely parent offer: AI Software & Vendor Due Diligence
   - likely CTA: Book Fit Call

2. AI vendor due diligence
   - recommended format: dedicated service page
   - likely parent offer: AI Software & Vendor Due Diligence
   - likely CTA: Download Checklist

3. customer service AI consultant
   - recommended format: dedicated page or strong service subsection
   - likely parent offer: Commercial Workflow Deployment
   - likely CTA: Book Fit Call

4. build vs buy AI advisory
   - recommended format: blog article supported by service subsection
   - likely parent offer: AI Software & Vendor Due Diligence
   - likely CTA: Download Checklist

5. AI strategy consultant Germany / DACH
   - recommended format: dedicated service page
   - likely parent offer: Decision Opportunity Prioritization Sprint
   - likely CTA: Book Fit Call