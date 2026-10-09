"use client";

import { useMemo, useState } from "react";
import { protectedCheck, estimateBill } from "../../lib/billMath";
import { PROTECTED } from "../../lib/tariffs";

const LABELS = ["6 months ago", "5 months ago", "4 months ago", "3 months ago", "2 months ago", "Last month"];
const rs = (n) => `Rs ${Math.round(n).toLocaleString("en-PK")}`;

export default function ProtectedChecker() {
  const [months, setMonths] = useState(["", "", "", "", "", ""]);
  const [load, setLoad] = useState("2");
  const result = useMemo(() => protectedCheck(months, Number(load) || 0), [months, load]);
  const set = (i, v) => setMonths((m) => m.map((x, j) => (j === i ? v.replace(/\D/g, "").slice(0, 5) : x)));
  const latest = Number(months[5]) || 0;
  const diff = latest > 0 && latest <= PROTECTED.unitThreshold
    ? estimateBill({ units: latest, category: "unprotected" }).subtotal - estimateBill({ units: latest, category: "protected" }).subtotal
    : null;

  return (
    <div className="tool">
      <div className="tool-form">
        <p className="tool-lead">Units billed in each of your last six bills. They are on the bill&apos;s history panel, or check each one on the homepage.</p>
        <div className="tool-months">
          {LABELS.map((l, i) => (
            <div className="field" key={l}>
              <label htmlFor={`m${i}`}>{l}</label>
              <div className="control">
                <input id={`m${i}`} inputMode="numeric" value={months[i]} onChange={(e) => set(i, e.target.value)} placeholder="units" />
              </div>
            </div>
          ))}
        </div>
        <div className="field">
          <label htmlFor="pload">Sanctioned load (kW)</label>
          <div className="control">
            <input id="pload" inputMode="decimal" value={load} onChange={(e) => setLoad(e.target.value.replace(/[^\d.]/g, "").slice(0, 4))} />
          </div>
          <p className="tool-hint">Printed on the bill. 5 kW and above is never protected.</p>
        </div>
      </div>

      <div className="tool-result" aria-live="polite">
        {result.ok === null && <p className="tool-empty">{result.reason}</p>}
        {result.ok === true && (
          <>
            <div className="tool-total tool-total--ok">
              <span className="tool-total-k">Result</span>
              <span className="tool-total-v">You qualify as protected</span>
              <span className="tool-total-n">{result.reason}</span>
            </div>
            <p className="tool-tip">
              Your headroom this month is {result.headroom} unit{result.headroom === 1 ? "" : "s"}. One month over {PROTECTED.unitThreshold} resets the six-month count.
              {diff != null && <> At {latest} units, protected rates save you about <strong>{rs(diff)}</strong> a month before tax compared with unprotected.</>}
            </p>
          </>
        )}
        {result.ok === false && (
          <>
            <div className="tool-total tool-total--bad">
              <span className="tool-total-k">Result</span>
              <span className="tool-total-v">Not protected at the moment</span>
              <span className="tool-total-n">{result.reason}</span>
            </div>
            {result.monthsNeeded != null && (
              <p className="tool-tip">
                Stay at or under {PROTECTED.unitThreshold} units for <strong>{result.monthsNeeded} more month{result.monthsNeeded === 1 ? "" : "s"}</strong> and the look-back is clean
                {result.cleanSince ? ` (the last ${result.cleanSince} ${result.cleanSince === 1 ? "month already counts" : "months already count"})` : ""}.
              </p>
            )}
          </>
        )}
        <p className="tool-note">
          Based on the notified definition: {PROTECTED.definition} The tariff code on your bill is what the DISCO actually applied; if it disagrees with this, the bill wins and is worth querying.
        </p>
      </div>
    </div>
  );
}
