"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import SectionShell from "@/components/ui/SectionShell";
import FixedBackgroundImage from "@/components/ui/FixedBackgroundImage";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";

type Stat = { value: string; label: string };

type StatsProps = {
  stats?: Stat[];
  statsImage?: string;
};

function StatsImage({ src, alt }: { src: string; alt: string }) {
  return (
    <FixedBackgroundImage
      src={src}
      alt={alt}
      className="mx-auto h-[min(52vw,280px)] min-h-[200px] w-full max-w-full sm:h-[300px] md:h-[400px] lg:h-[440px]"
    />
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
    <>
      {prefix}
      <span className="font-semibold">{n}</span>
      {suffix}
    </>
  );
}

export default function Stats({ stats, statsImage }: StatsProps) {
  const t = useTranslations("home");
  const displayStats =
    stats && stats.length > 0
      ? stats
      : [
          { value: "+12", label: t("statYears") },
          { value: "+140", label: t("statProjects") },
          { value: "+6", label: t("statCities") },
        ];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });

  const imageSrc = resolveMediaUrl(statsImage, MEDIA.stats);

  return (
    <section ref={ref} className="bg-[#fdf2f0] pb-0 pt-8 sm:pt-10 md:pt-14">
      <SectionShell>
        <div className="grid grid-cols-1 gap-8 text-center min-[480px]:grid-cols-3 min-[480px]:gap-4 sm:gap-6">
          {displayStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <p className="font-display text-[clamp(2.75rem,5vw,3.125rem)] font-normal leading-none tracking-[0.1em] text-[#6a414d]">
                <CountUp raw={stat.value} active={inView} />
              </p>
              <p className="mt-3 font-outfit text-[clamp(1rem,2.2vw,1.375rem)] font-medium tracking-[0.1em] text-[#251b1e]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="mt-12 md:mt-16">
        <StatsImage src={imageSrc} alt={t("statsImageAlt")} />
      </SectionShell>
    </section>
  );
}
