import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { DISCOS } from "../../lib/discos";
import { getStats } from "../../lib/store";
import { getArticle } from "../../lib/articles";
import { getAllPosts, deletePost } from "../../lib/posts";
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

const TABS = ["overview", "companies", "cities", "days", "recent", "posts"];

export default async function AdminPage({ searchParams }) {
  const sp = await searchParams;
  if (!(await isAuthed())) {
    return <Login error={sp?.e === "1"} />;
  }
  const tab = TABS.includes(sp?.tab) ? sp.tab : "overview";
  const page = Math.max(1, parseInt(sp?.page, 10) || 1);
  // The posts page doesn't need analytics, and vice versa.
  const [stats, posts] = await Promise.all([
    tab === "posts" ? null : getStats(),
    tab === "posts" ? getAllPosts() : null,
  ]);
  return <Dashboard tab={tab} stats={stats} posts={posts} page={page} />;
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

function Dashboard({ tab, stats, posts, page }) {
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
            {tab === "posts" && <PostsTab posts={posts} page={page} />}
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

function PostsTab({ posts, page }) {
  // Newest first; 10 per page, navigated via ?tab=posts&page=N (server-rendered).
  const sorted = [...posts].sort((a, b) =>
    String(b.publishedDate).localeCompare(String(a.publishedDate)));
  const totalPages = Math.max(1, Math.ceil(sorted.length / POSTS_PAGE_SIZE));
  const p = Math.min(page, totalPages);
  const pageRows = sorted.slice((p - 1) * POSTS_PAGE_SIZE, p * POSTS_PAGE_SIZE);
  return (
    <div className="adm-panel">
      <h2>Blog posts <span className="adm-count">{posts.length}</span></h2>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr><th>Title</th><th>Slug</th><th>Published</th><th>Source</th><th></th></tr>
          </thead>
          <tbody>
            {pageRows.map((post) => (
              <tr key={post.slug}>
                <td><a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">{post.title}</a></td>
                <td><code>{post.slug}</code></td>
                <td>{post.publishedDate}</td>
                <td>
                  <span className={post.source === "api" ? "adm-chip adm-chip-api" : "adm-chip"}>
                    {post.source === "api" ? "API" : "Static"}
                  </span>
                </td>
                <td>
                  {post.source === "api" && (
                    <form action={unpublish}>
                      <input type="hidden" name="slug" value={post.slug} />
                      <button type="submit" className="adm-unpub">Unpublish</button>
                    </form>
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
