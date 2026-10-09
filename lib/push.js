// Due-date reminders as browser push notifications. Server-only.
//
// What is stored for a reminder: the browser's push subscription (an anonymous
// address at the browser vendor's push service plus its two public keys), the
// company, the due date and the last four digits of the reference number, which
// only label the notification. The full reference number is never stored, and
// no name, phone number or email is involved.
//
//   push:subs     hash  { <hash of endpoint>: { subscription, disco, dueDate, last4, sent, at } }
//   push:lastrun  string  summary of the last daily run, for the admin page
//
// The signing keys (VAPID) are generated on first use and kept with the other
// site settings, so there is nothing to configure.
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import webpush from "web-push";
import { Redis } from "@upstash/redis";
import { getSettings, saveSettings } from "./siteSettings";
import { DISCOS } from "./discos";
import { BUSINESS } from "./contact";
import { todayPkIso, daysBetween, dayMonth } from "./dates";

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = URL_ && TOKEN ? new Redis({ url: URL_, token: TOKEN }) : null;

const SUBS = "push:subs";
const LAST = "push:lastrun";
const DEV_FILE = path.join(os.tmpdir(), "ebillpakistan-push.json");
const devRead = () => {
  try {
    return JSON.parse(fs.readFileSync(DEV_FILE, "utf8"));
  } catch {
    return { subs: {}, last: null };
  }
};
const devWrite = (mut) => {
  const db = devRead();
  mut(db);
  fs.writeFileSync(DEV_FILE, JSON.stringify(db));
};
const parse = (v) => (typeof v === "string" ? JSON.parse(v) : v);
const idOf = (endpoint) => crypto.createHash("sha256").update(String(endpoint)).digest("hex").slice(0, 32);

// ---- signing keys ----
let _keys;
export async function vapidKeys() {
  if (_keys) return _keys;
  const s = await getSettings(["VAPID_PUBLIC", "VAPID_PRIVATE"]);
  let publicKey = s.VAPID_PUBLIC.value;
  let privateKey = s.VAPID_PRIVATE.value;
  if (!publicKey || !privateKey) {
    const k = webpush.generateVAPIDKeys();
    publicKey = k.publicKey;
    privateKey = k.privateKey;
    await saveSettings({ VAPID_PUBLIC: publicKey, VAPID_PRIVATE: privateKey });
    // Read back what is actually stored, so two servers starting at the same
    // moment settle on one pair instead of each keeping its own.
    const again = await getSettings(["VAPID_PUBLIC", "VAPID_PRIVATE"]);
    if (again.VAPID_PUBLIC.value && again.VAPID_PRIVATE.value) {
      publicKey = again.VAPID_PUBLIC.value;
      privateKey = again.VAPID_PRIVATE.value;
    }
  }
  _keys = { publicKey, privateKey };
  return _keys;
}

// ---- storage ----
export async function saveReminder({ subscription, disco, dueDate, last4 }) {
  const id = idOf(subscription.endpoint);
  let prev = null;
  if (redis) prev = parse(await redis.hget(SUBS, id));
  else prev = devRead().subs[id] || null;
  // A new due date starts a fresh set of reminders; the same one keeps its flags.
  const sent = prev && prev.dueDate === dueDate ? prev.sent || {} : {};
  const rec = { subscription, disco, dueDate, last4: String(last4 || "").slice(-4), sent, at: new Date().toISOString() };
  if (redis) await redis.hset(SUBS, { [id]: rec });
  else devWrite((db) => { db.subs[id] = rec; });
  return rec;
}

export async function removeReminder(endpoint) {
  const id = idOf(endpoint);
  if (redis) await redis.hdel(SUBS, id);
  else devWrite((db) => { delete db.subs[id]; });
}

export async function listReminders() {
  if (redis) {
    const all = (await redis.hgetall(SUBS)) || {};
    return Object.entries(all).map(([id, v]) => ({ id, ...parse(v) }));
  }
  return Object.entries(devRead().subs).map(([id, v]) => ({ id, ...v }));
}

export async function reminderStats() {
  let count = 0;
  let last = null;
  try {
    if (redis) {
      count = await redis.hlen(SUBS);
      last = parse(await redis.get(LAST));
    } else {
      const db = devRead();
      count = Object.keys(db.subs).length;
      last = db.last;
    }
  } catch {
    /* stats are best effort */
  }
  return { count, last };
}

// ---- what to send, decided separately from sending so it can be tested ----
// Returns { kind, title, body } for a record on a given day, or null. `kind`
// is the flag recorded once sent: "soon" (1 to 3 days before), "today", "next"
// (the following bill is probably out), or "expire" (drop the record).
export function dueMessage(rec, todayIso) {
  const days = daysBetween(todayIso, rec.dueDate);
  const abbr = DISCOS[rec.disco]?.[0] || "electricity";
  const tail = rec.last4 ? ` (reference ending ${rec.last4})` : "";
  const sent = rec.sent || {};
  if (days >= 1 && days <= 3 && !sent.soon) {
    return { kind: "soon", title: `${abbr} bill due in ${days} day${days === 1 ? "" : "s"}`, body: `Your ${abbr} bill${tail} is due on ${dayMonth(rec.dueDate)}. Pay before then to avoid the late payment surcharge.` };
  }
  if (days === 0 && !sent.today) {
    return { kind: "today", title: `${abbr} bill due today`, body: `Today is the last day to pay your ${abbr} bill${tail} at the lower amount.` };
  }
  if (days <= -22 && days >= -40 && !sent.next) {
    return { kind: "next", title: `Your new ${abbr} bill should be out`, body: `Check this month's ${abbr} bill${tail} and its due date. One tap, no sign-up.` };
  }
  if (days < -40) return { kind: "expire" };
  return null;
}

// ---- the daily run ----
export async function sendDueReminders({ now, send } = {}) {
  const todayIso = todayPkIso(now);
  const summary = { day: todayIso, at: new Date().toISOString(), total: 0, sent: 0, failed: 0, removed: 0 };
  let recs;
  try {
    recs = await listReminders();
  } catch (err) {
    return { ...summary, error: err.message };
  }
  summary.total = recs.length;
  if (!recs.length) return finish(summary);

  let deliver = send;
  if (!deliver) {
    const keys = await vapidKeys();
    webpush.setVapidDetails(`mailto:${BUSINESS.email}`, keys.publicKey, keys.privateKey);
    deliver = (sub, payload) => webpush.sendNotification(sub, payload, { TTL: 60 * 60 * 12 });
  }

  for (const rec of recs) {
    const msg = dueMessage(rec, todayIso);
    if (!msg) continue;
    if (msg.kind === "expire") {
      await removeReminder(rec.subscription.endpoint);
      summary.removed++;
      continue;
    }
    try {
      await deliver(rec.subscription, JSON.stringify({ title: msg.title, body: msg.body, url: "/?source=reminder", tag: `bill-${rec.id}` }));
      summary.sent++;
      if (msg.kind === "next") {
        // The reminder has done its job; the next bill check sets a new one.
        await removeReminder(rec.subscription.endpoint);
      } else {
        const next = { subscription: rec.subscription, disco: rec.disco, dueDate: rec.dueDate, last4: rec.last4, sent: { ...(rec.sent || {}), [msg.kind]: true }, at: rec.at };
        if (redis) await redis.hset(SUBS, { [rec.id]: next });
        else devWrite((db) => { db.subs[rec.id] = next; });
      }
    } catch (err) {
      // 404/410: the browser has dropped this subscription for good.
      if (err?.statusCode === 404 || err?.statusCode === 410) {
        await removeReminder(rec.subscription.endpoint);
        summary.removed++;
      } else {
        summary.failed++;
      }
    }
  }
  return finish(summary);
}

async function finish(summary) {
  try {
    if (redis) await redis.set(LAST, JSON.stringify(summary));
    else devWrite((db) => { db.last = summary; });
  } catch {
    /* ignore */
  }
  return summary;
}
