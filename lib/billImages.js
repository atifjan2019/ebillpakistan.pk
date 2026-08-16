// Annotated bill photographs, one per company.
//
// These are the images the reference-number guide needs, because the layouts
// genuinely differ between companies. None exist yet: drop a file at
// public/images/bills/<code>-annotated.jpg and set the path here.
//
// Until then the slot renders a labelled placeholder in development and NOTHING
// in production — the same rule as {{VERIFY}}. A guide that quietly has four
// fewer figures beats one showing four grey boxes to an AdSense reviewer.
export const BILL_IMAGES = {
  lesco: null,
  mepco: null,
  pesco: null,
  ajk: null,
  iesco: null,
  fesco: null,
};

export const billImage = (code) => BILL_IMAGES[code] || null;

// Which companies the reference-number guide illustrates, in order.
export const ILLUSTRATED = ["lesco", "mepco", "pesco", "ajk"];
