// Company list: pure data, safe to import in both client and server components.
// code -> [abbr, city, color]
export const DISCOS = {
  lesco: ["LESCO", "Lahore", "#1f6feb"],
  iesco: ["IESCO", "Islamabad", "#0b8457"],
  mepco: ["MEPCO", "Multan", "#d9480f"],
  fesco: ["FESCO", "Faisalabad", "#5f3dc4"],
  gepco: ["GEPCO", "Gujranwala", "#c2255c"],
  hesco: ["HESCO", "Hyderabad", "#1098ad"],
  pesco: ["PESCO", "Peshawar", "#2b8a3e"],
  qesco: ["QESCO", "Quetta", "#9c36b5"],
  sepco: ["SEPCO", "Sukkur", "#e8590c"],
  tesco: ["TESCO", "Tribal Areas", "#364fc7"],
  hazeco: ["HAZECO", "Hazara", "#0c8599"],
  ajk: ["AJK", "Azad Kashmir", "#6741d9"],
};

// Reference number length per company. The mainland companies' PITC bill
// pages take 8 to 14 digits (the printed number is 14). The AJK Electricity
// Department's page on PITC takes an 18-digit reference (its search box is
// maxlength 18, "Enter 18-digit valid reference no"), so AJK has its own rule.
const REF_DEFAULT = { min: 8, max: 14, digits: "14", pattern: "[0-9]{8,14}", example: "12345678901234" };
const REF_RULES = {
  ajk: { min: 18, max: 18, digits: "18", pattern: "[0-9]{18}", example: "017211201010226127" },
};
export const refRule = (disco) => REF_RULES[String(disco || "").toLowerCase()] || REF_DEFAULT;

// Valid for one company when `disco` is given, or for any company when it is
// not (routes that receive only a reference, such as /api/bill-json).
export const isValidRef = (ref, disco) => {
  const s = String(ref || "");
  if (!/^[0-9]+$/.test(s)) return false;
  const rules = disco ? [refRule(disco)] : [REF_DEFAULT, ...Object.values(REF_RULES)];
  return rules.some((r) => s.length >= r.min && s.length <= r.max);
};
// HTML pattern for a form that does not yet know the company (homepage, Urdu page).
export const ANY_REF_PATTERN = `(${[REF_DEFAULT, ...Object.values(REF_RULES)].map((r) => r.pattern).join("|")})`;
// "8 to 14 digits, or 18 for AJK", for error and help text.
export const REF_LENGTH_TEXT = "8 to 14 digits, or 18 digits for an AJK bill";

// Logos whose source image is square/rectangular and should be cropped into a
// circle via CSS (rather than shown as-is).
export const LOGO_CIRCLE = new Set(["iesco"]);
export const logoIsCircle = (code) => LOGO_CIRCLE.has(code);

// Region keywords used to guess a company from a bill's division/feeder/address
// text (returned by the CCMS reference lookup). Used only to ORDER the probe so
// the right company is usually tried first; the probe still verifies.
export const REGION_HINTS = {
  lesco: ["LAHORE", "KASUR", "SHEIKHUPURA", "OKARA", "NANKANA", "LHR"],
  iesco: ["ISLAMABAD", "RAWALPINDI", "ATTOCK", "JHELUM", "CHAKWAL", "RWP", "ISB"],
  gepco: ["GUJRANWALA", "SIALKOT", "GUJRAT", "NAROWAL", "HAFIZABAD", "MANDI BAHAUDDIN", "GRW"],
  fesco: ["FAISALABAD", "JHANG", "SARGODHA", "MIANWALI", "BHAKKAR", "TOBA TEK", "CHINIOT", "FSD"],
  mepco: ["MULTAN", "BAHAWALPUR", "VEHARI", "KHANEWAL", "DERA GHAZI", "RAHIM YAR", "LODHRAN", "SAHIWAL", "PAKPATTAN", "MTN"],
  pesco: ["PESHAWAR", "MARDAN", "SWAT", "KOHAT", "BANNU", "DERA ISMAIL", "CHARSADDA", "NOWSHERA", "SWABI", "PSH", "PESH"],
  hesco: ["HYDERABAD", "MIRPURKHAS", "BADIN", "THATTA", "DADU", "TANDO", "HYD"],
  sepco: ["SUKKUR", "LARKANA", "SHIKARPUR", "JACOBABAD", "KHAIRPUR", "GHOTKI", "SKR"],
  qesco: ["QUETTA", "BALOCHISTAN", "KALAT", "SIBI", "ZHOB", "MASTUNG", "QTA"],
  tesco: ["TRIBAL", "KHYBER", "KURRAM", "WAZIRISTAN", "BAJAUR", "MOHMAND", "ORAKZAI", "FATA"],
  hazeco: ["ABBOTTABAD", "MANSEHRA", "HARIPUR", "HAZARA", "BATAGRAM", "KOHISTAN", "ATD"],
  ajk: ["MUZAFFARABAD", "MIRPUR", "KOTLI", "AZAD KASHMIR", "BAGH", "RAWALAKOT", "AJK"],
};
