/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 301-redirect every variant to the canonical https://www.ebillpakistan.pk.
  // Vercel handles http→https at the edge automatically; these rules cover the
  // non-www host (both http and https) so there is never more than one hop.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "ebillpakistan.pk" }],
        destination: "https://www.ebillpakistan.pk/:path*",
        permanent: true, // 301
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
