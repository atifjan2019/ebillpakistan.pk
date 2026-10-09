import { SITE_URL, buildMeta } from "../../lib/seo";

export const metadata = buildMeta({
  title: "Electricity Bill Tools: Calculators, Complaint Letter, Load Shedding",
  description:
    "Free tools for Pakistani electricity bills: bill and appliance calculators, protected consumer checker, complaint letter, tariff code decoder, load-shedding status, MDI and solar calculators.",
  path: "/tools",
  imageAlt: "Electricity bill tools",
});

export const TOOLS = [
  ["/bill-calculator", "Bill calculator", "Units in, estimated bill out at NEPRA's rates with this month's adjustments, and the saving from a lower slab."],
  ["/appliance-calculator", "Appliance calculator", "Add up your fans, AC, fridge and pump to see the units a month, the slab, and which one to cut."],
  ["/protected-consumer-checker", "Protected consumer checker", "Six months of units tell you whether you qualify for the protected rate, your headroom, and when a lost status returns."],
  ["/mdi-calculator", "MDI and fixed charge calculator", "For Time-of-Use connections of 5 kW and above: how the fixed charge comes from your MDI, and what lowering it saves."],
  ["/solar-calculator", "Solar savings calculator", "What a rooftop system does to the bill: slab drop, export credit at the net-billing rate, and payback."],
  ["/complaint-letter", "Complaint letter", "A ready-to-send letter for a wrong reading, an excessive bill or a detection charge, in English or Urdu, and the route up to NEPRA."],
  ["/tariff-code", "Tariff code decoder", "Type the code printed on your bill and see which category and rate table it puts you on."],
  ["/load-shedding", "Load shedding and feeder status", "Whether your feeder is on right now, and where each company publishes its schedule."],
  ["/this-month", "This month's adjustments", "The fuel and quarterly adjustments on this month's bills, what they add, who is exempt, and every past month."],
  ["/", "Bill lookup", "Your current bill from the reference number, for every DISCO, in about ten seconds."],
];

export default function ToolsPage() {
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
  ] };
  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="container legal-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <span aria-current="page">Tools</span>
        </nav>
        <h1>Electricity bill tools</h1>
        <p className="legal-intro">
          Free, no sign-up, and built on the rates NEPRA has actually notified rather than on guesses. Each one says exactly what
          it assumes.
        </p>
        <div className="tool-links tool-links--grid">
          {TOOLS.map(([href, title, text]) => (
            <a key={href} className="tool-link" href={href}><b>{title}</b><span>{text}</span></a>
          ))}
        </div>
      </div>
    </section>
  );
}
