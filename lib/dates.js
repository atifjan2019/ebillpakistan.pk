// Tolerant date parsing for the strings the billing system prints. Pure, safe on
// the client. Numeric dates are read day-first, as Pakistani bills write them.
const MON = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const iso = (y, m, d) => {
  if (!(y >= 2000 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31)) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCMonth() !== m - 1) return null; // 31 Feb and the like
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
};
const year = (s) => (s.length === 2 ? 2000 + Number(s) : Number(s));

// "25 OCT 26", "25-Oct-2026", "25/10/2026", "25.10.26", "2026-10-25",
// "Oct 25, 2026" -> "2026-10-25", or null when it cannot be read with confidence.
export function parseBillDate(input) {
  const s = String(input || "").trim().toLowerCase();
  if (!s) return null;
  let m = s.match(/\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
  if (m) return iso(Number(m[1]), Number(m[2]), Number(m[3]));
  m = s.match(/\b(\d{1,2})[\s\-/.,]*([a-z]{3})[a-z]*[\s\-/.,]*(\d{4}|\d{2})\b/);
  if (m && MON[m[2]]) return iso(year(m[3]), MON[m[2]], Number(m[1]));
  m = s.match(/\b([a-z]{3})[a-z]*[\s\-/.,]*(\d{1,2})[\s\-/.,]+(\d{4}|\d{2})\b/);
  if (m && MON[m[1]]) return iso(year(m[3]), MON[m[1]], Number(m[2]));
  m = s.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{4}|\d{2})\b/);
  if (m) return iso(year(m[3]), Number(m[2]), Number(m[1]));
  return null;
}

// Today in Pakistan as "YYYY-MM-DD".
export const todayPkIso = (now) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi", year: "numeric", month: "2-digit", day: "2-digit" }).format(now ? new Date(now) : new Date());

// Whole days from `fromIso` to `toIso` (positive when `toIso` is later).
export const daysBetween = (fromIso, toIso) =>
  Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / 86400000);

// "2026-10-25" -> "25 October"
export const dayMonth = (isoDate) => {
  const [, m, d] = String(isoDate).split("-").map(Number);
  return `${d} ${NAMES[m - 1] || ""}`.trim();
};
