# Repo Finish Prompts

Prepared: `2026-05-09`

This file turns the remaining repo work into explicit implementation prompts. Each prompt is written so it can be handed to another coding agent, but the repo has also been updated to action these directly where possible.

## Prompt 1: Social Posting Bridge

`Review the existing social drafting system in this repo and extend it from draft generation into actual scheduling for approved posts. Use Buffer as the first posting broker. Read approved records from assets/data/social-posts.json, schedule LinkedIn and X posts through Buffer using environment variables, and write the resulting scheduling state back into the archive. Preserve the human approval workflow. Add a publish workflow and operator documentation. Acceptance criteria: approved posts can be scheduled without touching frontend code, archive records gain Buffer ids and schedule state, and the workflow never auto-posts unapproved drafts.`

## Prompt 2: Historical Social Archive Import

`Add a utility that imports historical LinkedIn and X posts into assets/data/social-posts.json from a structured CSV or JSON file. The importer should group multi-platform variants of the same post, preserve published URLs, and avoid duplicate archive entries. Add a template import file and brief operator instructions. Acceptance criteria: past posts can be backfilled cleanly into the public archive without manual JSON editing.`

## Prompt 3: Voice Call Intake Backend

`Add a backend scaffold for a phone-based consulting intake assistant using OpenAI Realtime/SIP patterns. Keep the website static, but add Netlify Functions that can accept an inbound call webhook, build a realtime session configuration from the repo playbook, and receive a structured post-call summary for forwarding or storage. Keep the design provider-agnostic, do not expose a public phone CTA yet, and add a test plan. Acceptance criteria: the repo contains a real backend starting point for inbound call handling, session configuration, and post-call summary processing, even if the final telephony provider is chosen later.`

## Prompt 4: Repo Preflight and Ops Handoff

`Create a repo-side preflight checker for launch and automation safety. It should validate core JSON data files, scan public files for stale branding or email strings, confirm the canonical positioning is present on key pages, and flag social or voice configuration gaps before deploy. Update the documentation so the next operator can run the social pipeline, the publish bridge, the voice scaffold, and the preflight checks without rediscovering the architecture. Acceptance criteria: one command gives a useful repo health report and the docs reflect the current automation surface.`
