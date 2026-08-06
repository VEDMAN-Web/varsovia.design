/**
 * Patch SiteContent `main` with EN/TH/PL maps from frontend message catalogs.
 * Safe: only fills missing/blank locale keys; does not wipe existing translations.
 *
 * Usage (from Varsovia-Backend):
 *   node scripts/patch-locale-content.js
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const dns = require("dns");
const mongoose = require("mongoose");

try {
  const servers = dns.getServers();
  if (!servers.includes("8.8.8.8")) {
    dns.setServers(["8.8.8.8", "1.1.1.1", ...servers]);
  }
} catch {
  /* ignore */
}

const FE = path.resolve(__dirname, "../../Varsovia-frontend/messages");

function readJson(...parts) {
  return JSON.parse(fs.readFileSync(path.join(FE, ...parts), "utf8"));
}

function L(en, th, pl) {
  return { en: en || "", th: th || "", pl: pl || "" };
}

function mergeLocalized(existing, next) {
  if (typeof next === "string") return next;
  if (!next || typeof next !== "object") return existing;
  const base =
    existing && typeof existing === "object" && !Array.isArray(existing)
      ? { ...existing }
      : typeof existing === "string"
        ? { en: existing, th: "", pl: "" }
        : { en: "", th: "", pl: "" };
  for (const loc of ["en", "th", "pl"]) {
    const cur = typeof base[loc] === "string" ? base[loc].trim() : "";
    const incoming = typeof next[loc] === "string" ? next[loc].trim() : "";
    if (!cur && incoming) base[loc] = incoming;
    if (!base[loc] && loc === "en" && incoming) base[loc] = incoming;
  }
  // Always prefer filling th/pl from catalog when blank
  if (!(base.th || "").trim() && (next.th || "").trim()) base.th = next.th;
  if (!(base.pl || "").trim() && (next.pl || "").trim()) base.pl = next.pl;
  if (!(base.en || "").trim() && (next.en || "").trim()) base.en = next.en;
  return base;
}

function mergeObjectFields(existing = {}, patch = {}) {
  const out = { ...(existing && typeof existing === "object" ? existing : {}) };
  for (const [key, value] of Object.entries(patch)) {
    if (value && typeof value === "object" && !Array.isArray(value) && ("en" in value || "th" in value || "pl" in value)) {
      out[key] = mergeLocalized(out[key], value);
    } else if (Array.isArray(value)) {
      out[key] = value;
    } else if (out[key] === undefined) {
      out[key] = value;
    }
  }
  return out;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");

  const en = readJson("en.json");
  const th = readJson("th.json");
  const pl = readJson("pl.json");
  const enX = readJson("locale", "en.extra.json");
  const thX = readJson("locale", "th.extra.json");
  const plX = readJson("locale", "pl.extra.json");

  const qEn = en.qualitySale || {};
  const qTh = th.qualitySale || {};
  const qPl = pl.qualitySale || {};
  const qualityKeys = [
    "heroTitle",
    "heroSubtitle",
    "heroBody",
    "feature1Title",
    "feature2Title",
    "feature3Title",
    "feature4Title",
    "supportTitle",
    "supportSubtitle",
    "faqTitle",
    "faqSubtitle",
    "step1Title",
    "step1Desc",
    "step2Title",
    "step2Desc",
    "step3Title",
    "step3Desc",
    "step4Title",
    "step4Desc",
    "faq1Q",
    "faq1A",
    "faq2Q",
    "faq2A",
    "faq3Q",
    "faq3A",
    "faq4Q",
    "faq4A",
  ];
  const qualitySalePatch = {};
  for (const key of qualityKeys) {
    qualitySalePatch[key] = L(qEn[key], qTh[key], qPl[key]);
  }

  const tpEn = { ...(en.teamPage || {}), ...(enX.teamPage || {}) };
  const tpTh = { ...(th.teamPage || {}), ...(thX.teamPage || {}) };
  const tpPl = { ...(pl.teamPage || {}), ...(plX.teamPage || {}) };
  const teamKeys = [
    "heroTitle",
    "heroSubtitle",
    "intro",
    "designTitle",
    "designEyebrow",
    "designBody",
    "architectTitle",
    "architectEyebrow",
    "architectBody",
    "toolsTitle",
    "toolsBody",
  ];
  const teamPagePatch = {};
  for (const key of teamKeys) {
    teamPagePatch[key] = L(tpEn[key], tpTh[key], tpPl[key]);
  }
  teamPagePatch.stats = [
    {
      value: L("100+", "100+", "100+"),
      label: L(
        tpEn.statProjectsLabel || "Successful Projects Completed",
        tpTh.statProjectsLabel,
        tpPl.statProjectsLabel
      ),
    },
    {
      value: L("03", "03", "03"),
      label: L(
        tpEn.statYearsLabel || "Years of Excellence in Interior Solutions",
        tpTh.statYearsLabel,
        tpPl.statYearsLabel
      ),
    },
  ];

  const metaTabs = [
    ["All", "all"],
    ["Home case", "homeCase"],
    ["North America", "northAmerica"],
    ["South America", "southAmerica"],
    ["Africa", "africa"],
    ["Commercial Project", "commercialProject"],
    ["Europe", "europe"],
    ["Australia", "australia"],
    ["Middle East", "middleEast"],
    ["Asia", "asia"],
  ];
  const showcaseMetaPatch = metaTabs.map(([tabKey, key], order) => ({
    tabKey,
    order,
    title: L(
      enX.showcase?.categoryMeta?.[key]?.title,
      thX.showcase?.categoryMeta?.[key]?.title,
      plX.showcase?.categoryMeta?.[key]?.title
    ),
    subtitle: L(
      enX.showcase?.categoryMeta?.[key]?.subtitle,
      thX.showcase?.categoryMeta?.[key]?.subtitle,
      plX.showcase?.categoryMeta?.[key]?.subtitle
    ),
  }));

  const sectionCopyPatch = {
    partners: {
      title: L(enX.home?.partnersTitle, thX.home?.partnersTitle, plX.home?.partnersTitle),
      subtitle: L(
        enX.home?.partnersSubtitle,
        thX.home?.partnersSubtitle,
        plX.home?.partnersSubtitle
      ),
    },
    products: {
      title: L(enX.home?.productsTitle, thX.home?.productsTitle, plX.home?.productsTitle),
      subtitle: L(
        enX.home?.productsSubtitle,
        thX.home?.productsSubtitle,
        plX.home?.productsSubtitle
      ),
    },
    featured: {
      title: L(enX.home?.featuredTitle, thX.home?.featuredTitle, plX.home?.featuredTitle),
      subtitle: L(
        enX.home?.featuredSubtitle,
        thX.home?.featuredSubtitle,
        plX.home?.featuredSubtitle
      ),
    },
    testimonials: {
      title: L(
        enX.home?.testimonialsTitle,
        thX.home?.testimonialsTitle,
        plX.home?.testimonialsTitle
      ),
      subtitle: L(
        enX.home?.testimonialsSubtitle,
        thX.home?.testimonialsSubtitle,
        plX.home?.testimonialsSubtitle
      ),
    },
    coreStrengths: {
      title: L(enX.home?.strengthsTitle, thX.home?.strengthsTitle, plX.home?.strengthsTitle),
      subtitle: L(
        enX.home?.strengthsSubtitle,
        thX.home?.strengthsSubtitle,
        plX.home?.strengthsSubtitle
      ),
    },
    catalogue: {
      title: L(enX.home?.catalogueTitle, thX.home?.catalogueTitle, plX.home?.catalogueTitle),
      subtitle: L(
        enX.home?.catalogueSubtitle,
        thX.home?.catalogueSubtitle,
        plX.home?.catalogueSubtitle
      ),
    },
    contact: {
      title: L(enX.home?.contactTitle, thX.home?.contactTitle, plX.home?.contactTitle),
      subtitle: L(
        enX.home?.contactSubtitle,
        thX.home?.contactSubtitle,
        plX.home?.contactSubtitle
      ),
    },
  };

  const siteFieldPatch = {
    heroEyebrow: L(enX.home?.heroEyebrow, thX.home?.heroEyebrow, plX.home?.heroEyebrow),
    heroHeadline: L(enX.home?.heroHeadline, thX.home?.heroHeadline, plX.home?.heroHeadline),
    heroPrimaryCtaLabel: L(
      enX.home?.heroPrimaryCta,
      thX.home?.heroPrimaryCta,
      plX.home?.heroPrimaryCta
    ),
    heroSecondaryCtaLabel: L(
      enX.home?.heroSecondaryCta,
      thX.home?.heroSecondaryCta,
      plX.home?.heroSecondaryCta
    ),
    aboutTitle: L(enX.home?.aboutTitle, thX.home?.aboutTitle, plX.home?.aboutTitle),
    aboutText: L(enX.siteFallback?.aboutText, thX.siteFallback?.aboutText, plX.siteFallback?.aboutText),
    aboutIntro: L(enX.siteFallback?.aboutIntro, thX.siteFallback?.aboutIntro, plX.siteFallback?.aboutIntro),
    aboutStory: L(enX.siteFallback?.aboutStory, thX.siteFallback?.aboutStory, plX.siteFallback?.aboutStory),
    aboutHeroSubtitle: L(
      enX.siteFallback?.aboutHeroSubtitle,
      thX.siteFallback?.aboutHeroSubtitle,
      plX.siteFallback?.aboutHeroSubtitle
    ),
    footerBio: L(enX.siteFallback?.footerBio, thX.siteFallback?.footerBio, plX.siteFallback?.footerBio),
  };

  await mongoose.connect(uri);
  const col = mongoose.connection.collection("sitecontents");
  const doc = await col.findOne({ key: "main" });
  if (!doc) throw new Error("SiteContent key=main not found");

  const nextQuality = mergeObjectFields(doc.qualitySale, qualitySalePatch);
  const nextTeam = mergeObjectFields(doc.teamPage, teamPagePatch);
  if (Array.isArray(teamPagePatch.stats)) {
    const existingStats = Array.isArray(doc.teamPage?.stats) ? doc.teamPage.stats : [];
    nextTeam.stats = teamPagePatch.stats.map((row, i) => ({
      value: mergeLocalized(existingStats[i]?.value, row.value),
      label: mergeLocalized(existingStats[i]?.label, row.label),
    }));
  }

  const existingMeta = Array.isArray(doc.showcaseMeta) ? doc.showcaseMeta : [];
  const metaByKey = new Map(existingMeta.map((row) => [String(row.tabKey), row]));
  const nextShowcaseMeta = showcaseMetaPatch.map((row) => {
    const prev = metaByKey.get(row.tabKey) || {};
    return {
      ...prev,
      tabKey: row.tabKey,
      order: row.order,
      title: mergeLocalized(prev.title, row.title),
      subtitle: mergeLocalized(prev.subtitle, row.subtitle),
    };
  });

  const nextSectionCopy = { ...(doc.sectionCopy || {}) };
  for (const [key, block] of Object.entries(sectionCopyPatch)) {
    const prev = nextSectionCopy[key] || {};
    nextSectionCopy[key] = {
      ...prev,
      title: mergeLocalized(prev.title, block.title),
      subtitle: mergeLocalized(prev.subtitle, block.subtitle),
    };
  }

  const result = await col.updateOne(
    { key: "main" },
    {
      $set: {
        qualitySale: nextQuality,
        teamPage: nextTeam,
        showcaseMeta: nextShowcaseMeta,
        sectionCopy: nextSectionCopy,
        heroEyebrow: mergeLocalized(doc.heroEyebrow, siteFieldPatch.heroEyebrow),
        heroHeadline: mergeLocalized(doc.heroHeadline, siteFieldPatch.heroHeadline),
        heroPrimaryCtaLabel: mergeLocalized(
          doc.heroPrimaryCtaLabel,
          siteFieldPatch.heroPrimaryCtaLabel
        ),
        heroSecondaryCtaLabel: mergeLocalized(
          doc.heroSecondaryCtaLabel,
          siteFieldPatch.heroSecondaryCtaLabel
        ),
        aboutTitle: mergeLocalized(doc.aboutTitle, siteFieldPatch.aboutTitle),
        aboutText: mergeLocalized(doc.aboutText, siteFieldPatch.aboutText),
        aboutIntro: mergeLocalized(doc.aboutIntro, siteFieldPatch.aboutIntro),
        aboutStory: mergeLocalized(doc.aboutStory, siteFieldPatch.aboutStory),
        aboutHeroSubtitle: mergeLocalized(
          doc.aboutHeroSubtitle,
          siteFieldPatch.aboutHeroSubtitle
        ),
        footerBio: mergeLocalized(doc.footerBio, siteFieldPatch.footerBio),
        updatedAt: new Date(),
      },
    }
  );

  console.log("Matched:", result.matchedCount, "Modified:", result.modifiedCount);
  console.log(
    "Patched: qualitySale, teamPage, showcaseMeta, sectionCopy, hero/about/footer locale maps"
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
