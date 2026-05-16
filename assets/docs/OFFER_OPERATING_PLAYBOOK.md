# Offer Operating Playbook

Last updated: 2026-05-11

## Purpose

This document turns the public website offers into working delivery definitions.
Use it as the internal reference for:

- what each offer actually includes
- what Jason does in each step
- what gets delivered
- what should be published vs kept internal
- how inquiries should be routed after form submission

## Canonical Rules

- Generic CTA label: Book Fit Call
- Named diagnostic CTA: Start Diagnostic Review
- Named diagnostic offer: Commercial Analytics Diagnostic Review
- Default response promise: review within 24-48 hours
- Diagnostic Review duration: 90 minutes plus written summary
- Contact page should route all offers, not only the Diagnostic Review
- Every CTA to the contact page should carry source, offer, CTA label, and section context

## Offer Inventory

### 1. Commercial Analytics Diagnostic Review

Public status: Published

Published details currently on site:
- 90-minute working session plus written summary
- Current-state assessment across forecasting, pricing, margin, CRM, and reporting
- Top 5 decision-system risks and ownership gaps
- Quick wins and likely root causes
- Recommended roadmap and first use-case priority
- Best when leaders know something is off but not yet why

Internal delivery shape:
- Pre-work:
  - Review intake form
  - Confirm participants, business context, and key symptoms
  - Ask for any existing forecast deck, KPI pack, reporting sample, or CRM notes if available
- Session flow:
  - 10 min: business context and commercial pressure points
  - 20 min: where decisions currently lose trust
  - 20 min: forecasting, pricing, margin, CRM, reporting, and ownership review
  - 15 min: system constraints, tools, governance, and political blockers
  - 15 min: initial diagnosis, likely root causes, and route recommendation
  - 10 min: agree follow-up actions and timing
- Written output within 48 hours:
  - problem summary
  - root-cause hypothesis
  - top risks
  - quick wins
  - recommended next offer
  - suggested stakeholders for follow-up

Best fit:
- MD, FD, Commercial Director, Sales Director, COO, Head of BI/Analytics
- low trust in numbers
- debate around symptoms, not root cause

Likely next step:
- Vendor Due Diligence
- Prioritization Sprint
- Foundation Fix
- Workflow Deployment
- Enablement
- no-fit / refer out

### 2. AI Software & Vendor Due Diligence

Public status: Published

Published details currently on site:
- standalone evaluation offer for AI software, copilots, agents, document AI, and workflow tools
- not publicly priced in this phase
- focused on build-vs-buy, data flow, governance, logging, permissions, cost, and failure modes

Internal delivery shape:
- Review vendor materials, demos, architecture claims, and security posture
- Clarify whether the offer is product IP, retrieval, orchestration, fine-tuning, or mostly API wrapping
- Map where company data travels, what gets logged, and what breaks under production load
- Assess the operating burden across prompts, exceptions, escalation, and internal ownership
- Output:
  - buy / pilot / reject / proceed-with-controls recommendation
  - risks and required controls
  - build-vs-buy recommendation
  - likely total operating burden

Best fit:
- buyer is comparing tools or vendor categories
- internal team needs an independent diligence layer before commitment
- the real risk sits in architecture, governance, or operating cost rather than demo polish

Likely next step:
- Diagnostic Review
- Workflow Deployment
- no-fit / reject vendor

### 3. Decision Opportunity Prioritization Sprint

Public status: Published

Published details currently on site:
- 2-week sprint
- decision-friction workshop with stakeholders
- data and process readiness assessment
- prioritized shortlist of workflow, reporting, automation, and AI opportunities
- 90-day roadmap with implementation priorities
- governance and adoption considerations

Internal delivery shape:
- Week 1:
  - stakeholder interviews
  - decision-friction mapping
  - current-state tool and ownership review
  - shortlist use cases and blockers
- Week 2:
  - score each use case by business value, feasibility, data readiness, ownership, and adoption risk
  - define first 90-day sequence
  - identify required sponsors and operating owners
- Output:
  - opportunity matrix
  - recommended sequence
  - first use case definition
  - no-go list for weak ideas
  - governance notes

Best fit:
- too many ideas
- AI interest exists but prioritization is weak
- leadership needs a sequence, not another brainstorm

Likely next step:
- Foundation Fix
- Workflow Deployment
- Enablement

### 4. Commercial Analytics Foundation Fix

Public status: Published

Published details currently on site:
- 3-6 weeks
- scope examples across forecast accuracy logic, margin walk structure, pricing waterfall logic, CRM governance, KPI definitions, semantic models, dashboard rationalization, and executive packs
- positioned as build and repair work

Internal delivery shape:
- Workstreams vary by client, but usually include:
  - KPI and metric-definition audit
  - ownership clarification
  - reporting / semantic model repair
  - CRM-quality or forecast-process reset
  - margin / pricing logic correction
  - executive review pack redesign
- Output:
  - repaired logic or operating design
  - working reporting / process changes
  - governance notes
  - handover guidance
  - operating cadence recommendations

Best fit:
- dashboards exist but decisions still feel wrong
- leadership already knows roughly what is broken
- root cause is likely logic, governance, data quality, or ownership

Likely next step:
- Workflow Deployment
- Enablement
- fractional advisory check-ins

### 5. Commercial Workflow Deployment

Public status: Published

Published details currently on site:
- 4-8 weeks
- build one practical workflow that improves decision speed, reporting quality, or control
- use cases include forecast commentary automation, controlled narrative generation, CRM scoring, pricing exception detection, and document intelligence

Internal delivery shape:
- Discovery and workflow definition
- build one production-worthy workflow with clear scope
- validation rules and exception handling
- user review loop
- rollout and ownership handoff
- Output:
  - deployed workflow or pilot-ready system
  - validation and guardrail rules
  - operating notes
  - stakeholder training / handover

Best fit:
- one high-value workflow is clear enough to build
- sponsor exists
- ownership can be assigned
- measurement criteria are known

Likely next step:
- Enablement
- retained advisory / optimization
- second workflow after proof

### 6. Commercial Team Enablement

Public status: Published

Published details currently on site:
- half day, full day, or multi-week program
- training for sales, finance, analysts, managers, and executives
- topics include decision hygiene, safe LLM use, deterministic AI workflows, forecasting/pricing/CRM/reporting use cases, and ROI identification

Internal delivery shape:
- format options:
  - executive briefing
  - half-day workshop
  - full-day team training
  - multi-week cohort enablement
- Output:
  - agenda and materials
  - example workflows / use-case pack
  - adoption guidance
  - post-session recap and recommended next actions

Best fit:
- capability gap is the main blocker
- team needs shared language and safer operating habits
- build exists or is coming and adoption matters

Likely next step:
- Workflow Deployment
- advisory support
- follow-up enablement module

## Secondary Routing States

These are supported intake states, not public product lines.

### 7. Hiring Conversation

Public status: Published
Recommended canonical handling:
- Keep as a supported intake path on the contact form
- Should not be forced through consulting language after submission

### 8. Fit Call

Public status: Published as the generic CTA language
Purpose:
- qualification-first default call to action across the site
- does not replace the Diagnostic Review
- exists to qualify, route, and decide whether the next step should be Diagnostic Review, Vendor Due Diligence, or a later-stage offer

## Routing Logic For New Inquiries

### Route to Diagnostic Review when:
- the problem is real but still fuzzy
- trust is low and the root cause is unclear
- multiple areas are involved
- the buyer wants diagnosis before build scope

### Route to Prioritization Sprint when:
- there are many candidate initiatives
- leadership wants a sequenced roadmap
- AI ideas are already piling up

### Route to Foundation Fix when:
- the broken logic is already fairly obvious
- the main task is repair rather than discovery

### Route to Workflow Deployment when:
- one use case is already concrete enough to build
- ownership and value target are known

### Route to Enablement when:
- the main issue is capability, adoption, or governance behavior

### Route to Hiring Conversation when:
- full-time, fractional leadership, or advisory role discussion is the actual ask

## What To Publish vs Keep Internal

Publish:
- what the offer is for
- duration range
- key deliverables
- best-fit scenario
- expected response time

Keep internal:
- session agenda detail
- scoring logic
- routing heuristics
- exact follow-up templates
- any client-sensitive examples

## Suggested Response Templates

### Diagnostic Review recommendation
- Thanks for the detail.
- Based on what you described, the best starting point is the Commercial Analytics Diagnostic Review.
- The goal would be to isolate where trust is breaking across the decision system, then give you written next steps within 48 hours.

### Sprint recommendation
- Thanks for the detail.
- You appear to have several candidate initiatives rather than one clear starting point.
- The best route looks like the Decision Opportunity Prioritization Sprint so we can rank opportunities and define the first 90 days properly.

### Foundation Fix recommendation
- Thanks for the detail.
- This sounds less like discovery and more like repair of an already visible problem.
- The best next step looks like a scoped Commercial Analytics Foundation Fix.

### Workflow deployment recommendation
- Thanks for the detail.
- You already seem to have one clear workflow worth building.
- The best next step is likely a scoped Commercial Workflow Deployment discussion.

## Open Items Still To Decide

- Whether the AI-assisted verbal intake becomes public or stays invite-only
- Whether the Diagnostic Review remains the most-prominent offer on the homepage hero path
- Whether workshops should be named more tightly by buyer type
- Whether a separate pricing / investment guide should be published later
