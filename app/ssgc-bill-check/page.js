import UtilityPage from "../UtilityPage";
import { utilitySeo, utilitySlug } from "../../lib/utilities";
import { buildMeta } from "../../lib/seo";

const CODE = "ssgc";

export function generateMetadata() {
  const seo = utilitySeo(CODE, new Date().getFullYear());
  return buildMeta({ title: seo.title, description: seo.description, path: `/${utilitySlug(CODE)}`, imageAlt: seo.title });
}

export default function Page() {
  return <UtilityPage code={CODE} />;
}
