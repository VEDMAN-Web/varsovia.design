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
  description: string;
  image: string;
  isNew: boolean;
  createdAt: string;
  shape: string;
  style: string;
  color: string;
  material: string;
  finish: string;
};

export type AdvancedFilters = {
  shapes: string[];
  styles: string[];
  colors: string[];
  materials: string[];
  finishes: string[];
};

export const EMPTY_FILTERS: AdvancedFilters = {
  shapes: [],
  styles: [],
  colors: [],
  materials: [],
  finishes: [],
};

export const FILTER_OPTIONS = {
  shapes: ["U Shape", "L Shape", "Straight", "Island", "Parallel"],
  styles: ["Modern", "Classic", "Minimal", "Contemporary", "Luxury"],
  colors: ["Black", "White", "Walnut", "Oak", "Grey", "Ivory"],
  materials: ["Wood", "Laminate", "Acrylic", "Stone", "Metal"],
  finishes: ["Matte", "Glossy", "Textured", "Soft Touch"],
} as const;

export const INTERIOR_CATEGORIES: InteriorCategory[] = [
  "All",
  "Kitchen",
  "Bedroom",
  "Bathroom",
  "Door & Windows",
  "Whole House Solutions",
  "Furniture",
];

export const CATEGORY_HERO: Record<InteriorCategory, { title: string; subtitle: string }> = {
  All: {
    title: "INTERIOR DESIGN",
    subtitle: "SPACES CRAFTED FOR THE WAY YOU LIVE",
  },
  Kitchen: {
    title: "KITCHEN INTERIOR",
    subtitle: "TIMELESS KITCHENS DESIGNED FOR MODERN LIVING",
  },
  Bedroom: {
    title: "BEDROOM INTERIOR",
    subtitle: "CALM RETREATS DESIGNED FOR REST AND COMFORT",
  },
  Bathroom: {
    title: "BATHROOM INTERIOR",
    subtitle: "SPA-LIKE BATHROOMS WITH LASTING FINISHES",
  },
  "Door & Windows": {
    title: "DOOR & WINDOWS",
    subtitle: "REFINED OPENINGS THAT FRAME YOUR HOME",
  },
  "Whole House Solutions": {
    title: "WHOLE HOUSE SOLUTIONS",
    subtitle: "COMPLETE INTERIORS FROM ENTRY TO EVERY ROOM",
  },
  Furniture: {
    title: "FURNITURE",
    subtitle: "CUSTOM PIECES MADE FOR EVERYDAY LIVING",
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
    category: "Kitchen",
    description: "Matte black cabinets with gold bar handles. Bold and dramatic.",
    image: "/Interior-kitchen/kitchen1.png",
    isNew: true,
    createdAt: "2026-06-01",
    shape: "U Shape",
    style: "Modern",
    color: "Black",
    material: "Acrylic",
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
    shape: "L Shape",
    style: "Classic",
    color: "Walnut",
    material: "Wood",
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
    style: "Luxury",
    color: "Ivory",
    material: "Acrylic",
    finish: "Glossy",
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
    style: "Minimal",
    color: "Grey",
    material: "Laminate",
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
    shape: "Parallel",
    style: "Contemporary",
    color: "Oak",
    material: "Wood",
    finish: "Textured",
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
    material: "Laminate",
    finish: "Soft Touch",
  },
  {
    id: "7",
    title: "Serene Nest",
    category: "Bedroom",
    description: "Soft neutrals and built-in wardrobes for a calm sleep space.",
    image: img(6),
    isNew: true,
    createdAt: "2026-05-15",
    shape: "Straight",
    style: "Minimal",
    color: "Ivory",
    material: "Wood",
    finish: "Matte",
  },
  {
    id: "8",
    title: "Linen Suite",
    category: "Bedroom",
    description: "Layered textures with a floating bed and warm lighting.",
    image: img(7),
    isNew: false,
    createdAt: "2026-02-22",
    shape: "L Shape",
    style: "Classic",
    color: "Oak",
    material: "Wood",
    finish: "Textured",
  },
  {
    id: "9",
    title: "Urban Loft Bedroom",
    category: "Bedroom",
    description: "Clean lines and clever storage for compact city homes.",
    image: img(8),
    isNew: false,
    createdAt: "2026-01-30",
    shape: "Straight",
    style: "Modern",
    color: "Grey",
    material: "Laminate",
    finish: "Matte",
  },
  {
    id: "10",
    title: "Velvet Haven",
    category: "Bedroom",
    description: "Soft velvet headboard with muted mauve finishes.",
    image: img(9),
    isNew: true,
    createdAt: "2026-06-05",
    shape: "U Shape",
    style: "Luxury",
    color: "Walnut",
    material: "Wood",
    finish: "Soft Touch",
  },
  {
    id: "11",
    title: "Spa Mist",
    category: "Bathroom",
    description: "Stone vanity, rain shower, and soft ambient lighting.",
    image: img(10),
    isNew: true,
    createdAt: "2026-05-02",
    shape: "Straight",
    style: "Minimal",
    color: "White",
    material: "Stone",
    finish: "Matte",
  },
  {
    id: "12",
    title: "Marble Retreat",
    category: "Bathroom",
    description: "Full marble cladding with brass fixtures and open shower.",
    image: img(11),
    isNew: false,
    createdAt: "2026-03-08",
    shape: "L Shape",
    style: "Luxury",
    color: "White",
    material: "Stone",
    finish: "Glossy",
  },
  {
    id: "13",
    title: "Compact Bath",
    category: "Bathroom",
    description: "Smart storage and pale finishes for smaller bathrooms.",
    image: img(0),
    isNew: false,
    createdAt: "2026-02-01",
    shape: "Straight",
    style: "Contemporary",
    color: "Grey",
    material: "Acrylic",
    finish: "Matte",
  },
  {
    id: "14",
    title: "Frame Light",
    category: "Door & Windows",
    description: "Slim aluminium frames that flood rooms with daylight.",
    image: img(1),
    isNew: true,
    createdAt: "2026-04-25",
    shape: "Straight",
    style: "Modern",
    color: "Black",
    material: "Metal",
    finish: "Matte",
  },
  {
    id: "15",
    title: "Heritage Door",
    category: "Door & Windows",
    description: "Solid wood doors with quiet modern hardware.",
    image: img(2),
    isNew: false,
    createdAt: "2026-01-14",
    shape: "Straight",
    style: "Classic",
    color: "Walnut",
    material: "Wood",
    finish: "Matte",
  },
  {
    id: "16",
    title: "Garden View",
    category: "Door & Windows",
    description: "Floor-to-ceiling openings connecting indoors to outdoors.",
    image: img(3),
    isNew: true,
    createdAt: "2026-05-30",
    shape: "Parallel",
    style: "Contemporary",
    color: "White",
    material: "Metal",
    finish: "Glossy",
  },
  {
    id: "17",
    title: "Complete Home Edit",
    category: "Whole House Solutions",
    description: "One cohesive palette from living to kitchen to bedrooms.",
    image: img(4),
    isNew: true,
    createdAt: "2026-06-12",
    shape: "U Shape",
    style: "Modern",
    color: "Oak",
    material: "Wood",
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
    shape: "L Shape",
    style: "Contemporary",
    color: "Ivory",
    material: "Laminate",
    finish: "Soft Touch",
  },
  {
    id: "19",
    title: "Apartment Refresh",
    category: "Whole House Solutions",
    description: "Full interior upgrade without losing usable space.",
    image: img(6),
    isNew: false,
    createdAt: "2026-02-10",
    shape: "Straight",
    style: "Minimal",
    color: "Grey",
    material: "Acrylic",
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
    shape: "Straight",
    style: "Luxury",
    color: "Grey",
    material: "Wood",
    finish: "Soft Touch",
  },
  {
    id: "21",
    title: "Dining Set",
    category: "Furniture",
    description: "Solid wood table with soft upholstered chairs.",
    image: img(8),
    isNew: false,
    createdAt: "2026-01-20",
    shape: "Straight",
    style: "Classic",
    color: "Oak",
    material: "Wood",
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
    shape: "Straight",
    style: "Modern",
    color: "Walnut",
    material: "Wood",
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
    shape: "Straight",
    style: "Contemporary",
    color: "Ivory",
    material: "Wood",
    finish: "Textured",
  },
  {
    id: "24",
    title: "Oak Sideboard",
    category: "Furniture",
    description: "Natural oak grain with soft-close cabinetry.",
    image: img(11),
    isNew: true,
    createdAt: "2026-06-08",
    shape: "Straight",
    style: "Minimal",
    color: "Oak",
    material: "Wood",
    finish: "Matte",
  },
];

export type SortOption = "all" | "newest" | "oldest" | "name-asc" | "name-desc";

function matchesList(selected: string[], value: string) {
  return selected.length === 0 || selected.includes(value);
}

export function filterAndSortItems(
  items: InteriorItem[],
  category: InteriorCategory,
  sortBy: SortOption,
  filters: AdvancedFilters = EMPTY_FILTERS
) {
  let list = items.filter((item) => {
    const catOk = category === "All" || item.category === category;
    return (
      catOk &&
      matchesList(filters.shapes, item.shape) &&
      matchesList(filters.styles, item.style) &&
      matchesList(filters.colors, item.color) &&
      matchesList(filters.materials, item.material) &&
      matchesList(filters.finishes, item.finish)
    );
  });

  switch (sortBy) {
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
    case "name-asc":
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "name-desc":
      list = [...list].sort((a, b) => b.title.localeCompare(a.title));
      break;
    default:
      break;
  }

  return list;
}

export function countActiveFilters(filters: AdvancedFilters) {
  return (
    filters.shapes.length +
    filters.styles.length +
    filters.colors.length +
    filters.materials.length +
    filters.finishes.length
  );
}
