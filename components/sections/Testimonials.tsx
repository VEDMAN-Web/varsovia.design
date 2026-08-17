"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { getRelativeOffset } from "@/lib/carousel";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionShell, { SECTION_HEADING_WIDE, SITE_SECTION_PADDING_Y } from "@/components/ui/SectionShell";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";
import type { ApiTestimonial } from "@/lib/siteTypes";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";

type Testimonial = ApiTestimonial;

type StoryCard = {
  id: string;
  name: string;
  rating: number;
  quote: string;
  image: string;
  avatar: string;
};

const STORY_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
];

const FALLBACK_STORIES: StoryCard[] = [
  {
    id: "1",
    name: "Brooklyn Simmons",
    rating: 5,
    quote:
      "We had a small kitchen with eleven years of accumulated clutter and no real system. The team came in, listened to how we actually cook, and redesigned everything around our habits. The pull-out pantry and the corner unit with rotating shelves changed everything. It feels twice the size now.",
    image: MEDIA.stories[0],
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "2",
    name: "Ananya Mehta",
    rating: 5,
    quote:
      "Varsovia transformed our outdated kitchen into a calm, beautiful space we actually love cooking in every day. Every detail feels intentional and personal.",
    image: MEDIA.stories[1],
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "3",
    name: "Rohan Kapoor",
    rating: 5,
    quote:
      "Their attention to detail and finish quality is exceptional. Clients always notice the difference — the kitchen became the heart of our home.",
    image: MEDIA.stories[2],
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "4",
    name: "Priya Shah",
    rating: 5,
    quote:
      "From consultation to installation, the team was thoughtful, precise, and a pleasure to work with. It feels twice as large and infinitely more usable.",
    image: MEDIA.stories[3],
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "5",
    name: "Emily Carter",
    rating: 5,
    quote:
      "They listened carefully, planned around how we live, and delivered a kitchen that feels both luxurious and effortless every single morning.",
    image: MEDIA.stories[4],
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "6",
    name: "Marcus Webb",
    rating: 5,
    quote:
      "Every drawer, every finish, every light was planned around how we actually live. It doesn't just look stunning — it works effortlessly.",
    image: MEDIA.stories[5],
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "7",
    name: "Sofia Alvarez",
    rating: 5,
    quote:
      "We went from a cramped, dated kitchen to the room our whole family gathers in. The craftsmanship and attention to detail exceeded every expectation.",
    image: MEDIA.stories[6],
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  },
];

function buildStories(testimonials?: Testimonial[]): StoryCard[] {
  if (!testimonials?.length) return [];

  return testimonials
    .filter((item) => (item as Testimonial & { visible?: boolean }).visible !== false)
    .map((item, index) => ({
      id: item._id,
      name: item.name,
      rating: item.rating || 5,
      quote: item.quote,
      image: resolveMediaUrl(item.image, MEDIA.stories[index % MEDIA.stories.length]),
      avatar: resolveMediaUrl(item.image, STORY_AVATARS[index % STORY_AVATARS.length]),
    }));
}

const MAX_VISIBLE_OFFSET = 2;
const DRAG_THRESHOLD = 60;
const AUTOPLAY_MS = 3000;
// Center card is bigger than the side cards — a clear lift in both
// dimensions, independent of the shared side-card size below.
const CENTER_HEIGHT_SCALE = 1.34;
const CENTER_WIDTH_SCALE = 1.18;

/**
 * Flat receding stack — one sharp photo in front, exactly two more on
 * each side sitting flat (no 3D tilt) behind it, peeking out and
 * fading gently with distance, like a loose stack of photographs.
 */
function getCurve(offset: number, gap: number) {
  const abs = Math.abs(offset);
  const sign = offset === 0 ? 0 : offset < 0 ? -1 : 1;

  // heightScale/widthScale are relative to the shared side-card base
  // size (cardW × cardH) — the center card's own base is bigger
  // (see CENTER_WIDTH_SCALE/CENTER_HEIGHT_SCALE), so its ratios equal
  // those constants to land back on exactly its own full size.
  if (abs === 0) {
    return {
      x: 0,
      heightScale: CENTER_HEIGHT_SCALE,
      widthScale: CENTER_WIDTH_SCALE,
      opacity: 1,
      dim: 0,
      grayscale: 0,
    };
  }
  if (abs === 1) {
    return {
      x: sign * gap,
      heightScale: 1.22,
      widthScale: 1,
      opacity: 1,
      dim: 0.4,
      grayscale: 0.18,
    };
  }
  return {
    x: sign * gap * 1.7,
    heightScale: 1.1,
    widthScale: 1,
    opacity: 1,
    dim: 0.56,
    grayscale: 0.4,
  };
}

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const t = useTranslations("home");
  const site = useSiteSettings();
  const section = site?.sectionCopy?.testimonials;
  const stories = useMemo(() => buildStories(testimonials), [testimonials]);
  const length = stories.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cardW, setCardW] = useState(672);
  const [cardH, setCardH] = useState(380);
  const [gap, setGap] = useState(122);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setCardW(Math.min(w - 32, 320));
        setCardH(198);
        setGap(42);
      } else if (w < 768) {
        setCardW(408);
        setCardH(231);
        setGap(66);
      } else if (w < 1024) {
        setCardW(528);
        setCardH(297);
        setGap(90);
      } else {
        setCardW(672);
        setCardH(380);
        setGap(122);
      }
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

  return (
    <section
      id="stories"
      className={`bg-transparent ${SITE_SECTION_PADDING_Y} !pb-6 !pt-8 sm:!pb-8 sm:!pt-10 md:!pb-10 md:!pt-14`}
    >
      <SectionShell>
      {/* Heading */}
      <div className="text-center">
        <SectionHeading
          title={section?.title || t("testimonialsTitle")}
          subtitle={section?.subtitle || t("testimonialsSubtitle")}
          className={SECTION_HEADING_WIDE}
        />
      </div>

      {/* Carousel — directly under heading */}
      <div
        className="relative z-10 mt-2 w-full px-2 sm:mt-3 sm:px-4 md:mt-3"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={t("testimonialsAria")}
          tabIndex={0}
          className="relative mx-auto w-full cursor-grab overflow-hidden outline-none focus-visible:outline-none active:cursor-grabbing"
          style={{ height: cardH * CENTER_HEIGHT_SCALE + 96 }}
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
            {(() => {
              // A single shared box (the center card's full size) for every
              // card — differences in on-screen size come purely from
              // scaleX/scaleY transforms, never from resizing the actual
              // DOM box. This is what keeps center↔side swaps buttery
              // instead of visibly "snapping" to a new width/height.
              const baseW = cardW * CENTER_WIDTH_SCALE;
              const baseH = cardH * CENTER_HEIGHT_SCALE;
              const springTransition = { type: "spring" as const, stiffness: 180, damping: 32, mass: 0.9 };

              return stories.map((item, index) => {
                const offset = getRelativeOffset(index, active, length);
                if (Math.abs(offset) > MAX_VISIBLE_OFFSET) return null;

                const isCenter = offset === 0;
                const s = getCurve(offset, gap);
                const abs = Math.abs(offset);
                const scaleX = (cardW * s.widthScale) / baseW;
                const scaleY = (cardH * s.heightScale) / baseH;
                // Both side rings show together from small screens up —
                // only the tiniest phones drop to a single centered card.
                const hideSide = abs >= 1;
                const hideFar = abs === 2;

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    tabIndex={-1}
                    aria-label={`Story by ${item.name}${isCenter ? " (current)" : ""}`}
                    aria-current={isCenter}
                    onClick={() => {
                      if (!isCenter) goTo(index);
                    }}
                    className={[
                      "absolute left-1/2 top-1/2 border-0 bg-transparent p-0 outline-none",
                      hideSide ? "max-[379px]:!hidden" : "",
                      hideFar ? "max-[479px]:!hidden" : "",
                    ].join(" ")}
                    style={{
                      width: baseW,
                      height: baseH,
                      marginLeft: -baseW / 2,
                      marginTop: -baseH / 2,
                      transformOrigin: "center center",
                      zIndex: isCenter ? 30 : 20 - Math.abs(offset),
                      pointerEvents: "auto",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                      x: s.x,
                      scaleX,
                      scaleY,
                      opacity: s.opacity,
                    }}
                    transition={springTransition}
                  >
                    {/*
                      Clip layer kept separate from the transform layer above so
                      `overflow-hidden` never has to share an element with a
                      transform — keeps the rounded-corner clip perfectly stable
                      while the outer layer handles position/scale.
                    */}
                    <motion.div
                      className="relative h-full w-full overflow-hidden rounded-2xl"
                      style={{
                        boxShadow: isCenter
                          ? "0 22px 48px rgba(70,40,50,0.28)"
                          : "0 12px 28px rgba(70,40,50,0.14)",
                      }}
                      initial={false}
                      animate={{ filter: `grayscale(${s.grayscale})` }}
                      transition={springTransition}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                        draggable={false}
                      />

                      {/* Always mounted, opacity-crossfaded — avoids the
                          abrupt pop of content mounting/unmounting the
                          instant a card becomes (or stops being) the center. */}
                      <motion.div
                        className="pointer-events-none absolute inset-0 bg-black"
                        initial={false}
                        animate={{ opacity: isCenter ? 0 : s.dim }}
                        transition={springTransition}
                      />

                      <motion.div
                        className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-4 pt-16 text-left sm:px-6 sm:pb-5 sm:pt-20 md:px-7 md:pb-6"
                        initial={false}
                        animate={{ opacity: isCenter ? 1 : 0 }}
                        transition={springTransition}
                      >
                        <div className="mb-2 flex items-center gap-2.5 sm:mb-3 sm:gap-3">
                          <img
                            src={item.avatar}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-white/50 sm:h-11 sm:w-11"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#e85d8a] sm:text-base">
                              {item.name}
                            </p>
                            <div className="mt-0.5 flex items-center gap-1.5">
                              <div className="flex gap-0.5 text-[#f5c542]">
                                {Array.from({ length: item.rating }).map((_, star) => (
                                  <Star
                                    key={star}
                                    size={12}
                                    fill="currentColor"
                                    className="sm:h-3.5 sm:w-3.5"
                                  />
                                ))}
                              </div>
                              <span className="text-[0.7rem] font-medium text-white/90 sm:text-xs">
                                {item.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="line-clamp-3 text-[0.72rem] leading-relaxed text-white/95 sm:line-clamp-4 sm:text-[0.85rem] sm:leading-6 md:text-[0.92rem] md:leading-7">
                          {item.quote}
                        </p>
                      </motion.div>
                    </motion.div>
                  </motion.button>
                );
              });
            })()}
          </motion.div>
        </div>

        <div className="relative z-20 mt-3 flex items-center justify-center gap-3 sm:mt-4">
          <button
            type="button"
            aria-label={t("testimonialPrev")}
            onClick={prev}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#c9a4ab] text-[#6b3d48] shadow-sm transition hover:bg-[#b88f97] sm:h-10 sm:w-10"
          >
            <ChevronLeft size={18} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            aria-label={t("testimonialNext")}
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
