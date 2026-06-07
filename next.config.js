/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Canonical host is the non-www https://ebillpakistan.pk. The www → non-www
  // 301 is handled by Vercel at the domain level (Domains settings), so there is
  // no app-level redirect here — adding one would fight Vercel's edge redirect
  // and create an infinite www⇄non-www loop.

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
