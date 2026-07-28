"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import SectionShell from "@/components/ui/SectionShell";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";

type Stat = { value: string; label: string };

const FALLBACK_STATS: Stat[] = [
  { value: "+12", label: "Years Experience" },
  { value: "+140", label: "Projects Completed" },
  { value: "+6", label: "Cities Served" },
];

type StatsProps = {
  stats?: Stat[];
  statsImage?: string;
};

/**
 * Image stays fixed in the viewport; only this clip frame scrolls with the page
 * (background-attachment: fixed window effect).
 */
function StatsFixedImage({ src, alt }: { src: string; alt: string }) {
  const [fixedSupported, setFixedSupported] = useState(true);

  useEffect(() => {
    const test = document.createElement("div");
    test.style.backgroundAttachment = "fixed";
    setFixedSupported(test.style.backgroundAttachment === "fixed");
  }, []);

  return (
    <div
      className="stats-image-frame relative mx-auto h-[min(42vw,340px)] min-h-[220px] w-full overflow-hidden sm:h-[340px] md:h-[400px] lg:h-[440px]"
      role="img"
      aria-label={alt}
    >
      {fixedSupported ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${src})`,
            backgroundAttachment: "fixed",
          }}
        />
      ) : (
        // Mobile fallback where fixed backgrounds are unsupported
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      )}
    </div>
  );
}

function CountUp({
  raw,
  active,
  duration = 1600,
}: {
  raw: string;
  active: boolean;
  duration?: number;
}) {
  const prefixMatch = raw.match(/^([^0-9]*)/);
  const suffixMatch = raw.match(/([^0-9]*)$/);
  const numMatch = raw.match(/(\d+)/);

  const prefix = prefixMatch ? prefixMatch[1] : "";
  const suffix = suffixMatch && suffixMatch[1] !== prefix ? suffixMatch[1] : "";
  const to = numMatch ? parseInt(numMatch[1], 10) : 0;

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
      {suffix}
    </span>
  );
}

export default function Stats({ stats, statsImage }: StatsProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });

  const displayStats = stats && stats.length > 0 ? stats : FALLBACK_STATS;
  const imageSrc = resolveMediaUrl(statsImage, MEDIA.stats);

  return (
    <section ref={ref} className="bg-[#fdf2f0] pb-0 pt-10 md:pt-14">
      <SectionShell>
        <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:gap-6">
          {displayStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <p className="font-display text-[clamp(2.75rem,5vw,4.25rem)] font-bold leading-none tracking-wide text-[#5c3b3e]">
                <CountUp raw={stat.value} active={inView} />
              </p>
              <p className="mt-3 text-[0.95rem] font-medium text-black md:text-base">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="mt-12 md:mt-16">
        <StatsFixedImage src={imageSrc} alt="Varsovia interior space" />
      </SectionShell>
    </section>
  );
}
