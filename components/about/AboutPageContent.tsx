"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { fallbackHomeData } from "@/lib/fallbackData";
import { aboutHeroGalleryImages, aboutStoryCollageImages } from "@/lib/companyData";
import CompanySectionHeading from "@/components/company/CompanySectionHeading";
import FadeInView from "@/components/company/FadeInView";
import SectionHeading from "@/components/ui/SectionHeading";
import FixedBackgroundImage from "@/components/ui/FixedBackgroundImage";
import {
  COMPANY_BODY,
  COMPANY_SHELL,
  PAGE_BODY_LEAD_CLASS,
  SECTION_BODY_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/components/company/companyLayoutShared";

type SiteBlock = { title?: string; text?: string };
type ProcessStep = { step: string; title: string; text: string };

export type AboutSite = {
  aboutIntro?: string;
  aboutStory?: string;
  aboutText?: string;
  aboutHeroSubtitle?: string;
  aboutImages?: string[];
  vision?: SiteBlock;
  mission?: SiteBlock;
  values?: SiteBlock;
  processSteps?: ProcessStep[];
};

const FB = fallbackHomeData.site;

/** Same frame as COMPANY_IMAGE_FRAME, on this page's tighter 6px radius */
const STORY_IMAGE_FRAME =
  "overflow-hidden rounded-[6px] shadow-[0_8px_24px_rgba(107,44,58,0.02)] border border-[#e5dcd3]/30";

// Connector components defined exactly as required
function TimelineConnector({ isHovered, style }: { isHovered: boolean; style?: React.CSSProperties }) {
  return (
    <div className="relative z-10 flex items-center justify-center shrink-0" style={style}>
      {/* Bold horizontal connector line */}
      <div className="relative w-full h-[4px] bg-[#dfc2c6]">
        {/* Animated colored progress line on hover */}
        <div
          className={`absolute top-0 left-0 bg-[#C94A5B] transition-all duration-[350ms] ease-out origin-left h-[4px]
            ${isHovered ? "w-full" : "w-0"}`}
        />
        {/* Circle dot in theme red positioned at the end of the line */}
        <div
          className={`absolute w-3 h-3 rounded-full bg-[#C94A5B] transition-transform duration-[350ms] ease-out
            right-0 top-1/2 -translate-y-1/2 translate-x-1/2
            ${isHovered ? "scale-[1.25]" : "scale-100"}`}
        />
      </div>
    </div>
  );
}

function TimelineConnectorMobile({ isHovered }: { isHovered: boolean }) {
  return (
    <div className="relative z-10 flex items-center justify-center w-[10%] shrink-0">
      {/* Bold horizontal connector line on mobile */}
      <div className="relative w-full h-[4px] bg-[#dfc2c6]">
        {/* Animated colored progress line on hover */}
        <div
          className={`absolute top-0 left-0 bg-[#C94A5B] transition-all duration-[350ms] ease-out origin-left h-[4px]
            ${isHovered ? "w-full" : "w-0"}`}
        />
        {/* Circle dot in theme red positioned at the end of the line */}
        <div
          className={`absolute w-3 h-3 rounded-full bg-[#C94A5B] transition-transform duration-[350ms] ease-out
            right-0 top-1/2 -translate-y-1/2 translate-x-1/2
            ${isHovered ? "scale-[1.25]" : "scale-100"}`}
        />
      </div>
    </div>
  );
}

export default function AboutPageContent({ site }: { site?: AboutSite | null }) {
  const [hoveredProcessIndex, setHoveredProcessIndex] = useState<number | null>(null);
  const [hoveredStoryIndex, setHoveredStoryIndex] = useState<number | null>(null);
  
  // Discrete steps: 0 (STEP 1 & 2), 1 (STEP 2 & 3), 2 (STEP 3 & 4)
  const [sliderIndex, setSliderIndex] = useState(0); 
  const sliderIndexRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const hasScrollStoppedRef = useRef(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  const COOLDOWN_MS = 800; // ignores rapid inputs while transition completes
  const TRANSLATIONS = ["0%", "-24.2236%", "-37.8882%"]; // mapped translations relative to w-[161%]

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // Intercept vertical scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const now = Date.now();
        const timeDiff = now - lastScrollTimeRef.current;
        const isScrollingDown = e.deltaY > 0;
        const currentIndex = sliderIndexRef.current;
        
        let shouldPrevent = false;

        // Clear any active scroll timer
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // If we are currently in a cooldown (animating), always block page scroll
        if (timeDiff <= COOLDOWN_MS) {
          shouldPrevent = true;
          hasScrollStoppedRef.current = false; // ensure lock remains active for the gesture
        } else {
          // We are not animating; check if we have slider steps remaining in this direction
          if (isScrollingDown) {
            if (currentIndex < 2) {
              shouldPrevent = true;
              hasScrollStoppedRef.current = false; // lock out continuous inertia scroll events
              const nextIndex = currentIndex + 1;
              sliderIndexRef.current = nextIndex;
              setSliderIndex(nextIndex);
              lastScrollTimeRef.current = now;
            } else {
              // At the end boundary: only allow page scroll if a distinct new scroll gesture started
              if (!hasScrollStoppedRef.current) {
                shouldPrevent = true;
              }
            }
          } else {
            if (currentIndex > 0) {
              shouldPrevent = true;
              hasScrollStoppedRef.current = false; // lock out continuous inertia scroll events
              const nextIndex = currentIndex - 1;
              sliderIndexRef.current = nextIndex;
              setSliderIndex(nextIndex);
              lastScrollTimeRef.current = now;
            } else {
              // At the start boundary: only allow page scroll if a distinct new scroll gesture started
              if (!hasScrollStoppedRef.current) {
                shouldPrevent = true;
              }
            }
          }
        }

        // Set timer to reset scroll stopped status when the user stops scrolling (e.g. lifts finger)
        scrollTimeoutRef.current = setTimeout(() => {
          hasScrollStoppedRef.current = true;
        }, 150);

        if (shouldPrevent) {
          lenisRef.current?.stop();
          if (e.cancelable) {
            e.preventDefault();
          }
        } else {
          lenisRef.current?.start();
        }
      }
    };

    const handleMouseLeave = () => {
      lenisRef.current?.start();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      lenisRef.current?.start();
    };
  }, []);

  const intro = site?.aboutIntro || site?.aboutText || FB.aboutIntro;
  const storyText = site?.aboutStory || site?.aboutText || FB.aboutStory;
  const heroSubtitle = site?.aboutHeroSubtitle || FB.aboutHeroSubtitle;

  const heroGallery =
    site?.aboutImages && site.aboutImages.length >= 3
      ? site.aboutImages.slice(0, 3)
      : aboutHeroGalleryImages;

  const storyImages =
    site?.aboutImages && site.aboutImages.length >= 4
      ? site.aboutImages.slice(0, 4)
      : aboutStoryCollageImages;

  const valueBlocks = [
    { title: site?.vision?.title || FB.vision.title, text: site?.vision?.text || FB.vision.text, iconPath: "/vision/visionIcon.png" },
    { title: site?.mission?.title || FB.mission.title, text: site?.mission?.text || FB.mission.text, iconPath: "/vision/missionIcon.png" },
    { title: site?.values?.title || FB.values.title, text: site?.values?.text || FB.values.text, iconPath: "/vision/valuesIcon.png" },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Consultation",
      text: "Understanding your lifestyle, needs, and design preferences.",
      icon: "/ourprocess/ourprocessStep1.png",
    },
    {
      step: "02",
      title: "Planning & Design",
      text: "Creating layouts, concepts, material selections, and realistic 3D visualizations.",
      icon: "/ourprocess/ourprocessStep2.png",
    },
    {
      step: "03",
      title: "Execution",
      text: "Expert craftsmanship, quality materials, and professional project management.",
      icon: "/ourprocess/ourprocessStep3.png",
    },
    {
      step: "04",
      title: "Delivery",
      text: "Final styling, quality inspection, and on-time project handover.",
      icon: "/ourprocess/ourprocessStep4.png",
    },
  ];

  return (
    <div className="bg-[#f7f3f2] pt-[72px] pb-20 font-outfit md:pb-28">
      <section className={`${COMPANY_SHELL} pb-8 pt-10 md:pb-10 md:pt-16`}>
        <FadeInView className="mb-6 md:mb-8">
          <SectionHeading
            title="About Us"
            subtitle={heroSubtitle || undefined}
            titleAs="h1"
            expanded
            className="w-full rounded-[6px] !pb-6 md:!pb-8"
          >
            <p className={`mx-auto mt-8 max-w-4xl px-2 md:px-4 ${PAGE_BODY_LEAD_CLASS} !text-black`}>{intro}</p>
          </SectionHeading>
        </FadeInView>

        {/* y=0 keeps this wrapper transform-free so the fixed background keeps working */}
        <FadeInView delay={0.1} y={0}>
          <FixedBackgroundImage
            src={heroGallery[1] || heroGallery[0]}
            alt="About Us Featured"
            className="mx-auto h-[min(42vw,340px)] min-h-[220px] w-full rounded-[6px] border border-[#e5dcd3]/30 bg-white shadow-[0_10px_30px_rgba(107,44,58,0.04)] sm:h-[340px] md:h-[400px] lg:h-[440px]"
          />
        </FadeInView>
      </section>

      <section className={`${COMPANY_SHELL} mb-20 md:mb-28`}>
        <CompanySectionHeading
          title="Vision. Mission. Value."
          subtitle="The foundation of everything we create."
          subtitleSentenceCase={false}
          className="mb-10 md:mb-14"
          radiusClassName="rounded-[6px]"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {valueBlocks.map((item, i) => {
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="group rounded-[6px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 md:p-10 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-300 ease-out hover:-translate-y-[6px] hover:shadow-[0_12px_36px_rgba(107,44,58,0.06)]"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E5D2D5]/70 shadow-[0_4px_14px_rgba(107,44,58,0.04)]">
                  <img src={item.iconPath} alt={item.title} className="w-11 h-11 object-contain" />
                </div>
                <h3 className={`mt-6 ${SUBSECTION_TITLE_CLASS} !text-black`}>{item.title}</h3>
                <div className="mt-3.5 h-[2px] w-[30px] bg-[#C94A5B] transition-all duration-[350ms] ease-out group-hover:w-[80px]" />
                <p className={`mt-5 ${SECTION_BODY_CLASS} leading-7 !text-black`}>{item.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className={`${COMPANY_SHELL} mb-20 md:mb-28`}>
        <CompanySectionHeading
          title="Our Story"
          subtitle={heroSubtitle || undefined}
          subtitleSentenceCase={false}
          className="mb-10"
          radiusClassName="rounded-[6px]"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`mx-auto mb-12 max-w-4xl px-4 text-center md:mb-16 md:px-6 ${COMPANY_BODY} !text-black`}
        >
          {storyText}
        </motion.p>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 items-start"
          onMouseLeave={() => setHoveredStoryIndex(null)}
        >
          {storyImages.map((src, i) => {
            // Untouched grid keeps the alternating stagger; hovering raises that
            // image to the top row and drops every other one to the lowered row
            const isLowered =
              hoveredStoryIndex === null ? i % 2 === 0 : i !== hoveredStoryIndex;
            return (
              <motion.button
                key={src}
                type="button"
                aria-label={`Our story highlight ${i + 1}`}
                onMouseEnter={() => setHoveredStoryIndex(i)}
                onFocus={() => setHoveredStoryIndex(i)}
                onBlur={() => setHoveredStoryIndex(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
                className={`${STORY_IMAGE_FRAME} block w-full text-left outline-none transition-[margin-top] duration-[450ms] ease-out ${isLowered ? "mt-0 sm:mt-8 md:mt-12 lg:mt-16" : "mt-0"}`}
              >
                <img
                  src={src}
                  alt={`Our story highlight ${i + 1}`}
                  className="aspect-[3/4] w-full object-cover transition duration-500 hover:scale-[1.02]"
                />
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Our Process — Desktop Intercept-Driven Horizontal Timeline */}
      <section ref={sectionRef} className="relative hidden md:block bg-transparent py-20 select-none">
        <div className="w-full flex flex-col justify-center">
          <div className={`${COMPANY_SHELL} mb-10`}>
            <CompanySectionHeading
              title="Our Process"
              subtitle="A seamless journey from vision to reality."
              subtitleSentenceCase={false}
              radiusClassName="rounded-[6px]"
            />
          </div>

          <div className={`${COMPANY_SHELL} overflow-hidden`}>
            <div className="relative w-full">
              <motion.div
                animate={{ x: TRANSLATIONS[sliderIndex] }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.65 }}
                className="flex flex-row items-center w-[161%] py-8 gap-0"
              >
                {/* Start Spacer */}
                <div className="shrink-0" style={{ width: "3.1056%" }} />

                {/* Step 1 */}
                <motion.article
                  className="group relative h-[320px] rounded-[6px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_16px_36px_rgba(107,44,58,0.05)] shrink-0"
                  style={{ width: "21.1180%" }}
                  onMouseEnter={() => setHoveredProcessIndex(0)}
                  onMouseLeave={() => setHoveredProcessIndex(null)}
                >
                  <div className="absolute top-8 right-8 text-[#783b4a] opacity-[0.3] scale-100 transition-all duration-[350ms] ease-out group-hover:opacity-[0.45] group-hover:scale-105">
                    <img src="/ourprocess/ourprocessStep1.png" alt="Consultation" className="w-[60px] h-[60px] object-contain partner-logo-img" />
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-[2px] bg-[#C94A5B] h-[32px] transition-all duration-[350ms] ease-out group-hover:h-[48px]" />
                    <span className="font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d] pt-1">
                      STEP 01
                    </span>
                  </div>
                  <h3 className="font-outfit text-[20px] font-semibold !text-black mt-7">
                    {processSteps[0].title}
                  </h3>
                  <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>
                    {processSteps[0].text}
                  </p>
                </motion.article>

                {/* Connector 1 */}
                <TimelineConnector isHovered={hoveredProcessIndex === 0} style={{ width: "3.1056%" }} />

                {/* Step 2 */}
                <motion.article
                  className="group relative h-[320px] rounded-[6px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_16px_36px_rgba(107,44,58,0.05)] shrink-0"
                  style={{ width: "21.1180%" }}
                  onMouseEnter={() => setHoveredProcessIndex(1)}
                  onMouseLeave={() => setHoveredProcessIndex(null)}
                >
                  <div className="absolute top-8 right-8 text-[#783b4a] opacity-[0.3] scale-100 transition-all duration-[350ms] ease-out group-hover:opacity-[0.45] group-hover:scale-105">
                    <img src="/ourprocess/ourprocessStep2.png" alt="Planning & Design" className="w-[60px] h-[60px] object-contain partner-logo-img" />
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-[2px] bg-[#C94A5B] h-[32px] transition-all duration-[350ms] ease-out group-hover:h-[48px]" />
                    <span className="font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d] pt-1">
                      STEP 02
                    </span>
                  </div>
                  <h3 className="font-outfit text-[20px] font-semibold !text-black mt-7">
                    {processSteps[1].title}
                  </h3>
                  <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>
                    {processSteps[1].text}
                  </p>
                </motion.article>

                {/* Connector 2 */}
                <TimelineConnector isHovered={hoveredProcessIndex === 1} style={{ width: "3.1056%" }} />

                {/* Step 3 */}
                <motion.article
                  className="group relative h-[320px] rounded-[6px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_16px_36px_rgba(107,44,58,0.05)] shrink-0"
                  style={{ width: "21.1180%" }}
                  onMouseEnter={() => setHoveredProcessIndex(2)}
                  onMouseLeave={() => setHoveredProcessIndex(null)}
                >
                  <div className="absolute top-8 right-8 text-[#783b4a] opacity-[0.3] scale-100 transition-all duration-[350ms] ease-out group-hover:opacity-[0.45] group-hover:scale-105">
                    <img src="/ourprocess/ourprocessStep3.png" alt="Execution" className="w-[60px] h-[60px] object-contain partner-logo-img" />
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-[2px] bg-[#C94A5B] h-[32px] transition-all duration-[350ms] ease-out group-hover:h-[48px]" />
                    <span className="font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d] pt-1">
                      STEP 03
                    </span>
                  </div>
                  <h3 className="font-outfit text-[20px] font-semibold !text-black mt-7">
                    {processSteps[2].title}
                  </h3>
                  <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>
                    {processSteps[2].text}
                  </p>
                </motion.article>

                {/* Connector 3 */}
                <TimelineConnector isHovered={hoveredProcessIndex === 2} style={{ width: "3.1056%" }} />

                {/* Step 4 */}
                <motion.article
                  className="group relative h-[320px] rounded-[6px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_16px_36px_rgba(107,44,58,0.05)] shrink-0"
                  style={{ width: "21.1180%" }}
                  onMouseEnter={() => setHoveredProcessIndex(3)}
                  onMouseLeave={() => setHoveredProcessIndex(null)}
                >
                  <div className="absolute top-8 right-8 text-[#783b4a] opacity-[0.3] scale-100 transition-all duration-[350ms] ease-out group-hover:opacity-[0.45] group-hover:scale-105">
                    <img src="/ourprocess/ourprocessStep4.png" alt="Delivery" className="w-[60px] h-[60px] object-contain partner-logo-img" />
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-[2px] bg-[#C94A5B] h-[32px] transition-all duration-[350ms] ease-out group-hover:h-[48px]" />
                    <span className="font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d] pt-1">
                      STEP 04
                    </span>
                  </div>
                  <h3 className="font-outfit text-[20px] font-semibold !text-black mt-7">
                    {processSteps[3].title}
                  </h3>
                  <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>
                    {processSteps[3].text}
                  </p>
                </motion.article>

                {/* End Spacer */}
                <div className="shrink-0" style={{ width: "3.1056%" }} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process — Mobile Native Swipe Timeline */}
      <section className="block md:hidden pb-20 pt-6">
        <div className={`${COMPANY_SHELL} mb-8`}>
          <CompanySectionHeading
            title="Our Process"
            subtitle="A seamless journey from vision to reality."
            subtitleSentenceCase={false}
            radiusClassName="rounded-[6px]"
          />
        </div>

        <div className={`${COMPANY_SHELL} overflow-hidden`}>
          <div className="flex flex-row items-center overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full px-0 gap-0">
            {/* Start Spacer */}
            <div className="w-[12%] shrink-0" />

            {/* Step 1 */}
            <article
              className="group relative w-[76%] h-[280px] rounded-[6px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_16px_36px_rgba(107,44,58,0.05)] shrink-0 snap-center"
              onMouseEnter={() => setHoveredProcessIndex(0)}
              onMouseLeave={() => setHoveredProcessIndex(null)}
            >
              <div className="absolute top-8 right-8 text-[#783b4a] opacity-[0.3] scale-100 transition-all duration-[350ms] ease-out group-hover:opacity-[0.45] group-hover:scale-105">
                <img src="/ourprocess/ourprocessStep1.png" alt="Consultation" className="w-[60px] h-[60px] object-contain partner-logo-img" />
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-[2px] bg-[#C94A5B] h-[32px] transition-all duration-[350ms] ease-out group-hover:h-[48px]" />
                <span className="font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d] pt-1">
                  STEP 01
                </span>
              </div>
              <h3 className="font-outfit text-[20px] font-semibold !text-black mt-7">
                {processSteps[0].title}
              </h3>
              <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>
                {processSteps[0].text}
              </p>
            </article>

            {/* Connector 1 */}
            <TimelineConnectorMobile isHovered={hoveredProcessIndex === 0} />

            {/* Step 2 */}
            <article
              className="group relative w-[76%] h-[280px] rounded-[6px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_16px_36px_rgba(107,44,58,0.05)] shrink-0 snap-center"
              onMouseEnter={() => setHoveredProcessIndex(1)}
              onMouseLeave={() => setHoveredProcessIndex(null)}
            >
              <div className="absolute top-8 right-8 text-[#783b4a] opacity-[0.3] scale-100 transition-all duration-[350ms] ease-out group-hover:opacity-[0.45] group-hover:scale-105">
                <img src="/ourprocess/ourprocessStep2.png" alt="Planning & Design" className="w-[60px] h-[60px] object-contain partner-logo-img" />
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-[2px] bg-[#C94A5B] h-[32px] transition-all duration-[350ms] ease-out group-hover:h-[48px]" />
                <span className="font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d] pt-1">
                  STEP 02
                </span>
              </div>
              <h3 className="font-outfit text-[20px] font-semibold !text-black mt-7">
                {processSteps[1].title}
              </h3>
              <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>
                {processSteps[1].text}
              </p>
            </article>

            {/* Connector 2 */}
            <TimelineConnectorMobile isHovered={hoveredProcessIndex === 1} />

            {/* Step 3 */}
            <article
              className="group relative w-[76%] h-[280px] rounded-[6px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_16px_36px_rgba(107,44,58,0.05)] shrink-0 snap-center"
              onMouseEnter={() => setHoveredProcessIndex(2)}
              onMouseLeave={() => setHoveredProcessIndex(null)}
            >
              <div className="absolute top-8 right-8 text-[#783b4a] opacity-[0.3] scale-100 transition-all duration-[350ms] ease-out group-hover:opacity-[0.45] group-hover:scale-105">
                <img src="/ourprocess/ourprocessStep3.png" alt="Execution" className="w-[60px] h-[60px] object-contain partner-logo-img" />
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-[2px] bg-[#C94A5B] h-[32px] transition-all duration-[350ms] ease-out group-hover:h-[48px]" />
                <span className="font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d] pt-1">
                  STEP 03
                </span>
              </div>
              <h3 className="font-outfit text-[20px] font-semibold !text-black mt-7">
                {processSteps[2].title}
              </h3>
              <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>
                {processSteps[2].text}
              </p>
            </article>

            {/* Connector 3 */}
            <TimelineConnectorMobile isHovered={hoveredProcessIndex === 2} />

            {/* Step 4 */}
            <article
              className="group relative w-[76%] h-[280px] rounded-[6px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_16px_36px_rgba(107,44,58,0.05)] shrink-0 snap-center"
              onMouseEnter={() => setHoveredProcessIndex(3)}
              onMouseLeave={() => setHoveredProcessIndex(null)}
            >
              <div className="absolute top-8 right-8 text-[#783b4a] opacity-[0.3] scale-100 transition-all duration-[350ms] ease-out group-hover:opacity-[0.45] group-hover:scale-105">
                <img src="/ourprocess/ourprocessStep4.png" alt="Delivery" className="w-[60px] h-[60px] object-contain partner-logo-img" />
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-[2px] bg-[#C94A5B] h-[32px] transition-all duration-[350ms] ease-out group-hover:h-[48px]" />
                <span className="font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d] pt-1">
                  STEP 04
                </span>
              </div>
              <h3 className="font-outfit text-[20px] font-semibold !text-black mt-7">
                {processSteps[3].title}
              </h3>
              <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>
                {processSteps[3].text}
              </p>
            </article>

            {/* End Spacer */}
            <div className="w-[12%] shrink-0" />
          </div>
        </div>
      </section>
    </div>
  );
}
