// "This month on your bill": the fuel cost adjustment and quarterly adjustment
// in force, as a compact card. Server component; the figures come from
// lib/adjustments.js with any admin override merged in by the page.
import { monthLabel } from "../lib/adjustments";

const rs = (n) => `${n < 0 ? "−" : "+"}Rs ${Math.abs(n).toFixed(4)}`;

export default function ThisMonthBox({ adj, abbr, compact = false }) {
  if (!adj) return null;
  const { fca, qta, perUnit } = adj;
  const month = monthLabel(fca?.isCurrent ? fca.billingMonth : null) || monthLabel(new Date().toISOString().slice(0, 7));
  return (
    <aside className={`tm-box${compact ? " tm-box--compact" : ""}`} aria-label="This month's bill adjustments">
      <div className="tm-head">
        <span className="tm-kicker">This month on {abbr ? `your ${abbr} bill` : "your bill"}</span>
        <span className="tm-month">{month}</span>
      </div>
      <div className="tm-grid">
        <div className="tm-item">
          <span className="tm-k">Fuel cost adjustment</span>
          {fca ? (
            <>
              <span className={`tm-v ${fca.perUnit < 0 ? "tm-v--down" : ""}`}>{rs(fca.perUnit)} <small>per unit</small></span>
              <span className="tm-n">
                {fca.isCurrent ? `On ${monthLabel(fca.billingMonth)} bills` : `Last decided: ${monthLabel(fca.billingMonth)} bills`}
                {fca.consumptionMonth ? `, for ${monthLabel(fca.consumptionMonth)} units` : ""}
              </span>
            </>
          ) : (
            <span className="tm-v tm-v--none">Not yet announced</span>
          )}
        </div>
        <div className="tm-item">
          <span className="tm-k">Quarterly adjustment</span>
          {qta ? (
            <>
              <span className={`tm-v ${qta.perUnit < 0 ? "tm-v--down" : ""}`}>{rs(qta.perUnit)} <small>per unit</small></span>
              <span className="tm-n">{qta.monthsLabel}</span>
            </>
          ) : (
            <span className="tm-v tm-v--none">None in force</span>
          )}
        </div>
        <div className="tm-item tm-item--total">
          <span className="tm-k">Together, on 300 units</span>
          <span className="tm-v">{perUnit < 0 ? "−" : "+"}Rs {Math.abs(perUnit * 300).toFixed(0)}</span>
          <span className="tm-n">{rs(perUnit)} per unit, before taxes</span>
        </div>
      </div>
      <p className="tm-foot">
        Lifeline and prepaid consumers are exempt. <a href="/this-month">How these are set, and past months</a> ·{" "}
        <a href="/bill-calculator">Estimate your bill</a>
      </p>
    </aside>
  );
}
