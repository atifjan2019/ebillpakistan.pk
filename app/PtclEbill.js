"use client";

// PTCL's e-bill, shown on this site.
//
// PTCL texts and emails a one-off link (prism.ptcl.net.pk/b/<token>) for every
// invoice. That page sends Access-Control-Allow-Origin: *, so the visitor's own
// browser can fetch it, and we parse the invoice (lib/ptclBill.js) and render it
// here in the site's layout. The link is kept only on this device, the HTML is
// never sent to our server, and the original page is one tap away.
import { useEffect, useState } from "react";
import { parsePtclBill } from "../lib/ptclBill";
import { fmtMoney } from "../lib/billData";
import { parseBillDate, todayPkIso, daysBetween } from "../lib/dates";
import ReminderButton from "./result/ReminderButton";

function Row({ label, value, mono }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="bv-row">
      <dt>{label}</dt>
      <dd className={mono ? "mono" : undefined}>{value}</dd>
    </div>
  );
}

const KEY = "ebp:utility:ptcl:link";
const OK = /^https:\/\/prism\.ptcl\.net\.pk\/b\/[A-Za-z0-9+/=]+$/;

const LINES = [
  ["telephone", "Telephone"], ["basic", "Basic line rent"], ["bundle", "Bundle"], ["installation", "Installation charges"],
  ["tv", "TV"], ["vas", "Value added services / paper bill"], ["extraUsage", "Extra usage beyond FUP"], ["equipment", "Modem and equipment"],
  ["discount", "Discount"], ["adjustment", "Adjustment"], ["serviceTotal", "Total service charges"], ["arrears", "Arrears / upfront payment"],
  ["credit", "Credit"], ["salesTax", "FED / sales tax"], ["whTax", "Withholding tax"], ["lateSurcharge", "Late payment surcharge"],
];

export default function PtclEbill() {
  const [link, setLink] = useState("");
  const [state, setState] = useState({ status: "idle", bill: null, error: null });

  useEffect(() => {
    try { setLink(localStorage.getItem(KEY) || ""); } catch {}
  }, []);

  const valid = OK.test(link.trim());
  const change = (v) => {
    setLink(v);
    setState({ status: "idle", bill: null, error: null });
    try { if (OK.test(v.trim())) localStorage.setItem(KEY, v.trim()); } catch {}
  };

  const show = async (e) => {
    e.preventDefault();
    if (!valid) return;
    setState({ status: "loading", bill: null, error: null });
    try {
      const res = await fetch(link.trim(), { cache: "no-store", signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`PTCL answered ${res.status}`);
      const bill = parsePtclBill(await res.text());
      if (!bill) throw new Error("That page did not look like a PTCL invoice.");
      setState({ status: "done", bill, error: null });
    } catch (err) {
      setState({ status: "error", bill: null, error: err?.message || "Could not open the e-bill." });
    }
  };

  const b = state.bill;
  const dueIso = b?.dueDate ? parseBillDate(b.dueDate) : null;
  const reminderIso = dueIso && daysBetween(todayPkIso(), dueIso) >= 0 ? dueIso : null;

  return (
    <>
      <form className="search-card handoff" onSubmit={show}>
        <div className="search-grid solo">
          <div className="field">
            <label htmlFor="ptcl-ebill">E-bill link from PTCL&apos;s SMS or email</label>
            <div className="control">
              <input id="ptcl-ebill" type="url" inputMode="url" autoComplete="off" placeholder="https://prism.ptcl.net.pk/b/..." value={link} onChange={(e) => change(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={!valid || state.status === "loading"}>
            {state.status === "loading" ? "Opening…" : "Show my bill"}
          </button>
        </div>
        <p className="search-foot">
          The bill is fetched by your own browser and shown here. No picture code, and the link stays on this device.
        </p>
      </form>

      {state.status === "error" && (
        <div className="fallback-card" role="alert" style={{ marginTop: 16 }}>
          <p><b>Couldn&apos;t read that e-bill.</b> {state.error}</p>
          <p><a className="btn btn-ghost" href={link.trim()} target="_blank" rel="noopener noreferrer">Open the link on PTCL&apos;s site →</a></p>
        </div>
      )}

      {b && (
        <div className="bill-card" style={{ marginTop: 20 }}>
          <div className="bv-head">
            <div>
              <span className="bv-co">PTCL</span>
              {b.billingMonth && <span className="bv-month">{b.billingMonth}</span>}
            </div>
            <span className="tag"><span className="dot" /> From PTCL&apos;s e-bill</span>
          </div>

          <div className="bv-headline">
            <span className="bv-headline-label">Payable within due date</span>
            <strong className="bv-headline-amount">{fmtMoney(b.amountDue) ?? "Rs 0"}</strong>
            {b.dueDate && <span className="bv-headline-due">Due <b>{b.dueDate}</b></span>}
            {b.amountAfterDue != null && <span className="bv-headline-after">After the due date: <b>{fmtMoney(b.amountAfterDue)}</b></span>}
          </div>

          <dl className="bv-grid">
            <Row label="Phone number" value={b.phone} mono />
            <Row label="Account ID" value={b.accountId} mono />
            <Row label="Customer name" value={b.name} />
            <Row label="Address" value={b.address} />
            <Row label="Invoice number" value={b.invoice} mono />
            <Row label="Issue date" value={b.issueDate} />
            <Row label="Billing month" value={b.billingMonth} />
            <Row label="Data used" value={b.usageGb != null ? `${b.usageGb} GB${b.usageCapGb ? ` of ${b.usageCapGb} GB` : ""}` : null} />
            {b.packages.map((pk, i) => <Row key={i} label={i === 0 ? "Package" : ""} value={pk} />)}
          </dl>

          <div className="bv-charges">
            <h3>What makes up this bill</h3>
            <ul className="bv-lines">
              {LINES.filter(([k]) => b.charges[k] != null && b.charges[k] !== 0).map(([k, label]) => (
                <li key={k} className={`bv-line${/Tax/.test(label) ? " bv-line--tax" : ""}`}>
                  <span className="bv-line-label">{label}</span>
                  <span className="bv-line-amt">{fmtMoney(b.charges[k])}</span>
                </li>
              ))}
              {b.charges.grandTotal != null && (
                <li className="bv-line bv-line--total">
                  <span className="bv-line-label">Grand total</span>
                  <span className="bv-line-amt">{fmtMoney(b.charges.grandTotal)}</span>
                </li>
              )}
            </ul>
            {b.charges.grandTotal != null && b.charges.grandTotal < 0 && (
              <p className="small" style={{ padding: "0 18px 14px" }}>A negative grand total means PTCL owes you a credit; nothing is due this month.</p>
            )}
          </div>
        </div>
      )}

      {b && reminderIso && b.accountId && (
        <ReminderButton disco="ptcl" discoName="PTCL" dueIso={reminderIso} last4={String(b.accountId).slice(-4)} />
      )}
      {b && (
        <p style={{ marginTop: 16 }}>
          <a className="btn btn-ghost" href={link.trim()} target="_blank" rel="noopener noreferrer">Open the original e-bill →</a>
        </p>
      )}
    </>
  );
}
