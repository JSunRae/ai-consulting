# AI Vendor Due Diligence Checklist

Prepared by Jason Rae  
Commercial Analytics & Applied AI Leader

Use this checklist before you buy AI software, approve a pilot, or roll a vendor tool into a live workflow.

## 1. Commercial fit

- [ ] What business decision or workflow is this product supposed to improve?
- [ ] What current cost, delay, or quality problem makes this worth solving now?
- [ ] What business metric should improve if the product works?
- [ ] Who owns the outcome after the tool goes live?

## 2. Product architecture

- [ ] Is the system fine-tuned, retrieval-based, prompt-engineered, or mostly a wrapper around a third-party API?
- [ ] Which model providers sit underneath the product?
- [ ] What proprietary logic belongs to the vendor versus the model provider?
- [ ] What happens when the model is uncertain, unavailable, or wrong?

## 3. Data flow and security

- [ ] Where does user input go?
- [ ] Is customer or company data sent to a third-party model provider?
- [ ] Is any data stored after processing?
- [ ] Are prompts or outputs logged?
- [ ] Who can access those logs?
- [ ] Is data used for training at any layer?
- [ ] Which subprocessors are involved?
- [ ] Where is the data hosted geographically?

## 4. Permissions and governance

- [ ] Does the system respect document-level and role-level permissions?
- [ ] Can users retrieve information they should not be allowed to see?
- [ ] Are sensitive workflows protected by approval rules or human review?
- [ ] Can risky actions be blocked, escalated, or reversed?
- [ ] Does the product support auditability after an incident?

## 5. Output reliability

- [ ] Does the system cite sources when it answers from company knowledge?
- [ ] Are those citations actually grounded in retrieved material?
- [ ] What are the known failure modes?
- [ ] Can the vendor show how the system behaves on edge cases?
- [ ] What confidence, abstention, or escalation mechanisms exist?
- [ ] How much human review is still required per trusted output?

## 6. Workflow fit

- [ ] Is the process standard enough to automate safely?
- [ ] What exception rate does the workflow carry today?
- [ ] Will the tool remove work or only move work into review and cleanup?
- [ ] What handoffs, approvals, and ownership changes are required?
- [ ] What existing systems must this product integrate with?

## 7. Cost and scalability

- [ ] What is the licence cost?
- [ ] What usage-based costs sit underneath the licence?
- [ ] What happens to cost at real production volume?
- [ ] Have retries, long context windows, and heavy document loads been modeled?
- [ ] What internal support, monitoring, or engineering burden will remain?

## 8. Build vs buy decision

- [ ] Is the workflow generic enough for off-the-shelf software?
- [ ] Is the critical logic sensitive enough that a controlled internal workflow is safer?
- [ ] Would a lighter OpenAI API orchestration layer solve the problem better than a heavy vendor product?
- [ ] What is the switching cost if the tool underperforms?

## 9. Go / no-go gate

- [ ] Proceed now
- [ ] Proceed only with controls
- [ ] Run a contained pilot first
- [ ] Re-scope the workflow before buying
- [ ] Reject

## Final test

If the vendor cannot explain:

- what the system really is
- where your data goes
- how it fails
- what it costs at scale
- and why the workflow will absorb it

then you are probably not ready to buy.
