// Server component (no client JS). Renders a tariff dataset from lib/tariffs.js.
//
// Layout: a semantic <table> above 640px, and the same rows as stacked cards
// below it, so nothing ever scrolls sideways on a phone.
//
// Where a company has no verified schedule of its own (AJK, which is billed by a
// government department rather than a NEPRA licensee), this renders the reason
// rather than borrowing the mainland figures.
import {
  ADJUSTMENTS, ADJUSTMENT_EXCLUDES, MINIMUM_CHARGE, SLAB_BENEFIT, fmtFixed, fmtRate, hasVerifiedRates,
} from "../lib/tariffs";
import { safe } from "../lib/verify";
import TariffStale from "./TariffStale";

const GROUPS = [
  ["Lifeline", "lifeline", "No fixed charge; a minimum monthly charge applies instead."],
  ["Protected", "protected", "Gets the benefit of one previous slab."],
  ["Unprotected", "unprotected", "Every unit is charged at the rate of the band reached."],
];

function Rows({ title, rows, note }) {
  return (
    <>
      <tr className="tariff-tier">
        <th colSpan={3}>
          {title} <span className="tariff-tier-note">{note}</span>
        </th>
      </tr>
      {rows.map(({ slab, rate, fixed }) => (
        <tr key={slab}>
          <td>{slab}</td>
          <td>{fmtRate(rate)}</td>
          <td>{fixed == null ? "—" : `${fmtFixed(fixed)}/month`}</td>
        </tr>
      ))}
    </>
  );
}

function Cards({ title, rows, note }) {
  return (
    <div className="tariff-cards-group">
      <h4>{title}</h4>
      <p className="tariff-cards-note">{note}</p>
      <ul>
        {rows.map(({ slab, rate, fixed }) => (
          <li key={slab}>
            <span className="tariff-card-slab">{slab}</span>
            <span className="tariff-card-rate">{fmtRate(rate)}</span>
            {fixed != null && <span className="tariff-card-fixed">+ {fmtFixed(fixed)}/month fixed</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TariffTable({ data, heading, compact = false }) {
  if (!data) return null;
  const { tiers, source, sourceUrl, htmlMirror, effectiveFrom, notification, note, lastVerified, tou, prepaid } = data;
  const priced = hasVerifiedRates(data);

  // No schedule of its own (AJK): say why, do not borrow another company's.
  if (!priced) {
    return (
      <figure className="tariff" role="group" aria-label={heading || "Electricity tariff"}>
        {heading && <figcaption className="tariff-heading">{heading}</figcaption>}
        <p className="tariff-pending" role="note">
          {note || "We have not verified a rate schedule for this supplier."} For the figures in
          force, see the{" "}
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer">official source</a>, and{" "}
          <a href="/editorial-policy">why we leave a rate blank</a> rather than estimate it.
        </p>
      </figure>
    );
  }

  if (compact) {
    const lo = tiers.protected[0];
    const hi = tiers.unprotected[tiers.unprotected.length - 1];
    const mid = tiers.unprotected[1];
    return (
      <div className="tariff-compact">
        <TariffStale />
        <p>
          Domestic rates run from <strong>{fmtRate(lo.rate)}</strong> (protected, first 100 units) to{" "}
          <strong>{fmtRate(hi.rate)}</strong> (unprotected, above 700), plus a fixed charge per
          kilowatt of sanctioned load. The band most households sit in, 101–200 units unprotected, is{" "}
          <strong>{fmtRate(mid.rate)}</strong>.
        </p>
        <p>
          Crucially, billing is <strong>not telescopic</strong>: an unprotected consumer pays the
          rate of the band their month reaches on <em>every</em> unit.{" "}
          <a href="/electricity-tariff">
            See the full schedule, fixed charges and the adjustment in force →
          </a>
        </p>
        <p className="tariff-compact-src">
          {source}, effective {effectiveFrom}. {safe(notification)}
        </p>
      </div>
    );
  }

  return (
    <figure className="tariff" role="group" aria-label={heading || "Electricity tariff"}>
      {heading && <figcaption className="tariff-heading">{heading}</figcaption>}
      <TariffStale />

      <table className="tariff-table">
        <thead>
          <tr>
            <th>Monthly usage band</th>
            <th>Rate per unit</th>
            <th>Fixed charge</th>
          </tr>
        </thead>
        <tbody>
          {GROUPS.map(([label, key, n]) => (
            <Rows key={key} title={label} rows={tiers[key]} note={n} />
          ))}
        </tbody>
      </table>

      <div className="tariff-cards">
        {GROUPS.map(([label, key, n]) => (
          <Cards key={key} title={label} rows={tiers[key]} note={n} />
        ))}
      </div>

      {compact ? (
        <p className="tariff-compact-note">
          Domestic billing is <strong>not telescopic</strong> — for unprotected consumers every unit
          is charged at the rate of the band the month reaches. That rule, the fixed-charge and
          minimum-charge mechanics, Time-of-Use and pre-paid rates, and the quarterly adjustment
          currently in force are all explained on our{" "}
          <a href="/electricity-tariff">Pakistan electricity tariff guide</a>.
        </p>
      ) : (
      <ul className="tariff-rules">
        <li>
          <strong>Not telescopic.</strong> {SLAB_BENEFIT.note} For everyone else, every unit is
          charged at the rate of the band the month reaches — which is why crossing a boundary can
          cost far more than the extra units.
        </li>
        <li>
          <strong>Fixed charges</strong> are per kilowatt of sanctioned load, per month. Where they
          apply, no minimum charge is added even if you use nothing. Where they do not (lifeline), a
          minimum monthly charge of Rs {MINIMUM_CHARGE.singlePhase} single-phase or Rs{" "}
          {MINIMUM_CHARGE.threePhase} three-phase applies instead.
        </li>
        {tou && (
          <li>
            <strong>5 kW and above</strong> is billed Time-of-Use: Rs {tou.peak.toFixed(2)}/unit peak,
            Rs {tou.offPeak.toFixed(2)}/unit off-peak, fixed Rs {tou.fixed}/kW/month on 50% of
            sanctioned load or MDI, whichever is higher.
          </li>
        )}
        {prepaid && (
          <li>
            <strong>Pre-paid residential</strong>: Rs {prepaid.rate.toFixed(2)}/unit, fixed Rs{" "}
            {prepaid.fixed}/kW/month.
          </li>
        )}
      </ul>
      )}

      {!compact && ADJUSTMENTS.length > 0 && (
        <div className="tariff-adj">
          <h4>Adjustments applied on top, for limited periods</h4>
          <ul>
            {ADJUSTMENTS.map((a) => (
              <li key={a.id}>
                <strong>
                  {a.perUnit < 0 ? "−" : "+"}Rs {Math.abs(a.perUnit).toFixed(4)}/unit
                </strong>{" "}
                — {a.label}, {a.monthsLabel}.{" "}
                <a href={a.url} target="_blank" rel="noopener noreferrer">{a.sro}</a>
              </li>
            ))}
          </ul>
          <p>Excludes {ADJUSTMENT_EXCLUDES.join(", ")}. These expire — check the window against your billing month.</p>
        </div>
      )}

      <div className="tariff-src">
        <p>
          <strong>Source:</strong>{" "}
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer">{source}</a>
          {htmlMirror && (
            <>
              {" "}(cross-checked against{" "}
              <a href={htmlMirror} target="_blank" rel="noopener noreferrer">IESCO&apos;s published tariff guide</a>)
            </>
          )}
        </p>
        {safe(notification) && <p><strong>Schedule:</strong> {safe(notification)}</p>}
        {effectiveFrom && <p><strong>Effective from:</strong> {effectiveFrom}</p>}
        {lastVerified && <p><strong>Checked by us:</strong> {lastVerified}</p>}
      </div>

      <p className="tariff-foot">
        FPA, duty, GST and the PTV fee are added on top —{" "}
        <a href="/sample-bill-explained">see a worked example</a>.
      </p>
    </figure>
  );
}
