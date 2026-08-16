import { SITE_URL, buildMeta } from "../../lib/seo";
import { AUTHORS, DEFAULT_AUTHOR } from "../../lib/authors";

export const metadata = buildMeta({
  title: "Editorial Policy | eBill Pakistan",
  description:
    "How eBill Pakistan sources tariff figures, helpline numbers and office addresses, how often pages are reviewed, and how to report an error on any page.",
  path: "/editorial-policy",
});

const editor = AUTHORS[DEFAULT_AUTHOR];

const policyLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/editorial-policy#webpage`,
  url: `${SITE_URL}/editorial-policy`,
  name: "Editorial Policy",
  description:
    "Sourcing, verification, review and correction standards for everything published on eBill Pakistan.",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
};

export default function EditorialPolicy() {
  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(policyLd) }} />
      <div className="container legal-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <span aria-current="page">Editorial policy</span>
        </nav>

        <h1>Editorial policy</h1>
        <p className="legal-updated">Last updated: 16 August 2026</p>
        <p className="legal-intro">
          eBill Pakistan publishes information about money: what your electricity costs, which
          charges are legitimate, who qualifies for a subsidy, and which &ldquo;subsidy&rdquo;
          messages are scams. Getting that wrong costs readers real rupees, so this page sets out
          exactly where our figures come from, who writes them, how often they are re-checked, and
          how to tell us when we have made a mistake.
        </p>

        <div className="prose">
          <h2>Who writes this site</h2>
          <p>
            Every guide on eBill Pakistan carries a visible byline linking to the author&apos;s
            page. The site is written and edited by{" "}
            <a href={`/author/${editor.slug}`}>{editor.name}</a>, {editor.role.toLowerCase()}.
            There are no anonymous posts, no syndicated filler and no AI-generated articles
            published without a named human reviewing every factual claim in them.
          </p>

          <h2>Where our numbers come from</h2>
          <p>We use a strict source hierarchy, and we name the source on the page:</p>
          <ol>
            <li>
              <strong>Tariff rates, slab boundaries and fixed charges</strong> come from{" "}
              <a href="https://www.nepra.org.pk/tariff/tariff.php" target="_blank" rel="noopener noreferrer">
                NEPRA&apos;s notified consumer-end tariff schedule
              </a>
              . We cite the determination or SRO and its date next to the table.
            </li>
            <li>
              <strong>Helpline numbers, complaint portals, head-office and regional-office
              addresses</strong> come from the distribution company&apos;s own official website
              (its <code>.gov.pk</code> or <code>.com.pk</code> domain) — never from a directory
              site, a social-media post or another blog.
            </li>
            <li>
              <strong>Bill layout, line items and reference-number format</strong> come from the
              official billing system at <code>bill.pitc.com.pk</code> and from real bills.
            </li>
            <li>
              <strong>Government schemes</strong> (subsidy verification, the fan replacement
              programme) come from the official portal for that scheme, with mainstream press
              coverage used only to date an announcement, never to source a figure.
            </li>
          </ol>

          <h2>What we do when we cannot verify something</h2>
          <p>
            We leave it out. This is the single rule that matters most on a site like this. If a
            per-unit rate cannot be traced to a current NEPRA notification, the table shows a dash
            and a &ldquo;pending verification&rdquo; note with a link to the official schedule,
            rather than a plausible-looking number. If a DISCO&apos;s regional office phone number
            cannot be found on that DISCO&apos;s own site, we link to the site instead of printing
            a number that might send someone to a dead line — or worse, to a stranger.
          </p>
          <p>
            An estimated tariff is not a harmless approximation. A reader who budgets against a
            wrong rate, or who calls a wrong &ldquo;helpline&rdquo;, is measurably worse off than a
            reader we simply pointed at the official source.
          </p>

          <h2>Worked examples are labelled as examples</h2>
          <p>
            Some guides walk through a calculation — how a 300-unit bill is built up slab by slab,
            for instance. Where the rates in a worked example are illustrative rather than the
            current approved rates, the page says so in the same paragraph, not in a footnote.
          </p>

          <h2>How often pages are reviewed</h2>
          <ul>
            <li>
              <strong>Tariff tables:</strong> checked against NEPRA whenever a new determination or
              quarterly adjustment is notified, and at minimum every three months.
            </li>
            <li>
              <strong>The twelve DISCO pages:</strong> reviewed at least twice a year, and
              immediately when a company changes its complaint channels or its territory changes
              (as happened when HAZECO was carved out of PESCO).
            </li>
            <li>
              <strong>Guides:</strong> reviewed at least once a year, and straight away when a
              scheme, portal or process they describe changes.
            </li>
            <li>
              <strong>Everything:</strong> corrected as soon as an error is confirmed, whenever we
              or a reader spots it.
            </li>
          </ul>
          <p>
            Every guide and every DISCO page shows a &ldquo;last updated&rdquo; date driven by the
            content itself, not by the build date, so a date you see on a page is a date somebody
            actually looked at it.
          </p>

          <h2>Corrections</h2>
          <p>
            If a figure, address or instruction on this site is wrong, we want to know. Email{" "}
            <a href="mailto:support@ebillpakistan.pk">support@ebillpakistan.pk</a> or use the{" "}
            <a href="/contact">contact form</a> and pick <em>Report incorrect data</em>. Tell us the
            page and what is wrong; a link to the official source is ideal but not required.
          </p>
          <p>
            Confirmed errors are fixed and the page&apos;s &ldquo;last updated&rdquo; date is
            bumped. Where a correction changes the meaning of something a reader may have acted on
            — a rate, a threshold, a deadline — we note the change on the page rather than editing
            silently.
          </p>

          <h2>Independence</h2>
          <p>
            eBill Pakistan is an independent website. It is <strong>not</strong> operated by,
            affiliated with, endorsed by or funded by the Power Information Technology Company
            (PITC), NEPRA, the Power Division, or any distribution company — LESCO, IESCO, MEPCO,
            FESCO, GEPCO, HESCO, PESCO, QESCO, SEPCO, TESCO, HAZECO or the AJK Electricity
            Department. Company names and logos are used to identify the company whose bill a page
            is about; they remain the property of their owners.
          </p>
          <p>
            We cannot pay a bill, change a reading, restore a connection or settle a billing
            dispute. Those all sit with your distribution company, and every page that touches them
            says so and points you to the right official channel.
          </p>

          <h2>How the site makes money</h2>
          <p>
            Checking a bill here is free and always will be, with no account and no fee. The site is
            supported by advertising. Advertising never determines what we publish, no advertiser
            gets to review a page before it goes live, and we do not accept paid placements, paid
            links or sponsored posts inside our guides. If that ever changes, any paid content will
            be labelled as such on the page itself. How advertising cookies work, and how to turn
            personalised ads off, is covered in our <a href="/privacy">privacy policy</a>.
          </p>

          <h2>Your data</h2>
          <p>
            A bill lookup sends only the reference number you type to the upstream billing system.
            We do not create an account for you, and we do not keep your bill. The full detail is in
            the <a href="/privacy">privacy policy</a>.
          </p>
        </div>

        <p className="legal-note">
          Questions about this policy? Email{" "}
          <a href="mailto:support@ebillpakistan.pk">support@ebillpakistan.pk</a>.
        </p>
      </div>
    </section>
  );
}
