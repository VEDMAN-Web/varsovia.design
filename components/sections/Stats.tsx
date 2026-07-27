"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { value: 12, prefix: "+", label: "Years Experience" },
  { value: 140, prefix: "+", label: "Projects Completed" },
  { value: 6, prefix: "+", label: "Cities Served" },
] as const;

function CountUp({
  to,
  prefix,
  active,
  duration = 1600,
}: {
  to: number;
  prefix: string;
  active: boolean;
  duration?: number;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setN(Math.round(to * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, to, duration]);

  return (
    <span>
      {prefix}
      {n}
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });

  return (
    <section ref={ref} className="bg-[#fdf2f0] pb-0 pt-10 md:pt-14">
      {/* Numbers — 1240px */}
      <div className="container-1240">
        <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <p className="font-display text-[clamp(2.75rem,5vw,4.25rem)] font-medium leading-none tracking-wide text-[#5c3b3e]">
                <CountUp to={stat.value} prefix={stat.prefix} active={inView} />
              </p>
              <p className="mt-3 text-[0.95rem] font-medium text-black md:text-base">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Banner image above Our Products — 1240 × 340 */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="container-1240 mt-12 md:mt-16"
      >
        <div className="mx-auto h-[340px] w-full max-w-[1240px] overflow-hidden">
          <img
            src="/home/counting.png"
            alt="Varsovia interior space"
            className="h-full w-full object-cover"
            width={1240}
            height={340}
          />
        </div>
      </motion.div>
    </section>
  );
}
