import { SITE_URL, buildMeta } from "../../lib/seo";
import { adjustmentPerUnit, monthLabel, currentMonthPk } from "../../lib/adjustments";
import { getAdjustmentOverrides } from "../../lib/adjustmentOverrides";
import { A1_TOU } from "../../lib/tariffs";
import MdiCalculator from "./MdiCalculator";

export const revalidate = 3600;

export const metadata = buildMeta({
  title: "MDI Calculator: Fixed Charges on a Time-of-Use Electricity Bill",
  description:
    "Work out the fixed charge and total on a domestic Time-of-Use bill from your sanctioned load, MDI, peak and off-peak units, at NEPRA's notified rates, and see what lowering your peak demand saves.",
  path: "/mdi-calculator",
  imageAlt: "MDI and fixed charge calculator",
});

const FAQS = [
  ["What does MDI mean on an electricity bill?", "Maximum Demand Indicator: the highest average load, in kilowatts, that your meter recorded over any half-hour in the billing month. It measures how hard you drew on the network at your busiest moment, not how many units you used."],
  ["How is the fixed charge calculated from MDI?", `For a domestic Time-of-Use consumer the fixed charge is Rs ${A1_TOU.fixed} per kilowatt per month on the higher of two figures: half your sanctioned load, or your recorded MDI. So a 7 kW connection pays on at least 3.5 kW, and on more if the MDI was higher.`],
  ["Who has a Time-of-Use meter?", "Any residential connection with a sanctioned load of 5 kW or above must be given ToU metering and billed on tariff A-1(b). Units are charged at a peak rate during the evening peak hours and an off-peak rate the rest of the day."],
  ["Can I reduce my MDI?", "Yes, by not running the biggest loads at the same time. Two air-conditioners, a water pump and an iron starting together set a high half-hour demand that then fixes the charge for the whole month. Staggering them lowers the MDI without using fewer units."],
  ["Do commercial connections use the same figures?", "No. Commercial and industrial tariffs have their own MDI rules and their own rates. This calculator is for domestic Time-of-Use connections only."],
];

export default async function MdiCalculatorPage() {
  const adj = adjustmentPerUnit(undefined, await getAdjustmentOverrides());
  const month = monthLabel(currentMonthPk());
  const pageUrl = `${SITE_URL}/mdi-calculator`;
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
    { "@type": "ListItem", position: 3, name: "MDI calculator", item: pageUrl },
  ] };
  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="container legal-inner post-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <a href="/tools">Tools</a> <span>/</span> <span aria-current="page">MDI calculator</span>
        </nav>
        <h1>MDI and fixed charge calculator</h1>
        <p className="legal-intro">
          On a Time-of-Use bill the fixed charge depends on your maximum demand, not just your units. Enter the four figures from
          your bill and see how the charge is built, and what bringing the peak down would save.
        </p>

        <MdiCalculator fcaPerUnit={adj.fca?.isCurrent ? adj.fca.perUnit : 0} qtaPerUnit={adj.qta?.perUnit || 0} month={month} />

        <div className="prose">
          <h2>How a Time-of-Use domestic bill is built</h2>
          <ol>
            <li><strong>Peak units</strong> at Rs {A1_TOU.peak} per unit, during the evening peak hours your DISCO publishes.</li>
            <li><strong>Off-peak units</strong> at Rs {A1_TOU.offPeak} per unit, the rest of the day.</li>
            <li><strong>Fixed charge</strong> at Rs {A1_TOU.fixed} per kW on the higher of half your sanctioned load and your MDI.</li>
            <li><strong>Adjustments</strong>: this month&apos;s fuel and quarterly figures on every unit, see <a href="/this-month">this month&apos;s adjustments</a>.</li>
            <li><strong>Taxes</strong> on the real bill: GST, electricity duty, the PTV fee and income tax where it applies.</li>
          </ol>
          <p>
            Our guide <a href="/blog/mdi-fixed-charges-electricity-bill">what MDI and fixed charges are</a> explains the meter
            reading itself, and <a href="/blog/peak-hours-time-of-use-electricity-bill">peak hours and Time-of-Use billing</a>{" "}
            covers when the peak rate applies. Below 5 kW there is no MDI; use the <a href="/bill-calculator">bill calculator</a>.
          </p>
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
      </div>
    </section>
  );
}
