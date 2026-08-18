/**
 * Frontend mirror of backend IA seed (EN slice for fallbacks).
 * Source of truth: Varsovia-Backend/src/data/iaPagesSeedContent.js
 */
import seedRaw from "./iaPagesSeed.json";

export const IA_HUB_PATHS: Record<string, string> = {
  furniture: "/furniture",
  interiorDesign: "/interior-design",
  completeInteriors: "/complete-interiors",
  services: "/services",
  locations: "/locations",
  forDevelopers: "/for-developers",
  journal: "/journal",
  aboutBrand: "/about",
};

function pickLoc(value: unknown, locale = "en"): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, string>;
    return String(obj[locale] || obj.en || "").trim();
  }
  return "";
}

function localizeHero(raw: unknown, locale = "en") {
  if (!raw || typeof raw !== "object") return undefined;
  const h = raw as Record<string, unknown>;
  return {
    eyebrow: pickLoc(h.eyebrow, locale),
    title: pickLoc(h.title, locale),
    subtitle: pickLoc(h.subtitle, locale),
    image: typeof h.image === "string" ? h.image : "",
    ctaLabel: pickLoc(h.ctaLabel, locale),
    ctaHref: typeof h.ctaHref === "string" ? h.ctaHref : "/contact",
  };
}

function localizeSections(raw: unknown, locale = "en") {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((s) => s && typeof s === "object")
    .map((s) => {
      const sec = s as Record<string, unknown>;
      return {
        heading: pickLoc(sec.heading, locale),
        text: pickLoc(sec.text, locale),
        image: typeof sec.image === "string" ? sec.image : "",
        imagePosition:
          sec.imagePosition === "right" || sec.imagePosition === "left"
            ? sec.imagePosition
            : undefined,
        layout:
          typeof sec.layout === "string" && sec.layout.trim()
            ? sec.layout
            : undefined,
      };
    });
}

function localizeChild(raw: unknown, locale = "en") {
  const c = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    slug: typeof c.slug === "string" ? c.slug : "",
    title: pickLoc(c.title, locale),
    metaTitle: pickLoc(c.metaTitle, locale),
    metaDescription: pickLoc(c.metaDescription, locale),
    body: pickLoc(c.body, locale),
    relatedTitle: pickLoc(c.relatedTitle, locale),
    servicesTitle: pickLoc(c.servicesTitle, locale),
    servicesSubtitle: pickLoc(c.servicesSubtitle, locale),
    hero: localizeHero(c.hero, locale),
    sections: localizeSections(c.sections, locale),
    indexable: c.indexable === true,
    order: typeof c.order === "number" ? c.order : 0,
    locationSlugs: Array.isArray(c.locationSlugs)
      ? c.locationSlugs.map((s) => String(s || "").trim()).filter(Boolean)
      : undefined,
  };
}

function localizeHub(raw: unknown, locale = "en") {
  const h = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const children = Array.isArray(h.children)
    ? h.children.map((c) => localizeChild(c, locale))
    : [];
  return {
    slug: typeof h.slug === "string" ? h.slug : "",
    indexable: h.indexable === true,
    metaTitle: pickLoc(h.metaTitle, locale),
    metaDescription: pickLoc(h.metaDescription, locale),
    body: pickLoc(h.body, locale),
    exploreTitle: pickLoc(h.exploreTitle, locale),
    exploreSubtitle: pickLoc(h.exploreSubtitle, locale),
    servicesTitle: pickLoc(h.servicesTitle, locale),
    servicesSubtitle: pickLoc(h.servicesSubtitle, locale),
    hero: localizeHero(h.hero, locale),
    sections: localizeSections(h.sections, locale),
    children,
  };
}

const seed = seedRaw as Record<string, unknown>;

export const DEFAULT_IA_PAGES = Object.fromEntries(
  Object.keys(IA_HUB_PATHS).map((key) => [key, localizeHub(seed[key], "en")]),
);
