// Server component (no client JS). Renders a tariff dataset from lib/tariffs.js.
// While rates are null it shows "—" and a clear "pending verification" notice,
// and it ALWAYS prints a visible "Rates last updated … — source: …" line so the
// page never implies figures are current/official when they are not.
import { fmtRate } from "../lib/tariffs";

function Tier({ title, rows }) {
  return (
    <>
      <tr className="tariff-tier"><th colSpan={2}>{title}</th></tr>
      {rows.map(({ slab, rate }) => (
        <tr key={slab}>
          <td>{slab}</td>
          <td>{fmtRate(rate)}</td>
        </tr>
      ))}
    </>
  );
}

export default function TariffTable({ data, heading }) {
  const { tiers, source, sourceUrl, lastVerified } = data;
  const anyVerified = [
    ...tiers.lifeline, ...tiers.protected, ...tiers.unprotected,
  ].some((r) => r.rate != null);

  return (
    <figure className="tariff" role="group" aria-label={heading || "Electricity tariff"}>
      {heading && <figcaption className="tariff-heading">{heading}</figcaption>}

      <p className="tariff-updated">
        Rates last updated: <strong>{lastVerified || "pending verification"}</strong>
        {" — source: "}
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer">{source}</a>
      </p>

      {!anyVerified && (
        <p className="tariff-pending" role="note">
          We're verifying the latest approved rates from the official source; the
          per-unit figures will appear here once confirmed. In the meantime, check
          the {" "}
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer">official tariff schedule</a>.
        </p>
      )}

      <table className="tariff-table">
        <thead><tr><th>Monthly usage</th><th>Approx. rate / unit</th></tr></thead>
        <tbody>
          <Tier title="Lifeline domestic" rows={tiers.lifeline} />
          <Tier title="Protected domestic" rows={tiers.protected} />
          <Tier title="Unprotected domestic" rows={tiers.unprotected} />
        </tbody>
      </table>

      <p className="tariff-foot">
        A fuel price adjustment (FPA), quarterly adjustments, electricity duty, GST,
        a TV licence fee and other taxes are added on top of the per-unit energy
        charge, so the effective rate changes month to month.
      </p>
    </figure>
  );
}
