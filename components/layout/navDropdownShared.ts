/** @deprecated Use `@/components/layout/NavDropdown` — kept for backward-compatible imports */
export {
  mobileSubLink,
  mobileSubLinkFeatured,
  mobileSubLinkRich,
} from "@/components/layout/NavDropdown";

export const NAV_DROPDOWN_TEXT =
  "font-outfit text-[15px] font-medium leading-snug";

export const NAV_DROPDOWN_SUBTEXT =
  "font-outfit text-[12px] font-normal leading-snug text-[#6a414d]/65";

export const NAV_DROPDOWN_PANEL =
  "absolute top-full z-50 mt-3 min-w-[272px] overflow-hidden rounded-[14px] border border-[#e5dcd3]/90 bg-gradient-to-b from-white to-[#fdf8f7] shadow-[0_22px_54px_rgba(107,44,58,0.13)]";

export const NAV_DROPDOWN_PANEL_WIDE =
  "absolute top-full left-0 z-50 mt-3 w-[min(92vw,600px)] overflow-hidden rounded-[14px] border border-[#e5dcd3]/90 bg-gradient-to-b from-white to-[#fdf8f7] shadow-[0_22px_54px_rgba(107,44,58,0.13)]";

export const NAV_DROPDOWN_LINK = `block px-5 py-2.5 ${NAV_DROPDOWN_TEXT} text-[#2b2b2b]`;

export const NAV_DROPDOWN_LINK_FEATURED = `block px-5 py-4 ${NAV_DROPDOWN_TEXT} text-maroon`;

export const NAV_DROPDOWN_ITEM = "group block px-5 py-3 font-outfit";

export const NAV_DROPDOWN_ITEM_TITLE = `block ${NAV_DROPDOWN_TEXT} text-maroon`;

export const NAV_DROPDOWN_ITEM_SUBTITLE = `mt-0.5 block ${NAV_DROPDOWN_SUBTEXT}`;
