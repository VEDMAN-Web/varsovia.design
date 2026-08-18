/** Figma showcase detail — image bands (Kitchen / Bathroom) */
export const SHOWCASE_GALLERY_RADIUS = "rounded-[12px] md:rounded-[16px]";

/** Vertical gap between images within a section */
export const SHOWCASE_GALLERY_GAP = "gap-8 md:gap-[30px]";

/** Section title → first image (~32–40px) */
export const SHOWCASE_GALLERY_TITLE_MB = "mb-8 md:mb-10";

export const SHOWCASE_GALLERY_SECTION_TITLE =
  `font-outfit ${SHOWCASE_GALLERY_TITLE_MB} text-left text-[clamp(1.375rem,2.2vw,1.75rem)] font-bold leading-[1.15] tracking-[-0.01em] text-[#2d2929]`;

/** Space between Kitchen and Bathroom sections */
export const SHOWCASE_GALLERY_SECTION_SPACING = "mb-[clamp(3.5rem,8vw,5rem)] last:mb-0";

export const SHOWCASE_GALLERY_FRAME_SHADOW =
  "shadow-[0_4px_28px_rgba(42,34,34,0.06)]";

export const SHOWCASE_GALLERY_SLOTS = 10;
export const SHOWCASE_GALLERY_FALLBACK = "/Interior-kitchen/kitchen1.png";

const FALLBACK_IMAGE = SHOWCASE_GALLERY_FALLBACK;

/**
 * Expand CMS gallery into the 10 URLs live /projects/[id] paints
 * (Kitchen hero + 4 bento, Bathroom hero + 4 bento). Idempotent when already 10.
 */
export function padShowcaseGallery(gallery: string[] | undefined, cover: string): string[] {
  const raw = Array.isArray(gallery) ? gallery.map((url) => String(url || "").trim()) : [];
  const coverUrl = String(cover || "").trim();
  const pool = raw.filter(Boolean);
  if (!pool.length && coverUrl) pool.push(coverUrl);
  if (!pool.length) pool.push(FALLBACK_IMAGE);
  const out: string[] = [];
  for (let i = 0; i < SHOWCASE_GALLERY_SLOTS; i++) {
    out.push(raw[i] || pool[i % pool.length] || FALLBACK_IMAGE);
  }
  return out;
}

/** Five images per Figma room block: hero + 4 bento tiles. Kitchen = 0, Bathroom = 1. */
export function resolveShowcaseRoomImages(
  gallery: string[],
  sectionIndex: 0 | 1,
  fallback: string,
): string[] {
  const padded = padShowcaseGallery(gallery, fallback);
  return padded.slice(sectionIndex * 5, sectionIndex * 5 + 5);
}
