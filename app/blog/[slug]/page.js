import { notFound } from "next/navigation";
import { formatDate } from "../../../lib/articles";
import { getAllPosts, getPost } from "../../../lib/posts";
import { SITE_URL, OG_IMAGE, buildMeta } from "../../../lib/seo";
import { TARIFF_BY_KEY } from "../../../lib/tariffs";
import TariffTable from "../../TariffTable";
import SponsoredAd from "../../SponsoredAd";

// dynamicParams + force-static: slugs published via /api/posts after the build
// are rendered on first request and cached (the API revalidates their path).
export const dynamicParams = true;
export const dynamic = "force-static";

// Render an article's HTML, swapping inline sentinels for React components a real
// node can't live inside an HTML string):
//   <!-- tariff:KEY -->            -> <TariffTable> for that dataset
//   <!-- sponsored -->             -> <SponsoredAd> (rotating house creative)
//   <!-- sponsored:/images/x.png --> -> <SponsoredAd src="/images/x.png">
// Posts with no explicit sponsored slot get ONE disclosed ad auto-injected right
// after the intro (before the first <h2>), so every guide carries a labeled slot.
function renderBody(html) {
  let src = html;
  if (!src.includes("<!-- sponsored")) {
    const idx = src.indexOf("<h2");
    if (idx !== -1) src = src.slice(0, idx) + "<!-- sponsored -->\n" + src.slice(idx);
  }

  const parts = [];
  const re = /<!--\s*(?:tariff:(\w+)|sponsored(?::(\S+))?)\s*-->/g;
  let last = 0, m, i = 0;
  while ((m = re.exec(src))) {
    const before = src.slice(last, m.index);
    if (before.trim()) parts.push(<div key={`h${i}`} dangerouslySetInnerHTML={{ __html: before }} />);
    if (m[1]) {
      const data = TARIFF_BY_KEY[m[1]];
      if (data) parts.push(<TariffTable key={`t${i}`} data={data} />);
    } else {
      // No explicit src -> the slot picks a random creative on the client.
      parts.push(<SponsoredAd key={`s${i}`} src={m[2]} />);
    }
    last = m.index + m[0].length;
    i++;
  }
  const rest = src.slice(last);
  if (rest.trim()) parts.push(<div key={`h${i}`} dangerouslySetInnerHTML={{ __html: rest }} />);
  return parts;
}

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

  const pageUrl = `${SITE_URL}/blog/${a.slug}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.metaDescription,
    datePublished: a.publishedDate,
    dateModified: a.lastUpdated || a.publishedDate,
    image: a.coverImage || `${SITE_URL}${OG_IMAGE.url}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    author: { "@type": "Organization", name: "eBill Pakistan", url: `${SITE_URL}/` },
    publisher: {
      "@type": "Organization",
      name: "eBill Pakistan",
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

      <div className="container legal-inner">
        <nav aria-label="Breadcrumb" className="crumb">
          <a href="/">Home</a> <span>/</span> <a href="/blog">Blog</a> <span>/</span> <span aria-current="page">{a.title}</span>
        </nav>
        <h1 lang={a.lang} dir={a.dir}>{a.h1}</h1>
        <p className="blog-meta">
          Published {formatDate(a.publishedDate)}
          {a.lastUpdated && a.lastUpdated !== a.publishedDate && (
            <> &nbsp;·&nbsp; Updated {formatDate(a.lastUpdated)}</>
          )}
        </p>

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

        <div className="blog-cta">
          <p>Ready to check your electricity bill? It takes about ten seconds, free and with no sign-up.</p>
          <a className="btn btn-primary" href="/">Check your bill now</a>
        </div>

        <p className="legal-note"><a href="/blog">← Back to all guides</a></p>
      </div>
    </section>
  );
}
