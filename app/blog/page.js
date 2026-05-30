import { ARTICLES, formatDate } from "../../lib/articles";

export const metadata = {
  title: "Electricity Bill Help & Guides | eBill Pakistan",
  description:
    "Guides on how to check, read and understand your Pakistan electricity bill online. Tips for LESCO, IESCO, MEPCO and all major DISCOs.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    siteName: "eBill Pakistan",
    url: "/blog",
    title: "Electricity Bill Help & Guides | eBill Pakistan",
    description:
      "Guides on how to check, read and understand your Pakistan electricity bill online. Tips for LESCO, IESCO, MEPCO and all major DISCOs.",
  },
};

export default function BlogIndex() {
  return (
    <section className="legal-page">
      <div className="container legal-inner">
        <div className="crumb">
          <a href="/">Home</a> <span>/</span> <span>Blog</span>
        </div>
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
