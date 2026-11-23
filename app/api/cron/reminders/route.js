// GET /api/cron/reminders: sends the day's bill due-date push reminders
// (lib/push.js). Called once a day by the Vercel cron in vercel.json at
// 04:00 UTC, which is 09:00 in Pakistan.
//
// This used to ride along with the daily content run. It now has its own
// route and schedule so reminders keep going out whether or not anything is
// being written.
import { cronAuthorized, cronRefusal } from "../../../../lib/cronAuth";
import { sendDueReminders } from "../../../../lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req) {
  const refusal = cronRefusal(cronAuthorized(req));
  if (refusal) return refusal;

  try {
    const reminders = await sendDueReminders();
    return Response.json({ ok: true, reminders });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
