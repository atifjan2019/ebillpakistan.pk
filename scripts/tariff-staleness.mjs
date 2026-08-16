// Fails (exit 1) when the tariff figures have not been re-checked against source
// within the allowed window. Run it in CI, or before a deploy, so a stale
// schedule surfaces as a build signal rather than as a wrong number on a page.
//
//     node scripts/tariff-staleness.mjs
//
// The site ALSO degrades on its own — every rate surface renders a visible
// notice once the window passes — so a missed run cannot silently ship a stale
// rate. This script is the early warning, not the safety net.
const { LAST_VERIFIED_AGAINST_SOURCE, STALE_AFTER_DAYS, tariffStaleness, ADJUSTMENTS, NEPRA_SOURCE } =
  await import("../lib/tariffs.js");

const { days, stale, checkedOn } = tariffStaleness();
const today = new Date().toISOString().slice(0, 10);

console.log(`\ntariff staleness check — ${today}`);
console.log(`  last verified against source : ${checkedOn} (${days} days ago)`);
console.log(`  allowed window               : ${STALE_AFTER_DAYS} days`);
console.log(`  governing notification       : ${NEPRA_SOURCE.name}`);

// Quarterly adjustments carry their own expiry, which lapses sooner than the
// base schedule and is the more common cause of a wrong figure.
const expired = ADJUSTMENTS.filter((a) => today > a.appliesTo);
const live = ADJUSTMENTS.filter((a) => today >= a.appliesFrom && today <= a.appliesTo);
console.log(`  adjustments live today       : ${live.length ? live.map((a) => a.sro).join(", ") : "none"}`);
if (expired.length) console.log(`  adjustments expired          : ${expired.map((a) => `${a.sro} (ended ${a.appliesTo})`).join(", ")}`);

if (stale) {
  console.error(
    `\nSTALE: figures are ${days - STALE_AFTER_DAYS} day(s) past the ${STALE_AFTER_DAYS}-day window.` +
      `\nRe-check against ${NEPRA_SOURCE.url}, then update LAST_VERIFIED_AGAINST_SOURCE in lib/tariffs.js.` +
      `\nThe site is already showing a staleness notice on every rate surface.\n`
  );
  process.exit(1);
}
if (!live.length) {
  console.warn(
    `\nWARNING: no quarterly adjustment is live today. If NEPRA has notified a new one,` +
      ` add it to ADJUSTMENTS in lib/tariffs.js — bills will carry it and ours will not explain it.\n`
  );
}
console.log(`\nOK — ${STALE_AFTER_DAYS - days} day(s) of the window remaining.\n`);
