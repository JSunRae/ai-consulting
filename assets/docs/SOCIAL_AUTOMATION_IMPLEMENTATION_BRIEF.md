# Social Automation Implementation Brief

Prepared: `2026-05-08`

## Goal

Use the OpenAI API to:

- research worthwhile news
- generate Jason-style LinkedIn and X drafts
- keep a human approval step
- schedule approved posts
- write scheduled and published status back into the website blog archive

## Current repo state

The repo now already supports:

- RSS-based research intake
- OpenAI draft generation
- private approval artifacts
- a public archive page at `blog/social-posts.html`
- JSON-backed status records in `assets/data/social-posts.json`
- operator guidance in `assets/data/social-guidance.json`
- archive admin actions through `scripts/social_archive_admin.py`

That means the drafting and audit-trail side is in place.

The repo now also includes the posting bridge:

- `scripts/social_buffer_publish.py`
- `.github/workflows/social-publish.yml`

What is still missing is only the live credential/config layer plus historical backfill data.

## Verified platform facts

### OpenAI

Current OpenAI models support structured outputs, and GPT-5.4 is already a reasonable default for this workflow. The repo currently calls the Chat Completions API with a JSON schema, which is still valid for this use case. If you want a later cleanup, the same workflow can be migrated to the Responses API without changing the approval model.

### LinkedIn

LinkedIn's current Posts API supports creating organic posts and retrieving posts, and personal posting uses `w_member_social`. It requires the `Linkedin-Version` header and `X-Restli-Protocol-Version: 2.0.0`. Article posts are more constrained than people expect: the API does not scrape arbitrary URLs for you, so thumbnails and article metadata need explicit handling.

### Buffer

Buffer's current APIs support creating and scheduling posts, retrieving channels, retrieving posts, and managing ideas. That makes it a cleaner broker for approval-first social workflows than direct browser automation.

## Recommendation

### Best first production route

- Use OpenAI for research, synthesis, drafting, and quality scoring.
- Keep GitHub Actions for weekday morning runs.
- Use Buffer as the posting broker for:
  - LinkedIn profile scheduling
  - X scheduling
  - retrieving scheduled / published state
- Keep the site archive as the audit layer.

### Why this route is better than direct first-party posting right now

- LinkedIn direct posting is possible, but versioning and content-shape constraints are brittle.
- A broker gives scheduling, retries, and channel management without pushing that complexity into the drafting script.
- The OpenAI layer stays focused on idea quality and copy quality rather than transport logic.

## Recommended workflow

1. Morning GitHub Action runs.
2. Feeds are scanned and scored.
3. OpenAI generates a draft pair for LinkedIn and X.
4. Approval artifact is written.
5. High-enough scoring drafts sync into `assets/data/social-posts.json` with:
   - evidence note
   - risk flags
   - recommended schedule
   - preferred route
6. Jason approves or rejects.
7. Approved posts are scheduled through Buffer.
8. Once published, platform URLs are written back into the archive.

## Repo pieces to add next

### If you choose Buffer

- `scripts/social_buffer_publish.py`
  - read approved records
  - create or schedule Buffer posts
  - write returned post ids and URLs back into the archive
- `assets/data/social-channels.json`
  - store channel ids by platform outside code

### If you choose direct LinkedIn + direct X

- `scripts/social_linkedin_publish.py`
- `scripts/social_x_publish.py`
- stronger error handling for auth expiry, headers, media upload, and rate limits

## Secret handling

Do not place real API keys in tracked repo files.

Use:

- GitHub Actions secrets for scheduled workflows
- local `.env` for local runs
- Netlify environment variables only if you later move parts of the pipeline into functions

## Immediate next move

The repo is ready for the next meaningful build step:

- choose `Buffer` or `direct APIs`

My recommendation is `Buffer` first.
