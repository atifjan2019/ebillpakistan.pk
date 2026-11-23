// Merges the eleven per-company "bill check" blog posts into the company pages.
//
// What it does, in order:
//   1. rewrites links in the surviving KV posts that pointed at one of the
//      eleven slugs, so they point at the company page instead
//   2. deletes the eleven posts from the blog:posts hash
//
// The company pages themselves (lib/discoContent.js) and the 301s
// (next.config.js) are code changes in the same commit; this script only
// touches KV. Dry run by default; pass --apply to write.
//
//   set -a; . ./.env.vercel.local; set +a
//   node scripts/merge-company-posts.mjs            # shows every change
//   node scripts/merge-company-posts.mjs --apply    # makes them

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
if (!URL_ || !TOKEN) {
  console.error("Set KV_REST_API_URL and KV_REST_API_TOKEN first.");
  process.exit(2);
}
const APPLY = process.argv.includes("--apply");
const KEY = "blog:posts";

// old blog slug -> company page
export const MERGED = {
  "lesco-bill-check-online-official-page": "/lesco-bill-check",
  "iesco-bill-check-online-official-page": "/iesco-bill-check",
  "mepco-bill-check-online-official-page": "/mepco-bill-check",
  "fesco-bill-check-online-official-page": "/fesco-bill-check",
  "gepco-bill-check-online-official-page": "/gepco-bill-check",
  "hesco-bill-check-online-official-page": "/hesco-bill-check",
  "qesco-bill-check-online-official-page": "/qesco-bill-check",
  "sepco-bill-check-online-official-page": "/sepco-bill-check",
  "tesco-bill-check-online-official-page": "/tesco-bill-check",
  "ajk-electricity-bill-check-online-official-page": "/ajk-bill-check",
  "pesco-bill-check-online-complaint-numbers": "/pesco-bill-check",
};

// Anchor text that described the old post, replaced where the old text would
// read oddly against the company page it now points at.
const ANCHOR_TEXT = {
  "official MEPCO sites versus lookalikes": "the MEPCO bill page and the lookalike sites to avoid",
  "IESCO bill check sites, official versus lookalike": "the IESCO bill page and the lookalike sites to avoid",
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

const posts = await hgetall(KEY);
console.log(`${Object.keys(posts).length} posts in ${KEY}${APPLY ? "" : "  (dry run)"}\n`);

// 1. link rewrites
const rewrites = [];
for (const [slug, post] of Object.entries(posts)) {
  if (MERGED[slug]) continue;
  let content = post.content || "";
  let source = post.contentSource || "";
  const changes = [];
  for (const [old, dest] of Object.entries(MERGED)) {
    const hrefRe = new RegExp(`(<a href=")(?:https?://(?:www\\.)?ebillpakistan\\.pk)?/blog/${old}/?(")([^>]*>)([\\s\\S]*?)(</a>)`, "g");
    content = content.replace(hrefRe, (m, a, q, rest, text, close) => {
      const plain = text.replace(/<[^>]+>/g, "");
      const newText = ANCHOR_TEXT[plain] || text;
      changes.push({ from: `/blog/${old}`, to: dest, textFrom: plain, textTo: ANCHOR_TEXT[plain] || plain });
      return `${a}${dest}${q}${rest}${newText}${close}`;
    });
    const mdRe = new RegExp(`\\[([^\\]]*)\\]\\((?:https?://(?:www\\.)?ebillpakistan\\.pk)?/blog/${old}/?\\)`, "g");
    source = source.replace(mdRe, (m, text) => `[${ANCHOR_TEXT[text] || text}](${dest})`);
  }
  if (changes.length) {
    rewrites.push({ slug, changes, post: { ...post, content, contentSource: source, lastUpdated: "2026-11-23" } });
  }
}
for (const r of rewrites) {
  console.log(`rewrite /blog/${r.slug}`);
  for (const c of r.changes) {
    console.log(`   href  ${c.from}  ->  ${c.to}`);
    if (c.textFrom !== c.textTo) console.log(`   text  "${c.textFrom}"  ->  "${c.textTo}"`);
  }
}

// 2. deletions
const toDelete = Object.keys(MERGED).filter((s) => posts[s]);
console.log(`\ndelete ${toDelete.length} post(s):`);
for (const s of toDelete) console.log(`   /blog/${s}  ->  301 ${MERGED[s]}`);
const missing = Object.keys(MERGED).filter((s) => !posts[s]);
if (missing.length) console.log(`already gone: ${missing.join(", ")}`);

if (!APPLY) {
  console.log("\nDry run. Re-run with --apply to write these changes.");
  process.exit(0);
}

for (const r of rewrites) await cmd("HSET", KEY, r.slug, JSON.stringify(r.post));
if (toDelete.length) await cmd("HDEL", KEY, ...toDelete);
const after = await cmd("HLEN", KEY);
console.log(`\nApplied. ${KEY} now holds ${after} posts.`);
