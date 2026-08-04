/**
 * Push canonical interior detail copy (detailTitle, detailDescription, narrativeOne)
 * onto existing projects by slug — safe for live DB (no wipe).
 */
require("dotenv").config();
const connectDB = require("../src/config/db");
const {
  migrateProjectCategories,
  migrateProjectFilterMetadata,
  migrateProjectInteriorDetail,
} = require("../src/seed/seedIfEmpty");
const mongoose = require("mongoose");

(async () => {
  await connectDB();
  await migrateProjectCategories();
  await migrateProjectFilterMetadata();
  await migrateProjectInteriorDetail();
  await mongoose.disconnect();
  console.log("Interior detail migration finished.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
