const mongoose = require("mongoose");
const dns = require("dns");

async function connectDB() {
  // Override DNS servers to Google & Cloudflare DNS to avoid querySrv ETIMEOUT issues
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
  } catch (err) {
    console.warn("Failed to configure DNS fallback:", err.message);
  }

  // Strip __v (Mongoose version key) from all documents globally
  mongoose.set("toJSON", { versionKey: false });
  mongoose.set("toObject", { versionKey: false });

  let uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGODB_URI is required in production.");
    }
    uri = "mongodb://127.0.0.1:27017/varsovia";
  }
  const maskedUri = uri.replace(/:([^@:]+)@/, ":*****@");
  console.log(`Connecting to database at ${maskedUri}...`);
  await mongoose.connect(uri);
  console.log("Database successfully connected to MongoDB Atlas!");
}

module.exports = connectDB;
