import { fetchBillJson } from "../../../lib/pitc";
import { isValidRef } from "../../../lib/discos";
import { rateLimitBill, getIp } from "../../../lib/store";

export const dynamic = "force-dynamic";
export const maxDuration = 30;
// Run close to PITC (Pakistan) to cut latency to ccms.pitc.com.pk.
export const preferredRegion = "bom1";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ref = (searchParams.get("reference") || "").trim();

  if (!isValidRef(ref)) {
    return Response.json({ error: "reference must be 8-14 digits" }, { status: 400 });
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
    return Response.json({ error: "upstream unavailable" }, { status: 502 });
  }
}
