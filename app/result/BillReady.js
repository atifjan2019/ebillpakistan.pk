"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

// Seconds the visitor waits (ad dwell time) before the "View My Bill" button
// unlocks. PITC's gbill.aspx renders the bill only on a POST, so the button is
// an HTML form that POSTs straight from the visitor's (Pakistani) browser.
const WAIT = 10;

// AdSense is enabled by setting these in the environment (NEXT_PUBLIC_ so they
// reach the browser). Until then a styled placeholder keeps the layout intact.
const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; // e.g. "ca-pub-1234567890123456"
const AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT;     // e.g. "1234567890"

export default function BillReady({ discoName, region, reference, pitcUrl }) {
  const [left, setLeft] = useState(WAIT);
  const pushed = useRef(false);

  // Countdown.
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  // Request the ad fill once (queued until adsbygoogle.js loads).
  useEffect(() => {
    if (pushed.current || !AD_CLIENT || !AD_SLOT) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  const ready = left <= 0;
  const pct = Math.round(((WAIT - left) / WAIT) * 100);

  return (
    <div className="bill-card" style={{ maxWidth: 620, margin: "0 auto", padding: "32px 28px", textAlign: "center" }}>
      {AD_CLIENT && (
        <Script
          id="adsbygoogle-js"
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
        />
      )}

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

      {/* ---- Advertisement ---- */}
      <div
        style={{
          position: "relative", margin: "0 auto 22px", maxWidth: 540, minHeight: 180,
          border: "1px solid #e6e8ec", borderRadius: 14, background: "#fafbfc",
          display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}
      >
        <span
          style={{
            position: "absolute", top: 8, left: 12, fontSize: 10, letterSpacing: ".08em",
            textTransform: "uppercase", color: "#98a2b3", fontWeight: 700,
          }}
        >
          Advertisement
        </span>
        {AD_CLIENT && AD_SLOT ? (
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight: 160 }}
            data-ad-client={AD_CLIENT}
            data-ad-slot={AD_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <span style={{ color: "#cbd2dc", fontSize: 14, fontWeight: 600 }}>Your ad here</span>
        )}
      </div>

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
            Your <b style={{ color: "#1f2937" }}>{discoName}</b> bill is getting ready…{" "}
            <b style={{ color: "#16a34a" }}>{left}s</b>
          </p>
        </div>
      )}

      <p style={{ margin: "18px 0 0", color: "#98a2b3", fontSize: 13 }}>
        Your bill opens on the official PITC portal (bill.pitc.com.pk) in a new tab.
      </p>
    </div>
  );
}
