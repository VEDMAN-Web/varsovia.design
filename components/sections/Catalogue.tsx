"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CATALOGUES = [
  { id: "1", image: "/home/catalog.png", year: "2026" },
  { id: "2", image: "/home/catalog-1.jpg", year: "2026" },
  { id: "3", image: "/home/catalog-2.png", year: "2026" },
  { id: "4", image: "/home/catalog-3.png", year: "2026" },
  { id: "5", image: "/home/catalog-4.png", year: "2026" },
];

const OFFSETS = [-2, -1, 0, 1, 2] as const;

/** Figma specs:
 * Outer (±2): blur 4, opacity 50%, rotate ±15°
 * Inner (±1): blur 2, opacity 82%, rotate ±9.56°
 * Center (0): blur 0, opacity 100%, rotate 0
 * Card: 221×324, radius 6/24/24/6, left border 4.6px #251B1E, overlay black 20%
 */
function getCardStyle(offset: number) {
  const abs = Math.abs(offset);
  const sign = offset === 0 ? 0 : offset < 0 ? -1 : 1;

  if (abs === 0) {
    return { blur: 0, opacity: 1, rotate: 0, scale: 1.08, y: 0 };
  }
  if (abs === 1) {
    return { blur: 2, opacity: 0.82, rotate: sign * 9.56, scale: 0.96, y: 8 };
  }
  return { blur: 4, opacity: 0.5, rotate: sign * 15, scale: 0.9, y: 16 };
}

export default function Catalogue() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(250);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      // Spread cards across full viewport width
      setStep(Math.round(Math.min(Math.max(w / 5.2, 110), 360)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % CATALOGUES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  function prev() {
    setActive((prev) => (prev - 1 + CATALOGUES.length) % CATALOGUES.length);
  }

  function next() {
    setActive((prev) => (prev + 1) % CATALOGUES.length);
  }

  return (
    <section id="catalogue" className="bg-transparent py-16 md:py-20">
      {/* Heading stays 1240 */}
      <div className="container-1240 text-center">
        <div
          className="mx-auto flex h-[177px] w-full max-w-[1240px] flex-col items-center justify-center px-6"
          style={{
            background: "linear-gradient(180deg, rgba(130,94,105,0.22) 0%, rgba(244,235,236,0) 100%)",
          }}
        >
          <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.5rem)] font-medium tracking-[0.1em] text-[#5c3d42]">
            FREE CATALOGUE
          </h2>
          <p className="mt-3 text-[0.7rem] font-medium tracking-[0.22em] text-[#c46b7a] uppercase sm:text-[0.78rem]">
            Inspiration for your dream kitchen
          </p>
        </div>
      </div>

      {/* Scrolling images — full width, no background */}
      <div
        className="relative mt-4 w-screen max-w-[100vw] overflow-visible bg-transparent md:mt-6"
        style={{ height: 400, marginLeft: "calc(50% - 50vw)" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative mx-auto h-full w-full overflow-visible">
          {OFFSETS.map((offset) => {
            const index = (active + offset + CATALOGUES.length * 10) % CATALOGUES.length;
            const item = CATALOGUES[index];
            const isCenter = offset === 0;
            const style = getCardStyle(offset);

            return (
              <motion.button
                key={`${item.id}-${offset}`}
                type="button"
                onClick={() => {
                  if (!isCenter) setActive(index);
                }}
                className="absolute left-1/2 top-2 bg-transparent p-0 outline-none"
                style={{
                  width: 221,
                  height: 324,
                  marginLeft: -110.5,
                  borderRadius: "6px 24px 24px 6px",
                  overflow: "hidden",
                  borderLeft: "4.6px solid #251B1E",
                  boxShadow: isCenter
                    ? "0 18px 40px rgba(70,40,50,0.22)"
                    : "0 10px 28px rgba(70,40,50,0.12)",
                  transformOrigin: "center center",
                  willChange: "transform, filter, opacity",
                }}
                initial={false}
                animate={{
                  x: offset * step,
                  y: style.y,
                  scale: style.scale,
                  rotate: style.rotate,
                  zIndex: 20 - Math.abs(offset),
                  filter: `blur(${style.blur}px)`,
                  opacity: style.opacity,
                }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
              >
                <img
                  src={item.image}
                  alt={`Catalogue ${item.year}`}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-black/20" />

                <div className="relative z-10 flex h-full flex-col items-center justify-center px-3 text-center text-white">
                  <p className="text-[0.65rem] tracking-[0.28em] opacity-90">{item.year}</p>
                  <p className="mt-2 text-[1.15rem] font-bold leading-[1.15] tracking-[0.04em] md:text-[1.3rem]">
                    EXPLORE
                    <br />
                    KITCHEN
                    <br />
                    DESIGN
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[0.75rem] underline decoration-white/70 underline-offset-4">
                    Download
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/80 text-[9px] leading-none">
                      ↓
                    </span>
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-4 pb-2">
        <button
          type="button"
          aria-label="Previous catalogue"
          onClick={prev}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#c9a4ab] text-[#6b3d48] transition hover:bg-[#b88f97]"
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <button
          type="button"
          aria-label="Next catalogue"
          onClick={next}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#c9a4ab] text-[#6b3d48] transition hover:bg-[#b88f97]"
        >
          <ChevronRight size={20} strokeWidth={2.2} />
        </button>
      </div>
    </section>
  );
}
