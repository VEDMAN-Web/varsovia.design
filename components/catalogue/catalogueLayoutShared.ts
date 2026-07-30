import { SITE_SECTION_SHELL } from "@/components/ui/layoutShared";

/** Catalogue row — 3×440px cards + 132px gutters (1584px total) */
export const CATALOGUE_CONTENT_WIDTH = "mx-auto w-full max-w-[1584px] min-w-0";

/** Same shell as Interior listing pages */
export const CATALOGUE_SECTION_SHELL = SITE_SECTION_SHELL;

/**
 * Notebook grid: one column on phones, two on tablets, three from lg.
 * Gutters scale with the viewport so columns keep a usable width between
 * breakpoints instead of collapsing at the fixed 132px Figma gap.
 */
export const CATALOGUE_NOTEBOOK_GRID =
  "grid w-full min-w-0 grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-[clamp(1.5rem,4vw,2.5rem)] sm:gap-y-12 lg:grid-cols-3 lg:gap-x-[clamp(2rem,6.5vw,132px)] lg:gap-y-14";

/** Column slot — centres each card; slightly narrower on mobile */
export const CATALOGUE_CARD_SLOT =
  "mx-auto w-full min-w-0 max-w-[320px] sm:max-w-[400px] lg:max-w-[440px]";

/** Card proportions from Figma (440×592) — fluid, never taller than the design */
export const CATALOGUE_CARD_ASPECT = "aspect-[440/592] max-h-[592px]";
