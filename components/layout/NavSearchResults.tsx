"use client";

import type { ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";
import type { SearchHit, SearchResultType } from "@/lib/searchTypes";
import { SkeletonSearchResults } from "@/components/ui/skeleton";

type NavSearchResultsProps = {
  pages: SearchHit[];
  content: SearchHit[];
  loading: boolean;
  fetchError: boolean;
  apiEligible: boolean;
  showEmpty: boolean;
  query: string;
  pagesSectionLabel: string;
  contentSectionLabel: string;
  loadingLabel: string;
  partialErrorLabel: string;
  emptyLabel: string;
  typeLabel: (type: SearchResultType) => string;
  onNavigate: () => void;
  variant?: "dropdown" | "mobile";
};

function ResultRow({
  hit,
  onNavigate,
  typeLabel,
  variant,
}: {
  hit: SearchHit;
  onNavigate: () => void;
  typeLabel: string;
  variant: "dropdown" | "mobile";
}) {
  if (variant === "mobile") {
    return (
      <Link
        href={hit.href}
        prefetch
        onClick={onNavigate}
        className="flex w-full flex-col items-start border-b border-maroon/5 px-4 py-2.5 text-left last:border-0"
      >
        <span className="text-sm font-medium text-ink">{hit.title}</span>
        <span className="mt-0.5 line-clamp-2 text-xs text-muted">{hit.snippet}</span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-maroon/70">
          {typeLabel}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={hit.href}
      prefetch
      onClick={onNavigate}
      className="group relative block px-5 py-2.5 transition-all duration-300 hover:bg-[#f7f1f2]/90 hover:pl-[22px]"
    >
      <span className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-r-full bg-maroon transition-all duration-300 group-hover:h-[55%]" />
      <span className="block font-outfit text-[14px] font-medium text-ink transition-colors group-hover:text-maroon">
        {hit.title}
      </span>
      <span className="mt-0.5 block line-clamp-2 font-outfit text-[12px] text-muted">{hit.snippet}</span>
      {(hit.meta || hit.type !== "page") && (
        <span className="mt-1 block font-outfit text-[10px] font-medium uppercase tracking-wide text-maroon/65">
          {hit.meta || typeLabel}
        </span>
      )}
    </Link>
  );
}

export default function NavSearchResults({
  pages,
  content,
  loading,
  fetchError,
  apiEligible,
  showEmpty,
  query,
  pagesSectionLabel,
  contentSectionLabel,
  loadingLabel,
  partialErrorLabel,
  emptyLabel,
  typeLabel,
  onNavigate,
  variant = "dropdown",
}: NavSearchResultsProps) {
  const listClass =
    variant === "mobile"
      ? "scrollbar-brand mb-4 max-h-64 overflow-y-auto overscroll-y-contain rounded-2xl border border-maroon/10 bg-white pr-1"
      : "scrollbar-brand max-h-64 overflow-y-auto overscroll-y-contain pr-1";

  const wrap = (children: ReactNode) =>
    variant === "mobile" ? (
      <div className={listClass} data-lenis-prevent>
        {children}
      </div>
    ) : (
      <ul className={listClass} data-lenis-prevent>
        {children}
      </ul>
    );

  if (showEmpty) {
    return (
      <p className="px-5 py-6 text-center font-outfit text-sm text-muted">{emptyLabel}</p>
    );
  }

  const hasPages = pages.length > 0;
  const hasContent = content.length > 0;

  if (!hasPages && !hasContent && !loading && !fetchError) {
    return null;
  }

  return (
    <div className={variant === "dropdown" ? "py-1" : ""}>
      {fetchError && apiEligible && (
        <p className="px-5 py-2 font-outfit text-[11px] text-amber-800/90">{partialErrorLabel}</p>
      )}

      {hasPages && (
        <>
          {variant === "dropdown" && (
            <p className="px-5 pb-1 pt-2 font-outfit text-[10px] font-semibold uppercase tracking-wider text-muted">
              {pagesSectionLabel}
            </p>
          )}
          {wrap(
            pages.map((hit) =>
              variant === "mobile" ? (
                <ResultRow
                  key={hit.id}
                  hit={hit}
                  onNavigate={onNavigate}
                  typeLabel={typeLabel(hit.type)}
                  variant={variant}
                />
              ) : (
                <li key={hit.id}>
                  <ResultRow
                    hit={hit}
                    onNavigate={onNavigate}
                    typeLabel={typeLabel(hit.type)}
                    variant={variant}
                  />
                </li>
              ),
            ),
          )}
        </>
      )}

      {apiEligible && (loading || hasContent) && (
        <>
          {variant === "dropdown" && (
            <p className="px-5 pb-1 pt-3 font-outfit text-[10px] font-semibold uppercase tracking-wider text-muted">
              {contentSectionLabel}
            </p>
          )}
          {loading && !hasContent ? (
            <SkeletonSearchResults rows={4} />
          ) : (
            wrap(
              content.map((hit) =>
                variant === "mobile" ? (
                  <ResultRow
                    key={`${hit.type}-${hit.id}`}
                    hit={hit}
                    onNavigate={onNavigate}
                    typeLabel={typeLabel(hit.type)}
                    variant={variant}
                  />
                ) : (
                  <li key={`${hit.type}-${hit.id}`}>
                    <ResultRow
                      hit={hit}
                      onNavigate={onNavigate}
                      typeLabel={typeLabel(hit.type)}
                      variant={variant}
                    />
                  </li>
                ),
              ),
            )
          )}
        </>
      )}
    </div>
  );
}
