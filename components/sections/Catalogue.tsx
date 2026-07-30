"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getRelativeOffset } from "@/lib/carousel";
import DownloadCatalogueModal from "@/components/forms/DownloadCatalogueModal";
import SectionHeading from "@/components/ui/SectionHeading";
import { SECTION_HEADING_WIDE } from "@/components/ui/SectionShell";
import { CATALOGUE_CONTENT_WIDTH, CATALOGUE_SECTION_SHELL } from "@/components/catalogue/catalogueLayoutShared";
import { catalogueCoverPhoto } from "@/components/catalogue/catalogueMedia";
import CatalogueBrochureFace from "@/components/catalogue/CatalogueBrochureFace";
import {
  brochureThemeForIndex,
  HOME_CAROUSEL_DEFAULT_ACTIVE,
} from "@/components/catalogue/catalogueBrochureThemes";
import { fallbackHomeData } from "@/lib/fallbackData";
import { MEDIA } from "@/lib/mediaAssets";

const FALLBACK_CATALOGUES = [
  { id: "1", image: MEDIA.catalogues[0], title: "Classic Collection 2026", downloadUrl: "" },
  { id: "2", image: MEDIA.catalogues[1], title: "Modern Living 2026", downloadUrl: "" },
  { id: "3", image: MEDIA.catalogues[2], title: "Explore Modern Design", downloadUrl: "" },
  { id: "4", image: MEDIA.catalogues[3], title: "Warm Neutrals", downloadUrl: "" },
  { id: "5", image: MEDIA.catalogues[4], title: "Urban Kitchens", downloadUrl: "" },
];

type CatalogueItem = {
  _id?: string;
  id?: string;
  title: string;
  coverImage?: string;
  image?: string;
  downloadUrl?: string;
};

type CatalogueProps = {
  catalogues?: CatalogueItem[];
  contactImages?: string[];
};

const CARD_WIDTH_DESKTOP = 221;
const CARD_HEIGHT_DESKTOP = 324;
const TRACK_HEIGHT_DESKTOP = 430;
const MAX_VISIBLE_OFFSET = 2;
const DRAG_THRESHOLD = 60;
const AUTOPLAY_MS = 5500;

/** Uniform resting appearance for every visible slide */
function getCoverflowStyle() {
  return {
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    z: 0,
    y: 0,
    opacity: 1,
    blur: 0,
  };
}

const CARD_HOVER_SHADOW = "0 22px 48px rgba(70,40,50,0.24)";
const CARD_REST_SHADOW = "0 12px 32px rgba(70,40,50,0.14)";

function catalogueImage(item: CatalogueItem, index: number) {
  const theme = brochureThemeForIndex(index, item.title);
  const cover = item.coverImage ?? item.image;
  return catalogueCoverPhoto(cover, index, theme.photo);
}

export default function Catalogue({ catalogues, contactImages = fallbackHomeData.site.contactImages }: CatalogueProps) {
  const t = useTranslations("home");
  const raw: CatalogueItem[] = catalogues && catalogues.length > 0 ? catalogues : FALLBACK_CATALOGUES;
  const CATALOGUES = raw.map((c, index) => {
    const theme = brochureThemeForIndex(index, c.title);
    return {
      id: c._id || c.id || c.title,
      image: catalogueImage(c, index),
      title: c.title,
      downloadUrl: c.downloadUrl || "",
      room: theme.room,
    };
  });
  const length = CATALOGUES.length;
  const [active, setActive] = useState(
    length > HOME_CAROUSEL_DEFAULT_ACTIVE ? HOME_CAROUSEL_DEFAULT_ACTIVE : 0,
  );
  const [paused, setPaused] = useState(false);
  const [cardWidth, setCardWidth] = useState(CARD_WIDTH_DESKTOP);
  const [cardHeight, setCardHeight] = useState(CARD_HEIGHT_DESKTOP);
  const [trackHeight, setTrackHeight] = useState(TRACK_HEIGHT_DESKTOP);
  const [step, setStep] = useState(CARD_WIDTH_DESKTOP + 56);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDownloadUrl, setSelectedDownloadUrl] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hoverLockedRef = useRef(true);
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  function hitTestCatalogueIndex(clientX: number, clientY: number): number | null {
    const track = trackRef.current;
    if (!track) return null;

    const rect = track.getBoundingClientRect();
    const cardTop = rect.top + 16;
    const cardBottom = cardTop + cardHeight;
    if (clientY < cardTop || clientY > cardBottom) return null;

    const centerX = rect.left + rect.width / 2;
    const relX = clientX - centerX;
    const half = cardWidth / 2;

    let bestIndex: number | null = null;
    let bestDist = Infinity;

    for (let index = 0; index < length; index++) {
      const offset = getRelativeOffset(index, active, length);
      if (Math.abs(offset) > MAX_VISIBLE_OFFSET) continue;

      const cardCenterX = offset * step;
      const dist = Math.abs(relX - cardCenterX);
      if (dist <= half && dist < bestDist) {
        bestDist = dist;
        bestIndex = index;
      }
    }

    return bestIndex;
  }

  function updateHoverFromPointer(clientX: number, clientY: number) {
    if (hoverLockedRef.current || prefersReducedMotion) {
      setHoveredIndex(null);
      return;
    }
    setHoveredIndex(hitTestCatalogueIndex(clientX, clientY));
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lockHover = () => {
      hoverLockedRef.current = true;
      setHoveredIndex(null);
    };

    window.addEventListener("scroll", lockHover, { passive: true, capture: true });
    window.addEventListener("wheel", lockHover, { passive: true });

    return () => {
      window.removeEventListener("scroll", lockHover, true);
      window.removeEventListener("wheel", lockHover);
    };
  }, []);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      let width = CARD_WIDTH_DESKTOP;
      let height = CARD_HEIGHT_DESKTOP;
      let track = TRACK_HEIGHT_DESKTOP;
      let gap = 68;

      if (w < 380) {
        width = Math.min(156, w - 56);
        height = 228;
        track = 300;
        gap = 28;
      } else if (w < 640) {
        width = 176;
        height = 258;
        track = 340;
        gap = 36;
      } else if (w < 1024) {
        width = 198;
        height = 290;
        track = 390;
        gap = 52;
      }

      setCardWidth(width);
      setCardHeight(height);
      setTrackHeight(track);
      setStep(width + gap);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (paused || prefersReducedMotion) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, prefersReducedMotion, length]);

  function prev() {
    setActive((p) => (p - 1 + length) % length);
  }

  function next() {
    setActive((p) => (p + 1) % length);
  }

  function goTo(index: number) {
    setActive(((index % length) + length) % length);
  }

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    setPaused(false);
    if (info.offset.x <= -DRAG_THRESHOLD || info.velocity.x < -400) {
      next();
    } else if (info.offset.x >= DRAG_THRESHOLD || info.velocity.x > 400) {
      prev();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  }

  function openDownload(item: (typeof CATALOGUES)[number]) {
    setSelectedDownloadUrl(item.downloadUrl || item.image);
    setModalOpen(true);
  }

  const springTransition = prefersReducedMotion
    ? { duration: 0.2 }
    : { type: "spring" as const, stiffness: 210, damping: 28, mass: 0.85 };

  return (
    <>
      <section id="catalogue" className="bg-transparent py-14 sm:py-16 md:py-20">
        <div className={CATALOGUE_SECTION_SHELL}>
          <div className={CATALOGUE_CONTENT_WIDTH}>
            <SectionHeading
              title={t("catalogueTitle")}
              subtitle={t("catalogueSubtitle")}
              className={SECTION_HEADING_WIDE}
            />
          </div>

          <div
            ref={trackRef}
            role="region"
            aria-roledescription="carousel"
            aria-label={t("catalogueAria")}
            tabIndex={0}
            className="relative mt-4 w-full min-w-0 cursor-grab overflow-x-hidden overflow-y-visible bg-transparent outline-none focus-visible:outline-none active:cursor-grabbing md:mt-8 [@media(hover:hover)]:cursor-grab"
            style={{ height: trackHeight, perspective: Math.min(1400, trackHeight * 3.2) }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => {
              setPaused(false);
              hoverLockedRef.current = true;
              setHoveredIndex(null);
            }}
            onPointerDown={(e) => {
              if (e.pointerType === "mouse") {
                pointerDownRef.current = { x: e.clientX, y: e.clientY };
              }
            }}
            onPointerMove={(e) => {
              if (e.pointerType !== "mouse") return;
              hoverLockedRef.current = false;
              updateHoverFromPointer(e.clientX, e.clientY);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") {
                setHoveredIndex(null);
                pointerDownRef.current = null;
              }
            }}
            onPointerUp={(e) => {
              if (e.button !== 0) return;
              const start = pointerDownRef.current;
              pointerDownRef.current = null;
              if (start) {
                const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
                if (moved > 8) return;
              }
              const hit = hitTestCatalogueIndex(e.clientX, e.clientY);
              if (hit === null) return;
              const offset = getRelativeOffset(hit, active, length);
              if (offset !== 0) goTo(hit);
            }}
            onKeyDown={handleKeyDown}
          >
            <motion.div
              className="relative mx-auto h-full w-full touch-pan-y overflow-visible"
              style={{ transformStyle: "preserve-3d" }}
              drag="x"
              dragElastic={0.1}
              dragConstraints={{ left: 0, right: 0 }}
              dragMomentum={false}
              onDragStart={() => setPaused(true)}
              onDragEnd={handleDragEnd}
            >
              {CATALOGUES.map((item, index) => {
                const offset = getRelativeOffset(index, active, length);
                if (Math.abs(offset) > MAX_VISIBLE_OFFSET) return null;

                const isCenter = offset === 0;
                const style = getCoverflowStyle();
                const isHovered = hoveredIndex === index;
                const displayScale = isHovered && !prefersReducedMotion ? 1.05 : 1;

                return (
                  <motion.div
                    key={item.id}
                    data-catalogue-card
                    tabIndex={-1}
                    role={isCenter ? undefined : "presentation"}
                    onKeyDown={(e) => {
                      if (isCenter) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goTo(index);
                      }
                    }}
                    aria-label={`Show catalogue ${item.title}${isCenter ? " (current)" : ""}`}
                    aria-current={isCenter}
                    className="absolute left-1/2 top-4 cursor-default bg-transparent p-0 outline-none pointer-events-none"
                    style={{
                      width: cardWidth,
                      height: cardHeight,
                      marginLeft: -cardWidth / 2,
                      borderRadius: "6px 24px 24px 6px",
                      overflow: "hidden",
                      borderLeft: "4.6px solid #251B1E",
                      boxShadow: isHovered ? CARD_HOVER_SHADOW : CARD_REST_SHADOW,
                      transformOrigin: "center center",
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                      willChange: "transform, filter, opacity",
                    }}
                    initial={false}
                    animate={{
                      x: offset * step,
                      y: style.y,
                      z: style.z,
                      rotateY: 0,
                      rotateZ: 0,
                      scale: displayScale,
                      zIndex: 10 + (isHovered ? 5 : 0) - Math.abs(offset),
                      filter: "none",
                      opacity: style.opacity,
                    }}
                    transition={springTransition}
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="pointer-events-none absolute inset-0 h-full w-full scale-[1.04] object-cover object-center"
                      draggable={false}
                    />

                    <CatalogueBrochureFace
                      year="2026"
                      room={item.room}
                      variant="carousel"
                      metrics={{ width: cardWidth, height: cardHeight }}
                      downloadInteractive
                      className="pointer-events-none [&_button]:pointer-events-auto"
                      onDownload={(e) => {
                        e.stopPropagation();
                        openDownload(item);
                      }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 pb-2">
            <button
              type="button"
              aria-label={t("cataloguePrev")}
              onClick={prev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#c9a4ab] text-[#6b3d48] transition hover:scale-105 hover:bg-[#b88f97] active:scale-95"
            >
              <ChevronLeft size={20} strokeWidth={2.2} />
            </button>

            <button
              type="button"
              aria-label={t("catalogueNext")}
              onClick={next}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#c9a4ab] text-[#6b3d48] transition hover:scale-105 hover:bg-[#b88f97] active:scale-95"
            >
              <ChevronRight size={20} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </section>

      <DownloadCatalogueModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        downloadUrl={selectedDownloadUrl}
        images={contactImages}
      />
    </>
  );
}
