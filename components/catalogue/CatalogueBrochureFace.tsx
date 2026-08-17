"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BrochureRoomKey } from "@/components/catalogue/catalogueBrochureThemes";
import {
  carouselFaceStyles,
  type CarouselFaceMetrics,
} from "@/components/catalogue/catalogueCarouselTypography";

type CatalogueBrochureFaceProps = {
  year?: string;
  room?: BrochureRoomKey;
  variant?: "carousel" | "notebook";
  metrics?: CarouselFaceMetrics;
  downloadInteractive?: boolean;
  onDownload?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  downloadLabel?: string;
  className?: string;
};

export default function CatalogueBrochureFace({
  year = "2026",
  room = "KITCHEN",
  variant = "carousel",
  metrics,
  downloadInteractive = false,
  onDownload,
  downloadLabel,
  className = "",
}: CatalogueBrochureFaceProps) {
  const t = useTranslations("home");
  const figma = metrics ? carouselFaceStyles(metrics, room) : null;

  const downloadIconSize = figma?.downloadIcon ?? { width: 16, height: 16 };

  const downloadIcon = (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/85 bg-white/10 text-white"
      style={{ width: downloadIconSize.width, height: downloadIconSize.height }}
      aria-hidden
    >
      <ArrowUpRight
        style={{ width: downloadIconSize.width * 0.55, height: downloadIconSize.height * 0.55 }}
        strokeWidth={2.4}
      />
    </span>
  );

  const downloadInner = (
    <>
      {downloadLabel || t("catalogueDownload")}
      {downloadIcon}
    </>
  );

  const downloadControl = downloadInteractive ? (
    <button
      type="button"
      onClick={onDownload}
      className="font-outfit pointer-events-auto inline-flex cursor-pointer items-center font-normal leading-none text-white underline decoration-white/80 transition hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      style={
        figma
          ? {
              fontSize: figma.download.fontSize,
              textUnderlineOffset: figma.download.textUnderlineOffset,
              gap: figma.download.gap,
            }
          : undefined
      }
    >
      {downloadInner}
    </button>
  ) : (
    <span
      className="font-outfit inline-flex items-center font-normal leading-none text-white underline decoration-white/80"
      style={
        figma
          ? {
              fontSize: figma.download.fontSize,
              textUnderlineOffset: figma.download.textUnderlineOffset,
              gap: figma.download.gap,
            }
          : undefined
      }
      aria-hidden
    >
      {downloadInner}
    </span>
  );

  if (variant === "notebook" && !figma) {
    return (
      <div className={`pointer-events-none absolute inset-0 ${className}`.trim()}>
        <div className="absolute inset-0 bg-black/22" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black/55 via-black/20 to-transparent" aria-hidden />
        <NotebookFaceFallback year={year} room={room} downloadControl={downloadControl} />
      </div>
    );
  }

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`.trim()}>
      <div className="absolute inset-0 bg-[rgba(37,27,30,0.28)]" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-[rgba(37,27,30,0.55)] to-transparent" aria-hidden />

      <div
        className="relative z-10 grid h-full grid-rows-[auto_1fr_auto] text-center text-white"
        style={figma?.shell}
      >
        <span className="font-outfit font-normal opacity-95" style={figma?.year}>
          {year}
        </span>

        <div className="flex flex-col items-center justify-center uppercase">
          <p className="font-outfit font-semibold" style={figma?.titleLine}>
            EXPLORE
          </p>
          <p className="font-outfit font-semibold" style={figma?.titleRoom}>
            {room}
          </p>
          <p className="font-outfit font-semibold" style={figma?.titleLine}>
            DESIGN
          </p>
        </div>

        <div className="pointer-events-none flex items-end justify-center [&_button]:pointer-events-auto">
          {downloadControl}
        </div>
      </div>
    </div>
  );
}

function NotebookFaceFallback({
  year,
  room,
  downloadControl,
}: {
  year: string;
  room: string;
  downloadControl: ReactNode;
}) {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-between px-[7cqw] py-[8cqw] text-center text-white">
      <span className="font-outfit text-[clamp(0.625rem,3.2cqw,0.875rem)] tracking-[0.16em] opacity-95">{year}</span>
      <div className="font-outfit w-full text-[clamp(0.875rem,5.5cqw,1.25rem)] font-semibold uppercase leading-[1.12] tracking-[0.04em]">
        <p>EXPLORE</p>
        <p>{room}</p>
        <p>DESIGN</p>
      </div>
      <div className="pointer-events-none flex items-end justify-center [&_button]:pointer-events-auto">{downloadControl}</div>
    </div>
  );
}
