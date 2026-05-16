# Comprehensive Remaining Work Audit

Prepared: `2026-05-09`
Updated: `2026-05-16`

## Current verified state

- `jasonrae.ai` is live.
- The social archive is live with `37` total entries and `22` published entries.
- LinkedIn history now comes from three paths:
  - saved LinkedIn activity HTML
  - structured markdown export
  - public LinkedIn recent-activity page
- The public social archive opens on `Posts` only and keeps reposts, shares, and likes behind filters.
- The saved LinkedIn HTML is exhausted at `10` unique activity IDs and does not contain hidden additional authored posts.
- The phone intake backend, playbook, and Netlify functions exist.
- The phone number itself is not live yet.
- The social automation scaffolding exists.
- The posting credentials are not complete yet.
- The job-search tracker and submission log have been reconciled to the mailbox state through `2026-05-16`.

## Still to implement

### Social history and archive depth

1. Backfill X history if you want the archive to represent both channels rather than LinkedIn only.
2. Decide whether liked and shared activity should stay public long term or move to an internal-only archive later.
3. Optionally build a repeatable importer for the public LinkedIn recent-activity page instead of relying on a one-off fetch workflow.
   Status: complete. `scripts/import_linkedin_public_activity_json.py` now handles structured public-activity imports into the archive feed.
4. LinkedIn history status:
   The saved LinkedIn HTML and derived markdown export have now been fully reconciled. Based on the exports Jason supplied, there is no remaining LinkedIn backfill blocker inside this repo unless Jason exports an older activity window from LinkedIn itself.

### Social posting automation

1. Set `BUFFER_ACCESS_TOKEN`.
2. Set `BUFFER_LINKEDIN_CHANNEL_ID`.
3. Set `BUFFER_X_CHANNEL_ID`.
4. Run the first real `draft -> approve -> schedule -> sync` cycle.
5. Decide whether scheduled items should appear publicly on the website or remain internal until published.
6. Resolve the OpenAI project quota issue if you want the draft generator to run fully autonomously again.

### Voice / phone intake

1. Buy the Twilio number.
2. Create the Twilio Elastic SIP trunk.
3. Route Twilio SIP to OpenAI Realtime SIP.
4. Configure the OpenAI realtime webhook and shared secrets.
5. Configure summary delivery email credentials.
6. Run the full call test plan end to end.
7. Add the public phone number to the website only after the path is proven.

### Website polish

1. Replace the profile photo placeholder.
2. Add public project URLs where appropriate.
   Status: blocked by deliberate privacy choice on most portfolio work. Public GitHub repo links should only be added for work Jason is comfortable exposing directly.
3. Optionally add richer hero media later if you want it, but there is no live video placeholder blocking launch in the current homepage HTML.
4. Decide whether the site should surface a stronger “call me / talk to the AI assistant” CTA after phone launch.
5. The current contact flow is still intake-first rather than direct scheduling; CTA language should continue to reflect that until a real booking link exists.

## Still to review or audit

### QA and browser checks

1. Run a physical-device Safari smoke test.
2. Review the completed Lighthouse results and decide whether to do a performance-optimization pass now.
3. Manually review `blog/social-posts.html` on desktop and mobile now that the archive is much deeper.
4. Review whether shared and liked LinkedIn activity looks desirable in the public-facing feed after a fresh brand pass.

### Content and positioning review

1. Review whether the older LinkedIn posts are still aligned with your current positioning and whether any should be hidden from the site archive.
2. Review whether the repost and liked activity support your brand or just add noise.
3. Archive default review:
   Status: already implemented as `Posts` only on first load. Only revisit if you decide to hide likes / shares completely.

### Operational review

1. Verify GitHub Actions secrets for Buffer once they are added.
2. Verify Netlify environment variables for the voice path before public rollout.
3. Verify whether Formspree is still the desired long-term contact flow or whether you want a CRM / newsletter platform later.

## Still to investigate

1. Whether LinkedIn direct posting is worth implementing later, or whether Buffer should remain the stable first-choice broker.
2. Whether the public LinkedIn recent-activity fetch can be converted into a robust scheduled import without hitting auth walls.
3. Whether a small internal approval UI is worth building for social content, or whether markdown + archive JSON is sufficient.
4. Whether the public archive should show only published items by default and move `ready` / `queue` into an internal-only mode.

## Decisions still needed from you

1. Final booking flow:
   intake-first email-led only, or direct scheduling later
2. LinkedIn tracking:
   off by default, or re-enable with a real partner ID
3. Public archive policy:
   keep current `Posts by default, other activity behind filters`, or tighten to `posts only`
4. Social posting policy:
   LinkedIn only first, or LinkedIn + X together
5. Phone-launch timing:
   keep dark until full testing, or fast-launch once Twilio is connected

## Suggested execution order

1. Decide whether to keep likes and shares public, or tighten the public archive later.
2. Backfill X history if you want the archive to become multi-channel rather than LinkedIn-first.
3. Add Buffer credentials and run the first real scheduled social cycle.
4. Complete Twilio + OpenAI phone path.
5. Replace the profile photo placeholder and complete real-device Safari QA.
