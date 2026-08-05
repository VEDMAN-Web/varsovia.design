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

const FALLBACK_IMAGE = "/Interior-kitchen/kitchen1.png";

/** Five images per Figma room block: hero + 4 bento tiles. Kitchen = 0, Bathroom = 1. */
export function resolveShowcaseRoomImages(
  gallery: string[],
  sectionIndex: 0 | 1,
  fallback: string,
): string[] {
  const start = sectionIndex * 5;
  const pool = gallery.length > 0 ? gallery : [fallback || FALLBACK_IMAGE];
  const out: string[] = [];
  for (let i = 0; i < 5; i++) {
    out.push(pool[start + i] ?? pool[(start + i) % pool.length] ?? fallback);
  }
  return out;
}
