"use client";

import { motion } from "framer-motion";
import { Eye, Flag, Gem, MessagesSquare, Lightbulb, Wrench } from "lucide-react";

const INTRO =
  "At Varsovia Design, we believe every space tells a story. We specialize in creating elegant, functional, and personalized interiors that reflect your lifestyle. From modular kitchens to complete home and commercial interiors, we combine creativity, craftsmanship, and premium materials to deliver spaces that stand the test of time.";

const STORY =
  "Founded with a passion for thoughtful design and exceptional craftsmanship, Varsovia Design has grown into a trusted name in premium interior solutions. Every project begins with understanding our clients' vision and ends with beautifully crafted spaces that balance aesthetics, comfort, and functionality.";

const VALUES = [
  {
    title: "Our Vision",
    icon: Eye,
    text: "To become a leading interior design brand known for creating inspiring spaces that enrich everyday living through innovation, quality, and timeless design.",
  },
  {
    title: "Our Mission",
    icon: Flag,
    text: "To deliver personalized interior solutions with exceptional craftsmanship, premium materials, and a seamless customer experience from concept to completion.",
  },
  {
    title: "Our Values",
    icon: Gem,
    text: "Great interiors begin with quality, creativity, trust, and innovation. We design and craft spaces tailored to your lifestyle, blending elegance, functionality, and lasting value.",
  },
] as const;

const STORY_IMAGES = [
  "/Interior-kitchen/kitchen1.png",
  "/Interior-kitchen/kitchen1.png",
  "/home/featured-project/feature-5.jpg",
  "/Interior-kitchen/kitchen1.png",
];

const PROCESS = [
  {
    step: "01",
    title: "Consultation",
    icon: MessagesSquare,
    text: "Understanding your lifestyle, needs, and design preferences.",
  },
  {
    step: "02",
    title: "Planning & Design",
    icon: Lightbulb,
    text: "Creating layouts, concepts, material selections, and realistic 3D visualizations.",
  },
  {
    step: "03",
    title: "Execution",
    icon: Wrench,
    text: "Expert craftsmanship, timely delivery, and professional installation.",
  },
] as const;

export default function AboutPageContent() {
  return (
    <div className="bg-[#f7f3f2] pt-[72px] pb-20 md:pb-28">
      {/* 1. Hero / Header Title */}
      <section className="px-4 pb-8 pt-10 md:px-8 md:pb-10 md:pt-16">
        <div
          className="mx-auto max-w-[1240px] px-6 py-12 text-center md:px-14 md:py-16 rounded-[16px] bg-[#F4EBEC]/50 mb-8 md:mb-12"
        >
          <h1 className="font-display text-[clamp(2.2rem,5vw,3.2rem)] font-medium tracking-[0.06em] text-[#5c3d46] uppercase">
            About Us
          </h1>
          <p className="mt-4 text-[clamp(0.7rem,2vw,0.85rem)] font-medium tracking-[0.24em] text-[#e85d8a] uppercase leading-relaxed">
            TWELVE YEARS OF ROOMS BUILT TO LAST
          </p>
        </div>
      </section>

      {/* Intro Text */}
      <section className="px-4 mb-12">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center text-[1.02rem] leading-8 text-[#5c3d46]/80 font-medium px-4 md:px-6"
        >
          {INTRO}
        </motion.p>
      </section>

      {/* Panoramic Wide Kitchen Image */}
      <section className="section-pad mx-auto max-w-[1240px] mb-20 md:mb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full overflow-hidden rounded-[16px] shadow-[0_8px_30px_rgba(107,44,58,0.025)] border border-[#e5dcd3]/30"
        >
          <img
            src="/Interior-kitchen/kitchen1.png"
            alt="Varsovia Design kitchen interior"
            className="aspect-[21/9] w-full object-cover md:aspect-[2.4/1]"
          />
        </motion.div>
      </section>

      {/* 2. Vision. Mission. Value. Section */}
      <section className="section-pad mx-auto max-w-[1240px] mb-20 md:mb-28">
        <div className="px-6 py-10 text-center md:px-14 md:py-12 rounded-[16px] bg-[#F4EBEC]/50 mb-10 md:mb-14">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-medium tracking-[0.06em] text-[#5c3d46] uppercase">
            VISION. MISSION. VALUE.
          </h2>
          <p className="mt-3.5 text-[clamp(0.68rem,1.8vw,0.76rem)] font-medium tracking-[0.24em] text-[#e85d8a] uppercase leading-relaxed">
            THE FOUNDATION OF EVERYTHING WE CREATE.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {VALUES.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="rounded-[16px] bg-[#F6EAEA] px-7 py-10 text-center shadow-[0_8px_30px_rgba(107,44,58,0.02)] border border-[#e5dcd3]/20"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#5c3d42] shadow-[0_4px_14px_rgba(107,44,58,0.04)]">
                  <Icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 font-display text-[1.35rem] font-bold tracking-[0.04em] text-[#5c3d46]">
                  {item.title}
                </h3>
                <p className="mt-4 text-[0.92rem] leading-7 text-[#5c3d46]/80 font-medium">
                  {item.text}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* 3. Our Story Section */}
      <section className="section-pad mx-auto max-w-[1240px] mb-20 md:mb-28">
        <div className="px-6 py-10 text-center md:px-14 md:py-12 rounded-[16px] bg-[#F4EBEC]/50 mb-10">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-medium tracking-[0.06em] text-[#5c3d46] uppercase">
            OUR STORY
          </h2>
          <p className="mt-3.5 text-[clamp(0.68rem,1.8vw,0.76rem)] font-medium tracking-[0.24em] text-[#e85d8a] uppercase leading-relaxed">
            TWELVE YEARS OF ROOMS BUILT TO LAST.
          </p>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center text-[1.02rem] leading-8 text-[#5c3d46]/80 font-medium px-4 md:px-6 mb-12 md:mb-16"
        >
          {STORY}
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
          {STORY_IMAGES.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="overflow-hidden rounded-[12px] shadow-[0_8px_24px_rgba(107,44,58,0.02)] border border-[#e5dcd3]/30"
            >
              <img
                src={src}
                alt="Story highlight"
                className="aspect-[3/4] w-full object-cover transition duration-500 hover:scale-[1.03]"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Our Process Section */}
      <section className="section-pad mx-auto max-w-[1240px]">
        <div className="px-6 py-10 text-center md:px-14 md:py-12 rounded-[16px] bg-[#F4EBEC]/50 mb-12 md:mb-16">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-medium tracking-[0.06em] text-[#5c3d46] uppercase">
            OUR PROCESS
          </h2>
          <p className="mt-3.5 text-[clamp(0.68rem,1.8vw,0.76rem)] font-medium tracking-[0.24em] text-[#e85d8a] uppercase leading-relaxed">
            A SEAMLESS JOURNEY FROM VISION TO REALITY.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line between cards */}
          <div
            aria-hidden
            className="absolute top-[48px] right-[15%] left-[15%] hidden h-[2px] bg-[#dfc2c6] md:block z-0"
          />

          <div className="grid gap-6 md:grid-cols-3 md:gap-8 lg:gap-10">
            {PROCESS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.step}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.12 }}
                  className="relative rounded-[16px] bg-[#F6EAEA] px-6 py-9 text-center shadow-[0_8px_30px_rgba(107,44,58,0.02)] border border-[#e5dcd3]/20 z-10"
                >
                  {/* Step bullet marker */}
                  <div className="mx-auto mb-6 flex h-6 w-6 items-center justify-center rounded-full bg-[#5c3d42] text-white text-[10px] font-bold shadow-md">
                    {item.step}
                  </div>

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#5c3d42] shadow-[0_4px_14px_rgba(107,44,58,0.04)]">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="mt-5 font-display text-[1.25rem] font-bold tracking-[0.04em] text-[#5c3d46]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.92rem] leading-7 text-[#5c3d46]/80 font-medium">
                    {item.text}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
