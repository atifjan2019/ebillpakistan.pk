// 404 for URLs that match no route group at all (for example /does-not-exist
// or /x/y/z). With two root layouts, app/(site)/not-found.js only covers
// paths that resolve inside the (site) group, so this file renders the same
// 404 page inside the shared shell for everything else. No ad tags: a 404 is
// not a content page.
import SiteShell, { siteViewport } from "./SiteShell";
import NotFound from "./(site)/not-found";

export const metadata = {
  title: "Page not found | eBill Pakistan",
  robots: { index: false, follow: true },
};
export const viewport = siteViewport;

export default function GlobalNotFound() {
  return (
    <SiteShell ads={false}>
      <NotFound />
    </SiteShell>
  );
}
