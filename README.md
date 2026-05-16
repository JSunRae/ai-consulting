# Jason Rae - Commercial Analytics & Applied AI Website

A professional website for Jason Rae's commercial analytics and applied AI advisory practice, with supporting resume and proof-of-work pages for recruiters, hiring managers, and consulting buyers.

Production domain: [jasonrae.ai](https://jasonrae.ai)
Registrar: Cloudflare Registrar

## 🎯 Purpose

1. **Consulting Services** - Lead generation platform for forecasting, pricing, margin, CRM, executive reporting, workflow improvement, and applied AI engagements
2. **Leadership Positioning** - A polished public profile and resume path for Head / Director-level analytics and BI / AI transformation roles

## 🚀 Features

- **Interactive AI Chatbot** - Answers questions about Jason's experience and skills (powered by `assets/data/resume.json`)
- **Portfolio Showcase** - Proof-of-work landing page, structured data, and case-study metadata generated from `assets/data/projects.json`
- **Selected Delivery Stack** - Technical platforms framed behind the commercial decision work
- **Lead Capture** - Commercial Analytics Diagnostic Review intake, live Formspree submissions, email-led booking flow, newsletter signup
- **Blog** - SEO-targeted articles in `blog/`
- **Social Archive** - JSON-driven X and LinkedIn archive that publishes only approved historical and live posts while keeping draft and queue state private
- **Responsive Design** - Mobile-first, `css/responsive.css` utility layer, tested down to 320 px

## 🎥 Optional: Hero Avatar Intro Video (Synthesia / HeyGen)

- Target: 30–45 seconds, calm/confident/non-salesy.
- Positioning line: "Commercial operator to analytics architect to applied AI leader."
- The homepage hero (`index.html`) includes a styled placeholder block you can replace with a real `<video>` tag (MP4/WebM) or a provider embed snippet.

## 📁 Project Structure

```text
AI_Consulting/
├── generate_portfolio_pages.py  # Generates portfolio sections and case-study metadata from assets/data/projects.json
├── scripts/build_public_bundle.py # Builds the deployable site-dist bundle and public social archive export
├── index.html              # Homepage
├── about.html              # About Me
├── portfolio.html          # Proof of Work, Commercial Case Studies, and Build Capability
├── services.html           # Productized Consulting Offers
├── resume.html             # Interactive Resume/CV
├── contact.html            # Contact & Lead Capture
├── privacy.html            # Privacy Policy
├── sitemap.xml             # XML sitemap (jasonrae.ai)
├── robots.txt              # Crawler directives
├── css/
│   ├── variables.css      # CSS custom properties & design tokens
│   ├── style.css          # Main stylesheet
│   ├── components.css     # Reusable UI components
│   └── responsive.css     # Breakpoint overrides & mobile utilities
├── js/
│   ├── main.js            # Core functionality (nav, menu)
│   ├── chatbot.js         # AI chat widget
│   ├── animations.js      # IntersectionObserver scroll effects
│   ├── forms.js           # Contact & newsletter form handling (Formspree)
│   ├── portfolio.js       # Portfolio filter interactions for generated cards
│   └── social-archive.js  # Social archive rendering and filters
├── blog/
│   ├── index.html         # Blog listing page
│   ├── social-posts.html  # Social archive page for published history and imported posts
│   └── *.html             # Individual articles
└── assets/
    ├── images/
    │   ├── og-image.png           # Open Graph image (1200×630)
    │   ├── og-image.svg           # Source SVG for og-image
    │   ├── favicon.svg            # SVG favicon (512×512)
    │   ├── profile-placeholder.svg
    │   └── hero-video-placeholder.svg
    ├── docs/
    │   ├── Jason-Rae-Resume.pdf   # Downloadable CV
    │   ├── SOCIAL_CONTENT_OPERATING_PLAN.md # Social/news drafting and publishing workflow plan
    │   ├── SETUP_GUIDE.md         # Launch-day setup steps for Formspree, Calendly, profile photo, and Netlify
    │   └── TODO.md                # Consolidated pre-launch checklist and audit log
    └── data/
        ├── resume.json            # Structured resume data (chatbot source)
        ├── projects.json          # Portfolio project data
        ├── social-posts.json      # Internal short-form queue, approval state, and published links
        └── social-posts.public.json # Public-safe published archive generated at build time
```

## 🛠️ Tech Stack

- HTML5, CSS3, JavaScript (Vanilla front end)
- Python build step for portfolio generation and deploy-bundle assembly
- CSS Custom Properties for theming
- Font Awesome icons (CDN)
- Google Fonts — Inter + JetBrains Mono
- Formspree for live lead capture and newsletter submissions
- Email-led booking flow, with optional future Calendly support

## Social Content System

- Public archive page: `blog/social-posts.html`
- Public archive data source: `assets/data/social-posts.public.json`
- Internal workflow state: `assets/data/social-posts.json`
- Feed configuration: `assets/data/social-sources.json`
- Front-end renderer: `js/social-archive.js`
- Public bundle builder: `scripts/build_public_bundle.py`
- Operating plan: `assets/docs/SOCIAL_CONTENT_OPERATING_PLAN.md`
- Prompt pack for remaining repo work: `assets/docs/REPO_FINISH_PROMPTS.md`
- Deployment and automation handoff: `assets/docs/DEPLOY_AND_AUTOMATION_RUNBOOK.md`
- Local env template for automation secrets: `.env.example`
- Draft generator: `scripts/social_draft_pipeline.py`
- Buffer scheduler/sync bridge: `scripts/social_buffer_publish.py`
- Historical archive importer: `scripts/social_archive_import.py`
- Saved LinkedIn activity extractor: `scripts/extract_linkedin_saved_activity.py`
- LinkedIn markdown activity importer: `scripts/import_linkedin_activity_markdown.py`
- LinkedIn public-activity JSON importer: `scripts/import_linkedin_public_activity_json.py`
- Repo preflight checker: `scripts/repo_preflight.py`
- JavaScript syntax checker: `scripts/check_js_syntax.mjs`
- Release-scope checker: `scripts/release_scope_check.py`
- Recommended runtime: `.github/workflows/social-draft.yml`
- Scheduled publishing runtime: `.github/workflows/social-publish.yml`
- Continuous verification runtime: `.github/workflows/ci.yml`

The operational archive keeps historical imports, ready drafts, scheduled posts, and published URLs in one internal state file. The public site ships a derived `social-posts.public.json` export that contains published-safe records only. The operating-plan document defines the recommended morning workflow for research, drafting, review, approval, posting, and archive sync.

Because the website itself is static, any OpenAI-backed drafting or platform posting must run in a secure server-side or local automation context. Never expose live API keys in HTML, front-end JavaScript, or checked-in JSON files.

## Recommended Automation Runtime

The best fit for this repo is `GitHub Actions`.

Why it wins here:

- Repo-native: the workflow can update `assets/data/social-posts.json` directly while the build step derives the public archive export without introducing a second operational state store.
- Secure enough for this phase: OpenAI and posting credentials live in GitHub Actions secrets, not the static site.
- Good approval ergonomics: each run can upload a private markdown approval artifact while draft and queue state stay out of the public archive.
- Cheap and low-friction: no extra infrastructure is required to start the draft-only flow.

Tradeoffs versus the alternatives:

- `Netlify Scheduled Functions`
  - Pros: close to the hosting platform, easy secret storage, good if the site eventually needs server-side runtime behavior.
  - Cons: weaker repo-native audit trail, less convenient for committing archive JSON back to git, and less comfortable for private approval artifacts.
- `Pipedream` or `n8n`
  - Pros: easier connector setup for multi-step posting and approval routing.
  - Cons: introduces an external control plane and state surface too early, which is unnecessary while the workflow is still draft-only.
- Local-only cron or Task Scheduler
  - Pros: full control, no hosted runner needed.
  - Cons: not reliable as the primary morning runtime because it depends on one machine being awake and configured correctly.

Recommendation:

- Use `GitHub Actions` now for `research -> OpenAI draft generation -> approval artifact -> archive sync`.
- Add Buffer or another broker later when you move from draft-only to actual publishing.

## 🎨 Design System

### Colors

- **Background**: `#0a192f` (deep navy)
- **Surface**: `#112240` (dark blue)
- **Accent**: `#64ffda` (cyan/teal)
- **Text Primary**: `#ccd6f6` (light slate)
- **Text Secondary**: `#8892b0` (slate)

### Typography

- **Headings**: Inter, 700 weight
- **Body**: Inter, 400/500 weight
- **Code/URL**: JetBrains Mono

## 🚀 Running Locally

The site is static at runtime, but the deploy bundle is generated before serving or publishing.

```bash
# Refresh generated portfolio pages, the public social archive export, and the site-dist deploy bundle
npm run build

# Run the repo guardrails used locally and in CI
npm run verify
```

After that, pick any local serving method:

```bash
# Option 1 — npm (recommended, uses package.json scripts)
npm run build          # regenerate portfolio content + public-safe deploy bundle in site-dist/
npm start              # serve site-dist/ — matches the production publish surface
npm run dev            # serve the repo root on port 3000 for authoring/debugging

# Option 2 — Python
python -m http.server 8000 --directory site-dist

# Option 3 — VS Code
# Install the "Live Server" extension, then open site-dist/index.html with Live Server after npm run build
```

Then open `http://localhost:3000` (or the port shown in the terminal).

## ⚙️ Environment Variables / IDs to Set Before Deploying

These are the remaining values or decisions to confirm before going live:

| Location | Placeholder / Default | What to Set |
| --- | --- | --- |
| `js/forms.js` | `'xeqkyzoq'` (Formspree form ID) | Your production Formspree form ID |
| `contact.html` booking CTA | Email-led scheduling is currently live | Replace only if you want direct Calendly booking |
| Optional LinkedIn Insight Tag snippet | Not installed by default | Add only if campaigns require it and you have a real LinkedIn partner ID |
| All `<meta property="og:image">` tags | Use the absolute production URL | Keep `https://jasonrae.ai/assets/images/og-image.png` on every page |
| `assets/data/resume.json` | Current public-safe version | Keep synchronized with resume copy and downloadable PDF |
| `assets/data/projects.json` | Public-safe case study data | Keep synchronized with portfolio framing and chatbot responses |

## 🔐 Automation Secrets

If you build the planned social-content workflow, keep secrets in a local or server-side `.env` file derived from `.env.example`.

- Required for LLM drafting: `OPENAI_API_KEY`
- Recommended defaults: `OPENAI_MODEL`, `SOCIAL_TIMEZONE`, `SOCIAL_APPROVAL_MODE`, `SOCIAL_AUTO_POST_ENABLED`
- Optional news ingestion: `NEWS_API_KEY`
- Posting credentials: `BUFFER_ACCESS_TOKEN` and/or X API credentials
- Approval routing: `SOCIAL_APPROVAL_WEBHOOK_URL`

Rules:

- `.env` is already ignored by git and should stay untracked.
- Do not place real keys in `index.html`, `js/`, `assets/data/`, or any other public file.
- For Netlify or another scheduler, store the same values as environment variables in that platform instead of committing them.

### Running the Draft Pipeline

Local run:

```bash
npm run social:draft
```

Useful flags:

```bash
python scripts/social_draft_pipeline.py --mock-openai
python scripts/social_draft_pipeline.py --approval-dir artifacts/social-approval
python scripts/social_buffer_publish.py --publish --sync
python scripts/social_archive_import.py --input assets/data/social-history-template.csv --dry-run
python scripts/extract_linkedin_saved_activity.py --input-html "C:\\path\\to\\saved-linkedin-activity.html" --archive-path assets/data/social-posts.json
python scripts/import_linkedin_activity_markdown.py --input-md "C:\\path\\to\\linkedin_activity_posts_extracted.md" --archive-path assets/data/social-posts.json
python scripts/import_linkedin_public_activity_json.py --input-json "C:\\path\\to\\LinkedIn_Public_Activity_Extract.json" --archive-path assets/data/social-posts.json
python scripts/repo_preflight.py
node scripts/check_js_syntax.mjs
python scripts/release_scope_check.py --scope minimal
```

GitHub Actions runtime:

- Workflow file: `.github/workflows/social-draft.yml`
- Secrets to set: `OPENAI_API_KEY`
- Optional repository variables or secrets: `OPENAI_MODEL`, `SOCIAL_TIMEZONE`, `SOCIAL_APPROVAL_MODE`, `SOCIAL_AUTO_POST_ENABLED`

Each workflow run produces:

- a private approval artifact in `artifacts/social-approval/`
- a synced draft record in `assets/data/social-posts.json` when the quality threshold is met
- a published-safe `assets/data/social-posts.public.json` export on the next build after publish state is written back

### Voice Intake Scaffold

The repo now also includes a server-side starting point for phone intake:

- `netlify/functions/voice-incoming.mjs`
- `netlify/functions/voice-summary.mjs`
- `netlify/functions/voice-summaries.mjs`
- `netlify/functions/_shared/voice-summary-store.mjs`
- `assets/data/voice-intake-playbook.json`
- `assets/docs/VOICE_CALL_TEST_PLAN.md`

Voice summaries now persist as encrypted records with a 30-day default retention window. In Netlify, the summary path uses a site-scoped Blobs store. For direct non-Netlify testing, the same module can fall back to a local file store when explicitly configured.

Operator-only maintenance now lives behind a separate `VOICE_OPERATOR_SECRET`. That route can list recent summaries, read one stored record, delete one stored record, or manually purge expired records without exposing those operations on the public webhook surface.

This is intentionally backend-only for now. Do not publish a public phone CTA until the SIP provider, webhook secret, operator secret, summary encryption key, and post-call routing are configured.

## 📦 Deploying

```bash
# GitHub Pages
npm run deploy:gh-pages

# Netlify (requires Netlify CLI logged in; publishes site-dist/)
npm run deploy:netlify
```

> The site is fully static, but the checked-in security headers and isolated `site-dist` publish target are configured in `netlify.toml`. Other hosts can serve the bundle, but equivalent CSP and routing headers should be configured separately.

### Current Domain Status

- `jasonrae.ai` is now owned and registered through Cloudflare Registrar.
- The site code already targets `https://jasonrae.ai` in canonical URLs, sitemap entries, robots.txt, and Open Graph metadata.
- GitHub repo is live at `https://github.com/JSunRae/ai-consulting` and the Netlify project is live at `https://jasonrae-ai.netlify.app`.
- The remaining launch work is Cloudflare DNS verification so `jasonrae.ai` and `www.jasonrae.ai` point at Netlify and HTTPS can provision.

### Recommended Production Setup

1. Use Netlify as the production host.
2. Connect the GitHub repo to Netlify.
3. In Netlify, add `jasonrae.ai` as the custom domain.
4. In Cloudflare DNS, point the apex domain to `apex-loadbalancer.netlify.com` using a flattened `CNAME` / `ALIAS` if available, or fallback `A 75.2.60.5` if not.
5. In Cloudflare DNS, point `www` to `jasonrae-ai.netlify.app` with a `CNAME`.
6. After DNS resolves, verify HTTPS, forms, sitemap, and crawlability.

> Do not store personal registrant address, phone number, or email in repo files. Keep public project docs limited to domain ownership status and deployment steps.

## 📝 Customizing Content

1. Update personal information directly in HTML files or via `assets/data/*.json`
2. After changing `assets/data/projects.json`, run `npm run build` to regenerate `portfolio.html` and case-study metadata blocks
3. Modify colors in `css/variables.css`
4. Add project images to `assets/images/projects/`
5. Update chatbot knowledge by editing `assets/data/resume.json` and `assets/data/projects.json`

## 📋 Pre-Launch Checklist

See [`assets/docs/TODO.md`](assets/docs/TODO.md) for the full consolidated pre-launch checklist.
For the exact handoff steps when real IDs and URLs are ready, use [`assets/docs/SETUP_GUIDE.md`](assets/docs/SETUP_GUIDE.md).

## 📧 Contact

- **LinkedIn**: [jason-c-rae](https://www.linkedin.com/in/jason-c-rae/)
- **GitHub**: [JSunRae](https://github.com/JSunRae)
- **Location**: Stuttgart area, Germany

## 📄 License

MIT
