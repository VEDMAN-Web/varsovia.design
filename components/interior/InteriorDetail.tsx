"use client";

import { Link } from "@/lib/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type { InteriorDetailProject } from "@/lib/interiorData";
import { getInteriorBackHref } from "@/lib/interiorData";
import ShowcaseProductCard from "@/components/ui/ShowcaseProductCard";
import {
  SHOWCASE_LISTING_GRID,
  SHOWCASE_LISTING_GRID_WRAP,
} from "@/components/ui/showcaseGridShared";
import {
  INTERIOR_DETAIL_BG,
  INTERIOR_DETAIL_SHELL,
} from "@/components/interior/interiorLayoutShared";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";

const FALLBACK = MEDIA.interior[0];

type Props = {
  project: InteriorDetailProject;
};

function DetailImage({
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
      src={resolveMediaUrl(src, FALLBACK)}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
      draggable={false}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src.includes(FALLBACK)) return;
        img.src = FALLBACK;
      }}
    />
  );
}

function pickImage(images: string[], index: number, fallback: string) {
  return images[index] || images[0] || fallback;
}

function InteriorDetailGallery({ images, title }: { images: string[]; title: string }) {
  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="overflow-hidden rounded-xl sm:rounded-2xl">
          <div className="aspect-[4/3] w-full">
            <DetailImage src={pickImage(images, 0, FALLBACK)} alt={`${title} detail left`} />
          </div>
        </div>
        <div className="overflow-hidden rounded-xl sm:rounded-2xl">
          <div className="aspect-[4/3] w-full">
            <DetailImage src={pickImage(images, 1, FALLBACK)} alt={`${title} detail right`} />
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl sm:mt-6 sm:rounded-2xl">
        <div className="aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[2.35/1]">
          <DetailImage src={pickImage(images, 2, FALLBACK)} alt={`${title} panoramic`} />
        </div>
      </div>
    </section>
  );
}

function NarrativeBlock({
  text,
  image,
  imageFirst = false,
  title,
}: {
  text: string;
  image: string;
  imageFirst?: boolean;
  title: string;
}) {
  return (
    <section className="grid grid-cols-1 items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
      <div className={imageFirst ? "md:order-2" : "md:order-1"}>
        <p className="font-outfit text-[14px] font-normal leading-[1.75] text-[#6a414d]/85 sm:text-[15px] md:text-base md:leading-[1.8]">
          {text}
        </p>
      </div>
      <div className={`overflow-hidden rounded-xl sm:rounded-2xl ${imageFirst ? "md:order-1" : "md:order-2"}`}>
        <div className="aspect-[4/3] w-full sm:aspect-[3/4] md:aspect-[4/5]">
          <DetailImage src={image} alt={`${title} feature`} />
        </div>
      </div>
    </section>
  );
}

function YouMayLikeSection({
  items,
  category,
}: {
  items: InteriorDetailProject[];
  category?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-[#e5dcd3] pt-10 sm:pt-12 md:pt-16">
      <h2 className="font-outfit text-[clamp(1.1rem,2.2vw,1.75rem)] font-semibold text-[#6a414d]">
        You May Like
      </h2>

      <div className={`mt-6 ${SHOWCASE_LISTING_GRID_WRAP}`}>
        <div className={SHOWCASE_LISTING_GRID}>
          {items.map((item, i) => (
            <ShowcaseProductCard
              key={item._id}
              index={i}
              variant="interior"
              title={item.title}
              description={item.description}
              category={item.category || category}
              image={item.coverImage}
              imageFallback={FALLBACK}
              href={`/interior/${item._id}`}
              isNew={Boolean(item.isNew)}
              motionVariant="mount"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function InteriorDetail({ project }: Props) {
  const [related, setRelated] = useState<InteriorDetailProject[]>([]);

  useEffect(() => {
    import("@/lib/api").then(({ fetchProjects }) => {
      fetchProjects()
        .then((data) => {
          const filtered = (data as InteriorDetailProject[])
            .filter((p) => p._id !== project._id)
            .slice(0, 3)
            .map((p) => ({
              ...p,
              coverImage: resolveMediaUrl(p.coverImage, MEDIA.interior[0]),
              detailTitle: p.detailTitle || p.title,
              description: p.description || "",
              gallery: p.gallery?.length ? p.gallery : [],
              narrativeOne: p.narrativeOne || "",
              narrativeTwo: p.narrativeTwo || "",
            }));
          if (filtered.length > 0) setRelated(filtered);
        })
        .catch(() => {
          // keep empty — no related shown
        });
    });
  }, [project._id]);

  const gallery =
    project.gallery?.length > 0
      ? project.gallery
      : [project.coverImage, project.coverImage, project.coverImage];

  const backHref = getInteriorBackHref(project.category);

  return (
    <div style={{ backgroundColor: INTERIOR_DETAIL_BG }}>
      <section className="relative h-[40vh] min-h-[260px] w-full overflow-hidden sm:h-[50vh] sm:min-h-[320px] md:h-[min(75vh,820px)] md:min-h-[480px]">
        <DetailImage
          src={project.coverImage || FALLBACK}
          alt={project.detailTitle}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10" />
      </section>

      <div className={`${INTERIOR_DETAIL_SHELL} pt-6 sm:pt-8 md:pt-14 lg:pt-16`}>
        <Link
          href={backHref}
          className="font-outfit mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6a414d]/65 transition hover:text-[#cf5374] sm:mb-8 md:mb-10 sm:text-[14px]"
        >
          <ChevronLeft size={15} strokeWidth={2} aria-hidden />
          Back to Interior
        </Link>

        <header className="max-w-[920px]">
          <h1 className="font-outfit text-[clamp(1.2rem,3vw,2.125rem)] font-semibold leading-[1.3] tracking-[-0.01em] text-[#6a414d]">
            {project.detailTitle}
          </h1>
          <p className="mt-4 max-w-[820px] font-outfit text-[14px] font-normal leading-[1.75] text-[#6a414d]/85 sm:text-[15px] md:mt-8 md:text-base md:leading-[1.8]">
            {project.description}
          </p>
        </header>

        <div className="mt-6 sm:mt-10 md:mt-14">
          <InteriorDetailGallery images={gallery} title={project.detailTitle} />
        </div>

        <div className="mt-8 space-y-8 sm:mt-12 sm:space-y-12 md:mt-20 md:space-y-20">
          <NarrativeBlock
            text={project.narrativeOne || ""}
            image={pickImage(gallery, 2, project.coverImage || FALLBACK)}
            title={project.detailTitle}
          />
          <NarrativeBlock
            text={project.narrativeTwo || ""}
            image={pickImage(gallery, 3, project.coverImage || FALLBACK)}
            imageFirst
            title={project.detailTitle}
          />
        </div>

        <section className="mt-8 sm:mt-12 md:mt-20">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="overflow-hidden rounded-xl sm:rounded-2xl">
              <div className="aspect-[4/3] w-full">
                <DetailImage
                  src={pickImage(gallery, 3, FALLBACK)}
                  alt={`${project.detailTitle} detail`}
                />
              </div>
            </div>
            <div className="overflow-hidden rounded-xl sm:rounded-2xl">
              <div className="aspect-[4/3] w-full">
                <DetailImage
                  src={pickImage(gallery, 4, FALLBACK)}
                  alt={`${project.detailTitle} detail`}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 pb-12 sm:mt-12 sm:pb-16 md:mt-20 md:pb-24">
          <YouMayLikeSection items={related} category={project.category} />
        </div>
      </div>
    </div>
  );
}
