# eBill Pakistan — Blog Writing Guidelines

How to write a blog post for ebillpakistan.pk. Follow this exactly, then
publish through the API described in `blog-publishing-api.md`.

## What the site is

ebillpakistan.pk helps Pakistani users check and download electricity bills
online across all DISCOs — LESCO, IESCO, MEPCO, FESCO, GEPCO, HESCO, PESCO,
QESCO, SEPCO, TESCO, HAZECO — plus the AJK Electricity Department. Users need
only their 14-digit reference number; no account, no fee. The site does NOT
process payments.

## Tone and structure

- Practical, step-by-step, plain-language guides. No fluff, no filler intros.
- Short paragraphs (2–4 sentences). Numbered `1.` steps for any process.
  Bulleted lists only where they genuinely aid scanning.
- Target 900–1,400 words — thorough, never padded.
- British-leaning spelling to match existing content ("licence", "organisation").
- The first 100 words must include the primary keyword naturally AND answer
  the core question directly (featured-snippet potential).

## SEO requirements

- **Title / metaTitle**: under 60 characters, primary keyword near the start,
  include the current year if relevant.
- **metaDescription**: 140–155 characters, includes the primary keyword, ends
  with a soft call to action ("Check yours now.", "Verify yours today.").
- **slug**: short, hyphenated, keyword-only (e.g. `electricity-bill-qr-code-subsidy`).
- **Headings**: the site renders `title` as the only H1 — do not put `# H1` in
  content. Use `## H2` sections that map to real search intent (things a user
  would type into Google), with `### H3` beneath where needed.
- **FAQs**: supply 3–4 question-style FAQs via the API's `faqs` field (NOT in
  the Markdown body). They render as an accordion and produce FAQPage JSON-LD
  automatically — a strong "People also ask" / voice-search target.
- No keyword stuffing. Write for humans; density should feel invisible.

## Linking rules

- **Internal links: at least 2 per post**, descriptive anchor text (never
  "click here"). Available targets:
  - Homepage bill check: `/`
  - DISCO pages: `/lesco-bill-check`, `/iesco-bill-check`, `/mepco-bill-check`,
    `/fesco-bill-check`, `/gepco-bill-check`, `/hesco-bill-check`,
    `/pesco-bill-check`, `/qesco-bill-check`, `/sepco-bill-check`,
    `/tesco-bill-check`, `/hazeco-bill-check`, `/ajk-bill-check`
  - Existing guides (use `/blog/<slug>`):
    - `how-to-check-electricity-bill-online-pakistan` — checking a bill online
    - `how-to-find-reference-number-on-electricity-bill` — finding the reference number
    - `lesco-electricity-bill-units-calculator` — slab tariff worked example
    - `electricity-bill-zyada-kyon-aata-hai` — why bills come out high
    - `how-to-pay-electricity-bill-online-pakistan` — payment methods
    - `what-is-disco-pakistan-electricity` — what a DISCO is
    - `ajk-electricity-bill-online-check`, `how-to-find-ajk-electricity-reference-number`,
      `azad-kashmir-electricity-unit-price-tariff` — AJK cluster
    - `how-to-download-print-electricity-bill-duplicate` — duplicate bill
    - `how-to-check-electricity-bill-status` — bill status
    - `unit-slabs-fuel-price-adjustment-taxes-explained` — slabs, FPA, taxes
    - `bijli-ka-bill-kam-kaise-karein` — Urdu: reduce your bill
    - `electricity-bill-qr-code-subsidy` — QR code subsidy verification
    - `fake-electricity-bill-qr-code-scam` — fake subsidy links & scams
    - `hazeco-bill-check-online` — HAZECO explainer
    - `pm-fan-replacement-program` — PM fan replacement scheme
    - `mdi-fixed-charges-electricity-bill` — MDI & fixed charges
- **External links: at most 1**, only if genuinely useful and authoritative
  (e.g. nepra.org.pk, css.pitc.com.pk, efan.gov.pk, an official DISCO site, or
  a major newspaper for a news claim). Use
  `target="_blank" rel="noopener noreferrer"` phrasing is handled by Markdown
  links automatically — just link the official URL. Never fabricate a source.

## Fact-checking (hard requirement)

- Do NOT invent statistics, rates, dates, phone numbers, or portal URLs.
- If a specific fact (subsidy threshold, tariff rate, helpline number, fee)
  cannot be verified against an official source, either omit it, attribute it
  ("news reports describe..."), or mark it clearly as `[VERIFY]` and flag it
  to the site owner **before publishing** — never guess.
- Tariff rates change often: point readers to nepra.org.pk or their bill
  rather than printing exact per-unit rates.
- The national DISCO complaint helpline is 118. eBill Pakistan's support email
  is support@ebillpakistan.pk.

## Urdu / Roman Urdu

If the topic serves an Urdu-speaking audience (bill problems, subsidies,
schemes), add one short `## Roman Urdu: khulasa` section summarising the key
steps in Roman Urdu. Fully Urdu posts (RTL) exist on the site but require
extra fields — coordinate with the site owner instead of publishing those via
the API.

## Every post must end with

A clear next step for the reader — usually a link to check their bill
(`/` or the relevant DISCO page) or to a closely related guide.

## Publishing checklist

1. Title ≤ 60 chars, keyword near start ✔
2. metaDescription 140–155 chars with keyword + soft CTA ✔
3. Slug short, hyphenated, keyword-only, not already taken ✔
4. First 100 words answer the question and contain the primary keyword ✔
5. H2s match search intent; no H1 in the body ✔
6. 900–1,400 words; short paragraphs; numbered steps ✔
7. ≥ 2 internal links with descriptive anchors; ≤ 1 authoritative external link ✔
8. 3–4 FAQs in the `faqs` field ✔
9. No invented facts; anything unverifiable flagged, attributed, or removed ✔
10. Ends with a clear next step ✔
11. POST to the API (see `blog-publishing-api.md`); confirm the returned URL
    loads and the post appears on `/blog` ✔
