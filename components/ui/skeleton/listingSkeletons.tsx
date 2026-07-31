import {
  BLOG_CARD_IMAGE_ASPECT,
  BLOG_CARD_ROUNDED,
  BLOG_LISTING_GRID,
} from "@/components/company/blogLayoutShared";
import { TEAM_MEMBER_CARD, TEAM_MEMBER_GRID } from "@/components/company/teamLayoutShared";
import { COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import { SECTION_BLOCK_GRADIENT } from "@/components/ui/SectionHeading";
import { SECTION_HEADING_WIDE, SITE_PAGE_HERO_SECTION_PAD } from "@/components/ui/SectionShell";
import {
  SHOWCASE_LISTING_GRID,
  SHOWCASE_LISTING_GRID_WRAP,
} from "@/components/ui/showcaseGridShared";
import { CATALOGUE_CARD_ASPECT, CATALOGUE_CARD_SLOT, CATALOGUE_NOTEBOOK_GRID } from "@/components/catalogue/catalogueLayoutShared";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";

export function SkeletonPagination({
  className = "flex select-none items-center justify-center gap-1.5 pb-6 pt-2 sm:gap-2 md:pb-10",
}: {
  className?: string;
}) {
  return (
    <div aria-hidden className={className}>
      <Skeleton className="h-9 w-9 shrink-0 rounded-[6px] sm:h-10 sm:w-10" />
      <Skeleton className="h-9 w-9 shrink-0 rounded-[8px] sm:h-10 sm:w-10" />
      <Skeleton className="h-9 w-9 shrink-0 rounded-[8px] sm:h-10 sm:w-10" />
      <Skeleton className="h-9 w-9 shrink-0 rounded-[8px] sm:h-10 sm:w-10" />
      <Skeleton className="h-9 w-9 shrink-0 rounded-[6px] sm:h-10 sm:w-10" />
    </div>
  );
}

export function SkeletonListingToolbar() {
  return (
    <section className={`${COMPANY_SHELL} mb-6 md:mb-8`} aria-hidden>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <Skeleton className="h-7 w-36 sm:h-8 sm:w-40" />
        <div className="flex w-full items-center gap-2 sm:gap-2.5 lg:w-auto lg:shrink-0">
          <Skeleton className="hidden h-5 w-14 sm:block" />
          <Skeleton className="h-9 min-w-0 flex-1 rounded-[8px] sm:h-10 sm:min-w-[112px] sm:flex-none lg:min-w-[128px]" />
        </div>
      </div>
    </section>
  );
}

export function SkeletonHeroBandInner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`mx-auto flex w-full min-h-[120px] flex-col items-center justify-center rounded-[12px] px-6 pt-12 pb-10 sm:min-h-[140px] sm:rounded-[16px] md:min-h-[200px] md:pt-14 ${className}`.trim()}
      style={{ background: SECTION_BLOCK_GRADIENT }}
    >
      <Skeleton className="h-9 w-[min(100%,18rem)] sm:h-10 md:h-12 md:w-80" />
      <Skeleton className="mt-6 h-4 w-[min(100%,14rem)] sm:mt-8 sm:h-5 sm:w-72 md:w-96" />
    </div>
  );
}

export function SkeletonCompanyHeroBand() {
  return (
    <section className={`${COMPANY_SHELL} ${SITE_PAGE_HERO_SECTION_PAD}`} aria-hidden>
      <SkeletonHeroBandInner className={SECTION_HEADING_WIDE} />
    </section>
  );
}

export function SkeletonBlogCard() {
  return (
    <div className={`flex h-full min-w-0 flex-col overflow-hidden ${BLOG_CARD_ROUNDED} border border-[#e5dcd3]/25 bg-[#f6eaea]/80`}>
      <Skeleton className={`${BLOG_CARD_IMAGE_ASPECT} w-full rounded-none`} />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-[78%]" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[88%]" />
        <Skeleton className="mt-4 h-[2px] w-16 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonBlogGrid({ count = 6 }: { count?: number }) {
  return (
    <div className={BLOG_LISTING_GRID} aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBlogCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonProductCard({ variant = "interior" }: { variant?: "interior" | "showcase" | "home" }) {
  const rounded =
    variant === "home" ? "rounded-[16px] sm:rounded-[22px]" : variant === "showcase" ? "rounded-[14px]" : "rounded-[10px]";
  return (
    <Skeleton
      className={`aspect-[3/4] min-h-[224px] w-full ${rounded} sm:min-h-0`}
    />
  );
}

export function SkeletonProductGrid({ count = 6, variant = "interior" }: { count?: number; variant?: "interior" | "showcase" | "home" }) {
  return (
    <div className={SHOWCASE_LISTING_GRID_WRAP} aria-busy="true" aria-label="Loading">
      <div className={SHOWCASE_LISTING_GRID}>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonProductCard key={i} variant={variant} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTeamMemberCard() {
  return (
    <div className={TEAM_MEMBER_CARD} aria-hidden>
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <Skeleton className="-mt-10 mx-[clamp(0.875rem,4vw,1.5rem)] h-[4.75rem] rounded-[8px]" />
    </div>
  );
}

export function SkeletonTeamMemberGrid({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonTeamMemberCard key={i} />
      ))}
    </>
  );
}

export function SkeletonTeamBlock({ members = 3 }: { members?: number }) {
  return (
    <div className="mb-[clamp(2.5rem,8vw,7rem)]" aria-hidden>
      <Skeleton className="h-7 w-48 max-w-full" />
      <Skeleton className="mt-2 h-4 w-32" />
      <Skeleton className="mt-4 h-16 w-full max-w-xl" />
      <div className="mt-[clamp(2rem,5vw,3.5rem)]">
      <div className={TEAM_MEMBER_GRID} aria-busy="true">
        {Array.from({ length: members }).map((_, i) => (
          <SkeletonTeamMemberCard key={i} />
        ))}
      </div>
        <SkeletonPagination className="flex select-none items-center justify-center gap-1.5 pb-2 pt-8 sm:gap-2" />
      </div>
    </div>
  );
}

export function SkeletonShowcaseFilterTabs() {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-[5.5rem] rounded-[6px] sm:h-11 sm:w-28" />
      ))}
    </div>
  );
}

export function SkeletonCatalogueCard() {
  return (
    <div className={CATALOGUE_CARD_SLOT} aria-hidden>
      <Skeleton className={`${CATALOGUE_CARD_ASPECT} w-full rounded-[4px]`} />
      <Skeleton className="mx-auto mt-4 h-4 w-2/3" />
    </div>
  );
}

export function SkeletonCatalogueGrid({ count = 6 }: { count?: number }) {
  return (
    <div className={CATALOGUE_NOTEBOOK_GRID} aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCatalogueCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonSearchResults({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-0 py-1" aria-busy="true" aria-label="Loading search">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2 px-5 py-2.5">
          <Skeleton className="h-4 w-[72%]" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonInteriorHero() {
  return (
    <section className="pt-[calc(102px+24px)] md:pt-[calc(102px+32px)]" aria-hidden>
      <div className={`${COMPANY_SHELL} mx-auto max-w-3xl space-y-4`}>
        <Skeleton className="mx-auto h-10 w-72 max-w-full" />
        <Skeleton className="mx-auto h-5 w-full max-w-xl" />
      </div>
      <div className={`${COMPANY_SHELL} mt-10 flex flex-wrap justify-center gap-3`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-28 rounded-[6px]" />
        ))}
      </div>
    </section>
  );
}
