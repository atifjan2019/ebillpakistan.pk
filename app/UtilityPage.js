// Shared page for gas (SNGPL, SSGC) and PTCL bills. Thin on purpose: every
// differentiating fact lives in lib/utilities.js.
import { UTILITIES, UTILITY_CODES, utilitySlug } from "../lib/utilities";
import { DISCOS } from "../lib/discos";
import { SITE_URL, HOME_URL } from "../lib/seo";
import PortalHandoff from "./PortalHandoff";
import PtclEbill from "./PtclEbill";

export default function UtilityPage({ code }) {
  const u = UTILITIES[code];
  const year = new Date().getFullYear();
  const fields = u.fields || [
    { key: "number", label: u.id.label, pattern: `[0-9]{${u.id.min},${u.id.max}}`, placeholder: u.id.min === u.id.max ? `${u.id.min} digits` : `${u.id.min} or ${u.id.max} digits` },
  ];
  const others = UTILITY_CODES.filter((c) => c !== code);
  const kindWord = u.kind === "gas" ? "gas" : "landline and broadband";

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: u.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: `${u.abbr} Bill Check`, item: `${SITE_URL}/${utilitySlug(code)}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="hero">
        <div className="container">
          <nav aria-label="Breadcrumb" className="hero-crumb">
            <ol>
              <li><a href={HOME_URL}>Home</a></li>
              <li aria-current="page">{u.abbr} Bill Check</li>
            </ol>
          </nav>
          <span className="eyebrow"><span className="dot" /> {u.abbr} • {u.kind === "gas" ? "Gas" : "Phone and internet"} • {u.region}</span>
          <h1>{u.abbr} Bill Check Online <span className="grad">{year}</span></h1>
          <p className="sub">{u.intro}</p>

          <PortalHandoff code={code} abbr={u.abbr} fields={fields} portal={u.portal} />

          <p className="search-foot" style={{ marginTop: 10 }}>{u.id.hint}</p>
          {code === "ptcl" && (
            <>
              <p className="search-foot" style={{ marginTop: 18 }}><b>Got the SMS?</b> PTCL texts and emails a one-off e-bill link for every invoice. Paste it and the bill shows right here, with no picture code.</p>
              <PtclEbill />
            </>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Why the portal</span>
            <h2>Why we hand you to {u.abbr}&apos;s own site</h2>
            <p>
              {u.abbr}&apos;s portal protects its bills with a picture check that a person has to complete, so no
              third-party site can fetch a {kindWord} bill for you the way we fetch electricity bills. We keep your
              number ready, copy it for pasting, and open the official page: three taps instead of ten.
            </p>
          </div>
          <ol className="steps">
            <li className="step"><span className="num">1</span><h3>Enter the number once</h3><p>{u.id.hint} It is saved in your browser for next time.</p></li>
            <li className="step"><span className="num">2</span><h3>Open {u.abbr}&apos;s portal</h3><p>The button copies your number and opens the {u.portal.name} in a new tab.</p></li>
            <li className="step"><span className="num">3</span><h3>Paste, pass the check, done</h3><p>{u.portal.how}</p></li>
          </ol>
        </div>
      </section>

      {u.sections.map((s) => (
        <section className="section" key={s.heading}>
          <div className="container prose">
            <h2>{s.heading}</h2>
            {s.paras.map((p) => <p key={p}>{p}</p>)}
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Help</span>
            <h2>{u.abbr} helpline and complaints</h2>
          </div>
          <div className="tool-links tool-links--grid">
            <a className="tool-link" href={`tel:${u.helpline}`}><b>Call {u.helpline}</b><span>{u.abbr}&apos;s helpline for bills, readings and connections.</span></a>
            {u.phone && <a className="tool-link" href={`tel:${u.phone.replace(/[^0-9+]/g, "")}`}><b>{u.phone}</b><span>Head office switchboard.</span></a>}
            <a className="tool-link" href={`mailto:${u.email}`}><b>{u.email}</b><span>Written complaints, with your consumer number in the subject.</span></a>
            <a className="tool-link" href={u.website} target="_blank" rel="noopener noreferrer"><b>{u.website.replace(/^https?:\/\//, "")}</b><span>The company&apos;s own site, where complaints are lodged and tracked.</span></a>
          </div>
          <p className="section-foot">Contact details read from {u.full}&apos;s own website on {u.verifiedOn}.</p>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Questions</span>
            <h2>{u.abbr} bill questions</h2>
          </div>
          <div className="faq">
            {u.faqs.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Other bills</span>
            <h2>Your other household bills</h2>
          </div>
          <div className="tool-links tool-links--grid">
            {others.map((c) => (
              <a key={c} className="tool-link" href={`/${utilitySlug(c)}`}><b>{UTILITIES[c].abbr} bill</b><span>{UTILITIES[c].full}</span></a>
            ))}
            <a className="tool-link" href="/"><b>Electricity bill</b><span>All {Object.keys(DISCOS).length} distribution companies, shown here in full.</span></a>
          </div>
        </div>
      </section>
    </>
  );
}
