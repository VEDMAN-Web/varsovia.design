import { getLocaleOrDefault } from "@/lib/i18n/messageCatalog";
import { pickLocalized } from "@/lib/i18n/pickLocalized";
import type { Locale } from "@/lib/i18n/routing";

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
  price: number;
  shape: string;
  style: string;
  color: string;
  material: string;
  finish: string;
};

export type InteriorDetailProject = {
  _id: string;
  title: string;
  detailTitle: string;
  description: string;
  coverImage: string;
  gallery: string[];
  category?: string;
  isNew?: boolean;
  narrativeOne?: string;
  narrativeTwo?: string;
};

export const INTERIOR_DETAIL_DEFAULT_DESCRIPTION =
  "This modern kitchen was designed to create a warm, elegant, and highly functional space for everyday living. Featuring a spacious island, premium finishes, integrated appliances, and clean architectural lines, the design balances aesthetics with practicality. Every detail was carefully considered to maximize storage, improve workflow, and create a welcoming environment for cooking, dining, and entertaining.";

export const INTERIOR_NARRATIVE_ONE =
  "The objective was to create a space that is both spacious and functional, without compromising on styling. Smart storage, a warm palette, and an open layout balance utility and spaciousness.";

export const INTERIOR_NARRATIVE_TWO =
  "Through thoughtful space planning, premium finishes, and integrated fixtures, we transformed this space with seamless functionality and lasting quality.";

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
    price: 285000,
    shape: "U Shape",
    style: "Modern",
    color: "Black",
    material: "Lacquer",
    finish: "Matte",
  },
  {
    id: "2",
    title: "Obsidian Black",
    category: "Kitchen",
    description: "Matte black cabinets with gold bar handles. Bold and dramatic.",
    image: "/Interior-kitchen/kitchen2.png",
    isNew: true,
    createdAt: "2026-05-28",
    price: 265000,
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
    price: 320000,
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
    price: 198000,
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
    price: 215000,
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
    price: 345000,
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
    price: 175000,
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
    price: 210000,
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
    price: 185000,
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
    price: 295000,
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
    price: 95000,
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
    price: 125000,
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
    price: 72000,
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
    price: 45000,
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
    price: 38000,
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
    price: 52000,
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
    price: 850000,
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
    price: 720000,
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
    price: 580000,
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
    price: 68000,
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
    price: 92000,
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
    price: 54000,
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
    price: 42000,
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
    price: 78000,
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
  | "oldest"
  | "price-high"
  | "price-low";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "newest", label: "Newest To Oldest" },
  { value: "oldest", label: "Oldest To Newest" },
  { value: "price-high", label: "High to Low Price" },
  { value: "price-low", label: "Low to High Price" },
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
    case "price-high":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case "price-low":
      list = [...list].sort((a, b) => a.price - b.price);
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

const INTERIOR_FALLBACK_IMAGES = [
  "/Interior-kitchen/kitchen1.png",
  "/Interior-kitchen/kitchen2.png",
  "/home/featured-project/feature-1.jpg",
  "/home/featured-project/feature-2.jpg",
  "/home/featured-project/feature-3.jpg",
  "/home/featured-project/feature-4.jpg",
];

export function resolveInteriorImage(
  coverImage?: string,
  gallery?: string[],
  image?: string,
  index = 0
) {
  return (
    coverImage ||
    gallery?.[0] ||
    image ||
    INTERIOR_FALLBACK_IMAGES[index % INTERIOR_FALLBACK_IMAGES.length]
  );
}

export function normalizeInteriorProject(
  item: Record<string, unknown>,
  index = 0,
  locale?: Locale,
) {
  const loc = getLocaleOrDefault(locale);
  const id = String(item._id ?? item.id ?? index);
  const gallery = (item.gallery as string[] | undefined) ?? [];
  const image = item.image as string | undefined;
  const coverImage = item.coverImage as string | undefined;
  const category = (item.category as string | undefined) || "Kitchen";
  const mockItem = INTERIOR_ITEMS.find((m) => m.id === id) ?? INTERIOR_ITEMS[index % INTERIOR_ITEMS.length];

  const title =
    pickLocalized(item.title, loc) ||
    (typeof item.title === "string" ? item.title : "") ||
    mockItem?.title ||
    "";
  const description =
    pickLocalized(item.description, loc) ||
    (typeof item.description === "string" ? item.description : "") ||
    mockItem?.description ||
    "";

  return {
    ...item,
    _id: id,
    title,
    description,
    category,
    subcategory: (item.subcategory as string | undefined) ?? mockItem?.subcategory,
    price: (item.price as number | undefined) ?? mockItem?.price ?? 0,
    shape: (item.shape as string | undefined) ?? mockItem?.shape ?? "",
    style: (item.style as string | undefined) ?? mockItem?.style ?? "Modern",
    color: (item.color as string | undefined) ?? mockItem?.color ?? "White",
    material: (item.material as string | undefined) ?? mockItem?.material ?? "Thermofoil",
    finish: (item.finish as string | undefined) ?? mockItem?.finish ?? "Matte",
    coverImage: resolveInteriorImage(coverImage, gallery, image, index),
  };
}

const INTERIOR_CATEGORY_SET = new Set(
  INTERIOR_CATEGORIES.filter((c): c is Exclude<InteriorCategory, "All"> => c !== "All")
);

function isInteriorCatalogItem(item: Record<string, unknown>) {
  const category = item.category as string | undefined;
  if (!category || !INTERIOR_CATEGORY_SET.has(category as Exclude<InteriorCategory, "All">)) {
    return false;
  }
  // Accept if explicitly flagged OR has any display-worthy content
  if (item.interiorCatalog === false) return false;
  return Boolean(
    item.interiorCatalog === true ||
    item.coverImage ||
    item.subcategory ||
    item.shape ||
    item.price ||
    item.color ||
    item.material
  );
}

/** Interior listing: mock catalog; merges API rows only when they carry interior metadata. */
export function buildInteriorCatalog(
  apiProjects: Record<string, unknown>[] = [],
  locale?: Locale,
  mode: "hybrid" | "api" = "hybrid",
) {
  const mockNormalized = INTERIOR_ITEMS.map((item, index) =>
    normalizeInteriorProject({ ...item, _id: item.id }, index, locale),
  );

  const fromApi = apiProjects
    .filter(isInteriorCatalogItem)
    .map((item, index) => normalizeInteriorProject(item, index, locale));

  if (fromApi.length === 0) return mockNormalized;

  if (mode === "api") return fromApi;

  const byId = new Map<string, ReturnType<typeof normalizeInteriorProject>>();
  for (const item of mockNormalized) {
    byId.set(String(item._id), item);
  }
  for (const item of fromApi) {
    byId.set(String(item._id), item);
  }
  return Array.from(byId.values());
}

const INTERIOR_GALLERY_FALLBACKS = [
  "/Interior-kitchen/kitchen1.png",
  "/Interior-kitchen/kitchen2.png",
  "/home/featured-project/feature-1.jpg",
  "/home/featured-project/feature-2.jpg",
  "/home/featured-project/feature-3.jpg",
];

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

export function getInteriorProjectById(id: string): InteriorDetailProject | null {
  const item = INTERIOR_ITEMS.find((entry) => entry.id === id);
  if (!item) return null;

  const coverImage = resolveInteriorImage(item.image, item.gallery, item.image, 0);
  const gallery = buildInteriorGallery(coverImage, item.gallery);

  return {
    _id: item.id,
    title: item.title,
    detailTitle: item.detailTitle || item.title,
    description:
      item.detailDescription ||
      item.description ||
      INTERIOR_DETAIL_DEFAULT_DESCRIPTION,
    coverImage,
    gallery,
    category: item.category,
    isNew: item.isNew,
    narrativeOne: INTERIOR_NARRATIVE_ONE,
    narrativeTwo: INTERIOR_NARRATIVE_TWO,
  };
}

export function getRelatedInteriorProjects(
  id: string,
  category?: string,
  limit = 3
): InteriorDetailProject[] {
  return INTERIOR_ITEMS.filter(
    (item) => item.id !== id && (!category || item.category === category)
  )
    .slice(0, limit)
    .map((item, index) => {
      const coverImage = resolveInteriorImage(item.image, item.gallery, item.image, index);
      return {
        _id: item.id,
        title: item.title,
        detailTitle: item.detailTitle || item.title,
        description: item.detailDescription || item.description,
        coverImage,
        gallery: buildInteriorGallery(coverImage, item.gallery),
        category: item.category,
        isNew: item.isNew,
      };
    });
}

export function getInteriorBackHref(category?: string) {
  if (!category || category === "All") return "/interior";
  return `/interior?category=${encodeURIComponent(category)}`;
}

export function interiorStaticParams() {
  return INTERIOR_ITEMS.map((item) => ({ id: item.id }));
}
