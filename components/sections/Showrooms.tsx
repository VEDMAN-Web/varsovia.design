"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { REVEAL_EASE, VIEWPORT_ONCE } from "@/lib/motionPresets";

type Showroom = {
  _id: string;
  name: string;
  location: string;
  image: string;
};

export default function Showrooms({
  showrooms,
  embedded = false,
}: {
  showrooms: Showroom[];
  /** When true, omits outer section shell and built-in headings (parent supplies layout). */
  embedded?: boolean;
}) {
  const [active, setActive] = useState(1 % Math.max(showrooms.length, 1));
  const reduceMotion = useReducedMotion();
  if (!showrooms.length) return null;

  const carousel = (
    <>
      <div className="flex items-end justify-center gap-3 md:gap-6">
        {showrooms.slice(0, 3).map((room, i) => {
          const isActive = i === active;
          return (
            <motion.button
              key={room._id}
              type="button"
              onClick={() => setActive(i)}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 32, scale: 0.9 }
              }
              whileInView={{
                opacity: isActive ? 1 : 0.7,
                y: isActive ? 0 : 18,
                scale: isActive ? 1 : 0.9,
              }}
              viewport={VIEWPORT_ONCE}
              animate={{
                scale: isActive ? 1 : 0.9,
                y: isActive ? 0 : 18,
                opacity: isActive ? 1 : 0.7,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 22,
                delay: reduceMotion ? 0 : i * 0.08,
              }}
              className={`relative overflow-hidden shadow-lg ${
                isActive
                  ? "h-[340px] w-[280px] md:h-[420px] md:w-[340px]"
                  : "h-[280px] w-[180px] md:h-[340px] md:w-[220px]"
              }`}
            >
              <img src={room.image} alt={room.name} className="h-full w-full object-cover" />
              {isActive && (
                <motion.div
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: REVEAL_EASE }}
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 text-left"
                >
                  <p className="font-display text-2xl text-white">{room.name}</p>
                  <p className="mt-1 text-xs tracking-[0.14em] uppercase text-white/80">
                    {room.location}
                  </p>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.4, delay: 0.25, ease: REVEAL_EASE }}
        className="mt-8 flex justify-center gap-2"
      >
        {showrooms.slice(0, 3).map((room, i) => (
          <button
            key={room._id}
            type="button"
            className="dot"
            data-active={i === active}
            aria-label={`Show showroom ${i + 1}`}
            onClick={() => setActive(i)}
          />
        ))}
      </motion.div>
    </>
  );

  if (embedded) return carousel;

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-1240 text-center">
        <h2 className="heading-section">Come See Us</h2>
        <p className="mx-auto mt-4 max-w-lg text-muted">
          Visit a Varsovia showroom and experience materials, layouts, and finishes in person.
        </p>
        <div className="mt-14">{carousel}</div>
      </div>
    </section>
  );
}
