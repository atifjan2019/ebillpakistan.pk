"use client";

import { useEffect, useState } from "react";

// Registers the service worker that makes the site installable, and offers
// "add to home screen" once, after the visitor has seen a result or come back
// a second time. Dismissal is remembered for 60 days in browser storage.
const DISMISS_KEY = "ebp:install-dismissed";
const VISITS_KEY = "ebp:visits";

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    let visits = 0;
    try {
      const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
      if (dismissedAt && Date.now() - dismissedAt < 60 * 24 * 3600 * 1000) return;
      visits = Number(localStorage.getItem(VISITS_KEY) || 0) + 1;
      localStorage.setItem(VISITS_KEY, String(visits));
    } catch {
      return;
    }
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    if (standalone) return;
    const eligible = visits >= 2 || location.pathname.startsWith("/result");
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
      if (eligible) setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    if (isIos && eligible) {
      setIos(true);
      setShow(true);
    }
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!show) return null;
  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setShow(false);
  };
  const install = async () => {
    if (!deferred) return dismiss();
    deferred.prompt();
    try {
      await deferred.userChoice;
    } finally {
      dismiss();
    }
  };
  return (
    <div className="install-bar" role="dialog" aria-label="Add eBill Pakistan to your home screen">
      <div className="install-text">
        <b>Add eBill Pakistan to your home screen</b>
        <span>{ios ? "Tap the Share button, then “Add to Home Screen”. Your bill is then one tap away." : "One tap to your bill every month, no app store needed."}</span>
      </div>
      <div className="install-actions">
        {!ios && <button type="button" className="btn btn-primary" onClick={install}>Add</button>}
        <button type="button" className="install-dismiss" onClick={dismiss}>{ios ? "Got it" : "Not now"}</button>
      </div>
    </div>
  );
}
