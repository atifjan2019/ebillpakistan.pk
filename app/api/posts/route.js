// POST /api/posts — publish a blog post from an external service.
//
// Auth:    Authorization: Bearer <BLOG_API_KEY>   (401 on mismatch/missing,
//          503 if the server has no BLOG_API_KEY configured — fail closed)
// Body:    { title, slug, metaDescription, content (Markdown), excerpt?,
//            tags?, coverImage?, publishedAt?, updatedAt?, metaTitle?, faqs?,
//            author? }
// author is an author slug from lib/authors.js; omitted posts fall back to the
// site's default editor at render time (see authorFor), so every post — including
// ones published before this field existed — carries a byline.
// faqs is an array of [question, answer] string pairs; it feeds the FAQ
// accordion and FAQPage JSON-LD exactly like static articles' faqs field.
// Result:  201 { success: true, url } | 400 | 401 | 409 | 413 | 503
//
// Storage: Vercel KV / Upstash Redis (hash blog:posts, see lib/posts.js).
// Markdown is converted to HTML here, at publish time, so the article page
// renders API posts through the same trusted-HTML pipeline as lib/articles.js.
// The bearer token is the trust boundary: anyone holding it can publish
// arbitrary HTML, so treat BLOG_API_KEY like a deploy credential.
import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { marked } from "marked";
import { SITE_URL } from "../../../lib/seo";
import { getPost, savePost } from "../../../lib/posts";
import { AUTHORS, DEFAULT_AUTHOR } from "../../../lib/authors";

export const runtime = "nodejs";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_CONTENT = 200_000; // ~200 KB of Markdown is plenty for an article

function authorized(req) {
  const key = process.env.BLOG_API_KEY;
  if (!key) return null; // not configured
  const m = (req.headers.get("authorization") || "").match(/^Bearer\s+(\S+)$/i);
  if (!m) return false;
  // Hash both sides so timingSafeEqual gets equal-length buffers.
  const got = crypto.createHash("sha256").update(m[1]).digest();
  const want = crypto.createHash("sha256").update(key).digest();
  return crypto.timingSafeEqual(got, want);
}

const bad = (status, error) => Response.json({ success: false, error }, { status });

export async function POST(req) {
  const auth = authorized(req);
  if (auth === null) return bad(503, "Publishing is not configured on this server (BLOG_API_KEY is unset).");
  if (!auth) return bad(401, "Invalid or missing bearer token.");

  let body;
  try {
    body = await req.json();
  } catch {
    return bad(400, "Request body must be valid JSON.");
  }

  const { title, slug, metaDescription, content, excerpt, tags, coverImage, publishedAt, updatedAt, metaTitle, faqs, author } = body || {};

  const errors = [];
  if (typeof title !== "string" || !title.trim()) errors.push("title is required (non-empty string)");
  if (typeof slug !== "string" || !SLUG_RE.test(slug)) errors.push("slug is required and must be url-safe (lowercase letters, digits, hyphens)");
  else if (slug.length > 100) errors.push("slug must be 100 characters or fewer");
  if (typeof metaDescription !== "string" || !metaDescription.trim()) errors.push("metaDescription is required");
  else if (metaDescription.length > 160) errors.push("metaDescription must be 160 characters or fewer");
  if (typeof content !== "string" || !content.trim()) errors.push("content is required (Markdown string)");
  if (excerpt !== undefined && typeof excerpt !== "string") errors.push("excerpt must be a string");
  if (tags !== undefined && !(Array.isArray(tags) && tags.every((t) => typeof t === "string"))) errors.push("tags must be an array of strings");
  if (coverImage !== undefined && !/^https?:\/\/\S+$/.test(String(coverImage))) errors.push("coverImage must be an http(s) URL");
  if (publishedAt !== undefined && Number.isNaN(Date.parse(publishedAt))) errors.push("publishedAt must be an ISO date string");
  if (updatedAt !== undefined && Number.isNaN(Date.parse(updatedAt))) errors.push("updatedAt must be an ISO date string");
  if (author !== undefined && !AUTHORS[author]) errors.push(`author must be one of: ${Object.keys(AUTHORS).join(", ")}`);
  if (metaTitle !== undefined && (typeof metaTitle !== "string" || !metaTitle.trim() || metaTitle.length > 70)) errors.push("metaTitle must be a non-empty string of 70 characters or fewer");
  if (faqs !== undefined && !(Array.isArray(faqs) && faqs.length <= 8 && faqs.every((f) => Array.isArray(f) && f.length === 2 && f.every((s) => typeof s === "string" && s.trim())))) errors.push("faqs must be an array (max 8) of [question, answer] string pairs");
  if (errors.length) return bad(400, errors.join("; "));
  if (content.length > MAX_CONTENT) return bad(413, "content exceeds the 200 KB limit");

  if (await getPost(slug)) return bad(409, `A post with slug "${slug}" already exists.`);

  const date = (publishedAt ? new Date(publishedAt) : new Date()).toISOString().slice(0, 10);
  const updated = (updatedAt ? new Date(updatedAt) : new Date(date)).toISOString().slice(0, 10);
  const authorSlug = author || DEFAULT_AUTHOR;
  const post = {
    slug,
    title: title.trim(),
    metaTitle: (metaTitle || title).trim(),
    metaDescription: metaDescription.trim(),
    publishedDate: date,
    lastUpdated: updated,
    author: authorSlug,
    h1: title.trim(),
    content: marked.parse(content, { async: false }),
    ...(excerpt ? { excerpt: excerpt.trim() } : {}),
    ...(tags?.length ? { tags } : {}),
    ...(coverImage ? { coverImage } : {}),
    ...(faqs?.length ? { faqs } : {}),
    source: "api",
  };

  try {
    await savePost(post);
  } catch {
    return bad(503, "Could not write to the post store; try again shortly.");
  }

  // Make the post visible without a redeploy.
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath(`/author/${authorSlug}`); // author page lists their posts
  revalidatePath("/sitemap.xml");

  return Response.json({ success: true, url: `${SITE_URL}/blog/${slug}` }, { status: 201 });
}
