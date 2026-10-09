// The admin can enter this month's FCA and the current QTA on the Settings tab
// when NEPRA announces them, so the company pages, the tracker and the
// calculator update before the figures are committed to lib/adjustments.js.
// Server-only (reads the settings store).
import { getSettings } from "./siteSettings";

export const ADJ_KEYS = [
  "FCA_RATE", "FCA_BILLING_MONTH", "FCA_CONSUMPTION_MONTH", "FCA_SOURCE_URL", "FCA_SOURCE_TITLE",
  "QTA_RATE", "QTA_FROM", "QTA_TO", "QTA_SOURCE_URL", "QTA_SOURCE_TITLE",
];

const num = (v) => {
  const n = parseFloat(String(v ?? "").replace(/[^\d.+-]/g, ""));
  return Number.isFinite(n) ? n : null;
};

export async function getAdjustmentOverrides() {
  let s;
  try {
    s = await getSettings(ADJ_KEYS);
  } catch {
    return { fca: null, qta: null };
  }
  const v = (k) => s[k]?.source === "saved" ? s[k].value : "";
  const fca = num(v("FCA_RATE")) != null && /^\d{4}-\d{2}$/.test(v("FCA_BILLING_MONTH"))
    ? {
        perUnit: num(v("FCA_RATE")),
        billingMonth: v("FCA_BILLING_MONTH"),
        consumptionMonth: /^\d{4}-\d{2}$/.test(v("FCA_CONSUMPTION_MONTH")) ? v("FCA_CONSUMPTION_MONTH") : null,
        sourceUrl: v("FCA_SOURCE_URL"),
        sourceTitle: v("FCA_SOURCE_TITLE"),
      }
    : null;
  const qta = num(v("QTA_RATE")) != null && /^\d{4}-\d{2}-\d{2}$/.test(v("QTA_FROM")) && /^\d{4}-\d{2}-\d{2}$/.test(v("QTA_TO"))
    ? {
        perUnit: num(v("QTA_RATE")),
        appliesFrom: v("QTA_FROM"),
        appliesTo: v("QTA_TO"),
        url: v("QTA_SOURCE_URL"),
        sro: v("QTA_SOURCE_TITLE") || "NEPRA notification",
      }
    : null;
  return { fca, qta, raw: s };
}
