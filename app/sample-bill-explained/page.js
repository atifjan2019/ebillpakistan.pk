import { SITE_URL, buildMeta } from "../../lib/seo";
import { SAMPLE_HEADER, SAMPLE_LINES, SAMPLE_MATH, SAMPLE_NOTICE } from "../../lib/sampleBill";

export const metadata = buildMeta({
  title: "Electricity Bill Explained Line by Line — Annotated Sample Bill",
  description:
    "An annotated sample Pakistani electricity bill: what the reference number, units, FPA, quarterly adjustment, GST, TV fee, meter rent, arrears and late payment surcharge each mean.",
  path: "/sample-bill-explained",
  imageAlt: "Annotated sample electricity bill — eBill Pakistan",
});

const FAQS = [
  [
    "Why are there two different totals on my electricity bill?",
    "One is the amount payable within the due date and the other is the amount payable after it. The second figure includes the late payment surcharge. Always check which of the two a payment counter or app is asking for — paying the higher figure when you did not need to is money you do not get back.",
  ],
  [
    "Which line is the actual cost of the electricity I used?",
    "Only the 'cost of electricity' (current charges) line. Everything below it — fuel price adjustment, quarterly adjustment, fixed charges, duty, GST and the TV fee — is added on top, which is why a bill is usually far larger than units × the headline rate.",
  ],
  [
    "What is the difference between the FPA and the quarterly tariff adjustment?",
    "Both are per-unit adjustments set nationally rather than by your distribution company, but they run on different cycles. The fuel price adjustment changes every month and reflects what fuel actually cost the generators about two months earlier. The quarterly tariff adjustment is fixed for a period at a time and reconciles capacity and transmission costs, so it can sit unchanged for months and then step up.",
  ],
  [
    "Why do I pay fixed charges and meter rent when I barely used any electricity?",
    "Because they are not charges for electricity. Fixed charges pay for capacity being held available to your connection, and meter rent pays for the meter itself, which belongs to the distribution company. Both apply regardless of usage, which is why a nearly empty house still gets a bill that is not nearly zero.",
  ],
  [
    "Is this a real bill?",
    "No. Every figure on this page is invented, the reference number is all zeros and the consumer is 'Sample Consumer'. It exists to explain the layout, not to state what anything currently costs. To see your own real bill, enter your 14-digit reference number on the homepage.",
  ],
];

const money = (n) =>
  n.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function SampleBillExplained() {
  const pageUrl = `${SITE_URL}/sample-bill-explained`;
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Sample bill explained", item: pageUrl },
    ],
  };

  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="container legal-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span>{" "}
          <span aria-current="page">Sample bill explained</span>
        </nav>

        <h1>Your Electricity Bill Explained, Line by Line</h1>
        <p className="legal-updated">Last updated: 16 August 2026</p>
        <p className="legal-intro">
          A Pakistani electricity bill packs fifteen or more numbers onto one page, and only one of
          them is the cost of the electricity you actually used. Below is a complete sample bill with
          every field annotated: what it is, where it comes from, and whether you can do anything
          about it. Once you can read this one, you can read your own.
        </p>

        <p className="sample-warning" role="note">
          <strong>This is not a real bill.</strong> {SAMPLE_NOTICE}
        </p>

        {/* ---------- the facsimile ---------- */}
        <div className="sample-bill">
          <div className="sample-bill-top">
            <span className="sample-stamp">SAMPLE</span>
            <h2>Electricity bill — August 2026</h2>
          </div>

          <dl className="sample-head">
            {SAMPLE_HEADER.map(({ label, value, mono }) => (
              <div key={label} className="sample-head-row">
                <dt>{label}</dt>
                <dd className={mono ? "mono" : undefined}>{value}</dd>
              </div>
            ))}
          </dl>

          <ul className="sample-lines">
            {SAMPLE_LINES.filter((l) => l.kind !== "id" && l.kind !== "status").map((l) => (
              <li key={l.id} className={`sample-line sample-line--${l.kind}`}>
                <a href={`#f-${l.id}`}>{l.label}</a>
                <span className="sample-amount">{l.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- annotations ---------- */}
        <h2 className="sample-h2">Every field, annotated</h2>
        <p className="sample-lede">
          Each card below is one field from the bill above. On a phone they read top to bottom as
          plain field-name and meaning pairs — nothing here needs to be pinched or zoomed.
        </p>

        <div className="field-cards">
          {SAMPLE_LINES.map((l) => (
            <article key={l.id} id={`f-${l.id}`} className={`field-card field-card--${l.kind}`}>
              <h3>{l.label}</h3>
              <p className="field-value">
                <span className="field-value-tag">On the sample bill</span>
                <span className="field-value-num">{l.amount}</span>
              </p>
              <p className="field-meaning">{l.meaning}</p>
            </article>
          ))}
        </div>

        <div className="prose">
          <h2>How the total is actually built</h2>
          <p>
            The order matters, because each step is calculated on the one before it rather than on
            the energy charge alone. On the sample bill it goes like this:
          </p>
          <ol className="sample-math">
            {SAMPLE_MATH.components.map(([label, n]) => (
              <li key={label}>
                <span>{label}</span>
                <b>Rs {money(n)}</b>
              </li>
            ))}
            <li className="sample-math-total">
              <span>Payable within due date</span>
              <b>Rs {money(SAMPLE_MATH.payableWithin)}</b>
            </li>
            <li>
              <span>Late payment surcharge (if you pay late)</span>
              <b>Rs {money(SAMPLE_MATH.lateSurcharge)}</b>
            </li>
            <li className="sample-math-total">
              <span>Payable after due date</span>
              <b>Rs {money(SAMPLE_MATH.payableAfter)}</b>
            </li>
          </ol>
          <p>
            Notice the shape of it. The electricity itself is Rs {money(8750)} of a Rs{" "}
            {money(SAMPLE_MATH.payableWithin)} bill — around seven rupees in every ten. The rest is
            adjustments, fixed costs and tax. That is why &ldquo;units × the rate I saw in the
            news&rdquo; never matches the total at the bottom of a real bill, and why cutting units
            reduces a bill by less than people expect: the fixed and flat items do not move at all.
          </p>

          <h2>Protected and unprotected: the line worth watching</h2>
          <p>
            Domestic consumers sit in one of two categories, and the difference between them is
            large. A <strong>protected</strong> consumer is defined as a <strong>Non-ToU</strong>{" "}
            residential consumer using <strong>200 kWh or less per month, consistently for the past
            six months</strong> (
            <a href="https://nepra.org.pk/tariff/Tariff/Notifications/2022/July/S.R.O%201165%20(I)-2022%20dated%2025-07-2022.pdf" target="_blank" rel="noopener noreferrer">
              S.R.O. 1165(I)/2022
            </a>
            , PART-II, A-1 Residential). <strong>Unprotected</strong> consumers pay the standard
            schedule.
          </p>
          <p>
            The &ldquo;Non-ToU&rdquo; condition is the part almost every explanation leaves out, and
            it disqualifies people outright. A sanctioned load of <strong>5 kW or above</strong>{" "}
            requires Time-of-Use metering and A-1(b) billing, so such a household{" "}
            <strong>can never be protected at any level of consumption</strong> — fifty units a
            month would not help. The sanctioned load is printed in the bill header, in kW; on the
            sample above it is 2 kW, so this consumer at least clears that test. Full definitions,
            including lifeline, are on our <a href="/electricity-tariff">tariff page</a>.
          </p>
          <p>
            The practical consequence is that a single hot month can be expensive twice over: once
            for the extra units, and again for losing protected status and the lower rates that come
            with it. If your bill shows you as protected and your usage is creeping towards the
            threshold, that is the month to be careful — not the month after, when the status has
            already gone. Your status is printed on the bill; on the sample above it reads
            UNPROTECTED — and with a 2 kW sanctioned load, this consumer is at least eligible on the
            Non-ToU test.
          </p>

          <h2>The slab system, in one paragraph</h2>
          <p>
            The energy charge is not one rate applied to all your units. Consumption is divided into
            slabs — bands of units — and the rate steps up as you cross each boundary, with the
            higher rate applying to the units in the upper band. Crossing a boundary therefore
            raises the cost of the units above it, which is why bills can jump sharply for a modest
            rise in usage near a threshold. The current approved slab boundaries and per-unit rates
            are published by NEPRA; we reproduce them only once we have checked them against the
            notification, so where you see a dash on this site, it means we have not verified that
            figure yet rather than that it is zero. Our plain-language walkthrough is in{" "}
            <a href="/blog/unit-slabs-fuel-price-adjustment-taxes-explained">
              unit slabs, FPA &amp; taxes explained
            </a>
            .
          </p>

          <h2>What to check first when a bill looks wrong</h2>
          <ol>
            <li>
              <strong>Units, not rupees.</strong> Compare this month&apos;s units against the same
              month last year, not last month — Pakistani usage is intensely seasonal, and a
              July-to-August comparison tells you very little.
            </li>
            <li>
              <strong>The meter reading dates.</strong> A billing period stretched to 35 days pulls
              in extra units and can push you into a higher slab through no change in habit.
            </li>
            <li>
              <strong>The arrears line.</strong> A payment made close to the bill date may not have
              been recorded yet. Check the issue date before treating arrears as an error.
            </li>
            <li>
              <strong>Your status.</strong> If you were protected last month and are unprotected
              now, that alone explains a large part of the increase.
            </li>
            <li>
              <strong>Only then, the surcharges.</strong> The FPA and quarterly adjustment are set
              nationally. They explain a rise, but they are not something your distribution company
              can reverse for you.
            </li>
          </ol>
          <p>
            If after all that the units genuinely do not match your usage, the issue is a meter
            reading, and that is a complaint for your distribution company — the company named at
            the top of your bill — not for the billing website. Each of our{" "}
            <a href="/#companies">twelve company pages</a> lists that company&apos;s own complaint
            channels.
          </p>

          <h2>Where the figures on a real bill come from</h2>
          <p>
            Your reading is taken by a meter reader employed by your distribution company. That
            reading, your tariff category and your sanctioned load go into the national billing
            system run by the Power Information Technology Company (PITC), which generates the bill
            you receive on paper and the identical copy you can pull up online with your reference
            number. The rates it applies are set by NEPRA and are the same across the mainland
            distribution companies for a given category; Azad Jammu &amp; Kashmir is billed
            separately and is not guaranteed to match. eBill Pakistan is independent of both PITC
            and the distribution companies — see our{" "}
            <a href="/editorial-policy">editorial policy</a>.
          </p>
        </div>

        <div className="faq" style={{ marginTop: 32 }}>
          <h2>Sample bill: frequently asked questions</h2>
          {FAQS.map(([q, a], i) => (
            <details key={i} open={i === 0}>
              <summary>{q}</summary>
              <div className="a">{a}</div>
            </details>
          ))}
        </div>

        <div className="blog-cta">
          <p>Now read your own bill. Enter your 14-digit reference number — free, no sign-up.</p>
          <a className="btn btn-primary" href="/">Check my bill</a>
        </div>
      </div>
    </section>
  );
}
