/**
 * Production build check — syntax + module load (no DB connection).
 * Mirrors `npm run build` on the frontend for CI/Render.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const srcRoot = path.join(__dirname, "..", "src");

function collectJsFiles(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) collectJsFiles(full, out);
    else if (full.endsWith(".js")) out.push(full);
  }
  return out;
}

for (const file of collectJsFiles(srcRoot)) {
  execSync(`node --check "${file}"`, { stdio: "inherit" });
}

// Load route graph without calling start() / connectDB()
require(path.join(srcRoot, "routes", "api"));
require(path.join(srcRoot, "controllers", "apiController"));
require(path.join(srcRoot, "middleware", "validate"));

console.log("Backend build verification passed.");
