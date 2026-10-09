// The content agent: researches one topic a day with Claude and web search,
// writes a full guide, and hands it to the review queue (lib/drafts.js) or,
// when BLOG_AUTOPUBLISH=true, straight to the blog.
//
// Server-only. Two model calls per article:
//   1. research  - Claude + web_search picks a topic the site does not cover
//                  yet and writes a sourced brief (facts, figures, URLs, dates).
//   2. write     - Claude turns the brief into the article as structured JSON,
//                  so every field the post store needs is validated up front.
//
// Env: ANTHROPIC_API_KEY (required), ANTHROPIC_WORKSPACE_ID (only for an
// organisation-level key), BLOG_AGENT_MODEL (default claude-opus-5-5),
// BLOG_AUTOPUBLISH ("false" holds posts for review instead of publishing), CRON_SECRET (cron auth).
import Anthropic from "@anthropic-ai/sdk";
import { jsonSchemaOutputFormat } from "@anthropic-ai/sdk/helpers/json-schema";
import { revalidatePath } from "next/cache";
import { ARTICLES } from "./articles";
import { getAllPosts, getPost, savePost } from "./posts";
import { getDrafts, saveDraft, logRun, getRunState, setRunState, clearRunState } from "./drafts";
import { buildPost, slugify } from "./publishPost";
import { DEFAULT_AUTHOR } from "./authors";
import { DISCOS } from "./discos";
import { slugFor } from "./companies";
import { TOPIC_BANK } from "./topicBank";
import { SEARCH_DEMAND, SEARCH_DEMAND_EXPORTED } from "./searchDemand";

export const MODEL = process.env.BLOG_AGENT_MODEL || "claude-opus-5-5";
export const agentConfigured = () => !!process.env.ANTHROPIC_API_KEY;
// Posts go live as soon as they are written. Set BLOG_AUTOPUBLISH=false to
// hold them in the admin review queue instead.
export const autoPublish = () => !/^(0|false|no|off)$/i.test(process.env.BLOG_AUTOPUBLISH || "");

// Prices per million tokens, for the cost line in the admin log. Approximate.
const PRICES = {
  "claude-opus-5-5": [4, 20],
  "claude-sonnet-5-5": [2, 10],
  "claude-haiku-5-5": [0.1, 0.5],
};
const WEB_SEARCH_PER_CALL = 0.01;

const MIN_WORDS = 900;
const MAX_SEARCHES = 6;

// Today in Pakistan, as YYYY-MM-DD.
export const todayPk = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

const longDate = () =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", day: "numeric", month: "long", year: "numeric" }).format(new Date());

let _client;
function client() {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not set.");
  // An organisation-level key (one not created inside a workspace) must say
  // which workspace to bill; ANTHROPIC_WORKSPACE_ID supplies it. A key created
  // inside a workspace needs nothing extra.
  const workspace = process.env.ANTHROPIC_WORKSPACE_ID?.trim();
  return (_client ||= new Anthropic({
    maxRetries: 2,
    timeout: 240_000,
    ...(workspace ? { defaultHeaders: { "anthropic-workspace-id": workspace } } : {}),
  }));
}

const wordCount = (s) => String(s || "").split(/\s+/).filter(Boolean).length;

// ---------------------------------------------------------------------------
// Context the prompts need: what already exists, what may be linked.
// ---------------------------------------------------------------------------
async function siteContext() {
  const posts = await getAllPosts();
  const drafts = await getDrafts();
  const covered = [
    ...posts.map((p) => `- ${p.title} (/blog/${p.slug})`),
    ...drafts.map((d) => `- ${d.title} (draft, not yet published)`),
  ];
  const internal = [
    "/ (the bill checker: paste a reference number, see the current bill)",
    "/electricity-tariff (current NEPRA domestic tariff, slab by slab)",
    "/sample-bill-explained (an annotated bill, every field explained)",
    ...Object.keys(DISCOS).map((c) => `/${slugFor(c)} (${DISCOS[c][0]} bill checker and company page)`),
    ...posts.map((p) => `/blog/${p.slug} (${p.title})`),
  ];
  return { posts, drafts, covered, internal };
}

// ---------------------------------------------------------------------------
// Step 1: research
// ---------------------------------------------------------------------------
const RESEARCH_SYSTEM = `You are the researcher for eBill Pakistan (ebillpakistan.pk), a free site where Pakistani electricity consumers check their bill and learn how it is calculated. Readers are ordinary households and small businesses on LESCO, IESCO, MEPCO, FESCO, GEPCO, HESCO, PESCO, QESCO, SEPCO, TESCO, HAZECO, K-Electric and the AJK board.

Your job today: choose ONE article topic the site does not cover yet, research it with web search, and write a brief a writer can turn into an accurate, useful guide.

Source hierarchy, strict: NEPRA (nepra.org.pk) notifications and decisions; the distribution companies' own sites and PITC (bill.pitc.com.pk); Government of Pakistan and Power Division; then Dawn, The Express Tribune, Business Recorder, The News, Profit. Treat random blogs, content farms and AI-written sites as unreliable: do not take figures from them.

How to choose the topic:
1. First search for what happened in Pakistan's power sector in the last 30 days: NEPRA tariff decisions, fuel charge adjustments (FCA) and quarterly adjustments (QTA), subsidy or relief announcements, new scams, DISCO notices, load shedding, net metering changes. A timely topic with real reader demand beats an evergreen one, as long as it is not already covered.
2. If nothing timely is both new and uncovered, choose from the topic bank or the Search Console queries the topic with the clearest demand that the site does not yet answer.
3. Never choose a topic that overlaps an existing post. Rewording an existing post is a failure.

The brief must contain only facts you found in sources during this session, each with its URL and the date of the source. If a figure cannot be verified, say so in the brief instead of guessing. Give rupee figures with their effective dates. Note anything the writer must not claim.`;

function researchPrompt(ctx) {
  return `Today is ${longDate()}.

Already published or drafted on the site (do not duplicate any of these):
${ctx.covered.join("\n")}

Topic bank (evergreen ideas not yet written; a title and the reader's real question):
${TOPIC_BANK.map(([t, q]) => `- ${t}: ${q}`).join("\n")}

What readers already search for when this site appears in Google (Search Console, last three months to ${SEARCH_DEMAND_EXPORTED}; query, impressions, average position). A topic that fully answers one of these queries, or a cluster of them, is worth more than one nobody searches for. Queries that are just a company name ("pesco", "hesco") are served by the existing company pages, so look for the question behind the query instead. Misspellings ("lesko bal", "casco bill") tell you how people type; "ebilling gb" is Gilgit-Baltistan, which the site does not cover at all.
${SEARCH_DEMAND.map(([q, i, p]) => `- ${q} (${i} impressions, position ${p})`).join("\n")}

Use web search (at most ${MAX_SEARCHES} searches), then reply with a research brief in this layout, in plain text:

TOPIC: one line
WHY NOW / WHY THIS: two or three sentences
READER QUESTION: the exact question the reader is trying to answer
SEARCH INTENT: what they want to walk away able to do
KEY FACTS: a numbered list; every item ends with (source: URL, date)
FIGURES AND DATES: rupee amounts, unit thresholds, percentages, effective dates, each with a source
PROCEDURE (if any): step-by-step as the official source describes it
COMMON MISTAKES OR SCAMS: anything readers get wrong
DO NOT CLAIM: things that could not be verified or that changed recently
SUGGESTED INTERNAL LINKS: 3 to 6 paths from this list that genuinely relate:
${ctx.internal.join("\n")}
SOURCES: every URL used, one per line, as "Title - URL"`;
}

async function research(ctx) {
  const c = client();
  const messages = [{ role: "user", content: researchPrompt(ctx) }];
  const tools = [
    {
      type: "web_search_20260209",
      name: "web_search",
      max_uses: MAX_SEARCHES,
    },
  ];
  const usage = { input: 0, output: 0, searches: 0 };
  let message;
  // A long server-tool turn can stop with pause_turn; push it back and continue.
  for (let i = 0; i < 6; i++) {
    message = await c.messages
      .stream({
        model: MODEL,
        max_tokens: 16000,
        // Caches the prefix, so a pause_turn continuation re-reads the search
        // results from cache instead of paying for them again.
        cache_control: { type: "ephemeral" },
        system: RESEARCH_SYSTEM,
        messages,
        tools,
        output_config: { effort: "medium" },
      })
      .finalMessage();
    usage.input += (message.usage.input_tokens || 0) + (message.usage.cache_creation_input_tokens || 0);
    usage.cached = (usage.cached || 0) + (message.usage.cache_read_input_tokens || 0);
    usage.output += message.usage.output_tokens || 0;
    usage.searches += message.usage.server_tool_use?.web_search_requests || 0;
    if (message.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: message.content });
  }
  if (message.stop_reason === "refusal") {
    throw new Error(`The model declined the research step (${message.stop_details?.category || "refusal"}).`);
  }
  if (message.stop_reason === "max_tokens") throw new Error("The research step ran out of output tokens.");

  const text = message.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
  if (!text.includes("TOPIC:")) throw new Error("The research step returned no brief.");

  // Cited pages, from the citations attached to the text blocks.
  const sources = new Map();
  for (const b of message.content) {
    if (b.type !== "text") continue;
    for (const cit of b.citations || []) {
      if (cit.url && !sources.has(cit.url)) sources.set(cit.url, cit.title || cit.url);
    }
  }
  return { brief: text, sources: [...sources].map(([url, title]) => ({ url, title })), usage };
}

// ---------------------------------------------------------------------------
// Step 2: write
// ---------------------------------------------------------------------------
const WRITER_SYSTEM = `You write guides for eBill Pakistan (ebillpakistan.pk). The reader is a Pakistani electricity consumer who wants a straight answer. The site's editorial policy promises that every figure is sourced, so you work only from the research brief you are given: no number, date, fee, rule or office that is not in the brief.

Voice: plain British English, specific, calm, no hype. Short paragraphs. Say "you". Use rupees as "Rs 1,234". Give dates with figures ("as of September 2026"). Where the brief says something could not be verified, tell the reader to check their own bill or the official source rather than asserting it.

Never write: "In today's fast-paced world", "In conclusion", "It is important to note", "Let's dive in", "game-changer", "navigate", "delve", "unlock", "comprehensive guide", or any sentence that could open any article on any subject. No emoji. No exclamation marks. Do not mention that you are an AI or that this was researched.

Structure, in Markdown:
- Open with two or three sentences that answer the reader's question directly.
- Then "##" sections in the order a reader needs them. Use "###" for sub-steps. Use numbered lists for procedures and a Markdown table when comparing figures.
- 1,200 to 1,800 words of body. Every section must carry information from the brief; cut a section rather than pad it.
- Link 3 to 6 of the allowed internal paths inline, in Markdown, where they genuinely help. Never link to external sites in the body; sources are listed separately.
- If the article discusses domestic unit rates, you may put the line "<!-- tariff:nepra -->" on its own line where a live tariff table should appear (it renders the current NEPRA table); say "the table below" when you do.
- Finish with a short "## What to do next" section with concrete steps, one of which may be checking the bill on the homepage.

Output the article as JSON matching the schema you are given. The slug is lowercase words joined by hyphens, 4 to 8 words, no year unless the topic is year-specific. The meta description is a single sentence of at most 150 characters that states what the reader will learn. Four to six FAQs, each answer two to four sentences, no answer repeating the body word for word.`;

const ARTICLE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string", description: "Page title, 45 to 70 characters, the reader's question or its answer." },
    slug: { type: "string", description: "lowercase-words-joined-by-hyphens" },
    metaTitle: { type: "string", description: "At most 65 characters; may equal the title." },
    metaDescription: { type: "string", description: "One sentence, at most 150 characters." },
    excerpt: { type: "string", description: "Two sentences for the blog index card." },
    tags: { type: "array", items: { type: "string" }, description: "2 to 5 short lowercase tags." },
    contentMarkdown: { type: "string", description: "The article body in Markdown, without the title." },
    faqs: {
      type: "array",
      items: {
        type: "object",
        properties: { question: { type: "string" }, answer: { type: "string" } },
        required: ["question", "answer"],
        additionalProperties: false,
      },
    },
    sources: {
      type: "array",
      items: {
        type: "object",
        properties: { title: { type: "string" }, url: { type: "string" } },
        required: ["title", "url"],
        additionalProperties: false,
      },
      description: "Every source from the brief that the article relies on.",
    },
  },
  required: ["title", "slug", "metaTitle", "metaDescription", "excerpt", "tags", "contentMarkdown", "faqs", "sources"],
  additionalProperties: false,
};

async function write(ctx, researched) {
  const c = client();
  const fmt = jsonSchemaOutputFormat(ARTICLE_SCHEMA);
  const user = `Today is ${longDate()}.

Allowed internal link paths:
${ctx.internal.join("\n")}

Research brief:
${researched.brief}

Pages the researcher cited (use these as the sources list):
${researched.sources.map((s) => `- ${s.title} - ${s.url}`).join("\n") || "(none captured; use the SOURCES section of the brief)"}

Write the article now.`;

  const message = await c.messages
    .stream({
      model: MODEL,
      max_tokens: 32000,
      system: WRITER_SYSTEM,
      messages: [{ role: "user", content: user }],
      output_config: { effort: "medium", format: { type: fmt.type, schema: fmt.schema } },
    })
    .finalMessage();
  const usage = { input: message.usage.input_tokens || 0, output: message.usage.output_tokens || 0 };
  if (message.stop_reason === "refusal") {
    throw new Error(`The model declined the writing step (${message.stop_details?.category || "refusal"}).`);
  }
  if (message.stop_reason === "max_tokens") throw new Error("The writing step ran out of output tokens.");
  const text = message.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  let article;
  try {
    article = JSON.parse(text);
  } catch {
    throw new Error("The writing step did not return valid JSON.");
  }
  return { article, usage };
}

// ---------------------------------------------------------------------------
// Turn the model's article into a post the store accepts.
// ---------------------------------------------------------------------------
const clip = (s, n) => {
  const t = String(s || "").trim();
  if (t.length <= n) return t;
  const cut = t.slice(0, n - 1);
  const sp = cut.lastIndexOf(" ");
  return `${sp > n * 0.6 ? cut.slice(0, sp) : cut}…`;
};

async function uniqueSlug(base) {
  let slug = slugify(base) || "electricity-guide";
  const taken = async (s) => !!(await getPost(s)) || ARTICLES.some((a) => a.slug === s) || (await getDrafts()).some((d) => d.slug === s);
  let n = 2;
  while (await taken(slug)) slug = `${slugify(base).slice(0, 90)}-${n++}`;
  return slug;
}

async function toPost(article, researched) {
  const words = wordCount(article.contentMarkdown);
  if (words < MIN_WORDS) throw new Error(`The article is too short (${words} words; at least ${MIN_WORDS} needed).`);

  const sources = (article.sources || []).filter((s) => /^https?:\/\//.test(s.url));
  const sourceList = sources.length ? sources : researched.sources;
  const body =
    `${article.contentMarkdown.trim()}\n\n` +
    (sourceList.length
      ? `## Sources\n\n${sourceList.map((s) => `- [${s.title || s.url}](${s.url})`).join("\n")}\n`
      : "");

  const faqs = (article.faqs || [])
    .filter((f) => f?.question?.trim() && f?.answer?.trim())
    .slice(0, 8)
    .map((f) => [f.question.trim(), f.answer.trim()]);

  const slug = await uniqueSlug(article.slug || article.title);
  const { errors, post } = buildPost({
    title: clip(article.title, 120),
    slug,
    metaTitle: clip(article.metaTitle || article.title, 70),
    metaDescription: clip(article.metaDescription, 160),
    content: body,
    excerpt: article.excerpt,
    tags: article.tags,
    faqs,
    author: DEFAULT_AUTHOR,
  });
  if (errors.length) throw new Error(`The article failed validation: ${errors.join("; ")}`);
  return { post, words, sources: sourceList };
}

function costOf(model, research, writing) {
  const [inP, outP] = PRICES[model] || PRICES["claude-opus-5-5"];
  const input = research.input + writing.input;
  const cached = research.cached || 0;
  const output = research.output + writing.output;
  return {
    inputTokens: input,
    cachedTokens: cached,
    outputTokens: output,
    searches: research.searches,
    usd: Number(((input * inP + cached * inP * 0.05 + output * outP) / 1e6 + research.searches * WEB_SEARCH_PER_CALL).toFixed(3)),
  };
}

// ---------------------------------------------------------------------------
// The run, in two stages so each fits inside one serverless invocation:
//   research  - pick the topic, search, save the brief
//   write     - turn the saved brief into a post, then queue or publish it
// The cron calls them an hour apart; "all" does both in one go (the admin
// button) and falls back to resuming a saved brief if the writing step was
// cut off last time.
// ---------------------------------------------------------------------------
const STATE_KEY = "current";
const STALE_MS = 8 * 60 * 1000;

const unfinished = (state) => !!state?.brief && state.status !== "done";
const inProgress = (state) => state?.status === "running" && Date.now() - Date.parse(state.startedAt) < STALE_MS;

export async function runContentAgent({ trigger = "cron", stage = "all", force = false } = {}) {
  const day = todayPk();
  const started = Date.now();
  const seconds = () => Math.round((Date.now() - started) / 1000);
  if (!agentConfigured()) {
    return await logRun({ day, trigger, stage, status: "skipped", error: "ANTHROPIC_API_KEY is not set." });
  }

  const state = (await getRunState(STATE_KEY)) || null;
  if (inProgress(state) && !force) {
    return { day, trigger, stage, status: "skipped", error: "A run is already in progress." };
  }
  if (state?.status === "done" && state.day === day && !force && stage !== "write") {
    return { day, trigger, stage, status: "skipped", error: `Already wrote today's post (${state.slug}).` };
  }

  const ctx = await siteContext();
  const base = { day, trigger, status: "running", startedAt: new Date().toISOString() };
  try {
    // ---- research ----
    let researched = null;
    if (unfinished(state) && (stage === "write" || (stage === "all" && state.day === day))) {
      // A brief is waiting: write it rather than researching again.
      researched = { brief: state.brief, sources: state.sources || [], usage: state.usage || { input: 0, output: 0, searches: 0 } };
    } else if (stage === "write") {
      return await logRun({ day, trigger, stage, status: "skipped", error: "Nothing to write: no research brief is waiting." });
    } else {
      await setRunState(STATE_KEY, { ...base, stage: "research" });
      researched = await research(ctx);
      await setRunState(STATE_KEY, { ...base, status: "researched", stage: "write", brief: researched.brief, sources: researched.sources, usage: researched.usage });
      if (stage === "research") {
        const topic = (researched.brief.match(/TOPIC:\s*(.+)/) || [])[1]?.trim() || "";
        return await logRun({ day, trigger, stage, status: "researched", topic, searches: researched.usage.searches, seconds: seconds() });
      }
    }
    const topic = (researched.brief.match(/TOPIC:\s*(.+)/) || [])[1]?.trim() || "";

    // ---- write ----
    await setRunState(STATE_KEY, { ...base, stage: "write", brief: researched.brief, sources: researched.sources, usage: researched.usage });
    const { article, usage: writeUsage } = await write(ctx, researched);
    const { post, words, sources } = await toPost(article, researched);
    const cost = costOf(MODEL, researched.usage, writeUsage);
    const meta = {
      generatedAt: new Date().toISOString(),
      model: MODEL,
      trigger,
      topic,
      words,
      cost,
      brief: researched.brief,
      sources,
    };

    let status;
    if (autoPublish()) {
      await savePost({ ...post, agent: { ...meta, brief: undefined } });
      revalidatePath("/blog");
      revalidatePath(`/blog/${post.slug}`);
      revalidatePath(`/author/${post.author}`);
      revalidatePath("/sitemap.xml");
      status = "published";
    } else {
      await saveDraft({ ...post, ...meta });
      status = "drafted";
    }
    await setRunState(STATE_KEY, { day, status: "done", slug: post.slug, finishedAt: new Date().toISOString() });
    return await logRun({ day, trigger, stage, status, slug: post.slug, title: post.title, topic, words, cost, seconds: seconds() });
  } catch (err) {
    const error = err instanceof Anthropic.APIError ? `Claude API ${err.status}: ${err.message}` : err.message || String(err);
    // Keep a finished brief for the next attempt; drop anything else.
    const keep = (await getRunState(STATE_KEY)) || {};
    if (keep.brief) await setRunState(STATE_KEY, { ...keep, status: "failed", error });
    else await clearRunState(STATE_KEY);
    return await logRun({ day, trigger, stage, status: "failed", error, seconds: seconds() });
  }
}

// What the admin shows: whether the agent can run, and the live state.
export async function agentStatus() {
  const state = await getRunState(STATE_KEY);
  return {
    configured: agentConfigured(),
    model: MODEL,
    autoPublish: autoPublish(),
    cronSecret: !!process.env.CRON_SECRET,
    state,
  };
}
