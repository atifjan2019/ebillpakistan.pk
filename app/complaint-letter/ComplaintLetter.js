"use client";

import { useMemo, useState } from "react";
import { PROBLEMS, buildLetter } from "../../lib/complaintLetter";

// Which extra fields each problem needs.
const NEEDS = {
  reading: ["billedUnits", "actualUnits", "readingDate"],
  excessive: ["billedUnits", "amount"],
  estimated: ["billedUnits", "actualUnits"],
  meter: ["billedUnits"],
  detection: ["amount"],
  paid: ["amount", "paidOn", "paidVia"],
  tariff: [],
};
const LABELS = {
  billedUnits: ["Units billed", "e.g. 412"],
  actualUnits: ["Units you believe are correct", "e.g. 268"],
  readingDate: ["Date of your own reading", "e.g. 5 October 2026"],
  amount: ["Amount in question (Rs)", "e.g. 18,450"],
  paidOn: ["Date you paid", "e.g. 2 October 2026"],
  paidVia: ["Paid through", "e.g. JazzCash, HBL app, bank counter"],
};

export default function ComplaintLetter({ companies }) {
  const [lang, setLang] = useState("en");
  const [f, setF] = useState({
    code: "", name: "", reference: "", address: "", phone: "", subdivision: "", month: "", problem: "reading",
    billedUnits: "", actualUnits: "", readingDate: "", amount: "", paidOn: "", paidVia: "", details: "",
  });
  const [copied, setCopied] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const company = companies.find((c) => c.code === f.code);
  const letter = useMemo(
    () => buildLetter({ ...f, abbr: company?.abbr, companyFull: company?.full }, lang),
    [f, company, lang]
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the text is selectable on screen */
    }
  };
  const print = () => {
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    const esc = letter.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    w.document.write(
      `<!doctype html><html lang="${lang}" dir="${lang === "ur" ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>Complaint letter</title>` +
        `<style>body{font:16px/1.9 ${lang === "ur" ? "'Noto Nastaliq Urdu','Jameel Noori Nastaleeq',serif" : "Georgia,serif"};margin:48px;white-space:pre-wrap;color:#111}</style></head><body>${esc}</body></html>`
    );
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div className="tool tool--wide">
      <div className="tool-form">
        <div className="cl-lang" role="group" aria-label="Letter language">
          <button type="button" className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>English</button>
          <button type="button" className={lang === "ur" ? "on" : ""} onClick={() => setLang("ur")} lang="ur">اردو</button>
        </div>

        <div className="field">
          <label htmlFor="cl-problem">What is wrong?</label>
          <div className="control sel">
            <select id="cl-problem" value={f.problem} onChange={set("problem")}>
              {PROBLEMS.map(([id, en]) => (
                <option key={id} value={id}>{en}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="cl-grid">
          <div className="field">
            <label htmlFor="cl-code">Company</label>
            <div className="control sel">
              <select id="cl-code" value={f.code} onChange={set("code")}>
                <option value="">Select your company</option>
                {companies.map((c) => (
                  <option key={c.code} value={c.code}>{c.abbr}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="cl-ref">Reference number</label>
            <div className="control"><input id="cl-ref" inputMode="numeric" value={f.reference} onChange={(e) => setF((x) => ({ ...x, reference: e.target.value.replace(/\D/g, "").slice(0, 14) }))} placeholder="14 digits" /></div>
          </div>
          <div className="field">
            <label htmlFor="cl-name">Your name</label>
            <div className="control"><input id="cl-name" value={f.name} onChange={set("name")} placeholder="As on the bill" autoComplete="name" /></div>
          </div>
          <div className="field">
            <label htmlFor="cl-phone">Mobile number</label>
            <div className="control"><input id="cl-phone" inputMode="tel" value={f.phone} onChange={set("phone")} placeholder="03xx xxxxxxx" autoComplete="tel" /></div>
          </div>
          <div className="field cl-wide">
            <label htmlFor="cl-address">Address of the connection</label>
            <div className="control"><input id="cl-address" value={f.address} onChange={set("address")} placeholder="As on the bill" /></div>
          </div>
          <div className="field">
            <label htmlFor="cl-sub">Sub-division</label>
            <div className="control"><input id="cl-sub" value={f.subdivision} onChange={set("subdivision")} placeholder="Printed on the bill" /></div>
          </div>
          <div className="field">
            <label htmlFor="cl-month">Billing month</label>
            <div className="control"><input id="cl-month" value={f.month} onChange={set("month")} placeholder="e.g. October 2026" /></div>
          </div>
          {NEEDS[f.problem].map((k) => (
            <div className="field" key={k}>
              <label htmlFor={`cl-${k}`}>{LABELS[k][0]}</label>
              <div className="control"><input id={`cl-${k}`} value={f[k]} onChange={set(k)} placeholder={LABELS[k][1]} /></div>
            </div>
          ))}
          <div className="field cl-wide">
            <label htmlFor="cl-details">{f.problem === "tariff" ? "What is wrong with the tariff" : "Anything else to add (optional)"}</label>
            <div className="control"><textarea id="cl-details" rows={3} value={f.details} onChange={set("details")} placeholder={f.problem === "tariff" ? "e.g. This is a house, but it is billed on A-2 commercial." : "e.g. The meter reader has not visited for two months."} dir={lang === "ur" ? "rtl" : "ltr"} /></div>
          </div>
        </div>
        <p className="tool-note">Nothing you type here leaves your device. The letter is built in your browser; we never see it.</p>
      </div>

      <div className="tool-result">
        <div className="cl-letter" lang={lang} dir={lang === "ur" ? "rtl" : "ltr"}>{letter}</div>
        <div className="cl-actions">
          <button type="button" className="btn btn-primary" onClick={copy}>{copied ? "Copied" : "Copy letter"}</button>
          <button type="button" className="btn btn-ghost" onClick={print}>Print</button>
          <a className="btn btn-ghost" href={`https://wa.me/?text=${encodeURIComponent(letter)}`} target="_blank" rel="noopener noreferrer">Send on WhatsApp</a>
        </div>
        {company?.phone && (
          <p className="tool-tip tool-tip--muted">
            {company.abbr} complaints: <a href={`tel:${company.phone.replace(/[^\d+]/g, "")}`}>{company.phone}</a>. More numbers and offices on the{" "}
            <a href={`/${company.code}-bill-check#complaints`}>{company.abbr} page</a>.
          </p>
        )}
        <p className="tool-note">Fill in anything still in [square brackets] before you send it. Keep a copy, and get it stamped as received if you hand it in.</p>
      </div>
    </div>
  );
}
