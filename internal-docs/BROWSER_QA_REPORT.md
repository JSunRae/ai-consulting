# Browser QA Report

Last updated: 2026-05-12

## Environment

- Local production-style host: `http://127.0.0.1:4173`
- Browser surface: Codex in-app browser
- Verification mode: rendered-page QA plus source-code cross-check where external submission or query-state visibility was not practical to verify live

## Pages Checked

### Desktop

- `index.html`
  - confirmed headline, CTA ladder, and hero layout render correctly
  - confirmed nav CTA shows `Book Fit Call`
- `services.html`
  - confirmed service intro, buyer-aid section, and pricing section render correctly
  - confirmed `EUR 950 net` is visible
- `contact.html`
  - confirmed fit-call framing, trust block, and intake form render correctly
- `blog/index.html`
  - confirmed lead magnets and archive entry path render correctly
- `blog/build-vs-buy-ai-decision-matrix.html`
  - confirmed article hero and decision-matrix CTA blocks render correctly

### Mobile

- `index.html`
  - confirmed hero remains readable on a narrow viewport
  - confirmed mobile nav opens and exposes the main CTA

## Interaction Checks

- chat assistant
  - confirmed chat launcher exists and becomes interactable
  - tested pricing prompt
  - tested build-vs-buy prompt
  - confirmed pricing response contains `EUR 950 net`
  - confirmed build-vs-buy response references workflow/control logic
- CTA routing
  - confirmed rendered pages route into the contact path and service ladder
  - source-code cross-check confirms CTA query parameters normalize to `service`, `offer`, `source`, `source_path`, `cta`, and `section`
- lead-magnet assets
  - confirmed PDF links are present on the rendered pages
  - source-code and HTTP checks confirm the public asset paths resolve
- contact form
  - confirmed rendered form and trust copy on the public page
  - submitted one explicit QA payload to the live Formspree endpoint with `QA TEST - please ignore`
  - received `200` and a successful Formspree confirmation page

## Limitations

- The in-app browser normalized contact-page URLs to `/contact`, which made live query-string visibility unreliable in the browser address readout.
- Because of that, contact-page source routing was verified by:
  - rendered-page checks
  - `js/main.js` CTA annotation logic
  - `js/forms.js` query-prefill logic

## Verdict

- Desktop QA: pass
- Mobile QA: pass
- Chat prompt behavior: pass
- Lead-magnet rendering and access paths: pass
- Contact-form rendering and routing logic: pass
- Live external form submission: pass
