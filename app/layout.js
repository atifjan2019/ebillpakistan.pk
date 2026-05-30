import "./globals.css";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.ebillpakistan.pk"),
  title: "eBill Pakistan | Check Your Electricity Bill Online",
  description:
    "Check and download your latest electricity bill online for LESCO, IESCO, MEPCO, FESCO, GEPCO, HESCO, PESCO, QESCO, SEPCO, TESCO, HAZECO and AJK. Free, instant and secure.",
};

function Bolt() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>
        <header className="nav">
          <div className="container nav-inner">
            <a className="logo" href="/">
              <span className="mark"><Bolt /></span>
              eBill<b>&nbsp;Pakistan</b>
            </a>
            <nav className="nav-links">
              <a href="/#companies">Companies</a>
              <a href="/#how">How it works</a>
              <a href="/#faq">FAQ</a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="footer">
          <div className="container footer-top">
            <div>
              <a className="logo" href="/"><span className="mark"><Bolt /></span>eBill<b>&nbsp;Pakistan</b></a>
              <p className="blurb">
                A simple, free way to check your electricity bill: no app, no sign-up, just your
                reference number. More bills (gas &amp; internet) coming soon.
              </p>
            </div>
            <div>
              <h4>Companies</h4>
              <ul>
                <li><a href="/lesco-bill-check">LESCO Bill</a></li>
                <li><a href="/iesco-bill-check">IESCO Bill</a></li>
                <li><a href="/mepco-bill-check">MEPCO Bill</a></li>
                <li><a href="/pesco-bill-check">PESCO Bill</a></li>
              </ul>
            </div>
            <div>
              <h4>Quick links</h4>
              <ul>
                <li><a href="/#how">How it works</a></li>
                <li><a href="/#companies">All companies</a></li>
                <li><a href="/#faq">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul>
                <li><a href="/#faq">Privacy</a></li>
                <li><a href="/#faq">Terms</a></li>
                <li><a href="/#faq">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="container footer-bottom">
            <span>© {new Date().getFullYear()} eBill Pakistan. Not affiliated with PITC or any DISCO.</span>
            <span>Bill data belongs to the respective distribution company.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
