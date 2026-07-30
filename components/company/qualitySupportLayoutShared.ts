/**
 * Support Process — Figma timeline (compact)
 * Frame ref: ~1200px content, timeline ~1.5% width, step dots ~11px on 2px spine.
 * Inner block ~68% of shell (820px @ 1200 figma scale → clamp for viewport).
 */

import type { CSSProperties } from "react";

export const QAS_FIGMA_CONTENT_PX = 1200;
/** Inner timeline block width on Figma (~68% of 1200) */
export const QAS_FIGMA_INNER_PX = 820;

export const QAS_SUPPORT_WRAP =
  "relative mx-auto w-full min-w-0 max-w-[min(100%,820px)]";

export const QAS_SUPPORT_STEP_LIST = "relative";

export const QAS_SUPPORT_ROW = "relative z-[1] py-[clamp(1rem,2.8vw,1.75rem)]";

export const QAS_SUPPORT_GRID =
  "grid grid-cols-[var(--qas-spine)_minmax(0,1fr)] items-center gap-x-2 md:grid-cols-[minmax(0,1fr)_var(--qas-spine)_minmax(0,1fr)] md:items-center md:gap-x-[clamp(0.875rem,2.2vw,1.5rem)]";

export const QAS_SUPPORT_GRID_STYLE = {
  ["--qas-spine"]: "28px",
} as CSSProperties;

export const QAS_SUPPORT_ILLUSTRATION =
  "w-full max-w-[min(100%,208px)] shrink-0 sm:max-w-[224px] md:max-w-[min(100%,240px)]";

export const QAS_SUPPORT_COPY = "min-w-0 max-w-[min(100%,280px)]";

/** Figma spine: ~14px dot, 2px line #643c41 */
export const QAS_SUPPORT_STEP_DOT =
  "relative z-10 h-7 w-7 shrink-0 rounded-full bg-[#643c41] md:h-7 md:w-7";

export const QAS_SUPPORT_SPINE_CELL =
  "relative z-10 col-start-1 row-start-1 flex items-center justify-center self-center md:col-start-2";

export const QAS_SUPPORT_STEP_LABEL =
  "font-outfit text-[11px] font-bold uppercase tracking-[0.2em] text-[#d65a7d] sm:text-xs";

export const QAS_SUPPORT_STEP_TITLE =
  "mt-1.5 font-outfit text-[clamp(1rem,2vw,1.1875rem)] font-semibold leading-snug text-[#1f1f1f]";

export const QAS_SUPPORT_STEP_BODY =
  "mt-1.5 text-pretty font-outfit text-[13px] leading-[1.7] text-[#6a414d]/88 sm:text-[14px]";
