// Shared Redis connection for the whole app (posts, drafts, settings, push
// subscriptions, bill-check stats, cache and rate limits).
//
// Set REDIS_URL (for example redis://:password@127.0.0.1:6380) to use it.
// Without it `redis` is null and every module falls back to its in-memory or
// temp-file behaviour, so local development needs no setup.
//
// Values are written and read exactly the way the previous Upstash client did:
// objects are stored as JSON, strings and numbers as they are, and reads parse
// JSON back. Data copied over from the old Upstash database therefore reads
// back unchanged.
import { createClient } from "redis";

const URL = process.env.REDIS_URL;

// ---------- value encoding (must match the old @upstash/redis behaviour) ----------

/** Argument -> the string Redis stores. */
export function encode(value) {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
    case "boolean":
      return String(value);
    default:
      return JSON.stringify(value);
  }
}

/** A stored string -> JSON value where it parses, else the string itself.
 *  A number whose text would change on the way back ("007", "1e3") stays a string. */
export function decode(raw) {
  if (raw === null || raw === undefined) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "number" && parsed.toString() !== raw) return raw;
    return parsed;
  } catch {
    return raw;
  }
}

/** HGETALL decoding: JSON where it parses, no number guard; null for a missing hash. */
export function decodeHash(obj) {
  const entries = Object.entries(obj || {});
  if (!entries.length) return null;
  const out = {};
  for (const [field, raw] of entries) {
    try {
      out[field] = JSON.parse(raw);
    } catch {
      out[field] = raw;
    }
  }
  return out;
}

// ---------- connection ----------

let clientPromise = null;
let lastErrorLog = 0;

function connect() {
  if (!clientPromise) {
    const client = createClient({
      url: URL,
      socket: {
        connectTimeout: 3000,
        // Keep retrying in the background; individual commands fail fast meanwhile.
        reconnectStrategy: (retries) => Math.min(retries * 200, 3000),
      },
      disableOfflineQueue: true,
    });
    client.on("error", (err) => {
      // One line a minute at most, so an outage cannot flood the log.
      if (Date.now() - lastErrorLog > 60_000) {
        lastErrorLog = Date.now();
        console.error("[redis]", err?.message || err);
      }
    });
    clientPromise = client.connect().then(() => client).catch((err) => {
      clientPromise = null;
      throw err;
    });
  }
  return clientPromise;
}

// ---------- the client the app uses ----------
// Only the commands the app needs, with the same call shapes as before.

class Pipeline {
  constructor() {
    this.ops = [];
  }
  lpush(key, ...values) { this.ops.push((m) => m.lPush(key, values.map(encode))); return this; }
  ltrim(key, start, stop) { this.ops.push((m) => m.lTrim(key, start, stop)); return this; }
  hincrby(key, field, by) { this.ops.push((m) => m.hIncrBy(key, String(field), by)); return this; }
  incr(key) { this.ops.push((m) => m.incr(key)); return this; }
  pfadd(key, ...elements) { this.ops.push((m) => m.pfAdd(key, elements.map(encode))); return this; }
  hset(key, obj) { this.ops.push((m) => m.hSet(key, encodeFields(obj))); return this; }
  del(key) { this.ops.push((m) => m.del(key)); return this; }
  async exec() {
    if (!this.ops.length) return [];
    const client = await connect();
    const multi = client.multi();
    for (const op of this.ops) op(multi);
    return multi.execAsPipeline();
  }
}

function encodeFields(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, encode(v)]));
}

const api = {
  async get(key) {
    return decode(await (await connect()).get(key));
  },
  async set(key, value, opts) {
    const client = await connect();
    const options = typeof opts?.ex === "number" ? { EX: opts.ex } : undefined;
    return client.set(key, encode(value), options);
  },
  async del(...keys) {
    return (await connect()).del(keys);
  },
  async hget(key, field) {
    return decode(await (await connect()).hGet(key, String(field)));
  },
  async hgetall(key) {
    return decodeHash(await (await connect()).hGetAll(key));
  },
  async hset(key, obj) {
    return (await connect()).hSet(key, encodeFields(obj));
  },
  async hdel(key, ...fields) {
    return (await connect()).hDel(key, fields.map(String));
  },
  async hlen(key) {
    return (await connect()).hLen(key);
  },
  async lpush(key, ...values) {
    return (await connect()).lPush(key, values.map(encode));
  },
  async ltrim(key, start, stop) {
    return (await connect()).lTrim(key, start, stop);
  },
  async lrange(key, start, stop) {
    const rows = await (await connect()).lRange(key, start, stop);
    return rows.map(decode);
  },
  async pfcount(key) {
    return (await connect()).pfCount(key);
  },
  pipeline() {
    return new Pipeline();
  },
};

export const redis = URL ? api : null;

// ---------- rate limiting ----------
// Sliding window, the same algorithm the old @upstash/ratelimit used: the
// previous fixed window counts in proportion to how much of it still overlaps
// the last `windowMs`. Atomic, one round trip.
const SLIDING_WINDOW = `
local current = KEYS[1]
local previous = KEYS[2]
local limit = tonumber(ARGV[1])
local now = tonumber(ARGV[2])
local window = tonumber(ARGV[3])
local inCurrent = tonumber(redis.call("GET", current) or "0")
local inPrevious = tonumber(redis.call("GET", previous) or "0")
local weight = 1 - ((now % window) / window)
local used = math.floor(inPrevious * weight) + inCurrent
if used >= limit then
  return -1
end
redis.call("INCR", current)
redis.call("PEXPIRE", current, window * 2 + 1000)
return limit - used - 1
`;

/**
 * @returns {Promise<{ success: boolean, remaining: number }>}
 */
export async function slidingWindowLimit({ prefix, id, limit, windowMs, now = Date.now() }) {
  const client = await connect();
  const bucket = Math.floor(now / windowMs);
  const remaining = await client.eval(SLIDING_WINDOW, {
    keys: [`${prefix}:${id}:${bucket}`, `${prefix}:${id}:${bucket - 1}`],
    arguments: [String(limit), String(now), String(windowMs)],
  });
  return { success: remaining >= 0, remaining: Math.max(0, Number(remaining)) };
}
