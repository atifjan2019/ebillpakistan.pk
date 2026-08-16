// That company's OWN complaint channels, from lib/discoContent.js.
//
// This block is the single biggest de-duplication win across the 12 DISCO pages:
// previously every page printed "118" and nothing else, which is identical text
// on all twelve. Now each page renders that company's own numbers, portal and
// offices, and says plainly which of them we have verified and which we haven't.
import { SHARED_CHANNELS } from "../lib/discoContent";
import Verify, { hasVerify } from "./Verify";

// Phone numbers become tel: links (mobile requirement), but only when the value
// is a real number rather than an unresolved placeholder.
function Tel({ value }) {
  if (!value) return null;
  if (hasVerify(value)) return <Verify text={value} />;
  return <a href={`tel:${String(value).replace(/[^\d+]/g, "")}`}>{value}</a>;
}

export default function ComplaintChannels({ abbr, city, website, data }) {
  if (!data) return null;
  const { NATIONAL, CITIZEN_PORTAL } = SHARED_CHANNELS;

  return (
    <section id="complaints" className="cc-block">
      <h2>How to complain to {abbr}</h2>
      <p>
        Billing disputes, a meter that looks wrong, an outage or a connection problem all go to{" "}
        {abbr} directly — this site cannot act on any of them. These are {abbr}&apos;s own channels,
        strongest first.
      </p>

      <div className="cc-channels">
        {data.whatsapp && (
          <div className="cc-channel cc-channel--primary">
            <span className="cc-channel-k">{abbr} complaint cell</span>
            <span className="cc-channel-v"><Tel value={data.whatsapp} /></span>
            {data.whatsappNote && <span className="cc-channel-n">{data.whatsappNote}</span>}
          </div>
        )}
        {data.uan && (
          <div className="cc-channel cc-channel--primary">
            <span className="cc-channel-k">{abbr} toll-free UAN</span>
            <span className="cc-channel-v"><Tel value={data.uan} /></span>
            {data.uanNote && <span className="cc-channel-n">{data.uanNote}</span>}
          </div>
        )}
        <div className="cc-channel">
          <span className="cc-channel-k">National helpline</span>
          <span className="cc-channel-v"><Tel value={data.helpline} /></span>
          <span className="cc-channel-n">{NATIONAL.note}</span>
        </div>
        {data.sms && (
          <div className="cc-channel">
            <span className="cc-channel-k">SMS short code</span>
            <span className="cc-channel-v">{data.sms}</span>
            <span className="cc-channel-n">Text your complaint if the line is busy.</span>
          </div>
        )}
        {data.portal && (
          <div className="cc-channel">
            <span className="cc-channel-k">Online complaint portal</span>
            <span className="cc-channel-v">
              <a href={data.portal.url} target="_blank" rel="noopener noreferrer">{data.portal.name}</a>
            </span>
            <span className="cc-channel-n">{data.portal.note}</span>
          </div>
        )}
        <div className="cc-channel">
          <span className="cc-channel-k">If {abbr} does not resolve it</span>
          <span className="cc-channel-v">
            <a href={CITIZEN_PORTAL.url} target="_blank" rel="noopener noreferrer">{CITIZEN_PORTAL.name}</a>
          </span>
          <span className="cc-channel-n">{CITIZEN_PORTAL.note}</span>
        </div>
      </div>

      <h3>{abbr} head office</h3>
      <p className="cc-head-office"><Verify text={data.headOffice} /></p>

      {data.offices?.length > 0 && (
        <>
          <h3>{abbr} circle &amp; area offices</h3>
          <ul className="cc-offices">
            {data.offices.map((o) => (
              <li key={o.name}>
                <span className="cc-office-name">{o.name}</span>
                <span className="cc-office-phone"><Tel value={o.phone} /></span>
                {o.covers && <span className="cc-office-covers">{o.covers}</span>}
              </li>
            ))}
          </ul>
        </>
      )}
      {data.officesNote && (
        <p className="cc-offices-note"><Verify text={data.officesNote} /></p>
      )}

      <p className="cc-provenance">
        Checked against{" "}
        {website ? (
          <a href={website} target="_blank" rel="noopener noreferrer">{abbr}&apos;s own website</a>
        ) : (
          <>{abbr}&apos;s own website</>
        )}{" "}
        on {data.verifiedOn}. Numbers do change — if one of these is wrong,{" "}
        <a href="/contact">tell us</a> and we&apos;ll correct it. See our{" "}
        <a href="/editorial-policy">editorial policy</a> for how we source contact details.
      </p>
    </section>
  );
}
