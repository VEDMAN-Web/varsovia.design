/** Furniture IA child slug ↔ interior catalogue category / showcase tag helpers. */

export const FURNITURE_SLUGS = [
  "kitchens",
  "wardrobes",
  "living-room",
  "bedrooms",
  "bathroom",
  "dining",
  "doors",
  "whole-house",
] as const;

export type FurnitureSlug = (typeof FURNITURE_SLUGS)[number];

const SLUG_TO_INTERIOR_CATEGORY: Record<FurnitureSlug, string[]> = {
  kitchens: ["Kitchen"],
  wardrobes: ["Bedroom", "Furniture"],
  "living-room": ["Furniture"],
  bedrooms: ["Bedroom"],
  bathroom: ["Bathroom"],
  dining: ["Furniture"],
  doors: ["Door & Windows"],
  "whole-house": ["Whole House Solutions"],
};

export function interiorCategoriesForFurnitureSlug(slug: string): string[] {
  return SLUG_TO_INTERIOR_CATEGORY[slug as FurnitureSlug] || [];
}

export function normalizeFurnitureSlug(value: unknown): FurnitureSlug | null {
  const raw = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  return (FURNITURE_SLUGS as readonly string[]).includes(raw)
    ? (raw as FurnitureSlug)
    : null;
}

/** Location slug aliases for soft matching project/showcase location fields. */
const LOCATION_ALIASES: Record<string, string[]> = {
  "koh-samui": ["koh samui", "samui", "ko samui", "mae nam"],
  phuket: ["phuket", "patong", "karon", "kata"],
  bangkok: ["bangkok", "sukhumvit", "siam"],
  pattaya: ["pattaya", "jomtien", "chonburi", "chon buri"],
  "hua-hin": ["hua hin", "huahin", "prachuap"],
  "chiang-mai": ["chiang mai", "chiangmai", "nimman"],
};

export function locationMatchesSlug(locationValue: unknown, locationSlug: string): boolean {
  const hay = String(locationValue || "")
    .trim()
    .toLowerCase();
  if (!hay) return false;
  const aliases = LOCATION_ALIASES[locationSlug] || [
    locationSlug.replace(/-/g, " "),
    locationSlug.split("-")[0] || locationSlug,
  ];
  return aliases.some((a) => hay.includes(a));
}
