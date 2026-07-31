"use client";

import { Suspense, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ShowcaseFilterTabs from "@/components/showcase/ShowcaseFilterTabs";
import ShowcaseProjectCard from "@/components/showcase/ShowcaseProjectCard";
import {
  SHOWCASE_CONTENT_WIDTH,
  SHOWCASE_PROJECT_GRID,
  SHOWCASE_PROJECT_GRID_WRAP,
  SHOWCASE_SECTION_SHELL,
} from "@/components/showcase/showcaseLayoutShared";
import SectionHeading from "@/components/ui/SectionHeading";
import { SECTION_HEADING_WIDE, SITE_PAGE_HERO_SECTION_PAD } from "@/components/ui/SectionShell";
import { showcaseTabMessageKey } from "@/lib/showcaseTabI18n";
import {
  SHOWCASE_TABS,
  getShowcaseProjects,
  type ShowcaseProject,
  type ShowcaseTab,
} from "@/lib/showcaseData";
import { pickLocalized } from "@/lib/i18n/pickLocalized";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";
import type { Locale } from "@/lib/i18n/routing";

type ApiShowcase = {
  _id: string;
  title: unknown;
  category: string;
  image: string;
  location: unknown;
  typeLabel: unknown;
  typeValue: unknown;
  supplyArea: unknown;
  gallery: string[];
  order: number;
};

function toShowcaseProject(s: ApiShowcase, locale: Locale): ShowcaseProject {
  const loc = locale === "pl" || locale === "th" ? locale : "en";
  return {
    id: s._id,
    title: pickLocalized(s.title, loc) || String(s.title ?? ""),
    category: (SHOWCASE_TABS.includes(s.category as ShowcaseTab)
      ? s.category
      : "Home case") as ShowcaseTab,
    image: resolveMediaUrl(s.image, MEDIA.interior[0]),
    location: pickLocalized(s.location, loc) || String(s.location ?? ""),
    typeLabel: pickLocalized(s.typeLabel, loc) || String(s.typeLabel ?? "Type"),
    typeValue: pickLocalized(s.typeValue, loc) || String(s.typeValue ?? ""),
    supplyArea: pickLocalized(s.supplyArea, loc) || String(s.supplyArea ?? ""),
    gallery: s.gallery?.length
      ? s.gallery.map((url) => resolveMediaUrl(url, MEDIA.interior[0]))
      : [resolveMediaUrl(s.image, MEDIA.interior[0])],
  };
}

function ShowcaseListingInner() {
  const locale = useLocale();
  const tShowcase = useTranslations("showcase");
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("Home case");
  const [apiProjects, setApiProjects] = useState<ShowcaseProject[] | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && SHOWCASE_TABS.includes(tabParam as ShowcaseTab)) {
      setActiveTab(tabParam as ShowcaseTab);
    } else {
      setActiveTab("Home case");
    }
  }, [searchParams]);

  useEffect(() => {
    import("@/lib/api").then(({ fetchShowcases }) => {
      fetchShowcases(locale as Locale)
        .then((data) => {
          if (data && data.length > 0) {
            setApiProjects(data.map((row) => toShowcaseProject(row as ApiShowcase, locale as Locale)));
          }
        })
        .catch(() => {
          /* keep hardcoded */
        });
    });
  }, [locale]);

  const tabKey = showcaseTabMessageKey(activeTab);
  const meta = {
    title: tShowcase(`categoryMeta.${tabKey}.title`),
    subtitle: tShowcase(`categoryMeta.${tabKey}.subtitle`),
  };

  const projects: ShowcaseProject[] = (() => {
    const source = apiProjects ?? null;
    if (!source) {
      return getShowcaseProjects(activeTab);
    }
    if (activeTab === "All") return source;
    return source.filter((p) => p.category === activeTab);
  })();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f7f3f2] pt-[72px] pb-16 sm:pt-[102px] md:pb-24">
        <div className={`${SHOWCASE_SECTION_SHELL} ${SITE_PAGE_HERO_SECTION_PAD} pb-4 md:pb-8`}>
          <div className={SHOWCASE_CONTENT_WIDTH}>
            <SectionHeading
              titleAs="h1"
              title={meta.title}
              subtitle={meta.subtitle}
              className={`${SECTION_HEADING_WIDE} !max-w-none w-full`}
            />

            <ShowcaseFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className={SHOWCASE_PROJECT_GRID_WRAP}>
              <div className={SHOWCASE_PROJECT_GRID}>
                {projects.length === 0 ? (
                  <p className="col-span-full py-16 text-center font-outfit text-[#6a414d]/70">
                    {tShowcase("emptyState")}
                  </p>
                ) : (
                  projects.map((project, i) => (
                    <ShowcaseProjectCard key={project.id} project={project} index={i} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ShowcaseListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f3f2] pt-[72px]" />}>
      <ShowcaseListingInner />
    </Suspense>
  );
}
