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
  redirect("/admin");
}

export default async function AdminPage({ searchParams }) {
  if (!(await isAuthed())) {
    const sp = await searchParams;
    return <Login error={sp?.e === "1"} />;
  }
  const [stats, posts] = await Promise.all([getStats(), getAllPosts()]);
  return <Dashboard stats={stats} posts={posts} />;
}

/* ---------------- login ---------------- */
function Login({ error }) {
  return (
    <div className="admin-page">
      <div className="adm adm-login">
        <div className="card">
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

/* ---------------- dashboard ---------------- */
const fmtTime = (ms) =>
  new Date(ms).toLocaleString("en-GB", {
    timeZone: "Asia/Karachi", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });

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
        <div className="adm-row" key={r.key}>
          <span className="k" title={r.label}>{r.label}</span>
          <span className="adm-track"><span className="adm-fill" style={{ width: `${(r.count / max) * 100}%` }} /></span>
          <span className="v">{r.count}{total ? ` · ${Math.round((r.count / total) * 100)}%` : ""}</span>
        </div>
      ))}
    </div>
  );
}

function Dashboard({ stats, posts }) {
  const { total, uniqueVisitors, byDisco, byDay, byCity, recent, configured } = stats;
  const today = new Date().toISOString().slice(0, 10);
  const cityRows = sortedRows(byCity);
  const topCity = cityRows[0]?.label || "—";
  const days = Object.entries(byDay || {}).sort((a, b) => a[0].localeCompare(b[0])).slice(-14);
  const dayMax = Math.max(...days.map(([, n]) => n), 1);

  return (
    <div className="admin-page">
      <div className="adm">
        <div className="adm-top">
          <div>
            <h1>Bill-check dashboard</h1>
            <p>Live analytics for eBill Pakistan · times in PKT</p>
          </div>
          <form action={logout}><button type="submit" className="btn btn-ghost">Log out</button></form>
        </div>

        {!configured && (
          <div className="adm-note">
            <strong>Dev mode:</strong> no Redis/KV detected, so counts are in-memory and reset on restart.
            In production (Upstash/Vercel KV) they persist.
          </div>
        )}

        <div className="adm-layout">
          <aside className="adm-side" aria-label="Dashboard sections">
            <span className="adm-nav-title">Dashboard</span>
            <a href="#overview">Overview</a>
            <a href="#companies">By company</a>
            <a href="#cities">Top cities</a>
            <a href="#days">Last 14 days</a>
            <a href="#recent">Recent checks</a>
            <a href="#posts">Blog posts</a>
            <span className="adm-nav-title">Site</span>
            <a href="/" target="_blank" rel="noreferrer">Open homepage ↗</a>
            <a href="/blog" target="_blank" rel="noreferrer">Open blog ↗</a>
          </aside>

          <div className="adm-main">
        <div className="adm-stats" id="overview">
          <Stat num={total} lbl="Total bill checks" />
          <Stat num={uniqueVisitors} lbl="Unique visitors" />
          <Stat num={byDay?.[today] || 0} lbl="Checks today" />
          <Stat num={Object.keys(byCity || {}).length} lbl="Cities" />
          <Stat num={topCity} lbl="Top city" small />
        </div>

        <div className="adm-panel" id="companies">
          <h2>Checks by company</h2>
          <Bars rows={sortedRows(byDisco, discoLabel)} total={total} limit={12} />
        </div>

        <div className="adm-panel" id="cities">
          <h2>Top cities</h2>
          <Bars rows={cityRows} total={total} limit={10} />
        </div>

        <div className="adm-panel" id="days">
          <h2>Last 14 days</h2>
          {days.length ? (
            <div className="adm-days">
              {days.map(([d, n]) => (
                <div className="adm-day" key={d} title={`${d}: ${n}`}>
                  <span className="n">{n}</span>
                  <span className="bar" style={{ height: `${(n / dayMax) * 96}px` }} />
                  <span className="d">{d.slice(5)}</span>
                </div>
              ))}
            </div>
          ) : <p className="adm-empty">No data yet.</p>}
        </div>

        <div className="adm-panel" id="recent">
          <h2>Recent checks</h2>
          <RecentChecks events={recent || []} />
        </div>

        <div className="adm-panel" id="posts">
          <h2>Blog posts ({posts.length})</h2>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>Title</th><th>Slug</th><th>Published</th><th>Source</th><th></th></tr>
              </thead>
              <tbody>
                {[...posts]
                  .sort((a, b) => String(b.publishedDate).localeCompare(String(a.publishedDate)))
                  .map((p) => (
                    <tr key={p.slug}>
                      <td><a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer">{p.title}</a></td>
                      <td><code>{p.slug}</code></td>
                      <td>{p.publishedDate}</td>
                      <td>{p.source === "api" ? "API" : "Static"}</td>
                      <td>
                        {p.source === "api" && (
                          <form action={unpublish}>
                            <input type="hidden" name="slug" value={p.slug} />
                            <button type="submit" className="adm-unpub">Unpublish</button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ num, lbl, small }) {
  return (
    <div className="adm-stat">
      <div className="num" style={small ? { fontSize: "clamp(16px, 3.5vw, 20px)" } : undefined}>{num}</div>
      <div className="lbl">{lbl}</div>
    </div>
  );
}
