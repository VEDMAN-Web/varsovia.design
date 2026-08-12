/**
 * Default Group A IA page tree for Varsovia SiteContent.pages.
 * Professional EN copy from iaPagesSeedContent; indexable defaults to false.
 */
const { pages: SEED_IA_PAGES } = require("./iaPagesSeedContent");

const DEFAULT_IA_PAGES = SEED_IA_PAGES;

/** Public path prefix for each hub key (no leading locale). */
const IA_HUB_PATHS = {
  furniture: "/furniture",
  interiorDesign: "/interior-design",
  completeInteriors: "/complete-interiors",
  services: "/services",
  locations: "/locations",
  forDevelopers: "/for-developers",
  journal: "/journal",
  aboutBrand: "/about",
};

function locText(value) {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    return ["en", "th", "pl"].map((k) => String(value[k] || "").trim()).find(Boolean) || "";
  }
  return "";
}

function isEmptyLoc(value) {
  return !locText(value);
}

/** Prefer saved copy per locale; fall back to defaults when saved is blank. */
function mergeLoc(saved, def) {
  const d = def && typeof def === "object" ? def : { en: "", th: "", pl: "" };
  const s = saved && typeof saved === "object" ? saved : {};
  return {
    en: String(s.en || "").trim() || String(d.en || "").trim(),
    th: String(s.th || "").trim() || String(d.th || "").trim(),
    pl: String(s.pl || "").trim() || String(d.pl || "").trim(),
  };
}

function mergeHero(saved, def) {
  const d = def && typeof def === "object" ? def : {};
  const s = saved && typeof saved === "object" ? saved : {};
  const image = String(s.image || "").trim() || String(d.image || "").trim();
  const ctaHref = String(s.ctaHref || "").trim() || String(d.ctaHref || "").trim() || "/contact";
  return {
    ...d,
    ...s,
    eyebrow: mergeLoc(s.eyebrow, d.eyebrow),
    title: mergeLoc(s.title, d.title),
    subtitle: mergeLoc(s.subtitle, d.subtitle),
    ctaLabel: mergeLoc(s.ctaLabel, d.ctaLabel),
    image,
    ctaHref,
  };
}

function sectionHasContent(section) {
  if (!section || typeof section !== "object") return false;
  return Boolean(
    locText(section.heading) || locText(section.text) || String(section.image || "").trim(),
  );
}

function mergeSections(saved, def) {
  if (!Array.isArray(saved) || saved.length === 0) return Array.isArray(def) ? def : [];
  if (!saved.some(sectionHasContent)) return Array.isArray(def) ? def : [];
  return saved;
}

function localizeHero(heroObj, resolveLocalized, locale) {
  if (!heroObj || typeof heroObj !== "object") return heroObj;
  return {
    ...heroObj,
    eyebrow: resolveLocalized(heroObj.eyebrow, locale),
    title: resolveLocalized(heroObj.title, locale),
    subtitle: resolveLocalized(heroObj.subtitle, locale),
    ctaLabel: resolveLocalized(heroObj.ctaLabel, locale),
    image: typeof heroObj.image === "string" ? heroObj.image : "",
    ctaHref: typeof heroObj.ctaHref === "string" ? heroObj.ctaHref : "",
  };
}

function localizeSections(sections, resolveLocalized, locale) {
  if (!Array.isArray(sections)) return [];
  return sections
    .filter((s) => s && typeof s === "object")
    .map((s) => ({
      heading: resolveLocalized(s.heading, locale),
      text: resolveLocalized(s.text, locale),
      image: typeof s.image === "string" ? s.image : "",
      imagePosition:
        s.imagePosition === "right" || s.imagePosition === "left" ? s.imagePosition : undefined,
      layout:
        typeof s.layout === "string" && s.layout.trim() ? String(s.layout).trim() : undefined,
    }));
}

function localizeChild(item, resolveLocalized, locale) {
  if (!item || typeof item !== "object") return item;
  return {
    ...item,
    slug: typeof item.slug === "string" ? item.slug : "",
    title: resolveLocalized(item.title, locale),
    metaTitle: resolveLocalized(item.metaTitle, locale),
    metaDescription: resolveLocalized(item.metaDescription, locale),
    body: resolveLocalized(item.body, locale),
    relatedTitle: resolveLocalized(item.relatedTitle, locale),
    hero: localizeHero(item.hero, resolveLocalized, locale),
    sections: localizeSections(item.sections, resolveLocalized, locale),
    indexable: item.indexable === true,
    order: item.order ?? 0,
    locationSlugs: Array.isArray(item.locationSlugs)
      ? item.locationSlugs.map((s) => String(s || "").trim()).filter(Boolean)
      : undefined,
  };
}

function localizeHub(hubObj, resolveLocalized, locale) {
  if (!hubObj || typeof hubObj !== "object") return hubObj;
  return {
    ...hubObj,
    slug: typeof hubObj.slug === "string" ? hubObj.slug : "",
    metaTitle: resolveLocalized(hubObj.metaTitle, locale),
    metaDescription: resolveLocalized(hubObj.metaDescription, locale),
    body: resolveLocalized(hubObj.body, locale),
    exploreTitle: resolveLocalized(hubObj.exploreTitle, locale),
    exploreSubtitle: resolveLocalized(hubObj.exploreSubtitle, locale),
    servicesTitle: resolveLocalized(hubObj.servicesTitle, locale),
    servicesSubtitle: resolveLocalized(hubObj.servicesSubtitle, locale),
    hero: localizeHero(hubObj.hero, resolveLocalized, locale),
    sections: localizeSections(hubObj.sections, resolveLocalized, locale),
    indexable: hubObj.indexable === true,
    children: Array.isArray(hubObj.children)
      ? hubObj.children
          .map((c) => localizeChild(c, resolveLocalized, locale))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      : [],
  };
}

function localizeIaPages(pages, resolveLocalized, locale) {
  const src = pages && typeof pages === "object" ? pages : {};
  const out = {};
  for (const key of Object.keys(DEFAULT_IA_PAGES)) {
    out[key] = localizeHub(src[key] || DEFAULT_IA_PAGES[key], resolveLocalized, locale);
  }
  return out;
}

function mergeChild(defChild, savedChild) {
  const s = savedChild && typeof savedChild === "object" ? savedChild : {};
  return {
    ...defChild,
    ...s,
    slug: defChild.slug,
    title: mergeLoc(s.title, defChild.title),
    metaTitle: mergeLoc(s.metaTitle, defChild.metaTitle),
    metaDescription: mergeLoc(s.metaDescription, defChild.metaDescription),
    body: mergeLoc(s.body, defChild.body),
    relatedTitle: mergeLoc(s.relatedTitle, defChild.relatedTitle),
    hero: mergeHero(s.hero, defChild.hero),
    sections: mergeSections(s.sections, defChild.sections),
    indexable: s.indexable === true,
    order: s.order ?? defChild.order ?? 0,
    ...(Array.isArray(s.locationSlugs) && s.locationSlugs.length
      ? { locationSlugs: s.locationSlugs }
      : defChild.locationSlugs
        ? { locationSlugs: defChild.locationSlugs }
        : {}),
  };
}

/**
 * Deep-merge saved pages over seed defaults.
 * Empty CMS strings do not wipe professional seed copy.
 */
function mergeIaPages(current) {
  const cur = current && typeof current === "object" ? current : {};
  const out = {};
  for (const [hubKey, defHub] of Object.entries(DEFAULT_IA_PAGES)) {
    const saved = cur[hubKey] && typeof cur[hubKey] === "object" ? cur[hubKey] : {};
    const savedChildren = Array.isArray(saved.children) ? saved.children : [];
    const bySlug = new Map(
      savedChildren
        .filter((c) => c && typeof c.slug === "string" && c.slug)
        .map((c) => [c.slug, c]),
    );
    const children = (defHub.children || []).map((defChild) =>
      mergeChild(defChild, bySlug.get(defChild.slug)),
    );
    for (const s of savedChildren) {
      if (s?.slug && !children.some((c) => c.slug === s.slug)) {
        children.push(s);
      }
    }
    out[hubKey] = {
      ...defHub,
      ...saved,
      slug: defHub.slug,
      metaTitle: mergeLoc(saved.metaTitle, defHub.metaTitle),
      metaDescription: mergeLoc(saved.metaDescription, defHub.metaDescription),
      body: mergeLoc(saved.body, defHub.body),
      exploreTitle: mergeLoc(saved.exploreTitle, defHub.exploreTitle),
      exploreSubtitle: mergeLoc(saved.exploreSubtitle, defHub.exploreSubtitle),
      servicesTitle: mergeLoc(saved.servicesTitle, defHub.servicesTitle),
      servicesSubtitle: mergeLoc(saved.servicesSubtitle, defHub.servicesSubtitle),
      hero: mergeHero(saved.hero, defHub.hero),
      sections: mergeSections(saved.sections, defHub.sections),
      indexable: saved.indexable === true,
      children,
    };
  }
  return out;
}

module.exports = {
  DEFAULT_IA_PAGES,
  IA_HUB_PATHS,
  localizeIaPages,
  mergeIaPages,
};
