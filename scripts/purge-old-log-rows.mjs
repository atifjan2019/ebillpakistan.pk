// One-off: removes lookup-log rows written in the old format, which held the
// full reference number (`ref`) and the raw IP address (`ip`). Rows in the
// current format (`ref4` + `iph`) are kept, in order. Run once after the
// November 2026 logging change deploys.
//
//   set -a; . ./.env.vercel.local; set +a
//   node scripts/purge-old-log-rows.mjs           # counts only
//   node scripts/purge-old-log-rows.mjs --apply   # rewrites the list
//
// The rewrite is DEL + RPUSH in one pipeline, so a lookup logged in the same
// instant is the only thing that could be lost, and only if it lands between
// the read and the pipeline.

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
if (!URL_ || !TOKEN) {
  console.error("Set KV_REST_API_URL and KV_REST_API_TOKEN first.");
  process.exit(2);
}
const APPLY = process.argv.includes("--apply");
const KEY = "ebp:checks:events";
const h = { headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" } };

async function cmd(...parts) {
  const res = await fetch(URL_, { method: "POST", ...h, body: JSON.stringify(parts) });
  if (!res.ok) throw new Error(`Upstash ${res.status}: ${await res.text()}`);
  return (await res.json()).result;
}
async function pipeline(cmds) {
  const res = await fetch(`${URL_}/pipeline`, { method: "POST", ...h, body: JSON.stringify(cmds) });
  if (!res.ok) throw new Error(`Upstash ${res.status}: ${await res.text()}`);
  return res.json();
}

const parse = (v) => {
  try {
    return typeof v === "string" ? JSON.parse(v) : v;
  } catch {
    return null;
  }
};
const isOld = (ev) => !ev || "ref" in ev || "ip" in ev || !("ref4" in ev) || !("iph" in ev);

const raw = (await cmd("LRANGE", KEY, 0, -1)) || [];
const rows = raw.map(parse);
const keep = raw.filter((_, i) => !isOld(rows[i]));
const old = rows.length - keep.length;
const oldest = rows.filter((e) => e?.t).map((e) => e.t).sort()[0];

console.log(`before: ${rows.length} rows (${old} old format, ${keep.length} current format)` + (oldest ? `, oldest ${new Date(oldest).toISOString()}` : ""));

if (!APPLY) {
  console.log(`dry run: would remove ${old} and keep ${keep.length}. Re-run with --apply.`);
  process.exit(0);
}

// RPUSH keeps the newest-first order of the list we read.
const cmds = [["DEL", KEY]];
if (keep.length) cmds.push(["RPUSH", KEY, ...keep]);
await pipeline(cmds);
const after = await cmd("LLEN", KEY);
console.log(`after: ${after} rows (all current format)`);
