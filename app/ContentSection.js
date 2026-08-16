// Renders one data-driven content section, applying the {{VERIFY}} suppression
// rules from lib/verify.js:
//   • a paragraph or list item containing a marker is dropped in production
//   • if what survives is under MIN_SECTION_WORDS, the whole section goes,
//     heading included — no orphan headings
import { resolveSection } from "../lib/verify";
import Verify from "./Verify";

export default function ContentSection({ id, heading, section, children }) {
  const { render, paras, items } = resolveSection(section, { itemFields: ["text", "label"] });
  if (!render) return null;

  return (
    <section id={id} className="cs">
      {heading && <h2>{heading}</h2>}
      {paras.map((p, i) => (
        <p key={i}><Verify text={p} /></p>
      ))}
      {items.length > 0 && (
        <ul className="cs-list">
          {items.map((it, i) => (
            <li key={i}>
              {typeof it === "string" ? (
                <Verify text={it} />
              ) : (
                <>
                  {it.label && <strong>{it.label}: </strong>}
                  <Verify text={it.text} />
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
