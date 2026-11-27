// Exercises lib/redis.js against a real Redis server: every command the app
// uses, the pipeline and the rate limiter. Uses database 15 and empties it.
//   REDIS_URL=redis://:pass@127.0.0.1:6380/15 node scripts/redis-selftest.mjs
import assert from "node:assert/strict";
import { createClient } from "redis";

if (!/\/15$/.test(process.env.REDIS_URL || "")) {
  console.error("Point REDIS_URL at database 15 (…/15); this script empties it.");
  process.exit(1);
}
const { redis, slidingWindowLimit } = await import("../lib/redis.js");
const raw = createClient({ url: process.env.REDIS_URL });
await raw.connect();
await raw.flushDb();

await redis.set("s", { a: 1 }, { ex: 60 });
assert.deepEqual(await redis.get("s"), { a: 1 });
assert.ok((await raw.ttl("s")) > 0);
await redis.set("n", "20032");
assert.equal(await redis.get("n"), 20032);
assert.equal(await redis.get("missing"), null);

await redis.hset("h", { one: { x: 1 }, two: "plain" });
assert.deepEqual(await redis.hget("h", "one"), { x: 1 });
assert.deepEqual(await redis.hgetall("h"), { one: { x: 1 }, two: "plain" });
assert.equal(await redis.hlen("h"), 2);
await redis.hdel("h", "one", "two");
assert.equal(await redis.hgetall("h"), null);

await redis.lpush("l", { i: 1 });
await redis.lpush("l", { i: 2 });
await redis.ltrim("l", 0, 0);
assert.deepEqual(await redis.lrange("l", 0, -1), [{ i: 2 }]);

const p = redis.pipeline();
p.lpush("ev", { t: 1 }).ltrim("ev", 0, 9).hincrby("byDisco", "lesco", 1).hincrby("byDisco", "lesco", 2).incr("total").pfadd("u", "a", "b");
await p.exec();
assert.deepEqual(await redis.hgetall("byDisco"), { lesco: 3 });
assert.equal(await redis.get("total"), 1);
assert.equal(await redis.pfcount("u"), 2);
await redis.del("ev", "total");
assert.equal(await redis.get("total"), null);

const base = 1_000_000 * 60_000; // start of a window
let ok = 0;
for (let i = 0; i < 5; i++) if ((await slidingWindowLimit({ prefix: "rl:t", id: "ip", limit: 3, windowMs: 60_000, now: base + i })).success) ok++;
assert.equal(ok, 3, "only 3 of 5 allowed in one window");
// Half way through the next window, half of the previous window still counts (floor(3*0.5)=1).
const mid = await slidingWindowLimit({ prefix: "rl:t", id: "ip", limit: 3, windowMs: 60_000, now: base + 90_000 });
assert.deepEqual(mid, { success: true, remaining: 1 });
assert.ok((await raw.pTTL(`rl:t:ip:${Math.floor((base + 90_000) / 60_000)}`)) > 60_000);

await raw.flushDb();
await raw.quit();
console.log("redis self-test: all checks passed");
process.exit(0);
