/**
 * Default Group A IA page tree for Varsovia SiteContent.pages.
 * indexable defaults to false — flip only when real content exists.
 */

function L(en, th = "", pl = "") {
  return { en, th, pl };
}

function hero(titleEn) {
  return {
    eyebrow: L(""),
    title: L(titleEn),
    subtitle: L(""),
    image: "",
    ctaLabel: L("Get a consultation"),
    ctaHref: "/contact",
  };
}

function child(slug, titleEn, order = 0) {
  return {
    slug,
    title: L(titleEn),
    metaTitle: L(""),
    metaDescription: L(""),
    hero: hero(titleEn),
    body: L(""),
    sections: [],
    relatedTitle: L(""),
    indexable: false,
    order,
  };
}

function hub(slug, titleEn, children = []) {
  return {
    slug,
    indexable: false,
    metaTitle: L(""),
    metaDescription: L(""),
    hero: hero(titleEn),
    body: L(""),
    sections: [],
    exploreTitle: L("Explore"),
    exploreSubtitle: L("Choose a focus area to continue."),
    servicesTitle: L("Services in this location"),
    servicesSubtitle: L("How we support homes and projects here."),
    children,
  };
}

const DEFAULT_IA_PAGES = {
  furniture: hub("furniture", "Furniture", [
    child("kitchens", "Kitchens", 0),
    child("wardrobes", "Wardrobes", 1),
    child("living-room", "Living Room", 2),
    child("bedrooms", "Bedrooms", 3),
    child("bathroom", "Bathroom", 4),
    child("dining", "Dining", 5),
    child("doors", "Doors", 6),
    child("whole-house", "Whole House", 7),
  ]),
  interiorDesign: hub("interior-design", "Interior Design", []),
  completeInteriors: hub("complete-interiors", "Complete Interiors", [
    child("villas", "Villas", 0),
    child("condos", "Condos", 1),
    child("hotels-resorts", "Hotels & Resorts", 2),
    child("developers", "Developers", 3),
  ]),
  services: hub("services", "Services", [
    child("custom-furniture", "Custom Furniture", 0),
    child("interior-design", "Interior Design", 1),
    child("furniture-packages", "Furniture Packages", 2),
    child("installation", "Installation", 3),
    child("renovation", "Renovation", 4),
  ]),
  locations: hub("locations", "Locations", [
    child("koh-samui", "Koh Samui", 0),
    child("phuket", "Phuket", 1),
    child("bangkok", "Bangkok", 2),
    child("pattaya", "Pattaya", 3),
    child("hua-hin", "Hua Hin", 4),
    child("chiang-mai", "Chiang Mai", 5),
  ]),
  forDevelopers: hub("for-developers", "For Developers", []),
  journal: hub("journal", "Journal", [
    child("kitchens", "Kitchens", 0),
    child("furniture", "Furniture", 1),
    child("materials", "Materials", 2),
    child("interior-design", "Interior Design", 3),
    child("villa-guides", "Villa Guides", 4),
    child("thailand-living", "Thailand Living", 5),
  ]),
  aboutBrand: hub("about", "About", [
    child("varsovia", "Varsovia", 0),
    child("livo", "Livo", 1),
    child("oppolia", "Oppolia", 2),
  ]),
};

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

/**
 * Deep-merge saved pages over defaults so new child slugs appear without wiping CMS edits.
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
    const children = (defHub.children || []).map((defChild) => {
      const s = bySlug.get(defChild.slug);
      if (!s) return { ...defChild, hero: { ...defChild.hero }, title: { ...defChild.title } };
      return {
        ...defChild,
        ...s,
        slug: defChild.slug,
        hero: { ...defChild.hero, ...(s.hero && typeof s.hero === "object" ? s.hero : {}) },
      };
    });
    // Keep any extra custom children admin added
    for (const s of savedChildren) {
      if (s?.slug && !children.some((c) => c.slug === s.slug)) {
        children.push(s);
      }
    }
    out[hubKey] = {
      ...defHub,
      ...saved,
      slug: defHub.slug,
      hero: { ...defHub.hero, ...(saved.hero && typeof saved.hero === "object" ? saved.hero : {}) },
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
