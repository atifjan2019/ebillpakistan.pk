// The analysis the official portal does not give you.
//
// Each block renders only when lib/billAnalysis.js returned a non-null result,
// which happens only when the parsed bill actually contained the inputs. A
// missing field means a hidden module, never an invented number.
import { fmtMoney, fmtUnits } from "../../lib/billData";
import Verify from "../Verify";

const Card = ({ title, tone = "", children }) => (
  <section className={`an-card ${tone ? `an-card--${tone}` : ""}`}>
    <h3>{title}</h3>
    {children}
  </section>
);

export default function BillAnalysis({
  slab, mom, breakdown, largest, protectedInfo, saving, effective, anomaly, adjustments, discoAbbr,
}) {
  const any = slab || mom || breakdown || protectedInfo || saving || effective || anomaly;
  if (!any) return null;

  return (
    <div className="analysis">
      <div className="analysis-head">
        <h2>What this bill is telling you</h2>
        <p>
          Worked out from the figures on this bill only. Anything we could not read from it is left
          out rather than estimated.
        </p>
      </div>

      <div className="an-grid">
        {slab && (
          <Card title="Your tariff slab">
            <p>
              This month&apos;s <b>{fmtUnits(slab.unitsIntoSlab + slab.lower - 1)}</b> put you in the{" "}
              <b>{slab.label}</b> band.
            </p>
            {slab.isTop ? (
              <p className="an-note">This is the highest domestic band, so there is no boundary above you.</p>
            ) : (
              <p className="an-note">
                You are <b>{slab.unitsToNext} units</b> below the top of this band
                {slab.nextBoundary ? <> ({slab.nextBoundary} units)</> : null}. Crossing it moves the
                units above the line onto a higher rate — which is why a small rise in usage can
                produce a disproportionate rise in the bill.
              </p>
            )}
          </Card>
        )}

        {mom && (
          <Card title="Compared with last month" tone={mom.unitsDelta > 0 ? "warn" : "good"}>
            <p className="an-big">
              {mom.unitsDelta > 0 ? "▲" : "▼"} {Math.abs(mom.unitsPct)}%
              <span> units {mom.unitsDelta > 0 ? "more" : "less"}</span>
            </p>
            <p>{mom.read}</p>
            <p className="an-note">
              {mom.prevMonth ? `${mom.prevMonth}: ` : "Previous month: "}
              {fmtUnits(mom.prevUnits)}
              {mom.prevAmount !== null && <> · {fmtMoney(mom.prevAmount)}</>}
            </p>
          </Card>
        )}

        {protectedInfo && (
          <Card
            title="Protected consumer status"
            tone={protectedInfo.atRisk ? "warn" : protectedInfo.declared ? "good" : ""}
          >
            {protectedInfo.declared === true && (
              <p>
                Your tariff code says you are a <b>protected</b> consumer, which means a
                materially lower rate per unit.
              </p>
            )}
            {protectedInfo.declared === false && (
              <p>
                Your tariff code says you are an <b>unprotected</b> consumer, so the standard
                domestic schedule applies.
              </p>
            )}
            {protectedInfo.declared === null && protectedInfo.units !== null && (
              <p>
                This bill does not state a protected/unprotected code we can read. On this
                month&apos;s <b>{fmtUnits(protectedInfo.units)}</b> alone you are{" "}
                {protectedInfo.overThreshold ? "above" : "at or below"} the{" "}
                {protectedInfo.threshold}-unit threshold — though status is assessed over a run of
                billing cycles rather than a single month.
              </p>
            )}
            {protectedInfo.atRisk && (
              <p className="an-alert">
                You are only <b>{protectedInfo.marginToThreshold} units</b> below the{" "}
                {protectedInfo.threshold}-unit threshold. Going over it can cost you protected
                status, and the lower rate that comes with it, from the next billing cycle.
              </p>
            )}
            {protectedInfo.carryForwardRule && (
              <p className="an-note">{protectedInfo.carryForwardRule}</p>
            )}
            <p className="an-note">
              <Verify text={protectedInfo.qualifyingNote || ""} />
            </p>
          </Card>
        )}

        {effective && (
          <Card title="What you actually paid per unit">
            <p className="an-big">Rs {effective.allIn}<span> per unit, all in</span></p>
            <p>
              That is the whole bill divided by the units used — the number that actually matters,
              rather than the headline slab rate.
              {effective.energyOnly !== null && (
                <> The energy charge alone works out at Rs {effective.energyOnly} per unit; the rest
                is adjustments, fixed charges and tax.</>
              )}
            </p>
          </Card>
        )}

        {anomaly && (
          <Card title="Is this bill unusual?" tone={anomaly.verdict === "high" ? "warn" : anomaly.verdict === "low" ? "" : "good"}>
            <p className="an-big">
              {anomaly.verdict === "normal" ? "Looks normal" : anomaly.verdict === "high" ? "Higher than usual" : "Lower than usual"}
            </p>
            <p>{anomaly.note}</p>
            <p className="an-note">
              Your last {anomaly.months} months ranged from {anomaly.min} to {anomaly.max} units,
              averaging {anomaly.mean}. This month: {anomaly.units}.
            </p>
          </Card>
        )}

        {saving && (
          <Card title="If you dropped below the boundary" tone="good">
            <p className="an-big">
              {fmtMoney(saving.estimate)}<span>estimated saving on the energy charge</span>
            </p>
            <p>
              Cutting <b>{saving.unitsToDrop} units</b> would bring you to {saving.targetUnits} units,
              under the band boundary.
              {saving.repricesWholeMonth ? (
                <>
                  {" "}Domestic bills are not telescopic: every unit is charged at the rate of the
                  band you reach, so crossing back down reprices the <b>whole month</b> — the energy
                  charge falls from about {fmtMoney(saving.currentCharge)} to{" "}
                  {fmtMoney(saving.targetCharge)}, not just the {saving.unitsToDrop} units you saved.
                </>
              ) : (
                <>
                  {" "}As a protected consumer you keep the benefit of one previous slab, so the
                  energy charge falls from about {fmtMoney(saving.currentCharge)} to{" "}
                  {fmtMoney(saving.targetCharge)}.
                </>
              )}
            </p>
            <p className="an-note">
              Energy charge only, before tax — GST and duty are calculated on it, so the real saving
              is larger. Rates from S.R.O. 279(I)/2026.
            </p>
          </Card>
        )}

        {adjustments?.length > 0 && (
          <Card title="A tariff adjustment is live on this bill" tone={adjustments.some((a) => a.perUnit < 0) ? "good" : "warn"}>
            {adjustments.map((a) => (
              <p key={a.id}>
                <b>{a.perUnit < 0 ? "Rebate" : "Surcharge"} of Rs {Math.abs(a.perUnit).toFixed(4)}/unit</b>{" "}
                — {a.label}, applied to {a.monthsLabel} only.{" "}
                <a href={a.url} target="_blank" rel="noopener noreferrer">{a.sro}</a>.
              </p>
            ))}
            <p className="an-note">
              Applied per unit on top of the slab rate, and it expires: a bill after that window will
              not carry it. Lifeline and prepaid consumers are excluded.
            </p>
          </Card>
        )}
      </div>

      {breakdown && (
        <section className="an-breakdown">
          <h3>Every charge on this bill, explained</h3>
          <ul className="an-lines">
            {breakdown.map((l) => (
              <li key={l.id} className={`an-line an-line--${l.kind}`}>
                <div className="an-line-top">
                  <a href={l.guide}>{l.label}</a>
                  <span className="an-line-amt">
                    {fmtMoney(l.amount)}
                    {l.share !== null && <em>{l.share}%</em>}
                  </span>
                </div>
                {l.share !== null && (
                  <div className="an-bar" aria-hidden="true">
                    <span style={{ width: `${Math.min(100, Math.max(1, l.share))}%` }} />
                  </div>
                )}
              </li>
            ))}
          </ul>
          {largest && (
            <p className="an-largest">
              The biggest single addition to your energy charge this month is{" "}
              <b>{largest.label}</b> at {fmtMoney(largest.amount)}
              {largest.share !== null && <> ({largest.share}% of the bill)</>}.{" "}
              <a href={largest.guide}>Read what it is and whether you can do anything about it →</a>
            </p>
          )}
        </section>
      )}

      <p className="an-foot">
        {discoAbbr} sets none of these rates — they are notified by NEPRA and applied to every
        distribution company. If the <b>units</b> look wrong rather than the charges, that is a
        meter-reading question for {discoAbbr}: see{" "}
        <a href={`/${discoAbbr.toLowerCase()}-bill-check#complaints`}>their complaint channels</a>.
      </p>
    </div>
  );
}
