"use client";

import { useLocale } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { InteriorDetailProject } from "@/lib/interiorData";
import { buildInteriorDetailBody, getInteriorBackHref, INTERIOR_DETAIL_BODY_FALLBACK } from "@/lib/interiorData";
import type { Locale } from "@/lib/i18n/routing";
import ShowcaseProductCard from "@/components/ui/ShowcaseProductCard";
import {
  SHOWCASE_LISTING_GRID,
  SHOWCASE_LISTING_GRID_WRAP,
} from "@/components/ui/showcaseGridShared";
import { INTERIOR_DETAIL_SHELL } from "@/components/interior/interiorLayoutShared";
import {
  INTERIOR_DETAIL_PAGE_BG,
  INTERIOR_DETAIL_BACK_LINK,
  INTERIOR_DETAIL_BODY_AFTER_SLIDER,
  INTERIOR_DETAIL_BODY_CLASS,
  INTERIOR_DETAIL_CONTENT,
  INTERIOR_DETAIL_GALLERY_ASPECT,
  INTERIOR_DETAIL_GALLERY_RADIUS,
  INTERIOR_DETAIL_HEADER_BLOCK,
  INTERIOR_DETAIL_HEADER_TO_SLIDER,
  INTERIOR_DETAIL_HERO_CLASS,
  INTERIOR_DETAIL_HERO_OUTER,
  INTERIOR_DETAIL_INTRO_CLASS,
  INTERIOR_DETAIL_MAIN_STACK,
  INTERIOR_DETAIL_SLIDER_BTN,
  INTERIOR_DETAIL_SLIDER_FADE_CLASS,
  INTERIOR_DETAIL_SLIDER_SECTION,
  INTERIOR_DETAIL_TITLE_CLASS,
  INTERIOR_DETAIL_YOU_MAY_LIKE_TITLE,
} from "@/components/interior/interiorDetailLayoutShared";
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

function uniqueGalleryImages(cover: string, gallery: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (raw: string) => {
    const url = resolveMediaUrl(raw, FALLBACK);
    if (seen.has(url)) return;
    seen.add(url);
    out.push(raw);
  };
  if (cover) push(cover);
  for (const item of gallery) push(item);
  if (out.length === 0) out.push(FALLBACK);
  return out;
}

function InteriorDetailGallerySlider({
  images,
  title,
  bodyText,
}: {
  images: string[];
  title: string;
  bodyText: string;
}) {
  const slides = useMemo(
    () => images.map((raw) => resolveMediaUrl(raw, FALLBACK)),
    [images],
  );
  const [index, setIndex] = useState(0);
  const last = slides.length - 1;

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? last : i - 1));
  }, [last]);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= last ? 0 : i + 1));
  }, [last]);

  useEffect(() => {
    setIndex(0);
  }, [slides]);

  useEffect(() => {
    slides.forEach((src) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [slides]);

  const canSlide = slides.length > 1;
  const body = bodyText.trim();

  return (
    <section
      className={INTERIOR_DETAIL_SLIDER_SECTION}
      aria-label={`${title} gallery`}
      aria-roledescription="carousel"
    >
      <div className={`w-full ${INTERIOR_DETAIL_GALLERY_RADIUS} bg-[#ebe4e2]`}>
        <div className={INTERIOR_DETAIL_GALLERY_ASPECT}>
          {slides.map((src, i) => {
            const active = i === index;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={`${title} — image ${i + 1} of ${slides.length}`}
                draggable={false}
                decoding="async"
                fetchPriority={active ? "high" : "low"}
                className={`absolute inset-0 h-full w-full object-cover ${INTERIOR_DETAIL_SLIDER_FADE_CLASS} ${
                  active ? "z-10 opacity-100" : "z-0 opacity-0"
                }`}
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src.includes(FALLBACK)) return;
                  img.src = resolveMediaUrl(FALLBACK, FALLBACK);
                }}
              />
            );
          })}
        </div>
      </div>

      {canSlide ? (
        <div className="mt-6 flex items-center justify-center gap-3 sm:mt-8 md:mt-10">
          <button type="button" onClick={goPrev} className={INTERIOR_DETAIL_SLIDER_BTN} aria-label="Previous image">
            <ChevronLeft size={20} strokeWidth={2.25} aria-hidden />
          </button>
          <button type="button" onClick={goNext} className={INTERIOR_DETAIL_SLIDER_BTN} aria-label="Next image">
            <ChevronRight size={20} strokeWidth={2.25} aria-hidden />
          </button>
        </div>
      ) : null}

      {body ? (
        <p
          className={`${INTERIOR_DETAIL_BODY_CLASS} ${
            canSlide ? INTERIOR_DETAIL_BODY_AFTER_SLIDER : "mt-8 sm:mt-9 md:mt-10"
          }`}
        >
          {body}
        </p>
      ) : null}
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
    <section className="mt-14 sm:mt-16 md:mt-20 lg:mt-24">
      <h2 className={INTERIOR_DETAIL_YOU_MAY_LIKE_TITLE}>You May Like</h2>

      <div className={`mt-6 md:mt-8 ${SHOWCASE_LISTING_GRID_WRAP}`}>
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
  const locale = useLocale() as Locale;
  const [related, setRelated] = useState<InteriorDetailProject[]>([]);

  const detailBody = useMemo(() => {
    const fromCms = buildInteriorDetailBody(project.narrativeOne, project.narrativeTwo, {
      useFallback: false,
    });
    return fromCms || INTERIOR_DETAIL_BODY_FALLBACK;
  }, [project.narrativeOne, project.narrativeTwo]);

  useEffect(() => {
    import("@/lib/api").then(({ fetchProjects }) => {
      fetchProjects(locale)
        .then((data) => {
          const sameCategory = project.category
            ? (data as InteriorDetailProject[]).filter(
                (p) => p._id !== project._id && p.category === project.category,
              )
            : [];
          const pool =
            sameCategory.length >= 3
              ? sameCategory
              : (data as InteriorDetailProject[]).filter((p) => p._id !== project._id);

          const filtered = pool.slice(0, 3).map((p) => ({
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
  }, [project._id, project.category, locale]);

  const sliderImages = useMemo(
    () =>
      uniqueGalleryImages(
        project.coverImage || FALLBACK,
        project.gallery?.length ? project.gallery : [project.coverImage, ...MEDIA.interior.slice(0, 4)],
      ),
    [project.coverImage, project.gallery],
  );

  const backHref = getInteriorBackHref(project.category);

  return (
    <div className="overflow-x-hidden" style={{ backgroundColor: INTERIOR_DETAIL_PAGE_BG }}>
      <div className={INTERIOR_DETAIL_HERO_OUTER}>
        <section data-nav-backdrop="dark" className={INTERIOR_DETAIL_HERO_CLASS}>
          <DetailImage
            src={project.coverImage || FALLBACK}
            alt={project.detailTitle}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-[#f9f6f4]/45" />
        </section>
      </div>

      <div
        className={`${INTERIOR_DETAIL_SHELL} pb-14 pt-9 sm:pb-16 sm:pt-10 md:pb-20 md:pt-12 lg:pb-24 lg:pt-14`}
        data-nav-backdrop="light"
      >
        <div className={INTERIOR_DETAIL_CONTENT}>
          <div className={INTERIOR_DETAIL_MAIN_STACK}>
            <Link href={backHref} className={INTERIOR_DETAIL_BACK_LINK}>
              <ChevronLeft size={15} strokeWidth={2} aria-hidden />
              Back to Interior
            </Link>

            <header className={INTERIOR_DETAIL_HEADER_BLOCK}>
              <h1 className={INTERIOR_DETAIL_TITLE_CLASS}>{project.detailTitle}</h1>
              <p className={INTERIOR_DETAIL_INTRO_CLASS}>{project.description}</p>
            </header>

            <div className={INTERIOR_DETAIL_HEADER_TO_SLIDER}>
              <InteriorDetailGallerySlider
                images={sliderImages}
                title={project.detailTitle}
                bodyText={detailBody}
              />
            </div>
          </div>
        </div>

        <div className={INTERIOR_DETAIL_CONTENT}>
          <YouMayLikeSection items={related} category={project.category} />
        </div>
      </div>
    </div>
  );
}
