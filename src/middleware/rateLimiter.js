const rateLimit = require("express-rate-limit");

/**
 * Global limiter — all routes.
 * 150 requests per 15 minutes per IP (public site traffic).
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

/**
 * Admin limiter — all admin write routes (POST/PUT/PATCH/DELETE).
 * 60 requests per 15 minutes per IP.
 * Prevents a leaked key from being used to spam-create documents.
 */
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many admin requests, please slow down." },
});

/**
 * Contact form limiter — POST /api/contact only.
 * 5 submissions per hour per IP.
 */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many contact form submissions. Please try again in an hour." },
});

module.exports = { globalLimiter, adminLimiter, contactLimiter };
