import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DISCOS } from "../../lib/discos";
import { getStats } from "../../lib/store";

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
    maxAge: 60 * 60 * 8, // 8 hours
  });
  redirect("/admin");
}

async function logout() {
  "use server";
  const c = await cookies();
  c.delete(COOKIE);
  redirect("/admin");
}

export default async function AdminPage({ searchParams }) {
  if (!(await isAuthed())) {
    const sp = await searchParams;
    return <Login error={sp?.e === "1"} />;
  }
  const stats = await getStats();
  return <Dashboard stats={stats} />;
}

/* ---------------- login ---------------- */
function Login({ error }) {
  return (
    <section className="result-wrap">
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="admin-card" style={{ marginTop: 30 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>Admin access</h1>
          <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 18px" }}>
            Enter the passcode to view the dashboard.
          </p>
          <form action={login} style={{ display: "grid", gap: 12 }}>
            <input
              name="passcode"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Passcode"
              autoFocus
              required
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 12,
                border: "1px solid var(--line)", fontSize: 16, outline: "none",
              }}
            />
            {error && (
              <span style={{ color: "#9b1c1c", fontSize: 13.5 }}>Incorrect passcode. Try again.</span>
            )}
            <button type="submit" className="btn btn-primary">Unlock dashboard</button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ---------------- dashboard ---------------- */
const fmtTime = (ms) =>
  new Date(ms).toLocaleString("en-GB", {
    timeZone: "Asia/Karachi", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });

const discoLabel = (code) => (DISCOS[code] ? DISCOS[code][0] : code === "auto" ? "Auto-detect" : code);

function BarList({ rows, total }) {
  if (!rows.length) return <p style={{ color: "var(--muted)", fontSize: 14 }}>No data yet.</p>;
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "grid", gridTemplateColumns: "150px 1fr 52px", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</span>
          <span style={{ background: "var(--brand-50)", borderRadius: 999, height: 10, overflow: "hidden" }}>
            <span style={{ display: "block", height: "100%", width: `${(r.count / max) * 100}%`, background: "var(--brand)", borderRadius: 999 }} />
          </span>
          <span style={{ fontSize: 13.5, color: "var(--muted)", textAlign: "right" }}>
            {r.count}{total ? ` · ${Math.round((r.count / total) * 100)}%` : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

function sortedRows(obj, labeller = (k) => k) {
  return Object.entries(obj || {})
    .map(([k, count]) => ({ label: labeller(k), count }))
    .sort((a, b) => b.count - a.count);
}

function Dashboard({ stats }) {
  const { total, byDisco, byPage, byDay, recent, configured } = stats;
  const days = Object.entries(byDay || {}).sort((a, b) => a[0].localeCompare(b[0])).slice(-14);
  const dayMax = Math.max(...days.map(([, n]) => n), 1);

  return (
    <section className="result-wrap">
      <div className="container" style={{ maxWidth: 920 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Bill-check dashboard</h1>
            <p style={{ color: "var(--muted)", fontSize: 13.5, margin: "4px 0 0" }}>
              Privacy-safe analytics: no reference numbers or IPs are stored.
            </p>
          </div>
          <form action={logout}><button type="submit" className="btn btn-ghost">Log out</button></form>
        </div>

        {!configured && (
          <div className="admin-card" style={{ marginBottom: 16, borderColor: "#f0c36d", background: "#fff8e6" }}>
            <strong>Dev mode:</strong> no Redis/KV configured, so these counts are held in memory and reset on
            restart. In production (with Upstash/Vercel KV) they persist.
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 18 }}>
          <Stat label="Total bill checks" value={total} />
          <Stat label="Companies seen" value={Object.keys(byDisco || {}).length} />
          <Stat label="Source pages" value={Object.keys(byPage || {}).length} />
          <Stat label="Today" value={byDay?.[new Date().toISOString().slice(0, 10)] || 0} />
        </div>

        <div className="admin-card" style={{ marginBottom: 16 }}>
          <h2 style={cardH}>Checks by company</h2>
          <BarList rows={sortedRows(byDisco, discoLabel)} total={total} />
        </div>

        <div className="admin-card" style={{ marginBottom: 16 }}>
          <h2 style={cardH}>Checks by page</h2>
          <BarList rows={sortedRows(byPage)} total={total} />
        </div>

        <div className="admin-card" style={{ marginBottom: 16 }}>
          <h2 style={cardH}>Last 14 days</h2>
          {days.length ? (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
              {days.map(([d, n]) => (
                <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }} title={`${d}: ${n}`}>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{n}</span>
                  <span style={{ width: "100%", background: "var(--brand)", borderRadius: "6px 6px 0 0", height: `${(n / dayMax) * 86}px`, minHeight: 3 }} />
                  <span style={{ fontSize: 10, color: "var(--muted)" }}>{d.slice(5)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>No data yet.</p>
          )}
        </div>

        <div className="admin-card">
          <h2 style={cardH}>Recent checks</h2>
          {recent && recent.length ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "var(--muted)", borderBottom: "1px solid var(--line)" }}>
                    <th style={th}>Time (PKT)</th><th style={th}>Company</th><th style={th}>Page</th><th style={th}>Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((ev, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td style={td}>{fmtTime(ev.t)}</td>
                      <td style={td}>{discoLabel(ev.disco)}</td>
                      <td style={td}><code style={{ fontSize: 12.5 }}>{ev.page}</code></td>
                      <td style={td}>{ev.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>No checks recorded yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

const cardH = { fontSize: 16, fontWeight: 700, margin: "0 0 14px", color: "var(--ink)" };
const th = { padding: "8px 10px", fontWeight: 600 };
const td = { padding: "8px 10px", color: "var(--body)" };

function Stat({ label, value }) {
  return (
    <div className="admin-card" style={{ padding: 18 }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: "var(--ink)", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>{label}</div>
    </div>
  );
}
