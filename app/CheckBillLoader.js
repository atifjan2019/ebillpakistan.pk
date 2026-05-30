"use client";

import { useEffect, useRef } from "react";

const MESSAGES = [
  "Connecting to the billing system…",
  "Fetching your latest bill…",
  "Crunching the numbers…",
  "Almost there…",
];

// Drop this inside a lookup <form>. On submit it shows a full-screen animated
// loader so the wait while the bill is fetched feels alive. The browser only
// fires 'submit' after native validation (required + numeric pattern) passes,
// so it never shows for empty/invalid input. Navigation is not prevented; the
// overlay simply lives on the current page until /result takes over.
export default function CheckBillLoader() {
  const overlayRef = useRef(null);
  const msgRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const form = overlay?.closest("form");
    if (!form) return;
    let timer = null;

    const show = () => {
      overlay.classList.add("show");
      let i = 0;
      timer = setInterval(() => {
        i = (i + 1) % MESSAGES.length;
        if (msgRef.current) msgRef.current.textContent = MESSAGES[i];
      }, 1600);
    };
    const hide = () => {
      overlay.classList.remove("show");
      if (timer) { clearInterval(timer); timer = null; }
      if (msgRef.current) msgRef.current.textContent = MESSAGES[0];
    };

    form.addEventListener("submit", show);
    window.addEventListener("pageshow", hide); // reset if restored from bfcache (Back)
    return () => {
      form.removeEventListener("submit", show);
      window.removeEventListener("pageshow", hide);
      if (timer) clearInterval(timer);
    };
  }, []);

  return (
    <div ref={overlayRef} className="checking-overlay" role="status" aria-live="polite" aria-hidden="true">
      <div className="checking-card">
        <div className="checking-bolt" aria-hidden="true">⚡</div>
        <div className="checking-title">Checking your bill</div>
        <div className="checking-bar" aria-hidden="true"><span /></div>
        <div ref={msgRef} className="checking-msg">{MESSAGES[0]}</div>
      </div>
    </div>
  );
}
