import { DISCOS } from "../lib/discos";
import { slugFor } from "../lib/companies";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ebillpakistan.pk";

export default function sitemap() {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...Object.keys(DISCOS).map((code) => ({
      url: `${BASE}/${slugFor(code)}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    })),
    ...["about", "contact"].map((p) => ({
      url: `${BASE}/${p}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    })),
    ...["privacy", "terms", "disclaimer"].map((p) => ({
      url: `${BASE}/${p}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    })),
  ];
}
