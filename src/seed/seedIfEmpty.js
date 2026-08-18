const Project = require("../models/Project");
const SiteContent = require("../models/SiteContent");
const CoreStrength = require("../models/CoreStrength");
const Partner = require("../models/Partner");
const Product = require("../models/Product");
const syncCanonicalSeed = require("./syncCanonicalSeed");
const { projectsDocs } = require("./seedData");

const PROJECT_FILTER_KEYS = [
  "subcategory",
  "shape",
  "style",
  "color",
  "material",
  "finish",
  "isNew",
];

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

/** Backfill interior detail copy from canonical seed (detailTitle, intro, slider body). */
const INTERIOR_DETAIL_KEYS = ["detailTitle", "detailDescription", "narrativeOne", "narrativeTwo"];

async function migrateProjectInteriorDetail() {
  for (const doc of projectsDocs()) {
    if (!doc.slug) continue;
    const patch = {};
    for (const key of INTERIOR_DETAIL_KEYS) {
      const val = doc[key];
      if (val === undefined || val === null || val === "") continue;
      patch[key] = val;
    }
    if (Object.keys(patch).length === 0) continue;
    const result = await Project.updateOne({ slug: doc.slug }, { $set: patch });
    if (result.matchedCount > 0) {
      console.log(`Interior detail fields updated: ${doc.slug}`);
    }
  }
}

/** Backfill filter metadata on canonical seed slugs when fields are still empty. */
async function migrateProjectFilterMetadata() {
  for (const doc of projectsDocs()) {
    if (!doc.slug) continue;
    const existing = await Project.findOne({ slug: doc.slug }).lean();
    if (!existing) continue;
    const patch = {};
    for (const key of PROJECT_FILTER_KEYS) {
      if (doc[key] === undefined) continue;
      const cur = existing[key];
      const empty =
        cur === undefined ||
        cur === null ||
        cur === "";
      if (empty) patch[key] = doc[key];
    }
    if (Object.keys(patch).length === 0) continue;
    await Project.updateOne({ slug: doc.slug }, { $set: patch });
  }
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

async function migrateInquiryForm() {
  const { DEFAULT_INQUIRY_FORM } = require("../validation/inquiryForm");
  const site = await SiteContent.findOne({ key: "main" }).select("inquiryForm").lean();
  if (!site?.inquiryForm?.fields?.length) {
    await SiteContent.updateOne(
      { key: "main" },
      { $set: { inquiryForm: DEFAULT_INQUIRY_FORM } },
      { upsert: true },
    );
  }
}

async function migrateMainNavigation() {
  const { DEFAULT_MAIN_NAVIGATION } = require("../validation/mainNavigation");
  const site = await SiteContent.findOne({ key: "main" }).select("mainNavigation").lean();
  if (!site?.mainNavigation?.items?.length) {
    await SiteContent.updateOne(
      { key: "main" },
      { $set: { mainNavigation: DEFAULT_MAIN_NAVIGATION } },
      { upsert: true },
    );
  }
}

async function migratePageCmsDefaults() {
  const { PAGE_CMS_DEFAULTS } = require("../data/pageCmsDefaults");
  const keys = Object.keys(PAGE_CMS_DEFAULTS);
  const site = await SiteContent.findOne({ key: "main" }).select(keys.join(" ")).lean();
  const patch = {};
  for (const [key, value] of Object.entries(PAGE_CMS_DEFAULTS)) {
    if (!site?.[key] || typeof site[key] !== "object") patch[key] = value;
  }
  if (Object.keys(patch).length) {
    await SiteContent.updateOne({ key: "main" }, { $set: patch }, { upsert: true });
  }
}

async function migrateFooterNavigation() {
  const { DEFAULT_FOOTER_NAVIGATION } = require("../validation/footerNavigation");
  const site = await SiteContent.findOne({ key: "main" }).select("footerNavigation").lean();
  if (!site?.footerNavigation?.linkColumns?.length) {
    await SiteContent.updateOne(
      { key: "main" },
      { $set: { footerNavigation: DEFAULT_FOOTER_NAVIGATION } },
      { upsert: true },
    );
  }
}

async function migratePartnerLogos() {
  const { partnersDocs } = require("./seedData");
  const byName = new Map(
    partnersDocs().map((row) => [String(row.name).trim().toLowerCase(), row.logo]),
  );
  const byOrder = new Map(partnersDocs().map((row) => [Number(row.order), row.logo]));
  const rows = await Partner.find().select("name logo order").lean();
  for (const row of rows) {
    const logo = String(row.logo || "");
    const stale = /\/partners\/figma\//i.test(logo) || /\/partners\/[^/]+\.png$/i.test(logo);
    if (!stale) continue;
    const name = String(row.name?.en || row.name || "").trim().toLowerCase();
    const next = byName.get(name) || byOrder.get(Number(row.order)) || "";
    if (!next || next === logo) continue;
    await Partner.updateOne({ _id: row._id }, { $set: { logo: next } });
    console.log(`Partner logo migrated: ${name || row._id} -> ${next}`);
  }
}

async function seedIfEmpty() {
  await migrateProjectCategories();
  await migrateProjectFilterMetadata();
  await migrateProjectInteriorDetail();
  await migrateInquiryForm();
  await migrateMainNavigation();
  await migrateFooterNavigation();
  await migratePageCmsDefaults();
  await migratePartnerLogos();

  if (await needsCanonicalSync()) {
    console.log("Applying canonical seed (empty or incomplete data detected)...");
    await syncCanonicalSeed();
    await migrateProjectCategories();
    await migrateProjectFilterMetadata();
    await migrateProjectInteriorDetail();
    await migratePartnerLogos();
    return;
  }

  console.log("Database already seeded");
}

module.exports = seedIfEmpty;
module.exports.syncCanonicalSeed = syncCanonicalSeed;
module.exports.migrateProjectCategories = migrateProjectCategories;
module.exports.migrateProjectFilterMetadata = migrateProjectFilterMetadata;
module.exports.migrateProjectInteriorDetail = migrateProjectInteriorDetail;
module.exports.migratePartnerLogos = migratePartnerLogos;
