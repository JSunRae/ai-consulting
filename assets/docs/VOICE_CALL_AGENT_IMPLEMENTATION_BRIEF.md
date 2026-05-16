# Voice Call Agent Implementation Brief

## Objective

Add a real phone intake path to the AI Consulting site so prospective clients can call a dedicated number, speak with an OpenAI-powered voice intake assistant, and leave the call with a clear next step instead of a dead-end chatbot experience.

This is a good fit for the repo, but it should be implemented as a separate service layer on top of the static site rather than as pure frontend code.

## Current repo fit

- The current site is static and Netlify-hosted.
- The site already has a clear consulting intake path and a chatbot pattern that can be reused conceptually.
- The missing pieces for phone intake are telephony, a webhook-capable backend, structured lead capture, and a call playbook.

## Recommended architecture

### Telephony

- Buy a dedicated business number from a SIP trunking provider.
- Use a provider that can bridge inbound phone calls into OpenAI's Realtime API over SIP.
- Keep the consulting number separate from any personal mobile number.

Current provider recommendation:

- `Twilio Elastic SIP Trunking` is the phase-1 default.
- `Wavix` is the first fallback.
- `Telnyx` is the second fallback if price matters but only after a proof test.

### OpenAI path

- Use the Realtime API with SIP for inbound calls.
- Accept incoming calls with a server-side webhook.
- Configure the Realtime session on call accept with:
  - model
  - voice
  - instructions
  - tool definitions
  - turn detection

### Repo and service split

- Keep the website static in this repo.
- Add call-agent configuration and prompts in this repo.
- Run the webhook and realtime event monitor as a lightweight backend service.
- Netlify Functions may be sufficient for the initial webhook entrypoint, but a more persistent service is safer if you want richer call monitoring, summaries, routing, and post-call automation.

## Recommended first implementation

### Phase 1: safe MVP

- Inbound calls only
- Voice assistant handles first-call intake
- No live transfer
- Capture:
  - name
  - company
  - role
  - email
  - phone
  - problem statement
  - urgency
  - suggested next step
- End the call by stating Jason will follow up personally

### Phase 2: better routing

- Email Jason a structured call summary
- Store lead summaries in a simple CRM or sheet
- Add callback scheduling handoff
- Add recruiter-vs-client routing logic

### Phase 3: richer call control

- Detect repeated interruption or frustration patterns
- Offer graceful early exit and callback
- Add human takeover or redirect path if you later want it

## Recommended OpenAI configuration

### Model

- Start with `gpt-realtime-1.5` for strong voice-agent behavior and customer-support style calls.
- Test `gpt-realtime-2` later if you want stronger reasoning and tool use.

### Voice

- Start with `cedar` or `marin`.
- Keep delivery calm, concise, and businesslike.

### Turn handling

- Leave VAD enabled.
- Use short agent turns.
- Avoid stacked multi-part questions.

## Call design rules

### What the agent should do

- Identify the business problem
- Qualify likely fit
- Explain the likely next step
- Capture contact details
- De-escalate if the caller is irritated

### What the agent should not do

- Quote binding fees without scope
- Promise Jason is immediately available unless that workflow exists
- Give legal or immigration advice
- Over-explain AI

## Frustration handling

Do not treat frustration as a native emotion-detection feature. Treat it as a monitored operating pattern using:

- repeated interruptions
- explicit phrases like "this is taking too long"
- repeated requests for a human
- silence after overlong questions
- short, clipped answers after earlier engagement

When those signals appear:

1. shorten the next response
2. acknowledge friction
3. offer callback or email follow-up
4. end cleanly if the caller wants out

## Public website recommendation

Do not publish a phone CTA until all three are true:

- the number is purchased
- the inbound webhook is live
- the prompt and summary flow are tested

Once ready, add a contact-page block like:

`Call the consulting intake line to explain what is breaking in forecasting, pricing, margin, CRM, reporting, workflow, or AI adoption. The voice assistant will capture the issue and route the right next step.`

Also add a disclosure that the caller is speaking to an AI assistant and that Jason reviews follow-up personally.

## Repo assets created now

- `assets/data/voice-intake-playbook.json`
- this implementation brief

These are the right first additions because they define the operating behavior before any phone number is made public.

## Suggested next repo additions

- `netlify/functions/openai-incoming-call.js`
  - receive incoming webhook
  - accept or reject inbound calls
- `server/voice-intake/`
  - realtime event monitoring
  - post-call summary generation
  - email or CRM routing
- `assets/docs/VOICE_CALL_TEST_PLAN.md`
  - scripted test cases
  - edge cases
  - frustration and stop-path tests

## Decision

Yes, this is worth adding to the repo.

No, the next correct move is not to publish a phone number yet.

The right next move is:

1. buy the Twilio number
2. configure the Twilio SIP trunk to the OpenAI SIP endpoint
3. wire the webhook service
4. test the call playbook internally
5. only then expose the number on the website
