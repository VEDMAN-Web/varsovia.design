require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const { sendError } = require("./utils/apiResponse");
const apiRoutes = require("./routes/api");
const seedIfEmpty = require("./seed/seedIfEmpty");
const { globalLimiter } = require("./middleware/rateLimiter");

const app = express();
const PORT = process.env.PORT || 5000;

// Required behind Render/Railway/Vercel proxy — otherwise rate limits apply to one shared IP
app.set("trust proxy", 1);

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── Strict CORS ──────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server / curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed.`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Admin-Key", "Accept-Language"],
    credentials: true,
  })
);

// ─── Body parser ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "2mb" }));

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

