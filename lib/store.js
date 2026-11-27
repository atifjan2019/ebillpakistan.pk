// Shared cache + rate-limiter, backed by Redis in production (lib/redis.js)
// and an in-memory fallback locally (so the app works with zero config in dev).
import crypto from "node:crypto";
import { redis, slidingWindowLimit } from "./redis";

export const usingKV = !!redis;

// ---------- cache (L1 in-memory always, L2 KV when configured) ----------
const mem = new Map();
const MEM_MAX = 300;

function memGet(key) {
  const v = mem.get(key);
  if (v && v.exp > Date.now()) return v.val;
  if (v) mem.delete(key);
  return null;
}
function memSet(key, val, ttlSec) {
  if (mem.size >= MEM_MAX) mem.delete(mem.keys().next().value);
  mem.set(key, { val, exp: Date.now() + ttlSec * 1000 });
}

export async function cacheGet(key) {
  const hit = memGet(key);
  if (hit !== null) return hit;
  if (redis) {
    try {
      const v = await redis.get(key);
      if (v !== null && v !== undefined) {
        memSet(key, v, 60); // short L1 mirror
        return v;
      }
    } catch {
      /* ignore KV errors, behave like a miss */
    }
  }
  return null;
}

export async function cacheSet(key, val, ttlSec) {
  memSet(key, val, ttlSec);
  if (redis) {
    // fire-and-forget so a slow KV write never delays the response
    redis.set(key, val, { ex: ttlSec }).catch(() => {});
  }
}

// ---------- rate limiting ----------
// Detection can fan out to several PITC lookups, so it gets a stricter bucket.
const MINUTE = 60 * 1000;
const detectLimiter = { prefix: "rl:detect", limit: 12, windowMs: MINUTE };
const billLimiter = { prefix: "rl:bill", limit: 40, windowMs: MINUTE };

// Contact form: deliberately tight. A human sends a handful of messages at most,
// so 3 per hour per IP stops form-spam floods without inconveniencing anyone.
const contactLimiter = { prefix: "rl:contact", limit: 3, windowMs: 60 * MINUTE };

async function limit(limiter, id) {
  if (!redis) return { success: true }; // no Redis -> no limiting (dev)
  try {
    return await slidingWindowLimit({ ...limiter, id });
  } catch {
    return { success: true }; // never block users on a limiter error
  }
}

export const rateLimitDetect = (id) => limit(detectLimiter, id);
export const rateLimitBill = (id) => limit(billLimiter, id);
export const rateLimitContact = (id) => limit(contactLimiter, id);

// ---------- contact form messages ----------
// Messages are kept in a capped Redis list so nothing is lost even when no
// outbound mail provider is configured. Returns true when the message was
// durably stored; the API route treats a false here plus a failed email as a
// real failure rather than pretending the message went through.
const CONTACT_KEY = "ebp:contact:messages";
const CONTACT_MAX = 500;

export async function saveContactMessage(msg) {
  if (!redis) return false;
  try {
    const p = redis.pipeline();
    p.lpush(CONTACT_KEY, { t: Date.now(), ...msg });
    p.ltrim(CONTACT_KEY, 0, CONTACT_MAX - 1);
    await p.exec();
    return true;
  } catch {
    return false;
  }
}

export async function getContactMessages(n = 50) {
  if (!redis) return [];
  try {
    const rows = await redis.lrange(CONTACT_KEY, 0, n - 1);
    return (rows || []).map((v) => (typeof v === "string" ? JSON.parse(v) : v));
  } catch {
    return [];
  }
}

// ---------- bill-check analytics (for the /admin dashboard) ----------
// Each row holds: time, company, source page, outcome, the per-attempt causes
// (ok, notfound, 429, timeout, 5xx, network, http), the LAST FOUR DIGITS of the
// reference, a HASH of the client IP salted with the day (so repeats within a
// day can be spotted but the address cannot be recovered or followed across
// days), and the city/country Vercel reports. Rows are kept for seven days
// (EV_DAYS) for diagnostics: seeing why lookups fail and whether a reference
// or a connection keeps failing. Keep the privacy policy in sync with this.
// Unique visitors use a HyperLogLog over the daily hash.
const EV_KEY = "ebp:checks:events";   // list of recent events, newest first
const EV_MAX = 6000;                  // hard cap; the age cut below is the real limit
const EV_DAYS = 7;
const EV_MAX_AGE_MS = EV_DAYS * 24 * 60 * 60 * 1000;
const LOG_SALT = process.env.LOG_SALT || process.env.CRON_SECRET || "ebp-log";
const PRUNE_SHARE = 0.04; // share of writes that also run the age cut

export const maskRef = (ref) => {
  const s = String(ref || "");
  return s.length >= 4 ? `…${s.slice(-4)}` : "";
};
// sha256(day + salt + ip), first 16 hex chars. Different every day by design.
export const hashIp = (ip, when = Date.now()) =>
  ip && ip !== "anon"
    ? crypto.createHash("sha256").update(`${new Date(when).toISOString().slice(0, 10)}|${LOG_SALT}|${ip}`).digest("hex").slice(0, 16)
    : "";
const DISCO_KEY = "ebp:checks:byDisco";
const PAGE_KEY = "ebp:checks:byPage";
const DAY_KEY = "ebp:checks:byDay";
const CITY_KEY = "ebp:checks:byCity";
const TOTAL_KEY = "ebp:checks:total";
const UNIQ_KEY = "ebp:checks:uniques"; // HyperLogLog of IPs

const memEvents = []; // dev fallback when no Redis is configured
const memUniques = new Set(); // dev fallback unique IPs

const dayOf = (ms) => new Date(ms).toISOString().slice(0, 10);

export async function logBillCheck({ disco, ref, page, outcome, ip, city, country, attempts } = {}) {
  const hasIp = ip && ip !== "anon";
  const t = Date.now();
  const ev = {
    t,
    disco: disco || "unknown",
    ref4: maskRef(ref),
    page: page || "(direct)",
    outcome: outcome || "view",
    attempts: Array.isArray(attempts) ? attempts.slice(0, 6) : [],
    iph: hasIp ? hashIp(ip, t) : "",
    city: city || "",
    country: country || "",
  };
  if (redis) {
    try {
      const p = redis.pipeline();
      p.lpush(EV_KEY, ev);
      p.ltrim(EV_KEY, 0, EV_MAX - 1);
      p.hincrby(DISCO_KEY, ev.disco, 1);
      p.hincrby(PAGE_KEY, ev.page, 1);
      p.hincrby(DAY_KEY, dayOf(ev.t), 1);
      p.incr(TOTAL_KEY);
      if (hasIp) p.pfadd(UNIQ_KEY, ev.iph);
      if (ev.city) p.hincrby(CITY_KEY, ev.city, 1);
      await p.exec();
      // Age out old rows on roughly one write in twenty-five (and on the daily
      // cron), so the seven-day limit holds without anyone opening /admin.
      if (Math.random() < PRUNE_SHARE) await pruneEvents();
    } catch {
      /* never let analytics break a bill lookup */
    }
  } else {
    memEvents.unshift(ev);
    if (memEvents.length > EV_MAX) memEvents.pop();
    if (hasIp) memUniques.add(ev.iph);
  }
}

const asEvent = (v) => (typeof v === "string" ? JSON.parse(v) : v);
const fresh = (ev) => ev && Date.now() - ev.t <= EV_MAX_AGE_MS;

// Rows for the diagnostics views: the last seven days, newest first.
export async function getRecentEvents(limit = 5000) {
  if (redis) {
    try {
      const rows = await redis.lrange(EV_KEY, 0, Math.min(limit, EV_MAX) - 1);
      return (rows || []).map(asEvent).filter(fresh);
    } catch {
      return [];
    }
  }
  return memEvents.filter(fresh).slice(0, limit);
}

// Drop rows older than EV_DAYS. Runs on a sample of writes, from the daily
// reminders cron and on each admin visit. The list is newest-first, so the
// cut is one LTRIM at the first stale row. Returns how many rows were cut.
export async function pruneEvents() {
  if (!redis) {
    let cut = 0;
    while (memEvents.length && !fresh(memEvents[memEvents.length - 1])) { memEvents.pop(); cut++; }
    return cut;
  }
  try {
    const rows = (await redis.lrange(EV_KEY, 0, EV_MAX - 1)) || [];
    const keep = rows.map(asEvent).findIndex((ev) => !fresh(ev));
    if (keep < 0) return 0;
    if (keep === 0) {
      await redis.del(EV_KEY);
      return rows.length;
    }
    await redis.ltrim(EV_KEY, 0, keep - 1);
    return rows.length - keep;
  } catch {
    return 0;
  }
}
const numify = (obj) =>
  Object.fromEntries(Object.entries(obj || {}).map(([k, v]) => [k, Number(v) || 0]));

export async function getStats() {
  if (redis) {
    try {
      const [events, byDisco, byPage, byDay, byCity, total, uniques] = await Promise.all([
        redis.lrange(EV_KEY, 0, 499),
        redis.hgetall(DISCO_KEY),
        redis.hgetall(PAGE_KEY),
        redis.hgetall(DAY_KEY),
        redis.hgetall(CITY_KEY),
        redis.get(TOTAL_KEY),
        redis.pfcount(UNIQ_KEY),
      ]);
      return {
        configured: true,
        total: Number(total) || 0,
        uniqueVisitors: Number(uniques) || 0,
        byDisco: numify(byDisco),
        byPage: numify(byPage),
        byDay: numify(byDay),
        byCity: numify(byCity),
        recent: (events || []).map(asEvent).filter(fresh),
      };
    } catch {
      return { configured: true, total: 0, uniqueVisitors: 0, byDisco: {}, byPage: {}, byDay: {}, byCity: {}, recent: [] };
    }
  }
  // dev fallback (in-memory, not persistent)
  const byDisco = {}, byPage = {}, byDay = {}, byCity = {};
  for (const ev of memEvents) {
    byDisco[ev.disco] = (byDisco[ev.disco] || 0) + 1;
    byPage[ev.page] = (byPage[ev.page] || 0) + 1;
    if (ev.city) byCity[ev.city] = (byCity[ev.city] || 0) + 1;
    const d = dayOf(ev.t);
    byDay[d] = (byDay[d] || 0) + 1;
  }
  return {
    configured: false,
    total: memEvents.length,
    uniqueVisitors: memUniques.size,
    byDisco, byPage, byDay, byCity,
    recent: memEvents.filter(fresh).slice(0, 500),
  };
}

// Best-effort client IP from request headers (Vercel sets x-forwarded-for).
export function getIp(headersOrReq) {
  const get =
    typeof headersOrReq?.get === "function"
      ? (k) => headersOrReq.get(k)
      : (k) => headersOrReq?.headers?.get?.(k);
  const xff = get("x-forwarded-for") || "";
  return xff.split(",")[0].trim() || get("x-real-ip") || "anon";
}
