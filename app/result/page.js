import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { DISCOS, isValidRef } from "../../lib/discos";
import { detectDisco } from "../../lib/pitc";
import { rateLimitDetect, getIp } from "../../lib/store";
import BillFrame from "./BillFrame";

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
  let disco = (sp?.disco || "").toLowerCase();
  const ref = (sp?.reference || "").trim();

  // A reference is always required.
  if (!isValidRef(ref)) redirect("/");
  // An explicitly-chosen but unknown company -> back to the form.
  if (disco && !DISCOS[disco]) redirect("/");

  // No company chosen -> auto-detect it from the reference number.
  if (!disco) {
    const rl = await rateLimitDetect(getIp(await headers()));
    if (!rl.success) return <TooMany />;
    let detected = null;
    try {
      detected = await detectDisco(ref);
    } catch {}
    if (!detected) return <NotFound reference={ref} />;
    redirect(`/result?disco=${detected.disco}&reference=${ref}`);
  }

  const info = DISCOS[disco];
  const src = `/api/bill?disco=${encodeURIComponent(disco)}&reference=${encodeURIComponent(ref)}`;

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

        <BillFrame src={src} disco={disco} reference={ref} />
      </div>
    </section>
  );
}

function NotFound({ reference }) {
  return (
    <section className="result-wrap">
      <div className="container">
        <div className="crumb">
          <a href="/">Home</a> <span>/</span> <span>Bill</span>
        </div>
        <div className="error-box" style={{ marginTop: 8 }}>
          <span className="ic">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#9b1c1c" strokeWidth="2">
              <circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" />
            </svg>
          </span>
          <div>
            <h3>No bill found</h3>
            <p>
              We couldn&apos;t find a bill for reference <b>{reference}</b> at any company.
              Please check the number and try again, or pick your company manually.
            </p>
            <p style={{ marginTop: 12 }}>
              <a className="btn btn-ghost" href="/">← Try again</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TooMany() {
  return (
    <section className="result-wrap">
      <div className="container">
        <div className="crumb">
          <a href="/">Home</a> <span>/</span> <span>Bill</span>
        </div>
        <div className="error-box" style={{ marginTop: 8 }}>
          <span className="ic">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#9b1c1c" strokeWidth="2">
              <circle cx="12" cy="12" r="9" /><path d="M12 7v5M12 16h.01" />
            </svg>
          </span>
          <div>
            <h3>Too many requests</h3>
            <p>You&apos;ve checked a lot of bills in a short time. Please wait a minute and try again.</p>
            <p style={{ marginTop: 12 }}>
              <a className="btn btn-ghost" href="/">← Back</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
