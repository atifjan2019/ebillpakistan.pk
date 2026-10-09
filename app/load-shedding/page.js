// /load-shedding: where to see whether the power is on for your feeder right
// now, and where each company publishes its schedule. Nothing here is scraped or
// guessed: the live status comes from PITC's own Load Management Portal, which
// this page opens with the reader's reference number, and each company's
// schedule link is the one already verified on its company page.
import RefInput from "../RefInput";
import { SITE_URL, buildMeta } from "../../lib/seo";
import { DISCOS } from "../../lib/discos";
import { COMPANIES, slugFor } from "../../lib/companies";
import { contentFor, complaintsFor } from "../../lib/discoContent";
import { safe } from "../../lib/verify";

export const metadata = buildMeta({
  title: "Load Shedding Schedule Pakistan: Check Your Feeder's Live Status",
  description:
    "See whether your feeder is on or off right now with your bill's reference number, find each DISCO's official load-shedding schedule page, and learn how to report an unscheduled outage.",
  path: "/load-shedding",
  imageAlt: "Load shedding schedule and feeder status for Pakistan",
});

const PORTAL = "https://ccms.pitc.com.pk/FeederDetails";

const FAQS = [
  ["How do I check the load-shedding schedule for my area?", "Schedules are set per feeder, not per city, so the reliable way is by your own connection. Enter the 14-digit reference number from your bill above and the official PITC Load Management Portal shows your feeder, its grid station, whether it is on or off, and its on/off timeline. Your distribution company's own schedule page, listed below, covers planned shutdowns."],
  ["What is a feeder, and how do I find mine?", "A feeder is the 11 kV line that supplies your neighbourhood from the grid station; load management is applied feeder by feeder. Its name is printed on your bill, and the portal looks it up from your reference number, so you do not need to know the six-digit feeder code."],
  ["Why does my area get more load shedding than the next one?", "Load management hours are assigned per feeder according to its losses: feeders where more electricity is lost or unpaid for are given more hours off. Two streets on different feeders can therefore have very different schedules."],
  ["The power is off but nothing is scheduled. What should I do?", "That is a fault, not load management. Report it to your company on 118 or by SMS to 8118, or lodge a complaint on the PITC complaint portal so you get a ticket number. Say that it is an unscheduled outage and give your reference number."],
  ["Does K-Electric use the same portal?", "No. Karachi is supplied by K-Electric, which runs its own system. Text LS and your 13-digit account number to 8119 for your load-shed schedule, or check the KE Live app."],
  ["Is the schedule always followed?", "Not always. The published hours are the plan; forced outages, faults and system shortfalls add unscheduled interruptions. The portal's on/off timeline shows what actually happened on your feeder, which is the record to quote in a complaint."],
];

function scheduleFor(code) {
  const item = contentFor(code)?.outages?.items?.find((i) => /schedule is published/i.test(i.label));
  const text = safe(item?.text);
  if (!text) return { url: null, note: null };
  const url = (text.match(/https?:\/\/\S+/) || [])[0]?.replace(/[.,)]+$/, "") || null;
  return { url, note: url ? null : text };
}

export default function LoadSheddingPage() {
  const pageUrl = `${SITE_URL}/load-shedding`;
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Load shedding", item: pageUrl },
  ] };
  const rows = Object.keys(DISCOS).map((code) => {
    const c = complaintsFor(code);
    return { code, abbr: DISCOS[code][0], city: DISCOS[code][1], site: COMPANIES[code].website, ...scheduleFor(code), phone: safe(c?.whatsapp) || safe(c?.uan) || null };
  });

  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="container legal-inner post-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <span aria-current="page">Load shedding</span>
        </nav>
        <h1>Load shedding: is your feeder on right now?</h1>
        <p className="legal-updated">Sources checked: 9 October 2026.</p>
        <p className="legal-intro">
          Load shedding in Pakistan is scheduled feeder by feeder, so a city-wide timetable is rarely right for your street.
          The official PITC Load Management Portal shows the live status and on/off timeline of the exact feeder that
          supplies your connection. Enter your reference number and we open it for you.
        </p>

        <form className="search-card ls-form" action={PORTAL} method="get" target="_blank" rel="noopener noreferrer">
          <div className="search-grid solo">
            <div className="field">
              <label htmlFor="ls-ref">Reference number from your bill</label>
              <div className="control">
                <RefInput id="ls-ref" name="reference" inputMode="numeric" pattern="[0-9]{14}" placeholder="14 digits, e.g. 12345678901234" required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Check feeder status</button>
          </div>
          <p className="search-foot">
            Opens ccms.pitc.com.pk, the government&apos;s own portal, in a new tab. We do not see or store the number.
          </p>
        </form>

        <div className="prose">
          <h2>What the portal shows</h2>
          <ul>
            <li><strong>Feeder and grid:</strong> the name of the 11 kV feeder supplying you and the grid station it comes from.</li>
            <li><strong>Feeder status:</strong> whether it is on or off at this moment.</li>
            <li><strong>On/off timeline:</strong> when it was switched off and on, which is the evidence to quote if the outages exceed the plan.</li>
            <li><strong>Sub-division:</strong> the office responsible for your connection, and where a complaint goes first.</li>
          </ul>
          <p>
            It covers the ex-WAPDA distribution companies. A six-digit feeder code works in place of the reference number, and
            the portal can also search by grid station, feeder or city.
          </p>

          <h2>Each company&apos;s own schedule page</h2>
          <p>
            Planned shutdowns for maintenance, and the standing load-management plan where a company publishes one, are on the
            companies&apos; own websites. These are the pages we could verify; where a company publishes nothing stable, we say so.
          </p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Company</th><th>Schedule</th><th>Complaints</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.code}>
                    <td><a href={`/${slugFor(r.code)}`}>{r.abbr}</a><br /><small>{r.city}</small></td>
                    <td>
                      {r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer">Official schedule page</a> : <span>{r.note || "No stable schedule page; use the portal above."}</span>}
                    </td>
                    <td>{r.phone ? <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`}>{r.phone}</a> : <a href="tel:118">118</a>}</td>
                  </tr>
                ))}
                <tr>
                  <td><a href="/blog/k-electric-bill-check-online">K-Electric</a><br /><small>Karachi</small></td>
                  <td>Text <code>LS</code> and your 13-digit account number to 8119, or use the KE Live app.</td>
                  <td><a href="tel:118">118</a></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Scheduled load management, or a fault?</h2>
          <p>
            They look the same from your sofa and get different answers from the helpline, so work out which you have first.
          </p>
          <ul>
            <li><strong>Scheduled load management</strong> affects the whole feeder at set hours. The portal shows the feeder as off, and your neighbours on the same feeder are off too.</li>
            <li><strong>A planned shutdown</strong> is maintenance announced in advance on the company&apos;s schedule page, usually a morning to afternoon window.</li>
            <li><strong>A fault</strong> is everything else: the portal shows the feeder on but you have no supply, or only your street or house is out. That is a blown transformer, a tripped line or a problem at your meter, and it needs reporting.</li>
          </ul>

          <h2>Reporting an unscheduled outage</h2>
          <ol>
            <li>Check the portal above so you can say whether the feeder is on.</li>
            <li>Call <a href="tel:118">118</a>, or send an SMS to 8118, and give your reference number and what is out.</li>
            <li>For a record, lodge it on the <a href="https://ccms.pitc.com.pk/complaint" target="_blank" rel="noopener noreferrer">PITC complaint portal</a>, which issues a ticket number.</li>
            <li>If outages keep exceeding the plan, note the dates and times from the portal&apos;s timeline and send them with our <a href="/complaint-letter">complaint letter</a>; unresolved, it can go to NEPRA.</li>
          </ol>
          <p>
            Your company&apos;s direct complaint numbers and circle offices are on its page: {rows.slice(0, 6).map((r, i) => (
              <span key={r.code}>{i ? ", " : ""}<a href={`/${slugFor(r.code)}`}>{r.abbr}</a></span>
            ))}{" "}and the <a href="/#companies">rest</a>.
          </p>
        </div>

        <div className="faq" style={{ marginTop: 32 }}>
          <h2>Frequently asked questions</h2>
          {FAQS.map(([q, a], i) => (
            <details key={i} open={i === 0}>
              <summary>{q}</summary>
              <div className="a">{a}</div>
            </details>
          ))}
        </div>

        <div className="blog-cta">
          <p>While you are here: your current bill, free, from the same reference number.</p>
          <a className="btn btn-primary" href="/">Check your bill now</a>
        </div>
      </div>
    </section>
  );
}
