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
    lastUpdated: "2026-08-16",
    faqs: [
      ["How long after paying does the bill show as paid?", "Usually one to two working days. Counter payments at a designated bank branch post fastest, often the same day; wallet and app payments take longer to reach the billing system. A bill still showing as due the morning after you paid is normal. Keep the receipt until it clears, because the receipt is the only proof you have."],
      ["Can I get a bill for a month that has already passed?", "The lookup returns your current bill, not an archive. For an older month you need a duplicate from your distribution company, which its customer service centre can print. Keeping the PDF each month is the easier habit, and it is what most people do once they have been caught out once."],
      ["The lookup says not found but my number is definitely right. What now?", "Check the company first: a reference number only resolves on the company that issued it, so a Hazara number will not work under PESCO and an AJK number is a separate system. Then check the digit count, and finally try again in a few minutes, because the official system is heavily loaded in the last days of a billing cycle."],
      ["Is a downloaded bill accepted at the bank?", "Yes. It carries the same reference number, amount and due date as the posted copy, and payment is matched on the reference number rather than on the piece of paper. Banks, ATMs and wallet apps all accept it."],
      ["Do I need an account to check my bill here?", "No. There is no sign-up, no password and no app. The reference number is the only thing required, and nothing about your bill is stored after the page is served."],
    ],
    h1: "How to Check Your Electricity Bill Online in Pakistan (2026 Guide)",
    content: `
<p>Checking a Pakistani electricity bill online takes about ten seconds and needs one thing: the reference number printed on any past bill. No account, no app, no password. This guide covers the whole flow &mdash; what to enter, what every field in the result means, what to do when the lookup fails, when a payment shows up, how to get a copy for a month that has already gone, and the handful of company-specific quirks that trip people up.</p>

<h2>What you need before you start</h2>
<p>Just the <strong>reference number</strong>: 14 digits on the mainland companies, sometimes fewer on older Azad Kashmir bills. It is printed at the top-left of every bill and it never changes, so once you have noted it down you can check every month without the paper copy. If you cannot find it, our guide on <a href="/blog/how-to-find-reference-number-on-electricity-bill">where the reference number is printed</a> covers every layout and what to do if you have lost every bill you own.</p>

<h2>Checking your bill, step by step</h2>
<ol>
  <li>Open the <a href="/">homepage</a>, or go straight to your company&rsquo;s page &mdash; <a href="/lesco-bill-check">LESCO</a>, <a href="/mepco-bill-check">MEPCO</a>, <a href="/iesco-bill-check">IESCO</a> and the rest are all listed under <a href="/#companies">all companies</a>.</li>
  <li>Select your distribution company. It is printed on your bill; do not guess it from your city, because boundaries do not follow city limits.</li>
  <li>Type the reference number with no spaces or dashes.</li>
  <li>Press <strong>Check Bill</strong>. Your current bill is retrieved from the official billing system and rendered here, along with an analysis of what the figures mean.</li>
</ol>
<p>From there you can download a PDF, print it, or share it. It is free, unlimited, and works for as many connections as you like &mdash; useful if you are a landlord or you are managing a relative&rsquo;s bills.</p>

<h2>What each field in the result means</h2>
<p>The result is more than the total. The fields worth reading, in the order they matter:</p>
<ul>
  <li><strong>Units consumed</strong> &mdash; this month&rsquo;s meter reading minus last month&rsquo;s. Everything else follows from it, so if something looks wrong, start here rather than with the rupee figures.</li>
  <li><strong>Payable within due date</strong> and <strong>payable after due date</strong> &mdash; two different totals. The second includes the late payment surcharge. Always check which one you are being asked for.</li>
  <li><strong>Due date</strong> &mdash; the last day to pay at the lower figure. Payment channels credit on their own timetable, so paying on the due date itself is cutting it fine.</li>
  <li><strong>Tariff code</strong> &mdash; whether you are billed as a protected or unprotected consumer. This makes an enormous difference to the rate per unit, and it is worth checking every month rather than assuming it is unchanged.</li>
  <li><strong>Arrears</strong> &mdash; anything unpaid carried forward. A non-zero figure shortly after you paid usually means the payment had not reached the system when the bill was generated.</li>
</ul>
<p>For a field-by-field walkthrough of a complete bill, including the surcharges, see the <a href="/sample-bill-explained">annotated sample bill</a>. For what the rates themselves are and the reason crossing a slab boundary costs more than the extra units, see the <a href="/electricity-tariff">tariff guide</a>.</p>

<h2>When the lookup fails</h2>
<p>Almost every failure is one of four things, in order of likelihood:</p>
<ol>
  <li><strong>The wrong company is selected.</strong> A reference number only resolves on the company that issued it. This is the single most common cause and it produces a plain &ldquo;not found&rdquo;, which people misread as a broken number.</li>
  <li><strong>A mistyped digit.</strong> There is no fuzzy matching &mdash; one wrong digit returns nothing rather than a near miss. Read it back against the bill digit by digit.</li>
  <li><strong>The upstream system is busy.</strong> The official billing system is heavily loaded in the last few days of a billing cycle. Waiting a few minutes and retrying usually works, and it is not a problem with your number.</li>
  <li><strong>A very old or closed connection.</strong> A number from a disconnected connection may no longer return a current bill.</li>
</ol>

<h2>How long after payment does the status update?</h2>
<p>Between one and two working days for most channels. Over-the-counter payments at a designated bank branch post fastest, frequently the same working day. Wallet and app payments &mdash; JazzCash, Easypaisa, bank apps &mdash; take longer to reach the billing system, and a payment made late in the evening will not appear until the following working day.</p>
<p>So a bill still showing as unpaid the morning after you paid is expected behaviour, not an error. Keep the receipt or the transaction reference until it clears; if it has not updated after about three working days, that receipt is what your distribution company will ask for.</p>

<h2>Getting a copy for a month that has already passed</h2>
<p>The online lookup returns your <strong>current</strong> bill. It is not an archive, and no public tool exposes past months. For an older month you need a duplicate from your distribution company &mdash; its customer service centre can print one, and each of our <a href="/#companies">company pages</a> lists the offices.</p>
<p>The better habit is to download the PDF each month when you check. It takes one tap, and it means you have the record before you need it &mdash; for a tenancy dispute, a tax filing or a new connection application.</p>

<h2>Company-specific quirks worth knowing</h2>
<ul>
  <li><strong>HAZECO</strong> separated from PESCO on 1 July 2025 and many Hazara reference numbers changed. A pre-July-2025 PESCO number will often return nothing &mdash; use one from a recent <a href="/hazeco-bill-check">HAZECO</a> bill.</li>
  <li><strong>Azad Kashmir</strong> is billed by a government department, not a distribution company, and older numbers there can be shorter than 14 digits. Enter them exactly as printed rather than padding them. See <a href="/ajk-bill-check">the AJK page</a>.</li>
  <li><strong>TESCO</strong> serves the merged tribal districts and <strong>QESCO</strong> the whole of Balochistan, both with sparse networks where a connection may be newer than the surrounding records.</li>
  <li><strong>Near a boundary</strong> &mdash; Okara and Sahiwal, or the northern edge of Sheikhupura &mdash; the company is genuinely not what the city suggests. Read it off the bill.</li>
</ul>

<h2>Paying once you have checked</h2>
<p>We show your bill; we do not take payment. Once you have the amount and the reference number, pay through JazzCash, Easypaisa, a bank app, an ATM or a designated bank counter &mdash; our guide to <a href="/blog/how-to-pay-electricity-bill-online-pakistan">paying your bill online</a> compares them. Whichever you use, pay against the reference number, and keep the confirmation until the status updates.</p>

<h2>Check your bill now</h2>
<p><a href="/">Enter your reference number</a> &mdash; free, no sign-up, and it takes about ten seconds.</p>
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
    lastUpdated: "2026-08-16",
    faqs: [
      ["Where exactly is the reference number on my electricity bill?", "Top-left of the page, directly under the name and address block, labelled Reference No., Ref No. or Consumer No. On every PITC-generated bill it is in the same corner, which is the fastest way to find it on a company's layout you have not seen before."],
      ["Why is my AJK reference number shorter than 14 digits?", "Older bills from the AJK Electricity Department carry a shorter number than the 14 digits standard on the mainland. That is not an error and it does not need padding with zeros. Type it exactly as printed. If an old number returns nothing, use one from a recent bill, because AJK records have been renumbered over time."],
      ["Can I find my reference number from the meter number?", "Not directly, and no public lookup converts one to the other. The meter number identifies the physical device; the reference number identifies the billing account. Your distribution company can match them from its own records, which is why a lost-number enquiry has to go to the company rather than to a website."],
      ["My HAZECO number stopped working. Why?", "HAZECO began operating independently of PESCO on 1 July 2025, and the sub-division portion of many Hazara reference numbers changed with the migration. A number copied from a pre-July-2025 PESCO bill will often return nothing. Use the number from a recent HAZECO bill."],
      ["Is it safe to share my reference number?", "Treat it as semi-private. On its own it reveals your bill, your name and your address to anyone who enters it, so do not post a photo of your bill in a public group. It cannot be used to pay from your account or change anything on the connection."],
    ],
    h1: "Where Is the Reference Number on My Electricity Bill?",
    content: `
<p>The reference number is the one detail that unlocks your electricity bill online. It is printed on every bill, it never changes, and with it you can see your amount, your due date and your usage in about ten seconds. Without it you can do nothing at all. This guide covers exactly where it sits on each company&rsquo;s layout, what to do when you have lost every copy of your bill, and the two situations &mdash; AJK and HAZECO &mdash; where a number that looks right still fails.</p>

<h2>Where the reference number is printed</h2>
<p>On every bill generated through the national PITC billing system &mdash; which is all twelve suppliers covered on this site &mdash; the reference number sits in the <strong>top-left corner</strong>, directly beneath the block carrying your name and address. Depending on the company it is labelled <strong>Reference No.</strong>, <strong>Ref No.</strong> or <strong>Consumer No.</strong>, but it is the same number in each case.</p>
<p>The quickest way to identify it on an unfamiliar layout: it is normally the longest continuous run of digits on the page. Your meter number is shorter. Your account or consumer ID, where one is printed separately, is shorter again. If you are looking at two candidate numbers, the longer one is almost always the reference number.</p>

<h2>What it looks like on four different companies&rsquo; bills</h2>
<p>The corner is consistent but the surrounding layout is not, so it helps to see it in place. These are annotated bills from four companies with quite different formats.</p>

<!-- billimage:lesco -->
<!-- billimage:mepco -->
<!-- billimage:pesco -->
<!-- billimage:ajk -->

<h2>Why it is 14 digits</h2>
<p>On the mainland companies the reference number is a <strong>14-digit</strong> code, and the length is not arbitrary. The digits are structured: leading groups identify the distribution company and the sub-division that maintains your connection, and later groups identify the specific consumer account within it. That structure is why the billing system can resolve your bill from the number alone, with no name, address or password.</p>
<p>It also explains two things people find surprising. First, the number belongs to the <strong>connection, not to you</strong> &mdash; it survives a change of tenant or owner, so a bill in a previous occupant&rsquo;s name still carries the number you need. Second, a single mistyped digit will not produce a &ldquo;close&rdquo; result or a helpful error; it will simply return nothing, because the wrong digits resolve to a sub-division or account that does not exist.</p>

<h2>If you have lost every copy of your bill</h2>
<p>This is the genuinely difficult case, because there is no public database that will look your number up from your name or address. In rough order of how quickly they work:</p>
<ol>
  <li><strong>Ask whoever paid it last.</strong> A landlord, a family member or a previous tenant will have it on a receipt or in a payment app&rsquo;s biller list. Wallet apps such as JazzCash and Easypaisa keep saved billers, and the saved entry contains the number.</li>
  <li><strong>Check your bank or wallet payment history.</strong> If you have ever paid the bill electronically, the transaction record will show the reference number you paid against. This is the fastest route for most people and the one most often overlooked.</li>
  <li><strong>Ask a neighbour on the same feeder.</strong> Not to use their number, but because reference numbers on the same sub-division share their leading digits &mdash; which tells your distribution company exactly where to look when you call.</li>
  <li><strong>Go to your company&rsquo;s customer service centre with your CNIC.</strong> They can match the connection from their own records. Take the meter number with you, photographed off the meter itself, because it is what lets them find the account quickly.</li>
</ol>

<h2>Can you get it from the meter number?</h2>
<p>Not by yourself. The meter number is stamped on the meter and identifies the physical device; the reference number identifies the billing account attached to it. There is no public tool that converts one to the other, and any website offering to do so should be treated with suspicion.</p>
<p>Your distribution company <em>can</em> make the match, because both are in its records. So the meter number is worth photographing before you visit an office &mdash; it turns a difficult enquiry into a quick one. Each of our <a href="/#companies">twelve company pages</a> lists that company&rsquo;s own offices and complaint routes.</p>

<h2>The two cases where a correct-looking number still fails</h2>
<h3>Azad Jammu &amp; Kashmir: fewer than 14 digits</h3>
<p>AJK is supplied by a government department rather than a NEPRA-licensed distribution company, and its billing records have their own history. Older AJK bills carry a <strong>shorter reference number</strong> than the mainland 14 digits. That is not a misprint and it must not be padded with zeros &mdash; type it exactly as printed. If an older number returns nothing, the record has most likely been renumbered, and the number on a recent bill is the one the system now recognises. See <a href="/ajk-bill-check">the AJK page</a> for how the department differs from a DISCO.</p>

<h3>Hazara: numbers changed on 1 July 2025</h3>
<p>HAZECO began operating independently of PESCO on <strong>1 July 2025</strong>. Billing records for Abbottabad, Mansehra, Haripur, Battagram, Torghar and the Kohistan districts were migrated into HAZECO&rsquo;s own structure, and the sub-division portion of many reference numbers changed with them. A number copied from a bill issued before that date will frequently return nothing at all. Use the number printed on a recent <a href="/hazeco-bill-check">HAZECO</a> bill; from then on it is stable again.</p>

<h2>Once you have it, keep it somewhere sensible</h2>
<p>Because the number never changes, noting it once removes the problem permanently. Save it in your phone&rsquo;s notes, or add your company as a saved biller in whichever payment app you use &mdash; that stores the number and doubles as a record of what you have paid.</p>
<p>One caution: the reference number is <strong>semi-private</strong>. Anyone who has it can pull up your bill, which shows your name and address. It cannot be used to take money from you or to change anything about the connection, but it is a good reason not to post a photograph of your bill in a public group. That is also how fake &ldquo;subsidy verification&rdquo; scams harvest details &mdash; see <a href="/blog/fake-electricity-bill-qr-code-scam">how to spot them</a>.</p>

<h2>Use it now</h2>
<p>With the number in hand, checking takes about ten seconds and costs nothing. <a href="/">Enter it on the homepage</a>, or go straight to your company&rsquo;s page. For what every line on the bill means once it loads, see our <a href="/sample-bill-explained">annotated sample bill</a>, and for the step-by-step lookup including what to do when it fails, see <a href="/blog/how-to-check-electricity-bill-online-pakistan">how to check your bill online</a>.</p>
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
    lastUpdated: "2026-08-16",
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
<p>Electricity tariffs in Pakistan are set by the National Electric Power Regulatory Authority (NEPRA), not by LESCO. LESCO reads your meter and applies the notified schedule. The rates below are those notified in <a href="https://nepra.org.pk/tariff/Tariff/Notifications/2026/02%20Feb/S.R.O.%20279(1)2026%20dated%2012-02-2026.pdf" target="_blank" rel="noopener noreferrer">S.R.O. 279(I)/2026</a> of 12 February 2026, for Tariff A-1 residential supply with a sanctioned load below 5&nbsp;kW.</p>

<!-- tariff:nepra -->

<h2>The rule that makes bills jump</h2>
<p>Domestic billing is <strong>not telescopic</strong>. Per the notes to the notified schedule, &ldquo;only protected residential consumers will be given the benefit of one previous slab&rdquo;, and lifeline consumers get no slab benefit at all. So for an <strong>unprotected</strong> consumer, <strong>every unit is charged at the rate of the slab you reach</strong>.</p>
<p>This is the single most useful thing to understand about a Pakistani electricity bill, because it means the cost of crossing a boundary is not the cost of the extra units &mdash; it is the cost of repricing the entire month.</p>

<h2>A worked example: 200 units versus 201</h2>
<p>Take an unprotected LESCO household. At exactly <strong>200 units</strong>, the whole month is charged in the 101&ndash;200 band:</p>
<ul>
  <li>200 units &times; Rs 28.91 = <strong>Rs 5,782</strong></li>
</ul>
<p>Now the same household uses <strong>201 units</strong>. The month moves into the 201&ndash;300 band, and <em>all</em> 201 units reprice:</p>
<ul>
  <li>201 units &times; Rs 33.10 = <strong>Rs 6,653</strong></li>
</ul>
<p>One extra unit added about <strong>Rs 871</strong> to the energy charge &mdash; and GST is calculated on top of that, so the real difference on the bill is larger. This is why watching your meter in the last few days of a billing cycle genuinely pays.</p>

<h2>What a protected consumer pays instead</h2>
<p>A <strong>protected</strong> consumer keeps the benefit of one previous slab, so 200 units is charged as 100 &times; Rs 10.54 plus 100 &times; Rs 13.01 = <strong>Rs 2,355</strong>. The gap between protected and unprotected at the same consumption is enormous, which is why protected status is worth guarding.</p>

<h2>Then come the surcharges and taxes</h2>
<p>The energy charge is only part of the bill. On top of it LESCO adds a <strong>fixed charge</strong> based on your sanctioned load (Rs 275&ndash;675 per kW per month depending on your band), the monthly <strong>fuel price adjustment</strong>, any <strong>quarterly tariff adjustment</strong> in force, electricity duty, <strong>GST</strong>, the PTV licence fee and meter rent. Our <a href="/sample-bill-explained">annotated sample bill</a> walks through every one of them.</p>

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
<p>To see your own latest charges, <a href="/ajk-bill-check">check your AJK electricity bill</a> online, or learn <a href="/blog/how-to-check-electricity-bill-online-pakistan">how to check it step by step</a>. Not sure of your number? See <a href="/blog/how-to-find-reference-number-on-electricity-bill">how to find your reference number</a>.</p>
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
    lastUpdated: "2026-08-16",
    faqs: [
      ["What is fuel price adjustment (FPA) on my bill?", "The FPA is a monthly adjustment reflecting the actual cost of fuel used to generate electricity, usually two months earlier. It is added or credited as a separate line, which is why two months with the same units can cost different amounts."],
      ["Why does my per-unit rate go up the more I use?", "Bills use a slab system: as your monthly units cross 100, 200, 300 and higher thresholds, the units in the upper slab are charged at a higher rate."],
      ["What taxes are on an electricity bill?", "Typically electricity duty, GST, a TV licence fee, and sometimes a fixed or minimum charge and a financing-cost surcharge, on top of the energy charge and FPA."],
    ],
    h1: "Unit Slabs, Fuel Price Adjustment (FPA) & Taxes on Your Bill, Explained (2026)",
    content: `
<p>If your electricity bill feels higher than the units suggest, the reason is usually the <strong>slab system</strong>, the monthly <strong>fuel price adjustment (FPA)</strong> and the <strong>taxes</strong> stacked on top. Here is how each part works, in plain language.</p>

<h2>How unit slabs work (and the part almost everyone gets wrong)</h2>
<p>Domestic bills in Pakistan use a <strong>slab</strong> (tiered) system: the per-unit rate steps up as your monthly usage crosses 100, 200, 300 and higher thresholds. Lower-usage <strong>protected</strong> and <strong>lifeline</strong> consumers pay far less per unit than higher-usage <strong>unprotected</strong> ones.</p>
<p>Here is the part that catches people out. Domestic billing is <strong>not telescopic</strong>. The notes to the current notified schedule state that &ldquo;only protected residential consumers will be given the benefit of one previous slab&rdquo; and that a &ldquo;residential life line consumer will not be given any slab benefit&rdquo;. In plain terms: if you are an <strong>unprotected</strong> consumer, <strong>every unit you used is charged at the rate of the slab you reached</strong> &mdash; not just the units above the line.</p>
<p>That single rule explains the jumps that look impossible. At the rates notified in <a href="https://nepra.org.pk/tariff/Tariff/Notifications/2026/02%20Feb/S.R.O.%20279(1)2026%20dated%2012-02-2026.pdf" target="_blank" rel="noopener noreferrer">S.R.O. 279(I)/2026</a>, an unprotected household using exactly 200 units pays 200 &times; Rs 28.91 = <strong>Rs 5,782</strong> in energy charges. Use <strong>one</strong> more unit &mdash; 201 &mdash; and the whole month reprices into the next band: 201 &times; Rs 33.10 = <strong>Rs 6,653</strong>. That one extra unit cost about <strong>Rs 871</strong>, before tax.</p>
<p>A <strong>protected</strong> consumer is treated more kindly: they keep the benefit of the one preceding slab, so at 200 units the first 100 are charged at Rs 10.54 and the next 100 at Rs 13.01, for Rs 2,355 in total.</p>

<h2>Approximate domestic tariff</h2>
<p>These are the NEPRA uniform rates that apply to the mainland DISCOs (LESCO, MEPCO, FESCO and the rest). We show them only once verified against NEPRA, so the figures below appear as they are confirmed.</p>

<!-- tariff:nepra -->

<h2>What is fuel price adjustment (FPA)?</h2>
<p>The FPA is a monthly adjustment that reflects the actual cost of the fuel used to generate electricity, usually two months earlier. When fuel costs rise, the FPA adds to your bill; when they fall, it can be a small credit. It is shown as a separate line and is the single biggest reason two months with the same units can cost different amounts.</p>

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

<h2>سب سے زیادہ بجلی کون استعمال کرتا ہے؟</h2>
<p>ایئر کنڈیشنر، الیکٹرک ہیٹر، پانی کی موٹر اور پرانے فریج سب سے زیادہ یونٹ کھاتے ہیں۔ بل کم کرنے کے لیے پہلے انہی پر توجہ دیں۔</p>

<h2>بل کم کرنے کے آسان طریقے</h2>
<ul>
  <li>اے سی کا درجہ حرارت 26 پر رکھیں اور ممکن ہو تو انورٹر اے سی استعمال کریں۔</li>
  <li>عام بلب کی جگہ ایل ای ڈی لائٹس لگائیں۔</li>
  <li>غیر ضروری آلات مکمل بند کریں، اسٹینڈ بائی پر نہ چھوڑیں۔</li>
  <li>کوشش کریں کہ ماہانہ استعمال 200 یونٹ سے کم رہے تاکہ آپ پروٹیکٹڈ سلیب میں رہیں اور کم ریٹ ملے۔</li>
</ul>

<h2>سلیب کو سمجھیں</h2>
<p>بجلی کا بل سلیب سسٹم پر بنتا ہے: جتنے زیادہ یونٹ، اتنا اونچا فی یونٹ ریٹ۔ اگر آپ کا استعمال اگلے سلیب میں چلا جائے تو بل تیزی سے بڑھتا ہے۔ مزید تفصیل کے لیے پڑھیں: <a href="/blog/electricity-bill-zyada-kyon-aata-hai">بجلی کا بل زیادہ کیوں آتا ہے</a>۔</p>

<h2>اپنا بل آن لائن چیک کریں</h2>
<p>ہر مہینے اپنا بل اور یونٹ دیکھنے کے لیے <a href="/">eBill Pakistan پر اپنا بجلی کا بل چیک کریں</a> — مفت اور فوری۔</p>
`,
  },
  {
    slug: "electricity-bill-qr-code-subsidy",
    title: "Electricity Bill QR Code Scan 2026: How to Check Your Subsidy Eligibility (Step-by-Step)",
    navLabel: "QR code subsidy check",
    metaTitle: "Electricity Bill QR Code Subsidy Check 2026 (Step-by-Step)",
    metaDescription:
      "Electricity bill QR code scan explained: check your subsidy eligibility on the official css.pitc.com.pk portal in about two minutes. Verify yours today.",
    publishedDate: "2026-07-03",
    lastUpdated: "2026-07-03",
    faqs: [
      ["What is the QR code on my electricity bill for?", "It is part of the government's Cross Subsidy Program. Scanning it opens the official PITC verification portal, where subsidised consumers confirm their eligibility with their bill reference number and CNIC so the reduced rate stays applied to their bill."],
      ["Which website is the official subsidy verification portal?", "The official portal is css.pitc.com.pk, run by the Power Information Technology Company (PITC) for the Government of Pakistan. Do not enter your details on any other website, link or app claiming to register you for the subsidy."],
      ["What do I need to check my subsidy eligibility?", "Just two things: the 14-digit reference number printed on your bill and your CNIC number. Verification is confirmed with a one-time password (OTP) sent to your mobile, and the whole process takes about two minutes."],
      ["What happens if I ignore the QR code on my bill?", "According to official announcements and news reports, consumers who do not complete verification risk losing the subsidised rate and being billed at higher unprotected rates. If a QR code has appeared on your bill, it is worth verifying promptly."],
    ],
    h1: "Electricity Bill QR Code Scan 2026: How to Check Your Subsidy Eligibility",
    content: `
<p>If a QR code has appeared on your electricity bill, it is not decoration. The <strong>electricity bill QR code</strong> is how the government now verifies who qualifies for a subsidised power rate under the <strong>Cross Subsidy Program</strong>. Scanning it opens the official PITC portal, where you confirm your eligibility with your 14-digit reference number and CNIC in about two minutes. This guide walks through the whole process step by step, and explains what happens if you skip it.</p>

<h2>What is the QR code on your electricity bill?</h2>
<p>In May 2026 the government introduced QR-code verification for subsidised electricity consumers. The aim is simple: make sure the subsidy, a reduced per-unit rate funded by the state, actually reaches deserving households, and stop it leaking to consumers who do not qualify.</p>
<p>Instead of visiting an office or filling in paper forms, eligible consumers scan the QR code printed on their monthly bill. It leads to the official verification portal at <a href="https://css.pitc.com.pk/" target="_blank" rel="noopener noreferrer">css.pitc.com.pk</a>, run by the Power Information Technology Company (PITC), the same organisation that operates the official bill system for all DISCOs.</p>

<h2>Who gets the QR code?</h2>
<p>The programme is aimed at <strong>domestic consumers on subsidised rates</strong>, which news reports describe as households using up to around 200 units per month, the protected, low-income category. If your usage and category qualify, the QR code appears on your printed bill automatically. There is nothing to request and nothing to pay.</p>
<p>If there is no QR code on your bill, you are most likely not in the subsidised category, and no action is needed.</p>

<h2>Step by step: scan the QR code and verify</h2>
<ol>
  <li>Take your latest paper bill and open the <strong>camera app</strong> on your phone (or any QR scanner app).</li>
  <li>Point it at the QR code on the bill and tap the link that appears. It should open the official portal at <strong>css.pitc.com.pk</strong>, check the address before typing anything.</li>
  <li>Enter your <strong>14-digit reference number</strong>, the one printed at the top-left of the bill. Not sure where it is? See <a href="/blog/how-to-find-reference-number-on-electricity-bill">where to find your reference number</a>.</li>
  <li>Enter your <strong>CNIC number</strong>.</li>
  <li>Confirm with the <strong>OTP</strong> (one-time password) sent to your mobile number.</li>
</ol>
<p>That is it. If your details match the government's records, verification is complete and the subsidised rate continues on your next bill automatically. No office visit, no fee, no paperwork.</p>

<h2>What happens after you verify</h2>
<p>Nothing changes on your side. Your bill keeps arriving as normal, with the subsidised rate applied. The verification simply ties the subsidy to a real, eligible household. You can keep an eye on your monthly amount and units by <a href="/">checking your electricity bill online</a> with the same reference number, free and with no sign-up.</p>

<h2>What if you don't verify?</h2>
<p>According to official announcements and news coverage, consumers who ignore the QR code risk <strong>losing their subsidised status</strong>, which means being billed at the higher unprotected rates. Since verification takes about two minutes, it is not worth putting off. If the QR code will not scan, you can type <strong>css.pitc.com.pk</strong> into your browser directly and complete the same steps.</p>

<h2>A word of caution: only use the official portal</h2>
<p>Scammers have been quick to copy this programme. Fake "subsidy registration" links and QR codes are circulating on WhatsApp and social media, built to steal CNIC details and OTPs. The genuine QR code is <strong>printed on your bill</strong>, and the genuine portal is <strong>css.pitc.com.pk</strong>, nothing else. Read our companion guide: <a href="/blog/fake-electricity-bill-qr-code-scam">how to spot fake subsidy links and QR code scams</a>.</p>

<h2>Roman Urdu: mukhtasar tariqa</h2>
<p>Apne bijli ke bill par chapa hua QR code mobile camera se scan karein. Official portal css.pitc.com.pk khulega. Wahan apna 14 hindson ka reference number aur CNIC number likhein, phir mobile par aane wala OTP code darj karein. Bas, do minute mein verification mukammal, aur subsidy wala kam rate agle bill par bhi jari rahega. Khayal rahe: sirf bill wala QR code scan karein, WhatsApp ya kisi aur link par apni maloomat kabhi na dein.</p>

<h2>Check your bill while you're at it</h2>
<p>Your reference number does double duty: it verifies your subsidy and it shows your latest bill. <a href="/">Check your electricity bill on eBill Pakistan</a>, it takes about ten seconds, free.</p>
`,
  },

  {
    slug: "fake-electricity-bill-qr-code-scam",
    title: "Is That Electricity Bill QR Code Real? How to Spot Fake Subsidy Links & Scams",
    navLabel: "Spot fake subsidy scams",
    metaTitle: "Fake Electricity Bill QR Code & Subsidy Scams: Stay Safe",
    metaDescription:
      "Fake electricity bill QR codes and subsidy links are being used to steal data in Pakistan. Learn how to spot the scam and verify safely. Stay protected.",
    publishedDate: "2026-07-03",
    lastUpdated: "2026-07-03",
    faqs: [
      ["How do I know if an electricity subsidy link is real?", "The only official subsidy verification portal is css.pitc.com.pk, reached by scanning the QR code printed on your own bill. Links received on WhatsApp, SMS or social media, or sites with similar-looking addresses, are not official."],
      ["Does the government charge a fee to register for the electricity subsidy?", "No. Subsidy verification is completely free. Any link, call or message asking for a payment, a bank detail or a wallet PIN to 'unlock' a subsidy is a scam."],
      ["What should I do if I entered my details on a fake link?", "Do not share any further codes. If you gave a bank or wallet detail, inform your bank immediately. Report the link to the FIA's National Cyber Crime Reporting portal or your nearest FIA cybercrime circle, and warn anyone you forwarded it to."],
      ["Is the QR code printed on my own bill safe to scan?", "Yes. The QR code printed on a genuine bill leads to the official PITC portal. The danger is QR codes and links shared by other people online, and sharing a photo of your own bill publicly, since it exposes your reference number and QR code."],
    ],
    h1: "Is That Electricity Bill QR Code Real? How to Spot Fake Subsidy Links & Scams",
    content: `
<p>A QR code on your electricity bill can now save you money, and that is exactly why scammers are copying it. In May 2026 the Power Division publicly warned that <strong>fake subsidy links and QR codes</strong> are circulating online, designed to steal CNIC details, OTP codes and personal data under the pretext of bill relief. Here is how the scam works, how to tell real from fake, and what to do if you have already clicked.</p>

<h2>The official warning</h2>
<p>The Power Division's warning, covered by <a href="https://www.dawn.com/news/2002231" target="_blank" rel="noopener noreferrer">Dawn</a> and other major outlets, said fraudsters are circulating suspicious links and fake QR codes connected to electricity bill subsidies. Victims are walked through a form that collects personal details, then asked for a <strong>six-digit verification code</strong>, the OTP that lets someone else take over an account or complete a registration in your name. Law enforcement agencies have been informed, but the safest defence is knowing what the real process looks like.</p>

<h2>How the scam works</h2>
<ol>
  <li>You receive a link or QR code on WhatsApp, Facebook or SMS claiming to offer a subsidy, relief package or bill discount.</li>
  <li>The page looks official and asks for your CNIC, mobile number and bill reference number.</li>
  <li>It then asks for the <strong>six-digit code</strong> sent to your phone. That code is the key: with it, the scammer can verify things as if they were you.</li>
  <li>Some versions also ask for a "processing fee" through a wallet or bank transfer.</li>
</ol>

<h2>Real vs fake: the quick checklist</h2>
<ul>
  <li><strong>Real:</strong> the QR code is <strong>printed on your own paper bill</strong> by your DISCO.</li>
  <li><strong>Real:</strong> it opens <strong>css.pitc.com.pk</strong>, the official PITC portal, check the address bar.</li>
  <li><strong>Real:</strong> verification is <strong>free</strong> and only ever asks for your reference number, CNIC and the OTP <em>on the official site itself</em>.</li>
  <li><strong>Fake:</strong> any subsidy link that arrives via WhatsApp, SMS, email or social media.</li>
  <li><strong>Fake:</strong> any page asking for a fee, bank details, card number or wallet PIN.</li>
  <li><strong>Fake:</strong> lookalike addresses, extra words, odd spellings or unfamiliar domains instead of pitc.com.pk.</li>
</ul>
<p>For the legitimate process from start to finish, see our step-by-step guide: <a href="/blog/electricity-bill-qr-code-subsidy">how to check your subsidy eligibility with the bill QR code</a>.</p>

<h2>One more habit to drop: posting your bill online</h2>
<p>A photo of your bill shared in a public group exposes your reference number and your QR code. With those, someone else can attempt registrations linked to your connection. Share bill photos only with people you trust, and crop or cover the QR code if you must post one publicly.</p>

<h2>If you already entered your details</h2>
<ul>
  <li><strong>Stop at the OTP.</strong> If you have not shared the six-digit code, you are probably fine, close the page and do not respond to follow-ups.</li>
  <li><strong>Told them the OTP?</strong> Watch your SIM and accounts for unusual activity and inform your mobile operator.</li>
  <li><strong>Shared a bank or wallet detail?</strong> Call your bank's helpline immediately and have the account monitored or blocked.</li>
  <li><strong>Report it.</strong> Use the FIA's National Cyber Crime Reporting portal, and warn anyone you forwarded the link to.</li>
</ul>

<h2>Roman Urdu: khulasa</h2>
<p>Asli QR code sirf aap ke apne bill par chapa hota hai aur css.pitc.com.pk kholta hai. WhatsApp ya SMS par aane wala koi bhi "subsidy link" jaali hai. Hukumat subsidy ke liye koi fees nahi leti, aur chhe hindson ka OTP code kabhi kisi ko na batayein. Shak ho to link band karein aur apna bill hamesha official zariye se check karein.</p>

<h2>Check your bill the safe way</h2>
<p>Whenever you want to see your latest amount, units or due date, skip the forwarded links entirely, <a href="/">check your electricity bill online</a> with just your reference number, free and with no sign-up.</p>
`,
  },

  {
    slug: "hazeco-bill-check-online",
    title: "HAZECO Bill Check Online 2026: What Is Hazara Electric Supply Company?",
    navLabel: "HAZECO bill check guide",
    metaTitle: "HAZECO Bill Check Online 2026 — What Is HAZECO?",
    metaDescription:
      "HAZECO bill check online in seconds: what Hazara Electric Supply Company is, which districts it covers, and how to view your bill free. Check yours now.",
    publishedDate: "2026-07-03",
    lastUpdated: "2026-08-16",
    faqs: [
      ["What is HAZECO?", "HAZECO is the Hazara Electric Supply Company, the distribution company for the Hazara division of Khyber Pakhtunkhwa. It was incorporated on 31 October 2023, granted its distribution licence in May 2025, and began operating independently on 1 July 2025. It is headquartered in Abbottabad."],
      ["Which districts does HAZECO cover?", "HAZECO serves the Hazara division, including Abbottabad, Mansehra, Haripur, Battagram and Kohistan. Homes and businesses in these districts previously received PESCO bills."],
      ["Why does my old PESCO reference number not work for HAZECO?", "When HAZECO separated from PESCO, reference numbers in the Hazara region were migrated to HAZECO's own billing structure, and the sub-division portion of many numbers changed. Use the reference number printed on a recent HAZECO bill rather than an old PESCO one."],
      ["Is HAZECO's tariff different from PESCO's?", "No. Like the other mainland DISCOs, HAZECO bills on NEPRA's uniform consumer-end tariff, so the slab rates match those of PESCO and the rest of the country. Fuel price adjustment and taxes are added the same way."],
    ],
    h1: "HAZECO Bill Check Online 2026: What Is Hazara Electric Supply Company?",
    content: `
<p>Checking your <strong>HAZECO bill online</strong> takes about ten seconds with the reference number printed on any recent bill. HAZECO, the <strong>Hazara Electric Supply Company</strong>, is Pakistan's newest distribution company, serving Abbottabad, Mansehra, Haripur and the rest of the Hazara division. This guide explains what HAZECO is, why your area moved from PESCO, and exactly how to view, download or print your bill.</p>

<h2>What is HAZECO?</h2>
<p>HAZECO was carved out of <a href="/pesco-bill-check">PESCO</a> to give the Hazara division its own dedicated distribution company, with its head office in Abbottabad. It was incorporated on <strong>31 October 2023</strong>, granted distribution licence DL/10/2025 on <strong>23 May 2025</strong>, and began <strong>independent operations on 1 July 2025</strong> — that last date is the one that matters to you, because it is when reference numbers moved. Before that, homes in Hazara received PESCO bills and dealt with PESCO offices. The split was meant to bring billing, complaints and maintenance closer to the region rather than running everything from Peshawar. Details about the company itself are on the <a href="https://hazeco.com.pk/" target="_blank" rel="noopener noreferrer">official HAZECO website</a>.</p>

<h2>Areas HAZECO serves</h2>
<p>HAZECO covers the districts of the Hazara division: <strong>Abbottabad</strong>, <strong>Mansehra</strong>, <strong>Haripur</strong>, <strong>Battagram</strong> and <strong>Kohistan</strong>. If your home or shop is in one of these districts, your electricity bill now comes from HAZECO, even if the meter and connection were originally set up under PESCO.</p>

<h2>How to check your HAZECO bill online</h2>
<ol>
  <li>Open the <a href="/hazeco-bill-check">HAZECO bill check page</a> on eBill Pakistan.</li>
  <li>Enter the <strong>14-digit reference number</strong> printed at the top-left of any recent HAZECO bill.</li>
  <li>Press <strong>Check HAZECO Bill</strong>. Your latest bill loads in seconds.</li>
  <li>Read the amount and due date, <strong>download the PDF</strong>, print it, or share it on WhatsApp.</li>
</ol>
<p>It is free, needs no account, and works for every district on the HAZECO network. If you cannot spot the number on your bill, see <a href="/blog/how-to-find-reference-number-on-electricity-bill">where the reference number is printed</a>.</p>

<h2>Old PESCO reference number? Read this</h2>
<p>When HAZECO began operating independently on 1 July 2025, billing records were migrated to HAZECO's own structure, and the sub-division portion of many reference numbers changed. If a number copied from a <strong>pre-July-2025 PESCO bill</strong> is not returning a result, use the reference number from a <strong>recent HAZECO bill</strong> instead, that is the number the system recognises now. The new number stays the same month after month, so you only need to note it once.</p>

<h2>HAZECO tariff: same NEPRA rates as the rest of Pakistan</h2>
<p>HAZECO did not bring new rates. Like PESCO and the other mainland DISCOs, it bills on NEPRA's uniform consumer-end tariff: the familiar slab system, plus fuel price adjustment, duty and taxes. If your bill looks higher than expected, the slabs are usually the reason, our plain-language guide to <a href="/blog/unit-slabs-fuel-price-adjustment-taxes-explained">unit slabs, FPA and taxes</a> explains how the total is built.</p>

<h2>Check your HAZECO bill now</h2>
<p>Ready? <a href="/hazeco-bill-check">Check your HAZECO bill online</a>, free, instant and with no sign-up. Keep your reference number saved and you will never need to wait for the paper bill again.</p>
`,
  },

  {
    slug: "pm-fan-replacement-program",
    title: "PM Fan Replacement Program (efan.gov.pk): How On-Bill Installments Work & How to Apply",
    navLabel: "PM fan replacement scheme",
    metaTitle: "PM Fan Replacement Program (efan.gov.pk): How to Apply",
    metaDescription:
      "How the PM Fan Replacement Program works: energy-saving fans on easy installments added to your electricity bill via efan.gov.pk. See if you qualify.",
    publishedDate: "2026-07-03",
    lastUpdated: "2026-07-03",
    faqs: [
      ["What is the PM Fan Replacement Program?", "It is a government scheme that replaces old, power-hungry ceiling fans with energy-efficient 5-star rated fans. Instead of paying the full price upfront, the cost is recovered in monthly installments added to your electricity bill. Applications go through the official portal, efan.gov.pk."],
      ["How do the installments work?", "The new fan's cost is spread over monthly installments, reported as 6 to 18 months, which appear as a line on your electricity bill and are paid along with it. There is no separate loan account to manage."],
      ["Who can apply for the fan replacement scheme?", "The connection must be a domestic one and the application is tied to your electricity bill and CNIC. Exact eligibility rules, fan models and prices are listed on the official portal at efan.gov.pk."],
      ["How much electricity does an energy-saving fan actually save?", "A 5-star rated fan uses far less power than the decades-old fans common in Pakistani homes, official material puts the saving at up to 70%. With several fans running all summer, that is a meaningful cut in monthly units."],
    ],
    h1: "PM Fan Replacement Program (efan.gov.pk): How On-Bill Installments Work & How to Apply",
    content: `
<p>The <strong>PM Fan Replacement Program</strong> lets you swap old, power-hungry ceiling fans for energy-efficient ones <strong>without paying the full price upfront</strong>, the cost is recovered in monthly installments added to your electricity bill. Applications go through the official portal, <a href="https://efan.gov.pk/" target="_blank" rel="noopener noreferrer">efan.gov.pk</a>. Here is how the scheme works, what it costs, and how to apply.</p>

<h2>Why fans, of all things?</h2>
<p>Ceiling fans are the quiet giant of Pakistan's summer load. A typical old fan draws far more power than a modern energy-efficient one, and most homes run several fans for most of the day, for months. Replacing them with <strong>5-star rated fans</strong> (certified under NEECA's energy-labelling regime) cuts that load sharply, official material puts the saving at <strong>up to 70%</strong> per fan. Nationally the scheme is meant to shave thousands of megawatts off peak demand; for your household, it simply means fewer units on the bill.</p>

<h2>How the on-bill installments work</h2>
<p>The clever part of the scheme is the payment method, known as <strong>on-bill financing</strong>:</p>
<ol>
  <li>You choose an approved energy-saving fan through the programme.</li>
  <li>Instead of paying the full price at purchase, the cost is split into <strong>monthly installments, reported as 6 to 18 months</strong>.</li>
  <li>Each installment appears as a line on your monthly <strong>electricity bill</strong> and is paid along with it, no separate loan, bank visit or due date to track.</li>
</ol>
<p>Because the saving in units starts immediately, part of each installment is effectively paid for by the electricity the new fan no longer wastes. News reports also mention a small per-fan service fee and a discount for handing in your old fan; check the current figures on <a href="https://efan.gov.pk/" target="_blank" rel="noopener noreferrer">efan.gov.pk</a>, as they can change with each phase of the programme.</p>

<h2>How to apply on efan.gov.pk</h2>
<ol>
  <li>Open the official portal at <strong>efan.gov.pk</strong>.</li>
  <li>Register with your <strong>CNIC</strong> and your electricity bill details, keep your <strong>14-digit reference number</strong> handy. If you are not sure where it is, see <a href="/blog/how-to-find-reference-number-on-electricity-bill">how to find your reference number</a>.</li>
  <li>Browse the approved 5-star fan models and choose the ones you want.</li>
  <li>Confirm your application; the installment plan is then linked to your electricity connection.</li>
</ol>
<p>The bill must relate to a genuine domestic connection, and the application is tied to your CNIC. Exact eligibility conditions, prices and available models are listed on the portal itself, treat anything you read elsewhere (including exact fees quoted in news coverage) as subject to change.</p>

<h2>Watch the numbers on your own bill</h2>
<p>Once your new fans are running, the proof is in the units. <a href="/">Check your electricity bill online</a> each month and compare units with the same month last year, a successful swap shows up as a visible drop. If your bill still seems high, our guide to <a href="/blog/electricity-bill-zyada-kyon-aata-hai">why electricity bills come out high</a> covers the other usual suspects, from slab jumps to meter issues.</p>

<h2>Beware of copycat "registration" links</h2>
<p>As with the subsidy QR code, only use the official portal. Links circulating on WhatsApp or social media that ask for fees or OTP codes to "register" you for the fan scheme are not official, see <a href="/blog/fake-electricity-bill-qr-code-scam">how to spot fake links and scams</a>.</p>

<h2>The bottom line</h2>
<p>If your fans are more than a few years old, the programme is worth a serious look: no lump-sum payment, installments folded into a bill you already pay, and a permanent cut in summer units. Start at <strong>efan.gov.pk</strong>, and keep an eye on your monthly bill to watch the saving arrive.</p>
`,
  },

  {
    slug: "mdi-fixed-charges-electricity-bill",
    title: "What Is MDI and Fixed Charges on Your Electricity Bill? (Explained in Plain English)",
    navLabel: "MDI & fixed charges",
    metaTitle: "What Is MDI and Fixed Charges on Your Electricity Bill?",
    metaDescription:
      "What MDI and fixed charges mean on your Pakistani electricity bill, in plain English: how they are calculated and why they appear. Check your bill today.",
    publishedDate: "2026-07-03",
    lastUpdated: "2026-07-03",
    faqs: [
      ["What does MDI stand for on an electricity bill?", "MDI stands for Maximum Demand Indicator. It is the highest electrical load, measured in kilowatts (kW), that your connection drew at any point during the billing month. It measures how hard you pulled on the grid at your peak moment, not how many units you used overall."],
      ["Why am I paying fixed charges even when I use very little electricity?", "Fixed charges recover the cost of keeping your connection ready: the wires, transformers and grid capacity reserved for you whether you use them or not. They apply per kilowatt of your sanctioned load or recorded MDI, so they appear even in a low-usage month."],
      ["How are domestic fixed charges calculated?", "NEPRA sets a rupees-per-kW monthly rate that varies by consumption slab and protected status. Most home meters do not record MDI, so the charge is based on a share of the connection's sanctioned load instead. The exact rate schedule is on nepra.org.pk."],
      ["Can I reduce MDI or fixed charges?", "For homes, the main lever is avoiding switching every heavy appliance on at once, which is what pushes peak demand up, and keeping monthly units in a lower slab. Commercial and industrial consumers can also review whether their sanctioned load matches what they actually use."],
    ],
    h1: "What Is MDI and Fixed Charges on Your Electricity Bill? (Explained in Plain English)",
    content: `
<p>Two lines on Pakistani electricity bills confuse people more than any others: <strong>MDI</strong> and <strong>fixed charges</strong>. Put simply, <strong>MDI (Maximum Demand Indicator)</strong> is the highest load your connection pulled at any moment in the month, measured in kilowatts, and <strong>fixed charges</strong> are what you pay for the grid keeping that capacity ready for you, regardless of how many units you used. Here is what each one means and how they are worked out.</p>

<h2>Units vs load: the key idea</h2>
<p>Your bill measures two different things. <strong>Units (kWh)</strong> are the total energy you consumed over the month, that is what the slab system charges for. <strong>Load (kW)</strong> is how much power you were drawing at a single moment. Run one AC for ten hours and you use many units at a modest load; switch on two ACs, a water pump and an iron together and your load spikes even if only for a few minutes. MDI captures that spike.</p>

<h2>What exactly is MDI?</h2>
<p>The <strong>Maximum Demand Indicator</strong> is recorded by the meter as the highest average demand over short intervals during the billing period. On bills for commercial and industrial connections you will see it printed as a kW figure. It matters because the network, the transformer in your street, the feeder, the grid behind it, has to be sized for everyone's peak moments, not their averages. Consumers whose peaks are higher put more strain on that infrastructure, so part of their bill is tied to it.</p>

<h2>What are fixed charges?</h2>
<p>Fixed charges recover the costs that do not change with your usage: wires, transformers, metering, and the generation capacity kept on standby for you. They are billed in <strong>rupees per kilowatt per month</strong>, applied to your <strong>sanctioned load</strong> (the capacity your connection was approved for) or your recorded <strong>MDI</strong>, whichever is higher. That is why a workshop that barely ran its machines can still receive a noticeable bill: the capacity was reserved even if it went unused.</p>

<h2>Fixed charges on domestic bills</h2>
<p>Fixed charges used to be mainly a commercial and industrial matter, but NEPRA has extended them to domestic consumers as well, and revised them upward in its February 2026 determination. As reported, domestic rates now range from roughly <strong>Rs 200 to Rs 675 per kW per month</strong> depending on your consumption slab and whether you are a protected consumer, with higher-usage households paying more. Most home meters cannot record MDI, so the charge is based on a share of the connection's sanctioned load instead. For the exact current schedule, check the <a href="https://www.nepra.org.pk" target="_blank" rel="noopener noreferrer">official NEPRA website</a>, the figures are revised from time to time.</p>

<h2>Can you do anything about them?</h2>
<ul>
  <li><strong>Spread out heavy loads.</strong> Avoid running every big appliance at once, staggering the water pump, iron and ACs keeps your peak demand down.</li>
  <li><strong>Watch your slab.</strong> Fixed charges step up with consumption slabs, so the advice in our <a href="/blog/unit-slabs-fuel-price-adjustment-taxes-explained">guide to unit slabs, FPA and taxes</a> helps here too: staying in a lower slab can mean both a lower unit rate and a lower fixed charge.</li>
  <li><strong>Right-size a sanctioned load.</strong> For commercial connections, if your sanctioned load is far above what you ever use, ask your DISCO about revising it, you may be paying for capacity you never touch.</li>
</ul>

<h2>See these lines on your own bill</h2>
<p>The easiest way to make sense of MDI and fixed charges is to look at your actual bill with this guide open. <a href="/">Check your electricity bill online</a> with your 14-digit reference number, free, instant and with no sign-up, and see exactly what your connection is being charged for.</p>
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
    "azad-kashmir-electricity-unit-price-tariff",
    "how-to-find-reference-number-on-electricity-bill",
    "how-to-check-electricity-bill-online-pakistan",
  ],
  hazeco: [
    "hazeco-bill-check-online",
    "how-to-find-reference-number-on-electricity-bill",
    "how-to-check-electricity-bill-online-pakistan",
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
