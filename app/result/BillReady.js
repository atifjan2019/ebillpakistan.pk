"use client";

import { useEffect, useState } from "react";

// Seconds the visitor waits before the "View My Bill" button unlocks. PITC's
// gbill.aspx renders the bill only on a POST, so the button is an HTML form
// that POSTs straight from the visitor's (Pakistani) browser.
const WAIT = 10;

export default function BillReady({ discoName, region, reference, pitcUrl }) {
  const [left, setLeft] = useState(WAIT);

  // Countdown.
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const ready = left <= 0;
  const pct = Math.round(((WAIT - left) / WAIT) * 100);

  return (
    <div className="bill-card" style={{ maxWidth: 620, margin: "0 auto", padding: "32px 28px", textAlign: "center" }}>
      <span className="tag" style={{ marginBottom: 16 }}>
        <span className="dot" /> {ready ? "Bill ready" : "Preparing your bill"}
      </span>

      <h2 style={{ margin: "4px 0 4px", fontSize: 24, fontWeight: 800 }}>
        Your {discoName} bill is {ready ? "ready" : "getting ready"}
      </h2>
      <p style={{ margin: "0 0 20px", color: "#667085", fontSize: 15 }}>
        Reference No: <b style={{ color: "#1f2937" }}>{reference}</b>
        {region ? <> &middot; {region}</> : null}
      </p>

      {/* ---- Countdown -> Button ---- */}
      {ready ? (
        <form action={pitcUrl} method="POST" target="_blank" rel="noopener noreferrer" encType="text/plain">
          <button
            type="submit"
            className="btn btn-wa"
            style={{ fontSize: 17, padding: "13px 34px", borderRadius: 12 }}
          >
            View My Bill →
          </button>
        </form>
      ) : (
        <div style={{ maxWidth: 380, margin: "0 auto" }} aria-live="polite">
          <div style={{ height: 8, borderRadius: 999, background: "#eceff3", overflow: "hidden" }}>
            <span
              style={{
                display: "block", height: "100%", width: `${pct}%`, borderRadius: 999,
                background: "#16a34a", transition: "width 1s linear",
              }}
            />
          </div>
          <p style={{ margin: "12px 0 0", color: "#667085", fontSize: 15 }}>
            Please wait… ready in <b style={{ color: "#16a34a" }}>{left}s</b>
          </p>
        </div>
      )}

      <p style={{ margin: "18px 0 0", color: "#98a2b3", fontSize: 13 }}>
        Your bill opens on the official PITC portal (bill.pitc.com.pk) in a new tab.
      </p>
    </div>
  );
}
