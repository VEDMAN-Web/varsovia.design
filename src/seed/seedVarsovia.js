/**
 * Varsovia Kitchen — FULL DESTRUCTIVE SEED
 * ==========================================
 * Clears every CMS collection and re-inserts the canonical seed data.
 * Also writes the full IA page tree (furniture, interior-design, locations, …)
 * into SiteContent.pages via the live API so the admin panel sees it immediately.
 *
 * Usage (local):
 *   npm run seed:varsovia
 *
 * Usage (staging — point at deployed API):
 *   API_URL=https://your-staging-api.example.com/api npm run seed:varsovia
 *
 * ⚠️  DESTRUCTIVE: every collection is wiped before re-seeding.
 *     Use `npm run seed:varsovia:safe` to upsert without wiping.
 *
 * The ADMIN_KEY env var must match the backend's ADMIN_KEY.
 */

"use strict";
require("dotenv").config();

const mongoose  = require("mongoose");
const connectDB = require("../config/db");

const SiteContent  = require("../models/SiteContent");
const Product      = require("../models/Product");
const Project      = require("../models/Project");
const Blog         = require("../models/Blog");
const TeamMember   = require("../models/TeamMember");
const FAQ          = require("../models/FAQ");
const Showcase     = require("../models/Showcase");
const Showroom     = require("../models/Showroom");
const Catalogue    = require("../models/Catalogue");
const Partner      = require("../models/Partner");
const CoreStrength = require("../models/CoreStrength");
const Testimonial  = require("../models/Testimonial");

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

const { pages: IA_PAGES } = require("../data/iaPagesSeedContent");

// ─── helpers ────────────────────────────────────────────────────────────────

function pad(n, w = 3) { return String(n).padStart(w, " "); }

function section(label, count, note = "") {
  const tick = count > 0 ? "✓" : "–";
  const extra = note ? `  (${note})` : "";
  console.log(`  ${tick}  ${pad(count)} ${label}${extra}`);
}

// ─── IA pages via API ────────────────────────────────────────────────────────

async function seedIaPages() {
  const API = (process.env.API_URL || "http://127.0.0.1:5001/api").replace(/\/$/, "");
  const KEY = process.env.ADMIN_KEY || "";

  if (!KEY) {
    console.warn("  ⚠  ADMIN_KEY not set — skipping IA pages seed via API.");
    console.warn("     Set ADMIN_KEY in .env and re-run to populate IA pages.");
    return 0;
  }

  const putRes = await fetch(`${API}/site?cms=1`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-key": KEY },
    body: JSON.stringify({ pages: IA_PAGES }),
  });

  if (!putRes.ok) {
    const body = await putRes.json().catch(() => ({}));
    throw new Error(
      `IA pages PUT failed (${putRes.status}): ${JSON.stringify(body.error || body.message || body)}`
    );
  }

  const result = await putRes.json();
  const savedPages = result?.data?.pages || {};
  return Object.keys(savedPages).length;
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║   Varsovia Kitchen — FULL SEED (destructive reset)   ║");
  console.log("╚══════════════════════════════════════════════════════╝");

  await connectDB();
  console.log();

  // ── 1. Wipe all CMS collections ─────────────────────────────────────────
  console.log("Step 1 · Clearing collections…");
  await Promise.all([
    SiteContent .deleteMany({}),
    Product     .deleteMany({}),
    Project     .deleteMany({}),
    Blog        .deleteMany({}),
    TeamMember  .deleteMany({}),
    FAQ         .deleteMany({}),
    Showcase    .deleteMany({}),
    Showroom    .deleteMany({}),
    Catalogue   .deleteMany({}),
    Partner     .deleteMany({}),
    CoreStrength.deleteMany({}),
    Testimonial .deleteMany({}),
  ]);
  console.log("  ✓  All collections cleared.");
  console.log();

  // ── 2. Insert canonical data ─────────────────────────────────────────────
  console.log("Step 2 · Inserting canonical data…");

  // SiteContent (single document)
  const siteDoc = siteContentDoc();
  await SiteContent.create(siteDoc);
  section("SiteContent (main document)", 1, "heroHeadline, stats, qualitySale, teamPage, nav, footer…");

  const [products, projects, blogs, team, faqs, showcases, showrooms, catalogues, partners, strengths, testimonials] =
    await Promise.all([
      Product     .insertMany(productsDocs()),
      Project     .insertMany(projectsDocs()),
      Blog        .insertMany(blogsDocs()),
      TeamMember  .insertMany(teamDocs()),
      FAQ         .insertMany(faqsDocs()),
      Showcase    .insertMany(showcasesDocs()),
      Showroom    .insertMany(showroomsDocs()),
      Catalogue   .insertMany(cataloguesDocs()),
      Partner     .insertMany(partnersDocs()),
      CoreStrength.insertMany(coreStrengthsDocs()),
      Testimonial .insertMany(testimonialsDocs()),
    ]);

  section("Products",      products    .length);
  section("Projects",      projects    .length);
  section("Blogs",         blogs       .length);
  section("Team members",  team        .length);
  section("FAQs",          faqs        .length);
  section("Showcases",     showcases   .length);
  section("Showrooms",     showrooms   .length);
  section("Catalogues",    catalogues  .length);
  section("Partners",      partners    .length);
  section("Core strengths",strengths   .length);
  section("Testimonials",  testimonials.length);

  const totalRecords =
    1 + products.length + projects.length + blogs.length + team.length +
    faqs.length + showcases.length + showrooms.length + catalogues.length +
    partners.length + strengths.length + testimonials.length;

  console.log();

  // ── 3. Seed IA pages via API ─────────────────────────────────────────────
  console.log("Step 3 · Seeding IA pages (furniture, locations, services…)…");
  let iaPagesCount = 0;
  try {
    iaPagesCount = await seedIaPages();
    if (iaPagesCount > 0) {
      section("IA hub pages written to SiteContent.pages", iaPagesCount);
    }
  } catch (err) {
    console.warn(`  ⚠  IA pages seed error: ${err.message}`);
    console.warn("     Run manually: node src/seed/populateIaContent.js");
  }
  console.log();

  // ── 4. Summary ──────────────────────────────────────────────────────────
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log(`║  Seeded ${String(totalRecords).padEnd(3)} records across 12 collections        ║`);
  if (iaPagesCount > 0) {
    console.log(`║  IA pages: ${String(iaPagesCount).padEnd(2)} hubs written to SiteContent.pages   ║`);
  }
  console.log("║  Status: COMPLETE ✓                                  ║");
  console.log("╚══════════════════════════════════════════════════════╝");

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err.message);
  process.exit(1);
});
