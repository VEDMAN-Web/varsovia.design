"use client";

import { useRouter } from "@/lib/i18n/navigation";
import { useSearchParams } from "next/navigation";
import type { InteriorCategory } from "@/lib/interiorData";

type InteriorCategoryTabsProps = {
  activeCategory: InteriorCategory;
  onCategoryChange: (category: InteriorCategory) => void;
  categories: InteriorCategory[];
  labelForCategory: (category: InteriorCategory) => string;
};

export default function InteriorCategoryTabs({
  activeCategory,
  onCategoryChange,
  categories,
  labelForCategory,
}: InteriorCategoryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function selectCategory(category: InteriorCategory) {
    onCategoryChange(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    const query = params.toString();
    router.replace(query ? `/interior?${query}` : "/interior", { scroll: false });
  }

  return (
    <div className="mt-6 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-8 [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto flex w-max min-w-full items-center justify-start gap-4 md:justify-center">
        {categories.map((category) => {
          const active = activeCategory === category;
          const label = labelForCategory(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => selectCategory(category)}
              className={`inline-flex h-11 shrink-0 items-center px-3 font-outfit text-[15px] font-normal transition-colors duration-200 md:px-4 ${
                active
                  ? "rounded-[6px] bg-[#6a414d] text-white"
                  : "bg-transparent text-[#6a414d]/70 hover:text-[#6a414d]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
