// Shared SEO/social constants. Centralised so Open Graph data stays consistent
// across the root layout and every page (Next.js merges `openGraph`/`twitter`
// shallowly: a page that sets its own `openGraph` REPLACES the parent's, so the
// image/type/siteName must be re-supplied wherever `openGraph` is overridden).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ebillpakistan.pk";

// Canonical homepage URL. No trailing slash: Next (trailingSlash: false) strips
// it from canonical/og:url regardless of what we pass, and the only way to force
// a slash is the global `trailingSlash: true`, which would rewrite every URL on
// the site. So we standardise on the no-slash form and match the sitemap to it.
export const HOME_URL = SITE_URL;

// Twitter/X handle used for the twitter:site attribution tag sitewide.
export const TWITTER_SITE = "@ebillpakistan";

export const OG_IMAGE = {
  url: "/images/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "eBill Pakistan",
};
