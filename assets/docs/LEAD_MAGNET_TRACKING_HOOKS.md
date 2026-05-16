# Lead Magnet Tracking Hooks

Last updated: 2026-05-12

## Purpose

Define future-ready attachment points for lead-magnet tracking and follow-up without building gated capture or nurture automation in this phase.

## Required hook points

Every public lead-magnet module should expose these values either as query parameters on the secondary CTA, data attributes on the download CTA, or both.

- `download event`
  - Trigger: click on public PDF download link
  - Suggested event name: `lead_magnet_download`
- `source page`
  - Example values: `index.html`, `services.html`, `blog/index.html`, `blog/ai-vendor-due-diligence-checklist.html`
- `content pillar`
  - Example values: `vendor-diligence`, `build-vs-buy`, `service-automation`, `ai-roi`
- `follow-up intent tag`
  - Example values: `ai-software-diligence`, `workflow-deployment`, `diagnostic-review`, `prioritization`

## Public CTA conventions

### Download links

Use data attributes for future analytics binding:

- `data-track="lead-magnet-download"`
- `data-source-page="..."`
- `data-content-pillar="..."`
- `data-follow-up-intent="..."`

### Secondary contact links

Use query parameters so the contact form can preserve source context now:

- `service`
- `source`
- `source_path`
- `offer`
- `cta`
- `section`

Example:

`contact.html?service=vendor-diligence&source=blog/ai-vendor-due-diligence-checklist.html&source_path=/blog/ai-vendor-due-diligence-checklist.html&offer=vendor-diligence&cta=Book%20Fit%20Call&section=vendor-diligence-bottom-cta`

## Current lead magnets

### 1. AI Vendor Due Diligence Checklist

- Public asset: `assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf`
- Source markdown: `assets/docs/AI-Vendor-Due-Diligence-Checklist.md`
- Content pillar: `vendor-diligence`
- Follow-up intent tag: `ai-software-diligence`

### 2. Build-vs-Buy AI Decision Matrix

- Public asset: `assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf`
- Source markdown: `assets/docs/Build-vs-Buy-AI-Decision-Matrix.md`
- Content pillar: `build-vs-buy`
- Follow-up intent tag: `ai-software-diligence`

## Future attachment model

When tracking or follow-up is added later:

1. Bind click analytics to every `data-track="lead-magnet-download"` CTA.
2. Persist the source values into session storage or a hidden form field only after consent decisions are settled.
3. Map follow-up intent tags to manual outreach or a future nurture sequence.
4. Keep downloads ungated unless the funnel strategy changes intentionally.
