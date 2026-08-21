const LOCALES = ["en", "th", "pl"];
const DEFAULT_LOCALE = "en";

function getRequestLocale(req) {
  const fromQuery = req.query?.locale;
  if (typeof fromQuery === "string" && LOCALES.includes(fromQuery)) {
    return fromQuery;
  }

  const header = req.headers["accept-language"];
  if (typeof header === "string") {
    const primary = header.split(",")[0]?.trim().split("-")[0]?.toLowerCase();
    if (primary && LOCALES.includes(primary)) return primary;
  }

  return DEFAULT_LOCALE;
}

function isAdminRequest(req) {
  /** Admin / CMS clients: full multilingual documents (not public locale slice). */
  return req.varsoviaAdmin === true || String(req.query?.cms || "") === "1";
}

/** Prefer non-empty string; blank / whitespace does not count (so th/pl fall back to en). */
function pickNonEmpty(...candidates) {
  for (const candidate of candidates) {
    if (candidate == null) continue;
    const s = String(candidate);
    if (s.trim()) return s;
  }
  return "";
}

/** Resolve a plain string or { en, th, pl } object to a single locale string. */
function resolveLocalized(value, locale = DEFAULT_LOCALE, fallback = DEFAULT_LOCALE) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object" && !Array.isArray(value)) {
    const obj = value;
    return pickNonEmpty(
      obj[locale],
      obj[fallback],
      obj.en,
      Object.values(obj).find((v) => typeof v === "string" && v.trim())
    );
  }
  return String(value);
}

function localizeDoc(doc, locale, fields = []) {
  if (!doc) return doc;
  const out = doc.toObject ? doc.toObject() : { ...doc };
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(out, field)) {
      out[field] = resolveLocalized(out[field], locale);
    }
  }
  return out;
}

function localizeDocs(docs, locale, fields = []) {
  return (docs || []).map((doc) => localizeDoc(doc, locale, fields));
}

function localizeSiteContent(doc, locale) {
  if (!doc) return doc;
  const out = doc.toObject ? doc.toObject() : { ...doc };

  const simpleFields = [
    "heroEyebrow",
    "heroHeadline",
    "heroSubtitle",
    "heroPrimaryCtaLabel",
    "heroSecondaryCtaLabel",
    "aboutTitle",
    "aboutSubtitle",
    "aboutText",
    "aboutCtaLabel",
    "aboutCtaHref",
    "aboutIntro",
    "aboutStory",
    "aboutHeroTitle",
    "aboutHeroSubtitle",
    "footerBio",
    "address",
    "brandWordmarkLine1",
    "brandWordmarkLine2",
  ];

  for (const field of simpleFields) {
    if (field in out) out[field] = resolveLocalized(out[field], locale);
  }

  if (Array.isArray(out.stats)) {
    out.stats = out.stats.map((item) => ({
      ...item,
      label: resolveLocalized(item.label, locale),
      value: resolveLocalized(item.value, locale),
    }));
  }

  for (const block of ["vision", "mission", "values"]) {
    if (out[block]) {
      out[block] = {
        title: resolveLocalized(out[block].title, locale),
        text: resolveLocalized(out[block].text, locale),
        icon: typeof out[block].icon === "string" ? out[block].icon : "",
      };
    }
  }

  if (Array.isArray(out.processSteps)) {
    out.processSteps = out.processSteps.map((item) => ({
      ...item,
      title: resolveLocalized(item.title, locale),
      text: resolveLocalized(item.text, locale),
      icon: typeof item.icon === "string" ? item.icon : "",
    }));
  }

  if (Array.isArray(out.designTools)) {
    out.designTools = out.designTools
      .map((item) => ({
        ...item,
        name: resolveLocalized(item.name, locale),
        image: typeof item.image === "string" ? item.image : "",
        order: item.order ?? 0,
      }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  if (out.teamPage && typeof out.teamPage === "object") {
    const tp = out.teamPage;
    out.teamPage = {
      ...tp,
      heroTitle: resolveLocalized(tp.heroTitle, locale),
      heroSubtitle: resolveLocalized(tp.heroSubtitle, locale),
      intro: resolveLocalized(tp.intro, locale),
      designTitle: resolveLocalized(tp.designTitle, locale),
      designEyebrow: resolveLocalized(tp.designEyebrow, locale),
      designBody: resolveLocalized(tp.designBody, locale),
      architectTitle: resolveLocalized(tp.architectTitle, locale),
      architectEyebrow: resolveLocalized(tp.architectEyebrow, locale),
      architectBody: resolveLocalized(tp.architectBody, locale),
      toolsTitle: resolveLocalized(tp.toolsTitle, locale),
      toolsBody: resolveLocalized(tp.toolsBody, locale),
      stats: Array.isArray(tp.stats)
        ? tp.stats.map((item) => ({
            ...item,
            value: resolveLocalized(item.value, locale),
            label: resolveLocalized(item.label, locale),
          }))
        : [],
    };
  }

  if (Array.isArray(out.footerOffices)) {
    out.footerOffices = out.footerOffices.map((item) => ({
      ...item,
      label: resolveLocalized(item.label, locale),
    }));
  }

  if (Array.isArray(out.searchPages)) {
    out.searchPages = out.searchPages
      .map((item) => ({
        ...item,
        title: resolveLocalized(item.title, locale),
        description: resolveLocalized(item.description, locale),
      }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  if (out.sectionCopy && typeof out.sectionCopy === "object") {
    const copy = {};
    for (const [key, block] of Object.entries(out.sectionCopy)) {
      if (!block || typeof block !== "object") continue;
      copy[key] = {
        title: resolveLocalized(block.title, locale),
        subtitle: resolveLocalized(block.subtitle, locale),
        ctaLabel: resolveLocalized(block.ctaLabel, locale),
        ctaHref: typeof block.ctaHref === "string" ? block.ctaHref : "",
        itemCtaLabel: resolveLocalized(block.itemCtaLabel, locale),
      };
    }
    out.sectionCopy = copy;
  }

  if (out.inquiryForm) {
    const { localizeInquiryForm, DEFAULT_INQUIRY_FORM } = require("../validation/inquiryForm");
    out.inquiryForm = localizeInquiryForm(out.inquiryForm || DEFAULT_INQUIRY_FORM, locale);
  } else {
    const { localizeInquiryForm, DEFAULT_INQUIRY_FORM } = require("../validation/inquiryForm");
    out.inquiryForm = localizeInquiryForm(DEFAULT_INQUIRY_FORM, locale);
  }

  if (out.mainNavigation) {
    const { localizeMainNavigation } = require("../validation/mainNavigation");
    out.mainNavigation = localizeMainNavigation(out.mainNavigation, locale);
  } else {
    const { localizeMainNavigation, DEFAULT_MAIN_NAVIGATION } = require("../validation/mainNavigation");
    out.mainNavigation = localizeMainNavigation(DEFAULT_MAIN_NAVIGATION, locale);
  }

  if (out.footerNavigation) {
    const { localizeFooterNavigation } = require("../validation/footerNavigation");
    out.footerNavigation = localizeFooterNavigation(out.footerNavigation, locale);
  } else {
    const { localizeFooterNavigation, DEFAULT_FOOTER_NAVIGATION } = require("../validation/footerNavigation");
    out.footerNavigation = localizeFooterNavigation(DEFAULT_FOOTER_NAVIGATION, locale);
  }

  if (out.qualitySale && typeof out.qualitySale === "object") {
    const qs = { ...out.qualitySale };
    const qualityTextKeys = [
      "heroTitle",
      "heroSubtitle",
      "heroBody",
      "feature1Title",
      "feature1ImageAlt",
      "feature2Title",
      "feature2ImageAlt",
      "feature3Title",
      "feature3ImageAlt",
      "feature4Title",
      "feature4ImageAlt",
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
    for (const key of qualityTextKeys) {
      if (key in qs) qs[key] = resolveLocalized(qs[key], locale);
    }
    if (Array.isArray(qs.faqItems)) {
      qs.faqItems = qs.faqItems.map((item) => ({
        ...item,
        question: resolveLocalized(item.question, locale),
        answer: resolveLocalized(item.answer, locale),
      }));
    }
    out.qualitySale = qs;
  }

  if (Array.isArray(out.showcaseMeta)) {
    out.showcaseMeta = out.showcaseMeta
      .map((item, index) => ({
        ...item,
        tabKey: typeof item.tabKey === "string" ? item.tabKey : "",
        title: resolveLocalized(item.title, locale),
        subtitle: resolveLocalized(item.subtitle, locale),
        order: item.order ?? index,
      }))
      .filter((item) => item.tabKey)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  if (out.projectsPage && typeof out.projectsPage === "object") {
    const pp = { ...out.projectsPage };
    pp.metaTitle = resolveLocalized(pp.metaTitle, locale);
    pp.metaDescription = resolveLocalized(pp.metaDescription, locale);
    pp.heroTitle = resolveLocalized(pp.heroTitle, locale);
    pp.heroSubtitle = resolveLocalized(pp.heroSubtitle, locale);
    out.projectsPage = pp;
  }

  function localizeSimplePageBlock(block) {
    if (!block || typeof block !== "object") return block;
    const b = { ...block };
    for (const key of [
      "metaTitle",
      "metaDescription",
      "heroTitle",
      "heroSubtitle",
      "locationTitle",
      "locationSubtitle",
      "mapAriaLabel",
      "showroomsTitle",
      "showroomsSubtitle",
      "title",
      "subtitle",
      "updated",
    ]) {
      if (key in b) b[key] = resolveLocalized(b[key], locale);
    }
    if (Array.isArray(b.blocks)) {
      b.blocks = b.blocks.map((row) => ({
        ...row,
        heading: resolveLocalized(row.heading, locale),
        text: resolveLocalized(row.text, locale),
      }));
    }
    return b;
  }

  if (out.aboutPageSettings) out.aboutPageSettings = localizeSimplePageBlock(out.aboutPageSettings);
  if (out.homeSeo) out.homeSeo = localizeSimplePageBlock(out.homeSeo);
  if (out.faqPage) out.faqPage = localizeSimplePageBlock(out.faqPage);
  if (out.cataloguePage) out.cataloguePage = localizeSimplePageBlock(out.cataloguePage);
  if (out.contactPage) out.contactPage = localizeSimplePageBlock(out.contactPage);
  if (out.legalPages && typeof out.legalPages === "object") {
    out.legalPages = {
      ...out.legalPages,
      privacy: localizeSimplePageBlock(out.legalPages.privacy),
      terms: localizeSimplePageBlock(out.legalPages.terms),
    };
  }

  if (out.teamPage && typeof out.teamPage === "object") {
    out.teamPage = {
      ...out.teamPage,
      metaTitle: resolveLocalized(out.teamPage.metaTitle, locale),
      metaDescription: resolveLocalized(out.teamPage.metaDescription, locale),
    };
  }

  if (out.qualitySale && typeof out.qualitySale === "object") {
    out.qualitySale.metaTitle = resolveLocalized(out.qualitySale.metaTitle, locale);
    out.qualitySale.metaDescription = resolveLocalized(out.qualitySale.metaDescription, locale);
  }

  const { localizeIaPages, mergeIaPages } = require("../data/iaPagesDefaults");
  out.pages = localizeIaPages(mergeIaPages(out.pages), resolveLocalized, locale);

  return out;
}

function localizeAuthor(author, locale) {
  if (!author) return author;
  return {
    ...author,
    name: resolveLocalized(author.name, locale),
  };
}

function localizeBlog(doc, locale) {
  if (!doc) return doc;
  const out = localizeDoc(doc, locale, ["title", "excerpt", "content", "readTime", "category"]);
  if (out.author) out.author = localizeAuthor(out.author, locale);
  if (Array.isArray(out.sections)) {
    out.sections = out.sections.map((section) => ({
      ...section,
      heading: resolveLocalized(section.heading, locale),
      text: resolveLocalized(section.text, locale),
    }));
  }
  return out;
}

const MODEL_FIELDS = {
  Product: ["title", "description", "fullDescription"],
    // category stays an English enum ("Kitchen", …) — never localize it
    Project: ["title", "description", "location", "detailTitle", "detailDescription", "narrativeOne", "narrativeTwo"],
  Testimonial: ["name", "role", "quote"],
  Catalogue: ["title", "category"],
  Showcase: ["title", "category", "location", "typeLabel", "typeValue", "supplyArea"],
  Showroom: ["name", "location", "address"],
  TeamMember: ["name", "role"],
  FAQ: ["question", "answer", "category"],
  Partner: ["name"],
  CoreStrength: ["title", "description"],
};

function localizeProduct(doc, locale) {
  if (!doc) return doc;
  const out = localizeDoc(doc, locale, MODEL_FIELDS.Product);
  if (Array.isArray(out.features)) {
    out.features = out.features.map((f) => ({
      ...f,
      text: resolveLocalized(f.text, locale),
    }));
  }
  if (Array.isArray(out.specs)) {
    out.specs = out.specs.map((s) => ({
      ...s,
      label: resolveLocalized(s.label, locale),
      value: resolveLocalized(s.value, locale),
    }));
  }
  return out;
}

function localizeModelDoc(modelName, doc, locale) {
  if (modelName === "Blog") return localizeBlog(doc, locale);
  if (modelName === "SiteContent") return localizeSiteContent(doc, locale);
  if (modelName === "Product") return localizeProduct(doc, locale);
  return localizeDoc(doc, locale, MODEL_FIELDS[modelName] || []);
}

function localizeModelDocs(modelName, docs, locale) {
  return (docs || []).map((doc) => localizeModelDoc(modelName, doc, locale));
}

module.exports = {
  LOCALES,
  DEFAULT_LOCALE,
  getRequestLocale,
  isAdminRequest,
  resolveLocalized,
  localizeDoc,
  localizeDocs,
  localizeSiteContent,
  localizeBlog,
  localizeModelDoc,
  localizeModelDocs,
  MODEL_FIELDS,
};
