import { DISCOS } from "../lib/discos";
import { slugFor } from "../lib/companies";
import { UTILITY_CODES, utilitySlug } from "../lib/utilities";
import { SITE_URL, HOME_URL } from "../lib/seo";
import { getAllPosts } from "../lib/posts";
import { updatedFor } from "../lib/discoContent";
import { AUTHOR_SLUGS } from "../lib/authors";

const BASE = SITE_URL;

// Built once and refreshed hourly, and at once by revalidatePath("/sitemap.xml")
// when a post is published. force-static lets the KV read run at build time;
// without it the prerender silently drops every KV post.
export const dynamic = "force-static";
export const revalidate = 3600;

// Stable last-modified dates per content group. Bump the relevant constant when
// you actually change that content; using `new Date()` here would stamp every
// URL with the request time, which Google ignores as inaccurate.
const UPDATED = {
  core: "2026-11-23",   // homepage (independence line, 23 Nov 2026); DISCO pages use updatedFor()
  info: "2026-08-16",   // about, contact, sample bill, editorial policy, authors
  legal: "2026-11-23",  // privacy (lookup diagnostics log described, 23 Nov 2026)
  terms: "2026-01-10",  // terms, disclaimer (unchanged)
  tools: "2026-10-09",  // calculators and the monthly adjustments tracker
  utilities: "2026-10-26", // SNGPL, SSGC and PTCL pages
};

export default async function sitemap() {
  const posts = await getAllPosts();
  // The index changes whenever a post is added or edited, so it carries the
  // newest post date rather than a hand-set constant.
  const newestPost = posts.map((a) => a.lastUpdated || a.publishedDate).sort().at(-1) || UPDATED.core;
  return [
    { url: HOME_URL, lastModified: UPDATED.core, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/ur`, lastModified: UPDATED.tools, changeFrequency: "weekly", priority: 0.9 },
    ...Object.keys(DISCOS).map((code) => ({
      url: `${BASE}/${slugFor(code)}`,
      lastModified: updatedFor(code),
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    ...UTILITY_CODES.map((code) => ({
      url: `${BASE}/${utilitySlug(code)}`,
      lastModified: UPDATED.utilities,
      changeFrequency: "monthly",
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
    {
      url: `${BASE}/electricity-tariff`,
      lastModified: UPDATED.info,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${BASE}/this-month`, lastModified: UPDATED.tools, changeFrequency: "weekly", priority: 0.8 },
    ...["bill-calculator", "appliance-calculator", "protected-consumer-checker", "mdi-calculator", "solar-calculator", "complaint-letter", "tariff-code", "load-shedding", "tools"].map((p) => ({
      url: `${BASE}/${p}`,
      lastModified: UPDATED.tools,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
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
    { url: `${BASE}/blog`, lastModified: newestPost, changeFrequency: "weekly", priority: 0.6 },
    ...posts.map((a) => ({
      url: `${BASE}/blog/${a.slug}`,
      lastModified: a.lastUpdated || a.publishedDate,
      changeFrequency: "monthly",
      priority: 0.5,
    })),
  ];
}
