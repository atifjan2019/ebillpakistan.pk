"use client";

import { useEffect, useRef, useState } from "react";
import { CONSENT_EVENT, readConsent } from "../lib/consent";

// The Google Analytics 4 measurement ID, e.g. "G-L6M480D6QE". Set
// NEXT_PUBLIC_GA_MEASUREMENT_ID in the Vercel environment to switch it on;
// while it is unset this component is inert and no Analytics script exists
// anywhere on the site.
const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
const SCRIPT_ID = "gtag-js";

// Loads the Google tag ONLY after the visitor has consented to analytics
// cookies, in the same way AdSense.js waits for advertising consent. Google's
// own instructions say to paste the tag into <head> of every page; that would
// fetch it before any choice is made, which the consent bar promises does not
// happen. Mounted once in the root layout; renders no DOM.
export default function Analytics() {
  const [allowed, setAllowed] = useState(false);
  const injected = useRef(false);

  useEffect(() => {
    const sync = () => setAllowed(!!readConsent()?.analytics);
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!MEASUREMENT_ID) return;
    // The admin dashboard is the owner's own traffic and must not count.
    if (window.location.pathname.startsWith("/admin")) return;

    if (allowed) {
      if (injected.current || document.getElementById(SCRIPT_ID)) return;
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      // Analytics was accepted; advertising consent is AdSense's business and
      // is declared denied here so Analytics never shares data for ads.
      gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "granted",
      });
      gtag("js", new Date());
      gtag("config", MEASUREMENT_ID);
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
      document.head.appendChild(s);
      injected.current = true;
      return;
    }

    // Consent withdrawn after the tag had loaded: a loaded script cannot be
    // unloaded, so the page is reloaded to drop it (as AdSense.js does).
    if (injected.current) {
      injected.current = false;
      window.location.reload();
    }
  }, [allowed]);

  return null;
}
