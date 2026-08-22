"use client";

import { useEffect, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { resolveMediaUrl } from "@/lib/mediaAssets";

export type ShowcaseProductCardProps = {
  title: string;
  description?: string;
  image?: string;
  imageFallback: string;
  href: string;
  category?: string;
  index?: number;
  isNew?: boolean;
  ctaLabel?: string;
  motionVariant?: "inView" | "mount" | "none";
  /** Home: hover reveals copy. Interior / showcase: Figma listing overlay. */
  variant?: "home" | "interior" | "showcase";
  className?: string;
};

const CARD_HOME =
  "group relative w-full aspect-[3/4] min-h-[224px] overflow-hidden rounded-[16px] bg-[#e8e2e0] sm:min-h-0 sm:rounded-[22px]";

const CARD_INTERIOR =
  "group relative w-full aspect-[3/4] min-h-[224px] overflow-hidden rounded-[10px] bg-[#e8e2e0] sm:min-h-0";

const CARD_SHOWCASE =
  "group relative w-full aspect-[3/4] min-h-[224px] overflow-hidden rounded-[14px] bg-[#e8e2e0] shadow-[0_4px_20px_rgba(107,44,58,0.06)] sm:min-h-0";

function CardImage({
  src,
  fallback,
  alt,
  zoomed,
}: {
  src?: string;
  fallback: string;
  alt: string;
  zoomed: boolean;
}) {
  const [current, setCurrent] = useState(() => resolveMediaUrl(src, fallback));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const resolved = resolveMediaUrl(src, fallback);
    if (resolved !== current) {
      setLoaded(false);
      setCurrent(resolved);
    }
  }, [src, fallback, current]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out ${
        zoomed ? "scale-110" : "scale-100"
      } ${loaded ? "opacity-100" : "opacity-0"}`}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (current !== fallback) {
          setLoaded(false);
          setCurrent(fallback);
        }
      }}
    />
  );
}

function formatCategoryLabel(category?: string) {
  if (!category?.trim()) return null;
  return category.trim().toUpperCase();
}

export default function ShowcaseProductCard({
  title,
  description,
  image,
  imageFallback,
  href,
  category,
  index = 0,
  isNew = false,
  ctaLabel,
  motionVariant = "inView",
  variant = "home",
  className = "",
}: ShowcaseProductCardProps) {
  const tHome = useTranslations("home");
  const [open, setOpen] = useState(false);
  const cta = ctaLabel ?? tHome("exploreInteriors");
  const isInterior = variant === "interior";
  const isShowcase = variant === "showcase";
  const isListingCard = isInterior || isShowcase;
  const shell = isShowcase ? CARD_SHOWCASE : isInterior ? CARD_INTERIOR : CARD_HOME;
  const categoryLabel = formatCategoryLabel(category);

  const body = (
    <>
      <Link href={href} className="absolute inset-0 z-20 rounded-[inherit]">
        <span className="sr-only">{title}</span>
      </Link>

      <CardImage src={image} fallback={imageFallback} alt={title} zoomed={open} />

      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t transition-opacity duration-400 ${
          isListingCard
            ? `from-black/80 via-black/35 to-transparent ${open ? "opacity-100" : "opacity-90"}`
            : `from-black/80 via-black/25 to-transparent ${open ? "opacity-100" : "opacity-80"}`
        }`}
      />

      {isNew ? (
        <span className="pointer-events-none absolute left-4 top-4 z-10 rounded-[4px] bg-[#cf5374]/95 px-2.5 py-1 font-outfit text-[12px] font-medium text-white">
          New
        </span>
      ) : null}

      {isListingCard ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-14 md:px-5 md:pb-5">
          {isInterior && categoryLabel ? (
            <p className="font-outfit text-[11px] font-medium uppercase tracking-[0.14em] text-[#cf5374]">
              {categoryLabel}
            </p>
          ) : null}
          <h3
            className={`font-outfit font-medium leading-snug text-white ${
              isShowcase
                ? "text-[clamp(0.875rem,1.6vw,1rem)] line-clamp-3"
                : "mt-1 text-[clamp(1rem,2.1vw,1.25rem)] font-semibold"
            }`}
          >
            {title}
          </h3>
          {isInterior && description ? (
            <p className="mt-2 line-clamp-2 font-outfit text-[12px] font-normal leading-[1.5] text-white/90 md:text-[13px]">
              {description}
            </p>
          ) : null}
          <span
            className={`mt-3 block h-[2px] max-w-full rounded-full bg-[#cf5374] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "w-full" : "w-10"
            }`}
            aria-hidden
          />
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-5 md:p-6">
          <h3 className="text-[1.35rem] font-semibold leading-tight text-white md:text-[1.5rem]">
            {title}
          </h3>

          <div
            className={`grid transition-all duration-500 ease-out ${
              open ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              {description ? (
                <p className="text-[0.88rem] leading-6 text-white/90">{description}</p>
              ) : null}
              <span className="mt-3 inline-flex items-center gap-1.5 text-[0.92rem] font-medium text-[#e85d8a]">
                {cta}
                <span aria-hidden>→</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const interaction = {
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    tabIndex: 0 as const,
  };

  if (motionVariant === "none") {
    return (
      <article className={`${shell} ${className}`.trim()} {...interaction}>
        {body}
      </article>
    );
  }

  if (motionVariant === "mount") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.06, 0.36), duration: 0.45, ease: "easeOut" }}
        className={`${shell} ${className}`.trim()}
        {...interaction}
      >
        {body}
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.55 }}
      className={`${shell} ${className}`.trim()}
      {...interaction}
    >
      {body}
    </motion.article>
  );
}
