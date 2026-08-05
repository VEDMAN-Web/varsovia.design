"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  SHOWCASE_BENTO_BOARD_ASPECT,
  SHOWCASE_BENTO_TILES,
  showcaseBentoTileStyle,
  type ShowcaseBentoTileKey,
} from "@/components/showcase/showcaseBentoLayoutShared";
import {
  SHOWCASE_BENTO_MOBILE_MOTION,
  SHOWCASE_BENTO_TILE_MOTION,
  SHOWCASE_GALLERY_HERO_MOTION,
  SHOWCASE_GALLERY_MOTION,
  SHOWCASE_GALLERY_TITLE_MOTION,
  SHOWCASE_GALLERY_VIEWPORT,
} from "@/components/showcase/showcaseGalleryMotionShared";
import {
  SHOWCASE_GALLERY_FRAME_SHADOW,
  SHOWCASE_GALLERY_GAP,
  SHOWCASE_GALLERY_RADIUS,
  SHOWCASE_GALLERY_SECTION_SPACING,
  SHOWCASE_GALLERY_SECTION_TITLE,
} from "@/components/showcase/showcaseGalleryLayoutShared";

const FALLBACK = "/Interior-kitchen/kitchen1.png";

/** Figma Showcase Details — hero + 4-tile bento per room (Kitchen, then Bathroom). */
export type ShowcaseGalleryLayout = "figma-room";

type ShowcaseGallerySectionProps = {
  title: string;
  images: string[];
  layout?: ShowcaseGalleryLayout;
};

function GalleryImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const resolved = src || FALLBACK;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      className={`block h-full w-full object-cover ${className}`}
      draggable={false}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src.includes(FALLBACK)) return;
        img.src = FALLBACK;
      }}
    />
  );
}

function ImageFrame({
  src,
  alt,
  aspectClass,
  className = "",
}: {
  src: string;
  alt: string;
  aspectClass: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden ${SHOWCASE_GALLERY_RADIUS} bg-[#e8e2e0] ${SHOWCASE_GALLERY_FRAME_SHADOW} ${aspectClass} ${className}`.trim()}
    >
      <GalleryImage src={src} alt={alt} />
    </div>
  );
}

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  x?: number;
  y?: number;
  scale?: number;
  delay?: number;
};

function GalleryReveal({
  children,
  className = "",
  style,
  x = 0,
  y = 24,
  scale = 1,
  delay = 0,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, x, y, scale }
      }
      whileInView={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, x: 0, y: 0, scale: 1 }
      }
      viewport={SHOWCASE_GALLERY_VIEWPORT}
      transition={{
        duration: SHOWCASE_GALLERY_MOTION.duration,
        ease: SHOWCASE_GALLERY_MOTION.ease,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

const BENTO_ALT: Record<ShowcaseBentoTileKey, string> = {
  topLeft: "wide detail",
  topRight: "upper detail",
  bottomLeft: "vertical detail",
  bottomRight: "feature view",
};

/** Figma-positioned collage — scales with width; overlap is proportional to artboard. */
function BentoFourCollage({
  title,
  tiles,
}: {
  title: string;
  tiles: [string, string, string, string];
}) {
  const byKey: Record<ShowcaseBentoTileKey, string> = {
    topLeft: tiles[0],
    topRight: tiles[1],
    bottomLeft: tiles[2],
    bottomRight: tiles[3],
  };

  const mobileAspects = [
    "aspect-[720/430] w-full",
    "aspect-[490/368] w-full",
    "aspect-[490/368] w-full",
    "aspect-[720/430] w-full",
  ] as const;

  return (
    <>
      <div className={`flex flex-col sm:hidden ${SHOWCASE_GALLERY_GAP}`}>
        {tiles.map((src, index) => {
          const motion = SHOWCASE_BENTO_MOBILE_MOTION[index] ?? SHOWCASE_BENTO_MOBILE_MOTION[0];
          const labels = ["wide detail", "upper detail", "vertical detail", "feature view"];
          return (
            <GalleryReveal
              key={labels[index]}
              x={motion.x}
              y={20}
              scale={0.97}
              delay={motion.delay}
            >
              <ImageFrame src={src} alt={`${title} ${labels[index]}`} aspectClass={mobileAspects[index]} />
            </GalleryReveal>
          );
        })}
      </div>

      <div
        className="relative hidden w-full min-w-0 sm:block"
        style={{ aspectRatio: SHOWCASE_BENTO_BOARD_ASPECT }}
      >
        {SHOWCASE_BENTO_TILES.map((rect) => {
          const pos = showcaseBentoTileStyle(rect);
          const src = byKey[rect.key];
          const tileMotion = SHOWCASE_BENTO_TILE_MOTION[rect.key];
          return (
            <GalleryReveal
              key={rect.key}
              className={`absolute overflow-hidden ${SHOWCASE_GALLERY_RADIUS} bg-[#e8e2e0] ${SHOWCASE_GALLERY_FRAME_SHADOW}`}
              style={{
                left: pos.left,
                top: pos.top,
                width: pos.width,
                height: pos.height,
                zIndex: pos.zIndex,
              }}
              x={tileMotion.x}
              y={tileMotion.y}
              scale={tileMotion.scale}
              delay={tileMotion.delay}
            >
              <GalleryImage src={src} alt={`${title} ${BENTO_ALT[rect.key]}`} />
            </GalleryReveal>
          );
        })}
      </div>
    </>
  );
}

/** Figma room block: heading → full-width hero → 4-image bento. */
function FigmaRoomGallery({ title, images }: { title: string; images: string[] }) {
  const hero = images[0] ?? FALLBACK;
  const bento: [string, string, string, string] = [
    images[1] ?? hero,
    images[2] ?? hero,
    images[3] ?? hero,
    images[4] ?? hero,
  ];

  return (
    <section className={SHOWCASE_GALLERY_SECTION_SPACING}>
      <GalleryReveal
        x={SHOWCASE_GALLERY_TITLE_MOTION.x}
        y={0}
        scale={1}
        delay={SHOWCASE_GALLERY_TITLE_MOTION.delay}
      >
        <h2 className={SHOWCASE_GALLERY_SECTION_TITLE}>{title}</h2>
      </GalleryReveal>

      <div className={`flex w-full min-w-0 flex-col ${SHOWCASE_GALLERY_GAP}`}>
        <GalleryReveal
          y={SHOWCASE_GALLERY_HERO_MOTION.y}
          scale={SHOWCASE_GALLERY_HERO_MOTION.scale}
          delay={SHOWCASE_GALLERY_HERO_MOTION.delay}
        >
          <ImageFrame src={hero} alt={`${title} overview`} aspectClass="aspect-[16/9] w-full sm:aspect-[2.05/1]" />
        </GalleryReveal>
        <BentoFourCollage title={title} tiles={bento} />
      </div>
    </section>
  );
}

export default function ShowcaseGallerySection({
  title,
  images,
  layout = "figma-room",
}: ShowcaseGallerySectionProps) {
  const list =
    images.length >= 5
      ? images.slice(0, 5)
      : padShowcaseRoomImages(images.length > 0 ? images : [FALLBACK]);

  if (layout === "figma-room") {
    return <FigmaRoomGallery title={title} images={list} />;
  }

  return <FigmaRoomGallery title={title} images={list} />;
}

function padShowcaseRoomImages(source: string[]): string[] {
  const base = source.length > 0 ? source : [FALLBACK];
  const out: string[] = [];
  for (let i = 0; i < 5; i++) {
    out.push(base[i % base.length] ?? FALLBACK);
  }
  return out;
}
