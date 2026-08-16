// Shown only when we could not retrieve the bill ourselves.
//
// This REPLACES the old BillReady.js, which made every visitor watch a 10-second
// countdown and then bounced them to bill.pitc.com.pk in a new tab — on the
// happy path, not as a fallback. The countdown had no user-facing purpose
// (throttling is handled server-side by rateLimitBill in lib/store.js), and a
// page whose only function is to forward you elsewhere is the definition of a
// doorway page.
//
// Now: an honest error, a retry, and the official portal as the last resort.
export default function BillFallback({ discoName, reference, pitcUrl, reason }) {
  const COPY = {
    notfound: {
      title: "We couldn't find a bill for this number",
      body: "Check the reference number digit by digit — it is 8 to 14 digits with no spaces or dashes, and one wrong digit returns nothing rather than an error. Also make sure the company selected matches the one printed on your bill.",
    },
    upstream: {
      title: "The billing system didn't respond",
      body: "This is the official billing system being slow or unavailable, not a problem with your reference number. It is busiest in the last few days of the month. Trying again in a few minutes usually works.",
    },
    ratelimited: {
      title: "Too many lookups from this connection",
      body: "You've checked several bills in quick succession. Please wait a minute and try again.",
    },
  };
  const c = COPY[reason] || COPY.upstream;

  return (
    <div className="fallback-card">
      <div className="fallback-head">
        <span className="fallback-ic" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" />
          </svg>
        </span>
        <div>
          <h2>{c.title}</h2>
          <p>{c.body}</p>
        </div>
      </div>

      <div className="fallback-actions">
        <a className="btn btn-primary" href="/">Try another number</a>
        {reason !== "notfound" && reference && (
          <form action={pitcUrl} method="POST" target="_blank" rel="noopener noreferrer" encType="text/plain">
            <button type="submit" className="btn btn-ghost">
              Open on the official PITC portal →
            </button>
          </form>
        )}
      </div>

      {reference && (
        <p className="fallback-ref">
          Reference used: <b>{reference}</b>
          {discoName ? <> · {discoName}</> : null}
        </p>
      )}

      <p className="fallback-help">
        Still stuck? <a href="/contact">Tell us what happened</a> and we&apos;ll look into it, or read{" "}
        <a href="/blog/how-to-find-reference-number-on-electricity-bill">how to find your reference number</a>.
      </p>
    </div>
  );
}
