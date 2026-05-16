# Twilio OpenAI SIP Phase 1 Plan

Prepared: `2026-05-09`

## Decision

Use **Twilio Elastic SIP Trunking** as the phase-1 provider for the public AI intake line.

This is the current preferred order:

1. `Twilio`
2. `Wavix`
3. `Telnyx`
4. `DIDWW`

Do not start phase 1 with `Plivo`, `Vonage`, `SignalWire`, or `sipgate` for this specific inbound OpenAI Realtime SIP intake path.

## Why Twilio first

- strongest confirmed OpenAI Realtime SIP implementation path
- clear Germany number and SIP pricing
- straightforward developer tooling for a small operator
- good future path for callback, transfer, recording decisions, and observability

## Phase 1 architecture

```text
Caller
  -> Twilio German number
  -> Twilio Elastic SIP Trunk
  -> OpenAI Realtime SIP endpoint
  -> OpenAI webhook to Jason backend
  -> Jason backend accepts/configures/monitors call
  -> structured summary delivered to Jason
```

## Repo impact

The current repo already contains:

- the intake playbook
- the voice runtime instructions
- the Netlify function scaffolding

What remains is provider-specific integration:

- buy the number
- configure the Twilio SIP trunk
- point origination to the OpenAI SIP endpoint
- configure the OpenAI webhook
- add summary delivery

## Required environment variables

- `OPENAI_API_KEY`
- `OPENAI_PROJECT_ID`
- `OPENAI_WEBHOOK_SECRET`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `TWILIO_SIP_TRUNK_SID`
- `VOICE_WEBHOOK_SECRET`
- `SUMMARY_TO_EMAIL`
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`

## Required backend behaviors

On inbound OpenAI realtime webhook:

1. verify the webhook signature
2. receive `realtime.call.incoming`
3. extract `call_id`
4. accept the call
5. apply the bilingual Challenger-style session instructions
6. monitor transcript and tool activity server-side
7. normalize the post-call summary
8. send Jason the summary

## Important caution

Do not assume live-call JSON structure from the realtime model is enough on its own.

Preferred pattern:

- capture transcript and event data during the call
- produce a separate post-call normalization step for reliable structured output

## Legal / operational guidance

- do not record calls by default
- clearly disclose the AI assistant at the start of the call
- keep logging minimal
- prefer EU data residency where available and appropriate
- do not publish the phone number until the path is tested end to end
