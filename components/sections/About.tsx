"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionShell, { SECTION_HEADING_WIDE } from "@/components/ui/SectionShell";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";

/** Figma Frame 2147205349 — layout positions within 686×500 collage */
const ABOUT_LAYOUT = [
  { alt: "Varsovia kitchen with maroon cabinetry",   className: "left-[1.75%] top-[0.2%] h-[76.2%] w-[43.4%]" },
  { alt: "Bright white kitchen with marble island",  className: "left-[37.9%] top-[26.2%] h-[44%] w-[56%]" },
  { alt: "Warm wood kitchen dining island",          className: "left-[10.9%] top-[54%] h-[44%] w-[51.3%]" },
];

const FALLBACK_ABOUT_IMAGES = [...MEDIA.about];

const DEFAULT_PARAGRAPHS = [
  "Varsovia started in a rented one-room studio in Warsaw's Praga district, with a simple belief: a beautiful room only earns that word once someone has lived in it for a year and still loves it. We still work that way measuring twice, drawing by hand before we draw on screen, and choosing materials that age instead of wear out.",
  "Every project starts with how you move through a space, not how it will photograph. The result is interiors that feel inevitable, as if they couldn't have been arranged any other way.",
];

type AboutProps = {
  title?: string;
  text?: string;
  images?: string[];
};

export default function About({ title = "ABOUT VARSOVIA", text, images }: AboutProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const paragraphs = text ? text.split(/\n+/).filter(Boolean) : DEFAULT_PARAGRAPHS;

  // Merge API images with fallback — always keep 3 entries
  const displayImages = ABOUT_LAYOUT.map((layout, i) => ({
    src: resolveMediaUrl(images?.[i], FALLBACK_ABOUT_IMAGES[i]),
    alt: layout.alt,
    className: layout.className,
  }));

  return (
    <section id="about" className="bg-[#fdf2f0] py-20 md:py-28">
      {/* One synced shell — heading band + collage/text share the same width */}
      <SectionShell>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <SectionHeading
            title={title}
            subtitle="Twelve years of rooms built to last"
            className={SECTION_HEADING_WIDE}
          />
        </motion.div>

        <div className="mt-14 grid w-full items-center gap-12 lg:mt-16 lg:grid-cols-[1.38fr_1fr] lg:gap-x-12 xl:gap-x-20">
          <div
            className="relative mx-auto aspect-[686/500] w-full lg:mx-0"
            onMouseLeave={() => setHovered(null)}
          >
            {displayImages.map((img, i) => {
              const isHovered = hovered === i;
              const isDimmed = hovered !== null && hovered !== i;
              const baseZ = i === 2 ? 3 : i === 1 ? 2 : 1;

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
                    scale: isHovered ? 1.06 : 1,
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

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="w-full lg:pt-10"
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
      </SectionShell>
    </section>
  );
}
