"use client";

import { motion } from "framer-motion";
import { COMPANY_SHELL } from "@/components/company/companyLayoutShared";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`${COMPANY_SHELL} flex select-none items-center justify-center gap-2 pb-4`}
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#5c3d42]/60 transition hover:bg-[#F4EBEC] disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Previous page"
      >
        &lt;
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-xs font-bold transition ${
            page === currentPage
              ? "bg-[#5c3d42] text-white shadow-[0_4px_12px_rgba(92,61,66,0.25)]"
              : "text-[#5c3d42]/70 hover:bg-[#F4EBEC]"
          }`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#5c3d42]/60 transition hover:bg-[#F4EBEC] disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Next page"
      >
        &gt;
      </button>
    </motion.section>
  );
}
