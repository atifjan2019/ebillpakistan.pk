// Rebuilds lib/searchDemand.js from a Search Console "Queries.csv" export:
//   node scripts/import-search-demand.mjs ~/Downloads/Queries.csv
import { readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("usage: node scripts/import-search-demand.mjs <Queries.csv>");
  process.exit(2);
}
const num = (s) => parseFloat(String(s).replace(/[%,]/g, "")) || 0;
const parse = (line) => {
  const out = []; let cur = ""; let q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === "," && !q) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
};
const [header, ...lines] = readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean);
const cols = parse(header);
const qi = cols.findIndex((c) => /quer/i.test(c));
const ii = cols.findIndex((c) => /impr/i.test(c));
const pi = cols.findIndex((c) => /pos/i.test(c));
const rows = lines
  .map(parse)
  .map((r) => [r[qi], num(r[ii]), num(r[pi])])
  .filter((r) => r[0] && r[1] >= 40)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 120);
const today = new Date().toISOString().slice(0, 10);
const body = rows.map(([q, i, p]) => `  [${JSON.stringify(q)}, ${Math.round(i)}, ${p}],`).join("\n");
writeFileSync(
  "lib/searchDemand.js",
  `// What people already search for when the site appears in Google: the top
// queries from Search Console (web search, last three months, exported
// ${today}), as [query, impressions, average position]. Pure data.
//
// The content agent reads this so a new article answers demand that is
// already there, not a topic nobody looks up. Refresh it every few months by
// exporting Performance > Queries from Search Console and re-running
// scripts/import-search-demand.mjs on the CSV.
export const SEARCH_DEMAND_EXPORTED = "${today}";
export const SEARCH_DEMAND = [
${body}
];
`
);
console.log(`wrote ${rows.length} queries to lib/searchDemand.js`);
