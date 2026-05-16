# Support Needed

Prepared: `2026-05-12`

This is the shortest practical list of things only Jason can supply, decide, or verify before the remaining repo work can be closed.

## Credentials and external setup

1. Buffer posting credentials
   Need:
   - `BUFFER_ACCESS_TOKEN`
   - `BUFFER_LINKEDIN_CHANNEL_ID`
   - `BUFFER_X_CHANNEL_ID`
   - optional `BUFFER_ORGANIZATION_ID`
   Why:
   - to run the first real `draft -> approve -> schedule -> sync` social cycle

2. Twilio phone rollout inputs
   Need:
   - one purchased public business number
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
   - `TWILIO_SIP_TRUNK_SID`
   Why:
   - to make the AI intake line callable from the public website

3. OpenAI phone-session settings
   Need:
   - `OPENAI_PROJECT_ID`
   - `OPENAI_WEBHOOK_SECRET`
   Why:
   - to accept and configure live SIP calls safely

4. Summary delivery credentials
   Need one of:
   - `SUMMARY_TO_EMAIL` plus `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
   - or `VOICE_SUMMARY_WEBHOOK_URL`
   Why:
   - to deliver structured call summaries after each intake conversation

## Content and asset inputs

1. Final profile photo
   Current blocker:
   - the public About page still uses the placeholder image

2. Public project URLs
   Need:
   - any GitHub repos, live demos, notebooks, or public writeups you want exposed
   Current blocker:
   - several project cards still cannot link outward because no public URL was confirmed

3. More historical social data
   Need at least one:
   - X post export
   - direct post URLs
   Current blocker:
   - the website archive is live and materially improved, and the supplied LinkedIn HTML is already reconciled; the remaining gap is mostly X history if you want fuller channel coverage

4. Optional hero-media enhancement
   Clarification:
   - there is no live hero video placeholder blocking launch in the current homepage HTML
   - if you want richer media later, this would mean adding an intro video, talking-head loop, or animated avatar to the top of the homepage as a design enhancement rather than a launch requirement

## Decisions still needed

1. Booking flow
   Choose:
   - keep the current email-led flow
   - or switch to direct scheduling later

2. Public archive policy
   Choose:
   - posts only
   - or posts plus shares, likes, and reposts

3. Social posting scope
   Choose:
   - LinkedIn first
   - or LinkedIn plus X together

4. LinkedIn tracking
   Choose:
   - keep tracking off
   - or re-enable it with a real partner ID

5. Phone launch timing
   Choose:
   - keep the voice path dark until tested end to end
   - or launch it as soon as the Twilio path is working

## Manual checks only you can realistically do

1. Safari smoke test on a real iPhone or iPad
   Focus:
   - fixed header
   - backdrop blur
   - menu behavior
   - chatbot / contact interactions
   - social archive scrolling and filters

2. Brand review of older LinkedIn history
   Focus:
   - whether any imported older posts feel off-positioning for the current commercial analytics / applied AI narrative
   - whether public likes, shares, or reposts add signal or just noise

## Recommended order

1. Decide archive policy for likes / shares / reposts.
2. Provide Buffer credentials.
3. Provide Twilio and OpenAI phone credentials.
4. Provide your profile photo and any public project URLs.
5. Provide X history if you want the archive to represent both channels more fully.
6. Run the Safari review.
