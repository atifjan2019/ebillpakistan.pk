/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
