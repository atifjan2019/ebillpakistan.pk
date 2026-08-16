// The annotated sample bill shown at /sample-bill-explained.
//
// EVERY figure here is INVENTED and internally consistent — it exists to explain
// what each line on a Pakistani electricity bill means, not to state what any
// charge currently costs. The reference number is all zeros and the consumer is
// "Sample Consumer" so the page can never be mistaken for a real bill.
// Real per-unit rates live in lib/tariffs.js, where they stay null until a human
// verifies them against NEPRA (see lib/TARIFFS_README.md).

export const SAMPLE_NOTICE =
  "Illustrative figures only. These amounts are made up to show how a bill is put together — they are not current approved rates. For real rates see the NEPRA tariff schedule; for your own bill, look it up with your reference number.";

// Identity block, printed across the top of every PITC-generated bill.
export const SAMPLE_HEADER = [
  { label: "Company", value: "SAMPLE ELECTRIC SUPPLY COMPANY" },
  { label: "Consumer name", value: "SAMPLE CONSUMER" },
  { label: "Address", value: "HOUSE 00, SAMPLE STREET, SAMPLE TOWN" },
  { label: "Reference No.", value: "00000000000000", mono: true },
  { label: "Billing month", value: "AUG 2026" },
  { label: "Tariff", value: "A-1(a) DOMESTIC — UNPROTECTED" },
  { label: "Sanctioned load", value: "2 kW" },
  { label: "Connection date", value: "01-01-2015" },
];

// Every annotated line. `amount` is the figure printed on the sample bill;
// `meaning` is the explanation. `kind` drives the styling of the row.
export const SAMPLE_LINES = [
  {
    id: "reference-number",
    label: "Reference No.",
    amount: "00000000000000",
    kind: "id",
    meaning:
      "The 14-digit code that identifies this connection in the national billing system. It is the only thing you need to look a bill up online. It belongs to the meter, not to the person, so it does not change when the account holder changes — note it down once and you can check every future bill without the paper copy.",
  },
  {
    id: "units-consumed",
    label: "Units consumed",
    amount: "250 kWh",
    kind: "usage",
    meaning:
      "The electricity used this month in kilowatt-hours, worked out as this month's meter reading minus last month's. This single number drives almost everything below it: which tariff slab you land in, your per-unit rate, and your fixed charge band. If it looks wrong, compare it with the previous three months before assuming the bill is right.",
  },
  {
    id: "current-charges",
    label: "Cost of electricity (current charges)",
    amount: "Rs 8,750.00",
    kind: "charge",
    meaning:
      "The energy charge: your units priced through NEPRA's slab system. Slabs are stepped, so different portions of your usage are charged at different rates rather than all 250 units being charged at one rate. This is the only line on the bill that is genuinely about how much electricity you used.",
  },
  {
    id: "fpa",
    label: "Fuel Price Adjustment (FPA / F.P.A)",
    amount: "Rs 625.00",
    kind: "charge",
    meaning:
      "A monthly correction for what fuel actually cost the generators, usually about two months earlier. It is charged per unit, so it scales with your usage. When fuel costs fall it can appear as a credit. The FPA is the main reason two months with identical units can produce different bills — it is set nationally and no distribution company can waive it.",
  },
  {
    id: "quarterly-adjustment",
    label: "Quarterly Tariff Adjustment (QTA)",
    amount: "Rs 500.00",
    kind: "charge",
    meaning:
      "A separate periodic adjustment, applied for a defined number of months at a time, that reconciles capacity, transmission and other allowed costs across the whole sector. Like the FPA it is charged per unit and set by NEPRA — but it runs on a quarterly cycle rather than a monthly one, which is why it can sit on your bill unchanged for several months and then jump.",
  },
  {
    id: "fixed-charges",
    label: "Fixed charges",
    amount: "Rs 400.00",
    kind: "charge",
    meaning:
      "A rupees-per-kilowatt monthly charge for keeping capacity available to you — the wires, the transformer, the metering — whether you draw on it or not. It is banded by consumption slab and protected status, so it rises as your usage rises. It is why a nearly empty house still receives a bill that is not nearly zero.",
  },
  {
    id: "meter-rent",
    label: "Meter rent",
    amount: "Rs 25.00",
    kind: "charge",
    meaning:
      "A small monthly amount for the meter itself, which is the distribution company's property rather than yours. It is a flat figure that does not move with usage. On many bills it sits with the service or service-rent line.",
  },
  {
    id: "electricity-duty",
    label: "Electricity duty (E.D)",
    amount: "Rs 131.25",
    kind: "tax",
    meaning:
      "A provincial levy charged as a percentage of the variable (energy) portion of your bill. It is collected by the distribution company on the provincial government's behalf — the company is a collection agent here, not the beneficiary.",
  },
  {
    id: "gst",
    label: "General Sales Tax (GST)",
    amount: "Rs 1,845.00",
    kind: "tax",
    meaning:
      "Federal sales tax, charged as a percentage on the electricity charges plus most of the surcharges above. Because it is applied on the subtotal rather than on the energy line alone, GST is normally the single largest tax item on a domestic bill.",
  },
  {
    id: "tv-fee",
    label: "PTV licence fee (TV fee)",
    amount: "Rs 35.00",
    kind: "tax",
    meaning:
      "The Pakistan Television licence fee, collected through electricity bills for administrative convenience. It is a flat monthly figure, has nothing to do with your electricity use, and applies whether or not you own a television.",
  },
  {
    id: "arrears",
    label: "Arrears / previous balance",
    amount: "Rs 0.00",
    kind: "carry",
    meaning:
      "Anything unpaid from earlier months, carried forward onto this bill. A non-zero figure here means a previous bill was not paid, was paid short, or was paid too late to be recorded before this bill was generated. If you paid recently, check the date the bill was issued before treating an arrears line as an error.",
  },
  {
    id: "payable-within-due-date",
    label: "Payable within due date",
    amount: "Rs 12,311.25",
    kind: "total",
    meaning:
      "Everything above, added up. This is the amount to pay, and it is the figure a bank counter, an ATM or a wallet app expects if you pay on or before the due date.",
  },
  {
    id: "due-date",
    label: "Due date",
    amount: "15-09-2026",
    kind: "date",
    meaning:
      "The last day to pay at the normal amount. Banks and payment channels credit on their own timetable, so paying on the due date itself is cutting it fine — paying a couple of days early is the difference between the two totals on this bill.",
  },
  {
    id: "late-payment-surcharge",
    label: "Late payment surcharge (LPS)",
    amount: "Rs 1,231.13",
    kind: "penalty",
    meaning:
      "The penalty added if you pay after the due date. It is a percentage of the current bill amount, so it grows with the bill: on this sample it is the difference between the two totals printed at the bottom. Miss the due date on a large summer bill and the surcharge alone can exceed a whole low-season bill.",
  },
  {
    id: "payable-after-due-date",
    label: "Payable after due date",
    amount: "Rs 13,542.38",
    kind: "total",
    meaning:
      "The higher figure you pay once the due date has passed: the amount above plus the late payment surcharge. Two totals on one bill confuses a lot of people — always check which of the two you are being asked for.",
  },
  {
    id: "protected-status",
    label: "Consumer status (protected / unprotected)",
    amount: "UNPROTECTED",
    kind: "status",
    meaning:
      "Domestic consumers are split into protected and unprotected. Protected consumers keep their monthly units at or below a set threshold for a set run of consecutive months and are charged noticeably lower per-unit rates; go over it, and you move to unprotected rates. This sample consumer is unprotected. The status is printed on the bill and is worth checking every month, because crossing the line in a single hot month can cost you the lower rate.",
  },
];

// Sum check for the sample, so the explanation of the arithmetic stays true if
// anyone edits a figure above.
export const SAMPLE_MATH = {
  components: [
    ["Cost of electricity", 8750],
    ["Fuel price adjustment", 625],
    ["Quarterly tariff adjustment", 500],
    ["Fixed charges", 400],
    ["Meter rent", 25],
    ["Electricity duty", 131.25],
    ["GST", 1845],
    ["PTV licence fee", 35],
    ["Arrears", 0],
  ],
  payableWithin: 12311.25,
  lateSurcharge: 1231.13,
  payableAfter: 13542.38,
};
