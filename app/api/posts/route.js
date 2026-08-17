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
import { SITE_URL } from "../../../lib/seo";
import { getPost, savePost } from "../../../lib/posts";
import { buildPost } from "../../../lib/publishPost";

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

  // Validation and normalisation are shared with the admin dashboard form via
  // lib/publishPost.js, so the two publishing paths cannot drift apart.
  const { errors, post } = buildPost(body || {});
  if (errors.length) return bad(400, errors.join("; "));
  const { slug } = post;

  if (await getPost(slug)) return bad(409, `A post with slug "${slug}" already exists.`);

  try {
    await savePost(post);
  } catch {
    return bad(503, "Could not write to the post store; try again shortly.");
  }

  // Make the post visible without a redeploy.
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath(`/author/${post.author}`); // author page lists their posts
  revalidatePath("/sitemap.xml");

  return Response.json({ success: true, url: `${SITE_URL}/blog/${slug}` }, { status: 201 });
}
