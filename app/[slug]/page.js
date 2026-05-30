import Image from "next/image";
import { notFound } from "next/navigation";
import { DISCOS, hasLogo, discoLogo } from "../../lib/discos";
import { COMPANIES, faqsFor, slugFor, codeFromSlug } from "../../lib/companies";
import { SITE_URL, HOME_URL, OG_IMAGE, TWITTER_SITE } from "../../lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(DISCOS).map((code) => ({ slug: slugFor(code) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const code = codeFromSlug(slug);
  if (!code) return {};
  const [abbr] = DISCOS[code];
  const c = COMPANIES[code];
  const year = new Date().getFullYear();
  const title = `${abbr} Bill Check Online ${year} | ${c.full} | eBill Pakistan`;
  const description = `Check your ${abbr} (${c.full}) electricity bill online for free. Enter your reference number to instantly view, print or download your latest bill. Serving ${c.cities.slice(0, 4).join(", ")} and more.`;
  const ogImage = { ...OG_IMAGE, alt: `Check your ${abbr} electricity bill online - eBill Pakistan` };
  return {
    title,
    description,
    alternates: { canonical: `/${slugFor(code)}` },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "eBill Pakistan",
      url: `/${slugFor(code)}`,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", site: TWITTER_SITE, title, description, images: [OG_IMAGE.url] },
  };
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
  const year = new Date().getFullYear();
  const others = Object.keys(DISCOS).filter((x) => x !== code);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({
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
                  <input id="reference" name="reference" inputMode="numeric" pattern="[0-9]{8,14}"
                    maxLength={14} placeholder="e.g. 12345678901234" required autoFocus />
                </div>
              </div>
              <button type="submit" className="btn btn-primary"><Search /> Check {abbr} Bill</button>
            </div>
            <p className="search-foot">Your 14-digit reference number is printed at the top-left of your {abbr} bill.</p>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container article">
          <h2>About {abbr}</h2>
          <p>{c.about}</p>
          <p>
            For official notices, tariff schedules and customer services, visit the{" "}
            <a href={c.website} target="_blank" rel="noopener noreferrer">
              official {abbr} website
            </a>.
          </p>

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
            {faqs.map(([q, a], i) => (
              <details key={i} open={i === 0}>
                <summary>{q}</summary>
                <div className="a">{a}</div>
              </details>
            ))}
          </div>

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
