"use client";

import { useEffect, useRef, useState } from "react";
import { UTILITIES, KIND_LABEL, utilitySlug } from "../lib/utilities";
import { usePathname } from "next/navigation";

const LINKS = [
  ["/#companies", "Companies"],
  ["/tools", "Tools"],
  ["/this-month", "This month"],
  ["/electricity-tariff", "Tariff"],
  ["/blog", "Blog"],
  ["/contact", "Contact"],
];

// Where the language switch goes from the current page. `pairs` maps an
// English guide's slug to its Urdu twin's slug (from lib/articles.js), so a
// reader lands on the same guide in the other language when one exists.
function languageTarget(path, pairs, urduOnly) {
  const p = path || "/";
  if (p === "/ur") return { lang: "en", href: "/" };
  const m = p.match(/^\/blog\/([^/]+)$/);
  if (m) {
    const slug = m[1];
    const english = Object.keys(pairs).find((en) => pairs[en] === slug);
    if (english) return { lang: "en", href: `/blog/${english}` };
    if (urduOnly.includes(slug)) return { lang: "en", href: "/blog" };
    if (pairs[slug]) return { lang: "ur", href: `/blog/${pairs[slug]}` };
  }
  return { lang: "ur", href: "/ur" };
}

function Globe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  );
}

// The "More checks" menu: every gas, K-Electric, PTCL, water, vehicle and
// challan page, grouped by kind. A real dropdown on desktop, a plain list
// inside the hamburger menu on phones.
function MoreChecks({ onPick }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("click", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("click", close); document.removeEventListener("keydown", esc); };
  }, [open]);
  const groups = {};
  for (const [code, u] of Object.entries(UTILITIES)) (groups[u.kind] ||= []).push([code, u]);
  return (
    <div className={`nav-more${open ? " open" : ""}`} ref={ref}>
      <button type="button" className="nav-more-btn" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((v) => !v)}>
        More checks <span aria-hidden="true">▾</span>
      </button>
      <div className="nav-more-panel" role="menu">
        {Object.entries(groups).map(([kind, items]) => (
          <div key={kind} className="nav-more-group">
            <span className="nav-more-kind">{KIND_LABEL[kind]}</span>
            {items.map(([code, u]) => (
              <a key={code} href={`/${utilitySlug(code)}`} role="menuitem" onClick={() => { setOpen(false); onPick?.(); }}>{u.abbr}</a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Nav({ pairs = {}, urduOnly = [] }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const target = languageTarget(path, pairs, urduOnly);

  return (
    <>
      <nav className={`nav-links${open ? " open" : ""}`}>
        {LINKS.slice(0, 1).map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <MoreChecks onPick={() => setOpen(false)} />
        {LINKS.slice(1).map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </nav>

      <div className="nav-right">
        <a
          className="nav-lang"
          href={target.href}
          hrefLang={target.lang}
          lang={target.lang}
          aria-label={target.lang === "en" ? "Switch to English" : "اردو میں پڑھیں"}
        >
          <Globe />
          {target.lang === "en" ? "English" : "اردو"}
        </a>
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
      </div>
    </>
  );
}
