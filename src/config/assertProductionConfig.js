/**
 * Production startup checks — fail fast when required secrets/URLs are missing.
 */
function isProduction() {
  return process.env.NODE_ENV === "production";
}

function splitList(name) {
  return (process.env[name] || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isLocalOrigin(value) {
  try {
    const u = new URL(value.includes("://") ? value : `https://${value}`);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function assertProductionConfig() {
  if (!isProduction()) return;

  const errors = [];

  if (!process.env.MONGODB_URI?.trim()) {
    errors.push("MONGODB_URI is required in production.");
  }

  const clientOrigins = splitList("CLIENT_URL");
  const hasPublicOrigin = clientOrigins.some((o) => !isLocalOrigin(o));
  if (!hasPublicOrigin) {
    errors.push(
      "CLIENT_URL must include at least one public frontend origin (not localhost), e.g. https://varsoviadesign.com",
    );
  }

  if (errors.length > 0) {
    console.error("[Varsovia API] Invalid production configuration:\n", errors.map((e) => `  - ${e}`).join("\n"));
    process.exit(1);
  }
}

module.exports = { assertProductionConfig };
