/**
 * Validates admin Site Settings section order matches the live Varsovia site.
 * Usage: node scripts/auditAdminSequence.js
 */
const { readFileSync } = require("fs");
const { join } = require("path");

const ADMIN_ROOT = join(__dirname, "../../../Thailand-Kitchen/thailand-kitchen-admin-frontend");
const siteSectionsPath = join(ADMIN_ROOT, "src/app/varsovia/siteSections.ts");
const adminShellPath = join(ADMIN_ROOT, "src/components/AdminShell.tsx");

const src = readFileSync(siteSectionsPath, "utf8");
const shell = readFileSync(adminShellPath, "utf8");

function extractSectionIds(source) {
  const ids = [];
  const re = /^\s+id: "([^"]+)"/gm;
  let m;
  while ((m = re.exec(source))) ids.push(m[1]);
  return ids;
}

function extractIaHubIds(source) {
  const ids = [];
  const re = /iaHubSection\(\s*\n?\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(source))) ids.push(m[1]);
  return ids;
}

function extractNavLabels(source) {
  const labels = [];
  const block = source.match(/const VARSOVIA_NAV[\s\S]*?^\];/m)?.[0] || "";
  const re = /label: "([^"]+)"/g;
  let m;
  while ((m = re.exec(block))) labels.push(m[1]);
  return labels;
}

const EXPECTED_HOME = [
  "hero", "about", "stats", "featured", "catalogue", "products",
  "testimonials", "coreStrengths", "partners", "contact",
];
const EXPECTED_STANDALONE = [
  "aboutPage",
  "teamPage",
  "qualitySale",
  "projectsPage",
  "faqPage",
  "cataloguePage",
  "contactPage",
  "privacyPage",
  "termsPage",
];
const EXPECTED_IA = [
  "iaFurniture", "iaInteriorDesign", "iaCompleteInteriors", "iaServices",
  "iaLocations", "iaForDevelopers", "iaJournal", "iaAboutBrand",
];
const EXPECTED_CHROME = ["brand", "navigation", "footer", "interior"];

const coreAndChromeIds = extractSectionIds(src);
const iaFromCalls = extractIaHubIds(src);
const homeIds = coreAndChromeIds.slice(0, EXPECTED_HOME.length);
const standaloneIds = coreAndChromeIds.slice(EXPECTED_HOME.length, EXPECTED_HOME.length + EXPECTED_STANDALONE.length);
const chromeIds = coreAndChromeIds.slice(-EXPECTED_CHROME.length);
const iaIds = iaFromCalls;
const allIds = [...homeIds, ...standaloneIds, ...iaIds, ...chromeIds];

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

check("Home sections order", JSON.stringify(homeIds) === JSON.stringify(EXPECTED_HOME));
check("Standalone pages order", JSON.stringify(standaloneIds) === JSON.stringify(EXPECTED_STANDALONE), standaloneIds.join(","));
check("IA hubs order", JSON.stringify(iaIds) === JSON.stringify(EXPECTED_IA), iaIds.join(","));
check("Chrome sections last", JSON.stringify(chromeIds) === JSON.stringify(EXPECTED_CHROME), chromeIds.join(","));
check("Section count", allIds.length === 31, `got ${allIds.length}`);
check("No duplicate section ids", allIds.length === new Set(allIds).size);

const aboutBlock = src.match(/id: "aboutPage"[\s\S]*?id: "teamPage"/)?.[0] || "";
check("About page: hero subtitle before intro", aboutBlock.indexOf("aboutHeroSubtitle") < aboutBlock.indexOf("aboutIntro"));
check("About page: values before story", aboutBlock.indexOf("vision.title") < aboutBlock.indexOf("aboutStory"));
check("About page: story before process", aboutBlock.indexOf("aboutStory") < aboutBlock.indexOf("processSteps"));

const qBlock = src.match(/id: "qualitySale"[\s\S]*?id: "projectsPage"/)?.[0] || "";
check("Quality page: features before support", qBlock.indexOf("feature1Title") < qBlock.indexOf("supportTitle"));
check("Quality page: support before FAQ", qBlock.indexOf("supportTitle") < qBlock.indexOf("faqTitle"));
check("Quality page: feature image follows title", qBlock.indexOf("feature1Title") < qBlock.indexOf("feature1Image"));

const iaHubBlock = src.match(/function iaHubSection[\s\S]*?return \{/)?.[0] || "";
check("IA hub: hero before intro", iaHubBlock.indexOf("div_hero") < iaHubBlock.indexOf("div_intro"));
check("IA hub: intro before content blocks", iaHubBlock.indexOf("div_intro") < iaHubBlock.indexOf("div_sections"));
check("IA hub: explore before SEO", iaHubBlock.indexOf("div_explore") < iaHubBlock.indexOf("div_seo"));

const navLabels = extractNavLabels(shell);
check("Sidebar: Home Page first", navLabels[0] === "Home Page");
check("Sidebar: Furniture second", navLabels[1] === "Furniture");
check("Sidebar: no IA prefix on hub labels", !navLabels.some((l) => l.startsWith("IA")));
check("Sidebar: Journal articles (not Blog)", navLabels.includes("Journal articles") && !navLabels.includes("Blog"));
check("Sidebar: Project showcases", navLabels.includes("Project showcases"));
check("Sidebar: Team Page + Team members", navLabels.includes("Team Page") && navLabels.includes("Team members"));
check("Sidebar: Projects listing present", navLabels.includes("Projects listing"));
check(
  "Sidebar: chrome last",
  navLabels.slice(-4).join("|") === "Brand & Flags|Navigation|Footer|Interior Mode",
);

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed\n`);
process.exit(failed.length ? 1 : 0);
