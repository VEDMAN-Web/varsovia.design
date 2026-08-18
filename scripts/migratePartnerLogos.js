require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const { migratePartnerLogos } = require("../src/seed/seedIfEmpty");

(async () => {
  await connectDB();
  await migratePartnerLogos();
  await mongoose.disconnect();
  console.log("Partner logo migration finished.");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
