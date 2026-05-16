# Unblock Step By Step

Prepared: `2026-05-12`

This is the practical next-action list for the remaining items that only Jason can unblock.

## 1. Decide what should stay public in the social archive

Why this matters:
- the archive now contains authored posts, at least one repost, and some public-activity imports
- the page now supports filters for `Posts`, `Shares`, `Likes`, and `Reposts`

What to do:
1. Open [https://jasonrae.ai/blog/social-posts.html](https://jasonrae.ai/blog/social-posts.html).
2. Click through the `Posts`, `Shares`, `Likes`, and `Reposts` filters.
3. Decide whether the public site should show:
   - posts only
   - posts plus reposts
   - posts plus reposts plus likes/shares
4. Send me the rule you want.

What I will do after that:
- I will change the default archive behavior to match that rule.

## 2. Decide whether X should be part of the public archive now

Current state:
- LinkedIn history supplied by your saved exports is already reconciled.
- X history is the main remaining social-history gap.

What to do:
1. Decide whether you want the public archive to be:
   - LinkedIn-first only for now
   - LinkedIn plus X
2. If you want X included, provide either:
   - an export
   - direct post URLs
   - copied post text with dates

What I will do after that:
- I will import the X history into the same archive feed.

## 3. Provide Buffer credentials so automation can actually publish

What to do:
1. Create or confirm your Buffer account and connected channels.
2. Gather:
   - `BUFFER_ACCESS_TOKEN`
   - `BUFFER_LINKEDIN_CHANNEL_ID`
   - `BUFFER_X_CHANNEL_ID`
   - optional `BUFFER_ORGANIZATION_ID`
3. Put them into the repo secrets or send them through the secure path you prefer.

What I will do after that:
- run the first real `draft -> approve -> schedule -> sync` cycle
- verify that published URLs write back into the archive

## 4. Decide whether the contact flow should stay email-led or switch to direct scheduling

Current state:
- the site already works with the current email-led contact flow
- nothing is broken here

What to do:
1. Decide whether you want:
   - the current contact form and email-led scheduling
   - Calendly or direct booking links
2. If you want direct booking, provide the scheduling URL.

What I will do after that:
- wire the new booking route into the contact and CTA paths

## 5. Provide a real profile photo

What this means:
- [about.html](</C:/Users/Pilot/Documents/Vs Code Projects/AI_Consulting/about.html>) still uses `assets/images/profile-placeholder.svg`

What to do:
1. Pick one headshot you are comfortable using publicly.
2. Prefer:
   - square crop
   - at least `1200 x 1200`
   - clear face, neutral or professional background
3. Put the file in `assets/images/`.
4. Tell me the filename you want used.

What I will do after that:
- swap out the placeholder and check the page rendering

## 6. Decide whether you actually want richer hero media

Clarification:
- there is no live video placeholder currently blocking the homepage
- this is optional design enhancement work, not a launch requirement

What this would mean if you want it:
- an intro video
- a talking-head loop
- an animated avatar
- or a short motion-based credibility asset in the homepage hero

What to do:
1. Decide whether to leave the current text-led hero alone.
2. If you want media, choose one:
   - no change
   - short intro video
   - looping silent clip
   - animated avatar
3. Provide the asset or the preferred format.

What I will do after that:
- add the media block cleanly into the homepage hero

## 7. Provide public project URLs you want exposed

Current state:
- several flagship projects in [projects.json](</C:/Users/Pilot/Documents/Vs Code Projects/AI_Consulting/assets/data/projects.json>) still have `demoUrl: null` and `githubUrl: null`

What to do:
1. Decide which projects can be shown publicly.
2. For each approved project, provide any of:
   - GitHub repo URL
   - live demo URL
   - public case-study URL
   - public notebook or docs URL
3. If a project must stay private, say so explicitly.

What I will do after that:
- wire those URLs into the portfolio cards and detail pages

## 8. Decide whether LinkedIn tracking should stay off

Current state:
- tracking is off
- that is acceptable

What to do:
1. Decide whether you need LinkedIn campaign tracking right now.
2. If yes, provide the real partner / tracking ID.
3. If not, leave it off.

What I will do after that:
- either keep the current state
- or wire the real tag back into the site

## 9. Decide whether to launch the AI phone line now or keep it dark

Current state:
- backend scaffolding, playbooks, bilingual guidance, and summary logic exist
- there is no live public phone number yet

What to do:
1. Decide whether the phone line should stay private until fully tested.
2. If you want to continue, buy the Twilio number.
3. Then provide:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
   - `TWILIO_SIP_TRUNK_SID`
   - `OPENAI_PROJECT_ID`
   - `OPENAI_WEBHOOK_SECRET`
   - either summary email credentials or a summary webhook URL

What I will do after that:
- complete the Twilio SIP wiring
- run the call test plan
- then add the phone number to the site only when the flow is working

## 10. Run one manual Safari check

What to do:
1. Open the live site on a real iPhone or iPad in Safari.
2. Check:
   - homepage load
   - sticky header
   - mobile menu
   - contact form
   - chatbot
   - social archive scrolling and filters
3. Note anything that looks broken or awkward.

What I will do after that:
- fix the Safari-specific issues directly

## 11. LinkedIn HTML status

Current answer:
- yes, I used the saved LinkedIn HTML
- it contains `10` unique activity IDs
- those entries are now represented in the archive
- there is no hidden extra post history inside that saved file beyond those `10` items

If you want more LinkedIn history than that:
- it would require a different or deeper export, not more parsing of this file
