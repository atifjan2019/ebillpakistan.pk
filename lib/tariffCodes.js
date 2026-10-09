// The consumer categories in NEPRA's Schedule of Tariff, keyed by the code a
// bill prints. Pure data, safe on the client.
//
// SOURCE: the category list and sub-codes are those of the notified Schedule of
// Tariff (S.R.O. 1287(I)/2025 of 18 July 2025, see CATEGORY_SOURCE in
// lib/tariffs.js) and NEPRA's own published tariff table, which lists A1
// Residential, A2 Commercial, A3 General Services, B Industrial (B1 to B4),
// C Single Point Supply (C1 to C3), D Agricultural, G Public Lighting,
// H Residential Colonies, I Railway Traction, J Special Contract and K (AJK,
// Rawat Lab). Rates are deliberately not repeated here: they change by SRO and
// live in lib/tariffs.js for the domestic category only.
export const TARIFF_FAMILIES = [
  {
    letter: "A-1",
    name: "Residential",
    who: "Homes, flats and other places people live, plus places of worship.",
    subs: [
      ["A-1(a)", "Sanctioned load below 5 kW", "Billed on units in slabs. Within it you are lifeline, protected or unprotected according to how many units you use, which the code itself does not always show."],
      ["A-1(b)", "Sanctioned load of 5 kW or above, Time of Use", "Billed at a peak and an off-peak rate, with a fixed charge on the higher of half your sanctioned load and your MDI. Can never be a protected consumer."],
    ],
    links: [["/protected-consumer-checker", "Protected consumer checker"], ["/bill-calculator", "Bill calculator"], ["/mdi-calculator", "MDI calculator"]],
  },
  {
    letter: "A-2",
    name: "Commercial",
    who: "Shops, offices, hotels, private clinics, plazas, petrol pumps and other businesses.",
    subs: [
      ["A-2(a)", "Sanctioned load below 5 kW", "A flat commercial rate per unit with a fixed charge."],
      ["A-2(b)", "Sanctioned load of 5 kW or above", "Regular billing with a fixed charge per kW."],
      ["A-2(c)", "Time of Use", "Peak and off-peak rates, for loads of 5 kW and above with a ToU meter."],
      ["A-2(d)", "Electric vehicle charging station", "A separate rate for EV charging stations."],
    ],
    links: [],
  },
  {
    letter: "A-3",
    name: "General Services",
    who: "Government and semi-government offices, hospitals, schools and colleges, charitable institutions and similar non-commercial premises.",
    subs: [],
    links: [],
  },
  {
    letter: "B",
    name: "Industrial",
    who: "Factories, workshops, mills and other manufacturing or processing loads.",
    subs: [
      ["B-1", "Up to 25 kW, at 400/230 volts", "Small industrial connections. B-1(b) is the Time of Use version."],
      ["B-2", "Above 25 kW and up to 500 kW, at 400 volts", "B-2(a) regular, B-2(b) Time of Use, with fixed charges on demand (MDI)."],
      ["B-3", "Up to 5,000 kW, at 11 or 33 kV", "High-voltage industrial supply, Time of Use."],
      ["B-4", "All loads at 66 kV, 132 kV and above", "The largest industrial consumers, Time of Use."],
    ],
    links: [],
  },
  {
    letter: "C",
    name: "Single-point (bulk) supply",
    who: "One metering point for a whole premises that distributes the power itself: housing societies, large complexes, mixed-load consumers and other licensees.",
    subs: [
      ["C-1", "Supply at 400/230 volts", "C-1(a) up to 5 kW, C-1(b) above 5 kW and up to 500 kW, C-1(c) Time of Use."],
      ["C-2", "Supply at 11 or 33 kV, up to 5,000 kW", "C-2(a) regular, C-2(b) Time of Use."],
      ["C-3", "Supply at 66 kV and above", "C-3(a) regular, C-3(b) Time of Use."],
    ],
    links: [],
  },
  {
    letter: "D",
    name: "Agricultural",
    who: "Tubewells and other pumping for irrigation.",
    subs: [
      ["D-1", "SCARP tubewells", "Government drainage and reclamation (SCARP) tubewells. D-1(a) below 5 kW, D-1(b) Time of Use for 5 kW and above."],
      ["D-2", "Agricultural tubewells", "Private agricultural tubewells and lift irrigation pumps. D-2(a) regular, D-2(b) Time of Use."],
    ],
    links: [],
  },
  {
    letter: "E",
    name: "Temporary supply",
    who: "Short-term connections, for example for construction sites, exhibitions and events.",
    subs: [
      ["E-1", "Temporary residential or commercial supply", "E-1(i) residential, E-1(ii) commercial."],
      ["E-2", "Temporary industrial supply", ""],
    ],
    links: [],
  },
  {
    letter: "F",
    name: "Seasonal industrial supply",
    who: "Industries that run for part of the year only, such as ginning, rice husking and sugar crushing.",
    subs: [],
    links: [],
  },
  { letter: "G", name: "Public lighting", who: "Street lights and lighting of public places, billed to the local authority.", subs: [], links: [] },
  { letter: "H", name: "Residential colonies attached to industrial premises", who: "Staff housing supplied through an industrial consumer's own connection.", subs: [], links: [] },
  { letter: "I", name: "Railway traction", who: "Supply to Pakistan Railways for traction.", subs: [], links: [] },
  {
    letter: "J",
    name: "Special contracts",
    who: "Supply to another licensee under NEPRA's supply-of-power regulations.",
    subs: [
      ["J-1", "Supply at 66 kV and above", ""],
      ["J-2", "Supply at 11 or 33 kV, and at 66 kV and above", "J-2(a) and J-2(b)."],
      ["J-3", "Supply at 11 or 33 kV, and at 66 kV and above", "J-3(a) and J-3(b)."],
    ],
    links: [],
  },
  { letter: "K", name: "Special contracts: AJK and Rawat Lab", who: "Bulk supply to Azad Jammu & Kashmir, and to Rawat Lab.", subs: [], links: [] },
];

// "A-1a(01)", "a1 b", "B2(b)", "Tariff: A-1" -> the family and the matching
// sub-code if any. Returns null when no category is found.
export function decodeTariff(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;
  const t = raw.toUpperCase().replace(/\s+/g, "");
  // A letter followed by a digit is the strongest signal ("A-1", "B2"); a bare
  // letter only counts when that is nearly all there is ("G", "H").
  const m =
    t.match(/([A-K])[-_.]?(\d)[-_.]?\(?(III|II|I|[A-D])?\)?/) ||
    (t.replace(/[^A-Z]/g, "").length <= 2 ? t.match(/([A-K])()()/) : null);
  if (!m) return null;
  const letter = m[1];
  const digit = m[2] || "";
  const sub = (m[3] || "").toLowerCase();
  const family =
    TARIFF_FAMILIES.find((f) => f.letter === `${letter}-${digit}`) ||
    TARIFF_FAMILIES.find((f) => f.letter === letter) ||
    null;
  if (!family) return null;
  let subMatch = null;
  if (digit && family.subs.length) {
    const exact = `${letter}-${digit}${sub ? `(${sub})` : ""}`.toLowerCase();
    subMatch =
      family.subs.find((x) => x[0].toLowerCase() === exact) ||
      (family.letter === letter ? family.subs.find((x) => x[0].toLowerCase() === `${letter}-${digit}`.toLowerCase()) : null) ||
      null;
  }
  const extra = (raw.match(/\((\d{1,3})\)/) || [])[1] || null;
  return { raw, family, sub: subMatch, extra };
}
