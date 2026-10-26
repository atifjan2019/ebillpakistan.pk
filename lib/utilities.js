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
};

export const UTILITY_CODES = Object.keys(UTILITIES);
export const utilityFor = (code) => UTILITIES[code] || null;
export const utilitySlug = (code) => `${code}-bill-check`;
export const utilitySeo = (code, year) => {
  const u = UTILITIES[code];
  if (!u) return null;
  return { title: u.seo.title.replace("{year}", year), description: u.seo.description };
};
