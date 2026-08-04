"use client";

import { Award, CheckCircle2, Users } from "lucide-react";
import FadeInView from "@/components/company/FadeInView";
import { TEAM_STAT_CARD, TEAM_STAT_CARD_OVERLAY } from "@/components/company/teamLayoutShared";

export type TeamStatVariant = "projects" | "years";

type TeamStatCardProps = {
  value: string;
  label: string;
  variant: TeamStatVariant;
  delay?: number;
};

/**
 * Figma Our team — Frame 2147205602 (1040×183)
 * Each card: 490×183, inner row at x=29 y=30 (123px tall), gap 30px, icon 66×66.
 * Watermarks: card1 Group @ (400,36) 112×112; card2 @ (423,27) 93×130 (clip overflow).
 */
function StatWatermark({ variant }: { variant: TeamStatVariant }) {
  if (variant === "projects") {
    return (
      <CheckCircle2
        className="pointer-events-none absolute right-[-22px] top-[36px] z-0 h-[112px] w-[112px] text-[#6a414d]/10 max-lg:right-[-12px] max-lg:top-[28px] max-lg:h-[88px] max-lg:w-[88px]"
        strokeWidth={1}
        aria-hidden
      />
    );
  }
  return (
    <Award
      className="pointer-events-none absolute right-[-26px] top-[27px] z-0 h-[112px] w-[80px] text-[#6a414d]/10 max-lg:right-[-10px] max-lg:top-[22px] max-lg:h-[88px] max-lg:w-[64px]"
      strokeWidth={1}
      aria-hidden
    />
  );
}

function StatLeadingIcon({ variant }: { variant: TeamStatVariant }) {
  const Icon = variant === "projects" ? Users : Award;
  return (
    <div className="flex size-[66px] shrink-0 items-center justify-center rounded-full bg-[#cf5374]/[0.12] text-[#cf5374]/70">
      <Icon className="size-[31px]" strokeWidth={1.75} aria-hidden />
    </div>
  );
}

export default function TeamStatCard({ value, label, variant, delay = 0 }: TeamStatCardProps) {
  return (
    <FadeInView delay={delay} className="w-full lg:flex-1 lg:max-w-[490px]">
      <article className={`${TEAM_STAT_CARD} box-border min-h-[183px] lg:min-h-[183px]`}>
        <div className={TEAM_STAT_CARD_OVERLAY} aria-hidden />
        <StatWatermark variant={variant} />

        {/* pr reserves ~96px for Figma watermark (starts ~423px on 490px card) */}
        <div className="relative z-10 box-border flex w-full items-center gap-[30px] px-[29px] py-[30px] lg:min-h-[183px] lg:pr-[22px]">
          <StatLeadingIcon variant={variant} />
          <div className="h-[123px] w-px shrink-0 self-center bg-[#dcc8cc]/90 max-lg:h-20" aria-hidden />
          <div className="flex min-w-0 flex-1 flex-col gap-[10px] pr-[72px] sm:pr-[80px] lg:pr-[88px]">
            <div className="flex flex-col items-start">
              <p className="font-outfit text-[clamp(2rem,4.5vw,3.125rem)] font-normal leading-[1.76] text-[#6a414d] lg:min-h-[83px] lg:text-[50px]">
                {value}
              </p>
              <span className="mt-0 block h-[2px] w-14 shrink-0 bg-[#6a414d]" aria-hidden />
            </div>
            <p className="text-pretty font-outfit text-[clamp(0.875rem,1.9vw,1.125rem)] font-light leading-[1.45] text-[#251b1e] lg:text-[18px] lg:leading-[1.35]">
              {label}
            </p>
          </div>
        </div>
      </article>
    </FadeInView>
  );
}
