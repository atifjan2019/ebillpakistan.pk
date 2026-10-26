// POST /api/bill-log: the browser reports how a lookup ended when the bill was
// fetched client-side (see app/result/BillResult.js), so the admin stats count
// those lookups exactly like server-side ones. Sent with navigator.sendBeacon.
import { DISCOS, isValidRef } from "../../../lib/discos";
import { getIp, logBillCheck } from "../../../lib/store";

export const dynamic = "force-dynamic";

const OUTCOMES = new Set(["view", "notfound", "upstream"]);

export async function POST(request) {
  let body = {};
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const disco = String(body.disco || "").toLowerCase();
  const ref = String(body.ref || "").trim();
  const outcome = String(body.outcome || "");
  const page = String(body.page || "").slice(0, 120);
  if (!DISCOS[disco] || !isValidRef(ref) || !OUTCOMES.has(outcome) || !page.startsWith("/")) {
    return new Response(null, { status: 400 });
  }
  await logBillCheck({
    disco, ref, page, outcome,
    ip: getIp(request),
    city: decodeURIComponent(request.headers.get("x-vercel-ip-city") || ""),
    country: request.headers.get("x-vercel-ip-country") || "",
  });
  return new Response(null, { status: 204 });
}
