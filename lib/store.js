// Shared cache + rate-limiter, backed by Vercel KV / Upstash Redis in production
// and an in-memory fallback locally (so the app works with zero config in dev).
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = URL && TOKEN ? new Redis({ url: URL, token: TOKEN }) : null;
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
const detectLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(12, "1 m"), prefix: "rl:detect", analytics: false })
  : null;
const billLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(40, "1 m"), prefix: "rl:bill", analytics: false })
  : null;

// Contact form: deliberately tight. A human sends a handful of messages at most,
// so 3 per hour per IP stops form-spam floods without inconveniencing anyone.
const contactLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, "1 h"), prefix: "rl:contact", analytics: false })
  : null;

async function limit(limiter, id) {
  if (!limiter) return { success: true }; // no Redis -> no limiting (dev)
  try {
    return await limiter.limit(id);
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
// We store a timestamp, company (disco), source page, outcome, and — for unique
// visitor + city stats — the client IP and the Vercel-provided city/country.
// We do NOT store reference numbers. NOTE: IP/city are personal data; keep the
// site privacy policy in sync. Unique visitors use a HyperLogLog so the count
// scales to millions of IPs in ~12KB (we never hold the full IP set).
const EV_KEY = "ebp:checks:events";   // capped list of recent events
const EV_MAX = 500;
const DISCO_KEY = "ebp:checks:byDisco";
const PAGE_KEY = "ebp:checks:byPage";
const DAY_KEY = "ebp:checks:byDay";
const CITY_KEY = "ebp:checks:byCity";
const TOTAL_KEY = "ebp:checks:total";
const UNIQ_KEY = "ebp:checks:uniques"; // HyperLogLog of IPs

const memEvents = []; // dev fallback when no Redis is configured
const memUniques = new Set(); // dev fallback unique IPs

const dayOf = (ms) => new Date(ms).toISOString().slice(0, 10);

export async function logBillCheck({ disco, ref, page, outcome, ip, city, country } = {}) {
  const hasIp = ip && ip !== "anon";
  const ev = {
    t: Date.now(),
    disco: disco || "auto",
    ref: ref || "",
    page: page || "(direct)",
    outcome: outcome || "view",
    ip: hasIp ? ip : "",
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
      if (hasIp) p.pfadd(UNIQ_KEY, ip);
      if (ev.city) p.hincrby(CITY_KEY, ev.city, 1);
      await p.exec();
    } catch {
      /* never let analytics break a bill lookup */
    }
  } else {
    memEvents.unshift(ev);
    if (memEvents.length > EV_MAX) memEvents.pop();
    if (hasIp) memUniques.add(ip);
  }
}

const asEvent = (v) => (typeof v === "string" ? JSON.parse(v) : v);
const numify = (obj) =>
  Object.fromEntries(Object.entries(obj || {}).map(([k, v]) => [k, Number(v) || 0]));

export async function getStats() {
  if (redis) {
    try {
      const [events, byDisco, byPage, byDay, byCity, total, uniques] = await Promise.all([
        redis.lrange(EV_KEY, 0, 49),
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
        recent: (events || []).map(asEvent),
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
    recent: memEvents.slice(0, 50),
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
