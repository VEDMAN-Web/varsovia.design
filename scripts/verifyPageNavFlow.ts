/**
 * Read-only verification for header ↔ listing page nav alignment.
 * Run: npx tsx scripts/verifyPageNavFlow.ts
 */
import { parseShowcaseTabFromHref, buildShowcasePageNav } from "../lib/showcasePageNav";
import { parseInteriorCategoryFromHref, buildInteriorPageNav } from "../lib/interiorPageNav";
import type { SiteContent } from "../lib/siteTypes";
import type { MainNavigationConfig } from "../lib/mainNavigationTypes";

const tShowcase = (key: string) => key;
const tHero = (key: string) => `hero:${key}`;
const tCat = (key: string) => `cat:${key}`;

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed += 1;
  } else {
    console.log("OK:", msg);
  }
}

// --- href parsers (match backend default mainNavigation hrefs) ---
assert(parseShowcaseTabFromHref("/showcase") === "Home case", "showcase /showcase → Home case");
assert(parseShowcaseTabFromHref("/showcase?tab=All") === "All", "showcase tab=All");
assert(parseShowcaseTabFromHref("/showcase?tab=South%20America") === "South America", "showcase South America encoded");
assert(parseInteriorCategoryFromHref("/interior") === "All", "interior /interior → All");
assert(parseInteriorCategoryFromHref("/interior?category=Kitchen") === "Kitchen", "interior Kitchen");
assert(
  parseInteriorCategoryFromHref("/interior?category=Door%20%26%20Windows") === "Door & Windows",
  "interior Door & Windows encoded",
);

const mockSite: SiteContent = {
  mainNavigation: {
    version: 1,
    items: [
      {
        id: "interior",
        label: "Interior",
        href: "/interior",
        menuKind: "dropdown",
        menu: {
          featured: { label: "All Interiors", subtitle: "Browse every room type", href: "/interior" },
          sectionLabel: "By room",
          links: [
            { label: "Kitchen", subtitle: "Modular kitchens", href: "/interior?category=Kitchen" },
            { label: "Bedroom", subtitle: "Restful retreats", href: "/interior?category=Bedroom" },
          ],
        },
      },
      {
        id: "showcase",
        label: "Showcase",
        href: "/showcase",
        menuKind: "showcaseMega",
        menu: {
          featured: { label: "Our Showcase", subtitle: "Every space, every story", href: "/showcase?tab=All" },
          sectionLabel: "By region",
          links: [
            { title: "South America", subtitle: "Vibrant Spaces", href: "/showcase?tab=South%20America" },
            { title: "Europe", subtitle: "Timeless Elegance", href: "/showcase?tab=Europe" },
          ],
        },
      },
    ],
  } as MainNavigationConfig,
};

const showcaseNav = buildShowcasePageNav(mockSite, tShowcase);
assert(showcaseNav.tabs.includes("All"), "showcase tabs include All");
assert(showcaseNav.tabs.includes("South America"), "showcase tabs include South America");
assert(
  showcaseNav.metaForTab("South America").title === "South America",
  "showcase hero title from CMS link",
);
assert(
  showcaseNav.metaForTab("South America").subtitle === "Vibrant Spaces",
  "showcase hero subtitle from CMS link",
);

const interiorNav = buildInteriorPageNav(mockSite, tHero, tCat);
assert(interiorNav.categories.includes("All"), "interior categories include All");
assert(interiorNav.categories.includes("Kitchen"), "interior categories include Kitchen");
assert(
  interiorNav.metaForCategory("Kitchen").subtitle === "Modular kitchens",
  "interior hero subtitle from CMS",
);
assert(interiorNav.labelForCategory("All") === "All Interiors", "interior All tab label from featured");

console.log("\n---");
if (failed > 0) {
  console.error(`${failed} assertion(s) failed`);
  process.exit(1);
}
console.log("All page-nav assertions passed.");
