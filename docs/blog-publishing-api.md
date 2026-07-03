# eBill Pakistan — Blog Publishing API

Publish a blog post to ebillpakistan.pk programmatically. The post goes live at
`https://ebillpakistan.pk/blog/<slug>` and appears in the blog index and
sitemap immediately — no redeploy needed.

> Pair this file with `blog-writing-guidelines.md`, which defines what a post
> must contain before it is allowed to be published.

## Endpoint

```
POST https://ebillpakistan.pk/api/posts
Content-Type: application/json
Authorization: Bearer <BLOG_API_KEY>
```

- The token is the value of the `BLOG_API_KEY` environment variable.
  **Never hardcode it in scripts or commit it anywhere** — read it from an
  environment variable or ask the site owner for it.
- Local development: `POST http://localhost:3000/api/posts` (same key, from
  `.env.local`).

## Request body

| Field             | Type                 | Required | Rules                                                                 |
| ----------------- | -------------------- | -------- | --------------------------------------------------------------------- |
| `title`           | string               | yes      | The H1 / headline of the post.                                        |
| `slug`            | string               | yes      | URL-safe: lowercase letters, digits, hyphens only. Max 100 chars. Becomes `/blog/<slug>`. |
| `metaDescription` | string               | yes      | Max 160 chars (aim 140–155). Shown in search results.                 |
| `content`         | string (Markdown)    | yes      | The article body. Converted to HTML at publish time. Max 200 KB.      |
| `metaTitle`       | string               | no       | Title tag override, max 70 chars (aim under 60). Defaults to `title`. |
| `faqs`            | `[[q, a], ...]`      | no       | Up to 8 pairs. Rendered as an FAQ accordion **and** FAQPage JSON-LD schema. Prefer this over writing FAQs in `content`. |
| `excerpt`         | string               | no       | Short summary (stored; not currently rendered).                       |
| `tags`            | string[]             | no       | Topic tags (stored; not currently rendered).                          |
| `coverImage`      | string (http(s) URL) | no       | Used as the Article JSON-LD image. Defaults to the site OG image.     |
| `publishedAt`     | ISO date string      | no       | Defaults to now. Shown as the "Published" date.                       |

Notes:

- Do **not** put an H1 (`# ...`) in `content` — the page renders `title` as the
  H1 automatically. Start content with the intro paragraph, then `## H2`
  sections.
- Article JSON-LD, breadcrumbs, OpenGraph tags and a disclosed sponsored ad
  slot are added automatically by the site.
- `formatDate` renders dates like "3 July 2026" on the page.

## Responses

| Status | Meaning                                                              |
| ------ | -------------------------------------------------------------------- |
| `201`  | Published. Body: `{ "success": true, "url": "https://ebillpakistan.pk/blog/<slug>" }` |
| `400`  | Validation failed. Body: `{ "success": false, "error": "<what is wrong>" }` |
| `401`  | Missing/invalid bearer token.                                        |
| `409`  | A post with this slug already exists (static article or API post). Pick a new slug — there is no update/overwrite. |
| `413`  | `content` over 200 KB.                                               |
| `503`  | Server has no `BLOG_API_KEY` configured, or the post store is unreachable. |

## Example

```bash
curl -X POST https://ebillpakistan.pk/api/posts \
  -H "Authorization: Bearer $BLOG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to Read Your FESCO Bill Meter Number (2026)",
    "slug": "fesco-bill-meter-number",
    "metaTitle": "How to Read Your FESCO Bill Meter Number",
    "metaDescription": "Find and read the meter number on your FESCO electricity bill, and learn how it differs from the 14-digit reference number. Check your bill today.",
    "content": "Your FESCO bill carries two important numbers...\n\n## Where the meter number appears\n\n...\n\n## Meter number vs reference number\n\n...",
    "faqs": [
      ["Is the meter number the same as the reference number?", "No. The meter number identifies the physical meter; the 14-digit reference number identifies the billing account. Online bill checking uses the reference number."],
      ["Where is the meter number printed?", "In the meter details block of your paper bill, alongside the reading history."]
    ],
    "tags": ["fesco", "bill-reading"],
    "publishedAt": "2026-07-03"
  }'
```

A `201` response means the post is live — verify by opening the returned URL.

## How it works (for maintainers)

- Storage: Vercel KV / Upstash Redis, hash key `blog:posts` (field = slug,
  value = article object). See `lib/posts.js`.
- Markdown → HTML conversion happens once, at publish time (`marked`), in
  `app/api/posts/route.js`. The bearer token is the trust boundary: holders can
  publish arbitrary HTML, so treat `BLOG_API_KEY` like a deploy credential.
- The route calls `revalidatePath` for `/blog`, the new post and the sitemap,
  so pages regenerate on demand while staying static between publishes.
- Static, hand-written articles live in `lib/articles.js` and always win slug
  collisions; the API refuses duplicate slugs with `409`.
- To unpublish a post, delete its field from the `blog:posts` hash in Upstash
  (`HDEL blog:posts <slug>`) and redeploy or revalidate.
