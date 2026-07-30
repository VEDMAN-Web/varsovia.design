"use client";

import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from "react";
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
  className = "block h-full w-full object-cover",
}: {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
}) {
  const [current, setCurrent] = useState(resolveMediaUrl(src, fallback));

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      draggable={false}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}

const TILE_BASE =
  "overflow-hidden rounded-[6px] transition-[box-shadow,transform] duration-500 ease-out";
const TILE_SHADOW = "shadow-[0_0_10px_rgba(37,27,30,0.25)]";

function CollageTile({
  children,
  shadow = false,
  className = "",
  style,
  interactive = true,
}: {
  children: ReactNode;
  shadow?: boolean;
  className?: string;
  style?: CSSProperties;
  interactive?: boolean;
}) {
  const hover =
    interactive
      ? "group/tile pointer-events-auto hover:shadow-[0_12px_28px_rgba(37,27,30,0.22)] hover:z-20"
      : "pointer-events-none";

  return (
    <div
      className={`${TILE_BASE} ${shadow ? TILE_SHADOW : ""} ${hover} ${className}`.trim()}
      style={style}
    >
      <div className="relative h-full min-h-0 w-full overflow-hidden">
        {interactive ? (
          <div className="h-full w-full origin-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover/tile:scale-[1.04]">
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

/** Swipeable image strip — mobile / small screens only */
export function ContactCollageMobileSlider({
  images = [],
  className = "",
  compact = false,
}: {
  images?: string[];
  className?: string;
  /** Tighter strip for download modal on phones */
  compact?: boolean;
}) {
  const count = COLLAGE_TILES.length;
  const collageImages = COLLAGE_TILES.map((_, i) => images[i] || COLLAGE_FALLBACKS[i]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>("[data-contact-slide]");
    if (!slide) return;
    const gap = 12;
    const slideWidth = slide.offsetWidth + gap;
    const index = Math.round(el.scrollLeft / slideWidth);
    setActive(Math.min(Math.max(index, 0), count - 1));
  }, [count]);

  const scrollTo = (index: number) => {
    const el = scrollerRef.current;
    const slide = el?.querySelector<HTMLElement>("[data-contact-slide]");
    if (!el || !slide) return;
    const gap = 12;
    el.scrollTo({ left: index * (slide.offsetWidth + gap), behavior: "smooth" });
    setActive(index);
  };

  const slideHeight = compact ? "h-[152px] sm:h-[168px]" : "h-[200px] sm:h-[228px]";
  const slideWidth = compact
    ? "w-[min(78vw,280px)] sm:w-[min(68vw,300px)]"
    : "w-[min(82vw,300px)] sm:w-[min(72vw,340px)]";

  return (
    <div className={`relative w-full ${className}`.trim()}>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className={`contact-collage-slider flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${compact ? "px-3" : "px-4"}`}
        aria-roledescription="carousel"
        aria-label="Kitchen inspiration gallery"
      >
        {collageImages.map((src, i) => (
          <div
            key={i}
            data-contact-slide
            className={`${slideWidth} shrink-0 snap-center snap-always`}
          >
            <CollageTile
              shadow={i === 0}
              interactive={false}
              className={`${slideHeight} w-full ${i === active ? TILE_SHADOW : ""}`}
            >
              <CollageImage
                src={src}
                fallback={COLLAGE_FALLBACKS[i]}
                alt={`Interior inspiration ${i + 1}`}
              />
            </CollageTile>
          </div>
        ))}
      </div>

      <div className={`flex items-center justify-center gap-1.5 ${compact ? "mt-2 px-3" : "mt-3 px-4"}`}>
        {collageImages.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            tabIndex={0}
            aria-current={i === active ? "true" : undefined}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-5 bg-[#6a414d]" : "w-1.5 bg-[#6a414d]/30"
            }`}
          />
        ))}
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
    <div
      className={`pointer-events-none absolute inset-0 ${className}`.trim()}
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
  );
}
