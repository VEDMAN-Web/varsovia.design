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

/** Merge CMS pages over defaults so missing/empty children still resolve known slugs. */
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
    const children = (def.children || []).map((defChild) => {
      const s = bySlug.get(defChild.slug);
      if (!s) return defChild;
      return {
        ...defChild,
        ...s,
        slug: defChild.slug,
        hero: { ...(defChild.hero || {}), ...(s.hero || {}) },
        sections: Array.isArray(s.sections) ? s.sections : defChild.sections || [],
      };
    });
    for (const s of savedChildren) {
      if (s?.slug && !children.some((c) => c.slug === s.slug)) children.push(s);
    }
    out[key] = {
      ...def,
      ...saved,
      slug: def.slug,
      hero: { ...(def.hero || {}), ...(saved.hero || {}) },
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

export function str(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "en" in (value as object)) {
    return String((value as { en?: string }).en || fallback);
  }
  return fallback;
}
