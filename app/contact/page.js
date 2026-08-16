import { SITE_URL, buildMeta } from "../../lib/seo";
import { BUSINESS, addressOneLine } from "../../lib/contact";
import ContactForm from "./ContactForm";
import Verify from "../Verify";

export const metadata = buildMeta({
  title: "Contact Us | eBill Pakistan",
  description:
    "Contact eBill Pakistan: send us a message, report incorrect data on a page, or make a privacy request. Postal address, email and response times.",
  path: "/contact",
});

const a = BUSINESS.address;

const contactLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contact#contactpage`,
  url: `${SITE_URL}/contact`,
  name: "Contact eBill Pakistan",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
  mainEntity: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "eBill Pakistan",
    url: `${SITE_URL}/`,
    email: BUSINESS.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      addressLocality: a.locality,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: BUSINESS.email,
      areaServed: "PK",
      availableLanguage: ["en", "ur"],
    },
  },
};

export default function Contact() {
  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }} />
      <div className="container legal-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <span aria-current="page">Contact</span>
        </nav>
        <h1>Contact us</h1>
        <p className="legal-intro">
          Feedback, a bug, a wrong figure on one of our pages, or a privacy request — send it here
          and a real person will read it. If you just need your bill, you don&apos;t need us:{" "}
          <a href="/">enter your reference number</a> and it takes about ten seconds.
        </p>

        <div className="contact-layout">
          <div className="contact-form-col">
            <h2>Send us a message</h2>
            <ContactForm />
          </div>

          <aside className="contact-details">
            <h2>Contact details</h2>
            <dl className="contact-dl">
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
              </dd>

              <dt>Phone</dt>
              <dd>
                <Verify text={BUSINESS.phone} />
              </dd>

              <dt>Postal address</dt>
              <dd>
                <address className="contact-address">
                  eBill Pakistan
                  <br />
                  {a.street}
                  <br />
                  {a.locality} {a.postalCode}
                  <br />
                  {a.region}, Pakistan
                </address>
              </dd>

              <dt>Response time</dt>
              <dd>We read every message and aim to reply within a few working days.</dd>
            </dl>

            <h3>What we can help with</h3>
            <ul className="contact-list">
              <li>Problems checking, downloading or printing a bill on eBill Pakistan.</li>
              <li>
                Incorrect information on one of our pages — a tariff figure, an office address, a
                helpline number. See our <a href="/editorial-policy">editorial policy</a> for how
                corrections are handled.
              </li>
              <li>Suggestions, feedback, and companies or services you&apos;d like us to add.</li>
              <li>Privacy questions and requests.</li>
            </ul>

            <h3>What we can&apos;t help with</h3>
            <p>
              We&apos;re an independent service and are <strong>not affiliated with PITC or any
              distribution company</strong>. For <strong>bill payments, meter issues, new
              connections, or billing complaints and disputes</strong>, please contact your
              electricity distribution company directly through their official helpline or office —
              they&apos;re the only ones who can resolve those. Each of our{" "}
              <a href="/#companies">twelve company pages</a> links to that company&apos;s official
              channels.
            </p>
          </aside>
        </div>

        <div className="prose contact-extra">
          <h2>Before you write: three things that solve most messages</h2>
          <p>
            We&apos;re happy to hear from you either way, but these three account for the majority
            of what lands in the inbox, and you can settle them faster than we can reply.
          </p>
          <ol>
            <li>
              <strong>&ldquo;My bill won&apos;t load.&rdquo;</strong> Check the reference number
              digit by digit — it is 8 to 14 digits with no spaces or dashes, and a single
              transposed digit returns nothing rather than an error. Make sure you have picked the
              right company. If it still fails, the upstream billing system is often busy in the
              last few days of the month; trying again an hour later usually works. If you have lost
              the number entirely, see{" "}
              <a href="/blog/how-to-find-reference-number-on-electricity-bill">
                where the reference number is printed
              </a>
              .
            </li>
            <li>
              <strong>&ldquo;The amount is wrong.&rdquo;</strong> We show your bill exactly as the
              official billing system generates it — we do not calculate anything and cannot change
              a figure. Our <a href="/sample-bill-explained">annotated sample bill</a> explains
              every line, which usually identifies the culprit (a slab jump, a fuel price
              adjustment, a lost protected status, or arrears carried forward). If the{" "}
              <em>units</em> genuinely don&apos;t match your usage, that is a meter-reading
              complaint for your distribution company.
            </li>
            <li>
              <strong>&ldquo;I paid but it still shows as due.&rdquo;</strong> Payment status takes
              a day or two to work through the official system. Keep your receipt and check again
              later; nothing is wrong.
            </li>
          </ol>

          <h2>Reporting incorrect information on one of our pages</h2>
          <p>
            This is the message we most want to receive. Our{" "}
            <a href="/editorial-policy">editorial policy</a> commits us to sourcing every tariff
            figure from NEPRA and every helpline or office address from the distribution
            company&apos;s own website — but pages go stale, and companies change their numbers
            without announcing it. If something here is out of date or simply wrong, tell us.
          </p>
          <p>To get it fixed quickly, include:</p>
          <ul>
            <li>The page — a URL is ideal, but &ldquo;the QESCO page&rdquo; is enough.</li>
            <li>What is wrong, and what it should say.</li>
            <li>Where you saw the correct version, if you have it. An official link is gold.</li>
          </ul>
          <p>
            We check the official source ourselves before changing anything. Confirmed errors are
            corrected and the &ldquo;last updated&rdquo; date on the page is bumped, so you can see
            the fix landed.
          </p>

          <h2>Reporting a scam</h2>
          <p>
            If you have received a fake &ldquo;subsidy registration&rdquo; link, a spoofed QR code,
            or a message demanding a fee or an OTP to keep your electricity connected, we&apos;d
            like to see it so we can keep our{" "}
            <a href="/blog/fake-electricity-bill-qr-code-scam">scam guide</a> current. Send us the
            link or a screenshot. Please note that we cannot recover money or investigate on your
            behalf — for that, report it to the FIA&apos;s National Cyber Crime Reporting portal and
            tell your bank immediately if you shared any financial detail.
          </p>

          <h2>What happens after you press send</h2>
          <p>
            Your message goes to a real person, not a ticketing queue. We read every one and aim to
            reply within a few working days to the email address you gave us. We use that address
            only to answer you — it is not added to a mailing list and it is not shared. If you
            would rather your message not be kept at all once we&apos;ve replied, say so and we
            will delete it. The full detail is in our <a href="/privacy">privacy policy</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
