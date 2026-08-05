/**
 * Figma Showcase Details — 4-tile collage (Kitchen / Bathroom bento).
 * Artboard 1240×828, 30px gutters.
 *
 * Pairs: tile 1 = tile 4 (720×430), tile 2 = tile 3 (490×368).
 *
 * Alignments: 1↔2 top; 1↔3 left; 2↔4 right; 3↔4 bottom.
 * Tile 4 overlaps tile 1 by 200×32px; tile 4 on top at the corner (z-index).
 */
export const SHOWCASE_BENTO_BOARD = {
  width: 1240,
  height: 828,
  gap: 30,
} as const;

/** Shared tile sizes (px on artboard) */
export const SHOWCASE_BENTO_SIZE = {
  large: { width: 720, height: 430 },
  small: { width: 490, height: 368 },
} as const;

export type ShowcaseBentoTileKey = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export type ShowcaseBentoTileRect = {
  key: ShowcaseBentoTileKey;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
};

const { large, small } = SHOWCASE_BENTO_SIZE;
const G = SHOWCASE_BENTO_BOARD.gap;

/** Row 2 y: below tile 1 + gutter. Tile 4 y: bottom-aligned with tile 3. */
const ROW2_Y = large.height + G;
const BOTTOM_ROW_BOTTOM = ROW2_Y + small.height;

export const SHOWCASE_BENTO_TILES: readonly ShowcaseBentoTileRect[] = [
  { key: "topLeft", x: 0, y: 0, width: large.width, height: large.height, zIndex: 2 },
  {
    key: "topRight",
    x: large.width + G,
    y: 0,
    width: small.width,
    height: small.height,
    zIndex: 2,
  },
  {
    key: "bottomLeft",
    x: 0,
    y: ROW2_Y,
    width: small.width,
    height: small.height,
    zIndex: 2,
  },
  {
    key: "bottomRight",
    x: small.width + G,
    y: BOTTOM_ROW_BOTTOM - large.height,
    width: large.width,
    height: large.height,
    zIndex: 3,
  },
] as const;

export function showcaseBentoTileStyle(rect: ShowcaseBentoTileRect): {
  left: string;
  top: string;
  width: string;
  height: string;
  zIndex: number;
} {
  const { width: bw, height: bh } = SHOWCASE_BENTO_BOARD;
  return {
    left: `${(rect.x / bw) * 100}%`,
    top: `${(rect.y / bh) * 100}%`,
    width: `${(rect.width / bw) * 100}%`,
    height: `${(rect.height / bh) * 100}%`,
    zIndex: rect.zIndex,
  };
}

export const SHOWCASE_BENTO_BOARD_ASPECT = `${SHOWCASE_BENTO_BOARD.width} / ${SHOWCASE_BENTO_BOARD.height}`;
