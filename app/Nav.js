"use client";

import { useState } from "react";

const LINKS = [
  ["/#companies", "Companies"],
  ["/#how", "How it works"],
  ["/#faq", "FAQ"],
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-bars" data-open={open}>
          <span /><span /><span />
        </span>
      </button>

      <nav className={`nav-links${open ? " open" : ""}`}>
        {LINKS.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </nav>
    </>
  );
}
