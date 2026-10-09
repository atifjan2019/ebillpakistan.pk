import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { DISCOS } from "../../lib/discos";
import { getStats, getContactMessages } from "../../lib/store";
import { getArticle } from "../../lib/articles";
import { getAllPosts, deletePost, getPost, savePost } from "../../lib/posts";
import { buildPost, slugify } from "../../lib/publishPost";
import { AUTHORS, DEFAULT_AUTHOR } from "../../lib/authors";
import { getDrafts, getDraft, deleteDraft, getRunLog } from "../../lib/drafts";
import { agentStatus, runContentAgent } from "../../lib/contentAgent";
import { SMTP_KEYS, SECRET_KEYS, getSettings, saveSettings, maskSecret } from "../../lib/siteSettings";
import { mailConfig, sendMail } from "../../lib/mailer";
import { ADJ_KEYS } from "../../lib/adjustmentOverrides";
import { MONTHLY_FCA, qtaHistory } from "../../lib/adjustments";
import RecentChecks from "./RecentChecks";

export const dynamic = "force-dynamic";
// "Write a post now" runs the content agent in the background of this route,
// so it needs the same time budget as the cron.
export const maxDuration = 300;

export const metadata = {
  title: "Admin | eBill Pakistan",
  robots: { index: false, follow: false },
};

// Passcode lives in an env var; the literal is only a local-dev fallback.
// SET ADMIN_PASSCODE in production so the code is not relied on from the repo.
const PASSCODE = process.env.ADMIN_PASSCODE || "524862";
const COOKIE = "ebp_admin";
const sessionToken = () =>
  crypto.createHash("sha256").update(`ebp-admin:${PASSCODE}`).digest("hex");

async function isAuthed() {
  const c = await cookies();
  return c.get(COOKIE)?.value === sessionToken();
}

async function login(formData) {
  "use server";
  const code = String(formData.get("passcode") || "").trim();
  if (code !== PASSCODE) redirect("/admin?e=1");
  const c = await cookies();
  c.set(COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

async function logout() {
  "use server";
  const c = await cookies();
  c.delete(COOKIE);
  redirect("/admin");
}

// Unpublish an API-published post. Server actions are reachable endpoints in
// their own right, so auth is re-checked here, not just at page render.
async function unpublish(formData) {
  "use server";
  if (!(await isAuthed())) redirect("/admin");
  const slug = String(formData.get("slug") || "");
  // Static articles live in code and can't be unpublished from here.
  if (slug && !getArticle(slug)) {
    await deletePost(slug);
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");
  }
  redirect("/admin?tab=posts");
}

// Publish a post from the dashboard.
//
// This writes through lib/publishPost.js, the same validator POST /api/posts
// uses, so a post created here is byte-identical in shape to one published by an
// integration. No bearer token is involved: the admin session is the auth
// boundary, and it is re-checked here because a server action is a reachable
// endpoint in its own right.
async function publish(formData) {
  "use server";
  if (!(await isAuthed())) redirect("/admin");

  const get = (k) => String(formData.get(k) || "").trim();
  const title = get("title");
  const slug = get("slug") || slugify(title);

  const { errors, post } = buildPost({
    title,
    slug,
    metaTitle: get("metaTitle"),
    metaDescription: get("metaDescription"),
    content: get("content"),
    excerpt: get("excerpt"),
    tags: get("tags"),
    faqs: get("faqs"),
    author: get("author") || DEFAULT_AUTHOR,
    publishedAt: get("publishedAt"),
    updatedAt: get("updatedAt"),
  });

  if (errors.length) {
    redirect(`/admin?tab=posts&err=${encodeURIComponent(errors.join(" · "))}`);
  }

  // A static article in lib/articles.js always wins in getPost(), so publishing
  // over one would create a post that silently never renders. Refuse it.
  if (getArticle(post.slug)) {
    redirect(`/admin?tab=posts&err=${encodeURIComponent(`"${post.slug}" is a static article in lib/articles.js — edit it in the repo, not here.`)}`);
  }

  const existing = await getPost(post.slug);
  if (existing && get("overwrite") !== "yes") {
    redirect(`/admin?tab=posts&err=${encodeURIComponent(`A post with slug "${post.slug}" already exists. Tick "replace existing" to overwrite it.`)}`);
  }

  try {
    await savePost(post);
  } catch {
    redirect(`/admin?tab=posts&err=${encodeURIComponent("Could not write to the post store. Check the KV credentials and try again.")}`);
  }

  // A draft published from the edit form leaves the review queue.
  const fromDraft = get("fromDraft");
  if (fromDraft) await deleteDraft(fromDraft);

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath(`/author/${post.author}`);
  revalidatePath("/sitemap.xml");
  redirect(`/admin?tab=posts&msg=${encodeURIComponent(`${existing ? "Replaced" : "Published"} /blog/${post.slug}`)}`);
}

// Publish a draft from the review queue as it stands.
async function publishDraft(formData) {
  "use server";
  if (!(await isAuthed())) redirect("/admin");
  const slug = String(formData.get("slug") || "");
  const draft = slug ? await getDraft(slug) : null;
  if (!draft) redirect(`/admin?tab=posts&err=${encodeURIComponent("That draft no longer exists.")}`);
  if (getArticle(draft.slug) || (await getPost(draft.slug))) {
    redirect(`/admin?tab=posts&err=${encodeURIComponent(`A post with slug "${draft.slug}" already exists. Open the draft, change its slug, then publish.`)}`);
  }
  // Only the post fields go to the store; the research brief stays behind.
  const { brief, sources, topic, cost, words, model, trigger, generatedAt, ...post } = draft;
  const today = new Date().toISOString().slice(0, 10);
  try {
    await savePost({ ...post, publishedDate: today, lastUpdated: today, agent: { generatedAt, model, topic, words, cost, sources } });
    await deleteDraft(slug);
  } catch {
    redirect(`/admin?tab=posts&err=${encodeURIComponent("Could not write to the post store. Check the KV credentials and try again.")}`);
  }
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath(`/author/${post.author}`);
  revalidatePath("/sitemap.xml");
  redirect(`/admin?tab=posts&msg=${encodeURIComponent(`Published /blog/${post.slug}`)}`);
}

async function discardDraft(formData) {
  "use server";
  if (!(await isAuthed())) redirect("/admin");
  const slug = String(formData.get("slug") || "");
  if (slug) await deleteDraft(slug);
  redirect(`/admin?tab=posts&msg=${encodeURIComponent("Draft discarded.")}`);
}

// Save the SMTP and notification settings. Blank secret fields keep the saved
// value; the "clear" box removes it.
async function saveSmtp(formData) {
  "use server";
  if (!(await isAuthed())) redirect("/admin");
  const values = {};
  for (const k of SMTP_KEYS) {
    const v = String(formData.get(k) || "").trim();
    if (SECRET_KEYS.has(k)) {
      if (formData.get(`${k}__clear`) === "yes") values[k] = "";
      else if (v) values[k] = v;
      continue;
    }
    if (k.startsWith("NOTIFY_ON_")) values[k] = formData.get(k) ? "yes" : "no";
    else values[k] = v;
  }
  if (values.SMTP_PORT && !/^\d{2,5}$/.test(values.SMTP_PORT)) {
    redirect(`/admin?tab=settings&err=${encodeURIComponent("The port must be a number, usually 465 or 587.")}`);
  }
  try {
    await saveSettings(values);
  } catch {
    redirect(`/admin?tab=settings&err=${encodeURIComponent("Could not save. Check the KV credentials and try again.")}`);
  }
  redirect(`/admin?tab=settings&msg=${encodeURIComponent("Settings saved.")}`);
}

// This month's FCA and the current QTA, entered when NEPRA announces them.
async function saveAdjustments(formData) {
  "use server";
  if (!(await isAuthed())) redirect("/admin");
  const values = {};
  for (const k of ADJ_KEYS) values[k] = String(formData.get(k) || "").trim();
  const bad = (m) => redirect(`/admin?tab=settings&err=${encodeURIComponent(m)}`);
  if (values.FCA_RATE && !/^[-+]?\d*\.?\d+$/.test(values.FCA_RATE)) bad("The FCA rate must be a number such as 1.1086 or -0.5.");
  if (values.FCA_RATE && !/^\d{4}-\d{2}$/.test(values.FCA_BILLING_MONTH)) bad("The FCA billing month must look like 2026-11.");
  if (values.QTA_RATE && !/^[-+]?\d*\.?\d+$/.test(values.QTA_RATE)) bad("The QTA rate must be a number such as 0.5194.");
  if (values.QTA_RATE && !(/^\d{4}-\d{2}-\d{2}$/.test(values.QTA_FROM) && /^\d{4}-\d{2}-\d{2}$/.test(values.QTA_TO))) bad("The QTA dates must look like 2026-12-01.");
  try {
    await saveSettings(values);
  } catch {
    bad("Could not save. Check the KV credentials and try again.");
  }
  for (const path of ["/this-month", "/bill-calculator", "/"]) revalidatePath(path);
  for (const code of Object.keys(DISCOS)) revalidatePath(`/${code}-bill-check`);
  redirect(`/admin?tab=settings&msg=${encodeURIComponent("Adjustments saved. The company pages, tracker and calculator now show them.")}`);
}

async function sendTestMail() {
  "use server";
  if (!(await isAuthed())) redirect("/admin");
  const cfg = await mailConfig();
  const r = await sendMail({
    subject: "Test from eBill Pakistan admin",
    text: `This is a test message from the eBill Pakistan admin. SMTP is working.\n\nServer: ${cfg.host}:${cfg.port}\nFrom: ${cfg.from}\nTo: ${cfg.to}`,
    html: `<p>This is a test message from the eBill Pakistan admin. SMTP is working.</p><p style="color:#88998f;font-size:13px">Server ${cfg.host}:${cfg.port}, from ${cfg.from}, to ${cfg.to}</p>`,
  }, cfg);
  if (r.ok) redirect(`/admin?tab=settings&msg=${encodeURIComponent(`Test email sent to ${cfg.to}. Check the inbox (and spam).`)}`);
  redirect(`/admin?tab=settings&err=${encodeURIComponent(`Could not send: ${r.error}`)}`);
}

// Start a content run now. It carries on after this response is sent (up to
// maxDuration), so the page comes back at once; the log shows the result.
async function runAgent() {
  "use server";
  if (!(await isAuthed())) redirect("/admin");
  after(() => runContentAgent({ trigger: "manual", force: true }));
  redirect(`/admin?tab=posts&msg=${encodeURIComponent("Writing a post now. Research and writing take two to five minutes; refresh this page to see it appear under drafts.")}`);
}

const TABS = ["overview", "companies", "cities", "days", "recent", "posts", "messages", "settings"];

export default async function AdminPage({ searchParams }) {
  const sp = await searchParams;
  if (!(await isAuthed())) {
    return <Login error={sp?.e === "1"} />;
  }
  const tab = TABS.includes(sp?.tab) ? sp.tab : "overview";
  const page = Math.max(1, parseInt(sp?.page, 10) || 1);
  // The posts page doesn't need analytics, and vice versa.
  const editSlug = tab === "posts" ? String(sp?.edit || "") : "";
  const draftSlug = tab === "posts" ? String(sp?.draft || "") : "";
  const [stats, posts, editingPost, editingDraft, drafts, agent, runLog, settings, messages] = await Promise.all([
    tab === "posts" || tab === "settings" || tab === "messages" ? null : getStats(),
    tab === "posts" ? getAllPosts() : null,
    editSlug ? getPost(editSlug) : null,
    draftSlug ? getDraft(draftSlug) : null,
    tab === "posts" ? getDrafts() : [],
    tab === "posts" ? agentStatus() : null,
    tab === "posts" ? getRunLog(12) : [],
    tab === "settings" ? getSettings([...SMTP_KEYS, ...ADJ_KEYS]) : null,
    tab === "messages" ? getContactMessages(100) : null,
  ]);
  const editing = editingDraft ? { ...editingDraft, fromDraft: editingDraft.slug } : editingPost;
  return <Dashboard tab={tab} stats={stats} posts={posts} page={page} msg={sp?.msg} err={sp?.err} editing={editing} drafts={drafts} agent={agent} runLog={runLog} settings={settings} messages={messages} />;
}

/* ---------------- login ---------------- */
function Login({ error }) {
  return (
    <div className="admin-page">
      <div className="adm adm-login">
        <div className="card">
          <div className="adm-login-brand"><span className="adm-brand-dot" /> eBill Pakistan</div>
          <h1>Admin access</h1>
          <p className="muted">Enter the passcode to open the dashboard.</p>
          <form action={login}>
            <input
              name="passcode" type="password" inputMode="numeric" autoComplete="off"
              placeholder="Passcode" autoFocus required className="adm-input"
            />
            {error && <span className="adm-err">Incorrect passcode. Try again.</span>}
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Unlock dashboard</button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------------- sidebar icons (16px, stroke = currentColor) ---------------- */
function Ic({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
const ICONS = {
  overview: <Ic><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Ic>,
  companies: <Ic><path d="M3 21h18" /><path d="M7 17.5v-6M12 17.5V6.5M17 17.5v-3.5" /></Ic>,
  cities: <Ic><path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z" /><circle cx="12" cy="11" r="2.2" /></Ic>,
  days: <Ic><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 11h16" /></Ic>,
  recent: <Ic><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Ic>,
  posts: <Ic><path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" /><path d="M14 3v4h4M9.5 12h5M9.5 16h5" /></Ic>,
  messages: <Ic><path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" /><path d="M3.5 6.5 12 13l8.5-6.5" /></Ic>,
  settings: <Ic><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></Ic>,
  external: <Ic><path d="M14 5h5v5M19 5l-8 8" /><path d="M19 14v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></Ic>,
};

const NAV = [
  ["overview", "Overview"],
  ["companies", "By company"],
  ["cities", "Top cities"],
  ["days", "Last 14 days"],
  ["recent", "Recent checks"],
  ["posts", "Blog posts"],
  ["messages", "Messages"],
  ["settings", "Settings"],
];

const TAB_TITLES = {
  overview: ["Overview", "Key numbers at a glance · times in PKT"],
  companies: ["Checks by company", "Bill checks per DISCO, all time"],
  cities: ["Top cities", "Where bill checks come from"],
  days: ["Last 14 days", "Daily bill-check volume"],
  recent: ["Recent checks", "The latest individual bill lookups"],
  posts: ["Blog posts", "Everything published on /blog"],
  messages: ["Messages", "Everything sent through the contact form, newest first"],
  settings: ["Settings", "Email alerts, and this month's bill adjustments"],
};

/* ---------------- dashboard ---------------- */
const discoLabel = (code) => (DISCOS[code] ? DISCOS[code][0] : code === "auto" ? "Auto-detect" : code);

function sortedRows(obj, labeller = (k) => k) {
  return Object.entries(obj || {})
    .map(([k, count]) => ({ key: k, label: labeller(k), count }))
    .sort((a, b) => b.count - a.count);
}

function Bars({ rows, total, limit = 8 }) {
  if (!rows.length) return <p className="adm-empty">No data yet.</p>;
  const shown = rows.slice(0, limit);
  const max = Math.max(...shown.map((r) => r.count), 1);
  return (
    <div className="adm-bars">
      {shown.map((r) => (
        <div className="adm-row" key={r.key} title={`${r.label}: ${r.count}`}>
          <span className="k">{r.label}</span>
          <span className="adm-track"><span className="adm-fill" style={{ width: `${(r.count / max) * 100}%` }} /></span>
          <span className="v">{r.count}{total ? ` · ${Math.round((r.count / total) * 100)}%` : ""}</span>
        </div>
      ))}
    </div>
  );
}

function Dashboard({ tab, stats, posts, page, msg, err, editing, drafts, agent, runLog, settings, messages }) {
  const configured = stats ? stats.configured : true;
  const [title, subtitle] = TAB_TITLES[tab];

  return (
    <div className="admin-page">
      <div className="adm">
        <div className="adm-layout">
          <aside className="adm-side" aria-label="Dashboard sections">
            <div className="adm-brand"><span className="adm-brand-dot" /> eBill Admin</div>
            <span className="adm-nav-title">Dashboard</span>
            {NAV.map(([key, label]) => (
              <a key={key} href={`/admin?tab=${key}`} className={tab === key ? "active" : undefined}
                aria-current={tab === key ? "page" : undefined}>
                {ICONS[key]}{label}
              </a>
            ))}
            <span className="adm-nav-title">Site</span>
            <a href="/" target="_blank" rel="noreferrer">{ICONS.external}Open homepage</a>
            <a href="/blog" target="_blank" rel="noreferrer">{ICONS.external}Open blog</a>
            <form action={logout} className="adm-side-logout">
              <button type="submit">Log out</button>
            </form>
          </aside>

          <div className="adm-main">
            <div className="adm-top">
              <div>
                <h1>{title}</h1>
                <p>{subtitle}</p>
              </div>
              {stats && (
                <span className={configured ? "adm-live" : "adm-live adm-live-dev"}>
                  <span className="dot" />
                  {configured ? "Live · KV connected" : "Dev · in-memory data"}
                </span>
              )}
            </div>

            {stats && !configured && (
              <div className="adm-note">
                <strong>Dev mode:</strong> no Redis/KV detected, so counts are in-memory and reset on restart.
                In production (Upstash/Vercel KV) they persist.
              </div>
            )}

            {tab === "overview" && <OverviewTab stats={stats} />}
            {tab === "companies" && (
              <div className="adm-panel">
                <h2>Checks by company</h2>
                <Bars rows={sortedRows(stats.byDisco, discoLabel)} total={stats.total} limit={12} />
              </div>
            )}
            {tab === "cities" && (
              <div className="adm-panel">
                <h2>Top cities</h2>
                <Bars rows={sortedRows(stats.byCity)} total={stats.total} limit={20} />
              </div>
            )}
            {tab === "days" && <DaysTab byDay={stats.byDay} />}
            {tab === "recent" && (
              <div className="adm-panel">
                <h2>Recent checks</h2>
                <RecentChecks events={stats.recent || []} />
              </div>
            )}
            {tab === "posts" && <PostsTab posts={posts} page={page} msg={msg} err={err} editing={editing} drafts={drafts} agent={agent} runLog={runLog} />}
            {tab === "settings" && <SettingsTab settings={settings} msg={msg} err={err} />}
            {tab === "messages" && <MessagesTab messages={messages || []} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ stats }) {
  const { total, uniqueVisitors, byDisco, byDay, byCity } = stats;
  const today = new Date().toISOString().slice(0, 10);
  const cityRows = sortedRows(byCity);
  const topCity = cityRows[0]?.label || "—";

  return (
    <>
      <div className="adm-stats">
        <Stat num={total} lbl="Total bill checks" />
        <Stat num={uniqueVisitors} lbl="Unique visitors" />
        <Stat num={byDay?.[today] || 0} lbl="Checks today" />
        <Stat num={Object.keys(byCity || {}).length} lbl="Cities" />
        <Stat num={topCity} lbl="Top city" small />
      </div>
      <div className="adm-cols">
        <div className="adm-panel">
          <h2>Top companies <a className="adm-more" href="/admin?tab=companies">View all →</a></h2>
          <Bars rows={sortedRows(byDisco, discoLabel)} total={total} limit={5} />
        </div>
        <div className="adm-panel">
          <h2>Top cities <a className="adm-more" href="/admin?tab=cities">View all →</a></h2>
          <Bars rows={cityRows} total={total} limit={5} />
        </div>
      </div>
    </>
  );
}

function DaysTab({ byDay }) {
  const days = Object.entries(byDay || {}).sort((a, b) => a[0].localeCompare(b[0])).slice(-14);
  const dayMax = Math.max(...days.map(([, n]) => n), 1);
  return (
    <div className="adm-panel">
      <h2>Last 14 days</h2>
      {days.length ? (
        <div className="adm-days">
          {days.map(([d, n]) => (
            <div className="adm-day" key={d} title={`${d}: ${n} checks`}>
              {n === dayMax && <span className="n">{n}</span>}
              <span className="bar" style={{ height: `${(n / dayMax) * 96}px` }} />
              <span className="d">{d.slice(5)}</span>
            </div>
          ))}
        </div>
      ) : <p className="adm-empty">No data yet.</p>}
    </div>
  );
}

const POSTS_PAGE_SIZE = 10;

// One post's editable fields, rendered from `editing` when present. Uncontrolled
// inputs with defaultValue: this is a server component, so the form is plain
// HTML posting to a server action — no client JS, no hydration.
function PostForm({ editing }) {
  const e = editing || null;
  // Prefer the original input the author typed. Posts published before
  // contentSource existed only have rendered HTML, so those are edited as HTML
  // rather than pushed back through the Markdown converter, which would mangle
  // them.
  const body = e ? (e.contentSource ?? e.content ?? "") : "";
  const fmt = e ? (e.contentFormat || (e.contentSource ? "markdown" : "html")) : "markdown";
  const faqText = (e?.faqs || []).map(([q, a]) => `${q} :: ${a}`).join("\n");

  return (
    <details className="adm-panel adm-newpost" open={!!e}>
      <summary>
        <b>{e ? (e.fromDraft ? `Review draft: ${e.slug}` : `Edit: ${e.slug}`) : "New post"}</b>
        <span>{e ? (e.fromDraft ? "check it, change anything, then publish" : "editing an existing post") : "write a post and publish it straight to the blog"}</span>
      </summary>

      <form action={publish} className="adm-form">
        {e && !e.fromDraft && <input type="hidden" name="overwrite" value="yes" />}
        {e && <input type="hidden" name="contentFormat" value={fmt} />}
        {e?.fromDraft && <input type="hidden" name="fromDraft" value={e.fromDraft} />}

        <label>
          <span>Title <em>required</em></span>
          <input name="title" defaultValue={e?.title || ""} required maxLength={200} />
        </label>

        <label>
          <span>Slug <em>{e && !e.fromDraft ? "changing this creates a new post" : "leave blank to generate from the title"}</em></span>
          <input name="slug" defaultValue={e?.slug || ""} pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100}
            placeholder="lowercase-with-hyphens" readOnly={!!e && !e.fromDraft} />
        </label>

        <label>
          <span>Meta title <em>optional, ≤70 chars — defaults to the title</em></span>
          <input name="metaTitle" defaultValue={e?.metaTitle || ""} maxLength={70} />
        </label>

        <label>
          <span>Meta description <em>required, ≤160 chars</em></span>
          <textarea name="metaDescription" defaultValue={e?.metaDescription || ""} required maxLength={160} rows={2} />
        </label>

        <div className="adm-form-row">
          <label>
            <span>Author</span>
            <select name="author" defaultValue={e?.author || DEFAULT_AUTHOR}>
              {Object.values(AUTHORS).map((a) => (
                <option key={a.slug} value={a.slug}>{a.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Published</span>
            <input type="date" name="publishedAt" defaultValue={e?.publishedDate || ""} />
          </label>
          <label>
            <span>Last updated</span>
            <input type="date" name="updatedAt" defaultValue={e?.lastUpdated || ""} />
          </label>
        </div>

        <label>
          <span>Tags <em>optional, comma separated</em></span>
          <input name="tags" defaultValue={(e?.tags || []).join(", ")} />
        </label>

        <label>
          <span>
            Body <em>{fmt === "html" ? "HTML — this post predates source tracking, so it is edited as HTML" : "Markdown"}</em>
          </span>
          <textarea name="content" defaultValue={body} required rows={18} spellCheck="true"
            placeholder={"## A heading\n\nA paragraph with **bold** and a [link](/electricity-tariff)."} />
        </label>

        <label>
          <span>FAQs <em>optional, max 8 — one per line as “Question :: Answer”</em></span>
          <textarea name="faqs" defaultValue={faqText} rows={4}
            placeholder={"Is this thing on? :: Yes, it is."} />
        </label>

        <label>
          <span>Excerpt <em>optional</em></span>
          <textarea name="excerpt" defaultValue={e?.excerpt || ""} rows={2} />
        </label>

        <div className="adm-form-actions">
          <button type="submit" className="btn btn-primary">{e && !e.fromDraft ? "Save changes" : "Publish post"}</button>
          {e && <a className="btn btn-ghost" href="/admin?tab=posts">Cancel</a>}
          <span className="adm-form-note">
            Publishes to the live blog immediately and revalidates /blog, the post, the author page and the sitemap.
          </span>
        </div>
      </form>
    </details>
  );
}

const fmtWhen = (iso) =>
  iso ? new Date(iso).toLocaleString("en-GB", { timeZone: "Asia/Karachi", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

function AgentPanel({ agent, runLog, draftCount }) {
  const live = agent.state?.status === "running" && Date.now() - Date.parse(agent.state.startedAt) < 6 * 60 * 1000;
  const pill = !agent.configured
    ? ["adm-chip", "Not set up"]
    : live
      ? ["adm-chip adm-chip-live", `Running: ${agent.state.stage === "write" ? "writing" : "researching"}`]
      : ["adm-chip adm-chip-api", "Ready"];
  return (
    <div className="adm-panel">
      <h2>
        Content agent <span className={pill[0]}>{pill[1]}</span>
        <span className="adm-more">{agent.model} · {agent.autoPublish ? "publishes automatically" : "drafts wait for your approval"}</span>
      </h2>
      <p className="adm-agent-blurb">
        Once a day it researches one topic the site does not cover yet, using live web search over NEPRA, the DISCOs and the
        national press, then writes a sourced guide. {agent.autoPublish
          ? "Each post is published to the blog as soon as it is written; it appears in the list below and can be edited or deleted there like any other post."
          : "Each draft sits below until you publish it, so nothing goes live without a person reading it."}
      </p>
      {!agent.configured && (
        <div className="adm-note">
          <strong>Add the API key:</strong> set <code>ANTHROPIC_API_KEY</code> in the Vercel project environment variables and redeploy.
          The daily run also needs <code>CRON_SECRET</code> set, or Vercel's cron is refused.
        </div>
      )}
      {agent.configured && !agent.cronSecret && (
        <div className="adm-note">
          <strong>Daily run is off:</strong> set <code>CRON_SECRET</code> in Vercel so the scheduled run is accepted. Manual runs work without it.
        </div>
      )}
      {agent.state?.status === "failed" && (
        <div className="adm-banner adm-banner-err">
          Last run failed: {agent.state.error}
          {/workspace/i.test(agent.state.error || "") && (
            <> Fix: create the API key inside a workspace in the Anthropic console, or add <code>ANTHROPIC_WORKSPACE_ID</code> to the Vercel environment variables.</>
          )}
          {agent.state.brief ? " The research is saved; run again to finish the article without paying for the research twice." : ""}
        </div>
      )}
      <div className="adm-form-actions">
        <form action={runAgent}>
          <button type="submit" className="btn btn-primary" disabled={!agent.configured || live}>
            {live ? "Running" : "Write a post now"}
          </button>
        </form>
        <span className="adm-form-note">
          {draftCount ? `${draftCount} draft${draftCount === 1 ? "" : "s"} waiting below. ` : ""}
          Takes three to five minutes and costs about one US dollar a post.
        </span>
      </div>
      {runLog.length > 0 && (
        <div className="adm-table-wrap" style={{ marginTop: 14 }}>
          <table className="adm-table">
            <thead><tr><th>When (PKT)</th><th>Result</th><th>Post</th><th>Words</th><th>Cost</th></tr></thead>
            <tbody>
              {runLog.map((r, i) => (
                <tr key={i}>
                  <td>{fmtWhen(r.at)} <span className="adm-static-note">{r.trigger}</span></td>
                  <td>
                    <span className={r.status === "failed" ? "adm-chip adm-chip-err" : r.status === "skipped" || r.status === "researched" ? "adm-chip" : "adm-chip adm-chip-api"}>{r.status}</span>
                    {r.error && <div className="adm-run-err">{r.error}</div>}
                  </td>
                  <td>{r.slug ? <code>{r.slug}</code> : r.topic ? <span className="adm-static-note">{r.topic.slice(0, 80)}</span> : "—"}</td>
                  <td>{r.words || "—"}</td>
                  <td>{r.cost ? `$${r.cost.usd}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DraftsPanel({ drafts }) {
  if (!drafts.length) return null;
  return (
    <div className="adm-panel">
      <h2>Drafts waiting for review <span className="adm-count">{drafts.length}</span></h2>
      {drafts.map((d) => (
        <details key={d.slug} className="adm-draft">
          <summary>
            <b>{d.title}</b>
            <span>{d.words} words · {d.sources?.length || 0} sources · written {fmtWhen(d.generatedAt)}{d.cost ? ` · $${d.cost.usd}` : ""}</span>
          </summary>
          <p className="adm-draft-meta"><strong>Slug:</strong> <code>{d.slug}</code> &nbsp; <strong>Meta description:</strong> {d.metaDescription}</p>
          <p className="adm-draft-meta"><strong>Why this topic:</strong> {(d.brief?.match(/WHY NOW \/ WHY THIS:\s*([\s\S]*?)\n[A-Z ]+:/) || [])[1]?.trim() || d.topic}</p>
          <div className="adm-draft-body prose" dangerouslySetInnerHTML={{ __html: d.content }} />
          {d.faqs?.length > 0 && (
            <div className="adm-draft-faqs">
              <strong>FAQs</strong>
              <ul>{d.faqs.map(([q, a], i) => <li key={i}><b>{q}</b> {a}</li>)}</ul>
            </div>
          )}
          <div className="adm-form-actions">
            <form action={publishDraft}>
              <input type="hidden" name="slug" value={d.slug} />
              <button type="submit" className="btn btn-primary">Publish as is</button>
            </form>
            <a className="btn btn-ghost" href={`/admin?tab=posts&draft=${encodeURIComponent(d.slug)}#edit`}>Edit before publishing</a>
            <form action={discardDraft}>
              <input type="hidden" name="slug" value={d.slug} />
              <button type="submit" className="adm-unpub" title="Deletes the draft. It is not recoverable.">Discard</button>
            </form>
          </div>
        </details>
      ))}
    </div>
  );
}

function PostsTab({ posts, page, msg, err, editing, drafts = [], agent, runLog = [] }) {
  // Newest first; 10 per page, navigated via ?tab=posts&page=N (server-rendered).
  const sorted = [...posts].sort((a, b) =>
    String(b.publishedDate).localeCompare(String(a.publishedDate)));
  const totalPages = Math.max(1, Math.ceil(sorted.length / POSTS_PAGE_SIZE));
  const p = Math.min(page, totalPages);
  const pageRows = sorted.slice((p - 1) * POSTS_PAGE_SIZE, p * POSTS_PAGE_SIZE);
  const apiCount = posts.filter((x) => x.source === "api").length;

  return (
    <>
      {msg && <div className="adm-banner adm-banner-ok">{msg}</div>}
      {err && <div className="adm-banner adm-banner-err">{err}</div>}

      {agent && <AgentPanel agent={agent} runLog={runLog} draftCount={drafts.length} />}
      <DraftsPanel drafts={drafts} />

      <div id="edit"><PostForm editing={editing} /></div>

      <div className="adm-panel">
        <h2>
          Blog posts <span className="adm-count">{posts.length}</span>
          <span className="adm-more">{apiCount} editable · {posts.length - apiCount} in code</span>
        </h2>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Title</th><th>Slug</th><th>Published</th><th>Updated</th><th>Source</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {pageRows.map((post) => (
                <tr key={post.slug}>
                  <td><a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">{post.title}</a></td>
                  <td><code>{post.slug}</code></td>
                  <td>{post.publishedDate}</td>
                  <td>{post.lastUpdated || "—"}</td>
                  <td>
                    <span className={post.source === "api" ? "adm-chip adm-chip-api" : "adm-chip"}>
                      {post.source === "api" ? "KV" : "Static"}
                    </span>
                  </td>
                  <td>
                    {post.source === "api" ? (
                      <div className="adm-actions">
                        <a className="adm-edit" href={`/admin?tab=posts&edit=${encodeURIComponent(post.slug)}`}>Edit</a>
                        <form action={unpublish}>
                          <input type="hidden" name="slug" value={post.slug} />
                          <button type="submit" className="adm-unpub"
                            title="Removes the post from the blog. The content is not recoverable from here — copy it first if you may want it back.">
                            Delete
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span className="adm-static-note" title="Static articles live in lib/articles.js and are edited in the repo">in code</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="adm-pagination">
            {p > 1
              ? <a className="btn btn-ghost" href={`/admin?tab=posts&page=${p - 1}`}>← Prev</a>
              : <span className="btn btn-ghost adm-btn-off">← Prev</span>}
            <span className="adm-page-info">Page {p} of {totalPages} &nbsp;·&nbsp; {sorted.length} posts</span>
            {p < totalPages
              ? <a className="btn btn-ghost" href={`/admin?tab=posts&page=${p + 1}`}>Next →</a>
              : <span className="btn btn-ghost adm-btn-off">Next →</span>}
          </div>
        )}
      </div>
    </>
  );
}

function MessagesTab({ messages }) {
  return (
    <div className="adm-panel">
      <h2>Contact form messages <span className="adm-count">{messages.length}</span></h2>
      {!messages.length ? (
        <p className="adm-empty">No messages yet. Every submission is stored here even when email is not set up.</p>
      ) : (
        <div className="adm-messages">
          {messages.map((m, i) => (
            <article key={i} className="adm-message">
              <header>
                <b>{m.name}</b>
                <a href={`mailto:${m.email}`}>{m.email}</a>
                <span className="adm-chip">{m.subject}</span>
                <span className="adm-static-note">{fmtWhen(new Date(m.t).toISOString())}</span>
              </header>
              <p>{m.message}</p>
              <a className="adm-edit" href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject} (eBill Pakistan)`)}`}>Reply</a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const SOURCE_LABEL = { saved: "saved here", env: "from the server environment", default: "default", none: "not set" };

function SettingsTab({ settings, msg, err }) {
  const v = (k) => settings[k]?.value || "";
  const src = (k) => SOURCE_LABEL[settings[k]?.source || "none"];
  const configured = !!(v("SMTP_HOST") && v("SMTP_USER") && v("SMTP_PASS"));
  const hasPass = !!v("SMTP_PASS");
  return (
    <>
      {msg && <div className="adm-banner adm-banner-ok">{msg}</div>}
      {err && <div className="adm-banner adm-banner-err">{err}</div>}

      <div className="adm-panel">
        <h2>
          Email notifications{" "}
          <span className={configured ? "adm-chip adm-chip-api" : "adm-chip"}>{configured ? "Set up" : "Not set up"}</span>
        </h2>
        <p className="adm-agent-blurb">
          Contact form messages and content agent alerts are sent through this connection. For Gmail, leave the server and
          port as they are, put your Gmail address as the username, and use an app password, not your normal
          password: Google Account, Security, 2-Step Verification, App passwords.
        </p>

        <form action={saveSmtp} className="adm-form">
          <div className="adm-form-row">
            <label>
              <span>SMTP server <em>{src("SMTP_HOST")}</em></span>
              <input name="SMTP_HOST" defaultValue={v("SMTP_HOST")} placeholder="smtp.gmail.com" autoComplete="off" />
            </label>
            <label>
              <span>Port <em>465 for SSL, 587 for STARTTLS</em></span>
              <input name="SMTP_PORT" defaultValue={v("SMTP_PORT")} placeholder="465" inputMode="numeric" autoComplete="off" />
            </label>
            <label>
              <span>Username <em>your Gmail address</em></span>
              <input name="SMTP_USER" defaultValue={v("SMTP_USER")} placeholder="you@gmail.com" autoComplete="off" />
            </label>
          </div>

          <label>
            <span>App password <em>{hasPass ? `saved as ${maskSecret(v("SMTP_PASS"))} (${src("SMTP_PASS")}); leave blank to keep it` : "16 characters from Google, spaces are fine"}</em></span>
            <input name="SMTP_PASS" type="password" placeholder={hasPass ? "Leave blank to keep the saved password" : "abcd efgh ijkl mnop"} autoComplete="new-password" />
          </label>
          {hasPass && settings.SMTP_PASS.source === "saved" && (
            <label className="adm-check">
              <input type="checkbox" name="SMTP_PASS__clear" value="yes" /> Remove the saved password
            </label>
          )}

          <div className="adm-form-row">
            <label>
              <span>Send from <em>optional, defaults to the username</em></span>
              <input name="SMTP_FROM" defaultValue={v("SMTP_FROM")} placeholder="you@gmail.com" autoComplete="off" />
            </label>
            <label>
              <span>Send alerts to <em>defaults to the username</em></span>
              <input name="NOTIFY_TO" defaultValue={v("NOTIFY_TO")} placeholder="you@gmail.com" autoComplete="off" />
            </label>
          </div>

          <div className="adm-checks">
            <label className="adm-check">
              <input type="checkbox" name="NOTIFY_ON_PUBLISH" defaultChecked={/^(1|true|yes|on)$/i.test(v("NOTIFY_ON_PUBLISH"))} />
              Email me when a post is published
            </label>
            <label className="adm-check">
              <input type="checkbox" name="NOTIFY_ON_FAILURE" defaultChecked={/^(1|true|yes|on)$/i.test(v("NOTIFY_ON_FAILURE"))} />
              Email me when a run fails
            </label>
          </div>
          <p className="adm-static-note">Contact form messages are always emailed when SMTP is set up, and always kept under Messages.</p>

          <div className="adm-form-actions">
            <button type="submit" className="btn btn-primary">Save settings</button>
            <span className="adm-form-note">Saved values take effect at once. A blank field goes back to the server environment, if that has a value.</span>
          </div>
        </form>

        <form action={sendTestMail} className="adm-form-actions" style={{ marginTop: 14 }}>
          <button type="submit" className="btn btn-ghost" disabled={!configured}>Send a test email</button>
          <span className="adm-form-note">Uses the saved settings. Save first if you have changed anything.</span>
        </form>
      </div>

      <div className="adm-panel">
        <h2>This month&apos;s bill adjustments</h2>
        <p className="adm-agent-blurb">
          When NEPRA announces a new fuel cost adjustment or quarterly adjustment, enter it here and every company page, the
          tracker and the calculator show it within the hour. Leave a field blank to use the figures in the code.
          Latest in the code: FCA {MONTHLY_FCA[0].perUnit > 0 ? "+" : ""}{MONTHLY_FCA[0].perUnit} per unit on {MONTHLY_FCA[0].billingMonth} bills;
          QTA {qtaHistory()[0].perUnit > 0 ? "+" : ""}{qtaHistory()[0].perUnit} per unit for {qtaHistory()[0].monthsLabel}.
        </p>
        <form action={saveAdjustments} className="adm-form">
          <div className="adm-form-row">
            <label><span>FCA per unit <em>e.g. 1.1086, or -0.5 for a refund</em></span><input name="FCA_RATE" defaultValue={v("FCA_RATE")} inputMode="decimal" autoComplete="off" /></label>
            <label><span>Billing month <em>YYYY-MM, the bills it appears on</em></span><input name="FCA_BILLING_MONTH" defaultValue={v("FCA_BILLING_MONTH")} placeholder="2026-11" autoComplete="off" /></label>
            <label><span>Units of <em>YYYY-MM, usually two months earlier</em></span><input name="FCA_CONSUMPTION_MONTH" defaultValue={v("FCA_CONSUMPTION_MONTH")} placeholder="2026-09" autoComplete="off" /></label>
          </div>
          <div className="adm-form-row">
            <label><span>FCA source link</span><input name="FCA_SOURCE_URL" defaultValue={v("FCA_SOURCE_URL")} placeholder="https://www.dawn.com/news/..." autoComplete="off" /></label>
            <label><span>FCA source title</span><input name="FCA_SOURCE_TITLE" defaultValue={v("FCA_SOURCE_TITLE")} placeholder="Dawn, 8 November 2026" autoComplete="off" /></label>
          </div>
          <div className="adm-form-row">
            <label><span>QTA per unit <em>e.g. 0.5194</em></span><input name="QTA_RATE" defaultValue={v("QTA_RATE")} inputMode="decimal" autoComplete="off" /></label>
            <label><span>Applies from <em>YYYY-MM-DD</em></span><input name="QTA_FROM" defaultValue={v("QTA_FROM")} placeholder="2026-12-01" autoComplete="off" /></label>
            <label><span>Applies to <em>YYYY-MM-DD</em></span><input name="QTA_TO" defaultValue={v("QTA_TO")} placeholder="2027-02-28" autoComplete="off" /></label>
          </div>
          <div className="adm-form-row">
            <label><span>QTA source link</span><input name="QTA_SOURCE_URL" defaultValue={v("QTA_SOURCE_URL")} autoComplete="off" /></label>
            <label><span>QTA source title</span><input name="QTA_SOURCE_TITLE" defaultValue={v("QTA_SOURCE_TITLE")} placeholder="NEPRA notification of ..." autoComplete="off" /></label>
          </div>
          <div className="adm-form-actions">
            <button type="submit" className="btn btn-primary">Save adjustments</button>
            <span className="adm-form-note">Only a figure NEPRA has actually notified. The source link is shown to readers.</span>
          </div>
        </form>
      </div>
    </>
  );
}

function Stat({ num, lbl, small }) {
  return (
    <div className="adm-stat">
      <div className="lbl">{lbl}</div>
      <div className="num" style={small ? { fontSize: "clamp(15px, 3vw, 19px)" } : undefined}>{num}</div>
    </div>
  );
}
