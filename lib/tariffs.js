// Domestic tariff for the DISCO pages and the /result analysis.
//
// ─────────────────────────────────────────────────────────────────────────────
// GOVERNING NOTIFICATION
//
// S.R.O. 279(I)/2026, dated 12 February 2026, notifying NEPRA's decision of
// 11 February 2026. It is issued expressly "in modification of the earlier
// issued applicable notifications vide S.R.O. No's: 41(I)/2026 to 52(I)/2026 of
// dated the 13th January, 2026 in respect of XWDISCO's and K-Electric", so the
// January SROs are superseded for rates. The per-company SRO numbers below are
// still recorded because each remains that company's Schedule of Tariff.
//   https://nepra.org.pk/tariff/Tariff/Notifications/2026/02%20Feb/S.R.O.%20279(1)2026%20dated%2012-02-2026.pdf
//
// ─────────────────────────────────────────────────────────────────────────────
// PROVENANCE OF THE FIGURES
//
// S.R.O. 279 and SROs 41–52 are image-only scans, and the XWDISCO annex of the
// 11-02-2026 decision does not OCR reliably. The rates below come from a visual
// read of Annex-B-1, cross-checked two further independent ways that agree on
// every one of the fifteen numbers:
//   1. the coordinate-reconstructed text layer of Annex-C (K-Electric), which
//      does OCR cleanly and carries the same GoP applicable variable charges;
//   2. IESCO's independently typed HTML tariff guide, headed "Tariff Guide
//      S.R.O No. 279 (I)/2026" — https://www.iesco.com.pk/tariff-guide
//
// LESCO's own tariff page was rejected as a source: its latest entry is
// "W.E.F 26-07-2023" and is three years stale.
//
// Every rendered table prints the source, the SRO and the effective date.

// ---------------------------------------------------------------- structure

export const DOMESTIC_SLAB_BOUNDS = [100, 200, 300, 400, 500, 600, 700];

// The rates below expire. The base schedule changes whenever a new SRO is
// notified, and the quarterly adjustment lapses on a fixed date. Rather than let
// the site go quietly stale, this date drives a visible notice: once it is more
// than STALE_AFTER_DAYS old, every rate surface says so and points at the
// current notification. Update it when — and only when — you have re-read the
// figures against source. See /editorial-policy for the refresh procedure.
export const LAST_VERIFIED_AGAINST_SOURCE = "2026-08-16";
export const STALE_AFTER_DAYS = 90;

export function tariffStaleness(today) {
  const now = new Date(today || Date.now());
  const then = new Date(LAST_VERIFIED_AGAINST_SOURCE);
  const days = Math.floor((now - then) / 86400000);
  return {
    checkedOn: LAST_VERIFIED_AGAINST_SOURCE,
    days,
    stale: days > STALE_AFTER_DAYS,
    limit: STALE_AFTER_DAYS,
  };
}

export const NEPRA_SOURCE = {
  name: "S.R.O. 279(I)/2026 — NEPRA decision of 11 February 2026",
  url: "https://nepra.org.pk/tariff/Tariff/Notifications/2026/02%20Feb/S.R.O.%20279(1)2026%20dated%2012-02-2026.pdf",
  htmlMirror: "https://www.iesco.com.pk/tariff-guide",
  notifiedOn: "2026-02-12",
  effectiveFrom: "2026-02-12",
  supersedes: "S.R.O. 41(I)/2026 – 52(I)/2026 of 13 January 2026",
};

// Which Schedule of Tariff belongs to which company. Strictly alphabetical;
// read from each company's NEPRA tariff listing (HAZECO from the SRO itself,
// as its NEPRA page carries no 2026 entries).
export const SRO_BY_DISCO = {
  fesco: "S.R.O. 41(I)/2026",
  gepco: "S.R.O. 42(I)/2026",
  hazeco: "S.R.O. 43(I)/2026",
  hesco: "S.R.O. 44(I)/2026",
  iesco: "S.R.O. 45(I)/2026",
  lesco: "S.R.O. 46(I)/2026",
  mepco: "S.R.O. 47(I)/2026",
  pesco: "S.R.O. 48(I)/2026",
  qesco: "S.R.O. 49(I)/2026",
  sepco: "S.R.O. 50(I)/2026",
  tesco: "S.R.O. 51(I)/2026",
  // 52(I)/2026 is K-Electric, which this site does not cover.
};

// Consumer-category definitions.
//
// SOURCE: S.R.O. 1165(I)/2022, Ministry of Energy (Power Division), 25 July 2022,
// PART-II (Definitions and Conditions for supply of power specific to each
// consumer category), A-1 RESIDENTIAL, page 29 — amending S.R.O. 374(I)/2018.
// Still in force: identical PART-II text at page 69 of S.R.O. 1287(I)/2025 of
// 18 July 2025.
//
// WHY THIS TOOK SO LONG TO FIND: the definitions annex only appears when a FULL
// Schedule of Tariff is re-notified. Quarterly and rationalisation SROs — 279(I)/2026,
// 1285(I)/2025, 1286(I)/2025 — are rate tables and contain no PART-II at all, and
// the Consumer Service Manual covers pro-rata billing rather than eligibility.
// If you are ever hunting a definition, look in a full Schedule of Tariff.
export const CATEGORY_SOURCE = {
  sro: "S.R.O. 1165(I)/2022",
  dated: "2022-07-25",
  page: "PART-II, A-1 Residential, page 29",
  url: "https://nepra.org.pk/tariff/Tariff/Notifications/2022/July/S.R.O%201165%20(I)-2022%20dated%2025-07-2022.pdf",
  stillInForce: {
    sro: "S.R.O. 1287(I)/2025",
    dated: "2025-07-18",
    page: "page 69",
    url: "https://nepra.org.pk/tariff/Tariff/Notifications/2025/07%20Jul/SRO%201287%20(I)%202025%2018-07-2025.pdf",
  },
};

export const PROTECTED = {
  unitThreshold: 200,
  qualifyingMonths: 6,
  // The gazette's own words. Quote these rather than paraphrasing: "consistently
  // for the past 6 months" is a rolling look-back, and "consecutive" is our
  // gloss on it, not the legal term.
  definition:
    'Non-ToU residential consumers consuming ≤ 200 kWh per month consistently for the past 6 months.',
  // Confined to Non-ToU consumers. Under clauses 3 and 4 of the same A-1
  // section, any consumer with a sanctioned load of 5 kW or above must be given
  // ToU metering and billed on A-1(b) — so a 5 kW+ household can never be
  // protected, at any level of consumption.
  nonToUOnly: true,
  touThresholdKw: 5,
  touExclusionNote:
    "Protected status is confined to Non-ToU residential consumers. A sanctioned load of 5 kW or above requires Time-of-Use metering and A-1(b) billing, so such a household cannot be protected however little it uses.",
  // No primary source imposes a lock-out or penalty period for going over. What
  // follows from a rolling six-month test is that the six months behind you must
  // all be at or below the threshold again — that is an implication, not a
  // published rule, and must be presented as one.
  regainIsImplication: true,
  // CSM Revised 2025, clause 6.1.1.1(b). Verified separately.
  carryForwardRule:
    "Where a reading covers more than a calendar month, the units are pro-rated: if the pro-rated figure is at or below 200, that portion is charged at protected rates, the excess is carried into the next billing cycle, and protected status is retained for the month.",
  source: `${CATEGORY_SOURCE.sro} of 25 July 2022 (${CATEGORY_SOURCE.page})`,
  sourceUrl: CATEGORY_SOURCE.url,
  csmSource: "NEPRA Consumer Service Manual (Revised 2025), clause 6.1.1.1(b)",
  csmSourceUrl:
    "https://nepra.org.pk/Legislation/7-Manuals/2025/CONSUMER%20SERVICE%20MANUAL%20(CSM)%20REVISED%202025.pdf",
};

// Lifeline, from the same annex.
export const LIFELINE = {
  definition:
    'Residential consumers having a single-phase electric connection with a sanctioned load up to 1 kW. Lifeline consumers include residential Non-ToU consumers whose maximum of the last twelve months\u2019 and the current month\u2019s consumption is ≤ 100 units; two rates for ≤ 50 and ≤ 100 units continue to apply.',
  singlePhase: true,
  maxSanctionedLoadKw: 1,
  lookbackMonths: 12,
  unitCeiling: 100,
  // CSM 6.1.1.1(a) gives lifeline consumers the same pro-rata treatment at the
  // 50 and 100 unit thresholds.
  carryForwardRule:
    "The same pro-rata treatment applies at the 50 and 100 unit thresholds where a billing cycle runs beyond a calendar month (CSM Revised 2025, clause 6.1.1.1(a)).",
  source: PROTECTED.source,
  sourceUrl: CATEGORY_SOURCE.url,
};

// Anyone residential and Non-ToU who is not protected is unprotected.
export const UNPROTECTED_NOTE =
  'Residential Non-ToU consumers not falling under the protected category are categorised as "Un-protected".';

// Slab-benefit rule, from the notes printed under Annex-B-1:
//   "only protected residential consumers will be given the benefit of one
//    previous slab"
//   "residential life line consumer will not be given any slab benefit"
//
// Read together these mean domestic billing is NOT telescopic by default: a
// consumer is charged at the rate of the slab their consumption reaches, on all
// units, except that a protected consumer gets the immediately preceding slab
// charged at its own lower rate. This is why crossing a boundary can raise a
// bill far more than the extra units alone suggest, and it is what makes the
// saving estimate on /result worth showing.
export const SLAB_BENEFIT = {
  lifeline: 0, // no benefit
  protected: 1, // benefit of one previous slab
  unprotected: 0, // no benefit
  note: "Only protected residential consumers receive the benefit of one previous slab. Lifeline consumers receive none.",
};

// Minimum monthly customer charge — applies ONLY where fixed charges do not
// (i.e. lifeline). "For consumers where monthly Fixed charges are applicable, no
// minimum charges shall be applicable on such consumers, even if no energy
// consumed."
export const MINIMUM_CHARGE = { singlePhase: 75, threePhase: 150 };

// ------------------------------------------------------------------ price
// Tariff A-1, General Supply — Residential. GoP applicable variable charges.
// `fixed` is Rs/kW/month against sanctioned load; `rate` is Rs/kWh.

export const A1_BELOW_5KW = {
  lifeline: [
    { slab: "Up to 50 units", upTo: 50, rate: 3.95, fixed: null },
    { slab: "51–100 units", upTo: 100, rate: 7.74, fixed: null },
  ],
  protected: [
    { slab: "1–100 units", upTo: 100, rate: 10.54, fixed: 200 },
    { slab: "101–200 units", upTo: 200, rate: 13.01, fixed: 300 },
  ],
  unprotected: [
    { slab: "1–100 units", upTo: 100, rate: 22.44, fixed: 275 },
    { slab: "101–200 units", upTo: 200, rate: 28.91, fixed: 300 },
    { slab: "201–300 units", upTo: 300, rate: 33.10, fixed: 350 },
    { slab: "301–400 units", upTo: 400, rate: 36.46, fixed: 400 },
    { slab: "401–500 units", upTo: 500, rate: 38.95, fixed: 500 },
    { slab: "501–600 units", upTo: 600, rate: 40.22, fixed: 675 },
    { slab: "601–700 units", upTo: 700, rate: 41.85, fixed: 675 },
    { slab: "Above 700 units", upTo: null, rate: 47.20, fixed: 675 },
  ],
};

// Sanctioned load 5 kW and above, Time of Use. Fixed charges for ToU domestic
// consumers are based on 50% of sanctioned load or MDI, whichever is higher.
export const A1_TOU = { fixed: 675, peak: 46.85, offPeak: 34.53 };

export const A1_PREPAID = { fixed: 675, rate: 42.12 };

// ------------------------------------------------------- quarterly adjustments
// Temporary surcharges/rebates applied on top of the slab rate for a defined run
// of billing months. Modelled as DATED line items with an expiry rather than
// folded into the base rate: baking the current rebate into the slab rates would
// understate bills the moment it lapses.
//
// Both exclude lifeline consumers, incremental-consumption-package units and
// prepaid consumers.
export const ADJUSTMENTS = [
  {
    id: "qta-2q-fy2526",
    label: "2nd Quarter FY 2025-26 quarterly tariff adjustment",
    perUnit: +0.3504,
    appliesFrom: "2026-03-01",
    appliesTo: "2026-05-31",
    monthsLabel: "March–May 2026 billing months",
    sro: "S.R.O. 459(I)/2026",
    notifiedOn: "2026-03-06",
    url: "https://nepra.org.pk/tariff/Tariff/Notifications/2026/03%20Mar/SRO%20459%20XWDISCOs%202nd%20QTR%20FY%202025-26%2006-03-2026.PDF",
  },
  {
    id: "qta-1q-cy2026",
    label: "1st Quarter CY 2026 quarterly tariff adjustment",
    perUnit: -1.9857,
    appliesFrom: "2026-06-01",
    appliesTo: "2026-08-31",
    monthsLabel: "June–August 2026 billing months",
    sro: "S.R.O. 953(I)/2026",
    notifiedOn: "2026-06-08",
    url: "https://nepra.org.pk/tariff/Tariff/Notifications/2026/06%20June/SRO%20953(I)2026%20-%20Notification%20regarding%201st%20Quarter%20CY%202026%20XW-DISCOs%2008.06.2026.PDF",
  },
];

export const ADJUSTMENT_EXCLUDES = ["lifeline consumers", "incremental-consumption-package units", "prepaid consumers"];

// Which adjustments cover a given date. Pages are statically generated, so this
// is evaluated at build time — which is why every rendered adjustment also
// prints its own date window, so a stale page still reads truthfully.
export function adjustmentsOn(isoDate) {
  const d = String(isoDate).slice(0, 10);
  return ADJUSTMENTS.filter((a) => d >= a.appliesFrom && d <= a.appliesTo);
}

// ---------------------------------------------------------------- per company
// Mainland XWDISCOs bill on the same NEPRA-notified consumer-end tariff, so the
// bands are shared; each company still carries its own record so its own SRO is
// cited on its own page and a future divergence is expressible.
const XW = (key, company) => ({
  key,
  company,
  source: NEPRA_SOURCE.name,
  sourceUrl: NEPRA_SOURCE.url,
  htmlMirror: NEPRA_SOURCE.htmlMirror,
  effectiveFrom: NEPRA_SOURCE.effectiveFrom,
  notification: `${SRO_BY_DISCO[key]} (Schedule of Tariff), as modified by S.R.O. 279(I)/2026 of 12 February 2026`,
  lastVerified: "2026-08-16",
  tiers: A1_BELOW_5KW,
  tou: A1_TOU,
  prepaid: A1_PREPAID,
  note: null,
});

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
  // AJK is billed by a government department, not a NEPRA licensee, and its
  // tariff is notified separately. Mainland figures must never be shown as AJK's.
  ajk: {
    key: "ajk",
    company: "AJK Electricity Department",
    source: "AJK Electricity Department (billed through the PITC ajkbill system)",
    sourceUrl: "https://ajked.gok.pk/",
    effectiveFrom: null,
    notification:
      "{{VERIFY: the AJK Electricity Department tariff notification currently in force, and its date — AJK is not a NEPRA licensee and its schedule is issued separately}}",
    lastVerified: null,
    tiers: null,
    note: "AJK is supplied by a government department rather than a NEPRA-licensed distribution company, and its tariff is notified separately from the XWDISCO schedule. We do not reproduce mainland figures here.",
  },
};

export const tariffFor = (code) => TARIFFS[code] || null;

export const hasVerifiedRates = (t) =>
  !!t?.tiers && [...t.tiers.protected, ...t.tiers.unprotected].some((r) => r.rate != null);

// The category a consumption level falls in, absent an explicit tariff code.
export const categoryFor = (units) => (units <= PROTECTED.unitThreshold ? "protected" : "unprotected");

// The slab row a consumption level reaches within a category.
export function slabRowFor(units, category = "unprotected") {
  const rows = A1_BELOW_5KW[category];
  if (!rows || units == null) return null;
  return rows.find((r) => r.upTo === null || units <= r.upTo) || rows[rows.length - 1];
}

// Marginal per-unit rate at a consumption level.
export function marginalRateFor(code, units, category) {
  if (!TARIFFS[code]?.tiers || units == null) return null;
  const row = slabRowFor(units, category || categoryFor(units));
  return row?.rate ?? null;
}

// Energy charge for a consumption level, applying the slab-benefit rule above.
// Returns null rather than a guess when inputs are missing.
export function energyCharge(units, category = "unprotected") {
  const rows = A1_BELOW_5KW[category];
  if (!rows || units == null || units < 0) return null;
  const idx = rows.findIndex((r) => r.upTo === null || units <= r.upTo);
  if (idx < 0) return null;
  const benefit = SLAB_BENEFIT[category] ?? 0;

  // No benefit: every unit is charged at the rate of the slab reached.
  if (benefit === 0) return units * rows[idx].rate;

  // Benefit of one previous slab: the preceding slab's units are charged at the
  // preceding rate, the remainder at the rate of the slab reached.
  const prev = rows[idx - 1];
  if (!prev) return units * rows[idx].rate;
  const prevUnits = Math.min(units, prev.upTo);
  return prevUnits * prev.rate + (units - prevUnits) * rows[idx].rate;
}

// Back-compat for the two blog posts embedding <!-- tariff:KEY --> sentinels.
export const NEPRA_DOMESTIC = TARIFFS.lesco;
export const AJK_DOMESTIC = TARIFFS.ajk;
export const TARIFF_BY_KEY = { nepra: TARIFFS.lesco, ajk: TARIFFS.ajk };

export const fmtRate = (v) => (v == null ? null : `Rs ${v.toFixed(2)}/unit`);
export const fmtFixed = (v) => (v == null ? null : `Rs ${v}/kW`);
