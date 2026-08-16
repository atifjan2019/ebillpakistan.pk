// GET /api/bill-diagnostics — answers the one question that decides whether
// /result can render bills in production: can THIS server reach CCMS?
//
// PITC blocks datacenter egress for bill.pitc.com.pk (that is why PITC_PROXY
// exists). Whether the same block applies to ccms.pitc.com.pk — a different
// host, which is what /result now uses — can only be tested from the deployed
// environment. Hit this route once after deploying and read `ccms.reachable`.
//
// Returns no bill data and takes no reference number, so it is safe to leave in
// place; it is excluded from the index by robots.txt (/api/ is disallowed).
import { probeCcms } from "../../../lib/pitc";

export const dynamic = "force-dynamic";
export const maxDuration = 20;
export const preferredRegion = "sin1";

export async function GET() {
  const ccms = await probeCcms();
  return Response.json(
    {
      checkedAt: new Date().toISOString(),
      environment: {
        onVercel: !!process.env.VERCEL,
        region: process.env.VERCEL_REGION || null,
        pitcProxyConfigured: !!process.env.PITC_PROXY,
      },
      ccms,
      verdict: ccms.reachable
        ? "CCMS is reachable from this server — /result can render parsed bills natively."
        : "CCMS is NOT reachable from this server. /result will fall back. Set PITC_PROXY to a Pakistani/residential egress proxy.",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
