import { SITE_URL, buildMeta } from "../../lib/seo";
import { adjustmentPerUnit, monthLabel, currentMonthPk } from "../../lib/adjustments";
import { getAdjustmentOverrides } from "../../lib/adjustmentOverrides";
import { PROTECTED, A1_BELOW_5KW } from "../../lib/tariffs";
import BillCalculator from "./BillCalculator";

export const revalidate = 3600;

export const metadata = buildMeta({
  title: "Electricity Bill Calculator Pakistan 2026: Units to Rupees",
  description:
    "Enter your units and see the estimated bill at NEPRA's notified rates, with this month's fuel and quarterly adjustments, the fixed charge, and how much a lower slab would save. Works for every DISCO.",
  path: "/bill-calculator",
  imageAlt: "Electricity bill calculator for Pakistan",
});

const FAQS = [
  ["Why is the whole bill higher when I use a few more units?", "Because domestic billing is not slab by slab for unprotected consumers. Cross a slab boundary and every unit in the month is charged at the higher slab's rate. The calculator shows the saving from staying under the boundary for exactly this reason."],
  ["Does this work for LESCO, PESCO, MEPCO and the others?", "Yes. NEPRA notifies one domestic tariff for every mainland distribution company, so the per-unit rates are the same whichever DISCO bills you. Only Azad Kashmir is notified separately."],
  ["Why does the estimate differ from my actual bill?", "The real bill adds GST, electricity duty, the PTV fee, income tax where it applies, meter rent and any arrears, none of which the calculator can know. It also uses this month's adjustments; an older bill carried different ones."],
  ["What is the sanctioned load and where do I find it?", "The connection size in kilowatts that your DISCO approved, printed on the bill. The fixed charge is this figure multiplied by the rate for your slab."],
  ["How do I know if I am protected?", `A protected consumer used ${PROTECTED.unitThreshold} units or fewer in each of the last ${PROTECTED.qualifyingMonths} months and has a sanctioned load below 5 kW. The protected consumer checker works it out from your readings.`],
];

export default async function BillCalculatorPage() {
  const adj = adjustmentPerUnit(undefined, await getAdjustmentOverrides());
  const month = monthLabel(currentMonthPk());
  const pageUrl = `${SITE_URL}/bill-calculator`;
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const appLd = { "@context": "https://schema.org", "@type": "WebApplication", name: "Electricity Bill Calculator Pakistan", url: pageUrl, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "PKR" }, provider: { "@id": `${SITE_URL}/#organization` } };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
    { "@type": "ListItem", position: 3, name: "Bill calculator", item: pageUrl },
  ] };
  const top = A1_BELOW_5KW.unprotected;

  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="container legal-inner post-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <a href="/tools">Tools</a> <span>/</span> <span aria-current="page">Bill calculator</span>
        </nav>
        <h1>Electricity bill calculator</h1>
        <p className="legal-intro">
          Type in your units and see what the bill comes to at the rates NEPRA has notified, including the fuel and quarterly
          adjustments on {month} bills. It shows every line, and how much you would save by finishing the month one slab lower.
        </p>

        <BillCalculator fcaPerUnit={adj.fca?.isCurrent ? adj.fca.perUnit : 0} qtaPerUnit={adj.qta?.perUnit || 0} month={month} />

        <div className="prose">
          <h2>How the estimate is built</h2>
          <ol>
            <li><strong>Energy charge.</strong> Your units at the rate of the slab the month reaches. For protected consumers, the previous slab is charged at its own lower rate; unprotected consumers get no such benefit, so the whole month reprices at a boundary.</li>
            <li><strong>Fixed charge.</strong> A rupees-per-kilowatt figure for your slab, multiplied by your sanctioned load. Lifeline consumers pay a minimum charge instead.</li>
            <li><strong>Fuel cost adjustment.</strong> This month&apos;s per-unit figure on every unit, unless you are lifeline or prepaid. See <a href="/this-month">this month&apos;s adjustments</a>.</li>
            <li><strong>Quarterly adjustment.</strong> The per-unit figure in force for the current three-month window, with the same exemptions.</li>
          </ol>
          <p>
            Taxes come after all of that on the real bill, and they vary: GST, electricity duty set by each province, the PTV
            licence fee, and advance income tax on larger bills. Our <a href="/sample-bill-explained">annotated sample bill</a>{" "}
            shows where each sits.
          </p>

          <h2>The slab rates behind the numbers</h2>
          <p>Unprotected domestic, below 5 kW, per S.R.O. 279(I)/2026:</p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Slab</th><th>Rate per unit</th><th>Fixed charge</th></tr></thead>
              <tbody>
                {top.map((r) => (
                  <tr key={r.slab}><td>{r.slab}</td><td>Rs {r.rate.toFixed(2)}</td><td>Rs {r.fixed}/kW</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Protected and lifeline rates, Time-of-Use and prepaid rates, and the notification itself are on the{" "}
            <a href="/electricity-tariff">tariff page</a>.
          </p>

          <h2>Three things the calculator makes obvious</h2>
          <ul>
            <li><strong>The 200-unit line is the expensive one.</strong> At 200 units an unprotected consumer pays Rs 28.91 a unit; at 201 the month reprices at Rs 33.10. That is roughly Rs 870 for one unit.</li>
            <li><strong>Protected status is worth more than any appliance change.</strong> The same 200 units cost a protected consumer less than half.</li>
            <li><strong>Adjustments move the bill every month.</strong> A positive fuel adjustment of a rupee on 400 units is Rs 400 before tax, on top of everything else.</li>
          </ul>
        </div>

        <div className="faq" style={{ marginTop: 32 }}>
          <h2>Frequently asked questions</h2>
          {FAQS.map(([q, a], i) => (
            <details key={i} open={i === 0}>
              <summary>{q}</summary>
              <div className="a">{a}</div>
            </details>
          ))}
        </div>

        <div className="blog-cta">
          <p>Compare the estimate with your real bill. Free, with just the reference number.</p>
          <a className="btn btn-primary" href="/">Check your bill now</a>
        </div>
      </div>
    </section>
  );
}
