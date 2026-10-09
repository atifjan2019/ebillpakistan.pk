// Due-date reminders.
//   GET     -> { publicKey }            the key the browser subscribes with
//   POST    -> save a reminder          { subscription, disco, dueDate, last4 }
//   DELETE  -> remove a reminder        { endpoint }
//
// Only the push subscription, company, due date and the last four digits of
// the reference are accepted and stored; see lib/push.js.
import { DISCOS } from "../../../lib/discos";
import { getIp, rateLimitBill } from "../../../lib/store";
import { vapidKeys, saveReminder, removeReminder } from "../../../lib/push";
import { todayPkIso, daysBetween } from "../../../lib/dates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bad = (status, error) => Response.json({ ok: false, error }, { status });

// Push endpoints are always https URLs at a browser vendor's push service.
function validSubscription(s) {
  if (!s || typeof s !== "object") return false;
  if (typeof s.endpoint !== "string" || s.endpoint.length > 1000) return false;
  try {
    if (new URL(s.endpoint).protocol !== "https:") return false;
  } catch {
    return false;
  }
  const k = s.keys || {};
  return typeof k.p256dh === "string" && typeof k.auth === "string" && k.p256dh.length < 200 && k.auth.length < 100;
}

export async function GET() {
  try {
    const { publicKey } = await vapidKeys();
    return Response.json({ ok: true, publicKey });
  } catch {
    return bad(503, "Reminders are not available right now.");
  }
}

export async function POST(request) {
  const rl = await rateLimitBill(getIp(request));
  if (!rl.success) return bad(429, "Too many requests. Try again in a minute.");
  let body;
  try {
    body = await request.json();
  } catch {
    return bad(400, "Invalid request.");
  }
  const { subscription, disco, dueDate, last4 } = body || {};
  if (!validSubscription(subscription)) return bad(400, "Invalid subscription.");
  if (!DISCOS[disco]) return bad(400, "Unknown company.");
  if (typeof dueDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return bad(400, "Invalid due date.");
  const days = daysBetween(todayPkIso(), dueDate);
  if (!(days >= -40 && days <= 60)) return bad(400, "That due date is too far away to remind about.");
  try {
    await saveReminder({
      subscription: { endpoint: subscription.endpoint, keys: { p256dh: subscription.keys.p256dh, auth: subscription.keys.auth } },
      disco,
      dueDate,
      last4: String(last4 || "").replace(/\D/g, "").slice(-4),
    });
  } catch {
    return bad(503, "Could not save the reminder. Try again shortly.");
  }
  return Response.json({ ok: true, dueDate });
}

export async function DELETE(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return bad(400, "Invalid request.");
  }
  if (typeof body?.endpoint !== "string") return bad(400, "Invalid request.");
  try {
    await removeReminder(body.endpoint);
  } catch {
    return bad(503, "Could not remove the reminder.");
  }
  return Response.json({ ok: true });
}
