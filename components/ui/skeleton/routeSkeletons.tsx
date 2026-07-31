import Navbar from "@/components/layout/Navbar";
import { COMPANY_PAGE_BG, COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import { TEAM_MAIN, TEAM_PAGE_BG, TEAM_SHELL, TEAM_STAT_GRID } from "@/components/company/teamLayoutShared";
import {
  SHOWCASE_CONTENT_WIDTH,
  SHOWCASE_SECTION_SHELL,
} from "@/components/showcase/showcaseLayoutShared";
import { CATALOGUE_CONTENT_WIDTH, CATALOGUE_SECTION_SHELL } from "@/components/catalogue/catalogueLayoutShared";
import { SECTION_HEADING_WIDE, SITE_PAGE_HERO_SECTION_PAD } from "@/components/ui/SectionShell";
import {
  SkeletonBlogGrid,
  SkeletonCatalogueGrid,
  SkeletonCompanyHeroBand,
  SkeletonHeroBandInner,
  SkeletonInteriorHero,
  SkeletonListingToolbar,
  SkeletonPagination,
  SkeletonProductGrid,
  SkeletonShowcaseFilterTabs,
  SkeletonTeamBlock,
} from "@/components/ui/skeleton/listingSkeletons";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";

export function BlogListingRouteSkeleton() {
  return (
    <>
      <Navbar />
      <main className={COMPANY_PAGE_BG}>
        <SkeletonCompanyHeroBand />
        <SkeletonListingToolbar />
        <section className={`${COMPANY_SHELL} mb-8 md:mb-10`}>
          <SkeletonBlogGrid />
        </section>
        <SkeletonPagination className={`${COMPANY_SHELL} flex select-none items-center justify-center gap-1.5 pb-8 pt-2 sm:gap-2 md:pb-12`} />
      </main>
    </>
  );
}

export function ProductsListingRouteSkeleton() {
  return (
    <>
      <Navbar />
      <main className={COMPANY_PAGE_BG}>
        <SkeletonCompanyHeroBand />
        <SkeletonListingToolbar />
        <section className={`${COMPANY_SHELL} mb-4 md:mb-6`}>
          <SkeletonProductGrid />
        </section>
        <SkeletonPagination className={`${COMPANY_SHELL} flex select-none items-center justify-center gap-1.5 pb-8 pt-2 sm:gap-2 md:pb-12`} />
      </main>
    </>
  );
}

export function TeamRouteSkeleton() {
  return (
    <>
      <Navbar />
      <main className={`${TEAM_MAIN} ${TEAM_PAGE_BG}`}>
        <SkeletonCompanyHeroBand />
        <section className={`${TEAM_SHELL} mb-[clamp(2rem,6vw,5rem)]`}>
          <Skeleton className="mx-auto h-20 max-w-[820px]" />
        </section>
        <section className={`${TEAM_SHELL} mb-[clamp(2.5rem,7vw,6rem)] max-w-[min(100%,920px)]`}>
          <div className={TEAM_STAT_GRID}>
            <Skeleton className="h-[7.5rem] rounded-[12px] sm:rounded-[16px]" />
            <Skeleton className="h-[7.5rem] rounded-[12px] sm:rounded-[16px]" />
          </div>
        </section>
        <div className={TEAM_SHELL}>
          <SkeletonTeamBlock members={3} />
          <SkeletonTeamBlock members={3} />
        </div>
      </main>
    </>
  );
}

export function ShowcaseListingRouteSkeleton() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f7f3f2] pt-[72px] pb-16 sm:pt-[102px] md:pb-24">
        <div className={`${SHOWCASE_SECTION_SHELL} ${SITE_PAGE_HERO_SECTION_PAD} pb-4 md:pb-8`}>
          <div className={SHOWCASE_CONTENT_WIDTH}>
            <SkeletonHeroBandInner className={`${SECTION_HEADING_WIDE} !max-w-none w-full`} />
            <SkeletonShowcaseFilterTabs />
            <div className="mt-10">
              <SkeletonProductGrid variant="showcase" />
            </div>
            <SkeletonPagination className="flex select-none items-center justify-center gap-1.5 pb-2 pt-8 sm:gap-2 md:pt-10" />
          </div>
        </div>
      </main>
    </>
  );
}

export function CatalogueListingRouteSkeleton() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f7f3f2] pt-[72px] pb-16 sm:pt-[102px] md:pb-24">
        <div className={`${CATALOGUE_SECTION_SHELL} ${SITE_PAGE_HERO_SECTION_PAD}`}>
          <div className={CATALOGUE_CONTENT_WIDTH}>
            <SkeletonCompanyHeroBand />
            <div className="mt-12 md:mt-16">
              <SkeletonCatalogueGrid />
            </div>
            <SkeletonPagination />
          </div>
        </div>
      </main>
    </>
  );
}

export function InteriorListingBodySkeleton() {
  return (
    <main className="min-h-screen bg-[#f7f3f2]">
      <SkeletonInteriorHero />
      <section className="mt-12 pb-28">
        <div className={COMPANY_SHELL}>
          <SkeletonProductGrid count={6} />
        </div>
      </section>
    </main>
  );
}

export function InteriorListingRouteSkeleton() {
  return (
    <>
      <Navbar />
      <InteriorListingBodySkeleton />
    </>
  );
}
