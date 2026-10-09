"use client";

import { useMemo, useState } from "react";
import { estimateSolar } from "../../lib/billMath";

const rs = (n) => `Rs ${Math.round(n).toLocaleString("en-PK")}`;

export default function SolarCalculator({ fcaPerUnit, qtaPerUnit, exportRateDefault }) {
  const [units, setUnits] = useState("600");
  const [kw, setKw] = useState("5");
  const [sun, setSun] = useState("4");
  const [selfUse, setSelfUse] = useState("40");
  const [exportRate, setExportRate] = useState(String(exportRateDefault));
  const [costPerKw, setCostPerKw] = useState("");
  const [category, setCategory] = useState("unprotected");
  const [load, setLoad] = useState("3");

  const r = useMemo(
    () =>
      estimateSolar({
        monthlyUnits: units,
        systemKw: kw,
        unitsPerKwPerDay: Number(sun) || 0,
        selfUseShare: Math.min(100, Number(selfUse) || 0) / 100,
        exportRate: Number(exportRate) || 0,
        systemCostPerKw: Number(costPerKw) || 0,
        category,
        sanctionedLoad: load,
        fcaPerUnit,
        qtaPerUnit,
      }),
    [units, kw, sun, selfUse, exportRate, costPerKw, category, load, fcaPerUnit, qtaPerUnit]
  );
  const dec = (v) => v.replace(/[^\d.]/g, "").slice(0, 8);
  const int = (v) => v.replace(/\D/g, "").slice(0, 8);

  return (
    <div className="tool">
      <div className="tool-form">
        <div className="field">
          <label htmlFor="sunits">Units you use a month</label>
          <div className="control"><input id="sunits" inputMode="numeric" value={units} onChange={(e) => setUnits(int(e.target.value))} /></div>
          <p className="tool-hint">Your summer figure gives the biggest saving; use an average for a fair year.</p>
        </div>
        <div className="field">
          <label htmlFor="skw">System size (kW)</label>
          <div className="control"><input id="skw" inputMode="decimal" value={kw} onChange={(e) => setKw(dec(e.target.value))} /></div>
        </div>
        <div className="field">
          <label htmlFor="ssun">Units per kW per day</label>
          <div className="control"><input id="ssun" inputMode="decimal" value={sun} onChange={(e) => setSun(dec(e.target.value))} /></div>
          <p className="tool-hint">Average daily output per installed kW. Around 4 in most of Pakistan; lower in winter and in dusty or shaded sites.</p>
        </div>
        <div className="field">
          <label htmlFor="sself">Share used at home (%)</label>
          <div className="control"><input id="sself" inputMode="numeric" value={selfUse} onChange={(e) => setSelfUse(int(e.target.value).slice(0, 3))} /></div>
          <p className="tool-hint">Solar generates in the day; what you do not use then is exported. 30 to 50 percent is typical without a battery.</p>
        </div>
        <div className="field">
          <label htmlFor="sexp">Export rate (Rs per unit)</label>
          <div className="control"><input id="sexp" inputMode="decimal" value={exportRate} onChange={(e) => setExportRate(dec(e.target.value))} /></div>
          <p className="tool-hint">What the DISCO credits for exported units under net billing. Check the figure in your net-metering agreement.</p>
        </div>
        <div className="field">
          <label htmlFor="scost">System cost per kW (Rs, optional)</label>
          <div className="control"><input id="scost" inputMode="numeric" value={costPerKw} onChange={(e) => setCostPerKw(int(e.target.value))} placeholder="from your installer's quote" /></div>
        </div>
        <div className="field">
          <label htmlFor="scat">Your tariff category</label>
          <div className="control sel">
            <select id="scat" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="unprotected">Unprotected</option>
              <option value="protected">Protected</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="sload">Sanctioned load (kW)</label>
          <div className="control"><input id="sload" inputMode="decimal" value={load} onChange={(e) => setLoad(dec(e.target.value))} /></div>
        </div>
      </div>

      <div className="tool-result" aria-live="polite">
        <div className="tool-total tool-total--ok">
          <span className="tool-total-k">Estimated monthly saving</span>
          <span className="tool-total-v">{rs(r.monthlySaving)}</span>
          <span className="tool-total-n">{r.generated} units generated · {r.selfUsed} used at home · {r.exported} exported</span>
        </div>
        <table className="tool-lines">
          <tbody>
            <tr><td>Bill before solar (before taxes)</td><td>{rs(r.before.subtotal)}</td></tr>
            <tr><td>Bill after using {r.selfUsed} solar units at home</td><td>{rs(r.after.subtotal)}</td></tr>
            <tr><td>Saving on the bill</td><td>{rs(r.billSaving)}</td></tr>
            <tr><td>Credit for {r.exported} exported units</td><td>{rs(r.exportCredit)}</td></tr>
          </tbody>
        </table>
        {r.before.row && r.after.row && r.before.row.slab !== r.after.row.slab && (
          <p className="tool-tip">Using solar at home drops you from the {r.before.row.slab} slab to {r.after.row.slab}, which reprices every remaining grid unit. That is most of the saving.</p>
        )}
        {r.paybackYears != null && (
          <p className="tool-tip">A system costing {rs(r.cost)} pays back in about <strong>{r.paybackYears.toFixed(1)} years</strong> at this saving, before panel degradation, maintenance and any change in tariffs.</p>
        )}
        <p className="tool-note">
          Every assumption above is editable and the result is only as good as them. Export credit is valued at the rate you
          entered; bill savings use NEPRA&apos;s notified domestic rates and this month&apos;s adjustments, before taxes.
        </p>
      </div>
    </div>
  );
}
