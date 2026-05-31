import { UA, ASSET_HOSTS } from "../../../lib/pitc";

export const dynamic = "force-dynamic";
export const maxDuration = 15;
// Same region as /api/bill: PITC blocks Mumbai (bom1) egress IPs, so the bill's
// CSS/JS/images must be proxied from a region that can reach bill.pitc.com.pk.
export const preferredRegion = "sin1";

// Rewrite url(...) / @import inside proxied CSS so nested assets also go through us.
function rewriteCss(css, baseUrl) {
  const proxy = (ref) => {
    if (/^data:/i.test(ref)) return ref;
    let abs;
    try {
      abs = new URL(ref, baseUrl);
    } catch {
      return ref;
    }
    if (!ASSET_HOSTS.has(abs.hostname)) return abs.href;
    return `/api/asset?u=${encodeURIComponent(abs.href)}`;
  };
  css = css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (_m, q, ref) => `url(${q}${proxy(ref)}${q})`);
  css = css.replace(/@import\s+(['"])([^'"]+)\1/gi, (_m, q, ref) => `@import ${q}${proxy(ref)}${q}`);
  return css;
}

export async function GET(request) {
  const u = new URL(request.url).searchParams.get("u");
  if (!u) return new Response("missing u", { status: 400 });

  let target;
  try {
    target = new URL(u);
  } catch {
    return new Response("bad url", { status: 400 });
  }
  if (target.protocol !== "https:" || !ASSET_HOSTS.has(target.hostname)) {
    return new Response("forbidden host", { status: 400 });
  }

  let upstream;
  try {
    upstream = await fetch(target.href, {
      headers: { "User-Agent": UA },
      cache: "no-store",
      signal: AbortSignal.timeout(10000), // fail fast instead of hanging the function
    });
  } catch {
    return new Response("upstream error", { status: 502 });
  }
  if (!upstream.ok) return new Response("not found", { status: upstream.status });

  const ct = upstream.headers.get("content-type") || "application/octet-stream";
  const cache = "public, max-age=86400, s-maxage=86400";

  if (ct.includes("css")) {
    const css = rewriteCss(await upstream.text(), target.href);
    return new Response(css, { headers: { "Content-Type": ct, "Cache-Control": cache } });
  }
  const buf = Buffer.from(await upstream.arrayBuffer());
  return new Response(buf, { headers: { "Content-Type": ct, "Cache-Control": cache } });
}
