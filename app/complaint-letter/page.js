import { SITE_URL, buildMeta } from "../../lib/seo";
import { DISCOS } from "../../lib/discos";
import { COMPANIES } from "../../lib/companies";
import { complaintsFor } from "../../lib/discoContent";
import { safe } from "../../lib/verify";
import ComplaintLetter from "./ComplaintLetter";

export const metadata = buildMeta({
  title: "Electricity Bill Complaint Letter: Free Generator, English and Urdu",
  description:
    "Write a complaint letter to your SDO for a wrong reading, an excessive or estimated bill, a faulty meter or a detection charge, in English or Urdu, then follow the official route up to NEPRA.",
  path: "/complaint-letter",
  imageAlt: "Electricity bill complaint letter generator",
});

const NEPRA_REGISTER = "https://nepra.org.pk/CAD-Database/CMS-CAD/cregister.php";
const NEPRA_TRACK = "https://nepra.org.pk/CAD-Database/CMS-CAD/tcomplaint.php";

const FAQS = [
  ["Who do I address an electricity bill complaint to?", "The Sub Divisional Officer (SDO) of the sub-division printed on your bill. That is the office that reads your meter and issues the bill, and NEPRA itself tells consumers to file with the SDO or the Executive Engineer (XEN) before coming to it."],
  ["What should I attach to the complaint?", "A copy of the disputed bill, one or two earlier bills to show your normal use, a dated photograph of the meter showing the reading, and a receipt if the dispute is about a payment. For a detection bill, ask for the inspection report."],
  ["How do I complain to NEPRA about a wrong bill?", "After you have complained to your distribution company, register it on NEPRA's online complaint form. It asks for your CNIC, name, address, mobile number, reference number, your company, the nearest NEPRA office and the main points, and accepts a PDF or JPG attachment of up to 2.5 MB. Complaints more than a year old must be sent in writing instead."],
  ["Will my electricity be cut off while a complaint is pending?", "The letter asks the office not to disconnect while the complaint is under review, and paying the undisputed part of the bill on time strengthens that request. Whether the office agrees is its decision, so get a complaint number and keep proof that you filed before the due date."],
  ["Is this letter sent anywhere when I type it?", "No. It is built in your browser and never leaves your device. You copy, print or share it yourself."],
];

export default function ComplaintLetterPage() {
  const pageUrl = `${SITE_URL}/complaint-letter`;
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
    { "@type": "ListItem", position: 3, name: "Complaint letter", item: pageUrl },
  ] };
  const companies = Object.keys(DISCOS).map((code) => {
    const c = complaintsFor(code);
    return { code, abbr: DISCOS[code][0], full: COMPANIES[code].full, phone: safe(c?.whatsapp) || safe(c?.uan) || null };
  });

  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="container legal-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <a href="/tools">Tools</a> <span>/</span> <span aria-current="page">Complaint letter</span>
        </nav>
        <h1>Electricity bill complaint letter</h1>
        <p className="legal-intro">
          A wrong bill is fixed fastest by a short written complaint to the right office, with the figures in it. Choose
          what is wrong, fill in your details, and copy, print or send the letter in English or Urdu.
        </p>

        <ComplaintLetter companies={companies} />

        <div className="prose" style={{ maxWidth: 820 }}>
          <h2>Where to send it, in order</h2>
          <ol>
            <li>
              <strong>Your sub-division office (SDO).</strong> Hand the letter in with copies of the bill and a dated meter
              photograph, and ask for a complaint number. If nothing happens, take it to the Executive Engineer (XEN) of the
              division above it.
            </li>
            <li>
              <strong>The company&apos;s complaint system.</strong> Lodge the same complaint on the{" "}
              <a href="https://ccms.pitc.com.pk/complaint" target="_blank" rel="noopener noreferrer">PITC complaint portal</a>, by
              calling 118 or by SMS to 8118, so there is a ticket number on record.
            </li>
            <li>
              <strong>NEPRA.</strong> If the company does not resolve it,{" "}
              <a href={NEPRA_REGISTER} target="_blank" rel="noopener noreferrer">register a complaint with NEPRA</a>. The form asks
              whether you complained to the company first and what happened, and takes your CNIC, reference number, company and
              nearest NEPRA office. You can then <a href={NEPRA_TRACK} target="_blank" rel="noopener noreferrer">track it</a>.
              NEPRA&apos;s Consumer Affairs Division is at cad@nepra.org.pk and +92 51 2013200, with regional offices in Karachi,
              Lahore, Peshawar, Quetta, Hyderabad, Sukkur, Multan, Faisalabad and Gujranwala.
            </li>
          </ol>
          <p>
            Two limits from NEPRA&apos;s own form are worth knowing: a complaint more than one year old is not taken online and
            has to be sent in writing to the Director General, Consumer Affairs; and an attachment must be a PDF or JPG of no
            more than 2.5 MB.
          </p>

          <h2>What makes a complaint work</h2>
          <ul>
            <li><strong>Numbers, not adjectives.</strong> Units billed, the reading on your meter and the date you read it.</li>
            <li><strong>A dated photograph of the meter.</strong> It is the one piece of evidence the office cannot argue with.</li>
            <li><strong>Earlier bills.</strong> The history panel on the bill, or our <a href="/">bill lookup</a>, shows your normal use beside the disputed month.</li>
            <li><strong>File before the due date,</strong> and pay any part of the bill you do not dispute.</li>
          </ul>
          <p>
            Not sure whether the bill is actually wrong? The <a href="/bill-calculator">bill calculator</a> shows what your units
            should cost, the <a href="/tariff-code">tariff code decoder</a> shows whether you are on the right category, and our guide
            to <a href="/blog/electricity-bill-overbilling-complaint">overbilling complaints</a> covers the common causes.
          </p>
        </div>

        <div className="faq" style={{ marginTop: 32, maxWidth: 820 }}>
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
