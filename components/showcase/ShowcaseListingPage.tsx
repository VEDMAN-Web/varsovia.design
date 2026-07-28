"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ShowcaseFilterTabs from "@/components/showcase/ShowcaseFilterTabs";
import ShowcaseProjectCard from "@/components/showcase/ShowcaseProjectCard";
import {
  SHOWCASE_CONTENT_WIDTH,
  SHOWCASE_PROJECT_GRID,
  SHOWCASE_SECTION_SHELL,
} from "@/components/showcase/showcaseLayoutShared";
import SectionHeading from "@/components/ui/SectionHeading";
import { SECTION_HEADING_WIDE } from "@/components/ui/SectionShell";
import {
  SHOWCASE_CATEGORY_META,
  SHOWCASE_TABS,
  getShowcaseProjects,
  type ShowcaseProject,
  type ShowcaseTab,
} from "@/lib/showcaseData";

type ApiShowcase = {
  _id: string;
  title: string;
  category: string;
  image: string;
  location: string;
  typeLabel: string;
  typeValue: string;
  supplyArea: string;
  gallery: string[];
  order: number;
};

/** Convert API document to the ShowcaseProject shape the card components expect */
function toShowcaseProject(s: ApiShowcase): ShowcaseProject {
  return {
    id: s._id,
    title: s.title,
    category: (SHOWCASE_TABS.includes(s.category as ShowcaseTab)
      ? s.category
      : "Home case") as ShowcaseTab,
    image: s.image || "/Interior-kitchen/kitchen1.png",
    location: s.location || "",
    typeLabel: s.typeLabel || "Type",
    typeValue: s.typeValue || "",
    supplyArea: s.supplyArea || "",
    gallery: s.gallery?.length ? s.gallery : [s.image || "/Interior-kitchen/kitchen1.png"],
  };
}

function ShowcaseListingInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("Home case");
  const [apiProjects, setApiProjects] = useState<ShowcaseProject[] | null>(null);

  // Sync tab from URL
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && SHOWCASE_TABS.includes(tabParam as ShowcaseTab)) {
      setActiveTab(tabParam as ShowcaseTab);
    } else {
      setActiveTab("Home case");
    }
  }, [searchParams]);

  // Fetch from API once on mount
  useEffect(() => {
    import("@/lib/api").then(({ fetchShowcases }) => {
      fetchShowcases()
        .then((data) => {
          if (data && data.length > 0) {
            setApiProjects(data.map(toShowcaseProject));
          }
          // null → keep using hardcoded fallback
        })
        .catch(() => {/* keep hardcoded */});
    });
  }, []);

  const meta = SHOWCASE_CATEGORY_META[activeTab];

  // Filter by active tab — works for both API and hardcoded data
  const projects: ShowcaseProject[] = (() => {
    const source = apiProjects ?? null;
    if (!source) {
      return getShowcaseProjects(activeTab);
    }
    if (activeTab === "All") return source;
    return source.filter((p) => p.category === activeTab);
  })();

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen pt-[72px] pb-16 md:pb-24">
        <div className={`${SHOWCASE_SECTION_SHELL} pt-10 md:pt-14`}>
          <div className={SHOWCASE_CONTENT_WIDTH}>
            <SectionHeading
              titleAs="h1"
              title={meta.title}
              subtitle={meta.subtitle}
              className={`${SECTION_HEADING_WIDE} mb-10 md:mb-12`}
            />

            <ShowcaseFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className={SHOWCASE_PROJECT_GRID}>
              {projects.length === 0 ? (
                <p className="col-span-full py-16 text-center font-outfit text-[#6a414d]/60">
                  No showcase projects found for this category.
                </p>
              ) : (
                projects.map((project) => (
                  <ShowcaseProjectCard key={project.id} project={project} />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ShowcaseListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream pt-[72px]" />}>
      <ShowcaseListingInner />
    </Suspense>
  );
}
