/** Shared navbar dropdown typography — unified Outfit sizes across all menus */

export const NAV_DROPDOWN_TEXT =
  "font-outfit text-[21px] font-medium leading-[30px]";

export const NAV_DROPDOWN_SUBTEXT =
  "font-outfit text-[17px] font-normal leading-[24px] text-[#6a414d]/75";

export const NAV_DROPDOWN_PANEL =
  "absolute top-full z-50 mt-2 min-w-[252px] overflow-hidden rounded-2xl border border-maroon/10 bg-white py-2 shadow-[0_12px_32px_rgba(0,0,0,0.10)]";

export const NAV_DROPDOWN_PANEL_WIDE =
  "absolute top-full left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-maroon/10 bg-white py-2 shadow-[0_12px_32px_rgba(0,0,0,0.10)]";

export const NAV_DROPDOWN_LINK = `block px-5 py-3 ${NAV_DROPDOWN_TEXT} text-[#2b2b2b] transition-colors hover:bg-blush hover:text-maroon`;

export const NAV_DROPDOWN_LINK_FEATURED = `block px-5 py-3 ${NAV_DROPDOWN_TEXT} text-maroon transition-colors hover:bg-blush`;

/** Showcase / multi-line row — same primary size & weight as Interior links */
export const NAV_DROPDOWN_ITEM =
  "group block px-5 py-3 font-outfit transition-colors hover:bg-blush";

export const NAV_DROPDOWN_ITEM_TITLE = `block ${NAV_DROPDOWN_TEXT} text-maroon`;

export const NAV_DROPDOWN_ITEM_SUBTITLE = `mt-0.5 block ${NAV_DROPDOWN_SUBTEXT}`;
