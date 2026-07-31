"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Award, CheckCircle2, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import CompanyHero from "@/components/company/CompanyHero";
import FadeInView from "@/components/company/FadeInView";
import {
  TEAM_BLOCK_INNER,
  TEAM_BLOCK_SPACING,
  TEAM_HERO_SUBTITLE,
  TEAM_INTRO_CLASS,
  TEAM_MAIN,
  TEAM_MEMBER_CARD,
  TEAM_MEMBER_GRID,
  TEAM_MEMBER_INFO,
  TEAM_MEMBER_NAME,
  TEAM_MEMBER_ROLE,
  TEAM_PAGE_BG,
  TEAM_SECTION_BODY,
  TEAM_SECTION_EYEBROW,
  TEAM_SECTION_TITLE,
  TEAM_SHELL,
  TEAM_STAT_CARD,
  TEAM_STAT_GRID,
  TEAM_STAT_SECTION,
  TEAM_TOOL_CARD_ACTIVE,
  TEAM_TOOL_CARD_BASE,
  TEAM_TOOL_CARD_IDLE,
  TEAM_TOOL_ICON_GLOW,
  TEAM_TOOL_ICON_WRAP,
  TEAM_TOOLS_BODY,
  TEAM_TOOLS_GRID,
  TEAM_TOOLS_TITLE,
} from "@/components/company/teamLayoutShared";
import { fetchTeamMembers } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { resolveTeamMembers, designTools, type TeamMember } from "@/lib/companyData";
import { resolveMediaUrl, MEDIA } from "@/lib/mediaAssets";
import ListingPagination from "@/components/ui/ListingPagination";
import { SkeletonPagination, SkeletonTeamMemberGrid } from "@/components/ui/skeleton";
import { LISTING_PAGE_SIZE, paginateItems } from "@/lib/pagination";

const TEAM_PORTRAIT_FALLBACK = MEDIA.about[0];

const TEAM_HERO_TITLE =
  "font-display px-2 text-balance break-words text-[clamp(1.625rem,5.5vw,3.125rem)] font-normal uppercase tracking-[0.06em] text-[#6a414d] sm:px-1 sm:tracking-[0.1em]";

const STAT_WATERMARKS = [CheckCircle2, Award] as const;

function DesignToolCard({
  name,
  image,
  index,
  emphasized,
  onHover,
  onLeave,
}: {
  name: string;
  image: string;
  index: number;
  emphasized: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <FadeInView delay={index * 0.06}>
      <div className="h-full min-w-0">
        <motion.div
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          className={`${TEAM_TOOL_CARD_BASE} ${emphasized ? TEAM_TOOL_CARD_ACTIVE : TEAM_TOOL_CARD_IDLE}`}
        >
          <div
            className={TEAM_TOOL_ICON_WRAP}
            style={{ background: TEAM_TOOL_ICON_GLOW }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=""
              className="h-11 w-11 object-contain sm:h-12 sm:w-12"
              draggable={false}
            />
          </div>
          <p className="w-full px-1 text-center font-outfit text-[clamp(0.75rem,2vw,0.875rem)] font-bold uppercase tracking-[0.05em] text-[#1f1f1f] sm:text-sm">
            {name}
          </p>
          <span
            className={`mt-3 h-[3px] rounded-full bg-[#cf5374] transition-all duration-300 ease-out ${
              emphasized ? "w-[min(52%,4.75rem)]" : "w-4"
            }`}
            aria-hidden
          />
        </motion.div>
      </div>
    </FadeInView>
  );
}

function TeamStatCard({
  value,
  label,
  watermark: Watermark,
  delay = 0,
}: {
  value: string;
  label: string;
  watermark: typeof CheckCircle2;
  delay?: number;
}) {
  return (
    <FadeInView delay={delay}>
      <div className={`${TEAM_STAT_CARD} px-[clamp(1rem,3vw,2rem)] py-[clamp(1.25rem,3.5vw,2.5rem)]`}>
        <Watermark
          className="pointer-events-none absolute -right-1 bottom-0 top-1/2 hidden h-[70%] w-auto -translate-y-1/2 text-[#6a414d]/[0.07] min-[400px]:block sm:right-2 sm:h-[78%]"
          strokeWidth={1}
          aria-hidden
        />
        <div className="relative z-[1] flex min-w-0 items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#cf5374]/18 text-[#cf5374] min-[480px]:h-12 min-[480px]:w-12 sm:h-14 sm:w-14">
            <Users className="h-5 w-5 min-[480px]:h-[22px] min-[480px]:w-[22px]" strokeWidth={1.75} aria-hidden />
          </div>
          <div
            className="mx-[clamp(0.75rem,3vw,1.5rem)] h-10 w-px shrink-0 bg-[#dcc8cc]/90 min-[480px]:h-11 sm:h-12"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="font-display text-[clamp(1.625rem,5vw,2.75rem)] font-bold leading-none tracking-wide text-[#6a414d]">
              {value}
            </p>
            <p className="mt-2 text-pretty font-outfit text-[clamp(0.75rem,2.2vw,0.9375rem)] font-normal leading-snug text-[#6a414d]/88">
              {label}
            </p>
          </div>
        </div>
      </div>
    </FadeInView>
  );
}

function TeamMemberPortraitCard({ member, index }: { member: TeamMember; index: number }) {
  const [src, setSrc] = useState(resolveMediaUrl(member.image, TEAM_PORTRAIT_FALLBACK));

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className={TEAM_MEMBER_CARD}
    >
      <div className="overflow-hidden bg-[#e8e2e0]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={member.name}
          className="aspect-[3/4] w-full object-cover object-top"
          onError={() => setSrc(TEAM_PORTRAIT_FALLBACK)}
        />
      </div>
      <div className={TEAM_MEMBER_INFO}>
        <p className={TEAM_MEMBER_ROLE}>{member.role}</p>
        <p className={TEAM_MEMBER_NAME}>{member.name}</p>
      </div>
    </motion.article>
  );
}

function TeamBlock({
  title,
  eyebrow,
  body,
  children,
}: {
  title: string;
  eyebrow: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <section className={TEAM_BLOCK_SPACING}>
      <FadeInView>
        <h2 className={TEAM_SECTION_TITLE}>{title}</h2>
        <p className={`mt-2 ${TEAM_SECTION_EYEBROW}`}>{eyebrow}</p>
        <p className={`mt-[clamp(1rem,3vw,1.25rem)] ${TEAM_SECTION_BODY}`}>{body}</p>
      </FadeInView>
      <div className={TEAM_BLOCK_INNER}>{children}</div>
    </section>
  );
}

export default function TeamPageClient() {
  const locale = useLocale();
  const t = useTranslations("teamPage");
  const [designTeam, setDesignTeam] = useState<TeamMember[]>([]);
  const [architectTeam, setArchitectTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [toolHover, setToolHover] = useState<number | null>(null);
  const [designPage, setDesignPage] = useState(1);
  const [architectPage, setArchitectPage] = useState(1);

  useEffect(() => {
    fetchTeamMembers(locale as Locale)
      .then((data) => {
        const resolved = resolveTeamMembers(Array.isArray(data) ? data : [], locale as Locale);
        setDesignTeam(resolved.designTeam);
        setArchitectTeam(resolved.architectTeam);
      })
      .finally(() => setLoading(false));
  }, [locale]);

  const { items: designPageItems, totalPages: designTotalPages } = useMemo(
    () => paginateItems(designTeam, designPage, LISTING_PAGE_SIZE.team),
    [designTeam, designPage],
  );

  const { items: architectPageItems, totalPages: architectTotalPages } = useMemo(
    () => paginateItems(architectTeam, architectPage, LISTING_PAGE_SIZE.team),
    [architectTeam, architectPage],
  );

  const stats = [
    { value: t("statProjectsValue"), label: t("statProjectsLabel"), watermark: STAT_WATERMARKS[0] },
    { value: t("statYearsValue"), label: t("statYearsLabel"), watermark: STAT_WATERMARKS[1] },
  ] as const;

  return (
    <>
      <Navbar />
      <main className={`${TEAM_MAIN} ${TEAM_PAGE_BG}`}>
        <CompanyHero
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
          compact
          subtitleSentenceCase={false}
          titleClassName={TEAM_HERO_TITLE}
          subtitleClassName={TEAM_HERO_SUBTITLE}
          sectionClassName="!pb-[clamp(1rem,3vw,1.5rem)]"
        />

        <section className={`${TEAM_SHELL} mb-[clamp(2rem,6vw,5rem)]`}>
          <FadeInView delay={0.05}>
            <p className={TEAM_INTRO_CLASS}>{t("intro")}</p>
          </FadeInView>
        </section>

        <section className={`${TEAM_SHELL} ${TEAM_STAT_SECTION}`}>
          <div className={TEAM_STAT_GRID}>
            {stats.map((stat, i) => (
              <TeamStatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                watermark={stat.watermark}
                delay={i * 0.08}
              />
            ))}
          </div>
        </section>

        <div className={TEAM_SHELL}>
          <TeamBlock title={t("designTitle")} eyebrow={t("designEyebrow")} body={t("designBody")}>
            <div className={TEAM_MEMBER_GRID}>
              {loading ? (
                <SkeletonTeamMemberGrid count={3} />
              ) : (
                designPageItems.map((member, i) => (
                  <TeamMemberPortraitCard key={member._id} member={member} index={i} />
                ))
              )}
            </div>
            {loading ? (
              <SkeletonPagination className="flex select-none items-center justify-center gap-1.5 pb-2 pt-8 sm:gap-2" />
            ) : (
              <ListingPagination
                currentPage={designPage}
                totalPages={designTotalPages}
                onPageChange={setDesignPage}
                className="flex select-none items-center justify-center gap-1.5 pb-2 pt-8 sm:gap-2"
              />
            )}
          </TeamBlock>

          <TeamBlock title={t("architectTitle")} eyebrow={t("architectEyebrow")} body={t("architectBody")}>
            <div className={TEAM_MEMBER_GRID}>
              {loading ? (
                <SkeletonTeamMemberGrid count={3} />
              ) : (
                architectPageItems.map((member, i) => (
                  <TeamMemberPortraitCard key={member._id} member={member} index={i} />
                ))
              )}
            </div>
            {loading ? (
              <SkeletonPagination className="flex select-none items-center justify-center gap-1.5 pb-2 pt-8 sm:gap-2" />
            ) : (
              <ListingPagination
                currentPage={architectPage}
                totalPages={architectTotalPages}
                onPageChange={setArchitectPage}
                className="flex select-none items-center justify-center gap-1.5 pb-2 pt-8 sm:gap-2"
              />
            )}
          </TeamBlock>

          <section className="pb-[clamp(0.5rem,2vw,1rem)]">
            <FadeInView>
              <h2 className={TEAM_TOOLS_TITLE}>{t("toolsTitle")}</h2>
              <p className={TEAM_TOOLS_BODY}>{t("toolsBody")}</p>
            </FadeInView>
            <div className={TEAM_TOOLS_GRID}>
              {designTools.map((tool, i) => (
                <DesignToolCard
                  key={tool.name}
                  name={tool.name}
                  image={tool.image}
                  index={i}
                  emphasized={toolHover === i}
                  onHover={() => setToolHover(i)}
                  onLeave={() => setToolHover(null)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
