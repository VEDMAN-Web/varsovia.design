"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Ruler,
  Users,
  Box,
  ShieldCheck,
  PenLine,
} from "lucide-react";
import { getRelativeOffset } from "@/lib/carousel";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionShell, { SECTION_HEADING_WIDE, SITE_SECTION_PADDING_Y } from "@/components/ui/SectionShell";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import type { ApiCoreStrength } from "@/lib/siteTypes";

const ICON_MAP = {
  eye: Eye,
  ruler: Ruler,
  users: Users,
  box: Box,
  shield: ShieldCheck,
  pen: PenLine,
} as const;

const FALLBACK_STRENGTHS = [
  {
    id: "1",
    icon: Eye,
    title: "Reveals hidden construction",
    description:
      "Shows material layering (flooring, subfloor, ceiling void, insulation) that plan views can't capture.",
    image: MEDIA.core[0],
  },
  {
    id: "2",
    icon: Ruler,
    title: "Accurate height & clearance planning",
    description:
      "Confirms ceiling heights, soffit drops, counter heights, and door/window head heights align correctly.",
    image: MEDIA.core[1],
  },
  {
    id: "3",
    icon: Users,
    title: "Coordinates trades",
    description:
      "Electricians, HVAC, plumbers, and carpenters can spot clashes before construction begins.",
    image: MEDIA.core[2],
  },
  {
    id: "4",
    icon: Box,
    title: "Precise material specification",
    description:
      "Lets you call out exact materials and thicknesses of each layer, e.g., for a window sill or built-in cabinet.",
    image: MEDIA.core[3],
  },
  {
    id: "5",
    icon: ShieldCheck,
    title: "Reduces on-site errors and rework",
    description:
      "Removes ambiguity, which is the biggest cause of site delays and budget overruns.",
    image: MEDIA.core[4],
  },
  {
    id: "6",
    icon: PenLine,
    title: "Communicates custom details clearly",
    description:
      "Essential for bespoke elements like staircases, false ceilings, or feature walls that standard drawings miss.",
    image: MEDIA.core[5],
  },
];

function resolveStrengths(items?: ApiCoreStrength[]) {
  if (!items?.length) return [];
  return items
    .filter((item) => (item as ApiCoreStrength & { visible?: boolean }).visible !== false)
    .map((item, index) => {
      const iconKey = (item.iconKey || "eye") as keyof typeof ICON_MAP;
      return {
        id: item._id,
        icon: ICON_MAP[iconKey] || Eye,
        title: item.title,
        description: item.description || "",
        image: resolveMediaUrl(item.image, MEDIA.core[index % MEDIA.core.length]),
      };
    });
}

const MAX_VISIBLE_OFFSET = 2;
const DRAG_THRESHOLD = 60;
const AUTOPLAY_MS = 3500;
const MIN_SCALE = 0.52;
const STAGE_WIDTH = 1244;

const RING1_ANGLE = 48;
const RING2_ANGLE = 68;
const BASE = {
  centerW: 384,
  centerH: 423,
  ring1ApparentW: 314,
  ring1H: 580,
  ring1X: 379,
  ring2ApparentW: 60,
  ring2H: 419,
  ring2X: 590,
};
const RING1_W = BASE.ring1ApparentW / Math.cos((RING1_ANGLE * Math.PI) / 180);
const RING2_W = BASE.ring2ApparentW / Math.cos((RING2_ANGLE * Math.PI) / 180);

/** Figma tilt-card spine (same ink as catalogue brochure edge) */
const CARD_SPINE_COLOR = "#251B1E";
const CARD_SPINE_PX = 4.6;

function cardSpineSide(offset: number): "left" | "right" | null {
  if (offset === 0) return null;
  /** Outer vertical edge (away from carousel center) */
  return offset < 0 ? "left" : "right";
}

function getGeometry(offset: number) {
  const abs = Math.abs(offset);
  const sign = offset === 0 ? 0 : offset < 0 ? -1 : 1;

  if (abs === 0) {
    return { width: BASE.centerW, height: BASE.centerH, x: 0, rotateY: 0, dim: 0, grayscale: 0, z: 30 };
  }
  if (abs === 1) {
    return {
      width: RING1_W,
      height: BASE.ring1H,
      x: sign * BASE.ring1X,
      rotateY: -sign * RING1_ANGLE,
      dim: 0.38,
      grayscale: 0.12,
      z: 20,
    };
  }
  return {
    width: RING2_W,
    height: BASE.ring2H,
    x: sign * BASE.ring2X,
    rotateY: -sign * RING2_ANGLE,
    dim: 0.55,
    grayscale: 0.3,
    z: 10,
  };
}

export default function CoreStrengths({ strengths }: { strengths?: ApiCoreStrength[] }) {
  const t = useTranslations("home");
  const site = useSiteSettings();
  const section = site?.sectionCopy?.coreStrengths;
  const STRENGTHS = resolveStrengths(strengths);
  const length = STRENGTHS.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = (width: number) => {
      setScale(Math.min(1, Math.max(MIN_SCALE, width / STAGE_WIDTH)));
    };
    update(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? el.clientWidth;
      update(width);
    });
    ro.observe(el);
    return () => ro.disconnect();
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
    setActive((i) => (i - 1 + length) % length);
  }

  function next() {
    setActive((i) => (i + 1) % length);
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

  const springTransition = prefersReducedMotion
    ? { duration: 0.2 }
    : { type: "spring" as const, stiffness: 170, damping: 26, mass: 0.9 };
  const trackHeight = BASE.ring1H * scale + 48;
  const perspectivePx = 2200 * scale;

  return (
    <section className={`bg-transparent ${SITE_SECTION_PADDING_Y} !pb-6 !pt-8 sm:!pb-8 sm:!pt-10 md:!pb-10 md:!pt-14`}>
      <SectionShell>
      <div className="text-center">
        <SectionHeading
          title={section?.title || t("strengthsTitle")}
          subtitle={section?.subtitle || t("strengthsSubtitle")}
          className={SECTION_HEADING_WIDE}
        />
      </div>

      <div
        ref={stageRef}
        className="relative z-10 mt-2 w-full px-2 sm:mt-3 sm:px-4 md:mt-3"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={t("strengthsAria")}
          tabIndex={0}
          className="relative mx-auto w-full cursor-grab overflow-hidden outline-none focus-visible:outline-none active:cursor-grabbing"
          style={{ height: trackHeight }}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            className="absolute inset-0 touch-pan-y"
            drag="x"
            dragElastic={0.12}
            dragConstraints={{ left: 0, right: 0 }}
            dragMomentum={false}
            onDragStart={() => setPaused(true)}
            onDragEnd={handleDragEnd}
          >
            {STRENGTHS.map((item, index) => {
              const offset = getRelativeOffset(index, active, length);
              if (Math.abs(offset) > MAX_VISIBLE_OFFSET) return null;

              const isCenter = offset === 0;
              const g = getGeometry(offset);
              const w = g.width * scale;
              const h = g.height * scale;
              const hideFar = Math.abs(offset) === 2;
              const Icon = item.icon;
              const spineSide = cardSpineSide(offset);
              const spineW = CARD_SPINE_PX * scale;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  tabIndex={-1}
                  aria-label={`${item.title}${isCenter ? " (current)" : ""}`}
                  aria-current={isCenter}
                  onClick={() => {
                    if (!isCenter) goTo(index);
                  }}
                  className={[
                    "absolute left-1/2 top-1/2 border-0 bg-transparent p-0 outline-none",
                    hideFar ? "max-[479px]:!hidden" : "",
                  ].join(" ")}
                  style={{
                    transformOrigin: "center center",
                    transformStyle: "preserve-3d",
                    transformPerspective: perspectivePx,
                    pointerEvents: "auto",
                  }}
                  initial={false}
                  animate={{
                    x: g.x * scale,
                    rotateY: g.rotateY,
                    width: w,
                    height: h,
                    marginLeft: -w / 2,
                    marginTop: -h / 2,
                    opacity: 1,
                    zIndex: g.z,
                  }}
                  transition={springTransition}
                >
                  <motion.div
                    className="relative h-full w-full overflow-hidden rounded-[10px]"
                    style={{
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                      boxShadow: isCenter
                        ? "0 22px 48px rgba(70,40,50,0.3)"
                        : "0 12px 26px rgba(70,40,50,0.16)",
                    }}
                    initial={false}
                    animate={{ filter: g.grayscale > 0.01 ? `grayscale(${g.grayscale})` : "none" }}
                    transition={springTransition}
                  >
                    {spineSide ? (
                      <span
                        className="pointer-events-none absolute inset-y-0 z-30"
                        style={{
                          width: spineW,
                          backgroundColor: CARD_SPINE_COLOR,
                          left: spineSide === "left" ? 0 : undefined,
                          right: spineSide === "right" ? 0 : undefined,
                        }}
                        aria-hidden
                      />
                    ) : null}
                    <img
                      src={item.image}
                      alt=""
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                      draggable={false}
                    />

                    <motion.div
                      className="pointer-events-none absolute inset-0 bg-black"
                      initial={false}
                      animate={{ opacity: isCenter ? 0 : g.dim }}
                      transition={springTransition}
                    />

                    <motion.div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: "linear-gradient(180deg, rgba(37,27,30,0) 0%, #251b1e 86%)",
                      }}
                      initial={false}
                      animate={{ opacity: isCenter ? 1 : 0 }}
                      transition={springTransition}
                    />

                    <motion.div
                      className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-2.5 px-5 pb-6 text-left sm:gap-3 sm:px-6 sm:pb-7"
                      initial={false}
                      animate={{ opacity: isCenter ? 1 : 0 }}
                      transition={springTransition}
                    >
                      <div className="flex size-[46px] items-center justify-center rounded-full border-[1.5px] border-white/90 sm:size-[58px]">
                        <Icon size={20} strokeWidth={1.5} className="text-white sm:h-6 sm:w-6" />
                      </div>
                      <p className="font-outfit text-[0.95rem] font-semibold leading-[1.2] text-[#f4ebec] sm:text-[1.2rem]">
                        {item.title}
                      </p>
                      <p className="text-[0.72rem] leading-relaxed text-[#f4ebec]/80 sm:text-[0.85rem] sm:leading-6">
                        {item.description}
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="relative z-20 mt-3 flex items-center justify-center gap-3 sm:mt-4">
          <button
            type="button"
            aria-label={t("strengthPrev")}
            onClick={prev}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#c9a4ab] text-[#6b3d48] shadow-sm transition hover:bg-[#b88f97] sm:h-10 sm:w-10"
          >
            <ChevronLeft size={18} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            aria-label={t("strengthNext")}
            onClick={next}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#c9a4ab] text-[#6b3d48] shadow-sm transition hover:bg-[#b88f97] sm:h-10 sm:w-10"
          >
            <ChevronRight size={18} strokeWidth={2.2} />
          </button>
        </div>
      </div>
      </SectionShell>
    </section>
  );
}
