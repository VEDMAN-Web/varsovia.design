"use client";

import { useEffect, useRef, useState } from "react";
import { CATALOGUE_CARD_ASPECT } from "@/components/catalogue/catalogueLayoutShared";
import CatalogueBrochureFace from "@/components/catalogue/CatalogueBrochureFace";
import type { BrochureRoomKey } from "@/components/catalogue/catalogueBrochureThemes";
import {
  notebookMetricsFromWidth,
  type CarouselFaceMetrics,
} from "@/components/catalogue/catalogueCarouselTypography";

type CatalogueNotebookCardProps = {
  coverImage: string;
  room?: BrochureRoomKey;
  year?: string;
  hovered?: boolean;
  onClick?: () => void;
  className?: string;
};

export default function CatalogueNotebookCard({
  coverImage,
  room = "KITCHEN",
  year = "2026",
  hovered = false,
  onClick,
  className = "",
}: CatalogueNotebookCardProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<CarouselFaceMetrics | null>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setMetrics(notebookMetricsFromWidth(w));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative block w-full cursor-pointer select-none rounded-r-[14px] bg-transparent p-0 text-left outline-none transition-transform duration-300 ease-out will-change-transform focus-visible:ring-2 focus-visible:ring-[#cf5374] focus-visible:ring-offset-4 focus-visible:ring-offset-cream active:scale-[0.99] motion-reduce:transition-none motion-reduce:transform-none ${
        hovered ? "-translate-y-2 scale-[1.03] lg:-translate-y-3 lg:scale-[1.045]" : "translate-y-0 scale-100"
      } ${className}`.trim()}
      aria-label="Download catalogue"
    >
      <div className="relative pl-4 sm:pl-5 lg:pl-6">
        <div className="pointer-events-none absolute left-0 top-3 bottom-3 z-20 flex w-3 flex-col justify-between sm:w-4 lg:top-4 lg:bottom-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="-ml-0.5 h-1 w-4 rounded-full border border-gray-500/20 bg-gradient-to-r from-gray-400 to-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.1)] sm:h-1.5 sm:w-5"
            />
          ))}
        </div>

        <div
          ref={bodyRef}
          className={`relative ${CATALOGUE_CARD_ASPECT} w-full overflow-hidden rounded-l-[3px] rounded-r-[10px] border border-[#e5dcd3]/40 bg-[#5c3d42] shadow-[4px_4px_12px_rgba(0,0,0,0.12)] transition-shadow duration-300 sm:rounded-r-[12px] lg:rounded-r-[14px] ${
            hovered ? "shadow-[0_12px_28px_rgba(0,0,0,0.18)]" : ""
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt=""
            className="h-full w-full scale-[1.03] object-cover object-center opacity-90 transition-transform duration-500 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            draggable={false}
            loading="lazy"
            decoding="async"
          />

          <CatalogueBrochureFace
            year={year}
            room={room}
            variant="notebook"
            metrics={metrics ?? undefined}
            downloadInteractive={false}
          />
        </div>

        <div className="pointer-events-none absolute right-0 top-1 bottom-1 z-10 w-0.5 rounded-r-[10px] border border-[#e5dcd3]/60 bg-white shadow-[2px_0_4px_rgba(0,0,0,0.05)] sm:w-1" />
      </div>
    </button>
  );
}
