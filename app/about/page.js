import { SITE_URL, buildMeta } from "../../lib/seo";

export const metadata = buildMeta({
  title: "About eBill Pakistan | Free Electricity Bill Checker",
  description:
    "eBill Pakistan is a free, independent tool that lets you check your electricity bill online in seconds, with no app and no sign-up. Learn what we do and why.",
  path: "/about",
});

const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/about#aboutpage`,
  url: `${SITE_URL}/about`,
  name: "About eBill Pakistan",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
};

export default function About() {
  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutLd) }} />
      <div className="container legal-inner">
        <div className="crumb">
          <a href="/">Home</a> <span>/</span> <span>About</span>
        </div>
        <h1>About eBill Pakistan</h1>
        <p className="legal-intro">
          eBill Pakistan (ebillpakistan.pk) is a free, simple way to check your electricity bill
          online. Type your reference number and we&apos;ll pull up your latest bill in seconds, with no
          app to install and no account to create.
        </p>

        <div className="prose">
          <h2>Why we built it</h2>
          <p>
            Checking your electricity bill in Pakistan often means digging out the paper copy,
            visiting an official portal, or guessing which company you&apos;re even with. We wanted
            something faster: one box, one number, your bill. That&apos;s eBill Pakistan.
          </p>

          <h2>What you can do</h2>
          <ul>
            <li>View your latest electricity bill instantly using your reference or account number.</li>
            <li><strong>Pick your company</strong> from the list, whether you&apos;re on LESCO, MEPCO,
              PESCO or any other DISCO.</li>
            <li>Download your bill as a PDF or share it on WhatsApp in a single tap.</li>
          </ul>

          <h2>Companies we support</h2>
          <p>
            We cover all the major distribution companies across Pakistan: LESCO, IESCO, MEPCO, FESCO,
            GEPCO, HESCO, PESCO, QESCO, SEPCO, TESCO, HAZECO and the AJK Electricity Department.
          </p>

          <h2>Free and independent</h2>
          <p>
            eBill Pakistan is completely free to use and is run independently. We are not affiliated
            with, endorsed by, or operated by PITC or any distribution company; we simply make it
            easier to view bills that are already available to you. For official payments, complaints
            or disputes, please use your company&apos;s official channels.
          </p>

          <h2>How the lookup actually works</h2>
          <p>
            There is no magic and no scraping of anything private. Your bill already exists in the
            national billing system operated by the Power Information Technology Company (PITC), and
            it is already retrievable by reference number — that is how the official portal works
            too. What we do is fetch it, parse it, and render it in a form that is readable on a
            phone, then add the analysis the official portal does not provide: which tariff band your
            units landed in, how this month compares with the last, what each surcharge on{" "}
            <em>this</em> bill is, and how close you are to a band boundary.
          </p>
          <p>
            That last part is the reason the site exists. Anyone can show you a bill. Very little
            explains why it is the size it is, and Pakistani domestic billing has one rule —
            crossing a slab boundary reprices your whole month, not just the extra units — that
            accounts for most of the bills people find inexplicable.
          </p>

          <h2>Where our figures come from</h2>
          <p>
            Tariff rates come from the NEPRA notification currently in force, cited by SRO number and
            effective date on <a href="/electricity-tariff">the tariff page</a>. Complaint numbers and
            office addresses come from each distribution company&apos;s own website, with the page
            and date recorded. Where we cannot verify something from a primary source, we leave it
            out rather than estimate it — including, at the time of writing, the exact qualifying
            period for protected-consumer status, which is widely quoted online but which we could
            not confirm from any NEPRA document.
          </p>
          <p>
            Our <a href="/editorial-policy">editorial policy</a> sets out the full sourcing hierarchy,
            how often pages are re-checked, and how to report an error. If a figure here is wrong, we
            want to hear about it — <a href="/contact">tell us</a> and we will fix it and bump the
            date on the page.
          </p>

          <h2>How the site is paid for</h2>
          <p>
            Checking a bill is free and always will be. The site is supported by advertising, which
            never determines what we publish: no advertiser sees a page before it goes live, and we
            do not accept paid links or sponsored content inside our guides. Advertising cookies are
            not set unless you accept them — see our <a href="/privacy">privacy policy</a> for what
            that means and how to change your mind.
          </p>

          <h2>What&apos;s next</h2>
          <p>
            The immediate priorities are annotated bill photographs for each company, so the guides
            can show you exactly where a field sits on your specific bill, and per-company complaint
            numbers for the companies that do not publish one. Have a suggestion?{" "}
            <a href="/contact">Tell us</a> — the roadmap is mostly reader requests.
          </p>
        </div>
      </div>
    </section>
  );
}
