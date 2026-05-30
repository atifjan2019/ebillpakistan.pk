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

export const isValidRef = (ref) => /^[0-9]{8,14}$/.test(ref);

// DISCOs that have a brand logo at /public/images/discos/<file>.
// Map a company code to its logo filename once the file is added.
export const COMPANY_LOGOS = {
  lesco: "lesco.png",
  iesco: "iesco.jpeg",
  mepco: "mepco.jpeg",
  fesco: "fesco.jpeg",
  gepco: "gepco.jpeg",
  hesco: "hesco.png",
  pesco: "pesco.svg",
  qesco: "qesco.png",
  sepco: "sepco.jpeg",
  tesco: "tesco.jpeg",
  hazeco: "hazeco.jpeg",
  ajk: "ajk.jpg",
};
export const hasLogo = (code) => Boolean(COMPANY_LOGOS[code]);
export const discoLogo = (code) => `/images/discos/${COMPANY_LOGOS[code]}`;

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
