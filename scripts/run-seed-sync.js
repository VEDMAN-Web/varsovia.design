require("dotenv").config();
const connectDB = require("../src/config/db");
const { syncCanonicalSeed, migrateProjectCategories, migrateProjectFilterMetadata } =
  require("../src/seed/seedIfEmpty");
const mongoose = require("mongoose");

(async () => {
  await connectDB();
  await syncCanonicalSeed();
  await migrateProjectCategories();
  await migrateProjectFilterMetadata();
  await mongoose.disconnect();
  console.log("Canonical seed sync finished.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
