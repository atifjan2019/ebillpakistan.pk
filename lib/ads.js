// House-ad creatives rotated in the result-page slot. These are Khyber Wear
// promo images; the slot cycles through them so visitors see several variations
// during the bill-prep countdown. All link to the same landing page with a UTM
// tag so Khyber Wear can attribute the traffic.
//
// IMPORTANT: these live under /public/images/kw (served at /images/kw/...), NOT
// a path containing "ad"/"ads". Ad blockers (uBlock/AdGuard/EasyList) block any
// request whose URL contains "/ads/", which silently emptied this slot; the
// /images/ path is never filtered. Keep new creatives here for the same reason.
export const HOUSE_AD_URL = "https://khyberwear.com/?utm_source=ebillpak";

export const HOUSE_AD_NAME = "Khyber Wear";

export const HOUSE_AD_CREATIVES = [
  "kw-1.jpg",
  "kw-2.png",
  "kw-3.png",
  "kw-4.png",
  "kw-5.jpg",
  "kw-6.jpg",
  "kw-7.jpg",
  "kw-8.jpg",
].map((f) => `/images/kw/${f}`);
