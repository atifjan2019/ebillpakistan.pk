// One-off move of all data from the old Upstash database to the Redis server
// the site now uses. Copies every key byte for byte (strings, including the
// HyperLogLog of unique visitors, hashes, lists, sets, sorted sets) with its
// remaining expiry. Safe to run again: each key is replaced as a whole.
//
//   UPSTASH_URL=... UPSTASH_TOKEN=... REDIS_URL=redis://:pass@127.0.0.1:6380 \
//     node scripts/copy-from-upstash.mjs [--dry]
import { createClient } from "redis";

const { UPSTASH_URL, UPSTASH_TOKEN, REDIS_URL } = process.env;
const DRY = process.argv.includes("--dry");
if (!UPSTASH_URL || !UPSTASH_TOKEN || !REDIS_URL) {
  console.error("Set UPSTASH_URL, UPSTASH_TOKEN and REDIS_URL.");
  process.exit(1);
}

// Base64 responses keep binary values (the HyperLogLog) intact.
async function up(...cmd) {
  const res = await fetch(UPSTASH_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Upstash-Encoding": "base64" },
    body: JSON.stringify(cmd),
  });
  const body = await res.json();
  if (body.error) throw new Error(`${cmd[0]}: ${body.error}`);
  return body.result;
}
const b64 = (s) => (s === null || s === undefined ? null : Buffer.from(s, "base64"));
const text = (s) => b64(s).toString("utf8");

const keys = [];
let cursor = "0";
do {
  const [next, batch] = await up("SCAN", cursor, "COUNT", "1000");
  cursor = text(next);
  keys.push(...batch.map(text));
} while (cursor !== "0");

const dst = createClient({ url: REDIS_URL });
await dst.connect();

const summary = {};
let copied = 0;
for (const key of keys) {
  const type = text(await up("TYPE", key));
  const pttl = Number(await up("PTTL", key));
  summary[type] = (summary[type] || 0) + 1;
  if (type === "none") continue; // expired while we were scanning

  const m = dst.multi().del(key);
  if (type === "string") {
    m.set(key, b64(await up("GET", key)));
  } else if (type === "hash") {
    const flat = (await up("HGETALL", key)).map(b64);
    if (flat.length) m.hSet(key, flat);
  } else if (type === "list") {
    const items = (await up("LRANGE", key, "0", "-1")).map(b64);
    if (items.length) m.rPush(key, items);
  } else if (type === "set") {
    const members = (await up("SMEMBERS", key)).map(b64);
    if (members.length) m.sAdd(key, members);
  } else if (type === "zset") {
    const flat = await up("ZRANGE", key, "0", "-1", "WITHSCORES");
    const entries = [];
    for (let i = 0; i < flat.length; i += 2) entries.push({ value: b64(flat[i]), score: Number(text(flat[i + 1])) });
    if (entries.length) m.zAdd(key, entries);
  } else {
    console.warn(`skipped ${key}: type ${type} is not handled`);
    continue;
  }
  if (pttl > 0) m.pExpire(key, pttl);
  if (!DRY) await m.exec();
  copied++;
}

// Spot check: the same number of keys of each type on both sides.
const after = {};
for (const key of keys) {
  const t = await dst.type(key);
  after[t] = (after[t] || 0) + 1;
}
console.log(JSON.stringify({ dry: DRY, sourceKeys: keys.length, copied, sourceTypes: summary, destinationTypes: after }));
await dst.quit();
