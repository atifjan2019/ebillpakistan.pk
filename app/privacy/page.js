import LegalShell from "../LegalShell";
import { buildMeta } from "../../lib/seo";

export const metadata = buildMeta({
  title: "Privacy Policy | eBill Pakistan",
  description:
    "How eBill Pakistan handles your information when you check your electricity bill online. We don't require sign-up and we don't store your bills.",
  path: "/privacy",
});

export default function Privacy() {
  return (
    <LegalShell
      title="Privacy Policy"
      updated="31 May 2026"
      intro="eBill Pakistan (“we”, “us”, “our”) runs the website ebillpakistan.pk, a free tool that lets you view your electricity bill online. This policy explains what information we handle and how. Your privacy matters to us, so we keep things minimal."
    >
      <h2>1. The short version</h2>
      <p>
        You don&apos;t need to create an account or give us your name to use eBill Pakistan. When you
        enter your reference or account number, we use it once to fetch your bill and we do not store it.
        We don&apos;t sell your data to anyone.
      </p>

      <h2>2. Information we process</h2>
      <ul>
        <li>
          <strong>The number you enter.</strong> Your 14-digit reference number (or account/consumer
          ID) is sent to our server only to look up your bill from your distribution company. It is not
          saved to a database after your request completes.
        </li>
        <li>
          <strong>Your bill.</strong> The bill we show you is fetched live from the source and displayed
          back to you. We may briefly cache it (a few minutes) to speed up repeat views and reduce load
          on the upstream service; cached copies expire automatically.
        </li>
        <li>
          <strong>Basic technical data.</strong> Like most websites, our servers automatically receive
          information such as your IP address, approximate location (city and country) and the time of your
          request. We use this to keep the service secure, prevent abuse, apply fair-use rate limits, and to
          understand basic, aggregate usage, such as how many people check bills and from which cities. We do
          not link this to your identity, and we do not sell it.
        </li>
      </ul>

      <h2>3. What we do not collect</h2>
      <p>
        We do not ask you to register, and we do not collect your name, CNIC, phone number or payment
        details. Any personal details printed on your bill belong to your distribution company and are
        simply shown back to you on screen, and we do not retain them.
      </p>

      <h2>4. Cookies</h2>
      <p>
        We use only the cookies needed to make the site work and to keep it secure. We do not use cookies
        to build advertising profiles of you. If we add analytics or advertising in the future, we will
        update this policy and, where required, ask for your consent.
      </p>

      <h2>5. Service providers</h2>
      <p>
        To run the site we rely on a small number of third parties, including our hosting provider and a
        caching/rate-limiting service. Your bill data is fetched from the relevant distribution company
        and the Power Information Technology Company (PITC) systems. These providers process data on our
        behalf or as the source of the bill, under their own terms and privacy policies. We are not
        affiliated with PITC or any distribution company.
      </p>

      <h2>6. Data retention &amp; security</h2>
      <p>
        Because we don&apos;t store your bills or personal details, there is very little to retain.
        Short-lived caches and security logs are kept only as long as needed and then discarded. We take
        reasonable measures to protect the information that does pass through our systems, though no online
        service can be guaranteed to be 100% secure.
      </p>

      <h2>7. Children</h2>
      <p>
        eBill Pakistan is intended for general use and is not directed at children. We do not knowingly
        collect personal information from children.
      </p>

      <h2>8. Your choices</h2>
      <p>
        Since we don&apos;t maintain accounts or store personal data, there is normally nothing to access,
        correct or delete. If you have any privacy questions or requests, contact us at{" "}
        <a href="mailto:support@ebillpakistan.pk">support@ebillpakistan.pk</a> and we&apos;ll do our best
        to help.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we&apos;ll change the “Last
        updated” date above. Continued use of the site after an update means you accept the revised policy.
      </p>
    </LegalShell>
  );
}
