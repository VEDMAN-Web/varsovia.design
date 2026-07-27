"use client";

import { motion } from "framer-motion";

type HeroProps = {
  headline: string;
};

const HOME_IMAGE = "/home/home-front-page.png";

export default function Hero({ headline }: HeroProps) {
  const heroImage = HOME_IMAGE;

  return (
    <section id="home" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={heroImage}
          alt="Varsovia Design modular kitchen"
          className="h-full w-full object-cover object-center"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-black/5" />

      <div className="container-1240 relative z-10 flex h-full items-end pb-16 md:pb-24">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mb-4 font-display text-sm tracking-[0.35em] text-white/85 md:text-base"
          >
            VARSOVIA DESIGN
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="font-display text-[clamp(1.85rem,4.5vw,3.6rem)] font-medium leading-[1.12] tracking-[0.04em] text-white"
          >
            {headline}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a href="#products" className="btn-primary rounded-md">
              Explore Kitchens
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-md border border-white/70 px-7 py-3 text-[0.8rem] tracking-[0.12em] uppercase text-white transition hover:bg-white hover:text-maroon"
            >
              Free Consultation
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
