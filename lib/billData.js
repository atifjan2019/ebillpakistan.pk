// Normalises the CCMS bill response into a stable internal shape.
//
// WHY A RESOLVER INSTEAD OF DIRECT FIELD ACCESS
// The CCMS API is undocumented and mixes conventions: /api/details/user returns
// SHOUTING_KEYS (REFNO, NAME, TARIFF, SLOAD — see SAFE_USER in lib/pitc.js)
// while /api/details/bill returns camelCase nested objects (divName, subDivName,
// feederName, consumerAddress2). The envelope is confirmed:
//
//   bill: { basicInfo, histInfo, detInfo, cummReadingInfo,
//           metersInfo, netMeteringInfo, error, status }
//
// (verified against a live request with a non-existent reference, which returns
// the full envelope with every member null and status:false).
//
// The inner field names of basicInfo / detInfo / histInfo are NOT documented. So
// instead of hard-coding guesses, we flatten the response into a normalised key
// map (lowercase, alphanumerics only) and resolve each logical field against a
// list of candidate spellings. A field we cannot find resolves to null, and any
// analysis module missing an input hides itself rather than showing a guess.
//
// TO COMPLETE THE MAPPING EXACTLY: run
//     node scripts/dump-bill-schema.mjs <your-14-digit-reference>
// which prints every key CCMS actually returns. Add any unmatched spellings to
// the CANDIDATES table below. Until then the code is correct but conservative.

const norm = (k) => String(k).toLowerCase().replace(/[^a-z0-9]/g, "");

// Flatten nested objects into { normalisedKey: value }. Arrays are kept whole
// under their own key (histInfo rows etc. are handled separately).
function flatten(obj, out = {}, depth = 0) {
  if (!obj || typeof obj !== "object" || depth > 4) return out;
  for (const [k, v] of Object.entries(obj)) {
    const nk = norm(k);
    if (Array.isArray(v)) {
      if (!(nk in out)) out[nk] = v;
    } else if (v && typeof v === "object") {
      if (!(nk in out)) out[nk] = v;
      flatten(v, out, depth + 1);
    } else if (v !== null && v !== undefined && v !== "") {
      if (!(nk in out)) out[nk] = v;
    }
  }
  return out;
}

// Logical field -> candidate spellings, most-likely first.
const CANDIDATES = {
  reference: ["refno", "reference", "referenceno", "refnumber", "consumerno", "consumerid"],
  name: ["name", "consumername", "custname", "customername"],
  address: ["addr1", "address", "consumeraddress", "consumeraddress1", "addressline1"],
  address2: ["addr2", "consumeraddress2", "addressline2"],
  // tariffDescription is the printed code ("A-1a(01)"); tariffCode is just "01".
  tariff: ["tariffdescription", "tariffcode", "tariff", "tariffname", "trf"],
  sanctionedLoad: ["sload", "sanctionedload", "sactionload", "load", "connectedload"],
  billMonth: ["billmonth", "month", "billingmonth", "monthyear", "billdate"],
  unitsConsumed: ["unitsconsumed", "totcurcons", "mtrkwhconsump", "units", "unit", "totalunits", "consumedunits", "kwh"],
  readingDate: ["readingdate", "meterreaddate", "meterreadingdate", "currentreadingdate"],
  dueDate: ["billduedate", "duedate", "lastdate", "duedt"],
  issueDate: ["issuedate", "billissuedate", "readingdatetime"],
  payableWithinDueDate: [
    "payablewithinduedate", "netbill", "currentbillamount", "billamount", "netamount",
    "amountpayable", "payable", "totalamount", "amountwithinduedate",
  ],
  payableAfterDueDate: [
    "payableafterduedate", "amountafterduedate", "lpsamount", "grossamount", "amountafterdue",
  ],
  arrears: ["arrears", "arrear", "previousbalance", "outstanding", "balance"],
  costOfElectricity: ["costofelectricity", "currentcharges", "energycharges", "variablecharges", "energycost"],
  fpa: ["fpa", "totalfpa", "fuelpriceadjustment", "fueladjustment", "fca", "fuelcharges"],
  quarterlyAdjustment: ["quarterlyadjustment", "qta", "qtradj", "quarterlytariffadjustment"],
  fixedCharges: ["fixedcharges", "fixedcharge", "fc"],
  meterRent: ["meterrent", "servicerent", "rent"],
  electricityDuty: ["electricityduty", "ed", "duty"],
  gst: ["gst", "salestax", "generalsalestax"],
  tvFee: ["tvfee", "ptvfee", "tvlicencefee", "tvlicensefee", "ptv"],
  latePaymentSurcharge: ["latepaymentsurcharge", "lpsurcharge", "lps", "surcharge"],
  financingCost: ["financingcost", "fcsurcharge", "financingcostsurcharge"],
  incomeTax: ["incometax", "itax", "wht", "withholdingtax"],
  status: ["status"],
};

const pick = (map, names) => {
  for (const n of names) if (map[n] !== undefined && map[n] !== null) return map[n];
  return null;
};

// Parse a money/number string like "12,311.25" or "Rs 1,845" -> 12311.25.
// Returns null for anything that isn't genuinely numeric, so a module never
// renders a value we merely hoped was a number.
export function num(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const cleaned = String(v).replace(/[^0-9.\-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === ".") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

const str = (v) => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s && s.toLowerCase() !== "null" ? s : null;
};

// The charge lines we know how to explain, in the order they appear on a bill.
export const CHARGE_LINES = [
  { id: "costOfElectricity", label: "Cost of electricity", kind: "charge", guide: "/blog/unit-slabs-fuel-price-adjustment-taxes-explained" },
  { id: "fpa", label: "Fuel price adjustment (FPA)", kind: "charge", guide: "/blog/unit-slabs-fuel-price-adjustment-taxes-explained" },
  { id: "quarterlyAdjustment", label: "Quarterly tariff adjustment", kind: "charge", guide: "/blog/unit-slabs-fuel-price-adjustment-taxes-explained" },
  { id: "fixedCharges", label: "Fixed charges", kind: "charge", guide: "/blog/mdi-fixed-charges-electricity-bill" },
  { id: "meterRent", label: "Meter rent", kind: "charge", guide: "/blog/mdi-fixed-charges-electricity-bill" },
  { id: "financingCost", label: "Financing cost surcharge", kind: "charge", guide: "/blog/unit-slabs-fuel-price-adjustment-taxes-explained" },
  { id: "electricityDuty", label: "Electricity duty", kind: "tax", guide: "/blog/unit-slabs-fuel-price-adjustment-taxes-explained" },
  { id: "gst", label: "General sales tax (GST)", kind: "tax", guide: "/blog/unit-slabs-fuel-price-adjustment-taxes-explained" },
  { id: "incomeTax", label: "Income tax", kind: "tax", guide: "/blog/unit-slabs-fuel-price-adjustment-taxes-explained" },
  { id: "tvFee", label: "PTV licence fee", kind: "tax", guide: "/sample-bill-explained" },
  { id: "arrears", label: "Arrears / previous balance", kind: "carry", guide: "/sample-bill-explained" },
];

// Normalise a raw { user, bill } payload from fetchBillJson.
export function normaliseBill(raw) {
  if (!raw) return null;
  const bill = raw.bill || null;
  const user = raw.user || null;

  // status:false is CCMS's "no such reference".
  if (bill && bill.status === false && !bill.basicInfo) return null;

  const map = { ...flatten(user), ...flatten(bill) };
  // metersInfo is an array of meters; the resolver only walks objects, so lift
  // the first meter's reading in as a fallback for the units.
  const meter0 = Array.isArray(bill?.metersInfo) ? bill.metersInfo[0] : null;
  if (meter0 && typeof meter0 === "object") flatten(meter0, map);

  const get = (field) => pick(map, CANDIDATES[field] || []);
  const getNum = (field) => num(get(field));
  const getStr = (field) => str(get(field));

  const charges = {};
  for (const line of CHARGE_LINES) {
    const v = getNum(line.id);
    if (v !== null) charges[line.id] = v;
  }

  // CCMS sends dates as "2026-10-28T00:00:00"; show them the way the printed
  // bill does ("28 Oct 2026", and "Oct 2026" for the billing month).
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const prettyDate = (v, monthOnly = false) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v || ""));
    if (!m) return v;
    const mon = MONTHS[Number(m[2]) - 1] || m[2];
    return monthOnly ? `${mon} ${m[1]}` : `${Number(m[3])} ${mon} ${m[1]}`;
  };

  const out = {
    reference: getStr("reference"),
    name: getStr("name"),
    address: [getStr("address"), getStr("address2")].filter(Boolean).join(", ") || null,
    tariff: getStr("tariff"),
    sanctionedLoad: getStr("sanctionedLoad"),
    billMonth: prettyDate(getStr("billMonth"), true),
    readingDate: prettyDate(getStr("readingDate")),
    dueDate: prettyDate(getStr("dueDate")),
    unitsConsumed: getNum("unitsConsumed"),
    payableWithinDueDate: getNum("payableWithinDueDate"),
    payableAfterDueDate: getNum("payableAfterDueDate"),
    latePaymentSurcharge: getNum("latePaymentSurcharge"),
    charges,
    history: normaliseHistory(bill),
    // Kept for the diagnostics route; never rendered.
    _keys: Object.keys(map).sort(),
  };

  // CCMS gives the surcharge but not the after-due total; the printed bill
  // shows exactly their sum, so derive it rather than leave the line blank.
  if (out.payableAfterDueDate === null && out.payableWithinDueDate !== null && out.latePaymentSurcharge !== null) {
    out.payableAfterDueDate = out.payableWithinDueDate + out.latePaymentSurcharge;
  }

  // A bill with neither a total nor units is not usable as a bill.
  if (out.payableWithinDueDate === null && out.unitsConsumed === null) return null;
  return out;
}

// histInfo is the month-by-month history. Shape is undocumented, so accept an
// array of row objects and resolve units/amount/month per row the same way.
function normaliseHistory(bill) {
  const rows = bill?.histInfo;
  // The live envelope (checked October 2026) is one object with numbered keys,
  // gbHistMM1..13 / gbHistUnits1..13 / gbHistAssment1..13, oldest first.
  if (rows && !Array.isArray(rows) && typeof rows === "object") {
    const out = [];
    for (let i = 1; i <= 24; i++) {
      const month = str(rows[`gbHistMM${i}`]);
      if (!month) continue;
      const units = num(rows[`gbHistUnits${i}`]);
      const amount = num(rows[`gbHistAssment${i}`]);
      if (units === null && amount === null) continue;
      out.push({ month, units, amount });
    }
    // The analysis treats history[0] as the most recent month.
    return out.reverse();
  }
  if (!Array.isArray(rows) || !rows.length) return [];
  const out = [];
  for (const r of rows) {
    if (!r || typeof r !== "object") continue;
    const m = flatten(r);
    const units = num(pick(m, CANDIDATES.unitsConsumed));
    const amount = num(pick(m, CANDIDATES.payableWithinDueDate));
    const month = str(pick(m, CANDIDATES.billMonth));
    if (units === null && amount === null) continue;
    out.push({ month, units, amount });
  }
  return out;
}

// Formatting helpers shared by the result page.
export const fmtMoney = (n) =>
  n === null || n === undefined
    ? null
    : `Rs ${Number(n).toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export const fmtUnits = (n) =>
  n === null || n === undefined ? null : `${Number(n).toLocaleString("en-PK")} units`;
