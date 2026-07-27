"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

type Testimonial = {
  _id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
};

const STORIES = [
  {
    id: "1",
    name: "Brooklyn Simmons",
    rating: 5,
    quote:
      "We had a small kitchen with eleven years of accumulated clutter and no real system. The team came in, listened to how we actually cook, and redesigned everything around our habits. The pull-out pantry and the corner unit with rotating shelves changed everything. It feels twice the size now.",
    image: "/home/real-story/story (1).jpg",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "2",
    name: "Ananya Mehta",
    rating: 5,
    quote:
      "Varsovia transformed our outdated kitchen into a calm, beautiful space we actually love cooking in every day. Every detail feels intentional and personal.",
    image: "/home/real-story/story (1).png",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "3",
    name: "Rohan Kapoor",
    rating: 5,
    quote:
      "Their attention to detail and finish quality is exceptional. Clients always notice the difference — the kitchen became the heart of our home.",
    image: "/home/real-story/story (2).jpg",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "4",
    name: "Priya Shah",
    rating: 5,
    quote:
      "From consultation to installation, the team was thoughtful, precise, and a pleasure to work with. It feels twice as large and infinitely more usable.",
    image: "/home/real-story/story (2).png",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "5",
    name: "Emily Carter",
    rating: 5,
    quote:
      "They listened carefully, planned around how we live, and delivered a kitchen that feels both luxurious and effortless every single morning.",
    image: "/home/real-story/story (3).png",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
  },
];

const OFFSETS = [-2, -1, 0, 1, 2] as const;

function getCurve(offset: number, gap: number) {
  const abs = Math.abs(offset);
  const sign = offset === 0 ? 0 : offset < 0 ? -1 : 1;

  if (abs === 0) {
    return { x: 0, z: 80, rotateY: 0, scale: 1, opacity: 1, dim: 0 };
  }
  if (abs === 1) {
    return {
      x: sign * gap,
      z: 0,
      rotateY: sign * -30,
      scale: 0.88,
      opacity: 1,
      dim: 0.48,
    };
  }
  return {
    x: sign * gap * 1.65,
    z: -70,
    rotateY: sign * -45,
    scale: 0.76,
    opacity: 1,
    dim: 0.62,
  };
}

export default function Testimonials({
  testimonials: _testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cardW, setCardW] = useState(520);
  const [cardH, setCardH] = useState(340);
  const [gap, setGap] = useState(200);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setCardW(Math.min(w - 48, 300));
        setCardH(220);
        setGap(64);
      } else if (w < 768) {
        setCardW(340);
        setCardH(250);
        setGap(110);
      } else if (w < 1024) {
        setCardW(440);
        setCardH(300);
        setGap(160);
      } else {
        setCardW(560);
        setCardH(370);
        setGap(220);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % STORIES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [paused]);

  function prev() {
    setActive((i) => (i - 1 + STORIES.length) % STORIES.length);
  }

  function next() {
    setActive((i) => (i + 1) % STORIES.length);
  }

  return (
    <section id="stories" className="bg-transparent py-14 sm:py-16 md:py-20">
      {/* Heading */}
      <div className="container-1240 text-center">
        <div
          className="mx-auto flex min-h-[120px] w-full max-w-[1240px] flex-col items-center justify-center px-4 py-8 sm:min-h-[160px] sm:px-6 md:h-[177px] md:py-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(130,94,105,0.22) 0%, rgba(244,235,236,0) 100%)",
          }}
        >
          <h2 className="font-display text-[clamp(1.45rem,3.4vw,2.6rem)] font-medium tracking-[0.08em] text-[#5c3d42] uppercase">
            Real Stories. Real Spaces.
          </h2>
          <p className="mx-auto mt-3 max-w-[42rem] px-2 text-[0.62rem] font-medium tracking-[0.16em] text-[#e85d8a] uppercase sm:mt-4 sm:text-[0.72rem] sm:tracking-[0.2em]">
            Hear how we&apos;ve transformed houses into dream homes
          </p>
        </div>
      </div>

      {/* Carousel — directly under heading */}
      <div
        className="relative z-10 mx-auto mt-8 w-full max-w-[1240px] px-2 sm:mt-10 sm:px-4 md:mt-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="relative mx-auto w-full"
          style={{
            height: cardH + 48,
            perspective: "1200px",
            perspectiveOrigin: "50% 45%",
          }}
        >
          {OFFSETS.map((offset) => {
            const index = (active + offset + STORIES.length * 10) % STORIES.length;
            const item = STORIES[index];
            const isCenter = offset === 0;
            const s = getCurve(offset, gap);
            const hideFar = Math.abs(offset) === 2;
            const hideSide = Math.abs(offset) >= 1;

            return (
              <motion.button
                key={`${offset}-${item.id}`}
                type="button"
                aria-label={`Story by ${item.name}`}
                onClick={() => {
                  if (!isCenter) setActive(index);
                }}
                className={[
                  "absolute left-1/2 top-0 overflow-hidden rounded-2xl border-0 bg-transparent p-0 outline-none",
                  hideSide ? "max-[419px]:!hidden" : "",
                  hideFar ? "max-md:!hidden" : "",
                ].join(" ")}
                style={{
                  width: cardW,
                  height: cardH,
                  marginLeft: -cardW / 2,
                  transformStyle: "preserve-3d",
                  transformOrigin: "center center",
                  boxShadow: isCenter
                    ? "0 22px 48px rgba(70,40,50,0.28)"
                    : "0 12px 28px rgba(70,40,50,0.14)",
                  zIndex: isCenter ? 30 : 20 - Math.abs(offset),
                }}
                initial={false}
                animate={{
                  x: s.x,
                  scale: s.scale,
                  opacity: s.opacity,
                  rotateY: s.rotateY,
                }}
                transition={{ type: "spring", stiffness: 170, damping: 24 }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />

                {!isCenter && (
                  <div
                    className="pointer-events-none absolute inset-0 bg-black"
                    style={{ opacity: s.dim }}
                  />
                )}

                {isCenter && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-4 pt-16 text-left sm:px-6 sm:pb-5 sm:pt-20 md:px-7 md:pb-6">
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
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="relative z-20 mt-6 flex items-center justify-center gap-4 sm:mt-8">
          <button
            type="button"
            aria-label="Previous story"
            onClick={prev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#c9a4ab] text-[#6b3d48] shadow-sm transition hover:bg-[#b88f97] sm:h-11 sm:w-11"
          >
            <ChevronLeft size={20} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            aria-label="Next story"
            onClick={next}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#c9a4ab] text-[#6b3d48] shadow-sm transition hover:bg-[#b88f97] sm:h-11 sm:w-11"
          >
            <ChevronRight size={20} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </section>
  );
}
