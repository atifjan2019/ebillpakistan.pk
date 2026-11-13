"use client";

// Reads ?e= (lookup error sent back by /result) and ?disco= (company preset)
// in the browser, so the home page itself can be prerendered once instead of
// being rendered on the server for every visit.
import { useEffect, useState } from "react";

export default function LookupState({ errors, codes }) {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setMessage(errors[sp.get("e")] || null);
    const disco = (sp.get("disco") || "").toLowerCase();
    if (codes.includes(disco)) {
      const select = document.getElementById("disco");
      if (select) select.value = disco;
      document.getElementById("reference")?.focus();
    }
  }, [errors, codes]);

  return message ? <p className="lookup-error" role="alert">{message}</p> : null;
}
