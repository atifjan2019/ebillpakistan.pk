import LegalShell from "../LegalShell";
import { buildMeta } from "../../lib/seo";

export const metadata = buildMeta({
  title: "Privacy Policy | eBill Pakistan",
  description:
    "How eBill Pakistan handles your information when you check your electricity bill online, and how advertising cookies — including Google's — work on this site.",
  path: "/privacy",
});

export default function Privacy() {
  return (
    <LegalShell
      title="Privacy Policy"
      updated="16 August 2026"
      intro="eBill Pakistan (“we”, “us”, “our”) runs the website www.ebillpakistan.pk, a free tool that lets you view your electricity bill online. This policy explains what information we handle, what cookies are set, how advertising on this site works, and what choices you have. We have kept it in plain English."
    >
      <h2>1. The short version</h2>
      <p>
        You don&apos;t need an account or your name to use eBill Pakistan. The reference number you
        type is used once, to fetch your bill, and is not stored in a database. We don&apos;t sell
        your data. The site is free to use and is paid for by advertising, which means third parties
        — including Google — may set cookies in your browser. You can refuse those, and section 5
        explains exactly how.
      </p>

      <h2>2. Information we process</h2>
      <ul>
        <li>
          <strong>The number you enter.</strong> Your 14-digit reference number (or account/consumer
          ID) is sent to our server and passed to the upstream billing system operated by the Power
          Information Technology Company (PITC) in order to retrieve your bill. It is not saved to a
          database after your request completes.
        </li>
        <li>
          <strong>Your bill.</strong> The bill shown to you is fetched from that upstream source and
          displayed back to you. We may briefly cache the rendered bill (a few hours at most) to
          speed up repeat views and reduce load on the upstream service; cached copies expire
          automatically. We do not build a history of your bills and we do not create an account
          for you.
        </li>
        <li>
          <strong>Basic technical data.</strong> Like most websites, our servers automatically
          receive your IP address, approximate location (city and country, as reported by our
          hosting provider), and the time of your request. We use this to keep the service secure,
          prevent abuse, apply fair-use rate limits, and understand aggregate usage such as how many
          lookups are made and from which cities. We do not link it to your identity and we do not
          sell it.
        </li>
        <li>
          <strong>What you send us.</strong> If you use our contact form or email us, we receive
          your name, email address and message so we can reply.
        </li>
      </ul>

      <h2>3. What we do not collect</h2>
      <p>
        We do not ask you to register, and we do not collect your CNIC, phone number or payment
        details. Personal details printed on your bill belong to your distribution company and are
        simply shown back to you on screen; we do not retain them. We never ask for a one-time
        password (OTP), and no legitimate bill-checking service ever will.
      </p>

      <h2>4. Cookies we set ourselves</h2>
      <p>
        We use a small number of strictly necessary cookies and similar local storage to make the
        site work — for example, remembering the cookie choice you make in the banner so we do not
        ask again on every visit, and security and rate-limiting measures that protect the lookup
        service from abuse. These are essential, cannot be switched off from within the site, and
        are not used to profile you or to target advertising.
      </p>

      <h2>5. Advertising, and third-party cookies</h2>
      <p>
        This site is free to use and is supported by advertising. That advertising is delivered by
        third parties, and it involves cookies. In plain terms:
      </p>
      <ul>
        <li>
          <strong>Third-party vendors, including Google, use cookies to serve ads based on your
          prior visits to this website and other websites.</strong>
        </li>
        <li>
          <strong>Google&apos;s use of advertising cookies enables it and its partners to serve ads
          to you based on your visit to this site and/or other sites on the internet.</strong>
        </li>
        <li>
          We may use more than one third-party advertising network. Those networks set and read
          their own cookies under their own privacy policies, and{" "}
          <strong>we do not control those cookies</strong> and cannot read them ourselves.
        </li>
        <li>
          Advertising cookies are <strong>not set before you consent</strong> to them. If you reject
          non-essential cookies, or simply have not made a choice yet, our advertising code is not
          loaded at all.
        </li>
      </ul>

      <h3>How to opt out</h3>
      <p>You have several independent ways to refuse personalised advertising:</p>
      <ul>
        <li>
          <strong>On this site:</strong> choose <em>Reject</em> in the cookie banner, or reopen it
          at any time from the <em>Cookie settings</em> link in the footer, and change your choice.
        </li>
        <li>
          <strong>Across Google&apos;s services:</strong> you may opt out of personalised
          advertising by visiting{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>
          .
        </li>
        <li>
          <strong>Across many advertising networks at once:</strong> use{" "}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            www.aboutads.info/choices
          </a>{" "}
          to opt out of third-party vendors&apos; use of cookies for personalised advertising.
        </li>
        <li>
          <strong>In your browser:</strong> every major browser lets you block or delete third-party
          cookies entirely.
        </li>
      </ul>
      <p>
        Opting out does not remove advertising from the site; it means the advertising you see is
        less likely to be based on your browsing history.
      </p>

      <h2>6. Analytics</h2>
      <p>
        We may use privacy-respecting analytics to understand aggregate traffic — which pages are
        read, roughly where visitors come from, and whether the lookup succeeded. Any analytics that
        relies on non-essential cookies is loaded only after you consent, on the same basis as
        advertising, and can be refused in the same banner. Aggregate lookup statistics used to run
        the service (counts by company, by city and by day) are derived from server logs, are not
        tied to your identity, and are described in section 2.
      </p>

      <h2>7. Service providers</h2>
      <p>
        To run the site we rely on a small number of third parties: our hosting provider, a
        caching and rate-limiting service, our advertising partners, and — as the source of your
        bill — the distribution companies and PITC. These providers process data on our behalf or as
        the source of the bill, under their own terms and privacy policies. Some of them are located
        outside Pakistan, which means data may be processed abroad. We are not affiliated with PITC
        or any distribution company.
      </p>

      <h2>8. Data retention &amp; security</h2>
      <p>
        Because we don&apos;t store your bills or personal details, there is very little to retain.
        Short-lived caches and security logs are kept only as long as needed and then discarded.
        Messages sent through the contact form are kept only as long as needed to deal with your
        enquiry. We take reasonable measures to protect information passing through our systems,
        though no online service can be guaranteed to be completely secure.
      </p>

      <h2>9. Children</h2>
      <p>
        eBill Pakistan is intended for general use and is not directed at children. We do not
        knowingly collect personal information from children.
      </p>

      <h2>10. Your choices and your rights</h2>
      <p>
        Since we don&apos;t maintain accounts, there is normally no profile to access, correct or
        delete. You can change or withdraw your cookie consent at any time via{" "}
        <em>Cookie settings</em> in the footer. For any privacy question or request — including
        asking us to delete a message you sent us — email{" "}
        <a href="mailto:support@ebillpakistan.pk">support@ebillpakistan.pk</a> or use our{" "}
        <a href="/contact">contact form</a> and choose <em>Privacy request</em>. We aim to respond
        within a few working days.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time — for example if we add an advertising
        or analytics partner. When we do, we&apos;ll change the &ldquo;Last updated&rdquo; date
        above. Continued use of the site after an update means you accept the revised policy.
      </p>
    </LegalShell>
  );
}
