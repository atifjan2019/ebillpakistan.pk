// Renders text that may contain {{VERIFY: ...}} placeholders, highlighting each
// one so an unresolved placeholder is impossible to miss during review (and easy
// to spot in a screenshot). Once every placeholder is filled in, this component
// renders plain text and can stay where it is.
//
// grep the repo for "{{VERIFY:" to list everything still outstanding.
const RE = /\{\{VERIFY:\s*([^}]+)\}\}/g;

export function hasVerify(text) {
  return /\{\{VERIFY:/.test(String(text ?? ""));
}

export default function Verify({ text, children }) {
  const src = String(text ?? children ?? "");
  if (!hasVerify(src)) return <>{src}</>;

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
