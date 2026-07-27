"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const FEATURED = [
  {
    title: "Kitchen Cabinet",
    image: "/home/featured-project/feature-1.jpg",
  },
  {
    title: "Modern Island",
    image: "/home/featured-project/feature-2.jpg",
  },
  {
    title: "Warm Walnut",
    image: "/home/featured-project/feature-3.jpg",
  },
  {
    title: "Ivory Luxe",
    image: "/home/featured-project/feature-4.jpg",
  },
  {
    title: "Graphite Studio",
    image: "/home/featured-project/feature-5.jpg",
  },
  {
    title: "Coastal Oak",
    image: "/home/featured-project/feature-6.jpg",
  },
  {
    title: "Midnight Suite",
    image: "/home/featured-project/feature-7.png",
  },
  {
    title: "Open Living",
    image: "/home/featured-project/feature-8.png",
  },
];

export default function FeaturedProjects() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const expandedIndex = hovered ?? active;

  return (
    <section id="projects" className="bg-transparent py-16 sm:py-20 md:py-28">
      <div className="container-1240">
        <div
          className="mx-auto flex min-h-[120px] w-full max-w-[1240px] flex-col items-center justify-center px-4 py-8 text-center sm:min-h-[160px] sm:px-6 md:h-[177px] md:py-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(130,94,105,0.22) 0%, rgba(244,235,236,0) 100%)",
          }}
        >
          <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.75rem)] font-medium tracking-[0.08em] text-[#5c3d42]">
            FEATURED PROJECTS
          </h2>
          <p className="mt-2 text-[0.65rem] font-medium tracking-[0.18em] text-[#e85d8a] uppercase sm:mt-3 sm:text-[0.72rem] sm:tracking-[0.22em]">
            Designed to inspire. Built to last
          </p>
        </div>

        {/* Responsive accordion: hover = expand, default first expanded */}
        <div
          className="mt-8 w-full sm:mt-10 md:mt-12"
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex h-[280px] w-full gap-1.5 overflow-hidden sm:h-[340px] sm:gap-2 md:h-[400px] md:gap-2.5">
            {FEATURED.map((item, i) => {
              const isExpanded = expandedIndex === i;

              return (
                <motion.button
                  key={item.image}
                  type="button"
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onClick={() => {
                    setActive(i);
                    setHovered(i);
                  }}
                  className={`relative h-full overflow-hidden rounded-[10px] outline-none sm:rounded-[12px] md:rounded-[14px] ${
                    isExpanded ? "min-w-0" : "min-w-[22px] sm:min-w-[28px] md:min-w-[36px]"
                  }`}
                  initial={false}
                  animate={{
                    flexGrow: isExpanded ? 12 : 1,
                    flexShrink: 1,
                    flexBasis: 0,
                  }}
                  transition={{ type: "spring", stiffness: 280, damping: 32 }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300 ${
                      isExpanded ? "opacity-100" : "opacity-50"
                    }`}
                  />

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute bottom-3 left-3 text-left sm:bottom-4 sm:left-4 md:bottom-5 md:left-5"
                    >
                      <p className="text-sm font-medium text-white sm:text-base md:text-[1.15rem]">
                        {item.title}
                      </p>
                      <span className="mt-1.5 block h-[2px] w-10 bg-[#e85d8a] sm:mt-2 sm:w-14" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 text-center sm:mt-12">
          <Link
            href="/interior"
            className="inline-flex rounded-md bg-[#5c3d42] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#4a2f34] sm:px-8 sm:py-3"
          >
            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
}
