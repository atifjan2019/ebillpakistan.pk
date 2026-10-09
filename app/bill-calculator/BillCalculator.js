"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, estimateBill } from "../../lib/billMath";
import { DOMESTIC_SLAB_BOUNDS, PROTECTED } from "../../lib/tariffs";

const rs = (n) => `Rs ${Math.round(n).toLocaleString("en-PK")}`;

export default function BillCalculator({ fcaPerUnit, qtaPerUnit, month }) {
  const [units, setUnits] = useState("300");
  const [category, setCategory] = useState("unprotected");
  const [load, setLoad] = useState("2");
  const [phase, setPhase] = useState("single");
  const [includeAdj, setIncludeAdj] = useState(true);

  // Other tools link here with ?units=NNN so the figure carries over.
  useEffect(() => {
    const u = new URLSearchParams(window.location.search).get("units");
    if (u && /^\d{1,5}$/.test(u)) setUnits(u);
  }, []);

  const result = useMemo(
    () =>
      estimateBill({
        units,
        category,
        sanctionedLoad: load,
        phase,
        fcaPerUnit: includeAdj ? fcaPerUnit : 0,
        qtaPerUnit: includeAdj ? qtaPerUnit : 0,
      }),
    [units, category, load, phase, includeAdj, fcaPerUnit, qtaPerUnit]
  );
  const u = Number(units) || 0;
  const autoCategory = u <= 100 && category === "lifeline" ? "lifeline" : u <= PROTECTED.unitThreshold ? "protected" : "unprotected";
  const warn =
    category === "protected" && u > PROTECTED.unitThreshold
      ? `Over ${PROTECTED.unitThreshold} units this month means the next six months are billed as unprotected.`
      : category === "lifeline" && u > 100
        ? "Lifeline rates stop at 100 units; this bill would be charged on the protected or unprotected schedule."
        : null;
  const nextBound = DOMESTIC_SLAB_BOUNDS.find((b) => b > u);

  return (
    <div className="tool">
      <div className="tool-form">
        <div className="field">
          <label htmlFor="units">Units this month</label>
          <div className="control">
            <input id="units" inputMode="numeric" value={units} onChange={(e) => setUnits(e.target.value.replace(/\D/g, "").slice(0, 5))} placeholder="e.g. 300" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="category">Consumer category</label>
          <div className="control sel">
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <p className="tool-hint">{CATEGORIES.find(([v]) => v === category)?.[2]} {category !== autoCategory && u > 0 ? `At ${u} units most households are ${autoCategory}.` : ""}</p>
        </div>
        <div className="field">
          <label htmlFor="load">Sanctioned load (kW)</label>
          <div className="control">
            <input id="load" inputMode="decimal" value={load} onChange={(e) => setLoad(e.target.value.replace(/[^\d.]/g, "").slice(0, 4))} placeholder="e.g. 2" />
          </div>
          <p className="tool-hint">Printed on the bill. Most homes are 1 to 4 kW; 5 kW and above is billed Time-of-Use, use the <a href="/mdi-calculator">MDI calculator</a>.</p>
        </div>
        <div className="field">
          <label htmlFor="phase">Connection</label>
          <div className="control sel">
            <select id="phase" value={phase} onChange={(e) => setPhase(e.target.value)}>
              <option value="single">Single-phase</option>
              <option value="three">Three-phase</option>
            </select>
          </div>
        </div>
        <label className="tool-check">
          <input type="checkbox" checked={includeAdj} onChange={(e) => setIncludeAdj(e.target.checked)} />
          Include {month} adjustments ({fcaPerUnit >= 0 ? "+" : "−"}Rs {Math.abs(fcaPerUnit).toFixed(4)} fuel, {qtaPerUnit >= 0 ? "+" : "−"}Rs {Math.abs(qtaPerUnit).toFixed(4)} quarterly, per unit)
        </label>
      </div>

      <div className="tool-result" aria-live="polite">
        <div className="tool-total">
          <span className="tool-total-k">Estimated bill before taxes</span>
          <span className="tool-total-v">{rs(result.subtotal)}</span>
          <span className="tool-total-n">{result.units} units · about Rs {result.perUnit.toFixed(2)} per unit all-in</span>
        </div>
        {warn && <p className="tool-warn">{warn}</p>}
        <table className="tool-lines">
          <tbody>
            {result.lines.map((l) => (
              <tr key={l.label}>
                <td>{l.label}</td>
                <td>{rs(l.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {result.slabSaving && result.slabSaving.saving > 0 && (
          <p className="tool-tip">
            Cut {result.slabSaving.unitsToCut} unit{result.slabSaving.unitsToCut === 1 ? "" : "s"} to {result.slabSaving.targetUnits} and the whole month reprices in the lower slab:
            about <strong>{rs(result.slabSaving.saving)}</strong> less.
          </p>
        )}
        {nextBound && u > 0 && (
          <p className="tool-tip tool-tip--muted">
            {nextBound - u} more unit{nextBound - u === 1 ? "" : "s"} would cross into the next slab.
          </p>
        )}
        <p className="tool-note">
          Taxes, electricity duty, the PTV fee and any arrears are added on the real bill and depend on your province and
          category. Rates: NEPRA S.R.O. 279(I)/2026. This is an estimate, not a bill.
        </p>
      </div>
    </div>
  );
}
