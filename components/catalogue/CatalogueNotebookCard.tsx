"use client";

import { Download } from "lucide-react";
import { CATALOGUE_CARD_ASPECT } from "@/components/catalogue/catalogueLayoutShared";

type CatalogueNotebookCardProps = {
  coverImage: string;
  year?: string;
  hovered?: boolean;
  onClick?: () => void;
  className?: string;
};

/**
 * Figma "Free catalogue Card". Type and padding scale from the card's own width
 * (container queries) rather than the viewport, so a card reads correctly whether
 * it sits in a one, two or three column row.
 */
export default function CatalogueNotebookCard({
  coverImage,
  year = "2026",
  hovered = false,
  onClick,
  className = "",
}: CatalogueNotebookCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative block w-full cursor-pointer select-none rounded-r-[14px] bg-transparent p-0 text-left outline-none transition-transform duration-300 ease-out will-change-transform focus-visible:ring-2 focus-visible:ring-[#cf5374] focus-visible:ring-offset-4 focus-visible:ring-offset-cream active:scale-[0.99] motion-reduce:transition-none motion-reduce:transform-none ${
        hovered ? "-translate-y-2 scale-[1.03] lg:-translate-y-3 lg:scale-[1.045]" : "translate-y-0 scale-100"
      } ${className}`.trim()}
      aria-label="Download catalogue"
    >
      {/* Notebook wrapper — spiral on left, page edge on right */}
      <div className="relative pl-4 sm:pl-5 lg:pl-6">
        {/* Spiral binding */}
        <div className="pointer-events-none absolute left-0 top-3 bottom-3 z-20 flex w-3 flex-col justify-between sm:w-4 lg:top-4 lg:bottom-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="-ml-0.5 h-1 w-4 rounded-full border border-gray-500/20 bg-gradient-to-r from-gray-400 to-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.1)] sm:h-1.5 sm:w-5"
            />
          ))}
        </div>

        {/* Card body */}
        <div
          className={`@container relative ${CATALOGUE_CARD_ASPECT} w-full overflow-hidden rounded-l-[3px] rounded-r-[10px] border border-[#e5dcd3]/40 bg-[#5c3d42] shadow-[4px_4px_12px_rgba(0,0,0,0.12)] transition-shadow duration-300 sm:rounded-r-[12px] lg:rounded-r-[14px] ${
            hovered ? "shadow-[0_12px_28px_rgba(0,0,0,0.18)]" : ""
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt="Varsovia design catalogue"
            className="h-full w-full object-cover object-center opacity-85 transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            draggable={false}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-between px-[6cqw] py-[7cqw] text-center text-white">
            <span className="font-outfit text-[clamp(0.625rem,3.2cqw,0.875rem)] font-bold tracking-[0.16em] opacity-80">
              {year}
            </span>

            <div className="font-display leading-tight tracking-[0.08em]">
              <p className="text-[clamp(1rem,6.8cqw,1.9rem)] font-light">EXPLORE</p>
              <p className="text-[clamp(1.1rem,7.6cqw,2.1rem)] font-bold">KITCHEN</p>
              <p className="text-[clamp(1rem,6.8cqw,1.9rem)] font-light">DESIGN</p>
            </div>

            <span className="font-outfit inline-flex items-center gap-1.5 rounded-full border border-[#5c3d42]/10 bg-white px-[4.5cqw] py-[2cqw] text-[clamp(0.5625rem,2.6cqw,0.75rem)] font-bold uppercase tracking-wider text-[#5c3d42] shadow-md transition-colors duration-200 group-hover:bg-[#f6eaea]">
              Download
              <Download className="size-[1em]" aria-hidden />
            </span>
          </div>
        </div>

        {/* Right page edge */}
        <div className="pointer-events-none absolute right-0 top-1 bottom-1 z-10 w-0.5 rounded-r-[10px] border border-[#e5dcd3]/60 bg-white shadow-[2px_0_4px_rgba(0,0,0,0.05)] sm:w-1" />
      </div>
    </button>
  );
}
