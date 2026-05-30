import LegalShell from "../LegalShell";
import { buildMeta } from "../../lib/seo";

export const metadata = buildMeta({
  title: "Terms of Use | eBill Pakistan",
  description:
    "The terms that govern your use of eBill Pakistan, a free online electricity bill checking tool.",
  path: "/terms",
});

export default function Terms() {
  return (
    <LegalShell
      title="Terms of Use"
      updated="30 May 2026"
      intro="These terms govern your use of ebillpakistan.pk (“eBill Pakistan”, “we”, “us”). By using the site, you agree to them. If you don't agree, please don't use the service."
    >
      <h2>1. What eBill Pakistan is</h2>
      <p>
        eBill Pakistan is a free, convenience tool that lets you look up and view your electricity bill
        online by entering your reference or account number. We fetch the bill from publicly accessible
        sources operated by the Power Information Technology Company (PITC) and the electricity
        distribution companies, and display it back to you.
      </p>

      <h2>2. Not an official or affiliated service</h2>
      <p>
        We are an independent service. We are <strong>not</strong> affiliated with, endorsed by, or
        operated by PITC, WAPDA, or any distribution company (such as LESCO, IESCO, MEPCO, FESCO, GEPCO,
        HESCO, PESCO, QESCO, SEPCO, TESCO, HAZECO or the AJK Electricity Department). All company names and
        trademarks belong to their respective owners.
      </p>

      <h2>3. Accuracy and “as is” service</h2>
      <p>
        The bill information shown comes from third-party sources and is provided on an “as is” and “as
        available” basis. We do not guarantee that it is accurate, complete, current or uninterrupted. For
        anything official (paying your bill, raising a complaint or resolving a dispute), always rely on
        your distribution company&apos;s official channels.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You agree to use eBill Pakistan responsibly. You must not:</p>
      <ul>
        <li>use automated tools, bots or scripts to mass-query, scrape or overload the service;</li>
        <li>attempt to look up information you are not authorised to access;</li>
        <li>interfere with, disrupt or attempt to gain unauthorised access to the site or its systems;</li>
        <li>use the service for any unlawful purpose.</li>
      </ul>
      <p>We may apply rate limits and may restrict or block access that appears abusive.</p>

      <h2>5. Intellectual property</h2>
      <p>
        The design, layout, text and branding of eBill Pakistan are our property. The bill data and any
        company logos or marks belong to the respective distribution companies and their owners. You may
        view and download your own bill for personal use.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, eBill Pakistan and its operators are not liable for any
        loss or damage arising from your use of, or inability to use, the service, or from reliance on any
        information shown. Use of the site is at your own risk.
      </p>

      <h2>7. Third-party links</h2>
      <p>
        The site may link to third-party websites. We are not responsible for their content, accuracy or
        practices, and a link does not imply endorsement.
      </p>

      <h2>8. Availability and changes</h2>
      <p>
        We may change, suspend or discontinue any part of the service at any time without notice. We may
        also update these terms; the “Last updated” date above shows when. Continued use after changes
        means you accept the updated terms.
      </p>

      <h2>9. Governing law</h2>
      <p>
        These terms are governed by the laws of the Islamic Republic of Pakistan, and any disputes are
        subject to the jurisdiction of its courts.
      </p>
    </LegalShell>
  );
}
