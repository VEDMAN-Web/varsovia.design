"use client";

import { SECTION_TITLE_CLASS } from "@/components/ui/SectionHeading";

const FALLBACK = "/Interior-kitchen/kitchen1.png";

type ShowcaseGallerySectionProps = {
  title: string;
  images: string[];
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
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100 ${className}`}
      draggable={false}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src.includes(FALLBACK)) return;
        img.src = FALLBACK;
      }}
    />
  );
}

/** Figma detail gallery — hero → 2-up → masonry collage */
export default function ShowcaseGallerySection({ title, images }: ShowcaseGallerySectionProps) {
  const [hero, a, b, c, d] = images;

  return (
    <section className="mb-16 md:mb-24">
      <h2 className={`${SECTION_TITLE_CLASS} mb-6 text-left text-[clamp(1.25rem,2.6vw,1.75rem)] md:mb-8`}>
        {title}
      </h2>

      <div className="group mb-6 overflow-hidden rounded-[16px] border border-[#e5dcd3]/35 shadow-[0_8px_30px_rgba(107,44,58,0.03)] md:mb-8">
        <div className="aspect-[21/9] w-full md:aspect-[2.4/1]">
          <GalleryImage src={hero} alt={`${title} overview`} />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:mb-8 md:grid-cols-2 md:gap-8">
        {[a, b].map((src, i) => (
          <div
            key={i}
            className="group overflow-hidden rounded-[12px] border border-[#e5dcd3]/35 shadow-[0_4px_20px_rgba(107,44,58,0.03)]"
          >
            <div className="aspect-[4/3] w-full">
              <GalleryImage src={src} alt={`${title} detail ${i + 1}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12 md:gap-8">
        <div className="group overflow-hidden rounded-[12px] border border-[#e5dcd3]/35 shadow-[0_4px_20px_rgba(107,44,58,0.03)] md:col-span-7 md:-mr-4 md:translate-y-6">
          <div className="aspect-[3/4] w-full md:aspect-[4/5]">
            <GalleryImage src={c} alt={`${title} feature`} />
          </div>
        </div>
        <div className="group overflow-hidden rounded-[12px] border border-[#e5dcd3]/35 shadow-[0_4px_20px_rgba(107,44,58,0.03)] md:col-span-5 md:-translate-y-4">
          <div className="aspect-[3/4] w-full">
            <GalleryImage src={d} alt={`${title} detail`} />
          </div>
        </div>
      </div>
    </section>
  );
}
