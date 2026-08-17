// Audits the blog posts stored in Upstash Redis (hash `blog:posts`).
//
// Those posts were published through /api/posts and have never been reviewed by
// any of the content passes, which only touched lib/articles.js. They are live
// and indexed, so a wrong claim in one of them is as damaging as a wrong claim
// in a static post — and two corrections made this week (the non-telescopic slab
// rule, and HAZECO's separation date) very likely apply to them too.
//
// Run with the KV credentials in the environment:
//
//   KV_REST_API_URL=... KV_REST_API_TOKEN=... node scripts/audit-kv-posts.mjs
//
// (UPSTASH_REDIS_REST_URL / _TOKEN are accepted as aliases, same as lib/posts.js.)
//
// Read-only. It changes nothing; it tells you what needs changing.

import { ARTICLES } from "../lib/articles.js";
import { A1_BELOW_5KW, PROTECTED } from "../lib/tariffs.js";
import { AUTHORS, DEFAULT_AUTHOR } from "../lib/authors.js";

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

if (!URL_ || !TOKEN) {
  console.error(
    "\nMissing credentials. Set KV_REST_API_URL and KV_REST_API_TOKEN (or the\n" +
      "UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN aliases) and run again.\n\n" +
      "  vercel env pull .env.local     # then: set -a; . ./.env.local; set +a\n"
  );
  process.exit(2);
}

// ── fetch ────────────────────────────────────────────────────────────────────
async function hgetall(key) {
  const res = await fetch(`${URL_}/hgetall/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}: ${await res.text()}`);
  const { result } = await res.json();
  if (!result) return {};
  // Upstash returns a flat [field, value, field, value, ...] array.
  const out = {};
  for (let i = 0; i < result.length; i += 2) {
    const v = result[i + 1];
    out[result[i]] = typeof v === "string" ? safeParse(v) : v;
  }
  return out;
}
const safeParse = (v) => { try { return JSON.parse(v); } catch { return v; } };

// ── helpers ──────────────────────────────────────────────────────────────────
const strip = (html) =>
  String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const words = (t) => strip(t).split(/\s+/).filter(Boolean).length;

// Urdu uses U+06D4 as its full stop. Splitting on ASCII punctuation alone turns
// a 750-word Urdu post into ~5 "sentences", which then makes any shared line of
// site chrome look like 80% duplication. Include it.
const sentences = (t) =>
  new Set(
    strip(t)
      .split(/(?<=[.!?\u06D4])\s+/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.split(/\s+/).length >= 6)
  );

const overlapPct = (a, b) => {
  const A = sentences(a), B = sentences(b);
  if (!A.size || !B.size) return 0;
  let shared = 0;
  for (const s of A) if (B.has(s)) shared++;
  return (shared / Math.min(A.size, B.size)) * 100;
};

// ── the seven checks ─────────────────────────────────────────────────────────
const TELESCOPIC = [
  /only\s+to\s+the\s+units\s+in\s+(that|the)\s+upper\s+slab/i,
  /higher\s+rate\s+applies\s+only\s+to/i,
  /first\s+\d+\s+units\s*(&times;|×|x)\s*rs/i,
  /next\s+\d+\s+units\s*(&times;|×|x)\s*rs/i,
  /slab\s+by\s+slab/i,
  /applies\s+to\s+the\s+upper\s+portion/i,
];
// The six-month qualifying period IS correct — S.R.O. 1165(I)/2022, PART-II,
// A-1 Residential. What is not acceptable is asserting it with no citation, or
// presenting "consecutive" as the gazette's word when it says "consistently".
// So this now flags an UNCITED claim, not the claim itself.
const SIX_MONTHS = [
  /six\s+consecutive\s+(billing\s+)?(months|cycles)/i,
  /6\s+consecutive\s+(billing\s+)?(months|cycles)/i,
  /(past|last)\s+six\s+(billing\s+)?months/i,
  /چھ\s*ماہ/,
];
const CITES_DEFINITION = /1165\s*\(I\)|1165\(I\)|S\.?R\.?O\.?\s*1165/i;
// Also flag the unsupported lock-out claim, which no notification states.
const LOCKOUT = [/fresh\s+run\s+of\s+six/i, /must\s+build\s+a\s+fresh\s+run/i, /locked?\s+out\s+for\s+six/i];
const HAZECO_BAD = [/january\s+2023/i, /jan\s+2023/i, /in\s+2023.{0,40}carved\s+out/i];

// Rate figures that are current. A post quoting a domestic per-unit rate that is
// not one of these is quoting something superseded.
const CURRENT_RATES = new Set(
  [...A1_BELOW_5KW.lifeline, ...A1_BELOW_5KW.protected, ...A1_BELOW_5KW.unprotected]
    .map((r) => r.rate.toFixed(2))
);

function rateClaims(text) {
  const t = strip(text);
  const found = new Set();
  // "Rs 22.44", "Rs 22.44/unit", "22.44 per unit"
  for (const m of t.matchAll(/(?:rs\.?\s*)?(\d{1,3}\.\d{2})\s*(?:\/|per\s+)?unit/gi)) found.add(m[1]);
  for (const m of t.matchAll(/rs\.?\s*(\d{1,3}\.\d{2})/gi)) found.add(m[1]);
  return [...found].filter((r) => !CURRENT_RATES.has(r) && Number(r) > 2 && Number(r) < 100);
}

const hit = (text, pats) => pats.filter((p) => p.test(String(text || "")));

// ── run ──────────────────────────────────────────────────────────────────────
const posts = Object.values(await hgetall("blog:posts"));
const staticBySlug = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));
const GUIDES = ARTICLES.filter((a) =>
  ["how-to-find-reference-number-on-electricity-bill", "how-to-check-electricity-bill-online-pakistan"].includes(a.slug)
);

const bar = "═".repeat(78);
console.log(`\n${bar}\n  KV BLOG AUDIT — ${posts.length} post(s) in blog:posts\n${bar}`);

if (!posts.length) {
  console.log("\n  Nothing stored in KV. Every blog post is in lib/articles.js and has been audited.\n");
  process.exit(0);
}

const problems = [];
for (const p of posts) {
  const body = `${p.content || ""} ${(p.faqs || []).flat().join(" ")}`;
  const w = words(body);
  const flags = [];

  if (w < 500) flags.push(["THIN", `${w} words — under the 500 floor`]);
  const tel = hit(body, TELESCOPIC);
  if (tel.length) flags.push(["SLAB MODEL", `describes billing as telescopic (${tel.length} match) — WRONG for unprotected consumers`]);
  const six = hit(body, SIX_MONTHS);
  if (six.length && !CITES_DEFINITION.test(strip(body)))
    flags.push(["SIX MONTHS UNCITED", "states the six-month period without citing S.R.O. 1165(I)/2022 — the period is correct, the missing citation is not"]);
  if (hit(body, LOCKOUT).length)
    flags.push(["LOCK-OUT CLAIM", "asserts a fresh-run/lock-out period to regain protected status — no notification states one; present it as an implication of the rolling test"]);
  const haz = hit(body, HAZECO_BAD);
  if (haz.length) flags.push(["HAZECO DATE", "says January 2023 — correct: incorporated 31 Oct 2023, licence 23 May 2025, operations 1 Jul 2025"]);
  if (!p.author && !AUTHORS[DEFAULT_AUTHOR]) flags.push(["BYLINE", "no author and no default resolvable"]);
  if (!p.lastUpdated) flags.push(["NO lastUpdated", "renders no 'last updated' date"]);
  const rates = rateClaims(body);
  if (rates.length) flags.push(["RATE CLAIM", `quotes per-unit figures not in the current schedule: ${rates.slice(0, 6).join(", ")}`]);

  // overlap
  const vsGuides = GUIDES.map((g) => [g.slug, overlapPct(body, g.content)]).sort((a, b) => b[1] - a[1]);
  const vsKv = posts.filter((o) => o.slug !== p.slug)
    .map((o) => [o.slug, overlapPct(body, `${o.content || ""}`)])
    .sort((a, b) => b[1] - a[1]);
  if (vsGuides[0] && vsGuides[0][1] >= 15) flags.push(["DUPLICATE", `${vsGuides[0][1].toFixed(1)}% vs /blog/${vsGuides[0][0]}`]);
  if (vsKv[0] && vsKv[0][1] >= 15) flags.push(["DUPLICATE", `${vsKv[0][1].toFixed(1)}% vs KV post ${vsKv[0][0]}`]);
  if (staticBySlug[p.slug]) flags.push(["SLUG CLASH", "a static article shares this slug; the static one wins in getPost()"]);

  console.log(`\n  ── /blog/${p.slug}`);
  console.log(`     words ${w} · published ${p.publishedDate || "?"} · updated ${p.lastUpdated || "—"} · author ${p.author || `(default: ${DEFAULT_AUTHOR})`}`);
  console.log(`     max overlap: ${vsGuides[0] ? `${vsGuides[0][1].toFixed(1)}% vs guides` : "n/a"}${vsKv[0] ? `, ${vsKv[0][1].toFixed(1)}% vs other KV` : ""}`);
  if (!flags.length) console.log("     ✓ no problems found");
  for (const [k, v] of flags) console.log(`     ✗ ${k}: ${v}`);
  if (flags.length) problems.push([p.slug, flags]);
}

console.log(`\n${bar}\n  SUMMARY\n${bar}`);
console.log(`  posts audited : ${posts.length}`);
console.log(`  with problems : ${problems.length}`);
for (const [slug, flags] of problems) console.log(`     /blog/${slug} — ${flags.map((f) => f[0]).join(", ")}`);

console.log(`\n${bar}\n  HOW TO FIX A KV POST\n${bar}
  POST /api/posts refuses a slug that already exists (409), so it cannot update
  in place. Two working routes:

  1. Unpublish, then republish (no code change)
       a. /admin → find the post → "Unpublish" (calls deletePost)
       b. POST /api/posts with the corrected Markdown, same slug, and
          "author": "${DEFAULT_AUTHOR}" plus an "updatedAt" date.
     The window between the two is a live 404, so do it in one sitting.

  2. Move it into the repo (recommended for anything needing real editing)
       Copy the corrected HTML into lib/articles.js as a static article, then
       unpublish the KV copy. getPost() prefers static articles, so the static
       one takes over the moment it exists — no 404 window, and the post then
       gets reviewed by every future content pass instead of sitting unaudited.

  If you would rather update KV in place, ask and I will add a PUT handler to
  /api/posts — it is a small change to an existing authenticated route.\n`);

process.exit(problems.length ? 1 : 0);
