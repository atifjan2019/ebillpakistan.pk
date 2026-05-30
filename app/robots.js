const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://ebillpakistan.pk";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/result", "/api/"], // per-reference lookups + API are not for indexing
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
