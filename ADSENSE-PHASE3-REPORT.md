# Applying the verified data — report

**Date:** 16 August 2026 · **Build:** passes, 48 routes, 0 errors.

Your data drop cleared the single biggest blocker. It also surfaced **two factual errors already published on the site**, which mattered more than the missing figures.

---

## 1. Your SRO catch was decisive

S.R.O. 279(I)/2026 is now the governing notification throughout, recorded in `lib/tariffs.js` with the supersession noted explicitly. The January SROs are kept only as each company's Schedule of Tariff reference, which is what they still are.

You were right that the OCR refusal paid off twice: those January scans were already three weeks stale when I downloaded them.

---

## 2. Two errors the data exposed in already-published content

### (a) The site taught slab billing backwards

Both `unit-slabs-fuel-price-adjustment-taxes-explained` and `lesco-electricity-bill-units-calculator` described billing as **telescopic** — "the higher rate applies only to the units in that upper slab" — with a worked example summing slab by slab. Your §1.4 note shows that is wrong for everyone except protected consumers.

Both posts are corrected, and the correction is now the most useful thing on them:

> At 200 units an unprotected consumer pays 200 × Rs 28.91 = **Rs 5,782**. At 201 units the whole month reprices: 201 × Rs 33.10 = **Rs 6,653**. One extra unit costs about **Rs 871**, before tax.

`lastUpdated` bumped on both.

### (b) HAZECO's founding date was wrong in eight places

The site said "carved out of PESCO in **January 2023**". Your licence data gives incorporated 31 October 2023, licence DL/10/2025 on 23 May 2025, **independent operations 1 July 2025**.

That last date is the one that actually matters to a reader, because it is when reference numbers changed — the single most common HAZECO support question. All eight mentions across `lib/discoContent.js` and the HAZECO blog post now use it, and "pre-2023 PESCO bill" became "pre-July-2025 PESCO bill".

---

## 3. The slab-benefit rule changed the /result calculator

This was the highest-consequence line in your drop. The old `slabSaving` computed *units above the boundary × marginal rate*. With no slab benefit for unprotected consumers, that **understates the saving by about half**:

```
250 units unprotected, dropping to 200:
  old (naive):  50 × Rs 33.10          = Rs 1,655
  correct:      Rs 8,275 − Rs 5,782    = Rs 2,493
```

`energyCharge(units, category)` in `lib/tariffs.js` now implements all three cases, verified:

| Case | Result | Check |
|---|---|---|
| Unprotected 250 | Rs 8,275 | 250 × 33.10, whole month at band rate |
| Protected 200 | Rs 2,355 | 100 × 10.54 + 100 × 13.01 — one previous slab |
| Lifeline 100 | Rs 774 | 100 × 7.74, **not** 50 × 3.95 + 50 × 7.74 |
| 200 → 201 cliff | Rs 871.10 | matches the published claim |

The result page now also states the mechanism on screen — that crossing back reprices the whole month, not just the excess — rather than just showing a number.

### Quarterly adjustment modelled as you specified

Dated line items with expiry, not folded into base rates. `adjustmentsOn("2026-08-16")` returns the −Rs 1.9857 rebate; `adjustmentsOn("2026-09-15")` returns none. Both the rebate and the expired March–May surcharge are shown with their windows, so a stale page still reads truthfully.

---

## 4. Duplicate overlap: the tariff data nearly broke it

Adding the full rate table to twelve pages pushed overlap from 9.4% back to **28.6%** — identical rate rows are identical text.

Fixed with the pattern you endorsed: one canonical page, linked twelve times. New **`/electricity-tariff`** carries the full schedule, the non-telescopic rule, fixed vs minimum charges, ToU, pre-paid, both adjustments, the protected rules and the SRO-to-company map. DISCO pages get a two-sentence rate summary and a link.

| Stage | Worst pair |
|---|---|
| Before this phase | 9.4% |
| After adding tariff tables | 28.6% |
| **After moving them to one page** | **12.9%** (MEPCO vs TESCO) |

Best pair 1.4%. Eight sentences appear on 11+ pages, all short (the rate summary, the source line, channel labels).

**Word counts** — unique excludes any sentence appearing on more than one page:

| Page | Words | Unique | | Page | Words | Unique |
|---|---:|---:|---|---|---:|---:|
| lesco | 1,567 | 1,418 | | pesco | 1,468 | 1,331 |
| iesco | 1,489 | 1,363 | | qesco | 1,540 | 1,404 |
| mepco | 1,386 | 1,246 | | sepco | 1,325 | 1,181 |
| fesco | 1,307 | 1,181 | | tesco | 1,453 | 1,319 |
| gepco | 1,321 | 1,187 | | hazeco | 1,340 | 1,203 |
| hesco | 1,373 | 1,236 | | ajk | 1,450 | 1,411 |

---

## 5. Placeholders: 76 → 18

| Group | Was | Now |
|---|---:|---:|
| `lib/tariffs.js` | 13 | **2** (protected qualifying period; AJK notification) |
| `lib/discoContent.js` | 59 | **12** (the annotated bill images, one per DISCO) |
| `lib/authors.js` | 2 | 2 |
| `lib/contact.js` | 1 | 1 |
| `sample-bill-explained` | 1 | 1 |

Every head office, consumer count, load-shedding route and formation date is resolved. The 12 remaining DISCO markers are all the bill-image slot — yours to supply.

### Traps, all avoided
- **QESCO** uses 0.68 million (FY 2022-23). The page explicitly names the 6.76 million figure and says why it is not used — a reader checking the same document will find the contradiction, so addressing it is better than ignoring it.
- **TESCO** — `tesco.gov.pk` is not linked anywhere; the NEPRA licence is cited instead.
- **LESCO email** — not published. `ceo@lesco.gov.pk` stays unpublished until you confirm it.

### The honest complaint statement
For HESCO, SEPCO, QESCO, TESCO and HAZECO the pages now say plainly that the company does not publish its own complaint number and route through 118/8118/CCMS — with the specific reason each time (SEPCO's Complaint Cell page is published but empty; QESCO's site has an invalid certificate; TESCO prints a 092 number that appears to be a typo for 091). That reads as knowing the territory, which is what you predicted.

---

## 6. The six-month rule

Not published anywhere. `PROTECTED.qualifyingMonths` is `null`, the marker survives with your sourcing note attached, and `/electricity-tariff` says explicitly that the widely-repeated six-month figure could not be confirmed from the CSM, the 11-02-2026 determination, S.R.O. 279 or S.R.O. 1286(I)/2025 — and therefore is not stated.

I checked the blog for the assertion you flagged. The English posts never stated it. The Urdu post says "مسلسل مہینوں" — consecutive months, no number — which is safe, so it is unchanged. The `/result` protected card said "depends on several consecutive months"; softened to "assessed over a run of billing cycles". The verified 200-unit threshold and the pro-rata carry-forward rule **are** published.

---

## 7. A real bug the mobile audit caught

Adding the load-shedding URLs broke the page width: a bare URL in a list item has no break opportunity, so `https://www.lesco.gov.pk/LoadSheddingShutdownSchedule` forced the document to 480px in a 360px viewport — **120px of horizontal scroll on the seven pages that have one.**

Fixed by linkifying URLs in content sections (better for readers too) plus an `overflow-wrap: anywhere` safety net.

**Final: 0px horizontal overflow on all 12 DISCO pages, `/electricity-tariff` and `/result`, at 360 / 390 / 414 / 768px.**

No `{{VERIFY}}`, `verify-mark` or stray `{{` in any of 24 production pages.

---

## What is still outstanding

| Item | Note |
|---|---|
| 12 annotated bill images | The only remaining DISCO placeholders |
| Protected qualifying period | Correctly unresolved — do not guess |
| Atif's bio ×2, business phone | Yours |
| AJK tariff notification | Separate schedule, not yet located |
| Fax/email for GEPCO, HESCO; email for IESCO, QESCO, AJK | Not published on their sites |

## Files changed

**New:** `app/electricity-tariff/page.js`

**Rewritten:** `lib/tariffs.js`, `app/TariffTable.js`

**Modified:** `lib/billAnalysis.js` (slab-benefit rule), `app/result/page.js`, `app/result/BillAnalysis.js`, `lib/discoContent.js` (all 12 companies), `lib/articles.js` (two corrected posts + HAZECO dates), `app/ContentSection.js` (linkify), `app/[slug]/page.js`, `app/layout.js`, `app/sitemap.js`, `app/globals.css`

---

## Honest assessment

The tariff data was the weakest point I named last time and it is now the strongest: real rates, three-way cross-checked, with the governing SRO, effective date and a live adjustment modelled with an expiry. `/electricity-tariff` is probably the best page on the site.

More valuable than the figures, though: your data caught the site **teaching people the wrong billing model**. That error was on two guides and shaping the /result saving estimate by roughly 2×. It would have survived an AdSense review — it is not the sort of thing a reviewer checks — but it was wrong for every reader who used it.

Remaining weakest point is now the 12 missing bill images. Everything else is either resolved or correctly withheld.
