// POST /api/bill-log: the browser reports how a lookup ended when the bill was
// fetched client-side (see app/result/BillResult.js), so the admin stats count
// those lookups exactly like server-side ones. Sent with navigator.sendBeacon.
import { DISCOS, isValidRef } from "../../../lib/discos";
import { getIp, logBillCheck } from "../../../lib/store";

export const dynamic = "force-dynamic";

const OUTCOMES = new Set(["view", "notfound", "upstream"]);
const VIAS = new Set(["browser", "server"]);
const CAUSES = new Set(["ok", "notfound", "429", "timeout", "5xx", "network", "http"]);

// Up to six { via, cause, ms } rows describing each fetch attempt.
function cleanAttempts(list) {
  if (!Array.isArray(list)) return [];
  return list.slice(0, 6).flatMap((a) => {
    const via = String(a?.via || "");
    const cause = String(a?.cause || "");
    const ms = Number(a?.ms);
    return VIAS.has(via) && CAUSES.has(cause) ? [{ via, cause, ms: Number.isFinite(ms) ? Math.max(0, Math.round(ms)) : null }] : [];
  });
}

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
  if (!DISCOS[disco] || !isValidRef(ref, disco) || !OUTCOMES.has(outcome) || !page.startsWith("/")) {
    return new Response(null, { status: 400 });
  }
  await logBillCheck({
    disco, ref, page, outcome,
    attempts: cleanAttempts(body.attempts),
    ip: getIp(request),
    city: decodeURIComponent(request.headers.get("x-vercel-ip-city") || ""),
    country: request.headers.get("x-vercel-ip-country") || "",
  });
  return new Response(null, { status: 204 });
}
