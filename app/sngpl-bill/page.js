import Image from "next/image";
import RefInput from "../RefInput";
import CheckBillLoader from "../CheckBillLoader";
import { DISCOS, hasLogo, discoLogo } from "../../lib/discos";
import { slugFor } from "../../lib/companies";
import { SITE_URL, HOME_URL, buildMeta } from "../../lib/seo";
import SngplGate from "./SngplGate";

const SNGPL = {
  abbr: "SNGPL",
  full: "Sui Northern Gas Pipelines Limited",
  color: "#e8731c",
  region: "Punjab, Khyber Pakhtunkhwa, Azad Kashmir and northern Pakistan",
  cities: ["Lahore", "Faisalabad", "Rawalpindi", "Islamabad", "Peshawar", "Multan", "Gujranwala", "Sialkot", "Sargodha", "Abbottabad", "Bahawalpur", "Sahiwal"],
  about:
    "SNGPL, Sui Northern Gas Pipelines Limited, is Pakistan's largest natural-gas distribution company. It supplies piped natural gas to millions of domestic, commercial and industrial consumers across Punjab, Khyber Pakhtunkhwa, Azad Jammu & Kashmir and the northern regions, operating one of the largest integrated gas networks in the country.",
  website: "https://www.sngpl.com.pk",
  helpline: "1199",
};

const FAQS = [
  ["Where do I find my SNGPL consumer number?", "It is the 11-digit consumer number printed at the top of your SNGPL gas bill, usually labelled “Consumer No.”. You only need this number to check your bill."],
  ["Why does SNGPL ask for a captcha?", "The official SNGPL portal requires a captcha (the code shown in the image) before it displays a bill. This is SNGPL's own security check, so the bill cannot be opened in a single click the way electricity bills can."],
  ["Is this my official SNGPL bill?", "Yes. The bill is served directly from SNGPL's official portal (sngpl.com.pk). eBill Pakistan only makes it easier to reach — it does not store your data."],
  ["How often is the SNGPL gas bill issued?", "SNGPL issues bills monthly, based on the reading taken from your gas meter. Your bill shows the current charges, due date and recent consumption history."],
  ["What is the SNGPL helpline number?", "You can reach SNGPL customer services on their UAN 1199, or visit the official SNGPL website for regional office details."],
];

export async function generateMetadata() {
  const year = new Date().getFullYear();
  return buildMeta({
    title: `SNGPL Gas Bill Check Online ${year} | eBill Pakistan`,
    description:
      "Check your SNGPL (Sui Northern Gas) bill online for free. Enter your 11-digit consumer number to view, print or download your latest gas bill from the official portal.",
    path: "/sngpl-bill",
    imageAlt: "Check your SNGPL gas bill online - eBill Pakistan",
  });
}

const Search = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
);

const isValidConsumer = (v) => /^[0-9]{10,11}$/.test(v);

export default async function SngplBillPage({ searchParams }) {
  const sp = await searchParams;
  const consumer = String(sp?.consumer || "").trim();

  // ---- Result state: consumer number submitted -> show the gateway + portal ----
  if (isValidConsumer(consumer)) {
    return (
      <section className="result-wrap">
        <div className="container">
          <div className="crumb">
            <a href="/">Home</a> <span>/</span> <a href="/sngpl-bill">SNGPL bill</a> <span>/</span> <span>Result</span>
          </div>
          <div className="result-head">
            <div>
              <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="badge" style={{ "--c": SNGPL.color, width: 40, height: 40, borderRadius: 11, display: "grid", placeItems: "center", background: `color-mix(in srgb, ${SNGPL.color} 14%, #fff)`, color: SNGPL.color, fontWeight: 800, fontSize: 14 }}>
                  SN
                </span>
                SNGPL Gas Bill
              </h1>
              <p className="ref">Consumer No: <b>{consumer}</b> · {SNGPL.full}</p>
            </div>
            <a className="btn btn-ghost" href="/sngpl-bill">← Check another bill</a>
          </div>

          <SngplGate consumer={consumer} />
        </div>
      </section>
    );
  }

  // ---- Landing state: rich SEO page (mirrors the electricity company pages) ----
  const year = new Date().getFullYear();
  const others = Object.keys(DISCOS);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "SNGPL Bill Check", item: `${SITE_URL}/sngpl-bill` },
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
              <li aria-current="page">SNGPL Bill Check</li>
            </ol>
          </nav>
          <span className="eyebrow"><span className="dot" /> SNGPL • Gas • Northern Pakistan</span>
          <h1>SNGPL Gas Bill Check Online <span className="grad">{year}</span></h1>
          <p className="sub">{SNGPL.full}. Enter your 11-digit consumer number below to view, print or download your latest SNGPL gas bill from the official portal. Free and instant.</p>

          <form id="lookup" className="search-card" action="/sngpl-bill" method="get">
            <div className="search-grid solo">
              <div className="field">
                <label htmlFor="consumer">SNGPL consumer number</label>
                <div className="control">
                  <RefInput id="consumer" name="consumer" inputMode="numeric" pattern="[0-9]{10,11}"
                    placeholder="e.g. 97709930008" required autoFocus />
                </div>
              </div>
              <button type="submit" className="btn btn-primary"><Search /> Check SNGPL Bill</button>
            </div>
            <p className="search-foot">Your 11-digit consumer number is printed at the top of your SNGPL gas bill.</p>
            <CheckBillLoader />
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container article">
          <h2>About SNGPL</h2>
          <p>{SNGPL.about}</p>

          <h2>Areas SNGPL serves</h2>
          <p>SNGPL distributes natural gas across {SNGPL.region}, including:</p>
          <div className="chips">
            {SNGPL.cities.map((ct) => <span key={ct} className="chip" style={{ "--c": SNGPL.color }}>{ct}</span>)}
          </div>

          <h2>How to check your SNGPL bill</h2>
          <ol className="howto">
            <li>Find the 11-digit <strong>consumer number</strong> at the top of your paper SNGPL gas bill.</li>
            <li>Type it into the box above and press <strong>Check SNGPL Bill</strong>.</li>
            <li>On the next screen, enter the <strong>captcha</strong> shown and view your latest bill from the official SNGPL portal — then print or save it.</li>
          </ol>

          <h2>SNGPL bill: frequently asked questions</h2>
          <div className="faq" style={{ marginTop: 16 }}>
            {FAQS.map(([q, a], i) => (
              <details key={i} open={i === 0}>
                <summary>{q}</summary>
                <div className="a">{a}</div>
              </details>
            ))}
          </div>

          <h3>SNGPL helpline &amp; contact</h3>
          <dl className="contact-dl">
            <dt>Customer helpline (UAN)</dt>
            <dd>{SNGPL.helpline}</dd>
            <dt>Offices &amp; complaints</dt>
            <dd>For office locations and regional customer services, visit the{" "}
              <a href={SNGPL.website} target="_blank" rel="noopener noreferrer">official SNGPL website</a>.</dd>
          </dl>

          <h3>Understanding your SNGPL bill</h3>
          <p>
            An SNGPL bill identifies your connection by its <strong>11-digit consumer number</strong>. It shows the
            <strong> gas consumed</strong> for the month (in cubic metres / MMBTU), the <strong>amount payable</strong>,
            the <strong>due date</strong>, and a short history of recent months. Government levies and the gas
            infrastructure development cess can appear as additional lines. Tariffs are set by OGRA, not by SNGPL.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: "#fff", borderTop: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head"><h2>Check an electricity bill</h2></div>
          <div className="disco-grid">
            {others.map((x) => {
              const [a2, ci2, co2] = DISCOS[x];
              return (
                <a key={x} className="disco-card" href={`/${slugFor(x)}`} style={{ "--c": co2 }}>
                  <span className={hasLogo(x) ? "badge badge--logo" : "badge"}>
                    {hasLogo(x)
                      ? <Image src={discoLogo(x)} alt={`${a2} logo`} className="badge-logo" width={56} height={56} loading="lazy" />
                      : a2.slice(0, 2)}
                  </span>
                  <span className="name">{a2}</span>
                  <span className="city">{ci2}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
