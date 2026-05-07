# Jason Rae - Commercial Analytics & Applied AI Website

A professional website serving as both a digital resume and a commercial decision-systems platform for Jason Rae, Senior Data Analyst EMEA, Commercial Analytics Architect, and Applied AI & Decision Intelligence Leader based near Stuttgart, Germany.

Production domain: [jasonrae.ai](https://jasonrae.ai)
Registrar: Cloudflare Registrar

## 🎯 Purpose

1. **Job Applications** - A polished digital resume for data science and AI leadership roles (€100k+)
2. **Consulting Services** - Lead generation platform for forecasting, pricing, margin, CRM, executive reporting, workflow improvement, and applied AI engagements

## 🚀 Features

- **Interactive AI Chatbot** - Answers questions about Jason's experience and skills (powered by `assets/data/resume.json`)
- **Portfolio Showcase** - Proof-of-work landing page, structured data, and case-study metadata generated from `assets/data/projects.json`
- **Selected Delivery Stack** - Technical platforms framed behind the commercial decision work
- **Lead Capture** - Commercial Analytics Health Check intake, Formspree-ready forms with email fallback, email-led booking flow, newsletter signup
- **Blog** - SEO-targeted articles in `blog/`
- **Responsive Design** - Mobile-first, `css/responsive.css` utility layer, tested down to 320 px

## 🎥 Optional: Hero Avatar Intro Video (Synthesia / HeyGen)

- Target: 30–45 seconds, calm/confident/non-salesy.
- Positioning line: "Commercial operator to analytics architect to applied AI leader."
- The homepage hero (`index.html`) includes a styled placeholder block you can replace with a real `<video>` tag (MP4/WebM) or a provider embed snippet.

## 📁 Project Structure

```text
AI_Consulting/
├── generate_portfolio_pages.py  # Generates portfolio sections and case-study metadata from assets/data/projects.json
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
│   └── portfolio.js       # Portfolio filter interactions for generated cards
├── blog/
│   ├── index.html         # Blog listing page
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
    │   ├── SETUP_GUIDE.md         # Launch-day setup steps for Formspree, Calendly, profile photo, and Netlify
    │   └── TODO.md                # Consolidated pre-launch checklist and audit log
    └── data/
        ├── resume.json            # Structured resume data (chatbot source)
        └── projects.json          # Portfolio project data
```

## 🛠️ Tech Stack

- HTML5, CSS3, JavaScript (Vanilla — no framework, no build step)
- CSS Custom Properties for theming
- Font Awesome icons (CDN)
- Google Fonts — Inter + JetBrains Mono
- Formspree for direct lead capture and newsletter submissions when configured, with mailto fallback in the meantime
- Email-led booking flow, with optional future Calendly support

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

The site is static, but the portfolio and case-study metadata are generated from `assets/data/projects.json`.

```bash
# Refresh generated portfolio and case-study HTML after editing project data
npm run build
```

After that, pick any local serving method:

```bash
# Option 1 — npm (recommended, uses package.json scripts)
npm run build           # regenerate portfolio landing page + case-study metadata from JSON
npm start              # serve . — serves the site locally
npm run dev            # npx live-server with auto-reload on port 3000

# Option 2 — Python
python -m http.server 8000

# Option 3 — VS Code
# Install the "Live Server" extension, then right-click index.html → Open with Live Server
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

## 📦 Deploying

```bash
# GitHub Pages
npm run deploy:gh-pages

# Netlify (requires Netlify CLI logged in)
npm run deploy:netlify
```

> The site is fully static, but the checked-in security headers are configured in `netlify.toml`. Other hosts can serve the files, but equivalent CSP and security headers should be configured separately.

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
