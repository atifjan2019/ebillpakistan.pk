// {{VERIFY}} suppression.
//
// A {{VERIFY: ...}} marker is a promise that a fact will be supplied by a human.
// Until it is, the two acceptable behaviours are:
//
//   development  — render it loudly, so the gap is impossible to miss while working
//   production   — render NOTHING, and drop the block that contained it
//
// The one behaviour that is never acceptable is shipping literal template braces
// into a page a reader (or an AdSense reviewer) sees. That is worse than an
// absent section, because an absent section reads as brevity while visible
// braces read as an abandoned site.
//
// Nothing here ever invents a replacement value. Suppression is the whole point.

export const VERIFY_PATTERN = /\{\{VERIFY:\s*([^}]+)\}\}/;
const GLOBAL_PATTERN = /\{\{VERIFY:\s*([^}]+)\}\}/g;

// Next inlines NODE_ENV at build time, so this is a compile-time constant in the
// client bundle and the dev-only branch is dropped from production entirely.
export const SHOW_VERIFY = process.env.NODE_ENV !== "production";

export const hasVerify = (v) => typeof v === "string" && VERIFY_PATTERN.test(v);

// Extract the descriptions of every marker in a string.
export function verifyLabels(v) {
  if (typeof v !== "string") return [];
  return [...v.matchAll(GLOBAL_PATTERN)].map((m) => m[1].trim());
}

// A value safe to render. In production a marked value becomes null so the
// caller can omit its container; in development it passes through for <Verify>.
export const safe = (v) => (hasVerify(v) ? (SHOW_VERIFY ? v : null) : v ?? null);

// Keep only list items whose checked fields are all clean.
export function safeList(items, fields) {
  if (!Array.isArray(items)) return [];
  if (SHOW_VERIFY) return items;
  return items.filter((it) => !fields.some((f) => hasVerify(it?.[f])));
}

// Strip markers from a string destined for JSON-LD or a <meta> tag, where a
// container cannot be omitted and braces must never appear.
export const stripVerify = (v) =>
  typeof v === "string" ? v.replace(GLOBAL_PATTERN, "").replace(/\s{2,}/g, " ").trim() : v;

const words = (s) => (typeof s === "string" ? s.trim().split(/\s+/).filter(Boolean).length : 0);

// Minimum surviving words for a section to be worth rendering at all. Below
// this, a heading plus a fragment reads as broken rather than brief.
export const MIN_SECTION_WORDS = 40;

// Decide what survives of a section once its marked parts are removed.
// Returns { render, paras, items, wordCount, suppressed }.
export function resolveSection(section, { itemFields = ["text"] } = {}) {
  if (!section) return { render: false, paras: [], items: [], wordCount: 0, suppressed: [] };

  const suppressed = [];
  const paras = (section.paras || []).filter((p) => {
    if (!hasVerify(p)) return true;
    if (SHOW_VERIFY) return true;
    suppressed.push(...verifyLabels(p));
    return false;
  });

  const rawItems = section.items || [];
  const items = SHOW_VERIFY
    ? rawItems
    : rawItems.filter((it) => {
        const dirty = itemFields.some((f) => hasVerify(typeof it === "string" ? it : it?.[f]));
        if (dirty) suppressed.push(...itemFields.flatMap((f) => verifyLabels(typeof it === "string" ? it : it?.[f])));
        return !dirty;
      });

  const wordCount =
    paras.reduce((n, p) => n + words(p), 0) +
    items.reduce((n, it) => n + words(typeof it === "string" ? it : `${it?.label || ""} ${it?.text || ""}`), 0);

  // A heading with nothing under it is omitted along with its heading.
  const render = wordCount >= MIN_SECTION_WORDS;
  return { render, paras, items, wordCount, suppressed };
}
