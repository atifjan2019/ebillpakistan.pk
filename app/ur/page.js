// /ur: the Urdu homepage. Same lookup form as the English one (it posts to the
// same /result), with the explanation, steps and FAQ written in Urdu, and links
// to every Urdu guide. hreflang pairs it with "/".
import Image from "next/image";
import RefInput from "../RefInput";
import CheckBillLoader from "../CheckBillLoader";
import { DISCOS, hasLogo, discoLogo } from "../../lib/discos";
import { SITE_URL } from "../../lib/seo";
import { ARTICLES } from "../../lib/articles";

export const revalidate = 3600;

const TITLE = "بجلی کا بل آن لائن چیک کریں | eBill Pakistan";
const DESC = "LESCO، IESCO، MEPCO، PESCO اور پاکستان کی تمام 12 بجلی کمپنیوں کا بل صرف ریفرنس نمبر سے مفت چیک کریں۔ نہ ایپ، نہ اکاؤنٹ، نہ سائن اپ۔";

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/ur", languages: { en: "/", ur: "/ur", "x-default": "/" } },
  openGraph: { type: "website", siteName: "eBill Pakistan", locale: "ur_PK", url: "/ur", title: TITLE, description: DESC, images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "eBill Pakistan" }] },
};

const FAQS = [
  ["ریفرنس نمبر کہاں لکھا ہوتا ہے؟", "کاغذی بل کے اوپر بائیں طرف، نام اور پتے کے نیچے، Reference No یا Consumer No کے سامنے۔ یہ عموماً بل پر سب سے لمبا نمبر ہوتا ہے اور کبھی نہیں بدلتا۔ ایک بار نوٹ کر لیں تو ہر مہینے کاغذی بل کے بغیر چیک کر سکتے ہیں۔"],
  ["کیا بل چیک کرنے کے لیے اکاؤنٹ بنانا پڑے گا؟", "نہیں۔ نہ سائن اپ، نہ پاس ورڈ، نہ کوئی ایپ۔ صرف ریفرنس نمبر درکار ہے، اور آپ کے بل کی کوئی معلومات ہمارے پاس محفوظ نہیں ہوتی۔"],
  ["کون سی کمپنیاں شامل ہیں؟", "تمام بارہ: LESCO، IESCO، MEPCO، FESCO، GEPCO، HESCO، PESCO، QESCO، SEPCO، TESCO، HAZECO اور آزاد کشمیر کا محکمہ بجلی۔ وہ کمپنی چنیں جو آپ کے بل پر لکھی ہے، شہر سے اندازہ نہ لگائیں۔"],
  ["چند یونٹ زیادہ استعمال ہونے پر بل اتنا زیادہ کیوں آ گیا؟", "تقریباً ہمیشہ سلیب (slab) بدلنے کی وجہ سے۔ غیر محفوظ (unprotected) صارف کے لیے بل سلیب در سلیب نہیں بنتا: حد پار ہوتے ہی پورے مہینے کے سارے یونٹ اوپر والے ریٹ پر لگ جاتے ہیں۔ بل کیلکولیٹر یہ فرق دکھاتا ہے۔"],
  ["پروٹیکٹڈ اور غیر پروٹیکٹڈ صارف میں کیا فرق ہے؟", "پروٹیکٹڈ (protected) صارف وہ ہے جس نے پچھلے چھ مہینوں میں ہر مہینے 200 یونٹ یا اس سے کم استعمال کیے ہوں؛ اس کا فی یونٹ ریٹ بہت کم ہوتا ہے۔ باقی سب غیر پروٹیکٹڈ ہیں۔ آپ کا ٹیرف کوڈ بل پر لکھا ہوتا ہے۔"],
  ["بل پر دو رقمیں کیوں ہوتی ہیں؟", "ایک مقررہ تاریخ کے اندر ادائیگی کی رقم ہے اور دوسری اس کے بعد کی، جس میں لیٹ پیمنٹ سرچارج شامل ہوتا ہے۔ ادائیگی سے پہلے دیکھ لیں کہ کاؤنٹر یا ایپ کون سی رقم مانگ رہی ہے۔"],
  ["ادائیگی کے کتنی دیر بعد بل ادا شدہ دکھائی دیتا ہے؟", "ایک سے دو کام کے دن۔ بینک کاؤنٹر پر ادائیگی سب سے جلد اپڈیٹ ہوتی ہے؛ JazzCash، Easypaisa اور بینک ایپ سے کی گئی ادائیگی کچھ دیر لیتی ہے۔ رسید سنبھال کر رکھیں۔"],
  ["کیا میری معلومات محفوظ ہیں؟", "آپ جو ریفرنس نمبر لکھتے ہیں وہ صرف بل لانے کے لیے ایک بار استعمال ہوتا ہے اور کسی ڈیٹابیس میں محفوظ نہیں ہوتا۔ ہم نہ اکاؤنٹ بناتے ہیں، نہ بل رکھتے ہیں، اور کبھی شناختی کارڈ نمبر یا OTP نہیں مانگتے۔"],
];

const Search = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
);

export default function UrduHome() {
  const entries = Object.entries(DISCOS);
  const urduGuides = ARTICLES.filter((a) => a.lang === "ur");
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", "@id": `${SITE_URL}/ur#faq`, inLanguage: "ur", mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };

  return (
    <div lang="ur" dir="rtl" className="urdu">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="hero">
        <div className="container">
          <span className="eyebrow"><span className="dot" /> مفت • بغیر سائن اپ • تمام کمپنیاں</span>
          <h1>اپنا <span className="grad">بجلی کا بل</span> آن لائن چیک کریں</h1>
          <p className="sub">نہ ایپ ڈاؤن لوڈ کریں، نہ اکاؤنٹ بنائیں۔ بس ریفرنس نمبر لکھیں اور آپ کا تازہ بل سامنے، دیکھنے، ڈاؤن لوڈ کرنے یا واٹس ایپ پر بھیجنے کے لیے تیار۔</p>

          <form id="lookup" className="search-card" action="/result" method="get">
            <div className="search-grid">
              <div className="field">
                <label htmlFor="disco">کمپنی</label>
                <div className="control sel">
                  <select id="disco" name="disco" defaultValue="" required>
                    <option value="" disabled>اپنی کمپنی چنیں</option>
                    {entries.map(([code, [abbr]]) => (
                      <option key={code} value={code}>{abbr}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="reference">ریفرنس نمبر</label>
                <div className="control">
                  <RefInput id="reference" name="reference" inputMode="numeric" pattern="[0-9]{8,14}" placeholder="مثلاً 12345678901234" required dir="ltr" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary"><Search /> بل چیک کریں</button>
            </div>
            <p className="search-foot">
              <span className="only-wide">پہلے کمپنی چنیں، پھر بل کے اوپر بائیں طرف لکھا 14 ہندسوں کا ریفرنس نمبر درج کریں۔</span>
              <span className="only-narrow">ریفرنس نمبر: بل کے اوپر بائیں طرف۔</span>
            </p>
            <CheckBillLoader />
          </form>
          <p className="lang-switch"><a href="/">Read this page in English</a></p>
        </div>
      </section>

      <section className="section" id="companies">
        <div className="container">
          <div className="section-head">
            <span className="kicker">تمام کمپنیاں</span>
            <h2>اپنی کمپنی چنیں</h2>
            <p>پتہ نہیں کون سی کمپنی ہے؟ بل پر لکھا نام دیکھیں، یا یہاں اپنی کمپنی پر ٹیپ کریں۔</p>
          </div>
          <div className="disco-grid">
            {entries.map(([code, [abbr, city, color]]) => (
              <a key={code} className="disco-card" href={`/${code}-bill-check`} style={{ "--c": color }}>
                <span className={hasLogo(code) ? "badge badge--logo" : "badge"}>
                  {hasLogo(code) ? <Image src={discoLogo(code)} alt={`${abbr} logo`} className="badge-logo" width={56} height={56} loading="lazy" /> : abbr.slice(0, 2)}
                </span>
                <span className="name">{abbr}</span>
                <span className="city">{city}</span>
                <span className="go">بل چیک کریں ←</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="how" style={{ background: "#fff", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head">
            <span className="kicker">طریقہ</span>
            <h2>بس تین قدم</h2>
          </div>
          <div className="steps">
            <div className="step"><span className="num">1</span><h3>ریفرنس نمبر لیں</h3><p>کاغذی بل کے اوپر لکھا 14 ہندسوں کا نمبر۔ بس یہی چاہیے۔</p></div>
            <div className="step"><span className="num">2</span><h3>کمپنی چنیں</h3><p>فہرست سے اپنی کمپنی چنیں اور ریفرنس نمبر لکھیں۔</p></div>
            <div className="step"><span className="num">3</span><h3>بل حاضر</h3><p>فوراً دیکھیں، PDF میں محفوظ کریں، یا ایک ٹیپ سے واٹس ایپ پر بھیجیں۔</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">ٹولز</span>
            <h2>بل آنے سے پہلے حساب لگائیں</h2>
            <p>NEPRA کے نوٹیفائی کردہ ریٹ اور اس مہینے کی ایڈجسٹمنٹس پر بنے ہوئے۔</p>
          </div>
          <div className="tool-links tool-links--grid">
            <a className="tool-link" href="/bill-calculator"><b>بل کیلکولیٹر</b><span>یونٹ لکھیں، اندازاً بل دیکھیں، اور نیچے والے سلیب میں رہنے کی بچت۔</span></a>
            <a className="tool-link" href="/protected-consumer-checker"><b>پروٹیکٹڈ صارف چیکر</b><span>چھ مہینوں کے یونٹ بتاتے ہیں کہ آپ اہل ہیں یا نہیں۔</span></a>
            <a className="tool-link" href="/this-month"><b>اس مہینے کی ایڈجسٹمنٹس</b><span>فیول اور سہ ماہی چارجز جو اس مہینے کے بلوں پر لگے ہیں۔</span></a>
            <a className="tool-link" href="/solar-calculator"><b>سولر بچت کیلکولیٹر</b><span>چھت پر سولر لگانے سے بل پر کیا فرق پڑے گا۔</span></a>
          </div>
        </div>
      </section>

      {urduGuides.length > 0 && (
        <section className="section" style={{ background: "#fff", borderTop: "1px solid var(--line)" }}>
          <div className="container">
            <div className="section-head">
              <span className="kicker">اردو گائیڈز</span>
              <h2>بجلی کے بل کو سمجھیں</h2>
              <p>آسان اردو میں، ہر عدد کے ساتھ اس کا ذریعہ۔</p>
            </div>
            <div className="blog-list">
              {urduGuides.map((a) => (
                <article key={a.slug} className="blog-card">
                  <h2><a href={`/blog/${a.slug}`}>{a.title}</a></h2>
                  <p>{a.metaDescription}</p>
                  <a className="blog-more" href={`/blog/${a.slug}`}>گائیڈ پڑھیں ←</a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" id="faq">
        <div className="container">
          <div className="section-head">
            <span className="kicker">سوالات</span>
            <h2>عام سوالات کے جواب</h2>
          </div>
          <div className="faq">
            {FAQS.map(([q, a], i) => (
              <details key={i} open={i === 0}>
                <summary>{q}</summary>
                <div className="a">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
