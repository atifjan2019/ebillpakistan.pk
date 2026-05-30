export const metadata = {
  title: "About | eBill Pakistan",
  description:
    "eBill Pakistan is a free, independent tool that lets you check your electricity bill online in seconds, with no app and no sign-up. Learn what we do and why.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <section className="legal-page">
      <div className="container legal-inner">
        <div className="crumb">
          <a href="/">Home</a> <span>/</span> <span>About</span>
        </div>
        <h1>About eBill Pakistan</h1>
        <p className="legal-intro">
          eBill Pakistan (ebillpakistan.pk) is a free, simple way to check your electricity bill
          online. Type your reference number and we&apos;ll pull up your latest bill in seconds, with no
          app to install and no account to create.
        </p>

        <div className="prose">
          <h2>Why we built it</h2>
          <p>
            Checking your electricity bill in Pakistan often means digging out the paper copy,
            visiting an official portal, or guessing which company you&apos;re even with. We wanted
            something faster: one box, one number, your bill. That&apos;s eBill Pakistan.
          </p>

          <h2>What you can do</h2>
          <ul>
            <li>View your latest electricity bill instantly using your reference or account number.</li>
            <li>Let us <strong>auto-detect your company</strong>, so you don&apos;t need to know whether
              you&apos;re on LESCO, MEPCO, PESCO or any other DISCO.</li>
            <li>Download your bill as a PDF or share it on WhatsApp in a single tap.</li>
          </ul>

          <h2>Companies we support</h2>
          <p>
            We cover all the major distribution companies across Pakistan: LESCO, IESCO, MEPCO, FESCO,
            GEPCO, HESCO, PESCO, QESCO, SEPCO, TESCO, HAZECO and the AJK Electricity Department.
          </p>

          <h2>Free and independent</h2>
          <p>
            eBill Pakistan is completely free to use and is run independently. We are not affiliated
            with, endorsed by, or operated by PITC or any distribution company; we simply make it
            easier to view bills that are already available to you. For official payments, complaints
            or disputes, please use your company&apos;s official channels.
          </p>

          <h2>What&apos;s next</h2>
          <p>
            We&apos;re working on adding more bills you care about, including <strong>gas and
            internet</strong>, so you can check everything in one place. Have a suggestion? We&apos;d
            love to hear it, so visit our <a href="/contact">contact page</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
