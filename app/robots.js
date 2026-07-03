import { SITE_URL } from "../lib/seo";

export default function robots() {
  const BASE = SITE_URL;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // lookups, API + admin are not for indexing; /_next/image is the optimizer
      // endpoint (query-string variants of logos that waste crawl budget and never index)
      disallow: ["/result", "/api/", "/admin", "/_next/image"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
