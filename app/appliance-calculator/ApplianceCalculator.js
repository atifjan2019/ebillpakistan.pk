"use client";

import { useMemo, useState } from "react";
import { estimateBill } from "../../lib/billMath";
import { PROTECTED } from "../../lib/tariffs";

// Typical average draw while the appliance is switched on, in watts. These are
// everyday ballpark figures, not measurements of your appliance: the rating
// plate or the manual is always better, and every figure is editable.
// `on` marks what a typical household starts with.
const PRESETS = [
  ["Ceiling fan (ordinary)", 75, 14, 4, true, "An older AC-motor fan. Inverter or DC fans draw far less."],
  ["Ceiling fan (inverter / DC)", 30, 14, 0, false, ""],
  ["LED bulb", 12, 6, 6, true, ""],
  ["LED tube light", 20, 6, 2, true, ""],
  ["Refrigerator (medium)", 60, 24, 1, true, "Average over the day; the compressor cycles on and off."],
  ["Deep freezer", 100, 24, 0, false, "Average over the day."],
  ["Air conditioner 1 ton (inverter)", 600, 8, 0, false, "Average while on. Lower at a higher thermostat setting."],
  ["Air conditioner 1.5 ton (inverter)", 900, 8, 1, true, "Average while on. Lower at a higher thermostat setting."],
  ["Air conditioner 1.5 ton (non-inverter)", 1500, 8, 0, false, "Average while on."],
  ["Room air cooler", 200, 10, 0, false, ""],
  ["LED television", 80, 5, 1, true, ""],
  ["Electric iron", 1000, 0.5, 1, true, ""],
  ["Washing machine", 400, 0.5, 1, true, ""],
  ["Water pump (1 hp)", 750, 1, 1, true, ""],
  ["Microwave oven", 1200, 0.25, 0, false, ""],
  ["Electric kettle", 1500, 0.25, 0, false, ""],
  ["Electric geyser / instant heater", 3000, 1, 0, false, "The single biggest winter load in most homes."],
  ["Electric room heater", 2000, 4, 0, false, ""],
  ["Water dispenser", 100, 24, 0, false, "Average over the day."],
  ["Laptop", 60, 6, 0, false, ""],
  ["Desktop computer", 200, 6, 0, false, ""],
  ["Wi-Fi router", 10, 24, 1, true, ""],
  ["Phone charger", 10, 3, 3, true, ""],
];

const rs = (n) => `Rs ${Math.round(n).toLocaleString("en-PK")}`;
const DAYS = 30;

export default function ApplianceCalculator({ fcaPerUnit, qtaPerUnit }) {
  const [rows, setRows] = useState(() =>
    PRESETS.map(([name, watts, hours, qty, , hint]) => ({ name, watts: String(watts), hours: String(hours), qty: String(qty), hint }))
  );
  const [showAll, setShowAll] = useState(false);
  const [load, setLoad] = useState("2");

  const set = (i, k, v) =>
    setRows((r) => r.map((x, j) => (j === i ? { ...x, [k]: v.replace(k === "qty" ? /\D/g : /[^\d.]/g, "").slice(0, 5) } : x)));

  const calc = useMemo(() => {
    const items = rows
      .map((r) => {
        const units = ((Number(r.watts) || 0) * (Number(r.hours) || 0) * (Number(r.qty) || 0) * DAYS) / 1000;
        return { name: r.name, units };
      })
      .filter((x) => x.units > 0)
      .sort((a, b) => b.units - a.units);
    const total = Math.round(items.reduce((s, x) => s + x.units, 0));
    const args = { units: total, sanctionedLoad: load, fcaPerUnit, qtaPerUnit };
    const unprotected = estimateBill({ ...args, category: "unprotected" });
    const prot = total <= PROTECTED.unitThreshold ? estimateBill({ ...args, category: "protected" }) : null;
    return { items, total, unprotected, prot };
  }, [rows, load, fcaPerUnit, qtaPerUnit]);

  const visible = rows.map((r, i) => ({ r, i })).filter(({ r, i }) => showAll || PRESETS[i][4] || Number(r.qty) > 0);
  const top = calc.items.slice(0, 3);
  const saving = calc.unprotected.slabSaving;

  return (
    <div className="tool tool--wide">
      <div className="tool-form">
        <p className="tool-lead">Set how many of each you have and how long they run on a typical day. Watts are typical figures: change any of them to match the rating plate on yours.</p>
        <div className="appl-head" aria-hidden="true"><span>Appliance</span><span>How many</span><span>Watts</span><span>Hours a day</span></div>
        {visible.map(({ r, i }) => (
          <div className="appl-row" key={r.name}>
            <span className="appl-name">
              {r.name}
              {r.hint && <small>{r.hint}</small>}
            </span>
            <input aria-label={`${r.name}: how many`} inputMode="numeric" value={r.qty} onChange={(e) => set(i, "qty", e.target.value)} />
            <input aria-label={`${r.name}: watts`} inputMode="decimal" value={r.watts} onChange={(e) => set(i, "watts", e.target.value)} />
            <input aria-label={`${r.name}: hours a day`} inputMode="decimal" value={r.hours} onChange={(e) => set(i, "hours", e.target.value)} />
          </div>
        ))}
        <button type="button" className="appl-more" onClick={() => setShowAll((v) => !v)}>
          {showAll ? "Show fewer appliances" : `Add more appliances (${rows.length - visible.length} more)`}
        </button>
        <div className="field">
          <label htmlFor="aload">Sanctioned load (kW)</label>
          <div className="control"><input id="aload" inputMode="decimal" value={load} onChange={(e) => setLoad(e.target.value.replace(/[^\d.]/g, "").slice(0, 4))} /></div>
          <p className="tool-hint">Printed on your bill; it sets the fixed charge.</p>
        </div>
      </div>

      <div className="tool-result" aria-live="polite">
        <div className="tool-total">
          <span className="tool-total-k">Estimated use a month</span>
          <span className="tool-total-v">{calc.total.toLocaleString("en-PK")} units</span>
          <span className="tool-total-n">
            {calc.unprotected.row?.slab} slab · about {rs(calc.unprotected.subtotal)} before taxes
            {calc.prot ? ` (${rs(calc.prot.subtotal)} if you are a protected consumer)` : ""}
          </span>
        </div>

        {top.length > 0 && (
          <table className="tool-lines">
            <tbody>
              {calc.items.slice(0, 8).map((x) => (
                <tr key={x.name}>
                  <td>
                    {x.name}
                    <span className="appl-bar"><span style={{ width: `${Math.max(3, (x.units / calc.items[0].units) * 100)}%` }} /></span>
                  </td>
                  <td>{Math.round(x.units)} units · {Math.round((x.units / Math.max(1, calc.total)) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {top[0] && (
          <p className="tool-tip">
            <strong>{top[0].name}</strong> is your biggest load at about {Math.round((top[0].units / Math.max(1, calc.total)) * 100)}% of the bill.
            {top[0].units >= 30 ? ` One hour less a day would save about ${Math.round(top[0].units / Math.max(1, Number(rows.find((r) => r.name === top[0].name)?.hours) || 1))} units a month.` : ""}
          </p>
        )}
        {saving && saving.saving > 0 && (
          <p className="tool-tip">
            You are {saving.unitsToCut} unit{saving.unitsToCut === 1 ? "" : "s"} above the {saving.targetUnits}-unit line. Getting under it reprices the whole month: about <strong>{rs(saving.saving)}</strong> less.
          </p>
        )}
        {calc.total > 0 && calc.total <= PROTECTED.unitThreshold && (
          <p className="tool-tip tool-tip--muted">
            At {PROTECTED.unitThreshold} units or under for six months in a row you qualify for the protected rate. <a href="/protected-consumer-checker">Check your six months</a>.
          </p>
        )}
        <p className="tool-actions">
          <a className="btn btn-primary" href={`/bill-calculator?units=${calc.total}`}>See the full bill for {calc.total} units</a>
        </p>
        <p className="tool-note">
          {`Units = watts × hours a day × ${DAYS} days ÷ 1,000.`} Wattages are typical figures, and real use depends on the
          appliance, the season and the thermostat. The rupee figure uses NEPRA&apos;s notified rates and this month&apos;s
          adjustments, before taxes.
        </p>
      </div>
    </div>
  );
}
