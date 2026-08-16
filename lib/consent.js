// Cookie-consent state. Stored in localStorage (not a cookie) so it is never
// sent to the server and cannot itself be used for tracking.
//
// The contract: NOTHING non-essential may load until readConsent() returns an
// object with the relevant flag set to true. `null` means "no choice made yet"
// and must be treated exactly like a refusal — not like consent.

export const CONSENT_KEY = "ebp:consent:v1";

// Fired on window whenever the stored choice changes, so gated loaders
// (advertising, analytics) can react without a page reload.
export const CONSENT_EVENT = "ebp:consent-change";
// Fired by the footer "Cookie settings" link to reopen the banner.
export const CONSENT_OPEN_EVENT = "ebp:consent-open";

export const CATEGORIES = [
  {
    id: "ads",
    title: "Advertising cookies",
    detail:
      "Let Google and other advertising partners set cookies so the ads you see can be based on your previous visits to this and other sites. Refusing does not remove ads — it makes them less personalised.",
  },
  {
    id: "analytics",
    title: "Analytics cookies",
    detail:
      "Help us count visits and see which guides people actually read, so we know what to improve. Aggregate only; never used to identify you.",
  },
];

// Read the stored choice. Returns null when the visitor has not chosen yet.
export function readConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (typeof v?.ads !== "boolean" || typeof v?.analytics !== "boolean") return null;
    return v;
  } catch {
    return null; // corrupt/blocked storage -> behave as "not chosen" = refused
  }
}

// Persist a choice and notify listeners.
export function writeConsent(next) {
  const value = {
    ads: !!next.ads,
    analytics: !!next.analytics,
    ts: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  } catch {
    /* private mode / storage disabled: the choice just won't persist */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  return value;
}

export const hasConsent = (category) => !!readConsent()?.[category];

export function openConsentSettings() {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}
