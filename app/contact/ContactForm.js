"use client";

import { useRef, useState } from "react";
import { CONTACT_SUBJECTS } from "../../lib/contact";

// Mobile-first contact form.
//   • labels sit ABOVE inputs (never beside), so a 360px column never wraps oddly
//   • every input is 16px — below that, iOS Safari zooms the page on focus
//   • inputs and the submit button are 48px tall (> the 44px tap-target minimum)
//   • the honeypot is visually hidden but NOT display:none, so bots that check
//     computed styles still fill it in
export default function ContactForm() {
  const startedAt = useRef(Date.now());
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");
  const [badField, setBadField] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError("");
    setBadField("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name") || "",
      email: fd.get("email") || "",
      subject: fd.get("subject") || "",
      message: fd.get("message") || "",
      website: fd.get("website") || "", // honeypot
      startedAt: startedAt.current,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setState("sent");
        return;
      }
      setBadField(data.field || "");
      setError(data.error || "Something went wrong. Please try again, or email us directly.");
      setState("error");
    } catch {
      setError(
        "We couldn't reach the server. Check your connection and try again, or email support@ebillpakistan.pk."
      );
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="form-done" role="status">
        <h2>Message received</h2>
        <p>
          Thanks — we&apos;ve got it. We read every message and aim to reply within a few working
          days, to the email address you gave us.
        </p>
        <p className="form-done-note">
          A reminder: for bill payments, meter readings, new connections and billing disputes, your
          distribution company is the only party that can act. See{" "}
          <a href="/#companies">your company&apos;s page</a> for its official channels.
        </p>
      </div>
    );
  }

  return (
    <form className="cform" onSubmit={onSubmit} noValidate={false}>
      <div className="cform-field">
        <label htmlFor="cf-name">Your name</label>
        <input
          id="cf-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          aria-invalid={badField === "name" || undefined}
        />
      </div>

      <div className="cform-field">
        <label htmlFor="cf-email">Your email</label>
        <input
          id="cf-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          aria-invalid={badField === "email" || undefined}
        />
        <p className="cform-hint">We only use this to reply to you.</p>
      </div>

      <div className="cform-field">
        <label htmlFor="cf-subject">What is it about?</label>
        <div className="cform-select">
          <select
            id="cf-subject"
            name="subject"
            required
            defaultValue=""
            aria-invalid={badField === "subject" || undefined}
          >
            <option value="" disabled>
              Choose a subject
            </option>
            {CONTACT_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="cform-field">
        <label htmlFor="cf-message">Your message</label>
        <textarea
          id="cf-message"
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={5000}
          placeholder="If you're reporting incorrect data, tell us which page and what's wrong."
          aria-invalid={badField === "message" || undefined}
        />
      </div>

      {/* Honeypot — off-screen rather than display:none, and excluded from the
          tab order and the accessibility tree. */}
      <div className="cform-hp" aria-hidden="true">
        <label htmlFor="cf-website">Website (leave this empty)</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state === "error" && (
        <p className="cform-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary cform-submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send message"}
      </button>

      <p className="cform-privacy">
        By sending this you agree we may use your email to reply. See our{" "}
        <a href="/privacy">privacy policy</a>.
      </p>
    </form>
  );
}
