// Settings changed from the admin dashboard, kept in Upstash Redis as one hash
// (site:settings). Each one falls back to the environment variable of the same
// name, so a deployment that has never saved anything keeps working, and a
// saved value wins once there is one.
//
// Server-only. Secrets are never sent to the browser in full: the admin page
// shows the last four characters through maskSecret().
import { Redis } from "@upstash/redis";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = URL && TOKEN ? new Redis({ url: URL, token: TOKEN }) : null;

const KEY = "site:settings";
const DEV_FILE = path.join(os.tmpdir(), "ebillpakistan-settings.json");

export const SMTP_KEYS = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "NOTIFY_TO", "NOTIFY_ON_PUBLISH", "NOTIFY_ON_FAILURE"];
export const SECRET_KEYS = new Set(["SMTP_PASS"]);
export const DEFAULTS = {
  SMTP_HOST: "smtp.gmail.com",
  SMTP_PORT: "465",
  NOTIFY_ON_PUBLISH: "yes",
  NOTIFY_ON_FAILURE: "yes",
};

async function readAll() {
  if (redis) {
    try {
      return (await redis.hgetall(KEY)) || {};
    } catch {
      return {};
    }
  }
  try {
    return JSON.parse(fs.readFileSync(DEV_FILE, "utf8"));
  } catch {
    return {};
  }
}

export async function saveSettings(values) {
  const set = {};
  const del = [];
  for (const [k, v] of Object.entries(values)) {
    const s = typeof v === "string" ? v.trim() : "";
    if (s) set[k] = s;
    else del.push(k);
  }
  if (redis) {
    if (Object.keys(set).length) await redis.hset(KEY, set);
    if (del.length) await redis.hdel(KEY, ...del);
  } else {
    const all = await readAll();
    Object.assign(all, set);
    for (const k of del) delete all[k];
    fs.writeFileSync(DEV_FILE, JSON.stringify(all));
  }
}

// Every setting with its value and where it came from.
export async function getSettings(keys = SMTP_KEYS) {
  const saved = await readAll();
  const out = {};
  for (const k of keys) {
    if (saved[k]) out[k] = { value: String(saved[k]), source: "saved" };
    else if (process.env[k]) out[k] = { value: process.env[k], source: "env" };
    else if (DEFAULTS[k]) out[k] = { value: DEFAULTS[k], source: "default" };
    else out[k] = { value: "", source: "none" };
  }
  return out;
}

export async function getSetting(key) {
  return (await getSettings([key]))[key].value;
}

export function maskSecret(value) {
  if (!value) return "";
  return value.length <= 8 ? "••••" : `••••••••${value.slice(-4)}`;
}
