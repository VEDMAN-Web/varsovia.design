/**
 * Force-sync EN/TH/PL maps across SiteContent + FAQ resources from frontend catalogs.
 * Overwrites fake translations where th/pl were copied from English.
 *
 * Usage: node scripts/syncAllLocales.js
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const dns = require("dns");
const mongoose = require("mongoose");

try {
  const servers = dns.getServers();
  if (!servers.includes("8.8.8.8")) dns.setServers(["8.8.8.8", "1.1.1.1", ...servers]);
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

/** Always prefer catalog th/pl when provided (fixes English-copied maps). */
function forceLoc(existing, next) {
  if (!next || typeof next !== "object") return existing;
  const base =
    existing && typeof existing === "object" && !Array.isArray(existing)
      ? { ...existing }
      : typeof existing === "string"
        ? { en: existing, th: "", pl: "" }
        : { en: "", th: "", pl: "" };
  for (const loc of ["en", "th", "pl"]) {
    const incoming = typeof next[loc] === "string" ? next[loc].trim() : "";
    if (incoming) base[loc] = incoming;
  }
  if (!(base.en || "").trim() && (next.en || "").trim()) base.en = next.en;
  return base;
}

function forceObject(existing = {}, patch = {}) {
  const out = { ...(existing && typeof existing === "object" ? existing : {}) };
  for (const [key, value] of Object.entries(patch)) {
    if (value && typeof value === "object" && ("en" in value || "th" in value || "pl" in value)) {
      out[key] = forceLoc(out[key], value);
    } else if (value !== undefined) {
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
  const legalEn = readJson("locale", "legal.en.json");
  const legalTh = readJson("locale", "legal.th.json");
  const legalPl = readJson("locale", "legal.pl.json");
  const faqTh = readJson("locale", "faq.content.th.json");
  const faqPl = readJson("locale", "faq.content.pl.json");

  const h = (loc) => ({ ...(loc === "en" ? enX : loc === "th" ? thX : plX).home });
  const hEn = h("en");
  const hTh = h("th");
  const hPl = h("pl");

  const siteFieldPatch = {
    heroEyebrow: L(hEn.heroEyebrow, hTh.heroEyebrow, hPl.heroEyebrow),
    heroHeadline: L(hEn.heroHeadline, hTh.heroHeadline, hPl.heroHeadline),
    heroPrimaryCtaLabel: L(hEn.heroPrimaryCta, hTh.heroPrimaryCta, hPl.heroPrimaryCta),
    heroSecondaryCtaLabel: L(hEn.heroSecondaryCta, hTh.heroSecondaryCta, hPl.heroSecondaryCta),
    aboutTitle: L(hEn.aboutTitle, hTh.aboutTitle, hPl.aboutTitle),
    aboutText: L(enX.siteFallback?.aboutText, thX.siteFallback?.aboutText, plX.siteFallback?.aboutText),
    aboutIntro: L(enX.siteFallback?.aboutIntro, thX.siteFallback?.aboutIntro, plX.siteFallback?.aboutIntro),
    aboutStory: L(enX.siteFallback?.aboutStory, thX.siteFallback?.aboutStory, plX.siteFallback?.aboutStory),
    aboutHeroSubtitle: L(
      enX.siteFallback?.aboutHeroSubtitle,
      thX.siteFallback?.aboutHeroSubtitle,
      plX.siteFallback?.aboutHeroSubtitle,
    ),
    footerBio: L(enX.siteFallback?.footerBio, thX.siteFallback?.footerBio, plX.siteFallback?.footerBio),
  };

  const sectionCopyPatch = {
    partners: {
      title: L(hEn.partnersTitle, hTh.partnersTitle, hPl.partnersTitle),
      subtitle: L(hEn.partnersSubtitle, hTh.partnersSubtitle, hPl.partnersSubtitle),
    },
    products: {
      title: L(hEn.productsTitle, hTh.productsTitle, hPl.productsTitle),
      subtitle: L(hEn.productsSubtitle, hTh.productsSubtitle, hPl.productsSubtitle),
      ctaLabel: L(hEn.exploreMore, hTh.exploreMore, hPl.exploreMore),
      ctaHref: "/interior-design",
    },
    featured: {
      title: L(hEn.featuredTitle, hTh.featuredTitle, hPl.featuredTitle),
      subtitle: L(hEn.featuredSubtitle, hTh.featuredSubtitle, hPl.featuredSubtitle),
      ctaLabel: L(hEn.exploreMore, hTh.exploreMore, hPl.exploreMore),
      ctaHref: "/projects",
    },
    testimonials: {
      title: L(hEn.testimonialsTitle, hTh.testimonialsTitle, hPl.testimonialsTitle),
      subtitle: L(hEn.testimonialsSubtitle, thX.home?.testimonialsSubtitle, hPl.testimonialsSubtitle),
    },
    coreStrengths: {
      title: L(hEn.strengthsTitle, hTh.strengthsTitle, hPl.strengthsTitle),
      subtitle: L(hEn.strengthsSubtitle, hTh.strengthsSubtitle, hPl.strengthsSubtitle),
    },
    catalogue: {
      title: L(hEn.catalogueTitle, hTh.catalogueTitle, hPl.catalogueTitle),
      subtitle: L(hEn.catalogueSubtitle, hTh.catalogueSubtitle, hPl.catalogueSubtitle),
    },
    contact: {
      title: L(hEn.contactTitle, hTh.contactTitle, hPl.contactTitle),
      subtitle: L(hEn.contactSubtitle, hTh.contactSubtitle, hPl.contactSubtitle),
    },
  };

  const visionPatch = {
    title: L(enX.aboutPage?.visionTitle, thX.aboutPage?.visionTitle, plX.aboutPage?.visionTitle),
    text: L(enX.siteFallback?.visionText, thX.siteFallback?.visionText, plX.siteFallback?.visionText),
  };
  const missionPatch = {
    title: L(enX.aboutPage?.missionTitle, thX.aboutPage?.missionTitle, plX.aboutPage?.missionTitle),
    text: L(enX.siteFallback?.missionText, thX.siteFallback?.missionText, plX.siteFallback?.missionText),
  };
  const valuesPatch = {
    title: L(
      enX.aboutPage?.valuesBlockTitle,
      thX.aboutPage?.valuesBlockTitle,
      plX.aboutPage?.valuesBlockTitle,
    ),
    text: L(enX.siteFallback?.valuesText, thX.siteFallback?.valuesText, plX.siteFallback?.valuesText),
  };

  const processPatch = [1, 2, 3, 4].map((n) => ({
    step: `0${n}`,
    title: L(
      enX.siteFallback?.[`process${n}Title`],
      thX.siteFallback?.[`process${n}Title`],
      plX.siteFallback?.[`process${n}Title`],
    ),
    text: L(
      enX.siteFallback?.[`process${n}Text`],
      thX.siteFallback?.[`process${n}Text`],
      plX.siteFallback?.[`process${n}Text`],
    ),
  }));

  const qEn = en.qualitySale || {};
  const qTh = th.qualitySale || {};
  const qPl = pl.qualitySale || {};
  const qualityKeys = [
    "heroTitle", "heroSubtitle", "heroBody",
    "feature1Title", "feature2Title", "feature3Title", "feature4Title",
    "supportTitle", "supportSubtitle", "faqTitle", "faqSubtitle",
    "step1Title", "step1Desc", "step2Title", "step2Desc",
    "step3Title", "step3Desc", "step4Title", "step4Desc",
    "faq1Q", "faq1A", "faq2Q", "faq2A", "faq3Q", "faq3A", "faq4Q", "faq4A",
  ];
  const qualitySalePatch = {};
  for (const key of qualityKeys) {
    qualitySalePatch[key] = L(qEn[key], qTh[key], qPl[key]);
  }

  const tpEn = { ...(en.teamPage || {}), ...(enX.teamPage || {}) };
  const tpTh = { ...(th.teamPage || {}), ...(thX.teamPage || {}) };
  const tpPl = { ...(pl.teamPage || {}), ...(plX.teamPage || {}) };
  const teamKeys = [
    "heroTitle", "heroSubtitle", "intro", "designTitle", "designEyebrow", "designBody",
    "architectTitle", "architectEyebrow", "architectBody", "toolsTitle", "toolsBody",
  ];
  const teamPagePatch = {};
  for (const key of teamKeys) {
    teamPagePatch[key] = L(tpEn[key], tpTh[key], tpPl[key]);
  }
  teamPagePatch.metaTitle = L(
    "Our Team | Varsovia Design",
    "ทีมของเรา | Varsovia Design",
    "Nasz zespół | Varsovia Design",
  );
  teamPagePatch.metaDescription = L(
    tpEn.intro,
    tpTh.intro,
    tpPl.intro,
  );
  teamPagePatch.stats = [
    {
      value: L("100+", "100+", "100+"),
      label: L(tpEn.statProjectsLabel, tpTh.statProjectsLabel, tpPl.statProjectsLabel),
    },
    {
      value: L("03", "03", "03"),
      label: L(tpEn.statYearsLabel, tpTh.statYearsLabel, tpPl.statYearsLabel),
    },
  ];

  const faqPagePatch = {
    heroTitle: L(en.faq?.heroTitle, th.faq?.heroTitle, pl.faq?.heroTitle),
    heroSubtitle: L(en.faq?.heroSubtitle, th.faq?.heroSubtitle, pl.faq?.heroSubtitle),
    metaTitle: L(
      "FAQ | Varsovia Design",
      "คำถามที่พบบ่อย | Varsovia Design",
      "FAQ | Varsovia Design",
    ),
    metaDescription: L(en.faq?.heroSubtitle, th.faq?.heroSubtitle, pl.faq?.heroSubtitle),
  };

  const cataloguePagePatch = {
    heroTitle: L(
      enX.cataloguePage?.heroTitle,
      thX.cataloguePage?.heroTitle,
      plX.cataloguePage?.heroTitle,
    ),
    heroSubtitle: L(
      enX.cataloguePage?.heroSubtitle,
      thX.cataloguePage?.heroSubtitle,
      plX.cataloguePage?.heroSubtitle,
    ),
    metaTitle: L(
      enX.pageMeta?.catalogueTitle,
      thX.pageMeta?.catalogueTitle,
      plX.pageMeta?.catalogueTitle,
    ),
    metaDescription: L(
      enX.pageMeta?.catalogueDescription,
      thX.pageMeta?.catalogueDescription,
      plX.pageMeta?.catalogueDescription,
    ),
  };

  const contactPagePatch = {
    locationTitle: L("Our Location", "ที่ตั้งของเรา", "Nasza lokalizacja"),
    locationSubtitle: L(
      "Visit our showroom or reach us online — we are here to help",
      "เยี่ยมชมโชว์รูมหรือติดต่อเราออนไลน์ — เรายินดีช่วยเหลือ",
      "Odwiedź salon lub skontaktuj się online — jesteśmy tu, by pomóc",
    ),
    showroomsTitle: L("Visit a showroom", "เยี่ยมชมโชว์รูม", "Odwiedź salon"),
    showroomsSubtitle: L(
      "Experience materials, layouts, and finishes in person at our locations.",
      "สัมผัสวัสดุ เลย์เอาต์ และผิวงานด้วยตัวเองที่สาขาของเรา",
      "Zobacz materiały, układy i wykończenia na żywo w naszych lokalizacjach.",
    ),
    mapAriaLabel: L(
      "Varsovia Design office location map",
      "แผนที่สำนักงาน Varsovia Design",
      "Mapa biura Varsovia Design",
    ),
    metaTitle: L(
      enX.pageMeta?.contactTitle,
      thX.pageMeta?.contactTitle,
      plX.pageMeta?.contactTitle,
    ),
    metaDescription: L(
      enX.pageMeta?.contactDescription,
      thX.pageMeta?.contactDescription,
      plX.pageMeta?.contactDescription,
    ),
  };

  const aboutPageSettingsPatch = {
    metaTitle: L(
      enX.pageMeta?.aboutTitle,
      thX.pageMeta?.aboutTitle,
      plX.pageMeta?.aboutTitle,
    ),
    metaDescription: L(
      enX.pageMeta?.aboutDescription,
      thX.pageMeta?.aboutDescription,
      plX.pageMeta?.aboutDescription,
    ),
  };

  const projectsPagePatch = {
    heroTitle: L(enX.showcase?.heroTitle, thX.showcase?.heroTitle, plX.showcase?.heroTitle),
    heroSubtitle: L(
      enX.showcase?.heroSubtitle,
      thX.showcase?.heroSubtitle,
      plX.showcase?.heroSubtitle,
    ),
    metaTitle: L(
      enX.pageMeta?.showcaseTitle,
      thX.pageMeta?.showcaseTitle,
      plX.pageMeta?.showcaseTitle,
    ),
    metaDescription: L(
      enX.pageMeta?.showcaseDescription,
      thX.pageMeta?.showcaseDescription,
      plX.pageMeta?.showcaseDescription,
    ),
  };

  function legalDoc(key) {
    const e = legalEn.legal[key];
    const t = legalTh.legal[key];
    const p = legalPl.legal[key];
    return {
      title: L(e.title, t.title, p.title),
      subtitle: L(e.subtitle, t.subtitle, p.subtitle),
      metaTitle: L(e.title, t.title, p.title),
      metaDescription: L(e.metaDescription, t.metaDescription, p.metaDescription),
      updated: L(e.updated, t.updated, p.updated),
      blocks: (e.blocks || []).map((block, i) => ({
        heading: L(block.heading, t.blocks?.[i]?.heading, p.blocks?.[i]?.heading),
        text: L(block.text, t.blocks?.[i]?.text, p.blocks?.[i]?.text),
      })),
    };
  }

  const legalPagesPatch = {
    privacy: legalDoc("privacy"),
    terms: legalDoc("terms"),
  };

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
      plX.showcase?.categoryMeta?.[key]?.title,
    ),
    subtitle: L(
      enX.showcase?.categoryMeta?.[key]?.subtitle,
      thX.showcase?.categoryMeta?.[key]?.subtitle,
      plX.showcase?.categoryMeta?.[key]?.subtitle,
    ),
  }));

  await mongoose.connect(uri);
  const siteCol = mongoose.connection.collection("sitecontents");
  const doc = await siteCol.findOne({ key: "main" });
  if (!doc) throw new Error("SiteContent key=main not found");

  const nextSectionCopy = { ...(doc.sectionCopy || {}) };
  for (const [key, block] of Object.entries(sectionCopyPatch)) {
    const prev = nextSectionCopy[key] || {};
    nextSectionCopy[key] = {
      ...prev,
      title: forceLoc(prev.title, block.title),
      subtitle: forceLoc(prev.subtitle, block.subtitle),
      ...(block.ctaLabel
        ? {
            ctaLabel: forceLoc(prev.ctaLabel, block.ctaLabel),
            ctaHref: block.ctaHref || prev.ctaHref || "",
          }
        : {}),
    };
  }

  const existingProcess = Array.isArray(doc.processSteps) ? doc.processSteps : [];
  const nextProcess = processPatch.map((row, i) => ({
    ...(existingProcess[i] || {}),
    step: row.step,
    title: forceLoc(existingProcess[i]?.title, row.title),
    text: forceLoc(existingProcess[i]?.text, row.text),
    icon: existingProcess[i]?.icon || "",
  }));

  const existingMeta = Array.isArray(doc.showcaseMeta) ? doc.showcaseMeta : [];
  const metaByKey = new Map(existingMeta.map((row) => [String(row.tabKey), row]));
  const nextShowcaseMeta = showcaseMetaPatch.map((row) => {
    const prev = metaByKey.get(row.tabKey) || {};
    return {
      ...prev,
      tabKey: row.tabKey,
      order: row.order,
      title: forceLoc(prev.title, row.title),
      subtitle: forceLoc(prev.subtitle, row.subtitle),
    };
  });

  const nextTeam = forceObject(doc.teamPage, teamPagePatch);
  if (Array.isArray(teamPagePatch.stats)) {
    const existingStats = Array.isArray(doc.teamPage?.stats) ? doc.teamPage.stats : [];
    nextTeam.stats = teamPagePatch.stats.map((row, i) => ({
      value: forceLoc(existingStats[i]?.value, row.value),
      label: forceLoc(existingStats[i]?.label, row.label),
    }));
  }

  const nextLegal = {
    privacy: forceObject(doc.legalPages?.privacy, {
      ...legalPagesPatch.privacy,
      blocks: undefined,
    }),
    terms: forceObject(doc.legalPages?.terms, {
      ...legalPagesPatch.terms,
      blocks: undefined,
    }),
  };
  nextLegal.privacy.blocks = legalPagesPatch.privacy.blocks.map((b, i) => ({
    heading: forceLoc(doc.legalPages?.privacy?.blocks?.[i]?.heading, b.heading),
    text: forceLoc(doc.legalPages?.privacy?.blocks?.[i]?.text, b.text),
  }));
  nextLegal.terms.blocks = legalPagesPatch.terms.blocks.map((b, i) => ({
    heading: forceLoc(doc.legalPages?.terms?.blocks?.[i]?.heading, b.heading),
    text: forceLoc(doc.legalPages?.terms?.blocks?.[i]?.text, b.text),
  }));

  const siteResult = await siteCol.updateOne(
    { key: "main" },
    {
      $set: {
        heroEyebrow: forceLoc(doc.heroEyebrow, siteFieldPatch.heroEyebrow),
        heroHeadline: forceLoc(doc.heroHeadline, siteFieldPatch.heroHeadline),
        heroPrimaryCtaLabel: forceLoc(doc.heroPrimaryCtaLabel, siteFieldPatch.heroPrimaryCtaLabel),
        heroSecondaryCtaLabel: forceLoc(
          doc.heroSecondaryCtaLabel,
          siteFieldPatch.heroSecondaryCtaLabel,
        ),
        aboutTitle: forceLoc(doc.aboutTitle, siteFieldPatch.aboutTitle),
        aboutText: forceLoc(doc.aboutText, siteFieldPatch.aboutText),
        aboutIntro: forceLoc(doc.aboutIntro, siteFieldPatch.aboutIntro),
        aboutStory: forceLoc(doc.aboutStory, siteFieldPatch.aboutStory),
        aboutHeroSubtitle: forceLoc(doc.aboutHeroSubtitle, siteFieldPatch.aboutHeroSubtitle),
        footerBio: forceLoc(doc.footerBio, siteFieldPatch.footerBio),
        sectionCopy: nextSectionCopy,
        vision: {
          ...(doc.vision || {}),
          title: forceLoc(doc.vision?.title, visionPatch.title),
          text: forceLoc(doc.vision?.text, visionPatch.text),
        },
        mission: {
          ...(doc.mission || {}),
          title: forceLoc(doc.mission?.title, missionPatch.title),
          text: forceLoc(doc.mission?.text, missionPatch.text),
        },
        values: {
          ...(doc.values || {}),
          title: forceLoc(doc.values?.title, valuesPatch.title),
          text: forceLoc(doc.values?.text, valuesPatch.text),
        },
        processSteps: nextProcess,
        qualitySale: forceObject(doc.qualitySale, qualitySalePatch),
        teamPage: nextTeam,
        faqPage: forceObject(doc.faqPage, faqPagePatch),
        cataloguePage: forceObject(doc.cataloguePage, cataloguePagePatch),
        contactPage: forceObject(doc.contactPage, contactPagePatch),
        aboutPageSettings: forceObject(doc.aboutPageSettings, aboutPageSettingsPatch),
        projectsPage: forceObject(doc.projectsPage, projectsPagePatch),
        legalPages: nextLegal,
        showcaseMeta: nextShowcaseMeta,
        stats: [
          {
            value: "+12",
            label: L(hEn.statYears, hTh.statYears, hPl.statYears),
          },
          {
            value: "+140",
            label: L(hEn.statProjects, hTh.statProjects, hPl.statProjects),
          },
          {
            value: "+6",
            label: L(hEn.statCities, hTh.statCities, hPl.statCities),
          },
        ],
        updatedAt: new Date(),
      },
    },
  );

  console.log("SiteContent matched:", siteResult.matchedCount, "modified:", siteResult.modifiedCount);

  // ── FAQ resources ──
  try {

    const faqCol = mongoose.connection.collection("faqs");
    const faqs = await faqCol.find({}).toArray();
    let faqUpdated = 0;

    // Known EN question → index in Kitchen Interior th file etc.
    // Match strategy: same category + same order among that category in DB vs locale file
    const byCat = {};
    for (const faq of faqs) {
      const cat = typeof faq.category === "string" ? faq.category : faq.category?.en || "General";
      if (!byCat[cat]) byCat[cat] = [];
      byCat[cat].push(faq);
    }

    for (const [cat, list] of Object.entries(byCat)) {
      const thList = faqTh[cat] || [];
      const plList = faqPl[cat] || [];
      for (let idx = 0; idx < list.length; idx++) {
        const faq = list[idx];
        const enQ = typeof faq.question === "string" ? faq.question : faq.question?.en || "";
        const enA = typeof faq.answer === "string" ? faq.answer : faq.answer?.en || "";
        // Try exact category index first
        let thRow = thList[idx];
        let plRow = plList[idx];
        if (cat === "General" && idx === 0) {
          thRow = faqTh["Kitchen Interior"]?.[0] || thRow;
          plRow = faqPl["Kitchen Interior"]?.[0] || plRow;
        }
        if (!thRow && /kitchen installation/i.test(enQ)) thRow = faqTh["Kitchen Interior"]?.[3];
        if (!plRow && /kitchen installation/i.test(enQ)) plRow = faqPl["Kitchen Interior"]?.[3];
        if (!thRow && /warranty/i.test(enQ)) thRow = faqTh["Kitchen Interior"]?.[4];
        if (!plRow && /warranty/i.test(enQ)) plRow = faqPl["Kitchen Interior"]?.[4];
        if (!thRow && /bedroom storage/i.test(enQ)) thRow = faqTh["Bedroom Interior"]?.[0];
        if (!plRow && /bedroom storage/i.test(enQ)) plRow = faqPl["Bedroom Interior"]?.[0];
        if (!thRow && /wardrobe to fit/i.test(enQ)) thRow = faqTh["Bedroom Interior"]?.[1];
        if (!plRow && /wardrobe to fit/i.test(enQ)) plRow = faqPl["Bedroom Interior"]?.[1];
        if (!thRow && /finishes are best for wardrobes/i.test(enQ)) {
          thRow = faqTh["Bedroom Interior"]?.[2];
        }
        if (!plRow && /finishes are best for wardrobes/i.test(enQ)) {
          plRow = faqPl["Bedroom Interior"]?.[2];
        }
        await faqCol.updateOne(
          { _id: faq._id },
          {
            $set: {
              question: L(enQ, thRow?.question || "", plRow?.question || ""),
              answer: L(enA, thRow?.answer || "", plRow?.answer || ""),
              category: L(
                cat === "General" ? "Kitchen Interior" : cat,
                cat === "General" ? "Kitchen Interior" : cat,
                cat === "General" ? "Kitchen Interior" : cat,
              ),
            },
          },
        );
        faqUpdated += 1;
      }
    }
    console.log("FAQs updated:", faqUpdated);
  } catch (e) {
    console.error("FAQ sync error", e);
  }

  await mongoose.disconnect();
  console.log("✓ All locales synced (site + FAQs)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
