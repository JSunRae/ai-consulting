# Workstream Next Steps

_Last updated: 2026-05-28._

This workstream is no longer in a broad implementation phase. The repo-side commercialization work is complete. The remaining steps are closeout decisions, one external validation action, and separation of future tracks from the finished site-release work.

Authority split for future operators:

- `internal-docs/WQ24_FINAL_STATUS.md` is the release-gate status document.
- `internal-docs/TODO.md` is the categorized open-work checklist.
- this file is the default-decision and workstream-posture summary.

## Immediate Next Steps

### 1. Lock the operational defaults for this workstream

Status: `Addressed`

Decisions now treated as settled defaults for this workstream:

- Booking stays `email-led`.
- LinkedIn Insight Tag stays `disabled`.
- Social history scope stays at the current imported LinkedIn archive; deeper X-history backfill is deferred.
- Phone rollout stays out of this website-release workstream and remains a separate activation track.

Why:

- none of these items block the current static-site commercialization surface
- the current implementation already supports these defaults cleanly
- leaving them open creates unnecessary ambiguity around a workstream that is otherwise finished

### 2. Run one external validation pass on real iPhone or iPad Safari

Status: `Still required outside this environment`

This is the only remaining step that cannot be closed from repo inspection or editor-based checks.

Minimum test path:

1. Load `index.html`, `services.html`, and `contact.html` on a real iPhone or iPad in Safari.
2. Verify hero readability, fixed header behavior, mobile nav open/close, and any `backdrop-filter` surfaces.
3. Open the chat launcher and submit one short prompt.
4. Open the contact form, confirm layout, field focus behavior, and successful submission flow.
5. Record pass/fail plus screenshots if anything is visually broken.

Recommended handling:

- if the pass succeeds, close the workstream
- if Safari exposes a real rendering issue, treat that as a narrow follow-up fix rather than reopening broader scope

### 3. Move everything else to post-launch backlog instead of treating it as release work

Status: `Addressed`

These items are not next-step blockers for the completed commercialization workstream:

- richer hero media
- a stronger formal headshot
- additional public project URLs
- deeper social-history imports
- social automation secret provisioning
- public phone-number rollout

That also means the following stay outside the release definition of done:

- phone intake rollout
- Buffer credentialing and first live publish cycle
- broader social automation expansion
- optional visual polish

They should stay in backlog or separate activation tracks, not in the definition of done for this workstream.

## Closeout Summary

The correct closeout posture is:

1. keep the current implementation defaults
2. run the real-device Safari pass
3. close the workstream if Safari is clean

If Safari is not clean, the follow-up should be limited to the exact rendering defect found there.
