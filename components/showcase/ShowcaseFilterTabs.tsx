"use client";

import { useRouter } from "@/lib/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { SHOWCASE_TABS, type ShowcaseTab } from "@/lib/showcaseData";

type ShowcaseFilterTabsProps = {
  activeTab: ShowcaseTab;
  onTabChange: (tab: ShowcaseTab) => void;
  tabs: ShowcaseTab[];
  labelForTab: (tab: ShowcaseTab) => string;
};

export default function ShowcaseFilterTabs({
  activeTab,
  onTabChange,
  tabs,
  labelForTab,
}: ShowcaseFilterTabsProps) {
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
    <div className="mt-8 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-10 md:mb-10 [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto flex w-max min-w-full items-center justify-start gap-4 md:justify-center">
        {tabs.map((tab) => {
          const active = activeTab === tab;
          const label = labelForTab(tab);

          return (
            <button
              key={tab}
              type="button"
              onClick={() => selectTab(tab)}
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
