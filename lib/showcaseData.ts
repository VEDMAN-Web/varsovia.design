export const SHOWCASE_TABS = [
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

export type ShowcaseTab = (typeof SHOWCASE_TABS)[number];

/** Figma sidebar copy — title band subtitle per category */
export const SHOWCASE_CATEGORY_META: Record<
  ShowcaseTab,
  { title: string; subtitle: string }
> = {
  All: {
    title: "Our Showcase",
    subtitle: "Every Space, Every Story",
  },
  "Home case": {
    title: "Home case",
    subtitle: "Spaces Designed to Inspire",
  },
  "North America": {
    title: "North America",
    subtitle: "Bold Design, Modern Living",
  },
  "South America": {
    title: "South America",
    subtitle: "Vibrant Spaces, Warm Character",
  },
  Africa: {
    title: "Africa",
    subtitle: "Rooted in Culture, Rich in Design",
  },
  "Commercial Project": {
    title: "Commercial Project",
    subtitle: "Where Function Meets Vision",
  },
  Europe: {
    title: "Europe",
    subtitle: "Timeless Elegance, Refined Living",
  },
  Australia: {
    title: "Australia",
    subtitle: "Light-Filled Spaces, Effortless Style",
  },
  "Middle East": {
    title: "Middle East",
    subtitle: "Luxury Rooted in Tradition",
  },
  Asia: {
    title: "Asia",
    subtitle: "Harmony of Space and Serenity",
  },
};

export type ShowcaseProject = {
  id: string;
  title: string;
  category: ShowcaseTab;
  image: string;
  location: string;
  typeLabel: string;
  typeValue: string;
  supplyArea: string;
  gallery: string[];
};

const FALLBACK_IMAGES = [
  "/Interior-kitchen/kitchen1.png",
  "/Interior-kitchen/kitchen2.png",
  "/home/featured-project/feature-1.jpg",
  "/home/featured-project/feature-2.jpg",
  "/home/featured-project/feature-3.jpg",
  "/home/featured-project/feature-4.jpg",
];

function slugifyTab(tab: ShowcaseTab) {
  if (tab === "All") return "all";
  return tab.toLowerCase().replace(/\s+/g, "-");
}

const SLUG_TO_TAB: Record<string, ShowcaseTab> = {
  "home-case": "Home case",
  "north-america": "North America",
  "south-america": "South America",
  africa: "Africa",
  "commercial-project": "Commercial Project",
  europe: "Europe",
  australia: "Australia",
  "middle-east": "Middle East",
  asia: "Asia",
  all: "All",
};

function buildProjectsForTab(tab: ShowcaseTab): ShowcaseProject[] {
  const titles: Partial<Record<ShowcaseTab, string[]>> = {
    "Commercial Project": [
      "Custom Dark Wood Grain Cabinetry Project in Czech Republic, USA",
      "Custom Dark Wood Grain Cabinetry Project in Czech Republic, Canada",
      "White Kitchen with Peninsula Project in Nairobi, Kenya",
      "Commercial Office Kitchen Fit-Out in Dubai, UAE",
      "Hospitality Kitchen Supply in Singapore",
      "Multi-Unit Apartment Kitchen Project in Berlin, Germany",
    ],
  };

  return Array.from({ length: 6 }, (_, i) => {
    const id = `${slugifyTab(tab)}-${i + 1}`;
    const defaultTitle = `Custom Dark Wood Grain Cabinetry Project in Czech Republic, ${tab}`;
    const title = titles[tab]?.[i] ?? defaultTitle;

    let location = "California, USA";
    let typeLabel = "Type";
    let typeValue = "Villa(1 Floor)";
    let supplyArea = "Kitchen, entrance, bedrooms";

    if (tab === "Home case") {
      location = i === 1 ? "Ontario, Canada" : "California, USA";
      typeValue = i === 1 ? "Apartment(2 Floor)" : "Villa(1 Floor)";
    } else if (tab === "Commercial Project") {
      location =
        i === 2
          ? "Nairobi, Kenya"
          : i === 1
            ? "Ontario, Canada"
            : i === 3
              ? "Dubai, UAE"
              : "California, USA";
      typeLabel = i === 2 ? "Quantity" : "Type";
      typeValue = i === 2 ? "70 Units" : i === 1 ? "Apartment Complex" : "Commercial Office";
      supplyArea = i === 2 ? "Kitchen, Wardrobes" : "Kitchen, Bathroom, Wardrobe";
    } else if (tab !== "All") {
      location = tab;
    }

    const image = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
    const gallery = [
      image,
      FALLBACK_IMAGES[(i + 1) % FALLBACK_IMAGES.length],
      FALLBACK_IMAGES[(i + 2) % FALLBACK_IMAGES.length],
      FALLBACK_IMAGES[(i + 3) % FALLBACK_IMAGES.length],
      FALLBACK_IMAGES[(i + 4) % FALLBACK_IMAGES.length],
    ];

    return {
      id,
      title,
      category: tab,
      image,
      location,
      typeLabel,
      typeValue,
      supplyArea,
      gallery,
    };
  });
}

export function getShowcaseProjects(tab: ShowcaseTab): ShowcaseProject[] {
  if (tab === "All") {
    const picks: ShowcaseProject[] = [];
    (["Home case", "Commercial Project", "Europe", "Asia", "Australia", "Africa"] as ShowcaseTab[]).forEach(
      (category, index) => {
        const list = buildProjectsForTab(category);
        picks.push({ ...list[index % list.length], id: `all-${index + 1}`, category });
      }
    );
    return picks;
  }
  return buildProjectsForTab(tab);
}

export function getShowcaseProjectById(id: string): ShowcaseProject | null {
  const legacyMap: Record<string, string> = {
    "1": "home-case-1",
    "2": "home-case-2",
    "3": "home-case-3",
    "4": "home-case-4",
    "5": "home-case-5",
    "6": "home-case-6",
    "7": "commercial-project-1",
    "8": "commercial-project-2",
    "9": "commercial-project-3",
  };

  const resolved = legacyMap[id] ?? id;

  const allMatch = getShowcaseProjects("All").find((p) => p.id === resolved);
  if (allMatch) return allMatch;

  const parts = resolved.split("-");
  if (parts.length < 2) return null;

  const index = parseInt(parts[parts.length - 1], 10);
  const categorySlug = parts.slice(0, -1).join("-");
  const category = SLUG_TO_TAB[categorySlug];

  if (!category || category === "All" || Number.isNaN(index) || index < 1 || index > 6) {
    return null;
  }

  const projects = buildProjectsForTab(category);
  return projects[index - 1] ?? null;
}

export function showcaseStaticParams(): { id: string }[] {
  const params: { id: string }[] = [];
  for (let i = 1; i <= 9; i++) params.push({ id: String(i) });
  SHOWCASE_TABS.filter((t) => t !== "All").forEach((tab) => {
    for (let i = 1; i <= 6; i++) {
      params.push({ id: `${slugifyTab(tab)}-${i}` });
    }
  });
  for (let i = 1; i <= 6; i++) params.push({ id: `all-${i}` });
  return params;
}
