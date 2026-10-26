// Parses PTCL's e-bill page (prism.ptcl.net.pk/b/<token>) into fields.
//
// The page is one HTML invoice; its labels sit in table cells with the value in
// the next cell. We flatten the markup to "label | value" rows (regex, not the
// DOM, so the same code runs in the browser and in a node test) and pick each
// field by its label. Layout checked on 26 October 2026. Every field is
// optional: a label PTCL renames simply comes back null and is not shown.
const CELLS = /<\/t[dh]>/gi;
const ROWS = /<\/tr>|<br\s*\/?>|<\/p>|<\/div>/gi;

function decode(s) {
  return s
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
}

export function flattenInvoice(html) {
  const body = String(html || "").replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "");
  const t = decode(body.replace(CELLS, " | ").replace(ROWS, "\n").replace(/<[^>]+>/g, " "));
  return t
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim().replace(/^[|\s]+|[|\s]+$/g, ""))
    .filter((l) => l && !/^[|\s]+$/.test(l));
}

const money = (v) => {
  if (v == null) return null;
  const m = String(v).replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
};
const text = (v) => (v == null ? null : String(v).trim() || null);

// Cells of a row: "Label | value | other | ..."
function cellsOf(line) {
  return line.split("|").map((c) => c.trim());
}

// First value that follows a cell matching `label` anywhere in the invoice.
// First value that follows a cell matching `label` anywhere in the invoice and
// satisfies `ok` (so a column heading such as "TELEPHONE | TV" is skipped when
// a money figure is wanted).
function after(lines, label, { inline = false, ok = () => true } = {}) {
  const re = new RegExp(`^${label}\\s*:?\\s*$`, "i");
  const inl = new RegExp(`^${label}\\s*:?\\s*(.+)$`, "i");
  for (const line of lines) {
    const cells = cellsOf(line);
    for (let i = 0; i < cells.length; i++) {
      if (re.test(cells[i])) {
        for (let j = i + 1; j < cells.length; j++) if (cells[j] && ok(cells[j])) return cells[j];
      } else if (inline) {
        const m = cells[i].match(inl);
        if (m && m[1].trim() && ok(m[1].trim())) return m[1].trim();
      }
    }
  }
  return null;
}
const isMoney = (v) => /\d/.test(v);

export function parsePtclBill(html) {
  const lines = flattenInvoice(html);
  if (!lines.some((l) => /INVOICE/i.test(l)) || !lines.some((l) => /Account ID/i.test(l))) return null;

  const charges = {};
  const CHARGE_LABELS = {
    telephone: "Telephone", basic: "Basic", bundle: "Bundle", installation: "Installation Charges", tv: "TV",
    vas: "VAS/Paper Bill", extraUsage: "Extra Usage-FUP", equipment: "Modem-Equipment", discount: "Discount",
    adjustment: "Adjustment", serviceTotal: "Total Service Charges", arrears: "Arrears/Upfront Payment",
    credit: "Credit", salesTax: "FED/Sales Tax", whTax: "W.H.Tax", lateSurcharge: "Late Pay Surcharge", grandTotal: "Grand Total",
  };
  for (const [key, label] of Object.entries(CHARGE_LABELS)) {
    const v = money(after(lines, label.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&"), { ok: isMoney }));
    if (v !== null) charges[key] = v;
  }

  // Name and address are the two lines before "Account ID/ESN" in the header.
  let name = null, address = null;
  const idx = lines.findIndex((l) => /^Account ID\/ESN/i.test(l));
  if (idx > 1) { address = text(lines[idx - 1]); name = text(lines[idx - 2]); }
  if (name && /Issue Date/i.test(name)) name = null;

  const usage = lines.find((l) => /^Usage:/i.test(l));
  const usageM = usage ? usage.match(/Usage:\s*([\d.]+)\s*\/\s*([\d.]+)\s*GB/i) : null;
  const packages = lines.filter((l) => /\bMbps\b/i.test(l)).map((l) => cellsOf(l).slice(0, 2).join(" · "));

  return {
    invoice: text(after(lines, "Invoice #", { inline: true })),
    issueDate: text(after(lines, "Issue Date", { inline: true })),
    accountId: text(after(lines, "Account ID(?:\\/ESN)?", { inline: true })),
    phone: text(after(lines, "Phone No", { inline: true })),
    billingMonth: text(after(lines, "Billing Month")),
    dueDate: text(after(lines, "Due Date")),
    amountDue: money(after(lines, "(?:Total )?Amount Due", { ok: isMoney })),
    amountAfterDue: money(after(lines, "(?:Amount After Due Date|Payable After Due)", { ok: isMoney })),
    amountPaid: money(after(lines, "Amount Paid", { inline: true })),
    name, address, charges, packages,
    usageGb: usageM ? Number(usageM[1]) : null,
    usageCapGb: usageM ? Number(usageM[2]) : null,
  };
}
