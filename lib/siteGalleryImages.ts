import { resolveMediaUrl } from "./mediaAssets";

/** Build a fixed-length gallery from CMS URLs, cycling when fewer than `count` are set. */
export function galleryFromCms(
  urls: string[] | undefined,
  count: number,
  fallbacks: readonly string[],
): string[] {
  const cleaned = (urls ?? []).map((u) => String(u).trim()).filter(Boolean);
  const pool = cleaned.length > 0 ? cleaned : [...fallbacks];
  if (pool.length === 0) return [];

  return Array.from({ length: count }, (_, i) =>
    resolveMediaUrl(pool[i % pool.length], fallbacks[i % fallbacks.length] ?? pool[0]),
  );
}
