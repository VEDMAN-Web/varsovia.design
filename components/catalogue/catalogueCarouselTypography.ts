/** Figma node 10:5320 — home carousel brochure card */
export const CAROUSEL_CARD_FIGMA = { width: 221, height: 324 } as const;

export const CAROUSEL_BROCHURE_TYPO = {
  yearPx: 10,
  yearTrackingPx: 2.2,
  titleLinePx: 14,
  titleRoomPx: 15,
  titleRoomLongPx: 12,
  titleLineHeight: 1.14,
  titleTrackingPx: 0.5,
  downloadPx: 12,
  downloadIconPx: 16,
  downloadGapPx: 6,
  downloadUnderlineOffsetPx: 3,
  padXPx: 14,
  padTopPx: 20,
  padBottomPx: 22,
} as const;

export type CarouselFaceMetrics = {
  width: number;
  height: number;
};

function scaleW(cardWidth: number, px: number) {
  return (px / CAROUSEL_CARD_FIGMA.width) * cardWidth;
}

function scaleH(cardHeight: number, px: number) {
  return (px / CAROUSEL_CARD_FIGMA.height) * cardHeight;
}

/** Inline px from Figma — always applied (no reliance on Tailwind cqw scan). */
export function carouselFaceStyles(metrics: CarouselFaceMetrics, room: string) {
  const { width, height } = metrics;
  const t = CAROUSEL_BROCHURE_TYPO;
  const roomPx = room.length > 9 ? t.titleRoomLongPx : t.titleRoomPx;

  return {
    shell: {
      paddingLeft: scaleW(width, t.padXPx),
      paddingRight: scaleW(width, t.padXPx),
      paddingTop: scaleH(height, t.padTopPx),
      paddingBottom: scaleH(height, t.padBottomPx),
    } as const,
    year: {
      fontSize: scaleW(width, t.yearPx),
      letterSpacing: scaleW(width, t.yearTrackingPx),
    } as const,
    titleLine: {
      fontSize: scaleW(width, t.titleLinePx),
      letterSpacing: scaleW(width, t.titleTrackingPx),
      lineHeight: t.titleLineHeight,
    } as const,
    titleRoom: {
      fontSize: scaleW(width, roomPx),
      letterSpacing: scaleW(width, t.titleTrackingPx),
      lineHeight: t.titleLineHeight,
    } as const,
    download: {
      fontSize: scaleW(width, t.downloadPx),
      textUnderlineOffset: scaleW(width, t.downloadUnderlineOffsetPx),
      gap: scaleW(width, t.downloadGapPx),
    } as const,
    downloadIcon: {
      width: scaleW(width, t.downloadIconPx),
      height: scaleW(width, t.downloadIconPx),
    } as const,
  };
}

export function notebookMetricsFromWidth(width: number): CarouselFaceMetrics {
  const height = (width / CAROUSEL_CARD_FIGMA.width) * CAROUSEL_CARD_FIGMA.height;
  return { width, height };
}
