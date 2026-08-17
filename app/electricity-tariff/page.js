import { SITE_URL, buildMeta } from "../../lib/seo";
import {
  A1_TOU, A1_PREPAID, ADJUSTMENTS, ADJUSTMENT_EXCLUDES, MINIMUM_CHARGE,
  NEPRA_SOURCE, PROTECTED, LIFELINE, CATEGORY_SOURCE, UNPROTECTED_NOTE, SRO_BY_DISCO, TARIFFS, energyCharge, LAST_VERIFIED_AGAINST_SOURCE,
} from "../../lib/tariffs";
import { DISCOS } from "../../lib/discos";
import TariffTable from "../TariffTable";

export const metadata = buildMeta({
  title: "Pakistan Electricity Tariff 2026 — Domestic Slab Rates, Fixed Charges & Adjustments",
  description:
    "The domestic electricity tariff notified in S.R.O. 279(I)/2026: per-unit rates for lifeline, protected and unprotected consumers, fixed charges, and why bills are not calculated slab by slab.",
  path: "/electricity-tariff",
  imageAlt: "Pakistan domestic electricity tariff 2026",
});

const rs = (n) => `Rs ${n.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const FAQS = [
  [
    "Is my electricity bill calculated slab by slab?",
    "Not if you are an unprotected consumer. The notes to the notified schedule say only protected residential consumers get the benefit of one previous slab, and lifeline consumers get none. So for an unprotected consumer every unit is charged at the rate of the band the month reaches — not the first 100 at one rate and the next 100 at another.",
  ],
  [
    "How much does crossing 200 units actually cost?",
    "At the rates notified in S.R.O. 279(I)/2026, an unprotected consumer using exactly 200 units pays 200 × Rs 28.91 = Rs 5,782 in energy charges. At 201 units the whole month reprices into the next band: 201 × Rs 33.10 = Rs 6,653. One extra unit costs about Rs 871, before tax.",
  ],
  [
    "What is the difference between a fixed charge and a minimum charge?",
    "A fixed charge is billed per kilowatt of sanctioned load per month and applies to protected and unprotected consumers. A minimum monthly charge — Rs 75 single-phase, Rs 150 three-phase — applies only where a fixed charge does not, which in practice means lifeline consumers. Where fixed charges apply, no minimum charge is added even if you consume nothing.",
  ],
  [
    "Why is there a rebate on my bill this month?",
    "S.R.O. 953(I)/2026 applies a quarterly tariff adjustment of minus Rs 1.9857 per unit across the June, July and August 2026 billing months. It is a temporary adjustment on top of the slab rate, not a change to the rate itself, and it expires after August. Lifeline, prepaid and incremental-consumption-package consumers are excluded.",
  ],
  [
    "Can I be a protected consumer if my sanctioned load is 5 kW?",
    "No. Protected status is confined to Non-ToU residential consumers, and a sanctioned load of 5 kW or above requires Time-of-Use metering and A-1(b) billing. Such a household is disqualified regardless of how few units it uses. The definition is in S.R.O. 1165(I)/2022, PART-II, A-1 Residential.",
  ],
  [
    "How many months do I need to stay under 200 units?",
    "Six. The notified definition is a Non-ToU residential consumer using 200 kWh or less per month consistently for the past 6 months — a rolling look-back over the six immediately preceding months. The gazette's word is 'consistently' rather than 'consecutive', though in practice it works the same way.",
  ],
  [
    "Are these rates the same for LESCO, MEPCO, PESCO and the rest?",
    "Yes. S.R.O. 279(I)/2026 notifies a uniform consumer-end tariff across the ex-WAPDA distribution companies, so a given consumer category pays the same per unit whichever company bills it. Each company still has its own Schedule of Tariff — S.R.O. 41 through 51 of 13 January 2026 — which S.R.O. 279 modifies. Azad Jammu & Kashmir is notified separately and is not covered by these figures.",
  ],
];

export default function TariffPage() {
  const pageUrl = `${SITE_URL}/electricity-tariff`;
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
      { "@type": "ListItem", position: 2, name: "Electricity tariff", item: pageUrl },
    ],
  };

  const u200 = energyCharge(200, "unprotected");
  const u201 = energyCharge(201, "unprotected");
  const p200 = energyCharge(200, "protected");

  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="container legal-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <span aria-current="page">Electricity tariff</span>
        </nav>

        <h1>Pakistan&apos;s Domestic Electricity Tariff, Explained</h1>
        {/* Three genuinely different dates, and a reader checking a rate needs
            all three: when the notification took effect, when we last read the
            figures off it, and when this page was last edited. */}
        <dl className="tariff-dates">
          <div><dt>SRO effective from</dt><dd>{NEPRA_SOURCE.effectiveFrom}</dd></div>
          <div><dt>Figures last checked against source</dt><dd>{LAST_VERIFIED_AGAINST_SOURCE}</dd></div>
          <div><dt>Page last updated</dt><dd>2026-08-16</dd></div>
        </dl>
        <p className="legal-intro">
          These are the per-unit rates your electricity bill is actually calculated from, as notified
          in{" "}
          <a href={NEPRA_SOURCE.url} target="_blank" rel="noopener noreferrer">S.R.O. 279(I)/2026</a>{" "}
          of 12 February 2026. That notification modifies the Schedules of Tariff issued to each
          distribution company in January 2026, so it — not the January SROs — is the schedule in
          force. Every mainland distribution company applies the same figures.
        </p>

        <TariffTable data={TARIFFS.lesco} heading="Tariff A-1 — residential, sanctioned load below 5 kW" />

        <div className="prose">
          <h2>The rule that surprises people: bills are not telescopic</h2>
          <p>
            Almost every explanation of Pakistani electricity slabs you will read — including,
            until we corrected it, two guides on this site — describes them as telescopic: the first
            100 units at one rate, the next 100 at a higher one, and so on. For most consumers that
            is <strong>wrong</strong>.
          </p>
          <p>The notes printed under the notified schedule are explicit:</p>
          <blockquote className="tariff-quote">
            &ldquo;only protected residential consumers will be given the benefit of one previous
            slab&rdquo; &middot; &ldquo;residential life line consumer will not be given any slab
            benefit&rdquo;
          </blockquote>
          <p>
            Read together: an <strong>unprotected</strong> consumer has every unit charged at the
            rate of the band their month reaches. A <strong>protected</strong> consumer gets the one
            immediately preceding band charged at its own lower rate. A <strong>lifeline</strong>{" "}
            consumer gets no benefit at all.
          </p>

          <h2>What that means in rupees</h2>
          <p>
            The consequence is a cliff at every band boundary. Take an unprotected household at
            exactly 200 units:
          </p>
          <ul>
            <li>200 units × Rs 28.91 = <strong>{rs(u200)}</strong></li>
            <li>201 units × Rs 33.10 = <strong>{rs(u201)}</strong></li>
            <li>
              One additional unit costs <strong>{rs(u201 - u200)}</strong> — before GST, which is
              calculated on top.
            </li>
          </ul>
          <p>
            A protected consumer at the same 200 units pays{" "}
            <strong>{rs(p200)}</strong> (100 × Rs 10.54 plus 100 × Rs 13.01), which is why protected
            status is worth guarding carefully.
          </p>

          <h2>Fixed charges, and the minimum charge</h2>
          <p>
            Fixed charges are billed per kilowatt of <strong>sanctioned load</strong> per month, and
            they step up with your consumption band — from Rs 200/kW for a protected consumer under
            100 units to Rs 675/kW at the top of the domestic schedule. For Time-of-Use domestic
            consumers they are calculated on 50% of sanctioned load or recorded maximum demand,
            whichever is higher.
          </p>
          <p>
            Where a fixed charge applies, <strong>no minimum charge is added</strong> even in a month
            you consume nothing. Where it does not — lifeline consumers — a minimum monthly customer
            charge applies instead: <strong>Rs {MINIMUM_CHARGE.singlePhase}</strong> single-phase or{" "}
            <strong>Rs {MINIMUM_CHARGE.threePhase}</strong> three-phase.
          </p>

          <h2>Larger connections and pre-paid meters</h2>
          <p>
            A residential connection with a sanctioned load of <strong>5 kW or above</strong> is
            billed Time-of-Use: <strong>Rs {A1_TOU.peak.toFixed(2)}</strong> per unit at peak and{" "}
            <strong>Rs {A1_TOU.offPeak.toFixed(2)}</strong> off-peak, with a fixed charge of Rs{" "}
            {A1_TOU.fixed}/kW/month. <strong>Pre-paid</strong> residential supply is a flat Rs{" "}
            {A1_PREPAID.rate.toFixed(2)} per unit with the same Rs {A1_PREPAID.fixed}/kW/month fixed
            charge.
          </p>

          <h2>Quarterly adjustments: temporary, and dated</h2>
          <p>
            On top of the slab rate, NEPRA notifies periodic adjustments that apply for a defined run
            of billing months and then stop. They are not rate changes, and reading a bill without
            knowing which one was live is a common source of confusion:
          </p>
          <ul>
            {ADJUSTMENTS.map((a) => (
              <li key={a.id}>
                <strong>
                  {a.perUnit < 0 ? "−" : "+"}Rs {Math.abs(a.perUnit).toFixed(4)} per unit
                </strong>{" "}
                — {a.label}, applied to the {a.monthsLabel}.{" "}
                <a href={a.url} target="_blank" rel="noopener noreferrer">{a.sro}</a>
              </li>
            ))}
          </ul>
          <p>
            Both exclude {ADJUSTMENT_EXCLUDES.join(", ")}. Because they expire, a bill from September
            2026 will not carry the June-to-August rebate — so comparing two months without checking
            which adjustment applied to each will mislead you.
          </p>

          <h2>Who counts as protected, lifeline or unprotected</h2>
          <p>
            These are not informal labels — each is defined in the notified Schedule of Tariff, at{" "}
            <a href={CATEGORY_SOURCE.url} target="_blank" rel="noopener noreferrer">
              {CATEGORY_SOURCE.sro}
            </a>{" "}
            of 25 July 2022, {CATEGORY_SOURCE.page}. The same text is still in force at page 69 of{" "}
            <a href={CATEGORY_SOURCE.stillInForce.url} target="_blank" rel="noopener noreferrer">
              {CATEGORY_SOURCE.stillInForce.sro}
            </a>{" "}
            of 18 July 2025.
          </p>

          <h3>Protected</h3>
          <blockquote className="tariff-quote">&ldquo;{PROTECTED.definition}&rdquo;</blockquote>
          <p>
            Two conditions, and most explanations only mention the first. The consumption test is{" "}
            <strong>≤ {PROTECTED.unitThreshold} kWh a month, consistently for the past{" "}
            {PROTECTED.qualifyingMonths} months</strong> — a rolling look-back over the six
            immediately preceding months, each of which has to be at or below the threshold. Note
            the gazette&apos;s word is &ldquo;consistently&rdquo;, not &ldquo;consecutive&rdquo;;
            the practical effect is the same, but it is worth quoting what the notification
            actually says.
          </p>

          <h3>The condition almost nobody mentions: Non-ToU only</h3>
          <p>
            The definition is confined to <strong>Non-ToU</strong> residential consumers. Under
            clauses 3 and 4 of the same A-1 section, any consumer with a sanctioned load of{" "}
            <strong>{PROTECTED.touThresholdKw} kW or above</strong> must be given Time-of-Use
            metering and billed on A-1(b).
          </p>
          <p>
            Put those together and the consequence is concrete:{" "}
            <strong>
              a household with a sanctioned load of {PROTECTED.touThresholdKw} kW or more can never
              be a protected consumer, however little electricity it uses
            </strong>
            . Fifty units a month makes no difference. If you have been wondering why your usage is
            low but your bill is on the unprotected schedule, your sanctioned load is the first
            thing to check — it is printed on the bill, in kW, near the tariff code.
          </p>

          <h3>Lifeline</h3>
          <blockquote className="tariff-quote">&ldquo;{LIFELINE.definition}&rdquo;</blockquote>
          <p>
            Lifeline is stricter than people assume, and again on two axes. The connection must be{" "}
            <strong>single-phase with a sanctioned load up to {LIFELINE.maxSanctionedLoadKw} kW</strong>,
            and the consumption test looks back <strong>twelve months</strong> rather than six: the
            maximum of the last twelve months&apos; and the current month&apos;s consumption must be{" "}
            ≤ {LIFELINE.unitCeiling} units. The two rates for ≤ 50 and ≤ 100 units sit inside that
            category.
          </p>

          <h3>Unprotected</h3>
          <p>{UNPROTECTED_NOTE} That is the default, and it is where the great majority of domestic consumers sit.</p>

          <h3>What happens if you go over</h3>
          <p>
            Where a billing cycle runs beyond a calendar month, the units are pro-rated:{" "}
            {PROTECTED.carryForwardRule} Lifeline consumers get the same treatment at the 50 and 100
            unit thresholds (CSM Revised 2025, clause 6.1.1.1(a)).
          </p>
          <p>
            On regaining the status after exceeding the threshold, we will say only what the
            documents support. <strong>No notification imposes a lock-out or penalty period.</strong>{" "}
            What follows from a rolling {PROTECTED.qualifyingMonths}-month test is simply that the
            six months behind you must all be at or below the threshold again before you meet the
            definition — that is an implication of the test, not a separate published rule, and you
            will see it stated as one all over the internet.
          </p>

          <h2>Which Schedule of Tariff applies to your company</h2>
          <p>
            Each distribution company has its own Schedule of Tariff, issued on 13 January 2026 and
            modified by S.R.O. 279(I)/2026. The rates are the same; the schedule number differs:
          </p>
          <ul className="sro-list">
            {Object.entries(SRO_BY_DISCO).map(([code, sro]) => (
              <li key={code}>
                <a href={`/${code}-bill-check`}>{DISCOS[code]?.[0] || code.toUpperCase()}</a> — {sro}
              </li>
            ))}
          </ul>
          <p>
            Azad Jammu &amp; Kashmir is not in this list: it is supplied by a government department
            rather than a NEPRA-licensed distribution company, and its tariff is notified separately.
            See <a href="/ajk-bill-check">the AJK page</a>.
          </p>

          <h2>How we sourced these figures</h2>
          <p>
            S.R.O. 279 and the January schedules are image-only scans, and the ex-WAPDA annex of the
            underlying decision does not OCR reliably. Rather than run text recognition over a scan
            and publish whatever came out, the figures here were read visually from Annex-B-1 and
            then cross-checked two independent ways: against the K-Electric annex, which does carry a
            clean text layer and the same applicable variable charges, and against{" "}
            <a href={NEPRA_SOURCE.htmlMirror} target="_blank" rel="noopener noreferrer">
              IESCO&apos;s independently typed tariff guide
            </a>
            . All three agree on every one of the fifteen figures.
          </p>
          <p>
            We rejected LESCO&apos;s own tariff page as a source: its most recent entry is dated
            26 July 2023 and is three years stale. Our{" "}
            <a href="/editorial-policy">editorial policy</a> sets out the rest of how we handle
            figures we cannot verify.
          </p>
        </div>

        <div className="faq" style={{ marginTop: 32 }}>
          <h2>Tariff questions</h2>
          {FAQS.map(([q, a], i) => (
            <details key={i} open={i === 0}>
              <summary>{q}</summary>
              <div className="a">{a}</div>
            </details>
          ))}
        </div>

        <div className="blog-cta">
          <p>See these rates applied to your own bill — enter your reference number, free.</p>
          <a className="btn btn-primary" href="/">Check my bill</a>
        </div>
      </div>
    </section>
  );
}
