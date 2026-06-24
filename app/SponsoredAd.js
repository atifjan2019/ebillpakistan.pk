"use client";

// Reusable, disclosed sponsored slot. Shows a Khyber Wear promo image as a
// labeled "Sponsored" placement with rel="sponsored" on the outbound link.
//
// - If `src` is given, that exact creative is shown (static).
// - Otherwise it picks a RANDOM creative on mount and rotates every few seconds,
//   so visitors see a different image each visit.
// - The "Sponsored" badge is a separate element, so the disclosure persists even
//   if the image fails to load or JS is disabled (SSR renders the badge + first
//   creative). Image is lazy-loaded; the slot is responsive and CWV-friendly.
import { useEffect, useState } from "react";
import { HOUSE_AD_URL, HOUSE_AD_NAME, HOUSE_AD_ALT, HOUSE_AD_CREATIVES } from "../lib/ads";

export default function SponsoredAd({
  src,
  alt = HOUSE_AD_ALT,
  href = HOUSE_AD_URL,
  label = "Sponsored",
  className = "",
}) {
  const fixed = Boolean(src);
  // Start at 0 so SSR and first client paint match (no hydration mismatch).
  const [i, setI] = useState(0);

  useEffect(() => {
    if (fixed || HOUSE_AD_CREATIVES.length <= 1) return;
    setI(Math.floor(Math.random() * HOUSE_AD_CREATIVES.length));
    const t = setInterval(
      () => setI((p) => (p + 1) % HOUSE_AD_CREATIVES.length),
      5000
    );
    return () => clearInterval(t);
  }, [fixed]);

  const image = fixed ? src : HOUSE_AD_CREATIVES[i];
  if (!image) return null;

  return (
    <aside className={`sponsored ${className}`.trim()} aria-label="Sponsored content">
      <span className="sponsored-badge">{label}</span>
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        aria-label={`${label}: ${HOUSE_AD_NAME} — ${alt}`}
      >
        <img src={image} alt={alt} loading="lazy" decoding="async" />
      </a>
    </aside>
  );
}
