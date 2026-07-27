"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ABOUT_IMAGES = [
  { src: "/home/about-1.png", alt: "Varsovia kitchen with maroon cabinetry", className: "left-[4%] top-[2%] h-[48%] w-[52%]" },
  { src: "/home/about-2.png", alt: "Bright white kitchen with marble island", className: "right-[2%] top-[10%] h-[50%] w-[54%]" },
  { src: "/home/about-3.png", alt: "Warm wood kitchen dining island", className: "left-[10%] bottom-[0%] h-[46%] w-[58%]" },
];

const DEFAULT_PARAGRAPHS = [
  "Varsovia started in a rented one-room studio in Warsaw's Praga district, with a simple belief: a beautiful room only earns that word once someone has lived in it for a year and still loves it. We still work that way measuring twice, drawing by hand before we draw on screen, and choosing materials that age instead of wear out.",
  "Every project starts with how you move through a space, not how it will photograph. The result is interiors that feel inevitable, as if they couldn't have been arranged any other way.",
];

type AboutProps = {
  title?: string;
  text?: string;
  images?: string[];
};

export default function About({ title = "ABOUT VARSOVIA", text }: AboutProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const paragraphs = text
    ? text.split(/\n+/).filter(Boolean)
    : DEFAULT_PARAGRAPHS;

  return (
    <section id="about" className="bg-[#fdf2f0] py-20 md:py-28">
      <div className="container-1240">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium tracking-[0.08em] text-[#5c3d42]">
            {title}
          </h2>
          <p className="mt-3 text-[0.72rem] font-medium tracking-[0.28em] text-[#e85d8a] uppercase sm:text-[0.8rem]">
            Twelve years of rooms built to last
          </p>
        </motion.div>

        <div className="mt-14 grid items-center gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-16">
          {/* Overlapping image collage */}
          <div
            className="relative mx-auto h-[420px] w-full max-w-[520px] md:h-[480px]"
            onMouseLeave={() => setHovered(null)}
          >
            {ABOUT_IMAGES.map((img, i) => {
              const isHovered = hovered === i;
              const isDimmed = hovered !== null && hovered !== i;
              const baseZ = i === 1 ? 2 : i === 2 ? 3 : 1;

              return (
                <motion.button
                  key={img.src}
                  type="button"
                  aria-label={img.alt}
                  className={`absolute overflow-hidden rounded-[22px] border-[3px] border-white bg-white shadow-[0_10px_30px_rgba(80,40,50,0.12)] outline-none ${img.className}`}
                  style={{ zIndex: isHovered ? 20 : baseZ }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  animate={{
                    scale: isHovered ? 1.08 : 1,
                    opacity: isDimmed ? 0.55 : 1,
                    filter: isDimmed ? "brightness(0.85)" : "brightness(1)",
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-500"
                    style={{ transform: isHovered ? "scale(1.04)" : "scale(1)" }}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-xl"
          >
            {paragraphs.map((p) => (
              <p key={p.slice(0, 32)} className="mb-5 text-[1.02rem] leading-8 text-[#5a5254]">
                {p}
              </p>
            ))}

            <a
              href="#projects"
              className="mt-2 inline-block text-[0.95rem] font-medium text-[#e85d8a] underline decoration-[#e85d8a]/70 underline-offset-4 transition hover:text-[#d44575] hover:decoration-[#d44575]"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
