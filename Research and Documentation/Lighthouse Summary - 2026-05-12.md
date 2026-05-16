# Lighthouse Summary

Captured: `2026-05-12`

## Homepage

- URL: `https://jasonrae.ai`
- Performance: `68`
- Accessibility: `100`
- Best Practices: `100`
- SEO: `100`
- First Contentful Paint: `5063 ms`
- Largest Contentful Paint: `5063 ms`
- Speed Index: `5581 ms`
- Cumulative Layout Shift: `0`

Top opportunities reported:
- `render-blocking-resources`: about `3764 ms`
- `unused-css-rules`: about `170 ms`

## Social Archive

- URL: `https://jasonrae.ai/blog/social-posts.html`
- Performance: `69`
- Accessibility: `100`
- Best Practices: `100`
- SEO: `100`
- First Contentful Paint: `4827 ms`
- Largest Contentful Paint: `4996 ms`
- Speed Index: `4827 ms`
- Cumulative Layout Shift: `0`

Top opportunities reported:
- `render-blocking-resources`: about `3844 ms`
- `unused-css-rules`: about `340 ms`

## Interpretation

- Accessibility, best practices, and SEO are already strong enough for launch.
- Performance is the only meaningful open issue from Lighthouse.
- The main reported problem is render-blocking CSS and font delivery rather than layout instability.
- This is worth tuning, but it is no longer a “we have not checked it” blocker.
