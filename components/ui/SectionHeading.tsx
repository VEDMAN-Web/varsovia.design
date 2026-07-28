type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
  titleAs?: "h1" | "h2" | "h3";
  subtitleSentenceCase?: boolean;
  children?: React.ReactNode;
  compact?: boolean;
  expanded?: boolean;
  noGradient?: boolean;
};

/** Shared homepage + inner-page section typography */
export const SECTION_TITLE_CLASS =
  "font-display text-[clamp(1.45rem,3.4vw,3.125rem)] font-normal tracking-[0.1em] text-[#6a414d] uppercase";

export const SECTION_SUBTITLE_CLASS =
  "font-outfit mx-auto mt-[30px] max-w-[68rem] px-2 text-[clamp(0.875rem,1.6vw,1.375rem)] font-normal uppercase tracking-[0.3em] text-[#cf5374]";

export const SECTION_SUBTITLE_SENTENCE_CLASS =
  "font-outfit mx-auto mt-[30px] max-w-[68rem] px-2 text-[clamp(0.875rem,1.6vw,1.375rem)] font-normal normal-case tracking-normal text-[#cf5374]";

export const SECTION_LABEL_CLASS =
  "font-outfit text-[10px] font-semibold uppercase tracking-[0.18em] text-[#cf5374]";

export const SECTION_BODY_CLASS = "font-outfit text-sm font-normal text-[#6a414d]";

export const PAGE_BODY_LEAD_CLASS =
  "font-outfit text-[clamp(0.9375rem,1.5vw,1.0625rem)] font-normal leading-8 text-[#6a414d]/85";

export const SUBSECTION_TITLE_CLASS =
  "font-outfit text-[clamp(1.125rem,2vw,1.5rem)] font-semibold text-[#6a414d]";

export const SUBSECTION_EYEBROW_CLASS =
  "font-outfit text-sm font-medium uppercase tracking-[0.18em] text-[#cf5374]";

export const PAGE_STAT_VALUE_CLASS =
  "font-display text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-none tracking-wide text-[#6a414d]";

export const PAGE_ARTICLE_TITLE_CLASS =
  "font-outfit text-[clamp(1.375rem,2.6vw,2.125rem)] font-semibold leading-[1.35] tracking-[-0.01em] text-[#6a414d]";

export const SECTION_BLOCK_CLASS =
  "mx-auto flex min-h-[100px] w-full flex-col items-center justify-center px-4 py-6 sm:min-h-[130px] sm:px-6 md:h-[177px] md:py-0";

export const SECTION_BLOCK_COMPACT_CLASS =
  "mx-auto flex min-h-[88px] w-full flex-col items-center justify-center px-4 py-8 sm:min-h-[100px] sm:px-6 md:py-10";

export const SECTION_BLOCK_EXPANDED_CLASS =
  "mx-auto flex w-full flex-col items-center px-6 py-12 text-center sm:px-8 md:px-10 md:py-16 lg:px-14";

export const SECTION_BLOCK_GRADIENT =
  "linear-gradient(180deg, rgba(130,94,105,0.22) 0%, rgba(244,235,236,0) 100%)";

/**
 * Figma section heading block (177px band):
 * - Title: Oswald Regular 50px, tracking 5px, #6a414d
 * - Subtitle: Outfit Regular 22px, tracking 6.6px, #cf5374
 * - 30px gap between lines
 */
export default function SectionHeading({
  title,
  subtitle,
  className = "",
  titleAs = "h2",
  subtitleSentenceCase = false,
  children,
  compact = false,
  expanded = false,
  noGradient = false,
}: SectionHeadingProps) {
  const TitleTag = titleAs;
  const blockClass = expanded
    ? SECTION_BLOCK_EXPANDED_CLASS
    : compact
      ? SECTION_BLOCK_COMPACT_CLASS
      : SECTION_BLOCK_CLASS;

  return (
    <div
      className={`${blockClass} ${className}`.trim()}
      style={noGradient ? undefined : { background: SECTION_BLOCK_GRADIENT }}
    >
      <TitleTag className={SECTION_TITLE_CLASS}>{title}</TitleTag>
      {subtitle && (
        <p className={subtitleSentenceCase ? SECTION_SUBTITLE_SENTENCE_CLASS : SECTION_SUBTITLE_CLASS}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
