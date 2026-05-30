# Pre-Launch Setup Guide

Use this guide for optional follow-up changes after the current commercialization workstream. The current site already runs with live Formspree submission, email-led scheduling, disabled LinkedIn tracking, and the shipped profile image.

## Pre-Launch Setup Checklist

### Step 1: Formspree (Only if the endpoint changes later)

- The current site already submits successfully through the live Formspree endpoint.
- Only revisit this if the production form ID or newsletter routing changes.
- If that happens, update `js/forms.js` and rerun a real submission test on `contact.html`.

### Step 2: Calendly (Optional future change)

- Go to [https://calendly.com](https://calendly.com) and sign in.
- Claim or replace the placeholder handle `jason-rae-ai-consulting`.
- Create an event type named `Commercial Analytics Diagnostic Review` (30 min).
- The current workstream default is to keep booking email-led.
- Only replace the current flow if a separate decision is made to enable direct booking.

### Step 3: Profile Photo

- Prepare a professional headshot, ideally 800x800 WebP under 120 KB.
- Save it as `profile-photo.webp` in `assets/images/`.
- Replace `assets/images/jason-profile-photo.jpg` in `about.html`.
- Update the alt text to match the final preferred public title.

### Step 4: LinkedIn Insight Tag (Optional future change)

- The current workstream default is to leave this disabled.
- Only enable it if LinkedIn campaigns become part of a later acquisition track.
- In LinkedIn Campaign Manager, copy the Insight Tag partner ID.
- The placeholder tracking snippet has already been removed from public pages.
- If LinkedIn tracking is needed, add the official Insight Tag snippet back with the real partner ID.
- If LinkedIn tracking is not needed, leave it disabled.

### Step 5: Netlify Deployment + Cloudflare DNS

- Push the latest changes to GitHub.
- In Netlify, create a new site from the repo.
- Build command: `npm run build`
- Publish directory: `site-dist`
- Add the custom domain `jasonrae.ai` in Netlify.
- In Cloudflare DNS, create the apex record as either:
  - flattened `CNAME` / `ALIAS` for `jasonrae.ai` -> `apex-loadbalancer.netlify.com`, or
  - fallback `A` record for `jasonrae.ai` -> `75.2.60.5`
- In Cloudflare DNS, create `CNAME` for `www` -> `jasonrae-ai.netlify.app`.
- If Cloudflare proxying causes validation trouble during initial setup, temporarily use DNS-only until Netlify verifies the domain, then re-enable proxying if desired.
- Keep `jasonrae.ai` as the canonical production hostname across the site metadata.

### Step 6: Post-Deploy Verification

- Submit a real test inquiry through `contact.html`.
- If direct booking is enabled later, click through the Calendly path.
- Verify there are no CSP errors for LinkedIn if the tracking tag is enabled.
- Confirm `https://jasonrae.ai` resolves to the live site and serves a valid certificate.
- Decide whether `www.jasonrae.ai` should redirect to `jasonrae.ai` or remain unused.
- Add the domain in Google Search Console and submit `sitemap.xml`.
- Run a Lighthouse pass on the deployed site.
- Run one real-device Safari pass on an iPhone or iPad to confirm layout, nav, chat, and form behavior.

## Quick Find

- `xeqkyzoq` -> scaffold Formspree ID in `js/forms.js`
- `Request Scheduling Link` -> current email-led booking CTA in `contact.html`
- `jason-profile-photo.jpg` -> current live profile image
- `jasonrae.ai` -> owned domain, registered at Cloudflare, ready to point at Netlify
