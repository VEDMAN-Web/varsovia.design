require("dotenv").config();
const dns = require("dns");
try {
  const servers = dns.getServers();
  if (!servers.includes("8.8.8.8")) dns.setServers(["8.8.8.8", "1.1.1.1", ...servers]);
} catch {
  /* ignore */
}
const path = require("path");
const mongoose = require("mongoose");
const SiteContent = require(path.join(__dirname, "../src/models/SiteContent"));

const teamPage = {
  heroTitle: "Our Team",
  heroSubtitle: "THE CREATIVE MINDS BEHIND EVERY BEAUTIFUL SPACE",
  intro:
    "We have 3 sales teams respectively serving retail customers, commercial project contractors and franchisers. Inside each team, different sales representatives are responsible for different countries and regions. We are experts in our respective fields in order to meet different type customers' needs. 3 sales teams come together in a collaborative effort to provide an excellent experience for our customer.",
  designTitle: "Professional Design Team",
  designEyebrow: "Italian design team",
  designBody:
    "Varsovia Design collaborates with Italian designers and suppliers to enhance our global competency. We combine updated aesthetics with functionality to create exciting spaces tailored to our clients' wishes and bring lasting living pleasure.",
  architectTitle: "Architect / Engineers",
  architectEyebrow: "Technical & structural team",
  architectBody:
    "Our architect and engineering team ensures structural integrity, precise technical drawings, and seamless coordination between design intent and on-site execution.",
  toolsTitle: "Professional design tool",
  toolsBody:
    "Professional design tools are adopted to assist for perfect art effect, including CAXA, CAD, 3D MAX, KD MAX, etc.",
  stats: [
    { value: "100+", label: "Successful Projects Completed" },
    { value: "03", label: "Years of Excellence in Interior Solutions" },
  ],
};

(async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Missing MONGODB_URI / MONGO_URI");
  await mongoose.connect(uri);
  const r = await SiteContent.findOneAndUpdate(
    { key: "main" },
    { $set: { teamPage } },
    { new: true },
  );
  console.log("OK heroTitle=", r?.teamPage?.heroTitle);
  console.log("OK stats=", r?.teamPage?.stats?.length);
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
