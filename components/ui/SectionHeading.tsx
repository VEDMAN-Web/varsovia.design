type SectionHeadingProps = {
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
  /** Top-left slot inside the gradient band (e.g. back link on legal pages). */
  leading?: React.ReactNode;
};

/** Oswald — gradient band / page hero section titles (Figma 50px Regular, uppercase) */
export const SECTION_TITLE_CLASS =
  "font-display px-1 text-balance break-words text-[clamp(1.35rem,3.4vw,3.125rem)] font-normal uppercase tracking-[0.06em] text-[#6a414d] sm:tracking-[0.1em]";

/** Shared layout: one line, full band width, no wrap overlap with content below. */
export const SECTION_SUBTITLE_LAYOUT =
  "w-full max-w-[min(100%,72rem)] shrink-0 text-center leading-snug whitespace-nowrap overflow-x-auto overflow-y-hidden px-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

/** Outfit — pink uppercase line under section title (Figma 22px) */
export const SECTION_SUBTITLE_CLASS =
  `font-outfit mx-auto mt-4 text-[clamp(0.6875rem,1.2vw,1.375rem)] font-normal uppercase tracking-[0.06em] text-[#cf5374] sm:mt-[30px] sm:tracking-[0.12em] lg:tracking-[0.22em] ${SECTION_SUBTITLE_LAYOUT}`;

export const SECTION_SUBTITLE_SENTENCE_CLASS =
  `font-outfit mx-auto mt-[30px] text-[clamp(0.75rem,1.25vw,1.25rem)] font-normal normal-case tracking-normal text-[#cf5374] ${SECTION_SUBTITLE_LAYOUT}`;

export const SECTION_LABEL_CLASS =
  "font-outfit text-[10px] font-semibold uppercase tracking-[0.18em] text-[#cf5374]";

export const SECTION_BODY_CLASS = "font-outfit text-sm font-normal text-[#6a414d]";

export const PAGE_BODY_LEAD_CLASS =
  "font-outfit text-[clamp(0.9375rem,1.5vw,1.0625rem)] font-normal leading-8 text-[#6a414d]/85";

export const SUBSECTION_TITLE_CLASS =
  "font-outfit text-[clamp(1.125rem,2vw,1.5rem)] font-semibold text-[#6a414d]";

/** Oswald — in-page display headings (product/detail related blocks) */
export const PAGE_DISPLAY_HEADING_CLASS =
  "font-display text-balance text-[clamp(1.375rem,2.6vw,2.125rem)] font-normal uppercase tracking-[0.06em] text-[#6a414d] sm:tracking-[0.08em]";

export const SUBSECTION_EYEBROW_CLASS =
  "font-outfit text-sm font-medium uppercase tracking-[0.18em] text-[#cf5374]";

export const PAGE_STAT_VALUE_CLASS =
  "font-display text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-none tracking-wide text-[#6a414d]";

export const PAGE_ARTICLE_TITLE_CLASS =
  "font-outfit text-[clamp(1.375rem,2.6vw,2.125rem)] font-semibold leading-[1.35] tracking-[-0.01em] text-[#6a414d]";

export const SECTION_BLOCK_CLASS =
  "mx-auto flex w-full min-h-[84px] flex-col items-center justify-center px-2 pt-10 pb-8 sm:min-h-[100px] sm:px-4 sm:pt-12 sm:pb-9 md:min-h-[200px] md:px-6 md:pt-14 md:pb-9";

export const SECTION_BLOCK_COMPACT_CLASS =
  "mx-auto flex w-full min-h-[72px] flex-col items-center justify-center px-3 pt-10 pb-8 sm:min-h-[88px] sm:px-6 sm:pt-12 sm:pb-9 md:min-h-[200px] md:pt-14 md:pb-9";

export const SECTION_BLOCK_EXPANDED_CLASS =
  "mx-auto flex w-full flex-col items-center px-6 pt-14 pb-8 text-center sm:px-8 md:px-10 md:pt-[4.5rem] md:pb-10 lg:px-14";

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
  titleClassName,
  subtitleSentenceCase = false,
  subtitleClassName,
  children,
  compact = false,
  expanded = false,
  noGradient = false,
  leading,
}: SectionHeadingProps) {
  const TitleTag = titleAs;
  const blockClass = expanded
    ? SECTION_BLOCK_EXPANDED_CLASS
    : compact
      ? SECTION_BLOCK_COMPACT_CLASS
      : SECTION_BLOCK_CLASS;

  const subtitleClass =
    subtitleClassName ??
    (subtitleSentenceCase ? SECTION_SUBTITLE_SENTENCE_CLASS : SECTION_SUBTITLE_CLASS);

  return (
    <div
      className={`${blockClass} ${leading ? "relative" : ""} ${className}`.trim()}
      style={noGradient ? undefined : { background: SECTION_BLOCK_GRADIENT }}
    >
      {leading ? (
        <div className="absolute left-4 top-4 z-10 sm:left-5 sm:top-5 md:left-8 md:top-6">
          {leading}
        </div>
      ) : null}
      <TitleTag className={titleClassName ?? SECTION_TITLE_CLASS}>{title}</TitleTag>
      {subtitle && <p className={subtitleClass}>{subtitle}</p>}
      {children}
    </div>
  );
}
