"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { buildPageItems } from "@/lib/pagination";

export type ListingPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Overrides default translated aria-label for the nav region */
  ariaLabel?: string;
};

const DEFAULT_WRAP =
  "flex select-none items-center justify-center gap-1.5 pb-6 pt-2 sm:gap-2 md:pb-10";

export default function ListingPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = DEFAULT_WRAP,
  ariaLabel,
}: ListingPaginationProps) {
  const t = useTranslations("common");

  if (totalPages <= 1) return null;

  const pages = buildPageItems(currentPage, totalPages);

  const navBtn =
    "inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#6a414d] transition hover:bg-[#f4ebec] disabled:cursor-not-allowed disabled:opacity-35 sm:h-10 sm:w-10";

  const pageBtn = (active: boolean) =>
    `inline-flex h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center rounded-[8px] px-2 font-outfit text-[14px] font-medium transition sm:h-10 sm:min-w-10 sm:text-[15px] ${
      active
        ? "bg-[#6a414d] text-white shadow-[0_2px_8px_rgba(106,65,77,0.25)]"
        : "text-[#1f1f1f] hover:bg-[#f4ebec]"
    }`;

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={className}
      aria-label={ariaLabel ?? t("paginationNavLabel")}
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={navBtn}
        aria-label={t("paginationPrev")}
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
        ),
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={navBtn}
        aria-label={t("paginationNext")}
      >
        <ChevronRight size={18} strokeWidth={2} aria-hidden />
      </button>
    </motion.nav>
  );
}
