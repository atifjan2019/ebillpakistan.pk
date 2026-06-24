// Reusable, disclosed sponsored slot (server component — no client JS, best for
// Core Web Vitals). Renders one promotional image from /public/images/... as a
// labeled "Sponsored" placement with rel="sponsored" on the outbound link.
//
// Compliance notes:
// - The "Sponsored" badge is a SEPARATE element from the <img>, so the disclosure
//   persists even if the image fails to load (broken-image / no-JS path).
// - The link uses rel="sponsored noopener noreferrer" per Google's ad guidelines.
// - It is visually an aside/figure, never disguised as editorial content.
// - Image is lazy-loaded and given width/height (aspect-ratio) to avoid layout shift.
import { HOUSE_AD_URL, HOUSE_AD_NAME, HOUSE_AD_ALT } from "../lib/ads";

export default function SponsoredAd({
  src,
  alt = HOUSE_AD_ALT,
  href = HOUSE_AD_URL,
  label = "Sponsored",
  width = 600,
  height = 600,
  className = "",
}) {
  if (!src) return null;
  return (
    <aside className={`sponsored ${className}`.trim()} aria-label="Sponsored content">
      <span className="sponsored-badge">{label}</span>
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        aria-label={`${label}: ${HOUSE_AD_NAME} — ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          style={{
            display: "block", width: "100%", height: "auto",
            aspectRatio: `${width} / ${height}`, objectFit: "contain", background: "#fff",
          }}
        />
      </a>
    </aside>
  );
}
