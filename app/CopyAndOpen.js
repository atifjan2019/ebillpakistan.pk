"use client";

// One button that copies a reference number and opens the company's own bill
// page on PITC in a new tab. Used where this site cannot fetch the bill itself:
// AJK (PITC's JSON API has no AJK bills) and the fallback card when the
// billing system does not respond. The new tab is opened first because an
// awaited clipboard write can consume the click's user activation on Safari.
import { useState } from "react";

export default function CopyAndOpen({ reference, url, label, className = "btn btn-ghost" }) {
  const [copied, setCopied] = useState(false);
  const go = async (e) => {
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
    } catch {}
  };
  return (
    <>
      <a className={className} href={url} target="_blank" rel="noopener noreferrer" onClick={go}>
        {label}
      </a>
      <span className="copy-state" role="status" aria-live="polite">
        {copied ? `Reference ${reference} copied. Paste it on the page that opened.` : ""}
      </span>
    </>
  );
}
