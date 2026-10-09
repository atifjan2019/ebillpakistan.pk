// Bill arithmetic for the calculators. Pure functions over lib/tariffs.js, safe
// on the client. Nothing here estimates a figure the notified schedule does
// not give: taxes, duty and the PTV fee vary by province and category, so the
// estimates stop at "before taxes" and say so.
import { A1_BELOW_5KW, A1_TOU, MINIMUM_CHARGE, PROTECTED, SLAB_BENEFIT, energyCharge, slabRowFor } from "./tariffs";

export const CATEGORIES = [
  ["lifeline", "Lifeline", "Up to 100 units and billed on the lifeline tariff."],
  ["protected", "Protected", "200 units or under in each of the last six months."],
  ["unprotected", "Unprotected", "Everyone else below 5 kW."],
];

// Which category a reading pattern qualifies for, from the notified definitions.
export function protectedCheck(months, sanctionedLoad) {
  const vals = months.map((m) => (m === "" || m == null ? null : Number(m))).filter((v) => v != null && Number.isFinite(v) && v >= 0);
  if (vals.length < PROTECTED.qualifyingMonths) {
    return { ok: null, reason: `Enter all ${PROTECTED.qualifyingMonths} months.` };
  }
  if (sanctionedLoad >= 5) {
    return { ok: false, reason: "A sanctioned load of 5 kW or more is billed Time-of-Use and can never be protected, whatever the units.", monthsNeeded: null };
  }
  // vals[0] is the oldest month; the look-back is the six most recent.
  const recent = vals.slice(-PROTECTED.qualifyingMonths);
  const over = recent.map((v, i) => (v > PROTECTED.unitThreshold ? i : -1)).filter((i) => i >= 0);
  if (!over.length) {
    const maxUnits = Math.max(...recent);
    return { ok: true, reason: `Every one of the last six months was ${PROTECTED.unitThreshold} units or under (highest: ${maxUnits}).`, headroom: PROTECTED.unitThreshold - maxUnits };
  }
  // Months since the last breach decide how long until the look-back is clean.
  const lastBreach = over[over.length - 1];
  const cleanSince = recent.length - 1 - lastBreach;
  const monthsNeeded = PROTECTED.qualifyingMonths - cleanSince;
  return {
    ok: false,
    reason: `${over.length === 1 ? "One month" : `${over.length} months`} went over ${PROTECTED.unitThreshold} units (${over.map((i) => recent[i]).join(", ")}).`,
    monthsNeeded,
    cleanSince,
  };
}

// The estimate for a below-5 kW domestic connection.
export function estimateBill({ units, category = "unprotected", sanctionedLoad = 1, phase = "single", fcaPerUnit = 0, qtaPerUnit = 0 }) {
  const u = Math.max(0, Math.round(Number(units) || 0));
  const cat = A1_BELOW_5KW[category] ? category : "unprotected";
  const rows = A1_BELOW_5KW[cat];
  const row = slabRowFor(u, cat) || rows[rows.length - 1];
  const energy = energyCharge(u, cat) ?? 0;
  const fixedRate = row?.fixed ?? null;
  const load = Math.max(0, Number(sanctionedLoad) || 0);
  const fixed = fixedRate != null ? fixedRate * load : 0;
  const minimum = fixedRate == null && u === 0 ? (phase === "three" ? MINIMUM_CHARGE.threePhase : MINIMUM_CHARGE.singlePhase) : 0;
  // Lifeline and prepaid consumers are exempt from both adjustments.
  const exempt = cat === "lifeline";
  const fca = exempt ? 0 : u * fcaPerUnit;
  const qta = exempt ? 0 : u * qtaPerUnit;
  const subtotal = energy + fixed + minimum + fca + qta;

  // What dropping to the top of the previous slab would save, when there is one.
  let slabSaving = null;
  const idx = rows.indexOf(row);
  if (idx > 0 && u > 0) {
    const target = rows[idx - 1].upTo;
    const then = (energyCharge(target, cat) ?? 0) + (rows[idx - 1].fixed ?? 0) * load + (exempt ? 0 : target * (fcaPerUnit + qtaPerUnit));
    slabSaving = { targetUnits: target, unitsToCut: u - target, saving: subtotal - then };
  }
  const lines = [
    { label: `Energy charge (${row?.slab || ""} at Rs ${row?.rate?.toFixed(2)}/unit${SLAB_BENEFIT[cat] ? ", previous slab at its own rate" : ""})`, amount: energy },
    fixedRate != null && { label: `Fixed charge (Rs ${fixedRate}/kW on ${load} kW)`, amount: fixed },
    minimum > 0 && { label: "Minimum monthly charge", amount: minimum },
    !exempt && fcaPerUnit !== 0 && { label: `Fuel cost adjustment (${fcaPerUnit < 0 ? "−" : "+"}Rs ${Math.abs(fcaPerUnit).toFixed(4)}/unit)`, amount: fca },
    !exempt && qtaPerUnit !== 0 && { label: `Quarterly adjustment (${qtaPerUnit < 0 ? "−" : "+"}Rs ${Math.abs(qtaPerUnit).toFixed(4)}/unit)`, amount: qta },
  ].filter(Boolean);
  return { units: u, category: cat, row, lines, subtotal, perUnit: u ? subtotal / u : 0, slabSaving, exempt };
}

// Time-of-Use domestic (sanctioned load 5 kW and above). Fixed charges are on
// 50% of sanctioned load or the recorded MDI, whichever is higher.
export function estimateTou({ sanctionedLoad = 5, mdi = 0, peakUnits = 0, offPeakUnits = 0, fcaPerUnit = 0, qtaPerUnit = 0 }) {
  const load = Math.max(0, Number(sanctionedLoad) || 0);
  const demand = Math.max(0, Number(mdi) || 0);
  const peak = Math.max(0, Math.round(Number(peakUnits) || 0));
  const off = Math.max(0, Math.round(Number(offPeakUnits) || 0));
  const billedKw = Math.max(load * 0.5, demand);
  const fixed = A1_TOU.fixed * billedKw;
  const energyPeak = peak * A1_TOU.peak;
  const energyOff = off * A1_TOU.offPeak;
  const units = peak + off;
  const fca = units * fcaPerUnit;
  const qta = units * qtaPerUnit;
  const subtotal = fixed + energyPeak + energyOff + fca + qta;
  const lines = [
    { label: `Peak units (${peak} at Rs ${A1_TOU.peak}/unit)`, amount: energyPeak },
    { label: `Off-peak units (${off} at Rs ${A1_TOU.offPeak}/unit)`, amount: energyOff },
    { label: `Fixed charge (Rs ${A1_TOU.fixed}/kW on ${billedKw.toFixed(1)} kW, the higher of half your load and your MDI)`, amount: fixed },
    fcaPerUnit !== 0 && { label: "Fuel cost adjustment", amount: fca },
    qtaPerUnit !== 0 && { label: "Quarterly adjustment", amount: qta },
  ].filter(Boolean);
  return { units, billedKw, basis: demand > load * 0.5 ? "mdi" : "load", lines, subtotal, fixed };
}

// A rough solar estimate. Every assumption is an input the reader can change,
// and the result says which rate each saving was valued at.
export function estimateSolar({ monthlyUnits, systemKw, unitsPerKwPerDay = 4, selfUseShare = 0.4, exportRate = 11, systemCostPerKw = 0, category = "unprotected", sanctionedLoad = 2, fcaPerUnit = 0, qtaPerUnit = 0 }) {
  const u = Math.max(0, Math.round(Number(monthlyUnits) || 0));
  const kw = Math.max(0, Number(systemKw) || 0);
  const generated = Math.round(kw * unitsPerKwPerDay * 30);
  const selfUsed = Math.min(u, Math.round(generated * selfUseShare));
  const exported = Math.max(0, generated - selfUsed);
  const before = estimateBill({ units: u, category, sanctionedLoad, fcaPerUnit, qtaPerUnit });
  const after = estimateBill({ units: u - selfUsed, category, sanctionedLoad, fcaPerUnit, qtaPerUnit });
  const billSaving = before.subtotal - after.subtotal;
  const exportCredit = exported * exportRate;
  const monthlySaving = billSaving + exportCredit;
  const cost = kw * (Number(systemCostPerKw) || 0);
  const paybackYears = cost > 0 && monthlySaving > 0 ? cost / (monthlySaving * 12) : null;
  return { generated, selfUsed, exported, before, after, billSaving, exportCredit, monthlySaving, cost, paybackYears };
}
