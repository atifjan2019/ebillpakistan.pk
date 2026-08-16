// Named human authors. Pure data (safe to import client-side), mirroring the
// shape of lib/companies.js.
//
// Authorship is resolved at RENDER time via authorFor(), not baked into each
// post object, because posts come from two sources: static objects in
// lib/articles.js and API-published posts stored in Upstash KV (lib/posts.js).
// A KV post written before the `author` field existed still gets a byline this
// way, and a post can override the default by setting `author: "<slug>"`.

export const DEFAULT_AUTHOR = "atif-jan";

export const AUTHORS = {
  "atif-jan": {
    slug: "atif-jan",
    name: "Atif Jan",
    role: "Founder & Editor, eBill Pakistan",
    // Drop a square headshot at public/images/authors/atif-jan.jpg and set this
    // to "/images/authors/atif-jan.jpg". While null, <AuthorAvatar> renders an
    // initials monogram instead of a broken image.
    photo: null,
    location: "Charsadda, Khyber Pakhtunkhwa",
    email: "support@ebillpakistan.pk",
    // 100-150 words. Every claim here is either verifiable from the site itself
    // or marked {{VERIFY}} — nothing about a real person is invented.
    bio:
      "Atif Jan is the founder and editor of eBill Pakistan, the free bill-lookup " +
      "tool at ebillpakistan.pk that covers all twelve of Pakistan's electricity " +
      "distribution companies. He built the site after {{VERIFY: one sentence on what " +
      "prompted Atif to build eBill Pakistan}}, and has since written and edited its " +
      "library of guides on reading a bill line by line, understanding NEPRA's slab " +
      "tariff, spotting fake subsidy links, and getting a wrong meter reading fixed. " +
      "His background is in {{VERIFY: Atif Jan's professional background, e.g. software " +
      "engineering — one short phrase}}, and he works from Charsadda in Khyber " +
      "Pakhtunkhwa. Every tariff figure and helpline number published here is checked " +
      "against a NEPRA notification or the distribution company's own official website " +
      "before it goes live; where a figure cannot be verified, this site says so rather " +
      "than guessing.",
    // Optional profile links used for Person.sameAs in JSON-LD. Add real
    // profiles only — an empty list is better than an invented one.
    sameAs: [],
  },
};

export const getAuthor = (slug) => AUTHORS[slug] || null;

// The author of a post, falling back to the site's default editor so that
// KV-published posts (which may predate the `author` field) still get a byline.
export const authorFor = (post) =>
  AUTHORS[post?.author] || AUTHORS[DEFAULT_AUTHOR];

export const AUTHOR_SLUGS = Object.keys(AUTHORS);

// Initials for the avatar monogram fallback ("Atif Jan" -> "AJ").
export const initialsOf = (name) =>
  String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
