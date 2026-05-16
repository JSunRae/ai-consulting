# SIP Provider Research Prompt

Use this prompt with a research agent:

`Research the best SIP / telephony provider options for adding a public consulting intake phone number to the jasonrae.ai website. The site is a static Netlify-hosted personal consulting site for Jason Rae, based in Germany, and the phone path is intended for prospective consulting clients and possibly recruiter / hiring-manager calls. The voice assistant should use OpenAI Realtime API with SIP for inbound phone calls, not a generic IVR.`

`Your job is to recommend the best provider or shortlist of providers for phase-1 implementation. Prioritize providers that work well with OpenAI Realtime SIP patterns, support Germany / DACH numbers, are realistic for a solo consultant or small business, and do not force an overbuilt enterprise setup.`

## Context

- Public website: `https://jasonrae.ai`
- Region: Germany / DACH
- Use case: inbound consulting intake line
- Phase 1 scope:
  - inbound calls only
  - no live transfer required
  - AI assistant captures structured intake
  - Jason follows up personally
- Desired architecture:
  - dedicated business number
  - SIP-capable provider
  - webhook-capable backend
  - OpenAI Realtime API with SIP
  - structured post-call summary
- Hosting/runtime:
  - static site on Netlify
  - backend can be Netlify Functions or another lightweight service

## What To Research

1. Which SIP / telephony providers are the best fit for this exact use case.
2. Whether each provider supports:
   - inbound phone numbers in Germany or easy DACH coverage
   - SIP trunking or SIP call bridging
   - webhook events for incoming calls
   - media streaming or a realistic path into OpenAI Realtime SIP
   - caller ID / number provisioning for Germany
   - acceptable setup for a solo or very small business
3. Regulatory / operational concerns:
   - German or EU number availability
   - KYC / identity checks
   - GDPR / EU data handling considerations
   - call recording implications
4. Commercial constraints:
   - expected monthly number cost
   - inbound minute pricing
   - setup friction
   - whether the provider is clearly overkill for a one-number consulting intake line
5. Integration quality:
   - how cleanly it can work with OpenAI Realtime SIP
   - how much custom middleware is likely required
   - whether it supports future expansion like:
     - human handoff
     - outbound callback
     - call transcription
     - CRM or email summary routing

## Providers To Compare

At minimum compare:

- Telnyx
- Twilio
- Vonage
- Plivo
- SignalWire
- at least 2 Germany / EU-leaning alternatives if they are credible for SIP + webhook + AI voice intake

Do not force a local provider into the shortlist if they are weak on developer tooling or OpenAI compatibility.

## Evaluation Criteria

Score each provider from `1-10` on:

- Germany / DACH number fit
- OpenAI Realtime SIP compatibility
- developer experience
- webhook / event model
- price for a small operator
- setup friction
- future extensibility
- overall recommendation for Jason's use case

## Output Format

Return:

1. Executive recommendation
2. Best overall provider
3. Best low-friction provider
4. Best EU / DACH-sensitive option
5. Comparison table
6. Main technical tradeoffs
7. Main legal / operational cautions
8. Recommended phase-1 architecture using the best provider
9. A practical implementation sequence for the repo
10. A list of exact doc links used

## Important Constraints

- Use current official provider docs and current official OpenAI docs.
- Prefer primary sources over blogs.
- Be explicit about which claims are confirmed vs inferred.
- Do not assume that "supports SIP" automatically means "good fit for OpenAI Realtime voice."
- Do not optimize for enterprise call-center complexity. Optimize for a solo consultant with one public number and an AI intake assistant.
