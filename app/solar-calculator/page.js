import { SITE_URL, buildMeta } from "../../lib/seo";
import { adjustmentPerUnit } from "../../lib/adjustments";
import { getAdjustmentOverrides } from "../../lib/adjustmentOverrides";
import SolarCalculator from "./SolarCalculator";

export const revalidate = 3600;

// The export (net billing) rate reported in the national press for 2026; the
// reader can change it. See the net-billing guide for the sourcing.
const EXPORT_RATE_DEFAULT = 11;

export const metadata = buildMeta({
  title: "Solar Savings Calculator Pakistan: Net Billing Payback",
  description:
    "Estimate what a solar system saves on a Pakistani electricity bill: units generated, slab drop, export credit under net billing, and payback years. Every assumption is yours to change.",
  path: "/solar-calculator",
  imageAlt: "Solar savings calculator for Pakistan",
});

const FAQS = [
  ["Why is the saving mostly from the slab drop, not the exported units?", "Grid units are charged at the rate of the slab the whole month reaches, and solar used at home cuts the grid units. Falling from 600 units to 300 reprices everything left at a lower rate. Exported units are credited at a much lower rate, so they matter less than installers' brochures suggest."],
  ["What export rate should I use?", "The rate in your net-metering or net-billing agreement with your DISCO. For new connections in 2026 the press reported a rate around Rs 11 per unit under the net-billing rules, far below the retail rate; older agreements may differ. The field is editable for exactly this reason."],
  ["How many units does a 5 kW system make?", "Around 4 units per kW per day on average across the year in most of Pakistan, so roughly 600 a month for 5 kW, with summer above and winter below that. Shade, dust and panel orientation all reduce it."],
  ["Does solar remove the fixed charge?", "No. The fixed charge is on your sanctioned load and slab, and the DISCO bills it whether or not you generate. Only the units change."],
  ["Is the payback figure reliable?", "It is a simple division of the system cost by the first-year saving. It ignores panel degradation, inverter replacement, tariff changes and any financing cost, so treat it as a ceiling on how good the deal is, not a forecast."],
];

export default async function SolarCalculatorPage() {
  const adj = adjustmentPerUnit(undefined, await getAdjustmentOverrides());
  const pageUrl = `${SITE_URL}/solar-calculator`;
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
    { "@type": "ListItem", position: 3, name: "Solar calculator", item: pageUrl },
  ] };
  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="container legal-inner post-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <a href="/tools">Tools</a> <span>/</span> <span aria-current="page">Solar calculator</span>
        </nav>
        <h1>Solar savings calculator</h1>
        <p className="legal-intro">
          What a rooftop system would do to your bill, worked out the way the bill is actually calculated: solar used at home
          removes grid units and can drop your slab, exported units earn a credit at the net-billing rate, and the fixed charge stays.
        </p>

        <SolarCalculator fcaPerUnit={adj.fca?.isCurrent ? adj.fca.perUnit : 0} qtaPerUnit={adj.qta?.perUnit || 0} exportRateDefault={EXPORT_RATE_DEFAULT} />

        <div className="prose">
          <h2>Before you sign with an installer</h2>
          <ul>
            <li><strong>Ask for the export rate in writing.</strong> Net billing pays far less for exported units than net metering did, and the difference changes the payback by years. Our guide to <a href="/blog/net-metering-net-billing-2026">net metering and net billing in 2026</a> explains the rules.</li>
            <li><strong>Size for daytime use, not for the whole bill.</strong> A system that exports most of its output is earning the low rate on most of its output.</li>
            <li><strong>Check your slab first.</strong> A household at 350 units saves more per panel than one at 700, because the first panels take it across a slab boundary. The <a href="/bill-calculator">bill calculator</a> shows the slabs.</li>
            <li><strong>The application is through your DISCO.</strong> See <a href="/blog/how-to-apply-net-metering-net-billing-2026">how to apply for net metering</a> for the documents and the steps.</li>
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
      </div>
    </section>
  );
}
