export type HomeProduct = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  gallery: string[];
  features: string[];
  specs: { label: string; value: string }[];
};

export const HOME_PRODUCTS: HomeProduct[] = [
  {
    slug: "kitchen-cabinet",
    title: "Kitchen Cabinet",
    category: "Kitchen",
    shortDescription:
      "Our kitchen cabinets are thoughtfully crafted to combine timeless design, premium materials, and practical functionality, creating beautifully organized spaces that reflect your lifestyle and stand the test of time.",
    fullDescription:
      "Varsovia kitchen cabinets are built for the way you cook, gather, and live. From soft-close storage to carefully chosen finishes, every detail is measured for lasting beauty and everyday ease. Whether you prefer a bold modern look or warm classic tones, we tailor layouts, materials, and hardware to your home.",
    image: "/home/product/product-1.png",
    gallery: [
      "/home/product/product-1.png",
      "/home/about-1.png",
      "/home/catalog.png",
      "/home/counting.png",
    ],
    features: [
      "Custom layouts for L, U, Island & Parallel kitchens",
      "Premium soft-close hardware",
      "Durable finishes that age gracefully",
      "Integrated appliance planning",
    ],
    specs: [
      { label: "Style", value: "Modern / Classic" },
      { label: "Material", value: "Wood, Acrylic, Laminate" },
      { label: "Finish", value: "Matte / Glossy / Soft Touch" },
      { label: "Warranty", value: "5 Years" },
    ],
  },
  {
    slug: "bedroom-interior",
    title: "Bedroom Interior",
    category: "Bedroom",
    shortDescription:
      "Soft lighting, tailored storage, and calm materials come together in bedrooms designed for rest — every detail measured for comfort, clarity, and lasting beauty.",
    fullDescription:
      "Our bedroom interiors are designed as quiet retreats. Built-in wardrobes, soft lighting layers, and calm material palettes create spaces that feel restful from the first evening. Every piece is planned around how you start and end your day.",
    image: "/home/product/product-2.png",
    gallery: [
      "/home/product/product-2.png",
      "/home/about-2.png",
      "/home/catalog-2.png",
      "/home/about-3.png",
    ],
    features: [
      "Floor-to-ceiling wardrobe systems",
      "Warm layered lighting",
      "Soft, durable fabrics and finishes",
      "Clutter-free storage planning",
    ],
    specs: [
      { label: "Style", value: "Minimal / Luxury" },
      { label: "Material", value: "Wood & Soft Laminate" },
      { label: "Finish", value: "Matte / Soft Touch" },
      { label: "Warranty", value: "5 Years" },
    ],
  },
  {
    slug: "bedroom-suite",
    title: "Bedroom Interior",
    category: "Bedroom",
    shortDescription:
      "From wardrobes to bedside finishes, our bedroom interiors balance quiet luxury with everyday ease, shaped around how you actually live.",
    fullDescription:
      "This bedroom suite blends quiet luxury with practical storage. Wardrobes, bedside compositions, and finishing details are crafted as one language — so the room feels complete, calm, and uniquely yours.",
    image: "/home/product/product-3.jpg",
    gallery: [
      "/home/product/product-3.jpg",
      "/home/catalog-3.png",
      "/home/about-1.png",
      "/home/home-front-page.png",
    ],
    features: [
      "Cohesive suite design",
      "Hidden storage solutions",
      "Custom bedside detailing",
      "Balanced lighting plan",
    ],
    specs: [
      { label: "Style", value: "Contemporary" },
      { label: "Material", value: "Wood & Acrylic" },
      { label: "Finish", value: "Matte / Textured" },
      { label: "Warranty", value: "5 Years" },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return HOME_PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(slug: string) {
  return HOME_PRODUCTS.filter((p) => p.slug !== slug);
}
