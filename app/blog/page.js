import { ARTICLES, formatDate } from "../../lib/articles";
import { SITE_URL, buildMeta } from "../../lib/seo";

const BLOG_TITLE = "Electricity Bill Help & Guides | eBill Pakistan";
const BLOG_DESC =
  "Guides on how to check, read and understand your Pakistan electricity bill online. Tips for LESCO, IESCO, MEPCO and all major DISCOs.";

export const metadata = buildMeta({
  title: BLOG_TITLE,
  description: BLOG_DESC,
  path: "/blog",
  imageAlt: "eBill Pakistan guides",
});

const collectionLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/blog#collection`,
  url: `${SITE_URL}/blog`,
  name: "Electricity Bill Help & Guides",
  description: BLOG_DESC,
  isPartOf: { "@id": `${SITE_URL}/#website` },
};
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
  ],
};

export default function BlogIndex() {
  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="container">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <span aria-current="page">Blog</span>
        </nav>
        <h1>Electricity Bill Help &amp; Guides</h1>
        <p className="legal-intro">
          Practical guides on how to check, read and understand your Pakistan electricity bill
          online, with tips for LESCO, IESCO, MEPCO and every other DISCO.
        </p>

        <div className="blog-list">
          {ARTICLES.map((a) => (
            <a key={a.slug} className="blog-card" href={`/blog/${a.slug}`}>
              <h2>{a.title}</h2>
              <span className="blog-meta">{formatDate(a.publishedDate)}</span>
              <p>{a.metaDescription}</p>
              <span className="blog-more">Read guide →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
