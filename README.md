# Ravah.ai Marketing Website

Premium, performance-focused marketing site for Ravah.ai. Built with Next.js App Router and designed to support enterprise DevOps/SRE conversion flows.

## Stack
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- MDX for blog content

## Getting Started
```bash
npm install
npm run dev
```

## Scripts
- `npm run dev` - local development
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - lint check

## Troubleshooting
- If you see `sh: 1: next: not found`, dependencies are not installed in the project.
- Run:
  ```bash
  npm install
  npm run dev
  ```
- The project includes a startup dependency check (`scripts/ensure-next.js`) that now gives a clear actionable error before running dev/build/start.

## Analytics
Analytics are provider-agnostic via env flags:

```bash
NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible|ga4|posthog
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=example.com
NEXT_PUBLIC_GA4_ID=G-XXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_XXXX
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

Tracked events:
- `cta_demo_click`
- `cta_docs_click`
- `pricing_view`
- `form_submit_demo`
- `newsletter_subscribe`

## Content
- Blog posts live in `content/blog/*.mdx`
- Marketing pages live in `app/*/page.tsx`

## SEO
- Metadata configured per page
- `/sitemap.xml` and `/robots.txt` are generated via Next.js routes
- Blog RSS feed at `/rss.xml`

## Deployment Checklist
- Set analytics env vars (optional)
- Verify `/sitemap.xml`, `/robots.txt`, `/rss.xml`
- Run `npm run build`
