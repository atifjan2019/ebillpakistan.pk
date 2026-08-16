# AdSense remediation — Phase 1 report

**Site:** ebillpakistan.pk · **Date:** 16 August 2026 · **Scope:** Phase 1 (blockers) only
**Build:** `npm run build` passes — 46 static pages generated, 0 errors.

---

## 0. Codebase findings (Step 0)

| Question | Answer |
|---|---|
| Framework | Next.js `16.2.6`, **App Router**, React 19, JavaScript (only `middleware.ts` is TS) |
| Styling | One hand-written `app/globals.css` (no Tailwind, no CSS modules) with CSS custom properties |
| 12 DISCO pages | **One dynamic route** `app/[slug]/page.js` + `generateStaticParams`; content from `lib/discos.js`, `lib/companies.js`. `faqsFor(code)` generates the *same 5 FAQs from a template* for all 12 — this is the doorway-page engine Phase 2 must dismantle |
| Blog posts | **Two sources**: 18 static objects in `lib/articles.js` (trusted HTML strings) + API-published posts in Upstash Redis (`blog:posts`), merged by `lib/posts.js`. So "28 posts" = 18 in code + ~10 in KV |
| robots / sitemap | `app/robots.js` + `app/sitemap.js` (Metadata API) |
| Bill lookup | GET form → `/result?disco=…&reference=…`. **In production it takes the `directPost` branch** (`!!process.env.VERCEL && !process.env.PITC_PROXY`) and renders `BillReady.js`: a 10-second countdown then a button that POSTs the *visitor's own browser* to `bill.pitc.com.pk`, opening the bill **in a new tab**. The site never renders a bill itself unless `PITC_PROXY` is set. A parsed-JSON endpoint exists (`/api/bill-json` → `fetchBillJson`) but **no page uses it** |
| Author concept | None existed. `Article` JSON-LD credited the Organization; zero bylines |
| Existing convention worth keeping | `lib/tariffs.js` keeps **every rate `null`** and `<TariffTable>` renders "—" + a "pending verification" notice. Your no-fabrication rule was already encoded in the codebase; Phase 1 extended that pattern rather than inventing a second one |

---

## 1. Every file changed

### New files (15)

| File | Purpose |
|---|---|
| `lib/authors.js` | Author records + `authorFor()` render-time resolution |
| `lib/consent.js` | Consent state contract (`readConsent`/`writeConsent`, events) |
| `lib/contact.js` | `CONTACT_SUBJECTS` + `BUSINESS` (address/phone/email), single-sourced |
| `lib/sampleBill.js` | The annotated sample bill dataset |
| `app/Byline.js` | `AuthorAvatar`, `Byline`, `BylineCompact` (server components) |
| `app/Verify.js` | Renders `{{VERIFY: …}}` as a highlighted `<mark>` so placeholders are impossible to miss |
| `app/CookieConsent.js` | Consent bar + `CookieSettingsLink` for the footer |
| `app/AdSense.js` | AdSense loader, gated on consent; inert until `NEXT_PUBLIC_ADSENSE_CLIENT` is set |
| `app/author/[slug]/page.js` | Author page + Person JSON-LD |
| `app/editorial-policy/page.js` | Editorial policy (906 words) |
| `app/sample-bill-explained/page.js` | Annotated sample bill (2,347 words) |
| `app/contact/ContactForm.js` | Client form: validation, honeypot, 16px inputs |
| `app/api/contact/route.js` | Contact API: honeypot, timing check, rate limit, validation, delivery |

### Modified files (12)

| File | Change |
|---|---|
| `app/robots.js` | **Removed `Disallow: /result`**; `/api/`, `/admin`, `/_next/image` kept |
| `app/sitemap.js` | Added `/sample-bill-explained` (priority 0.7), `/editorial-policy`, `/author/*`; refreshed `lastModified` |
| `app/privacy/page.js` | Full rewrite with third-party ad-cookie disclosure + opt-out links |
| `app/contact/page.js` | Form, phone/address/email, 500+ words of substantive help content |
| `app/layout.js` | Footer: sample bill, editorial policy, cookie settings, postal address; mounts `<CookieConsent />` + `<AdSense />` |
| `app/page.js` | Organization JSON-LD gains address + contactPoint; link to sample bill |
| `app/[slug]/page.js` | Link to sample bill from "Understanding your {ABBR} bill" |
| `app/blog/[slug]/page.js` | `<Byline>`, **Person** author in Article JSON-LD, post footer with author + editorial policy |
| `app/blog/page.js` | Cards became `<article>` with a linked title *and* a linked byline (an `<a>` cannot nest in an `<a>`) |
| `app/api/posts/route.js` | Accepts `author` + `updatedAt`; revalidates the author page |
| `lib/store.js` | `rateLimitContact` (3/hour/IP), `saveContactMessage`, `getContactMessages` |
| `app/globals.css` | ~280 new lines; plus mobile-density and tap-target fixes |

---

## 2. `{{VERIFY: …}}` placeholders — grouped by page

**4 outstanding.** Grep them with `grep -rn "{{VERIFY:" lib/ app/` (two further hits are just comments in `app/Verify.js`). Each renders on-page as a highlighted yellow `<mark>`, so an unresolved one is visible at a glance.

### `/author/atif-jan` — `lib/authors.js`
1. `{{VERIFY: one sentence on what prompted Atif to build eBill Pakistan}}`
2. `{{VERIFY: Atif Jan's professional background, e.g. software engineering — one short phrase}}`

### `/contact` — `lib/contact.js`
3. `{{VERIFY: business phone number in international format, e.g. +92 91 000 0000}}`

### `/sample-bill-explained` — inline in the page
4. `{{VERIFY: current protected-consumer unit threshold and number of consecutive months required, per the latest NEPRA determination}}`

### Not a `{{VERIFY}}`, but still needed
- **Author headshot.** Drop a square image at `public/images/authors/atif-jan.jpg` and set `photo:` in `lib/authors.js`. Until then an "AJ" monogram renders (not a broken image), which is acceptable but weaker for E-E-A-T.
- **`sameAs: []`** in `lib/authors.js` — add real profile URLs (LinkedIn/X) if they exist. Leave empty rather than inventing.

### Used as given (not placeholders)
- Address: **Office 27, Mardan Road, Charsadda 24420, Khyber Pakhtunkhwa** — now in `/contact`, the footer, Organization JSON-LD and ContactPage JSON-LD.

---

## 3. Mobile behaviour — measured, not estimated

Measured in headless Chrome at **360 / 390 / 414 / 768 px** (`deviceScaleFactor 2`, touch emulation).

### Horizontal overflow — PASS everywhere

`document.documentElement.scrollWidth − viewportWidth = 0px` on **every page at every width**, and **zero** horizontally-scrolling containers (`overflow-x: auto|scroll` with content wider than the box).

The sample bill deliberately uses **no `<table>`**: line items are a flex `<ul>` and annotations are a 1-column card grid (2 columns from 900px), so there is nothing that *could* scroll sideways.

### Cookie banner vs the lookup form @ 360×780

The first build failed this: the banner was **373px tall** and covered the whole form. After compacting it (hidden heading on mobile, shortened copy, 3 buttons in one row instead of a stack) and tightening hero density on ≤620px:

| | 360px | 390px | 414px |
|---|---|---|---|
| Banner height | 174px | 152px | 152px |
| Banner top | 606 | 628 | 628 |
| "Check Bill" button bottom | **599** | 567 | 567 |
| Clearance | **7px** | 61px | 61px |

**All three interactive controls — company select, reference input, Check Bill button — are fully visible and untouched above the banner at 360px.** Verified by screenshot.

**Honest caveat:** the `.search-card`'s *bottom padding and the static helper line* ("Pick your company, then enter the reference number…") do sit behind the banner at 360px. Clearing that too would need ~83px more, which is only reachable by deleting that helper text — a worse trade for users. Phase 3 rewrites the homepage and can reclaim it properly.

### Other Phase-1 verifications

| Check | Result |
|---|---|
| Contact form at 360px | PASS — labels above inputs, inputs **16px** (no iOS zoom), 48px tall |
| Tap targets on new components | PASS — banner buttons 48px, `blog-more` 44px, byline links 44px, sample-bill rows 44px |
| Hamburger menu | **Fixed** — was 40×34, now 44×44 |
| Footer links | **Fixed** — were 22px tall, now 44px hit area (padding + negative margin, visual rhythm unchanged) |
| Avatar monogram | **Bug found and fixed** — `font-size: .42em` inherited from a 12.5px byline and computed to **5.25px**. Now sized from the avatar in JS |
| Honeypot field | **Bug found and fixed** — `left:-9999px` left a 174px-wide box; switched to the standard 1px clip-path pattern |
| CLS from the banner | 0 — `position: fixed`, renders nothing server-side and nothing on first paint |
| Internal links | **40 URLs crawled, 0 broken** |

### Screenshots (360px)

`/private/tmp/claude-501/-Users-atifjan-Desktop-ebillpakistan-pk/ba4ba1a5-baa0-48b6-8de3-4094621b47fb/scratchpad/`
`shot-home-banner-360.png`, `shot-home-manage-360.png`, `shot-home-360.png`, `shot-sample-360.png`, `shot-contact-360.png`, `shot-blog-360.png`, `shot-author-360.png`

---

## 4. Task-by-task results

### TASK 1 — Unblock the result page ✅

- **(a)** `Disallow: /result` removed. Live `robots.txt` now:
  ```
  User-Agent: *
  Allow: /
  Disallow: /api/
  Disallow: /admin
  Disallow: /_next/image
  ```
- **(b)** `/result` already set `robots: {index:false, follow:true}` in `generateMetadata`. Verified it emits `<meta name="robots" content="noindex, follow"/>`. A comment in `robots.js` now records *why* the two mechanisms are not interchangeable.
- **(c)** `/sample-bill-explained` — **2,347 words**, reference `00000000000000`, consumer "Sample Consumer". All 12 required fields annotated: reference number, units consumed, current charges, FPA, quarterly adjustment, GST, TV fee, meter rent, arrears, due date, late payment surcharge, protected-consumer status (plus fixed charges and electricity duty). Internally consistent arithmetic (components sum to Rs 12,311.25; +10% LPS = Rs 13,542.38). Every figure prominently labelled illustrative. FAQPage + BreadcrumbList JSON-LD.
- **(d)** Linked from the homepage, the footer (every page), and all 12 DISCO pages. Verified: 2 links on `/` and on each DISCO page.

### TASK 2 — Privacy policy + consent ✅

The two disqualifying sentences are gone. `/privacy` (1,157 words) now carries the required disclosures **verbatim**: third-party vendors including Google use cookies to serve ads based on prior visits; Google's advertising cookies enable it and its partners to serve ads based on visits to this and other sites; multiple networks may be used and their cookies are outside our control; plus opt-out links to `google.com/settings/ads` and `aboutads.info/choices`. Sections on what the lookup handles (reference number sent upstream, bill not stored, no account) and the privacy contact route.

**Consent bar** — genuine opt-in:

| Requirement | Status |
|---|---|
| Accept / Reject / Manage preferences | ✅ Reject is **first** and exactly the same size as Accept |
| Ad cookies must not fire before consent | ✅ Verified — **0** `googlesyndication` scripts before consent, and `readConsent()` returning `null` is treated as refusal |
| localStorage, respected on return | ✅ Verified: Reject → reload → banner does not reappear, choice persisted |
| Withdrawable | ✅ "Cookie settings" in the footer reopens it **in manage mode**; withdrawing after the tag loaded forces a reload, because a loaded third-party script cannot be truly unloaded |
| No layout shift | ✅ `position: fixed`, nothing rendered server-side |
| Doesn't cover the form @360px | ✅ for all interactive controls (see §3) |

### TASK 3 — Authorship and trust ✅

- **(a)** Byline resolution is at the **render layer** (`authorFor()`), not per-post. This is deliberate: ~10 of your 28 posts live in Redis KV and could not be edited from here — with a render-time default, **all 28 get a byline immediately**, including KV posts written before the field existed. `/api/posts` now also accepts an explicit `author` slug.
- **(b)** `lastUpdated` already existed; every post now renders "Published … · Last updated …" via `<Byline>`.
- **(c)** `/author/atif-jan` — name, photo slot (monogram fallback), **135-word bio**, list of their posts, Person JSON-LD with `jobTitle`, `address`, `knowsAbout`, `worksFor`. `{{VERIFY}}` markers stripped from the JSON-LD `description` so no template braces reach Google.
- **(d)** Byline on the post page **and** on blog index cards, both linked to the author page.
- **(e)** Article JSON-LD `author` is now a **Person** (`@id`, name, url, jobTitle) instead of the Organization; publisher gains `@id` + `url`.
- **(f)** `/editorial-policy` — 906 words covering the source hierarchy (NEPRA for rates, the DISCO's own site for contacts, PITC for bill layout), what happens when something can't be verified, review cadence per content type, the corrections process, independence from PITC/NEPRA/all 12 DISCOs, and how advertising does and does not influence content. Linked from the footer and from every blog post footer.

### TASK 4 — Contact ✅

- **(a)** Working form: name, email, subject dropdown (the exact 5 you listed), message. **Server-side** validation of every field; honeypot; a 3-second minimum-fill timing check; per-IP rate limit of 3/hour. All paths tested:

  | Case | Result |
  |---|---|
  | Honeypot filled | `200 {"ok":true}` — silently dropped so the bot doesn't retry |
  | Submitted <3s | `400` |
  | Invalid email | `400` + `field:"email"` |
  | Subject not in the allowed list | `400` |
  | Message <10 chars | `400` |
  | Valid, no store + no mail | `503` with an honest message + the direct email address |

- **(b)** Phone = `{{VERIFY}}`. Address = **Office 27, Mardan Road, Charsadda 24420** as supplied.
- **(c)** The "we are not PITC" clarification is kept and expanded.
- **(d)** 360px: labels above inputs, 16px inputs, 48px controls. Verified by screenshot.

---

## 5. What you must configure before deploying

| Variable | Needed? | Effect |
|---|---|---|
| `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` | **Strongly recommended** | Emails you each contact submission. Without them, messages are still captured in Redis (`ebp:contact:messages`) but **nothing lands in an inbox** — you'd have to read them from Redis. There is a marked `TODO (deployment)` block in `app/api/contact/route.js` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | When you're ready to show ads | e.g. `ca-pub-4404208402043493`. Until it's set, `<AdSense />` is completely inert — no ad script exists anywhere on the site. `public/ads.txt` already declares the publisher correctly |

⚠️ **Contact-form caveat:** delivery depends on Redis (which production already uses for caching and rate limiting) or on the mail provider. If both are unavailable the form returns 503 rather than pretending the message was sent. Setting the Resend variables removes that single point of failure — **do this before an AdSense reviewer tests the form.**

---

## 6. Not completed / deliberately deferred

| Item | Why |
|---|---|
| Bylines written into the ~10 **KV-stored** posts | Cannot be edited from this repo. Solved functionally by render-time defaulting, so all 28 show a byline today. If you want them stored explicitly, re-publish through `/api/posts` with `"author": "atif-jan"` |
| Text below 14px on pre-existing components | Out of Phase 1 scope and it changes visual density on pages Phases 3–4 rewrite. **Exact selectors for later:** `.eyebrow` 13px, `.kicker` 13px, `.disco-card .city` 13px, `.disco-card .go` 13px, `.search-foot` 13px, `.field label` 12.5px, `.legal-note` 13.5px, `.guide-links`/`.hero-crumb` 13px. Everything I introduced or touched is already ≥14px |
| Header logo (75×40) and footer social icons (36×36) below 44px | Pre-existing; flagged for the Phase 4 sweep |
| Search-card helper text behind the banner at 360px | See §3 — fixable only by deleting useful guidance; Phase 3 reclaims it |
| Sample-bill **image** slots per DISCO | That's Phase 2 (`{{VERIFY: annotated <DISCO> bill image}}`) |

---

## 7. Honest read on where this leaves you

Phase 1 removes the four hard blockers: the crawler can now reach `/result`, the privacy policy no longer declares that the site doesn't run ads, there is a named accountable human on every article with a populated author page and Person schema, and `/contact` has a real address and a working form.

**It is not yet approvable.** The single biggest rejection driver is untouched: the 12 DISCO pages are still ~85–90% identical, generated from one template with `faqsFor()` producing the same five FAQs for every company. Those pages carry your search traffic and are the first thing a reviewer opens. Phase 2 is the change that decides this.

Ready for Phase 2 when you are.
