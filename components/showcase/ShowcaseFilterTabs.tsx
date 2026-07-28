"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SHOWCASE_TABS, type ShowcaseTab } from "@/lib/showcaseData";

type ShowcaseFilterTabsProps = {
  activeTab: ShowcaseTab;
  onTabChange: (tab: ShowcaseTab) => void;
};

export default function ShowcaseFilterTabs({ activeTab, onTabChange }: ShowcaseFilterTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function selectTab(tab: ShowcaseTab) {
    onTabChange(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "Home case") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const query = params.toString();
    router.replace(query ? `/showcase?${query}` : "/showcase", { scroll: false });
  }

  return (
    <div className="mb-10 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mb-12 [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto flex w-max min-w-full flex-wrap items-center justify-start gap-3 md:justify-center md:gap-5">
        {SHOWCASE_TABS.map((tab) => {
          const active = activeTab === tab;
          const label = tab === "All" ? "Show all" : tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => selectTab(tab)}
              className={`inline-flex h-11 shrink-0 items-center px-3 font-outfit text-[15px] font-normal transition md:px-4 ${
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
