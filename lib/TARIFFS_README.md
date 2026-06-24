# Electricity tariff data (`lib/tariffs.js`)

This file is a **schema scaffold**. Every per-unit `rate` is `null` on purpose so
the site never publishes unverified figures on a billing (YMYL) page. The
`<TariffTable>` component renders `—` for any `null` rate and shows a
"pending verification" notice until a human fills the numbers in.

## How to fill / update the rates

1. **Mainland XW-DISCOs** (`NEPRA_DOMESTIC`) — LESCO, IESCO, MEPCO, FESCO, GEPCO,
   HESCO, PESCO, QESCO, SEPCO, TESCO, HAZECO. These share NEPRA's **uniform
   consumer-end tariff**.
   - Source: NEPRA tariff determinations / SROs — <https://www.nepra.org.pk/tariff/tariff.php>
     (look for the latest "Ex-WAPDA DISCOs" schedule / SRO for the current FY).
   - Copy the residential **lifeline / protected / unprotected** slab rates into
     `NEPRA_DOMESTIC.tiers`, and the FPA / duty / GST / TV fee into `.surcharges`.

2. **Azad Jammu & Kashmir** (`AJK_DOMESTIC`) — billed via the **AJK Electricity
   Department** (PITC `ajkbill`). Its tariff is **not guaranteed identical** to the
   NEPRA XW-DISCO schedule, so it has its own `source` / `lastVerified`. Do **not**
   copy mainland numbers here.
   - Source: AJK Electricity Department billing (<https://bill.pitc.com.pk/ajkbill>)
     and any AJK government tariff notification.

## After filling numbers

- Set `lastVerified` to today's date (`"YYYY-MM-DD"`) on the dataset you updated.
- Remove the `// TODO: verify…` comment on each row you've confirmed.
- The visible "Rates last updated: {date} — source: …" line updates automatically.

## Where it renders

- `/blog/unit-slabs-fuel-price-adjustment-taxes-explained` → `NEPRA_DOMESTIC`
- `/blog/azad-kashmir-electricity-unit-price-tariff` → `AJK_DOMESTIC`

Articles place the table with a `<!-- tariff:nepra -->` or `<!-- tariff:ajk -->`
sentinel in their HTML `content`; the blog renderer swaps it for `<TariffTable>`.
