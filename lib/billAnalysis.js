// Analysis derived ONLY from values present in the parsed bill.
//
// Every function returns null when an input it needs is missing, and the result
// page renders nothing for a null module. Nothing here estimates a figure the
// bill did not supply. The one place that uses a published rate rather than a
// figure off the bill is slabSaving, which draws on the verified S.R.O.
// 279(I)/2026 schedule in lib/tariffs.js and says so on screen.
import { CHARGE_LINES } from "./billData";
import {
  DOMESTIC_SLAB_BOUNDS, PROTECTED, SLAB_BENEFIT, categoryFor, energyCharge, slabRowFor,
} from "./tariffs";

const pct = (a, b) => (b ? ((a - b) / b) * 100 : null);
const round = (n, d = 0) => (n === null ? null : Number(n.toFixed(d)));

// ---------------------------------------------------------------- 1. slab
// Which domestic slab this month's units land in, and the distance to the next
// boundary. Boundaries are structural (they define the tariff, not its price),
// so this works even while per-unit rates are unverified.
export function slabPosition(units) {
  if (units === null || units === undefined || units <= 0) return null;
  const bounds = DOMESTIC_SLAB_BOUNDS;
  let lower = 0;
  for (const b of bounds) {
    if (units <= b) {
      return {
        label: `${lower + 1}–${b} units`,
        lower: lower + 1,
        upper: b,
        unitsIntoSlab: units - lower,
        unitsToNext: b - units,
        nextBoundary: b,
        isTop: false,
      };
    }
    lower = b;
  }
  return {
    label: `Above ${lower} units`,
    lower: lower + 1,
    upper: null,
    unitsIntoSlab: units - lower,
    unitsToNext: null,
    nextBoundary: null,
    isTop: true,
  };
}

// ------------------------------------------------- 2. month-over-month
// history rows are oldest-or-newest-first depending on the upstream; we pick the
// most recent row that is not this month's own.
export function monthOverMonth(bill) {
  const units = bill?.unitsConsumed;
  const rows = (bill?.history || []).filter((r) => r.units !== null);
  if (units === null || rows.length < 2) return null;

  // Drop a row that duplicates the current month's units+amount (the current
  // bill often appears in its own history).
  const prior = rows.filter(
    (r) => !(r.units === units && (r.amount === null || r.amount === bill.payableWithinDueDate))
  );
  if (!prior.length) return null;
  const prev = prior[0];
  if (prev.units === null) return null;

  const unitsDelta = units - prev.units;
  const unitsPct = pct(units, prev.units);
  const amountDelta =
    bill.payableWithinDueDate !== null && prev.amount !== null
      ? bill.payableWithinDueDate - prev.amount
      : null;
  const amountPct =
    bill.payableWithinDueDate !== null && prev.amount ? pct(bill.payableWithinDueDate, prev.amount) : null;

  // Plain-language read, only asserting what the numbers support.
  let read;
  const up = unitsDelta > 0;
  const mag = Math.abs(round(unitsPct, 0));
  if (Math.abs(unitsDelta) < 1) {
    read = "Your usage is essentially unchanged from the previous month.";
  } else if (amountPct !== null && Math.abs(unitsPct) >= 5) {
    const amtMag = Math.abs(round(amountPct, 0));
    read =
      `You used ${mag}% ${up ? "more" : "fewer"} units than the previous month, ` +
      `and the bill is ${amtMag}% ${amountDelta > 0 ? "higher" : "lower"}. ` +
      (Math.abs(amtMag - mag) <= 8
        ? "The change in usage accounts for most of the difference."
        : "The two do not move together, so tariff changes or a slab crossing are also involved.");
  } else {
    read = `You used ${mag}% ${up ? "more" : "fewer"} units than the previous month.`;
  }

  return {
    prevMonth: prev.month,
    prevUnits: prev.units,
    prevAmount: prev.amount,
    units,
    unitsDelta,
    unitsPct: round(unitsPct, 1),
    amountDelta,
    amountPct: round(amountPct, 1),
    read,
  };
}

// ------------------------------------------- 3. this bill's charge lines
// Only lines actually present on THIS bill, with each one's share of the total.
export function chargeBreakdown(bill) {
  const charges = bill?.charges || {};
  const present = CHARGE_LINES.filter((l) => charges[l.id] !== undefined && charges[l.id] !== null);
  if (present.length < 2) return null;
  const total = bill.payableWithinDueDate;
  return present.map((l) => ({
    ...l,
    amount: charges[l.id],
    share: total ? round((charges[l.id] / total) * 100, 1) : null,
  }));
}

// The single largest non-energy line, used for the contextual guide link.
export function largestSurcharge(breakdown) {
  if (!breakdown) return null;
  const surcharges = breakdown.filter((l) => l.id !== "costOfElectricity" && l.amount > 0);
  if (!surcharges.length) return null;
  return surcharges.reduce((a, b) => (b.amount > a.amount ? b : a));
}

// -------------------------------------------------- 4. protected status
// Authoritative when the bill carries a tariff code (A-1P / A1-P = protected);
// otherwise reported strictly as "on this month's units", never as a status.
export function protectedStatus(bill) {
  const units = bill?.unitsConsumed;
  const tariff = bill?.tariff;
  if (units === null && !tariff) return null;

  let declared = null;
  if (tariff) {
    const t = tariff.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (/A1P|A1AP|PROTECTED/.test(t)) declared = true;
    else if (/^A1/.test(t)) declared = false;
  }

  const threshold = PROTECTED.unitThreshold;
  const overThreshold = units !== null ? units > threshold : null;
  const marginToThreshold = units !== null ? threshold - units : null;

  return {
    declared, // true | false | null (unknown from the bill)
    units,
    threshold,
    thresholdSource: PROTECTED.source,
    carryForwardRule: PROTECTED.carryForwardRule,
    overThreshold,
    marginToThreshold,
    // "close to losing it" = protected and within 10% of the threshold
    atRisk:
      declared === true && marginToThreshold !== null && marginToThreshold >= 0 && marginToThreshold <= threshold * 0.1,
  };
}

// -------------------------------------- 5. what a lower slab would save
//
// This is NOT units-above-the-boundary x the marginal rate. Domestic billing is
// not telescopic: per the notes under Annex-B-1 of S.R.O. 279(I)/2026, "only
// protected residential consumers will be given the benefit of one previous
// slab", and lifeline consumers get none. So for an unprotected consumer every
// unit is charged at the rate of the slab their consumption REACHES, and
// dropping below a boundary reprices the whole month rather than just the
// excess. Computing it the naive way understates the saving badly, so both
// totals come from energyCharge(), which applies the benefit rule.
export function slabSaving(bill, slab, category) {
  const units = bill?.unitsConsumed;
  if (!slab || slab.isTop || units == null || units <= 0) return null;
  const cat = category || categoryFor(units);
  if (cat === "lifeline") return null;

  const targetUnits = slab.lower - 1; // the top of the band below
  if (targetUnits <= 0) return null;

  const now = energyCharge(units, cat);
  const then = energyCharge(targetUnits, cat);
  if (now == null || then == null) return null;

  const saving = now - then;
  if (saving <= 0) return null;

  return {
    unitsToDrop: units - targetUnits,
    targetUnits,
    currentCharge: round(now, 0),
    targetCharge: round(then, 0),
    estimate: round(saving, 0),
    marginal: slabRowFor(units, cat)?.rate ?? null,
    // Whether the whole month reprices or only the units above the line.
    repricesWholeMonth: (SLAB_BENEFIT[cat] ?? 0) === 0,
  };
}

// --------------------------------- 5b. effective cost per unit (derived)
// Purely arithmetic on two numbers this bill actually contains.
export function effectiveRate(bill) {
  const units = bill?.unitsConsumed;
  const total = bill?.payableWithinDueDate;
  if (!units || units <= 0 || total === null) return null;
  const energy = bill.charges?.costOfElectricity ?? null;
  return {
    allIn: round(total / units, 2),
    energyOnly: energy !== null ? round(energy / units, 2) : null,
  };
}

// ------------------------------------------------- 6. "is this unusual"
// Compares this month against the consumer's OWN history. Needs at least three
// prior readings to say anything meaningful.
export function anomalyCheck(bill) {
  const units = bill?.unitsConsumed;
  const rows = (bill?.history || []).filter((r) => r.units !== null && r.units > 0);
  if (units === null || rows.length < 3) return null;

  const values = rows.map((r) => r.units);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (!mean) return null;
  const sd = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length);
  const deviation = sd ? (units - mean) / sd : 0;
  const pctVsMean = pct(units, mean);

  let verdict = "normal";
  if (sd > 0 && Math.abs(deviation) >= 2) verdict = units > mean ? "high" : "low";
  else if (Math.abs(pctVsMean) >= 40) verdict = units > mean ? "high" : "low";

  return {
    months: values.length,
    mean: round(mean, 0),
    max: Math.max(...values),
    min: Math.min(...values),
    units,
    pctVsMean: round(pctVsMean, 0),
    verdict,
    note:
      verdict === "normal"
        ? `This month sits within your usual range over the last ${values.length} months.`
        : verdict === "high"
        ? `This month is well above your average of ${round(mean, 0)} units over the last ${values.length} months. Worth checking the meter reading dates on the bill before assuming a fault.`
        : `This month is well below your average of ${round(mean, 0)} units over the last ${values.length} months, which usually means a short billing period or an estimated reading.`,
  };
}
