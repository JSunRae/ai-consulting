# German Localization Roadmap

Last updated: 2026-05-07

## Goal

Add a German-language version of the site without weakening SEO, lead routing, or legal clarity.

This should be treated as a controlled localization project, not a one-pass translation exercise.

## Recommended Approach

Use a separate German page set under a dedicated folder:

- `/de/index.html`
- `/de/about.html`
- `/de/services.html`
- `/de/portfolio.html`
- `/de/resume.html`
- `/de/contact.html`
- `/de/privacy.html`
- `/de/blog/...` only if and when translated

Reason:
- easiest for static hosting
- clear language separation
- allows proper `hreflang` mapping
- keeps English pages stable

## Scope Decision

### Phase 1: Core conversion pages only

Translate first:
- home
- about
- services
- resume
- contact
- privacy
- key navigation and footer

Keep English-only for now:
- most blog posts
- less important portfolio pages if not yet localized

This avoids fake completeness and keeps maintenance manageable.

## What Must Change

### 1. Information Architecture

Need:
- `/de/` folder structure
- German nav links pointing to German pages
- language switcher visible in header and footer
- each language switcher should preserve page intent where possible

Example mapping:
- `/index.html` <-> `/de/index.html`
- `/services.html` <-> `/de/services.html`
- `/contact.html` <-> `/de/contact.html`

If no translated equivalent exists yet:
- send to German homepage or show English page with an explicit notice

### 2. SEO / Technical Meta

Need per-page:
- German `<html lang="de">`
- localized title and meta description
- canonical tags per language page
- `hreflang="en"` and `hreflang="de"`
- optional `x-default` to English homepage or primary version
- German sitemap entries
- robots review to ensure German pages are indexable

### 3. Content Translation Rules

Do not do literal translation only.
Translate for buyer clarity in DACH business language.

Guardrails:
- keep Jason's positioning intact: commercial operator -> analytics architect -> applied AI leader
- avoid startup-hype German phrasing
- keep offer names consistent where English naming has positioning value
- decide case by case whether offer names remain English or get paired labels

Recommended approach:
- keep brand/product names in English where they function as offer labels
- translate explanatory copy around them into German

Example:
- `Commercial Analytics Diagnostic Review` can stay as the offer name
- supporting copy becomes German

### 4. Contact Flow

Need on German contact page:
- all visible form labels and helper text translated
- inquiry options translated consistently
- hidden source tracking kept identical in field names
- Formspree endpoint can remain the same unless separate routing is desired
- success and error messaging localized

Need routing decision:
- whether inbound German leads receive English internal email subject labels or German ones

Recommended:
- keep hidden internal values stable in English where useful for back-office consistency
- localize only the display labels

### 5. JavaScript / Shared UI

Review these files for hard-coded English strings:
- `js/main.js`
- `js/forms.js`
- `js/chatbot.js`
- any blog/archive scripts with visible labels

Recommended implementation pattern:
- add page-level language attribute detection
- use per-language string maps for dynamic labels
- avoid duplicating large JS files for German

Priority strings to localize:
- navigation labels
- CTA labels
- form validation messages
- success/error notices
- back-to-top label
- chatbot prompts and answers

### 6. Chatbot / AI Layer

Need a clear policy before launch:
- German chatbot fully supported
- German only for scripted responses
- or German routes user to contact form

Recommended Phase 1:
- localized prompt text and UI labels
- German quick-reply options
- if response quality is not reliable, say that written German inquiries are welcome and Jason will reply directly

Do not claim fluent automated German advisory if not tested.

### 7. Legal / Privacy

Need review of:
- privacy notice in German
- cookie/analytics wording if applicable
- contact form consent wording in German
- any data-processing wording tied to AI-assisted intake

Important:
- German translation should be legally clear, not just linguistically correct
- if the site targets DACH consulting buyers explicitly, the German privacy version should be reviewed carefully before launch

### 8. Resume / Portfolio Positioning

Need a style rule:
- some CV/employment titles may stay in English because they are official job titles
- explanatory summaries can be translated
- quantify outcomes the same way in both languages

Recommended:
- keep company names, official roles, and product/tool names in original language
- translate surrounding explanation and value statements

## UX Requirements

Language switcher should:
- be always visible in the sticky header
- use simple labels like `EN | DE`
- clearly indicate current language
- work on mobile without burying it in too many taps

Do not:
- auto-switch based on browser locale without consent
- mix English and German randomly on the same page

## Content Workflow

Recommended workflow:
1. Define source English page as canonical content source
2. Create German translation draft
3. Review for commercial clarity, not just grammar
4. Review for SEO keywords in German
5. Review forms, CTAs, and metadata
6. Publish with hreflang and sitemap updates
7. Re-check internal links and conversions

## Priority Keyword Work Needed

Before shipping German SEO pages, decide target phrasing for terms like:
- Commercial Analytics
- Pricing Analytics
- Margin Analysis
- Forecasting
- CRM Governance
- Executive Reporting
- Applied AI
- Decision Intelligence

Reason:
- direct literal translations may not match search behavior in Germany
- some English terms may actually perform better with German buyers

## Build Checklist

### Phase 1 build tasks
- create `/de/` page copies for core pages
- add language switcher to shared header/footer
- add language-aware strings in JS
- localize metadata
- localize forms and success states
- add hreflang tags
- update sitemap
- test all internal links

### Phase 2 tasks
- localize selected portfolio pages
- localize selected blog posts
- decide whether German chatbot support becomes deeper
- add German downloadable documents if needed

## Risks

- inconsistent offer naming across languages
- poor direct translation of commercial concepts
- English JS messages leaking into German pages
- untranslated meta tags harming professionalism
- blog/localized-page maintenance burden
- legal phrasing mistakes in privacy/contact language

## Recommended Launch Order

1. Build German homepage, services, and contact pages first
2. Add the language switcher and hreflang support
3. Localize privacy page before driving traffic
4. Add German about and resume pages
5. Localize only the strongest portfolio or blog content after conversion pages work

## Decision Log Still Needed

Before implementation, confirm:
- whether offer names stay in English or become bilingual
- whether blog stays mostly English initially
- whether chatbot gets real German support in phase 1
- whether contact-form notifications should include a `language=de` marker
- whether Jason wants German-first copy to sound more corporate or more advisory
