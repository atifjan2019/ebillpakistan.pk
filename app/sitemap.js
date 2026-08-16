import { DISCOS } from "../lib/discos";
import { slugFor } from "../lib/companies";
import { SITE_URL, HOME_URL } from "../lib/seo";
import { getAllPosts } from "../lib/posts";
import { AUTHOR_SLUGS } from "../lib/authors";

const BASE = SITE_URL;

// Stable last-modified dates per content group. Bump the relevant constant when
// you actually change that content; using `new Date()` here would stamp every
// URL with the request time, which Google ignores as inaccurate.
const UPDATED = {
  core: "2026-08-16",   // homepage + DISCO landing pages
  info: "2026-08-16",   // about, contact, sample bill, editorial policy, authors
  legal: "2026-08-16",  // privacy (rewritten for advertising disclosure)
  terms: "2026-01-10",  // terms, disclaimer (unchanged)
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
    // /sample-bill-explained is the indexable counterpart to the noindexed
    // /result page: it proves what the product does without exposing anyone's
    // real bill, so it carries a higher priority than the other info pages.
    {
      url: `${BASE}/sample-bill-explained`,
      lastModified: UPDATED.info,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...["about", "contact", "editorial-policy"].map((p) => ({
      url: `${BASE}/${p}`,
      lastModified: UPDATED.info,
      changeFrequency: "monthly",
      priority: 0.4,
    })),
    ...AUTHOR_SLUGS.map((s) => ({
      url: `${BASE}/author/${s}`,
      lastModified: UPDATED.info,
      changeFrequency: "monthly",
      priority: 0.4,
    })),
    {
      url: `${BASE}/privacy`,
      lastModified: UPDATED.legal,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...["terms", "disclaimer"].map((p) => ({
      url: `${BASE}/${p}`,
      lastModified: UPDATED.terms,
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
