"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import FilterPanel from "@/components/interior/FilterPanel";
import {
  CATEGORY_HERO,
  EMPTY_FILTERS,
  INTERIOR_CATEGORIES,
  INTERIOR_ITEMS,
  countActiveFilters,
  filterAndSortItems,
  type AdvancedFilters,
  type InteriorCategory,
  type SortOption,
} from "@/lib/interiorData";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
];

type Props = {
  initialCategory?: InteriorCategory;
};

export default function InteriorPage({ initialCategory = "Kitchen" }: Props) {
  const router = useRouter();
  const [category, setCategory] = useState<InteriorCategory>(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("all");
  const [filters, setFilters] = useState<AdvancedFilters>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  const items = useMemo(
    () => filterAndSortItems(INTERIOR_ITEMS, category, sortBy, filters),
    [category, sortBy, filters]
  );

  const hero = CATEGORY_HERO[category];
  const activeFilterCount = countActiveFilters(filters);

  function selectCategory(cat: InteriorCategory) {
    setCategory(cat);
    const query = cat === "All" ? "/interior" : `/interior?category=${encodeURIComponent(cat)}`;
    router.replace(query, { scroll: false });
  }

  return (
    <div className="bg-[#f7f3f2]">
      {/* Hero Section with spacious padding and colors */}
      <section className="px-4 pb-8 pt-28 md:px-8 md:pb-10 md:pt-36">
        <div
          className="mx-auto max-w-[1240px] px-6 py-16 text-center md:px-14 md:py-24 rounded-[16px] bg-[#F4EBEC]/50"
        >
          <h1 className="font-display text-[clamp(2.2rem,5vw,3.2rem)] font-medium tracking-[0.06em] text-[#5c3d46] uppercase">
            {hero.title}
          </h1>
          <p className="mt-4 text-[clamp(0.7rem,2vw,0.85rem)] font-medium tracking-[0.24em] text-[#e85d8a] uppercase leading-relaxed">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Category Tabs: Scrollable on mobile, plain text except active */}
      <section className="section-pad mx-auto max-w-[1200px] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex flex-row items-center gap-2 md:gap-3 whitespace-nowrap min-w-max pb-2 justify-start md:justify-center">
          {INTERIOR_CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => selectCategory(cat)}
                className={`px-4 py-2 text-[0.82rem] font-semibold transition md:text-[0.9rem] ${
                  active
                    ? "bg-[#5c3d46] text-white rounded-[4px]"
                    : "bg-transparent text-[#5c3d46]/70 hover:text-[#5c3d46]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Content Header: All Blog and Filter button */}
      <section className="section-pad mx-auto mt-8 max-w-[1200px] md:mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.95rem] text-[#5c3d46] font-semibold">
            All Blog<span className="text-[#5c3d46]/70">({category === "Kitchen" && activeFilterCount === 0 ? 24 : items.length})</span>
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-[#5c3d46] font-medium">
              <span>Short by :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-md border border-[#d6d0d0] bg-white px-3 py-2 text-sm text-[#5c3d46] outline-none transition focus:border-[#5c3d46] cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition cursor-pointer ${
                activeFilterCount > 0
                  ? "border-[#5c3d46] bg-[#5c3d46] text-white"
                  : "border-[#d6d0d0] bg-white text-[#5c3d46] hover:border-[#5c3d46]/50"
              }`}
            >
              Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Product Grid: Portrait Cards aspect-[3/4] */}
      <section className="section-pad mx-auto mt-8 max-w-[1200px] pb-20 md:mt-10 md:pb-28">
        {items.length === 0 ? (
          <p className="py-20 text-center text-[#5c3d46]/70 font-medium">
            No interiors found for this filter.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/interior/${item.id}`}
                className="group relative overflow-hidden rounded-[14px] bg-[#e8e2e0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] block cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  {item.isNew && (
                    <span className="absolute left-3 top-3 rounded-sm bg-[#e8a0ad] px-2.5 py-1 text-[0.7rem] font-medium text-white shadow-sm">
                      New
                    </span>
                  )}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pb-5 pt-20">
                    <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-[#e8a0ad] uppercase">
                      {item.category}
                    </p>
                    <h3 className="mt-1 text-[1.15rem] font-semibold text-white md:text-[1.25rem]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[0.82rem] leading-5 text-white/85 font-medium">
                      {item.description}
                    </p>
                    <span className="mt-3.5 block h-[2px] w-10 bg-[#e8a0ad]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <FilterPanel
        open={filterOpen}
        value={filters}
        onClose={() => setFilterOpen(false)}
        onApply={setFilters}
      />
    </div>
  );
}
