// API-published blog posts, stored in Vercel KV / Upstash Redis as one hash:
//   blog:posts = { <slug>: <article-shaped object> }
// Static first-party articles stay in lib/articles.js; the helpers here merge
// both sources so the blog index, article page and sitemap treat them alike.
// Posts are stored with `content` already converted to HTML (the API route
// converts Markdown at publish time), so rendering is identical to ARTICLES.
import { Redis } from "@upstash/redis";
import { ARTICLES, getArticle } from "./articles";

const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = URL && TOKEN ? new Redis({ url: URL, token: TOKEN }) : null;
export const postsConfigured = !!redis;

const KEY = "blog:posts";
const memPosts = new Map(); // dev fallback when no KV is configured

const asPost = (v) => (typeof v === "string" ? JSON.parse(v) : v);
const byDate = (a, b) => String(a.publishedDate).localeCompare(String(b.publishedDate));

// Posts published through the API, oldest first (matches ARTICLES ordering).
export async function getApiPosts() {
  if (redis) {
    try {
      const all = await redis.hgetall(KEY);
      return Object.values(all || {}).map(asPost).sort(byDate);
    } catch {
      return []; // KV hiccup -> behave as if there are no API posts
    }
  }
  return [...memPosts.values()].sort(byDate);
}

// Static articles + API posts, for the blog index and sitemap.
export async function getAllPosts() {
  return [...ARTICLES, ...(await getApiPosts())];
}

// Single post lookup across both sources (static articles win on collision;
// the API refuses duplicate slugs, so a collision cannot be created there).
export async function getPost(slug) {
  const a = getArticle(slug);
  if (a) return a;
  if (redis) {
    try {
      const v = await redis.hget(KEY, slug);
      return v ? asPost(v) : null;
    } catch {
      return null;
    }
  }
  return memPosts.get(slug) || null;
}

export async function savePost(post) {
  if (redis) {
    await redis.hset(KEY, { [post.slug]: post });
  } else {
    memPosts.set(post.slug, post);
  }
}
