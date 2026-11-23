// Root layout for every content page: the shared shell with the AdSense
// account tag and script in <head>. See app/SiteShell.js.
import SiteShell, { siteMetadata, siteViewport } from "../SiteShell";

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function SiteLayout({ children }) {
  return <SiteShell ads>{children}</SiteShell>;
}
