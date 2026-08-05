"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import FadeInView from "@/components/company/FadeInView";
import ShowcaseFilterTabs from "@/components/showcase/ShowcaseFilterTabs";
import ShowcaseProjectCard from "@/components/showcase/ShowcaseProjectCard";
import {
  SHOWCASE_CONTENT_WIDTH,
  SHOWCASE_PROJECT_GRID,
  SHOWCASE_PROJECT_GRID_WRAP,
  SHOWCASE_SECTION_SHELL,
} from "@/components/showcase/showcaseLayoutShared";
import SectionHeadingReveal from "@/components/ui/SectionHeadingReveal";
import { SECTION_HEADING_WIDE, SITE_PAGE_HERO_SECTION_PAD } from "@/components/ui/SectionShell";
import {
  buildShowcasePageNav,
  showcaseTabsForUi,
} from "@/lib/showcasePageNav";
import {
  SHOWCASE_TABS,
  getShowcaseProjects,
  mapApiShowcaseToProject,
  type ShowcaseProject,
  type ShowcaseTab,
} from "@/lib/showcaseData";
import type { Locale } from "@/lib/i18n/routing";
import { ShowcaseListingRouteSkeleton } from "@/components/ui/skeleton/routeSkeletons";
import ListingPagination from "@/components/ui/ListingPagination";
import { LISTING_PAGE_SIZE, paginateItems } from "@/lib/pagination";

function resolveActiveShowcaseTab(tabParam: string | null): ShowcaseTab {
  if (tabParam && SHOWCASE_TABS.includes(tabParam as ShowcaseTab)) {
    return tabParam as ShowcaseTab;
  }
  return "Home case";
}

function ShowcaseListingInner() {
  const locale = useLocale();
  const tShowcase = useTranslations("showcase");
  const site = useSiteSettings();
  const searchParams = useSearchParams();
  const activeTab = useMemo(
    () => resolveActiveShowcaseTab(searchParams.get("tab")),
    [searchParams],
  );
  const [apiProjects, setApiProjects] = useState<ShowcaseProject[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const pageNav = useMemo(() => buildShowcasePageNav(site, tShowcase), [site, tShowcase]);
  const filterTabs = useMemo(
    () => showcaseTabsForUi(pageNav, activeTab),
    [pageNav, activeTab],
  );

  useEffect(() => {
    import("@/lib/api").then(({ fetchShowcases }) => {
      fetchShowcases(locale as Locale)
        .then((data) => {
          if (data && data.length > 0) {
            setApiProjects(
              data.map((row) =>
                mapApiShowcaseToProject(row as Record<string, unknown>, locale as Locale),
              ),
            );
          }
        })
        .catch(() => {
          /* keep hardcoded */
        });
    });
  }, [locale]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const meta = pageNav.metaForTab(activeTab);

  const projects: ShowcaseProject[] = (() => {
    const source = apiProjects ?? null;
    if (!source) {
      return getShowcaseProjects(activeTab);
    }
    if (activeTab === "All") return source;
    return source.filter((p) => p.category === activeTab);
  })();

  const { items: pageProjects, totalPages } = useMemo(
    () => paginateItems(projects, currentPage, LISTING_PAGE_SIZE.showcase),
    [projects, currentPage],
  );

  function handlePageChange(page: number) {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f7f3f2] pt-[72px] pb-16 sm:pt-[102px] md:pb-24">
        <div className={`${SHOWCASE_SECTION_SHELL} ${SITE_PAGE_HERO_SECTION_PAD} pb-4 md:pb-8`}>
          <div className={SHOWCASE_CONTENT_WIDTH}>
            <SectionHeadingReveal
              trigger="mount"
              titleAs="h1"
              title={meta.title}
              subtitle={meta.subtitle}
              className={`${SECTION_HEADING_WIDE} !max-w-none w-full`}
            />

            <FadeInView delay={0.18} y={14}>
              <ShowcaseFilterTabs
                activeTab={activeTab}
                onTabChange={() => {}}
                tabs={filterTabs}
                labelForTab={pageNav.filterLabelForTab}
              />
            </FadeInView>

            <div ref={gridRef} className={SHOWCASE_PROJECT_GRID_WRAP}>
              <div className={SHOWCASE_PROJECT_GRID}>
                {projects.length === 0 ? (
                  <p className="col-span-full py-16 text-center font-outfit text-[#6a414d]/70">
                    {tShowcase("emptyState")}
                  </p>
                ) : (
                  pageProjects.map((project, i) => (
                    <ShowcaseProjectCard key={project.id} project={project} index={i} />
                  ))
                )}
              </div>
            </div>

            <ListingPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="flex select-none items-center justify-center gap-1.5 pb-2 pt-8 sm:gap-2 md:pt-10"
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default function ShowcaseListingPage() {
  return (
    <Suspense fallback={<ShowcaseListingRouteSkeleton />}>
      <ShowcaseListingInner />
    </Suspense>
  );
}
