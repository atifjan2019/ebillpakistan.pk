// Per-company content for the 12 DISCO pages.
//
// This file exists to kill the doorway-page pattern. The old pages rendered one
// template with the company name interpolated; what makes two pages genuinely
// different is DATA, not prose, so every differentiating fact lives here and the
// template in app/[slug]/page.js is deliberately thin.
//
// SOURCING RULE (see /editorial-policy):
//   • Phone numbers, addresses and portals are copied from that company's own
//     website, with the page recorded in `verifiedFrom` and the date in
//     `verifiedOn`. Nothing is inferred from another DISCO or a directory site.
//   • Historical and structural facts (which WAPDA board a company replaced,
//     which districts it covers, what its region's load looks like) are stated
//     where they are stable and well established.
//   • Anything volatile or unconfirmed — consumer counts, exact street
//     addresses, formation years I could not verify — is a {{VERIFY: ...}},
//     which lib/verify.js suppresses in production rather than shipping braces.
//
// Contact details verified on 16 August 2026 by fetching each company's own site.

const NATIONAL = {
  helpline: "118",
  sms: "8118",
  note: "The national power-distribution complaint line, shared by every DISCO.",
};

const CCMS = {
  name: "PITC Complaint Management System (CCMS)",
  url: "https://ccms.pitc.com.pk/complaint",
  note: "Gives you a ticket number — keep it, it is what lets you escalate.",
};

const CITIZEN_PORTAL = {
  name: "Prime Minister's Citizen Portal",
  url: "https://citizenportal.gov.pk/",
  note: "Government-wide escalation when a DISCO complaint goes unresolved.",
};

export const SHARED_CHANNELS = { NATIONAL, CCMS, CITIZEN_PORTAL };

const V = (what) => `{{VERIFY: ${what}}}`;

export const DISCO_CONTENT = {
  // ─────────────────────────────────────────────────────────────── LESCO
  lesco: {
    seo: {
      title: "LESCO Bill Check {year} — Lahore Electricity Bill, Slabs & Complaint Numbers",
      description:
        "Check your LESCO bill by reference number, see which tariff band your units fall in, and get LESCO's own complaint numbers for Lahore, Kasur, Sheikhupura, Nankana Sahib and Okara.",
    },
    intro:
      "LESCO supplies the densest urban network in Pakistan, and its bills reflect it: high-rise and shared-meter connections, a large commercial base around the old city, and the country's most active theft-detection programme.",
    coverage: {
      paras: [
        "LESCO's territory is compact by Pakistani standards but carries an enormous number of connections. It covers Lahore district itself plus Kasur, Sheikhupura, Nankana Sahib and Okara — five districts, of which Lahore alone accounts for the majority of the load. That concentration is the defining feature of the network: where QESCO runs thin lines across hundreds of kilometres of desert, LESCO runs very heavy load through a small, congested area.",
        "The mix is unusually urban. Domestic connections dominate by count, but Lahore's commercial density — markets, plazas, small manufacturing in Badami Bagh and Kot Lakhpat — means a large share of revenue comes from commercial and industrial tariffs. The outer districts are the opposite: Okara and Nankana Sahib are heavily agricultural, with tubewell connections whose load is seasonal and concentrated in the sowing months.",
        "Because the boundary with FESCO runs between Okara and Sahiwal, and with GEPCO north of Sheikhupura, consumers near those lines sometimes assume they are on the wrong company. The name printed on your bill is authoritative — geography near a boundary is not.",
      ],
    },
    billLayout: {
      paras: [
        "On a LESCO bill the 14-digit reference number sits at the top-left, directly beneath the consumer name and address block, labelled Reference No. The billing month and issue date sit to its right, and the units consumed appear in the readings panel alongside the previous and current meter readings — comparing those two is the fastest way to tell a real reading from an estimate.",
        "The charges column runs down the right-hand side, with the two totals — payable within due date and payable after due date — boxed at the bottom. LESCO bills carry the standard NEPRA line items; where they differ from a rural DISCO's is in how often a detection or arrears line appears, because Lahore's theft-detection activity is the most intensive in the country.",
      ],
      image: V("annotated LESCO bill image showing where the reference number, units and due date sit"),
    },
    payments: {
      paras: [
        "LESCO consumers have the widest set of payment options of any DISCO, simply because Lahore's banking coverage is the densest. JazzCash and Easypaisa both accept LESCO bills through their electricity bill sections, and every major bank app — HBL, MCB, UBL, Meezan, Bank Alfalah — lists LESCO as a biller. Wallet and app payments normally reflect on the official system within 24 to 48 hours.",
        "Over-the-counter payment at designated bank branches is still widely used and posts fastest, usually the same working day. Keep the stamped counter copy until the payment shows against your reference number, because the receipt is the only proof you have if it does not.",
      ],
      items: [
        { label: "Processing time", text: "Counter payments typically post the same working day; wallet and app payments within 24–48 hours. A bill showing as unpaid the day after you paid is normal, not an error." },
      ],
    },
    outages: {
      paras: [
        "Lahore's outages divide into two kinds and it is worth knowing which you have before you complain. A fault — a blown transformer, a tripped feeder, a cable failure — affects your street or grid and is reported to LESCO. Scheduled load management affects a whole feeder on a published rota. The two get different answers from the same helpline, so say which you are reporting.",
        "Summer is the pressure point. Lahore's peak demand is air-conditioning-driven and concentrated between late afternoon and midnight, which is when transformer failures cluster. Faults during that window take longer to attend simply because the queue is longer.",
      ],
      items: [
        { label: "Where the schedule is published", text: V("the LESCO load-management schedule page URL on lesco.gov.pk") },
      ],
    },
    background: {
      paras: [
        "LESCO was created in 1998 when WAPDA's power wing was unbundled into separate distribution companies, taking over the network of the former Lahore Area Electricity Board and incorporating as a public limited company. It has no generation of its own: like every distribution company it buys power from the national system and its job is delivery, metering and billing.",
        "Serving the provincial capital gives LESCO a political visibility the other DISCOs do not have, and its performance — recovery rates, losses, load-shedding hours — is reported nationally in a way that a Sukkur or Zhob figure never is.",
      ],
      items: [
        { label: "Approximate connections", text: V("LESCO's current number of consumer connections, from its annual report or NEPRA's State of Industry report") },
      ],
    },
    faqs: [
      ["Why does my LESCO bill show a detection or arrears line I don't recognise?", "LESCO runs the most active theft-detection programme of any distribution company, and a detection charge is raised when an inspection concludes that units were consumed but not metered — a tampered meter, a direct hook, or a bypass on a shared connection. If one appears on your bill and you dispute it, it is contested through LESCO's own complaint route, not through the billing website. Ask for the inspection report that supports the charge."],
      ["I live near Okara or Sheikhupura — am I on LESCO or another company?", "The boundary with FESCO runs between Okara and Sahiwal, and the boundary with GEPCO sits north of Sheikhupura, so consumers close to either line often guess wrong. Do not guess from geography: the company name is printed on your bill, and your reference number only returns a result on the company that actually issued it."],
      ["My flat shares a meter with other units in the building. Whose bill is it?", "The bill belongs to the connection, not to a person, so a shared meter produces one bill for the whole connection regardless of how many households sit behind it. This is common in Lahore's apartment blocks. Splitting it is a private arrangement between occupants; getting a separate bill requires a separate metered connection from LESCO."],
      ["Which number should I call for a LESCO complaint?", "LESCO publishes 0320-0520888 on its own homepage for complaints, alongside the national 118 line. For anything you want a record of, use the CCMS portal instead — it issues a ticket number, and a ticket number is what makes escalation possible."],
      ["Why is my Lahore bill higher than a relative's in a smaller city on the same units?", "It should not be, on the energy charge: tariff rates are notified by NEPRA and apply identically across the mainland distribution companies. If two bills with the same units differ, the cause is almost always a different slab position, a different protected/unprotected status, arrears carried forward, or a fixed-charge band — not the city."],
      ["Does LESCO generate the electricity I use in Lahore?", "No. LESCO owns no power stations. It buys from the national system and its role is delivery, metering and billing. That is also why LESCO cannot change your tariff — the rates are set by NEPRA and notified centrally, and LESCO applies them."],
    ],
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "https://www.lesco.gov.pk/",
      intro: "Lahore's complaint volume is the highest in the country, so a ticket number matters more here than anywhere else — it is what lets you escalate a case that stalls.",
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

  // ─────────────────────────────────────────────────────────────── IESCO
  iesco: {
    seo: {
      title: "IESCO Bill Check {year} — Islamabad & Rawalpindi Bill, Customer Centres & Tariff Bands",
      description:
        "Check your IESCO bill by reference number and find IESCO's own customer centres — Blue Area, G-9, Marrir Hassan, Taxila, Attock, Chakwal and Jhelum — with addresses and direct numbers.",
    },
    intro:
      "IESCO is the only distribution company serving a federal capital, and it is the one that publishes the most usable contact directory: a named customer centre, with an address and a direct line, for each part of its territory.",
    coverage: {
      paras: [
        "IESCO covers the Potohar plateau: Islamabad Capital Territory, Rawalpindi, Attock, Chakwal and Jhelum, reaching into parts of Khyber Pakhtunkhwa at its western edge. The territory is genuinely mixed in a way few DISCOs are — a planned capital with underground distribution in the sectors, a dense and much older cantonment and city network in Rawalpindi, and thinly populated rain-fed farmland across Chakwal and Attock.",
        "Islamabad's sector grid makes fault-finding comparatively straightforward: sectors map cleanly onto feeders. Rawalpindi is the opposite — the older parts of the city grew without a plan, and a fault in Raja Bazaar or Marrir Hassan can take longer to isolate than the same fault in G-9. That difference shows up in restoration times more than in anything printed on your bill.",
        "The plateau also gives IESCO a winter load that most of Pakistan does not have. Murree and the higher parts of the territory pull heating load in December and January, so IESCO's demand curve has two seasonal peaks rather than one summer spike.",
      ],
    },
    billLayout: {
      paras: [
        "IESCO bills follow the standard PITC layout: the reference number at the top-left under the name and address, the readings panel in the middle showing previous and current readings alongside units consumed, and the charges stacked on the right ending in the two totals.",
        "One thing worth checking on an Islamabad bill specifically: sector-based addresses are frequently abbreviated in the address block, and a mis-keyed sector does not affect billing but does affect where a meter reader is sent. If your address line is wrong, correct it at a customer centre — the list below gives the one nearest you.",
      ],
      image: V("annotated IESCO bill image showing where the reference number, units and due date sit"),
    },
    payments: {
      paras: [
        "Banking coverage across Islamabad and Rawalpindi is the best in the country, so every mainstream channel works: JazzCash, Easypaisa, all major bank apps, ATMs and counter payment at designated branches. IESCO consumers are also the most likely to be able to pay in person at a customer centre, because the centre network is genuinely distributed rather than concentrated at head office.",
        "Payment posts to the official system on the usual timetable — same working day for counter payments, one to two days for wallets and apps. If you have paid and the bill still shows as due, keep the receipt and check again the following day before raising it.",
      ],
    },
    outages: {
      paras: [
        "IESCO's outage pattern is seasonal at both ends of the year. Summer brings the familiar air-conditioning peak; winter brings a heating load across the Potohar plateau and, in Murree and the higher areas, weather-driven faults — snow and wind on overhead lines rather than overloaded transformers.",
        "That second category matters for expectations. A winter fault in the hills is a physical line repair in bad conditions, and restoration is slower than a transformer swap in a city sector. Report it the same way, but the realistic timeline is different.",
      ],
      items: [
        { label: "Where the schedule is published", text: V("the IESCO load-management / shutdown schedule page URL on iesco.com.pk") },
      ],
    },
    background: {
      paras: [
        "IESCO was formed in 1998 in the unbundling of WAPDA's power wing, taking over the former Islamabad Area Electricity Board's network. Supplying the federal capital means its reliability is scrutinised closely, and it has historically reported among the lowest distribution losses and highest recovery rates of the distribution companies.",
        "Like every DISCO it owns no generation. Its proximity to Tarbela and the Ghazi Barotha complex is a matter of geography rather than supply: power from those stations enters the national grid, not IESCO's network directly.",
      ],
      items: [
        { label: "Approximate connections", text: V("IESCO's current number of consumer connections, from its annual report or NEPRA's State of Industry report") },
      ],
    },
    faqs: [
      ["Which IESCO customer centre should I go to?", "IESCO publishes a named centre with an address and direct line for each part of its territory — Blue Area and G-9 in Islamabad, Marrir Hassan and Chandni Chowk in Rawalpindi, and centres at Taxila, Attock, Chakwal, Jhelum, Fateh Jang and Chakri. Go to the one covering your address rather than head office; the centres handle meter, reading and address corrections directly."],
      ["My Islamabad address is wrong on the bill. Does it affect what I pay?", "No — billing follows the reference number and the meter reading, not the address text. But a wrong or badly abbreviated sector address does affect where a meter reader is sent, which is a common cause of estimated readings in the sectors. Correct it at your customer centre."],
      ["Why is my IESCO bill high in winter when I don't use air conditioning?", "The Potohar plateau and especially Murree carry a real winter heating load, which is unusual in Pakistan — most DISCOs see a single summer peak. Electric heaters and immersion rods are heavy loads, and a December bill in the hills can rival a July bill in the city."],
      ["I'm in Rawalpindi Cantt — is that IESCO or a cantonment board supply?", "IESCO distributes electricity across Rawalpindi including the cantonment areas; the cantonment board handles municipal services, not your electricity connection. Your bill will name IESCO, and IESCO's Rawalpindi Cantt circle is the operational unit for it."],
      ["Restoration in Rawalpindi seems slower than in Islamabad. Why?", "Islamabad's sector layout maps cleanly onto feeders, so a fault can be isolated quickly. The older parts of Rawalpindi grew without that structure, and tracing a fault through a dense unplanned network genuinely takes longer. It is a difference in the network, not in priority."],
      ["Does IESCO get its power from Tarbela because it is nearby?", "No. Tarbela and Ghazi Barotha feed the national grid, and IESCO buys from the national system like every other distribution company. Being close to a power station does not give a DISCO cheaper or more reliable supply, and it is not a reason your tariff would differ."],
    ],
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "https://www.iesco.com.pk/contact and /customer-centers",
      intro: "IESCO publishes a fuller contact directory than any other DISCO — a named centre with an address and direct line for each area, which is worth using instead of the national line.",
      helpline: "118",
      sms: "8118",
      whatsapp: null,
      portal: CCMS,
      headOffice:
        "IESCO Head Office, Street 40, Sector G-7/4, Islamabad — 051-9252937, 051-9252938, 051-9252939 (fax 051-9252927)",
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

  // ─────────────────────────────────────────────────────────────── MEPCO
  mepco: {
    seo: {
      title: "MEPCO Bill Check {year} — Multan & South Punjab Bill, 13 Districts, Complaint Cell",
      description:
        "Check your MEPCO bill by reference number. Pakistan's largest distribution company by consumers: 13 south Punjab districts, heavy tubewell load, and MEPCO's own complaint cell number.",
    },
    intro:
      "MEPCO has more consumers than any other distribution company in Pakistan, spread across thirteen districts of south Punjab — and a farming load that makes its demand curve look unlike any urban DISCO's.",
    coverage: {
      paras: [
        "MEPCO's territory runs from Sahiwal in the north-east down to Rahim Yar Khan on the Sindh border and west to Dera Ghazi Khan against the Balochistan frontier — thirteen districts in all, including Multan, Bahawalpur, Bahawalnagar, Vehari, Khanewal, Lodhran, Muzaffargarh and Pakpattan. It is the largest distribution company in the country measured by number of consumers.",
        "What shapes the network is agriculture. South Punjab is dominated by irrigated farming, and agricultural tubewell connections form a far larger share of MEPCO's load than they do for LESCO or IESCO. Tubewell demand is seasonal and concentrated: it climbs sharply through the sowing and irrigation months and falls away afterwards, which gives MEPCO a very different annual demand curve from a city network.",
        "The distances are also real. A single MEPCO circle can span an area that would contain several LESCO circles, and long rural feeders mean more line length per consumer, higher technical losses and longer restoration times for a fault at the far end of a feeder.",
      ],
    },
    billLayout: {
      paras: [
        "MEPCO bills use the standard PITC layout — reference number top-left, readings panel with previous and current meter readings, charges down the right ending in the two totals.",
        "On an agricultural connection the tariff code in the header is the line to check first: agricultural tariffs are structured differently from domestic ones, and a connection billed on the wrong category is the most consequential error that can appear on a MEPCO bill. If the tariff code does not match how the connection is actually used, raise it with the circle office rather than treating it as a reading dispute.",
      ],
      image: V("annotated MEPCO bill image showing where the reference number, units and due date sit"),
    },
    payments: {
      paras: [
        "In the district towns every normal channel works — JazzCash, Easypaisa, bank apps, ATMs and counter payment. Further out, mobile wallets do more work than bank branches simply because agent coverage reaches further than branch coverage across rural south Punjab, and an Easypaisa or JazzCash agent is often the nearest place to pay.",
        "Counter payments post fastest. Wallet and app payments normally reflect within one to two working days, which is worth remembering near a due date if you are paying from a village agent rather than a branch.",
      ],
    },
    outages: {
      paras: [
        "MEPCO's outage profile is driven by feeder length and by the irrigation season. During peak tubewell months a rural feeder can be loaded close to its limit through the day, and faults cluster accordingly. Restoration on a long rural feeder is slower than in a city because the fault has to be found along tens of kilometres of line before it can be fixed.",
        "Dust storms and pre-monsoon winds are a second recurring cause across the southern districts, bringing down conductors and cross-arms in a way that is genuinely weather-driven rather than a capacity problem.",
      ],
      items: [
        { label: "Where the schedule is published", text: V("the MEPCO load-management schedule page URL on mepco.com.pk") },
      ],
    },
    background: {
      paras: [
        "MEPCO was created in 1998 out of WAPDA's Multan Area Electricity Board when the power wing was unbundled into separate distribution companies. Its scale is the notable thing: covering thirteen districts, it serves more consumers than any other distribution company in Pakistan, which makes its performance figures disproportionately important to the national picture.",
      ],
      items: [
        { label: "Approximate connections", text: V("MEPCO's current number of consumer connections, from its annual report or NEPRA's State of Industry report") },
      ],
    },
    faqs: [
      ["My connection is an agricultural tubewell. Is it billed differently?", "Yes — agricultural connections sit on their own tariff category with a different rate structure from domestic supply, and tubewell load is seasonal in a way domestic load is not. The tariff code printed in your bill header tells you which category the connection is on. A tubewell billed on a domestic code, or the reverse, is worth raising with your circle office promptly."],
      ["Which districts does MEPCO actually cover?", "Thirteen: Multan, Bahawalpur, Bahawalnagar, Rahim Yar Khan, Dera Ghazi Khan, Muzaffargarh, Layyah, Rajanpur, Sahiwal, Pakpattan, Vehari, Khanewal and Lodhran. It is the largest distribution company in Pakistan by consumer numbers, which is why its circle structure is more elaborate than most."],
      ["Why does restoration take longer where I live than in Multan city?", "Rural south Punjab is served by long feeders — sometimes tens of kilometres — and a fault has to be located along that line before it can be repaired. In Multan city the same fault is found in minutes. It is a function of network geography, not of priority."],
      ["How do I find the contact number for my MEPCO circle?", "MEPCO publishes per-circle contact lists as downloadable PDFs on its contact page, covering Multan, DG Khan, Vehari, Bahawalpur, Sahiwal, Rahim Yar Khan, Muzaffargarh, Bahawalnagar and Khanewal. For a complaint you want tracked, MEPCO's own complaint cell number is 0319-9757789."],
      ["My bill is much higher in the irrigation season. Is that normal?", "For a tubewell connection, yes — that is the load doing what it does. A pump running through the sowing and watering months consumes far more than the same connection idle in winter. What is worth checking is whether the rise in units matches the hours the pump actually ran; if it does not, ask for a reading verification."],
      ["Do the southern districts get worse supply than Multan?", "Supply quality across long rural feeders is genuinely more variable than in the city — more voltage fluctuation, longer restoration, more weather exposure. That is a network characteristic of a very large, thinly populated territory rather than a policy, and it is the practical trade-off of MEPCO covering thirteen districts."],
    ],
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "https://mepco.com.pk/contact/ and /customer-care/",
      intro: "MEPCO's territory is too large for one number to be useful, so it publishes contact lists per circle alongside its central complaint cell.",
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

  // ─────────────────────────────────────────────────────────────── FESCO
  fesco: {
    seo: {
      title: "FESCO Bill Check {year} — Faisalabad Electricity Bill, Toll-Free UAN 0800-66554",
      description:
        "Check your FESCO bill by reference number. Faisalabad's textile-industry network across Sargodha, Jhang, Mianwali and Toba Tek Singh — with FESCO's toll-free UAN.",
    },
    intro:
      "FESCO serves Pakistan's textile heartland, and it is one of the very few distribution companies that publishes a genuine toll-free number rather than pointing everyone at the national line.",
    coverage: {
      paras: [
        "FESCO covers Faisalabad, Sargodha, Jhang, Toba Tek Singh, Mianwali, Chiniot and Bhakkar — an area that pairs one of Pakistan's largest industrial cities with a wide belt of canal-irrigated farmland. Faisalabad itself is the anchor: the textile sector there, from spinning and weaving units to processing and dyeing, gives FESCO an industrial load share that few other distribution companies carry.",
        "That industrial concentration changes the shape of the network. Industrial connections draw steadily through the working day rather than peaking in the evening like domestic load, so FESCO's demand curve is flatter and more predictable than a purely residential DISCO's. It also means a larger share of FESCO's revenue comes from a relatively small number of high-consumption connections.",
        "Outside the city the picture reverses. Jhang, Bhakkar and the Mianwali side are agricultural and thinly populated, served by long feeders with the higher losses and slower fault restoration that go with them.",
      ],
    },
    billLayout: {
      paras: [
        "FESCO bills use the standard PITC layout: reference number top-left beneath the name and address, readings panel showing previous and current meter readings and units consumed, charges down the right, two totals boxed at the foot.",
        "On an industrial or large commercial connection the header also carries a sanctioned load figure and, on metered connections, a maximum demand indicator. Those two drive the fixed-charge portion of the bill, and a sanctioned load set far above what a unit actually draws is a standing cost worth reviewing — it is one of the few bill lines a consumer can genuinely act on.",
      ],
      image: V("annotated FESCO bill image showing where the reference number, units and due date sit"),
    },
    payments: {
      paras: [
        "Faisalabad's banking coverage is strong and every mainstream channel works: JazzCash, Easypaisa, the major bank apps, ATMs and counter payment at designated branches. Industrial consumers more commonly pay directly through corporate banking channels, which post on the same timetable as counter payments.",
        "Counter payments generally post the same working day; wallet and app payments take one to two days to reflect against your reference number.",
      ],
    },
    outages: {
      paras: [
        "FESCO's fault pattern is shaped by industrial load. Sustained heavy draw through the working day stresses transformers differently from an evening domestic peak, and failures cluster around industrial feeders during production hours rather than late at night.",
        "For a textile unit an outage is a production loss rather than an inconvenience, which is why larger consumers often maintain their own standby generation. For domestic consumers on the same feeders, the practical effect is that faults tend to be attended quickly because of who else is on the line.",
      ],
      items: [
        { label: "Where the schedule is published", text: V("the FESCO load-management schedule page URL on fesco.com.pk") },
      ],
    },
    background: {
      paras: [
        "FESCO was established in 1998 when WAPDA's power wing was unbundled, taking over the former Faisalabad Area Electricity Board's network. It has long reported among the better recovery and loss figures of the distribution companies, which is usually attributed to the mix of a compact industrial base and a comparatively well-metered urban network.",
      ],
      items: [
        { label: "Approximate connections", text: V("FESCO's current number of consumer connections, from its annual report or NEPRA's State of Industry report") },
      ],
    },
    faqs: [
      ["Does FESCO have a toll-free number?", "Yes. FESCO publishes the toll-free UAN 0800-66554 on its customer contact page, alongside the national 118 line. Very few distribution companies publish a genuine toll-free number, so it is worth using."],
      ["I run a textile unit — why are my fixed charges so high?", "Fixed charges on an industrial connection are billed per kilowatt against your sanctioned load or recorded maximum demand, whichever applies. If the sanctioned load was set for equipment you no longer run, you are paying monthly for capacity you never draw. Reviewing the sanctioned load with FESCO is one of the few genuinely actionable items on an industrial bill."],
      ["What is the MDI figure on my FESCO bill?", "Maximum Demand Indicator: the highest load your connection pulled at any point in the billing month, in kilowatts. It measures your peak draw rather than your total consumption, and on industrial and large commercial connections it feeds the fixed-charge calculation. Staggering heavy machinery start-ups lowers it."],
      ["Why does my supply seem more stable than at my relatives' in a village nearby?", "Industrial feeders in and around Faisalabad are more heavily built and more closely monitored than long rural feeders in Jhang or Bhakkar, and faults on them are attended faster because of the load behind them. It is a difference in network construction, not in tariff."],
      ["Does FESCO cover Sargodha and Mianwali as well as Faisalabad?", "Yes — FESCO's territory includes Faisalabad, Sargodha, Jhang, Toba Tek Singh, Chiniot, Mianwali and Bhakkar. The name comes from Faisalabad because that is where the load is concentrated, not because the territory stops there."],
      ["Is FESCO's tariff lower because of the industry it serves?", "No. Tariffs are notified by NEPRA and apply uniformly across the mainland distribution companies for a given consumer category. An industrial consumer pays industrial rates whether they are on FESCO or PESCO; there is no local discount for being in an industrial city."],
    ],
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "http://mis.fesco.com.pk/fescoweb/old.fesco.com.pk/customer-contact-us.asp",
      intro: "FESCO is one of the few distribution companies publishing a toll-free UAN, which is usually a faster route than the shared national line.",
      helpline: "118",
      sms: "8118",
      uan: "0800-66554",
      uanNote: "FESCO publishes this toll-free UAN alongside 118 — one of the few DISCOs that does.",
      whatsapp: null,
      portal: CCMS,
      headOffice: V("FESCO head office street address, from fesco.com.pk"),
      offices: [],
      officesNote: V("FESCO circle/customer-service-centre numbers for Faisalabad, Sargodha, Jhang, Mianwali and Toba Tek Singh, from fesco.com.pk"),
    },
  },

  // ─────────────────────────────────────────────────────────────── GEPCO
  gepco: {
    seo: {
      title: "GEPCO Bill Check {year} — Gujranwala & Sialkot Bill, Sub-Division Direct Numbers",
      description:
        "Check your GEPCO bill by reference number. Gujranwala, Sialkot, Gujrat and Narowal — and GEPCO's direct Customer Relations Centre number for each sub-division.",
    },
    intro:
      "GEPCO serves Pakistan's export-manufacturing belt, and it publishes something unusual: a direct telephone number for every sub-division Customer Relations Centre, rather than a single switchboard.",
    coverage: {
      paras: [
        "GEPCO covers Gujranwala, Sialkot, Gujrat, Narowal, Hafizabad and Mandi Bahauddin — a compact, densely populated and unusually industrialised corner of upper Punjab. The manufacturing here is distinctive: Sialkot's surgical instruments, sports goods and leather, Gujranwala's light engineering and home appliances, Gujrat's ceramics and fans. Much of it is export-oriented, and much of it runs in small and medium units rather than large plants.",
        "That structure matters for the network. Instead of a handful of very large industrial connections, GEPCO serves a great many modest commercial and light-industrial ones scattered through residential areas. Load is spread rather than concentrated, and the boundary between a domestic feeder and a commercial one is blurrier here than in Faisalabad or Karachi.",
        "Population density is high and settlements sit close together, so feeders are relatively short and fault restoration is comparatively quick — an advantage GEPCO has over the large rural territories to its south and west.",
      ],
    },
    billLayout: {
      paras: [
        "GEPCO bills follow the standard PITC layout, with the reference number at the top-left and the readings panel showing previous and current meter readings alongside units consumed.",
        "In this region a great many premises are mixed-use — a workshop on the ground floor and a home above, on one connection. The tariff code in the header determines which rate schedule applies to the whole connection, and a mixed-use premises billed on a commercial code will pay commercial rates for the domestic portion too. If your usage pattern has changed, the tariff code is the line to check.",
      ],
      image: V("annotated GEPCO bill image showing where the reference number, units and due date sit"),
    },
    payments: {
      paras: [
        "Gujranwala, Sialkot and Gujrat all have dense banking networks, and every mainstream channel works: JazzCash, Easypaisa, bank apps, ATMs and counter payment. Exporters and larger workshops typically pay through business banking, which posts on the same timetable as a counter payment.",
        "Counter payments normally post the same working day; wallet and app payments take one to two days to appear against the reference number.",
      ],
    },
    outages: {
      paras: [
        "Because settlements are close together and feeders comparatively short, GEPCO faults are usually localised and found quickly — a failed transformer affects a few streets rather than a district. The trade-off is that dense mixed-use load puts distribution transformers under sustained stress, and transformer failure is the most common fault type rather than line damage.",
        "For a small manufacturing unit, an unplanned outage is lost production, which is why the direct sub-division numbers GEPCO publishes are genuinely useful — reporting to the sub-division that owns the transformer is faster than routing through a national line.",
      ],
      items: [
        { label: "Where the schedule is published", text: V("the GEPCO load-management schedule page URL on gepco.com.pk") },
      ],
    },
    background: {
      paras: [
        "GEPCO was created in 1998 in the unbundling of WAPDA's power wing, taking over the network of the former Gujranwala Area Electricity Board. Serving an export-manufacturing region gives its reliability a direct economic weight: an outage in Sialkot is a missed shipment as often as an inconvenience.",
      ],
      items: [
        { label: "Approximate connections", text: V("GEPCO's current number of consumer connections, from its annual report or NEPRA's State of Industry report") },
      ],
    },
    faqs: [
      ["Can I call my local GEPCO office directly instead of the national line?", "Yes, and it is usually faster. GEPCO publishes a direct number for each sub-division Customer Relations Centre — Model Town, City, Civil Lines, Sheranwala Bagh, Kamoke and Nowshera Virkan among many others — so a fault can be reported to the office that actually owns the transformer."],
      ["My premises is a workshop downstairs and a home upstairs on one meter. How is it billed?", "The whole connection is billed on whichever tariff code it is registered under, so a mixed-use premises on a commercial code pays commercial rates for the domestic portion as well. Mixed-use is very common across Gujranwala and Sialkot. Separate rates require separate metered connections."],
      ["Why do transformers seem to fail so often in Gujranwala?", "Dense mixed-use load keeps distribution transformers working hard for long stretches, and sustained thermal stress is what shortens transformer life. Because settlements are close together, the failures are at least localised — a transformer fault here affects a few streets rather than a whole rural feeder."],
      ["I export from Sialkot. Does GEPCO offer an industrial supply guarantee?", "No distribution company guarantees supply to an individual consumer, which is why most export units in Sialkot maintain standby generation. What GEPCO does offer is the direct sub-division contact route, which shortens the reporting step when a fault does occur."],
      ["Does GEPCO cover Narowal and Mandi Bahauddin too?", "Yes. GEPCO's territory is Gujranwala, Sialkot, Gujrat, Narowal, Hafizabad and Mandi Bahauddin. It is one of the more compact DISCO territories, which is part of why its restoration times compare well with the larger rural companies."],
      ["Are rates higher here because of the industry?", "No. NEPRA notifies tariffs centrally and they apply uniformly across the mainland distribution companies for a given consumer category. What differs between a Sialkot workshop and a Sialkot household is the tariff category the connection sits in, not the company."],
    ],
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "https://www.gepco.com.pk/crc.aspx",
      intro: "GEPCO publishes a direct line for each sub-division Customer Relations Centre, which reaches the office that actually owns your transformer.",
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

  // ─────────────────────────────────────────────────────────────── HESCO
  hesco: {
    seo: {
      title: "HESCO Bill Check {year} — Hyderabad & Southern Sindh Bill, Tariff Bands",
      description:
        "Check your HESCO bill by reference number. Southern Sindh from Hyderabad to Badin, Thatta and Dadu — coverage, bill layout, payment channels and complaint routes.",
    },
    intro:
      "HESCO covers southern Sindh, the half of the old Hyderabad network that remained after SEPCO was carved out of it — and it serves some of the most challenging distribution geography in the country.",
    coverage: {
      paras: [
        "HESCO's territory runs from Hyderabad south and east across Mirpurkhas, Badin, Thatta, Dadu, Tando Allahyar, Tando Muhammad Khan, Matiari, Jamshoro, Sujawal and Umerkot. It is the lower half of Sindh: the Indus delta, the irrigated belt around Hyderabad and Mirpurkhas, and the arid margins running out towards the Thar desert.",
        "The mix is heavily rural and agricultural. Outside Hyderabad itself, most of the load is farming — tubewells, small processing units, and villages served by long feeders. Agricultural demand is seasonal and follows the irrigation cycle rather than the daily domestic peak that shapes an urban network.",
        "Two features of the geography make distribution genuinely hard here. The delta districts of Thatta, Sujawal and Badin are low-lying and flood-exposed, and monsoon flooding damages distribution infrastructure on a scale that has no equivalent in upper Punjab. The eastern margins towards Umerkot are arid and thinly populated, where serving a small number of consumers requires a disproportionate length of line.",
      ],
    },
    billLayout: {
      paras: [
        "HESCO bills follow the standard PITC layout — reference number top-left, readings panel with previous and current meter readings, charges down the right ending in the two totals.",
        "In rural southern Sindh, estimated readings are more common than in a city network, because reaching a scattered village meter every month is genuinely harder. The readings panel is where you catch this: if the previous and current readings look rounded, or the units are suspiciously similar month after month, the reading may be estimated rather than taken. An estimate that runs several months and is then corrected produces exactly the sudden spike people find alarming.",
      ],
      image: V("annotated HESCO bill image showing where the reference number, units and due date sit"),
    },
    payments: {
      paras: [
        "In Hyderabad and the larger district towns the full range works — JazzCash, Easypaisa, bank apps, ATMs and counter payment at designated branches. Across the rural districts mobile wallet agents matter far more than bank branches, because agent coverage reaches into villages that have no branch at all.",
        "Counter payments post fastest, generally the same working day. Wallet and app payments normally reflect within one to two working days, which is worth allowing for if you are paying close to a due date from a village agent.",
      ],
    },
    outages: {
      paras: [
        "Monsoon flooding is the defining outage risk across HESCO's delta districts. When Thatta, Sujawal or Badin flood, the damage is to physical infrastructure — poles, conductors, transformers, sometimes whole sections of feeder — and restoration is a rebuilding exercise measured in days rather than a fault call measured in hours.",
        "Outside flood season the ordinary pattern applies: summer peak load, transformer failures, and long rural feeders that take time to patrol when a fault occurs somewhere along their length.",
      ],
      items: [
        { label: "Where the schedule is published", text: V("the HESCO load-management / shutdown schedule page URL on hesco.gov.pk") },
      ],
    },
    background: {
      paras: [
        "HESCO was formed in 1998 when WAPDA's power wing was unbundled, taking over the former Hyderabad Area Electricity Board. Its territory was later reduced when the northern Sindh districts were separated into SEPCO as a distinct company, leaving HESCO with southern Sindh.",
      ],
      items: [
        { label: "When SEPCO was separated", text: V("the year SEPCO was carved out of HESCO, from a NEPRA determination or the SEPCO/HESCO annual report") },
        { label: "Approximate connections", text: V("HESCO's current number of consumer connections, from its annual report or NEPRA's State of Industry report") },
      ],
    },
    faqs: [
      ["Is my area on HESCO or SEPCO?", "HESCO serves southern Sindh — Hyderabad, Mirpurkhas, Badin, Thatta, Dadu, Tando Allahyar, Tando Muhammad Khan, Matiari, Jamshoro, Sujawal and Umerkot. SEPCO serves the northern districts around Sukkur and Larkana. The two were one company until the northern districts were separated out, so older residents sometimes still refer to both as Hyderabad. Your bill names the right one."],
      ["My reading looks estimated. How can I tell?", "Compare the previous and current meter readings printed in the readings panel across a few bills. Suspiciously round numbers, or near-identical units several months running, usually indicate an estimate rather than a physical reading. Estimates are more common across scattered rural connections. If several estimated months are then corrected at once, the correction lands as a single large bill."],
      ["What happens to my supply when the delta districts flood?", "Flooding in Thatta, Sujawal and Badin damages physical infrastructure — poles, lines and transformers — so restoration is a rebuild rather than a repair, and it is measured in days. This is the single biggest reliability factor in HESCO's southern districts and has no real equivalent in the Punjab networks."],
      ["Why do bills in my village vary so much month to month?", "Two reasons specific to this kind of network: estimated readings that later get corrected, and seasonal agricultural load if there is a tubewell on the connection. Checking the readings panel against the units billed separates the two — a correction shows up as a jump in the reading, a genuine seasonal rise does not."],
      ["Is there a HESCO number for my district, or only 118?", "HESCO publishes a Complaint Cell and district contact information on its own site, and complaints lodged through the CCMS portal generate a ticket number that can be escalated. For anything you may need to follow up, use the route that produces a ticket rather than an untracked phone call."],
      ["Does HESCO supply Karachi?", "No. Karachi is served by K-Electric, which is a separate, vertically integrated utility and not one of the twelve distribution companies. HESCO's territory begins outside Karachi's boundary and runs through the rest of southern Sindh."],
    ],
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "https://www.hesco.gov.pk/complaint.asp (reachable; numbers not published in machine-readable form)",
      intro: "Across a territory this scattered, a tracked complaint is worth far more than a phone call — use the route that issues a ticket number.",
      helpline: "118",
      sms: "8118",
      whatsapp: null,
      portal: CCMS,
      headOffice: V("HESCO head office street address in Hyderabad, from hesco.gov.pk/contactus.asp"),
      offices: [],
      officesNote: V("HESCO circle office numbers for Hyderabad, Mirpurkhas, Badin, Thatta and Dadu, from hesco.gov.pk (see its Complaint Cell PDF)"),
    },
  },

  // ─────────────────────────────────────────────────────────────── PESCO
  pesco: {
    seo: {
      title: "PESCO Bill Check {year} — Peshawar & KP Bill, 7 Circle Numbers & Complaint Cell",
      description:
        "Check your PESCO bill by reference number and reach PESCO directly: seven circle contact numbers with the areas each covers, plus PESCO's own complaint cell for Peshawar.",
    },
    intro:
      "PESCO covers most of Khyber Pakhtunkhwa and publishes the clearest circle directory of any distribution company — seven circles, each with a number and the districts it actually answers for.",
    coverage: {
      paras: [
        "PESCO serves the bulk of Khyber Pakhtunkhwa: Peshawar, Charsadda, Nowshera, Mardan, Swabi, Kohat, Hangu, Bannu, Lakki Marwat, Karak, Dera Ismail Khan, Tank, and the Malakand division including Swat, Dir, Buner and Chitral. It is one of the largest territories in the country and one of the most topographically varied.",
        "The terrain is the defining constraint. Peshawar valley distribution resembles any dense urban network, but the Malakand and Chitral side is mountain distribution — long spans, difficult access, and lines that are reached on foot or not at all in bad weather. A fault in upper Dir is a different class of problem from a fault in Hayatabad, and the restoration times reflect that honestly.",
        "PESCO's territory used to be larger. The tribal districts were separated into TESCO, and in January 2023 the Hazara division — Abbottabad, Mansehra, Haripur, Battagram and Kohistan — was carved out into HAZECO. Consumers in those areas now receive HAZECO bills, and an old PESCO reference number from before the transfer will not return a result.",
      ],
    },
    billLayout: {
      paras: [
        "PESCO bills use the standard PITC layout: reference number top-left below the name and address block, the readings panel with previous and current meter readings and units consumed, and the charges column ending in the payable-within and payable-after totals.",
        "If you are in the Hazara division and your bill still says PESCO, it is an old one. Reference numbers for those districts moved to HAZECO's structure when the company separated, and the sub-division portion of many numbers changed with it. Use the number printed on a recent bill, not one copied from a pre-2023 copy.",
      ],
      image: V("annotated PESCO bill image showing where the reference number, units and due date sit"),
    },
    payments: {
      paras: [
        "In Peshawar, Mardan and the larger towns all the usual channels work — JazzCash, Easypaisa, bank apps, ATMs and counter payment at designated branches. In the mountain districts, mobile wallet agents are frequently the only practical option, because branch coverage in upper Dir, Chitral or Kohistan is thin and the journey to one is not trivial.",
        "Counter payments post fastest, usually the same working day. Wallet and app payments normally reflect within one to two working days.",
      ],
    },
    outages: {
      paras: [
        "PESCO's outage profile splits along the same geographic line as everything else. In the Peshawar valley the causes are ordinary: overloaded transformers in summer, evening peak stress, occasional cable faults. In the mountain districts the causes are weather and terrain — snow loading, landslides, wind damage to long spans — and restoration depends on whether crews can physically reach the line.",
        "Winter is the harder season in the north, which inverts the usual Pakistani pattern. A December fault above the snow line can take substantially longer to clear than a July fault in the city, and that is a physical constraint rather than a service failure.",
      ],
      items: [
        { label: "Where the schedule is published", text: V("the PESCO load-management schedule page URL on pesco.com.pk") },
      ],
    },
    background: {
      paras: [
        "PESCO was created in 1998 when WAPDA's power wing was unbundled into distribution companies, taking over the former Peshawar Area Electricity Board's network. Its territory has since been reduced twice: once when the tribal districts were separated into TESCO, and again in January 2023 when the Hazara division became HAZECO.",
        "Khyber Pakhtunkhwa hosts substantial hydropower — Tarbela sits in the Hazara division and Warsak on the Kabul river near Peshawar — but that generation feeds the national grid rather than PESCO directly. Being near a dam does not give a distribution company cheaper power or a separate supply.",
      ],
      items: [
        { label: "Approximate connections", text: V("PESCO's current number of consumer connections, from its annual report or NEPRA's State of Industry report") },
      ],
    },
    faqs: [
      ["Which PESCO circle covers my district?", "PESCO publishes seven circles with the areas each one answers for: Peshawar (Peshawar, Charsadda, Shabqadar), Khyber (Peshawar, Nowshera, Kohat, Hangu), Mardan (Mardan, Takht Bhai), Swat (Dargai, Malakand, Buner, Timergara, Dir, Khwazakhela), Bannu (Bannu, Lakki, Karak), Swabi, and D.I. Khan (DI Khan, Tank). Calling the circle that covers you is faster than the national line."],
      ["My area moved to HAZECO. Why doesn't my old PESCO number work?", "When the Hazara division separated into HAZECO in January 2023, billing records for Abbottabad, Mansehra, Haripur, Battagram and Kohistan moved to HAZECO's own structure, and the sub-division portion of many reference numbers changed. Use the number from a recent HAZECO bill rather than an older PESCO one."],
      ["What do I do if the customer service centre doesn't answer?", "PESCO publishes a central complaint cell number for Peshawar — 0370-1341078 — specifically for when a customer service centre is not responding, and it accepts calls and WhatsApp. That is the documented escalation step before going to the CCMS portal or the Citizen Portal."],
      ["Why does restoration take so long in Dir, Chitral or the upper valleys?", "Mountain distribution involves long spans over difficult ground, and in winter the line may simply be unreachable until conditions allow. Snow loading, landslides and wind damage are the common causes, and repair depends on crews physically getting to the fault. It is a terrain constraint rather than a difference in priority."],
      ["Tarbela and Warsak are in KP. Why isn't my supply cheaper or more reliable?", "Generation from Tarbela and Warsak enters the national grid, and PESCO buys from the national system exactly like every other distribution company. Proximity to a dam has no effect on your tariff, which NEPRA sets centrally, or on your local supply, which depends on the distribution network outside your door."],
      ["Does PESCO still cover the tribal districts?", "No — the tribal districts are served by TESCO, which is a separate distribution company. PESCO's territory is the settled districts of Khyber Pakhtunkhwa, minus the Hazara division, which became HAZECO in 2023."],
    ],
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "https://pesco.com.pk/pesco-complaint-cell",
      intro: "PESCO documents an actual escalation path: the circle office first, then a central complaint cell for when a service centre does not respond.",
      helpline: "118",
      sms: "8118",
      whatsapp: "0370-1341078",
      whatsappNote:
        "PESCO Central Complaint Cell, Peshawar — the number PESCO publishes for when a customer service centre does not respond. Accepts calls and WhatsApp.",
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

  // ─────────────────────────────────────────────────────────────── QESCO
  qesco: {
    seo: {
      title: "QESCO Bill Check {year} — Quetta & All Balochistan, Sole Distributor for the Province",
      description:
        "Check your QESCO bill by reference number. QESCO is the only distribution company for the whole of Balochistan — the largest service territory in Pakistan, dominated by agricultural tubewells.",
    },
    intro:
      "QESCO is the only distribution company serving an entire province. Its territory is the largest in Pakistan by area and the thinnest by population, and its load is dominated by agricultural tubewells to a degree no other DISCO comes close to.",
    coverage: {
      paras: [
        "QESCO is the sole electricity distributor for the whole of Balochistan — every district, from Quetta and Pishin in the north to Gwadar and Turbat on the Makran coast, Khuzdar and Kalat in the centre, Zhob and Loralai in the east, and the Chagai desert to the west. No other distribution company operates in the province.",
        "Balochistan is roughly 44% of Pakistan's land area and holds around 5% of its population, and that ratio is the single most important fact about QESCO's network. Serving a scattered population across enormous distances means extraordinary line length per consumer: hundreds of kilometres of feeder can serve a handful of villages. Technical losses rise with line length, faults take a long time to locate, and the economics of distribution here are unlike anywhere else in the country.",
        "The load is also unusual in composition. Agricultural tubewells — pumping groundwater for orchards and field crops across the highlands — form a very large share of QESCO's consumption, far more than in any other territory. Their demand is seasonal, concentrated, and highly sensitive to tariff and subsidy decisions, which is why QESCO's tubewell consumers appear in national policy debate more often than any other consumer group.",
      ],
    },
    billLayout: {
      paras: [
        "QESCO bills use the standard PITC layout: the reference number at the top-left under the name and address, the readings panel showing previous and current meter readings with units consumed, and the charges column ending in the two totals.",
        "The tariff code in the header deserves particular attention on a Balochistan connection, because agricultural tubewell tariffs have been subject to specific subsidy arrangements that do not apply to domestic supply. A tubewell connection billed on the wrong category, or a domestic connection billed on an agricultural one, produces a materially different bill — and it is the single most consequential error that can appear here.",
      ],
      image: V("annotated QESCO bill image showing where the reference number, units and due date sit"),
    },
    payments: {
      paras: [
        "In Quetta and the larger district headquarters the usual channels are available — JazzCash, Easypaisa, bank apps, ATMs and counter payment. Across most of the province, though, the nearest bank branch may be a long way off, and mobile wallet agents do most of the practical work.",
        "Allow more time than you would elsewhere. Counter payments post the same working day where a counter is reachable, and wallet payments within one to two working days, but the journey to a payment point is itself often the longest part of the process in rural Balochistan.",
      ],
    },
    outages: {
      paras: [
        "Distance dominates QESCO's outage profile. A fault somewhere along a feeder running hundreds of kilometres has to be found before it can be repaired, and patrolling that line takes time no urban network needs to spend. Restoration measured in a day or more is a normal consequence of the geography rather than a sign that nothing is happening.",
        "Weather adds to it. The Balochistan highlands get genuinely cold winters with snow in Quetta, Ziarat and the northern districts, while the Makran coast and the desert west face extreme summer heat and occasional flash flooding. Both damage overhead infrastructure in places that are hard to reach.",
      ],
      items: [
        { label: "Where the schedule is published", text: V("the QESCO load-management schedule page URL — qesco.com.pk was unreachable when checked") },
      ],
    },
    background: {
      paras: [
        "QESCO was created in 1998 when WAPDA's power wing was unbundled, taking over the former Quetta Area Electricity Board's network. Uniquely among the distribution companies, its licensed territory is an entire province, which is why it is described as the sole distributor for Balochistan rather than as a regional company.",
        "Its structural position is difficult and openly acknowledged in national policy: the combination of vast distances, low population density and a heavily subsidised agricultural load makes cost recovery harder here than anywhere else in the system.",
      ],
      items: [
        { label: "Approximate connections", text: V("QESCO's current number of consumer connections, from its annual report or NEPRA's State of Industry report") },
      ],
    },
    faqs: [
      ["Is QESCO really the only electricity company in Balochistan?", "Yes. QESCO is the sole distribution company licensed for the entire province — from Quetta and Pishin to Gwadar, Turbat, Khuzdar, Zhob and the Chagai desert. Every other province is divided between several DISCOs; Balochistan is not divided at all."],
      ["Why are outages so long in rural Balochistan?", "Because of distance. A feeder here can run for hundreds of kilometres to serve a few villages, and a fault anywhere along it has to be physically located before it can be repaired. Patrolling that length takes time no city network needs to spend. Restoration measured in a day or more is a consequence of the geography."],
      ["My tubewell connection has a different rate from my house. Why?", "Agricultural tubewell supply sits in its own tariff category and has been subject to specific subsidy arrangements that do not apply to domestic connections. The tariff code in your bill header tells you which category the connection is registered under — and on a Balochistan connection that code is the most consequential line on the bill."],
      ["Does Balochistan get less electricity than other provinces?", "Supply comes from the national grid, which QESCO buys from like every distribution company. What differs is the network: very long feeders, high technical losses and difficult access mean the delivered reliability is genuinely lower, particularly in the remote districts. That is a distribution constraint, not a provincial allocation."],
      ["Winter bills in Quetta are high. Is that normal?", "Quetta, Ziarat and the northern highlands get real snow and cold, so electric heating load in winter is substantial — the opposite pattern to most of Pakistan, where the peak is a summer air-conditioning load. A high December or January bill in the Balochistan highlands is usually heating, not an error."],
      ["Whom do I contact about a QESCO connection problem?", "The national 118 line and the CCMS complaint portal both cover QESCO, and the portal issues a ticket number that can be escalated — worth using given the distances involved. QESCO's own website did not respond when we last checked it, so we have not published its direct numbers rather than publish ones we could not verify."],
    ],
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "qesco.com.pk did not respond when checked",
      intro: "Given the distances involved in Balochistan, use the route that issues a ticket number — an untracked call is hard to follow up from a remote district.",
      helpline: "118",
      sms: "8118",
      whatsapp: null,
      portal: CCMS,
      headOffice: V("QESCO head office street address in Quetta"),
      offices: [],
      officesNote: V("QESCO circle offices for Quetta, Kalat, Sibi, Zhob, Mastung and Khuzdar — qesco.com.pk was unreachable when checked, so try again or use the NEPRA licensee record"),
    },
  },

  // ─────────────────────────────────────────────────────────────── SEPCO
  sepco: {
    seo: {
      title: "SEPCO Bill Check {year} — Sukkur & Northern Sindh Electricity Bill",
      description:
        "Check your SEPCO bill by reference number. Northern Sindh from Sukkur and Larkana to Jacobabad, Shikarpur, Khairpur and Ghotki — coverage, bill layout and complaint routes.",
    },
    intro:
      "SEPCO serves northern Sindh, the territory separated out of HESCO to give the upper districts their own distribution company — and it operates in some of the hottest inhabited country in the world.",
    coverage: {
      paras: [
        "SEPCO covers the northern Sindh districts: Sukkur, Larkana, Shikarpur, Jacobabad, Khairpur, Ghotki, Kashmore, Kandhkot, Qambar Shahdadkot and Naushahro Feroze. The Indus runs through the middle of it and the Sukkur barrage anchors an irrigation system that shapes almost all the economic activity in the region.",
        "The load follows the canals. Agricultural connections — tubewells, rice and wheat processing, small agro-industry around Larkana and Shikarpur — dominate outside the towns, and their demand tracks the irrigation calendar rather than a daily domestic peak. Sukkur itself is the main urban and commercial centre, with a denser and more conventional distribution network.",
        "Jacobabad regularly records some of the highest temperatures anywhere in the world, and that is not a statistical curiosity for a distribution company: sustained extreme heat drives cooling load to its maximum at exactly the time transformers are least able to shed heat. Summer failures here are a thermal problem before they are anything else.",
      ],
    },
    billLayout: {
      paras: [
        "SEPCO bills follow the standard PITC layout — reference number top-left, readings panel with previous and current readings and units consumed, charges down the right ending in the payable-within and payable-after totals.",
        "As across rural Sindh generally, the readings panel is the part worth checking. Scattered village connections are harder to read every month, estimated readings are correspondingly more common, and a run of estimates followed by an actual reading produces a correction that arrives as one uncomfortably large bill.",
      ],
      image: V("annotated SEPCO bill image showing where the reference number, units and due date sit"),
    },
    payments: {
      paras: [
        "Sukkur, Larkana and Khairpur have reasonable banking coverage and the standard channels all work: JazzCash, Easypaisa, bank apps, ATMs and counter payment at designated branches. Further into the rural districts, mobile wallet agents are the practical option, as they reach places bank branches do not.",
        "Counter payments post fastest, generally the same working day; wallet and app payments take one to two working days to show against the reference number.",
      ],
    },
    outages: {
      paras: [
        "Heat is the dominant factor. Through the Jacobabad and Shikarpur summer, distribution transformers run at their thermal limits for weeks at a time, and transformer failure is the most common cause of outage — not storms or line damage. A transformer that fails in that heat also takes longer to replace safely.",
        "The second recurring factor is flooding. Northern Sindh was severely affected in past monsoon seasons, and flood damage to distribution infrastructure is a rebuild rather than a repair, with restoration measured in days.",
      ],
      items: [
        { label: "Where the schedule is published", text: V("the SEPCO load-management schedule page URL on sepco.com.pk") },
      ],
    },
    background: {
      paras: [
        "SEPCO was formed by separating the northern Sindh districts out of HESCO, giving the upper half of the province its own distribution company with its head office at Sukkur. Before that, the whole of Sindh outside Karachi was billed through the Hyderabad organisation, which is why older consumers in the north sometimes still refer to it as HESCO.",
      ],
      items: [
        { label: "Year SEPCO was established", text: V("the year SEPCO was separated from HESCO, from a NEPRA determination or the SEPCO annual report") },
        { label: "Approximate connections", text: V("SEPCO's current number of consumer connections, from its annual report or NEPRA's State of Industry report") },
      ],
    },
    faqs: [
      ["My older relatives call it HESCO. Is SEPCO the same company?", "Not any more. Northern Sindh was part of HESCO until the districts around Sukkur and Larkana were separated into SEPCO as its own company. If you are in Sukkur, Larkana, Shikarpur, Jacobabad, Khairpur, Ghotki, Kashmore or Qambar Shahdadkot, your bill comes from SEPCO. The name on the bill is what counts."],
      ["Why do transformers fail so often here in summer?", "Jacobabad and the surrounding districts record some of the highest temperatures on earth, and cooling load peaks at exactly the moment a transformer is least able to dissipate its own heat. Sustained extreme heat over weeks is a thermal endurance problem, which is why summer failures here are far more common than storm damage."],
      ["Which districts does SEPCO cover?", "Sukkur, Larkana, Shikarpur, Jacobabad, Khairpur, Ghotki, Kashmore, Kandhkot, Qambar Shahdadkot and Naushahro Feroze — the northern half of Sindh. Southern Sindh, from Hyderabad down to Badin and Thatta, is HESCO's."],
      ["What happens to supply when the area floods?", "Flood damage to distribution infrastructure means poles, conductors and transformers have to be replaced rather than repaired, so restoration runs to days rather than hours. Northern Sindh has been badly affected in past monsoon seasons, and it remains the largest single reliability risk after summer heat."],
      ["My bill jumped suddenly after several similar months. Why?", "That pattern usually means several estimated readings were followed by an actual one, and the correction landed on a single bill. Compare the previous and current meter readings across those months in the readings panel — a correction shows as a jump in the reading itself, whereas genuine extra usage does not."],
      ["Does SEPCO supply Karachi or Hyderabad?", "Neither. Karachi is served by K-Electric, a separate utility, and Hyderabad and southern Sindh are HESCO's. SEPCO's territory is strictly the northern districts, with its head office at Sukkur."],
    ],
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "https://www.sepco.com.pk/complaint_managemanet_cell",
      intro: "SEPCO runs a Complaint Management Cell; for anything you may need to chase, use a route that issues a ticket number.",
      helpline: "118",
      sms: "8118",
      whatsapp: null,
      portal: CCMS,
      headOffice: V("SEPCO head office street address in Sukkur, from sepco.com.pk"),
      offices: [],
      officesNote: V("SEPCO Complaint Management Cell numbers for Sukkur, Larkana, Shikarpur, Jacobabad and Khairpur, from sepco.com.pk/complaint_managemanet_cell"),
    },
  },

  // ─────────────────────────────────────────────────────────────── TESCO
  tesco: {
    seo: {
      title: "TESCO Bill Check {year} — Tribal Districts Electricity Bill, Khyber to Waziristan",
      description:
        "Check your TESCO bill by reference number. The distribution company for Khyber Pakhtunkhwa's merged tribal districts — Khyber, Kurram, Bajaur, Mohmand, Orakzai and Waziristan.",
    },
    intro:
      "TESCO is the distribution company for the merged tribal districts, and it operates under conditions — terrain, security and a network rebuilt after years of disruption — that no other DISCO faces.",
    coverage: {
      paras: [
        "TESCO serves the merged tribal districts of Khyber Pakhtunkhwa: Khyber, Kurram, Bajaur, Mohmand, Orakzai, North Waziristan and South Waziristan, together with the frontier regions attached to them. These are the districts that until 2018 were the Federally Administered Tribal Areas, and their merger into Khyber Pakhtunkhwa changed their administrative status without changing the physical difficulty of serving them.",
        "The terrain is mountainous throughout and much of it is close to the Afghan border. Distribution here means long spans over steep ground, difficult access for construction and maintenance, and a settlement pattern of dispersed villages rather than towns. The cost of serving each consumer is correspondingly high and the network is thinner than in the settled districts next door.",
        "Much of the infrastructure is also comparatively recent, because significant parts of the network were damaged or destroyed during years of conflict and displacement and have been rebuilt since. That gives TESCO an unusual profile: newer equipment in some areas, long-neglected sections in others, and a consumer base whose relationship with metering and billing has been rebuilt alongside the lines.",
      ],
    },
    billLayout: {
      paras: [
        "TESCO bills use the standard PITC layout, with the reference number at the top-left beneath the consumer name and address and the readings panel showing previous and current meter readings alongside the units billed.",
        "Because much of the network is comparatively new or recently restored, connection and metering records in some areas are more recent than the connections themselves. If the name, address or tariff category on your bill does not match the connection as it exists now, it is worth correcting at the local office rather than ignoring — those fields drive where readings are taken and which rate schedule applies.",
      ],
      image: V("annotated TESCO bill image showing where the reference number, units and due date sit"),
    },
    payments: {
      paras: [
        "Banking infrastructure across the tribal districts is limited, and mobile wallet agents — JazzCash and Easypaisa — carry most of the practical payment load. In the district headquarters there are branches and counters; in the smaller valleys there frequently are not, and the nearest payment point may be a considerable journey.",
        "Allow extra time before a due date. Counter payments post the same working day where a counter is available; wallet payments generally reflect within one to two working days.",
      ],
    },
    outages: {
      paras: [
        "Terrain and weather drive most outages. Long spans over steep, unstable ground are exposed to landslides, snow loading and wind, and reaching a fault can require a substantial journey on difficult roads. Winter in the higher valleys is the hardest period, as it is across the northern KP districts generally.",
        "Access rather than repair is usually the binding constraint. Once a crew reaches a fault the work is ordinary; getting there is what determines how long the outage lasts.",
      ],
      items: [
        { label: "Where the schedule is published", text: V("the TESCO load-management schedule page URL — tesco.org.pk returned an almost empty page when checked") },
      ],
    },
    background: {
      paras: [
        "TESCO was established to serve the tribal areas as a distribution company separate from PESCO, which had previously covered them as part of its Peshawar territory. The tribal districts were merged into Khyber Pakhtunkhwa province in 2018, ending their separate administrative status, but TESCO has continued as the distribution company for them.",
      ],
      items: [
        { label: "Year TESCO was established", text: V("the year TESCO was created as a separate company from PESCO, from a NEPRA licence record or the TESCO annual report") },
        { label: "Approximate connections", text: V("TESCO's current number of consumer connections, from its annual report or NEPRA's State of Industry report") },
      ],
    },
    faqs: [
      ["Which districts does TESCO cover?", "The merged tribal districts of Khyber Pakhtunkhwa: Khyber, Kurram, Bajaur, Mohmand, Orakzai, North Waziristan and South Waziristan, plus the frontier regions attached to them. The settled districts around them — Peshawar, Mardan, Kohat and the rest — are PESCO's."],
      ["The tribal areas merged into KP in 2018. Why is TESCO still separate?", "The merger changed the administrative status of the districts, not the structure of the power sector. TESCO remains the licensed distribution company for them, in the same way that HAZECO covers the Hazara division within the same province. Your bill continues to come from TESCO."],
      ["Why is supply less reliable here than in Peshawar?", "The network is thinner, the spans are longer, the terrain is mountainous and access for repair crews is genuinely difficult. Peshawar is a compact valley network; a Waziristan or upper Kurram feeder is not comparable. The binding constraint on restoration is usually reaching the fault, not fixing it."],
      ["My connection is newer than my house. Why does the record look recent?", "Substantial parts of the tribal-district network were damaged or destroyed during years of conflict and displacement and have been rebuilt since, so connection and metering records in some areas date from the rebuild rather than the original supply. If the details on your bill do not match the connection as it stands, correct them at the local office."],
      ["Where can I pay if there is no bank in my valley?", "Mobile wallet agents — JazzCash and Easypaisa — reach considerably further than bank branches across the tribal districts and handle most payments in practice. District headquarters have counters. Allow one to two working days for a wallet payment to reflect, and pay before the due date rather than on it."],
      ["Is the tariff different in the tribal districts?", "No. NEPRA notifies tariffs centrally and they apply to TESCO consumers on the same basis as elsewhere for a given consumer category. What differs here is the cost of delivering the supply, which is a matter for the company and the regulator rather than something that appears on your bill."],
    ],
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "tesco.org.pk returned an almost empty page when checked",
      intro: "Where offices are distant, a tracked complaint is worth more than a call — the CCMS portal issues a ticket number you can follow up.",
      helpline: "118",
      sms: "8118",
      whatsapp: null,
      portal: CCMS,
      headOffice: V("TESCO head office street address in Peshawar"),
      offices: [],
      officesNote: V("TESCO office numbers for the Khyber, Kurram, Bajaur, Mohmand, Orakzai and Waziristan districts"),
    },
  },

  // ────────────────────────────────────────────────────────────── HAZECO
  hazeco: {
    seo: {
      title: "HAZECO Bill Check {year} — Hazara Division Bill, Abbottabad, Mansehra & Haripur",
      description:
        "Check your HAZECO bill by reference number. Pakistan's newest distribution company, separated from PESCO in January 2023 to serve Abbottabad, Mansehra, Haripur, Battagram and Kohistan.",
    },
    intro:
      "HAZECO is Pakistan's newest distribution company, carved out of PESCO in January 2023 — which makes the reference number on an older bill the single most common reason a Hazara lookup fails.",
    coverage: {
      paras: [
        "HAZECO serves the Hazara division of Khyber Pakhtunkhwa: Abbottabad, Mansehra, Haripur, Battagram, Torghar and the Kohistan districts. It is a compact territory by DISCO standards but a topographically demanding one, running from the relatively developed Haripur–Abbottabad corridor up into the high mountain valleys of Kohistan and Battagram.",
        "The lower districts are the economic centre. Haripur sits on the Islamabad corridor and carries industrial and commercial load alongside domestic supply; Abbottabad is a substantial urban and education centre. Further north the pattern changes completely to dispersed mountain villages, long spans and difficult access, with the practical constraints that go with them.",
        "Tarbela Dam sits within the Hazara division, in Haripur district. It is worth being clear that this does not give local consumers cheaper or more reliable electricity: Tarbela's output goes to the national grid, and HAZECO buys from the national system like every other distribution company.",
      ],
    },
    billLayout: {
      paras: [
        "HAZECO bills use the standard PITC layout, with the reference number at the top-left under the name and address block and the readings panel showing the previous and current meter readings alongside units consumed.",
        "The one thing specific to HAZECO is the reference number itself. When the Hazara division separated from PESCO, billing records were migrated into HAZECO's own structure and the sub-division portion of many reference numbers changed. A number copied from a pre-2023 PESCO bill will often return nothing at all. Always use the number printed on a recent HAZECO bill.",
      ],
      image: V("annotated HAZECO bill image showing where the reference number, units and due date sit"),
    },
    payments: {
      paras: [
        "Abbottabad, Haripur and Mansehra have solid banking coverage and every standard channel works: JazzCash, Easypaisa, bank apps, ATMs and counter payment at designated branches. In Kohistan and the upper valleys, wallet agents are the practical route.",
        "Counter payments post fastest, usually the same working day; wallet and app payments generally reflect within one to two working days.",
      ],
    },
    outages: {
      paras: [
        "The Hazara division's outage pattern is weather-driven and strongly seasonal. Winter snow and wind in the upper districts bring down lines and make access difficult, while the monsoon brings landslides across the mountain roads that maintenance crews depend on. Both are physical access problems rather than capacity problems.",
        "In the Haripur–Abbottabad corridor the profile is more ordinary: summer load, transformer stress and localised faults resolved on a normal timescale.",
      ],
      items: [
        { label: "Where the schedule is published", text: V("the HAZECO load-management schedule page URL — hazeco.com.pk did not respond when checked") },
      ],
    },
    background: {
      paras: [
        "HAZECO was created in January 2023, separated from PESCO to give the Hazara division its own dedicated distribution company with a head office in Abbottabad. Before that, consumers across Abbottabad, Mansehra, Haripur, Battagram and Kohistan received PESCO bills and dealt with PESCO offices in Peshawar.",
        "The stated purpose of the split was to bring billing, complaints and maintenance closer to the region rather than administering them from Peshawar. It is the most recent structural change in Pakistan's distribution sector, which is why HAZECO is far less familiar to consumers than the companies created in 1998.",
      ],
      items: [
        { label: "Approximate connections", text: V("HAZECO's current number of consumer connections, from its annual report or NEPRA's State of Industry report") },
      ],
    },
    faqs: [
      ["My old PESCO reference number doesn't work. What happened?", "When HAZECO separated from PESCO in January 2023, billing records for the Hazara division were migrated into HAZECO's own structure and the sub-division portion of many reference numbers changed. A number copied from a pre-2023 PESCO bill often returns nothing. Use the number printed on a recent HAZECO bill — it stays the same from then on."],
      ["Why was HAZECO created?", "To give the Hazara division a dedicated distribution company rather than administering it from Peshawar as part of PESCO. The separation took effect in January 2023, with a head office in Abbottabad, and was intended to bring billing, complaints and maintenance closer to the region it serves."],
      ["Which districts are on HAZECO rather than PESCO now?", "Abbottabad, Mansehra, Haripur, Battagram, Torghar and the Kohistan districts. If your home or business is in one of those, your bill now comes from HAZECO even though the meter and connection may originally have been installed under PESCO."],
      ["Tarbela Dam is in Haripur. Does that make electricity cheaper here?", "No. Tarbela's generation goes into the national grid, and HAZECO buys from the national system exactly like every other distribution company. Tariffs are notified centrally by NEPRA. Being next to a major dam has no effect on your rate or on local supply reliability."],
      ["Is HAZECO's tariff different from PESCO's?", "No. HAZECO bills on the same NEPRA-notified consumer-end tariff as the other mainland distribution companies, with the same slab bands, the same fuel price adjustment and the same taxes. The company changed; the rate schedule did not."],
      ["Why is winter supply worse in Kohistan than in Abbottabad?", "Kohistan and Battagram are high mountain districts where snow and wind damage overhead lines and where the roads maintenance crews rely on can be blocked. Abbottabad and Haripur sit lower, on better-connected corridors. The difference is access for repair, not a difference in service standard."],
    ],
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "hazeco.com.pk did not respond when checked",
      intro: "HAZECO is new enough that consumers still reach for PESCO's numbers — use HAZECO's own routes, and quote a reference number from a recent HAZECO bill.",
      helpline: "118",
      sms: "8118",
      whatsapp: null,
      portal: CCMS,
      headOffice: V("HAZECO head office street address in Abbottabad"),
      offices: [],
      officesNote: V("HAZECO office numbers for Abbottabad, Mansehra, Haripur, Battagram and Kohistan"),
    },
  },

  // ───────────────────────────────────────────────────────────────── AJK
  ajk: {
    seo: {
      title: "AJK Electricity Bill Check {year} — Azad Kashmir, Billed by a Department not a DISCO",
      description:
        "Check your Azad Jammu & Kashmir electricity bill by reference number. AJK is billed by a government department rather than a DISCO, with its tariff notified separately from NEPRA's uniform schedule.",
    },
    intro:
      "Azad Jammu & Kashmir is the one territory on this site not served by a distribution company at all: electricity there is supplied and billed by a government department, and its tariff is notified separately.",
    coverage: {
      paras: [
        "The AJK Electricity Department supplies Azad Jammu & Kashmir: Muzaffarabad, Mirpur, Kotli, Bagh, Rawalakot, Bhimber, Poonch, Sudhnoti, Neelum, Haveli and Jhelum Valley. The territory is almost entirely mountainous, from the Neelum valley in the north to the comparatively developed Mirpur–Bhimber plain in the south.",
        "The important structural point is that this is a government department, not a corporatised distribution company. LESCO, PESCO and the rest were created in 1998 as public limited companies licensed by NEPRA; AJK's supply remained a departmental function of the AJK government. That difference is not cosmetic — it affects how the tariff is set, how complaints are escalated, and why AJK sits slightly apart from the rest of the national billing arrangements even though its bills are generated through the same PITC system.",
        "Mirpur is the commercial centre and has an unusually strong overseas connection, with a large diaspora and a corresponding pattern of properties that sit empty for parts of the year. Muzaffarabad is the administrative capital. The northern valleys are sparsely populated and hard to reach, with the access constraints that implies.",
      ],
    },
    billLayout: {
      paras: [
        "AJK bills are generated through the same PITC billing system as the mainland companies, so the layout is familiar: reference number at the top-left, readings panel with previous and current meter readings, charges down the right ending in the two totals.",
        "The reference number format is the practical difference. Some older AJK bills carry a shorter number than the 14 digits standard on the mainland, which is why a lookup can fail even when the number is copied correctly. Enter it exactly as printed rather than padding it, and if an older number does not work, use one from a recent bill.",
      ],
      image: V("annotated AJK Electricity Department bill image showing where the reference number, units and due date sit"),
    },
    payments: {
      paras: [
        "In Mirpur, Muzaffarabad and the larger towns the usual channels are available — JazzCash, Easypaisa, bank apps and counter payment at designated branches. Mirpur's banking coverage is unusually good for a town of its size, largely because of the volume of overseas remittances handled there.",
        "In the northern valleys, wallet agents do most of the work. Counter payments post the same working day; wallet and app payments generally take one to two working days to reflect.",
      ],
    },
    outages: {
      paras: [
        "Terrain and weather dominate. Winter snow in the Neelum valley, Leepa and the higher parts of Poonch brings down lines and closes the roads crews need, while the monsoon brings landslides across the same routes. Restoration in the upper valleys depends on access far more than on the repair itself.",
        "The region is also seismically active, and the 2005 earthquake caused extensive damage to infrastructure across Muzaffarabad and the surrounding districts that shaped much of what has been rebuilt since.",
      ],
      items: [
        { label: "Where the schedule is published", text: V("where the AJK Electricity Department publishes its load-management schedule") },
      ],
    },
    background: {
      paras: [
        "Electricity in Azad Jammu & Kashmir is supplied by a department of the AJK government rather than by a NEPRA-licensed distribution company, which is the structural difference that sets it apart from every other territory covered on this site. Bills are produced through the PITC system used nationally, which is why an AJK bill looks like a mainland one.",
        "Mangla Dam, one of Pakistan's largest hydropower stations, sits in Mirpur district. As with Tarbela in Hazara, its output goes to the national system rather than to local consumers directly, and its presence does not translate into a lower local tariff.",
      ],
      items: [
        { label: "Current governance status", text: V("the current administrative arrangement for electricity supply in AJK — whether it remains a department or has been corporatised, and under which AJK government ministry") },
      ],
    },
    faqs: [
      ["Is AJK electricity supplied by a DISCO like LESCO or PESCO?", "No, and this is the main thing that sets it apart. The mainland distribution companies were created in 1998 as corporatised public limited companies licensed by NEPRA. Electricity in Azad Jammu & Kashmir is supplied by a department of the AJK government. Bills are produced through the same PITC system, which is why they look similar, but the organisation behind them is different."],
      ["Is the AJK tariff the same as the mainland NEPRA rates?", "Not necessarily. AJK's tariff is notified separately rather than through NEPRA's uniform schedule for the mainland distribution companies, so mainland figures should not be assumed to apply. We publish AJK rates only against a verified AJK source rather than copying the NEPRA schedule across."],
      ["My AJK reference number is shorter than 14 digits. Is that wrong?", "Not necessarily. Some older AJK bills carry a shorter reference number than the 14 digits standard on the mainland. Enter it exactly as printed rather than padding it with zeros. If an older number returns nothing, use the number from a recent bill."],
      ["Mangla Dam is in Mirpur. Why isn't electricity cheaper there?", "Mangla's generation feeds the national system rather than local consumers directly, and the AJK tariff is set through its own notification process, not by reference to nearby generation. Living next to a major dam does not reduce a tariff anywhere in Pakistan."],
      ["I live overseas and my Mirpur property is empty most of the year. Will I still get a bill?", "Yes. Fixed charges, meter rent and the PTV licence fee apply to a live connection regardless of consumption, so an unoccupied property still generates a bill — a small one, but not zero. This is a common situation in Mirpur given the size of the overseas community. Letting bills accumulate unpaid produces arrears and eventually disconnection."],
      ["Who do I complain to about an AJK electricity problem?", "Escalation runs through the AJK Electricity Department rather than through a DISCO complaint cell, and the national 118 line is set up for the mainland distribution companies. We have not published an AJK complaint number here because we could not verify one from an official source — we would rather leave it blank than send you to a wrong number."],
    ],
    complaints: {
      verifiedOn: "2026-08-16",
      verifiedFrom: "not published in machine-readable form",
      intro: "AJK escalates through a government department rather than a DISCO complaint cell, so the mainland routes do not all apply.",
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
export const contentFor = (code) => DISCO_CONTENT[code] || null;
export const faqsFor = (code) => DISCO_CONTENT[code]?.faqs || [];
export const seoFor = (code, year) => {
  const s = DISCO_CONTENT[code]?.seo;
  if (!s) return null;
  return { title: s.title.replace("{year}", year), description: s.description };
};

// The B3 sections, in page order. Kept here so the template stays thin: it maps
// over this list rather than hard-coding twelve copies of the same markup.
export const SECTIONS = [
  { key: "coverage", heading: (a) => `What ${a} covers` },
  { key: "background", heading: (a) => `How ${a} came about` },
  { key: "billLayout", heading: (a) => `Reading a ${a} bill` },
  { key: "payments", heading: (a) => `Paying a ${a} bill` },
  { key: "outages", heading: (a) => `Outages and load management on ${a}` },
];
