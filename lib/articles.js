// Blog articles for eBill Pakistan. Plain data, no CMS. Each article's `content`
// is a trusted, first-party HTML string rendered via dangerouslySetInnerHTML.
// `navLabel` is a short label used in the footer "Guides" column.

export const ARTICLES = [
  {
    slug: "how-to-check-electricity-bill-online-pakistan",
    title: "How to Check Your Electricity Bill Online in Pakistan (2026 Guide)",
    navLabel: "Check your bill online",
    metaTitle: "How to Check Your Electricity Bill Online in Pakistan",
    metaDescription:
      "Step-by-step guide to checking your electricity bill online in Pakistan with just your 14-digit reference number. Works for LESCO, IESCO, MEPCO and more.",
    publishedDate: "2026-01-15",
    lastUpdated: "2026-06-04",
    faqs: [
      ["Do I need to create an account to check my bill?", "No account is needed. Just enter your 14-digit reference number and press Check Bill. There is no sign-up and no password."],
      ["Which electricity companies are supported?", "eBill Pakistan supports all 12 major DISCOs: LESCO, IESCO, MEPCO, FESCO, GEPCO, HESCO, PESCO, QESCO, SEPCO, TESCO, HAZECO and the AJK Electricity Department."],
      ["How long does it take to check my bill online?", "Usually around ten seconds. The system fetches your latest bill from the official billing system and displays it instantly."],
      ["Can I check bills for more than one connection?", "Yes. Just enter each reference number separately. There is no limit on how many bills you can look up."],
      ["What if my bill does not load?", "Check the number carefully (it must be 8–14 digits, no spaces). If the problem continues, try selecting your DISCO manually instead of using Auto-detect, or try again after a few minutes as the official systems can be busy near month-end."],
    ],
    h1: "How to Check Your Electricity Bill Online in Pakistan (2026 Guide)",
    content: `
<p>Checking your electricity bill online in Pakistan takes less than a minute. You do not need an account, an app or a password, just the reference number printed on any past bill. This guide walks you through the whole process on eBill Pakistan and explains what to do if something does not work.</p>

<h2>Why check your bill online?</h2>
<p>Waiting for the paper bill to arrive by hand can be slow and unreliable, and bills sometimes go missing altogether. Checking online means you always know your amount and due date in time to pay, you can keep a tidy PDF copy for your records, and you can do it from anywhere without visiting an office. It is especially handy for landlords, tenants and anyone managing bills for more than one property.</p>

<h2>What you need</h2>
<p>The only thing required is your <strong>14-digit reference number</strong> (sometimes labelled Consumer No. or Reference No.). It is printed at the top-left of every paper bill and does not change, so once you know it you can check your bill every month. If you have lost your paper bill, ask a family member or your landlord, since the number stays the same for your connection.</p>

<h2>Step by step: check your bill on eBill Pakistan</h2>
<ol>
  <li>Open the <a href="/">eBill Pakistan homepage</a>.</li>
  <li>Type your 14-digit reference number into the box. You can leave the company on Auto-detect.</li>
  <li>Press <strong>Check Bill</strong>. Your latest bill loads on screen in a few seconds.</li>
  <li>From there you can read the amount and due date, download a PDF, or share it on WhatsApp.</li>
</ol>
<p>That is it. There is no sign-up, and checking is completely free, as many times as you like.</p>

<h2>Which companies are supported</h2>
<p>eBill Pakistan works with all twelve major distribution companies (DISCOs): LESCO, IESCO, MEPCO, FESCO, GEPCO, HESCO, PESCO, QESCO, SEPCO, TESCO, HAZECO and the AJK Electricity Department. If you are not sure which company supplies your area, leave the selector on Auto-detect and your reference number will be matched to the right one. You can also open your company page directly, for example <a href="/lesco-bill-check">LESCO bill check</a> or <a href="/iesco-bill-check">IESCO bill check</a>.</p>

<h2>What to do if your bill does not load</h2>
<ul>
  <li><strong>Re-check the number.</strong> It must be exactly 14 digits, with no spaces or dashes.</li>
  <li><strong>Try the company directly.</strong> If Auto-detect struggles, pick your DISCO from the list and try again.</li>
  <li><strong>Wait and retry.</strong> The official billing systems are occasionally busy near month-end, and trying again a little later usually works.</li>
  <li><strong>Use a recent bill.</strong> A very old number from a closed connection may not return a result.</li>
</ul>

<h2>Check your bill now</h2>
<p>Ready to see your latest bill? It takes about ten seconds and costs nothing. <a href="/">Check your electricity bill on eBill Pakistan</a>.</p>
`,
  },

  {
    slug: "how-to-find-reference-number-on-electricity-bill",
    title: "Where Is the Reference Number on My Electricity Bill?",
    navLabel: "Find your reference number",
    metaTitle: "Where Is the Reference Number on Your Bill?",
    metaDescription:
      "Learn exactly where the 14-digit reference number (Consumer No.) appears on your Pakistani electricity bill and how to use it to check your bill online.",
    publishedDate: "2026-02-03",
    lastUpdated: "2026-06-04",
    faqs: [
      ["Where exactly is the reference number on my electricity bill?", "It is printed in the top-left corner of your paper bill, directly below your name and address block. It is usually labelled Reference No., Ref No. or Consumer No."],
      ["How many digits is the reference number?", "It is a 14-digit number for most DISCOs, though some may use 8 to 13 digits. It is always the longest number on the bill."],
      ["Does the reference number change?", "No. The reference number is tied to the physical electricity connection, not to you personally, so it stays the same for the life of the connection even if the account holder changes."],
      ["What if I cannot find a paper bill?", "Ask your landlord, a family member who paid the bill previously, or a neighbour on the same meter. Once you have the number you can view every future bill online without needing the paper copy."],
    ],
    h1: "Where Is the Reference Number on My Electricity Bill?",
    content: `
<p>The reference number is the single most important detail on your electricity bill. It is all you need to look your bill up online, yet many people are not sure where to find it. Here is exactly where it sits and why it matters.</p>

<h2>Where the reference number appears</h2>
<p>On almost every Pakistani electricity bill, the reference number is printed in the <strong>top-left corner</strong>, usually directly under your name and address block. Depending on the company it may be labelled <strong>Reference No.</strong>, <strong>Ref No.</strong> or <strong>Consumer No.</strong>, but it is the same long number in each case. It is normally the longest number on the page, which makes it easy to spot once you know what you are looking for.</p>

<h2>Why it is 14 digits</h2>
<p>The reference number is a <strong>14-digit</strong> code that uniquely identifies your connection within the billing system. The digits encode information such as your sub-division and the specific meter, which is how the system pulls up the correct bill the moment you enter the number. Because it is tied to the connection and not to you personally, it stays the same month after month, even if the bill is in a previous owner's or tenant's name.</p>

<h2>It is the only thing you need</h2>
<p>You do not need a password, an account or a copy of the latest paper bill to check online. With just the 14-digit reference number you can view the current bill, see the amount due and the due date, and download a PDF. That is why it is worth noting the number down somewhere safe, so you are never stuck if a paper bill goes missing.</p>

<h2>Can't find a paper bill?</h2>
<p>If you have no bill to hand, ask whoever paid it last, or a neighbour on the same connection history, since the number does not change. Once you have it, head to the <a href="/">eBill Pakistan homepage</a>, type it in, and your latest bill appears in seconds, free and with no sign-up.</p>
`,
  },

  {
    slug: "lesco-electricity-bill-units-calculator",
    title: "LESCO Electricity Bill Units Calculator: How Much Will You Pay?",
    navLabel: "LESCO units calculator",
    metaTitle: "LESCO Bill Units Calculator & NEPRA Slab Rates",
    metaDescription:
      "Understand NEPRA's domestic slab tariff with a worked LESCO example, and see how units, surcharges and taxes shape your electricity bill.",
    publishedDate: "2026-02-20",
    lastUpdated: "2026-06-04",
    faqs: [
      ["How does NEPRA's slab tariff work for LESCO consumers?", "NEPRA divides domestic consumption into slabs (for example 1–100, 101–200, 201–300 units). Each slab carries a higher per-unit rate than the one below it, so the more you use, the higher the rate applied to the upper portion of your usage."],
      ["What surcharges appear on a LESCO bill beyond the energy cost?", "A typical LESCO bill also includes a fuel price adjustment (which changes monthly), fixed or minimum charges, a TV licence fee, and General Sales Tax (GST). Together these can add significantly to the energy subtotal."],
      ["What is the slab jump and why does it matter?", "If your monthly units cross a slab threshold (for example from 200 to 210 units), a larger portion of your usage moves to a higher rate. A small rise in units can therefore cause a disproportionately large rise in your bill, especially near the 200 and 300-unit boundaries."],
      ["How can I reduce my LESCO electricity bill?", "Keep usage below slab thresholds, especially in summer. Run your AC at 26°C rather than a lower setting, switch to inverter appliances, and avoid heavy loads in the final days of a billing cycle if you are close to a threshold."],
      ["Where can I check my actual LESCO bill?", "Enter your 14-digit reference number on the LESCO bill check page to see your exact units, charges and total — free and in seconds."],
    ],
    h1: "LESCO Electricity Bill Units Calculator: How Much Will You Pay?",
    content: `
<p>Many LESCO customers want to estimate their bill before it arrives. The amount mostly comes down to one thing: how many <strong>units</strong> (kilowatt-hours) you used, charged through NEPRA's slab system. This guide explains how the slabs work and walks through a worked example.</p>

<h2>How NEPRA's slab tariff works</h2>
<p>Electricity tariffs in Pakistan are set by the National Electric Power Regulatory Authority (NEPRA), not by LESCO. Domestic users are billed on a <strong>slab system</strong>: the more units you consume in a month, the higher the per-unit rate that applies to the upper portion of your usage. Rough domestic slabs look like this:</p>
<ul>
  <li>1 to 100 units</li>
  <li>101 to 200 units</li>
  <li>201 to 300 units</li>
  <li>301 to 400 units</li>
  <li>Above 400 units</li>
</ul>
<p>Each slab carries a different rate, rising as you go up. The example rates below are <strong>illustrative only</strong> and are used to show the method; always check the current approved rates on the <a href="https://www.nepra.org.pk" target="_blank" rel="noopener noreferrer">official NEPRA website</a>.</p>

<h2>A worked example: a 300-unit household</h2>
<p>Imagine a home that used <strong>300 units</strong> in a month, with these illustrative rates: Rs 16 for the first 100 units, Rs 22 for the next 100, and Rs 27 for units 201 to 300. The energy cost is calculated slab by slab:</p>
<ul>
  <li>First 100 units &times; Rs 16 = Rs 1,600</li>
  <li>Next 100 units &times; Rs 22 = Rs 2,200</li>
  <li>Next 100 units &times; Rs 27 = Rs 2,700</li>
  <li><strong>Energy subtotal = Rs 6,500</strong></li>
</ul>

<h2>Then come the surcharges and taxes</h2>
<p>Your final bill is more than the energy cost. On top of the subtotal, LESCO bills typically add a <strong>fuel price adjustment</strong>, financing or surcharge line items, a fixed or minimum charge, the TV licence fee and <strong>General Sales Tax</strong>. Together these can add a significant amount, so a 300-unit bill with a Rs 6,500 energy subtotal might total noticeably more once everything is included.</p>

<h2>Watch the slab jump</h2>
<p>Crossing a slab threshold can cost more than you expect. For unprotected consumers, going just over a boundary (for example from 200 to 210 units) can move a larger share of your usage to a higher rate, which is why a small rise in units sometimes causes a big jump in the bill. Keeping usage just under a threshold near month-end can genuinely save money.</p>

<h2>See your exact LESCO bill</h2>
<p>Estimates are useful, but the real figure is always on your bill. To see your actual units, charges and total, <a href="/lesco-bill-check">check your LESCO bill online</a> with your 14-digit reference number, free and in seconds.</p>
`,
  },

  {
    slug: "electricity-bill-zyada-kyon-aata-hai",
    title: "Bijli Ka Bill Zyada Kyon Aata Hai? 7 Wajahaat",
    navLabel: "Why your bill is high",
    metaTitle: "Bijli Ka Bill Zyada Kyon Aata Hai? 7 Reasons",
    metaDescription:
      "Seven common reasons your electricity bill is too high in Pakistan, from AC load and slab jumps to fuel surcharges, plus practical ways to cut it.",
    publishedDate: "2026-03-10",
    lastUpdated: "2026-06-25",
    faqs: [
      ["Why did my electricity bill suddenly increase this month?", "The most common causes are heavy air-conditioner use, crossing a NEPRA slab threshold, a higher fuel price adjustment, or a meter reading error. Compare this month's units to the previous three months to spot the difference."],
      ["What is the fuel price adjustment (FPA) on my bill?", "The FPA is a government-mandated charge that fluctuates monthly based on national fuel and generation costs. It is added to every bill and can change significantly from month to month even when your usage is the same."],
      ["How do I complain about a wrong meter reading?", "Call the national DISCO helpline on 118, or visit your nearest DISCO sub-division office with a copy of your bill. You can request a meter re-reading or an inspection."],
      ["Can a kunda (illegal connection) increase my bill?", "Yes. An illegal connection tapped from your line adds units to your meter that you did not personally use. If your usage is consistently high despite careful use, ask your DISCO for a line inspection."],
    ],
    h1: "Bijli Ka Bill Zyada Kyon Aata Hai? 7 Reasons Your Electricity Bill Is High",
    content: `
<p>If your electricity bill suddenly feels too high, you are not alone. Bijli ka bill zyada aane ki kai wajahaat hoti hain, and most of them can be checked or fixed. Here are the seven most common reasons, with a practical tip for each.</p>

<h2>1. Heavy air-conditioner usage</h2>
<p>An air conditioner is by far the biggest load in most homes. Running it for long hours, especially at low temperatures, can double a summer bill. <strong>Tip:</strong> set the AC to around 26&deg;C, service it so it runs efficiently, and use a fan alongside it to feel cooler at a higher setting.</p>

<h2>2. Old, inefficient appliances</h2>
<p>Old fridges, water pumps and incandescent bulbs draw far more power than modern equivalents. <strong>Tip:</strong> switch to LED lighting and inverter appliances where you can, as the saving usually pays for itself.</p>

<h2>3. A meter reading error</h2>
<p>Sometimes the meter is misread or estimated, which inflates the units billed. <strong>Tip:</strong> compare the units on your bill with previous months. If there is a sudden, unexplained spike, raise it with your distribution company.</p>

<h2>4. Fuel price adjustment surcharge</h2>
<p>The fuel price adjustment is a separate line that changes month to month based on national fuel costs, and it can push up a bill even when your usage is the same. <strong>Tip:</strong> this charge is set nationally and is unavoidable, but knowing it explains why two similar months can differ.</p>

<h2>5. Fixed and minimum charges</h2>
<p>Bills include fixed charges, taxes and the TV licence fee regardless of how little you use. <strong>Tip:</strong> on a low-usage month these fixed items make up a larger share, so the bill is rarely as low as the units alone suggest.</p>

<h2>6. Theft or meter tampering</h2>
<p>An illegal connection (kunda) drawn from your line, or a tampered meter, can add units you never used. <strong>Tip:</strong> if your usage is high despite careful use, ask for a meter inspection and check that no one has tapped your connection.</p>

<h2>7. A slab jump</h2>
<p>Crossing a tariff slab can move much of your usage to a higher per-unit rate, so a few extra units can cause a surprisingly large rise. <strong>Tip:</strong> watch your running total near month-end and avoid heavy loads that tip you just over a threshold.</p>

<h2>Check the real numbers first</h2>
<p>Before assuming the worst, look at the actual units and charges on your bill. You can <a href="/">check your electricity bill online</a> in seconds with just your reference number, free and with no sign-up.</p>

<p>Want to bring it down? See our Urdu guide: <a href="/blog/bijli-ka-bill-kam-kaise-karein">بجلی کا بل کم کیسے کریں</a>.</p>
`,
  },

  {
    slug: "how-to-pay-electricity-bill-online-pakistan",
    title: "How to Pay Your Electricity Bill Online in Pakistan",
    navLabel: "Pay your bill online",
    metaTitle: "How to Pay Your Electricity Bill Online in Pakistan",
    metaDescription:
      "Compare ways to pay your electricity bill online in Pakistan: JazzCash, Easypaisa, bank apps, ATM and in person, with quick steps for each.",
    publishedDate: "2026-04-05",
    lastUpdated: "2026-06-04",
    faqs: [
      ["Which apps can I use to pay my electricity bill in Pakistan?", "JazzCash and Easypaisa are the most widely used. Most major bank mobile apps (HBL, MCB, UBL, Meezan and others) also support utility bill payments under their Bill Payments section."],
      ["What information do I need to pay my electricity bill online?", "You need your 14-digit reference number and the amount due. You can check both on eBill Pakistan before opening your payment app."],
      ["Is online electricity bill payment safe in Pakistan?", "Yes, when using official apps (JazzCash, Easypaisa) or your bank's verified app. Always download apps from the official Play Store or App Store and never share your PIN or OTP."],
      ["Can I pay my electricity bill at an ATM?", "Yes. Most ATMs in Pakistan support utility bill payment. Insert your card, choose Bill Payment, select your electricity company, enter your reference number and confirm. Keep the printed slip as proof."],
      ["Does eBill Pakistan process payments?", "No. eBill Pakistan helps you view and download your bill so you have the reference number and amount ready. The actual payment is made through JazzCash, Easypaisa, your bank app, ATM or your DISCO's official portal."],
    ],
    h1: "How to Pay Your Electricity Bill Online in Pakistan",
    content: `
<p>Once you know how much you owe, paying is the easy part. Pakistan has several quick, secure ways to pay an electricity bill without standing in a queue. Here are the main options with short steps for each.</p>
<p>A quick note: eBill Pakistan helps you <strong>view and download</strong> your bill so you have the reference number and amount ready. The payment itself is made through the apps, banks and channels below, or your distribution company's own portal.</p>

<h2>1. JazzCash</h2>
<p>Open the JazzCash app, go to <em>Bill Payments</em>, choose <em>Electricity</em>, pick your company, enter your 14-digit reference number, confirm the amount and pay from your wallet. You get an instant confirmation SMS.</p>

<h2>2. Easypaisa</h2>
<p>In the Easypaisa app, tap <em>Pay Bill</em>, select <em>Electricity</em> and your DISCO, enter the reference number, check the amount and confirm. As with JazzCash, you receive a digital receipt to keep.</p>

<h2>3. Bank mobile apps (HBL, MCB, UBL and others)</h2>
<p>Most bank apps include a bill payment section. Log in, find <em>Bill Payments</em> or <em>Utility Bills</em>, add your electricity company as a biller using your reference number, then pay from your account. Once saved, future months take only a couple of taps.</p>

<h2>4. ATM</h2>
<p>Many ATMs support utility bill payment. Insert your card, choose <em>Bill Payment</em>, select your electricity company, enter the reference number and confirm. Keep the printed slip as proof of payment.</p>

<h2>5. In person</h2>
<p>You can still pay over the counter at designated banks and authorised agents. Take your printed bill, pay in cash, and keep the stamped portion. This remains a reliable option where online banking is not available.</p>

<h2>Pay through your company's official site</h2>
<p>Each distribution company also lists its own approved payment channels. From your company page on eBill Pakistan, for example <a href="/lesco-bill-check">LESCO</a> or <a href="/mepco-bill-check">MEPCO</a>, you can reach the official website for the latest accepted methods.</p>

<h2>View your bill first</h2>
<p>Whichever method you choose, you will need your reference number and the exact amount. <a href="/">Check your bill on eBill Pakistan</a> first, then pay through your preferred channel in minutes.</p>
`,
  },

  {
    slug: "what-is-disco-pakistan-electricity",
    title: "What Is a DISCO? Pakistan's 12 Electricity Distribution Companies Explained",
    navLabel: "What is a DISCO?",
    metaTitle: "What Is a DISCO? Pakistan's 12 Power Companies",
    metaDescription:
      "What is a DISCO? A plain-English guide to Pakistan's 12 electricity distribution companies and the areas each one serves.",
    publishedDate: "2026-05-12",
    lastUpdated: "2026-06-04",
    faqs: [
      ["What does DISCO stand for in Pakistan's electricity sector?", "DISCO stands for Distribution Company. It is the organisation responsible for delivering electricity from the national grid to homes and businesses in a specific region, and for reading meters and issuing bills."],
      ["How many DISCOs are there in Pakistan?", "There are 12 main distribution companies: LESCO, IESCO, MEPCO, FESCO, GEPCO, HESCO, PESCO, QESCO, SEPCO, TESCO, HAZECO and the AJK Electricity Department."],
      ["How do I find out which DISCO supplies my home?", "Your DISCO name is printed on your electricity bill. It also matches your city or region: Lahore is LESCO, Islamabad and Rawalpindi are IESCO, Multan and south Punjab are MEPCO, and so on. On eBill Pakistan you can also leave the selector on Auto-detect and your reference number will be matched automatically."],
      ["Do all DISCOs charge the same rates?", "Tariff rates are set nationally by NEPRA and apply uniformly across all DISCOs for the same consumer category. However, fuel price adjustments and certain surcharges can vary slightly in timing between companies."],
    ],
    h1: "What Is a DISCO? Pakistan's 12 Electricity Distribution Companies Explained",
    content: `
<p>If you have ever looked at an electricity bill in Pakistan, you have seen a four or five letter name like LESCO or MEPCO. These are DISCOs. Here is what that means and which company serves your area.</p>

<h2>What is a DISCO?</h2>
<p>A <strong>DISCO</strong> is a <strong>Distribution Company</strong>: the organisation responsible for delivering electricity to homes and businesses in a defined region, maintaining the local network, reading meters and issuing your bill. Power is generated elsewhere and carried across the country on the national grid, but the DISCO is the company you actually deal with for your connection and billing. Each DISCO covers a specific geographic area, which is why your bill always comes from the same one.</p>

<h2>Pakistan's 12 distribution companies</h2>
<p>There are twelve main distribution companies. Here is each one with the area it serves and a link to check your bill:</p>
<ul>
  <li><strong><a href="/lesco-bill-check">LESCO</a></strong>:Lahore and central Punjab.</li>
  <li><strong><a href="/iesco-bill-check">IESCO</a></strong>:Islamabad, Rawalpindi and the Potohar region.</li>
  <li><strong><a href="/mepco-bill-check">MEPCO</a></strong>:Multan and south Punjab.</li>
  <li><strong><a href="/fesco-bill-check">FESCO</a></strong>:Faisalabad and surrounding districts.</li>
  <li><strong><a href="/gepco-bill-check">GEPCO</a></strong>:Gujranwala and upper Punjab.</li>
  <li><strong><a href="/hesco-bill-check">HESCO</a></strong>:Hyderabad and southern Sindh.</li>
  <li><strong><a href="/pesco-bill-check">PESCO</a></strong>:Peshawar and Khyber Pakhtunkhwa.</li>
  <li><strong><a href="/qesco-bill-check">QESCO</a></strong>:Quetta and all of Balochistan.</li>
  <li><strong><a href="/sepco-bill-check">SEPCO</a></strong>:Sukkur and northern Sindh.</li>
  <li><strong><a href="/tesco-bill-check">TESCO</a></strong>:the tribal districts of Khyber Pakhtunkhwa.</li>
  <li><strong><a href="/hazeco-bill-check">HAZECO</a></strong>:the Hazara division.</li>
  <li><strong><a href="/ajk-bill-check">AJK</a></strong>:Azad Jammu and Kashmir.</li>
</ul>

<h2>How do I know which DISCO is mine?</h2>
<p>Your DISCO is printed on your bill, and it matches your location: a home in Lahore is on LESCO, while one in Multan is on MEPCO. If you are unsure, you do not need to know it in advance. On eBill Pakistan you can leave the company on Auto-detect, and your 14-digit reference number is matched to the correct company automatically.</p>

<h2>Why it matters</h2>
<p>Knowing your DISCO helps you reach the right helpline, use the correct official website for payments and complaints, and understand your tariff, since rates are applied per company under NEPRA's rules. Whichever one serves you, you can <a href="/">check your bill on eBill Pakistan</a> in seconds.</p>
`,
  },

  {
    slug: "ajk-electricity-bill-online-check",
    title: "AJK Electricity Bill Online Check (Step by Step) 2026",
    navLabel: "AJK bill online check",
    metaTitle: "AJK Electricity Bill Online Check 2026 — Step by Step",
    metaDescription:
      "Check your AJK (Azad Kashmir) electricity bill online, step by step. Enter your reference number to view, print or download your latest bill in seconds — free.",
    publishedDate: "2026-06-25",
    lastUpdated: "2026-06-25",
    faqs: [
      ["Can I check my AJK electricity bill online for free?", "Yes. Checking your Azad Kashmir electricity bill on eBill Pakistan is completely free, with no sign-up. You only need your reference number."],
      ["Does this work for Muzaffarabad, Mirpur and Kotli?", "Yes. The AJK bill check works the same way across Azad Jammu & Kashmir, including Muzaffarabad, Mirpur, Kotli, Bagh and Rawalakot."],
      ["What if my AJK bill does not load?", "Re-check the reference number for typos, then try again after a few minutes, as the official billing system can be busy near month-end."],
    ],
    h1: "AJK Electricity Bill Online Check (Step by Step) 2026",
    content: `
<p>Checking your <strong>AJK electricity bill</strong> online takes under a minute and needs nothing more than your reference number. This step-by-step guide shows you exactly how to view, print or download your Azad Jammu &amp; Kashmir Electricity Department bill on eBill Pakistan.</p>

<h2>What you need</h2>
<p>Just your <strong>reference number</strong> — the long number printed at the top-left of any past AJK bill. If you cannot find it, see our guide on <a href="/blog/how-to-find-ajk-electricity-reference-number">how to find your AJK electricity reference number</a>.</p>

<h2>Step by step: check your AJK bill online</h2>
<ol>
  <li>Open the <a href="/ajk-bill-check">AJK bill check page</a>.</li>
  <li>Enter your reference number in the box.</li>
  <li>Press <strong>Check AJK Bill</strong>. Your latest bill is prepared and opens on the official portal.</li>
  <li>From there you can read the amount and due date, print it, or save it as a PDF.</li>
</ol>
<p>It is free, with no sign-up, and works the same way for Muzaffarabad, Mirpur, Kotli, Bagh, Rawalakot and the rest of Azad Kashmir.</p>

<h2>Why check your AJK bill online?</h2>
<p>Paper bills in AJK can arrive late or go missing, especially in the hill districts. Checking online means you always know your amount and due date in time to pay, and you can keep a tidy PDF copy for your records.</p>

<h2>Want to understand the charges?</h2>
<p>If your bill looks higher than expected, read <a href="/blog/azad-kashmir-electricity-unit-price-tariff">Azad Kashmir electricity unit price &amp; tariff explained</a> to see how the per-unit slabs work in AJK.</p>

<h2>Check your AJK bill now</h2>
<p>Ready? <a href="/ajk-bill-check">Check your AJK electricity bill</a> — it takes about ten seconds, free and with no sign-up.</p>
`,
  },

  {
    slug: "how-to-find-ajk-electricity-reference-number",
    title: "How to Find Your AJK Electricity Reference Number (2026)",
    navLabel: "Find AJK reference number",
    metaTitle: "How to Find Your AJK Electricity Reference Number",
    metaDescription:
      "Learn exactly where the reference number is printed on your AJK (Azad Kashmir) electricity bill and how to use it to check your bill online.",
    publishedDate: "2026-06-25",
    lastUpdated: "2026-06-25",
    faqs: [
      ["Where is the reference number on an AJK bill?", "It is printed in the top-left corner of your AJK Electricity Department bill, usually labelled Reference No. or Consumer No."],
      ["Does my AJK reference number change?", "No. It is tied to the physical connection, not the account holder, so it stays the same month after month."],
      ["What if I have lost my AJK paper bill?", "Ask a family member, your landlord or a neighbour on the same meter for the number. Once you have it, you can check every future bill online."],
    ],
    h1: "How to Find Your AJK Electricity Reference Number (2026)",
    content: `
<p>Your <strong>AJK electricity reference number</strong> is the one detail you need to check your Azad Jammu &amp; Kashmir bill online. Here is exactly where to find it and how to use it.</p>

<h2>Where the reference number is printed</h2>
<p>On your AJK Electricity Department bill, the reference number sits in the <strong>top-left corner</strong>, usually labelled <strong>Reference No.</strong> or <strong>Consumer No.</strong>. It is the long number that identifies your connection, and it is normally the longest number on the page.</p>

<h2>Why it stays the same</h2>
<p>The reference number belongs to the connection, not to you personally, so it does not change when the account holder changes. Once you know it, you can check your bill every month without the paper copy.</p>

<h2>Can't find a paper bill?</h2>
<p>Ask a family member, your landlord, or a neighbour on the same meter. Any past AJK bill for your connection carries the same number.</p>

<h2>Use it to check your bill</h2>
<p>With the reference number in hand, head to the <a href="/ajk-bill-check">AJK bill check page</a> and follow our <a href="/blog/ajk-electricity-bill-online-check">step-by-step AJK bill online check guide</a>. To understand the charges once it loads, see <a href="/blog/azad-kashmir-electricity-unit-price-tariff">AJK electricity unit price &amp; tariff explained</a>.</p>
`,
  },

  {
    slug: "azad-kashmir-electricity-unit-price-tariff",
    title: "Azad Kashmir Electricity Unit Price & Tariff Explained (2026)",
    navLabel: "AJK unit price & tariff",
    metaTitle: "Azad Kashmir Electricity Unit Price & Tariff 2026",
    metaDescription:
      "How the Azad Kashmir (AJK) electricity unit price and tariff slabs work — billed through the AJK Electricity Department, set separately from mainland NEPRA rates.",
    publishedDate: "2026-06-25",
    lastUpdated: "2026-06-25",
    faqs: [
      ["Is the AJK electricity unit price the same as LESCO or MEPCO?", "Not necessarily. AJK power is billed through the AJK Electricity Department and its tariff is set separately, so it is not always identical to the NEPRA uniform schedule used by mainland DISCOs."],
      ["How is the AJK bill calculated?", "On a slab system: the per-unit rate steps up as your monthly units cross thresholds such as 100, 200 and 300, with the higher rate applied to the upper slab. A fuel adjustment and taxes are added on top."],
      ["Where can I confirm the current AJK rates?", "Confirm the latest figures through the AJK Electricity Department / PITC billing source, since rates are revised from time to time."],
    ],
    h1: "Azad Kashmir Electricity Unit Price & Tariff Explained (2026)",
    content: `
<p>If your <strong>Azad Kashmir electricity bill</strong> seems high, it helps to understand how the per-unit price works. AJK power is supplied and billed through the <strong>AJK Electricity Department</strong> (via the PITC billing system), and its tariff is set separately — it is <strong>not always identical</strong> to the NEPRA uniform schedule used by mainland DISCOs such as LESCO or MEPCO.</p>

<h2>How the slab system works</h2>
<p>Like the rest of Pakistan, AJK domestic bills use a <strong>slab system</strong>: the per-unit rate steps up as your monthly units cross thresholds (100, 200, 300 and beyond), and the higher rate applies to the units in the upper slab. Lower-usage "protected" and "lifeline" consumers pay less per unit than higher-usage "unprotected" ones.</p>

<h2>Azad Kashmir electricity unit price</h2>
<p>Because AJK rates are set through its own arrangement and revised from time to time, we show them here only once verified against the official AJK source — never copied from mainland figures.</p>

<!-- tariff:ajk -->

<h2>What else is on the bill</h2>
<p>Beyond the per-unit energy charge, your bill includes a fuel price adjustment, electricity duty, GST and a TV licence fee. These are added on top of the slab rate, so your effective cost changes a little each month.</p>

<h2>Check your AJK bill</h2>
<p>To see your own latest charges, <a href="/ajk-bill-check">check your AJK electricity bill</a> online, or learn <a href="/blog/ajk-electricity-bill-online-check">how to check it step by step</a>. Not sure of your number? See <a href="/blog/how-to-find-ajk-electricity-reference-number">how to find your AJK reference number</a>.</p>
`,
  },

  {
    slug: "how-to-download-print-electricity-bill-duplicate",
    title: "How to Download or Print Your Electricity Bill (Duplicate Bill) 2026",
    navLabel: "Download / print your bill",
    metaTitle: "How to Download or Print Your Electricity Bill (Duplicate) 2026",
    metaDescription:
      "Download or print a duplicate electricity bill in Pakistan using just your reference number — free, instant, and accepted at banks. Step-by-step guide.",
    publishedDate: "2026-06-25",
    lastUpdated: "2026-06-25",
    faqs: [
      ["Is a duplicate electricity bill accepted at the bank?", "Yes. A duplicate bill shows the same reference number, amount and due date as the original, and banks and payment apps accept it the same way."],
      ["Does it cost anything to download my bill?", "No. Viewing, downloading and printing your bill on eBill Pakistan is completely free, with no sign-up."],
      ["Can I download bills for more than one connection?", "Yes. Enter each reference number separately — there is no limit on how many bills you can download."],
    ],
    h1: "How to Download or Print Your Electricity Bill (Duplicate Bill) 2026",
    content: `
<p>Lost your paper electricity bill, or need a second copy to pay at the bank? You can <strong>download or print a duplicate bill</strong> in under a minute using just your reference number — no visit to the office and no charge. Here is how.</p>

<!-- sponsored -->

<h2>What a "duplicate bill" really is</h2>
<p>A duplicate bill is simply another copy of your current electricity bill. It shows the same amount, due date and reference number as the original, and banks and payment apps accept it the same way. On eBill Pakistan you always see your latest bill, which you can save as a PDF or print as many times as you like.</p>

<h2>How to download or print your bill</h2>
<ol>
  <li>Open the <a href="/">eBill Pakistan homepage</a>, or your company page such as <a href="/lesco-bill-check">LESCO</a>, <a href="/mepco-bill-check">MEPCO</a> or <a href="/iesco-bill-check">IESCO</a>.</li>
  <li>Enter your 14-digit <strong>reference number</strong> and press Check Bill.</li>
  <li>When your bill loads, choose <strong>Download PDF</strong> to save it, or <strong>Print</strong> for a paper copy.</li>
</ol>
<p>The PDF is a tidy one-page copy you can keep, email, or share on WhatsApp.</p>

<!-- sponsored -->

<h2>Can't find your reference number?</h2>
<p>You need the reference number from any past bill. If you don't have it to hand, see <a href="/blog/how-to-find-reference-number-on-electricity-bill">where the reference number is printed</a> on your bill.</p>

<h2>Get your duplicate bill now</h2>
<p><a href="/">Check and download your electricity bill</a> — free, instant and with no sign-up.</p>
`,
  },

  {
    slug: "how-to-check-electricity-bill-status",
    title: "How to Check Your Electricity Bill Status Online (2026)",
    navLabel: "Check bill status",
    metaTitle: "How to Check Your Electricity Bill Status Online (2026)",
    metaDescription:
      "Check your electricity bill status online in seconds — see the amount payable, due date and units with just your reference number. Free, no sign-up.",
    publishedDate: "2026-06-25",
    lastUpdated: "2026-06-25",
    faqs: [
      ["How do I know if my electricity bill is paid?", "Check your bill online with your reference number. After payment it can take a day or two for the official system to update, so keep your receipt until it shows as paid."],
      ["What does bill status show?", "It shows your latest amount payable, the due date, the units consumed, and any outstanding previous balance."],
      ["Is checking my bill status free?", "Yes, completely free and with no sign-up on eBill Pakistan."],
    ],
    h1: "How to Check Your Electricity Bill Status Online (2026)",
    content: `
<p>Want to know whether your electricity bill is <strong>paid or still due</strong>, how much it is, and the last date to pay? Checking your bill status online takes seconds with your reference number.</p>

<!-- sponsored -->

<h2>What "bill status" means</h2>
<p>Your bill status is the current state of your latest bill: the <strong>amount payable</strong>, the <strong>due date</strong>, the units you used, and whether a previous balance is outstanding. Checking it online means you never miss a due date or pay a late surcharge by mistake.</p>

<h2>How to check your bill status</h2>
<ol>
  <li>Go to the <a href="/">eBill Pakistan homepage</a>, or your DISCO page such as <a href="/fesco-bill-check">FESCO</a> or <a href="/gepco-bill-check">GEPCO</a>.</li>
  <li>Enter your 14-digit reference number and press Check Bill.</li>
  <li>Your latest bill opens, showing the amount, due date and payment details at a glance.</li>
</ol>

<!-- sponsored -->

<h2>Already paid? Here's what to check</h2>
<p>After paying, it can take a day or two for the official system to update. If your bill still shows as unpaid shortly after payment, keep your receipt and check again later. To understand each line on the bill, read <a href="/blog/unit-slabs-fuel-price-adjustment-taxes-explained">unit slabs, fuel price adjustment &amp; taxes explained</a>.</p>

<h2>Check your bill status now</h2>
<p><a href="/">Check your electricity bill status</a> in about ten seconds, free.</p>
`,
  },

  {
    slug: "unit-slabs-fuel-price-adjustment-taxes-explained",
    title: "Unit Slabs, Fuel Price Adjustment (FPA) & Taxes on Your Bill, Explained (2026)",
    navLabel: "Slabs, FPA & taxes",
    metaTitle: "Unit Slabs, Fuel Price Adjustment (FPA) & Taxes Explained 2026",
    metaDescription:
      "Understand your electricity bill: how unit slabs work, what fuel price adjustment (FPA) is, and the taxes added on top — in plain language, for Pakistan 2026.",
    publishedDate: "2026-06-25",
    lastUpdated: "2026-06-25",
    faqs: [
      ["What is fuel price adjustment (FPA) on my bill?", "The FPA is a monthly adjustment reflecting the actual cost of fuel used to generate electricity, usually two months earlier. It is added or credited as a separate line, which is why two months with the same units can cost different amounts."],
      ["Why does my per-unit rate go up the more I use?", "Bills use a slab system: as your monthly units cross 100, 200, 300 and higher thresholds, the units in the upper slab are charged at a higher rate."],
      ["What taxes are on an electricity bill?", "Typically electricity duty, GST, a TV licence fee, and sometimes a fixed or minimum charge and a financing-cost surcharge, on top of the energy charge and FPA."],
    ],
    h1: "Unit Slabs, Fuel Price Adjustment (FPA) & Taxes on Your Bill, Explained (2026)",
    content: `
<p>If your electricity bill feels higher than the units suggest, the reason is usually the <strong>slab system</strong>, the monthly <strong>fuel price adjustment (FPA)</strong> and the <strong>taxes</strong> stacked on top. Here is how each part works, in plain language.</p>

<!-- sponsored -->

<h2>How unit slabs work</h2>
<p>Domestic bills in Pakistan use a <strong>slab</strong> (tiered) system. The per-unit rate steps up as your monthly usage crosses 100, 200, 300 and higher thresholds, and the higher rate applies only to the units in that upper slab. Lower-usage <strong>protected</strong> and <strong>lifeline</strong> consumers pay less per unit than higher-usage <strong>unprotected</strong> ones.</p>

<h2>Approximate domestic tariff</h2>
<p>These are the NEPRA uniform rates that apply to the mainland DISCOs (LESCO, MEPCO, FESCO and the rest). We show them only once verified against NEPRA, so the figures below appear as they are confirmed.</p>

<!-- tariff:nepra -->

<h2>What is fuel price adjustment (FPA)?</h2>
<p>The FPA is a monthly adjustment that reflects the actual cost of the fuel used to generate electricity, usually two months earlier. When fuel costs rise, the FPA adds to your bill; when they fall, it can be a small credit. It is shown as a separate line and is the single biggest reason two months with the same units can cost different amounts.</p>

<!-- sponsored -->

<h2>Taxes &amp; other charges</h2>
<p>On top of the energy charge and FPA, your bill carries electricity duty, GST, a TV licence fee, and sometimes a fixed or minimum charge and a financing-cost surcharge. Together these can add a noticeable amount to the total.</p>

<h2>See it on your own bill</h2>
<p>Check your latest bill on your company page — for example <a href="/lesco-bill-check">LESCO</a>, <a href="/mepco-bill-check">MEPCO</a> or <a href="/pesco-bill-check">PESCO</a>. In Azad Kashmir, rates are set separately: see <a href="/blog/azad-kashmir-electricity-unit-price-tariff">Azad Kashmir electricity unit price &amp; tariff</a>.</p>
`,
  },

  {
    slug: "bijli-ka-bill-kam-kaise-karein",
    title: "بجلی کا بل کم کیسے کریں؟ (آسان طریقے 2026)",
    navLabel: "بجلی کا بل کم کریں",
    lang: "ur",
    dir: "rtl",
    metaTitle: "بجلی کا بل کم کیسے کریں — آسان طریقے 2026",
    metaDescription:
      "بجلی کا بل کم کرنے کے آسان اور آزمودہ طریقے: یونٹ بچائیں، سلیب کو سمجھیں، اور اپنا بل آن لائن مفت چیک کریں۔",
    publishedDate: "2026-06-25",
    lastUpdated: "2026-06-25",
    faqs: [
      ["کیا 200 یونٹ سے کم استعمال پر بل کم آتا ہے؟", "جی ہاں۔ اگر آپ مسلسل مہینوں میں 200 یونٹ سے کم استعمال کریں تو آپ پروٹیکٹڈ صارف شمار ہوتے ہیں اور فی یونٹ کم ریٹ لگتا ہے۔"],
      ["بجلی کا بل آن لائن کیسے چیک کریں؟", "اپنا 14 ہندسوں کا ریفرنس نمبر درج کریں اور بل چیک کریں۔ کسی سائن اپ کی ضرورت نہیں۔"],
    ],
    h1: "بجلی کا بل کم کیسے کریں؟ (آسان طریقے 2026)",
    content: `
<p>ہر مہینے بھاری بجلی کا بل پریشان کن ہوتا ہے۔ اچھی خبر یہ ہے کہ چند آسان عادتوں سے آپ اپنے یونٹ اور بل دونوں کم کر سکتے ہیں۔ یہاں آزمودہ طریقے دیے گئے ہیں۔</p>

<!-- sponsored -->

<h2>سب سے زیادہ بجلی کون استعمال کرتا ہے؟</h2>
<p>ایئر کنڈیشنر، الیکٹرک ہیٹر، پانی کی موٹر اور پرانے فریج سب سے زیادہ یونٹ کھاتے ہیں۔ بل کم کرنے کے لیے پہلے انہی پر توجہ دیں۔</p>

<h2>بل کم کرنے کے آسان طریقے</h2>
<ul>
  <li>اے سی کا درجہ حرارت 26 پر رکھیں اور ممکن ہو تو انورٹر اے سی استعمال کریں۔</li>
  <li>عام بلب کی جگہ ایل ای ڈی لائٹس لگائیں۔</li>
  <li>غیر ضروری آلات مکمل بند کریں، اسٹینڈ بائی پر نہ چھوڑیں۔</li>
  <li>کوشش کریں کہ ماہانہ استعمال 200 یونٹ سے کم رہے تاکہ آپ پروٹیکٹڈ سلیب میں رہیں اور کم ریٹ ملے۔</li>
</ul>

<!-- sponsored -->

<h2>سلیب کو سمجھیں</h2>
<p>بجلی کا بل سلیب سسٹم پر بنتا ہے: جتنے زیادہ یونٹ، اتنا اونچا فی یونٹ ریٹ۔ اگر آپ کا استعمال اگلے سلیب میں چلا جائے تو بل تیزی سے بڑھتا ہے۔ مزید تفصیل کے لیے پڑھیں: <a href="/blog/electricity-bill-zyada-kyon-aata-hai">بجلی کا بل زیادہ کیوں آتا ہے</a>۔</p>

<h2>اپنا بل آن لائن چیک کریں</h2>
<p>ہر مہینے اپنا بل اور یونٹ دیکھنے کے لیے <a href="/">eBill Pakistan پر اپنا بجلی کا بل چیک کریں</a> — مفت اور فوری۔</p>
`,
  },
];

export function getArticle(slug) {
  return ARTICLES.find((a) => a.slug === slug) || null;
}

// Per-DISCO related guides, surfaced as a "Helpful guides" block on that DISCO's
// bill-check page (and the articles link back). Lets the AJK hub (and later other
// DISCOs) reach its supporting articles within ~2 clicks of the homepage.
export const DISCO_GUIDES = {
  ajk: [
    "ajk-electricity-bill-online-check",
    "how-to-find-ajk-electricity-reference-number",
    "azad-kashmir-electricity-unit-price-tariff",
  ],
};

export const guidesFor = (code) =>
  (DISCO_GUIDES[code] || []).map(getArticle).filter(Boolean);

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Deterministic "31 May 2026" formatting (UTC, so server timezone never shifts it).
export function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
