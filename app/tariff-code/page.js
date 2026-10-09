import { SITE_URL, buildMeta } from "../../lib/seo";
import { CATEGORY_SOURCE } from "../../lib/tariffs";
import { TARIFF_FAMILIES } from "../../lib/tariffCodes";
import TariffDecoder from "./TariffDecoder";

export const metadata = buildMeta({
  title: "Tariff Code on Your Electricity Bill: What A-1, A-2, B-2 Mean",
  description:
    "Type the tariff code printed on your electricity bill and see what it means: residential, commercial, industrial, agricultural and the rest, with every NEPRA category and sub-code explained.",
  path: "/tariff-code",
  imageAlt: "Electricity bill tariff code decoder",
});

const FAQS = [
  ["Where is the tariff code on my bill?", "Near the top of the bill, in the connection details beside the sanctioned load, labelled Tariff. It looks like A-1a(01), A-2 or B-2(b)."],
  ["What does A-1 mean on an electricity bill?", "A-1 is the residential tariff. A-1(a) is a home with a sanctioned load below 5 kW, billed on units in slabs. A-1(b) is a home with 5 kW or more, billed Time of Use at peak and off-peak rates."],
  ["Does the tariff code show whether I am a protected consumer?", "Not reliably. Protected, unprotected and lifeline are all inside A-1(a) and depend on your units over the last six months. Some bills mark it beside the code and some do not, so check your six months of units instead."],
  ["My home is billed as A-2 commercial. Is that right?", "Only if it is used as a business. A dwelling used only as a home belongs on A-1. A wrong category changes every rate on the bill, so ask your sub-division office to correct it; our complaint letter tool writes the request."],
  ["What do the numbers in brackets mean, like (01)?", "They are your distribution company's own billing sub-codes. The category is the letter and number at the start; the brackets do not change which NEPRA tariff applies."],
];

export default function TariffCodePage() {
  const pageUrl = `${SITE_URL}/tariff-code`;
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
    { "@type": "ListItem", position: 3, name: "Tariff code", item: pageUrl },
  ] };
  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="container legal-inner post-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <a href="/tools">Tools</a> <span>/</span> <span aria-current="page">Tariff code</span>
        </nav>
        <h1>What the tariff code on your bill means</h1>
        <p className="legal-intro">
          Every electricity bill carries a short tariff code that decides which rate table you are billed on. Type yours and
          see the category, what it implies, and whether it looks right for your connection.
        </p>

        <TariffDecoder />

        <div className="prose">
          <h2>Every category in the Schedule of Tariff</h2>
          <p>
            These are the consumer categories NEPRA notifies for the distribution companies, from the Schedule of Tariff
            (<a href={CATEGORY_SOURCE.stillInForce.url} target="_blank" rel="noopener noreferrer">{CATEGORY_SOURCE.stillInForce.sro}</a>).
            The domestic rates themselves are on our <a href="/electricity-tariff">tariff page</a>.
          </p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Code</th><th>Category</th><th>Who it covers</th></tr></thead>
              <tbody>
                {TARIFF_FAMILIES.map((f) => (
                  <tr key={f.letter}>
                    <td>{f.letter}</td>
                    <td>{f.name}</td>
                    <td>
                      {f.who}
                      {f.subs.length > 0 && (
                        <ul className="tc-subs">
                          {f.subs.map((s) => (
                            <li key={s[0]}><strong>{s[0]}</strong>: {s[1]}</li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Why the code matters</h2>
          <ul>
            <li><strong>It picks the rate table.</strong> Commercial units cost more than residential ones, and a Time-of-Use code means peak-hour units cost more than off-peak.</li>
            <li><strong>It decides the fixed charge.</strong> Larger and ToU categories pay a charge per kilowatt of load or demand whether or not they use any units.</li>
            <li><strong>It limits what you can qualify for.</strong> Only an A-1(a) connection can be a protected or lifeline consumer.</li>
          </ul>
          <p>
            If the code does not match how the premises is used, ask the sub-division office printed on your bill to correct it.
            The <a href="/complaint-letter">complaint letter tool</a> writes that request in English or Urdu.
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
