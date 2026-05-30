const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ebillpakistan.pk";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/result", "/api/", "/admin"], // lookups, API + admin are not for indexing
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
