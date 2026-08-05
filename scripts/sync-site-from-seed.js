/**
 * Update SiteContent (key: main) from canonical seed — does NOT delete other collections.
 * Use for live DB when `npm run seed` (full wipe) is too destructive.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const SiteContent = require("../src/models/SiteContent");
const { siteContentDoc } = require("../src/seed/seedData");

async function main() {
  await connectDB();
  const siteDoc = siteContentDoc();
  const result = await SiteContent.findOneAndUpdate(
    { key: "main" },
    { $set: siteDoc },
    { upsert: true, new: true },
  );
  console.log(
    "SiteContent synced:",
    result.key,
    "| designTools:",
    result.designTools?.length ?? 0,
    "| localeFlags.en:",
    result.localeFlags?.en || "(default)",
    "| vision.icon:",
    result.vision?.icon || "(default)",
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
