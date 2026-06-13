# eBill Pakistan

Check Pakistani electricity bills online. Next.js 16 (App Router) + React 19, deployed on Vercel.

## Development

```bash
npm run dev     # local dev server
npm run build   # production build
npm start       # serve production build
```

## Deployment — batch your deploys (SEO / crawl budget)

**Prefer batching changes into fewer, larger deploys rather than pushing many small commits live one at a time.**

Every Vercel deploy rehashes the filenames of all client bundles under
`/_next/static/chunks/*.js` (and `.css`). Googlebot treats each new hashed URL as
a fresh resource to discover and crawl. A burst of small deploys therefore
generates a burst of new JS/CSS URLs, inflating the "JavaScript" share under
GSC → Crawl Stats → *By file type* and skewing the discovery/refresh split —
the exact crawl-budget waste the script cleanup was done to reduce.

Guidelines:

- Group related changes and deploy them together; avoid deploy-per-commit.
- Use Preview deployments for iteration; promote to Production deliberately.
- Content-only edits (copy, metadata) don't need their own production deploy —
  fold them into the next batch.

The long-cache headers Vercel sets on `/_next/static` already let Google cache a
given hash indefinitely; the only churn comes from *new* hashes per deploy, so
fewer deploys = less re-crawl.

## SEO notes

- Canonical host is **non-www**: `https://ebillpakistan.pk`. The www→non-www 301
  is handled at Vercel (Domains), not in app code. `NEXT_PUBLIC_SITE_URL` must be
  set to the non-www value (or left unset — the code defaults to non-www).
- All indexable pages are statically prerendered (SSG). `/result` is
  `force-dynamic` + `noindex` (per-reference lookups).
- Third-party JS (AdSense) loads only on `/result`, never on indexable pages.
- See `seo-crawl-budget-audit.md` and `seo-gsc-monitoring-checklist.md`.
