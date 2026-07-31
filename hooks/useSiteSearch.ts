"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fetchSearch } from "@/lib/api";
import type { GroupedSearchResults, SearchHit, StaticSearchPage } from "@/lib/searchTypes";
import type { Locale } from "@/lib/i18n/routing";

const DEBOUNCE_MS = 300;
const MIN_API_QUERY_LEN = 2;

function filterStaticPages(pages: StaticSearchPage[], query: string, emptyLimit: number) {
  const q = query.trim().toLowerCase();
  if (!q) return pages.slice(0, emptyLimit);
  return pages.filter(
    (page) =>
      page.title.toLowerCase().includes(q) || page.description.toLowerCase().includes(q),
  );
}

function staticToHits(pages: StaticSearchPage[]): SearchHit[] {
  return pages.map((page, index) => ({
    type: "page" as const,
    id: `static-${index}-${page.href}`,
    title: page.title,
    snippet: page.description,
    href: page.href,
  }));
}

function dedupeAgainstPages(content: SearchHit[], pages: SearchHit[]) {
  const hrefs = new Set(pages.map((p) => p.href.split("?")[0]));
  return content.filter((hit) => !hrefs.has(hit.href.split("?")[0]));
}

export function useSiteSearch(query: string, staticPages: StaticSearchPage[], locale: Locale) {
  const [contentHits, setContentHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const trimmed = query.trim();
  const apiEligible = trimmed.length >= MIN_API_QUERY_LEN;

  const grouped = useMemo((): GroupedSearchResults => {
    const pages = staticToHits(filterStaticPages(staticPages, query, 5));
    const content = dedupeAgainstPages(contentHits, pages);
    return { pages, content };
  }, [staticPages, query, contentHits]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    if (!apiEligible) {
      setContentHits([]);
      setLoading(false);
      setFetchError(false);
      return;
    }

    setLoading(true);
    setFetchError(false);

    debounceRef.current = setTimeout(() => {
      const ac = new AbortController();
      abortRef.current = ac;

      fetchSearch(trimmed, locale, ac.signal)
        .then((data) => {
          if (ac.signal.aborted) return;
          setContentHits(Array.isArray(data.results) ? data.results : []);
          setFetchError(false);
        })
        .catch(() => {
          if (ac.signal.aborted) return;
          setContentHits([]);
          setFetchError(true);
        })
        .finally(() => {
          if (!ac.signal.aborted) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [trimmed, locale, apiEligible]);

  const totalCount = grouped.pages.length + grouped.content.length;
  const showEmpty = apiEligible && !loading && totalCount === 0 && !fetchError;

  return {
    grouped,
    loading,
    fetchError,
    apiEligible,
    showEmpty,
    totalCount,
  };
}
