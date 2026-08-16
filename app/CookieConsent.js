"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CATEGORIES,
  CONSENT_EVENT,
  CONSENT_OPEN_EVENT,
  openConsentSettings,
  readConsent,
  writeConsent,
} from "../lib/consent";

// Genuine opt-in consent bar.
//
// Layout-shift safety: the bar is `position: fixed`, so it never occupies space
// in the document flow and cannot move any content. It also renders nothing at
// all on the server and on the first client paint (until `mounted`), so there is
// no flash of a banner for visitors who already chose.
//
// Placement safety: it is anchored to the BOTTOM of the viewport and capped in
// height, so the lookup form — which sits at the top of every page — stays
// clear of it at 360px.
export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [managing, setManaging] = useState(false);
  const [prefs, setPrefs] = useState({ ads: false, analytics: false });

  useEffect(() => {
    setMounted(true);
    const stored = readConsent();
    if (stored) setPrefs({ ads: stored.ads, analytics: stored.analytics });
    else setOpen(true); // no choice yet -> ask

    const reopen = () => {
      const current = readConsent();
      setPrefs(current ? { ads: current.ads, analytics: current.analytics } : { ads: false, analytics: false });
      setManaging(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  const decide = useCallback((value) => {
    writeConsent(value);
    setPrefs(value);
    setOpen(false);
    setManaging(false);
  }, []);

  if (!mounted || !open) return null;

  return (
    <div
      className="cc"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cc-title"
      aria-describedby="cc-desc"
    >
      <div className="cc-inner">
        <div className="cc-copy">
          <h2 id="cc-title">Cookies on eBill Pakistan</h2>
          {/* Kept deliberately short on mobile: every line of banner height is a
              line of the lookup form it could cover. The full disclosure — third
              parties, prior visits, opt-out links — lives in the privacy policy. */}
          <p id="cc-desc">
            {/* Both halves are complete sentences, so hiding the first on mobile
                still leaves text that starts with a capital letter. The mobile
                half is held to two lines at 360px on purpose: banner height is
                what determines the clearance above the Check Bill button. */}
            <span className="cc-long">
              Checking your bill is free and always will be — advertising pays for it. Ads here use
              cookies from Google and other partners, based on your visits to this and other sites.
              Nothing loads until you accept.{" "}
            </span>
            <span className="cc-short">
              Ads use cookies from Google and partners — nothing loads until you accept.{" "}
            </span>
            <a href="/privacy">Privacy policy</a>.
          </p>
        </div>

        {managing && (
          <fieldset className="cc-prefs">
            <legend className="cc-prefs-legend">Choose what to allow</legend>

            <label className="cc-pref cc-pref--locked">
              <input type="checkbox" checked disabled />
              <span>
                <b>Strictly necessary</b>
                <em>
                  Needed for the site to work and to remember this choice. Always on, never used for
                  advertising.
                </em>
              </span>
            </label>

            {CATEGORIES.map((c) => (
              <label key={c.id} className="cc-pref">
                <input
                  type="checkbox"
                  checked={prefs[c.id]}
                  onChange={(e) => setPrefs((p) => ({ ...p, [c.id]: e.target.checked }))}
                />
                <span>
                  <b>{c.title}</b>
                  <em>{c.detail}</em>
                </span>
              </label>
            ))}
          </fieldset>
        )}

        <div className="cc-actions">
          {managing ? (
            <>
              <button type="button" className="btn btn-ghost cc-btn" onClick={() => decide({ ads: false, analytics: false })}>
                Reject all
              </button>
              <button type="button" className="btn btn-primary cc-btn" onClick={() => decide(prefs)}>
                Save choices
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-ghost cc-btn" onClick={() => decide({ ads: false, analytics: false })}>
                Reject
              </button>
              <button type="button" className="btn btn-ghost cc-btn" onClick={() => setManaging(true)}>
                {/* "Manage" alone fits a 3-up row at 360px; the full phrase stays
                    available to screen readers and appears from 560px. */}
                Manage<span className="cc-btn-more">&nbsp;preferences</span>
              </button>
              <button type="button" className="btn btn-primary cc-btn" onClick={() => decide({ ads: true, analytics: true })}>
                Accept
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Footer link that reopens the banner. Consent must be withdrawable as easily as
// it was given, so this ships on every page.
export function CookieSettingsLink({ children = "Cookie settings" }) {
  return (
    <button type="button" className="cc-reopen" onClick={openConsentSettings}>
      {children}
    </button>
  );
}

// Re-exported so other client modules can listen without importing lib/consent
// twice; keeps the "who may load" contract in one place.
export { CONSENT_EVENT };
