// GET /api/cron/daily-post: runs the content agent once. It is no longer on a
// schedule: the two daily cron entries that called it were removed so posts
// are written only when someone asks for one (the admin page's "Write a post
// now" button, or a manual call to this route with the cron secret).
//
// ?stage=research saves a sourced brief, ?stage=write turns it into the post.
// Without ?stage both run in one go. Pass ?force=1 to write another post even
// if today's already exists.
//
// Due-date reminders moved to /api/cron/reminders, which has its own daily
// schedule, so a manual run here never sends them a second time.
import { cronAuthorized, cronRefusal } from "../../../../lib/cronAuth";
import { runContentAgent } from "../../../../lib/contentAgent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req) {
  const refusal = cronRefusal(cronAuthorized(req));
  if (refusal) return refusal;

  const params = new URL(req.url).searchParams;
  const force = params.get("force") === "1";
  const stage = ["research", "write"].includes(params.get("stage")) ? params.get("stage") : "all";
  const result = await runContentAgent({ trigger: "manual", stage, force });
  const ok = ["drafted", "published", "researched", "skipped"].includes(result.status);
  return Response.json({ ok, ...result }, { status: ok ? 200 : 500 });
}
