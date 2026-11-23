import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { DISCOS, isValidRef } from "../../../lib/discos";
import { getIp, logBillCheck, rateLimitBill } from "../../../lib/store";
import { fetchBillJson } from "../../../lib/pitc";
import { normaliseBill } from "../../../lib/billData";
import { adjustmentsOn } from "../../../lib/tariffs";
import BillPanel from "./BillPanel";
import BillResult from "./BillResult";
import BillFallback from "./BillFallback";
import BillFrame from "./BillFrame";
import CopyAndOpen from "../../CopyAndOpen";

// PITC serves AJK bills only through its own web form (bill.pitc.com.pk/ajkbill,
// 18-digit reference plus a CAPTCHA); the JSON API this page uses rejects
// 18-digit references. So for AJK we do not try: we hand the visitor to that
// page with the reference copied.
const AJK_BILL_PAGE = "https://bill.pitc.com.pk/ajkbill";

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
// True on any datacenter host (Vercel, or Cloudflare Workers via the
// DATACENTER_EGRESS var in wrangler.jsonc); read per request.
const onDatacenter = () => !!(process.env.VERCEL || process.env.DATACENTER_EGRESS);
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
  if (info && isValidRef(ref, disco)) return { title: `${info[0]} Bill ${ref} | eBill Pakistan`, robots };
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
  if (!DISCOS[disco]) redirect("/?e=nodisco");
  if (!isValidRef(ref, disco)) redirect(`/?e=${ref ? "badref" : "noref"}`);

  if (disco === "ajk") {
    const h = await headers();
    const p = sourcePage(h.get("referer") || "");
    if (p) {
      await logBillCheck({
        disco, ref, page: p, outcome: "handoff",
        ip: getIp(h),
        city: decodeURIComponent(h.get("x-vercel-ip-city") || ""),
        country: h.get("x-vercel-ip-country") || "",
      });
    }
    const [name] = DISCOS[disco];
    return (
      <section className="result-wrap">
        <div className="container">
          <nav aria-label="Breadcrumb" className="crumb">
            <a href="/">Home</a> <span>/</span>{" "}
            <a href="/ajk-bill-check">{name}</a> <span>/</span>{" "}
            <span aria-current="page">Bill</span>
          </nav>
          <div className="result-head">
            <div>
              <h1>{name} electricity bill</h1>
              <p className="ref">Reference No: <b>{ref}</b> · Azad Kashmir</p>
            </div>
            <a className="btn btn-ghost" href="/">← Check another bill</a>
          </div>
          <p className="page-note">eBill Pakistan is an independent service. It is not affiliated with the AJK Electricity Department, PITC or any government body.</p>
          <div className="fallback-card">
            <div className="fallback-head">
              <div>
                <h2>Your AJK bill opens on PITC&apos;s AJK bill page</h2>
                <p>
                  The AJK Electricity Department publishes its bills on PITC&apos;s AJK page, which asks for the
                  18-digit reference number and a CAPTCHA code that a person has to type, so no third-party
                  site can fetch an AJK bill for you. The button copies your reference number and opens that
                  page in a new tab: paste the number, type the code shown in the picture, and the bill opens.
                </p>
              </div>
            </div>
            <div className="fallback-actions">
              <CopyAndOpen reference={ref} url={AJK_BILL_PAGE} label="Copy reference and open the AJK bill page →" className="btn btn-primary" />
            </div>
            <p className="fallback-ref">A genuine AJK bill is headed AZAD JAMMU &amp; KASHMIR ELECTRICITY DEPARTMENT and marked Web Generated Bill. Read the address bar: it should be bill.pitc.com.pk.</p>
            <p className="fallback-help">
              Where the reference number is, how AJK tariffs differ and who to contact:{" "}
              <a href="/ajk-bill-check">the AJK bill page on this site</a>.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const info = DISCOS[disco];
  const hdrs = await headers();
  const page = sourcePage(hdrs.get("referer") || "");
  const ip = getIp(hdrs);

  // Real server-side throttling, replacing the 10-second countdown the old
  // BillReady.js showed every visitor. Same limiter the API routes use.
  const rl = await rateLimitBill(ip);

  // PITC blocks datacenter egress (every Vercel region gets its "Web Page
  // Blocked" 500), so on Vercel without PITC_PROXY the server does not even try:
  // the visitor's browser fetches the bill instead (BillResult.js), and reports
  // the outcome to /api/bill-log.
  const serverCanFetch = !onDatacenter() || !!process.env.PITC_PROXY;
  const browserPath = rl.success && !serverCanFetch;

  let bill = null;
  let reason = "upstream";
  if (!rl.success) {
    reason = "ratelimited";
  } else if (serverCanFetch) {
    try {
      const raw = await fetchBillJson(ref);
      bill = normaliseBill(raw);
      if (!bill) reason = "notfound";
    } catch {
      reason = "upstream";
    }
  }

  if (page && !browserPath) {
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
  const htmlPathAvailable = !onDatacenter() || !!process.env.PITC_PROXY;

  const adjustments = adjustmentsOn(new Date().toISOString());

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
        <p className="page-note">eBill Pakistan is an independent service. It is not affiliated with {info[0]}, PITC or any government body; the bill below is {info[0]}&apos;s own record, shown as PITC&apos;s bill service returns it.</p>

        {bill ? (
          <BillPanel bill={bill} disco={disco} info={info} reference={ref} pitcUrl={pitcUrl} adjustments={adjustments} />
        ) : browserPath ? (
          <BillResult disco={disco} info={info} reference={ref} pitcUrl={pitcUrl} adjustments={adjustments} page={page} />
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
