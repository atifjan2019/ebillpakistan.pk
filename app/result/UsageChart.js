// Twelve months of units as a bar chart, drawn from the history the bill itself
// carries. Server component, plain SVG, no client JS. Renders nothing unless
// there are at least three months with units, so it never shows a chart of
// guesses.
import { PROTECTED } from "../../lib/tariffs";
import { fmtMoney } from "../../lib/billData";

const MON = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "SEP24", "Sep-2025", "2025-09", "09/2025" -> a sortable month index, or null.
function monthKey(label) {
  const s = String(label || "").trim().toLowerCase();
  let m = s.match(/([a-z]{3})[a-z]*[\s\-/.,]*'?(\d{4}|\d{2})\b/);
  if (m && MON[m[1]] !== undefined) {
    const y = m[2].length === 2 ? 2000 + Number(m[2]) : Number(m[2]);
    return y * 12 + MON[m[1]];
  }
  m = s.match(/\b(\d{4})[\-/.](\d{1,2})\b/);
  if (m && Number(m[2]) >= 1 && Number(m[2]) <= 12) return Number(m[1]) * 12 + Number(m[2]) - 1;
  m = s.match(/\b(\d{1,2})[\-/.](\d{4})\b/);
  if (m && Number(m[1]) >= 1 && Number(m[1]) <= 12) return Number(m[2]) * 12 + Number(m[1]) - 1;
  return null;
}

const shortLabel = (label, key) => (key != null ? `${SHORT[key % 12]} ${String(Math.floor(key / 12)).slice(2)}` : String(label || "").slice(0, 6));

export default function UsageChart({ bill }) {
  const raw = (bill?.history || []).filter((r) => r.units !== null && r.units >= 0);
  if (raw.length < 3) return null;

  let rows = raw.map((r) => ({ ...r, key: monthKey(r.month) }));
  // Sort oldest to newest when every month parsed; otherwise trust the order the
  // billing system gave, which is consistent within one bill.
  const sortable = rows.every((r) => r.key != null);
  if (sortable) rows = [...rows].sort((a, b) => a.key - b.key);
  rows = rows.slice(-12);

  const max = Math.max(...rows.map((r) => r.units), 1);
  const avg = Math.round(rows.reduce((s, r) => s + r.units, 0) / rows.length);
  const hi = rows.reduce((a, b) => (b.units > a.units ? b : a));
  const lo = rows.reduce((a, b) => (b.units < a.units ? b : a));
  const showLine = max >= PROTECTED.unitThreshold * 0.6 && max <= PROTECTED.unitThreshold * 4;
  const top = Math.max(max, showLine ? PROTECTED.unitThreshold : 0) * 1.12;

  const W = 720, H = 240, padL = 8, padR = 8, padT = 22, padB = 30;
  const slot = (W - padL - padR) / rows.length;
  const bw = Math.min(42, slot * 0.66);
  const y = (v) => padT + (H - padT - padB) * (1 - v / top);
  const lastSix = sortable ? rows.slice(-6) : null;
  const under = lastSix ? lastSix.filter((r) => r.units <= PROTECTED.unitThreshold).length : null;

  return (
    <section className="usage">
      <div className="usage-head">
        <h2>Your last {rows.length} months</h2>
        <p>Units billed each month, from the history printed on this bill.</p>
      </div>
      <div className="usage-chart">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Units billed over the last ${rows.length} months. Highest ${hi.units}, lowest ${lo.units}, average ${avg}.`}>
          {showLine && (
            <>
              <line x1={padL} x2={W - padR} y1={y(PROTECTED.unitThreshold)} y2={y(PROTECTED.unitThreshold)} className="usage-limit" />
            </>
          )}
          {rows.map((r, i) => {
            const x = padL + slot * i + (slot - bw) / 2;
            const over = showLine && r.units > PROTECTED.unitThreshold;
            const isLast = i === rows.length - 1;
            return (
              <g key={i}>
                <rect x={x} y={y(r.units)} width={bw} height={Math.max(2, H - padB - y(r.units))} rx="5" className={`usage-bar${over ? " usage-bar--over" : ""}${isLast ? " usage-bar--now" : ""}`}>
                  <title>{`${r.month || shortLabel(r.month, r.key)}: ${r.units} units${r.amount != null ? `, ${fmtMoney(r.amount)}` : ""}`}</title>
                </rect>
                <text x={x + bw / 2} y={y(r.units) - 5} textAnchor="middle" className="usage-val">{r.units}</text>
                <text x={x + bw / 2} y={H - 10} textAnchor="middle" className="usage-month">{shortLabel(r.month, r.key)}</text>
              </g>
            );
          })}
        </svg>
      </div>
      {showLine && (
        <p className="usage-legend">
          <span><i className="usage-key usage-key--line" /> {PROTECTED.unitThreshold} units, the protected consumer limit</span>
          <span><i className="usage-key usage-key--over" /> A month above it</span>
          <span><i className="usage-key usage-key--now" /> This bill is the darker bar on the right</span>
        </p>
      )}
      <div className="usage-stats">
        <div><span>Average</span><b>{avg} units</b></div>
        <div><span>Highest</span><b>{hi.units} units</b><small>{shortLabel(hi.month, hi.key)}</small></div>
        <div><span>Lowest</span><b>{lo.units} units</b><small>{shortLabel(lo.month, lo.key)}</small></div>
        {under != null && (
          <div><span>At or under {PROTECTED.unitThreshold} units</span><b>{under} of the last 6 months</b><small><a href="/protected-consumer-checker">What that means</a></small></div>
        )}
      </div>
      <p className="usage-foot">
        Want to know what is behind the high months? The <a href="/appliance-calculator">appliance calculator</a> adds up
        what each fan, AC and fridge uses, and the <a href="/bill-calculator">bill calculator</a> shows what any number of units costs.
      </p>
    </section>
  );
}
