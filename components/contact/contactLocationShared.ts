import { CONTACT_PANEL_BG, CONTACT_PANEL_RADIUS } from "@/components/forms/contactLayoutShared";

/** Vertical gap below contact form panel */
export const CONTACT_LOCATION_SECTION_GAP =
  "mt-8 min-w-0 sm:mt-10 md:mt-12 lg:mt-14";

export const CONTACT_LOCATION_SECTION_PAD = "pb-14 sm:pb-16 md:pb-20 lg:pb-24";

/** Same card shell as Get In Touch form panel */
export const CONTACT_LOCATION_CARD = `relative w-full min-w-0 overflow-hidden ${CONTACT_PANEL_RADIUS}`;

export const CONTACT_LOCATION_BODY = `${CONTACT_PANEL_BG} pt-0`;

export const CONTACT_LOCATION_MAP_WRAP = "relative w-full min-w-0";

export const CONTACT_LOCATION_MAP_SHELL =
  "relative w-full overflow-hidden border-y border-[#e5dcd3]/40 bg-[#f7f3f2]";

/** Scales with viewport; capped so map stays usable on phones & large desktops */
export const CONTACT_LOCATION_MAP_FRAME =
  "h-[clamp(11.5rem,38vw,22rem)] w-full max-w-full border-0 sm:h-[clamp(13rem,36vw,21rem)] md:h-[clamp(15rem,34vw,22rem)]";

export const CONTACT_LOCATION_MARKER_BOX =
  "flex h-[48px] w-[48px] items-center justify-center rounded-[10px] bg-[#6a414d] shadow-[0_6px_20px_rgba(42,26,30,0.28)] sm:h-[52px] sm:w-[52px]";

/** Gradient heading band — matches CompanyHero on contact page */
export const CONTACT_LOCATION_HEADING_CLASS =
  "w-full !max-w-none rounded-none !px-[clamp(0.75rem,3vw,1.5rem)] !pb-5 !pt-7 sm:!pt-9 sm:!pb-6 md:!min-h-0 md:!pb-7 md:!pt-11 lg:!pt-12";
