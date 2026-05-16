# Social Content Operating Plan

## Objective

Build a system that can:

1. Review useful AI, ML, data, and analytics news every morning.
2. Draft one X post and one LinkedIn post in Jason Rae's voice.
3. Fall back to evergreen commercial-analytics angles when the news is weak.
4. Post automatically only when the quality bar is high enough.
5. Sync drafts, scheduled posts, and published URLs back into the website archive.

## Positioning Guardrails

- Lead with forecasting, pricing, margin, CRM governance, executive reporting, workflow simplification, and decision systems.
- Use AI as the multiplier, not the generic headline.
- Keep the core narrative consistent: commercial operator -> analytics architect -> applied AI leader.
- Prefer public-safe claims, practical operating detail, and auditable logic over hype.
- Reuse existing site content before inventing new positioning language.

## Recommended Architecture

### Research and drafting layer

- Use the OpenAI API for source synthesis, topic selection, post drafting, rewrite passes, and quality scoring.
- Keep separate prompts for news summarization, X drafting, LinkedIn drafting, and evaluator scoring.
- Add a repository-backed voice guide so the model keeps Jason's established tone and positioning.

### News intake layer

- Use RSS as the default ingestion method because it is stable, cheap, and easy to audit.
- Start with a curated set of sources across AI, ML, enterprise data, and analytics.
- Good first sources: OpenAI, Anthropic, Microsoft AI, Google DeepMind, NVIDIA, Hugging Face, Databricks, Snowflake, VentureBeat AI, and Techmeme AI.
- Optional enrichment later: NewsAPI, GDELT, or Feedly AI.

### Orchestration layer

- Use a scheduler that handles secrets, retries, and alerts cleanly.
- Practical options: n8n, Pipedream, GitHub Actions, or Netlify Scheduled Functions.
- Prefer structured automation over browser automation for anything production-facing.
- Store the OpenAI key and posting credentials only in local `.env` files or managed secret stores. Do not place them in tracked site files because the website is static.

### Runtime decision

- Recommended runtime: GitHub Actions.
- Why: it is the best match for a repo-backed static site that needs scheduled drafting, private approval artifacts, and direct JSON archive sync without introducing another state store.
- Netlify Scheduled Functions remain a valid second choice once posting is productionized, but they are a weaker fit for git-based archive updates and audit history.
- Pipedream or n8n are strongest when cross-tool approvals and brokered posting become the primary problem, not while the workflow remains repo-native.

### Posting layer

- X can post through the official API or a scheduler that exposes an API.
- LinkedIn personal-profile posting is usually the hardest constraint.
- The pragmatic route is often Buffer or a similar scheduler that supports both channels and exposes an automation entry point.
- Keep drafting and posting separate so approval, retries, and audit history remain clean.

### Site sync layer

- Use assets/data/social-posts.json as the source of truth for short-form records.
- Keep blog/social-posts.html as the public archive page.
- Keep js/social-archive.js as the archive renderer.
- After a post is published, write the returned platform URL back into the matching record.
- Keep commercial routing metadata on the archive record itself rather than in separate planning files.

### Archive metadata for launch execution

Launch-ready records should carry these fields when known:

- `launchWave`
- `launchPriority`
- `pillar`
- `status`
- `contentType`
- `sourceBlogUrl`
- `targetPageUrl`
- `ctaType`
- `preparedDate`
- `commercialIntent`
- `offerAlignment`
- `schedule`

These fields let the same archive object answer four questions without a second state store:

1. What should publish next?
2. Where should each post send traffic?
3. Which offer or lead magnet is being supported?
4. What has already been scheduled or published?

## Daily Operating Flow

### 06:30 Europe/Berlin - Source scan

- Pull the latest entries from the approved feed set.
- De-duplicate by URL, headline similarity, and semantic similarity.
- Score each item for commercial relevance, novelty, source credibility, ability to add Jason-specific insight, and risk of generic commentary.

### 06:40 - Angle selection

- If a news item is genuinely worthwhile, generate one X version, one LinkedIn version, and one optional archive summary note.
- If nothing is strong enough, select from the evergreen bank instead.

### 06:50 - Quality gate

- Run a second-pass evaluator against factual confidence, distinctiveness, brand-voice fit, commercial fit, platform fit, and duplication risk versus recent posts.
- Reject anything that sounds generic, repeats the last few angles, cites unverifiable numbers, or drifts into hype-driven AI commentary.

### 07:00 - Approval or post

- Phase 1: manual approval on every post.
- Phase 2: auto-schedule only high-scoring, low-risk posts.
- Phase 3: keep sensitive topics manual-only even after auto-post is enabled.

## Quality Threshold

Score drafts out of 100 and block any draft with a hard risk flag.

- 30 points: commercial relevance
- 20 points: original perspective
- 20 points: channel fit
- 15 points: brand-voice match
- 15 points: factual safety

Suggested release thresholds:

- 85+: eligible for auto-post if no risk flags exist
- 70-84: queue for manual review
- Below 70: discard or rewrite

## Content Mix

Use a weekly mix instead of forcing news-only posting.

- 40% timely news reactions with Jason-specific interpretation
- 30% evergreen commercial analytics and applied AI viewpoints
- 20% proof-of-work and case-study slices
- 10% personal direction, operating philosophy, and what Jason is building

## Evergreen Pillars

When the news cycle is weak, draw from these themes:

- AI adoption starts with workflow fixes, not theater
- Deterministic LLM systems beat clever demos
- AI ROI needs CFO-grade metrics
- Broken commercial logic destroys good decisions
- Reporting noise is a commercial cost
- Forecast discipline is a behavior problem before it is a model problem
- Pricing control matters more than pricing theory when execution is messy

## Source Material To Reuse

- blog/
- portfolio/
- assets/data/resume.json
- assets/data/projects.json
- assets/data/social-posts.json

These assets already contain the positioning language the automation should reuse instead of improvising.

## Remaining Requirements To Finish Operationalizing

The repo now covers the architecture. What remains is mainly live operations and data.

1. Historical backfill: existing LinkedIn and X posts still need to be imported using `scripts/social_archive_import.py`.
2. Secret management: OpenAI and Buffer credentials still need to be configured in GitHub Actions secrets for live automation.
3. Evidence retention: every news-driven post should keep source URLs and a short evidence note outside the public page.
4. Failure handling: posting failures should move the record into retry state and alert Jason instead of failing silently.
5. Analytics loop: track which post types drive profile visits, site traffic, inquiries, and newsletter signups.
6. Human override: Jason should always be able to block a scheduled post or pin a priority topic for the next morning run.

## Delivery Phases

### Phase 1 - Manual-assisted workflow

- Automate research and drafting.
- Deliver a morning review bundle by email, Slack, or a private dashboard.
- Approve manually, then publish.
- Write final status and URLs back into the archive feed.

### Phase 2 - Semi-autonomous scheduling

- Auto-schedule only low-risk, high-scoring posts.
- Keep controversial, client-adjacent, or metric-heavy content manual.
- Start collecting performance data by pillar and platform.

### Phase 3 - Closed-loop optimization

- Feed engagement results back into topic selection.
- Increase weight on content that drives profile views, site visits, and leads.
- Retire weak patterns and overused angles.

## Immediate Next Steps

1. Configure the GitHub Actions secrets for OpenAI and Buffer.
2. Export and backfill historical posts into `assets/data/social-posts.json`.
3. Decide where morning approvals should arrive if GitHub Actions artifacts are not enough.
4. Add performance tracking once real publishing is live.

## Intentionally deferred

- Email nurture and email capture sequencing remain out of scope for this phase.
- Advanced campaign measurement can be added later, but the archive fields above should be sufficient for later attribution work.
- New stakeholder-specific landing pages remain deferred; current launch CTAs should use existing public pages, assets, and contact routes.

## Current Repo State

As of `2026-05-09`, the repo now contains the following infrastructure:

- `scripts/social_draft_pipeline.py`
  - researches RSS feeds
  - picks a candidate angle
  - calls the OpenAI API for X and LinkedIn drafts
  - writes a private approval artifact
  - syncs high-enough scoring drafts into `assets/data/social-posts.json`
- `assets/data/social-guidance.json`
  - lets Jason steer priorities, pinned angles, avoid-topics, thresholds, and preferred posting routes without editing code
- `scripts/social_archive_admin.py`
  - approves, schedules, rejects, and marks posts published
- `scripts/social_buffer_publish.py`
  - schedules approved LinkedIn and X posts through Buffer
  - syncs scheduled and sent state back into `assets/data/social-posts.json`
- `scripts/social_archive_import.py`
  - imports historical posts from CSV or JSON into the archive
- `blog/social-posts.html`
  - renders the governed public archive
- `.github/workflows/social-draft.yml`
  - runs the morning draft job on weekdays
- `.github/workflows/social-publish.yml`
  - schedules approved posts and syncs Buffer state on a recurring workflow

That means the repo already supports:

- searching for news
- coming up with ideas
- drafting channel-specific posts
- keeping a public blog/archive record
- manual approval before posting
- scheduling approved posts through Buffer
- importing historical posts into the same archive model

What it still does not do is publish directly to LinkedIn or X without the Buffer broker, and it does not yet have historical data loaded.

## Verified platform recommendation

The current production route is:

1. keep OpenAI for research, synthesis, and drafting
2. keep GitHub Actions for the scheduled morning run
3. use Buffer for LinkedIn profile scheduling and X scheduling
4. keep final publish state and URLs in `assets/data/social-posts.json`

Reason:

- LinkedIn personal-profile posting remains the most brittle part of the stack
- drafting and publishing should stay decoupled
- a broker gives cleaner retries, scheduling, and channel management than hand-rolled browser automation
