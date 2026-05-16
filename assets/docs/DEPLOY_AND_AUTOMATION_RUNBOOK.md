# Deploy And Automation Runbook

Prepared: `2026-05-09`

## Purpose

This runbook covers the repo-side operations that now exist:

- website preflight checks
- social drafting
- social archive import
- Buffer scheduling/sync
- voice backend scaffold

## Local checks before deploy

Run:

```bash
npm run verify
npm run check:release-scope
```

Interpretation:

- preflight errors should stop the deploy
- preflight warnings should be reviewed before deploy
- build output should not introduce unstaged tracked-file drift
- release-scope output should be reviewed before selective staging in this dirty worktree

## Social workflow

### Draft generation

```bash
npm run social:draft
```

Optional:

```bash
python scripts/social_draft_pipeline.py --mock-openai
```

### Approve a post

```bash
python scripts/social_archive_admin.py approve --id POST_ID --schedule-linkedin-at 2026-05-12T07:30:00Z --schedule-x-at 2026-05-12T10:00:00Z --route-linkedin buffer --route-x buffer
```

### Publish and sync through Buffer

```bash
python scripts/social_buffer_publish.py --publish --sync
```

Required environment variables:

- `BUFFER_ACCESS_TOKEN`
- `BUFFER_LINKEDIN_CHANNEL_ID`
- `BUFFER_X_CHANNEL_ID`
- optional `BUFFER_ORGANIZATION_ID`

### Import historical posts

Use the template:

- `assets/data/social-history-template.csv`

Import:

```bash
python scripts/social_archive_import.py --input assets/data/social-history-template.csv --dry-run
python scripts/social_archive_import.py --input path/to/real-history.csv
```

LinkedIn-specific import paths:

```bash
python scripts/extract_linkedin_saved_activity.py --input-html "C:\path\to\saved-linkedin-activity.html" --archive-path assets/data/social-posts.json
python scripts/import_linkedin_activity_markdown.py --input-md "C:\path\to\linkedin_activity_posts_extracted.md" --archive-path assets/data/social-posts.json
python scripts/import_linkedin_public_activity_json.py --input-json "C:\path\to\LinkedIn_Public_Activity_Extract.json" --archive-path assets/data/social-posts.json
```

## Voice backend scaffold

Endpoints:

- `GET/POST /api/voice/incoming`
- `GET/POST /api/voice/summary`
- `GET/POST/DELETE /api/voice/summaries`

Provider target for phase 1:

- `Twilio Elastic SIP Trunking`
- implementation reference: `assets/docs/TWILIO_OPENAI_SIP_PHASE1_PLAN.md`

Relevant environment variables:

- `VOICE_WEBHOOK_SECRET`
- `VOICE_OPERATOR_SECRET`
- `VOICE_AGENT_MODEL`
- `VOICE_AGENT_VOICE`
- `VOICE_SUMMARY_WEBHOOK_URL`
- `VOICE_SUMMARY_ENCRYPTION_KEY`
- `VOICE_SUMMARY_RETENTION_DAYS`
- `VOICE_SUMMARY_STORE_NAME`
- `OPENAI_PROJECT_ID`
- `OPENAI_WEBHOOK_SECRET`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `TWILIO_SIP_TRUNK_SID`

Test plan:

- `assets/docs/VOICE_CALL_TEST_PLAN.md`

## GitHub Actions

Current workflows:

- `.github/workflows/ci.yml`
- `.github/workflows/social-draft.yml`
- `.github/workflows/social-publish.yml`

Secrets to configure before social publish automation can run:

- `OPENAI_API_KEY`
- `BUFFER_ACCESS_TOKEN`
- `BUFFER_LINKEDIN_CHANNEL_ID`
- `BUFFER_X_CHANNEL_ID`
- optional `BUFFER_ORGANIZATION_ID`

## Deploy notes

The site is still static-first.

That means:

- frontend pages deploy independently of the social pipeline
- Netlify Functions are only needed for the voice backend scaffold
- the voice endpoints should stay dark until a SIP provider and webhook path are connected

If Netlify production deploy throws a platform `500`, treat that as host-side or CLI transport failure first, not a confirmed code regression. Re-run preflight locally, then retry deploy before editing repo code blindly.

If the local Netlify CLI login flow stalls, prefer generating a fresh signed deploy command through the Netlify app/plugin and running that command from the repo root. That path successfully deployed the site on `2026-05-09`.
