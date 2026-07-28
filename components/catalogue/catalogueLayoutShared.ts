import { SITE_SECTION_SHELL } from "@/components/ui/layoutShared";

/** Catalogue row — 3×440px cards + 132px gutters (1584px total) */
export const CATALOGUE_CONTENT_WIDTH = "mx-auto w-full max-w-[1584px] min-w-0";

/** Same shell as Interior listing pages */
export const CATALOGUE_SECTION_SHELL = SITE_SECTION_SHELL;

/** Three-column notebook grid — columns scale with content width */
export const CATALOGUE_NOTEBOOK_GRID =
  "grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-[132px] lg:gap-y-14";

export const CATALOGUE_CARD_HEIGHT = "h-[592px]";
export const CATALOGUE_ROW_SLOT_HEIGHT = "h-[607px]";
