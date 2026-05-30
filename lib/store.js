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

// Best-effort client IP from request headers (Vercel sets x-forwarded-for).
export function getIp(headersOrReq) {
  const get =
    typeof headersOrReq?.get === "function"
      ? (k) => headersOrReq.get(k)
      : (k) => headersOrReq?.headers?.get?.(k);
  const xff = get("x-forwarded-for") || "";
  return xff.split(",")[0].trim() || get("x-real-ip") || "anon";
}
