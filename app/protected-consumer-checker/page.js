import { SITE_URL, buildMeta } from "../../lib/seo";
import { PROTECTED, CATEGORY_SOURCE, A1_BELOW_5KW } from "../../lib/tariffs";
import ProtectedChecker from "./ProtectedChecker";

export const metadata = buildMeta({
  title: "Protected Consumer Checker: Do You Qualify for the 200-Unit Rate?",
  description:
    "Enter your last six months of units and find out whether you are a protected electricity consumer in Pakistan, how much headroom you have, and how many months until you qualify again.",
  path: "/protected-consumer-checker",
  imageAlt: "Protected consumer checker",
});

const FAQS = [
  ["What exactly is a protected consumer?", `${PROTECTED.definition} The definition is in ${CATEGORY_SOURCE.sro}, ${CATEGORY_SOURCE.page}, and is still in force.`],
  ["Is it six consecutive months or any six?", "The notified wording is 'consistently for the past 6 months', a rolling look-back over the six months immediately before the bill. In practice one month over 200 means the next six bills are unprotected."],
  ["My sanctioned load is 5 kW. Can I still be protected?", "No. A sanctioned load of 5 kW or more must be metered Time-of-Use and billed on A-1(b), and protected status applies only to non-ToU consumers, whatever the units."],
  ["How much does protected status save?", `At 200 units the protected energy charge is 100 × Rs ${A1_BELOW_5KW.protected[0].rate} plus 100 × Rs ${A1_BELOW_5KW.protected[1].rate}, against 200 × Rs ${A1_BELOW_5KW.unprotected[1].rate} unprotected: less than half, before fixed charges and taxes.`],
  ["Does the DISCO work this out automatically?", "Yes. The billing system assigns the tariff code from your history each month. This checker shows what that history implies, so you can see a change coming and query a bill that disagrees."],
];

export default function ProtectedCheckerPage() {
  const pageUrl = `${SITE_URL}/protected-consumer-checker`;
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
    { "@type": "ListItem", position: 3, name: "Protected consumer checker", item: pageUrl },
  ] };
  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="container legal-inner post-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <a href="/tools">Tools</a> <span>/</span> <span aria-current="page">Protected consumer checker</span>
        </nav>
        <h1>Protected consumer checker</h1>
        <p className="legal-intro">
          Protected consumers pay far less per unit, and the status depends on a six-month history, not on this month alone.
          Enter your last six readings and see where you stand, how much headroom you have, and when a lost status comes back.
        </p>

        <ProtectedChecker />

        <div className="prose">
          <h2>The rule, in the gazette&apos;s words</h2>
          <blockquote>{PROTECTED.definition}</blockquote>
          <p>
            Two conditions. First, every one of the six previous months at or under {PROTECTED.unitThreshold} units. Second, a
            non-ToU connection, which in practice means a sanctioned load below 5 kW. Our{" "}
            <a href="/blog/protected-consumer-200-unit-rule">guide to the 200-unit rule</a> covers the condition most
            explanations miss, and the <a href="/electricity-tariff">tariff page</a> has both rate schedules side by side.
          </p>
          <h2>What to do with the result</h2>
          <ul>
            <li><strong>Protected with little headroom:</strong> the months to watch are the hot ones. One air-conditioner for a month is usually enough to cross 200.</li>
            <li><strong>Just lost it:</strong> the bill is painful for six months. The <a href="/bill-calculator">bill calculator</a> shows the difference, and the <a href="/blog/bijli-ka-bill-kam-kaise-karein">guide to cutting a bill</a> is where to start.</li>
            <li><strong>The bill says unprotected but the history says protected:</strong> query it with your DISCO, with the six bills in hand. The company pages list each one&apos;s complaint numbers.</li>
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
