/** Location ↔ service affinities for Group A location pages (§3.2). */

import type { FurnitureSlug } from "./furnitureTaxonomy";

/** Default service slugs offered in each market when CMS locationSlugs is empty. */
export const LOCATION_SERVICE_AFFINITY: Record<string, string[]> = {
  "koh-samui": [
    "custom-furniture",
    "furniture-packages",
    "interior-design",
    "installation",
  ],
  phuket: [
    "custom-furniture",
    "furniture-packages",
    "interior-design",
    "installation",
    "renovation",
  ],
  bangkok: ["interior-design", "custom-furniture", "renovation", "installation"],
  pattaya: ["furniture-packages", "custom-furniture", "installation", "renovation"],
  "hua-hin": ["furniture-packages", "interior-design", "custom-furniture", "installation"],
  "chiang-mai": ["interior-design", "custom-furniture", "renovation", "furniture-packages"],
};

/** Core services shown on every location if affinity filter yields nothing. */
const FALLBACK_SERVICES = ["custom-furniture", "interior-design", "installation"];

export type ServiceChildLike = {
  slug: string;
  title?: string;
  locationSlugs?: unknown;
};

/**
 * Pick services relevant to a location page.
 * Prefer CMS `locationSlugs` on the service child when set;
 * otherwise use LOCATION_SERVICE_AFFINITY; never dump the full list.
 */
export function servicesForLocationSlug(
  locationSlug: string,
  services: ServiceChildLike[],
  limit = 6,
): ServiceChildLike[] {
  if (!Array.isArray(services) || services.length === 0) return [];

  const withCms = services.filter((s) => {
    const tags = normalizeLocationSlugList(s.locationSlugs);
    return tags.length > 0 && tags.includes(locationSlug);
  });

  if (withCms.length > 0) return withCms.slice(0, limit);

  const affinity = LOCATION_SERVICE_AFFINITY[locationSlug] || FALLBACK_SERVICES;
  const affinitySet = new Set(affinity);
  const matched = services.filter((s) => s.slug && affinitySet.has(s.slug));
  if (matched.length > 0) {
    // Preserve affinity order
    return affinity
      .map((slug) => matched.find((s) => s.slug === slug))
      .filter(Boolean)
      .slice(0, limit) as ServiceChildLike[];
  }

  return services.filter((s) => FALLBACK_SERVICES.includes(s.slug)).slice(0, limit);
}

export function normalizeLocationSlugList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => String(v || "").trim().toLowerCase())
    .filter(Boolean);
}

/** Seed defaults: which locations each furniture product line typically serves. */
export function defaultLocationSlugsForFurniture(_slug: FurnitureSlug | string): string[] {
  return Object.keys(LOCATION_SERVICE_AFFINITY);
}
