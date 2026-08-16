import { notFound } from "next/navigation";
import { AUTHOR_SLUGS, getAuthor, authorFor } from "../../../lib/authors";
import { getAllPosts } from "../../../lib/posts";
import { formatDate } from "../../../lib/articles";
import { SITE_URL, buildMeta } from "../../../lib/seo";
import { AuthorAvatar } from "../../Byline";
import Verify from "../../Verify";

// Static like the blog index; /api/posts revalidates these paths when a new post
// is published so a fresh post appears in its author's list without a redeploy.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return AUTHOR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = getAuthor(slug);
  if (!a) return {};
  return buildMeta({
    title: `${a.name} — ${a.role} | eBill Pakistan`,
    description: `Guides on Pakistani electricity billing written and edited by ${a.name}, ${a.role.toLowerCase()}. Tariffs, bill line items, DISCO complaints and subsidy scams.`,
    path: `/author/${a.slug}`,
    type: "profile",
    imageAlt: `${a.name} — eBill Pakistan`,
  });
}

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  const posts = (await getAllPosts())
    .filter((p) => authorFor(p).slug === author.slug)
    .sort((a, b) =>
      String(b.lastUpdated || b.publishedDate).localeCompare(
        String(a.lastUpdated || a.publishedDate)
      )
    );

  const pageUrl = `${SITE_URL}/author/${author.slug}`;
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${pageUrl}#person`,
    name: author.name,
    url: pageUrl,
    jobTitle: author.role,
    // The bio may still contain a {{VERIFY}} marker; strip the wrapper so the
    // structured data never ships literal template braces to Google.
    description: author.bio.replace(/\{\{VERIFY:\s*([^}]+)\}\}/g, "…"),
    email: `mailto:${author.email}`,
    ...(author.photo ? { image: `${SITE_URL}${author.photo}` } : {}),
    ...(author.sameAs?.length ? { sameAs: author.sameAs } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Charsadda",
      addressRegion: "Khyber Pakhtunkhwa",
      addressCountry: "PK",
    },
    worksFor: { "@id": `${SITE_URL}/#organization` },
    knowsAbout: [
      "Pakistani electricity billing",
      "NEPRA tariff slabs",
      "Electricity distribution companies (DISCOs)",
      "Fuel price adjustment",
      "Electricity subsidy verification",
    ],
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: author.name, item: pageUrl },
    ],
  };

  return (
    <section className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="container legal-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <a href="/blog">Blog</a> <span>/</span>{" "}
          <span aria-current="page">{author.name}</span>
        </nav>

        <header className="author-head">
          <AuthorAvatar author={author} size={96} />
          <div>
            <h1>{author.name}</h1>
            <p className="author-role">{author.role}</p>
            <p className="author-loc">{author.location}</p>
          </div>
        </header>

        <div className="prose">
          <p className="author-bio"><Verify text={author.bio} /></p>

          <h2>How {author.name.split(" ")[0]} works</h2>
          <p>
            Everything published here follows the site&apos;s{" "}
            <a href="/editorial-policy">editorial policy</a>: tariff figures come from NEPRA
            notifications or a distribution company&apos;s own announcement, helpline numbers and
            office addresses come from the company&apos;s official website, and anything that
            cannot be traced to one of those sources is left blank rather than estimated.
            eBill Pakistan is independent of PITC and of every DISCO.
          </p>
          <p>
            Spotted something wrong on a page? Email{" "}
            <a href={`mailto:${author.email}`}>{author.email}</a> or use the{" "}
            <a href="/contact">contact form</a> — corrections are made quickly and the
            &ldquo;last updated&rdquo; date on the page is bumped when they are.
          </p>
        </div>

        <h2 className="author-posts-head">
          {posts.length} {posts.length === 1 ? "guide" : "guides"} by {author.name}
        </h2>
        <div className="blog-list">
          {posts.map((p) => (
            <a key={p.slug} className="blog-card" href={`/blog/${p.slug}`}>
              <h3>{p.title}</h3>
              <span className="blog-meta">
                {formatDate(p.publishedDate)}
                {p.lastUpdated && p.lastUpdated !== p.publishedDate && (
                  <> · Updated {formatDate(p.lastUpdated)}</>
                )}
              </span>
              <p>{p.metaDescription}</p>
              <span className="blog-more">Read guide →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
