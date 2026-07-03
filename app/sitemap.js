import { DISCOS } from "../lib/discos";
import { slugFor } from "../lib/companies";
import { SITE_URL, HOME_URL } from "../lib/seo";
import { getAllPosts } from "../lib/posts";

const BASE = SITE_URL;

// Stable last-modified dates per content group. Bump the relevant constant when
// you actually change that content; using `new Date()` here would stamp every
// URL with the request time, which Google ignores as inaccurate.
const UPDATED = {
  core: "2026-06-04",   // homepage + DISCO landing pages (FAQ content added)
  info: "2026-04-15",   // about, contact
  legal: "2026-01-10",  // privacy, terms, disclaimer
};

export default async function sitemap() {
  const posts = await getAllPosts();
  return [
    { url: HOME_URL, lastModified: UPDATED.core, changeFrequency: "weekly", priority: 1 },
    ...Object.keys(DISCOS).map((code) => ({
      url: `${BASE}/${slugFor(code)}`,
      lastModified: UPDATED.core,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    ...["about", "contact"].map((p) => ({
      url: `${BASE}/${p}`,
      lastModified: UPDATED.info,
      changeFrequency: "monthly",
      priority: 0.4,
    })),
    ...["privacy", "terms", "disclaimer"].map((p) => ({
      url: `${BASE}/${p}`,
      lastModified: UPDATED.legal,
      changeFrequency: "yearly",
      priority: 0.3,
    })),
    { url: `${BASE}/blog`, lastModified: UPDATED.core, changeFrequency: "weekly", priority: 0.6 },
    ...posts.map((a) => ({
      url: `${BASE}/blog/${a.slug}`,
      lastModified: a.lastUpdated || a.publishedDate,
      changeFrequency: "monthly",
      priority: 0.5,
    })),
  ];
}
