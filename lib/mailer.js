// Email notifications over SMTP (Gmail by default), configured on the admin
// Settings tab. Used by the content agent to say when a post went live or a
// run failed. Server-only.
import nodemailer from "nodemailer";
import { getSettings, SMTP_KEYS } from "./siteSettings";
import { SITE_URL } from "./seo";

const yes = (v) => /^(1|true|yes|on)$/i.test(String(v || ""));

export async function mailConfig() {
  const s = await getSettings(SMTP_KEYS);
  const v = (k) => s[k].value;
  return {
    host: v("SMTP_HOST"),
    port: parseInt(v("SMTP_PORT"), 10) || 465,
    user: v("SMTP_USER"),
    pass: v("SMTP_PASS"),
    from: v("SMTP_FROM") || v("SMTP_USER"),
    to: v("NOTIFY_TO") || v("SMTP_USER"),
    onPublish: yes(v("NOTIFY_ON_PUBLISH")),
    onFailure: yes(v("NOTIFY_ON_FAILURE")),
    configured: !!(v("SMTP_HOST") && v("SMTP_USER") && v("SMTP_PASS")),
  };
}

function transport(cfg) {
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: { user: cfg.user, pass: cfg.pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });
}

// Sends one message. Returns { ok, error } and never throws, because a mail
// failure must not fail the thing it is reporting on.
export async function sendMail({ subject, text, html, to }, cfgOverride) {
  const cfg = cfgOverride || (await mailConfig());
  if (!cfg.configured) return { ok: false, error: "SMTP is not set up." };
  try {
    const info = await transport(cfg).sendMail({
      from: `"eBill Pakistan" <${cfg.from}>`,
      to: to || cfg.to,
      subject,
      text,
      html,
    });
    return { ok: true, id: info.messageId };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function wrap(title, bodyHtml) {
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1f2a24">
  <p style="margin:0 0 16px;font-size:13px;color:#88998f">eBill Pakistan</p>
  <h1 style="font-size:20px;margin:0 0 16px">${esc(title)}</h1>
  ${bodyHtml}
  <p style="margin:24px 0 0;font-size:12px;color:#88998f">Sent by the content agent on ${esc(SITE_URL)}. Change these notifications in Admin, Settings.</p>
</div>`;
}

// A post went live (or was queued as a draft).
export async function notifyPost({ status, post, topic, words, cost, trigger }) {
  const cfg = await mailConfig();
  if (!cfg.configured || !cfg.onPublish) return { ok: false, skipped: true };
  const url = `${SITE_URL}/blog/${post.slug}`;
  const live = status === "published";
  const subject = live ? `Published: ${post.title}` : `Draft ready for review: ${post.title}`;
  const rows = [
    ["Title", post.title],
    ["Address", url],
    ["Length", `${words} words, ${post.faqs?.length || 0} FAQs`],
    ["Topic", topic],
    ["Cost", cost ? `$${cost.usd} (${cost.searches} searches)` : ""],
    ["Started by", trigger],
  ].filter(([, v]) => v);
  const html = wrap(
    live ? "A new guide is live" : "A new draft is waiting",
    `<table style="border-collapse:collapse;font-size:14px">${rows
      .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#88998f;vertical-align:top">${esc(k)}</td><td style="padding:6px 0">${k === "Address" ? `<a href="${esc(v)}">${esc(v)}</a>` : esc(v)}</td></tr>`)
      .join("")}</table>
    <p style="margin:18px 0 0;font-size:14px">${esc(post.metaDescription)}</p>
    <p style="margin:18px 0 0"><a href="${esc(live ? url : `${SITE_URL}/admin?tab=posts`)}" style="display:inline-block;background:#16a03d;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;font-weight:600">${live ? "Read the post" : "Review it in the admin"}</a></p>`
  );
  const text = `${subject}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${post.metaDescription}`;
  return sendMail({ subject, text, html });
}

// Something went wrong in a run.
export async function notifyFailure({ stage, error, day, trigger }) {
  const cfg = await mailConfig();
  if (!cfg.configured || !cfg.onFailure) return { ok: false, skipped: true };
  const subject = `Content agent failed (${stage} stage)`;
  const html = wrap(
    "Today's post was not written",
    `<p style="font-size:14px">The ${esc(stage)} stage failed on ${esc(day)} (started by ${esc(trigger)}):</p>
    <pre style="white-space:pre-wrap;background:#f4f7f5;padding:12px;border-radius:8px;font-size:13px">${esc(error)}</pre>
    <p style="font-size:14px">Open <a href="${esc(SITE_URL)}/admin?tab=posts">Admin, Blog posts</a> to see the log and run it again. If the research finished, running again only redoes the writing.</p>`
  );
  return sendMail({ subject, text: `${subject}\n\n${error}\n\n${SITE_URL}/admin?tab=posts`, html });
}
