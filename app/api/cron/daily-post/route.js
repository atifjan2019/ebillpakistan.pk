// GET /api/cron/daily-post: the daily content run, called by the Vercel cron
// in vercel.json. Vercel sends "Authorization: Bearer <CRON_SECRET>" when the
// CRON_SECRET environment variable is set; without it the route refuses to run,
// so nobody can burn API credit by hitting the URL.
//
// Two scheduled calls a day: ?stage=research at 04:00 UTC saves a sourced
// brief, ?stage=write at 05:00 UTC turns it into the post. Each stage then
// fits comfortably inside one invocation. Without ?stage both run in one go.
// Pass ?force=1 to write another post even if today's already exists.
// The research call also sends the day's bill due-date reminders (lib/push.js).
import crypto from "node:crypto";
import { runContentAgent } from "../../../../lib/contentAgent";
import { sendDueReminders } from "../../../../lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function authorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return null;
  const m = (req.headers.get("authorization") || "").match(/^Bearer\s+(\S+)$/i);
  if (!m) return false;
  const got = crypto.createHash("sha256").update(m[1]).digest();
  const want = crypto.createHash("sha256").update(secret).digest();
  return crypto.timingSafeEqual(got, want);
}

export async function GET(req) {
  const auth = authorized(req);
  if (auth === null) return Response.json({ ok: false, error: "CRON_SECRET is not set." }, { status: 503 });
  if (!auth) return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });

  const params = new URL(req.url).searchParams;
  const force = params.get("force") === "1";
  const stage = ["research", "write"].includes(params.get("stage")) ? params.get("stage") : "all";
  // The morning call (09:00 in Pakistan) also sends the day's due-date
  // reminders. They go first and are quick, so a slow research run cannot
  // delay or lose them.
  let reminders = null;
  if (stage !== "write") {
    try {
      reminders = await sendDueReminders();
    } catch (err) {
      reminders = { error: err.message };
    }
  }
  const result = await runContentAgent({ trigger: "cron", stage, force });
  const ok = ["drafted", "published", "researched", "skipped"].includes(result.status);
  return Response.json({ ok, ...result, reminders }, { status: ok ? 200 : 500 });
}
