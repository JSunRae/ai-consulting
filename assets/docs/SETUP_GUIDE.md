# Pre-Launch Setup Guide

Use this guide when the real Formspree ID, final booking decision, LinkedIn partner ID, and final visual assets are ready.

## Pre-Launch Setup Checklist

### Step 1: Formspree (Contact Form)

- Go to [https://formspree.io](https://formspree.io) and sign in.
- Create a new form named `Jason Rae Commercial Analytics Health Check`.
- Copy the form ID (the 8 characters after `/f/` in the form URL).
- Open `js/forms.js` and replace `'xeqkyzoq'` with the real ID.
- If newsletter signups should use a separate endpoint, update `FORMSPREE_ID_NEWSLETTER` too.
- Test the form on `contact.html` locally.

### Step 2: Calendly

- Go to [https://calendly.com](https://calendly.com) and sign in.
- Claim or replace the placeholder handle `jason-rae-ai-consulting`.
- Create an event type named `Commercial Analytics Health Check` (30 min).
- If direct booking should be enabled, replace the scheduling-request CTA in `contact.html` with the live Calendly URL.
- If booking should stay email-led, leave the current scheduling-request flow in place.

### Step 3: Profile Photo

- Prepare a professional headshot, ideally 800x800 WebP under 120 KB.
- Save it as `profile-photo.webp` in `assets/images/`.
- Replace `assets/images/profile-placeholder.svg` in `about.html`.
- Update the alt text to match the final preferred public title.

### Step 4: LinkedIn Insight Tag

- Only keep this if LinkedIn campaigns are part of launch.
- In LinkedIn Campaign Manager, copy the Insight Tag partner ID.
- The placeholder tracking snippet has already been removed from public pages.
- If LinkedIn tracking is needed, add the official Insight Tag snippet back with the real partner ID.
- If LinkedIn tracking is not needed, leave it disabled.

### Step 5: Netlify Deployment + Cloudflare DNS

- Push the latest changes to GitHub.
- In Netlify, create a new site from the repo.
- Build command: `npm run build` or leave blank for a static deploy.
- Publish directory: `.`
- Add the custom domain `jasonrae.ai` in Netlify.
- In Cloudflare DNS, create the apex and optional `www` records exactly as Netlify instructs.
- If Cloudflare proxying causes validation trouble during initial setup, temporarily use DNS-only until Netlify verifies the domain, then re-enable proxying if desired.
- Keep `jasonrae.ai` as the canonical production hostname across the site metadata.

### Step 6: Post-Deploy Verification

- Submit a real test inquiry through `contact.html`.
- If direct booking is enabled, click through the Calendly path.
- Verify there are no CSP errors for LinkedIn if the tracking tag is enabled.
- Confirm `https://jasonrae.ai` resolves to the live site and serves a valid certificate.
- Decide whether `www.jasonrae.ai` should redirect to `jasonrae.ai` or remain unused.
- Add the domain in Google Search Console and submit `sitemap.xml`.
- Run a Lighthouse pass on the deployed site.

## Quick Find

- `xeqkyzoq` -> scaffold Formspree ID in `js/forms.js`
- `Request Scheduling Link` -> current email-led booking CTA in `contact.html`
- `profile-placeholder.svg` -> current headshot placeholder
- `jasonrae.ai` -> owned domain, registered at Cloudflare, ready to point at Netlify
