// Server-only: fetches bills from PITC. Imported by Route Handlers only.
import { DISCOS, REGION_HINTS } from "./discos";
import { cacheGet, cacheSet } from "./store";

const BILL_BASE = "https://bill.pitc.com.pk";
const CCMS_API = "https://ccms.pitc.com.pk/api";

// Hosts the asset proxy is allowed to fetch from (SSRF allowlist). PITC plus the
// public CDNs the bill template references, so everything loads first-party.
const ASSET_HOSTS = new Set([
  "bill.pitc.com.pk",
  "cdn.jsdelivr.net",
  "cdnjs.cloudflare.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
]);
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function readSetCookies(res, jar) {
  const list =
    typeof res.headers.getSetCookie === "function"
      ? res.headers.getSetCookie()
      : res.headers.get("set-cookie")
      ? [res.headers.get("set-cookie")]
      : [];
  for (const c of list) {
    const pair = c.split(";")[0];
    const i = pair.indexOf("=");
    if (i > 0) jar[pair.slice(0, i).trim()] = pair.slice(i + 1).trim();
  }
}

const cookieHeader = (jar) =>
  Object.entries(jar)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");

function parseHidden(html) {
  const fields = {};
  const re = /<input[^>]*type="hidden"[^>]*name="([^"]+)"[^>]*value="([^"]*)"/gi;
  let m;
  while ((m = re.exec(html))) fields[m[1]] = m[2];
  const rvt = /name="__RequestVerificationToken"[^>]*value="([^"]*)"/i.exec(html);
  if (rvt) fields["__RequestVerificationToken"] = rvt[1];
  return fields;
}

function rewriteAssets(html) {
  let out = html;

  // Bug 3: PITC declares utf-16 but the content is utf-8.
  out = out.replace(/<meta\s+charset=["']utf-16["']\s*\/?>/i, '<meta charset="utf-8" />');

  // Bug 1: remove the dead loader script entirely. Its DOM (#loader-container,
  // #progress) is stripped below, and showLoadingBar()/window.onload threw on the
  // null element; delete the whole block so nothing references it.
  out = out.replace(/<script>\s*function showLoadingBar[\s\S]*?<\/script>/i, "");

  // Remove the "Your bill is loading…" overlay element entirely.
  out = out.replace(
    /<div id="loader-container">[\s\S]*?id="loading-text"[\s\S]*?<\/div>\s*<\/div>/i,
    ""
  );

  // Bug 7: route PITC's own (root-relative) assets through our proxy so the
  // visitor's browser never talks to bill.pitc.com.pk directly.
  out = out.replace(/\b(href|src)="\/([^"]*)"/gi, (_m, attr, path) => {
    const abs = `${BILL_BASE}/${path}`;
    return `${attr}="/api/asset?u=${encodeURIComponent(abs)}"`;
  });

  // Bug 7 (full first-party): also route allowlisted third-party CDN assets
  // (Bootstrap, FontAwesome, Google Fonts, the QR library) through the proxy.
  out = out.replace(/\b(href|src)="(https:\/\/[^"]+)"/gi, (m, attr, abs) => {
    try {
      if (ASSET_HOSTS.has(new URL(abs).hostname)) {
        return `${attr}="/api/asset?u=${encodeURIComponent(abs)}"`;
      }
    } catch {}
    return m;
  });

  // Hide the overlay (backup) and stop .maincontent (width:753pt; overflow:hidden)
  // from clipping the bill's right edge.
  out = out.replace(
    /<\/body>/i,
    "<style>#loader-container{display:none !important}" +
      // the bill's own body uses height:100vh, which makes scrollHeight echo the
      // iframe height and feed a resize loop; force intrinsic height instead.
      "html,body{height:auto !important;min-height:0 !important}" +
      ".maincontent{overflow:visible !important}</style></body>"
  );

  return out;
}

// Does this response look like an actual bill page (vs. an asset/CSS file)?
const looksLikeHtml = (s) => /<html|<!doctype html|<body/i.test(s.slice(0, 2000));

// Retry transient PITC failures (rate-limit blips, network errors) with
// exponential backoff. Never retry a deterministic "bill not found".
async function withRetry(fn, { retries = 2, base = 350 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (e && e.code === "BILL_NOT_FOUND") throw e;
      // Overall deadline hit: stop now instead of burning the remaining budget.
      if (e && (e.name === "TimeoutError" || e.name === "AbortError")) throw e;
      lastErr = e;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, base * 2 ** attempt));
      }
    }
  }
  throw lastErr;
}

// Cache repeat lookups so we don't re-hit PITC. Backed by Vercel KV / Redis in
// production (shared across serverless instances), in-memory in dev.
const BILL_TTL = 21600; // seconds (6 hours): repeat lookups skip the slow PITC server

// Public entry: cached, ONE attempt only. PITC is slow, so retrying would
// multiply the latency and exhaust the function budget (the cause of the 504s).
// Each sub-request carries its own timeout (see fetchBillOnce) so a slow phase
// fails fast rather than hanging until Vercel kills the function.
export async function fetchBillHtml(disco, ref, searchBy = "refno") {
  disco = disco.toLowerCase();
  if (!DISCOS[disco]) throw new Error("unknown company");
  const key = `bill:${disco}:${searchBy}:${ref}`;
  const cached = await cacheGet(key);
  if (cached) return cached;
  const html = await fetchBillOnce(disco, ref, searchBy);
  await cacheSet(key, html, BILL_TTL);
  return html;
}

// Official rendered bill HTML via the ASP.NET Post/Redirect/Get flow (one attempt).
async function fetchBillOnce(disco, ref, searchBy = "refno") {
  disco = disco.toLowerCase();
  if (!DISCOS[disco]) throw new Error("unknown company");
  const url = `${BILL_BASE}/${disco}bill`;
  const jar = {};

  // GET the form to obtain the ASP.NET tokens + session cookie (8s budget).
  const r1 = await fetch(url, { headers: { "User-Agent": UA }, cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!r1.ok) throw new Error(`form GET ${r1.status}`);
  const html1 = await r1.text();
  readSetCookies(r1, jar);
  const f = parseHidden(html1);
  if (!f.__VIEWSTATE) throw new Error("no __VIEWSTATE (layout changed)");

  const body = new URLSearchParams({
    __EVENTTARGET: "",
    __EVENTARGUMENT: "",
    __LASTFOCUS: "",
    __VIEWSTATE: f.__VIEWSTATE || "",
    __VIEWSTATEGENERATOR: f.__VIEWSTATEGENERATOR || "",
    __EVENTVALIDATION: f.__EVENTVALIDATION || "",
    rbSearchByList: searchBy,
    searchTextBox: ref,
    __RequestVerificationToken: f.__RequestVerificationToken || "",
    btnSearch: "Search",
  });
  // POST the search with the tokens (12s budget: this is the slow step).
  const r2 = await fetch(url, {
    method: "POST",
    redirect: "manual",
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
    headers: {
      "User-Agent": UA,
      Referer: url,
      Cookie: cookieHeader(jar),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });
  readSetCookies(r2, jar);

  const notFound = () => {
    const err = new Error("BILL_NOT_FOUND");
    err.code = "BILL_NOT_FOUND";
    return err;
  };

  // A successful lookup ALWAYS replies with a 3xx redirect to the bill deep-link.
  // No redirect (e.g. the form re-rendered) => this reference isn't on this
  // company. This is what makes cross-company auto-detection reliable.
  const is3xx = r2.status >= 300 && r2.status < 400;
  let location = r2.headers.get("location");
  if (!location && is3xx) {
    const t = await r2.text();
    const m = /href="([^"]+)"/i.exec(t);
    location = m ? m[1].replace(/&amp;/g, "&") : null;
  }
  if (!is3xx || !location) throw notFound();
  const next = location.startsWith("http") ? location : BILL_BASE + location;

  // Follow the redirect to the rendered bill page (8s budget).
  const r3 = await fetch(next, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
    headers: { "User-Agent": UA, Referer: url, Cookie: cookieHeader(jar) },
  });
  const raw = await r3.text();

  // Not-found comes back two ways: a redirect to an asset (bootstrap.css, not
  // HTML) OR a valid HTML page that just says "Bill Not Found!". Reject both, as
  // this is essential for cross-company auto-detection to be accurate.
  if (!looksLikeHtml(raw) || /Bill\s+Not\s+Found/i.test(raw)) throw notFound();
  return rewriteAssets(raw);
}

function orderDiscosByHint(hintText) {
  const text = (hintText || "").toUpperCase();
  const matched = [];
  const rest = [];
  for (const code of Object.keys(DISCOS)) {
    const kws = REGION_HINTS[code] || [];
    (kws.some((k) => text.includes(k)) ? matched : rest).push(code);
  }
  return [...matched, ...rest];
}

// Auto-detect which company a reference (or account no) belongs to. References
// are unique across companies, so the probe is unambiguous. A CCMS hint orders
// the probe so the right company is usually tried first. Returns { disco } | null.
export async function detectDisco(reference, searchBy = "refno") {
  const dkey = `detect:${searchBy}:${reference}`;
  const cached = await cacheGet(dkey); // skip the whole fan-out on a repeat lookup
  if (cached === "NF") return null;
  if (cached && DISCOS[cached]) return { disco: cached };

  const found = async (code) => {
    await cacheSet(dkey, code, 1800); // remember the company for 30 min
    return { disco: code };
  };

  let hint = "";
  try {
    const res = await fetch(
      `${CCMS_API}/details/bill?reference=${encodeURIComponent(reference)}`,
      { headers: { "User-Agent": UA, Accept: "application/json", "X-Requested-With": "XMLHttpRequest" }, cache: "no-store", signal: AbortSignal.timeout(4000) }
    );
    const b = (await res.json())?.bill?.basicInfo;
    if (b) hint = `${b.divName || ""} ${b.subDivName || ""} ${b.feederName || ""} ${b.consumerAddress2 || ""}`;
  } catch {}

  const ordered = orderDiscosByHint(hint);
  const [first, ...rest] = ordered;

  // try the most-likely company first (usually a single lookup)
  let probeList = rest;
  try {
    await fetchBillHtml(first, reference, searchBy);
    return await found(first);
  } catch (e) {
    if (e?.code !== "BILL_NOT_FOUND") probeList = ordered; // transient error -> re-probe all
  }

  // probe the rest in parallel; first real bill wins
  try {
    const code = await Promise.any(
      probeList.map((c) => fetchBillHtml(c, reference, searchBy).then(() => c))
    );
    return await found(code);
  } catch {
    await cacheSet(dkey, "NF", 300); // negative cache, 5 min
    return null;
  }
}

export { BILL_BASE, UA, ASSET_HOSTS };

const SAFE_USER = ["REFNO", "NAME", "ADDR1", "ADDR2", "TARIFF", "SLOAD"];

// Structured bill data via CCMS API; PII (CNIC/GPS/phone) stripped out.
export async function fetchBillJson(ref) {
  const headers = {
    "User-Agent": UA,
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };
  return withRetry(async () => {
    const [userRes, billRes] = await Promise.all([
      fetch(`${CCMS_API}/details/user?reference=${encodeURIComponent(ref)}`, {
        headers,
        cache: "no-store",
      }),
      fetch(`${CCMS_API}/details/bill?reference=${encodeURIComponent(ref)}`, {
        headers,
        cache: "no-store",
      }),
    ]);
    const user = (await userRes.json())?.user || {};
    const bill = (await billRes.json())?.bill || null;
    const safeUser = {};
    for (const k of SAFE_USER) safeUser[k] = user[k] ?? null;
    return { user: safeUser, bill };
  });
}
