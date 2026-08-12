/** Stable URL slugs for mock interior catalog items (id → slug). */
export const INTERIOR_MOCK_SLUGS: Record<string, string> = {
  "1": "obsidian-black-kitchen",
  "2": "skyline-apartment",
  "3": "obsidian-black-island",
  "4": "obsidian-black-l-shape",
  "5": "obsidian-black-gloss",
  "6": "obsidian-black-traditional",
  "7": "serene-nest",
  "8": "linen-suite",
  "9": "urban-loft-bedroom",
  "10": "velvet-haven",
  "11": "spa-mist",
  "12": "marble-retreat",
  "13": "compact-bath",
  "14": "frame-light",
  "15": "heritage-door",
  "16": "garden-view",
  "17": "complete-home-edit",
  "18": "family-flow-plan",
  "19": "apartment-refresh",
  "20": "signature-sofa",
  "21": "dining-set",
  "22": "storage-console",
  "23": "reading-lounge-chair",
  "24": "oak-sideboard",
};

export function slugifyInteriorTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function interiorMockSlugForId(id: string): string | undefined {
  return INTERIOR_MOCK_SLUGS[id];
}

export type InteriorLinkSource = {
  slug?: string | null;
  _id?: string | null;
  id?: string | null;
  title?: string | null;
};

/** Public detail URL segment — always prefer CMS/mock slug over numeric or Mongo id. */
export function interiorDetailSlug(project: InteriorLinkSource): string {
  const explicit = typeof project.slug === "string" ? project.slug.trim() : "";
  if (explicit) return explicit;

  const id = String(project._id ?? project.id ?? "");
  const mockSlug = id ? interiorMockSlugForId(id) : undefined;
  if (mockSlug) return mockSlug;

  const title = typeof project.title === "string" ? project.title.trim() : "";
  if (title) {
    const fromTitle = slugifyInteriorTitle(title);
    if (fromTitle) return fromTitle;
  }

  return id;
}

export function interiorDetailPath(project: InteriorLinkSource): string {
  return `/interior-design/${interiorDetailSlug(project)}`;
}

/** Prefer CMS seed numeric ids (live DB), then mock catalog ids 9–24. */
import { CMS_FALLBACK_NUMERIC_SLUGS } from "./cmsInteriorSeedSlugs";

export function legacyInteriorSlugRedirect(param: string): string | null {
  if (!/^\d{1,3}$/.test(param)) return null;
  if (param in CMS_FALLBACK_NUMERIC_SLUGS) {
    return CMS_FALLBACK_NUMERIC_SLUGS[param];
  }
  if (param in INTERIOR_MOCK_SLUGS) {
    return INTERIOR_MOCK_SLUGS[param];
  }
  return null;
}

export function isLegacyInteriorNumericId(param: string): boolean {
  return legacyInteriorSlugRedirect(param) !== null;
}

export function allLegacyInteriorNumericRedirects(): Record<string, string> {
  const out: Record<string, string> = { ...CMS_FALLBACK_NUMERIC_SLUGS };
  for (const [id, slug] of Object.entries(INTERIOR_MOCK_SLUGS)) {
    if (!(id in out)) out[id] = slug;
  }
  return out;
}
