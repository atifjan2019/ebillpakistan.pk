import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { DISCOS } from "../../lib/discos";
import { getStats } from "../../lib/store";
import { getArticle } from "../../lib/articles";
import { getAllPosts, deletePost, getPost, savePost } from "../../lib/posts";
import { buildPost, slugify } from "../../lib/publishPost";
import { AUTHORS, DEFAULT_AUTHOR } from "../../lib/authors";
import RecentChecks from "./RecentChecks";

export const dynamic = "force-dynamic";

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

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath(`/author/${post.author}`);
  revalidatePath("/sitemap.xml");
  redirect(`/admin?tab=posts&msg=${encodeURIComponent(`${existing ? "Replaced" : "Published"} /blog/${post.slug}`)}`);
}

const TABS = ["overview", "companies", "cities", "days", "recent", "posts"];

export default async function AdminPage({ searchParams }) {
  const sp = await searchParams;
  if (!(await isAuthed())) {
    return <Login error={sp?.e === "1"} />;
  }
  const tab = TABS.includes(sp?.tab) ? sp.tab : "overview";
  const page = Math.max(1, parseInt(sp?.page, 10) || 1);
  // The posts page doesn't need analytics, and vice versa.
  const editSlug = tab === "posts" ? String(sp?.edit || "") : "";
  const [stats, posts, editing] = await Promise.all([
    tab === "posts" ? null : getStats(),
    tab === "posts" ? getAllPosts() : null,
    editSlug ? getPost(editSlug) : null,
  ]);
  return <Dashboard tab={tab} stats={stats} posts={posts} page={page} msg={sp?.msg} err={sp?.err} editing={editing} />;
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
  external: <Ic><path d="M14 5h5v5M19 5l-8 8" /><path d="M19 14v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></Ic>,
};

const NAV = [
  ["overview", "Overview"],
  ["companies", "By company"],
  ["cities", "Top cities"],
  ["days", "Last 14 days"],
  ["recent", "Recent checks"],
  ["posts", "Blog posts"],
];

const TAB_TITLES = {
  overview: ["Overview", "Key numbers at a glance · times in PKT"],
  companies: ["Checks by company", "Bill checks per DISCO, all time"],
  cities: ["Top cities", "Where bill checks come from"],
  days: ["Last 14 days", "Daily bill-check volume"],
  recent: ["Recent checks", "The latest individual bill lookups"],
  posts: ["Blog posts", "Everything published on /blog"],
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

function Dashboard({ tab, stats, posts, page, msg, err, editing }) {
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
            {tab === "posts" && <PostsTab posts={posts} page={page} msg={msg} err={err} editing={editing} />}
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
        <b>{e ? `Edit: ${e.slug}` : "New post"}</b>
        <span>{e ? "editing an existing post" : "write a post and publish it straight to the blog"}</span>
      </summary>

      <form action={publish} className="adm-form">
        {e && <input type="hidden" name="overwrite" value="yes" />}
        {e && <input type="hidden" name="contentFormat" value={fmt} />}

        <label>
          <span>Title <em>required</em></span>
          <input name="title" defaultValue={e?.title || ""} required maxLength={200} />
        </label>

        <label>
          <span>Slug <em>{e ? "changing this creates a new post" : "leave blank to generate from the title"}</em></span>
          <input name="slug" defaultValue={e?.slug || ""} pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100}
            placeholder="lowercase-with-hyphens" readOnly={!!e} />
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
          <button type="submit" className="btn btn-primary">{e ? "Save changes" : "Publish post"}</button>
          {e && <a className="btn btn-ghost" href="/admin?tab=posts">Cancel</a>}
          <span className="adm-form-note">
            Publishes to the live blog immediately and revalidates /blog, the post, the author page and the sitemap.
          </span>
        </div>
      </form>
    </details>
  );
}

function PostsTab({ posts, page, msg, err, editing }) {
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

      <PostForm editing={editing} />

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

function Stat({ num, lbl, small }) {
  return (
    <div className="adm-stat">
      <div className="lbl">{lbl}</div>
      <div className="num" style={small ? { fontSize: "clamp(15px, 3vw, 19px)" } : undefined}>{num}</div>
    </div>
  );
}
