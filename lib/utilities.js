// Gas and telephone bills: SNGPL, SSGC and PTCL.
//
// None of these three can be looked up for the visitor the way electricity
// bills are. Checked on 26 October 2026 against each company's own portal:
//   • SNGPL's "Get Your Gas Bill" form needs an image CAPTCHA.
//   • SSGC's viewbill form needs Google reCAPTCHA.
//   • PTCL's DBill form needs an image CAPTCHA and refuses datacenter traffic.
// So these pages do the honest thing: hold the consumer number for the visitor,
// explain where it is printed, and hand them to the official portal in one tap.
// The number never leaves the visitor's device (see /privacy).
//
// Contact details below were read from each company's own website on
// 26 October 2026 (`verifiedFrom`). Nothing here is inferred.

export const UTILITIES = {
  sngpl: {
    abbr: "SNGPL",
    full: "Sui Northern Gas Pipelines Limited",
    kind: "gas",
    color: "#c92a2a",
    region: "Punjab, Khyber Pakhtunkhwa, Islamabad and Azad Kashmir",
    cities: ["Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Gujranwala", "Sialkot"],
    id: { label: "Consumer number", min: 10, max: 11, hint: "The consumer number, 10 or 11 digits, is printed at the top of your SNGPL gas bill, next to the barcode." },
    portal: {
      name: "SNGPL bill portal",
      url: "https://www.sngpl.com.pk/login.jsp?mdids=85",
      how: "Paste your consumer number, type the code shown in the picture, and the bill opens as a PDF you can save or print.",
    },
    helpline: "1199",
    email: "info@sngpl.com.pk",
    website: "https://www.sngpl.com.pk",
    verifiedFrom: "https://www.sngpl.com.pk/",
    verifiedOn: "2026-10-26",
    seo: {
      title: "SNGPL Bill Check Online {year}: Sui Northern Gas Bill by Consumer Number",
      description:
        "Check your SNGPL gas bill online with the 11-digit consumer number. Where the number is printed, how to open the duplicate bill on the official portal, SNGPL's helpline, due dates and what to do if the bill looks wrong.",
    },
    intro:
      "SNGPL pipes gas to homes across Punjab, Khyber Pakhtunkhwa, Islamabad and Azad Kashmir. Its bills are monthly, carry a consumer number rather than a reference number, and are opened on SNGPL's own portal with a picture code, so this page keeps your number ready and takes you straight there.",
    sections: [
      {
        heading: "Where the SNGPL consumer number is",
        paras: [
          "The consumer number is a 10 or 11 digit figure printed at the top of the bill beside the barcode, and it stays the same every month. It is not the meter number, which is shorter and printed lower down with the readings, and it is not the bill number, which changes monthly.",
          "If you have no bill to hand, an old bank receipt for a gas payment usually shows it, and so does the SMS SNGPL sends when a bill is issued, for consumers who registered a mobile number.",
        ],
      },
      {
        heading: "How the gas bill is worked out",
        paras: [
          "Gas is billed by energy, not by the cubic metres the meter shows. The meter reading in cubic metres is multiplied by a gas calorific value and converted to MMBTU, and the slab rate applies to that figure. That is why two houses with similar meter readings can get different bills: the conversion factor on the bill is part of the sum.",
          "Domestic slabs are set by the Oil and Gas Regulatory Authority and notified by the federal government, and a fixed monthly charge applies on top of the energy charge. The slabs are cumulative in the way electricity slabs are not: a household that crosses into a higher slab pays the higher rate on the whole consumption, which is why winter bills jump sharply once heaters and geysers run.",
        ],
      },
      {
        heading: "Paying and querying an SNGPL bill",
        paras: [
          "SNGPL bills are paid at bank branches, through banking apps, JazzCash and Easypaisa, and at SNGPL customer care centres. The due date is printed on the bill, and a late payment surcharge is added after it, so a bill paid a day late costs more than the printed amount.",
          "For a wrong reading, a missing bill or a disconnection, the helpline is 1199 and the email is info@sngpl.com.pk. Complaints can also be lodged and tracked on SNGPL's website, which issues a complaint number to quote in any follow-up.",
        ],
      },
    ],
    faqs: [
      ["Can I check my SNGPL bill without the consumer number?", "Not online. The portal needs the consumer number and the picture code. If you do not have a bill, call 1199 with your address and CNIC and SNGPL can tell you the number."],
      ["Why does the SNGPL portal ask me to type a picture code?", "It is a CAPTCHA that stops automated lookups. It is also why no third-party site, including this one, can show you the bill directly. We hold your number and take you to the portal; you type the code there."],
      ["Why is my gas bill so much higher in winter?", "Usage rises with heaters and geysers, and the domestic slabs are not telescopic: crossing into a higher slab prices the whole month's gas at the higher rate, so the bill climbs faster than the usage."],
      ["Is the consumer number the same as the meter number?", "No. The consumer number identifies your account and is 10 or 11 digits; the meter number identifies the device on your wall. Use the consumer number on the portal."],
      ["Does this site store my gas consumer number?", "Only on your own device, in your browser, so it is pre-filled next time. It is never sent to our server."],
    ],
  },
  ssgc: {
    abbr: "SSGC",
    full: "Sui Southern Gas Company Limited",
    kind: "gas",
    color: "#1971c2",
    region: "Sindh and Balochistan",
    cities: ["Karachi", "Hyderabad", "Sukkur", "Quetta", "Larkana", "Mirpurkhas"],
    id: { label: "Consumer number", min: 10, max: 10, hint: "The 10-digit consumer number is printed at the top of your SSGC bill." },
    portal: {
      name: "SSGC bill portal",
      url: "https://viewbill.ssgc.com.pk/web/",
      how: "Paste your consumer number, tick the \"I'm not a robot\" box, and the current bill opens for download or payment.",
    },
    helpline: "1199",
    phone: "021-99021000",
    email: "info@ssgc.com.pk",
    website: "https://www.ssgc.com.pk",
    verifiedFrom: "https://www.ssgc.com.pk/",
    verifiedOn: "2026-10-26",
    seo: {
      title: "SSGC Bill Check Online {year}: Sui Southern Gas Bill by Consumer Number",
      description:
        "Check your SSGC gas bill online with the 10-digit consumer number. Where the number is printed, how to open the bill on the official SSGC portal, the 1199 helpline, due dates and complaints for Karachi, Sindh and Balochistan.",
    },
    intro:
      "SSGC supplies gas to Karachi, the rest of Sindh and Balochistan. The company issues its bills through its own viewbill portal, which is protected by a reCAPTCHA, so this page keeps your 10-digit consumer number ready and opens the portal for you.",
    sections: [
      {
        heading: "Where the SSGC consumer number is",
        paras: [
          "SSGC's consumer number is 10 digits and sits at the top of the bill. Karachi consumers often also see a customer ID on SMS reminders; it is the same number. The meter number, printed with the readings, is different and is not accepted by the portal.",
          "Registered consumers can also get the bill by SMS and email from SSGC's e-bill service, which the portal page links to. It is free and removes the monthly lookup altogether.",
        ],
      },
      {
        heading: "How the gas bill is worked out",
        paras: [
          "Like SNGPL, SSGC bills in MMBTU, not cubic metres. The meter difference is converted using a calorific value printed on the bill, and the domestic slab rate applies to the result, with a fixed monthly charge on top.",
          "Because Karachi's winters are mild, most SSGC domestic bills stay in the lower slabs all year, and the fixed charge is often the larger part of a small bill. Commercial and industrial tariffs are different schedules again, with their own rates per MMBTU.",
        ],
      },
      {
        heading: "Paying and querying an SSGC bill",
        paras: [
          "Bills are paid at bank branches, through banking apps, JazzCash, Easypaisa and SSGC's own counters, and the portal offers online payment after the bill opens. Pay by the printed due date to avoid the late payment surcharge.",
          "The helpline is 1199, the Karachi head office number is 021-99021000 and the email is info@ssgc.com.pk. SSGC publishes complaint types with target resolution times on its site, and a complaint that goes unanswered can be taken to the Federal Ombudsman.",
        ],
      },
    ],
    faqs: [
      ["Can SSGC bills be checked by phone number or CNIC?", "No. The portal takes the 10-digit consumer number only. Call 1199 if you need the number traced from your address."],
      ["Why can't this site show my SSGC bill directly?", "SSGC's portal sits behind Google's reCAPTCHA, which exists to block automated lookups. We keep your number ready and open the portal; you tick the box there."],
      ["I paid but the portal still shows the bill as due. Is that a problem?", "Not usually. Bank and wallet payments take a day or two to post. Keep the receipt until the next bill shows the payment."],
      ["What is the fixed charge on an SSGC bill?", "A monthly charge that applies regardless of gas used, set by the regulator alongside the slab rates. On a low-usage Karachi bill it can be most of the total."],
      ["Does this site store my SSGC consumer number?", "Only in your own browser, so it is pre-filled next time. It never reaches our server."],
    ],
  },
  ptcl: {
    abbr: "PTCL",
    full: "Pakistan Telecommunication Company Limited",
    kind: "telecom",
    color: "#2b8a3e",
    region: "nationwide",
    cities: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Peshawar", "Quetta"],
    id: { label: "Phone number and account ID", hint: "The landline number and the account ID are both printed at the top of your PTCL bill. Enter the number with its area code but without the leading 0, so 091-6510669 becomes 916510669." },
    fields: [
      { key: "phone", label: "Phone number", placeholder: "e.g. 916510669", pattern: "[0-9]{6,11}" },
      { key: "account", label: "Account ID", placeholder: "as printed on the bill", pattern: "[0-9]{4,14}" },
    ],
    portal: {
      name: "PTCL DBill",
      url: "https://dbill.ptcl.net.pk/PTCLSearchInvoice.aspx",
      how: "Paste the phone number and account ID, type the code shown in the picture, and the invoice opens for download.",
    },
    helpline: "1218",
    email: "care@ptcl.net.pk",
    website: "https://ptcl.com.pk",
    verifiedFrom: "https://ptcl.com.pk/",
    verifiedOn: "2026-10-26",
    seo: {
      title: "PTCL Bill Check Online {year}: Landline and Broadband Bill by Phone Number",
      description:
        "Check your PTCL landline or broadband bill online with the phone number and account ID. Where both are printed, how to open the duplicate bill on PTCL DBill, the 1218 helpline, and how to query a wrong bill.",
    },
    intro:
      "PTCL bills cover the landline, broadband and any bundled services on one invoice. The duplicate bill lives on PTCL's DBill portal, which asks for the phone number, the account ID and a picture code, so this page keeps both numbers ready and opens the portal for you.",
    sections: [
      {
        heading: "Where the phone number and account ID are",
        paras: [
          "DBill's form asks for the phone number with its area code but without the leading zero, so a Peshawar number written 091-6510669 is entered as 916510669 and a Lahore number 042-35123456 as 4235123456. (An older guide page on the same portal says to leave the area code out; if one form is rejected, try the other.) The account ID is a separate number printed on the bill header, and it does not change when the tariff or package changes.",
          "If the bill is not to hand, the PTCL app and 1218 can both confirm the account ID against the phone number and the CNIC the line is registered to.",
        ],
      },
      {
        heading: "What a PTCL bill contains",
        paras: [
          "A PTCL invoice has a fixed line rent, the broadband package charge, call charges beyond any bundled minutes, and taxes: withholding tax, sales tax on services at the provincial rate, and in some cities a municipal charge. Package changes made mid-month appear pro-rated, which is the usual reason a bill differs from the advertised price.",
          "Late payment adds a surcharge and, after a further period, a temporary suspension of the service, so the due date on the invoice matters more than it does for most utility bills.",
        ],
      },
      {
        heading: "Paying and querying a PTCL bill",
        paras: [
          "Bills are paid through the PTCL app, banking apps, JazzCash, Easypaisa, ATMs and bank counters, and online from the DBill page itself. The helpline is 1218 and the email is care@ptcl.net.pk; a complaint lodged there gets a ticket number that can be tracked on PTCL's site.",
        ],
      },
    ],
    faqs: [
      ["Why can't I see my PTCL bill on this site?", "PTCL's DBill portal uses a picture code and blocks requests from servers, so no third-party site can fetch it. We hold your numbers and open DBill for you; you type the code there."],
      ["What is the prism.ptcl.net.pk link in PTCL's SMS?", "PTCL's e-bill. Each invoice gets its own link, sent by SMS and email when the bill is issued. Paste it into the e-bill box on this page and the bill is shown here, with every charge itemised and a due-date reminder, no picture code needed."],
      ["Which phone number format does DBill want?", "The form says with the area code, without the leading zero: 916510669 for a Peshawar number written 091-6510669. PTCL's older guide says to drop the area code, so if the first form is rejected, enter the number without it."],
      ["I have broadband but no landline. What do I enter?", "Every PTCL broadband service still has a line number and an account ID on the invoice. Use those; they are printed together at the top."],
      ["Does this site store my PTCL numbers?", "Only in your own browser, so they are pre-filled next time. They never reach our server."],
    ],
  },


  ke: {
    abbr: "K-Electric",
    full: "K-Electric Limited",
    kind: "electricity",
    color: "#e03131",
    region: "Karachi, Dhabeji and Gharo",
    cities: ["Karachi", "Dhabeji", "Gharo", "Hub"],
    id: { label: "Account number and consumer number", hint: "Both numbers are printed at the top of your K-Electric bill: the 14-digit account number and the consumer number beside it." },
    fields: [
      { key: "account", label: "Account number", placeholder: "14 digits", pattern: "[0-9]{8,14}" },
      { key: "consumer", label: "Consumer number", placeholder: "as printed on the bill", pattern: "[0-9A-Za-z-]{4,20}", alnum: true },
    ],
    portal: {
      name: "K-Electric duplicate bill page",
      url: "https://staging.ke.com.pk:24555/ReBrand/DuplicateBill.aspx",
      how: "Paste the account number and consumer number, type the code shown in the picture (letters are case sensitive), and the bill opens for download.",
    },
    helpline: "118",
    phone: "021-99000",
    email: "customer.care@ke.com.pk",
    website: "https://ke.com.pk",
    verifiedFrom: "https://ke.com.pk/contact-us/",
    verifiedOn: "2026-10-26",
    seo: {
      title: "K-Electric Bill Check Online {year}: KE Duplicate Bill by Account Number",
      description:
        "Check your K-Electric bill online with the account number and consumer number. Where both are printed, how to open the KE duplicate bill, the 118 helpline, why KE is not on the PITC system, and what to do about a wrong Karachi bill.",
    },
    intro:
      "K-Electric is the only electricity company in Pakistan outside the PITC billing system, which is why a Karachi reference number does nothing on the lookup above. KE keeps its own duplicate bill page, protected by a picture code, so this page holds your account and consumer numbers and opens it for you.",
    sections: [
      {
        heading: "Why K-Electric bills are different",
        paras: [
          "Every other distribution company, from LESCO to HESCO, bills through PITC, the government's shared system, which is what the 14-digit reference lookup on our homepage talks to. K-Electric was privatised in 2005 and runs its own billing, its own tariff petitions at NEPRA and its own portal. A KE bill therefore has an account number and a consumer number rather than a PITC reference, and it cannot be fetched from PITC at all.",
          "The account number is 14 digits and sits at the top of the bill; the consumer number is printed next to it. Both stay the same month to month. KE's SMS service on 8119 and its WhatsApp line on 0348-0000118 can also send the bill once the account is registered.",
        ],
      },
      {
        heading: "How a K-Electric bill is worked out",
        paras: [
          "The structure is the same as a PITC bill: units priced through NEPRA's slabs, a fuel charges adjustment that changes monthly, quarterly adjustments, fixed charges, electricity duty, GST and the PTV fee. The rates differ because KE's tariff is determined separately, and Karachi's fuel adjustments track KE's own generation mix rather than the national grid's.",
          "Protected consumer rules apply to KE's domestic consumers too: 200 units or fewer for six consecutive months keeps a household on the lower protected slabs, and a single month above it moves the whole account to the unprotected schedule.",
        ],
      },
      {
        heading: "Paying and querying a K-Electric bill",
        paras: [
          "KE bills are paid at bank branches, through banking apps, JazzCash, Easypaisa, 1LINK and KE's own app, up to the due date printed on the bill; after it a late payment surcharge applies. For a wrong reading or a billing complaint the helpline is 118, the alternative number is 021-99000, and the email is customer.care@ke.com.pk. KE's complaint tracking runs through its app and the NEPRA complaint route is open after that.",
        ],
      },
    ],
    faqs: [
      ["Why doesn't my K-Electric reference number work on ebillpakistan.pk?", "Because KE is not on PITC. The homepage lookup reads the PITC system that the other twelve companies use. KE bills live on KE's own page, which this page opens for you with your numbers ready."],
      ["Where are the account number and consumer number on a KE bill?", "At the top of the bill, printed together. The account number is 14 digits; the consumer number sits beside it. Both are needed on KE's page."],
      ["Can I get the KE bill by SMS or WhatsApp instead?", "Yes. Register once on 8119 by SMS, or save 0348-0000118 and send HI on WhatsApp; both can send the bill and the load-shedding schedule, according to KE's contact page."],
      ["Does this site store my K-Electric numbers?", "Only in your own browser, so they are pre-filled next time. They never reach our server."],
    ],
  },
  "wasa-faisalabad": {
    abbr: "WASA Faisalabad",
    full: "Water and Sanitation Agency, Faisalabad",
    kind: "water",
    color: "#1098ad",
    region: "Faisalabad",
    cities: ["Faisalabad"],
    id: { label: "Consumer number", min: 6, max: 16, hint: "Your WASA consumer number is printed at the top of the water and sewerage bill." },
    portal: {
      name: "WASA Faisalabad duplicate bill page",
      url: "https://wasafaisalabad.gop.pk/duplicate-bill/",
      how: "Paste the consumer number into the duplicate bill form and the current bill opens for download.",
    },
    phone: "041-9210049",
    email: "info@wasafaisalabad.gop.pk",
    website: "https://wasafaisalabad.gop.pk",
    verifiedFrom: "https://wasafaisalabad.gop.pk/",
    verifiedOn: "2026-10-26",
    seo: {
      title: "WASA Faisalabad Bill Check Online {year}: Water Bill by Consumer Number",
      description:
        "Check your WASA Faisalabad water and sewerage bill online with the consumer number. Where it is printed, how to open the duplicate bill on WASA's own site, the office number, and how to query a wrong bill.",
    },
    intro:
      "WASA Faisalabad bills water supply and sewerage for the city on one monthly or quarterly bill. The duplicate bill lives on WASA's own site, so this page keeps your consumer number ready and takes you there.",
    sections: [
      {
        heading: "Where the WASA consumer number is",
        paras: [
          "The consumer number is printed at the top of the bill next to the address. It identifies the property connection, so it stays the same when the occupant changes; a new owner or tenant keeps paying on the same number unless the connection is transferred.",
        ],
      },
      {
        heading: "What a WASA bill charges",
        paras: [
          "Most domestic connections in Faisalabad are unmetered and charged a flat rate set by the property's covered area and category, with a separate sewerage charge and, where a meter exists, a metered water charge. Arrears carry forward, and a surcharge applies after the due date.",
          "Because the charge is tied to the property record, a bill that looks wrong is usually a category or area problem rather than a reading problem, and it is corrected at the WASA office with the property papers rather than by a meter check.",
        ],
      },
      {
        heading: "Paying and querying a WASA Faisalabad bill",
        paras: [
          "Bills are paid at bank branches and through banking apps and wallets that list WASA Faisalabad as a biller. The office is near Allied Hospital on Jail Road, the switchboard is 041-9210049 and the email is info@wasafaisalabad.gop.pk, all as published on WASA's own site.",
        ],
      },
    ],
    faqs: [
      ["Can I see the WASA Faisalabad bill on this site?", "No. WASA's duplicate bill runs inside its own web app and cannot be fetched by another site. We keep your consumer number ready and open WASA's page for you."],
      ["Is this the same WASA as Lahore or Rawalpindi?", "No. Each city's WASA is a separate agency with its own bills and portals. This page is for Faisalabad only."],
      ["Does this site store my WASA consumer number?", "Only in your own browser, so it is pre-filled next time. It never reaches our server."],
    ],
  },
  "vehicle-punjab": {
    abbr: "Punjab vehicle check",
    title: "Punjab Vehicle Verification",
    full: "Punjab Excise, Taxation and Narcotics Control Department",
    kind: "vehicle",
    color: "#2f9e44",
    region: "Punjab",
    cities: ["Lahore", "Rawalpindi", "Faisalabad", "Multan", "Gujranwala"],
    id: { label: "Registration number", hint: "The registration number as printed on the number plate and the registration book, for example LEA-1234 or ABC-123." },
    fields: [{ key: "reg", label: "Registration number", placeholder: "e.g. LEA-1234", pattern: "[A-Za-z0-9-]{3,12}", alnum: true }],
    portal: {
      name: "Punjab MTMIS vehicle verification",
      url: "https://mtmis.excise.punjab.gov.pk/",
      how: "Paste the registration number, tick the \"I'm not a robot\" box, and the record shows the owner's name, chassis and engine numbers, token tax paid up to, and any pending tax.",
    },
    helpline: "1035",
    website: "https://excise.punjab.gov.pk",
    verifiedFrom: "https://excise.punjab.gov.pk/",
    verifiedOn: "2026-10-26",
    seo: {
      title: "Punjab Vehicle Verification and Token Tax Check Online {year} by Registration Number",
      description:
        "Check a Punjab vehicle's registration, owner name, chassis and engine numbers and token tax status online with the registration number on the official MTMIS portal, with the 1035 helpline and what the record means before you buy a used car.",
    },
    intro:
      "Punjab's Motor Transport Management Information System shows any vehicle's registration record, owner, chassis and engine numbers and token tax position from the registration number alone. It sits behind a reCAPTCHA on the Excise department's site, so this page keeps the number ready and opens the portal for you.",
    sections: [
      {
        heading: "What the MTMIS record shows",
        paras: [
          "The record returns the registration date, the owner's name and father's name, the make, model and year, the chassis and engine numbers, the vehicle's colour and category, and the token tax paid up to a given year. For a used car that is the single most useful check before money changes hands: the chassis number on the portal should match the plate on the car and the registration book.",
        ],
      },
      {
        heading: "Token tax and transfer",
        paras: [
          "Token tax is an annual provincial tax on the vehicle; the record shows the last year it was paid, and arrears must be cleared before a transfer of ownership. Punjab's e-Pay app lets the tax be paid from a phone once the registration number is entered, and the receipt updates the MTMIS record.",
          "A transfer that was never completed shows up here as the old owner's name against the car, which is the most common surprise a buyer finds. Insist on seeing the record in the seller's name before paying.",
        ],
      },
      {
        heading: "Help from the Excise department",
        paras: [
          "The department's helpline is 1035 and complaints can be lodged on excise.punjab.gov.pk. Registration and transfer work is done at the district Excise office; the portal is for checking, not for changing a record.",
        ],
      },
    ],
    faqs: [
      ["Can I check a Punjab vehicle on this site?", "No. The MTMIS portal is protected by a reCAPTCHA that only a person on that site can pass. We keep the registration number ready and open the portal for you."],
      ["What format does the registration number take?", "As on the plate, letters then digits, for example LEA-1234 or ABC-123. The portal accepts it with or without the dash."],
      ["Is a KP, Sindh or Islamabad vehicle on this portal?", "No. Each province keeps its own record. Sindh's is on the Sindh Excise site, Islamabad's on the Islamabad Excise site; this page covers Punjab plates."],
    ],
  },
  "vehicle-sindh": {
    abbr: "Sindh vehicle check",
    title: "Sindh Vehicle Verification",
    full: "Excise, Taxation and Narcotics Control Department, Government of Sindh",
    kind: "vehicle",
    color: "#e8590c",
    region: "Sindh",
    cities: ["Karachi", "Hyderabad", "Sukkur", "Larkana"],
    id: { label: "Registration number", hint: "The registration number as on the number plate, for example ABC-123 or KHI-1234." },
    fields: [{ key: "reg", label: "Registration number", placeholder: "e.g. ABC-123", pattern: "[A-Za-z0-9-]{3,12}", alnum: true }],
    portal: {
      name: "Sindh Excise vehicle search",
      url: "https://excise.gos.pk/vehicle/vehicle_search",
      how: "Paste the registration number, pass the browser check, and the record shows the owner, chassis and engine numbers and tax position.",
    },
    website: "https://excise.gos.pk",
    verifiedFrom: "https://excise.gos.pk/",
    verifiedOn: "2026-10-26",
    seo: {
      title: "Sindh Vehicle Verification and Tax Check Online {year} by Registration Number",
      description:
        "Check a Sindh vehicle's registration, owner, chassis and engine numbers and motor vehicle tax online with the registration number on the Sindh Excise portal, and what to look for before buying a used car in Karachi.",
    },
    intro:
      "Sindh's Excise department publishes vehicle records by registration number on its own portal, which runs behind a browser verification wall. This page keeps the number ready and opens the search for you.",
    sections: [
      {
        heading: "What the Sindh record shows",
        paras: [
          "The search returns the owner's name, the make, model and year, the chassis and engine numbers, registration date and the motor vehicle tax paid up to. As in Punjab, the chassis number is the thing to match against the car itself before buying.",
        ],
      },
      {
        heading: "Motor vehicle tax in Sindh",
        paras: [
          "Sindh charges an annual motor vehicle tax by engine capacity, payable online through the Excise portal and banking apps once the registration number is entered. Arrears block a transfer, so a seller's unpaid years become the buyer's problem unless cleared first.",
        ],
      },
      {
        heading: "Help from the Excise department",
        paras: [
          "Registration, transfer and tax disputes are handled at the district Excise office; the portal and the department's site at excise.gos.pk are the published points of contact.",
        ],
      },
    ],
    faqs: [
      ["Why can't this site show the Sindh record?", "The Sindh portal sits behind a browser verification wall that rejects automated requests. We keep the registration number ready and open the portal for you."],
      ["Does the search work for Karachi plates?", "Yes. Karachi, Hyderabad and every other Sindh registration is on the same portal."],
    ],
  },
  "echallan-punjab": {
    abbr: "Punjab e-challan",
    title: "Punjab E-Challan Check",
    full: "Punjab Safe Cities Authority",
    kind: "challan",
    color: "#5f3dc4",
    region: "Lahore and the Safe City districts of Punjab",
    cities: ["Lahore", "Rawalpindi", "Faisalabad", "Multan", "Gujranwala"],
    id: { label: "Plate number and CNIC or chassis number", hint: "The plate number as on the vehicle, and either the owner's CNIC or the chassis number." },
    fields: [
      { key: "plate", label: "Plate number", placeholder: "e.g. LEA-1234", pattern: "[A-Za-z0-9-]{3,12}", alnum: true },
      { key: "idno", label: "CNIC or chassis number", placeholder: "CNIC without dashes, or chassis", pattern: "[A-Za-z0-9]{6,20}", alnum: true },
    ],
    portal: {
      name: "PSCA e-challan portal",
      url: "https://echallan.psca.gop.pk/",
      how: "Paste the plate number and the CNIC or chassis number, tick the \"I'm not a robot\" box, and any camera-issued challans for the vehicle are listed with their amounts.",
    },
    website: "https://psca.gop.pk",
    verifiedFrom: "https://psca.gop.pk/",
    verifiedOn: "2026-10-26",
    seo: {
      title: "Punjab E-Challan Check Online {year}: PSCA Traffic Fines by Plate Number",
      description:
        "Check Punjab Safe City e-challans online by plate number and CNIC or chassis number on PSCA's own portal: what a camera challan is, how to pay it, how long you have, and what happens to the vehicle record if you don't.",
    },
    intro:
      "Punjab Safe Cities Authority issues traffic challans from camera evidence in Lahore and the other Safe City districts, and lists them on its e-challan portal behind a reCAPTCHA. This page keeps your plate and CNIC ready and opens the portal for you.",
    sections: [
      {
        heading: "What an e-challan is",
        paras: [
          "An e-challan is a fine issued from camera footage rather than by a warden at the roadside: a red light run, a speeding reading, a wrong-way turn or a lane violation, recorded with the time and location and matched to the plate. The notice is posted to the registered address and shows on the portal, which is often where a driver sees it first.",
        ],
      },
      {
        heading: "Paying and disputing a challan",
        paras: [
          "Challans are paid at bank branches, through the e-Pay Punjab app and banking apps once the challan number is entered. Unpaid challans attach to the vehicle's record and block the transfer of ownership, which is why a used car should be checked here as well as on the MTMIS portal.",
          "A challan that names the wrong vehicle, or where the plate was cloned, is disputed through PSCA's complaint channels on psca.gop.pk with the evidence image the portal shows.",
        ],
      },
    ],
    faqs: [
      ["Can this site show my Punjab challans?", "No. The PSCA portal is behind a reCAPTCHA that only a person on that site can pass. We keep your plate and CNIC ready and open it for you."],
      ["Do I need the CNIC or the chassis number?", "Either. The portal asks for the plate plus one of the two, so use whichever you have to hand."],
      ["Does this cover Islamabad or Karachi challans?", "No. Islamabad's are on the Islamabad Traffic Police portal, which has its own page here. Karachi traffic police do not publish an online challan search."],
    ],
  },
  "echallan-islamabad": {
    abbr: "Islamabad e-challan",
    title: "Islamabad E-Challan Check",
    full: "Islamabad Capital Territory Police",
    kind: "challan",
    color: "#1864ab",
    region: "Islamabad Capital Territory",
    cities: ["Islamabad"],
    id: { label: "Plate number", hint: "The plate number as on the vehicle." },
    fields: [{ key: "plate", label: "Plate number", placeholder: "e.g. ABC-123", pattern: "[A-Za-z0-9-]{3,12}", alnum: true }],
    portal: {
      name: "Islamabad Traffic Police e-challan",
      url: "https://traffic.islamabadpolice.gov.pk/Echallan",
      how: "Paste the plate number into the search and any Islamabad challans for the vehicle are listed.",
    },
    helpline: "1915",
    website: "https://islamabadpolice.gov.pk",
    verifiedFrom: "https://islamabadpolice.gov.pk/",
    verifiedOn: "2026-10-26",
    seo: {
      title: "Islamabad E-Challan Check Online {year}: ITP Traffic Fines by Plate Number",
      description:
        "Check Islamabad Traffic Police e-challans online by plate number on the ITP portal, pay them, and reach the 1915 traffic helpline. What the Safe City cameras in Islamabad issue and how a challan affects the vehicle record.",
    },
    intro:
      "Islamabad Traffic Police lists camera-issued challans on its own portal by plate number. The portal is a web app that cannot be read by another site, so this page keeps your plate ready and opens it for you.",
    sections: [
      {
        heading: "What the ITP portal shows",
        paras: [
          "The search lists each challan against the plate with the violation, date, location and amount, and whether it is paid. Islamabad's cameras issue challans for signal, speed and lane violations on the main avenues, and the notices are also posted to the registered address.",
        ],
      },
      {
        heading: "Paying and querying an Islamabad challan",
        paras: [
          "Challans are paid at designated bank branches and through banking apps that list ITP as a biller. The traffic helpline is 1915, the police emergency number is 15, both as published on islamabadpolice.gov.pk. Unpaid challans follow the vehicle and surface at transfer.",
        ],
      },
    ],
    faqs: [
      ["Can this site show my Islamabad challans?", "No. The ITP portal is an app that another site cannot read. We keep your plate number ready and open it for you."],
      ["Is a Rawalpindi challan on this portal?", "No. Rawalpindi is Punjab, so its Safe City challans are on the PSCA portal, which has its own page here."],
    ],
  },
};

export const UTILITY_CODES = Object.keys(UTILITIES);
export const utilityFor = (code) => UTILITIES[code] || null;
export const KIND_LABEL = { gas: "Gas", telecom: "Phone and internet", electricity: "Electricity", water: "Water", vehicle: "Vehicle record", challan: "Traffic challan" };
export const utilitySlug = (code) => (UTILITIES[code]?.kind === "vehicle" || UTILITIES[code]?.kind === "challan" ? `${code}-check` : `${code}-bill-check`);
export const utilitySeo = (code, year) => {
  const u = UTILITIES[code];
  if (!u) return null;
  return { title: u.seo.title.replace("{year}", year), description: u.seo.description };
};
