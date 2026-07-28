"use client";

import { Download } from "lucide-react";
import { CATALOGUE_CARD_HEIGHT } from "@/components/catalogue/catalogueLayoutShared";

type CatalogueNotebookCardProps = {
  coverImage: string;
  year?: string;
  hovered?: boolean;
  onClick?: () => void;
  className?: string;
};

/** Figma "Free catalogue Card" — scaled +20% (400×538); hover lift via transform only */
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
      className={`group relative block w-full cursor-pointer select-none bg-transparent p-0 text-left outline-none transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${hovered ? "-translate-y-3 scale-[1.045]" : "translate-y-2 scale-100"} ${className}`.trim()}
      aria-label="Download catalogue"
    >
      <div className="relative pl-6">
        <div className="pointer-events-none absolute left-0 top-4 bottom-4 z-20 flex w-4 flex-col justify-between">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="-ml-1 h-1.5 w-5 rounded-full border border-gray-500/20 bg-gradient-to-r from-gray-400 to-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
            />
          ))}
        </div>

        <div
          className={`relative ${CATALOGUE_CARD_HEIGHT} w-full overflow-hidden rounded-l-[4px] rounded-r-[14px] border border-[#e5dcd3]/40 bg-[#5c3d42] shadow-[5px_5px_15px_rgba(0,0,0,0.12)] transition-shadow duration-300 ${hovered ? "shadow-[0_16px_36px_rgba(0,0,0,0.18)]" : ""}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt="Varsovia design catalogue"
            className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.02]"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-between px-6 py-10 text-center text-white">
            <span className="font-outfit mt-2 text-sm font-bold tracking-[0.16em] opacity-80">{year}</span>

            <div className="font-display space-y-1 leading-tight tracking-[0.08em]">
              <p className="text-[clamp(1.35rem,2.4vw,1.9rem)] font-light">EXPLORE</p>
              <p className="text-[clamp(1.45rem,2.6vw,2.1rem)] font-bold">KITCHEN</p>
              <p className="text-[clamp(1.35rem,2.4vw,1.9rem)] font-light">DESIGN</p>
            </div>

            <span className="font-outfit inline-flex items-center gap-1.5 rounded-full border border-[#5c3d42]/10 bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#5c3d42] shadow-md transition group-hover:bg-[#f6eaea]">
              Download
              <Download size={13} aria-hidden />
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute right-0 top-1 bottom-1 z-10 w-1 rounded-r-[12px] border border-[#e5dcd3]/60 bg-white shadow-[2px_0_5px_rgba(0,0,0,0.05)]" />
      </div>
    </button>
  );
}
