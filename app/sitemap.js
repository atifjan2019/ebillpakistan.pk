import { DISCOS } from "../lib/discos";
import { slugFor } from "../lib/companies";
import { HOME_URL } from "../lib/seo";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ebillpakistan.pk";

// Stable last-modified dates per content group. Bump the relevant constant when
// you actually change that content; using `new Date()` here would stamp every
// URL with the request time, which Google ignores as inaccurate.
const UPDATED = {
  core: "2026-05-30",   // homepage + DISCO landing pages
  info: "2026-04-15",   // about, contact
  legal: "2026-01-10",  // privacy, terms, disclaimer
};

export default function sitemap() {
  return [
    { url: HOME_URL, lastModified: UPDATED.core, changeFrequency: "daily", priority: 1 },
    ...Object.keys(DISCOS).map((code) => ({
      url: `${BASE}/${slugFor(code)}`,
      lastModified: UPDATED.core,
      changeFrequency: "daily",
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
  ];
}
