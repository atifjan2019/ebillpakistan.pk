// The parsed bill, rendered on our own domain.
//
// Deliberately NOT a <table>: identity fields and charge lines are definition
// lists and a flex list, which reflow to a single column on a phone. This is the
// same approach /sample-bill-explained uses, and it is why the bill is readable
// at 360px without pinch-zoom or a sideways scroll.
import { fmtMoney, fmtUnits } from "../../lib/billData";

function Row({ label, value, mono }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="bv-row">
      <dt>{label}</dt>
      <dd className={mono ? "mono" : undefined}>{value}</dd>
    </div>
  );
}

export default function BillView({ bill, discoName, region, breakdown }) {
  const total = fmtMoney(bill.payableWithinDueDate);
  const after = fmtMoney(bill.payableAfterDueDate);

  return (
    <div className="bill-card" id="bill-print-area">
      <div className="bv-head">
        <div>
          <span className="bv-co">{discoName}</span>
          {bill.billMonth && <span className="bv-month">{bill.billMonth}</span>}
        </div>
        <span className="tag"><span className="dot" /> Live bill</span>
      </div>

      {/* headline amount first: it is the one number nearly everyone came for */}
      {total && (
        <div className="bv-headline">
          <span className="bv-headline-label">Payable within due date</span>
          <strong className="bv-headline-amount">{total}</strong>
          {bill.dueDate && (
            <span className="bv-headline-due">
              Due <b>{bill.dueDate}</b>
            </span>
          )}
          {after && (
            <span className="bv-headline-after">
              After the due date: <b>{after}</b>
            </span>
          )}
        </div>
      )}

      <dl className="bv-grid">
        <Row label="Reference No." value={bill.reference} mono />
        <Row label="Consumer name" value={bill.name} />
        <Row label="Address" value={bill.address} />
        <Row label="Tariff" value={bill.tariff} />
        <Row label="Sanctioned load" value={bill.sanctionedLoad} />
        <Row label="Units consumed" value={fmtUnits(bill.unitsConsumed)} />
        <Row label="Reading date" value={bill.readingDate} />
        <Row label="Billing month" value={bill.billMonth} />
      </dl>

      {breakdown && (
        <div className="bv-charges">
          <h3>What makes up this bill</h3>
          <ul className="bv-lines">
            {breakdown.map((l) => (
              <li key={l.id} className={`bv-line bv-line--${l.kind}`}>
                <span className="bv-line-label">{l.label}</span>
                <span className="bv-line-amt">{fmtMoney(l.amount)}</span>
              </li>
            ))}
            {total && (
              <li className="bv-line bv-line--total">
                <span className="bv-line-label">Payable within due date</span>
                <span className="bv-line-amt">{total}</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
