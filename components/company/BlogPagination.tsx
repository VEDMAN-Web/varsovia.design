"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { COMPANY_SHELL } from "@/components/company/companyLayoutShared";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function buildPageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, "ellipsis", total];
  }
  if (current >= total - 2) {
    return [1, "ellipsis", total - 2, total - 1, total];
  }
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

export default function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageItems(currentPage, totalPages);

  const navBtn =
    "inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#6a414d] transition hover:bg-[#f4ebec] disabled:cursor-not-allowed disabled:opacity-35 sm:h-10 sm:w-10";

  const pageBtn = (active: boolean) =>
    `inline-flex h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center rounded-[6px] px-2 font-outfit text-[14px] font-medium transition sm:h-10 sm:min-w-10 sm:text-[15px] ${
      active
        ? "bg-[#6a414d] text-white shadow-[0_2px_8px_rgba(106,65,77,0.25)]"
        : "text-[#6a414d] hover:bg-[#f4ebec]"
    }`;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`${COMPANY_SHELL} flex select-none items-center justify-center gap-1.5 pb-6 pt-2 sm:gap-2 md:pb-10`}
      aria-label="Blog pagination"
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={navBtn}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} strokeWidth={2} aria-hidden />
      </button>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 font-outfit text-[14px] font-medium text-[#6a414d] sm:text-[15px]"
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={pageBtn(page === currentPage)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={navBtn}
        aria-label="Next page"
      >
        <ChevronRight size={18} strokeWidth={2} aria-hidden />
      </button>
    </motion.section>
  );
}
