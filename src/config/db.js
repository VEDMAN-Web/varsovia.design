const mongoose = require("mongoose");
const dns = require("dns");

async function connectDB() {
  // Override DNS servers to Google & Cloudflare DNS to avoid querySrv ETIMEOUT issues
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
  } catch (err) {
    console.warn("Failed to configure DNS fallback:", err.message);
  }

  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/varsovia";
  // Mask password for secure, production-grade logging
  const maskedUri = uri.replace(/:([^@:]+)@/, ":*****@");
  console.log(`Connecting to database at ${maskedUri}...`);
  await mongoose.connect(uri);
  console.log("Database successfully connected to MongoDB Atlas!");
}

module.exports = connectDB;
