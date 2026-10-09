import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "../../../lib/posts";
import { authorFor } from "../../../lib/authors";
import { SITE_URL, OG_IMAGE, buildMeta } from "../../../lib/seo";
import { TARIFF_BY_KEY } from "../../../lib/tariffs";
import TariffTable from "../../TariffTable";
import BillImage from "../../BillImage";
import { Byline } from "../../Byline";
import { companyLinksFor, toolLinksFor } from "../../../lib/related";

// dynamicParams + force-static: slugs published via /api/posts after the build
// are rendered on first request and cached (the API revalidates their path).
export const dynamicParams = true;
export const dynamic = "force-static";

// Render an article's HTML, swapping inline sentinels for React components (a real
// node can't live inside an HTML string):
//   <!-- tariff:KEY -->     -> <TariffTable> for that dataset
//   <!-- billimage:CODE --> -> <BillImage> for that company (or nothing)
// Legacy `<!-- sponsored -->` sentinels left in older posts are matched and
// dropped so they render nothing.
function renderBody(html) {
  // Tables scroll sideways on a phone instead of breaking the layout.
  const src = html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, "</table></div>");

  const parts = [];
  const re = /<!--\s*(?:tariff:(\w+)|billimage:(\w+)|sponsored(?::\S+)?)\s*-->/g;
  let last = 0, m, i = 0;
  while ((m = re.exec(src))) {
    const before = src.slice(last, m.index);
    if (before.trim()) parts.push(<div key={`h${i}`} dangerouslySetInnerHTML={{ __html: before }} />);
    if (m[1]) {
      const data = TARIFF_BY_KEY[m[1]];
      if (data) parts.push(<TariffTable key={`t${i}`} data={data} compact />);
    }
    if (m[2]) parts.push(<BillImage key={`b${i}`} code={m[2]} />);
    last = m.index + m[0].length;
    i++;
  }
  const rest = src.slice(last);
  if (rest.trim()) parts.push(<div key={`h${i}`} dangerouslySetInnerHTML={{ __html: rest }} />);
  return parts;
}

// Reading time comes from the rendered HTML with the tags stripped.
const wordCount = (html) => String(html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

export async function generateStaticParams() {
  return (await getAllPosts()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = await getPost(slug);
  if (!a) return {};
  // twitter:image:alt + og:image:alt use the article title (FIX 5).
  const meta = buildMeta({
    title: a.metaTitle,
    description: a.metaDescription,
    path: `/blog/${a.slug}`,
    type: "article",
    imageAlt: a.title,
  });
  meta.openGraph.publishedTime = a.publishedDate;
  return meta;
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const a = await getPost(slug);
  if (!a) notFound();

  const author = authorFor(a);
  const pageUrl = `${SITE_URL}/blog/${a.slug}`;
  const companies = companyLinksFor(a);
  const tools = toolLinksFor(a);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.metaDescription,
    datePublished: a.publishedDate,
    dateModified: a.lastUpdated || a.publishedDate,
    image: a.coverImage || `${SITE_URL}${OG_IMAGE.url}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    // A named Person (not the Organization) so the byline, the author page and
    // the structured data all agree on who is accountable for this article.
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/author/${author.slug}#person`,
      name: author.name,
      url: `${SITE_URL}/author/${author.slug}`,
      jobTitle: author.role,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "eBill Pakistan",
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
    },
  };
  const faqLd = a.faqs?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: a.faqs.map(([q, ans]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: ans },
    })),
  } : null;
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
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="container legal-inner post-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <a href="/blog">Blog</a> <span>/</span> <span aria-current="page">{a.title}</span>
        </nav>
        <h1 lang={a.lang} dir={a.dir}>{a.h1}</h1>
        <Byline author={author} publishedDate={a.publishedDate} lastUpdated={a.lastUpdated} words={wordCount(a.content)} />

        <article className="prose" lang={a.lang} dir={a.dir}>{renderBody(a.content)}</article>

        {a.faqs?.length > 0 && (
          <div className="faq" style={{ marginTop: 32 }}>
            <h2>Frequently asked questions</h2>
            {a.faqs.map(([q, ans], i) => (
              <details key={i} open={i === 0}>
                <summary>{q}</summary>
                <div className="a">{ans}</div>
              </details>
            ))}
          </div>
        )}

        {(companies.length > 0 || tools.length > 0) && (
          <div className="post-related">
            {companies.length > 0 && (
              <div>
                <h2>Company pages mentioned</h2>
                <div className="post-related-row">
                  {companies.map((c) => (
                    <a key={c.code} className="post-related-chip" href={c.href}><b>{c.abbr}</b> bill check, {c.city}</a>
                  ))}
                </div>
              </div>
            )}
            {tools.length > 0 && (
              <div>
                <h2>Work it out for your own bill</h2>
                <div className="tool-links">
                  {tools.map(([href, title, text]) => (
                    <a key={href} className="tool-link" href={href}><b>{title}</b><span>{text}</span></a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="blog-cta">
          <p>Ready to check your electricity bill? It takes about ten seconds, free and with no sign-up.</p>
          <a className="btn btn-primary" href="/">Check your bill now</a>
        </div>

        <footer className="post-foot">
          <div className="post-foot-author">
            <p>
              Written by <a href={`/author/${author.slug}`} rel="author">{author.name}</a>,{" "}
              {author.role}.
            </p>
            <p>
              Figures on this page are sourced and reviewed under our{" "}
              <a href="/editorial-policy">editorial policy</a>. Spotted a mistake?{" "}
              <a href="/contact">Tell us</a>{" "}and we&apos;ll fix it.
            </p>
          </div>
          <p className="legal-note"><a href="/blog">← Back to all guides</a></p>
        </footer>
      </div>
    </section>
  );
}
