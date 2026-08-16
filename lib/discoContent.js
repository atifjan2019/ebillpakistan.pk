// Per-company content for the 12 DISCO pages.
//
// This file exists to kill the doorway-page pattern: the old pages rendered one
// template with the company name interpolated, and every single one printed
// "118" as the only contact detail. What makes two pages genuinely different is
// DATA, not prose, so the differentiating facts live here.
//
// SOURCING RULE (see /editorial-policy): every phone number and address below is
// either copied from that company's own website — with the page it came from
// recorded in `verifiedFrom` and the date in `verifiedOn` — or left as a
// {{VERIFY: ...}} placeholder. Nothing here is inferred from another DISCO, and
// nothing is carried over from a directory site or a competitor.
//
// Verified on 16 August 2026 by fetching each company's own site. Companies
// whose sites were unreachable or did not publish the detail are marked.

const NATIONAL = {
  helpline: "118",
  sms: "8118",
  note: "118 is the national power-distribution complaint line shared by every DISCO, and 8118 is the SMS short code. It is a starting point, not a substitute for the company's own numbers below.",
};

const CCMS = {
  name: "PITC Complaint Management System (CCMS)",
  url: "https://ccms.pitc.com.pk/complaint",
  note: "The complaint portal several DISCOs use directly. You get a ticket number — keep it, it is what lets you escalate.",
};

const CITIZEN_PORTAL = {
  name: "Prime Minister's Citizen Portal",
  url: "https://citizenportal.gov.pk/",
  note: "A government-wide escalation route when a DISCO complaint goes unresolved.",
};

export const SHARED_CHANNELS = { NATIONAL, CCMS, CITIZEN_PORTAL };

// helper: an unverified field, phrased so one lookup resolves it
const V = (what) => `{{VERIFY: ${what}}}`;

export const DISCO_CONTENT = {
  pesco: {
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "https://pesco.com.pk/pesco-complaint-cell",
      helpline: "118",
      sms: "8118",
      whatsapp: "0370-1341078",
      whatsappNote: "PESCO Central Complaint Cell, Peshawar — the number PESCO publishes for when a customer service centre does not respond.",
      portal: CCMS,
      headOffice: V("PESCO head office street address, from pesco.com.pk"),
      offices: [
        { name: "Peshawar Circle", phone: "091-9212523", covers: "Peshawar, Charsadda & Shabqadar" },
        { name: "Khyber Circle", phone: "091-9217576", covers: "Peshawar, Nowshera, Kohat & Hangu" },
        { name: "Mardan Circle", phone: "0937-9230288", covers: "Mardan & Takht Bhai" },
        { name: "Swat Circle", phone: "0946-9240367", covers: "Dargai, Malakand, Buner, Timergara, Dir & Khwazakhela" },
        { name: "Bannu Circle", phone: "0928-9230288", covers: "Bannu, Lakki Marwat & Karak" },
        { name: "Swabi Circle", phone: "0938-221209", covers: "Swabi" },
        { name: "D.I. Khan Circle", phone: "0966-850056", covers: "Dera Ismail Khan & Tank" },
      ],
    },
  },

  iesco: {
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "https://www.iesco.com.pk/contact and /customer-centers",
      helpline: "118",
      sms: "8118",
      whatsapp: null,
      portal: CCMS,
      headOffice: "IESCO Head Office, Street 40, Sector G-7/4, Islamabad — 051-9252937, 051-9252938, 051-9252939 (fax 051-9252927)",
      offices: [
        { name: "Blue Area, Islamabad", phone: "051-9244301-2", covers: "Behind Shaheed-e-Millat, China Chowk, Blue Area" },
        { name: "G-9, Islamabad", phone: "051-2285931-2", covers: "Double Road near Grid Station, Sector G-9/3" },
        { name: "Marrir Hassan, Rawalpindi", phone: "051-9292692", covers: "Marrir Hassan, Rawalpindi" },
        { name: "Taxila", phone: "051-9314162-3", covers: "GT Road near Lari Adda, Taxila" },
        { name: "Attock", phone: "0572-702756", covers: "Near Jamia Masjid, Islamia High School, Attock" },
        { name: "Chakwal", phone: "0543-553279", covers: "Tehsil Chowk, Zila Council Plaza, Chakwal" },
        { name: "Jhelum", phone: "0544-920169", covers: "GTS Chowk, Jhelum Cantt" },
      ],
      officesNote:
        "IESCO also publishes a mobile number for each customer centre (the 0319-599xxxx series) alongside the landlines above.",
    },
  },

  fesco: {
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "http://mis.fesco.com.pk/fescoweb/old.fesco.com.pk/customer-contact-us.asp",
      helpline: "118",
      sms: "8118",
      uan: "0800-66554",
      uanNote: "FESCO publishes a toll-free UAN alongside 118 — one of the few DISCOs that does.",
      whatsapp: null,
      portal: CCMS,
      headOffice: V("FESCO head office street address, from fesco.com.pk"),
      offices: [],
      officesNote: V("FESCO circle/customer-service-centre numbers for Faisalabad, Sargodha, Jhang, Mianwali and Toba Tek Singh, from fesco.com.pk"),
    },
  },

  gepco: {
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "https://www.gepco.com.pk/crc.aspx",
      helpline: "118",
      sms: "8118",
      whatsapp: null,
      portal: CCMS,
      headOffice: V("GEPCO head office street address, from gepco.com.pk"),
      offices: [
        { name: "Model Town Sub-Division, Gujranwala-1", phone: "055-9200545", covers: "Model Town, Gujranwala" },
        { name: "City Sub-Division, Gujranwala-1", phone: "055-9200579", covers: "Gujranwala city" },
        { name: "Civil Lines Sub-Division, Gujranwala-2", phone: "055-9200543", covers: "Civil Lines, Gujranwala" },
        { name: "Sheranwala Bagh Sub-Division, Gujranwala-2", phone: "055-9200806", covers: "Sheranwala Bagh" },
        { name: "Kamoke Sub-Division No. 1", phone: "055-6815029", covers: "Kamoke" },
        { name: "Nowshera Virkan Sub-Division No. 1", phone: "055-6760015", covers: "Nowshera Virkan" },
      ],
      officesNote:
        "GEPCO publishes a direct number for every sub-division Customer Relations Centre — the list above is a sample of the Gujranwala and Kamoke circles.",
    },
  },

  mepco: {
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "https://mepco.com.pk/contact/ and /customer-care/",
      helpline: "118",
      sms: "8118",
      whatsapp: "0319-9757789",
      whatsappNote: "The number MEPCO publishes for its Complaint Cell.",
      portal: CCMS,
      headOffice: V("MEPCO head office street address in Multan, from mepco.com.pk/contact"),
      offices: [],
      officesNote:
        "MEPCO publishes per-circle contact lists as downloadable PDFs for Multan, DG Khan, Vehari, Bahawalpur, Sahiwal, Rahim Yar Khan, Muzaffargarh, Bahawalnagar and Khanewal at mepco.com.pk/contact.",
    },
  },

  lesco: {
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "https://www.lesco.gov.pk/",
      helpline: "118",
      sms: "8118",
      whatsapp: "0320-0520888",
      whatsappNote: "The complaint number LESCO publishes on its own homepage.",
      portal: { ...CCMS, url: "http://ccms.pitc.com.pk/complaint" },
      headOffice: V("LESCO head office street address in Lahore, from lesco.gov.pk"),
      offices: [],
      officesNote: V("LESCO circle offices for Lahore, Kasur, Sheikhupura, Nankana Sahib and Okara, from lesco.gov.pk"),
    },
  },

  // Sites unreachable or not publishing these details at the time of checking.
  hesco: {
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "https://www.hesco.gov.pk/complaint.asp (reachable; numbers not published in machine-readable form)",
      helpline: "118",
      sms: "8118",
      whatsapp: null,
      portal: CCMS,
      headOffice: V("HESCO head office street address in Hyderabad, from hesco.gov.pk/contactus.asp"),
      offices: [],
      officesNote: V("HESCO circle office numbers for Hyderabad, Mirpurkhas, Badin, Thatta and Dadu, from hesco.gov.pk (see its Complaint Cell PDF)"),
    },
  },
  sepco: {
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "https://www.sepco.com.pk/complaint_managemanet_cell",
      helpline: "118",
      sms: "8118",
      whatsapp: null,
      portal: CCMS,
      headOffice: V("SEPCO head office street address in Sukkur, from sepco.com.pk"),
      offices: [],
      officesNote: V("SEPCO Complaint Management Cell numbers for Sukkur, Larkana, Shikarpur, Jacobabad and Khairpur, from sepco.com.pk/complaint_managemanet_cell"),
    },
  },
  qesco: {
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "qesco.com.pk did not respond when checked",
      helpline: "118",
      sms: "8118",
      whatsapp: null,
      portal: CCMS,
      headOffice: V("QESCO head office street address in Quetta"),
      offices: [],
      officesNote: V("QESCO circle offices for Quetta, Kalat, Sibi, Zhob, Mastung and Khuzdar — qesco.com.pk was unreachable when checked, so try again or use the NEPRA licensee record"),
    },
  },
  tesco: {
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "tesco.org.pk returned an almost empty page when checked",
      helpline: "118",
      sms: "8118",
      whatsapp: null,
      portal: CCMS,
      headOffice: V("TESCO head office street address in Peshawar"),
      offices: [],
      officesNote: V("TESCO office numbers for the Khyber, Kurram, Bajaur, Mohmand, Orakzai and Waziristan districts"),
    },
  },
  hazeco: {
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "hazeco.com.pk did not respond when checked",
      helpline: "118",
      sms: "8118",
      whatsapp: null,
      portal: CCMS,
      headOffice: V("HAZECO head office street address in Abbottabad"),
      offices: [],
      officesNote: V("HAZECO office numbers for Abbottabad, Mansehra, Haripur, Battagram and Kohistan"),
    },
  },
  ajk: {
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "not published in machine-readable form",
      helpline: V("the AJK Electricity Department complaint number — 118 is the mainland DISCO line and may not apply in Azad Kashmir"),
      sms: null,
      whatsapp: null,
      portal: null,
      headOffice: V("AJK Electricity Department head office address in Muzaffarabad"),
      offices: [],
      officesNote: V("AJK Electricity Department divisional offices for Muzaffarabad, Mirpur, Kotli, Bagh and Rawalakot"),
    },
  },
};

export const complaintsFor = (code) => DISCO_CONTENT[code]?.complaints || null;
