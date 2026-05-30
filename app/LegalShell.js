// Shared wrapper for the legal pages (privacy, terms, disclaimer).
export default function LegalShell({ title, updated, intro, children }) {
  return (
    <section className="legal-page">
      <div className="container legal-inner">
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
