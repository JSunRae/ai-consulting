# Build-vs-Buy AI Decision Matrix

Prepared by Jason Rae  
Commercial Analytics & Applied AI Leader

Use this matrix when the real decision is not "which AI vendor looks strongest?" but "where should the workflow logic, risk, and operating ownership actually live?"

## 1. Decision before comparison

Do not compare vendor A vs vendor B before you answer these first:

- What workflow or decision are we trying to improve?
- Is the workflow stable enough to automate safely?
- Which exceptions still need human judgment?
- How sensitive is the data, action, or permission model?
- Who will own the workflow after launch?

## 2. Four common paths

### Option A. Off-the-shelf vendor software

Best when:

- the workflow is common across many companies
- the process is stable and low variance
- the team needs speed more than custom control
- the integration pattern is already productized

Main risks:

- weak differentiation under the hood
- hidden usage costs
- thin wrappers around third-party APIs
- limited control over failure handling and permissions

### Option B. OpenAI API orchestration workflow

Best when:

- the workflow needs moderate customization
- the team wants tighter control over prompts, routing, or review rules
- the commercial logic matters more than a large enterprise UI
- the use case is specific enough to justify a lean build

Main risks:

- ownership and monitoring still sit with the business
- exception handling must be designed explicitly
- costs can grow with retries, context windows, and low-quality inputs

### Option C. Retrieval-oriented or narrower tuned system

Best when:

- the workflow depends on internal knowledge, document retrieval, or policy grounding
- source-citation quality matters
- the behavior needs to be constrained around a specific domain

Main risks:

- retrieval quality is often more important than the model itself
- permissioning and document freshness can break trust quickly
- teams often underestimate evaluation and maintenance overhead

### Option D. Higher-control in-house system

Best when:

- the workflow is commercially sensitive
- the data or decision logic is high consequence
- internal governance, auditability, or switching control matters more than speed

Main risks:

- slower initial delivery
- greater internal engineering and support burden
- unclear ownership can stall the build before value appears

## 3. Evaluation dimensions

Score each option from 1 to 5 on the dimensions below.

- Workflow fit: does this option match the real process?
- Exception burden: how much messy reality still lands on humans?
- Data sensitivity: how much control is needed over prompts, logs, and storage?
- Integration load: how hard is it to make the workflow operational?
- Governance strength: can the business audit, review, and reverse failure?
- Cost clarity: can the real production cost be modeled credibly?
- Switching cost: how painful is it if this choice underperforms?
- Ownership realism: is there a real operator after launch?

## 4. Quick comparison table

| Option | Speed | Control | Best for | Main caution |
| --- | --- | --- | --- | --- |
| Vendor software | High | Low to medium | Generic, stable workflows | Demo quality can hide thin product substance |
| API workflow | Medium to high | Medium to high | Focused workflow builds | Monitoring and exception design stay with you |
| Retrieval / tuned system | Medium | Medium to high | Knowledge-grounded workflows | Retrieval, permissions, and evaluation are the hard part |
| Higher-control in-house | Low to medium | High | Sensitive, strategic workflows | Slower start and higher internal burden |

## 5. Commercial filters

Before you decide, ask:

- Is the workflow important enough to deserve custom logic?
- Is the process clean enough to automate, or do we still have upstream chaos?
- Is the real bottleneck tooling, ownership, or decision design?
- Are we buying speed, control, credibility, or political cover?
- What would make this choice a bad decision 12 months from now?

## 6. Recommended decision outcomes

- Buy now when the workflow is generic, stable, and well controlled.
- Build a lean API workflow when the logic matters more than a broad product shell.
- Use retrieval-oriented design when trusted internal knowledge is the core problem.
- Keep higher control in-house when risk, governance, or switching sensitivity dominate.
- Delay the decision when the workflow itself is still too unstable.

## Final test

If the team still cannot explain:

- what workflow is being improved
- where the risk should sit
- what operating owner exists after launch
- what the real cost will be at production scale

then the decision is still too early.