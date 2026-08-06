"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import CompanyHero from "@/components/company/CompanyHero";
import FadeInView from "@/components/company/FadeInView";
import TeamStatCard from "@/components/company/TeamStatCard";
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
import { resolveTeamMembers, type TeamMember } from "@/lib/companyData";
import { resolveMediaUrl, MEDIA } from "@/lib/mediaAssets";
import { DEFAULT_SITE_IMAGE_PATHS } from "@/lib/defaultSiteImages";
import { getLocaleOrDefault } from "@/lib/i18n/messageCatalog";
import { pickSiteCopy } from "@/lib/i18n/pickLocalized";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import ListingPagination from "@/components/ui/ListingPagination";
import { SkeletonPagination, SkeletonTeamMemberGrid } from "@/components/ui/skeleton";
import { LISTING_PAGE_SIZE, paginateItems } from "@/lib/pagination";

const TEAM_PORTRAIT_FALLBACK = MEDIA.about[0];

const TEAM_HERO_TITLE =
  "font-display px-2 text-balance break-words text-[clamp(1.625rem,5.5vw,3.125rem)] font-normal uppercase tracking-[0.06em] text-[#6a414d] sm:px-1 sm:tracking-[0.1em]";

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
  const site = useSiteSettings();
  const [designTeam, setDesignTeam] = useState<TeamMember[]>([]);
  const [architectTeam, setArchitectTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [toolHover, setToolHover] = useState<number | null>(null);
  const [designPage, setDesignPage] = useState(1);
  const [architectPage, setArchitectPage] = useState(1);

  const designTools = useMemo(() => {
    const fromCms = site?.designTools;
    if (Array.isArray(fromCms) && fromCms.length > 0) {
      return fromCms.map((tool, i) => ({
        name: tool.name || DEFAULT_SITE_IMAGE_PATHS.designTools[i]?.name || `Tool ${i + 1}`,
        image: resolveMediaUrl(
          tool.image,
          DEFAULT_SITE_IMAGE_PATHS.designTools[i]?.image ?? DEFAULT_SITE_IMAGE_PATHS.designTools[0].image,
        ),
      }));
    }
    return DEFAULT_SITE_IMAGE_PATHS.designTools.map((tool) => ({
      name: tool.name,
      image: tool.image,
    }));
  }, [site?.designTools]);

  const copy = useMemo(() => {
    const tp = site?.teamPage as Record<string, unknown> | undefined;
    const loc = getLocaleOrDefault(locale as Locale);
    const pick = (value: unknown, fallback: string) =>
      pickSiteCopy(value, loc, fallback) || fallback;
    return {
      heroTitle: pick(tp?.heroTitle, t("heroTitle")),
      heroSubtitle: pick(tp?.heroSubtitle, t("heroSubtitle")),
      intro: pick(tp?.intro, t("intro")),
      designTitle: pick(tp?.designTitle, t("designTitle")),
      designEyebrow: pick(tp?.designEyebrow, t("designEyebrow")),
      designBody: pick(tp?.designBody, t("designBody")),
      architectTitle: pick(tp?.architectTitle, t("architectTitle")),
      architectEyebrow: pick(tp?.architectEyebrow, t("architectEyebrow")),
      architectBody: pick(tp?.architectBody, t("architectBody")),
      toolsTitle: pick(tp?.toolsTitle, t("toolsTitle")),
      toolsBody: pick(tp?.toolsBody, t("toolsBody")),
    };
  }, [site?.teamPage, t, locale]);

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

  const stats = useMemo(() => {
    const fromCms = site?.teamPage?.stats;
    const loc = getLocaleOrDefault(locale as Locale);
    if (Array.isArray(fromCms) && fromCms.length >= 2) {
      return [
        {
          value: pickSiteCopy(fromCms[0]?.value, loc, t("statProjectsValue")) || t("statProjectsValue"),
          label: pickSiteCopy(fromCms[0]?.label, loc, t("statProjectsLabel")) || t("statProjectsLabel"),
          variant: "projects" as const,
        },
        {
          value: pickSiteCopy(fromCms[1]?.value, loc, t("statYearsValue")) || t("statYearsValue"),
          label: pickSiteCopy(fromCms[1]?.label, loc, t("statYearsLabel")) || t("statYearsLabel"),
          variant: "years" as const,
        },
      ];
    }
    return [
      { value: t("statProjectsValue"), label: t("statProjectsLabel"), variant: "projects" as const },
      { value: t("statYearsValue"), label: t("statYearsLabel"), variant: "years" as const },
    ];
  }, [site?.teamPage?.stats, t, locale]);

  return (
    <>
      <Navbar />
      <main className={`${TEAM_MAIN} ${TEAM_PAGE_BG}`}>
        <CompanyHero
          title={copy.heroTitle}
          subtitle={copy.heroSubtitle}
          compact
          subtitleSentenceCase={false}
          titleClassName={TEAM_HERO_TITLE}
          subtitleClassName={TEAM_HERO_SUBTITLE}
          sectionClassName="!pb-[clamp(1rem,3vw,1.5rem)]"
        />

        <section className={`${TEAM_SHELL} mb-[clamp(2rem,6vw,5rem)]`}>
          <FadeInView delay={0.05}>
            <p className={TEAM_INTRO_CLASS}>{copy.intro}</p>
          </FadeInView>
        </section>

        <section className={`${TEAM_SHELL} ${TEAM_STAT_SECTION}`}>
          <div className={TEAM_STAT_GRID}>
            {stats.map((stat, i) => (
              <TeamStatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                variant={stat.variant}
                delay={i * 0.08}
              />
            ))}
          </div>
        </section>

        <div className={TEAM_SHELL}>
          <TeamBlock title={copy.designTitle} eyebrow={copy.designEyebrow} body={copy.designBody}>
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

          <TeamBlock title={copy.architectTitle} eyebrow={copy.architectEyebrow} body={copy.architectBody}>
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
              <h2 className={TEAM_TOOLS_TITLE}>{copy.toolsTitle}</h2>
              <p className={TEAM_TOOLS_BODY}>{copy.toolsBody}</p>
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
