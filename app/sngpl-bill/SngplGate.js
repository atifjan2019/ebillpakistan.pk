"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

// SNGPL's Consumer Bill page. It's embeddable (X-Frame-Options: ALLOWALL, no
// frame-busting), so the visitor enters their 11-digit consumer number and the
// captcha inside this iframe — everything stays first-party to sngpl.com.pk, so
// the captcha session works. (SNGPL enforces the captcha server-side, so unlike
// the electricity flow we can't open the bill in one click.)
const SNGPL_URL = "https://www.sngpl.com.pk/login.jsp?mdids=85";

// Ad dwell time before the bill portal is revealed (same as the electricity card).
const WAIT = 10;

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

export default function SngplGate({ consumer = "" }) {
  const [left, setLeft] = useState(WAIT);
  const pushed = useRef(false);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  useEffect(() => {
    if (pushed.current || !AD_CLIENT || !AD_SLOT) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  const ready = left <= 0;
  const pct = Math.round(((WAIT - left) / WAIT) * 100);

  // ---- Phase 1: ad + countdown ----
  if (!ready) {
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
          <span className="dot" /> Preparing your bill
        </span>
        <h2 style={{ margin: "4px 0 4px", fontSize: 24, fontWeight: 800 }}>Your SNGPL gas bill is getting ready</h2>
        <p style={{ margin: "0 0 20px", color: "#667085", fontSize: 15 }}>Loading the official SNGPL bill portal…</p>

        <div
          style={{
            position: "relative", margin: "0 auto 22px", maxWidth: 540, minHeight: 180,
            border: "1px solid #e6e8ec", borderRadius: 14, background: "#fafbfc",
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
          }}
        >
          <span style={{ position: "absolute", top: 8, left: 12, fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: "#98a2b3", fontWeight: 700 }}>
            Advertisement
          </span>
          {AD_CLIENT && AD_SLOT ? (
            <ins className="adsbygoogle" style={{ display: "block", width: "100%", minHeight: 160 }}
              data-ad-client={AD_CLIENT} data-ad-slot={AD_SLOT} data-ad-format="auto" data-full-width-responsive="true" />
          ) : (
            <span style={{ color: "#cbd2dc", fontSize: 14, fontWeight: 600 }}>Your ad here</span>
          )}
        </div>

        <div style={{ maxWidth: 380, margin: "0 auto" }} aria-live="polite">
          <div style={{ height: 8, borderRadius: 999, background: "#eceff3", overflow: "hidden" }}>
            <span style={{ display: "block", height: "100%", width: `${pct}%`, borderRadius: 999, background: "#16a34a", transition: "width 1s linear" }} />
          </div>
          <p style={{ margin: "12px 0 0", color: "#667085", fontSize: 15 }}>
            Please wait… ready in <b style={{ color: "#16a34a" }}>{left}s</b>
          </p>
        </div>
      </div>
    );
  }

  // ---- Phase 2: embedded SNGPL bill portal ----
  return (
    <div className="bill-card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid #eef0f3", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span className="tag"><span className="dot" /> Bill ready</span>
        <span style={{ color: "#475467", fontSize: 14 }}>
          {consumer ? <>Enter consumer no. <b>{consumer}</b> and the <b>captcha</b> below, then tap <b>View Bill</b>.</>
                    : <>Enter your <b>11-digit consumer number</b> and the <b>captcha</b> shown, then tap <b>View Bill</b>.</>}
        </span>
      </div>
      <iframe
        title="SNGPL Gas Bill"
        src={SNGPL_URL}
        loading="lazy"
        style={{ width: "100%", height: 1050, border: 0, display: "block", background: "#fff" }}
      />
      <p style={{ margin: 0, padding: "12px 18px", color: "#98a2b3", fontSize: 13, borderTop: "1px solid #eef0f3" }}>
        The bill is served by the official SNGPL portal (sngpl.com.pk). eBill Pakistan is not affiliated with SNGPL.
      </p>
    </div>
  );
}
