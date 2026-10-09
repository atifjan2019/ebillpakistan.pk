// Drafts written by the content agent, waiting for a human to publish them,
// plus a short log of the agent's runs. Both live in Upstash Redis next to
// the published posts (lib/posts.js), with a temp-file fallback for dev.
//
//   blog:drafts    hash  { <slug>: <post-shaped object + agent metadata> }
//   blog:agent:log list  newest-first JSON entries, capped at LOG_MAX
//   blog:agent:run:<YYYY-MM-DD>  string  the day's in-progress state, so a run
//                  cut off by a timeout can be resumed instead of started over
import { Redis } from "@upstash/redis";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = URL && TOKEN ? new Redis({ url: URL, token: TOKEN }) : null;

const DRAFTS = "blog:drafts";
const LOG = "blog:agent:log";
const LOG_MAX = 60;
const RUN = (day) => `blog:agent:run:${day}`;

// Dev fallback: one JSON file in the temp directory, because Next compiles the
// API routes and the admin page into separate module graphs, so an in-memory
// Map would not be shared between them.
const DEV_FILE = path.join(os.tmpdir(), "ebillpakistan-agent.json");
function devRead() {
  try {
    return JSON.parse(fs.readFileSync(DEV_FILE, "utf8"));
  } catch {
    return { drafts: {}, log: [], runs: {} };
  }
}
function devWrite(mut) {
  const db = devRead();
  mut(db);
  fs.writeFileSync(DEV_FILE, JSON.stringify(db));
}

const parse = (v) => (typeof v === "string" ? JSON.parse(v) : v);
const newestFirst = (a, b) => String(b.generatedAt).localeCompare(String(a.generatedAt));

export async function getDrafts() {
  if (redis) {
    try {
      const all = await redis.hgetall(DRAFTS);
      return Object.values(all || {}).map(parse).sort(newestFirst);
    } catch {
      return [];
    }
  }
  return Object.values(devRead().drafts).sort(newestFirst);
}

export async function getDraft(slug) {
  if (redis) {
    try {
      const v = await redis.hget(DRAFTS, slug);
      return v ? parse(v) : null;
    } catch {
      return null;
    }
  }
  return devRead().drafts[slug] || null;
}

export async function saveDraft(draft) {
  if (redis) await redis.hset(DRAFTS, { [draft.slug]: draft });
  else devWrite((db) => { db.drafts[draft.slug] = draft; });
}

export async function deleteDraft(slug) {
  if (redis) await redis.hdel(DRAFTS, slug);
  else devWrite((db) => { delete db.drafts[slug]; });
}

// ---- run log ----
export async function logRun(entry) {
  const row = { at: new Date().toISOString(), ...entry };
  if (redis) {
    try {
      await redis.lpush(LOG, JSON.stringify(row));
      await redis.ltrim(LOG, 0, LOG_MAX - 1);
    } catch {
      /* a lost log line is not worth failing the run */
    }
  } else {
    devWrite((db) => { db.log.unshift(row); db.log.splice(LOG_MAX); });
  }
  return row;
}

export async function getRunLog(limit = 20) {
  if (redis) {
    try {
      const rows = await redis.lrange(LOG, 0, limit - 1);
      return rows.map(parse);
    } catch {
      return [];
    }
  }
  return devRead().log.slice(0, limit);
}

// ---- per-day run state (resumable) ----
export async function getRunState(day) {
  if (redis) {
    try {
      const v = await redis.get(RUN(day));
      return v ? parse(v) : null;
    } catch {
      return null;
    }
  }
  return devRead().runs[day] || null;
}

export async function setRunState(day, state) {
  if (redis) await redis.set(RUN(day), JSON.stringify(state), { ex: 60 * 60 * 36 });
  else devWrite((db) => { db.runs[day] = state; });
}

export async function clearRunState(day) {
  if (redis) await redis.del(RUN(day));
  else devWrite((db) => { delete db.runs[day]; });
}
