// Shared SEO/social constants. Centralised so Open Graph data stays consistent
// across the root layout and every page (Next.js merges `openGraph`/`twitter`
// shallowly: a page that sets its own `openGraph` REPLACES the parent's, so the
// image/type/siteName must be re-supplied wherever `openGraph` is overridden).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ebillpakistan.pk";

// Canonical homepage URL, WITH trailing slash. The Next Metadata API strips the
// root trailing slash from canonical/og:url, so the homepage emits these two as
// raw <link>/<meta> tags (hoisted to <head>) using this exact value, and the
// sitemap homepage <loc> uses it too, keeping all three byte-identical.
export const HOME_URL = `${SITE_URL}/`;

// Twitter/X handle used for the twitter:site attribution tag sitewide.
export const TWITTER_SITE = "@ebillpakistan";

// Official social profiles. Single source for the footer links and the
// Organization schema `sameAs` (entity reconciliation for Google).
export const SOCIAL = {
  facebook: "https://www.facebook.com/ebillpakistan",
  twitter: "https://twitter.com/ebillpakistan",
};

export const OG_IMAGE = {
  url: "/images/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "eBill Pakistan",
};
