// Domestic tariff structure for the DISCO pages and the /result analysis.
//
// TWO KINDS OF FACT LIVE HERE, AND THEY ARE TREATED DIFFERENTLY:
//
//  1. STRUCTURE — the slab bands (1–100, 101–200, …), the protected/unprotected
//     split, which charges exist. This is stable, is defined by the tariff
//     itself rather than by its price, and is safe to publish. It is what makes
//     the /result slab analysis work today.
//
//  2. PRICE — the rupees-per-unit in each band. Volatile, revised by NEPRA
//     several times a year, and actively harmful to get wrong on a page people
//     budget against. Every rate stays `null` until a human has read it off the
//     notification, and <TariffTable> renders the band structure WITHOUT a price
//     column rather than a column of em-dashes.
//
// SOURCE DOCUMENTS (verified present on nepra.org.pk on 16 August 2026):
//   • S.R.O. 41(I)/2026 – 52(I)/2026, dated 13 January 2026 — the notified
//     Schedules of Tariff, one per XWDISCO. These are SCANNED PDFs with no text
//     layer, so the per-band figures cannot be extracted programmatically and
//     must be read by eye.
//     https://nepra.org.pk/tariff/Tariff/Notifications/2026/01%20Jan/
//   • S.R.O. 459(I)/2026, dated 6 March 2026 — 2nd quarterly adjustment,
//     FY 2025-26.
//   • S.R.O. 953(I)/2026, dated June 2026 — 1st quarterly adjustment, CY 2026.
//   • TRF-100 XWDISCOS FCA JUN 2026, dated 7 August 2026 — monthly fuel charges
//     adjustment (the FPA line on a bill).
//     https://nepra.org.pk/tariff/Distribution%20XWDISCOs.php
//
// TO FILL IN THE RATES: open the SRO for the company, find the A-1 Residential
// table, and replace each `rate: null` below. Set `lastVerified` when you do.

// ---------------------------------------------------------------- structure

// Upper bound of each domestic slab, in units. Structural: these boundaries
// define the bands and are used by the /result slab analysis.
export const DOMESTIC_SLAB_BOUNDS = [100, 200, 300, 400, 500, 600, 700];

// Protected-consumer rule. The 200-unit threshold is the long-standing NEPRA
// boundary and is printed on bills via the tariff code (A-1P vs A-1); the
// qualifying period has changed more than once, so it is not asserted here.
export const PROTECTED = {
  unitThreshold: 200,
  qualifyingMonths: null, // see qualifyingNote
  qualifyingNote:
    "{{VERIFY: number of consecutive months at or below 200 units required to hold protected status under the current NEPRA determination, and whether an air-conditioner or a sanctioned load above 5 kW disqualifies}}",
  source: "NEPRA notified Schedule of Tariff (A-1 Residential)",
  sourceUrl: "https://nepra.org.pk/tariff/Distribution%20XWDISCOs.php",
};

export const NEPRA_SOURCE = {
  name: "NEPRA notified Schedule of Tariff, S.R.O. 41(I)/2026 – 52(I)/2026",
  url: "https://nepra.org.pk/tariff/Distribution%20XWDISCOs.php",
  notifiedOn: "2026-01-13",
  note: "One SRO per XWDISCO. Quarterly adjustments (S.R.O. 459 of 6 March 2026, S.R.O. 953 of June 2026) and the monthly fuel charges adjustment are applied on top.",
};

// ------------------------------------------------------------------ price

const band = (slab) => ({ slab, rate: null });

const domesticBands = () => ({
  protected: [band("1–100 units"), band("101–200 units")],
  unprotected: [
    band("1–100 units"), band("101–200 units"), band("201–300 units"),
    band("301–400 units"), band("401–500 units"), band("501–600 units"),
    band("601–700 units"), band("Above 700 units"),
  ],
});

// A tariff dataset for one company. `effectiveFrom` and `source` are required on
// every entry so a rendered table is always auditable back to a document.
const dataset = ({ key, company, source, sourceUrl, effectiveFrom, notification, note }) => ({
  key,
  company,
  source,
  sourceUrl,
  effectiveFrom,
  notification,
  note: note || null,
  lastVerified: null, // set to "YYYY-MM-DD" when the rates below are filled in
  tiers: domesticBands(),
});

const XW = (key, company) =>
  dataset({
    key,
    company,
    source: NEPRA_SOURCE.name,
    sourceUrl: NEPRA_SOURCE.url,
    effectiveFrom: NEPRA_SOURCE.notifiedOn,
    notification: "S.R.O. {{VERIFY: which of S.R.O. 41–52 (I)/2026 is this company's Schedule of Tariff}} dated 13 January 2026",
  });

// Mainland XW-DISCOs bill on NEPRA's uniform consumer-end tariff, so the bands
// match; each still carries its own record so a future divergence is expressible
// and so every page cites the document that actually applies to it.
export const TARIFFS = {
  lesco: XW("lesco", "Lahore Electric Supply Company"),
  iesco: XW("iesco", "Islamabad Electric Supply Company"),
  mepco: XW("mepco", "Multan Electric Power Company"),
  fesco: XW("fesco", "Faisalabad Electric Supply Company"),
  gepco: XW("gepco", "Gujranwala Electric Power Company"),
  hesco: XW("hesco", "Hyderabad Electric Supply Company"),
  pesco: XW("pesco", "Peshawar Electric Supply Company"),
  qesco: XW("qesco", "Quetta Electric Supply Company"),
  sepco: XW("sepco", "Sukkur Electric Power Company"),
  tesco: XW("tesco", "Tribal Areas Electric Supply Company"),
  hazeco: XW("hazeco", "Hazara Electric Supply Company"),
  // AJK is billed by a provincial department, not an XWDISCO, and its schedule
  // is issued separately — never present mainland figures as AJK's.
  ajk: dataset({
    key: "ajk",
    company: "AJK Electricity Department",
    source: "AJK Electricity Department (billed through the PITC ajkbill system)",
    sourceUrl: "https://bill.pitc.com.pk/ajkbill",
    effectiveFrom: null,
    notification:
      "{{VERIFY: the AJK Electricity Department tariff notification currently in force, and its date}}",
    note: "AJK tariffs are notified separately from the NEPRA uniform XWDISCO schedule and are not guaranteed to match it.",
  }),
};

export const tariffFor = (code) => TARIFFS[code] || null;

// True once at least one band has a real number in it.
export const hasVerifiedRates = (t) =>
  !!t && [...t.tiers.protected, ...t.tiers.unprotected].some((r) => r.rate !== null);

// Marginal per-unit rate for a consumption level. Returns null while rates are
// unverified, which is what keeps the /result saving estimate hidden.
export function marginalRateFor(code, units) {
  const t = TARIFFS[code];
  if (!t || units === null || units === undefined) return null;
  const rows = units <= PROTECTED.unitThreshold ? t.tiers.protected : t.tiers.unprotected;
  let lower = 0;
  for (let i = 0; i < DOMESTIC_SLAB_BOUNDS.length; i++) {
    const b = DOMESTIC_SLAB_BOUNDS[i];
    if (units <= b) return rows[i]?.rate ?? null;
    lower = b;
  }
  return rows[rows.length - 1]?.rate ?? null;
}

// Back-compat for the two blog posts that embed <!-- tariff:KEY --> sentinels.
export const NEPRA_DOMESTIC = TARIFFS.lesco;
export const AJK_DOMESTIC = TARIFFS.ajk;
export const TARIFF_BY_KEY = { nepra: TARIFFS.lesco, ajk: TARIFFS.ajk };

export const fmtRate = (v) => (v == null ? null : `Rs ${v}/unit`);
