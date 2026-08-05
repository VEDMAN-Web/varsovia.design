"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  fadeUpBlurItem,
  reducedFadeUpItem,
  staggerContainer,
  VIEWPORT_ONCE,
} from "@/lib/motionPresets";
import SectionHeading, {
  SECTION_BLOCK_CLASS,
  SECTION_BLOCK_COMPACT_CLASS,
  SECTION_BLOCK_EXPANDED_CLASS,
  SECTION_BLOCK_GRADIENT,
  SECTION_SUBTITLE_CLASS,
  SECTION_SUBTITLE_SENTENCE_CLASS,
  SECTION_TITLE_CLASS,
} from "@/components/ui/SectionHeading";

type SectionHeadingRevealProps = {
  title: string;
  subtitle?: string;
  className?: string;
  titleAs?: "h1" | "h2" | "h3";
  titleClassName?: string;
  subtitleSentenceCase?: boolean;
  subtitleClassName?: string;
  children?: React.ReactNode;
  compact?: boolean;
  expanded?: boolean;
  noGradient?: boolean;
  leading?: React.ReactNode;
  /** Scroll-driven title/subtitle reveal (default true) */
  reveal?: boolean;
  /** Above-the-fold heroes: animate on mount instead of scroll */
  trigger?: "inView" | "mount";
};

export default function SectionHeadingReveal({
  title,
  subtitle,
  className = "",
  titleAs = "h2",
  titleClassName,
  subtitleSentenceCase = false,
  subtitleClassName,
  children,
  compact = false,
  expanded = false,
  noGradient = false,
  leading,
  reveal = true,
  trigger = "inView",
}: SectionHeadingRevealProps) {
  const reduceMotion = useReducedMotion();

  if (!reveal) {
    return (
      <SectionHeading
        title={title}
        subtitle={subtitle}
        className={className}
        titleAs={titleAs}
        titleClassName={titleClassName}
        subtitleSentenceCase={subtitleSentenceCase}
        subtitleClassName={subtitleClassName}
        compact={compact}
        expanded={expanded}
        noGradient={noGradient}
        leading={leading}
      >
        {children}
      </SectionHeading>
    );
  }

  const TitleTag = titleAs;
  const blockClass = expanded
    ? SECTION_BLOCK_EXPANDED_CLASS
    : compact
      ? SECTION_BLOCK_COMPACT_CLASS
      : SECTION_BLOCK_CLASS;

  const subtitleClass =
    subtitleClassName ??
    (subtitleSentenceCase ? SECTION_SUBTITLE_SENTENCE_CLASS : SECTION_SUBTITLE_CLASS);

  const titleVariant = reduceMotion ? reducedFadeUpItem : fadeUpBlurItem;
  const subtitleVariant = reduceMotion ? reducedFadeUpItem : fadeUpBlurItem;

  const motionTrigger =
    trigger === "mount"
      ? { initial: "hidden" as const, animate: "visible" as const }
      : {
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: VIEWPORT_ONCE,
        };

  return (
    <motion.div
      className={`${blockClass} ${leading ? "relative" : ""} ${className}`.trim()}
      style={noGradient ? undefined : { background: SECTION_BLOCK_GRADIENT }}
      {...motionTrigger}
      variants={staggerContainer(0.12, trigger === "mount" ? 0.08 : 0.02)}
    >
      {leading ? (
        <div className="absolute left-4 top-4 z-10 sm:left-5 sm:top-5 md:left-8 md:top-6">
          {leading}
        </div>
      ) : null}
      <motion.div variants={titleVariant}>
        <TitleTag className={titleClassName ?? SECTION_TITLE_CLASS}>{title}</TitleTag>
      </motion.div>
      {subtitle ? (
        <motion.p className={subtitleClass} variants={subtitleVariant}>
          {subtitle}
        </motion.p>
      ) : null}
      {children ? <motion.div variants={subtitleVariant}>{children}</motion.div> : null}
    </motion.div>
  );
}
