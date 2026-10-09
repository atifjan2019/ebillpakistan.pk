// Complaint letter templates, English and Urdu. Pure functions, used on the
// client only: nothing the reader types is sent anywhere.
//
// The letters ask for what a sub-division office can actually do (check the
// meter, correct the bill, hold disconnection while it is reviewed) and avoid
// quoting rule numbers we have not verified. The escalation route on the page
// is from NEPRA's own complaint form, which tells consumers to file with the
// SDO/XEN first.

export const PROBLEMS = [
  ["reading", "Wrong meter reading", "غلط میٹر ریڈنگ"],
  ["excessive", "Bill far higher than my normal use", "معمول سے بہت زیادہ بل"],
  ["estimated", "Billed on an estimate, no reading taken", "ریڈنگ کے بغیر اندازے سے بل"],
  ["meter", "Faulty or fast-running meter", "خراب یا تیز چلنے والا میٹر"],
  ["detection", "Detection bill or arrears I dispute", "ڈیٹیکشن بل یا بقایا جات پر اعتراض"],
  ["paid", "Payment made but shown as unpaid", "ادائیگی کے باوجود بل بقایا دکھانا"],
  ["tariff", "Wrong tariff or protected status not applied", "غلط ٹیرف یا پروٹیکٹڈ حیثیت کا نہ لگنا"],
];

const today = () => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const v = (x, fallback) => (String(x || "").trim() ? String(x).trim() : fallback);

function bodyEn(f) {
  const month = v(f.month, "[billing month]");
  const billed = v(f.billedUnits, "[units billed]");
  const actual = v(f.actualUnits, "[units you believe are correct]");
  const amount = v(f.amount, "[bill amount]");
  switch (f.problem) {
    case "reading":
      return [
        `The bill for ${month} charges me for ${billed} units. My meter does not support that figure: by my own reading${f.readingDate ? ` on ${f.readingDate}` : ""}, the correct consumption is ${actual} units.`,
        "I request that the meter reading be checked against the meter itself and against the photograph taken by the meter reader, and that the bill be corrected to the actual reading.",
      ];
    case "excessive":
      return [
        `The bill for ${month} is for ${billed} units and Rs ${amount}. This is far above my normal consumption, as the billing history on the same bill shows, and nothing in my household's use has changed to explain it.`,
        "I request that the reading and the meter be checked, and that the bill be revised if the reading or the meter is found to be wrong.",
      ];
    case "estimated":
      return [
        `The bill for ${month} appears to have been prepared on an estimated or average basis rather than on an actual meter reading. The units billed (${billed}) do not match my meter, which shows ${actual}.`,
        "I request that an actual reading be taken and the bill be corrected to it, with any excess already charged adjusted in the next bill.",
      ];
    case "meter":
      return [
        `I believe my meter is faulty or is recording more than I consume. The bill for ${month} shows ${billed} units, which my household's load cannot account for.`,
        "I request that the meter be tested, and replaced if it is found defective, and that the bills affected be revised on the basis of my actual consumption.",
      ];
    case "detection":
      return [
        `The bill for ${month} includes a detection charge or arrears amounting to Rs ${amount} which I dispute. I was not shown any inspection report or evidence, and I was given no opportunity to respond before the amount was added.`,
        "I request a copy of the inspection or detection report on which the charge is based, and a review of the charge. Until that review is complete I request that I be allowed to pay the current bill without the disputed amount.",
      ];
    case "paid":
      return [
        `I paid my bill for ${month}${f.paidOn ? ` on ${f.paidOn}` : ""}${f.paidVia ? ` through ${f.paidVia}` : ""}, but the amount of Rs ${amount} is still shown as unpaid or has been carried into arrears on my account. A copy of the receipt or transaction record is attached.`,
        "I request that the payment be traced and credited to my account, and that any late payment surcharge added because of this be removed.",
      ];
    case "tariff":
      return [
        `My connection is being billed on the wrong tariff or category in the bill for ${month}. ${v(f.details, "[State what is wrong: for example, a residential connection billed as commercial, or protected consumer rates not applied although my units have been 200 or under for the last six months.]")}`,
        "I request that the tariff category be corrected and that the bills affected be revised from the month the error began.",
      ];
    default:
      return ["", ""];
  }
}

function bodyUr(f) {
  const month = v(f.month, "[بل کا مہینہ]");
  const billed = v(f.billedUnits, "[بل میں درج یونٹ]");
  const actual = v(f.actualUnits, "[آپ کے مطابق درست یونٹ]");
  const amount = v(f.amount, "[بل کی رقم]");
  switch (f.problem) {
    case "reading":
      return [
        `${month} کے بل میں مجھ سے ${billed} یونٹ کا بل لیا گیا ہے۔ میرا میٹر اس کی تصدیق نہیں کرتا: میری اپنی ریڈنگ${f.readingDate ? ` (${f.readingDate})` : ""} کے مطابق درست کھپت ${actual} یونٹ ہے۔`,
        "گزارش ہے کہ میٹر ریڈنگ کو میٹر اور میٹر ریڈر کی لی گئی تصویر سے ملا کر چیک کیا جائے اور بل کو اصل ریڈنگ کے مطابق درست کیا جائے۔",
      ];
    case "excessive":
      return [
        `${month} کا بل ${billed} یونٹ اور ${amount} روپے کا ہے۔ یہ میرے معمول کے استعمال سے بہت زیادہ ہے، جیسا کہ اسی بل پر درج پچھلے مہینوں کے ریکارڈ سے ظاہر ہے، اور میرے گھر کے استعمال میں ایسی کوئی تبدیلی نہیں آئی جو اس کی وجہ ہو۔`,
        "گزارش ہے کہ ریڈنگ اور میٹر دونوں چیک کیے جائیں، اور اگر ریڈنگ یا میٹر میں خرابی پائی جائے تو بل درست کیا جائے۔",
      ];
    case "estimated":
      return [
        `${month} کا بل اصل میٹر ریڈنگ کے بجائے اندازے یا اوسط کی بنیاد پر بنایا گیا معلوم ہوتا ہے۔ بل میں درج یونٹ (${billed}) میرے میٹر سے مطابقت نہیں رکھتے، جس پر ${actual} درج ہے۔`,
        "گزارش ہے کہ اصل ریڈنگ لی جائے، بل اس کے مطابق درست کیا جائے، اور زائد وصول کی گئی رقم اگلے بل میں ایڈجسٹ کی جائے۔",
      ];
    case "meter":
      return [
        `میرا خیال ہے کہ میرا میٹر خراب ہے یا میری اصل کھپت سے زیادہ ریکارڈ کر رہا ہے۔ ${month} کے بل میں ${billed} یونٹ درج ہیں، جو میرے گھر کے لوڈ سے ممکن نہیں۔`,
        "گزارش ہے کہ میٹر کو ٹیسٹ کیا جائے، خراب پائے جانے پر تبدیل کیا جائے، اور متاثرہ بل میری اصل کھپت کی بنیاد پر درست کیے جائیں۔",
      ];
    case "detection":
      return [
        `${month} کے بل میں ${amount} روپے کا ڈیٹیکشن چارج یا بقایا جات شامل کیے گئے ہیں جن پر مجھے اعتراض ہے۔ مجھے نہ کوئی انسپکشن رپورٹ یا ثبوت دکھایا گیا اور نہ رقم شامل کرنے سے پہلے جواب دینے کا موقع دیا گیا۔`,
        "گزارش ہے کہ جس انسپکشن یا ڈیٹیکشن رپورٹ کی بنیاد پر یہ چارج لگایا گیا ہے اس کی نقل فراہم کی جائے اور چارج پر نظرِ ثانی کی جائے۔ جب تک نظرِ ثانی مکمل نہ ہو، مجھے متنازع رقم کے بغیر موجودہ بل ادا کرنے کی اجازت دی جائے۔",
      ];
    case "paid":
      return [
        `میں نے ${month} کا بل${f.paidOn ? ` ${f.paidOn} کو` : ""}${f.paidVia ? ` ${f.paidVia} کے ذریعے` : ""} ادا کر دیا تھا، لیکن ${amount} روپے کی رقم اب بھی غیر ادا شدہ دکھائی جا رہی ہے یا میرے بقایا جات میں شامل کر دی گئی ہے۔ رسید یا ٹرانزیکشن ریکارڈ کی نقل منسلک ہے۔`,
        "گزارش ہے کہ ادائیگی تلاش کر کے میرے اکاؤنٹ میں جمع کی جائے، اور اس وجہ سے لگایا گیا لیٹ پیمنٹ سرچارج ختم کیا جائے۔",
      ];
    case "tariff":
      return [
        `${month} کے بل میں میرے کنکشن پر غلط ٹیرف یا کیٹیگری لگائی گئی ہے۔ ${v(f.details, "[بتائیں کیا غلط ہے: مثلاً گھریلو کنکشن پر کمرشل ریٹ، یا پچھلے چھ ماہ سے 200 یونٹ یا کم استعمال کے باوجود پروٹیکٹڈ ریٹ کا نہ لگنا۔]")}`,
        "گزارش ہے کہ ٹیرف کیٹیگری درست کی جائے اور جس مہینے سے غلطی شروع ہوئی وہاں سے متاثرہ بل درست کیے جائیں۔",
      ];
    default:
      return ["", ""];
  }
}

export function buildLetter(f, lang = "en") {
  const name = v(f.name, lang === "ur" ? "[آپ کا نام]" : "[Your name]");
  const ref = v(f.reference, lang === "ur" ? "[ریفرنس نمبر]" : "[Reference number]");
  const address = v(f.address, lang === "ur" ? "[آپ کا پتہ]" : "[Your address]");
  const phone = v(f.phone, lang === "ur" ? "[موبائل نمبر]" : "[Mobile number]");
  const sub = v(f.subdivision, lang === "ur" ? "[سب ڈویژن کا نام، بل پر درج ہے]" : "[Sub-division name, printed on the bill]");
  const company = v(f.companyFull, lang === "ur" ? "[کمپنی]" : "[Company]");
  const problem = PROBLEMS.find((p) => p[0] === f.problem) || PROBLEMS[0];
  const extra = f.problem !== "tariff" && String(f.details || "").trim() ? String(f.details).trim() : "";

  if (lang === "ur") {
    const [p1, p2] = bodyUr(f);
    return [
      `تاریخ: ${today()}`,
      "",
      "بخدمت جناب سب ڈویژنل آفیسر (SDO)",
      `${sub} سب ڈویژن`,
      `${company} (${f.abbr || ""})`,
      "",
      `موضوع: ${problem[2]} کی شکایت، ریفرنس نمبر ${ref}`,
      "",
      "جنابِ عالی،",
      "",
      `میں ${name}، مندرجہ بالا ریفرنس نمبر کے کنکشن کا صارف ہوں، جو ${address} پر نصب ہے۔`,
      "",
      p1,
      ...(extra ? ["", extra] : []),
      "",
      p2,
      "",
      "مزید گزارش ہے کہ جب تک اس شکایت کا فیصلہ نہ ہو جائے، میرا کنکشن منقطع نہ کیا جائے، اور مجھے اس شکایت کا نمبر اور کارروائی سے تحریری طور پر آگاہ کیا جائے۔",
      "",
      "منسلکات: متعلقہ بل کی نقل، میٹر کی تصویر (تاریخ کے ساتھ)، اور دیگر ثبوت۔",
      "",
      "العارض،",
      name,
      `ریفرنس نمبر: ${ref}`,
      `موبائل: ${phone}`,
    ].join("\n");
  }

  const [p1, p2] = bodyEn(f);
  return [
    `Date: ${today()}`,
    "",
    "The Sub Divisional Officer (SDO)",
    `${sub} Sub-Division`,
    `${company} (${f.abbr || ""})`,
    "",
    `Subject: Complaint about ${problem[1].toLowerCase()}, reference number ${ref}`,
    "",
    "Dear Sir or Madam,",
    "",
    `I am ${name}, the consumer of the connection with the reference number above, installed at ${address}.`,
    "",
    p1,
    ...(extra ? ["", extra] : []),
    "",
    p2,
    "",
    "I also request that my supply not be disconnected while this complaint is under review, and that I be given a complaint number and informed of the outcome in writing.",
    "",
    "Enclosed: a copy of the bill in question, a dated photograph of the meter, and other supporting documents.",
    "",
    "Yours faithfully,",
    name,
    `Reference number: ${ref}`,
    `Mobile: ${phone}`,
  ].join("\n");
}
