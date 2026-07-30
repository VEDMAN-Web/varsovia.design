import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";

const COMPOSITE_CATALOG_PATHS = new Set<string>(MEDIA.catalogues);

/** Composite catalogue JPEGs include baked-in type — use kitchen photos for carousel/notebook covers. */
export function catalogueCoverPhoto(
  coverOrImage: string | undefined,
  index: number,
  preferredPhoto?: string,
): string {
  const fallback = preferredPhoto ?? MEDIA.catalogues[index % MEDIA.catalogues.length];
  const resolved = resolveMediaUrl(coverOrImage, fallback);

  if (COMPOSITE_CATALOG_PATHS.has(resolved) || /\/catalog\/catalog-\d+\.jpg/i.test(resolved)) {
    return preferredPhoto ?? MEDIA.featured[index % MEDIA.featured.length];
  }

  return resolved;
}
