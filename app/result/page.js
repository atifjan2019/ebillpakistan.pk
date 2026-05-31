import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { DISCOS, isValidRef } from "../../lib/discos";
import { getIp, logBillCheck } from "../../lib/store";
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

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const disco = (sp?.disco || "").toLowerCase();
  const ref = (sp?.reference || "").trim();
  const info = DISCOS[disco];
  const robots = { index: false, follow: true }; // per-reference lookups: don't index
  if (info && isValidRef(ref)) return { title: `${info[0]} Bill ${ref} | eBill Pakistan`, robots };
  if (info) return { title: `${info[0]} Bill | eBill Pakistan`, robots };
  return { title: "Check Your Bill | eBill Pakistan", robots };
}

export default async function Result({ searchParams }) {
  const sp = await searchParams;
  const disco = (sp?.disco || "").toLowerCase();
  const ref = (sp?.reference || "").trim();

  // Company and a valid reference are both required (auto-detect was removed).
  if (!isValidRef(ref)) redirect("/");
  if (!DISCOS[disco]) redirect("/");

  // PITC blocks datacenter IPs, so our Vercel server can't fetch bills until a
  // PITC-reachable egress (PITC_PROXY) is set. Until then we can't embed the
  // bill, but the visitor's own (Pakistani) browser CAN reach PITC: a POST to
  // gbill.aspx renders the bill (a GET loops). So we show a button that POSTs
  // straight to PITC, opening the official bill in a new tab — no proxy needed.
  // Self-healing: once PITC_PROXY is set we embed the bill again; never in dev.
  const directPost = !!process.env.VERCEL && !process.env.PITC_PROXY;

  const hdrs = await headers();
  const page = sourcePage(hdrs.get("referer") || "");
  const geo = {
    ip: getIp(hdrs),
    city: decodeURIComponent(hdrs.get("x-vercel-ip-city") || ""),
    country: hdrs.get("x-vercel-ip-country") || "",
  };
  if (page) await logBillCheck({ disco, page, outcome: "view", ...geo });

  const info = DISCOS[disco];
  const src = `/api/bill?disco=${encodeURIComponent(disco)}&reference=${encodeURIComponent(ref)}`;
  const pitcUrl = `https://bill.pitc.com.pk/gbill.aspx?refno=${encodeURIComponent(ref)}&type=U`;

  return (
    <section className="result-wrap">
      <div className="container">
        <div className="crumb">
          <a href="/">Home</a> <span>/</span> <span>{info[0]} bill</span>
        </div>
        <div className="result-head">
          <div>
            <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                className="badge"
                style={{
                  "--c": info[2], width: 40, height: 40, borderRadius: 11, display: "grid",
                  placeItems: "center", background: `color-mix(in srgb, ${info[2]} 14%, #fff)`,
                  color: info[2], fontWeight: 800, fontSize: 14,
                }}
              >
                {info[0].slice(0, 2)}
              </span>
              {info[0]} Bill
            </h1>
            <p className="ref">Reference No: <b>{ref}</b> · {info[1]}</p>
          </div>
          <a className="btn btn-ghost" href="/">← Check another bill</a>
        </div>

        {directPost ? (
          <div className="bill-card" style={{ padding: 28, textAlign: "center" }}>
            <span className="tag" style={{ marginBottom: 14 }}><span className="dot" /> Bill ready</span>
            <h2 style={{ margin: "6px 0 6px", fontSize: 22 }}>Your {info[0]} bill is ready</h2>
            <p style={{ margin: "0 0 18px", color: "#555", fontSize: 15 }}>
              Reference No: <b>{ref}</b>. Tap below to open your official bill on the PITC portal.
            </p>
            {/* PITC's gbill.aspx renders the bill only on a POST (a GET loops), and
                sets X-Frame-Options so it can't be embedded — so we POST it open in
                a new tab. The visitor's own browser reaches PITC, so no proxy needed. */}
            <form action={pitcUrl} method="POST" target="_blank" rel="noopener noreferrer" encType="text/plain">
              <button type="submit" className="btn btn-wa" style={{ fontSize: 16, padding: "12px 28px" }}>
                View My Bill →
              </button>
            </form>
            <p style={{ margin: "16px 0 0", color: "#888", fontSize: 13 }}>
              Your bill opens directly on the official PITC portal (bill.pitc.com.pk) in a new tab.
            </p>
          </div>
        ) : (
          <BillFrame src={src} disco={disco} reference={ref} />
        )}
      </div>
    </section>
  );
}
