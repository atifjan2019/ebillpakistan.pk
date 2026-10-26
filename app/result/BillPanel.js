// Everything shown once a bill has been retrieved. Shared by the server path
// (page.js fetched the bill itself) and the browser path (BillResult.js fetched
// it from the visitor's own connection), so both render the identical page.
import { chargeBreakdown, protectedStatus, slabPosition, slabSaving, monthOverMonth, largestSurcharge, effectiveRate, anomalyCheck } from "../../lib/billAnalysis";
import { categoryFor } from "../../lib/tariffs";
import { parseBillDate, todayPkIso, daysBetween } from "../../lib/dates";
import BillView from "./BillView";
import BillAnalysis from "./BillAnalysis";
import BillActions from "./BillActions";
import RememberLookup from "../RememberLookup";
import UsageChart from "./UsageChart";
import ReminderButton from "./ReminderButton";

export default function BillPanel({ bill, disco, info, reference, pitcUrl, adjustments }) {
  const ref = reference;
  const slab = slabPosition(bill.unitsConsumed);
  const breakdown = chargeBreakdown(bill);
  const protectedInfo = protectedStatus(bill);
  // The tariff code on the bill wins; units are only a fallback.
  const billCategory = protectedInfo?.declared === true ? "protected" : categoryFor(bill.unitsConsumed);
  // A reminder is only offered when the due date reads cleanly and has not passed.
  const parsedDue = parseBillDate(bill.dueDate);
  const dueIso = parsedDue && daysBetween(todayPkIso(), parsedDue) >= 0 ? parsedDue : null;

  return (
    <>
      <RememberLookup disco={disco} reference={ref} discoName={info[0]} />
      <BillView bill={bill} discoName={info[0]} region={info[1]} breakdown={breakdown} />
      <BillActions bill={bill} discoName={info[0]} lines={breakdown} />
      {dueIso && <ReminderButton disco={disco} discoName={info[0]} dueIso={dueIso} last4={ref.slice(-4)} />}

      <UsageChart bill={bill} />

      <BillAnalysis
        slab={slab}
        mom={monthOverMonth(bill)}
        breakdown={breakdown}
        largest={largestSurcharge(breakdown)}
        protectedInfo={protectedInfo}
        saving={slabSaving(bill, slab, billCategory)}
        adjustments={adjustments}
        effective={effectiveRate(bill)}
        anomaly={anomalyCheck(bill)}
        discoAbbr={info[0]}
      />

      <div className="tool-links result-next">
        <a className="tool-link" href={`https://ccms.pitc.com.pk/FeederDetails?reference=${encodeURIComponent(ref)}`} target="_blank" rel="noopener noreferrer"><b>Is the power on?</b><span>Your feeder&apos;s live status on the official PITC portal.</span></a>
        <a className="tool-link" href="/complaint-letter"><b>Think this bill is wrong?</b><span>Write a complaint letter to your SDO in a minute.</span></a>
        <a className="tool-link" href={bill.unitsConsumed != null ? `/bill-calculator?units=${bill.unitsConsumed}` : "/bill-calculator"}><b>Check the arithmetic</b><span>What these units should cost at NEPRA&apos;s rates.</span></a>
      </div>

      <details className="orig-bill">
        <summary>View the original bill on the official PITC portal</summary>
        <p>
          The figures above are the ones the official system issued for this reference. If you
          need the original printed layout — for a bank counter that wants it — open it here.
        </p>
        <form action={pitcUrl} method="POST" target="_blank" rel="noopener noreferrer" encType="text/plain">
          <button type="submit" className="btn btn-ghost">Open the official bill →</button>
        </form>
      </details>
    </>
  );
}
