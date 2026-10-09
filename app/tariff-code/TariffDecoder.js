"use client";

import { useMemo, useState } from "react";
import { decodeTariff } from "../../lib/tariffCodes";

const EXAMPLES = ["A-1a(01)", "A-1(b)", "A-2a", "B-2(b)", "D-2", "C-1(b)"];

export default function TariffDecoder() {
  const [code, setCode] = useState("");
  const result = useMemo(() => decodeTariff(code), [code]);

  return (
    <div className="tool">
      <div className="tool-form">
        <div className="field">
          <label htmlFor="tcode">Tariff code on your bill</label>
          <div className="control">
            <input id="tcode" value={code} onChange={(e) => setCode(e.target.value.slice(0, 20))} placeholder="e.g. A-1a(01)" autoCapitalize="characters" autoComplete="off" spellCheck={false} />
          </div>
          <p className="tool-hint">Printed near the top of the bill, labelled Tariff. Type it as you see it; spaces, dashes and brackets do not matter.</p>
        </div>
        <div className="tc-examples">
          <span>Try:</span>
          {EXAMPLES.map((e) => (
            <button type="button" key={e} onClick={() => setCode(e)}>{e}</button>
          ))}
        </div>
      </div>

      <div className="tool-result" aria-live="polite">
        {!code.trim() && <p className="tool-empty">Enter the code to see what it means.</p>}
        {code.trim() && !result && (
          <p className="tool-warn">We could not find a tariff category in that. Codes start with a letter from A to K, such as A-1, B-2 or D-2. Check the Tariff field on your bill.</p>
        )}
        {result && (
          <>
            <div className="tool-total">
              <span className="tool-total-k">Tariff {result.family.letter}</span>
              <span className="tool-total-v tc-name">{result.family.name}</span>
              <span className="tool-total-n">{result.family.who}</span>
            </div>
            {result.sub && (
              <table className="tool-lines">
                <tbody>
                  <tr><td><b>{result.sub[0]}</b>: {result.sub[1]}{result.sub[2] ? <><br /><span className="tc-note">{result.sub[2]}</span></> : null}</td><td /></tr>
                </tbody>
              </table>
            )}
            {!result.sub && result.family.subs.length > 0 && (
              <table className="tool-lines">
                <tbody>
                  {result.family.subs.map((s) => (
                    <tr key={s[0]}><td><b>{s[0]}</b>: {s[1]}{s[2] ? <><br /><span className="tc-note">{s[2]}</span></> : null}</td><td /></tr>
                  ))}
                </tbody>
              </table>
            )}
            {result.family.letter === "A-1" && (
              <p className="tool-tip">
                Whether you pay lifeline, protected or unprotected rates depends on your units over the last six months, not on
                this code alone. <a href="/protected-consumer-checker">Check your six months</a>.
              </p>
            )}
            {result.extra && (
              <p className="tool-tip tool-tip--muted">
                The number in brackets ({result.extra}) is your company&apos;s own billing sub-code. It does not change the category above.
              </p>
            )}
            {result.family.links.length > 0 && (
              <p className="tc-links">
                {result.family.links.map(([href, label]) => (
                  <a key={href} className="btn btn-ghost" href={href}>{label}</a>
                ))}
              </p>
            )}
            <p className="tool-note">
              Categories are those of NEPRA&apos;s notified Schedule of Tariff. If the category on your bill does not match how the
              premises is actually used, for example a home billed as commercial, that is worth a complaint.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
