"use client";

import { useEffect, useRef, useState } from "react";
import { CONSENT_EVENT, readConsent } from "../lib/consent";

// The AdSense publisher ID, e.g. "ca-pub-4404208402043493". Set
// NEXT_PUBLIC_ADSENSE_CLIENT in the Vercel environment to switch advertising on;
// while it is unset this component is inert and no ad script exists anywhere on
// the site. public/ads.txt already declares the publisher.
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
const SCRIPT_ID = "adsbygoogle-js";

// Loads the Google AdSense tag ONLY after the visitor has consented to
// advertising cookies. Mounted once in the root layout; renders no DOM.
//
// Why a manual <script> injection rather than next/script: next/script with
// strategy="afterInteractive" would fetch the tag on every page load regardless
// of consent state, which is exactly what must not happen here.
export default function AdSense() {
  const [allowed, setAllowed] = useState(false);
  const injected = useRef(false);

  useEffect(() => {
    const sync = () => setAllowed(!!readConsent()?.ads);
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!CLIENT) return;

    if (allowed) {
      if (injected.current || document.getElementById(SCRIPT_ID)) return;
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.async = true;
      s.crossOrigin = "anonymous";
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(CLIENT)}`;
      document.head.appendChild(s);
      injected.current = true;
      return;
    }

    // Consent withdrawn after the tag had already loaded. A loaded third-party
    // script cannot be meaningfully "unloaded", so reload the page to drop it —
    // otherwise "Reject" would be a lie for the rest of the session.
    if (injected.current) {
      injected.current = false;
      window.location.reload();
    }
  }, [allowed]);

  return null;
}
