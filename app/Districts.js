// The district/city list.
//
// Below 640px this collapses into a <details> so a long list does not push the
// substantive content off the screen on a phone; from 640px up the disclosure is
// open and the summary is hidden, so desktop sees a plain list. Using <details>
// rather than JS keeps it a server component and keeps it working without
// hydration.
export default function Districts({ abbr, cities, region, color }) {
  if (!cities?.length) return null;
  return (
    <details className="districts" open>
      <summary>
        <span>Districts and towns {abbr} serves</span>
        <span className="districts-count">{cities.length}</span>
      </summary>
      <div className="districts-body">
        <p className="districts-lede">
          {abbr} distributes across {region}, including:
        </p>
        <div className="chips">
          {cities.map((ct) => (
            <span key={ct} className="chip" style={{ "--c": color }}>{ct}</span>
          ))}
        </div>
      </div>
    </details>
  );
}
