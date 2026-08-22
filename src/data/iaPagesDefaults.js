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

function asSlug(value) {
  return String(value || "").trim();
}

function asLocMap(value) {
  if (typeof value === "string") {
    const text = value.trim();
    return text ? { en: text, th: "", pl: "" } : { en: "", th: "", pl: "" };
  }
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  return {};
}

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

/** Prefer saved copy per locale; fill remaining tabs from the live seed. */
function mergeLoc(saved, def) {
  const d = asLocMap(def);
  const s = asLocMap(saved);
  const en = String(s.en || "").trim() || String(d.en || "").trim();
  const take = (loc) => {
    const savedLoc = String(s[loc] || "").trim();
    if (savedLoc) return savedLoc;
    const defLoc = String(d[loc] || "").trim();
    const defEn = String(d.en || "").trim();
    if (defLoc && defLoc !== defEn) return defLoc;
    return "";
  };
  return {
    en,
    th: take("th"),
    pl: take("pl"),
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

function mergeArticleContact(saved, def) {
  if (!saved && !def) return undefined;
  const d = def && typeof def === "object" ? def : {};
  const s = saved && typeof saved === "object" ? saved : {};
  return {
    title: mergeLoc(s.title, d.title),
    subtitle: mergeLoc(s.subtitle, d.subtitle),
    ctaLabel: mergeLoc(s.ctaLabel, d.ctaLabel),
    ctaHref: String(s.ctaHref || "").trim() || String(d.ctaHref || "").trim() || "/contact",
  };
}

function mergeArticleOffer(saved, def) {
  if (!saved && !def) return undefined;
  const d = def && typeof def === "object" ? def : {};
  const s = saved && typeof saved === "object" ? saved : {};
  const fallbackPoints = Array.isArray(d.points) ? d.points : [];
  const savedPoints = Array.isArray(s.points) ? s.points : [];
  const points =
    savedPoints.some((p) => locText(p))
      ? savedPoints.map((p, i) => mergeLoc(p, fallbackPoints[i]))
      : fallbackPoints;
  return {
    eyebrow: mergeLoc(s.eyebrow, d.eyebrow),
    title: mergeLoc(s.title, d.title),
    text: mergeLoc(s.text, d.text),
    points,
    ctaLabel: mergeLoc(s.ctaLabel, d.ctaLabel),
    ctaHref: String(s.ctaHref || "").trim() || String(d.ctaHref || "").trim() || "/contact",
    image: String(s.image || "").trim() || String(d.image || "").trim(),
    imageAlt: mergeLoc(s.imageAlt, d.imageAlt),
  };
}

function sectionHasContent(section) {
  if (!section || typeof section !== "object") return false;
  return Boolean(
    locText(section.heading) || locText(section.text) || String(section.image || "").trim(),
  );
}

function mergeSections(saved, def) {
  const fallback = Array.isArray(def) ? def : [];
  if (!Array.isArray(saved) || saved.length === 0) return fallback;
  if (!saved.some(sectionHasContent)) return fallback;
  return saved.map((block, index) => {
    const d = fallback[index] && typeof fallback[index] === "object" ? fallback[index] : {};
    const s = block && typeof block === "object" ? block : {};
    return {
      ...d,
      ...s,
      heading: mergeLoc(s.heading, d.heading),
      text: mergeLoc(s.text, d.text),
      image: String(s.image || "").trim() || String(d.image || "").trim(),
      imagePosition: s.imagePosition || d.imagePosition,
      layout: s.layout || d.layout,
    };
  });
}

function localizeHero(heroObj, resolveLocalized, locale) {
  if (!heroObj || typeof heroObj !== "object") return heroObj;
  return {
    ...heroObj,
    eyebrow: resolveLocalized(heroObj.eyebrow, locale),
    title: resolveLocalized(heroObj.title, locale),
    subtitle: resolveLocalized(heroObj.subtitle, locale),
    ctaLabel: resolveLocalized(heroObj.ctaLabel, locale),
    image: typeof heroObj.image === "string" ? heroObj.image : locText(heroObj.image),
    ctaHref: typeof heroObj.ctaHref === "string" ? heroObj.ctaHref : "",
  };
}

function localizeArticleContact(block, resolveLocalized, locale) {
  if (!block || typeof block !== "object") return undefined;
  return {
    title: resolveLocalized(block.title, locale),
    subtitle: resolveLocalized(block.subtitle, locale),
    ctaLabel: resolveLocalized(block.ctaLabel, locale),
    ctaHref: typeof block.ctaHref === "string" ? block.ctaHref : "/contact",
  };
}

function localizeArticleOffer(block, resolveLocalized, locale) {
  if (!block || typeof block !== "object") return undefined;
  return {
    eyebrow: resolveLocalized(block.eyebrow, locale),
    title: resolveLocalized(block.title, locale),
    text: resolveLocalized(block.text, locale),
    points: Array.isArray(block.points)
      ? block.points.map((p) => resolveLocalized(p, locale)).filter(Boolean)
      : [],
    ctaLabel: resolveLocalized(block.ctaLabel, locale),
    ctaHref: typeof block.ctaHref === "string" ? block.ctaHref : "/contact",
    image: typeof block.image === "string" ? block.image : "",
    imageAlt: resolveLocalized(block.imageAlt, locale),
  };
}

function localizeSections(sections, resolveLocalized, locale) {
  if (!Array.isArray(sections)) return [];
  return sections
    .filter((s) => s && typeof s === "object")
    .map((s) => ({
      heading: resolveLocalized(s.heading, locale),
      text: resolveLocalized(s.text, locale),
      image: typeof s.image === "string" ? s.image : locText(s.image),
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
    servicesTitle: resolveLocalized(item.servicesTitle, locale),
    servicesSubtitle: resolveLocalized(item.servicesSubtitle, locale),
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
    articleContact: localizeArticleContact(hubObj.articleContact, resolveLocalized, locale),
    articleOffer: localizeArticleOffer(hubObj.articleOffer, resolveLocalized, locale),
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
  const title = mergeLoc(s.title, defChild.title);
  const hero = mergeHero(s.hero, defChild.hero);
  const seedTitle = locText(defChild?.title);
  const seedHeroTitle = locText(defChild?.hero?.title);
  const cardTitle = locText(title);
  const heroTitle = locText(hero?.title);
  // Card / nav title is what editors change in the panel list. Live H1 reads
  // hero.title, which stays on seed unless we copy a customized card title across.
  if (cardTitle && cardTitle !== seedTitle && (!heroTitle || heroTitle === seedHeroTitle)) {
    hero.title = title;
  }
  return {
    ...defChild,
    ...s,
    slug: defChild.slug,
    title,
    metaTitle: mergeLoc(s.metaTitle, defChild.metaTitle),
    metaDescription: mergeLoc(s.metaDescription, defChild.metaDescription),
    body: mergeLoc(s.body, defChild.body),
    relatedTitle: mergeLoc(s.relatedTitle, defChild.relatedTitle),
    servicesTitle: mergeLoc(s.servicesTitle, defChild.servicesTitle),
    servicesSubtitle: mergeLoc(s.servicesSubtitle, defChild.servicesSubtitle),
    hero,
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
        .map((c) => {
          const slug = asSlug(c && typeof c === "object" ? c.slug : "");
          return slug ? [slug, { ...c, slug }] : null;
        })
        .filter(Boolean),
    );
    const children = (defHub.children || []).map((defChild) =>
      mergeChild(defChild, bySlug.get(defChild.slug)),
    );
    for (const s of savedChildren) {
      const slug = asSlug(s && typeof s === "object" ? s.slug : "");
      if (slug && !children.some((c) => c.slug === slug)) {
        children.push({ ...s, slug });
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
      articleContact: mergeArticleContact(saved.articleContact, defHub.articleContact),
      articleOffer: mergeArticleOffer(saved.articleOffer, defHub.articleOffer),
      indexable: saved.indexable === true,
      children,
    };
  }
  return out;
}

function normalizeSavedChild(child) {
  if (!child || typeof child !== "object" || Array.isArray(child)) return null;
  const slug = asSlug(child.slug);
  if (!slug) return null;
  return { ...child, slug };
}

/**
 * Partial CMS PUT { pages: { furniture: { children } } } must merge into the
 * stored tree. Replacing `pages` wholesale drops sibling hubs or children.
 */
function mergeSavedIaPages(current, patch) {
  const cur = current && typeof current === "object" && !Array.isArray(current) ? current : {};
  const p = patch && typeof patch === "object" && !Array.isArray(patch) ? patch : {};
  const out = { ...cur };
  for (const [hubKey, patchHub] of Object.entries(p)) {
    if (!patchHub || typeof patchHub !== "object" || Array.isArray(patchHub)) continue;
    const prev =
      cur[hubKey] && typeof cur[hubKey] === "object" && !Array.isArray(cur[hubKey])
        ? cur[hubKey]
        : {};
    const nextHub = { ...prev, ...patchHub };
    if (patchHub.hero && typeof patchHub.hero === "object" && !Array.isArray(patchHub.hero)) {
      const prevHero =
        prev.hero && typeof prev.hero === "object" && !Array.isArray(prev.hero) ? prev.hero : {};
      nextHub.hero = { ...prevHero, ...patchHub.hero };
    }
    if (Array.isArray(patchHub.sections)) {
      nextHub.sections = patchHub.sections;
    } else if (Array.isArray(prev.sections)) {
      nextHub.sections = prev.sections;
    }
    if (Array.isArray(patchHub.children)) {
      nextHub.children = patchHub.children.map(normalizeSavedChild).filter(Boolean);
    } else if (Array.isArray(prev.children)) {
      nextHub.children = prev.children;
    }
    out[hubKey] = nextHub;
  }
  return out;
}

module.exports = {
  DEFAULT_IA_PAGES,
  IA_HUB_PATHS,
  localizeIaPages,
  mergeIaPages,
  mergeSavedIaPages,
};
