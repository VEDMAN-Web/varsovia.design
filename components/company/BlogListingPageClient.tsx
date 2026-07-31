"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import CompanyHero from "@/components/company/CompanyHero";
import BlogCard from "@/components/company/BlogCard";
import BlogPagination from "@/components/company/BlogPagination";
import { COMPANY_PAGE_BG, COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import { BLOG_LISTING_GRID } from "@/components/company/blogLayoutShared";
import {
  SkeletonBlogGrid,
  SkeletonListingToolbar,
  SkeletonPagination,
} from "@/components/ui/skeleton";
import { fetchBlogs } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import {
  fallbackBlogs,
  paginateBlogs,
  resolveBlogs,
  sortBlogPosts,
  type BlogPost,
  type BlogSortOption,
} from "@/lib/companyData";

import { SECTION_SUBTITLE_CLASS } from "@/components/ui/SectionHeading";

const BLOG_HERO_TITLE =
  "font-display px-2 text-balance break-words text-[clamp(1.625rem,5.5vw,3.125rem)] font-normal uppercase tracking-[0.06em] text-[#6a414d] sm:px-1 sm:tracking-[0.1em]";

const BLOG_HERO_SUBTITLE = `${SECTION_SUBTITLE_CLASS} !mt-2.5 max-w-[34rem] sm:!mt-3 sm:max-w-[42rem] md:max-w-[48rem]`;

const TOOLBAR_PILL =
  "inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#d4d4d4] bg-white px-3 font-outfit text-[14px] font-medium text-[#1f1f1f] outline-none transition hover:border-[#6a414d]/35 sm:h-10 sm:gap-2 sm:px-4 sm:text-[15px]";

const TOOLBAR_COUNT_CLASS = "font-normal text-[#9a9a9a]";

export default function BlogListingPageClient() {
  const locale = useLocale();
  const tBlog = useTranslations("blogListing");
  const tCommon = useTranslations("common");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<BlogSortOption>("all");
  const [sortOpen, setSortOpen] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetchBlogs(locale as Locale)
      .then((data) => {
        const resolved = resolveBlogs(Array.isArray(data) ? data : [], locale as Locale);
        setBlogs(resolved.length > 0 ? resolved : fallbackBlogs);
      })
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

  const sortedBlogs = useMemo(() => sortBlogPosts(blogs, sortBy), [blogs, sortBy]);

  const { items, totalPages, totalItems } = useMemo(
    () => paginateBlogs(sortedBlogs, currentPage),
    [sortedBlogs, currentPage]
  );

  const sortOptions = useMemo(
    () =>
      [
        { value: "all" as BlogSortOption, label: tBlog("sortAll") },
        { value: "newest" as BlogSortOption, label: tBlog("sortNewest") },
        { value: "oldest" as BlogSortOption, label: tBlog("sortOldest") },
      ] satisfies { value: BlogSortOption; label: string }[],
    [tBlog]
  );

  const sortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label ?? tBlog("sortAll");

  function handleSortChange(value: BlogSortOption) {
    setSortBy(value);
    setSortOpen(false);
    setCurrentPage(1);
  }

  return (
    <>
      <Navbar />
      <main className={COMPANY_PAGE_BG}>
        <CompanyHero
          title={tBlog("heroTitle")}
          subtitle={tBlog("heroSubtitle")}
          compact
          subtitleSentenceCase={false}
          titleClassName={BLOG_HERO_TITLE}
          subtitleClassName={BLOG_HERO_SUBTITLE}
        />

        {loading ? (
          <SkeletonListingToolbar />
        ) : (
          <section className={`${COMPANY_SHELL} mb-6 md:mb-8`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
              <p className="shrink-0 font-outfit text-[1.0625rem] font-semibold leading-none tabular-nums text-[#1f1f1f] sm:text-[1.125rem] md:text-[1.25rem] lg:text-[1.375rem]">
                {tBlog("allBlog")}
                <span className={TOOLBAR_COUNT_CLASS}>({totalItems})</span>
              </p>

              <div className="flex w-full items-center gap-2 sm:gap-2.5 lg:w-auto lg:shrink-0">
                <div
                  ref={sortRef}
                  className="relative flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5 lg:flex-none"
                >
                  <span className="shrink-0 whitespace-nowrap font-outfit text-[13px] font-medium text-[#1f1f1f] sm:text-[14px] md:text-[15px]">
                    {tCommon("sortBy")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSortOpen((open) => !open)}
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
                          onClick={() => handleSortChange(opt.value)}
                          className={`flex w-full px-3 py-2 text-left font-outfit text-[14px] transition hover:bg-[#f7f1f2] sm:px-4 sm:py-2.5 sm:text-[15px] ${
                            sortBy === opt.value
                              ? "font-medium text-[#1f1f1f]"
                              : "font-normal text-[#1f1f1f]/80"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <section className={`${COMPANY_SHELL} mb-8 md:mb-10`}>
          {loading ? (
            <SkeletonBlogGrid />
          ) : (
            <div className={BLOG_LISTING_GRID}>
              {items.map((blog, i) => (
                <BlogCard key={blog._id} blog={blog} index={i} />
              ))}
            </div>
          )}
        </section>

        {loading ? (
          <SkeletonPagination
            className={`${COMPANY_SHELL} flex select-none items-center justify-center gap-1.5 pb-8 pt-2 sm:gap-2 md:pb-12`}
          />
        ) : (
          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </>
  );
}
