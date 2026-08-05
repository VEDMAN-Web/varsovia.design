import { companyTransition } from "@/components/company/companyLayoutShared";
import type { ShowcaseBentoTileKey } from "@/components/showcase/showcaseBentoLayoutShared";

export const SHOWCASE_GALLERY_MOTION = {
  duration: 0.75,
  ease: companyTransition.ease,
} as const;

export const SHOWCASE_GALLERY_VIEWPORT = {
  once: true,
  margin: "-10% 0px -6% 0px",
} as const;

/** Cross reveal — left column from left, right column from right */
export const SHOWCASE_BENTO_TILE_MOTION: Record<
  ShowcaseBentoTileKey,
  { x: number; y: number; delay: number; scale: number }
> = {
  topLeft: { x: -72, y: 20, delay: 0.06, scale: 0.96 },
  topRight: { x: 72, y: 16, delay: 0.14, scale: 0.96 },
  bottomLeft: { x: -64, y: 28, delay: 0.22, scale: 0.97 },
  bottomRight: { x: 80, y: 32, delay: 0.3, scale: 0.97 },
};

export const SHOWCASE_GALLERY_HERO_MOTION = {
  y: 36,
  scale: 0.98,
  delay: 0,
};

export const SHOWCASE_GALLERY_TITLE_MOTION = {
  x: -28,
  delay: 0,
};

/** Mobile stack — alternate horizontal drift */
export const SHOWCASE_BENTO_MOBILE_MOTION = [
  { x: -40, delay: 0.06 },
  { x: 40, delay: 0.12 },
  { x: -36, delay: 0.18 },
  { x: 44, delay: 0.24 },
] as const;

/** Showcase detail — hero overlay + scroll scale (image paints immediately for LCP) */
export const SHOWCASE_DETAIL_HERO_MOTION = {
  overlay: { duration: 0.85, delay: 0.04 },
  scrollScale: { min: 1, max: 1.06 },
} as const;

/** Showcase detail — floating spec card (mount, above the fold) */
export const SHOWCASE_SPEC_CARD_MOTION = {
  card: { y: 36, scale: 0.98, delay: 0.06, duration: 0.72 },
  backLink: { delay: 0.14 },
  title: { delay: 0.22, y: 14 },
  columnBaseDelay: 0.32,
  columnStagger: 0.08,
  columnY: 16,
  accentLine: { duration: 0.42, delayAfterLabel: 0.1 },
} as const;
