// Reports every unresolved {{VERIFY}} marker and what it suppresses in a
// production build. Runs automatically before `npm run build` (see prebuild) and
// can be run any time:
//
//     node scripts/verify-report.mjs          summary
//     node scripts/verify-report.mjs --full   every marker, with its label
//
// Exit code is always 0: unresolved markers are an expected intermediate state,
// not a build failure. They are suppressed in production, never shipped.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const FULL = process.argv.includes("--full");
const PATTERN = /\{\{VERIFY:\s*([^}]+)\}\}/g;

// ── 1. every marker in the source, by file ────────────────────────────────────
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === ".git") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(js|jsx|mjs|md)$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(join(ROOT, "lib")).concat(walk(join(ROOT, "app")));
const byFile = new Map();
let total = 0; // recomputed below from the real data

for (const f of files) {
  const rel = relative(ROOT, f);
  // The suppression machinery itself contains the pattern in comments/regexes.
  if (/(verify\.js|Verify\.js|verify-report\.mjs)$/.test(rel)) continue;
  const src = readFileSync(f, "utf8");
  const labels = [...src.matchAll(PATTERN)].map((m) => m[1].trim());
  if (labels.length) {
    byFile.set(rel, labels);
    total += labels.length;
  }
}

// ── 1b. real marker instances in the data ─────────────────────────────────────
// The source scan undercounts, because lib/discoContent.js builds markers with a
// V() helper — one source literal can produce twenty rendered markers. Walk the
// actual exported data to get the true number.
const dataModules = {
  "lib/discoContent.js": await import("../lib/discoContent.js"),
  "lib/tariffs.js": await import("../lib/tariffs.js"),
  "lib/contact.js": await import("../lib/contact.js"),
  "lib/authors.js": await import("../lib/authors.js"),
};

function countMarkers(node, seen = new Set()) {
  if (typeof node === "string") return [...node.matchAll(PATTERN)].map((m) => m[1].trim());
  if (!node || typeof node !== "object" || seen.has(node)) return [];
  seen.add(node);
  return Object.values(node).flatMap((v) => countMarkers(v, seen));
}

let dataTotal = 0;
const dataByModule = new Map();
for (const [name, mod] of Object.entries(dataModules)) {
  const labels = countMarkers(mod);
  if (labels.length) {
    dataByModule.set(name, labels);
    dataTotal += labels.length;
  }
}
// Files that are not data modules still need the source scan.
for (const name of dataByModule.keys()) byFile.delete(name);
const sourceTotal = [...byFile.values()].reduce((n, l) => n + l.length, 0);
total = sourceTotal + dataTotal;
for (const [k, v] of dataByModule) byFile.set(k, v);

// ── 2. what each DISCO page loses in production ───────────────────────────────
// Imported rather than parsed so the report reflects the real data structure.
const { DISCO_CONTENT, SECTIONS } = dataModules["lib/discoContent.js"];
const MIN_SECTION_WORDS = 40;
const has = (v) => typeof v === "string" && /\{\{VERIFY:/.test(v);
const words = (s) => (typeof s === "string" ? s.trim().split(/\s+/).filter(Boolean).length : 0);

const pageLoss = [];
for (const [code, c] of Object.entries(DISCO_CONTENT)) {
  const lost = [];

  for (const { key, heading } of SECTIONS) {
    const sec = c[key];
    if (!sec) continue;
    const paras = (sec.paras || []).filter((p) => !has(p));
    const items = (sec.items || []).filter((it) => !has(it?.text) && !has(it?.label));
    const droppedParas = (sec.paras || []).length - paras.length;
    const droppedItems = (sec.items || []).length - items.length;
    const surviving =
      paras.reduce((n, p) => n + words(p), 0) +
      items.reduce((n, it) => n + words(`${it.label || ""} ${it.text || ""}`), 0);

    if (surviving < MIN_SECTION_WORDS) {
      lost.push(`SECTION DROPPED: "${heading(code.toUpperCase())}" (${surviving} words survive, need ${MIN_SECTION_WORDS})`);
    } else if (droppedParas || droppedItems) {
      lost.push(`${heading(code.toUpperCase())}: -${droppedParas} para, -${droppedItems} item (${surviving} words remain)`);
    }
    if (key === "billLayout" && has(sec.image)) lost.push("bill image slot hidden");
  }

  const cm = c.complaints || {};
  if (has(cm.helpline)) lost.push("complaints: national helpline row hidden");
  if (has(cm.headOffice)) lost.push("complaints: head-office heading + address dropped");
  if (has(cm.officesNote)) lost.push("complaints: office-list note dropped");
  const badOffices = (cm.offices || []).filter((o) => has(o.name) || has(o.phone) || has(o.covers));
  if (badOffices.length) lost.push(`complaints: ${badOffices.length} office row(s) dropped`);

  if (lost.length) pageLoss.push([code, lost]);
}

// ── 3. output ─────────────────────────────────────────────────────────────────
const bar = "─".repeat(74);
console.log(`\n${bar}\n  {{VERIFY}} REPORT — ${total} unresolved marker(s) in ${byFile.size} file(s)`);
console.log(`  Production behaviour: suppressed. None of these can reach the DOM.\n${bar}`);

for (const [file, labels] of [...byFile].sort()) {
  console.log(`\n  ${file}  (${labels.length})`);
  if (FULL) for (const l of labels) console.log(`      • ${l.slice(0, 150)}`);
}

if (pageLoss.length) {
  console.log(`\n${bar}\n  WHAT PRODUCTION LOSES, BY PAGE\n${bar}`);
  for (const [code, lost] of pageLoss) {
    console.log(`\n  /${code}-bill-check`);
    for (const l of lost) console.log(`      - ${l}`);
  }
}

console.log(
  `\n${bar}\n  ${total} to resolve.` +
    (FULL ? "" : "  Run with --full to see every label.") +
    `\n${bar}\n`
);
