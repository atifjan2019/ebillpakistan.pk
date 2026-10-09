"use client";

import { useEffect, useState } from "react";
import { dayMonth } from "../../lib/dates";

// "Remind me before the due date": a browser notification three days before
// and on the day, with no email address or phone number. Once switched on,
// every later bill check on this device moves the reminder to the new due date.
function keyToBytes(base64) {
  const pad = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export default function ReminderButton({ disco, discoName, dueIso, last4 }) {
  // idle | unsupported | ios | busy | on | denied | error
  const [state, setState] = useState("idle");
  const [ready, setReady] = useState(false);

  const save = async (sub) => {
    const res = await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: sub.toJSON(), disco, dueDate: dueIso, last4 }),
    });
    if (!res.ok) throw new Error("save failed");
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
      if (!supported) {
        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
        if (!cancelled) { setState(ios ? "ios" : "unsupported"); setReady(true); }
        return;
      }
      if (Notification.permission === "denied") {
        if (!cancelled) { setState("denied"); setReady(true); }
        return;
      }
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        // Already switched on: quietly move the reminder to this bill's due date.
        if (sub && Notification.permission === "granted") {
          await save(sub);
          if (!cancelled) setState("on");
        }
      } catch {
        /* leave it at idle; the button still works */
      }
      if (!cancelled) setReady(true);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disco, dueIso]);

  const enable = async () => {
    setState("busy");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return setState(permission === "denied" ? "denied" : "idle");
      const reg = await navigator.serviceWorker.ready;
      const { publicKey } = await (await fetch("/api/reminders")).json();
      const sub =
        (await reg.pushManager.getSubscription()) ||
        (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyToBytes(publicKey) }));
      await save(sub);
      setState("on");
    } catch {
      setState("error");
    }
  };

  const disable = async () => {
    setState("busy");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/reminders", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint }) });
        await sub.unsubscribe();
      }
      setState("idle");
    } catch {
      setState("error");
    }
  };

  if (!ready || state === "unsupported") return null;
  const when = dayMonth(dueIso);

  return (
    <div className="reminder" role="region" aria-label="Due date reminder">
      {state === "on" ? (
        <>
          <p className="reminder-text"><b>Reminder set.</b> This device will be notified three days before {when} and on the day. Checking next month&apos;s bill here moves it to the new date.</p>
          <button type="button" className="reminder-off" onClick={disable}>Turn off</button>
        </>
      ) : state === "ios" ? (
        <p className="reminder-text"><b>Want a reminder before {when}?</b> On an iPhone, first add this site to your Home Screen (Share, then Add to Home Screen), open it from there, and the reminder button appears.</p>
      ) : state === "denied" ? (
        <p className="reminder-text"><b>Notifications are blocked for this site.</b> Allow them in your browser&apos;s site settings to get a reminder before {when}.</p>
      ) : (
        <>
          <p className="reminder-text"><b>Due {when}.</b> Get a notification on this device three days before and on the day. No email or phone number needed.</p>
          <button type="button" className="btn btn-primary reminder-btn" onClick={enable} disabled={state === "busy"}>
            {state === "busy" ? "Setting up" : `Remind me about this ${discoName} bill`}
          </button>
          {state === "error" && <span className="reminder-err">Could not set the reminder. Try again.</span>}
        </>
      )}
    </div>
  );
}
