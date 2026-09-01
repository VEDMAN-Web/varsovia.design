const Product = require("../models/Product");
const Project = require("../models/Project");
const Testimonial = require("../models/Testimonial");
const Catalogue = require("../models/Catalogue");
const Partner = require("../models/Partner");
const Showroom = require("../models/Showroom");
const Showcase = require("../models/Showcase");
const SiteContent = require("../models/SiteContent");
const Blog = require("../models/Blog");
const TeamMember = require("../models/TeamMember");
const FAQ = require("../models/FAQ");
const CoreStrength = require("../models/CoreStrength");
const {
  siteContentDoc,
  productsDocs,
  projectsDocs,
  partnersDocs,
  coreStrengthsDocs,
  testimonialsDocs,
  cataloguesDocs,
  blogsDocs,
  teamDocs,
  faqsDocs,
  showroomsDocs,
  showcasesDocs,
} = require("./seedData");

async function replaceAll(Model, docs) {
  // Startup repair must never replace a non-empty collection: one missing
  // seed record must not erase unrelated CMS edits.
  if ((await Model.countDocuments()) > 0) return;
  if (docs.length > 0) await Model.insertMany(docs);
}

/** Keep Mongo in sync with canonical site content (safe to run on every API boot). */
async function syncCanonicalSeed() {
  const site = siteContentDoc();
  const { key, ...siteFields } = site;
  // Use $setOnInsert so seed data is only written when the document is first created.
  // If a document with key "main" already exists (admin has saved CMS content), this
  // is a no-op and the admin's edits are preserved.
  await SiteContent.findOneAndUpdate(
    { key: "main" },
    { $setOnInsert: { key: "main", ...siteFields } },
    { upsert: true },
  );

  await replaceAll(Partner, partnersDocs());
  await replaceAll(CoreStrength, coreStrengthsDocs());
  await replaceAll(Testimonial, testimonialsDocs());
  await replaceAll(Catalogue, cataloguesDocs());
  await replaceAll(TeamMember, teamDocs());
  await replaceAll(FAQ, faqsDocs());
  await replaceAll(Showroom, showroomsDocs());
  await replaceAll(Showcase, showcasesDocs());

  for (const doc of productsDocs()) {
    const { slug, ...rest } = doc;
    await Product.findOneAndUpdate(
      { slug },
      { $setOnInsert: { slug, ...rest } },
      { upsert: true },
    );
  }

  for (const doc of projectsDocs()) {
    const { slug, ...rest } = doc;
    await Project.findOneAndUpdate(
      { slug },
      { $setOnInsert: { slug, ...rest } },
      { upsert: true },
    );
  }

  for (const doc of blogsDocs()) {
    await Blog.findOneAndUpdate(
      { title: doc.title },
      { $setOnInsert: doc },
      { upsert: true },
    );
  }

  console.log("Canonical seed sync complete");
}

module.exports = syncCanonicalSeed;
