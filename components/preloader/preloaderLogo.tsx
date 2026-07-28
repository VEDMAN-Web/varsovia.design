/** Figma Vector 77 — Varsovia wing mark (pure SVG path) */
export const WING_VIEWBOX = "0 0 52.3964 82.1691";

export const WING_PATH =
  "M42.079 3.0644L0 51.2124C15.6987 62.8651 10.9243 76.2982 6.47369 81.3557H14.9704C15.2941 81.3557 16.454 79.3327 16.9934 78.3212L23.2648 80.7488C31.0332 84.3093 37.5609 80.3442 39.8536 77.9166L17.8026 70.836L29.5362 72.2521C42.4836 74.0324 47.8783 66.3853 48.9573 62.3393L17.6003 63.5531L37.426 59.9116C48.9168 57.6458 52.1941 47.7735 52.3964 43.1205L16.3865 56.4725L38.8421 45.5481C50.9803 38.2652 52.2615 27.4083 51.3849 22.8902L14.1612 49.1896L36.0099 30.3753C52.5987 15.0003 43.4951 -0.779354 43.6974 0.0298566C43.8592 0.677225 42.6859 2.32262 42.079 3.0644Z";

export const WING_CENTER_X = 26.1982;
export const WING_CENTER_Y = 41.08455;

type LogoWingSvgProps = {
  className?: string;
  fill?: string;
  fillOpacity?: number;
};

/** Crisp vector wing — always SVG, never rasterized */
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

export const WING_W = 52.3964;
export const WING_H = 82.1691;
export const LOGO_WORDMARK_GAP = 7.534;
/** Approx. VARSOVIA + DESIGN block height below the wing */
export const WORDMARK_BLOCK_H = 58;

/** Preloader — wing size at rest (centered, before portal zoom) */
export const PRELOADER_WING_SCALE = 4;
/** Initial portal scale — 30% smaller than rest size, then zooms out */
export const PRELOADER_INITIAL_SCALE = 0.7;

/** Extra multiplier so the wing portal overshoots viewport — reveals more hero */
export const PORTAL_END_BOOST = 1.6;

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

/** Wing mark with hero image clipped inside — Figma preloader style */
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

/** Centers wing portal at exact viewport middle — logo only, no wordmark */
export function wingPortalCenter(viewportWidth: number, viewportHeight: number) {
  const cx = viewportWidth / 2;
  const cy = viewportHeight / 2;
  const base = PRELOADER_WING_SCALE;
  return {
    cx,
    cy,
    /** Parent SVG translate — moves zoom origin to viewport center */
    portalTranslate: `translate(${cx}, ${cy})`,
    /** Wing path offset inside centered group (scale from 0,0 = screen center) */
    wingInnerTransform: `translate(${-WING_CENTER_X * base}, ${-WING_CENTER_Y * base}) scale(${base})`,
    /** Static overlay stroke (same position, no zoom wrapper) */
    wingTransform: `translate(${cx}, ${cy}) translate(${-WING_CENTER_X * base}, ${-WING_CENTER_Y * base}) scale(${base})`,
  };
}

/** @deprecated wordmark layout — kept for reference */
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
