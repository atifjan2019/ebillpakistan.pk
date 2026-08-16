// Prints every field CCMS actually returns for one reference number, so the
// candidate-key table in lib/billData.js can be completed exactly rather than
// defensively. Run from a Pakistani IP (PITC blocks datacenter egress):
//
//   node scripts/dump-bill-schema.mjs 12345678901234
//
// Nothing is written anywhere; output is for your eyes only. Do not paste a real
// reference number into a public issue.
const ref = process.argv[2];
if (!ref || !/^\d{8,14}$/.test(ref)) {
  console.error("usage: node scripts/dump-bill-schema.mjs <8-14 digit reference>");
  process.exit(1);
}
const H = { Accept: "application/json", "X-Requested-With": "XMLHttpRequest", "User-Agent": "Mozilla/5.0" };
const base = "https://ccms.pitc.com.pk/api";

const walk = (o, p = "") => {
  if (!o || typeof o !== "object") return [];
  if (Array.isArray(o)) return o.length ? walk(o[0], `${p}[0]`) : [];
  return Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === "object" ? walk(v, `${p}${k}.`) : [`${p}${k} = ${JSON.stringify(v)}`]
  );
};

for (const ep of ["user", "bill"]) {
  const r = await fetch(`${base}/details/${ep}?reference=${encodeURIComponent(ref)}`, { headers: H });
  const j = await r.json().catch(() => null);
  console.log(`\n===== /api/details/${ep}  (HTTP ${r.status}) =====`);
  for (const line of walk(j)) console.log("  " + line);
}
