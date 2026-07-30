"use client";

import FadeInView from "@/components/company/FadeInView";
import { SECTION_HEADING_WIDE } from "@/components/company/companyLayoutShared";
import SectionHeading from "@/components/ui/SectionHeading";

type CompanySectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
  subtitleSentenceCase?: boolean;
  noGradient?: boolean;
  /** Corner radius of the heading band */
  radiusClassName?: string;
};

export default function CompanySectionHeading({
  title,
  subtitle,
  className = "",
  subtitleSentenceCase = true,
  noGradient = false,
  radiusClassName = "rounded-[16px]",
}: CompanySectionHeadingProps) {
  return (
    <FadeInView className={className}>
      <SectionHeading
        title={title}
        subtitle={subtitle}
        titleAs="h2"
        subtitleSentenceCase={subtitleSentenceCase}
        noGradient={noGradient}
        className={`w-full ${radiusClassName} ${SECTION_HEADING_WIDE}`}
      />
    </FadeInView>
  );
}
