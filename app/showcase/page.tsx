"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Showcase tabs
const TABS = [
  "All",
  "Home case",
  "North America",
  "South America",
  "Africa",
  "Commercial Project",
  "Europe",
  "Australia",
  "Middle East",
  "Asia",
] as const;

type TabType = typeof TABS[number];

export default function ShowcaseListingPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("Home case");

  // Read query tab on mount / change
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && TABS.includes(tabParam as TabType)) {
      setActiveTab(tabParam as TabType);
    }
  }, [searchParams]);

  // Dynamically generate projects based on active tab to show the exact same 6-card layout for all
  function getProjectsForTab(tab: TabType) {
    if (tab === "All") {
      return [
        { id: "home-case-1", title: "Custom Dark Wood Grain Cabinetry Project in Czech Republic, USA", category: "Home case" },
        { id: "home-case-2", title: "Custom Dark Wood Grain Cabinetry Project in Czech Republic, Canada", category: "Home case" },
        { id: "home-case-3", title: "Custom Dark Wood Grain Cabinetry Project in Czech Republic", category: "Home case" },
        { id: "commercial-project-1", title: "Custom Dark Wood Grain Cabinetry Project in Czech Republic, USA", category: "Commercial Project" },
        { id: "commercial-project-2", title: "Custom Dark Wood Grain Cabinetry Project in Czech Republic, Canada", category: "Commercial Project" },
        { id: "commercial-project-3", title: "White Kitchen with Peninsula Project in Nairobi, Kenya", category: "Commercial Project" },
      ].map((p) => ({ ...p, image: "/showcase/showcase.png" }));
    }

    return Array.from({ length: 6 }, (_, i) => {
      let title = `Custom Dark Wood Grain Cabinetry Project in Czech Republic, ${tab}`;
      if (tab === "Commercial Project" && i === 2) {
        title = `White Kitchen with Peninsula Project in Nairobi, Kenya`;
      }
      return {
        id: `${tab.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`,
        title,
        category: tab,
        image: "/showcase/showcase.png",
      };
    });
  }

  const filteredProjects = getProjectsForTab(activeTab);

  // Dynamic header titles based on tab selection
  let headingTitle = activeTab;
  let headingSubtitle = "SPACES DESIGNED TO INSPIRE";

  if (activeTab === "Commercial Project") {
    headingSubtitle = "TRANSFORMING COMMERCIAL SPACES WITH PURPOSE";
  } else if (activeTab === "All") {
    headingTitle = "SHOWCASE";
    headingSubtitle = "EXPLORE OUR AWARD-WINNING PORTFOLIO";
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#f7f3f2] pt-[72px] pb-20 md:pb-28 min-h-screen">
        {/* 1. Hero Header */}
        <section className="px-4 pb-8 pt-10 md:px-8 md:pb-10 md:pt-16">
          <div
            className="mx-auto max-w-[1240px] px-6 py-16 text-center md:px-14 md:py-24 rounded-[16px] bg-[#F4EBEC]/50 mb-8 md:mb-12"
          >
            <h1 className="font-display text-[clamp(2.2rem,5vw,3.2rem)] font-medium tracking-[0.06em] text-[#5c3d46] uppercase">
              {headingTitle}
            </h1>
            <p className="mt-4 text-[clamp(0.7rem,2vw,0.85rem)] font-medium tracking-[0.24em] text-[#e85d8a] uppercase leading-relaxed">
              {headingSubtitle}
            </p>
          </div>
        </section>

        {/* 2. Horizontal Category Tabs */}
        <section className="section-pad mx-auto max-w-[1240px] px-4 mb-10 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2.5 pb-2 min-w-max border-b border-[#e5dcd3]/60">
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition select-none cursor-pointer ${
                    active
                      ? "bg-[#5c3d42] text-white"
                      : "text-[#5c3d42]/70 hover:bg-[#F4EBEC] hover:text-[#5c3d42]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Projects Grid */}
        <section className="section-pad mx-auto max-w-[1240px] px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/showcase/${project.id}`}
                className="group relative aspect-[4/3] rounded-[14px] overflow-hidden shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/30 flex flex-col justify-end p-5 cursor-pointer"
              >
                {/* Background cover image */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-103"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Card text details overlay */}
                <div className="relative z-10 text-white select-none">
                  {/* Decorative indicator bar */}
                  <div className="w-8 h-0.5 bg-[#e85d8a] mb-3 group-hover:w-16 transition-all duration-300" />
                  <h3 className="text-sm font-semibold tracking-wide leading-snug max-w-[90%]">
                    {project.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer
        bio="Transforming homes with thoughtfully designed interiors that feel timeless, warm, and uniquely yours."
        phone="+91 98765 43210"
        email="hello@Varsoviadesign.in"
        address="SG Highway, Ahmedabad, Gujarat 380015"
      />
    </>
  );
}
