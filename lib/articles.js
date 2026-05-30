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
];

export function getArticle(slug) {
  return ARTICLES.find((a) => a.slug === slug) || null;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Deterministic "31 May 2026" formatting (UTC, so server timezone never shifts it).
export function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
