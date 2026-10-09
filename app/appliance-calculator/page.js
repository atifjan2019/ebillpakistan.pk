import { SITE_URL, buildMeta } from "../../lib/seo";
import { adjustmentPerUnit } from "../../lib/adjustments";
import { getAdjustmentOverrides } from "../../lib/adjustmentOverrides";
import ApplianceCalculator from "./ApplianceCalculator";

export const revalidate = 3600;

export const metadata = buildMeta({
  title: "Appliance Electricity Calculator Pakistan: Units per Month",
  description:
    "Add up your fans, AC, fridge, iron and pump to see the units they use a month, which slab that puts you in, what it costs at NEPRA's rates, and which appliance is the one to cut.",
  path: "/appliance-calculator",
  imageAlt: "Appliance electricity use calculator for Pakistan",
});

const FAQS = [
  ["How many units does a 1.5 ton AC use in a month?", "An inverter 1.5 ton unit averages roughly 0.9 kW while running, so 8 hours a day is about 215 units a month. A non-inverter unit averages nearer 1.5 kW, about 360 units for the same hours. The exact figure depends on the thermostat setting, the room and the outside temperature, which is why the watts are editable."],
  ["How do I calculate units from watts?", "Units (kWh) = watts × hours ÷ 1,000. A 75 watt fan running 14 hours uses 1.05 units a day, about 32 a month. The calculator does this for every appliance and adds them up."],
  ["Where do I find the wattage of my appliance?", "On the rating plate, usually a sticker on the back or underside, or in the manual. For appliances that cycle on and off, such as a fridge or an AC, the plate shows the maximum; the average over time is lower, which is what the presets use."],
  ["Why does cutting a few units save so much?", "Because for unprotected consumers the whole month is charged at the rate of the slab it reaches. Finishing just under a slab line reprices every unit at the lower rate, so the last few units before the line are worth far more than their own cost."],
  ["Which appliance should I cut first?", "The one at the top of the list on the right. In most homes that is the air-conditioner in summer and the electric geyser or heater in winter; fans and lights add up too, simply because there are many of them running many hours."],
];

export default async function ApplianceCalculatorPage() {
  const adj = adjustmentPerUnit(undefined, await getAdjustmentOverrides());
  const pageUrl = `${SITE_URL}/appliance-calculator`;
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
    { "@type": "ListItem", position: 3, name: "Appliance calculator", item: pageUrl },
  ] };
  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="container legal-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <a href="/tools">Tools</a> <span>/</span> <span aria-current="page">Appliance calculator</span>
        </nav>
        <h1>Appliance electricity calculator</h1>
        <p className="legal-intro">
          Which appliance is actually running up the bill? Add up what you have, see the units a month, the slab that puts
          you in, and the one or two things worth changing.
        </p>

        <ApplianceCalculator fcaPerUnit={adj.fca?.isCurrent ? adj.fca.perUnit : 0} qtaPerUnit={adj.qta?.perUnit || 0} />

        <div className="prose" style={{ maxWidth: 820 }}>
          <h2>How to read the result</h2>
          <ul>
            <li><strong>Units a month</strong> is what your meter would record if the hours you entered are right. Compare it with the units on a real bill; if the bill is much higher, something is running longer than you think, or the meter reading is worth checking.</li>
            <li><strong>The slab</strong> matters more than the units. One unit past a slab line reprices the whole month for an unprotected consumer, so the calculator tells you how far above a line you are.</li>
            <li><strong>The bars</strong> rank your appliances by share of the bill. Cutting an hour from the top one beats switching off ten small things.</li>
          </ul>
          <h2>Changes that move the number most</h2>
          <ul>
            <li><strong>Thermostat at 26°C instead of 22°C.</strong> An air-conditioner&apos;s draw falls steeply as the set temperature rises; try lowering the AC watts by a fifth to see the effect.</li>
            <li><strong>Inverter fans.</strong> Four ordinary fans at 14 hours are about 125 units a month; four inverter fans are about 50.</li>
            <li><strong>The geyser.</strong> An electric geyser for an hour a day is about 90 units. Gas, solar or a timer changes a winter bill more than anything else.</li>
            <li><strong>Stagger the big loads.</strong> It does not cut units, but on a Time-of-Use connection it lowers the maximum demand that sets the fixed charge. See the <a href="/mdi-calculator">MDI calculator</a>.</li>
          </ul>
          <p>
            For more, see our guide to <a href="/blog/electricity-bill-zyada-kyon-aata-hai">why a bill comes out high</a> and the{" "}
            <a href="/blog/bijli-ka-bill-kam-kaise-karein">Urdu guide to cutting it</a>. To see what your real bill
            says, <a href="/">check it with your reference number</a>.
          </p>
        </div>

        <div className="faq" style={{ marginTop: 32, maxWidth: 820 }}>
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
