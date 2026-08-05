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
  return req.query?.cms === "1";
}

/** Resolve a plain string or { en, th, pl } object to a single locale string. */
function resolveLocalized(value, locale = DEFAULT_LOCALE, fallback = DEFAULT_LOCALE) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object" && !Array.isArray(value)) {
    const obj = value;
    const resolved =
      obj[locale] ?? obj[fallback] ?? obj.en ?? Object.values(obj).find((v) => typeof v === "string" && v.trim());
    return resolved != null ? String(resolved) : "";
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
    "aboutText",
    "aboutIntro",
    "aboutStory",
    "aboutHeroSubtitle",
    "footerBio",
    "address",
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
      };
    }
  }

  if (Array.isArray(out.processSteps)) {
    out.processSteps = out.processSteps.map((item) => ({
      ...item,
      title: resolveLocalized(item.title, locale),
      text: resolveLocalized(item.text, locale),
    }));
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
  const out = localizeDoc(doc, locale, ["title", "excerpt", "content", "readTime"]);
  if (out.author) out.author = localizeAuthor(out.author, locale);
  return out;
}

const MODEL_FIELDS = {
  Product: ["title", "description", "fullDescription"],
  Project: ["title", "description", "location", "detailTitle", "detailDescription", "narrativeOne", "narrativeTwo"],
  Testimonial: ["name", "role", "quote"],
  Catalogue: ["title"],
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
