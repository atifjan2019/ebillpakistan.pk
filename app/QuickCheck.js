"use client";

import { useEffect, useState } from "react";
import { LAST_KEY } from "./RememberLookup";

// "Check again" for returning visitors: the last reference number checked on
// this device, masked, with a one-tap link to its current bill and a Forget
// button. Renders nothing until the browser has read storage, so there is no
// flash for first-time visitors.
export default function QuickCheck() {
  const [last, setLast] = useState(null);
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(LAST_KEY) || "null");
      if (v?.disco && v?.reference) setLast(v);
    } catch {
      /* ignore */
    }
  }, []);
  if (!last) return null;
  const masked = `····${String(last.reference).slice(-4)}`;
  const forget = () => {
    try {
      localStorage.removeItem(LAST_KEY);
    } catch {
      /* ignore */
    }
    setLast(null);
  };
  return (
    <div className="quick-check" role="region" aria-label="Check your last bill again">
      <span className="quick-check-text">
        Back again? Your last check was <b>{last.discoName}</b> {masked}.
      </span>
      <a className="btn btn-primary quick-check-btn" href={`/result?disco=${encodeURIComponent(last.disco)}&reference=${encodeURIComponent(last.reference)}`}>
        Check it again
      </a>
      <button type="button" className="quick-check-forget" onClick={forget} title="Remove the saved number from this device">Forget</button>
    </div>
  );
}
