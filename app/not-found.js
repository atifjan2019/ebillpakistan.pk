import { DISCOS } from "../lib/discos";

const POPULAR = ["lesco", "iesco", "mepco", "fesco"];

export const metadata = {
  title: "Page not found | eBill Pakistan",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="hero" style={{ paddingBottom: 72 }}>
      <div className="container" style={{ maxWidth: 660 }}>
        <span className="eyebrow"><span className="dot" /> Error 404</span>

        <h1 style={{ marginTop: 18 }}>
          <span
            className="grad"
            style={{ display: "block", fontSize: "clamp(72px, 18vw, 132px)", lineHeight: 0.95, marginBottom: 6 }}
          >
            404
          </span>
          Page not found
        </h1>

        <p className="sub">
          The page you were looking for does not exist or has moved. But your electricity bill is
          still just a reference number away.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a className="btn btn-primary" href="/">Check your bill</a>
          <a className="btn btn-ghost" href="/blog">Read the guides</a>
        </div>

        <div style={{ marginTop: 36 }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".6px", margin: "0 0 14px" }}>
            Popular pages
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {POPULAR.map((c) => (
              <a
                key={c}
                href={`/${c}-bill-check`}
                style={{
                  fontSize: 14, fontWeight: 600, color: "var(--brand-700)", background: "#fff",
                  border: "1px solid var(--line)", borderRadius: 999, padding: "8px 15px",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {DISCOS[c][0]} Bill
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
