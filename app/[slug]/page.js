import Image from "next/image";
import RefInput from "../RefInput";
import CheckBillLoader from "../CheckBillLoader";
import { notFound } from "next/navigation";
import { DISCOS, hasLogo, discoLogo } from "../../lib/discos";
import { COMPANIES, slugFor, codeFromSlug } from "../../lib/companies";
import { complaintsFor, contentFor, faqsFor, seoFor, SECTIONS } from "../../lib/discoContent";
import { guidesFor } from "../../lib/articles";
import { tariffFor } from "../../lib/tariffs";
import { safe, stripVerify } from "../../lib/verify";
import { SITE_URL, HOME_URL, buildMeta } from "../../lib/seo";
import ComplaintChannels from "../ComplaintChannels";
import ContentSection from "../ContentSection";
import TariffTable from "../TariffTable";
import Districts from "../Districts";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(DISCOS).map((code) => ({ slug: slugFor(code) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const code = codeFromSlug(slug);
  if (!code) return {};
  const [abbr] = DISCOS[code];
  const seo = seoFor(code, new Date().getFullYear());
  if (!seo) return {};
  return buildMeta({
    title: seo.title,
    description: seo.description,
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
  const content = contentFor(code);
  const faqs = faqsFor(code);
  const complaints = complaintsFor(code);
  const tariff = tariffFor(code);
  const year = new Date().getFullYear();
  const others = Object.keys(DISCOS).filter((x) => x !== code);
  const guides = guidesFor(code);

  // FAQPage schema is built from this company's REAL questions. stripVerify is a
  // belt-and-braces guard: structured data has no container to omit, so a marker
  // must never survive into it.
  const faqLd = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(([q, a]) => ({
          "@type": "Question",
          name: stripVerify(q),
          acceptedAnswer: { "@type": "Answer", text: stripVerify(a) },
        })),
      }
    : null;
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
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
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
          <p className="sub">{content?.intro || `${c.full}. Check your ${abbr} bill by reference number.`}</p>

          <form id="lookup" className="search-card" action="/result" method="get">
            <input type="hidden" name="disco" value={code} />
            <div className="search-grid solo">
              <div className="field">
                <label htmlFor="reference">{abbr} reference number</label>
                <div className="control">
                  <RefInput id="reference" name="reference" inputMode="numeric" pattern="[0-9]{8,14}"
                    placeholder="e.g. 12345678901234" required autoFocus />
                </div>
              </div>
              <button type="submit" className="btn btn-primary"><Search /> Check {abbr} Bill</button>
            </div>
            <p className="search-foot">
              <span className="only-wide">Your 14-digit reference number is printed at the top-left of your {abbr} bill.</span>
              <span className="only-narrow">Reference number: top-left of your {abbr} bill.</span>
            </p>
            <CheckBillLoader />
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container article">
          {/* Task 2: the "how to check" steps and the generic "understanding your
              bill" paragraph used to be restated in full on all twelve pages.
              They are now one sentence each, pointing at the single canonical
              explanation. One good guide linked twelve times beats twelve copies. */}
          <p className="page-lede">
            Enter the reference number above and your latest {abbr} bill loads in a few seconds —
            free, with no account. New to reading one? Our{" "}
            <a href="/sample-bill-explained">annotated sample bill</a> explains every line.
          </p>

          <Districts abbr={abbr} cities={c.cities} region={c.region} color={color} />

          {SECTIONS.map(({ key, heading }) => (
            <ContentSection key={key} id={key} heading={heading(abbr)} section={content?.[key]}>
              {/* safe() not a raw render: the image slot is a {{VERIFY}} until a
                  real annotated photo exists, and must vanish in production. */}
              {key === "billLayout" && safe(content?.billLayout?.image) && (
                <p className="bill-image-slot">{safe(content.billLayout.image)}</p>
              )}
            </ContentSection>
          ))}

          <h2>{abbr} tariff bands</h2>
          <p>
            {abbr} does not set your rate — tariffs are notified by NEPRA and applied by every
            distribution company alike. What {abbr} does is read your meter and bill you in the
            bands below.
          </p>
          <TariffTable data={tariff} heading={`${abbr} domestic tariff bands`} />

          <ComplaintChannels abbr={abbr} city={city} website={c.website} data={complaints} />

          {faqs.length > 0 && (
            <>
              <h2>{abbr} bill: frequently asked questions</h2>
              <div className="faq" style={{ marginTop: 16 }}>
                {faqs.map(([q, a], i) => (
                  <details key={i} open={i === 0}>
                    <summary>{q}</summary>
                    <div className="a">{a}</div>
                  </details>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {guides.length > 0 && (
        <section className="section">
          <div className="container article">
            <h2>Helpful {abbr} guides</h2>
            <ul className="guide-links">
              {guides.map((g) => (
                <li key={g.slug}>
                  <a href={`/blog/${g.slug}`}>{g.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

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
