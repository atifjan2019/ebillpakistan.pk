import { fetchBillJson } from "../../../lib/pitc";
import { isValidRef } from "../../../lib/discos";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ref = (searchParams.get("reference") || "").trim();

  if (!isValidRef(ref)) {
    return Response.json({ error: "reference must be 8-14 digits" }, { status: 400 });
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
