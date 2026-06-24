// Tariff SCHEMA ONLY — every per-unit rate is `null` until a human verifies it
// against an official source. Nothing here is rendered as a real number while it
// is null; <TariffTable> shows "—" and a "pending verification" notice instead.
// This captures unit-price search intent ("hesco unit price", "azad kashmir
// electricity unit price") WITHOUT publishing unverified figures on a billing
// (YMYL) page. To fill/maintain the numbers, see lib/TARIFFS_README.md.

// Format a per-unit rate: "—" until a verified number is filled in.
export const fmtRate = (v) => (v == null ? "—" : `Rs ${v}/unit`);

// Shared domestic slab structure (labels only; rates filled per-source below).
const slabs = (extra = []) => ({
  lifeline: [
    { slab: "Up to 50 units", rate: null },   // TODO: verify from source
    { slab: "51–100 units", rate: null },     // TODO: verify from source
  ],
  protected: [
    { slab: "1–100 units", rate: null },      // TODO: verify from source
    { slab: "101–200 units", rate: null },    // TODO: verify from source
  ],
  unprotected: [
    { slab: "1–100 units", rate: null },      // TODO: verify from source
    { slab: "101–200 units", rate: null },    // TODO: verify from source
    { slab: "201–300 units", rate: null },    // TODO: verify from source
    { slab: "301–400 units", rate: null },    // TODO: verify from source
    { slab: "401–500 units", rate: null },    // TODO: verify from source
    { slab: "501–600 units", rate: null },    // TODO: verify from source
    { slab: "601–700 units", rate: null },    // TODO: verify from source
    { slab: "Above 700 units", rate: null },  // TODO: verify from source
    ...extra,
  ],
});

const surcharges = () => ({
  fpa: null,            // TODO: monthly Fuel Price Adjustment (Rs/unit) — varies by company/month
  quarterlyAdj: null,   // TODO: quarterly tariff adjustment (Rs/unit)
  electricityDuty: null,// TODO: electricity duty (% of variable charge)
  gstPercent: null,     // TODO: GST (%)
  tvFee: null,          // TODO: PTV licence fee (Rs/month)
  financingCost: null,  // TODO: financing-cost surcharge (Rs/unit)
});

// Mainland XW-DISCOs (LESCO, IESCO, MEPCO, FESCO, GEPCO, HESCO, PESCO, QESCO,
// SEPCO, TESCO, HAZECO) bill on NEPRA's uniform consumer-end tariff.
export const NEPRA_DOMESTIC = {
  key: "nepra",
  source: "NEPRA — uniform XW-DISCO consumer-end tariff",
  sourceUrl: "https://www.nepra.org.pk/tariff/tariff.php",
  lastVerified: null, // TODO: set "YYYY-MM-DD" once rates are filled from NEPRA
  tiers: slabs(),
  surcharges: surcharges(),
};

// AJK is billed through the AJK Electricity Department (via PITC's ajkbill
// system) and its tariff is NOT guaranteed identical to the NEPRA XW-DISCO
// uniform schedule. It therefore keeps its OWN source + lastVerified so AJK rates
// are never presented as equal to mainland DISCO rates.
export const AJK_DOMESTIC = {
  key: "ajk",
  source: "AJK Electricity Department (billed via PITC ajkbill)",
  sourceUrl: "https://bill.pitc.com.pk/ajkbill",
  lastVerified: null, // TODO: set "YYYY-MM-DD" once rates are filled from the AJK source
  tiers: slabs(),
  surcharges: surcharges(),
};

// Sentinel key -> tariff dataset, for the blog content renderer.
export const TARIFF_BY_KEY = { nepra: NEPRA_DOMESTIC, ajk: AJK_DOMESTIC };
