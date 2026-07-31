/** Our Team page — Figma surfaces, spacing, responsive grids */

import { SECTION_SUBTITLE_CLASS } from "@/components/ui/SectionHeading";

export const TEAM_PAGE_BG = "bg-[#fdf7f7]";

export const TEAM_MAIN =
  "min-h-screen overflow-x-hidden pb-[clamp(3.5rem,9vw,7rem)] pt-[calc(72px+clamp(0.625rem,2.5vw,1.25rem))] md:pt-[calc(88px+clamp(0.875rem,2vw,1.75rem))]";

export const TEAM_SHELL =
  "mx-auto w-full min-w-0 max-w-[min(100%,1060px)] px-[clamp(1rem,4vw,2.5rem)]";

export const TEAM_HERO_SECTION = "pb-[clamp(1.25rem,4vw,2.5rem)] pt-[clamp(1.5rem,4vw,3rem)] text-center";

export const TEAM_HERO_SUBTITLE = `${SECTION_SUBTITLE_CLASS} !mt-[clamp(1rem,3vw,1.875rem)] max-w-[min(100%,40rem)] leading-[1.45] px-1`;

export const TEAM_INTRO_CLASS =
  "mx-auto max-w-[min(100%,820px)] text-pretty px-0.5 text-center font-outfit text-[clamp(0.875rem,2.2vw,1rem)] font-normal leading-[1.8] text-[#6a414d]/90 min-[480px]:leading-[1.85] md:text-[16px] md:leading-[1.9]";

export const TEAM_STAT_SECTION = "mb-[clamp(2.5rem,7vw,6rem)] max-w-[min(100%,920px)]";

export const TEAM_STAT_GRID = "grid grid-cols-1 gap-[clamp(1rem,3vw,2rem)] md:grid-cols-2";

export const TEAM_STAT_CARD =
  "relative overflow-hidden rounded-[12px] border border-[#f0e4e4]/80 bg-gradient-to-br from-[#f8eeee] via-[#fbf5f5] to-[#fdf9f9] shadow-[0_6px_28px_rgba(106,65,77,0.07)] min-[480px]:rounded-[14px] sm:rounded-[16px]";

export const TEAM_SECTION_TITLE =
  "text-balance font-outfit text-[clamp(1.125rem,2.8vw,1.75rem)] font-semibold leading-[1.25] text-[#1f1f1f]";

export const TEAM_SECTION_EYEBROW =
  "font-outfit text-[clamp(0.875rem,2vw,1rem)] font-semibold normal-case tracking-normal text-[#d65e7d]";

export const TEAM_TOOLS_TITLE =
  "text-balance font-outfit text-[clamp(1rem,2.2vw,1.375rem)] font-medium text-[#d65a7c]";

export const TEAM_TOOLS_BODY =
  "mt-[clamp(0.75rem,2vw,1rem)] max-w-[min(100%,820px)] text-pretty font-outfit text-[clamp(0.875rem,2vw,1rem)] font-normal leading-[1.8] text-[#1f1f1f]/90 md:text-[16px] md:leading-[1.85]";

export const TEAM_MEMBER_GRID =
  "grid w-full grid-cols-1 place-items-center gap-x-[clamp(1rem,3vw,2.25rem)] gap-y-[clamp(2rem,6vw,2.75rem)] min-[540px]:grid-cols-2 min-[540px]:place-items-stretch lg:grid-cols-3";

export const TEAM_MEMBER_CARD =
  "relative mx-auto w-full max-w-[min(100%,300px)] pb-[clamp(1rem,3vw,1.5rem)] min-[540px]:mx-0 min-[540px]:max-w-none";

export const TEAM_MEMBER_INFO =
  "relative z-[2] mx-[clamp(0.875rem,4vw,1.5rem)] -mt-[clamp(2rem,7vw,2.625rem)] rounded-[8px] border border-[#f0e4e4]/60 bg-gradient-to-b from-[#f8ecee] via-[#fcf6f6] to-white px-[clamp(0.875rem,3vw,1.25rem)] py-[clamp(0.875rem,2.5vw,1.125rem)] text-center shadow-[0_8px_24px_rgba(106,65,77,0.08)]";

export const TEAM_MEMBER_ROLE =
  "text-balance font-outfit text-[clamp(0.8125rem,2vw,0.9375rem)] font-semibold leading-snug text-[#1f1f1f]";

export const TEAM_MEMBER_NAME =
  "mt-1.5 text-balance font-outfit text-[clamp(0.8125rem,2vw,0.9375rem)] font-semibold text-[#d65e7d]";

export const TEAM_SECTION_BODY =
  "max-w-[min(100%,720px)] text-pretty font-outfit text-[clamp(0.875rem,2vw,1rem)] font-normal leading-[1.8] text-[#6a414d]/88 md:text-[16px] md:leading-[1.85]";

export const TEAM_BLOCK_SPACING = "mb-[clamp(2.5rem,8vw,7rem)]";

export const TEAM_BLOCK_INNER = "mt-[clamp(2rem,5vw,3.5rem)]";

export const TEAM_TOOLS_GRID =
  "mt-[clamp(1.75rem,4vw,2.5rem)] grid grid-cols-1 gap-[30px] min-[540px]:grid-cols-3";

export const TEAM_TOOL_CARD_BASE =
  "flex h-full min-h-[220px] flex-col items-center justify-center rounded-[12px] px-4 py-8 transition-all duration-300 sm:min-h-[240px] sm:py-10";

export const TEAM_TOOL_CARD_IDLE =
  "border border-transparent bg-white shadow-[0_4px_22px_rgba(106,65,77,0.07)]";

export const TEAM_TOOL_CARD_ACTIVE =
  "border border-[#ecd5db] bg-white shadow-[0_10px_36px_rgba(214,90,124,0.12)]";

export const TEAM_TOOL_ICON_WRAP =
  "mb-5 flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full sm:mb-6 sm:h-24 sm:w-24";

/** Figma radial glow behind tool logos */
export const TEAM_TOOL_ICON_GLOW =
  "radial-gradient(circle at 38% 32%, rgba(207,83,116,0.38) 0%, rgba(248,236,238,0.92) 48%, rgba(255,252,252,1) 100%)";
