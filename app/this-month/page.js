// /this-month: the adjustments on this month's electricity bills, refreshed
// hourly so an admin override shows without a deploy. The figures come from
// lib/adjustments.js and lib/tariffs.js, both sourced line by line.
import { SITE_URL, buildMeta } from "../../lib/seo";
import { MONTHLY_FCA, FCA_UPDATED, FCA_EXCLUDES, adjustmentPerUnit, monthLabel, qtaHistory, currentMonthPk } from "../../lib/adjustments";
import { ADJUSTMENT_EXCLUDES, energyCharge } from "../../lib/tariffs";
import { getAdjustmentOverrides } from "../../lib/adjustmentOverrides";
import { getAllPosts } from "../../lib/posts";
import ThisMonthBox from "../ThisMonthBox";

export const revalidate = 3600;

const month = monthLabel(currentMonthPk());

export const metadata = buildMeta({
  title: `Electricity Bill ${month}: FCA and QTA Rates Explained`,
  description: `The fuel cost adjustment and quarterly adjustment on ${month} electricity bills in Pakistan, who is exempt, what they add on 100 to 500 units, and every past month's figure.`,
  path: "/this-month",
  imageAlt: `Electricity bill adjustments for ${month}`,
});

const rs = (n, d = 0) => `Rs ${Math.abs(n).toLocaleString("en-PK", { minimumFractionDigits: d, maximumFractionDigits: d })}`;
const signed = (n, d = 4) => `${n < 0 ? "−" : "+"}Rs ${Math.abs(n).toFixed(d)}`;

const FAQS = (fca, qta) => [
  ["Why does my bill carry a fuel charge for a month that has already passed?", "The fuel cost adjustment is settled two months after the fact. NEPRA compares what fuel actually cost in a month with the reference cost built into the tariff and charges or refunds the difference on the units you used in that month. So an October bill carries the August fuel charge, worked out on August units."],
  ["Is the quarterly adjustment the same as the fuel adjustment?", "No. The fuel adjustment is monthly and covers fuel only. The quarterly adjustment covers the other costs that drifted from the forecast, such as capacity payments and transmission charges, and runs for three billing months. Both can sit on the same bill."],
  ["Who does not pay these adjustments?", `Lifeline consumers and prepaid consumers are exempt from both. The fuel adjustment also exempts electric vehicle charging stations; the quarterly adjustment also exempts units billed under the incremental consumption package. Being a protected consumer is not, on its own, an exemption${fca?.billingMonth === "2026-08" ? "" : ", although the August 2026 fuel adjustment was reported as excluding protected consumers"}.`],
  ["Do K-Electric consumers pay the same figures?", "Yes. NEPRA notifies the same per-unit fuel and quarterly adjustments for K-Electric, with the same exemptions, although KE's base tariff is notified separately."],
  ["Is sales tax charged on top of the adjustments?", "The adjustments are charges on the bill like the energy charge, and the bill's taxes are calculated on the charges. The exact treatment depends on your province's electricity duty and your category, so check the tax lines on your own bill rather than assuming a percentage."],
  ["How do I know which adjustment is on my bill?", "Look for a line labelled FPA or fuel price adjustment, and a separate line labelled quarterly adjustment or QTA. Multiply your units by the figures above to confirm each one. Our annotated sample bill shows where the lines sit."],
];

export default async function ThisMonthPage() {
  const overrides = await getAdjustmentOverrides();
  const adj = adjustmentPerUnit(undefined, overrides);
  const { fca, qta, perUnit } = adj;
  const posts = (await getAllPosts())
    .filter((p) => /fca|qta|adjustment|bill-increase|relief/i.test(`${p.slug} ${(p.tags || []).join(" ")}`))
    .sort((a, b) => String(b.publishedDate).localeCompare(String(a.publishedDate)))
    .slice(0, 8);
  const faqs = FAQS(fca, qta);
  const pageUrl = `${SITE_URL}/this-month`;
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "This month's bill", item: pageUrl },
  ] };
  const examples = [100, 200, 300, 500];

  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="container legal-inner post-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <span aria-current="page">This month&apos;s bill</span>
        </nav>
        <h1>Electricity bill adjustments for {month}</h1>
        <p className="legal-updated">Figures last updated: {FCA_UPDATED}. NEPRA decides the fuel adjustment in the first week of each month; this page refreshes when it does.</p>
        <p className="legal-intro">
          Two lines on a Pakistani electricity bill change from month to month without the tariff itself changing: the
          monthly <strong>fuel cost adjustment</strong> (shown as FPA) and the <strong>quarterly tariff adjustment</strong>.
          This page keeps the current figures, what they add to a typical bill, who is exempt, and every past month.
        </p>

        <ThisMonthBox adj={adj} />

        <div className="prose">
          <h2>What they add to a bill</h2>
          <p>Both adjustments are flat per-unit figures on every unit billed, whatever your slab, before taxes.</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Units billed</th><th>Fuel adjustment</th><th>Quarterly adjustment</th><th>Both together</th></tr>
              </thead>
              <tbody>
                {examples.map((u) => (
                  <tr key={u}>
                    <td>{u}</td>
                    <td>{fca?.isCurrent ? signed(fca.perUnit * u, 0) : "—"}</td>
                    <td>{qta ? signed(qta.perUnit * u, 0) : "—"}</td>
                    <td><strong>{signed(perUnit * u, 0)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            For scale, an unprotected consumer at 300 units pays {rs(energyCharge(300, "unprotected"))}{" "}in energy charges at the
            notified rate, so this month&apos;s adjustments change that bill by about{" "}
            {Math.round(Math.abs(perUnit * 300) / energyCharge(300, "unprotected") * 100)} percent. Put your own units into the{" "}
            <a href="/bill-calculator">bill calculator</a> for the full estimate.
          </p>

          <h2>The fuel cost adjustment, month by month</h2>
          <p>
            Each month&apos;s tariff assumes a reference fuel cost. When the actual cost of generating electricity comes in
            higher, NEPRA passes the difference on two months later; when it comes in lower, the line is a refund.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>On bills for</th><th>Units of</th><th>Per unit</th><th>Reference vs actual fuel cost</th><th>Source</th></tr>
              </thead>
              <tbody>
                {fca?.manual && (
                  <tr>
                    <td>{monthLabel(fca.billingMonth)}</td>
                    <td>{fca.consumptionMonth ? monthLabel(fca.consumptionMonth) : "—"}</td>
                    <td><strong>{signed(fca.perUnit)}</strong></td>
                    <td>—</td>
                    <td>{fca.sources?.[0] ? <a href={fca.sources[0].url} target="_blank" rel="noopener noreferrer">{fca.sources[0].title}</a> : "—"}</td>
                  </tr>
                )}
                {MONTHLY_FCA.map((f) => (
                  <tr key={f.billingMonth}>
                    <td>{monthLabel(f.billingMonth)}</td>
                    <td>{monthLabel(f.consumptionMonth)}</td>
                    <td><strong>{signed(f.perUnit)}</strong></td>
                    <td>{f.referenceCost ? `Rs ${f.referenceCost} vs Rs ${f.actualCost}` : "—"}</td>
                    <td>{f.sources.map((s, i) => <span key={s.url}>{i ? " · " : ""}<a href={s.url} target="_blank" rel="noopener noreferrer">{s.title.split(":")[0]}</a></span>)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>Exempt from the fuel adjustment: {FCA_EXCLUDES.join(", ")}.</p>

          <h2>The quarterly adjustment, quarter by quarter</h2>
          <p>
            Every three months NEPRA corrects the costs that are not fuel: capacity payments to power plants, transmission
            use-of-system charges, the market operator fee and the effect of losses. The result is a charge or a rebate
            applied for three billing months.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Billing months</th><th>Per unit</th><th>Covers</th><th>Notification</th></tr>
              </thead>
              <tbody>
                {qta?.manual && (
                  <tr>
                    <td>{qta.monthsLabel}</td>
                    <td><strong>{signed(qta.perUnit)}</strong></td>
                    <td>—</td>
                    <td>{qta.url ? <a href={qta.url} target="_blank" rel="noopener noreferrer">{qta.sro}</a> : qta.sro}</td>
                  </tr>
                )}
                {qtaHistory().map((a) => (
                  <tr key={a.id}>
                    <td>{a.monthsLabel}</td>
                    <td><strong>{signed(a.perUnit)}</strong></td>
                    <td>{a.label.replace(" quarterly tariff adjustment", "")}</td>
                    <td><a href={a.url} target="_blank" rel="noopener noreferrer">{a.sro}</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>Exempt from the quarterly adjustment: {ADJUSTMENT_EXCLUDES.join(", ")}.</p>

          <h2>How to check them on your own bill</h2>
          <ol>
            <li>Find the units billed this month on the readings panel.</li>
            <li>Find the line labelled FPA or fuel price adjustment. Divide it by your units: it should match the fuel figure above.</li>
            <li>Find the quarterly adjustment line and do the same.</li>
            <li>If either is missing and you are not lifeline or prepaid, it may be added on a later bill, which NEPRA&apos;s notifications allow when bills were issued before a decision.</li>
            <li>If a figure is wrong, our guide on <a href="/blog/electricity-bill-overbilling-complaint">complaining about overbilling</a> explains the route.</li>
          </ol>
          <p>
            Not sure where the lines are? The <a href="/sample-bill-explained">annotated sample bill</a> shows every field, and the{" "}
            <a href="/electricity-tariff">tariff guide</a> has the slab rates these sit on top of.
          </p>

          {posts.length > 0 && (
            <>
              <h2>Month-by-month explainers</h2>
              <ul>
                {posts.map((p) => (
                  <li key={p.slug}><a href={`/blog/${p.slug}`}>{p.title}</a></li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="faq" style={{ marginTop: 32 }}>
          <h2>Frequently asked questions</h2>
          {faqs.map(([q, a], i) => (
            <details key={i} open={i === 0}>
              <summary>{q}</summary>
              <div className="a">{a}</div>
            </details>
          ))}
        </div>

        <div className="blog-cta">
          <p>See exactly what this month&apos;s adjustments did to your own bill.</p>
          <a className="btn btn-primary" href="/">Check your bill now</a>
        </div>
      </div>
    </section>
  );
}
