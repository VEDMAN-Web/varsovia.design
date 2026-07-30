"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import {
  COLLAGE_FALLBACKS,
  COLLAGE_MODAL_TILES,
  COLLAGE_TILES,
} from "@/components/forms/contactFormShared";
import { resolveMediaUrl } from "@/lib/mediaAssets";

function CollageImage({
  src,
  fallback,
  alt,
}: {
  src: string;
  fallback: string;
  alt: string;
}) {
  const [current, setCurrent] = useState(resolveMediaUrl(src, fallback));

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className="block h-full w-full object-cover"
      draggable={false}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}

const TILE_BASE =
  "group/tile overflow-hidden rounded-[6px] transition-[box-shadow,transform,z-index] duration-500 ease-out will-change-transform";
const TILE_SHADOW = "shadow-[0_0_10px_rgba(37,27,30,0.25)]";
const TILE_HOVER_SHADOW =
  "hover:shadow-[0_12px_28px_rgba(37,27,30,0.22)] hover:z-20";

function CollageTile({
  children,
  shadow = false,
  className = "",
  style,
}: {
  children: ReactNode;
  shadow?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`${TILE_BASE} pointer-events-auto ${shadow ? TILE_SHADOW : ""} ${TILE_HOVER_SHADOW} ${className}`.trim()}
      style={style}
    >
      <div className="relative h-full min-h-0 w-full overflow-hidden">
        <div className="h-full w-full origin-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:group-hover/tile:scale-100 group-hover/tile:scale-[1.07]">
          {children}
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[#251b1e]/0 transition-colors duration-500 group-hover/tile:bg-[#251b1e]/12"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100"
          style={{
            background:
              "linear-gradient(165deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 42%, rgba(37,27,30,0.08) 100%)",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}

type ContactCollageProps = {
  images?: string[];
  className?: string;
  variant?: "section" | "modal";
};

export default function ContactCollage({
  images = [],
  className = "",
  variant = "section",
}: ContactCollageProps) {
  const tiles = variant === "modal" ? COLLAGE_MODAL_TILES : COLLAGE_TILES;
  const collageImages = tiles.map((_, i) => images[i] || COLLAGE_FALLBACKS[i]);

  const renderImage = (index: number, alt: string) => (
    <CollageImage
      src={collageImages[index]}
      fallback={COLLAGE_FALLBACKS[index]}
      alt={alt}
    />
  );

  return (
    <>
      {/* Desktop — mosaic with hover zoom; parent ignores clicks except on tiles */}
      <div
        className={`pointer-events-none absolute inset-0 hidden lg:block ${className}`.trim()}
        aria-hidden={false}
      >
        {tiles.map((tile, i) => (
          <CollageTile
            key={i}
            shadow={tile.shadow}
            className="absolute"
            style={{
              left: tile.left,
              top: tile.top,
              width: tile.w,
              height: tile.h,
            }}
          >
            {renderImage(i, `Interior inspiration ${i + 1}`)}
          </CollageTile>
        ))}
      </div>

      {/* Mobile & tablet — horizontal scroll strip (< lg) */}
      <div
        className={`w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden ${
          variant === "modal" ? "hidden" : ""
        } ${className}`.trim()}
      >
        <div className="flex gap-2.5 px-2.5 py-2 sm:gap-3 sm:px-4 sm:py-3" style={{ width: "max-content" }}>
          {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
            <CollageTile
              key={idx}
              shadow={idx === 0}
              className="h-[110px] w-[90px] shrink-0 sm:h-[160px] sm:w-[130px]"
            >
              {renderImage(idx, `Interior inspiration ${idx + 1}`)}
            </CollageTile>
          ))}
        </div>
      </div>
    </>
  );
}
