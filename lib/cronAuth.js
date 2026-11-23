// Shared check for the scheduled routes under /api/cron. Vercel sends
// "Authorization: Bearer <CRON_SECRET>" with every cron call when the
// CRON_SECRET environment variable is set.
//
// Returns null when the secret is not configured (the route should refuse to
// run), false when the header is missing or wrong, true when it matches.
import crypto from "node:crypto";

export function cronAuthorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return null;
  const m = (req.headers.get("authorization") || "").match(/^Bearer\s+(\S+)$/i);
  if (!m) return false;
  const got = crypto.createHash("sha256").update(m[1]).digest();
  const want = crypto.createHash("sha256").update(secret).digest();
  return crypto.timingSafeEqual(got, want);
}

// The two responses every cron route gives before doing any work.
export function cronRefusal(auth) {
  if (auth === null) return Response.json({ ok: false, error: "CRON_SECRET is not set." }, { status: 503 });
  if (!auth) return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  return null;
}
