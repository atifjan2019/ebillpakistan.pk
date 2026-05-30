import { notFound } from "next/navigation";
import { ARTICLES, getArticle, formatDate } from "../../../lib/articles";
import { SITE_URL, OG_IMAGE } from "../../../lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  const url = `/blog/${a.slug}`;
  return {
    title: a.metaTitle,
    description: a.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: "eBill Pakistan",
      url,
      title: a.metaTitle,
      description: a.metaDescription,
      publishedTime: a.publishedDate,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: a.metaTitle, description: a.metaDescription, images: [OG_IMAGE.url] },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const pageUrl = `${SITE_URL}/blog/${a.slug}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.metaDescription,
    datePublished: a.publishedDate,
    dateModified: a.publishedDate,
    image: `${SITE_URL}${OG_IMAGE.url}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    author: { "@type": "Organization", name: "eBill Pakistan", url: `${SITE_URL}/` },
    publisher: {
      "@type": "Organization",
      name: "eBill Pakistan",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: a.title, item: pageUrl },
    ],
  };

  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="container legal-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <a href="/blog">Blog</a> <span>/</span> <span aria-current="page">{a.title}</span>
        </nav>
        <h1>{a.h1}</h1>
        <p className="blog-meta">Published {formatDate(a.publishedDate)}</p>

        <article className="prose" dangerouslySetInnerHTML={{ __html: a.content }} />

        <div className="blog-cta">
          <p>Ready to check your electricity bill? It takes about ten seconds, free and with no sign-up.</p>
          <a className="btn btn-primary" href="/">Check your bill now</a>
        </div>

        <p className="legal-note"><a href="/blog">← Back to all guides</a></p>
      </div>
    </section>
  );
}
