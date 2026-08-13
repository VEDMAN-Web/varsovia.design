import { DEFAULT_IA_PAGES, IA_HUB_PATHS } from "./iaPagesDefaults";
import { pickLocalized } from "./i18n/pickLocalized";
import type { Locale } from "./i18n/routing";

export type IaHero = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type IaContentSection = {
  heading?: string;
  text?: string;
  image?: string;
  imagePosition?: "left" | "right";
  layout?: "band" | "spotlight" | "editorial" | "overlay" | "rail";
};

export type IaChildPage = {
  slug: string;
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  body?: string;
  indexable?: boolean;
  order?: number;
  hero?: IaHero;
  /** Image + copy blocks below the intro (CMS / Admin). */
  sections?: IaContentSection[];
  /** Related projects / articles section heading */
  relatedTitle?: string;
  /** Service children: which location pages should list this service. */
  locationSlugs?: string[];
};

export type IaHubPage = {
  slug: string;
  indexable?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  body?: string;
  hero?: IaHero;
  sections?: IaContentSection[];
  exploreTitle?: string;
  exploreSubtitle?: string;
  /** Locations hub: headings for services list on city pages */
  servicesTitle?: string;
  servicesSubtitle?: string;
  children?: IaChildPage[];
};

export type IaHubKey = keyof typeof DEFAULT_IA_PAGES;

export { DEFAULT_IA_PAGES, IA_HUB_PATHS };

/** Resolve a plain string or `{ en, th, pl }` CMS map to one locale string. */
export function strField(value: unknown, fallback = "", locale: Locale | string = "en"): string {
  const loc = (locale === "th" || locale === "pl" || locale === "en" ? locale : "en") as Locale;
  const picked = pickLocalized(value, loc);
  if (picked) return picked;
  if (typeof value === "string") return value.trim() || fallback;
  return fallback;
}

function str(value: unknown, locale: Locale = "en"): string {
  return strField(value, "", locale);
}

function mergeStr(saved: unknown, def: unknown, locale: Locale = "en"): string {
  return str(saved, locale) || str(def, locale);
}

function mergeHero(
  saved: IaHero | undefined,
  def: IaHero | undefined,
  locale: Locale = "en",
): IaHero | undefined {
  const d = def || {};
  const s = saved || {};
  return {
    eyebrow: mergeStr(s.eyebrow, d.eyebrow, locale),
    title: mergeStr(s.title, d.title, locale),
    subtitle: mergeStr(s.subtitle, d.subtitle, locale),
    image: mergeStr(s.image, d.image, locale),
    ctaLabel: mergeStr(s.ctaLabel, d.ctaLabel, locale),
    ctaHref: mergeStr(s.ctaHref, d.ctaHref, locale) || "/contact",
  };
}

function normalizeSection(section: IaContentSection, locale: Locale = "en"): IaContentSection {
  const layoutRaw = typeof section.layout === "string" ? section.layout.trim() : "";
  const layouts = ["band", "spotlight", "editorial", "overlay", "rail"] as const;
  const layout = layouts.find((l) => l === layoutRaw);
  return {
    heading: str(section.heading, locale),
    text: str(section.text, locale),
    image: str(section.image, locale),
    imagePosition:
      section.imagePosition === "right" || section.imagePosition === "left"
        ? section.imagePosition
        : undefined,
    layout,
  };
}

function sectionHasContent(section: IaContentSection, locale: Locale = "en"): boolean {
  const n = normalizeSection(section, locale);
  return Boolean(n.heading || n.text || n.image);
}

function mergeSections(
  saved: IaContentSection[] | undefined,
  def: IaContentSection[] | undefined,
  locale: Locale = "en",
): IaContentSection[] {
  const fallback = (def || []).map((s) => normalizeSection(s, locale));
  if (!saved?.length) return fallback;
  if (!saved.some((s) => sectionHasContent(s, locale))) return fallback;
  return saved.map((s) => normalizeSection(s, locale));
}

function mergeChild(
  defChild: IaChildPage,
  savedChild: IaChildPage | undefined,
  locale: Locale = "en",
): IaChildPage {
  const s: Partial<IaChildPage> = savedChild ?? {};
  return {
    ...defChild,
    ...s,
    slug: defChild.slug,
    title: mergeStr(s.title, defChild.title, locale),
    metaTitle: mergeStr(s.metaTitle, defChild.metaTitle, locale),
    metaDescription: mergeStr(s.metaDescription, defChild.metaDescription, locale),
    body: mergeStr(s.body, defChild.body, locale),
    relatedTitle: mergeStr(s.relatedTitle, defChild.relatedTitle, locale),
    hero: mergeHero(s.hero, defChild.hero, locale),
    sections: mergeSections(s.sections, defChild.sections, locale),
    indexable: s.indexable === true,
    order: s.order ?? defChild.order ?? 0,
    locationSlugs:
      s.locationSlugs && s.locationSlugs.length ? s.locationSlugs : defChild.locationSlugs,
  };
}

/** Merge CMS pages over defaults; empty saved strings do not wipe seed copy. */
export function getIaPages(
  site: { pages?: unknown } | null | undefined,
  locale: Locale | string = "en",
): Record<string, IaHubPage> {
  const loc = (locale === "th" || locale === "pl" || locale === "en" ? locale : "en") as Locale;
  const raw =
    site?.pages && typeof site.pages === "object"
      ? (site.pages as Record<string, IaHubPage>)
      : {};
  const out: Record<string, IaHubPage> = {};
  for (const key of Object.keys(DEFAULT_IA_PAGES) as IaHubKey[]) {
    const def = DEFAULT_IA_PAGES[key] as unknown as IaHubPage;
    const saved = raw[key];
    if (!saved || typeof saved !== "object") {
      out[key] = {
        ...def,
        metaTitle: str(def.metaTitle, loc),
        metaDescription: str(def.metaDescription, loc),
        body: str(def.body, loc),
        exploreTitle: str(def.exploreTitle, loc),
        exploreSubtitle: str(def.exploreSubtitle, loc),
        servicesTitle: str(def.servicesTitle, loc),
        servicesSubtitle: str(def.servicesSubtitle, loc),
        hero: mergeHero(def.hero, undefined, loc),
        sections: mergeSections(def.sections, undefined, loc),
        children: (def.children || []).map((c) => mergeChild(c, undefined, loc)),
      };
      continue;
    }
    const savedChildren = Array.isArray(saved.children) ? saved.children : [];
    const bySlug = new Map(
      savedChildren
        .filter((c) => c && typeof c.slug === "string" && c.slug)
        .map((c) => [c.slug, c]),
    );
    const children = (def.children || []).map((defChild) =>
      mergeChild(defChild, bySlug.get(defChild.slug), loc),
    );
    for (const s of savedChildren) {
      if (s?.slug && !children.some((c) => c.slug === s.slug)) {
        children.push(mergeChild({ slug: s.slug }, s, loc));
      }
    }
    out[key] = {
      ...def,
      ...saved,
      slug: def.slug,
      metaTitle: mergeStr(saved.metaTitle, def.metaTitle, loc),
      metaDescription: mergeStr(saved.metaDescription, def.metaDescription, loc),
      body: mergeStr(saved.body, def.body, loc),
      exploreTitle: mergeStr(saved.exploreTitle, def.exploreTitle, loc),
      exploreSubtitle: mergeStr(saved.exploreSubtitle, def.exploreSubtitle, loc),
      servicesTitle: mergeStr(saved.servicesTitle, def.servicesTitle, loc),
      servicesSubtitle: mergeStr(saved.servicesSubtitle, def.servicesSubtitle, loc),
      hero: mergeHero(saved.hero, def.hero, loc),
      sections: mergeSections(saved.sections, def.sections, loc),
      indexable: saved.indexable === true,
      children,
    };
  }
  return out;
}

export function getIaHub(
  site: { pages?: unknown } | null | undefined,
  hubKey: IaHubKey,
  locale: Locale | string = "en",
): IaHubPage {
  return getIaPages(site, locale)[hubKey];
}

export function getIaChild(
  site: { pages?: unknown } | null | undefined,
  hubKey: IaHubKey,
  childSlug: string,
  locale: Locale | string = "en",
): IaChildPage | null {
  const hub = getIaHub(site, hubKey, locale);
  const children = Array.isArray(hub.children) ? hub.children : [];
  return children.find((c) => c.slug === childSlug) || null;
}

export function hubPath(hubKey: IaHubKey): string {
  return IA_HUB_PATHS[hubKey] || `/${hubKey}`;
}

export function childPath(hubKey: IaHubKey, slug: string): string {
  if (hubKey === "journal") return `/journal/topic/${slug}`;
  if (hubKey === "aboutBrand") return `/about/${slug}`;
  return `${hubPath(hubKey)}/${slug}`;
}
