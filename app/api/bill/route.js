import { fetchBillHtml } from "../../../lib/pitc";
import { DISCOS, isValidRef } from "../../../lib/discos";
import { rateLimitBill, getIp } from "../../../lib/store";

export const dynamic = "force-dynamic";
export const maxDuration = 30;
// PITC (a Pakistani govt server) blocks Vercel's Mumbai (bom1) egress IPs, so
// fetches from there hang and time out. Singapore is the closest region that
// can actually reach bill.pitc.com.pk.
export const preferredRegion = "sin1";

// A small styled page rendered inside the iframe. `status` is also exposed via a
// body data-attribute so the app shell can surface an error state (Bug 4).
function messagePage(title, msg, status) {
  return `<!doctype html><html><head><meta charset="utf-8"></head>
<body data-bill-status="${status}" style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;margin:0;padding:32px;text-align:center;color:#444">
<h3 style="color:#9b1c1c;margin:0 0 8px">${title}</h3><p style="margin:0">${msg}</p>
</body></html>`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const disco = (searchParams.get("disco") || "").toLowerCase();
  const ref = (searchParams.get("reference") || "").trim();

  const html = (body, status) =>
    new Response(body, {
      status,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });

  if (!DISCOS[disco] || !isValidRef(ref)) {
    return html(
      messagePage("Invalid request", "Please choose a company and enter a valid reference number.", "invalid"),
      400
    );
  }

  const rl = await rateLimitBill(`${getIp(request)}`);
  if (!rl.success) {
    return html(
      messagePage("Too many requests", "You're checking bills very quickly. Please wait a minute and try again.", "ratelimited"),
      429
    );
  }

  try {
    const bill = await fetchBillHtml(disco, ref);
    return html(bill, 200);
  } catch (e) {
    if (e && e.code === "BILL_NOT_FOUND") {
      return html(
        messagePage(
          "Bill not found",
          `No bill found for reference <b>${ref}</b>. Please check the number and try again.`,
          "notfound"
        ),
        404
      );
    }
    return html(
      messagePage("Service unavailable", "The bill service is unreachable right now. Please try again shortly.", "error"),
      503
    );
  }
}
