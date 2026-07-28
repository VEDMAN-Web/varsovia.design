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
      <div className="relative h-full w-full overflow-hidden">
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

      {/* Mobile / tablet — section only */}
      <div
        className={`grid auto-rows-[68px] grid-cols-12 gap-[14px] p-[12px] sm:auto-rows-[80px] sm:gap-[14px] lg:hidden ${
          variant === "modal" ? "hidden" : ""
        } ${className}`.trim()}
      >
        <CollageTile shadow className="col-span-5 col-start-1 row-span-4 row-start-1">
          {renderImage(0, "Interior inspiration 1")}
        </CollageTile>
        <CollageTile className="col-span-4 col-start-6 row-span-1 row-start-1">
          {renderImage(2, "Interior inspiration 3")}
        </CollageTile>
        <CollageTile className="col-span-4 col-start-6 row-span-3 row-start-2">
          {renderImage(3, "Interior inspiration 4")}
        </CollageTile>
        <CollageTile className="col-span-5 col-start-1 row-span-2 row-start-5">
          {renderImage(1, "Interior inspiration 2")}
        </CollageTile>
        <CollageTile className="col-span-4 col-start-6 row-span-2 row-start-5">
          {renderImage(4, "Interior inspiration 5")}
        </CollageTile>
        <CollageTile className="col-span-5 col-start-1 row-span-2 row-start-7">
          {renderImage(5, "Interior inspiration 6")}
        </CollageTile>
        <CollageTile className="col-span-7 col-start-6 row-span-2 row-start-7">
          {renderImage(6, "Interior inspiration 7")}
        </CollageTile>
      </div>
    </>
  );
}
