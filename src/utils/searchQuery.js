const { LOCALES, resolveLocalized } = require("./locale");

const MIN_QUERY_LEN = 2;
const MAX_QUERY_LEN = 80;

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeQuery(raw) {
  if (raw == null) return "";
  return String(raw).trim().slice(0, MAX_QUERY_LEN);
}

function isValidSearchQuery(q) {
  return q.length >= MIN_QUERY_LEN;
}

/** Mongo $or conditions for Mixed localized fields + legacy plain strings */
function localizedSearchOr(fields, locale, escapedPattern) {
  const conditions = [];
  const regex = { $regex: escapedPattern, $options: "i" };

  for (const field of fields) {
    conditions.push({ [field]: regex });
    for (const loc of LOCALES) {
      conditions.push({ [`${field}.${loc}`]: regex });
    }
  }

  return { $or: conditions };
}

function stripHtml(text) {
  return String(text)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, max = 120) {
  const s = String(text || "").trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).trim()}…`;
}

function scoreText(text, queryLower) {
  const t = String(text || "").toLowerCase();
  if (!t || !queryLower) return 0;
  if (t === queryLower) return 100;
  if (t.startsWith(queryLower)) return 80;
  if (t.includes(queryLower)) return 55;
  return 0;
}

function scoreHit(title, snippet, queryLower) {
  const titleScore = scoreText(title, queryLower);
  const snippetScore = scoreText(snippet, queryLower);
  return Math.max(titleScore, snippetScore * 0.85);
}

/** Ranked score with type boost and FAQ demotion for answer-only matches */
function scoreSearchHit(type, title, snippet, queryLower, meta) {
  let titleScore = scoreText(title, queryLower);
  const snippetScore = scoreText(snippet, queryLower);
  const metaScore = scoreText(meta, queryLower);

  const tokens = queryLower.split(/\s+/).filter((t) => t.length > 0);
  if (tokens.length > 1) {
    const titleLower = String(title || "").toLowerCase();
    if (tokens.every((tok) => titleLower.includes(tok))) {
      titleScore = Math.max(titleScore, 72);
    }
  }

  const titleBoost = {
    interior: 14,
    showcase: 11,
    product: 14,
    blog: 9,
    catalogue: 7,
    team: 7,
    faq: 0,
  };

  if (type === "faq") {
    if (titleScore > 0) return titleScore * 0.82 + snippetScore * 0.16;
    return snippetScore * 0.4;
  }

  const contentScore = Math.max(titleScore, snippetScore * 0.85, metaScore * 0.92);
  let score = contentScore;
  if (titleScore > 0 || snippetScore > 0 || metaScore > 0) {
    score += titleBoost[type] ?? 0;
  }
  return score;
}

/**
 * One row per logical result — duplicate CMS rows (same blog title, same team name)
 * collapse to the highest-scored hit.
 */
function dedupeSearchHits(hits) {
  const best = new Map();

  for (const hit of hits) {
    const titleNorm = String(hit.title || "")
      .toLowerCase()
      .trim();
    let key;
    if (hit.type === "team" || hit.type === "catalogue" || hit.type === "blog") {
      key = `${hit.type}:${titleNorm}`;
    } else {
      key = `${hit.type}:${hit.id}`;
    }

    const prev = best.get(key);
    if (!prev || hit.score > prev.score) {
      best.set(key, hit);
    }
  }

  return Array.from(best.values());
}

function pickLocalizedFields(doc, locale, fields) {
  const out = {};
  for (const field of fields) {
    out[field] = resolveLocalized(doc[field], locale);
  }
  return out;
}

module.exports = {
  MIN_QUERY_LEN,
  MAX_QUERY_LEN,
  escapeRegex,
  normalizeQuery,
  isValidSearchQuery,
  localizedSearchOr,
  stripHtml,
  truncate,
  scoreText,
  scoreHit,
  scoreSearchHit,
  dedupeSearchHits,
  pickLocalizedFields,
};
