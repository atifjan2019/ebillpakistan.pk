// Rich, unique per-company content for the SEO landing pages.
// (DISCOS in discos.js holds the short [abbr, city, color]; this adds the
// long-form, page-specific content so each page is genuinely unique.)
import { DISCOS } from "./discos";

export const SLUG_SUFFIX = "-bill-check";
export const slugFor = (code) => `${code}${SLUG_SUFFIX}`;
export const codeFromSlug = (slug) => {
  const code = String(slug || "").replace(/-bill-check$/, "").toLowerCase();
  return DISCOS[code] ? code : null;
};

// Per-company SEO title/description, written in real query language (full
// company name + city + "reference number") to lift CTR on pages that rank but
// don't get clicked. `{year}` is replaced at render time so the dynamic-year
// behaviour is preserved. Titles drop the "| eBill Pakistan" brand suffix to
// spend the character budget on keywords (brand still ships via og:siteName).
export const COMPANY_SEO = {
  lesco: {
    title: "LESCO Bill Check Online {year} — Lahore Electricity Bill by Reference No.",
    description: "Check your LESCO bill online free. Enter your 14-digit reference number to view, print or download your latest Lahore Electric Supply Company bill instantly.",
  },
  iesco: {
    title: "IESCO Bill Check Online {year} — Islamabad/Rawalpindi Bill by Reference No.",
    description: "Check your IESCO bill online free. Enter your 14-digit reference number to view and download your latest Islamabad & Rawalpindi electricity bill in seconds.",
  },
  mepco: {
    title: "MEPCO Bill Check Online {year} — Multan Electricity Bill by Reference No.",
    description: "Check your MEPCO bill online free. Enter your 14-digit reference number to view, print or download your latest Multan Electric Power Company bill instantly.",
  },
  fesco: {
    title: "FESCO Bill Check Online {year} — Faisalabad Electricity Bill by Reference No.",
    description: "Check your FESCO bill online free. Enter your 14-digit reference number to view and download your latest Faisalabad electricity bill in seconds.",
  },
  gepco: {
    title: "GEPCO Bill Check Online {year} — Gujranwala Electricity Bill by Reference No.",
    description: "Check your GEPCO bill online free. Enter your 14-digit reference number to view, print or download your latest Gujranwala Electric Power Company bill.",
  },
  hesco: {
    title: "HESCO Bill Check Online {year} — Hyderabad Electricity Bill & Unit Price",
    description: "Check your HESCO bill online free. Enter your 14-digit reference number to view your latest Hyderabad electricity bill, units consumed and per-unit tariff.",
  },
  pesco: {
    title: "PESCO Bill Check Online {year} — Peshawar Electricity Bill by Reference No.",
    description: "Check your PESCO bill online free. Enter your 14-digit reference number to view and download your latest Peshawar (KP) electricity bill instantly.",
  },
  qesco: {
    title: "QESCO Bill Check Online {year} — Quetta & Balochistan Electricity Bill",
    description: "Check your QESCO bill online free. Enter your 14-digit reference number to view and download your latest Quetta & Balochistan electricity bill in seconds.",
  },
  sepco: {
    title: "SEPCO Bill Check Online {year} — Sukkur Electric Bill by Reference No.",
    description: "Check your SEPCO (Sukkur Electric Power Company) bill online free. Enter your 14-digit reference number to view, print or download your latest bill instantly.",
  },
  tesco: {
    title: "TESCO Bill Check Online {year} — Tribal Areas Electricity Bill by Ref No.",
    description: "Check your TESCO bill online free. Enter your 14-digit reference number to view and download your latest Tribal Areas (FATA) electricity bill in seconds.",
  },
  hazeco: {
    title: "HAZECO Bill Check Online {year} — Hazara & Abbottabad Electricity Bill",
    description: "Check your HAZECO bill online free. Enter your 14-digit reference number to view your latest Hazara (Abbottabad, Mansehra, Haripur) electricity bill instantly.",
  },
  ajk: {
    title: "AJK Bill Check Online {year} — Azad Kashmir Electricity Bill by Reference No.",
    description: "Check your AJK electricity bill online free. Enter your reference number to view, print or download your latest Azad Jammu & Kashmir (Mirpur, Muzaffarabad) bill.",
  },
};

// Resolve a company's SEO title/description with the live year substituted.
export const seoFor = (code, year) => {
  const s = COMPANY_SEO[code];
  return {
    title: s.title.replace("{year}", year),
    description: s.description,
  };
};

export const COMPANIES = {
  lesco: {
    full: "Lahore Electric Supply Company",
    region: "central Punjab",
    cities: ["Lahore", "Kasur", "Sheikhupura", "Nankana Sahib", "Okara"],
    about:
      "LESCO, the Lahore Electric Supply Company, distributes electricity across Lahore and the surrounding districts of central Punjab. As the DISCO serving the provincial capital, it is one of the largest in Pakistan, supplying millions of domestic, commercial and industrial consumers.",
    website: "https://www.lesco.gov.pk",
  },
  iesco: {
    full: "Islamabad Electric Supply Company",
    region: "the Potohar region of northern Punjab",
    cities: ["Islamabad", "Rawalpindi", "Attock", "Jhelum", "Chakwal"],
    about:
      "IESCO, the Islamabad Electric Supply Company, supplies power to the federal capital Islamabad, Rawalpindi and the wider Potohar region. Its network spans several districts of northern Punjab and reaches parts of Khyber Pakhtunkhwa.",
    website: "https://www.iesco.com.pk",
  },
  mepco: {
    full: "Multan Electric Power Company",
    region: "south Punjab",
    cities: ["Multan", "Bahawalpur", "Rahim Yar Khan", "Dera Ghazi Khan", "Sahiwal", "Khanewal", "Vehari"],
    about:
      "MEPCO, the Multan Electric Power Company, is the largest distribution company in Pakistan by number of consumers. It covers thirteen districts across south Punjab, stretching from Sahiwal down to Rahim Yar Khan and out to Dera Ghazi Khan.",
    website: "https://www.mepco.com.pk",
  },
  fesco: {
    full: "Faisalabad Electric Supply Company",
    region: "the Faisalabad and Sargodha divisions",
    cities: ["Faisalabad", "Sargodha", "Jhang", "Toba Tek Singh", "Mianwali", "Chiniot"],
    about:
      "FESCO, the Faisalabad Electric Supply Company, serves the industrial hub of Faisalabad along with the Sargodha, Jhang and Mianwali areas. It is regularly ranked among the best-performing distribution companies in Pakistan for billing recovery and service quality.",
    website: "https://fesco.com.pk",
  },
  gepco: {
    full: "Gujranwala Electric Power Company",
    region: "upper Punjab",
    cities: ["Gujranwala", "Sialkot", "Gujrat", "Narowal", "Hafizabad", "Mandi Bahauddin"],
    about:
      "GEPCO, the Gujranwala Electric Power Company, distributes electricity across Gujranwala, Sialkot, Gujrat and neighbouring districts of upper Punjab, a region well known for its sports-goods, surgical and light-engineering export industries.",
    website: "https://www.gepco.com.pk",
  },
  hesco: {
    full: "Hyderabad Electric Supply Company",
    region: "southern Sindh",
    cities: ["Hyderabad", "Mirpurkhas", "Badin", "Thatta", "Dadu", "Tando Allahyar"],
    about:
      "HESCO, the Hyderabad Electric Supply Company, provides power to Hyderabad and the districts of southern Sindh, including Mirpurkhas, Badin, Thatta and Dadu.",
    website: "https://www.hesco.gov.pk",
  },
  pesco: {
    full: "Peshawar Electric Supply Company",
    region: "Khyber Pakhtunkhwa",
    cities: ["Peshawar", "Mardan", "Swat", "Kohat", "Bannu", "Dera Ismail Khan", "Charsadda", "Nowshera"],
    about:
      "PESCO, the Peshawar Electric Supply Company, supplies electricity throughout most of Khyber Pakhtunkhwa, from Peshawar and Mardan to Swat, Kohat, Bannu and Dera Ismail Khan.",
    website: "https://www.pesco.com.pk",
  },
  qesco: {
    full: "Quetta Electric Supply Company",
    region: "Balochistan",
    cities: ["Quetta", "Kalat", "Sibi", "Zhob", "Mastung", "Khuzdar"],
    about:
      "QESCO, the Quetta Electric Supply Company, is the sole electricity distributor for the entire province of Balochistan. It has the largest service territory by area of any distribution company in Pakistan, covering vast and sparsely populated districts.",
    website: "https://www.qesco.com.pk",
  },
  sepco: {
    full: "Sukkur Electric Power Company",
    region: "northern Sindh",
    cities: ["Sukkur", "Larkana", "Shikarpur", "Jacobabad", "Khairpur", "Ghotki"],
    about:
      "SEPCO, the Sukkur Electric Power Company, serves the districts of northern Sindh, including Sukkur, Larkana, Shikarpur, Jacobabad and Khairpur.",
    website: "https://www.sepco.com.pk",
  },
  tesco: {
    full: "Tribal Areas Electric Supply Company",
    region: "the merged tribal districts of Khyber Pakhtunkhwa",
    cities: ["Khyber", "Kurram", "Bajaur", "Mohmand", "Orakzai", "North & South Waziristan"],
    about:
      "TESCO, the Tribal Areas Electric Supply Company, distributes electricity across the merged tribal districts of Khyber Pakhtunkhwa, including Khyber, Kurram, Bajaur, Mohmand and the Waziristan districts.",
    website: "https://www.tesco.org.pk",
  },
  hazeco: {
    full: "Hazara Electric Supply Company",
    region: "the Hazara division",
    cities: ["Abbottabad", "Mansehra", "Haripur", "Battagram", "Kohistan", "Torghar"],
    about:
      "HAZECO, the Hazara Electric Supply Company, is one of Pakistan's newer DISCOs, formed from the PESCO network to serve the Hazara division: Abbottabad, Mansehra, Haripur, Battagram and Kohistan.",
    website: "https://www.pesco.com.pk",
  },
  ajk: {
    full: "Azad Jammu & Kashmir Electricity Department",
    region: "Azad Jammu & Kashmir",
    cities: ["Muzaffarabad", "Mirpur", "Kotli", "Bagh", "Rawalakot", "Bhimber"],
    about:
      "The AJK Electricity Department distributes power across Azad Jammu & Kashmir, including Muzaffarabad, Mirpur, Kotli, Bagh and Rawalakot.",
    website: "https://www.ajk.gov.pk",
  },
};

// Company-specific FAQs (weave in the name/region so each page differs).
export function faqsFor(code) {
  const [abbr] = DISCOS[code];
  const { full, cities } = COMPANIES[code];
  return [
    [
      `How do I check my ${abbr} bill online?`,
      `Enter the 14-digit reference number from your ${full} (${abbr}) bill in the box above and we'll fetch your latest bill instantly, with no registration or login needed. You can then view it, print it, or download it as a PDF.`,
    ],
    [
      `Which areas does ${abbr} cover?`,
      `${abbr} supplies electricity to ${cities.slice(0, -1).join(", ")} and ${cities[cities.length - 1]}, along with the surrounding towns.`,
    ],
    [
      `Where is the reference number on my ${abbr} bill?`,
      `It's the 14-digit number printed at the top-left of your ${abbr} paper bill, usually labelled "Reference No". You can also look up your bill using your account or consumer ID.`,
    ],
    [
      `Can I download a duplicate ${abbr} bill?`,
      `Yes. This page always shows your most recent ${abbr} bill, which you can save as a PDF or print. Handy for paying at the bank or keeping for your records.`,
    ],
    [
      `Is checking my ${abbr} bill here free?`,
      `Completely free. ${abbr} bill checking on eBill Pakistan never requires a sign-up, and there are no charges to view or download your bill.`,
    ],
  ];
}
