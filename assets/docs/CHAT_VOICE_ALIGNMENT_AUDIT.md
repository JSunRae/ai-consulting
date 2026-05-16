# Chat, Voice, And Sales Asset Alignment Audit

Last updated: 2026-05-12

## Objective

Validate that buyer-facing chat, internal voice intake, and repo-native sales assets use the same commercial reasoning, offer ladder, and first-step guidance.

## Locked Decisions Confirmed

- Public qualification CTA: Book Fit Call
- Public offer-page CTA: Start Diagnostic Review
- Educational CTA: Download Checklist
- Public pricing shown in this phase: Commercial Analytics Diagnostic Review at EUR 950 net
- AI Software & Vendor Due Diligence: available, but not publicly priced in this phase
- No public voice CTA until backend flow is fully production-ready

## Shared Intent Taxonomy

- pricing
- vendor_diligence
- build_vs_buy
- customer_service_ai
- headcount_or_capacity
- implementation_scope

Implemented in:

- js/chatbot.js
- assets/data/voice-intake-playbook.json
- netlify/functions/_shared/voice-agent.mjs
- netlify/functions/voice-summary.mjs

## Scenario QA

### 1. Pricing

- Result: aligned
- Standard used: only the Diagnostic Review is publicly priced
- Teaching test: passes
- Notes: chatbot and voice now both point to EUR 950 net as the first paid step and avoid pricing larger work prematurely

### 2. Build vs buy

- Result: aligned
- Standard used: decision should focus on data flow, control, review burden, and workflow ownership
- Teaching test: passes
- Notes: chatbot and voice both now frame build-vs-buy as an operating-control question, not just a tooling preference

### 3. Fine-tuned agent vs OpenAI API vs in-house

- Result: aligned
- Standard used: fine-tuning, retrieval, and internal builds solve different problems
- Teaching test: passes
- Notes: chatbot now answers this explicitly; voice playbook and session prompt use the same distinction

### 4. Customer-service automation

- Result: aligned
- Standard used: start with avoidable contact, escalation design, and knowledge quality before customer-facing automation
- Teaching test: passes
- Notes: chat and voice both teach that the workflow problem usually comes before the chatbot decision

### 5. Headcount reduction / capacity capture

- Result: aligned
- Standard used: AI usually removes tasks before roles, so measurable capacity capture is the better early test
- Teaching test: passes
- Notes: objection handling and chatbot language now use the same view

### 6. Vendor due diligence

- Result: aligned
- Standard used: challenge vendor claims around fine-tuning, data flow, permissions, failure modes, and production cost
- Teaching test: passes
- Notes: routed consistently to AI Software & Vendor Due Diligence or Diagnostic Review when the workflow remains unclear

## Sales Asset Operationalization Status

- Discovery call script: converted to live checklist
- Proposal template: converted to operational proposal framework
- Objection handling library: created
- Post-call summary template: created
- Recommendation memo template: created

## Remaining Voice Readiness Gaps

The repo is commercially aligned, but the live phone path is still incomplete.

What remains before any public phone CTA is allowed:

1. Purchase the business number
2. Configure the SIP provider in production
3. Connect inbound routing into the realtime session flow
4. Test English and German behavior on real calls
5. Test frustration exits and interruption handling on real calls
6. Test summary forwarding into the chosen follow-up channel
7. Confirm the production summary includes the shared intent taxonomy cleanly

## Final Judgment

- Chat alignment: pass
- Voice playbook alignment: pass
- Sales-asset alignment: pass
- Public voice CTA compliance: pass after removing the public phone block from the contact page
- Live phone readiness: not yet production-ready
