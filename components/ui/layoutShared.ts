/**
 * Canonical content width for all pages — matches Interior listing layout.
 * Hero bands, grids, toolbars, and section headings share this shell.
 */
export const SITE_SECTION_SHELL =
  "mx-auto w-[min(100%,1440px)] max-w-[1440px] min-w-0 px-[clamp(1rem,4vw,3.5rem)]";

export const SITE_SECTION_HEADING_WIDE = "!max-w-none w-full";

/** @deprecated use SITE_SECTION_SHELL */
export const PAGE_SHELL = SITE_SECTION_SHELL;

/** @deprecated use SITE_SECTION_SHELL */
export const SECTION_SHELL = SITE_SECTION_SHELL;

/** @deprecated use SITE_SECTION_HEADING_WIDE */
export const SECTION_HEADING_WIDE = SITE_SECTION_HEADING_WIDE;
