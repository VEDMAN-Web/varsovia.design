import fs from "node:fs";
import path from "node:path";

const src = path.join("node_modules", "maplibre-gl", "dist");
const dest = path.join("public", "maplibre");
const files = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];

fs.mkdirSync(dest, { recursive: true });
for (const file of files) {
  fs.copyFileSync(path.join(src, file), path.join(dest, file));
}
