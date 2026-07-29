"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import CompanyHero from "@/components/company/CompanyHero";
import BlogCard from "@/components/company/BlogCard";
import BlogPagination from "@/components/company/BlogPagination";
import { COMPANY_PAGE_BG, COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import { fetchBlogs } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { paginateBlogs, resolveBlogs, type BlogPost } from "@/lib/companyData";

export default function BlogListingPageClient() {
  const locale = useLocale();
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs(locale as Locale)
      .then((data) => setBlogs(resolveBlogs(Array.isArray(data) ? data : [])))
      .finally(() => setLoading(false));
  }, [locale]);

  const { items, totalPages } = useMemo(
    () => paginateBlogs(blogs, currentPage),
    [blogs, currentPage]
  );

  return (
    <>
      <Navbar />
      <main className={COMPANY_PAGE_BG}>
        <CompanyHero title="Our Blog" compact />

        <section className={`${COMPANY_SHELL} mb-12`}>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-[14px] border border-[#e5dcd3]/30 bg-[#F6EAEA]"
                >
                  <div className="aspect-[4/3] bg-[#e8dede]/60" />
                  <div className="space-y-3 p-5">
                    <div className="h-4 w-3/4 rounded bg-[#e8dede]/80" />
                    <div className="h-3 w-full rounded bg-[#e8dede]/60" />
                    <div className="h-3 w-5/6 rounded bg-[#e8dede]/60" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {items.map((blog, i) => (
                <BlogCard key={blog._id} blog={blog} index={i} />
              ))}
            </div>
          )}
        </section>

        {!loading && (
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
