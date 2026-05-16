# Release Decision Queue

Last updated: 2026-05-15

## Audit Inputs Used

Requested by brief and now available in the workspace:

- `assets/docs/DEPLOY_SCOPE_MANIFEST.md`
- `assets/docs/RELEASE_SCOPE_AUDIT.md`
- `assets/docs/RELEASE_STAGE_COMMANDS.md`
- `npm run check:release-scope`
- current `git status --short --untracked-files=all`

Canonical repo evidence used alongside the release-scope docs:

- `assets/docs/TODO.md`
- `assets/docs/LAUNCH_HARDENING_HANDOVER.md`
- `assets/docs/BROWSER_QA_REPORT.md`
- `assets/docs/SETUP_GUIDE.md`
- `assets/docs/DEPLOY_AND_AUTOMATION_RUNBOOK.md`
- `.env.deploy.local`
- `js/forms.js`
- current worktree status

## Bottom Line

- True human-only release gate still open: `1`
- Owner choices still open but not blocking a static-site commercialization launch: `4`
- Previously ambiguous items reduced by repo evidence: `7`

The commercialization site itself is implementable and selectively releasable now. The main remaining hard gate is a real-device Safari pass. Most other open items are owner preferences or optional go-live extensions, not blockers.

## Ranked Remaining Queue

### 1. Real iPhone/iPad Safari sign-off

- Impact on release: `High`
- Release status: `Blocking until explicitly accepted or completed`
- Why this is still irreducibly human:
  - repo QA is strong, but the remaining unverified surface is explicitly physical Safari behavior
  - this cannot be closed from code inspection alone
- Repo evidence:
  - `assets/docs/LAUNCH_HARDENING_HANDOVER.md` says the physical iPhone / iPad Safari pass is still manual / human-device only
  - `assets/docs/TODO.md` keeps the physical-device Safari smoke test open
  - `assets/docs/BROWSER_QA_REPORT.md` shows desktop and in-app mobile checks passed, which narrows the remaining gap to real Safari only
- Decision required:
  - run the pass and sign off, or
  - knowingly accept unverified Safari risk for launch

### 2. Keep email-led scheduling, or switch to live Calendly

- Impact on release: `Medium`
- Release status: `Owner choice, not blocker`
- Why this remains human:
  - the codebase supports the current email-led path, but only the owner can decide whether launch should include direct booking
  - a live Calendly handle and event slug are not populated in local deploy placeholders
- Repo evidence:
  - `assets/docs/TODO.md` says the site is valid with email-led scheduling and only needs change if direct Calendly booking is enabled
  - `assets/docs/SETUP_GUIDE.md` defines both acceptable states: keep email-led, or replace the CTA with the live Calendly URL
  - `.env.deploy.local` leaves `CALENDLY_HANDLE` and `CALENDLY_EVENT_SLUG` blank
  - `js/forms.js` only provides non-production warnings for placeholder Calendly links; it does not force Calendly for launch
- Recommended reduction:
  - default to `keep email-led scheduling` unless there is a business reason to enable instant booking now

### 3. Leave LinkedIn Insight Tag disabled, or restore it for campaigns

- Impact on release: `Medium-Low`
- Release status: `Owner choice, not blocker`
- Why this remains human:
  - campaign intent and a real LinkedIn partner ID are external business inputs
  - the codebase intentionally does not force tracking back into the public pages
- Repo evidence:
  - `assets/docs/TODO.md` says disabled tracking is acceptable for launch
  - `assets/docs/SETUP_GUIDE.md` says the placeholder snippet has already been removed and should only be restored if campaigns require it and a real partner ID exists
  - public HTML search does not show an active LinkedIn Insight Tag footprint
- Recommended reduction:
  - default to `leave disabled at launch` unless paid LinkedIn acquisition is going live immediately

### 4. Enable social publish automation now, or defer until credentials are ready

- Impact on release: `Low` for website launch, `Medium` for social operations
- Release status: `Optional owner decision, not a site blocker`
- Why this remains human:
  - the implementation exists, but real Buffer credentials and GitHub secrets are external inputs
  - only the owner can decide whether social automation is part of this release or a post-launch operating step
- Repo evidence:
  - `assets/docs/TODO.md` marks the production posting route decision as complete and says the remaining work is external credential setup
  - `assets/docs/DEPLOY_AND_AUTOMATION_RUNBOOK.md` lists required Buffer secrets for publish and sync
  - `.github/workflows/social-publish.yml` already exists, so this is not an architectural gap
- Recommended reduction:
  - treat this as `post-launch optional` unless launch scope explicitly includes automated social publishing

### 5. Backfill X history into the public social archive, or launch with the current archive state

- Impact on release: `Low`
- Release status: `Optional completeness choice, not blocker`
- Why this remains human:
  - this is a content completeness decision, not an implementation gap
  - only the owner can decide whether the archive must represent both channels at first release
- Repo evidence:
  - `assets/docs/TODO.md` says LinkedIn exports are already reconciled and the remaining gap is X history only if both channels should be represented more fully
  - the import tooling already exists in `scripts/social_archive_import.py` and related LinkedIn import scripts
- Recommended reduction:
  - do not block release on this; backlog it unless archive completeness is a launch requirement

### 6. Replace the profile placeholder with a real headshot

- Impact on release: `Low-Medium`
- Release status: `Commercial polish decision, not technical blocker`
- Why this remains human:
  - this requires a final approved public image asset and preferred alt/title wording
  - the repo cannot invent the owner's final public headshot choice
- Repo evidence:
  - `about.html` still references `assets/images/profile-placeholder.svg`
  - `assets/docs/TODO.md` and `assets/docs/SETUP_GUIDE.md` both keep the headshot swap as an external asset task
- Recommended reduction:
  - not a hard blocker, but worth closing before heavier buyer traffic if credibility polish matters for first impressions

## Ambiguities Resolved By Repo Evidence

These looked potentially open, but no longer belong in the human decision queue.

### Missing `RELEASE_SCOPE_AUDIT.md`

- Status: `Resolved for this audit`
- Reason:
  - the requested file now exists in the repo and should be used together with `assets/docs/RELEASE_STAGE_COMMANDS.md` and `npm run check:release-scope`
  - the remaining launch state is still cross-checked against `TODO.md`, `LAUNCH_HARDENING_HANDOVER.md`, `BROWSER_QA_REPORT.md`, and `SETUP_GUIDE.md`

### Dirty git worktree outside commercialization scope

- Status: `Not a human decision blocker`
- Reason:
  - `assets/docs/DEPLOY_SCOPE_MANIFEST.md` already defines intentional selective staging as the release discipline
  - current `git status` confirms large unrelated noise, including job-search files, voice/phone prototypes, generated docs, and `__pycache__` outputs
  - the correct action is selective staging, not broader product ambiguity

### Domain and web forms

- Status: `Closed`
- Reason:
  - `assets/docs/TODO.md` marks the production domain and live Formspree posting as complete
  - `assets/docs/BROWSER_QA_REPORT.md` confirms a successful live Formspree submission

### Social posting route choice

- Status: `Closed`
- Reason:
  - Buffer is already the chosen broker in `assets/docs/TODO.md`
  - remaining work is only secret provisioning

### Phone rollout as part of this release

- Status: `Resolved to defer`
- Reason:
  - `assets/docs/VOICE_CALL_AGENT_IMPLEMENTATION_BRIEF.md` explicitly says the next correct move is not to publish a phone number yet
  - therefore phone exposure is not part of the current commercialization release gate

### LinkedIn historical import implementation

- Status: `Closed`
- Reason:
  - the import scripts exist and the TODO notes the supplied LinkedIn exports are already reconciled into the archive

### Hero video / richer hero media

- Status: `Not a blocker`
- Reason:
  - `assets/docs/TODO.md` explicitly frames this as optional enhancement, not live-release dependency

## Release Recommendation

If the goal is a clean commercialization release of the site itself, the practical release posture is:

1. run or explicitly waive the real-device Safari pass
2. keep the current email-led booking flow unless direct Calendly is commercially necessary now
3. leave LinkedIn tracking disabled unless campaign launch is immediate
4. release with selective staging only from the commercialization scope in `assets/docs/DEPLOY_SCOPE_MANIFEST.md`
5. treat Buffer credentials, X-history backfill, headshot replacement, and phone rollout as separate owner follow-ups unless you want them inside the same launch milestone
