// Renders text that may contain {{VERIFY: ...}} placeholders.
//
//   development — each marker is highlighted, so the gap is impossible to miss.
//   production  — a marked string renders NOTHING. Callers are expected to have
//                 already dropped the surrounding block via lib/verify.js
//                 (safe / safeList / resolveSection); this is the backstop that
//                 guarantees braces cannot reach the DOM even if one is missed.
//
// grep the repo for "{{VERIFY:" or run `node scripts/verify-report.mjs`.
import { SHOW_VERIFY, hasVerify } from "../lib/verify";

export { hasVerify };

const RE = /\{\{VERIFY:\s*([^}]+)\}\}/g;

export default function Verify({ text, children }) {
  const src = String(text ?? children ?? "");
  if (!hasVerify(src)) return <>{src}</>;
  // Production backstop: never emit the marker, in any form.
  if (!SHOW_VERIFY) return null;

  const out = [];
  let last = 0;
  let m;
  let i = 0;
  RE.lastIndex = 0;
  while ((m = RE.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    out.push(
      <mark key={`v${i++}`} className="verify-mark" title="Unresolved placeholder — fill this in before deploying">
        {m[1].trim()}
      </mark>
    );
    last = m.index + m[0].length;
  }
  if (last < src.length) out.push(src.slice(last));
  return <>{out}</>;
}
