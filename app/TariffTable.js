// Server component (no client JS). Renders a tariff dataset from lib/tariffs.js.
//
// The important behaviour: when no rate has been verified yet, this does NOT
// render a price column full of em-dashes. A grid of blanks reads as an
// abandoned page. Instead it presents the band STRUCTURE — which is real,
// stable information a reader can use — and points at the official schedule for
// the figures. When rates are filled in, the price column appears automatically.
//
// Layout: a semantic <table> above 640px, and the same rows as stacked cards
// below it, so nothing ever scrolls sideways on a phone.
import { fmtRate, hasVerifiedRates } from "../lib/tariffs";
import { safe } from "../lib/verify";

function Rows({ title, rows, priced }) {
  return (
    <>
      <tr className="tariff-tier">
        <th colSpan={priced ? 2 : 1}>{title}</th>
      </tr>
      {rows.map(({ slab, rate }) => (
        <tr key={slab}>
          <td>{slab}</td>
          {priced && <td>{fmtRate(rate)}</td>}
        </tr>
      ))}
    </>
  );
}

function Cards({ title, rows, priced }) {
  return (
    <div className="tariff-cards-group">
      <h4>{title}</h4>
      <ul>
        {rows.map(({ slab, rate }) => (
          <li key={slab}>
            <span className="tariff-card-slab">{slab}</span>
            {priced && <span className="tariff-card-rate">{fmtRate(rate)}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TariffTable({ data, heading }) {
  if (!data) return null;
  const { tiers, source, sourceUrl, effectiveFrom, notification, note, lastVerified } = data;
  const priced = hasVerifiedRates(data);

  const groups = [
    ["Protected domestic", tiers.protected],
    ["Unprotected domestic", tiers.unprotected],
  ];

  return (
    <figure className="tariff" role="group" aria-label={heading || "Electricity tariff bands"}>
      {heading && <figcaption className="tariff-heading">{heading}</figcaption>}

      {/* Task 2 de-duplication: the full explanation of why a band can be shown
          without a price lives once, in /editorial-policy. Repeating it here
          would put the same 60 words on all twelve DISCO pages. */}
      {!priced && (
        <p className="tariff-pending" role="note">
          Bands only — see the{" "}
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer">official NEPRA schedule</a>{" "}
          for rates, and <a href="/editorial-policy">why we leave them blank</a>.
        </p>
      )}

      {/* table for tablet/desktop */}
      <table className="tariff-table">
        <thead>
          <tr>
            <th>Monthly usage band</th>
            {priced && <th>Rate per unit</th>}
          </tr>
        </thead>
        <tbody>
          {groups.map(([t, rows]) => (
            <Rows key={t} title={t} rows={rows} priced={priced} />
          ))}
        </tbody>
      </table>

      {/* stacked cards for phones */}
      <div className="tariff-cards" aria-hidden="true">
        {groups.map(([t, rows]) => (
          <Cards key={t} title={t} rows={rows} priced={priced} />
        ))}
      </div>

      <div className="tariff-src">
        <p>
          <strong>Source:</strong>{" "}
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer">{source}</a>
        </p>
        {/* Whole row omitted when the notification is still a {{VERIFY}} —
            a "Notification:" label with nothing after it reads as broken. */}
        {safe(notification) && (
          <p><strong>Notification:</strong> {safe(notification)}</p>
        )}
        {effectiveFrom && (
          <p><strong>Effective from:</strong> {effectiveFrom}</p>
        )}
        <p>
          <strong>Rates checked by us:</strong>{" "}
          {lastVerified || <em>not yet — bands only, see the note above</em>}
        </p>
        {note && <p className="tariff-note">{note}</p>}
      </div>

      {/* One line, not a paragraph: the full explanation is on the sample bill. */}
      <p className="tariff-foot">
        FPA, adjustments and taxes are added on top —{" "}
        <a href="/sample-bill-explained">see a worked example</a>.
      </p>
    </figure>
  );
}
