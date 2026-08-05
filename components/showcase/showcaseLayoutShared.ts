/** Showcase listing — aligned with interior / Figma home case */
export {
  CATALOGUE_CONTENT_WIDTH as SHOWCASE_CONTENT_WIDTH,
  CATALOGUE_SECTION_SHELL as SHOWCASE_SECTION_SHELL,
} from "@/components/catalogue/catalogueLayoutShared";

export {
  SHOWCASE_LISTING_GRID as SHOWCASE_PROJECT_GRID,
  SHOWCASE_LISTING_GRID_WRAP as SHOWCASE_PROJECT_GRID_WRAP,
} from "@/components/ui/showcaseGridShared";

/**
 * Figma Showcase Details — content column matches navbar inset (1440 / 100px gutters).
 * Use for the gallery block below the hero; spec card keeps SHOWCASE_SECTION_SHELL.
 */
export const SHOWCASE_DETAIL_CONTENT_SHELL =
  "mx-auto w-full max-w-[1440px] min-w-0 px-[clamp(1.25rem,7vw,100px)]";

/** Space from floating spec card bottom to first “Kitchen” heading (~80–100px with card mb). */
export const SHOWCASE_DETAIL_GALLERY_PAD_TOP =
  "pt-[clamp(2.75rem,6.5vw,4.5rem)] md:pt-[clamp(3.25rem,7vw,5rem)]";

export const SHOWCASE_DETAIL_GALLERY_PAD_BOTTOM = "pb-16 md:pb-24";

/** Figma page fill below hero band */
export const SHOWCASE_DETAIL_PAGE_FILL = "bg-[#f9f5f3]";
