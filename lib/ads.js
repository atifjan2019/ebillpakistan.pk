// House ad creatives shown in the result-page ad slot when Google AdSense is
// not configured (NEXT_PUBLIC_ADSENSE_CLIENT/SLOT unset). These are Khyber Wear
// promo images under /public/ads; the slot rotates through them so visitors see
// multiple variations during the bill-prep countdown. All link to the same
// landing page with a UTM tag so Khyber Wear can attribute the traffic.
export const HOUSE_AD_URL = "https://khyberwear.com/?utm_source=ebillpak";

export const HOUSE_AD_NAME = "Khyber Wear";

// Files live in /public/ads — referenced as /ads/<file>.
export const HOUSE_AD_CREATIVES = [
  "3.png",
  "4.png",
  "5.png",
  "3-300x300.jpg",
  "SaplayBrown2-min-300x300.jpg",
  "571554763_758666200555103_8634813289103746160_n.jpg",
  "572227250_758720533883003_5465050432956237501_n.jpg",
  "khyber-11.jpg",
].map((f) => `/ads/${f}`);
