import { DEFAULT_IA_PAGES, IA_HUB_PATHS } from "./iaPagesDefaults";

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

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function mergeStr(saved: unknown, def: unknown): string {
  return str(saved) || str(def);
}

function mergeHero(saved: IaHero | undefined, def: IaHero | undefined): IaHero | undefined {
  const d = def || {};
  const s = saved || {};
  return {
    ...d,
    ...s,
    eyebrow: mergeStr(s.eyebrow, d.eyebrow),
    title: mergeStr(s.title, d.title),
    subtitle: mergeStr(s.subtitle, d.subtitle),
    image: mergeStr(s.image, d.image),
    ctaLabel: mergeStr(s.ctaLabel, d.ctaLabel),
    ctaHref: mergeStr(s.ctaHref, d.ctaHref) || "/contact",
  };
}

function sectionHasContent(section: IaContentSection): boolean {
  return Boolean(str(section.heading) || str(section.text) || str(section.image));
}

function mergeSections(
  saved: IaContentSection[] | undefined,
  def: IaContentSection[] | undefined,
): IaContentSection[] {
  if (!saved?.length) return def || [];
  if (!saved.some(sectionHasContent)) return def || [];
  return saved;
}

function mergeChild(defChild: IaChildPage, savedChild: IaChildPage | undefined): IaChildPage {
  const s: Partial<IaChildPage> = savedChild ?? {};
  return {
    ...defChild,
    ...s,
    slug: defChild.slug,
    title: mergeStr(s.title, defChild.title),
    metaTitle: mergeStr(s.metaTitle, defChild.metaTitle),
    metaDescription: mergeStr(s.metaDescription, defChild.metaDescription),
    body: mergeStr(s.body, defChild.body),
    relatedTitle: mergeStr(s.relatedTitle, defChild.relatedTitle),
    hero: mergeHero(s.hero, defChild.hero),
    sections: mergeSections(s.sections, defChild.sections),
    indexable: s.indexable === true,
    order: s.order ?? defChild.order ?? 0,
    locationSlugs:
      s.locationSlugs && s.locationSlugs.length ? s.locationSlugs : defChild.locationSlugs,
  };
}

/** Merge CMS pages over defaults; empty saved strings do not wipe seed copy. */
export function getIaPages(site: { pages?: unknown } | null | undefined): Record<string, IaHubPage> {
  const raw =
    site?.pages && typeof site.pages === "object"
      ? (site.pages as Record<string, IaHubPage>)
      : {};
  const out: Record<string, IaHubPage> = {};
  for (const key of Object.keys(DEFAULT_IA_PAGES) as IaHubKey[]) {
    const def = DEFAULT_IA_PAGES[key] as unknown as IaHubPage;
    const saved = raw[key];
    if (!saved || typeof saved !== "object") {
      out[key] = def;
      continue;
    }
    const savedChildren = Array.isArray(saved.children) ? saved.children : [];
    const bySlug = new Map(
      savedChildren
        .filter((c) => c && typeof c.slug === "string" && c.slug)
        .map((c) => [c.slug, c]),
    );
    const children = (def.children || []).map((defChild) =>
      mergeChild(defChild, bySlug.get(defChild.slug)),
    );
    for (const s of savedChildren) {
      if (s?.slug && !children.some((c) => c.slug === s.slug)) children.push(s);
    }
    out[key] = {
      ...def,
      ...saved,
      slug: def.slug,
      metaTitle: mergeStr(saved.metaTitle, def.metaTitle),
      metaDescription: mergeStr(saved.metaDescription, def.metaDescription),
      body: mergeStr(saved.body, def.body),
      exploreTitle: mergeStr(saved.exploreTitle, def.exploreTitle),
      exploreSubtitle: mergeStr(saved.exploreSubtitle, def.exploreSubtitle),
      servicesTitle: mergeStr(saved.servicesTitle, def.servicesTitle),
      servicesSubtitle: mergeStr(saved.servicesSubtitle, def.servicesSubtitle),
      hero: mergeHero(saved.hero, def.hero),
      sections: mergeSections(saved.sections, def.sections),
      indexable: saved.indexable === true,
      children,
    };
  }
  return out;
}

export function getIaHub(site: { pages?: unknown } | null | undefined, hubKey: IaHubKey): IaHubPage {
  return getIaPages(site)[hubKey];
}

export function getIaChild(
  site: { pages?: unknown } | null | undefined,
  hubKey: IaHubKey,
  childSlug: string,
): IaChildPage | null {
  const hub = getIaHub(site, hubKey);
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

export function strField(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "en" in (value as object)) {
    return String((value as { en?: string }).en || fallback);
  }
  return fallback;
}
