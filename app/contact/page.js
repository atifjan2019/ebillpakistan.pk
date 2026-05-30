export const metadata = {
  title: "Contact | eBill Pakistan",
  description:
    "Get in touch with eBill Pakistan. Email us with feedback, questions or suggestions about checking your electricity bill online.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <section className="legal-page">
      <div className="container legal-inner">
        <div className="crumb">
          <a href="/">Home</a> <span>/</span> <span>Contact</span>
        </div>
        <h1>Contact us</h1>
        <p className="legal-intro">
          We&apos;d love to hear from you. Whether it&apos;s feedback, a bug, a feature request, or a
          company you&apos;d like us to add, just drop us a line.
        </p>

        <div className="prose">
          <p>
            <a className="btn btn-primary" href="mailto:support@ebillpakistan.pk">Email support@ebillpakistan.pk</a>
          </p>

          <h2>What we can help with</h2>
          <ul>
            <li>Problems checking or downloading a bill on eBill Pakistan.</li>
            <li>Suggestions, feedback, or companies and services you&apos;d like us to add.</li>
            <li>Privacy questions or general enquiries.</li>
          </ul>

          <h2>What we can&apos;t help with</h2>
          <p>
            We&apos;re an independent service and are not affiliated with PITC or any distribution
            company. For <strong>bill payments, meter issues, new connections, or billing
            complaints and disputes</strong>, please contact your electricity distribution company
            directly through their official helpline or office, as they&apos;re the only ones who can
            resolve those.
          </p>

          <h2>Response time</h2>
          <p>
            We read every message and aim to reply within a few working days. Thanks for helping us
            make eBill Pakistan better.
          </p>
        </div>
      </div>
    </section>
  );
}
