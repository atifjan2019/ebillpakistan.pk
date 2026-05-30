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
