"use client";

// PTCL sends a one-off e-bill link (prism.ptcl.net.pk/b/...) by SMS and email
// for each invoice. It opens without a CAPTCHA, so for anyone who has the
// message it is the quickest route to the bill. The link is opened as-is and
// kept only on this device.
import { useEffect, useState } from "react";

const KEY = "ebp:utility:ptcl:link";
const OK = /^https:\/\/prism\.ptcl\.net\.pk\/b\/[A-Za-z0-9+/=]+$/;

export default function EbillLink() {
  const [link, setLink] = useState("");
  useEffect(() => {
    try { setLink(localStorage.getItem(KEY) || ""); } catch {}
  }, []);
  const valid = OK.test(link.trim());
  const change = (v) => {
    setLink(v);
    try { if (OK.test(v.trim())) localStorage.setItem(KEY, v.trim()); } catch {}
  };
  const open = (e) => {
    e.preventDefault();
    if (valid) window.open(link.trim(), "_blank", "noopener,noreferrer");
  };
  return (
    <form className="search-card handoff" onSubmit={open}>
      <div className="search-grid solo">
        <div className="field">
          <label htmlFor="ptcl-ebill">E-bill link from PTCL&apos;s SMS or email</label>
          <div className="control">
            <input id="ptcl-ebill" type="url" inputMode="url" autoComplete="off" placeholder="https://prism.ptcl.net.pk/b/..." value={link} onChange={(e) => change(e.target.value)} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={!valid}>Open e-bill</button>
      </div>
      <p className="search-foot">No picture code on this route. Each invoice has its own link, so paste the latest one; it stays on this device only.</p>
    </form>
  );
}
