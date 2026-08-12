/** Journal topic hubs (Group A) — must match IA `pages.journal.children` slugs. */
export const JOURNAL_TOPICS = [
  { slug: "kitchens", label: "Kitchens" },
  { slug: "furniture", label: "Furniture" },
  { slug: "materials", label: "Materials" },
  { slug: "interior-design", label: "Interior Design" },
  { slug: "villa-guides", label: "Villa Guides" },
  { slug: "thailand-living", label: "Thailand Living" },
] as const;

export type JournalTopicSlug = (typeof JOURNAL_TOPICS)[number]["slug"];

export function slugifyTopicLabel(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function matchJournalTopicSlug(category: string | undefined | null): JournalTopicSlug | null {
  if (!category) return null;
  const raw = category.trim();
  if (!raw) return null;
  const asSlug = slugifyTopicLabel(raw);
  const hit = JOURNAL_TOPICS.find(
    (t) => t.slug === asSlug || slugifyTopicLabel(t.label) === asSlug,
  );
  return hit?.slug ?? null;
}

export function blogMatchesJournalTopic(
  category: string | undefined | null,
  topicSlug: string,
): boolean {
  const matched = matchJournalTopicSlug(category);
  return matched === topicSlug || slugifyTopicLabel(String(category || "")) === topicSlug;
}
