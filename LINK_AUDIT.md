# Link Audit and Fix Report

## Overview

This document summarizes the link and CTA cleanup completed across the site. The current public conversion path is centered on `Start Diagnostic Review` and `Start Conversation`, supported by email-led contact flow and optional future Calendly activation.

## Critical Fixes

- **Resume Download**:
  - Generated `assets/docs/Jason-Rae-Resume.pdf` from `resume.json`.
  - Updated the main resume download links across the site.

- **Booking / Contact Path**:
  - Replaced the older "Book a Consultation" language with the current diagnostic-review and conversation framing.
  - Removed the public Calendly placeholder from the live site code.
  - Current live path supports email-led contact and follow-up from `contact.html` until a final direct-booking decision is made.

- **Privacy Policy**:
  - Verified `privacy.html` links across the main site and blog footers.

## Social Media & External Links

- **LinkedIn**: Verified as `https://www.linkedin.com/in/jason-c-rae/`.
- **GitHub**: Verified as `https://github.com/JSunRae`.

## Recommendations

1. Add the final live Calendly URL only if direct booking is enabled.
2. Add public demo or code URLs in `assets/data/projects.json` if any featured projects should link out.
3. Keep future CTA updates aligned to the current diagnostic-review and conversation path rather than reintroducing generic consultation wording.
