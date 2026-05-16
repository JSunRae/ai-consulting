# Voice Call Test Plan

Prepared: `2026-05-09`

This test plan is for the backend scaffold in:

- `netlify/functions/voice-incoming.mjs`
- `netlify/functions/voice-summary.mjs`
- `netlify/functions/voice-summaries.mjs`
- `assets/data/voice-intake-playbook.json`

## Objective

Verify that the voice intake backend:

- accepts a provider webhook safely
- returns a usable OpenAI Realtime session configuration
- follows the repo playbook
- handles bad requests cleanly
- forwards post-call summaries when configured
- stores summaries as encrypted records with bounded retention
- keeps operator-only retrieval and deletion behind a separate secret

## Test Cases

### 1. Endpoint health check

- `GET /api/voice/incoming`
- `GET /api/voice/summary`

Expected:

- both return `200`
- both return JSON
- both identify the endpoint correctly

### 2. Unauthorized request

- `POST /api/voice/incoming` with a configured `VOICE_WEBHOOK_SECRET`
- omit the secret header

Expected:

- returns `401`
- does not leak session configuration

### 3. Valid inbound call payload

Send a minimal payload:

```json
{
  "provider": "test-sip",
  "callerNumber": "+491234567890"
}
```

Expected:

- returns `accepted: true`
- includes `model`, `voice`, `instructions`, `tools`, and `metadata`
- metadata includes the caller number

### 4. Playbook reflection

Review the returned instructions.

Expected:

- they reference the commercial analytics and applied AI positioning
- they include frustration handling
- they do not promise live transfer
- they include bilingual English/German handling
- they include Challenger-style teaching, tailoring, and next-step control

### 5. Missing summary-storage config

- configure `VOICE_WEBHOOK_SECRET`
- omit `VOICE_SUMMARY_ENCRYPTION_KEY`

Expected:

- `POST /api/voice/summary` returns `503`
- the error states that voice summary storage is not configured

### 6. Valid summary payload

Configure:

- `VOICE_WEBHOOK_SECRET`
- `VOICE_OPERATOR_SECRET`
- `VOICE_SUMMARY_WEBHOOK_URL`
- `VOICE_SUMMARY_ENCRYPTION_KEY`

POST to `/api/voice/summary`:

```json
{
  "callId": "test-call-1",
  "problem_statement": "Forecasting accuracy is poor across regions.",
  "recommended_next_step": "Diagnostic review",
  "transcript": "Example transcript"
}
```

Expected:

- returns `ok: true`
- returns `stored: true`
- returns a `summaryId`
- does not echo the full normalized payload or raw transcript back to the caller

### 7. Summary forwarding

Set `VOICE_SUMMARY_WEBHOOK_URL` to a test webhook.

Expected:

- response includes `forwarded: true` when the webhook accepts the payload
- response includes the returned HTTP status

### 8. Duplicate summary replay

POST the same payload again with the same `callId`.

Expected:

- response stays `200`
- response returns the same `summaryId`
- response marks the replay as `duplicate: true`
- the webhook is not called a second time after a successful prior forward

### 9. Frustration scenario review

Configure:

- `VOICE_OPERATOR_SECRET`

Call `GET /api/voice/summaries` with the operator secret.

Expected:

- returns `200`
- returns metadata-only records
- does not include transcript text in the list response

Call `GET /api/voice/summaries?id=SUMMARY_ID` with the operator secret.

Expected:

- returns `200`
- returns the stored transcript and structured summary for that one record only

Call `DELETE /api/voice/summaries?id=SUMMARY_ID` with the operator secret.

Expected:

- returns `200`
- subsequent reads for that `SUMMARY_ID` return `404`

### 10. Frustration scenario review

Manual QA using the session instructions:

- repeated interruptions
- explicit request for a human
- short clipped responses

Expected:

- next turns are shorter
- the assistant offers graceful callback or email follow-up
- the conversation does not keep pushing qualification questions

### 11. Language switch review

Manual QA:

- caller opens in English
- caller opens in German
- caller starts unclear and needs language clarification

Expected:

- the assistant mirrors English correctly
- the assistant mirrors German correctly
- the assistant uses one short bilingual clarification question when needed

### 12. Challenger-style review

Manual QA:

- give the assistant a vague reporting or forecasting complaint

Expected:

- the assistant identifies the issue
- the assistant adds one short useful reframe or teaching point
- the assistant does not become preachy
- the assistant guides toward a sensible next step

## Non-Goals

- live transfer
- payment or contract commitments
- legal or immigration guidance
- automatic public phone CTA activation
