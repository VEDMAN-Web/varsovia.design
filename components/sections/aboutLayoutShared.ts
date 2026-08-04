/** Figma Home About — collage tiles 10:5288 / 10:5289 / 10:5290 (686×500 board) */

export const ABOUT_COLLAGE_ASPECT = "aspect-[686/500]";

/** 6px radius + white stroke — matches Figma photo frames (contact mosaic, about story) */
export const ABOUT_COLLAGE_TILE_CLASS =
  "overflow-hidden rounded-[6px] border-4 border-white bg-white shadow-[0_8px_24px_rgba(80,40,50,0.1)] outline-none";

export const ABOUT_LAYOUT = [
  { altKey: "aboutImageAlt1" as const, className: "left-[1.75%] top-[0.2%] h-[76.2%] w-[43.4%]" },
  { altKey: "aboutImageAlt2" as const, className: "left-[37.9%] top-[26.2%] h-[44%] w-[56%]" },
  { altKey: "aboutImageAlt3" as const, className: "left-[10.9%] top-[54%] h-[44%] w-[51.3%]" },
] as const;
