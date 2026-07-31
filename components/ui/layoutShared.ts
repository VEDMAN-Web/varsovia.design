/**
 * Canonical content width for all pages — matches Interior listing layout.
 * Hero bands, grids, toolbars, and section headings share this shell.
 */
export const SITE_SECTION_SHELL =
  "mx-auto w-[min(100%,1440px)] max-w-[1440px] min-w-0 px-[clamp(1rem,4vw,3.5rem)]";

export const SITE_SECTION_HEADING_WIDE = "!max-w-none w-full";

/** Outer vertical padding for homepage sections that lead with a gradient heading band */
export const SITE_SECTION_PADDING_Y =
  "pt-20 pb-14 sm:pt-24 sm:pb-20 md:pt-32 md:pb-28";

/** Space above/below the first hero heading on inner company pages (below fixed nav) */
export const SITE_PAGE_HERO_SECTION_PAD = "pb-8 pt-14 md:pb-10 md:pt-20";

/** @deprecated use SITE_SECTION_SHELL */
export const PAGE_SHELL = SITE_SECTION_SHELL;

/** @deprecated use SITE_SECTION_SHELL */
export const SECTION_SHELL = SITE_SECTION_SHELL;

/** @deprecated use SITE_SECTION_HEADING_WIDE */
export const SECTION_HEADING_WIDE = SITE_SECTION_HEADING_WIDE;
