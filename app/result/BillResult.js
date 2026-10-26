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
// Order: browser -> CCMS directly; if that fails, our server (/api/bill-json,
// which works wherever PITC_PROXY is set or the egress IP is allowed); if both
// fail, the honest fallback card. The outcome is reported with a beacon so the
// admin stats stay complete.
import { useEffect, useState } from "react";
import { normaliseBill } from "../../lib/billData";
import BillPanel from "./BillPanel";
import BillFallback from "./BillFallback";

const CCMS = "https://ccms.pitc.com.pk/api";
const SAFE_USER = ["REFNO", "NAME", "ADDR1", "ADDR2", "TARIFF", "SLOAD"];

async function getJson(url, ms) {
  const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(ms) });
  return res.json();
}

async function fromBrowser(ref) {
  const q = `reference=${encodeURIComponent(ref)}`;
  const [userJson, billJson] = await Promise.all([
    getJson(`${CCMS}/details/user?${q}`, 9000).catch(() => null),
    getJson(`${CCMS}/details/bill?${q}`, 9000),
  ]);
  const bill = billJson?.bill;
  if (!bill) throw new Error("no bill envelope");
  const user = {};
  for (const k of SAFE_USER) user[k] = userJson?.user?.[k] ?? null;
  return { user, bill };
}

async function fromServer(ref) {
  const res = await fetch(`/api/bill-json?reference=${encodeURIComponent(ref)}`, { cache: "no-store", signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`server ${res.status}`);
  return res.json();
}

function report(disco, ref, outcome, page) {
  if (!page) return;
  try {
    const body = JSON.stringify({ disco, ref, outcome, page });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/bill-log", body);
    else fetch("/api/bill-log", { method: "POST", body, keepalive: true }).catch(() => {});
  } catch {}
}

export default function BillResult({ disco, info, reference, pitcUrl, adjustments, page }) {
  const ref = reference;
  const [state, setState] = useState({ status: "loading", bill: null, reason: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let raw = null;
      let reason = "upstream";
      try {
        raw = await fromBrowser(ref);
      } catch {
        try {
          raw = await fromServer(ref);
        } catch {
          raw = null;
        }
      }
      let bill = null;
      if (raw) {
        bill = normaliseBill(raw);
        if (!bill) reason = "notfound";
      }
      if (cancelled) return;
      report(disco, ref, bill ? "view" : reason, page);
      setState({ status: "done", bill, reason });
    })();
    return () => { cancelled = true; };
  }, [disco, ref, page]);

  if (state.status === "loading") {
    return (
      <div className="fallback-card result-loading" role="status" aria-live="polite">
        <p><b>Fetching your bill from the official billing system…</b></p>
        <p>This usually takes a few seconds.</p>
      </div>
    );
  }
  if (!state.bill) {
    return <BillFallback discoName={info[0]} reference={ref} pitcUrl={pitcUrl} reason={state.reason} />;
  }
  return <BillPanel bill={state.bill} disco={disco} info={info} reference={ref} pitcUrl={pitcUrl} adjustments={adjustments} />;
}
