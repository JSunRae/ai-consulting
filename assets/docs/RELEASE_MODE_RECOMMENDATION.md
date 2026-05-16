# Release Mode Recommendation

Last updated: 2026-05-12

## Executive Recommendation

Recommend the **minimal public-site release** for immediate deployment.

That mode delivers the commercial value that matters right now:

- public credibility
- lead capture
- service positioning
- proof-of-work content
- downloadable lead magnets

It avoids shipping internal commercialization material that creates unnecessary exposure, governance burden, and operational noise.

The **full commercialization asset release** should be treated as a later, intentional repository or operations release, not the first public deployment mode.

## Source Notes

This recommendation was built from the available release and deploy documents in the repo:

- `assets/docs/DEPLOY_SCOPE_MANIFEST.md`
- `assets/docs/DEPLOY_AND_AUTOMATION_RUNBOOK.md`
- `assets/docs/LAUNCH_HARDENING_HANDOVER.md`

The requested files `assets/docs/RELEASE_SCOPE_AUDIT.md` and `assets/docs/RELEASE_STAGE_COMMANDS.md` were not present in the workspace at time of review, so their role was inferred from the current manifest, runbook, and handover documentation.

## Release Modes Compared

### 1. Minimal public-site release

Intent:

- ship the public-facing consulting site
- keep only assets required for the live visitor experience
- exclude internal sales, QA, launch, and operations materials from the public release set

Primary contents:

- core site pages
- required CSS and JS
- public blog content
- public downloadable assets that are linked from pages
- routing and discoverability files such as `sitemap.xml` and `robots.txt`

### 2. Full commercialization asset release

Intent:

- ship the public site plus the broader commercialization working set
- include sales enablement documents, audits, runbooks, templates, and operational assets in the deployable scope

Primary contents:

- everything in the minimal public-site release
- internal sales templates and objection handling docs
- QA reports and handover notes
- launch hardening documents
- social operations assets and automation support files
- voice and automation runbooks where present

## Scope, Risk, And Value Comparison

| Dimension | Minimal public-site release | Full commercialization asset release |
| --- | --- | --- |
| Scope | Tight, visitor-facing only | Broad, mixes runtime and operating material |
| Business value at launch | High enough to launch lead generation immediately | Higher internal convenience, but limited extra visitor value |
| Deployment risk | Lower | Higher |
| Exposure risk | Lower | Much higher |
| Governance burden | Low | High |
| Change review complexity | Manageable | Easy to make mistakes |
| Reputational risk | Lower | Higher if internal documents become public URLs |
| Operational flexibility | Good for static-first launch | Better for internal ops, but worse for safe public release |

## Why Minimal Release Wins Now

### 1. The site is still explicitly static-first

The deploy runbook states that the frontend pages deploy independently of the social pipeline and that Netlify Functions are only needed for the voice backend scaffold. That means the public site does not require the broader commercialization operating assets to deliver value.

### 2. Internal docs in `assets/docs/` are still publicly reachable if deployed

The hardening handover notes that `assets/docs/` is blocked from indexing in `robots.txt`. That helps search behavior, but it is **not** access control. On a static host, anything deployed under that path can still be opened directly if the URL is known.

That creates direct exposure risk for documents such as:

- `CHALLENGER_PROPOSAL_TEMPLATE.md`
- `CHALLENGER_DISCOVERY_CALL_SCRIPT.md`
- `OBJECTION_HANDLING_LIBRARY.md`
- `POST_CALL_SUMMARY_TEMPLATE.md`
- `RECOMMENDATION_MEMO_TEMPLATE.md`
- QA and handover files

Those are internal operating assets, not public marketing assets.

### 3. Full commercialization release mixes public value with internal process residue

The broader manifest is useful as a working scope for commercialization, but not all of it belongs in an immediate public deployment. Internal audits, tracking notes, handovers, and operating templates create little or no visitor value while increasing the chance of accidental disclosure.

### 4. Selective staging is already the recommended release discipline

The manifest explicitly says the safe release method is selective staging rather than bulk staging. That aligns directly with a minimal public-site release.

## Public-Runtime Critical Files

These are the files that matter for the live public experience and should be considered the core immediate deployment set.

### Core public pages

- `index.html`
- `services.html`
- `contact.html`
- `about.html`
- `resume.html`
- `portfolio.html`
- `privacy.html`

### Public blog pages in current commercialization scope

- `blog/index.html`
- `blog/ai-vendor-due-diligence-checklist.html`
- `blog/build-vs-buy-ai-decision-matrix.html`
- `blog/customer-service-ai-checklist-before-chatbot.html`
- `blog/ai-cost-reduction-reality-check.html`

### Front-end runtime assets

- `css/style.css`
- any imported CSS required by the current live layout, including supporting files actually referenced by pages
- `js/main.js`
- `js/forms.js`
- `js/chatbot.js`

### Public download and routing assets

- `assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf`
- `assets/docs/AI-Vendor-Due-Diligence-Checklist.html`
- `assets/docs/AI-Vendor-Due-Diligence-Checklist-Printable.html`
- `assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf`
- `assets/docs/Build-vs-Buy-AI-Decision-Matrix-Printable.html`
- `assets/docs/Jason-Rae-Resume.pdf` if linked from the public site
- `sitemap.xml`
- `robots.txt`

### Runtime data assets only if referenced by live pages

- `assets/data/resume.json`
- `assets/data/projects.json`
- `assets/data/social-posts.public.json`

These should only ship if the live front end actually depends on them. Internal automation and future-feature data such as `assets/data/social-posts.json`, `assets/data/social-guidance.json`, `assets/data/social-sources.json`, and `assets/data/voice-intake-playbook.json` should stay out of the immediate public release.

## Internal-Only Files

These should not be part of the immediate public deployment package.

### Sales enablement and operating templates

- `assets/docs/CHALLENGER_PROPOSAL_TEMPLATE.md`
- `assets/docs/CHALLENGER_DISCOVERY_CALL_SCRIPT.md`
- `assets/docs/OBJECTION_HANDLING_LIBRARY.md`
- `assets/docs/POST_CALL_SUMMARY_TEMPLATE.md`
- `assets/docs/RECOMMENDATION_MEMO_TEMPLATE.md`

### QA, audit, and handover documents

- `assets/docs/CHAT_VOICE_ALIGNMENT_AUDIT.md`
- `assets/docs/CHALLENGER_PAGE_AUDIT.md`
- `assets/docs/BROWSER_QA_REPORT.md`
- `assets/docs/LAUNCH_HARDENING_HANDOVER.md`
- `assets/docs/LEAD_MAGNET_TRACKING_HOOKS.md`
- `assets/docs/DEPLOY_SCOPE_MANIFEST.md`
- `assets/docs/DEPLOY_AND_AUTOMATION_RUNBOOK.md`

### Social and operations infrastructure

- social drafting and publishing scripts under `scripts/`
- approval artifacts under `artifacts/`
- research and planning material under `Research and Documentation/`
- transient or scratch outputs under `tmp/`

### Voice and backend scaffolding not required for launch

- `phonebot/`
- any dark or unconnected Netlify voice endpoint scaffolding
- Twilio or OpenAI voice planning docs

## Tradeoffs Explained Clearly

### Minimal public-site release tradeoffs

Benefits:

- fastest safe path to launch
- lowest chance of exposing internal playbooks or sensitive operating logic
- cleanest release review and rollback path
- fully aligned with the current static-first architecture

Costs:

- internal commercialization knowledge stays outside the deployed package
- some future operational assets may need a second release path later
- repo structure remains split between public runtime and internal operating files

### Full commercialization asset release tradeoffs

Benefits:

- one broader release candidate for all commercialization work
- easier for internal collaborators if the repo itself is the operating hub
- includes templates, audits, and enablement material in one bundle

Costs:

- high risk of publishing internal documents behind public URLs
- larger review surface and more staging mistakes
- greater reputational risk if internal templates, scripts, or QA notes become discoverable
- higher confusion between what is runtime-critical and what is simply useful internally

## Immediate Deployment Recommendation

Use **minimal public-site release** now.

That release should include only:

- public pages
- live CSS and JavaScript
- public blog pages
- explicitly linked download assets
- required routing and SEO files
- only the data files that are consumed by the live site

It should exclude:

- internal templates
- QA and audit docs
- runbooks and handovers
- social automation scripts and artifacts
- voice and backend scaffolding that is not active

## Practical Release Rule

If a file does not change what a visitor can load, read, click, submit, or download on the public site, it should default to **internal-only** for the immediate deployment.

## Final Judgment

- **Best immediate deployment mode:** minimal public-site release
- **Best later operational mode:** full commercialization asset release, but only after separating internal-only assets from public web paths or moving them behind non-public storage
- **Key risk to avoid:** treating `robots.txt` as protection for internal files inside deployable static directories
