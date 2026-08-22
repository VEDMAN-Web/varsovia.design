"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getRelativeOffset } from "@/lib/carousel";
import DownloadCatalogueModal from "@/components/forms/DownloadCatalogueModal";
import SectionHeadingReveal from "@/components/ui/SectionHeadingReveal";
import { SECTION_HEADING_WIDE, SITE_SECTION_PADDING_Y } from "@/components/ui/SectionShell";
import { CATALOGUE_CONTENT_WIDTH, CATALOGUE_SECTION_SHELL } from "@/components/catalogue/catalogueLayoutShared";
import {
  catalogueCarouselDiskLayout,
  HOME_CATALOGUE_CAROUSEL_FIGMA,
} from "@/components/catalogue/catalogueCarouselLayout";
import { catalogueCoverPhoto } from "@/components/catalogue/catalogueMedia";
import CatalogueBrochureFace from "@/components/catalogue/CatalogueBrochureFace";
import {
  brochureThemeForIndex,
  HOME_CAROUSEL_DEFAULT_ACTIVE,
} from "@/components/catalogue/catalogueBrochureThemes";
import { fallbackHomeData } from "@/lib/fallbackData";
import { fadeUpItem, reducedFadeUpItem, VIEWPORT_ONCE } from "@/lib/motionPresets";
import { MEDIA } from "@/lib/mediaAssets";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";

const FALLBACK_CATALOGUES = [
  { id: "1", image: MEDIA.catalogues[0], title: "Classic Collection 2026", downloadUrl: "" },
  { id: "2", image: MEDIA.catalogues[1], title: "Modern Living", downloadUrl: "" },
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

const {
  cardWidth: CARD_WIDTH_DESKTOP,
  cardHeight: CARD_HEIGHT_DESKTOP,
  gapDesktop: GAP_DESKTOP,
  trackHeightDesktop: TRACK_HEIGHT_DESKTOP,
  maxVisibleOffset: MAX_VISIBLE_OFFSET,
} = HOME_CATALOGUE_CAROUSEL_FIGMA;

const DRAG_THRESHOLD = 60;
const AUTOPLAY_MS = 5500;
const CARD_TRACK_INSET_TOP = 8;

const CARD_HOVER_SHADOW = "0 22px 48px rgba(70,40,50,0.24)";
const CARD_REST_SHADOW = "0 12px 32px rgba(70,40,50,0.14)";

function catalogueImage(item: CatalogueItem, index: number) {
  const theme = brochureThemeForIndex(index, item.title);
  const cover = item.coverImage ?? item.image;
  return catalogueCoverPhoto(cover, index, theme.photo);
}

export default function Catalogue({ catalogues, contactImages = fallbackHomeData.site.contactImages }: CatalogueProps) {
  const t = useTranslations("home");
  const site = useSiteSettings();
  const section = site?.sectionCopy?.catalogue;
  const raw: CatalogueItem[] = (catalogues || []).filter(
    (c) => (c as CatalogueItem & { visible?: boolean }).visible !== false,
  );
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
  const [cardWidth, setCardWidth] = useState<number>(CARD_WIDTH_DESKTOP);
  const [cardHeight, setCardHeight] = useState<number>(CARD_HEIGHT_DESKTOP);
  const [trackHeight, setTrackHeight] = useState<number>(TRACK_HEIGHT_DESKTOP);
  const [step, setStep] = useState<number>(CARD_WIDTH_DESKTOP + GAP_DESKTOP);
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
    const baseTop = rect.top + CARD_TRACK_INSET_TOP;
    const centerX = rect.left + rect.width / 2;
    const relX = clientX - centerX;
    const reduced = !!prefersReducedMotion;

    let bestIndex: number | null = null;
    let bestDist = Infinity;

    for (let index = 0; index < length; index++) {
      const offset = getRelativeOffset(index, active, length);
      if (Math.abs(offset) > MAX_VISIBLE_OFFSET) continue;

      const layout = catalogueCarouselDiskLayout(offset, step, reduced);
      const half = (cardWidth * layout.scale) / 2;
      const cardTop = baseTop + layout.y;
      const cardBottom = cardTop + cardHeight * layout.scale;

      if (clientY < cardTop || clientY > cardBottom) continue;

      const dist = Math.abs(relX - layout.x);
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

    // Use Lenis scroll event instead of window scroll for better performance
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.on('scroll', lockHover);
    }

    window.addEventListener("wheel", lockHover, { passive: true });

    return () => {
      if (lenis) {
        lenis.off('scroll', lockHover);
      }
      window.removeEventListener("wheel", lockHover);
    };
  }, []);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      let width: number = CARD_WIDTH_DESKTOP;
      let height: number = CARD_HEIGHT_DESKTOP;
      let track: number = TRACK_HEIGHT_DESKTOP;
      let gap: number = GAP_DESKTOP;

      if (w < 380) {
        width = Math.min(156, w - 56);
        height = Math.round(width * (CARD_HEIGHT_DESKTOP / CARD_WIDTH_DESKTOP));
        track = 268;
        gap = 24;
      } else if (w < 640) {
        width = 176;
        height = Math.round(width * (CARD_HEIGHT_DESKTOP / CARD_WIDTH_DESKTOP));
        track = 300;
        gap = 32;
      } else if (w < 1024) {
        width = 198;
        height = Math.round(width * (CARD_HEIGHT_DESKTOP / CARD_WIDTH_DESKTOP));
        track = 328;
        gap = 44;
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
    if (length === 0 || paused || prefersReducedMotion) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, prefersReducedMotion, length]);

  if (length === 0) return null;

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
    : { type: "spring" as const, stiffness: 220, damping: 30, mass: 0.82 };

  return (
    <>
      <section
        id="catalogue"
        className={`overflow-x-clip bg-transparent ${SITE_SECTION_PADDING_Y} !pb-6 !pt-8 sm:!pb-8 sm:!pt-10 md:!pb-10 md:!pt-14`}
      >
        <div className={CATALOGUE_SECTION_SHELL}>
          <div className={CATALOGUE_CONTENT_WIDTH}>
            <SectionHeadingReveal
              title={section?.title || t("catalogueTitle")}
              subtitle={section?.subtitle || t("catalogueSubtitle")}
              className={SECTION_HEADING_WIDE}
            />

            <motion.div
              className="mt-4 overflow-hidden md:mt-6"
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              variants={prefersReducedMotion ? reducedFadeUpItem : fadeUpItem}
            >
              <div
                ref={trackRef}
                role="region"
                aria-roledescription="carousel"
                aria-label={t("catalogueAria")}
                tabIndex={0}
                className="relative mx-auto w-full min-w-0 max-w-[min(100%,1584px)] cursor-grab overflow-hidden bg-transparent outline-none focus-visible:outline-none active:cursor-grabbing [@media(hover:hover)]:cursor-grab"
                style={{ height: trackHeight }}
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
                  className="relative mx-auto h-full w-full touch-pan-y overflow-hidden"
                  drag="x"
                  dragElastic={0.08}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragMomentum={false}
                  onDragStart={() => setPaused(true)}
                  onDragEnd={handleDragEnd}
                >
                  {CATALOGUES.map((item, index) => {
                    const offset = getRelativeOffset(index, active, length);
                    if (Math.abs(offset) > MAX_VISIBLE_OFFSET) return null;

                    const isCenter = offset === 0;
                    const layout = catalogueCarouselDiskLayout(offset, step, !!prefersReducedMotion);
                    const isHovered = hoveredIndex === index;
                    const hoverBoost = isHovered && !prefersReducedMotion ? 1.04 : 1;
                    const displayScale = layout.scale * hoverBoost;

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
                        className="absolute left-1/2 cursor-default bg-transparent p-0 outline-none pointer-events-none"
                        style={{
                          top: CARD_TRACK_INSET_TOP,
                          width: cardWidth,
                          height: cardHeight,
                          marginLeft: -cardWidth / 2,
                          borderRadius: "6px 24px 24px 6px",
                          overflow: "hidden",
                          borderLeft: "4.6px solid #251B1E",
                          boxShadow: isHovered ? CARD_HOVER_SHADOW : CARD_REST_SHADOW,
                          transformOrigin: "center center",
                          willChange: "transform, opacity",
                          transform: "translateZ(0)",
                        }}
                        initial={false}
                        animate={{
                          x: layout.x,
                          y: layout.y,
                          rotateY: 0,
                          rotateZ: 0,
                          scale: displayScale,
                          zIndex: 40 - Math.abs(offset) * 8 + (isHovered ? 4 : 0),
                          filter: layout.blur > 0 ? `blur(${layout.blur}px)` : "none",
                          opacity: layout.opacity,
                        }}
                        transition={springTransition}
                      >
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="pointer-events-none absolute inset-0 h-full w-full scale-[1.04] object-cover object-center"
                          draggable={false}
                        />

                        <CatalogueBrochureFace
                          year="2026"
                          room={item.room}
                          variant="carousel"
                          metrics={{ width: cardWidth, height: cardHeight }}
                          downloadInteractive
                          downloadLabel={section?.ctaLabel || t("catalogueDownload")}
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

              <div className="mt-3 flex items-center justify-center gap-3 pb-1">
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
            </motion.div>
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
