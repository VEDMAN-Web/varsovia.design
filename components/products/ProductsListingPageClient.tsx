"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import CompanyHero from "@/components/company/CompanyHero";
import { COMPANY_PAGE_BG, COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import SectionHeading, { SECTION_SUBTITLE_CLASS } from "@/components/ui/SectionHeading";
import ShowcaseProductCard from "@/components/ui/ShowcaseProductCard";
import ListingPagination from "@/components/ui/ListingPagination";
import {
  SkeletonListingToolbar,
  SkeletonPagination,
  SkeletonProductGrid,
} from "@/components/ui/skeleton";
import {
  SHOWCASE_LISTING_GRID,
  SHOWCASE_LISTING_GRID_WRAP,
} from "@/components/ui/showcaseGridShared";
import { fetchProducts } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { LISTING_PAGE_SIZE, paginateItems } from "@/lib/pagination";
import { MEDIA } from "@/lib/mediaAssets";
import { fallbackHomeData } from "@/lib/fallbackData";

type ProductRow = {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  image?: string;
  category?: string;
  order?: number;
};

type ProductSort = "all" | "newest" | "oldest";

const HERO_TITLE =
  "font-display px-2 text-balance break-words text-[clamp(1.625rem,5.5vw,3.125rem)] font-normal uppercase tracking-[0.06em] text-[#6a414d] sm:px-1 sm:tracking-[0.1em]";

const HERO_SUBTITLE = `${SECTION_SUBTITLE_CLASS} !mt-2.5 max-w-[34rem] sm:!mt-3 sm:max-w-[42rem] md:max-w-[48rem]`;

const TOOLBAR_PILL =
  "inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#d4d4d4] bg-white px-3 font-outfit text-[14px] font-medium text-[#1f1f1f] outline-none transition hover:border-[#6a414d]/35 sm:h-10 sm:gap-2 sm:px-4 sm:text-[15px]";

const TOOLBAR_COUNT_CLASS = "font-normal text-[#9a9a9a]";

const FALLBACK: ProductRow[] = fallbackHomeData.products.map((p) => ({
  _id: p._id,
  title: p.title,
  slug: p.slug,
  description: p.description,
  image: p.image,
  category: p.category,
  order: "order" in p && typeof p.order === "number" ? p.order : undefined,
}));

function sortProducts(list: ProductRow[], sortBy: ProductSort): ProductRow[] {
  const byOrder = [...list].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  if (sortBy === "all") return byOrder;
  if (sortBy === "newest") return [...byOrder].reverse();
  return byOrder;
}

export default function ProductsListingPageClient() {
  const locale = useLocale();
  const t = useTranslations("productsListing");
  const tCommon = useTranslations("common");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<ProductSort>("all");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetchProducts(locale as Locale)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(
            data.map((p: ProductRow & { _id?: string }) => ({
              _id: p._id || p.slug || p.title,
              title: p.title,
              slug: p.slug,
              description: p.description,
              image: p.image,
              category: p.category,
              order: p.order,
            })),
          );
        } else {
          setProducts(FALLBACK);
        }
      })
      .catch(() => setProducts(FALLBACK))
      .finally(() => setLoading(false));
  }, [locale]);

  useEffect(() => {
    if (!sortOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [sortOpen]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  const sorted = useMemo(() => sortProducts(products, sortBy), [products, sortBy]);

  const { items, totalPages, totalItems } = useMemo(
    () => paginateItems(sorted, currentPage, LISTING_PAGE_SIZE.products),
    [sorted, currentPage],
  );

  const sortOptions = useMemo(
    () =>
      [
        { value: "all" as ProductSort, label: t("sortAll") },
        { value: "newest" as ProductSort, label: t("sortNewest") },
        { value: "oldest" as ProductSort, label: t("sortOldest") },
      ] satisfies { value: ProductSort; label: string }[],
    [t],
  );

  const sortLabel = sortOptions.find((o) => o.value === sortBy)?.label ?? t("sortAll");

  function handlePageChange(page: number) {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <Navbar />
      <main className={COMPANY_PAGE_BG}>
        <CompanyHero
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
          compact
          subtitleSentenceCase={false}
          titleClassName={HERO_TITLE}
          subtitleClassName={HERO_SUBTITLE}
        />

        {loading ? (
          <SkeletonListingToolbar />
        ) : (
          <section className={`${COMPANY_SHELL} mb-6 md:mb-8`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
              <p className="shrink-0 font-outfit text-[1.0625rem] font-semibold leading-none tabular-nums text-[#1f1f1f] sm:text-[1.125rem] md:text-[1.25rem] lg:text-[1.375rem]">
                {t("allProducts")}
                <span className={TOOLBAR_COUNT_CLASS}>({totalItems})</span>
              </p>

              <div ref={sortRef} className="relative flex w-full items-center gap-2 sm:gap-2.5 lg:w-auto lg:shrink-0">
                <span className="shrink-0 whitespace-nowrap font-outfit text-[13px] font-medium text-[#1f1f1f] sm:text-[14px] md:text-[15px]">
                  {tCommon("sortBy")}
                </span>
                <button
                  type="button"
                  onClick={() => setSortOpen((o) => !o)}
                  className={`${TOOLBAR_PILL} min-w-0 flex-1 justify-between sm:min-w-[112px] sm:flex-none lg:min-w-[128px]`}
                  aria-expanded={sortOpen}
                  aria-haspopup="listbox"
                >
                  <span className="truncate">{sortLabel}</span>
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    className={`shrink-0 text-[#1f1f1f]/70 transition sm:h-[15px] sm:w-[15px] ${sortOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {sortOpen && (
                  <div
                    role="listbox"
                    className="absolute left-0 top-[calc(100%+6px)] z-20 w-full min-w-[200px] overflow-hidden rounded-[8px] border border-[#d4d4d4] bg-white py-1 shadow-lg sm:left-auto sm:right-0 sm:w-[220px]"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={sortBy === opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setSortOpen(false);
                        }}
                        className={`flex w-full px-3 py-2 text-left font-outfit text-[14px] transition hover:bg-[#f7f1f2] sm:px-4 sm:py-2.5 sm:text-[15px] ${
                          sortBy === opt.value ? "font-medium text-[#1f1f1f]" : "font-normal text-[#1f1f1f]/80"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <section ref={gridRef} className={`${COMPANY_SHELL} mb-4 md:mb-6`}>
          {loading ? (
            <SkeletonProductGrid />
          ) : (
            <div className={SHOWCASE_LISTING_GRID_WRAP}>
              <div className={SHOWCASE_LISTING_GRID}>
                {items.map((product, i) => {
                  const slug = product.slug || product._id;
                  return (
                    <ShowcaseProductCard
                      key={product._id}
                      index={i}
                      variant="interior"
                      title={product.title}
                      description={product.description}
                      image={product.image}
                      imageFallback={MEDIA.products[i % MEDIA.products.length]}
                      href={`/product/${slug}`}
                      category={product.category}
                      motionVariant="mount"
                    />
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {loading ? (
          <SkeletonPagination
            className={`${COMPANY_SHELL} flex select-none items-center justify-center gap-1.5 pb-8 pt-2 sm:gap-2 md:pb-12`}
          />
        ) : (
          <ListingPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className={`${COMPANY_SHELL} flex select-none items-center justify-center gap-1.5 pb-8 pt-2 sm:gap-2 md:pb-12`}
          />
        )}
      </main>
    </>
  );
}
