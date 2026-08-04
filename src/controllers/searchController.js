const Blog = require("../models/Blog");
const Project = require("../models/Project");
const Showcase = require("../models/Showcase");
const Product = require("../models/Product");
const Catalogue = require("../models/Catalogue");
const TeamMember = require("../models/TeamMember");
const FAQ = require("../models/FAQ");
const { getRequestLocale } = require("../utils/locale");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const {
  escapeRegex,
  normalizeQuery,
  isValidSearchQuery,
  localizedSearchOr,
  stripHtml,
  truncate,
  scoreSearchHit,
  dedupeSearchHits,
  pickLocalizedFields,
} = require("../utils/searchQuery");

function slugifyInteriorTitle(title) {
  if (!title || typeof title !== "string") return "";
  return title
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function interiorProjectHref(doc, locale) {
  const explicit = typeof doc.slug === "string" ? doc.slug.trim() : "";
  if (explicit) return `/interior/${explicit}`;
  const loc = pickLocalizedFields(doc, locale, ["title"]);
  const fromTitle = slugifyInteriorTitle(loc.title);
  if (fromTitle) return `/interior/${fromTitle}`;
  return `/interior/${doc._id}`;
}

const PER_TYPE_CAP = 6;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 20;

function parseLimit(raw) {
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_LIMIT;
  return Math.min(n, MAX_LIMIT);
}

async function searchCollection(Model, filter, projection, limit) {
  return Model.find(filter).select(projection).sort({ order: 1, createdAt: -1 }).limit(limit).lean();
}

async function searchSite(req, res) {
  const started = Date.now();
  try {
    const locale = getRequestLocale(req);
    const q = normalizeQuery(req.query.q);
    const limit = parseLimit(req.query.limit);

    if (!isValidSearchQuery(q)) {
      return sendSuccess(
        res,
        { query: q, results: [] },
        { req, meta: { tookMs: Date.now() - started } },
      );
    }

    const pattern = escapeRegex(q);
    const queryLower = q.toLowerCase();
    const filter = (fields) => localizedSearchOr(fields, locale, pattern);

    const [projects, showcases, blogs, products, catalogues, team, faqs] = await Promise.all([
      searchCollection(
        Project,
        filter(["title", "description", "location", "category"]),
        "_id title description location category slug",
        PER_TYPE_CAP,
      ),
      searchCollection(
        Showcase,
        filter(["title", "category", "location", "typeValue", "supplyArea"]),
        "_id title category location typeValue",
        PER_TYPE_CAP,
      ),
      searchCollection(Blog, filter(["title", "excerpt"]), "_id title excerpt", PER_TYPE_CAP),
      searchCollection(
        Product,
        filter(["title", "description", "slug", "category"]),
        "_id title description slug category",
        PER_TYPE_CAP,
      ),
      searchCollection(Catalogue, filter(["title"]), "_id title", PER_TYPE_CAP),
      searchCollection(TeamMember, filter(["name", "role"]), "_id name role", PER_TYPE_CAP),
      searchCollection(FAQ, filter(["question", "answer", "category"]), "_id question answer category", PER_TYPE_CAP),
    ]);

    const hits = [];

    for (const doc of projects) {
      const loc = pickLocalizedFields(doc, locale, ["title", "description", "location", "category"]);
      const title = loc.title || "Interior project";
      const snippet = truncate(loc.description || loc.location || loc.category);
      hits.push({
        type: "interior",
        id: String(doc._id),
        title,
        snippet,
        href: interiorProjectHref(doc, locale),
        meta: loc.category || undefined,
        score: scoreSearchHit("interior", title, snippet, queryLower, loc.category),
      });
    }

    for (const doc of showcases) {
      const loc = pickLocalizedFields(doc, locale, ["title", "category", "location", "typeValue"]);
      const title = loc.title || "Showcase";
      const snippet = truncate(loc.typeValue || loc.location || loc.category);
      hits.push({
        type: "showcase",
        id: String(doc._id),
        title,
        snippet,
        href: `/showcase/${doc._id}`,
        meta: loc.category || undefined,
        score: scoreSearchHit("showcase", title, snippet, queryLower, loc.category),
      });
    }

    for (const doc of blogs) {
      const loc = pickLocalizedFields(doc, locale, ["title", "excerpt"]);
      const title = loc.title || "Blog";
      const snippet = truncate(loc.excerpt);
      hits.push({
        type: "blog",
        id: String(doc._id),
        title,
        snippet,
        href: `/blog/${doc._id}`,
        meta: "Blog",
        score: scoreSearchHit("blog", title, snippet, queryLower),
      });
    }

    for (const doc of products) {
      const loc = pickLocalizedFields(doc, locale, ["title", "description", "category"]);
      const slug = doc.slug || String(doc._id);
      const title = loc.title || "Product";
      const snippet = truncate(loc.description || loc.category);
      hits.push({
        type: "product",
        id: slug,
        title,
        snippet,
        href: loc.category
          ? `/interior?category=${encodeURIComponent(loc.category)}`
          : "/interior",
        meta: loc.category || undefined,
        score: scoreSearchHit("product", title, snippet, queryLower, loc.category),
      });
    }

    for (const doc of catalogues) {
      const loc = pickLocalizedFields(doc, locale, ["title"]);
      const title = loc.title || "Catalogue";
      hits.push({
        type: "catalogue",
        id: String(doc._id),
        title,
        snippet: truncate(title),
        href: "/catalogue",
        meta: "Catalogue",
        score: scoreSearchHit("catalogue", title, title, queryLower),
      });
    }

    for (const doc of team) {
      const loc = pickLocalizedFields(doc, locale, ["name", "role"]);
      const title = loc.name || "Team member";
      const snippet = truncate(loc.role);
      hits.push({
        type: "team",
        id: String(doc._id),
        title,
        snippet,
        href: "/team",
        meta: loc.role || undefined,
        score: scoreSearchHit("team", title, snippet, queryLower),
      });
    }

    for (const doc of faqs) {
      const loc = pickLocalizedFields(doc, locale, ["question", "answer", "category"]);
      const title = loc.question || "FAQ";
      const snippet = truncate(stripHtml(loc.answer));
      hits.push({
        type: "faq",
        id: String(doc._id),
        title,
        snippet,
        href: "/faq",
        meta: loc.category || undefined,
        score: scoreSearchHit("faq", title, snippet, queryLower),
      });
    }

    const uniqueHits = dedupeSearchHits(hits);
    uniqueHits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
    const results = uniqueHits.slice(0, limit).map(({ score: _s, ...rest }) => rest);

    return sendSuccess(
      res,
      { query: q, results },
      { req, meta: { tookMs: Date.now() - started } },
    );
  } catch (error) {
    return sendError(res, 500, { message: error.message || "Search failed." });
  }
}

module.exports = { searchSite };
