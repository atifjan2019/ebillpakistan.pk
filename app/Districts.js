// The district/city list.
//
// Below 640px this is a genuinely COLLAPSED <details> so a long list does not
// push the substantive content down the page; from 641px it is a plain always-
// visible list.
//
// Two variants rather than one <details> with a media query: a browser hides the
// content of a closed <details> through UA behaviour that CSS cannot reliably
// override, so "closed on mobile, open on desktop" is not expressible with one
// element. The duplicated markup is a handful of city names — trivial weight,
// and it keeps this a server component with no JS and no layout shift.
function Chips({ cities, color }) {
  return (
    <div className="chips">
      {cities.map((ct) => (
        <span key={ct} className="chip" style={{ "--c": color }}>{ct}</span>
      ))}
    </div>
  );
}

export default function Districts({ abbr, cities, region, color }) {
  if (!cities?.length) return null;
  const lede = `${abbr} distributes across ${region}, including:`;

  return (
    <>
      <details className="districts districts--mobile">
        <summary>
          <span>Districts and towns {abbr} serves</span>
          <span className="districts-count">{cities.length}</span>
        </summary>
        <div className="districts-body">
          <p className="districts-lede">{lede}</p>
          <Chips cities={cities} color={color} />
        </div>
      </details>

      <div className="districts districts--wide" aria-hidden="true">
        <p className="districts-lede">{lede}</p>
        <Chips cities={cities} color={color} />
      </div>
    </>
  );
}
