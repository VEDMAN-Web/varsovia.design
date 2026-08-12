"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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
              animate={{
                scale: isActive ? 1 : 0.9,
                y: isActive ? 0 : 18,
                opacity: isActive ? 1 : 0.7,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className={`relative overflow-hidden shadow-lg ${
                isActive ? "h-[340px] w-[280px] md:h-[420px] md:w-[340px]" : "h-[280px] w-[180px] md:h-[340px] md:w-[220px]"
              }`}
            >
              <img src={room.image} alt={room.name} className="h-full w-full object-cover" />
              {isActive && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 text-left">
                  <p className="font-display text-2xl text-white">{room.name}</p>
                  <p className="mt-1 text-xs tracking-[0.14em] uppercase text-white/80">{room.location}</p>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center gap-2">
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
      </div>
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
