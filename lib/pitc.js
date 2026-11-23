// Server-only: structured bill data from PITC's CCMS API. Imported by Route
// Handlers and /result only.
//
// The rendered-HTML path (posting to bill.pitc.com.pk/<disco>bill and proxying
// the page into an iframe) was removed in November 2026: every PITC bill form
// now requires a CAPTCHA, so that POST only ever came back with "Invalid
// CAPTCHA code", and on Vercel the path was never reachable anyway because
// PITC blocks datacenter egress. Visitors who need the original layout are
// sent to the company's own PITC page with their reference copied.

const CCMS_API = "https://ccms.pitc.com.pk/api";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// Optional forward proxy for PITC traffic. PITC blocks datacenter/cloud egress
// IPs (confirmed: all Vercel/AWS regions time out), so production must route
// PITC requests through a proxy with an allowed (Pakistani / residential) IP.
// Set PITC_PROXY to an http(s)://[user:pass@]host:port URL. No-op when unset
// (e.g. local dev, where the machine's own IP already reaches PITC).
let _agent; // memoized ProxyAgent | null (failed) | undefined (not yet built)
async function pitcDispatcher() {
  const url = process.env.PITC_PROXY;
  if (!url) return undefined;
  if (_agent === undefined) {
    try {
      const { ProxyAgent } = await import("undici");
      _agent = new ProxyAgent(url);
    } catch {
      _agent = null; // undici unavailable -> fall back to a direct fetch
    }
  }
  return _agent || undefined;
}

// fetch() that tunnels through PITC_PROXY when configured. Use for every request
// to *.pitc.com.pk.
export async function pitcFetch(url, opts = {}) {
  const dispatcher = await pitcDispatcher();
  return fetch(url, dispatcher ? { ...opts, dispatcher } : opts);
}

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

export { UA };

const SAFE_USER = ["REFNO", "NAME", "ADDR1", "ADDR2", "TARIFF", "SLOAD"];

// Structured bill data via CCMS API; PII (CNIC/GPS/phone) stripped out.
//
// This is what /result renders. It carries an explicit per-request timeout —
// without one a slow CCMS response hangs until the platform kills the function,
// which shows the visitor a platform error page instead of our fallback. One
// retry only: /result is a user-blocking render, not a background job.
const JSON_TIMEOUT_MS = 7000;

export async function fetchBillJson(ref) {
  const headers = {
    "User-Agent": UA,
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };
  const opts = { headers, cache: "no-store", signal: AbortSignal.timeout(JSON_TIMEOUT_MS) };
  return withRetry(
    async () => {
      const [userRes, billRes] = await Promise.all([
        pitcFetch(`${CCMS_API}/details/user?reference=${encodeURIComponent(ref)}`, opts),
        pitcFetch(`${CCMS_API}/details/bill?reference=${encodeURIComponent(ref)}`, opts),
      ]);
      // The user endpoint is optional enrichment; the bill endpoint is required.
      const user = await userRes.json().then((j) => j?.user || {}).catch(() => ({}));
      const bill = (await billRes.json())?.bill || null;
      const safeUser = {};
      for (const k of SAFE_USER) safeUser[k] = user[k] ?? null;
      return { user: safeUser, bill };
    },
    { retries: 1, base: 250 }
  );
}

// Can this server actually reach CCMS? Used by /api/bill-diagnostics to answer
// the question that decides whether /result can render bills in production,
// without needing a real reference number.
export async function probeCcms() {
  const started = Date.now();
  try {
    const res = await pitcFetch(`${CCMS_API}/details/bill?reference=00000000000000`, {
      headers: { "User-Agent": UA, Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const body = await res.json().catch(() => null);
    return {
      reachable: true,
      status: res.status,
      ms: Date.now() - started,
      envelopeOk: !!body && typeof body === "object" && "bill" in body,
    };
  } catch (e) {
    return { reachable: false, error: e?.name || String(e), ms: Date.now() - started };
  }
}
