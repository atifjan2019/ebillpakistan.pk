// Shared wrapper for the legal pages (privacy, terms, disclaimer).
import { SITE_URL } from "../lib/seo";

export default function LegalShell({ title, updated, intro, path, children }) {
  // Breadcrumb + WebPage structured data, so the legal pages carry the same
  // markup as every other page. Only when a path is given.
  const ld = path
    ? {
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}${path}` },
          ] },
          { "@type": "WebPage", "@id": `${SITE_URL}${path}`, url: `${SITE_URL}${path}`, name: title, isPartOf: { "@id": `${SITE_URL}/#website` }, ...(updated ? { dateModified: updated } : {}) },
        ],
      }
    : null;
  return (
    <section className="legal-page">
      <div className="container legal-inner">
        {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />}
        <div className="crumb">
          <a href="/">Home</a> <span>/</span> <span>{title}</span>
        </div>
        <h1>{title}</h1>
        {updated && <p className="legal-updated">Last updated: {updated}</p>}
        {intro && <p className="legal-intro">{intro}</p>}
        <div className="prose">{children}</div>
        <p className="legal-note">
          This page is provided for general information about eBill Pakistan and is not legal advice.
          For questions, contact us at{" "}
          <a href="mailto:support@ebillpakistan.pk">support@ebillpakistan.pk</a>.
        </p>
      </div>
    </section>
  );
}
