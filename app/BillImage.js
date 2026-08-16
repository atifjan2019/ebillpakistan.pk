// Renders an annotated bill photo for one company, or nothing.
//
// Used from article HTML through the <!-- billimage:CODE --> sentinel, the same
// mechanism the tariff tables use, because an article's content is a trusted
// HTML string and cannot contain a React node directly.
import { billImage } from "../lib/billImages";
import { DISCOS } from "../lib/discos";
import { SHOW_VERIFY } from "../lib/verify";

export default function BillImage({ code }) {
  const src = billImage(code);
  const abbr = DISCOS[code]?.[0] || code.toUpperCase();

  if (src) {
    return (
      <figure className="billimg">
        <img src={src} alt={`Annotated ${abbr} electricity bill showing where the reference number is printed`} loading="lazy" />
        <figcaption>Where the reference number sits on a {abbr} bill.</figcaption>
      </figure>
    );
  }
  // Loud in development, absent in production.
  if (!SHOW_VERIFY) return null;
  return (
    <p className="billimg-slot">
      Image slot — supply <code>public/images/bills/{code}-annotated.jpg</code> and set it in
      lib/billImages.js ({abbr} annotated bill)
    </p>
  );
}
