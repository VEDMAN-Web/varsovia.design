const Project = require("../models/Project");
const CoreStrength = require("../models/CoreStrength");
const Partner = require("../models/Partner");
const Product = require("../models/Product");
const syncCanonicalSeed = require("./syncCanonicalSeed");

/** Backfill category on projects seeded before this field existed */
const CATEGORY_BY_SLUG = {
  "kitchen-cabinet": "Kitchen",
  "modern-island": "Kitchen",
  "warm-walnut": "Kitchen",
  "ivory-luxe": "Bedroom",
  "graphite-studio": "Bathroom",
  "coastal-oak": "Door & Windows",
  "midnight-suite": "Whole House Solutions",
  "open-living": "Furniture",
  "amber-residence": "Kitchen",
  "skyline-apartment": "Kitchen",
};

async function migrateProjectCategories() {
  for (const [slug, category] of Object.entries(CATEGORY_BY_SLUG)) {
    await Project.updateOne({ slug }, { $set: { category } });
  }

  await Project.updateMany(
    { $or: [{ category: { $exists: false } }, { category: null }, { category: "" }] },
    { $set: { category: "Kitchen" } },
  );

  await Project.updateMany(
    { interiorCatalog: { $exists: false } },
    { $set: { interiorCatalog: true } },
  );
}

async function needsCanonicalSync() {
  if ((await Product.countDocuments()) === 0) return true;
  if ((await CoreStrength.countDocuments()) === 0) return true;
  const badPartners = await Partner.countDocuments({
    $or: [{ logo: "text" }, { logo: "" }, { logo: null }, { logo: { $exists: false } }],
  });
  if (badPartners > 0) return true;
  return false;
}

async function seedIfEmpty() {
  await migrateProjectCategories();

  if (await needsCanonicalSync()) {
    console.log("Applying canonical seed (empty or incomplete data detected)...");
    await syncCanonicalSeed();
    await migrateProjectCategories();
    return;
  }

  console.log("Database already seeded");
}

module.exports = seedIfEmpty;
module.exports.syncCanonicalSeed = syncCanonicalSeed;
module.exports.migrateProjectCategories = migrateProjectCategories;
