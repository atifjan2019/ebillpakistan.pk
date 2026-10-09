// Cross-links between guides, company pages and tools, worked out from the
// content rather than maintained by hand, so the daily posts join the web of
// links the moment they are published. Pure functions; safe on the server.
import { DISCOS } from "./discos";
import { slugFor } from "./companies";

const WORD = (abbr) => new RegExp(`\\b${abbr}\\b`, "i");

// Company codes a piece of text mentions by abbreviation ("LESCO", "AJK").
export function discosMentioned(text) {
  const t = String(text || "");
  return Object.keys(DISCOS).filter((code) => WORD(DISCOS[code][0]).test(t));
}

// Posts that concern one company: the abbreviation in the title, slug or tags.
export function postsForDisco(code, posts) {
  const abbr = DISCOS[code]?.[0];
  if (!abbr) return [];
  return posts.filter((p) => WORD(abbr).test(`${p.title} ${p.slug.replace(/-/g, " ")} ${(p.tags || []).join(" ")}`));
}

// Company page links for a post, with the most-mentioned first.
export function companyLinksFor(post) {
  const text = `${post.title} ${post.content || ""}`;
  const counts = discosMentioned(text).map((code) => ({
    code,
    abbr: DISCOS[code][0],
    city: DISCOS[code][1],
    href: `/${slugFor(code)}`,
    n: (text.match(new RegExp(`\\b${DISCOS[code][0]}\\b`, "gi")) || []).length,
  }));
  return counts.sort((a, b) => b.n - a.n).slice(0, 4);
}

// The tool a post is most related to, by what it talks about.
export function toolLinksFor(post) {
  const text = `${post.title} ${post.slug} ${(post.tags || []).join(" ")} ${post.content || ""}`.toLowerCase();
  const out = [];
  if (/protected|200 unit|200-unit/.test(text)) out.push(["/protected-consumer-checker", "Protected consumer checker", "Six months of units tell you whether you qualify."]);
  if (/mdi|time.of.use|tou|peak hour/.test(text)) out.push(["/mdi-calculator", "MDI calculator", "The fixed charge on a Time-of-Use bill, from your MDI."]);
  if (/solar|net.?meter|net.?billing/.test(text)) out.push(["/solar-calculator", "Solar savings calculator", "What a rooftop system does to the bill."]);
  if (/fca|fpa|fuel|quarterly|adjustment|tariff|increase|relief/.test(text)) out.push(["/this-month", "This month's adjustments", "The fuel and quarterly charges in force now."]);
  if (/complain|overbill|wrong reading|detection|dispute/.test(text)) out.push(["/complaint-letter", "Complaint letter", "A ready letter to your SDO, in English or Urdu."]);
  if (/load.?shed|outage|feeder|shutdown/.test(text)) out.push(["/load-shedding", "Is the power on?", "Your feeder's live status and schedule."]);
  if (/appliance|air.?condition|\bac\b|fan|fridge|geyser|summer|kam kaise|zyada|reduce|lower your bill|save/.test(text)) out.push(["/appliance-calculator", "Appliance calculator", "Which appliance is running up the bill."]);
  if (!out.some(([h]) => h === "/bill-calculator")) out.push(["/bill-calculator", "Bill calculator", "Units in, estimated bill out, at NEPRA's rates."]);
  return out.slice(0, 3);
}
