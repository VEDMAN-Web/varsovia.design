/**
 * Verify that all Varsovia pages have complete seeded data.
 * Checks: Products, Projects, Blogs, FAQs, Teams, Showcases, Showrooms, SiteContent, Catalogues
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");

const Product = require("../src/models/Product");
const Project = require("../src/models/Project");
const Blog = require("../src/models/Blog");
const FAQ = require("../src/models/FAQ");
const TeamMember = require("../src/models/TeamMember");
const Showcase = require("../src/models/Showcase");
const Showroom = require("../src/models/Showroom");
const SiteContent = require("../src/models/SiteContent");
const Catalogue = require("../src/models/Catalogue");
const Partner = require("../src/models/Partner");
const CoreStrength = require("../src/models/CoreStrength");
const Testimonial = require("../src/models/Testimonial");

async function verify() {
  await connectDB();
  console.log("\n📋 VARSOVIA DESIGN — DATA VERIFICATION REPORT\n");
  console.log("=" .repeat(70));

  try {
    // Check SiteContent
    console.log("\n🏠 SITE CONTENT");
    const siteContent = await SiteContent.findOne({ key: "main" });
    if (siteContent) {
      const hasAbout = !!siteContent.aboutText && siteContent.aboutText.length > 50;
      const hasQualitySale = !!siteContent.qualitySale?.heroTitle;
      const hasPages = siteContent.pages && Object.keys(siteContent.pages).length > 0;
      const hasIaPages = siteContent.pages && Object.keys(siteContent.pages).length > 0;
      
      console.log(`  ✓ About section: ${hasAbout ? "✅ COMPLETE" : "❌ MISSING"}`);
      console.log(`  ✓ Quality & After-Sales section: ${hasQualitySale ? "✅ COMPLETE" : "❌ MISSING"}`);
      console.log(`  ✓ IA Pages (Furniture, Interior, Services, etc.): ${hasIaPages ? "✅ COMPLETE" : "❌ MISSING"}`);
      if (hasIaPages && siteContent.pages) {
        const iaKeys = Object.keys(siteContent.pages);
        iaKeys.forEach((key) => {
          const page = siteContent.pages[key];
          const hasHero = !!page.hero?.title;
          const hasChildren = Array.isArray(page.children) && page.children.length > 0;
          console.log(`    - ${key}: ${hasHero ? "✅" : "❌"} hero, ${hasChildren ? `✅ ${page.children.length} children` : "❌ no children"}`);
        });
      }
    } else {
      console.log("  ❌ SiteContent NOT FOUND");
    }

    // Check Products
    console.log("\n📦 PRODUCTS");
    const productCount = await Product.countDocuments();
    const products = await Product.find().limit(5);
    const furnnitureProducts = await Product.countDocuments({ category: "Furniture" });
    const kitchenProducts = await Product.countDocuments({ category: "Kitchen" });
    const bedroomProducts = await Product.countDocuments({ category: "Bedroom" });
    console.log(`  ✓ Total products: ${productCount} ${productCount > 0 ? "✅" : "❌"}`);
    console.log(`  ✓ Furniture category: ${furnnitureProducts} ${furnnitureProducts > 0 ? "✅" : "❌"}`);
    console.log(`  ✓ Kitchen category: ${kitchenProducts} ${kitchenProducts > 0 ? "✅" : "❌"}`);
    console.log(`  ✓ Bedroom category: ${bedroomProducts} ${bedroomProducts > 0 ? "✅" : "❌"}`);
    products.forEach((p, i) => {
      const hasGallery = Array.isArray(p.gallery) && p.gallery.length > 0;
      console.log(`    ${i + 1}. ${p.title} - ${hasGallery ? "✅ gallery" : "❌ no gallery"}`);
    });

    // Check Projects
    console.log("\n🏢 PROJECTS");
    const projectCount = await Project.countDocuments();
    const projects = await Project.find().limit(3);
    console.log(`  ✓ Total projects: ${projectCount} ${projectCount > 0 ? "✅" : "❌"}`);
    projects.forEach((p, i) => {
      const hasGallery = Array.isArray(p.gallery) && p.gallery.length > 0;
      console.log(`    ${i + 1}. ${p.title} - ${hasGallery ? "✅ gallery" : "❌ no gallery"}`);
    });

    // Check Blogs
    console.log("\n📝 BLOGS / JOURNAL");
    const blogCount = await Blog.countDocuments();
    const blogs = await Blog.find().limit(3);
    console.log(`  ✓ Total blogs: ${blogCount} ${blogCount > 0 ? "✅" : "❌"}`);
    blogs.forEach((b, i) => {
      console.log(`    ${i + 1}. ${b.title}`);
    });

    // Check FAQs
    console.log("\n❓ FAQs");
    const faqCount = await FAQ.countDocuments();
    console.log(`  ✓ Total FAQs: ${faqCount} ${faqCount > 0 ? "✅" : "❌"}`);
    const faqsByCategory = await FAQ.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    faqsByCategory.forEach((cat) => {
      console.log(`    - ${cat._id}: ${cat.count} items`);
    });

    // Check Team Members
    console.log("\n👥 TEAM");
    const teamCount = await TeamMember.countDocuments();
    console.log(`  ✓ Total team members: ${teamCount} ${teamCount > 0 ? "✅" : "❌"}`);
    const teamByType = await TeamMember.aggregate([
      { $group: { _id: "$teamType", count: { $sum: 1 } } },
    ]);
    teamByType.forEach((type) => {
      console.log(`    - ${type._id}: ${type.count} members`);
    });

    // Check Showrooms / Locations
    console.log("\n📍 LOCATIONS / SHOWROOMS");
    const showroomCount = await Showroom.countDocuments();
    const showrooms = await Showroom.find();
    console.log(`  ✓ Total showrooms: ${showroomCount} ${showroomCount > 0 ? "✅" : "❌"}`);
    showrooms.forEach((s) => {
      console.log(`    - ${s.name} (${s.location})`);
    });

    // Check Showcases
    console.log("\n🎨 SHOWCASES");
    const showcaseCount = await Showcase.countDocuments();
    const showcasesByCategory = await Showcase.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    console.log(`  ✓ Total showcases: ${showcaseCount} ${showcaseCount > 0 ? "✅" : "❌"}`);
    showcasesByCategory.forEach((cat) => {
      console.log(`    - ${cat._id}: ${cat.count} items`);
    });

    // Check Catalogues
    console.log("\n📚 CATALOGUES");
    const catalogueCount = await Catalogue.countDocuments();
    const catalogues = await Catalogue.find();
    console.log(`  ✓ Total catalogues: ${catalogueCount} ${catalogueCount > 0 ? "✅" : "❌"}`);
    catalogues.forEach((c) => {
      console.log(`    - ${c.title}`);
    });

    // Check Partners
    console.log("\n🤝 PARTNERS");
    const partnerCount = await Partner.countDocuments();
    console.log(`  ✓ Total partners: ${partnerCount} ${partnerCount > 0 ? "✅" : "❌"}`);

    // Check CoreStrengths
    console.log("\n💪 CORE STRENGTHS");
    const coreCount = await CoreStrength.countDocuments();
    console.log(`  ✓ Total core strengths: ${coreCount} ${coreCount > 0 ? "✅" : "❌"}`);

    // Check Testimonials
    console.log("\n⭐ TESTIMONIALS");
    const testimonialCount = await Testimonial.countDocuments();
    console.log(`  ✓ Total testimonials: ${testimonialCount} ${testimonialCount > 0 ? "✅" : "❌"}`);

    // Summary
    console.log("\n" + "=".repeat(70));
    const allCounts = {
      products: productCount,
      projects: projectCount,
      blogs: blogCount,
      faqs: faqCount,
      teamMembers: teamCount,
      showrooms: showroomCount,
      showcases: showcaseCount,
      catalogues: catalogueCount,
      partners: partnerCount,
      coreStrengths: coreCount,
      testimonials: testimonialCount,
    };

    const totalRecords = Object.values(allCounts).reduce((a, b) => a + b, 0);
    const allHaveData = Object.values(allCounts).every((count) => count > 0);

    console.log(`\n✨ TOTAL SEEDED RECORDS: ${totalRecords}`);
    if (allHaveData && siteContent && productCount > 0) {
      console.log("✅ ALL PAGES HAVE COMPLETE DATA!\n");
    } else {
      console.log("⚠️  SOME PAGES ARE MISSING DATA\n");
    }

  } catch (err) {
    console.error("❌ Verification error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
