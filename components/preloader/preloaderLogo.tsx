import {
  WING_VIEWBOX,
  WING_PATH,
  WING_CENTER_X,
  WING_CENTER_Y,
  WING_W,
  WING_H,
} from "@/lib/wingMark";

export {
  WING_VIEWBOX,
  WING_PATH,
  WING_CENTER_X,
  WING_CENTER_Y,
  WING_W,
  WING_H,
} from "@/lib/wingMark";

type LogoWingSvgProps = {
  className?: string;
  fill?: string;
  fillOpacity?: number;
};

/** Crisp vector wing ÔÇö always SVG, never rasterized */
export function LogoWingSvg({
  className,
  fill = "white",
  fillOpacity = 1,
}: LogoWingSvgProps) {
  return (
    <svg
      viewBox={WING_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d={WING_PATH} fill={fill} fillOpacity={fillOpacity} />
    </svg>
  );
}

export const LOGO_WORDMARK_GAP = 7.534;
/** Approx. VARSOVIA + DESIGN block height below the wing */
export const WORDMARK_BLOCK_H = 58;

/** Preloader ÔÇö wing size at rest (centered, before portal zoom) */
export const PRELOADER_WING_SCALE = 4;
/** Initial portal scale ÔÇö smaller start (30% less = 0.49), then zooms out */
export const PRELOADER_INITIAL_SCALE = 0.49;

/** Extra multiplier so the wing portal overshoots viewport ÔÇö reveals more hero */
export const PORTAL_END_BOOST = 1.1;

/** Scale multiplier so wing cutout fully clears every viewport corner */
export function portalEndScale(viewportW: number, viewportH: number, cx: number, cy: number) {
  const baseW = WING_W * PRELOADER_WING_SCALE;
  const baseH = WING_H * PRELOADER_WING_SCALE;
  const corners = [
    [0, 0],
    [viewportW, 0],
    [0, viewportH],
    [viewportW, viewportH],
  ] as const;

  let scale = 1;
  for (const [x, y] of corners) {
    scale = Math.max(scale, (Math.abs(x - cx) * 2) / baseW, (Math.abs(y - cy) * 2) / baseH);
  }

  return scale * PORTAL_END_BOOST;
}

type LogoWingImageFillProps = {
  imageSrc: string;
  className?: string;
  clipPathId: string;
  /** Fine-tune hero framing inside the wing mask */
  imageX?: number;
  imageY?: number;
  imageWidth?: number;
  imageHeight?: number;
};

/** Wing mark with hero image clipped inside ÔÇö Figma preloader style */
export function LogoWingImageFill({
  imageSrc,
  className,
  clipPathId,
  imageX = -16,
  imageY = -6,
  imageWidth = 86,
  imageHeight = 96,
}: LogoWingImageFillProps) {
  return (
    <svg
      viewBox={WING_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipPathId}>
          <path d={WING_PATH} />
        </clipPath>
      </defs>
      <image
        href={imageSrc}
        clipPath={`url(#${clipPathId})`}
        x={imageX}
        y={imageY}
        width={imageWidth}
        height={imageHeight}
        preserveAspectRatio="xMidYMid slice"
      />
    </svg>
  );
}

export function wingTranslate(viewportWidth: number, viewportHeight: number) {
  const cx = viewportWidth / 2;
  const cy = viewportHeight / 2;
  return {
    cx,
    cy,
    transform: `translate(${cx - WING_CENTER_X}, ${cy - WING_CENTER_Y})`,
  };
}

/** Centers wing portal at exact viewport middle ÔÇö logo only, no wordmark */
export function wingPortalCenter(viewportWidth: number, viewportHeight: number) {
  const cx = viewportWidth / 2;
  const cy = viewportHeight / 2;
  const base = PRELOADER_WING_SCALE;
  return {
    cx,
    cy,
    /** Parent SVG translate ÔÇö moves zoom origin to viewport center */
    portalTranslate: `translate(${cx}, ${cy})`,
    /** Wing path offset inside centered group (scale from 0,0 = screen center) */
    wingInnerTransform: `translate(${-WING_CENTER_X * base}, ${-WING_CENTER_Y * base}) scale(${base})`,
    /** Static overlay stroke (same position, no zoom wrapper) */
    wingTransform: `translate(${cx}, ${cy}) translate(${-WING_CENTER_X * base}, ${-WING_CENTER_Y * base}) scale(${base})`,
  };
}

/** @deprecated wordmark layout ÔÇö kept for reference */
export function logoPortalLayout(viewportWidth: number, viewportHeight: number) {
  const cx = viewportWidth / 2;
  const screenCy = viewportHeight / 2;
  const wingCy = screenCy - (LOGO_WORDMARK_GAP + WORDMARK_BLOCK_H) / 2;
  const wingBottom = wingCy + (WING_H * PRELOADER_WING_SCALE) / 2;
  const scaledCenterX = WING_CENTER_X * PRELOADER_WING_SCALE;
  const scaledCenterY = WING_CENTER_Y * PRELOADER_WING_SCALE;
  return {
    cx,
    wingCy,
    portalOrigin: `${cx}px ${wingCy}px`,
    wingTransform: `translate(${cx - scaledCenterX}, ${wingCy - scaledCenterY}) scale(${PRELOADER_WING_SCALE})`,
    wordmarkTop: wingBottom + LOGO_WORDMARK_GAP,
  };
}
