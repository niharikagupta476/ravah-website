# Ravah.ai Marketing Website

Premium, performance-focused marketing site for Ravah.ai. Built with Next.js App Router and designed to support enterprise DevOps/SRE conversion flows.

## Stack
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- MDX for docs and blog content

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
- The project includes a startup dependency check (`scripts/ensure-next.js`) that gives actionable errors before running dev/build/start.

## Analytics
Configure one or more analytics providers with environment variables:

```bash
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

## APIs
- `POST /api/contact` validates and processes demo/contact submissions and sends email via Resend.
- `POST /api/score` calculates a Ravah maturity score for the score page.

Required contact email env vars:

```bash
RESEND_API_KEY=re_xxx
CONTACT_FROM_EMAIL=Ravah <noreply@ravah.ai>
CONTACT_TO_EMAIL=hello@ravah.ai
```

## Content
- Docs content lives in `content/docs/*.mdx`
- Blog posts live in `content/blog/*.mdx`
- Use case data lives in `content/use-cases.json`

## SEO
- Metadata configured per page
- `/sitemap.xml` and `/robots.txt` are generated via Next.js routes
- Blog RSS feed at `/rss.xml`

## Deployment Checklist
- Set analytics env vars (optional)
- Set contact API env vars for Resend email delivery
- Verify `/sitemap.xml`, `/robots.txt`, `/rss.xml`
- Run `npm run build`
