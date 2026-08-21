require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const { assertProductionConfig } = require("./config/assertProductionConfig");
const { sendError } = require("./utils/apiResponse");
const apiRoutes = require("./routes/api");
const seedIfEmpty = require("./seed/seedIfEmpty");
const { globalLimiter } = require("./middleware/rateLimiter");
const { allowedOrigins, corsOriginCallback } = require("./config/corsOrigins");

const app = express();
const PORT = process.env.PORT || 5000;

// Required behind Render/Railway/Vercel proxy — otherwise rate limits apply to one shared IP
app.set("trust proxy", 1);

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// ─── Serve static files from frontend/public for admin previews ──────────────
const publicPath = path.join(__dirname, "..", "..", "frontend", "public");
app.use(express.static(publicPath, {
  setHeaders: (res) => {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=31536000, immutable'
    });
  }
}));

// ─── Prevent any caching of API responses ─────────────────────────────────────
app.use("/api", (req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
  });
  next();
});

// ─── Strict CORS ──────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  console.log(`[CORS] Allowed origins: ${allowedOrigins.join(", ") || "(none — set CLIENT_URL)"}`);
}

app.use(
  cors({
    origin: corsOriginCallback,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Admin-Key", "Accept-Language", "Accept"],
    credentials: true,
  }),
);

// ─── Body parser ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "50mb" }));

// ─── Health check (no rate limit) ─────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", brand: "Varsovia Kitchen" });
});

// ─── Global rate limiter (API routes only) ────────────────────────────────────
app.use("/api", globalLimiter);

// ─── API routes ───────────────────────────────────────────────────────────────
app.use("/api", apiRoutes);

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  if (err.message && err.message.startsWith("CORS:")) {
    return sendError(res, 403, { message: err.message });
  }
  console.error("Unhandled error:", err);
  return sendError(res, 500, { message: "Internal server error." });
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
let server;

async function start() {
  try {
    assertProductionConfig();
    await connectDB();
    await seedIfEmpty();

    server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Varsovia API running on http://0.0.0.0:${PORT}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Stop the other process and retry.`);
      } else {
        console.error("Server error:", error.message);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

function shutdown(signal) {
  if (!server) {
    process.exit(0);
    return;
  }
  console.log(`${signal} received — closing server...`);
  server.close(() => {
    process.exit(0);
  });
  // Force exit if connections hang (nodemon restart)
  setTimeout(() => process.exit(0), 1000).unref();
}

// Nodemon restart: release port before the new process starts
process.once("SIGUSR2", () => {
  if (!server) {
    process.kill(process.pid, "SIGUSR2");
    return;
  }
  server.close(() => {
    process.kill(process.pid, "SIGUSR2");
  });
});

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start();
