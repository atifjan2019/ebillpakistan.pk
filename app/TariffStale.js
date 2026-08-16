// Visible staleness notice for any surface showing a rate.
//
// Rendered only when the figures have not been re-checked against source within
// STALE_AFTER_DAYS. The site degrading loudly is better than it degrading
// silently: a stale rate on a page people budget against is the exact harm the
// sourcing rules exist to prevent.
import { NEPRA_SOURCE, tariffStaleness } from "../lib/tariffs";

export default function TariffStale() {
  const { stale, checkedOn, days } = tariffStaleness();
  if (!stale) return null;
  return (
    <p className="tariff-stale" role="note">
      <strong>These figures may be out of date.</strong> They were last checked against source on{" "}
      {checkedOn}, {days} days ago. Confirm against the current notification on{" "}
      <a href={NEPRA_SOURCE.url} target="_blank" rel="noopener noreferrer">NEPRA</a> before relying
      on them, and <a href="/contact">tell us</a> if they have changed.
    </p>
  );
}
