"use client";

// The lookup card for gas and PTCL bills. The official portals need a CAPTCHA,
// so instead of fetching the bill we keep the visitor's number(s) on their
// device, copy them to the clipboard, and open the portal in a new tab.
// Nothing typed here is sent anywhere.
import { useEffect, useState } from "react";

const KEY = (code) => `ebp:utility:${code}`;

function Icon({ d }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function PortalHandoff({ code, abbr, fields, portal }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.key, ""])));
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY(code)) || "null");
      if (saved && typeof saved === "object") setValues((v) => ({ ...v, ...saved }));
    } catch {}
    setLoaded(true);
  }, [code]);

  const complete = fields.every((f) => new RegExp(`^${f.pattern}$`).test(values[f.key] || ""));

  const set = (key, raw) => {
    const v = raw.replace(/[^0-9]/g, "");
    setValues((prev) => {
      const next = { ...prev, [key]: v };
      try { localStorage.setItem(KEY(code), JSON.stringify(next)); } catch {}
      return next;
    });
    setCopied(false);
  };

  const forget = () => {
    try { localStorage.removeItem(KEY(code)); } catch {}
    setValues(Object.fromEntries(fields.map((f) => [f.key, ""])));
  };

  const open = async (e) => {
    e.preventDefault();
    const text = fields.map((f) => values[f.key]).join(" ");
    // Open first: the new tab needs the click's user activation, which an
    // awaited clipboard write can consume on Safari.
    window.open(portal.url, "_blank", "noopener,noreferrer");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {}
  };

  return (
    <form className="search-card handoff" onSubmit={open}>
      <div className={`search-grid${fields.length === 1 ? " solo" : ""}`}>
        {fields.map((f) => (
          <div className="field" key={f.key}>
            <label htmlFor={`${code}-${f.key}`}>{f.label}</label>
            <div className="control">
              <input
                id={`${code}-${f.key}`}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                pattern={f.pattern}
                placeholder={f.placeholder}
                value={values[f.key] || ""}
                onChange={(e) => set(f.key, e.target.value)}
                required
              />
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary" disabled={!complete}>
          <Icon d="M14 3h7v7M21 3l-9 9M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" /> Open {abbr} bill
        </button>
      </div>
      <p className="search-foot">
        {copied ? (
          <span>Number copied. Paste it on the {portal.name}, complete the picture check, and your bill opens there.</span>
        ) : (
          <span>{portal.how} Your number is copied for pasting and kept on this device only.</span>
        )}
        {loaded && fields.some((f) => values[f.key]) && (
          <button type="button" className="quick-check-forget" onClick={forget} title="Remove the saved number from this device">Forget</button>
        )}
      </p>
    </form>
  );
}
