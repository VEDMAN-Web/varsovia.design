import { DEFAULT_IA_PAGES, IA_HUB_PATHS, iaPagesForLocale } from "./iaPagesDefaults";
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
  /** Location city pages: heading above the services cards. */
  servicesTitle?: string;
  servicesSubtitle?: string;
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
  /** Blog detail footer — Contact Varsovia band */
  articleContact?: IaArticleCta;
  /** Blog detail footer — Designed around you / Get Offers band */
  articleOffer?: IaArticleOffer;
};

export type IaArticleCta = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type IaArticleOffer = {
  eyebrow?: string;
  title?: string;
  text?: string;
  points?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  image?: string;
  imageAlt?: string;
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

/** URL slug from a string or `{ en, th, pl }` CMS accident. */
export function normalizeIaSlug(value: unknown): string {
  const raw =
    typeof value === "string"
      ? value
      : value && typeof value === "object" && !Array.isArray(value)
        ? String(
            (value as { en?: unknown; th?: unknown; pl?: unknown }).en ||
              (value as { th?: unknown }).th ||
              (value as { pl?: unknown }).pl ||
              "",
          )
        : "";
  try {
    return decodeURIComponent(raw)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/^\/+|\/+$/g, "");
  } catch {
    return raw.trim().toLowerCase().replace(/\s+/g, "-");
  }
}

function str(value: unknown, locale: Locale = "en"): string {
  return strField(value, "", locale);
}

function mergeStr(saved: unknown, def: unknown, locale: Locale = "en"): string {
  return str(saved, locale) || str(def, locale);
}

function isStaleLocationMeta(value: unknown): boolean {
  const blob =
    typeof value === "string"
      ? value
      : value && typeof value === "object"
        ? Object.values(value as Record<string, unknown>)
            .map((v) => String(v || ""))
            .join(" ")
        : "";
  return /premium interiors and furniture craftsmanship across Thailand/i.test(blob);
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

function mergeArticleContact(
  saved: IaArticleCta | undefined,
  def: IaArticleCta | undefined,
  locale: Locale = "en",
): IaArticleCta | undefined {
  if (!saved && !def) return undefined;
  const d = def || {};
  const s = saved || {};
  return {
    title: mergeStr(s.title, d.title, locale),
    subtitle: mergeStr(s.subtitle, d.subtitle, locale),
    ctaLabel: mergeStr(s.ctaLabel, d.ctaLabel, locale),
    ctaHref: mergeStr(s.ctaHref, d.ctaHref, locale) || "/contact",
  };
}

function mergeArticleOffer(
  saved: IaArticleOffer | undefined,
  def: IaArticleOffer | undefined,
  locale: Locale = "en",
): IaArticleOffer | undefined {
  if (!saved && !def) return undefined;
  const d = def || {};
  const s = saved || {};
  const defPoints = Array.isArray(d.points) ? d.points : [];
  const savedPoints = Array.isArray(s.points) ? s.points : [];
  const points = (
    savedPoints.some((p) => str(p, locale))
      ? savedPoints.map((p, i) => mergeStr(p, defPoints[i], locale))
      : defPoints.map((p) => str(p, locale))
  ).filter(Boolean);
  return {
    eyebrow: mergeStr(s.eyebrow, d.eyebrow, locale),
    title: mergeStr(s.title, d.title, locale),
    text: mergeStr(s.text, d.text, locale),
    points,
    ctaLabel: mergeStr(s.ctaLabel, d.ctaLabel, locale),
    ctaHref: mergeStr(s.ctaHref, d.ctaHref, locale) || "/contact",
    image: mergeStr(s.image, d.image, locale),
    imageAlt: mergeStr(s.imageAlt, d.imageAlt, locale),
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
  const title = mergeStr(s.title, defChild.title, locale);
  const hero = mergeHero(s.hero, defChild.hero, locale) || {};
  const seedTitle = str(defChild.title, locale);
  const seedHeroTitle = str(defChild.hero?.title, locale);
  if (title && title !== seedTitle && (!hero.title || hero.title === seedHeroTitle)) {
    hero.title = title;
  }
  return {
    ...defChild,
    ...s,
    slug: defChild.slug,
    title,
    metaTitle: mergeStr(s.metaTitle, defChild.metaTitle, locale),
    metaDescription: isStaleLocationMeta(s.metaDescription)
      ? mergeStr("", defChild.metaDescription, locale)
      : mergeStr(s.metaDescription, defChild.metaDescription, locale),
    body: mergeStr(s.body, defChild.body, locale),
    relatedTitle: mergeStr(s.relatedTitle, defChild.relatedTitle, locale),
    servicesTitle: mergeStr(s.servicesTitle, defChild.servicesTitle, locale),
    servicesSubtitle: mergeStr(s.servicesSubtitle, defChild.servicesSubtitle, locale),
    hero,
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
  const defaults = iaPagesForLocale(loc);
  for (const key of Object.keys(defaults) as IaHubKey[]) {
    const def = defaults[key] as unknown as IaHubPage;
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
        hero: mergeHero(undefined, def.hero, loc),
        sections: mergeSections(undefined, def.sections, loc),
        articleContact: mergeArticleContact(undefined, def.articleContact, loc),
        articleOffer: mergeArticleOffer(undefined, def.articleOffer, loc),
        children: (def.children || []).map((c) => mergeChild(c, undefined, loc)),
      };
      continue;
    }
    const savedChildren = Array.isArray(saved.children) ? saved.children : [];
    const bySlug = new Map<string, IaChildPage>();
    for (const child of savedChildren) {
      const slug = normalizeIaSlug(child?.slug);
      if (!slug) continue;
      bySlug.set(slug, { ...child, slug });
    }
    const children = (def.children || []).map((defChild) => {
      const slug = normalizeIaSlug(defChild.slug);
      return mergeChild({ ...defChild, slug }, bySlug.get(slug), loc);
    });
    for (const extra of savedChildren) {
      const slug = normalizeIaSlug(extra?.slug);
      if (slug && !children.some((c) => normalizeIaSlug(c.slug) === slug)) {
        children.push(mergeChild({ slug }, { ...extra, slug }, loc));
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
      articleContact: mergeArticleContact(saved.articleContact, def.articleContact, loc),
      articleOffer: mergeArticleOffer(saved.articleOffer, def.articleOffer, loc),
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
  const loc = (locale === "th" || locale === "pl" || locale === "en" ? locale : "en") as Locale;
  return (
    getIaPages(site, loc)[hubKey] ||
    (iaPagesForLocale(loc)[hubKey] as unknown as IaHubPage)
  );
}

export function getIaChild(
  site: { pages?: unknown } | null | undefined,
  hubKey: IaHubKey,
  childSlug: string,
  locale: Locale | string = "en",
): IaChildPage | null {
  const loc = (locale === "th" || locale === "pl" || locale === "en" ? locale : "en") as Locale;
  const wanted = normalizeIaSlug(childSlug);
  if (!wanted) return null;

  const hub = getIaHub(site, hubKey, loc);
  const children = Array.isArray(hub?.children) ? hub.children : [];
  const found = children.find((c) => normalizeIaSlug(c.slug) === wanted);
  if (found) return { ...found, slug: wanted };

  const seedHub = iaPagesForLocale(loc)[hubKey] as IaHubPage | undefined;
  const seedChild = (seedHub?.children || []).find((c) => normalizeIaSlug(c.slug) === wanted);
  if (!seedChild) return null;
  return mergeChild({ ...seedChild, slug: wanted }, undefined, loc);
}

export function hubPath(hubKey: IaHubKey): string {
  return IA_HUB_PATHS[hubKey] || `/${hubKey}`;
}

export function childPath(hubKey: IaHubKey, slug: string): string {
  if (hubKey === "journal") return `/journal/topic/${slug}`;
  if (hubKey === "aboutBrand") return `/about/${slug}`;
  return `${hubPath(hubKey)}/${slug}`;
}
