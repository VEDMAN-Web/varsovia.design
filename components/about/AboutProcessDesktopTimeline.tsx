"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import CompanySectionHeading from "@/components/company/CompanySectionHeading";
import { COMPANY_SHELL, SECTION_BODY_CLASS } from "@/components/company/companyLayoutShared";

gsap.registerPlugin(ScrollTrigger);

/** >1 = more vertical scroll per horizontal travel (slower timeline) */
const PROCESS_SCROLL_DISTANCE_MULTIPLIER = 1.35;

type ProcessStep = { step: string; title: string; text: string; icon: string };

type Props = {
  title: string;
  subtitle: string;
  stepBadge: (step: string) => string;
  steps: ProcessStep[];
};

function TimelineConnector({ isHovered, style }: { isHovered: boolean; style?: React.CSSProperties }) {
  return (
    <div className="relative z-10 flex shrink-0 items-center justify-center" style={style}>
      <div className="relative h-[4px] w-full bg-[#dfc2c6]">
        <div
          className={`absolute left-0 top-0 h-[4px] origin-left bg-[#C94A5B] transition-all duration-[350ms] ease-out ${
            isHovered ? "w-full" : "w-0"
          }`}
        />
        <div
          className={`absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#C94A5B] transition-transform duration-[350ms] ease-out ${
            isHovered ? "scale-[1.25]" : "scale-100"
          }`}
        />
      </div>
    </div>
  );
}

/** Pinned horizontal scrub — ScrollTrigger + Lenis (no extra empty scroll runway) */
export default function AboutProcessDesktopTimeline({ title, subtitle, stepBadge, steps }: Props) {
  const pinRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const lenis = useLenis();

  useLayoutEffect(() => {
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!pin || !viewport || !track) return;

    const onLenisScroll = () => ScrollTrigger.update();
    lenis?.on("scroll", onLenisScroll);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value?: number) {
        if (value !== undefined && lenis) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis?.scroll ?? window.scrollY;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: document.documentElement.clientWidth,
          height: window.innerHeight,
        };
      },
    });

    const ctx = gsap.context(() => {
      const getScrollDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top+=88",
          end: () => `+=${getScrollDistance() * PROCESS_SCROLL_DISTANCE_MULTIPLIER}`,
          pin: true,
          scrub: 0.85,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, pin);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
      lenis?.off("scroll", onLenisScroll);
    };
  }, [lenis, steps.length]);

  return (
    <section ref={pinRef} className="relative hidden md:block select-none">
      <div className={`${COMPANY_SHELL} pb-8 pt-4`}>
        <CompanySectionHeading
          title={title}
          subtitle={subtitle}
          subtitleSentenceCase={false}
          className="mb-10"
          radiusClassName="rounded-[6px]"
        />

        <div ref={viewportRef} className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex w-[161%] flex-row items-center gap-0 py-8 will-change-transform"
          >
            <div className="shrink-0" style={{ width: "3.1056%" }} />
            {steps.map((step, index) => (
              <div key={step.step} className="contents">
                <motion.article
                  className="group relative h-[320px] shrink-0 rounded-[6px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_16px_36px_rgba(107,44,58,0.05)]"
                  style={{ width: "21.1180%" }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="absolute right-8 top-8 scale-100 text-[#783b4a] opacity-[0.3] transition-all duration-[350ms] ease-out group-hover:scale-105 group-hover:opacity-[0.45]">
                    <img src={step.icon} alt="" className="h-[60px] w-[60px] object-contain partner-logo-img" />
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="h-[32px] w-[2px] bg-[#C94A5B] transition-all duration-[350ms] ease-out group-hover:h-[48px]" />
                    <span className="pt-1 font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d]">
                      {stepBadge(step.step)}
                    </span>
                  </div>
                  <h3 className="mt-7 font-outfit text-[20px] font-semibold !text-black">{step.title}</h3>
                  <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>{step.text}</p>
                </motion.article>
                {index < steps.length - 1 ? (
                  <TimelineConnector
                    isHovered={hoveredIndex === index}
                    style={{ width: "3.1056%" }}
                  />
                ) : null}
              </div>
            ))}
            <div className="shrink-0" style={{ width: "3.1056%" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
