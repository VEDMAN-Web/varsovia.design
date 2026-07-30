"use client";

import {
  SHOWCASE_GALLERY_GAP,
  SHOWCASE_GALLERY_RADIUS,
  SHOWCASE_GALLERY_SECTION_TITLE,
} from "@/components/showcase/showcaseGalleryLayoutShared";

const FALLBACK = "/Interior-kitchen/kitchen1.png";

export type ShowcaseGalleryLayout = "stacked" | "collage";

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
}: {
  src: string;
  alt: string;
  aspectClass: string;
}) {
  return (
    <div
      className={`overflow-hidden ${SHOWCASE_GALLERY_RADIUS} bg-[#e8e2e0] shadow-[0_4px_24px_rgba(70,40,50,0.06)] ${aspectClass}`}
    >
      <GalleryImage src={src} alt={alt} />
    </div>
  );
}

/** Figma — Kitchen: full-width hero, then 2-up row (aligned edges, equal gutter) */
function StackedGallery({ title, images }: { title: string; images: string[] }) {
  const hero = images[0] ?? FALLBACK;
  const left = images[1] ?? images[0] ?? FALLBACK;
  const right = images[2] ?? images[1] ?? FALLBACK;

  return (
    <section className="mb-14 md:mb-20">
      <h2 className={SHOWCASE_GALLERY_SECTION_TITLE}>{title}</h2>

      <div className={`flex flex-col ${SHOWCASE_GALLERY_GAP}`}>
        <ImageFrame src={hero} alt={`${title} overview`} aspectClass="aspect-[2/1] w-full sm:aspect-[2.15/1]" />

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${SHOWCASE_GALLERY_GAP}`}>
          <ImageFrame src={left} alt={`${title} detail left`} aspectClass="aspect-square w-full sm:aspect-[1/1]" />
          <ImageFrame src={right} alt={`${title} detail right`} aspectClass="aspect-square w-full sm:aspect-[1/1]" />
        </div>
      </div>
    </section>
  );
}

/** Figma — Bathroom: wide top band (left-weighted), staggered portrait + feature below */
function CollageGallery({ title, images }: { title: string; images: string[] }) {
  const top = images[0] ?? FALLBACK;
  const left = images[1] ?? images[0] ?? FALLBACK;
  const right = images[2] ?? images[1] ?? FALLBACK;

  return (
    <section className="mb-14 md:mb-20">
      <h2 className={SHOWCASE_GALLERY_SECTION_TITLE}>{title}</h2>

      <div className={`flex flex-col ${SHOWCASE_GALLERY_GAP}`}>
        <div className="mr-auto w-full max-w-[min(100%,960px)]">
          <ImageFrame src={top} alt={`${title} panorama`} aspectClass="aspect-[2.05/1] w-full" />
        </div>

        <div className={`grid grid-cols-1 items-start sm:grid-cols-12 ${SHOWCASE_GALLERY_GAP}`}>
          <div className="sm:col-span-5 sm:translate-y-10 md:translate-y-14">
            <ImageFrame src={left} alt={`${title} detail left`} aspectClass="aspect-[3/4] w-full" />
          </div>
          <div className="sm:col-span-7 sm:-translate-y-2 md:-translate-y-4">
            <ImageFrame src={right} alt={`${title} feature`} aspectClass="aspect-[4/5] w-full sm:aspect-[5/6]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ShowcaseGallerySection({
  title,
  images,
  layout = "stacked",
}: ShowcaseGallerySectionProps) {
  const list = images.length > 0 ? images : [FALLBACK, FALLBACK, FALLBACK];

  if (layout === "collage") {
    return <CollageGallery title={title} images={list} />;
  }

  return <StackedGallery title={title} images={list} />;
}
