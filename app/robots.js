const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://ebillpakistan.pk";

export default function robots() {
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
