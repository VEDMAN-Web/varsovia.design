/**
 * Allowed browser origins for CORS (CLIENT_URL + optional extras).
 * Origins are normalized (no trailing slash).
 */

function normalizeOrigin(value) {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    return `${url.protocol}//${url.host}`;
  } catch {
    return trimmed.replace(/\/+$/, "");
  }
}

function splitEnvList(name, fallback = "") {
  return (process.env[name] || fallback)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function expandWwwAliases(origins) {
  const set = new Set(origins);
  for (const o of origins) {
    try {
      const u = new URL(o);
      const port = u.port ? `:${u.port}` : "";
      if (u.hostname.startsWith("www.")) {
        set.add(`${u.protocol}//${u.hostname.slice(4)}${port}`);
      } else if (!u.hostname.includes("localhost") && !u.hostname.includes("127.0.0.1")) {
        set.add(`${u.protocol}//www.${u.hostname}${port}`);
      }
    } catch {
      /* ignore */
    }
  }
  return [...set];
}

function buildAllowedOrigins() {
  const set = new Set();

  for (const raw of splitEnvList("CLIENT_URL", "http://localhost:3000")) {
    const o = normalizeOrigin(raw);
    if (o) set.add(o);
  }

  for (const name of ["FRONTEND_URL", "SITE_URL", "NEXT_PUBLIC_SITE_URL"]) {
    for (const raw of splitEnvList(name)) {
      const o = normalizeOrigin(raw);
      if (o) set.add(o);
    }
  }

  for (const raw of splitEnvList("CORS_EXTRA_ORIGINS")) {
    const o = normalizeOrigin(raw);
    if (o) set.add(o);
  }

  if (process.env.NODE_ENV !== "production") {
    set.add("http://localhost:3000");
    set.add("http://127.0.0.1:3000");
  }

  return expandWwwAliases([...set]);
}

function buildOriginPatterns() {
  const patterns = [];
  for (const raw of splitEnvList("CORS_ORIGIN_PATTERNS")) {
    try {
      patterns.push(new RegExp(raw));
    } catch {
      console.warn(`[CORS] Ignoring invalid CORS_ORIGIN_PATTERNS entry: ${raw}`);
    }
  }
  if (process.env.CORS_ALLOW_VERCEL_PREVIEWS === "true") {
    patterns.push(/^https:\/\/[\w-]+--[\w-]+\.vercel\.app$/);
    patterns.push(/^https:\/\/[\w-]+\.vercel\.app$/);
  }
  return patterns;
}

const allowedOrigins = buildAllowedOrigins();
const originPatterns = buildOriginPatterns();

function isOriginAllowed(origin) {
  if (!origin) return true;
  const normalized = normalizeOrigin(origin);
  if (!normalized) return false;
  if (allowedOrigins.includes(normalized)) return true;
  return originPatterns.some((re) => re.test(normalized));
}

function corsOriginCallback(origin, callback) {
  if (isOriginAllowed(origin)) {
    return callback(null, true);
  }
  console.warn(`[CORS] Blocked origin: ${origin} (allowed: ${allowedOrigins.join(", ")})`);
  return callback(new Error(`CORS: origin '${origin}' not allowed.`));
}

module.exports = {
  allowedOrigins,
  corsOriginCallback,
  isOriginAllowed,
  normalizeOrigin,
};
