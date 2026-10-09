// The per-unit adjustments that sit on top of the slab rate: the monthly fuel
// cost adjustment (FCA, printed on bills as FPA) and the quarterly tariff
// adjustment (QTA, in lib/tariffs.js ADJUSTMENTS). Pure data plus helpers, safe
// to import on the client.
//
// SOURCING: every entry carries the page it was read from. NEPRA's own PDFs are
// image scans that do not OCR, so the national press reports of each decision
// are cited alongside NEPRA's notice. Figures are quoted exactly as reported.
//
// To add a month: append an entry to MONTHLY_FCA with its sources, bump
// FCA_UPDATED, and the company pages, the tracker page and the calculator all
// pick it up. The admin Settings tab can also override the current month
// without a deploy (see currentFca()).
import { ADJUSTMENTS, adjustmentsOn } from "./tariffs";

export const FCA_UPDATED = "2026-10-09";

export const FCA_EXCLUDES = ["lifeline consumers", "electric vehicle charging stations", "prepaid consumers on the prepaid tariff"];

// Newest first. billingMonth is when it appears on the bill; consumptionMonth
// is the month of units it was calculated on (two months earlier).
export const MONTHLY_FCA = [
  {
    billingMonth: "2026-10",
    consumptionMonth: "2026-08",
    perUnit: 1.1086,
    referenceCost: 7.0998,
    actualCost: 8.2084,
    totalBn: 16,
    decidedOn: "2026-10-07",
    notifiedOn: "2026-10-08",
    appliesToKe: true,
    excludes: FCA_EXCLUDES,
    sources: [
      { title: "Dawn, 8 October 2026: Nepra notifies consumers of Rs1.11 per unit higher fuel costs in Oct billing", url: "https://www.dawn.com/news/2035673/nepra-notifies-consumers-of-rs111-per-unit-higher-fuel-costs-in-oct-billing" },
      { title: "The Express Tribune, 8 October 2026: NEPRA allows Rs1.11 per unit fuel adjustment in October billing", url: "https://tribune.com.pk/story/2633704/nepra-allows-rs111-per-unit-fuel-adjustment-in-october-billing" },
    ],
  },
  {
    billingMonth: "2026-09",
    consumptionMonth: "2026-07",
    perUnit: 2.0581,
    referenceCost: null,
    actualCost: null,
    totalBn: 33,
    decidedOn: null,
    notifiedOn: null,
    appliesToKe: true,
    excludes: FCA_EXCLUDES,
    sources: [
      { title: "Dawn, September 2026: Nepra raises electricity costs by Rs2.58 per unit", url: "https://www.dawn.com/news/2027627/nepra-raises-electricity-costs-by-rs258-per-unit" },
    ],
  },
  {
    billingMonth: "2026-08",
    consumptionMonth: "2026-06",
    perUnit: 0.75,
    referenceCost: 7.71,
    actualCost: 8.91,
    totalBn: null,
    decidedOn: "2026-08-07",
    notifiedOn: null,
    appliesToKe: true,
    // The August decision was reported as also excluding protected consumers.
    excludes: ["lifeline consumers", "protected consumers", "electric vehicle charging stations", "prepaid consumers on the prepaid tariff"],
    sources: [
      { title: "The Express Tribune, 8 August 2026: NEPRA approves 75 paisa per unit hike under FCA", url: "https://tribune.com.pk/story/2622658/nepra-approves-75-paisa-per-unit-hike-in-electricity-tariff-under-fca" },
    ],
  },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// "2026-10" -> "October 2026"
export const monthLabel = (ym) => {
  if (!ym) return "";
  const [y, m] = String(ym).split("-").map(Number);
  return `${MONTHS[m - 1] || ""} ${y}`.trim();
};

// Today as "YYYY-MM" in Pakistan.
export const currentMonthPk = (today) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi", year: "numeric", month: "2-digit" }).format(today ? new Date(today) : new Date());

// The FCA on this month's bills, or the latest known one if this month's has
// not been decided yet (NEPRA decides it in the first week of the month).
// `override` is the admin's manual entry, used when it is for a later month.
export function currentFca(today, override) {
  const ym = currentMonthPk(today);
  const known = MONTHLY_FCA.find((f) => f.billingMonth === ym) || MONTHLY_FCA[0];
  if (override?.billingMonth && override.perUnit != null && override.billingMonth >= (known?.billingMonth || "")) {
    return { ...override, excludes: FCA_EXCLUDES, sources: override.sourceUrl ? [{ title: override.sourceTitle || "Source", url: override.sourceUrl }] : [], manual: true, isCurrent: override.billingMonth === ym };
  }
  return known ? { ...known, isCurrent: known.billingMonth === ym } : null;
}

// The quarterly adjustment in force today, with a manual override if the admin
// has entered a newer one.
export function currentQta(today, override) {
  const d = today ? new Date(today) : new Date();
  const iso = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi" }).format(d);
  const live = adjustmentsOn(iso)[0] || null;
  if (override?.perUnit != null && override.appliesFrom && override.appliesTo && iso >= override.appliesFrom && iso <= override.appliesTo) {
    return { ...override, label: override.label || "Quarterly tariff adjustment", monthsLabel: `${monthLabel(override.appliesFrom.slice(0, 7))} to ${monthLabel(override.appliesTo.slice(0, 7))} billing months`, manual: true };
  }
  return live;
}

// Every quarterly adjustment, newest first, for the history table.
export const qtaHistory = () => [...ADJUSTMENTS].sort((a, b) => b.appliesFrom.localeCompare(a.appliesFrom));

// Per-unit total of the adjustments on a bill this month.
export function adjustmentPerUnit(today, overrides) {
  const fca = currentFca(today, overrides?.fca);
  const qta = currentQta(today, overrides?.qta);
  return { fca, qta, perUnit: (fca?.isCurrent ? fca.perUnit : 0) + (qta?.perUnit || 0) };
}
