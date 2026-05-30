import Image from "next/image";
import RefInput from "./RefInput";
import CheckBillLoader from "./CheckBillLoader";
import { DISCOS, hasLogo, discoLogo } from "../lib/discos";
import { SITE_URL, HOME_URL, OG_IMAGE, TWITTER_SITE, SOCIAL } from "../lib/seo";

const HOME_TITLE = "eBill Pakistan | Check Your Electricity Bill Online";
const HOME_DESC =
  "Check your electricity bill online for LESCO, IESCO, MEPCO, FESCO and all 12 major DISCOs in Pakistan. Free, instant, no sign-up needed.";

export const metadata = {
  title: HOME_TITLE,
  description: HOME_DESC,
  // NOTE: canonical and og:url are emitted as raw <head> tags in the component
  // below (see HOME_URL). The Metadata API strips the root trailing slash, so we
  // bypass it here to keep canonical, og:url and the sitemap all = HOME_URL.
  // Re-supply type/siteName/image/description: Next replaces (not deep-merges)
  // the parent openGraph when a page sets its own, so omitting these drops them.
  openGraph: {
    type: "website",
    siteName: "eBill Pakistan",
    locale: "en_PK",
    title: HOME_TITLE,
    description: HOME_DESC,
    images: [OG_IMAGE],
  },
  // Keep twitter:description identical to og:description, and carry the handle.
  twitter: {
    card: "summary_large_image",
    site: TWITTER_SITE,
    title: HOME_TITLE,
    description: HOME_DESC,
    images: [{ url: OG_IMAGE.url, alt: HOME_TITLE }],
  },
};

/* inline icons (no external requests) */
const I = {
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l7 3v5c0 4.4-3 8.3-7 10-4-1.7-7-5.6-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/></svg>,
  bolt: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>,
  free: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M9 9.5C9 8 10.3 7 12 7s3 1 3 2.5S13.5 12 12 12s-3 .8-3 2.5S10.3 17 12 17s3-1 3-2.5"/></svg>,
  list: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>,
  doc: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M9 13h6M9 17h6"/></svg>,
  lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m5 13 4 4L19 7"/></svg>,
};

const FAQS = [
  ["Where do I find my reference number?", "Your 14-digit reference number is printed at the top-left of your paper electricity bill, usually labelled “Reference No”. You can also use your account number."],
  ["Is eBill Pakistan free to use?", "Yes, checking and downloading your bill is completely free, with no sign-up required."],
  ["Which companies are supported?", "All major Pakistani distribution companies: LESCO, IESCO, MEPCO, FESCO, GEPCO, HESCO, PESCO, QESCO, SEPCO, TESCO, HAZECO and AJK."],
  ["Is my information safe?", "We fetch your bill on our own server and only ever look up the reference number you enter. We don’t store your bill or share your data."],
  ["Can I print or download my bill?", "Yes. Once your bill loads you can print it or save it as a PDF in a single click."],
];

export default async function Home({ searchParams }) {
  const sp = await searchParams;
  const entries = Object.entries(DISCOS);
  const selected = (sp?.disco || "").toLowerCase();
  const preset = DISCOS[selected] ? selected : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: "eBill Pakistan",
        description: "Check your electricity bill online for all major DISCOs in Pakistan.",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "eBill Pakistan",
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/images/logo.png`,
        sameAs: [SOCIAL.facebook, SOCIAL.twitter],
      },
      {
        "@type": "Service",
        name: "Online Electricity Bill Check",
        serviceType: "Electricity bill enquiry and download",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Pakistan" },
        description:
          "Free online checking and downloading of electricity bills for all major distribution companies in Pakistan, including LESCO, IESCO, MEPCO, FESCO, GEPCO, HESCO, PESCO, QESCO, SEPCO, TESCO, HAZECO and AJK.",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQS.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };

  return (
    <>
      {/* Canonical + og:url with trailing slash (Metadata API would strip it). */}
      <link rel="canonical" href={HOME_URL} />
      <meta property="og:url" content={HOME_URL} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* hero + search */}
      <section className="hero">
        <div className="container">
          <span className="eyebrow"><span className="dot" /> Free • No sign-up • All companies</span>
          <h1>Check Your <span className="grad">Electricity Bill</span> Online, Without the Hassle</h1>
          <p className="sub">
            No app to download, no account to make. Just pop in your reference number and we&apos;ll
            pull up your latest bill, ready to view, download or send on WhatsApp.
          </p>

          <form id="lookup" className="search-card" action="/result" method="get">
            <div className="search-grid">
              <div className="field">
                <label htmlFor="disco">Company</label>
                <div className="control sel">
                  <select id="disco" name="disco" defaultValue={preset} required>
                    <option value="" disabled>Select your company</option>
                    {entries.map(([code, [abbr]]) => (
                      <option key={code} value={code}>{abbr}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="reference">Reference number</label>
                <div className="control">
                  <RefInput id="reference" name="reference" inputMode="numeric" pattern="[0-9]{8,14}"
                    maxLength={14} placeholder="e.g. 12345678901234" required autoFocus={!!preset} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">{I.search} Check Bill</button>
            </div>
            <p className="search-foot">{I.shield} Pick your company, then enter the reference number printed at the top-left of your bill.</p>
            <CheckBillLoader />
          </form>

          <div className="trust">
            <span className="pill">{I.free} 100% Free</span>
            <span className="pill">{I.clock} Instant results</span>
            <span className="pill">{I.lock} Private &amp; secure</span>
            <span className="pill">{I.grid} 12 companies</span>
          </div>
        </div>
      </section>

      {/* companies */}
      <section className="section" id="companies">
        <div className="container">
          <div className="section-head">
            <span className="kicker">All companies</span>
            <h2>Find your company</h2>
            <p>Not sure which one you&apos;re with? Check the name printed on your bill, or tap your company here.</p>
          </div>
          <div className="disco-grid">
            {entries.map(([code, [abbr, city, color]]) => (
              <a key={code} className="disco-card" href={`/${code}-bill-check`} style={{ "--c": color }}>
                <span className={hasLogo(code) ? "badge badge--logo" : "badge"}>
                  {hasLogo(code)
                    ? <Image src={discoLogo(code)} alt={`${abbr} logo`} className="badge-logo" width={56} height={56} loading="lazy" />
                    : abbr.slice(0, 2)}
                </span>
                <span className="name">{abbr}</span>
                <span className="city">{city}</span>
                <span className="go">Check bill →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="section" id="how" style={{ background: "#fff", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head">
            <span className="kicker">How it works</span>
            <h2>Honestly, it&apos;s this easy</h2>
          </div>
          <div className="steps">
            <div className="step"><span className="num">1</span><div className="ic">{I.search}</div><h3>Grab your reference number</h3><p>It&apos;s the 14-digit number at the top of your paper bill. That&apos;s all you need.</p></div>
            <div className="step"><span className="num">2</span><div className="ic">{I.grid}</div><h3>Pick your company</h3><p>Select your company from the list and type in your reference number. That&apos;s all we need.</p></div>
            <div className="step"><span className="num">3</span><div className="ic">{I.doc}</div><h3>There&apos;s your bill</h3><p>View it right away, save it as a PDF, or send it on WhatsApp in one tap.</p></div>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Why people use us</span>
            <h2>Made to be genuinely easy</h2>
          </div>
          <div className="features">
            <div className="feature"><div className="ic">{I.bolt}</div><h3>Quick</h3><p>Your bill shows up in a few seconds. No waiting around, nothing to install.</p></div>
            <div className="feature"><div className="ic">{I.free}</div><h3>Always free</h3><p>Check as many bills as you like. There&apos;s never a charge or a sign-up.</p></div>
            <div className="feature"><div className="ic">{I.lock}</div><h3>Yours stays yours</h3><p>We only ever look up the number you type. Nothing is saved or shared.</p></div>
            <div className="feature"><div className="ic">{I.doc}</div><h3>Easy to keep</h3><p>Download a tidy one-page PDF, or share it on WhatsApp in a tap.</p></div>
          </div>
        </div>
      </section>

      {/* faq */}
      <section className="section" id="faq" style={{ background: "#fff", borderTop: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head">
            <span className="kicker">FAQ</span>
            <h2>Questions, answered</h2>
          </div>
          <div className="faq">
            {FAQS.map(([q, a], i) => (
              <details key={i} open={i === 0}>
                <summary>{q}</summary>
                <div className="a">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <h2>Got your bill number handy?</h2>
            <p>Pop it in and you&apos;ll have your bill in about ten seconds. Free, always.</p>
            <a className="btn btn-ghost" href="#lookup">{I.bolt} Check my bill</a>
          </div>
        </div>
      </section>
    </>
  );
}
