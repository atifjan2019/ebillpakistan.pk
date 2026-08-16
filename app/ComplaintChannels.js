// That company's OWN complaint channels, from lib/discoContent.js.
//
// This block is the single biggest de-duplication win across the 12 DISCO pages:
// every page used to print "118" and nothing else — identical text on all twelve.
//
// Suppression: any channel, office or address whose value is an unresolved
// {{VERIFY}} is dropped entirely in production (see lib/verify.js), heading
// included. A page with three channels beats a page with five where two of them
// are template braces.
import { SHARED_CHANNELS } from "../lib/discoContent";
import { safe, safeList, hasVerify } from "../lib/verify";

function Tel({ value }) {
  if (!value) return null;
  return <a href={`tel:${String(value).replace(/[^\d+]/g, "")}`}>{value}</a>;
}

function Channel({ label, children, note, primary }) {
  return (
    <div className={`cc-channel${primary ? " cc-channel--primary" : ""}`}>
      <span className="cc-channel-k">{label}</span>
      <span className="cc-channel-v">{children}</span>
      {note && <span className="cc-channel-n">{note}</span>}
    </div>
  );
}

export default function ComplaintChannels({ abbr, city, website, data }) {
  if (!data) return null;
  const { NATIONAL, CITIZEN_PORTAL } = SHARED_CHANNELS;

  const helpline = safe(data.helpline);
  const headOffice = safe(data.headOffice);
  const officesNote = safe(data.officesNote);
  const offices = safeList(data.offices || [], ["name", "phone", "covers"]);

  return (
    <section id="complaints" className="cc-block">
      <h2>How to complain to {abbr}</h2>
      {data.intro && <p>{data.intro}</p>}

      <div className="cc-channels">
        {data.whatsapp && !hasVerify(data.whatsapp) && (
          <Channel label={`${abbr} complaint cell`} note={data.whatsappNote} primary>
            <Tel value={data.whatsapp} />
          </Channel>
        )}
        {data.uan && !hasVerify(data.uan) && (
          <Channel label={`${abbr} toll-free UAN`} note={data.uanNote} primary>
            <Tel value={data.uan} />
          </Channel>
        )}
        {helpline && (
          <Channel label="National helpline" note={NATIONAL.note}>
            <Tel value={helpline} />
          </Channel>
        )}
        {data.sms && (
          <Channel label="SMS short code"><span>{data.sms}</span></Channel>
        )}
        {data.portal && (
          <Channel label="Online complaint portal" note={data.portal.note}>
            <a href={data.portal.url} target="_blank" rel="noopener noreferrer">{data.portal.name}</a>
          </Channel>
        )}
        <Channel label={`If ${abbr} does not resolve it`} note={CITIZEN_PORTAL.note}>
          <a href={CITIZEN_PORTAL.url} target="_blank" rel="noopener noreferrer">{CITIZEN_PORTAL.name}</a>
        </Channel>
      </div>

      {headOffice && (
        <>
          <h3>{abbr} head office</h3>
          <p className="cc-head-office">{headOffice}</p>
        </>
      )}

      {offices.length > 0 && (
        <>
          <h3>{abbr} circle &amp; area offices</h3>
          <ul className="cc-offices">
            {offices.map((o) => (
              <li key={o.name}>
                <span className="cc-office-name">{o.name}</span>
                <span className="cc-office-phone"><Tel value={o.phone} /></span>
                {o.covers && <span className="cc-office-covers">{o.covers}</span>}
              </li>
            ))}
          </ul>
        </>
      )}
      {officesNote && <p className="cc-offices-note">{officesNote}</p>}

      <p className="cc-provenance">
        Checked against{" "}
        {website ? (
          <a href={website} target="_blank" rel="noopener noreferrer">{abbr}&apos;s site</a>
        ) : (
          <>{abbr}&apos;s site</>
        )}
        , {data.verifiedOn}. Wrong number? <a href="/contact">Tell us</a>.
      </p>
    </section>
  );
}
