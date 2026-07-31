require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");
const Project = require("../models/Project");
const Testimonial = require("../models/Testimonial");
const Catalogue = require("../models/Catalogue");
const Partner = require("../models/Partner");
const Showroom = require("../models/Showroom");
const Showcase = require("../models/Showcase");
const SiteContent = require("../models/SiteContent");
const Contact = require("../models/Contact");
const Blog = require("../models/Blog");
const TeamMember = require("../models/TeamMember");
const FAQ = require("../models/FAQ");
const CoreStrength = require("../models/CoreStrength");
const syncCanonicalSeed = require("./syncCanonicalSeed");

async function resetAndSeed() {
  await connectDB();
  await Promise.all([
    Product.deleteMany({}),
    Project.deleteMany({}),
    Testimonial.deleteMany({}),
    Catalogue.deleteMany({}),
    Partner.deleteMany({}),
    Showroom.deleteMany({}),
    Showcase.deleteMany({}),
    SiteContent.deleteMany({}),
    Blog.deleteMany({}),
    TeamMember.deleteMany({}),
    FAQ.deleteMany({}),
    CoreStrength.deleteMany({}),
    Contact.deleteMany({}),
  ]);
  await syncCanonicalSeed();
  await mongoose.disconnect();
  console.log("Reset + full canonical seed finished");
}

resetAndSeed().catch((err) => {
  console.error(err);
  process.exit(1);
});
