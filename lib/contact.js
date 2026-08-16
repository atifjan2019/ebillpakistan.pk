// Shared contact-form constants. Kept in lib/ (not in the route handler) so the
// client form and the server validator import the SAME list and can never drift
// out of sync — a mismatch would silently reject a subject the form offers.
export const CONTACT_SUBJECTS = [
  "Technical problem",
  "Report incorrect data",
  "Feature request",
  "Privacy request",
  "Other",
];

// Business contact details, single-sourced for /contact, the footer and the
// Organization JSON-LD.
export const BUSINESS = {
  email: "support@ebillpakistan.pk",
  phone: "{{VERIFY: business phone number in international format, e.g. +92 91 000 0000}}",
  address: {
    street: "Office 27, Mardan Road",
    locality: "Charsadda",
    region: "Khyber Pakhtunkhwa",
    postalCode: "24420",
    country: "PK",
  },
};

export const addressOneLine = (a = BUSINESS.address) =>
  `${a.street}, ${a.locality} ${a.postalCode}, ${a.region}, Pakistan`;
