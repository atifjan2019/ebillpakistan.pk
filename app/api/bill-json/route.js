import { fetchBillJson, causeOfError } from "../../../lib/pitc";
import { isValidRef, REF_LENGTH_TEXT } from "../../../lib/discos";
import { rateLimitBill, getIp } from "../../../lib/store";

export const dynamic = "force-dynamic";
export const maxDuration = 30;
// PITC blocks Vercel's Mumbai (bom1) egress IPs; Singapore can reach it.
export const preferredRegion = "sin1";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ref = (searchParams.get("reference") || "").trim();

  if (!isValidRef(ref)) {
    return Response.json({ error: `reference must be ${REF_LENGTH_TEXT}` }, { status: 400 });
  }
  const rl = await rateLimitBill(`${getIp(request)}`);
  if (!rl.success) {
    return Response.json({ error: "too many requests" }, { status: 429 });
  }
  try {
    const data = await fetchBillJson(ref);
    return Response.json(data, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
    });
  } catch (e) {
    // Status by cause so the browser can tell a rate limit from an outage:
    // 429 (with Retry-After when PITC sent one), 504 for a timeout, 502 otherwise.
    const cause = causeOfError(e);
    const status = cause === "429" ? 429 : cause === "timeout" ? 504 : 502;
    const headers = {};
    if (cause === "429" && e.retryAfterSec) headers["Retry-After"] = String(Math.ceil(e.retryAfterSec));
    return Response.json({ error: "upstream unavailable", cause }, { status, headers });
  }
}
