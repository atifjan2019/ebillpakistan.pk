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

  async redirects() {
    return [
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
    // Serve DISCO logos as modern formats (AVIF/WebP) automatically.
    formats: ["image/avif", "image/webp"],
    // One logo (pesco.svg) is a trusted first-party SVG; allow the optimizer to
    // serve it. Sandboxed + attachment CSP keeps it safe.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
