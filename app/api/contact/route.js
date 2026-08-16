// POST /api/contact — the contact form on /contact.
//
// Defence in depth against spam, in order of cost:
//   1. honeypot field ("website") that a human never sees and never fills
//   2. a minimum time-on-form check (bots submit instantly)
//   3. per-IP rate limit (3 per hour, see lib/store.js)
//   4. strict server-side validation of every field
//
// Delivery: the message is ALWAYS written to the Redis message list first, so it
// cannot be lost, and is additionally emailed if an outbound provider is
// configured. If neither path succeeds we return 503 and say so — we never
// return "sent" for a message that went nowhere.
import { getIp, rateLimitContact, saveContactMessage } from "../../../lib/store";
import { CONTACT_SUBJECTS } from "../../../lib/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 3000; // a human cannot read and complete this form faster
const MAX = { name: 100, email: 254, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const bad = (status, error, field) =>
  Response.json({ ok: false, error, ...(field ? { field } : {}) }, { status });

// TODO (deployment): outbound email is OPTIONAL and currently unconfigured.
// To receive messages by email as well as in the dashboard store, set BOTH:
//   RESEND_API_KEY  — an API key from https://resend.com
//   CONTACT_TO      — the inbox to notify, e.g. support@ebillpakistan.pk
//   CONTACT_FROM    — a verified sender on your domain, e.g. forms@ebillpakistan.pk
// Until they are set, messages are still captured (Redis list ebp:contact:messages)
// and nothing is silently dropped.
async function sendEmail({ name, email, subject, message }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  if (!key || !to || !from) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[eBill Pakistan] ${subject} — ${name}`,
        text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return bad(400, "Request body must be valid JSON.");
  }

  const { name, email, subject, message, website, startedAt } = body || {};

  // 1. Honeypot: a real visitor never sees this field, so any value is a bot.
  // Answer 200 so the bot believes it succeeded and doesn't retry differently.
  if (typeof website === "string" && website.trim()) {
    return Response.json({ ok: true });
  }

  // 2. Submitted implausibly fast.
  const started = Number(startedAt);
  if (Number.isFinite(started) && Date.now() - started < MIN_FILL_MS) {
    return bad(400, "That was submitted a little too quickly. Please try again.");
  }

  // 3. Rate limit per IP.
  const rl = await rateLimitContact(getIp(request));
  if (!rl.success) {
    return bad(429, "You've sent a few messages already. Please try again in an hour, or email support@ebillpakistan.pk directly.");
  }

  // 4. Validation.
  const clean = (v) => (typeof v === "string" ? v.trim() : "");
  const n = clean(name);
  const e = clean(email);
  const s = clean(subject);
  const m = clean(message);

  if (n.length < 2 || n.length > MAX.name) return bad(400, "Please enter your name (2–100 characters).", "name");
  if (!EMAIL_RE.test(e) || e.length > MAX.email) return bad(400, "Please enter a valid email address so we can reply.", "email");
  if (!CONTACT_SUBJECTS.includes(s)) return bad(400, "Please choose what your message is about.", "subject");
  if (m.length < 10) return bad(400, "Please give us a little more detail (at least 10 characters).", "message");
  if (m.length > MAX.message) return bad(400, "That message is too long (5,000 characters maximum).", "message");

  const stored = await saveContactMessage({
    name: n,
    email: e,
    subject: s,
    message: m,
    ip: getIp(request),
  });
  const mailed = await sendEmail({ name: n, email: e, subject: s, message: m });

  if (!stored && !mailed) {
    return bad(
      503,
      "We couldn't deliver your message just now. Please email support@ebillpakistan.pk directly — sorry about that."
    );
  }

  return Response.json({ ok: true });
}
