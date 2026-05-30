import "./globals.css";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { DISCOS } from "../lib/discos";
import Nav from "./Nav";

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
            <a className="logo" href="/" aria-label="eBill Pakistan home">
              <img src="/images/logo.png" alt="eBill Pakistan" className="logo-img" />
            </a>
            <Nav />
          </div>
        </header>

        <main>{children}</main>

        <footer className="footer">
          <div className="container footer-grid">
            <div className="footer-brand">
              <a className="logo-chip" href="/" aria-label="eBill Pakistan home">
                <img src="/images/logo.png" alt="eBill Pakistan" className="logo-img" />
              </a>
              <p className="blurb">
                A simple, free way to check your electricity bill online: no app, no sign-up,
                just your reference number.
              </p>
              <span className="footer-soon">⚡ Gas &amp; internet bills coming soon</span>
            </div>

            <div className="footer-col footer-companies">
              <h4>Check your bill</h4>
              <ul className="cols-2">
                {Object.entries(DISCOS).map(([code, [abbr]]) => (
                  <li key={code}><a href={`/${code}-bill-check`}>{abbr} Bill</a></li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Site</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/#how">How it works</a></li>
                <li><a href="/#companies">All companies</a></li>
                <li><a href="/#faq">FAQ</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="/#faq">Privacy policy</a></li>
                <li><a href="/#faq">Terms of use</a></li>
                <li><a href="/#faq">Disclaimer</a></li>
              </ul>
            </div>
          </div>

          <div className="container footer-bottom">
            <span>© {new Date().getFullYear()} eBill Pakistan. All rights reserved.</span>
            <span>Not affiliated with PITC or any DISCO. Bill data belongs to the respective company.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
