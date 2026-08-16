// Renders one data-driven content section, applying the {{VERIFY}} suppression
// rules from lib/verify.js:
//   • a paragraph or list item containing a marker is dropped in production
//   • if what survives is under MIN_SECTION_WORDS, the whole section goes,
//     heading included — no orphan headings
import { resolveSection } from "../lib/verify";
import Verify from "./Verify";

// Turn a bare URL in body text into a real link. Besides being better for the
// reader, this stops a long unbreakable URL (the load-shedding schedule links)
// from forcing the page wider than a 360px viewport — which it did.
const URL_RE = /(https?:\/\/[^\s<>"')]+)/g;

function Linkify({ text }) {
  const src = String(text ?? "");
  if (!URL_RE.test(src)) return <Verify text={src} />;
  URL_RE.lastIndex = 0;
  const out = [];
  let last = 0, m, i = 0;
  while ((m = URL_RE.exec(src))) {
    if (m.index > last) out.push(<Verify key={`t${i}`} text={src.slice(last, m.index)} />);
    const href = m[1].replace(/[.,]$/, "");
    out.push(
      <a key={`a${i}`} href={href} target="_blank" rel="noopener noreferrer" className="cs-url">
        {href.replace(/^https?:\/\//, "")}
      </a>
    );
    last = m.index + m[1].length;
    i++;
  }
  if (last < src.length) out.push(<Verify key={`t${i}`} text={src.slice(last)} />);
  return <>{out}</>;
}

export default function ContentSection({ id, heading, section, children }) {
  const { render, paras, items } = resolveSection(section, { itemFields: ["text", "label"] });
  if (!render) return null;

  return (
    <section id={id} className="cs">
      {heading && <h2>{heading}</h2>}
      {paras.map((p, i) => (
        <p key={i}><Linkify text={p} /></p>
      ))}
      {items.length > 0 && (
        <ul className="cs-list">
          {items.map((it, i) => (
            <li key={i}>
              {typeof it === "string" ? (
                <Linkify text={it} />
              ) : (
                <>
                  {it.label && <strong>{it.label}: </strong>}
                  <Linkify text={it.text} />
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {children}
    </section>
  );
}
