"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import FilterPanel from "@/components/interior/FilterPanel";
import SectionHeading from "@/components/ui/SectionHeading";
import PageShell from "@/components/ui/PageShell";
import {
  CATEGORY_HERO,
  CATEGORY_LABELS,
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

const TOOLBAR_PILL_BASE =
  "inline-flex h-11 items-center gap-2 rounded-[6px] border px-5 font-outfit text-[15px] font-normal outline-none transition";

/** Avoid appending active colors onto TOOLBAR_PILL ÔÇö Tailwind order can leave bg-white/text overrides winning. */
function toolbarPillClass(active = false) {
  return active
    ? `${TOOLBAR_PILL_BASE} min-w-[128px] justify-center border-[#6a414d] bg-[#6a414d] text-white hover:border-[#5a3640] hover:bg-[#5a3640]`
    : `${TOOLBAR_PILL_BASE} min-w-[128px] justify-center border-[#cfc4c6] bg-white text-[#6a414d] hover:border-[#6a414d]/40`;
}

const TOOLBAR_PILL =
  `${TOOLBAR_PILL_BASE} border-[#cfc4c6] bg-white text-[#6a414d] hover:border-[#6a414d]/40`;

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
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 4h14l-5 7v5l-4 2v-7L5 4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory = useMemo(
    () => categoryFromQuery(searchParams.get("category"), initialCategory),
    [searchParams, initialCategory],
  );
  const [category, setCategory] = useState<InteriorCategory>(urlCategory);
  const [subcategory, setSubcategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
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
      default:
        list = [...list].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
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
        { value: "newest" as SortOption, label: tSort("newest") },
        { value: "oldest" as SortOption, label: tSort("oldest") },
        { value: "price-high" as SortOption, label: tSort("priceHigh") },
        { value: "price-low" as SortOption, label: tSort("priceLow") },
      ] satisfies { value: SortOption; label: string }[],
    [tSort],
  );

  const activeFilterCount = countActiveFilters(filters);
  const sortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label ?? tSort("newest");
  const gridKey = `${category}-${subcategory}-${sortBy}-${activeFilterCount}`;

  function selectCategory(cat: InteriorCategory) {
    setCategory(cat);
    setSubcategory("All");
    setFilters(EMPTY_FILTERS);
    const query = cat === "All" ? "/interior" : `/interior?category=${encodeURIComponent(cat)}`;
    router.replace(query, { scroll: false });
  }

  function selectSubcategory(sub: string) {
    setSubcategory(sub);
  }

  return (
    <div className="bg-[#f7f3f2]">
      <section className="pt-[calc(102px+24px)] md:pt-[calc(102px+32px)]">
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

          <div className="mt-10 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-[60px] [&::-webkit-scrollbar]:hidden">
            <div className="mx-auto flex w-max min-w-full items-center justify-start gap-5 md:justify-center">
              {INTERIOR_CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => selectCategory(cat)}
                    className={`inline-flex h-11 shrink-0 items-center px-3 font-outfit text-[15px] font-normal transition-colors duration-200 md:px-3 ${
                      active
                        ? "rounded-[6px] bg-[#6a414d] text-white"
                        : "bg-transparent text-[#6a414d]/70 hover:text-[#6a414d]"
                    }`}
                  >
                    {categoryLabels[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden">
            <AnimatePresence initial={false}>
              {subcategoryOptions && (
                <motion.div
                  key={`subnav-${category}`}
                  {...SUBNAV_FADE}
                  className="mt-6 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-8 [&::-webkit-scrollbar]:hidden"
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

      <section className="mt-10 md:mt-12">
        <PageShell>
          <div className="flex min-h-11 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-outfit text-[clamp(1rem,2vw,1.375rem)] font-normal leading-none text-[#6a414d] tabular-nums">
              {tCommon("allInteriorCount", { count: items.length })}
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <div ref={sortRef} className="relative flex items-center gap-3">
                <span className="font-outfit text-[15px] font-normal text-[#6a414d]">{tCommon("sortBy")}</span>
                <button
                  type="button"
                  onClick={() => setSortOpen((open) => !open)}
                  className={`${TOOLBAR_PILL} min-w-[180px] justify-between px-5`}
                  aria-expanded={sortOpen}
                  aria-haspopup="listbox"
                >
                  <span className="truncate">{sortLabel}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-[#6a414d]/70 transition ${sortOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {sortOpen && (
                  <div
                    role="listbox"
                    className="absolute right-0 top-full z-20 mt-1 min-w-[220px] overflow-hidden rounded-[6px] border border-[#cfc4c6] bg-white py-1 shadow-lg"
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
                        className={`flex w-full px-4 py-2.5 text-left font-outfit text-[15px] transition hover:bg-[#f7f1f2] ${
                          sortBy === opt.value
                            ? "font-medium text-[#6a414d]"
                            : "font-normal text-[#6a414d]/85"
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
                className={toolbarPillClass(activeFilterCount > 0)}
              >
                <FilterIcon className="shrink-0" />
                <span>
                  {activeFilterCount > 0
                    ? tCommon("filterCount", { count: activeFilterCount })
                    : tCommon("filter")}
                </span>
              </button>
            </div>
          </div>
        </PageShell>
      </section>

      <section className="mt-8 pb-20 md:mt-10 md:pb-28">
        <PageShell>
          <div className="min-h-[420px] sm:min-h-[460px] lg:min-h-[500px]">
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
                  className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3"
                >
                  {items.map((item) => (
                    <Link
                      key={item._id}
                      href={`/interior/${item._id}`}
                      className="group relative block h-[420px] overflow-hidden rounded-[10px] bg-[#e8e2e0] sm:h-[460px] lg:h-[500px]"
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
