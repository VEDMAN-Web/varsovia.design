"use client";

import ListingPagination from "@/components/ui/ListingPagination";
import { COMPANY_SHELL } from "@/components/company/companyLayoutShared";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

/** Blog listing wrapper — same control as other listing pages. */
export default function BlogPagination(props: BlogPaginationProps) {
  return (
    <ListingPagination
      {...props}
      className={`${COMPANY_SHELL} flex select-none items-center justify-center gap-1.5 pb-6 pt-2 sm:gap-2 md:pb-10`}
    />
  );
}
