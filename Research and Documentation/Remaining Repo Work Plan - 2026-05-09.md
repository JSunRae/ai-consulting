# Remaining Repo Work Plan

Prepared: `2026-05-09`

## Current state

- The website positioning and core consulting narrative are in place.
- The social archive now contains a materially deeper LinkedIn history layer.
- The saved LinkedIn activity HTML has been exhausted as a trustworthy source:
  - `9` authored posts
  - `1` repost
- A structured markdown export path now exists for those same saved-page posts, so cleaner body text can be imported without scraping HTML again.
- The live public LinkedIn recent-activity page added a second public layer:
  - `11` authored posts
  - `2` shares
  - `2` likes
- The phone intake runtime, playbook, and Netlify functions exist, but there is still no public phone number live.

## What is actually left

### 1. Deepen the public content history

Goal: make the site feel established using real history, not invented history.

Remaining work:

1. Save a deeper LinkedIn activity page after scrolling much further down.
2. Re-run `scripts/extract_linkedin_saved_activity.py` against each deeper HTML save.
3. Backfill X history using `assets/data/social-history-template.csv` or post URLs.
4. Optionally add a dedicated importer for the public LinkedIn recent-activity page so this path is repeatable rather than one-off.
5. Optionally import older public blog publication dates or external proof links where they are real and defensible.

Why this matters:

- Right now the archive is honest, but still shallow.
- More first-party history is the main lever that will make the site look mature.

### 2. Finish the social automation path

Goal: move from archive-ready to repeatable publishing.

Remaining work:

1. Add `BUFFER_ACCESS_TOKEN`.
2. Add `BUFFER_LINKEDIN_CHANNEL_ID`.
3. Add `BUFFER_X_CHANNEL_ID`.
4. Run a real draft -> approve -> schedule -> sync cycle.
5. Decide whether the website should surface scheduled items publicly or only published/ready items.

Why this matters:

- The repo logic exists.
- The missing part is external credentials and first live execution.

### 3. Finish the phone intake path

Goal: let a prospect call a real number and reach the AI intake flow end to end.

Remaining work:

1. Buy a German or DACH-appropriate Twilio number.
2. Create the Twilio Elastic SIP trunk.
3. Route the trunk to `sip:<OPENAI_PROJECT_ID>@sip.api.openai.com;transport=tls`.
4. Configure the OpenAI realtime webhook.
5. Set live env vars for:
   - `OPENAI_PROJECT_ID`
   - `OPENAI_WEBHOOK_SECRET`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
   - `TWILIO_SIP_TRUNK_SID`
   - `SUMMARY_TO_EMAIL`
   - `SMTP_HOST`
   - `SMTP_USER`
   - `SMTP_PASS`
6. Run the call test plan in `assets/docs/VOICE_CALL_TEST_PLAN.md`.
7. Only then add the number to the public site with a short AI disclosure.

Why this matters:

- The repo is ready for the backend side.
- The live telecom path is still the missing piece.

### 4. Final launch polish

Goal: close the non-strategic quality gaps before treating the site as fully polished.

Remaining work:

1. Replace the hero video placeholder if you want a live intro asset.
2. Replace the profile placeholder with the final headshot.
3. Add public project URLs where you want stronger proof.
4. Run a physical-device Safari smoke test.
5. Run a post-deploy Lighthouse pass.

Why this matters:

- None of these are architecture blockers.
- They are the last-mile quality items that improve trust.

## Recommended order

1. Deeper LinkedIn save and X backfill
2. Buffer credentials and first live social schedule run
3. Twilio number and phone intake go-live
4. Final visual/QA polish

## Immediate blocker summary

- More historical-looking website depth needs more first-party social history.
- Live phone intake needs a purchased number and SIP setup.
- Live social automation needs Buffer credentials.
