"use client";

// Fetches the bill from the visitor's own browser.
//
// WHY: PITC's firewall blocks datacenter IP ranges, including every Vercel
// region, with a "Web Page Blocked" page (HTTP 500). It accepts ordinary
// residential connections, which is what every visitor has. The CCMS API sends
// Access-Control-Allow-Origin: *, so the browser can call it directly as long
// as the request stays "simple" (no custom headers, which would trigger a
// preflight that PITC answers with 403).
//
// Order: browser -> CCMS directly, retrying on 429 and timeouts with backoff
// (lib/retry.js); if that still fails, our server (/api/bill-json, which works
// wherever PITC_PROXY is set or the egress IP is allowed); if both fail, the
// honest fallback card. Only a 2xx reply with an empty bill counts as "not
// found"; a 429, a 5xx, a timeout or a network error is an upstream failure.
// Every attempt's cause is reported with a beacon so the log can say why
// lookups fail.
import { useEffect, useState } from "react";
import { normaliseBill } from "../../../lib/billData";
import { retryDelay, causeOf, parseRetryAfter } from "../../../lib/retry";
import BillPanel from "./BillPanel";
import BillFallback from "./BillFallback";

const CCMS = "https://ccms.pitc.com.pk/api";
const SAFE_USER = ["REFNO", "NAME", "ADDR1", "ADDR2", "TARIFF", "SLOAD"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// One CCMS attempt from the browser. Resolves to { cause, data?, retryAfterSec?, ms }.
async function browserAttempt(ref) {
  const q = `reference=${encodeURIComponent(ref)}`;
  const started = Date.now();
  try {
    const [billRes, userRes] = await Promise.all([
      fetch(`${CCMS}/details/bill?${q}`, { headers: { Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(9000) }),
      fetch(`${CCMS}/details/user?${q}`, { headers: { Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(9000) }).catch(() => null),
    ]);
    const ms = Date.now() - started;
    if (!billRes.ok) {
      return { cause: causeOf({ status: billRes.status }), retryAfterSec: parseRetryAfter(billRes.headers.get("retry-after")), ms };
    }
    const billJson = await billRes.json().catch(() => null);
    const bill = billJson?.bill || null;
    if (!bill) return { cause: "notfound", ms };
    const userJson = userRes && userRes.ok ? await userRes.json().catch(() => null) : null;
    const user = {};
    for (const k of SAFE_USER) user[k] = userJson?.user?.[k] ?? null;
    return { cause: "ok", data: { user, bill }, ms };
  } catch (error) {
    return { cause: causeOf({ error }), ms: Date.now() - started };
  }
}

// One attempt through our own server.
async function serverAttempt(ref) {
  const started = Date.now();
  try {
    const res = await fetch(`/api/bill-json?reference=${encodeURIComponent(ref)}`, { cache: "no-store", signal: AbortSignal.timeout(20000) });
    const ms = Date.now() - started;
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { cause: body?.cause || causeOf({ status: res.status }), ms };
    }
    const data = await res.json().catch(() => null);
    if (!data?.bill) return { cause: "notfound", ms };
    return { cause: "ok", data, ms };
  } catch (error) {
    return { cause: causeOf({ error }), ms: Date.now() - started };
  }
}

function report(disco, ref, outcome, page, attempts) {
  if (!page) return;
  try {
    const body = JSON.stringify({ disco, ref, outcome, page, attempts });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/bill-log", body);
    else fetch("/api/bill-log", { method: "POST", body, keepalive: true }).catch(() => {});
  } catch {}
}

export default function BillResult({ disco, info, reference, pitcUrl, adjustments, page }) {
  const ref = reference;
  const [state, setState] = useState({ status: "loading", bill: null, reason: null, busy: false });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const attempts = [];
      let data = null;
      let reason = "upstream";
      let waited = 0;

      // Browser: up to 1 + MAX_RETRIES attempts, retrying only on 429 / timeout.
      for (let n = 1; ; n++) {
        const a = await browserAttempt(ref);
        attempts.push({ via: "browser", cause: a.cause, ms: a.ms });
        if (a.cause === "ok") { data = a.data; break; }
        if (a.cause === "notfound") { reason = "notfound"; break; }
        const delay = retryDelay({ attempt: n, cause: a.cause, retryAfterSec: a.retryAfterSec, waitedMs: waited });
        if (delay === null) break;
        if (cancelled) return;
        setState((s) => ({ ...s, busy: true }));
        await sleep(delay);
        waited += delay;
      }

      // Server: one attempt, only when the browser did not get a definite answer.
      if (!data && reason !== "notfound") {
        const a = await serverAttempt(ref);
        attempts.push({ via: "server", cause: a.cause, ms: a.ms });
        if (a.cause === "ok") data = a.data;
        else if (a.cause === "notfound") reason = "notfound";
      }

      let bill = null;
      if (data) {
        bill = normaliseBill(data);
        if (!bill) reason = "notfound";
      }
      if (cancelled) return;
      report(disco, ref, bill ? "view" : reason, page, attempts);
      setState({ status: "done", bill, reason, busy: false });
    })();
    return () => { cancelled = true; };
  }, [disco, ref, page]);

  if (state.status === "loading") {
    return (
      <div className="fallback-card result-loading" role="status" aria-live="polite">
        {state.busy ? (
          <>
            <p><b>PITC is busy, retrying…</b></p>
            <p>The billing system is rate-limiting lookups right now. Trying again in a moment.</p>
          </>
        ) : (
          <>
            <p><b>Fetching your bill from the billing system…</b></p>
            <p>This usually takes a few seconds.</p>
          </>
        )}
      </div>
    );
  }
  if (!state.bill) {
    return <BillFallback discoName={info[0]} reference={ref} pitcUrl={pitcUrl} reason={state.reason} />;
  }
  return <BillPanel bill={state.bill} disco={disco} info={info} reference={ref} pitcUrl={pitcUrl} adjustments={adjustments} />;
}
