// Root layout for /result and /admin: the same shell, without the AdSense
// tags. /result renders a third party's bill and /admin is private, so no
// ad code is sent on either. See app/SiteShell.js.
import SiteShell, { siteMetadata, siteViewport } from "../SiteShell";

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function BareLayout({ children }) {
  return <SiteShell ads={false}>{children}</SiteShell>;
}
