import { CAROUSEL_CARD_FIGMA } from "@/components/catalogue/catalogueCarouselTypography";

/**
 * Figma FREE CATALOGUE — compact circular carousel (node 10:5320 card, home row).
 * Horizontal spacing = card width + fixed gap; vertical arc is shallow (“short” curve).
 */
export const HOME_CATALOGUE_CAROUSEL_FIGMA = {
  cardWidth: CAROUSEL_CARD_FIGMA.width,
  cardHeight: CAROUSEL_CARD_FIGMA.height,
  /** Edge-to-edge gap between 221px cards at rest (Figma) */
  gapDesktop: 56,
  /** Stage height — card + shallow arc + shadow */
  trackHeightDesktop: 356,
  /** Degrees per index on the disk (compact arc) */
  diskAngleDeg: 12,
  /** Scales vertical drop from the circular path */
  arcVerticalFactor: 0.48,
  scaleAtOffset1: 0.9,
  scaleAtOffset2: 0.8,
  blurOffset1: 0.5,
  blurOffset2: 1,
  maxVisibleOffset: 2,
} as const;

export type CatalogueCarouselDiskLayout = {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  blur: number;
};

export function catalogueCarouselDiskLayout(
  offset: number,
  stepPx: number,
  reducedMotion: boolean,
): CatalogueCarouselDiskLayout {
  const { diskAngleDeg, arcVerticalFactor, scaleAtOffset1, scaleAtOffset2, blurOffset1, blurOffset2, maxVisibleOffset } =
    HOME_CATALOGUE_CAROUSEL_FIGMA;

  const abs = Math.min(Math.abs(offset), maxVisibleOffset);
  const sign = offset === 0 ? 0 : offset < 0 ? -1 : 1;

  if (reducedMotion) {
    const t = abs / maxVisibleOffset;
    return {
      x: offset * stepPx,
      y: 0,
      scale: abs === 0 ? 1 : scaleAtOffset1 - t * (scaleAtOffset1 - scaleAtOffset2),
      opacity: 1 - t * 0.12,
      blur: 0,
    };
  }

  if (abs === 0) {
    return { x: 0, y: 0, scale: 1, opacity: 1, blur: 0 };
  }

  const angleRad = (abs * diskAngleDeg * Math.PI) / 180;
  const radius = stepPx / Math.sin((diskAngleDeg * Math.PI) / 180);
  const x = sign * radius * Math.sin(angleRad);
  const y = radius * (1 - Math.cos(angleRad)) * arcVerticalFactor;

  const scale = abs === 1 ? scaleAtOffset1 : scaleAtOffset2;
  const blur = abs === 1 ? blurOffset1 : blurOffset2;

  return {
    x,
    y,
    scale,
    opacity: abs === 1 ? 0.96 : 0.92,
    blur,
  };
}
