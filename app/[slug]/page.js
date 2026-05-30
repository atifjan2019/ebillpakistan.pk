import Image from "next/image";
import RefInput from "../RefInput";
import CheckBillLoader from "../CheckBillLoader";
import { notFound } from "next/navigation";
import { DISCOS, hasLogo, discoLogo } from "../../lib/discos";
import { COMPANIES, faqsFor, slugFor, codeFromSlug } from "../../lib/companies";
import { SITE_URL, HOME_URL, buildMeta } from "../../lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(DISCOS).map((code) => ({ slug: slugFor(code) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const code = codeFromSlug(slug);
  if (!code) return {};
  const [abbr] = DISCOS[code];
  const year = new Date().getFullYear();
  const title = `${abbr} Bill Check Online ${year} | eBill Pakistan`;
  const description = `Check your ${abbr} electricity bill online for free. Enter your 14-digit reference number to instantly view, download or print your latest bill.`;
  return buildMeta({
    title,
    description,
    path: `/${slugFor(code)}`,
    imageAlt: `Check your ${abbr} electricity bill online - eBill Pakistan`,
  });
}

const Search = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
);

export default async function CompanyPage({ params }) {
  const { slug } = await params;
  const code = codeFromSlug(slug);
  if (!code) notFound();

  const [abbr, city, color] = DISCOS[code];
  const c = COMPANIES[code];
  const faqs = faqsFor(code);
  // Two extra FAQs (helpline + reference number) appended to BOTH the visible
  // list and the JSON-LD, so the structured data stays backed by on-page content.
  const extraFaqs = [
    [`What is the helpline number for ${c.full}?`, `You can reach ${abbr} customer support on 118, the national DISCO helpline.`],
    [`What does the reference number on my ${abbr} bill look like?`, `It is a 14-digit number printed at the top-left of your ${abbr} paper bill, usually labelled Reference No. or Consumer No.`],
  ];
  const allFaqs = [...faqs, ...extraFaqs];
  const year = new Date().getFullYear();
  const others = Object.keys(DISCOS).filter((x) => x !== code);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: `${abbr} Bill Check`, item: `${SITE_URL}/${slugFor(code)}` },
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
              <li aria-current="page">{abbr} Bill Check</li>
            </ol>
          </nav>
          {hasLogo(code) && (
            <Image
              className="disco-logo"
              src={discoLogo(code)}
              alt={`${c.full} (${abbr}) logo`}
              width={88}
              height={88}
              priority
            />
          )}
          <span className="eyebrow"><span className="dot" /> {abbr} • {city} region</span>
          <h1>
            {abbr} Bill Check Online <span className="grad">{year}</span>
          </h1>
          <p className="sub">{c.full}. Enter your reference number below to view, print or download your latest {abbr} bill. Free and instant.</p>

          <form id="lookup" className="search-card" action="/result" method="get">
            <input type="hidden" name="disco" value={code} />
            <div className="search-grid solo">
              <div className="field">
                <label htmlFor="reference">{abbr} reference number</label>
                <div className="control">
                  <RefInput id="reference" name="reference" inputMode="numeric" pattern="[0-9]{8,14}"
                    maxLength={14} placeholder="e.g. 12345678901234" required autoFocus />
                </div>
              </div>
              <button type="submit" className="btn btn-primary"><Search /> Check {abbr} Bill</button>
            </div>
            <p className="search-foot">Your 14-digit reference number is printed at the top-left of your {abbr} bill.</p>
            <CheckBillLoader />
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container article">
          <h2>About {abbr}</h2>
          <p>{c.about}</p>

          <h2>Areas {abbr} serves</h2>
          <p>{abbr} distributes electricity across {c.region}, including:</p>
          <div className="chips">
            {c.cities.map((ct) => <span key={ct} className="chip" style={{ "--c": color }}>{ct}</span>)}
          </div>

          <h2>How to check your {abbr} bill</h2>
          <ol className="howto">
            <li>Find the 14-digit <strong>reference number</strong> at the top-left of your paper {abbr} bill.</li>
            <li>Type it into the box above and press <strong>Check {abbr} Bill</strong>.</li>
            <li>Your latest bill appears instantly. <strong>Download it as a PDF</strong>, print it, or share it on WhatsApp.</li>
          </ol>

          <h2>{abbr} bill: frequently asked questions</h2>
          <div className="faq" style={{ marginTop: 16 }}>
            {allFaqs.map(([q, a], i) => (
              <details key={i} open={i === 0}>
                <summary>{q}</summary>
                <div className="a">{a}</div>
              </details>
            ))}
          </div>

          <h2>Tariff &amp; billing information</h2>
          <p>
            Your {abbr} tariff is set by the National Electric Power Regulatory Authority
            (NEPRA), not by {abbr} itself. Domestic consumers are billed on a slab system, where
            the per-unit rate steps up as monthly usage crosses thresholds such as 100, 200 and
            300 units (with higher slabs beyond 300). The more units you use, the higher the rate
            applied to the upper portion. For the current approved rates, see the{" "}
            <a href="https://www.nepra.org.pk" target="_blank" rel="noopener noreferrer">official NEPRA tariff page</a>.
          </p>
          <p>
            {abbr} issues bills monthly, based on the reading taken from your meter. NEPRA also
            recognises protected domestic consumers (those who keep usage below a set threshold
            over several consecutive months), who are charged lower rates than unprotected
            consumers. A bill can additionally carry a fixed or minimum charge, a TV licence fee and
            applicable taxes. Because these rates are revised from time to time, always confirm the
            latest schedule before estimating what you will pay.
          </p>

          <h3>{abbr} helpline &amp; contact</h3>
          <dl className="contact-dl">
            <dt>Customer helpline</dt>
            <dd>118 (the national DISCO helpline used across Pakistan)</dd>
            <dt>Offices &amp; complaints</dt>
            <dd>
              For office locations and regional customer services, visit the{" "}
              <a href={c.website} target="_blank" rel="noopener noreferrer">official {abbr} website</a>.
            </dd>
          </dl>

          <h3>Understanding your {abbr} bill</h3>
          <p>
            A {abbr} bill packs a lot into one page. The <strong>Reference No.</strong> is the
            14-digit number at the top-left that identifies your connection. <strong>Units
            Consumed</strong> is the electricity used during the month, <strong>Amount
            Payable</strong> is the total due, and the <strong>Due Date</strong> is the last day
            to pay before a late-payment surcharge is added. Extra lines such as fuel-price
            adjustment and taxes appear as <strong>surcharges</strong>.
          </p>

        </div>
      </section>

      <section className="section" style={{ background: "#fff", borderTop: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head"><h2>Check another company&apos;s bill</h2></div>
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
