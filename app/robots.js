import { SITE_URL } from "../lib/seo";

export default function robots() {
  const BASE = SITE_URL;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /result is deliberately NOT disallowed. It renders per-reference lookups
      // that must stay out of the index, but that is done with a `noindex, follow`
      // meta tag on the page itself (see app/result/page.js). Blocking it here
      // instead would stop Googlebot and the AdSense crawler from ever seeing
      // that the product works — they cannot read a meta tag on a page they are
      // forbidden to fetch. /sample-bill-explained is the indexable companion.
      //
      // /api/ + /admin are not for indexing; /_next/image is the optimizer
      // endpoint (query-string variants of logos that waste crawl budget and never index)
      disallow: ["/api/", "/admin", "/_next/image"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
