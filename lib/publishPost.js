// Shared post validation + normalisation.
//
// Server-only (it converts Markdown with `marked`). Both publishing paths use
// it — POST /api/posts and the admin dashboard form — so the two cannot drift.
// Before this existed the API route owned the rules privately, and adding a
// second writer would have meant a second copy of them.
//
// Nothing here writes. Callers do the storage, so each can decide its own
// duplicate-slug policy: the API refuses an existing slug (an integration
// re-posting is almost always a mistake), while the admin form allows an
// intentional overwrite, which is what makes editing a KV post possible at all.
import { marked } from "marked";
import { AUTHORS, DEFAULT_AUTHOR } from "./authors";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MAX_CONTENT = 200_000; // ~200 KB of Markdown

// "Some Title (2026)" -> "some-title-2026"
export const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

// Validate a publish payload. Returns { errors: string[], post } — `post` is
// null when errors is non-empty.
export function buildPost(input = {}) {
  const {
    title, slug, metaTitle, metaDescription, content, excerpt,
    tags, coverImage, publishedAt, updatedAt, faqs, author,
    // "markdown" (default) converts at publish time. "html" stores the body
    // verbatim — used when editing a legacy post whose original Markdown was
    // never kept, where re-running the converter over HTML would mangle it.
    contentFormat,
  } = input;
  const fmt = contentFormat === "html" ? "html" : "markdown";

  const errors = [];
  const str = (v) => (typeof v === "string" ? v.trim() : "");

  const t = str(title);
  const s = str(slug);
  const md = str(metaDescription);
  const body = typeof content === "string" ? content : "";

  if (!t) errors.push("title is required");
  if (!s) errors.push("slug is required");
  else if (!SLUG_RE.test(s)) errors.push("slug must be lowercase letters, digits and hyphens only");
  else if (s.length > 100) errors.push("slug must be 100 characters or fewer");
  if (!md) errors.push("metaDescription is required");
  else if (md.length > 160) errors.push(`metaDescription must be 160 characters or fewer (currently ${md.length})`);
  if (!body.trim()) errors.push("content is required");
  else if (body.length > MAX_CONTENT) errors.push("content exceeds the 200 KB limit");
  if (metaTitle !== undefined && metaTitle !== null && metaTitle !== "" ) {
    const mt = str(metaTitle);
    if (mt.length > 70) errors.push(`metaTitle must be 70 characters or fewer (currently ${mt.length})`);
  }
  if (excerpt !== undefined && excerpt !== null && typeof excerpt !== "string") errors.push("excerpt must be a string");
  if (coverImage) {
    if (!/^https?:\/\/\S+$/.test(String(coverImage))) errors.push("coverImage must be an http(s) URL");
  }
  if (publishedAt && Number.isNaN(Date.parse(publishedAt))) errors.push("publishedAt must be an ISO date (YYYY-MM-DD)");
  if (updatedAt && Number.isNaN(Date.parse(updatedAt))) errors.push("updatedAt must be an ISO date (YYYY-MM-DD)");
  if (author && !AUTHORS[author]) errors.push(`author must be one of: ${Object.keys(AUTHORS).join(", ")}`);

  let tagList;
  if (tags !== undefined && tags !== null && tags !== "") {
    tagList = Array.isArray(tags)
      ? tags
      : String(tags).split(",").map((x) => x.trim()).filter(Boolean);
    if (!tagList.every((x) => typeof x === "string")) errors.push("tags must be strings");
  }

  const faqList = normaliseFaqs(faqs, errors);

  if (errors.length) return { errors, post: null };

  const date = (publishedAt ? new Date(publishedAt) : new Date()).toISOString().slice(0, 10);
  const updated = (updatedAt ? new Date(updatedAt) : new Date(date)).toISOString().slice(0, 10);

  return {
    errors: [],
    post: {
      slug: s,
      title: t,
      metaTitle: str(metaTitle) || t,
      metaDescription: md,
      publishedDate: date,
      lastUpdated: updated,
      author: author || DEFAULT_AUTHOR,
      h1: t,
      // Converted at publish time so the article page renders API posts through
      // the same trusted-HTML pipeline as the static ones in lib/articles.js.
      content: fmt === "html" ? body : marked.parse(body, { async: false }),
      // The author's original input, kept so a later edit round-trips exactly
      // instead of having to reverse-engineer Markdown out of rendered HTML.
      contentSource: body,
      contentFormat: fmt,
      ...(str(excerpt) ? { excerpt: str(excerpt) } : {}),
      ...(tagList?.length ? { tags: tagList } : {}),
      ...(coverImage ? { coverImage: String(coverImage) } : {}),
      ...(faqList?.length ? { faqs: faqList } : {}),
      source: "api",
    },
  };
}

// Accepts either the API shape (array of [q, a] pairs) or the admin textarea
// shape (one "Question :: Answer" per line).
function normaliseFaqs(faqs, errors) {
  if (faqs === undefined || faqs === null || faqs === "") return undefined;

  if (typeof faqs === "string") {
    const rows = faqs
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const i = l.indexOf("::");
        if (i < 0) return null;
        return [l.slice(0, i).trim(), l.slice(i + 2).trim()];
      });
    if (rows.some((r) => !r || !r[0] || !r[1])) {
      errors.push('each FAQ line must be "Question :: Answer"');
      return undefined;
    }
    if (rows.length > 8) errors.push("at most 8 FAQs");
    return rows;
  }

  const ok =
    Array.isArray(faqs) &&
    faqs.length <= 8 &&
    faqs.every((f) => Array.isArray(f) && f.length === 2 && f.every((x) => typeof x === "string" && x.trim()));
  if (!ok) {
    errors.push("faqs must be an array (max 8) of [question, answer] string pairs");
    return undefined;
  }
  return faqs;
}
