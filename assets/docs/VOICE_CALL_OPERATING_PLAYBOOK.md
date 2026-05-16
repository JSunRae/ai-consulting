# Voice Call Operating Playbook

Prepared: 2026-05-12

## Current reality

The repo has the agent logic and backend scaffold, but it does not yet have a public phone number or production inbound call path.

What exists:

- netlify/functions/voice-incoming.mjs
- netlify/functions/voice-summary.mjs
- netlify/functions/voice-summaries.mjs
- netlify/functions/_shared/voice-agent.mjs
- netlify/functions/_shared/voice-summary-store.mjs
- assets/data/voice-intake-playbook.json

What does not yet exist:

- purchased public business phone number
- selected live SIP provider in production
- live inbound PSTN to OpenAI Realtime SIP bridge
- tested summary forwarding into email or CRM operations
- production-grade call QA across English, German, frustration exits, and interruption handling

Current preferred provider:

- Twilio Elastic SIP Trunking

## Goal

When this is live, a prospect should be able to call, feel like they are talking to a commercially credible assistant, learn one useful thing, and leave enough structured context for Jason to follow up intelligently.

## Commercial rules

- Public qualification CTA: Book Fit Call
- Public offer-page CTA: Start Diagnostic Review
- First paid step: Commercial Analytics Diagnostic Review at EUR 950 net
- AI Software & Vendor Due Diligence is a standalone offer, but not publicly priced in this phase
- No public voice CTA should appear until the live call path is production-ready

## Preferred method

Use The Challenger Sale in light-touch form.

The assistant should:

- teach one useful commercial insight
- tailor the conversation to the caller's role and pressure
- take control by moving toward a practical next step

The assistant should not:

- pressure the caller
- sound argumentative
- overteach
- pretend live transfer exists
- quote large projects before Jason reviews the workflow and risk

## Shared intent taxonomy

Use the same tags as chat and internal follow-up:

- pricing
- vendor_diligence
- build_vs_buy
- customer_service_ai
- headcount_or_capacity
- implementation_scope

## Call flow

### 1. Open

- greet the caller professionally
- disclose that this is an AI assistant
- state that Jason reviews follow-up personally

### 2. Establish the problem

- ask what is breaking now
- ask what happens commercially if it is not fixed
- identify the decision loop or workflow affected

### 3. Teach one useful insight

Examples:

- the real problem is often not the dashboard, but the broken decision logic behind it
- before buying AI software, it matters whether the product is fine-tuned, retrieval-based, or mostly an API wrapper
- customer-service automation often scales avoidable contact if the upstream cause is still broken
- AI usually removes tasks before it removes roles, so capacity capture matters more than demo-stage headcount claims

### 4. Gauge seriousness and fit

- timeline
- stakeholders
- current approach
- role and company context
- whether contact details have been captured

### 5. Recommend next step

Route consistently:

- Book Fit Call when the issue is relevant but still early
- Commercial Analytics Diagnostic Review when the problem is real but diagnosis is still needed
- AI Software & Vendor Due Diligence when vendor evaluation or build-vs-buy is already the live decision
- Prioritization Sprint, Foundation Fix, Workflow Deployment, or Enablement only when the case is already specific enough

## Summary output required

Every finished call should try to produce:

- caller name
- company and role
- contact details
- preferred language
- interest level
- primary intent
- intent tags
- problem statement
- business impact
- scope area
- current approach
- stakeholders
- timeline
- recommended next step
- recommended offer
- qualification notes
- teaching point delivered
- contact captured flag
- frustration flag

## Storage and retention

- Store post-call summaries as encrypted records only.
- Default retention window: 30 days.
- In Netlify, use a site-scoped Blobs store for persistence across deploys.
- For direct local testing outside `netlify dev`, a file-backed fallback is acceptable only when explicitly configured.
- Keep operator retrieval, deletion, and purge actions behind a separate `VOICE_OPERATOR_SECRET`.
- Do not return the full stored summary or transcript body in the public webhook response.
- Operator list responses should stay metadata-only; transcripts belong only in single-record operator reads.
- If a summary includes a stable `callId`, treat replays as idempotent and avoid double-forwarding after a successful prior delivery.

## Final readiness judgment

Repo readiness: strong

Live phone readiness: not complete yet

Publish a phone number only after all of these are complete:

1. Buy the number
2. Configure the SIP trunk
3. Connect the inbound webhook and session bridge
4. Test English and German call behavior
5. Test frustration exits and interruption handling
6. Test summary routing with the shared intent taxonomy
7. Validate that no public promise exceeds the real call flow
8. Only then add a public phone CTA
Until then, keep voice intake private and route buyers through the existing form and email path.
