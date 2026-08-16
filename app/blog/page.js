import { getAllPosts } from "../../lib/posts";
import { authorFor } from "../../lib/authors";
import { SITE_URL, buildMeta } from "../../lib/seo";
import { BylineCompact } from "../Byline";

// Static + revalidated on demand: /api/posts calls revalidatePath("/blog")
// when a new post is published, so the index picks it up without a redeploy.
export const dynamic = "force-static";

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

export default async function BlogIndex() {
  const posts = await getAllPosts();
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
          {posts.map((a) => (
            // An <article> rather than a wrapping <a>: the card carries two real
            // links (the guide and its author), which cannot legally nest inside
            // a single anchor.
            <article key={a.slug} className="blog-card">
              <h2><a href={`/blog/${a.slug}`}>{a.title}</a></h2>
              <BylineCompact
                author={authorFor(a)}
                publishedDate={a.publishedDate}
                lastUpdated={a.lastUpdated}
                linked
              />
              <p>{a.metaDescription}</p>
              <a className="blog-more" href={`/blog/${a.slug}`}>Read guide →</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
