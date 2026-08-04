/** Canonical interior project slugs from backend seed (`projectsDocs`) — matches live CMS when seeded. */
export const CMS_INTERIOR_SEED_SLUGS = [
  "amber-residence",
  "skyline-apartment",
  "warm-walnut",
  "ivory-luxe",
  "graphite-studio",
  "coastal-oak",
  "midnight-suite",
  "open-living",
] as const;

export type CmsInteriorSeedSlug = (typeof CMS_INTERIOR_SEED_SLUGS)[number];

/** Legacy `/interior/1` … `/interior/8` when listing used numeric `_id` with seed-shaped fallback data. */
export const CMS_FALLBACK_NUMERIC_SLUGS: Record<string, CmsInteriorSeedSlug> = {
  "1": "amber-residence",
  "2": "skyline-apartment",
  "3": "warm-walnut",
  "4": "ivory-luxe",
  "5": "graphite-studio",
  "6": "coastal-oak",
  "7": "midnight-suite",
  "8": "open-living",
};
