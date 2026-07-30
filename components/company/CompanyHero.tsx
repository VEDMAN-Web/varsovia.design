"use client";

import FadeInView from "@/components/company/FadeInView";
import { COMPANY_SHELL, PAGE_BODY_LEAD_CLASS } from "@/components/company/companyLayoutShared";
import SectionHeading from "@/components/ui/SectionHeading";

type CompanyHeroProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  compact?: boolean;
  expanded?: boolean;
  subtitleSentenceCase?: boolean;
  subtitleClassName?: string;
  titleClassName?: string;
  sectionClassName?: string;
  fadeClassName?: string;
};

export default function CompanyHero({
  title,
  subtitle,
  children,
  compact,
  expanded = false,
  subtitleSentenceCase = true,
  subtitleClassName,
  titleClassName,
  sectionClassName = "",
  fadeClassName = "",
}: CompanyHeroProps) {
  return (
    <section className={`${COMPANY_SHELL} pb-8 pt-10 md:pb-10 md:pt-16 ${sectionClassName}`.trim()}>
      <FadeInView className={`mb-8 md:mb-12 ${fadeClassName}`.trim()}>
        <SectionHeading
          title={title}
          subtitle={subtitle}
          titleAs="h1"
          titleClassName={titleClassName}
          compact={compact}
          expanded={expanded || Boolean(children)}
          subtitleSentenceCase={subtitleSentenceCase}
          subtitleClassName={subtitleClassName}
          className="w-full rounded-[12px] sm:rounded-[16px]"
        >
          {children && (
            <div className={`mx-auto mt-8 max-w-4xl px-2 md:px-4 ${PAGE_BODY_LEAD_CLASS}`}>{children}</div>
          )}
        </SectionHeading>
      </FadeInView>
    </section>
  );
}
