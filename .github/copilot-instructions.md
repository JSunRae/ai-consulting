# Copilot Instructions for Jason Rae's Commercial Analytics Website

## Project Overview
This is a personal website/portfolio for Jason Rae, a Senior Data Analyst EMEA, Commercial Analytics Architect, and Applied AI & Decision Intelligence Leader based near Stuttgart, Germany. The site serves dual purposes:
1. **Professional Resume** - For job applications targeting data science and AI leadership roles (€100k+ positions)
2. **Commercial Analytics Consulting Platform** - Lead generation for forecasting, pricing, margin, CRM, executive reporting, and applied AI engagements

## Tech Stack
- **Framework**: Vanilla HTML5, CSS3, JavaScript (keeping it simple and fast)
- **Styling**: Custom CSS with CSS Variables for theming
- **Icons**: Font Awesome or custom SVGs
- **Fonts**: Google Fonts (professional sans-serif)
- **Hosting**: Static site (can deploy to GitHub Pages, Netlify, or Vercel)

## Design Guidelines

### Visual Identity
- **Color Palette**: Dark mode with accent colors
  - Primary: Deep navy/dark (#0a192f)
  - Secondary: Slate (#1e293b)
  - Accent: Electric blue (#64ffda) or cyan
  - Text: Light gray (#ccd6f6) and white
- **Typography**: Clean, modern sans-serif (Inter, Poppins, or similar)
- **Style**: Professional, high-end, commercial-analytics-forward aesthetic

### UX Principles
- Mobile-first responsive design
- Fast loading (optimize images, minimal dependencies)
- Clear navigation (max 6-8 menu items)
- Prominent CTAs throughout
- Subtle animations and micro-interactions
- Accessible (WCAG 2.1 AA compliant)

## Content Tone
- **Professional yet approachable**
- **Results-focused**: Always include metrics and outcomes
- **Client-centric**: Frame achievements in terms of value delivered
- **Pioneer language**: Use verbs like "pioneered," "spearheaded," "transformed"

## Key Features to Implement

### 1. Interactive AI Chatbot
- Embedded chat widget trained on Jason's resume/portfolio
- Can answer questions about skills, projects, experience
- Demonstrates AI and analytics credibility directly

### 2. Portfolio with Business-Relevant Proof
- Showcase production-grade build capability plus sanitized commercial analytics case studies
- Connect technical builds to governance, automation, observability, compliance, or decision-system relevance
- Each project/case study: Problem → Logic Fix / Solution → Quantified or public-safe Result

### 3. Daily AI Stack Section
- Visual display of AI tools used daily
- GPT-4, LangChain, Power BI, Python, TensorFlow, etc.

### 4. Lead Capture
- Contact forms on multiple pages
- Calendar booking integration for a Commercial Analytics Health Check
- Newsletter signup with resource download

### 5. SEO Optimization
- Semantic HTML structure
- Meta tags for all pages
- Schema.org markup for Person/Organization
- Fast Core Web Vitals

## File Structure
```
AI_Consulting/
├── index.html              # Homepage
├── about.html              # About Me page
├── portfolio.html          # AI Projects/Case Studies
├── services.html           # Consulting Services
├── resume.html             # Interactive Resume/CV
├── contact.html            # Contact & Lead Capture
├── blog/                   # Blog posts (future)
│   └── index.html
├── css/
│   ├── style.css          # Main styles
│   ├── variables.css      # CSS custom properties
│   └── components.css     # Reusable components
├── js/
│   ├── main.js            # Main JavaScript
│   ├── chatbot.js         # AI chatbot functionality
│   └── animations.js      # Scroll animations
├── assets/
│   ├── images/            # Photos, icons, graphics
│   ├── docs/              # Downloadable CV, resources
│   └── data/              # JSON data files
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## Jason Rae's Key Information

### Professional Summary
- **Title**: Senior Data Analyst EMEA | Commercial Analytics Architect | Applied AI & Decision Intelligence Leader
- **Location**: Stuttgart area, Germany
- **Experience**: 13+ years across sales leadership, commercial analytics, pricing, forecasting, margin analysis, CRM governance, and applied AI
- **Current Role**: Senior Data Analyst EMEA at Medline (Jan 2026-Present)
- **Previous**: Senior Data Analyst Europe, Inside Sales Department Manager / BDM UK, Inside Sales Department Manager, Account Manager at Medline

### Key Achievements
- Delivered €3M sales growth against an initial target of roughly €300k
- Generated €1.3M UK sales growth in 2023, approximately 4× above target
- Turned around Inside Sales growth from 4% to 57% across 38 markets
- Grew an Australian territory from $1.4M to $4.2M with 35% profitability
- Contributed to EMEA analytics transformation, including Power BI semantic models, standardized reporting, and KPI governance
- Helped realign CRM and forecasting processes across European markets

### Daily AI Stack
- GPT-4 (OpenAI)
- LangChain
- Microsoft Power BI
- Python (pandas, scikit-learn, TensorFlow)
- Excel (VBA) & SQL
- Tableau

### Positioning Guardrails
- Lead with forecasting, pricing, margin, CRM, incentives, executive reporting, and decision systems
- Emphasize practical implementation, auditable workflows, and messy real-world data
- Avoid leading with generic AI consultant language or hype-driven startup framing
- Preferred phrase: Commercial operator -> analytics architect -> applied AI leader

## Subagent Tasks
When delegating work to subagents, provide:
1. Clear scope of which page/feature to work on
2. Reference to this copilot-instructions.md
3. Specific acceptance criteria
4. Design tokens and style references

## Quality Checklist
- [ ] Responsive on mobile, tablet, desktop
- [ ] All links work correctly
- [ ] Images optimized and have alt text
- [ ] Forms validate and show feedback
- [ ] Smooth animations (60fps)
- [ ] SEO meta tags present
- [ ] Accessible keyboard navigation
- [ ] Cross-browser tested
