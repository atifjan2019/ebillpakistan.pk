"use client";

import { useMemo, useState } from "react";
import { estimateTou } from "../../lib/billMath";
import { A1_TOU } from "../../lib/tariffs";

const rs = (n) => `Rs ${Math.round(n).toLocaleString("en-PK")}`;

export default function MdiCalculator({ fcaPerUnit, qtaPerUnit, month }) {
  const [load, setLoad] = useState("7");
  const [mdi, setMdi] = useState("4.5");
  const [peak, setPeak] = useState("120");
  const [off, setOff] = useState("480");
  const [includeAdj, setIncludeAdj] = useState(true);
  const result = useMemo(
    () => estimateTou({ sanctionedLoad: load, mdi, peakUnits: peak, offPeakUnits: off, fcaPerUnit: includeAdj ? fcaPerUnit : 0, qtaPerUnit: includeAdj ? qtaPerUnit : 0 }),
    [load, mdi, peak, off, includeAdj, fcaPerUnit, qtaPerUnit]
  );
  const dec = (v) => v.replace(/[^\d.]/g, "").slice(0, 6);
  const int = (v) => v.replace(/\D/g, "").slice(0, 6);
  const halfLoad = (Number(load) || 0) * 0.5;

  return (
    <div className="tool">
      <div className="tool-form">
        <div className="field">
          <label htmlFor="tload">Sanctioned load (kW)</label>
          <div className="control"><input id="tload" inputMode="decimal" value={load} onChange={(e) => setLoad(dec(e.target.value))} /></div>
          <p className="tool-hint">5 kW or more. Half of this is the floor for the fixed charge: {halfLoad.toFixed(1)} kW here.</p>
        </div>
        <div className="field">
          <label htmlFor="mdi">MDI this month (kW)</label>
          <div className="control"><input id="mdi" inputMode="decimal" value={mdi} onChange={(e) => setMdi(dec(e.target.value))} /></div>
          <p className="tool-hint">Maximum demand indicator, printed on a ToU bill. The highest average load you drew in any half-hour.</p>
        </div>
        <div className="field">
          <label htmlFor="peak">Peak units</label>
          <div className="control"><input id="peak" inputMode="numeric" value={peak} onChange={(e) => setPeak(int(e.target.value))} /></div>
        </div>
        <div className="field">
          <label htmlFor="off">Off-peak units</label>
          <div className="control"><input id="off" inputMode="numeric" value={off} onChange={(e) => setOff(int(e.target.value))} /></div>
        </div>
        <label className="tool-check">
          <input type="checkbox" checked={includeAdj} onChange={(e) => setIncludeAdj(e.target.checked)} />
          Include {month} adjustments on every unit
        </label>
      </div>

      <div className="tool-result" aria-live="polite">
        <div className="tool-total">
          <span className="tool-total-k">Estimated bill before taxes</span>
          <span className="tool-total-v">{rs(result.subtotal)}</span>
          <span className="tool-total-n">{result.units} units · fixed charge on {result.billedKw.toFixed(1)} kW ({result.basis === "mdi" ? "your MDI" : "half your sanctioned load"})</span>
        </div>
        <table className="tool-lines">
          <tbody>
            {result.lines.map((l) => (
              <tr key={l.label}><td>{l.label}</td><td>{rs(l.amount)}</td></tr>
            ))}
          </tbody>
        </table>
        {result.basis === "mdi" && (
          <p className="tool-tip">
            Your MDI is above half your sanctioned load, so it sets the fixed charge. Bringing the peak draw down to {halfLoad.toFixed(1)} kW would cut it to {rs(A1_TOU.fixed * halfLoad)}.
          </p>
        )}
        <p className="tool-note">
          Domestic Time-of-Use rates from S.R.O. 279(I)/2026: Rs {A1_TOU.peak} peak, Rs {A1_TOU.offPeak} off-peak, Rs {A1_TOU.fixed} per kW fixed. Commercial and
          industrial tariffs have their own MDI rules and rates and are not covered here. Taxes are added on the real bill.
        </p>
      </div>
    </div>
  );
}
