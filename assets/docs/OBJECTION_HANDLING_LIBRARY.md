# Objection Handling Library

Last updated: 2026-05-12

Use these snippets in chat, calls, proposals, and written follow-up.
Each response should acknowledge the buyer's logic, teach the hidden issue, and route toward the next diagnostic step.

## 1. Can't we just use ChatGPT?

Acknowledgement:

`For early exploration, that is a reasonable instinct. It is fast, cheap, and useful for testing ideas.`

Teaching point:

`The hidden issue is that generic ChatGPT access does not answer where company data should live, how outputs are validated, who owns exception handling, or how the workflow stays auditable once more people depend on it.`

Route:

`If the question is simple experimentation, start with a fit call. If the workflow matters commercially, the better next step is the Commercial Analytics Diagnostic Review or AI Software & Vendor Due Diligence.`

Intent tags:

- vendor_diligence
- build_vs_buy
- implementation_scope

## 2. Why not buy a copilot?

Acknowledgement:

`Buying a product can be the right answer when the workflow is standard enough and the control model is acceptable.`

Teaching point:

`The hidden issue is that many copilots look differentiated in a demo but still rely on the same underlying APIs, weak workflow controls, or expensive review patterns. The buying decision is only sound if you understand the data path, permissions, failure modes, and operating burden.`

Route:

`If a vendor shortlist already exists, route to AI Software & Vendor Due Diligence. If the workflow itself is still unclear, start with the Diagnostic Review.`

Intent tags:

- vendor_diligence
- build_vs_buy
- implementation_scope

## 3. Why not build in-house?

Acknowledgement:

`That can make sense when the decision logic, integrations, permissions, or audit trail are too important to outsource.`

Teaching point:

`The hidden issue is that internal build only wins if the team is prepared to own workflow design, exception handling, evaluation, cost management, and post-launch governance. Internal code does not remove operating complexity; it makes you the owner of it.`

Route:

`Use AI Software & Vendor Due Diligence when comparing internal build against vendors or API-led options. Use the Diagnostic Review when the business problem is still broader than the architecture decision.`

Intent tags:

- build_vs_buy
- vendor_diligence
- implementation_scope

## 4. We want to reduce headcount

Acknowledgement:

`It is fair to look for cost leverage, especially if service or analyst workloads are visibly bloated.`

Teaching point:

`The hidden issue is that AI usually removes tasks before it removes roles. Savings stay theoretical unless the workflow, ownership, exception handling, and measurement model change too. Capacity capture is usually the more honest early target.`

Route:

`Route toward the Diagnostic Review if the workflow and baseline are unclear. Route toward customer-service or workflow scoping only after the business can measure capacity, service quality, or cost change credibly.`

Intent tags:

- headcount_or_capacity
- customer_service_ai
- implementation_scope

## 5. The vendor says it's fine-tuned

Acknowledgement:

`That may be true, and it may still be useful. Fine-tuning can improve behavior in narrow patterns.`

Teaching point:

`The hidden issue is that fine-tuning does not answer the bigger commercial questions by itself: where the data goes, how retrieval works, how outputs are validated, who reviews exceptions, and whether the workflow stays cost-effective at production volume.`

Route:

`Treat that as a due-diligence prompt, not a buying conclusion. Move to AI Software & Vendor Due Diligence if the shortlist exists, or the Diagnostic Review if the workflow is still unclear.`

Intent tags:

- vendor_diligence
- build_vs_buy
- pricing
