import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { DISCOS, isValidRef } from "../../lib/discos";
import { getIp, logBillCheck, rateLimitBill } from "../../lib/store";
import { fetchBillJson } from "../../lib/pitc";
import { normaliseBill } from "../../lib/billData";
import { PROTECTED, adjustmentsOn, categoryFor } from "../../lib/tariffs";
import {
  anomalyCheck, chargeBreakdown, effectiveRate, largestSurcharge,
  monthOverMonth, protectedStatus, slabPosition, slabSaving,
} from "../../lib/billAnalysis";
import BillView from "./BillView";
import BillAnalysis from "./BillAnalysis";
import BillActions from "./BillActions";
import BillFallback from "./BillFallback";
import BillFrame from "./BillFrame";

// Resolve the page the user submitted from (homepage vs a DISCO page) from the
// Referer. Internal redirects (referer = /result) are skipped so each user
// lookup is logged exactly once.
function sourcePage(referer) {
  try {
    const path = new URL(referer).pathname || "/";
    return path.startsWith("/result") ? null : path;
  } catch {
    return "(direct)";
  }
}

export const dynamic = "force-dynamic";
export const maxDuration = 30;
// PITC blocks Vercel's Mumbai (bom1) egress; Singapore is the closest region
// that can reach it. Must match vercel.json.
export const preferredRegion = "sin1";

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const disco = (sp?.disco || "").toLowerCase();
  const ref = (sp?.reference || "").trim();
  const info = DISCOS[disco];
  // Per-reference lookups must never enter the index — but the page is crawlable
  // (Phase 1 removed the robots.txt block) so Googlebot and the AdSense crawler
  // can see that the product works.
  const robots = { index: false, follow: true };
  if (info && isValidRef(ref)) return { title: `${info[0]} Bill ${ref} | eBill Pakistan`, robots };
  if (info) return { title: `${info[0]} Bill | eBill Pakistan`, robots };
  return { title: "Check Your Bill | eBill Pakistan", robots };
}

export default async function Result({ searchParams }) {
  const sp = await searchParams;
  const disco = (sp?.disco || "").toLowerCase();
  const ref = (sp?.reference || "").trim();

  // A direct hit with a malformed reference used to redirect to "/" silently,
  // leaving the visitor on the homepage with no idea what went wrong. Carry the
  // reason so the homepage can say it.
  if (!isValidRef(ref)) redirect(`/?e=${ref ? "badref" : "noref"}`);
  if (!DISCOS[disco]) redirect("/?e=nodisco");

  const info = DISCOS[disco];
  const hdrs = await headers();
  const page = sourcePage(hdrs.get("referer") || "");
  const ip = getIp(hdrs);

  // Real server-side throttling, replacing the 10-second countdown the old
  // BillReady.js showed every visitor. Same limiter the API routes use.
  const rl = await rateLimitBill(ip);

  let bill = null;
  let reason = "upstream";
  if (!rl.success) {
    reason = "ratelimited";
  } else {
    try {
      const raw = await fetchBillJson(ref);
      bill = normaliseBill(raw);
      if (!bill) reason = "notfound";
    } catch {
      reason = "upstream";
    }
  }

  if (page) {
    await logBillCheck({
      disco, ref, page,
      outcome: bill ? "view" : reason,
      ip,
      city: decodeURIComponent(hdrs.get("x-vercel-ip-city") || ""),
      country: hdrs.get("x-vercel-ip-country") || "",
    });
  }

  const pitcUrl = `https://bill.pitc.com.pk/gbill.aspx?refno=${encodeURIComponent(ref)}&type=U`;
  // The rendered-HTML path is only usable where the server can reach
  // bill.pitc.com.pk, which needs PITC_PROXY (PITC blocks datacenter egress).
  const htmlPathAvailable = !process.env.VERCEL || !!process.env.PITC_PROXY;

  // Analysis, computed once and shared by the view and the PDF.
  const slab = bill ? slabPosition(bill.unitsConsumed) : null;
  const breakdown = bill ? chargeBreakdown(bill) : null;
  const protectedInfo = bill ? protectedStatus(bill) : null;
  if (protectedInfo) protectedInfo.qualifyingNote = PROTECTED.qualifyingNote;
  // The tariff code on the bill wins; units are only a fallback.
  const billCategory = protectedInfo?.declared === true
    ? "protected"
    : bill ? categoryFor(bill.unitsConsumed) : null;

  return (
    <section className="result-wrap">
      <div className="container">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span>{" "}
          <a href={`/${disco}-bill-check`}>{info[0]}</a> <span>/</span>{" "}
          <span aria-current="page">Bill</span>
        </nav>

        <div className="result-head">
          <div>
            <h1>{info[0]} bill</h1>
            <p className="ref">Reference No: <b>{ref}</b> · {info[1]}</p>
          </div>
          <a className="btn btn-ghost" href="/">← Check another bill</a>
        </div>

        {bill ? (
          <>
            <BillView bill={bill} discoName={info[0]} region={info[1]} breakdown={breakdown} />
            <BillActions bill={bill} discoName={info[0]} lines={breakdown} />

            <BillAnalysis
              slab={slab}
              mom={monthOverMonth(bill)}
              breakdown={breakdown}
              largest={largestSurcharge(breakdown)}
              protectedInfo={protectedInfo}
              saving={slabSaving(bill, slab, billCategory)}
              adjustments={adjustmentsOn(new Date().toISOString())}
              effective={effectiveRate(bill)}
              anomaly={anomalyCheck(bill)}
              discoAbbr={info[0]}
            />

            <details className="orig-bill">
              <summary>View the original bill on the official PITC portal</summary>
              <p>
                The figures above are the ones the official system issued for this reference. If you
                need the original printed layout — for a bank counter that wants it — open it here.
              </p>
              <form action={pitcUrl} method="POST" target="_blank" rel="noopener noreferrer" encType="text/plain">
                <button type="submit" className="btn btn-ghost">Open the official bill →</button>
              </form>
            </details>
          </>
        ) : htmlPathAvailable && reason === "upstream" ? (
          // Server can reach bill.pitc.com.pk: fall back to the rendered bill.
          <BillFrame src={`/api/bill?disco=${encodeURIComponent(disco)}&reference=${encodeURIComponent(ref)}`} disco={disco} reference={ref} />
        ) : (
          <BillFallback discoName={info[0]} reference={ref} pitcUrl={pitcUrl} reason={reason} />
        )}
      </div>
    </section>
  );
}
