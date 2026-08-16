# AdSense remediation — Phase 2.5 report

**Date:** 16 August 2026 · **Build:** passes, 47 routes, 0 errors.

**Bottom line:** all five tasks done. The deploy blocker is closed, `faqsFor()` is deleted, and duplicate overlap went **40% → 9.4%**, under the 15% target.

---

## 1. Can a `{{VERIFY}}` reach the DOM in production? **No.**

Scanned the rendered HTML of **20 production pages** — all 12 DISCO pages plus `/`, `/contact`, `/author/atif-jan`, `/sample-bill-explained`, `/editorial-policy`, `/blog`, `/privacy` and `/result` — for `{{VERIFY`, a stray `{{`, or the dev-only `verify-mark` class:

```
pages scanned: 20
PAGES WITH MARKERS: NONE  ✅
```

The scan caught a real leak on the first run: the annotated-bill image slot was rendering raw on all 12 DISCO pages. Fixed by routing it through `safe()`, along with the tariff notification row.

### How it works

`lib/verify.js` is the single authority. `SHOW_VERIFY` is `process.env.NODE_ENV !== "production"`, which Next inlines at build time, so the dev branch is compiled out of production entirely.

| Helper | Use |
|---|---|
| `safe(v)` | Returns `null` in production if `v` contains a marker — the caller omits the container |
| `safeList(items, fields)` | Drops list items whose checked fields are dirty |
| `resolveSection(section)` | Filters paragraphs and items, then applies the word-count rule |
| `stripVerify(v)` | For JSON-LD and `<meta>`, where there is no container to omit |

`<Verify>` itself returns `null` in production as a **backstop** — so even a call site that forgets to use `safe()` cannot emit braces.

Your three rules are implemented literally:
- **Block omitted, not the string** — paragraphs, list items, office rows and channel rows are dropped whole.
- **No orphan headings** — `ComplaintChannels` renders the "head office" `<h3>` only when the address survives; `ContentSection` drops the `<h2>` with the section.
- **Under ~40 words → whole section goes** — `MIN_SECTION_WORDS = 40` in `resolveSection`.

### Build-time report

`npm run build` now runs `prebuild` → `scripts/verify-report.mjs`. It walks the **actual exported data** (not just source text — the `V()` helper means one source literal produces many markers) and prints what production loses, per page:

```
──────────────────────────────────────────────────────────────────────────
  {{VERIFY}} REPORT — 76 unresolved marker(s) in 5 file(s)
  Production behaviour: suppressed. None of these can reach the DOM.
──────────────────────────────────────────────────────────────────────────
  app/sample-bill-explained/page.js  (1)
  lib/authors.js                     (2)
  lib/contact.js                     (1)
  lib/discoContent.js               (59)
  lib/tariffs.js                    (13)

  WHAT PRODUCTION LOSES, BY PAGE

  /lesco-bill-check
      - How LESCO came about: -0 para, -1 item (98 words remain)
      - bill image slot hidden
      - Outages and load management on LESCO: -0 para, -1 item (103 words remain)
      - complaints: head-office heading + address dropped
      - complaints: office-list note dropped
  … (all 12 pages listed)
```

`npm run verify` (or `node scripts/verify-report.mjs --full`) lists every marker with its label.

**Good news in that output: no section is dropped entirely on any page.** Every one of the 60 sections survives the 40-word floor — the smallest is GEPCO's background at 47 words. What production actually loses is one bullet from "background", one from "outages", the bill image slot, and some head-office addresses.

---

## 2. Duplicate overlap — **9.4%, PASS**

Same method as before: shared sentences of 6+ words between page pairs, as a share of the smaller page.

| | Worst pair | Result |
|---|---|---|
| Phase 2 | 40.4% | FAIL |
| **Phase 2.5** | **9.4%** (LESCO vs SEPCO, 5 shared of 53) | **PASS** |

Best pair is 1.7% (IESCO vs AJK). **Exactly one sentence now appears on all 12 pages** — a 7-word link line: *"Our annotated sample bill explains every line."*

The residual ~5 shared sentences per pair are the short shared-channel descriptions (the CCMS ticket-number note, the Citizen Portal note) and the tariff-band sentence. They are deliberate: each is a single clause, and replacing them with 12 hand-written variants would be padding for a metric rather than value for a reader.

---

## 3. Word counts — total and unique

"Unique" excludes every sentence appearing on more than one page. **That second column is the real number.**

| Page | Total | **Unique** | | Page | Total | **Unique** |
|---|---:|---:|---|---|---:|---:|
| lesco | 1,499 | **1,332** | | pesco | 1,406 | **1,246** |
| iesco | 1,453 | **1,304** | | qesco | 1,397 | **1,238** |
| mepco | 1,337 | **1,174** | | sepco | 1,187 | **1,020** |
| fesco | 1,231 | **1,082** | | tesco | 1,282 | **1,125** |
| gepco | 1,269 | **1,112** | | hazeco | 1,246 | **1,086** |
| hesco | 1,262 | **1,102** | | ajk | 1,358 | **1,319** |

Every page carries **over 1,000 words that exist nowhere else on the site**. Compare Phase 2, where ~1,050 total words per page hid roughly 40% duplication.

---

## 4. Which companies have all six B3 sections

**All 12 have all six**, written per company: coverage, background, bill layout, payments, outages, complaints.

| | Sections | FAQs | Complaint data |
|---|---|---|---|
| **IESCO** | 6/6 | 6 | Complete — head office, 3 numbers, fax, 7 customer centres. **Zero placeholders** |
| **PESCO** | 6/6 | 6 | 7 circles with coverage areas + complaint cell 0370-1341078 |
| **GEPCO** | 6/6 | 6 | 6 sub-division CRCs |
| **FESCO** | 6/6 | 6 | Toll-free UAN 0800-66554 |
| **MEPCO** | 6/6 | 6 | Complaint cell 0319-9757789 |
| **LESCO** | 6/6 | 6 | Complaint number 0320-0520888 |
| HESCO, SEPCO, QESCO, TESCO, HAZECO, AJK | 6/6 | 6 | National + CCMS only; own numbers unverifiable (see §5) |

Your priority four — PESCO, HESCO, LESCO, MEPCO — are complete, and so is everything else. **72 FAQs total, and 0 questions appear on more than one page.**

Content is genuinely company-specific rather than reworded: QESCO's sole-distributor status and 44%-of-land-area geography, SEPCO's Jacobabad heat as a *thermal* failure mode, HESCO's delta flooding as a rebuild rather than a repair, TESCO's post-conflict network reconstruction, HAZECO's changed reference numbers after the 2023 split, AJK being a government department rather than a licensed DISCO, MEPCO's agricultural tariff-code risk, GEPCO's mixed-use premises problem, FESCO's MDI and sanctioned-load lever.

---

## 5. Every `{{VERIFY}}`, grouped, with what it suppresses

**76 total.** 59 on the DISCO pages, 17 elsewhere.

### The DISCO pages — 59 markers, and they cluster into four repeating kinds

| Kind | Count | Suppresses |
|---|---:|---|
| Consumer-connection count | 11 | One bullet in "How X came about" |
| Annotated bill image slot | 12 | The image placeholder under "Reading an X bill" |
| Load-management schedule URL | 12 | One bullet in the outages section |
| Head office address | 11 | The `<h3>` + address block |
| Circle/office numbers note | 9 | The office-list note |
| Company-specific (below) | 4 | Varies |

Per page: LESCO 5, IESCO 3, MEPCO 4, FESCO 5, GEPCO 4, HESCO 6, PESCO 4, QESCO 5, SEPCO 6, TESCO 6, HAZECO 5, AJK 6.

The four company-specific ones:
- **HESCO** — the year SEPCO was carved out of it
- **SEPCO** — the year it was separated from HESCO
- **TESCO** — the year it was created as a separate company from PESCO
- **AJK** — current administrative arrangement (still a department, or corporatised?), and its complaint number

Three sites did not respond when checked and are recorded as such on the page: **qesco.com.pk**, **tesco.org.pk**, **hazeco.com.pk**.

### Elsewhere — 17

- `lib/tariffs.js` (13): protected-status qualifying period; which of S.R.O. 41–52(I)/2026 belongs to each of the 11 XWDISCOs; the AJK tariff notification
- `lib/authors.js` (2): Atif's motivation sentence, professional background
- `lib/contact.js` (1): business phone number
- `app/sample-bill-explained/page.js` (1): protected-consumer threshold + qualifying period

---

## 6. Horizontal overflow — **0px, all 12 pages, all breakpoints**

| Page | 360 | 390 | 414 | 768 |
|---|---|---|---|---|
| All 12 DISCO pages | **0px** | **0px** | **0px** | **0px** |

No horizontally-scrolling containers. Tariff bands are a `<table>` above 640px and stacked cards below.

**Collapsible districts, verified by instrumentation and screenshot:**

```
360px -> mobileShown:true,  mobileOpen:false, wideShown:false, overflow:0
768px -> mobileShown:false, mobileOpen:false, wideShown:true,  overflow:0
```

At 360px it is a genuinely *collapsed* `<details>` ("Districts and towns PESCO serves · 8 · +"); at 768px it is a plain always-visible list. This needed two elements rather than one: a browser hides closed-`<details>` content through UA behaviour CSS cannot reliably override, so "closed on mobile, open on desktop" is not expressible with a single element. The duplicated markup is a handful of city names.

---

## What changed

**New:** `lib/verify.js`, `app/ContentSection.js`, `app/Districts.js`, `scripts/verify-report.mjs`

**Rewritten:** `lib/discoContent.js` (~1,500 lines — all per-company content), `app/[slug]/page.js`, `app/ComplaintChannels.js`, `app/Districts.js`

**Modified:** `lib/companies.js` (`faqsFor`, `COMPANY_SEO`, `seoFor` **deleted**), `app/Verify.js` (production backstop), `app/TariffTable.js` (de-duplicated), `app/globals.css`, `package.json` (`prebuild`, `verify` scripts)

### Task 2 de-duplication, specifically
- **TariffTable "Bands, not prices"** — 60 words × 12 → one clause linking to `/editorial-policy`
- **TariffTable footer** — paragraph → one clause linking to `/sample-bill-explained`
- **ComplaintChannels intro** — shared paragraph → per-company `intro` in the data
- **"How to check your bill" steps** — 3-step list × 12 → one sentence
- **"Understanding your bill"** — paragraph × 12 → folded into that sentence, linking to `/sample-bill-explained`
- **Provenance line** — shortened to one clause

---

## Honest assessment

The DISCO pages are now genuinely twelve different pages. Overlap is 9.4%, every page has 1,000+ words that appear nowhere else, 72 FAQs with zero repeats, and 12/12 unique titles and descriptions. Combined with Phase 2's `/result` rebuild, the two structural reasons the site kept failing — a doorway result page and twelve near-identical landing pages — are both addressed.

**The weakest remaining point is tariff prices.** Every band table still shows structure without rupee figures, because the NEPRA SROs are scanned images and I would not OCR a rate onto a page people budget against. It is handled honestly rather than hidden, but a reviewer looking for the actual rate will not find it here. That is the single highest-value thing you can fix, and it is a ~30-minute job with the SROs open.

Six companies still have no phone number of their own on the page (HESCO, SEPCO, QESCO, TESCO, HAZECO, AJK) — three because their sites were down. Worth retrying before you submit.

**Before deploying:** run `npm run verify` and fill what you can. Nothing is blocking — everything unresolved is suppressed — but each one you fill adds real content back to a page.
