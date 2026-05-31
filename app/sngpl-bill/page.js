import { buildMeta } from "../../lib/seo";
import SngplGate from "./SngplGate";

export async function generateMetadata() {
  const year = new Date().getFullYear();
  return buildMeta({
    title: `SNGPL Gas Bill Check Online ${year} | eBill Pakistan`,
    description:
      "Check your SNGPL (Sui Northern Gas) bill online for free. Enter your 11-digit consumer number to view and download your latest gas bill from the official portal.",
    path: "/sngpl-bill",
    imageAlt: "Check your SNGPL gas bill online - eBill Pakistan",
  });
}

export default function SngplBillPage() {
  return (
    <section className="result-wrap">
      <div className="container">
        <div className="crumb">
          <a href="/">Home</a> <span>/</span> <span>SNGPL gas bill</span>
        </div>
        <div className="result-head">
          <div>
            <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                className="badge"
                style={{
                  "--c": "#e8731c", width: 40, height: 40, borderRadius: 11, display: "grid",
                  placeItems: "center", background: "color-mix(in srgb, #e8731c 14%, #fff)",
                  color: "#e8731c", fontWeight: 800, fontSize: 14,
                }}
              >
                SN
              </span>
              SNGPL Gas Bill
            </h1>
            <p className="ref">Sui Northern Gas Pipelines Limited · Domestic & commercial consumers</p>
          </div>
          <a className="btn btn-ghost" href="/">← Check another bill</a>
        </div>

        <SngplGate />

        <div style={{ maxWidth: 760, margin: "26px auto 0", color: "#475467", fontSize: 15, lineHeight: 1.7 }}>
          <h2 style={{ fontSize: 18, margin: "0 0 8px", color: "#1f2937" }}>How to check your SNGPL gas bill</h2>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            <li>Find your <b>11-digit consumer number</b> printed at the top of your SNGPL gas bill.</li>
            <li>Enter it in the box above, type the <b>captcha</b> shown, and tap <b>View Bill</b>.</li>
            <li>Your latest bill opens directly from the official SNGPL portal — you can print or save it.</li>
          </ol>
          <p style={{ marginTop: 14, color: "#667085", fontSize: 14 }}>
            Note: SNGPL requires a captcha to view a bill, so it can&apos;t be opened in one click like electricity bills.
          </p>
        </div>
      </div>
    </section>
  );
}
