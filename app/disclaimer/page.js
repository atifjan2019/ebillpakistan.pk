import LegalShell from "../LegalShell";

export const metadata = {
  title: "Disclaimer | eBill Pakistan",
  description:
    "eBill Pakistan is an independent tool and is not affiliated with PITC or any electricity distribution company. Bill information is provided for convenience only.",
  alternates: { canonical: "/disclaimer" },
};

export default function Disclaimer() {
  return (
    <LegalShell
      title="Disclaimer"
      updated="30 May 2026"
      intro="Please read this disclaimer carefully before using eBill Pakistan (ebillpakistan.pk)."
    >
      <h2>Independent service</h2>
      <p>
        eBill Pakistan is an independent, privately operated website. We are <strong>not</strong>{" "}
        affiliated with, authorised by, or endorsed by the Power Information Technology Company (PITC),
        WAPDA, or any electricity distribution company, including LESCO, IESCO, MEPCO, FESCO, GEPCO, HESCO,
        PESCO, QESCO, SEPCO, TESCO, HAZECO or the AJK Electricity Department. All company names, logos and
        trademarks are the property of their respective owners and are used for identification only.
      </p>

      <h2>For convenience only</h2>
      <p>
        We provide a simple way to view your electricity bill by fetching it from publicly accessible
        sources. The information is provided for general informational and convenience purposes only.
      </p>

      <h2>No guarantee of accuracy</h2>
      <p>
        While we aim to show your bill correctly, we do not warrant that the information displayed is
        accurate, complete, current or error-free. Bills are generated and maintained by your distribution
        company, and any figures, charges, dates or readings shown originate from them, not from us.
      </p>

      <h2>Always use official channels</h2>
      <p>
        For paying your bill, obtaining an official copy, reporting a fault, or raising any billing
        complaint or dispute, please use your distribution company&apos;s official website, helpline or
        offices. Do not rely solely on eBill Pakistan for official or financial decisions.
      </p>

      <h2>No liability</h2>
      <p>
        eBill Pakistan and its operators accept no responsibility or liability for any loss, damage or
        inconvenience caused by the use of, or reliance on, the information presented on this website. You
        use the service at your own risk.
      </p>

      <h2>External links</h2>
      <p>
        This website may contain links to external sites. We have no control over their content and accept
        no responsibility for them.
      </p>
    </LegalShell>
  );
}
