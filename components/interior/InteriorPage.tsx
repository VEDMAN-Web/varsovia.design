"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import FilterPanel from "@/components/interior/FilterPanel";
import SectionHeading from "@/components/ui/SectionHeading";
import PageShell from "@/components/ui/PageShell";
import {
  CATEGORY_HERO,
  CATEGORY_SUBCATEGORIES,
  EMPTY_FILTERS,
  INTERIOR_CATEGORIES,
  buildInteriorCatalog,
  countActiveFilters,
  SORT_OPTIONS,
  type AdvancedFilters,
  type InteriorCategory,
  type SortOption,
} from "@/lib/interiorData";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";
import type { Locale } from "@/lib/i18n/routing";

const INTERIOR_FALLBACK = MEDIA.interior[0];

const TOOLBAR_PILL =
  "inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#d4d4d4] bg-white px-3 font-outfit text-[14px] font-medium text-[#1f1f1f] outline-none transition hover:border-[#6a414d]/35 sm:h-10 sm:gap-2 sm:px-4 sm:text-[15px]";

const TOOLBAR_COUNT_CLASS = "font-normal text-[#9a9a9a]";

const GRID_FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const SUBNAV_FADE = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

type ApiProject = {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  location?: string;
  coverImage?: string;
  gallery?: string[];
  featured?: boolean;
  order?: number;
  category?: string;
  subcategory?: string;
  price?: number;
  shape?: string;
  style?: string;
  color?: string;
  material?: string;
  finish?: string;
  createdAt?: string;
  isNew?: boolean;
};

type Props = {
  initialCategory?: InteriorCategory;
};

function categoryFromQuery(value: string | null | undefined, fallback: InteriorCategory): InteriorCategory {
  if (!value) return fallback;
  const match = INTERIOR_CATEGORIES.find(
    (c) => c.toLowerCase() === decodeURIComponent(value).toLowerCase(),
  );
  return match ?? fallback;
}

function FilterIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <rect
        x="1.25"
        y="1.25"
        width="17.5"
        height="17.5"
        rx="3.75"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path
        d="M5.25 6.25h9.5M6.25 10h7.5M7.25 13.75h5.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProjectCardImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [current, setCurrent] = useState(resolveMediaUrl(src, INTERIOR_FALLBACK));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const resolved = resolveMediaUrl(src, INTERIOR_FALLBACK);
    if (resolved !== current) {
      setLoaded(false);
      setCurrent(resolved);
    }
  }, [src, current]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      decoding="async"
      className={`h-full w-full object-cover transition-[opacity,transform] duration-500 group-hover:scale-[1.03] ${
        loaded ? "opacity-100" : "opacity-0"
      } ${className}`}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (current !== INTERIOR_FALLBACK) {
          setLoaded(false);
          setCurrent(INTERIOR_FALLBACK);
        }
      }}
    />
  );
}

export default function InteriorPage({ initialCategory = "Kitchen" }: Props) {
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const tCat = useTranslations("categories");
  const tHero = useTranslations("categoryHero");
  const tSort = useTranslations("sort");
  const searchParams = useSearchParams();
  const urlCategory = useMemo(
    () => categoryFromQuery(searchParams.get("category"), initialCategory),
    [searchParams, initialCategory],
  );
  const [category, setCategory] = useState<InteriorCategory>(urlCategory);
  const [subcategory, setSubcategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("all");
  const [filters, setFilters] = useState<AdvancedFilters>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [projects, setProjects] = useState<ApiProject[]>(
    () => buildInteriorCatalog() as ApiProject[]
  );
  const [, startTransition] = useTransition();
  const sortRef = useRef<HTMLDivElement>(null);

  const subcategoryOptions = useMemo(() => {
    if (category === "All" || !CATEGORY_SUBCATEGORIES[category as Exclude<InteriorCategory, "All">]) {
      return null;
    }
    return CATEGORY_SUBCATEGORIES[category as Exclude<InteriorCategory, "All">]!;
  }, [category]);

  useEffect(() => {
    setCategory(urlCategory);
    setSubcategory("All");
    setFilters(EMPTY_FILTERS);
  }, [urlCategory]);

  useEffect(() => {
    let cancelled = false;
    import("@/lib/api").then(({ fetchProjects }) => {
      fetchProjects(locale as Locale)
        .then((data: ApiProject[]) => {
          if (!cancelled) {
            setProjects(buildInteriorCatalog(data ?? []) as ApiProject[]);
          }
        })
        .catch(() => {
          /* keep sync catalog */
        });
    });
    return () => {
      cancelled = true;
    };
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

  const categoryCount = useMemo(() => {
    return projects.filter((item) => {
      const projectCategory = item.category || "Kitchen";
      return category === "All" || projectCategory === category;
    }).length;
  }, [projects, category]);

  const items = useMemo(() => {
    let list = projects.filter((item) => {
      const projectCategory = item.category || "Kitchen";
      const catOk = category === "All" || projectCategory === category;
      const subOk =
        subcategory === "All" ||
        !subcategoryOptions ||
        (item.subcategory && item.subcategory === subcategory);
      const shapeOk =
        filters.shapes.length === 0 || (item.shape && filters.shapes.includes(item.shape));
      const subFilterOk =
        filters.subcategories.length === 0 ||
        (item.subcategory && filters.subcategories.includes(item.subcategory));
      const styleOk =
        filters.styles.length === 0 || (item.style && filters.styles.includes(item.style));
      const colorOk =
        filters.colors.length === 0 || (item.color && filters.colors.includes(item.color));
      const matOk =
        filters.materials.length === 0 ||
        (item.material && filters.materials.includes(item.material));
      const finishOk =
        filters.finishes.length === 0 ||
        (item.finish && filters.finishes.includes(item.finish));
      return catOk && subOk && shapeOk && subFilterOk && styleOk && colorOk && matOk && finishOk;
    });

    switch (sortBy) {
      case "all":
        list = [...list].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
        break;
      case "newest":
        list = [...list].sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
      case "oldest":
        list = [...list].sort(
          (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );
        break;
      case "price-high":
        list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "price-low":
        list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
    }
    return list;
  }, [projects, category, subcategory, subcategoryOptions, sortBy, filters]);

  const hero = useMemo(() => {
    const map: Record<InteriorCategory, { title: string; subtitle: string }> = {
      All: { title: tHero("allTitle"), subtitle: tHero("allSubtitle") },
      Kitchen: { title: tHero("kitchenTitle"), subtitle: tHero("kitchenSubtitle") },
      Bedroom: { title: tHero("bedroomTitle"), subtitle: tHero("bedroomSubtitle") },
      Bathroom: { title: tHero("bathroomTitle"), subtitle: tHero("bathroomSubtitle") },
      Furniture: { title: tHero("furnitureTitle"), subtitle: tHero("furnitureSubtitle") },
      "Door & Windows": { title: tHero("doorWindowsTitle"), subtitle: tHero("doorWindowsSubtitle") },
      "Whole House Solutions": { title: tHero("wholeHouseTitle"), subtitle: tHero("wholeHouseSubtitle") },
    };
    return map[category] ?? CATEGORY_HERO[category];
  }, [category, tHero]);

  const categoryLabels = useMemo(
    (): Record<InteriorCategory, string> => ({
      All: tCat("all"),
      Kitchen: tCat("kitchen"),
      Bedroom: tCat("bedroom"),
      Bathroom: tCat("bathroom"),
      Furniture: tCat("furniture"),
      "Door & Windows": tCat("doorWindows"),
      "Whole House Solutions": tCat("wholeHouse"),
    }),
    [tCat],
  );

  const sortOptions = useMemo(
    () =>
      [
        { value: "all" as SortOption, label: tSort("allOption") },
        { value: "newest" as SortOption, label: tSort("newest") },
        { value: "oldest" as SortOption, label: tSort("oldest") },
        { value: "price-high" as SortOption, label: tSort("priceHigh") },
        { value: "price-low" as SortOption, label: tSort("priceLow") },
      ] satisfies { value: SortOption; label: string }[],
    [tSort],
  );

  const activeFilterCount = countActiveFilters(filters);
  const sortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label ?? tSort("allOption");
  const gridKey = `${category}-${subcategory}-${sortBy}-${activeFilterCount}`;
  const toolbarTitleLabel =
    category === "All" ? tCommon("allInterior") : categoryLabels[category];

  function selectSubcategory(sub: string) {
    setSubcategory(sub);
  }

  return (
    <div className="bg-[#f7f3f2]">
      <section className="pt-[calc(72px+20px)] sm:pt-[calc(102px+24px)] md:pt-[calc(102px+32px)]">
        <PageShell>
          <AnimatePresence mode="wait">
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <SectionHeading
                title={hero.title}
                subtitle={hero.subtitle}
                titleAs="h1"
                subtitleSentenceCase
                className="!max-w-none w-full"
              />
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 overflow-hidden md:mt-[60px]">
            <AnimatePresence initial={false}>
              {subcategoryOptions && (
                <motion.div
                  key={`subnav-${category}`}
                  {...SUBNAV_FADE}
                  className="mt-8 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-10 [&::-webkit-scrollbar]:hidden"
                >
                  <div className="mx-auto flex w-max min-w-full items-center justify-start gap-4 md:justify-center">
                    <button
                      type="button"
                      onClick={() => selectSubcategory("All")}
                      className={`inline-flex h-11 shrink-0 items-center px-3 font-outfit text-[15px] font-normal transition-colors duration-200 ${
                        subcategory === "All"
                          ? "rounded-[6px] bg-[#6a414d] text-white"
                          : "bg-transparent text-[#6a414d]/70 hover:text-[#6a414d]"
                      }`}
                    >
                      {tCommon("allInteriorCount", { count: categoryCount })}
                    </button>
                    {subcategoryOptions.map((sub) => {
                      const active = subcategory === sub;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => selectSubcategory(sub)}
                          className={`inline-flex h-11 shrink-0 items-center px-3 font-outfit text-[15px] font-normal transition-colors duration-200 ${
                            active
                              ? "rounded-[6px] bg-[#6a414d] text-white"
                              : "bg-transparent text-[#6a414d]/70 hover:text-[#6a414d]"
                          }`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </PageShell>
      </section>

      <section className="mt-8 md:mt-10 lg:mt-12">
        <PageShell>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <p className="shrink-0 font-outfit text-[1.0625rem] font-semibold leading-none tabular-nums text-[#1f1f1f] sm:text-[1.125rem] md:text-[1.25rem] lg:text-[1.375rem]">
              {toolbarTitleLabel}
              <span className={TOOLBAR_COUNT_CLASS}>({items.length})</span>
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
                        onClick={() => {
                          setSortBy(opt.value);
                          setSortOpen(false);
                        }}
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

              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                className={`${TOOLBAR_PILL} shrink-0 justify-center sm:min-w-[112px] lg:min-w-[128px]`}
              >
                <FilterIcon className="shrink-0" />
                <span className="whitespace-nowrap">
                  {tCommon("filter")}
                  {activeFilterCount > 0 && (
                    <span className={TOOLBAR_COUNT_CLASS}> ({activeFilterCount})</span>
                  )}
                </span>
              </button>
            </div>
          </div>
        </PageShell>
      </section>

      <section className="mt-8 pb-20 md:mt-10 md:pb-28">
        <PageShell>
          <div className="min-h-[300px] sm:min-h-[420px] lg:min-h-[500px]">
            <AnimatePresence mode="wait">
              {items.length === 0 ? (
                <motion.p
                  key="empty"
                  {...GRID_FADE}
                  className="py-20 text-center font-outfit text-[#6a414d]/70"
                >
                  {tCommon("noProjectsFilter")}
                </motion.p>
              ) : (
                <motion.div
                  key={gridKey}
                  {...GRID_FADE}
                  className="grid gap-4 sm:gap-6 md:gap-[30px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {items.map((item) => (
                    <Link
                      key={item._id}
                      href={`/interior/${item._id}`}
                      className="group relative block overflow-hidden rounded-[10px] bg-[#e8e2e0]"
                      style={{ aspectRatio: "3/4" }}
                    >
                      <ProjectCardImage
                        src={resolveMediaUrl(item.coverImage, INTERIOR_FALLBACK)}
                        alt={item.title}
                      />

                      {item.isNew && (
                        <span className="absolute left-4 top-4 rounded-[4px] bg-[#cf5374] px-2.5 py-1 font-outfit text-[12px] font-medium text-white">
                          New
                        </span>
                      )}

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-4 pb-4 pt-12">
                        <h3 className="font-outfit text-[clamp(1rem,2vw,1.25rem)] font-medium leading-snug text-white drop-shadow-sm">
                          {item.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </PageShell>
      </section>

      <FilterPanel
        open={filterOpen}
        category={category}
        value={filters}
        onClose={() => setFilterOpen(false)}
        onApply={(next) => {
          startTransition(() => setFilters(next));
        }}
      />
    </div>
  );
}
