/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Canonical host is https://www.ebillpakistan.pk.
  // Requests arriving on the bare (non-www) host are caught by middleware.ts and
  // 308-redirected to www, preserving the full path and query string.
  //
  // ⚠️  Vercel Dashboard action required: in your project → Domains, ensure the
  // "www" domain is PRIMARY and there is NO Vercel-level redirect from www to
  // non-www active. A lingering www→non-www domain redirect would fight
  // middleware.ts and create an infinite loop.
  //
  // Also update NEXT_PUBLIC_SITE_URL in Vercel environment variables to
  // "https://www.ebillpakistan.pk" so the build-time default matches.

  // Merged blog posts (Phase 3). Each thin post now 301s to the guide that
  // absorbed it. Single hop: destination is a live URL, never another redirect.
  async redirects() {
    return [
      ...[
        ["/blog/how-to-find-ajk-electricity-reference-number", "/blog/how-to-find-reference-number-on-electricity-bill"],
        ["/blog/ajk-electricity-bill-online-check", "/blog/how-to-check-electricity-bill-online-pakistan"],
        ["/blog/how-to-check-electricity-bill-status", "/blog/how-to-check-electricity-bill-online-pakistan"],
        ["/blog/how-to-download-print-electricity-bill-duplicate", "/blog/how-to-check-electricity-bill-online-pakistan"],
      ].map(([source, destination]) => ({ source, destination, permanent: true })),
      // November 2026: the per-company "bill check online" posts were folded
      // into the company pages (lookalike-site warnings and complaint numbers
      // now live there). See scripts/merge-company-posts.mjs. statusCode 301
      // rather than permanent: true, which Next sends as a 308.
      ...[
        ["/blog/lesco-bill-check-online-official-page", "/lesco-bill-check"],
        ["/blog/iesco-bill-check-online-official-page", "/iesco-bill-check"],
        ["/blog/mepco-bill-check-online-official-page", "/mepco-bill-check"],
        ["/blog/fesco-bill-check-online-official-page", "/fesco-bill-check"],
        ["/blog/gepco-bill-check-online-official-page", "/gepco-bill-check"],
        ["/blog/hesco-bill-check-online-official-page", "/hesco-bill-check"],
        ["/blog/qesco-bill-check-online-official-page", "/qesco-bill-check"],
        ["/blog/sepco-bill-check-online-official-page", "/sepco-bill-check"],
        ["/blog/tesco-bill-check-online-official-page", "/tesco-bill-check"],
        ["/blog/ajk-electricity-bill-check-online-official-page", "/ajk-bill-check"],
        ["/blog/pesco-bill-check-online-complaint-numbers", "/pesco-bill-check"],
        // Thin, dated or overlapping posts merged into evergreen guides and
        // company pages (see scripts/prune-posts.mjs).
        ["/blog/electricity-bill-high-summer-2026", "/blog/unit-slabs-fuel-price-adjustment-taxes-explained"],
        ["/blog/august-2026-electricity-bill-increase-surcharge", "/blog/unit-slabs-fuel-price-adjustment-taxes-explained"],
        ["/blog/october-2026-electricity-bill-fca-qta", "/blog/unit-slabs-fuel-price-adjustment-taxes-explained"],
        ["/blog/november-2026-electricity-bill-fuel-charge", "/blog/unit-slabs-fuel-price-adjustment-taxes-explained"],
        ["/blog/december-2026-electricity-bill-quarterly-adjustment", "/blog/unit-slabs-fuel-price-adjustment-taxes-explained"],
        ["/blog/december-2026-electricity-bill-october-fuel-charge", "/blog/unit-slabs-fuel-price-adjustment-taxes-explained"],
        ["/blog/how-to-apply-net-metering-net-billing-2026", "/blog/net-metering-net-billing-2026"],
        ["/blog/electricity-bill-late-payment-surcharge-due-date", "/blog/unpaid-electricity-bill-disconnection-notice-reconnection"],
        ["/blog/peak-hours-time-of-use-electricity-bill", "/blog/mdi-fixed-charges-electricity-bill"],
        ["/blog/rs-22-98-incremental-package-nepra-review", "/blog/industrial-electricity-tariff-b1-b2-b3-b4-rates"],
        ["/blog/protected-consumer-200-unit-penalty-change-status", "/blog/protected-consumer-200-unit-rule"],
        ["/blog/customer-facilitation-centre-iesco-bill-problems", "/iesco-bill-check"],
        ["/blog/peshawar-high-court-taxes-pesco-bill", "/pesco-bill-check"],
      ].map(([source, destination]) => ({ source, destination, statusCode: 301 })),
      {
        // Browsers and crawlers request /favicon.ico directly regardless of
        // <link rel="icon"> in <head>. Redirect permanently to the site logo
        // so the literal path returns 200 (after following the redirect) instead
        // of 404, stopping the repeated GSC crawl-error reports.
        source: "/favicon.ico",
        destination: "/images/logo.png",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        // All versioned Next.js static chunks (JS/CSS/fonts) carry a content-hash
        // in their filename, so they are safe to cache for one year. Marking them
        // immutable tells caches they never need to revalidate, eliminating the
        // "304 Not Modified" round-trips that inflate Googlebot's JS-crawl count.
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  images: {
    // Serve images as modern formats (AVIF/WebP) automatically.
    formats: ["image/avif", "image/webp"],
    // Optimised images get a sandboxed, attachment-only policy as a safety net.
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
