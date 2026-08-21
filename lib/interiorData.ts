import { getLocaleOrDefault } from "@/lib/i18n/messageCatalog";
import { pickLocalized } from "@/lib/i18n/pickLocalized";
import type { Locale } from "@/lib/i18n/routing";
import { interiorDetailSlug, interiorMockSlugForId } from "@/lib/interiorRoutes";
import { fallbackHomeData } from "./fallbackData";
import { CMS_INTERIOR_SEED_SLUGS } from "@/lib/cmsInteriorSeedSlugs";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";

export type InteriorCategory =
  | "All"
  | "Kitchen"
  | "Bedroom"
  | "Bathroom"
  | "Door & Windows"
  | "Whole House Solutions"
  | "Furniture";

export type InteriorItem = {
  id: string;
  title: string;
  category: Exclude<InteriorCategory, "All">;
  subcategory?: string;
  description: string;
  detailTitle?: string;
  detailDescription?: string;
  image: string;
  gallery?: string[];
  isNew: boolean;
  createdAt: string;
  order?: number;
  shape: string;
  style: string;
  color: string;
  material: string;
  finish: string;
};

export type InteriorDetailProject = {
  _id: string;
  slug?: string;
  title: string;
  detailTitle: string;
  /** Catalogue card copy — not the detail intro. */
  description: string;
  /** Paragraph under the H1. Empty = section hidden. */
  detailDescription?: string;
  location?: string;
  coverImage: string;
  gallery: string[];
  category?: string;
  isNew?: boolean;
  narrativeOne?: string;
  narrativeTwo?: string;
};

/** Kept for mock/seed copy only — never inject this onto a CMS project page. */
export const INTERIOR_DETAIL_DEFAULT_DESCRIPTION =
  "This modern kitchen was designed to create a warm, elegant, and highly functional space for everyday living. Featuring a spacious island, premium finishes, integrated appliances, and clean architectural lines, the design balances aesthetics with practicality. Every detail was carefully considered to maximize storage, improve workflow, and create a welcoming environment for cooking, dining, and entertaining.";

export function resolveInteriorDetailIntro(detailDescription?: string): string {
  return String(detailDescription || "").trim();
}

export const INTERIOR_NARRATIVE_ONE =
  "The objective was to create a space that is both spacious and functional, without compromising on styling. Smart storage, a warm palette, and an open layout balance utility and spaciousness.";

export const INTERIOR_NARRATIVE_TWO =
  "Through thoughtful space planning, premium finishes, and integrated fixtures, we transformed this space with seamless functionality and lasting quality.";

export const INTERIOR_DETAIL_BODY_FALLBACK = `${INTERIOR_NARRATIVE_ONE.replace(/\s+$/, "")} ${INTERIOR_NARRATIVE_TWO.replace(/^\s+/, "")}`.trim();

/**
 * Merge CMS body fields. Never substitutes placeholder kitchen copy.
 */
export function buildInteriorDetailBody(
  narrativeOne?: string,
  narrativeTwo?: string,
  _options?: { useFallback?: boolean },
): string {
  const one = narrativeOne?.trim() ?? "";
  const two = narrativeTwo?.trim() ?? "";
  if (one && two) {
    return one === two ? one : `${one.replace(/\s+$/, "")} ${two.replace(/^\s+/, "")}`.trim();
  }
  return one || two;
}

/** Collapse exact duplicate half (common in CMS / Figma placeholder). */
export function normalizeDetailBodyParagraph(text: string): string {
  const t = text.trim();
  if (t.length < 24) return t;
  const mid = Math.floor(t.length / 2);
  const first = t.slice(0, mid).trim();
  const second = t.slice(mid).trim();
  if (first && first === second) return first;
  return t;
}

export type AdvancedFilters = {
  shapes: string[];
  subcategories: string[];
  styles: string[];
  colors: string[];
  materials: string[];
  finishes: string[];
};

export const EMPTY_FILTERS: AdvancedFilters = {
  shapes: [],
  subcategories: [],
  styles: [],
  colors: [],
  materials: [],
  finishes: [],
};

/** Figma kitchen shapes */
export const KITCHEN_SHAPES = [
  "Island",
  "Irregular",
  "U Shape",
  "Galley",
  "L Shape",
  "Straight",
  "T Shape",
] as const;

/** Figma bedroom sub-types */
export const BEDROOM_SUBCATEGORIES = [
  "Wardrobe Closets",
  "Custom Wardrobes",
  "Built In Wardrobes",
  "Walk In Closet",
  "Hinged Door Wardrobe",
  "Sliding Door Wardrobe",
] as const;

/** Figma bathroom sub-types */
export const BATHROOM_SUBCATEGORIES = [
  "Wall Mounted & Floating",
  "Free Standing",
] as const;

/** Figma doors & windows sub-types */
export const DOORS_SUBCATEGORIES = [
  "Interior Doors",
  "WPC Doors",
  "Aluminum Doors and Windows",
] as const;

export const FILTER_OPTIONS = {
  shapes: KITCHEN_SHAPES,
  subcategories: {
    Bedroom: BEDROOM_SUBCATEGORIES,
    Bathroom: BATHROOM_SUBCATEGORIES,
    "Door & Windows": DOORS_SUBCATEGORIES,
  },
  styles: ["Modern", "Traditional"] as const,
  colors: [
    "Beige",
    "Black",
    "Blue",
    "Brown",
    "Gray",
    "Green",
    "Metallic",
    "Red",
    "Stone Tone",
    "White",
    "Wood Tone",
    "Dark",
    "Champagne",
    "Copper",
  ] as const,
  materials: ["Thermofoil", "Glass", "Lacquer", "Melamine"] as const,
  finishes: ["Matte"] as const,
} as const;

export type CategoryFilterSection =
  | "shapes"
  | "subcategories"
  | "styles"
  | "colors"
  | "materials"
  | "finishes";

export function getFilterSectionsForCategory(
  category: InteriorCategory
): CategoryFilterSection[] {
  switch (category) {
    case "Kitchen":
      return ["shapes", "styles", "colors", "materials", "finishes"];
    case "Bedroom":
      return ["subcategories", "colors", "materials", "finishes"];
    case "Bathroom":
      return ["subcategories", "colors", "materials", "finishes"];
    case "Door & Windows":
      return ["subcategories", "colors", "materials", "finishes"];
    case "Whole House Solutions":
    case "Furniture":
      return ["styles", "colors", "materials", "finishes"];
    default:
      return ["shapes", "styles", "colors", "materials", "finishes"];
  }
}

export function getSubcategoryOptions(category: InteriorCategory): readonly string[] {
  if (category === "Bedroom") return BEDROOM_SUBCATEGORIES;
  if (category === "Bathroom") return BATHROOM_SUBCATEGORIES;
  if (category === "Door & Windows") return DOORS_SUBCATEGORIES;
  return [];
}

export type InteriorCatalogFilterSource = {
  category?: string;
  subcategory?: string;
  shape?: string;
  style?: string;
  color?: string;
  material?: string;
  finish?: string;
};

const FILTER_SECTION_FIELD: Record<
  CategoryFilterSection,
  keyof Pick<
    InteriorCatalogFilterSource,
    "shape" | "subcategory" | "style" | "color" | "material" | "finish"
  >
> = {
  shapes: "shape",
  subcategories: "subcategory",
  styles: "style",
  colors: "color",
  materials: "material",
  finishes: "finish",
};

/** Canonical Figma options (admin values should match these or appear in catalog). */
export function getStaticFilterOptionsForSection(
  section: CategoryFilterSection,
  category: InteriorCategory,
): readonly string[] {
  switch (section) {
    case "shapes":
      return FILTER_OPTIONS.shapes;
    case "subcategories":
      return getSubcategoryOptions(category);
    case "styles":
      return FILTER_OPTIONS.styles;
    case "colors":
      return FILTER_OPTIONS.colors;
    case "materials":
      return FILTER_OPTIONS.materials;
    case "finishes":
      return FILTER_OPTIONS.finishes;
    default:
      return [];
  }
}

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

/** Merge design-system options with values present on live catalog rows (admin-added). */
export function getFilterOptionsForSection(
  section: CategoryFilterSection,
  category: InteriorCategory,
  catalog: InteriorCatalogFilterSource[] = [],
): string[] {
  const base = [...getStaticFilterOptionsForSection(section, category)];
  const field = FILTER_SECTION_FIELD[section];
  const scoped =
    category === "All"
      ? catalog
      : catalog.filter((row) => (row.category || "Kitchen") === category);
  const fromCatalog = scoped
    .map((row) => row[field])
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.trim());
  return uniqueSorted([...base, ...fromCatalog]);
}

function findMockInteriorItem(idOrSlug: string) {
  return INTERIOR_ITEMS.find(
    (entry) =>
      entry.id === idOrSlug ||
      interiorMockSlugForId(entry.id) === idOrSlug ||
      interiorDetailSlug({ _id: entry.id, title: entry.title }) === idOrSlug,
  );
}

export function isMockInteriorId(id: string) {
  return INTERIOR_ITEMS.some((item) => item.id === id);
}

export type NormalizeInteriorSource = "api" | "mock";

function readFilterString(
  item: Record<string, unknown>,
  key: keyof InteriorCatalogFilterSource,
  mockItem: InteriorItem | undefined,
  source: NormalizeInteriorSource,
) {
  if (source === "api") {
    const raw = item[key];
    return typeof raw === "string" ? raw.trim() : "";
  }
  const fromItem = item[key];
  if (typeof fromItem === "string" && fromItem.trim()) return fromItem.trim();
  const fromMock = mockItem?.[key as keyof InteriorItem];
  return typeof fromMock === "string" ? fromMock : "";
}

export const CATEGORY_SUBCATEGORIES: Partial<
  Record<Exclude<InteriorCategory, "All">, readonly string[]>
> = {
  Bedroom: BEDROOM_SUBCATEGORIES,
  Bathroom: BATHROOM_SUBCATEGORIES,
  "Door & Windows": DOORS_SUBCATEGORIES,
};

export const INTERIOR_CATEGORIES: InteriorCategory[] = [
  "All",
  "Kitchen",
  "Bedroom",
  "Bathroom",
  "Door & Windows",
  "Whole House Solutions",
  "Furniture",
];

export const CATEGORY_LABELS: Record<InteriorCategory, string> = {
  All: "All",
  Kitchen: "Kitchen",
  Bedroom: "Bedroom",
  Bathroom: "Bathroom",
  "Door & Windows": "Door & Windows",
  "Whole House Solutions": "Whole House Solution",
  Furniture: "Furniture",
};

export const CATEGORY_HERO: Record<InteriorCategory, { title: string; subtitle: string }> = {
  All: {
    title: "INTERIOR DESIGN",
    subtitle: "Spaces crafted for the way you live",
  },
  Kitchen: {
    title: "KITCHEN INTERIOR",
    subtitle: "Timeless kitchens designed for modern living",
  },
  Bedroom: {
    title: "BEDROOM INTERIOR",
    subtitle: "Designed for comfort, relaxation, and timeless elegance",
  },
  Bathroom: {
    title: "BATHROOM INTERIOR",
    subtitle: "Where style meets comfort in every detail",
  },
  "Door & Windows": {
    title: "DOORS & WINDOWS",
    subtitle: "Enhancing every space with quality, style, and durability",
  },
  "Whole House Solutions": {
    title: "WHOLE HOUSE SOLUTION",
    subtitle: "End-to-end interior solutions tailored to your lifestyle",
  },
  Furniture: {
    title: "FURNITURE",
    subtitle: "Designed for style and functionality",
  },
};

const IMAGES = [
  "/home/product/product-1.png",
  "/home/product/product-2.png",
  "/home/product/product-3.jpg",
  "/home/about-1.png",
  "/home/about-2.png",
  "/home/about-3.png",
  "/home/catalog.png",
  "/home/catalog-2.png",
  "/home/catalog-3.png",
  "/home/counting.png",
  "/home/home-front-page.png",
  "/home/catalog-4.png",
];

function img(i: number) {
  return IMAGES[i % IMAGES.length];
}

export const INTERIOR_ITEMS: InteriorItem[] = [
  {
    id: "1",
    title: "Obsidian Black",
    detailTitle: "Cilan Series Modern Curved Kitchen Cabinetry with Island BLCC22300",
    detailDescription: INTERIOR_DETAIL_DEFAULT_DESCRIPTION,
    category: "Kitchen",
    description: "Matte black cabinets with gold bar handles. Bold and dramatic.",
    image: "/Interior-kitchen/kitchen1.png",
    gallery: [
      "/Interior-kitchen/kitchen1.png",
      "/Interior-kitchen/kitchen2.png",
      "/Interior-kitchen/kitchen1.png",
      "/home/featured-project/feature-1.jpg",
      "/home/featured-project/feature-2.jpg",
    ],
    isNew: true,
    createdAt: "2026-06-01",
    shape: "U Shape",
    style: "Modern",
    color: "Black",
    material: "Lacquer",
    finish: "Matte",
  },
  {
    id: "2",
    title: "Skyline Apartment",
    detailTitle:
      "Skyline Apartment Modern L-Shape Kitchen Cabinetry with Full-Height Storage SKY2200",
    detailDescription: INTERIOR_DETAIL_DEFAULT_DESCRIPTION,
    category: "Kitchen",
    description: "Compact luxury with full-height storage.",
    image: "/Interior-kitchen/kitchen2.png",
    gallery: [
      "/Interior-kitchen/kitchen2.png",
      "/Interior-kitchen/kitchen1.png",
      "/home/featured-project/feature-2.jpg",
    ],
    isNew: true,
    createdAt: "2026-05-28",
    shape: "L Shape",
    style: "Traditional",
    color: "Wood Tone",
    material: "Thermofoil",
    finish: "Matte",
  },
  {
    id: "3",
    title: "Obsidian Black",
    category: "Kitchen",
    description: "Matte black cabinets with gold bar handles. Bold and dramatic.",
    image: "/Interior-kitchen/kitchen2.png",
    isNew: true,
    createdAt: "2026-05-20",
    shape: "Island",
    style: "Modern",
    color: "White",
    material: "Glass",
    finish: "Matte",
  },
  {
    id: "4",
    title: "Obsidian Black",
    category: "Kitchen",
    description: "Matte black cabinets with gold bar handles. Bold and dramatic.",
    image: "/Interior-kitchen/kitchen2.png",
    isNew: true,
    createdAt: "2026-04-12",
    shape: "Straight",
    style: "Modern",
    color: "Gray",
    material: "Melamine",
    finish: "Matte",
  },
  {
    id: "5",
    title: "Obsidian Black",
    category: "Kitchen",
    description: "Matte black cabinets with gold bar handles. Bold and dramatic.",
    image: "/Interior-kitchen/kitchen2.png",
    isNew: true,
    createdAt: "2026-03-18",
    shape: "Galley",
    style: "Traditional",
    color: "Brown",
    material: "Thermofoil",
    finish: "Matte",
  },
  {
    id: "6",
    title: "Obsidian Black",
    category: "Kitchen",
    description: "Matte black cabinets with gold bar handles. Bold and dramatic.",
    image: "/Interior-kitchen/kitchen2.png",
    isNew: true,
    createdAt: "2026-06-10",
    shape: "Island",
    style: "Modern",
    color: "Black",
    material: "Lacquer",
    finish: "Matte",
  },
  {
    id: "7",
    title: "Serene Nest",
    category: "Bedroom",
    subcategory: "Wardrobe Closets",
    description: "Soft neutrals and built-in wardrobes for a calm sleep space.",
    image: img(6),
    isNew: true,
    createdAt: "2026-05-15",
    shape: "",
    style: "Modern",
    color: "Beige",
    material: "Thermofoil",
    finish: "Matte",
  },
  {
    id: "8",
    title: "Linen Suite",
    category: "Bedroom",
    subcategory: "Custom Wardrobes",
    description: "Layered textures with a floating bed and warm lighting.",
    image: img(7),
    isNew: false,
    createdAt: "2026-02-22",
    shape: "",
    style: "Traditional",
    color: "Wood Tone",
    material: "Melamine",
    finish: "Matte",
  },
  {
    id: "9",
    title: "Urban Loft Bedroom",
    category: "Bedroom",
    subcategory: "Built In Wardrobes",
    description: "Clean lines and clever storage for compact city homes.",
    image: img(8),
    isNew: false,
    createdAt: "2026-01-30",
    shape: "",
    style: "Modern",
    color: "Gray",
    material: "Lacquer",
    finish: "Matte",
  },
  {
    id: "10",
    title: "Velvet Haven",
    category: "Bedroom",
    subcategory: "Walk In Closet",
    description: "Soft velvet headboard with muted mauve finishes.",
    image: img(9),
    isNew: true,
    createdAt: "2026-06-05",
    shape: "",
    style: "Modern",
    color: "Dark",
    material: "Glass",
    finish: "Matte",
  },
  {
    id: "11",
    title: "Spa Mist",
    category: "Bathroom",
    subcategory: "Wall Mounted & Floating",
    description: "Stone vanity, rain shower, and soft ambient lighting.",
    image: img(10),
    isNew: true,
    createdAt: "2026-05-02",
    shape: "",
    style: "Modern",
    color: "White",
    material: "Lacquer",
    finish: "Matte",
  },
  {
    id: "12",
    title: "Marble Retreat",
    category: "Bathroom",
    subcategory: "Free Standing",
    description: "Full marble cladding with brass fixtures and open shower.",
    image: img(11),
    isNew: false,
    createdAt: "2026-03-08",
    shape: "",
    style: "Traditional",
    color: "Stone Tone",
    material: "Glass",
    finish: "Matte",
  },
  {
    id: "13",
    title: "Compact Bath",
    category: "Bathroom",
    subcategory: "Wall Mounted & Floating",
    description: "Smart storage and pale finishes for smaller bathrooms.",
    image: img(0),
    isNew: false,
    createdAt: "2026-02-01",
    shape: "",
    style: "Modern",
    color: "Gray",
    material: "Melamine",
    finish: "Matte",
  },
  {
    id: "14",
    title: "Frame Light",
    category: "Door & Windows",
    subcategory: "Aluminum Doors and Windows",
    description: "Slim aluminium frames that flood rooms with daylight.",
    image: img(1),
    isNew: true,
    createdAt: "2026-04-25",
    shape: "",
    style: "Modern",
    color: "Black",
    material: "Glass",
    finish: "Matte",
  },
  {
    id: "15",
    title: "Heritage Door",
    category: "Door & Windows",
    subcategory: "Interior Doors",
    description: "Solid wood doors with quiet modern hardware.",
    image: img(2),
    isNew: false,
    createdAt: "2026-01-14",
    shape: "",
    style: "Traditional",
    color: "Wood Tone",
    material: "Thermofoil",
    finish: "Matte",
  },
  {
    id: "16",
    title: "Garden View",
    category: "Door & Windows",
    subcategory: "WPC Doors",
    description: "Floor-to-ceiling openings connecting indoors to outdoors.",
    image: img(3),
    isNew: true,
    createdAt: "2026-05-30",
    shape: "",
    style: "Modern",
    color: "White",
    material: "Melamine",
    finish: "Matte",
  },
  {
    id: "17",
    title: "Complete Home Edit",
    category: "Whole House Solutions",
    description: "One cohesive palette from living to kitchen to bedrooms.",
    image: img(4),
    isNew: true,
    createdAt: "2026-06-12",
    shape: "",
    style: "Modern",
    color: "Wood Tone",
    material: "Thermofoil",
    finish: "Matte",
  },
  {
    id: "18",
    title: "Family Flow Plan",
    category: "Whole House Solutions",
    description: "Layouts designed around how your family actually moves.",
    image: img(5),
    isNew: false,
    createdAt: "2026-03-22",
    shape: "",
    style: "Traditional",
    color: "Beige",
    material: "Melamine",
    finish: "Matte",
  },
  {
    id: "19",
    title: "Apartment Refresh",
    category: "Whole House Solutions",
    description: "Full interior upgrade without losing usable space.",
    image: img(6),
    isNew: false,
    createdAt: "2026-02-10",
    shape: "",
    style: "Modern",
    color: "Gray",
    material: "Lacquer",
    finish: "Matte",
  },
  {
    id: "20",
    title: "Signature Sofa",
    category: "Furniture",
    description: "Custom sofa proportions tailored to your living room.",
    image: img(7),
    isNew: true,
    createdAt: "2026-04-02",
    shape: "",
    style: "Modern",
    color: "Gray",
    material: "Thermofoil",
    finish: "Matte",
  },
  {
    id: "21",
    title: "Dining Set",
    category: "Furniture",
    description: "Solid wood table with soft upholstered chairs.",
    image: img(8),
    isNew: false,
    createdAt: "2026-01-20",
    shape: "",
    style: "Traditional",
    color: "Wood Tone",
    material: "Melamine",
    finish: "Matte",
  },
  {
    id: "22",
    title: "Storage Console",
    category: "Furniture",
    description: "Slim console with concealed drawers for tidy living.",
    image: img(9),
    isNew: true,
    createdAt: "2026-05-08",
    shape: "",
    style: "Modern",
    color: "Dark",
    material: "Lacquer",
    finish: "Matte",
  },
  {
    id: "23",
    title: "Reading Lounge Chair",
    category: "Furniture",
    description: "Deep seat and warm fabric for quiet corners.",
    image: img(10),
    isNew: false,
    createdAt: "2026-03-01",
    shape: "",
    style: "Modern",
    color: "Champagne",
    material: "Glass",
    finish: "Matte",
  },
  {
    id: "24",
    title: "Oak Sideboard",
    category: "Furniture",
    description: "Natural oak grain with soft-close cabinetry.",
    image: img(11),
    isNew: true,
    createdAt: "2026-06-08",
    shape: "",
    style: "Traditional",
    color: "Brown",
    material: "Thermofoil",
    finish: "Matte",
  },
];

export type SortOption =
  | "all"
  | "newest"
  | "oldest";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "newest", label: "Newest To Oldest" },
  { value: "oldest", label: "Oldest To Newest" },
];

function matchesList(selected: string[], value: string | undefined) {
  if (selected.length === 0) return true;
  if (!value) return false;
  return selected.includes(value);
}

export function filterAndSortItems(
  items: InteriorItem[],
  category: InteriorCategory,
  sortBy: SortOption,
  filters: AdvancedFilters = EMPTY_FILTERS,
  subcategory?: string | null
) {
  let list = items.filter((item) => {
    const catOk = category === "All" || item.category === category;
    const subOk =
      !subcategory || subcategory === "All" || item.subcategory === subcategory;
    return (
      catOk &&
      subOk &&
      matchesList(filters.shapes, item.shape) &&
      matchesList(filters.subcategories, item.subcategory) &&
      matchesList(filters.styles, item.style) &&
      matchesList(filters.colors, item.color) &&
      matchesList(filters.materials, item.material) &&
      matchesList(filters.finishes, item.finish)
    );
  });

  switch (sortBy) {
    case "all":
      list = [...list].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
      break;
    case "newest":
      list = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "oldest":
      list = [...list].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    default:
      break;
  }

  return list;
}

export function countActiveFilters(filters: AdvancedFilters) {
  return (
    filters.shapes.length +
    filters.subcategories.length +
    filters.styles.length +
    filters.colors.length +
    filters.materials.length +
    filters.finishes.length
  );
}

const INTERIOR_FALLBACK_IMAGES = [...MEDIA.featured];

export function resolveInteriorImage(
  coverImage?: string,
  gallery?: string[],
  image?: string,
  index = 0
) {
  const raw =
    coverImage ||
    gallery?.[0] ||
    image ||
    INTERIOR_FALLBACK_IMAGES[index % INTERIOR_FALLBACK_IMAGES.length];
  return resolveMediaUrl(raw, INTERIOR_FALLBACK_IMAGES[index % INTERIOR_FALLBACK_IMAGES.length]);
}

export function normalizeInteriorProject(
  item: Record<string, unknown>,
  index = 0,
  locale?: Locale,
  options?: { source?: NormalizeInteriorSource },
) {
  const loc = getLocaleOrDefault(locale);
  const id = String(item._id ?? item.id ?? index);
  const source =
    options?.source ?? (isMockInteriorId(id) ? ("mock" as const) : ("api" as const));
  const gallery = (item.gallery as string[] | undefined) ?? [];
  const image = item.image as string | undefined;
  const coverImage = item.coverImage as string | undefined;
  const category = readInteriorCategory(item) || "Kitchen";
  const mockItem = INTERIOR_ITEMS.find(
    (m) => m.id === id || interiorMockSlugForId(m.id) === id,
  );

  const title =
    pickLocalized(item.title, loc) ||
    (typeof item.title === "string" ? item.title : "") ||
    (source === "mock" ? mockItem?.title : "") ||
    "";
  const description =
    pickLocalized(item.description, loc) ||
    (typeof item.description === "string" ? item.description : "") ||
    (source === "mock" ? mockItem?.description : "") ||
    "";

  return {
    ...item,
    _id: id,
    title,
    description,
    category,
    subcategory: readFilterString(item, "subcategory", mockItem, source),
    shape: readFilterString(item, "shape", mockItem, source),
    style: readFilterString(item, "style", mockItem, source),
    color: readFilterString(item, "color", mockItem, source),
    material: readFilterString(item, "material", mockItem, source),
    finish: readFilterString(item, "finish", mockItem, source),
    isNew: source === "api" ? Boolean(item.isNew) : Boolean(item.isNew ?? mockItem?.isNew),
    coverImage: resolveInteriorImage(coverImage, gallery, image, index),
    createdAt:
      (typeof item.createdAt === "string" && item.createdAt) ||
      (source === "mock" ? mockItem?.createdAt : "") ||
      "",
    order: typeof item.order === "number" ? item.order : mockItem?.order,
    slug: interiorDetailSlug({
      slug: typeof item.slug === "string" ? item.slug : undefined,
      _id: id,
      title,
    }),
  };
}

const INTERIOR_CATEGORY_SET = new Set(
  INTERIOR_CATEGORIES.filter((c): c is Exclude<InteriorCategory, "All"> => c !== "All")
);

function readInteriorCategory(item: Record<string, unknown>): string {
  const raw = item.category;
  if (typeof raw === "string") return raw.trim();
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const map = raw as Record<string, unknown>;
    const picked =
      (typeof map.en === "string" && map.en.trim()) ||
      (typeof map.th === "string" && map.th.trim()) ||
      (typeof map.pl === "string" && map.pl.trim()) ||
      "";
    return picked;
  }
  return "";
}

function isInteriorCatalogItem(item: Record<string, unknown>) {
  const category = readInteriorCategory(item);
  if (!category || !INTERIOR_CATEGORY_SET.has(category as Exclude<InteriorCategory, "All">)) {
    return false;
  }
  return item.interiorCatalog !== false;
}

/** Interior listing: prefer API/admin projects; mocks only when the API request fails. */
export function buildInteriorCatalog(
  apiProjects: Record<string, unknown>[] = [],
  locale?: Locale,
  mode: "hybrid" | "api" = "hybrid",
  options: { apiFailed?: boolean } = {},
) {
  const mockNormalized = INTERIOR_ITEMS.map((item, index) =>
    normalizeInteriorProject({ ...item, _id: item.id }, index, locale, { source: "mock" }),
  );

  const fromApi = apiProjects
    .filter(isInteriorCatalogItem)
    .map((item, index) => normalizeInteriorProject(item, index, locale, { source: "api" }));

  if (fromApi.length > 0) {
    return fromApi;
  }

  // API down / blocked → keep the catalogue visible. Empty CMS list stays empty.
  if (options.apiFailed) {
    return mockNormalized;
  }

  if (mode === "api") {
    return [];
  }

  return [];
}

const INTERIOR_GALLERY_FALLBACKS = [...MEDIA.featured.slice(0, 5)];

function buildInteriorGallery(primary: string, extra?: string[]) {
  if (extra && extra.length >= 3) return extra;
  return [
    primary,
    INTERIOR_GALLERY_FALLBACKS[1],
    INTERIOR_GALLERY_FALLBACKS[2],
    INTERIOR_GALLERY_FALLBACKS[3],
    INTERIOR_GALLERY_FALLBACKS[4],
  ];
}

export function getInteriorProjectFromFallback(
  idOrSlug: string,
  locale?: Locale,
): InteriorDetailProject | null {
  for (const row of fallbackHomeData.projects) {
    const rec = row as Record<string, unknown>;
    const slug = interiorDetailSlug({
      slug: rec.slug as string | undefined,
      _id: String(rec._id ?? ""),
      title: String(rec.title ?? ""),
    });
    const id = String(rec._id ?? "");
    if (idOrSlug !== id && idOrSlug !== rec.slug && idOrSlug !== slug) continue;

    const normalized = normalizeInteriorProject(rec, 0, locale, { source: "api" });
    const coverImage = normalized.coverImage as string;
    const galleryRaw = Array.isArray(rec.gallery)
      ? rec.gallery.map((url) => String(url || "").trim()).filter(Boolean)
      : [];
    return {
      _id: String(normalized._id),
      slug,
      title: String(normalized.title),
      detailTitle: String(normalized.title),
      description: String(normalized.description ?? ""),
      detailDescription: "",
      coverImage,
      gallery: galleryRaw,
      category: normalized.category as string | undefined,
      isNew: Boolean(normalized.isNew),
      narrativeOne: "",
      narrativeTwo: "",
    };
  }
  return null;
}

export function getInteriorProjectById(idOrSlug: string): InteriorDetailProject | null {
  const item = findMockInteriorItem(idOrSlug);
  if (!item) return null;

  const coverImage = resolveInteriorImage(item.image, item.gallery, item.image, 0);
  const gallery = (item.gallery || []).map((url) => String(url || "").trim()).filter(Boolean);
  const slug = interiorDetailSlug({ _id: item.id, title: item.title });

  return {
    _id: item.id,
    slug,
    title: item.title,
    detailTitle: item.detailTitle || item.title,
    description: item.description,
    detailDescription: item.detailDescription || "",
    coverImage,
    gallery,
    category: item.category,
    isNew: item.isNew,
    narrativeOne: "",
    narrativeTwo: "",
  };
}

export function getRelatedInteriorProjects(
  idOrSlug: string,
  category?: string,
  limit = 3,
): InteriorDetailProject[] {
  const current = findMockInteriorItem(idOrSlug);
  const currentId = current?.id ?? idOrSlug;

  return INTERIOR_ITEMS.filter(
    (item) => item.id !== currentId && (!category || item.category === category),
  )
    .slice(0, limit)
    .map((item, index) => {
      const coverImage = resolveInteriorImage(item.image, item.gallery, item.image, index);
      return {
        _id: item.id,
        slug: interiorDetailSlug({ _id: item.id, title: item.title }),
        title: item.title,
        detailTitle: item.detailTitle || item.title,
        description: item.description,
        coverImage,
        gallery: buildInteriorGallery(coverImage, item.gallery),
        category: item.category,
        isNew: item.isNew,
      };
    });
}

export function getInteriorBackHref(category?: string) {
  if (!category || category === "All") return "/interior-design";
  return `/interior-design?category=${encodeURIComponent(category)}`;
}

export function interiorStaticParams() {
  return INTERIOR_ITEMS.map((item) => ({
    slug: interiorDetailSlug({ _id: item.id, title: item.title }),
  }));
}

/** Mock slugs plus any CMS project slugs available at build time. */
export async function interiorDetailStaticParams() {
  const params = interiorStaticParams();
  const seen = new Set(params.map((p) => p.slug));

  for (const seedSlug of CMS_INTERIOR_SEED_SLUGS) {
    if (!seen.has(seedSlug)) {
      seen.add(seedSlug);
      params.push({ slug: seedSlug });
    }
  }

  try {
    const { fetchProjects } = await import("./api");
    const projects = await fetchProjects();
    for (const row of projects) {
      const p = row as { _id?: string; slug?: string; title?: unknown };
      if (!p._id) continue;
      const title = typeof p.title === "string" ? p.title : undefined;
      const slug = interiorDetailSlug({ slug: p.slug, _id: p._id, title });
      if (seen.has(slug)) continue;
      seen.add(slug);
      params.push({ slug });
    }
  } catch {
    /* offline build — mock slugs only */
  }

  return params;
}
