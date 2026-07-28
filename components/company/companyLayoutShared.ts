import { COMPANY_EASE } from "@/lib/companyData";
import {
  SITE_SECTION_HEADING_WIDE,
  SITE_SECTION_SHELL,
} from "@/components/ui/layoutShared";
import {
  PAGE_BODY_LEAD_CLASS,
  PAGE_STAT_VALUE_CLASS,
  PAGE_ARTICLE_TITLE_CLASS,
  SECTION_BLOCK_CLASS,
  SECTION_BLOCK_COMPACT_CLASS,
  SECTION_BLOCK_GRADIENT,
  SECTION_BODY_CLASS,
  SECTION_LABEL_CLASS,
  SECTION_SUBTITLE_CLASS,
  SECTION_SUBTITLE_SENTENCE_CLASS,
  SECTION_TITLE_CLASS,
  SUBSECTION_EYEBROW_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/components/ui/SectionHeading";

export {
  SECTION_TITLE_CLASS,
  SECTION_SUBTITLE_CLASS,
  SECTION_SUBTITLE_SENTENCE_CLASS,
  SECTION_LABEL_CLASS,
  SECTION_BODY_CLASS,
  PAGE_BODY_LEAD_CLASS,
  SUBSECTION_TITLE_CLASS,
  SUBSECTION_EYEBROW_CLASS,
  PAGE_STAT_VALUE_CLASS,
  PAGE_ARTICLE_TITLE_CLASS,
  SECTION_BLOCK_CLASS,
  SECTION_BLOCK_COMPACT_CLASS,
  SECTION_BLOCK_GRADIENT,
  SITE_SECTION_SHELL as SECTION_SHELL,
  SITE_SECTION_HEADING_WIDE as SECTION_HEADING_WIDE,
};

/** Same width as Interior pages */
export const COMPANY_SHELL = SITE_SECTION_SHELL;

export const COMPANY_PAGE_BG = "bg-[#f7f3f2] pt-[72px] pb-20 md:pb-28 min-h-screen font-outfit";
export const COMPANY_CARD =
  "rounded-[16px] bg-[#F6EAEA] border border-[#e5dcd3]/30 shadow-[0_4px_20px_rgba(107,44,58,0.015)]";
export const COMPANY_IMAGE_FRAME =
  "overflow-hidden rounded-[12px] shadow-[0_8px_24px_rgba(107,44,58,0.02)] border border-[#e5dcd3]/30";

export const COMPANY_BODY = PAGE_BODY_LEAD_CLASS;
export const COMPANY_TITLE = SECTION_TITLE_CLASS;
export const COMPANY_SUBTITLE = SECTION_SUBTITLE_CLASS;

export const companyTransition = {
  duration: 0.55,
  ease: COMPANY_EASE,
};

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...companyTransition, delay },
  }),
};

export const cardHoverProps = {
  whileHover: { y: -4, boxShadow: "0 12px 40px rgba(107,44,58,0.06)" },
  transition: { duration: 0.35, ease: COMPANY_EASE },
};
