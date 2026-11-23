// November 2026 blog prune: merges thin, dated or overlapping KV posts into
// evergreen guides and company pages.
//
// In order:
//   1. content changes to the posts that absorb material (net metering,
//      disconnection, industrial tariff, smart meters) and byline/date fixes
//   2. every internal link to a post being removed is repointed at its
//      301 target, in both the rendered HTML and the Markdown source
//   3. the removed posts are deleted from blog:posts (the overbilling guide is
//      deleted too, because lib/articles.js now serves it at the same URL)
//
// Dry run by default; --apply writes. The 301s live in next.config.js.
//
//   set -a; . ./.env.vercel.local; set +a
//   node scripts/prune-posts.mjs
//   node scripts/prune-posts.mjs --apply

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
if (!URL_ || !TOKEN) {
  console.error("Set KV_REST_API_URL and KV_REST_API_TOKEN first.");
  process.exit(2);
}
const APPLY = process.argv.includes("--apply");
const KEY = "blog:posts";
const TODAY = "2026-11-23";

// removed slug -> where its readers and links go
export const MERGED = {
  "electricity-bill-high-summer-2026": "/blog/unit-slabs-fuel-price-adjustment-taxes-explained",
  "august-2026-electricity-bill-increase-surcharge": "/blog/unit-slabs-fuel-price-adjustment-taxes-explained",
  "october-2026-electricity-bill-fca-qta": "/blog/unit-slabs-fuel-price-adjustment-taxes-explained",
  "november-2026-electricity-bill-fuel-charge": "/blog/unit-slabs-fuel-price-adjustment-taxes-explained",
  "december-2026-electricity-bill-quarterly-adjustment": "/blog/unit-slabs-fuel-price-adjustment-taxes-explained",
  "december-2026-electricity-bill-october-fuel-charge": "/blog/unit-slabs-fuel-price-adjustment-taxes-explained",
  "how-to-apply-net-metering-net-billing-2026": "/blog/net-metering-net-billing-2026",
  "electricity-bill-late-payment-surcharge-due-date": "/blog/unpaid-electricity-bill-disconnection-notice-reconnection",
  "peak-hours-time-of-use-electricity-bill": "/blog/mdi-fixed-charges-electricity-bill",
  "rs-22-98-incremental-package-nepra-review": "/blog/industrial-electricity-tariff-b1-b2-b3-b4-rates",
  "protected-consumer-200-unit-penalty-change-status": "/blog/protected-consumer-200-unit-rule",
  "customer-facilitation-centre-iesco-bill-problems": "/iesco-bill-check",
  "peshawar-high-court-taxes-pesco-bill": "/pesco-bill-check",
};
// Deleted from KV without a redirect: the same URL is now served from lib/articles.js.
const PROMOTED = ["electricity-bill-overbilling-complaint"];

// Where in-content links go (may include a section anchor; the 301 itself
// always targets the page).
const LINK_DEST = {
  "peak-hours-time-of-use-electricity-bill": "/blog/mdi-fixed-charges-electricity-bill#peak-hours",
  "electricity-bill-late-payment-surcharge-due-date": "/blog/unpaid-electricity-bill-disconnection-notice-reconnection#late-payment-surcharge",
  "rs-22-98-incremental-package-nepra-review": "/blog/industrial-electricity-tariff-b1-b2-b3-b4-rates#incremental-package",
};

// Anchor text that named the removed post, where the old wording would read
// oddly against the page it now points at. Keyed by the old anchor text.
const ANCHOR_TEXT = {
  "why your bill is high this summer": "slabs, fuel charges and taxes",
  "why electricity bills spike in summer": "how slabs and fuel charges push bills up",
  "late payment surcharges and due dates": "the late payment surcharge",
  "late payment surcharge and due date": "the late payment surcharge section below",
  "our guide to the late payment surcharge and due date": "our note on the late payment surcharge",
  "November fuel charge post": "guide to how fuel charges are set",
  "November 2026 fuel charge guide": "guide to fuel and quarterly charges",
  "November 2026 fuel charge explainer": "fuel charge explainer",
  "November 2026 fuel charge": "fuel charge explainer",
  "October 2026 FCA and QTA explainer": "FCA and QTA explainer",
  "the October 2026 FCA and QTA explained": "how the FCA and QTA are set",
  "peak hours and time-of-use guide": "MDI, fixed charges and peak hours guide",
  "peak hours and Time-of-Use guide": "MDI, fixed charges and peak hours guide",
  "peak hours and Time-of-Use billing": "peak hours on a Time-of-Use meter",
  "incremental package review post": "incremental consumption package section below",
  "Rs 22.98 incremental package review": "incremental consumption package section of the industrial tariff guide",
  "our update on the six-month penalty": "our note on the proposal to drop the six-month penalty",
  "summer 2026 high-bill guide": "guide to slabs, fuel charges and taxes",
  "August 2026 bill changes": "how fuel and quarterly charges are set",
  "the October 2026 FCA and QTA guide": "how fuel and quarterly charges are set",
  "October 2026 FCA and QTA guide": "how fuel and quarterly charges are set",
  "our post on the October 2026 FCA and QTA charges": "our guide to how fuel and quarterly charges are set",
  "The November bill post": "Our guide to fuel and quarterly charges",
  "Our article on the November 2026 fuel charge": "Our guide to fuel and quarterly charges",
  "the Rs 22.98 package review": "the industrial tariff guide",
  "our guide to peak hours and Time-of-Use meters": "our guide to MDI, fixed charges and peak hours",
  "peak hours and Time-of-Use meters": "MDI, fixed charges and peak hours",
  "PESCO bill check and complaint numbers guide": "PESCO bill page, complaint numbers and lookalike sites",
};

const h = { headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" } };
async function cmd(...parts) {
  const res = await fetch(URL_, { method: "POST", ...h, body: JSON.stringify(parts) });
  if (!res.ok) throw new Error(`Upstash ${res.status}: ${await res.text()}`);
  return (await res.json()).result;
}
async function hgetall(key) {
  const flat = (await cmd("HGETALL", key)) || [];
  const out = {};
  for (let i = 0; i < flat.length; i += 2) {
    const v = flat[i + 1];
    out[flat[i]] = typeof v === "string" ? JSON.parse(v) : v;
  }
  return out;
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const posts = await hgetall(KEY);
console.log(`${Object.keys(posts).length} posts in ${KEY}${APPLY ? "" : "  (dry run)"}\n`);
const pending = new Map(); // slug -> updated post object

function take(slug) {
  if (!pending.has(slug)) pending.set(slug, { ...posts[slug] });
  return pending.get(slug);
}
// Insert HTML (and Markdown, when the post keeps a Markdown source) before a
// given h2, or at the end when the heading is not found.
function insertBefore(post, heading, html, md) {
  const hre = new RegExp(`<h2[^>]*>${esc(heading)}`);
  post.content = hre.test(post.content) ? post.content.replace(hre, (m) => `${html}\n${m}`) : `${post.content}\n${html}`;
  if (post.contentSource && post.contentFormat === "markdown") {
    const mre = new RegExp(`\\n## ${esc(heading)}`);
    post.contentSource = mre.test(post.contentSource) ? post.contentSource.replace(mre, `\n${md}\n\n## ${heading}`) : `${post.contentSource}\n\n${md}`;
  }
}

// ── 1. content changes ───────────────────────────────────────────────────────
{
  // Net metering guide absorbs the application steps from the removed how-to post.
  const p = take("net-metering-net-billing-2026");
  const html = `<h2>How to apply for net billing</h2>
<p>New applications since 9 February 2026 are placed on net billing under NEPRA's Prosumer Regulations 2026. Before you spend on a system, check the basics with your distribution company: an active connection with no arrears, a three-phase connection (single-phase consumers generally have to upgrade first), a system that stays within your sanctioned load, and an inverter on NEPRA's approved equipment list with proper protection installed. Thresholds change, so confirm the current requirements with your company or on nepra.org.pk.</p>
<h3>Documents</h3>
<ul>
<li>CNIC of the person the meter is registered to.</li>
<li>A recent bill showing no arrears.</li>
<li>Proof of ownership: registry, allotment letter or fard.</li>
<li>Datasheets for the inverter and panels.</li>
<li>A single-line schematic of the system, usually prepared by the installer.</li>
</ul>
<h3>The steps</h3>
<ol>
<li>Have a qualified installer size the system and prepare the schematic.</li>
<li>Submit the application with the documents to your distribution company, normally the Deputy Manager (Operations) office for your area.</li>
<li>The company inspects the proposal and issues a technical feasibility report if the connection can take the system.</li>
<li>The case goes to NEPRA for a distributed generation licence; NEPRA charges a per-kilowatt licensing fee, so ask for the current figure.</li>
<li>An inspector checks the installation and issues a certificate of compliance.</li>
<li>The company fits the bi-directional meter, which has its own charge, and your exports start being credited at the net billing rate.</li>
</ol>
<p>From application to a working, metered system usually takes one to three months, depending on the company and how complete the paperwork is. Because net billing pays less for exports than you pay for imports, using your own solar power during the day now saves more than exporting it; our <a href="/solar-calculator">solar savings calculator</a> shows the difference for your usage.</p>
<h2>Sources</h2>
<ul>
<li><a href="https://nepra.org.pk/Legislation/3-Reg/3.35%20NEPRA%20%20Prosumer%20Regulations%202026/NEPRA%20Prosumer%20Regulations%20(SRO%20251(I)2026)%2009-02-26.PDF" target="_blank" rel="noopener noreferrer">NEPRA Prosumer Regulations 2026, SRO 251(I)/2026 (9 February 2026)</a></li>
<li><a href="https://nepra.org.pk/" target="_blank" rel="noopener noreferrer">NEPRA, licensing and approved equipment lists</a></li>
</ul>`;
  insertBefore(p, "Roman Urdu: khulasa", html);
  p.author = "atif-jan";
  p.lastUpdated = TODAY;
}
{
  // Disconnection guide absorbs the late payment surcharge explainer.
  const p = take("unpaid-electricity-bill-disconnection-notice-reconnection");
  const html = `<h2 id="late-payment-surcharge">The late payment surcharge</h2>
<p>Every bill prints two payable figures. The amount within the due date is the bill itself. The amount after the due date is the same bill with the late payment surcharge added, and the gap between them is the penalty for paying late. For domestic consumers it is generally around 10% of the total invoice, applied to the whole bill, including the fuel adjustment, taxes and fixed charges, not just the energy charge. Because fixed charges now make up a larger share of many bills, the penalty is larger than it used to be. The percentage is set by the regulator and can change, so the figure printed on your own bill is the one that applies.</p>
<p>The due date moves every month, so read it off the current bill rather than assuming last month's date. Missing it has two consequences: the higher amount applies from the next day, and a bill left unpaid into the following months starts the notice sequence described above. Checking the bill a few days early leaves time to dispute a wrong amount before the deadline.</p>`;
  const md = `## The late payment surcharge

Every bill prints two payable figures. The amount within the due date is the bill itself. The amount after the due date is the same bill with the late payment surcharge added, and the gap between them is the penalty for paying late. For domestic consumers it is generally around 10% of the total invoice, applied to the whole bill, including the fuel adjustment, taxes and fixed charges, not just the energy charge. Because fixed charges now make up a larger share of many bills, the penalty is larger than it used to be. The percentage is set by the regulator and can change, so the figure printed on your own bill is the one that applies.

The due date moves every month, so read it off the current bill rather than assuming last month's date. Missing it has two consequences: the higher amount applies from the next day, and a bill left unpaid into the following months starts the notice sequence described above. Checking the bill a few days early leaves time to dispute a wrong amount before the deadline.`;
  insertBefore(p, "Asking for installments", html, md);
  p.lastUpdated = TODAY;
}
{
  // Industrial tariff guide absorbs the incremental consumption package explainer.
  const p = take("industrial-electricity-tariff-b1-b2-b3-b4-rates");
  const html = `<h2 id="incremental-package">The incremental consumption package</h2>
<p>Separate from the B-category rates is the incremental consumption package, often reported as Roshan Maeeshat. NEPRA approved it on 9 December 2025 for three years, November 2025 to October 2028, for industrial consumers and private agricultural (tubewell) consumers of the ex-WAPDA companies and K-Electric, on Time-of-Use and non-Time-of-Use connections alike. It bills only the units above your baseline at a flat Rs 22.98; everything up to the baseline stays at your normal tariff, so the whole bill does not drop to Rs 22.98 a unit. Package units still carry the monthly fuel charge, but are exempt from the quarterly adjustment.</p>
<p>The package has a six-monthly review. At the hearing on 5 October 2026 NEPRA asked whether to suspend it because of fuel prices, raise the Rs 22.98 rate towards the actual marginal cost (the Power Division put the December 2025 to May 2026 average at Rs 27.58 a unit), and if so whether to start the increase from the June 2026 or October 2026 billing month. A backdated increase recovered from the package's users was proposed at the hearing. As of 23 November 2026 no decision from that review has been published, so treat any claim that the package has been raised or suspended with caution until NEPRA posts a decision or your company confirms it. If your business leans on package units, keep a note of how many incremental units you have been billed each month since June 2026, so any arrears can be checked against your own records. Sources: <a href="https://nepra.org.pk/tariff/Tariff/Ex-WAPDA%20DISCOS/2025/TRF-100%20XWDISCOS%20&%20KE%20INCREMENTAL%20CONSUMPTION%20PACKAGE%20FOR%20INDUSTRIAL%20AND%20AGRICULTURE%20CONSUMERS%2009-12-2025%2020846-50.pdf" target="_blank" rel="noopener noreferrer">NEPRA decision of 9 December 2025</a>, <a href="https://tribune.com.pk/story/2633172/nepra-reviews-incremental-consumption-package" target="_blank" rel="noopener noreferrer">The Express Tribune on the October 2026 review</a>.</p>`;
  const md = `## The incremental consumption package

Separate from the B-category rates is the incremental consumption package, often reported as Roshan Maeeshat. NEPRA approved it on 9 December 2025 for three years, November 2025 to October 2028, for industrial consumers and private agricultural (tubewell) consumers of the ex-WAPDA companies and K-Electric, on Time-of-Use and non-Time-of-Use connections alike. It bills only the units above your baseline at a flat Rs 22.98; everything up to the baseline stays at your normal tariff, so the whole bill does not drop to Rs 22.98 a unit. Package units still carry the monthly fuel charge, but are exempt from the quarterly adjustment.

The package has a six-monthly review. At the hearing on 5 October 2026 NEPRA asked whether to suspend it because of fuel prices, raise the Rs 22.98 rate towards the actual marginal cost (the Power Division put the December 2025 to May 2026 average at Rs 27.58 a unit), and if so whether to start the increase from the June 2026 or October 2026 billing month. A backdated increase recovered from the package's users was proposed at the hearing. As of 23 November 2026 no decision from that review has been published, so treat any claim that the package has been raised or suspended with caution until NEPRA posts a decision or your company confirms it. If your business leans on package units, keep a note of how many incremental units you have been billed each month since June 2026, so any arrears can be checked against your own records. Sources: [NEPRA decision of 9 December 2025](https://nepra.org.pk/tariff/Tariff/Ex-WAPDA%20DISCOS/2025/TRF-100%20XWDISCOS%20&%20KE%20INCREMENTAL%20CONSUMPTION%20PACKAGE%20FOR%20INDUSTRIAL%20AND%20AGRICULTURE%20CONSUMERS%2009-12-2025%2020846-50.pdf), [The Express Tribune on the October 2026 review](https://tribune.com.pk/story/2633172/nepra-reviews-incremental-consumption-package).`;
  insertBefore(p, "The November fuel charge is a separate line", html, md);
  p.lastUpdated = TODAY;
}
{
  // Smart meter post: byline, sources, and the LESCO paragraph brought in line
  // with what the reports actually say.
  const p = take("smart-meter-ami-pakistan");
  const oldPara = /<p>At company level, progress varies a great deal\.[\s\S]*?<\/p>/;
  const newPara = `<p>At company level, progress varies a great deal. In July 2026 LESCO was reported to be issuing AMI meters first to Punjab government offices across its circles, while ordinary consumers, including those whose meters were found faulty, continued to receive conventional static meters. In September 2026 it was reported to have started procuring about 297,000 single-phase AMI meters. Treat any "your area is next" message with caution unless it comes from your distribution company directly.</p>`;
  if (oldPara.test(p.content)) p.content = p.content.replace(oldPara, newPara);
  const html = `<h2>Sources</h2>
<ul>
<li><a href="https://www.dawn.com/news/2019624" target="_blank" rel="noopener noreferrer">Dawn, PM Shehbaz orders audit of power firms' billing systems (31 July 2026)</a></li>
<li><a href="https://propakistani.pk/2026/07/31/pm-orders-technical-audit-of-power-companies-billing-systems/" target="_blank" rel="noopener noreferrer">ProPakistani, PM orders technical audit of power companies' billing systems (31 July 2026)</a></li>
<li><a href="https://www.dawn.com/news/1993468" target="_blank" rel="noopener noreferrer">Dawn, Pakistan engages IFC for investors in installation of 10m smart meters across all Discos (April 2026)</a></li>
<li><a href="https://tribune.com.pk/story/2603891/ifc-to-advise-govt-on-10m-smart-meters-rollout" target="_blank" rel="noopener noreferrer">The Express Tribune, IFC to advise govt on 10m smart meters rollout (April 2026)</a></li>
<li><a href="https://en.dailypakistan.com.pk/20-Jul-2026/lesco-prioritizes-govt-offices-for-ami-smart-meters-leaves-consumers-behind" target="_blank" rel="noopener noreferrer">Daily Pakistan, LESCO prioritizes govt offices for AMI smart meters (20 July 2026)</a></li>
<li><a href="https://en.dailypakistan.com.pk/16-Sep-2026/update-on-installation-of-lesco-smart-ami-meters" target="_blank" rel="noopener noreferrer">Daily Pakistan, Update on installation of LESCO smart AMI meters (16 September 2026)</a></li>
</ul>`;
  insertBefore(p, "Roman Urdu: khulasa", html);
  p.author = "atif-jan";
  p.lastUpdated = TODAY;
}

// ── 2. link rewrites ─────────────────────────────────────────────────────────
const removed = new Set([...Object.keys(MERGED), ...PROMOTED]);
const rewrites = [];
for (const slug of Object.keys(posts)) {
  if (removed.has(slug)) continue;
  const p = pending.get(slug) || { ...posts[slug] };
  const changes = [];
  for (const [old, pageDest] of Object.entries(MERGED)) {
    let dest = LINK_DEST[old] || pageDest;
    if (dest.startsWith(`/blog/${slug}`)) dest = dest.includes("#") ? dest.slice(dest.indexOf("#")) : dest; // link inside the absorbing post itself
    const hrefRe = new RegExp(`(<a href=")(?:https?://(?:www\\.)?ebillpakistan\\.pk)?/blog/${esc(old)}/?(")([^>]*>)([\\s\\S]*?)(</a>)`, "g");
    p.content = (p.content || "").replace(hrefRe, (m, a, q, rest, text, close) => {
      const plain = text.replace(/<[^>]+>/g, "");
      const newText = ANCHOR_TEXT[plain] || plain;
      changes.push({ from: `/blog/${old}`, to: dest, textFrom: plain, textTo: newText });
      return `${a}${dest}${q}${rest}${newText}${close}`;
    });
    if (p.contentSource) {
      const mdRe = new RegExp(`\\[([^\\]]*)\\]\\((?:https?://(?:www\\.)?ebillpakistan\\.pk)?/blog/${esc(old)}/?\\)`, "g");
      p.contentSource = p.contentSource.replace(mdRe, (m, text) => `[${ANCHOR_TEXT[text] || text}](${dest})`);
    }
  }
  if (changes.length) {
    p.lastUpdated = TODAY;
    pending.set(slug, p);
    rewrites.push({ slug, changes });
  }
}
for (const [slug, heading] of [["net-metering-net-billing-2026", "How to apply for net billing"], ["unpaid-electricity-bill-disconnection-notice-reconnection", "The late payment surcharge"], ["industrial-electricity-tariff-b1-b2-b3-b4-rates", "The incremental consumption package"], ["smart-meter-ami-pakistan", "Sources"]]) {
  const p = pending.get(slug);
  console.log(`content: ${slug}: section "${heading}" ${p && p.content.includes(`>${heading}</h2>`) ? "added" : "MISSING"}, author ${p?.author}, lastUpdated ${p?.lastUpdated}`);
}
console.log("\nlink rewrites:");
console.log("| Post | href before | href after | anchor text |");
console.log("|---|---|---|---|");
for (const r of rewrites) for (const c of r.changes) console.log(`| ${r.slug} | ${c.from} | ${c.to} | ${c.textFrom === c.textTo ? `"${c.textFrom}" (unchanged)` : `"${c.textFrom}" to "${c.textTo}"`} |`);

// ── 3. deletions ─────────────────────────────────────────────────────────────
const toDelete = [...removed].filter((s) => posts[s]);
console.log(`\ndelete ${toDelete.length} post(s): ${toDelete.join(", ")}`);

// Any remaining link to a removed slug anywhere in the surviving posts is a bug.
const leftovers = [];
for (const slug of Object.keys(posts)) {
  if (removed.has(slug)) continue;
  const p = pending.get(slug) || posts[slug];
  for (const old of removed) if ((p.content || "").includes(`/blog/${old}`) && !PROMOTED.includes(old)) leftovers.push(`${slug} -> ${old}`);
}
console.log(leftovers.length ? `\nLEFTOVER LINKS: ${leftovers.join("; ")}` : "\nno surviving post links to a removed slug");

if (!APPLY) {
  console.log("\nDry run. Re-run with --apply to write these changes.");
  process.exit(leftovers.length ? 1 : 0);
}
for (const [slug, p] of pending) await cmd("HSET", KEY, slug, JSON.stringify(p));
if (toDelete.length) await cmd("HDEL", KEY, ...toDelete);
console.log(`\nApplied. ${KEY} now holds ${await cmd("HLEN", KEY)} posts.`);
