const rateLimit = require("express-rate-limit");

function envInt(name, fallback) {
  const n = parseInt(process.env[name] || "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Global limiter — all /api routes.
 * Default: 1000 requests per 15 minutes per IP.
 * On Render/Railway, trust proxy must be enabled (see index.js) so each client IP is counted correctly.
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: envInt("RATE_LIMIT_GLOBAL_MAX", 1000),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/health",
  message: { message: "Too many requests, please try again later." },
});

/**
 * Admin limiter — all admin write routes (POST/PUT/PATCH/DELETE).
 * Default: 200 requests per 15 minutes per IP.
 */
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: envInt("RATE_LIMIT_ADMIN_MAX", 200),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many admin requests, please slow down." },
});

/**
 * Contact form limiter — POST /api/contact only.
 * Default: 20 submissions per hour per IP (allows retries / multi-step testing).
 */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: envInt("RATE_LIMIT_CONTACT_MAX", 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many contact form submissions. Please try again later." },
});

module.exports = { globalLimiter, adminLimiter, contactLimiter };
