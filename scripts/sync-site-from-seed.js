/**
 * Update SiteContent (key: main) from seed defaults — does NOT delete other collections.
 * Use for live DB when npm run seed (full wipe) is too destructive.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const SiteContent = require("../src/models/SiteContent");

const LOCAL = {
  hero: "/home/home-front-page.png",
  about1: "/home/about-1.png",
  about2: "/home/about-2.png",
  about3: "/home/about-3.png",
  stats: "/home/counting.png",
  project5: "/home/featured-project/feature-5.jpg",
  contact1: "/home/featured-project/feature-1.jpg",
  contact2: "/home/about-1.png",
  contact3: "/home/featured-project/feature-3.jpg",
  contact4: "/home/featured-project/feature-4.jpg",
  project7: "/home/featured-project/feature-7.png",
};

const siteDoc = {
  key: "main",
  heroEyebrow: "VARSOVIA DESIGN",
  heroHeadline: "CHOOSE FROM A RANGE OF HIGH-QUALITY MODULAR KITCHENS.",
  heroSubtitle: "",
  heroImage: LOCAL.hero,
  heroPrimaryCtaLabel: "Explore Kitchens",
  heroPrimaryCtaHref: "#products",
  heroSecondaryCtaLabel: "Free Consultation",
  heroSecondaryCtaHref: "#contact",
  aboutTitle: "ABOUT VARSOVIA",
  aboutText:
    "Varsovia started in a rented one-room studio in Warsaw's Praga district, with a simple belief: a beautiful room only earns that word once someone has lived in it for a year and still loves it.",
  aboutImages: [LOCAL.about1, LOCAL.about2, LOCAL.about3, LOCAL.project5],
  stats: [
    { value: "+12", label: "Years Experience" },
    { value: "+140", label: "Projects Completed" },
    { value: "+6", label: "Cities Served" },
  ],
  statsImage: LOCAL.stats,
  aboutIntro:
    "At Varsovia Design, we believe every space tells a story. We specialize in creating elegant, functional, and personalized interiors that reflect your lifestyle.",
  aboutStory:
    "Founded with a passion for thoughtful design and exceptional craftsmanship, Varsovia Design has grown into a trusted name in premium interior solutions.",
  aboutHeroSubtitle: "TWELVE YEARS OF ROOMS BUILT TO LAST",
  vision: {
    title: "Our Vision",
    text: "To become a leading interior design brand known for creating inspiring spaces that enrich everyday living through innovation, quality, and timeless design.",
  },
  mission: {
    title: "Our Mission",
    text: "To deliver personalized interior solutions with exceptional craftsmanship, premium materials, and a seamless customer experience from concept to completion.",
  },
  values: {
    title: "Our Values",
    text: "Great interiors begin with quality, creativity, trust, and innovation. We design and craft spaces tailored to your lifestyle.",
  },
  processSteps: [
    { step: "01", title: "Consultation", text: "Understanding your lifestyle, needs, and design preferences." },
    { step: "02", title: "Planning & Design", text: "Creating layouts, concepts, material selections, and realistic 3D visualizations." },
    { step: "03", title: "Execution", text: "Expert craftsmanship, timely delivery, and professional installation." },
  ],
  contactImages: [LOCAL.contact1, LOCAL.contact2, LOCAL.contact3, LOCAL.contact4, LOCAL.project5, LOCAL.about2, LOCAL.project7],
  footerBio:
    "Varsovia Kitchen designs and builds premium modular kitchens with precision, warmth, and lasting quality.",
  phone: "+66 64 683 9777",
  email: "hi@thailandkitchens.com",
  address: "Route 4169, Mae Nam, Amphoe Ko Samui, Surat Thani 84330",
};

async function main() {
  await connectDB();
  const result = await SiteContent.findOneAndUpdate({ key: "main" }, { $set: siteDoc }, { upsert: true, new: true });
  console.log("SiteContent synced:", result.key, result.phone, result.email);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
