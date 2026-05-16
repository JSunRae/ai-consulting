# Application Packet Operating System

Updated: `2026-05-12`

This repo now uses a role-family packet system instead of tailoring each application from scratch.

## Canonical base assets

- `Applications/Base Variants/Jason_Rae_Analytics_Leadership_Resume.docx`
- `Applications/Base Variants/Jason_Rae_Product_SaaS_Analytics_Resume.docx`
- `Applications/Base Variants/Jason_Rae_AI_Transformation_Consulting_Resume.docx`
- `Applications/Base Variants/Jason_Rae_Executive_Recruiter_One_Pager.docx`
- `Applications/Base Variants/Jason_Rae_Analytics_Leadership_Cover_Letter_Template.docx`
- `Applications/Base Variants/Jason_Rae_Product_SaaS_Analytics_Cover_Letter_Template.docx`
- `Applications/Base Variants/Jason_Rae_AI_Transformation_Cover_Letter_Template.docx`

## Lane rules

- `Analytics leadership`
  - Default lane
  - Use for Head / Director of Analytics, Data & Analytics, Commercial Analytics
- `Product / SaaS analytics`
  - Stretch lane
  - Use only when funnel, retention, self-serve analytics, experimentation, or product measurement are central
- `AI transformation / consulting`
  - Selective lane
  - Use only when the role emphasizes business integration, productization, governance, executive advisory, or workflow automation

## Required pre-submit checks

1. Verify the role is still live in the current session.
2. Confirm location and work-authorization fit.
3. Confirm compensation plausibly clears the `EUR 125k+ total compensation` floor.
4. Choose the closest base variant first.
5. Tailor only:
   - executive summary
   - role-alignment table
   - priority proof points
   - cover letter
   - form-answer deltas
6. Log the result the same day in `Application Submission Log.md`.

## Script

- Generator: `scripts/generate_job_application_docs.py`
- Current outputs include regenerated prior packets plus current next-wave packets for:
  - `Checkmk`
  - `Pipedrive`
  - `Hypatos`
  - `EPAM`

## Current application order

1. `Checkmk`
2. `Pipedrive` selective
3. `Hypatos` selective
4. `EPAM` only if cross-border consulting compatibility is explicit

## Hard stops

- Do not apply to roles below the compensation floor without an explicit reason.
- Do not force work-authorization answers to fit a form.
- Do not lead with AI roles that are really ML engineering, AI platform, or infra leadership jobs in disguise.
