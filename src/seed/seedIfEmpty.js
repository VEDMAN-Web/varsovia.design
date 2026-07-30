const Product = require("../models/Product");
const Project = require("../models/Project");
const Testimonial = require("../models/Testimonial");
const Catalogue = require("../models/Catalogue");
const Partner = require("../models/Partner");
const Showroom = require("../models/Showroom");
const Showcase = require("../models/Showcase");
const SiteContent = require("../models/SiteContent");
const Blog = require("../models/Blog");
const TeamMember = require("../models/TeamMember");
const FAQ = require("../models/FAQ");

/** Backfill category on projects seeded before this field existed */
const CATEGORY_BY_SLUG = {
  "kitchen-cabinet": "Kitchen",
  "modern-island": "Kitchen",
  "warm-walnut": "Kitchen",
  "ivory-luxe": "Bedroom",
  "graphite-studio": "Bathroom",
  "coastal-oak": "Door & Windows",
  "midnight-suite": "Whole House Solutions",
  "open-living": "Furniture",
};

async function migrateProjectCategories() {
  for (const [slug, category] of Object.entries(CATEGORY_BY_SLUG)) {
    await Project.updateOne({ slug }, { $set: { category } });
  }

  const result = await Project.updateMany(
    {
      $or: [{ category: { $exists: false } }, { category: null }, { category: "" }],
    },
    { $set: { category: "Kitchen" } }
  );

  if (result.modifiedCount > 0) {
    console.log(`Backfilled category on ${result.modifiedCount} project(s)`);
  }

  // Backfill interiorCatalog flag so existing projects appear in interior listing
  const migrated = await Project.updateMany(
    { interiorCatalog: { $exists: false } },
    { $set: { interiorCatalog: true } }
  );
  if (migrated.modifiedCount > 0) {
    console.log(`Backfilled interiorCatalog on ${migrated.modifiedCount} project(s)`);
  }
}

const LOCAL = {
  hero: "/home/home-front-page.png",
  about1: "/home/about-1.png",
  about2: "/home/about-2.png",
  about3: "/home/about-3.png",
  stats: "/home/counting.png",
  product1: "/home/product/product-1.png",
  product2: "/home/product/product-2.png",
  product3: "/home/product/product-3.jpg",
  catalogue1: "/home/catalog.png",
  catalogue2: "/home/catalog-1.jpg",
  catalogue3: "/home/catalog-2.png",
  catalogue4: "/home/catalog-3.png",
  catalogue5: "/home/catalog-4.png",
  project1: "/home/featured-project/feature-1.jpg",
  project2: "/home/featured-project/feature-2.jpg",
  project3: "/home/featured-project/feature-3.jpg",
  project4: "/home/featured-project/feature-4.jpg",
  project5: "/home/featured-project/feature-5.jpg",
  project6: "/home/featured-project/feature-6.jpg",
  project7: "/home/featured-project/feature-7.png",
  project8: "/home/featured-project/feature-8.png",
  contact1: "/home/featured-project/feature-1.jpg",
  contact2: "/home/about-1.png",
  contact3: "/home/featured-project/feature-3.jpg",
  contact4: "/home/featured-project/feature-4.jpg",
  showroom1: "/home/about-1.png",
  showroom2: "/home/about-2.png",
  showroom3: "/home/about-3.png",
  team: "/team/team.png",
  blog: "/blog/blog1.png",
};

async function seedIfEmpty() {
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log("Database already seeded");
    await migrateProjectCategories();
    return;
  }

  console.log("Seeding Varsovia Kitchen data...");

  await SiteContent.create({
    key: "main",
    heroEyebrow: "VARSOVIA DESIGN",
    heroHeadline: "CHOOSE FROM A RANGE OF HIGH-QUALITY MODULAR KITCHENS.",
    heroSubtitle: "",
    heroImage: LOCAL.hero,
    heroPrimaryCtaLabel: "Explore Kitchens",
    heroPrimaryCtaHref: "#products",
    heroSecondaryCtaLabel: "Free Consultation",
    heroSecondaryCtaHref: "#contact",
    aboutTitle: "ABOUT VARSOVIA",
    aboutText:
      "Varsovia started in a rented one-room studio in Warsaw's Praga district, with a simple belief: a beautiful room only earns that word once someone has lived in it for a year and still loves it.",
    aboutImages: [LOCAL.about1, LOCAL.about2, LOCAL.about3, LOCAL.project5],
    stats: [
      { value: "+12", label: "Years Experience" },
      { value: "+140", label: "Projects Completed" },
      { value: "+6", label: "Cities Served" },
    ],
    statsImage: LOCAL.stats,
    aboutIntro:
      "At Varsovia Design, we believe every space tells a story. We specialize in creating elegant, functional, and personalized interiors that reflect your lifestyle.",
    aboutStory:
      "Founded with a passion for thoughtful design and exceptional craftsmanship, Varsovia Design has grown into a trusted name in premium interior solutions.",
    aboutHeroSubtitle: "TWELVE YEARS OF ROOMS BUILT TO LAST",
    vision: {
      title: "Our Vision",
      text: "To become a leading interior design brand known for creating inspiring spaces that enrich everyday living through innovation, quality, and timeless design.",
    },
    mission: {
      title: "Our Mission",
      text: "To deliver personalized interior solutions with exceptional craftsmanship, premium materials, and a seamless customer experience from concept to completion.",
    },
    values: {
      title: "Our Values",
      text: "Great interiors begin with quality, creativity, trust, and innovation. We design and craft spaces tailored to your lifestyle.",
    },
    processSteps: [
      { step: "01", title: "Consultation", text: "Understanding your lifestyle, needs, and design preferences." },
      { step: "02", title: "Planning & Design", text: "Creating layouts, concepts, material selections, and realistic 3D visualizations." },
      { step: "03", title: "Execution", text: "Expert craftsmanship, timely delivery, and professional installation." },
    ],
    contactImages: [LOCAL.contact1, LOCAL.contact2, LOCAL.contact3, LOCAL.contact4, LOCAL.project5, LOCAL.about2, LOCAL.project7],
    footerBio:
      "Varsovia Kitchen designs and builds premium modular kitchens with precision, warmth, and lasting quality.",
    phone: "+66 64 683 9777",
    email: "hi@thailandkitchens.com",
    address: "Route 4169, Mae Nam, Amphoe Ko Samui, Surat Thani 84330",
  });

  await Product.insertMany([
    {
      title: "Kitchen Cabinet",
      slug: "kitchen-cabinet",
      description: "Our kitchen cabinets combine timeless design, premium materials, and practical functionality.",
      image: LOCAL.product1,
      category: "Kitchen",
      order: 1,
    },
    {
      title: "Bedroom Interior",
      slug: "bedroom-interior",
      description: "Soft lighting, tailored storage, and calm materials come together in bedrooms designed for rest.",
      image: LOCAL.product2,
      category: "Bedroom",
      order: 2,
    },
    {
      title: "Bedroom Suite",
      slug: "bedroom-suite",
      description: "From wardrobes to bedside finishes, our bedroom interiors balance quiet luxury with everyday ease.",
      image: LOCAL.product3,
      category: "Bedroom",
      order: 3,
    },
  ]);

  await Project.insertMany([
    { title: "Kitchen Cabinet", slug: "kitchen-cabinet", description: "Warm open-plan kitchen with island seating.", location: "Mumbai", coverImage: LOCAL.project1, gallery: [LOCAL.project1, LOCAL.project2], category: "Kitchen", order: 1 },
    { title: "Modern Island", slug: "modern-island", description: "Compact luxury with full-height storage.", location: "Pune", coverImage: LOCAL.project2, gallery: [LOCAL.project2, LOCAL.project3], category: "Kitchen", order: 2 },
    { title: "Warm Walnut", slug: "warm-walnut", description: "Rich walnut tones with marble accents.", location: "Bangalore", coverImage: LOCAL.project3, gallery: [LOCAL.project3], category: "Kitchen", order: 3 },
    { title: "Ivory Luxe", slug: "ivory-luxe", description: "Bright ivory finishes with soft ambient lighting.", location: "Ahmedabad", coverImage: LOCAL.project4, gallery: [LOCAL.project4], category: "Bedroom", order: 4 },
    { title: "Graphite Studio", slug: "graphite-studio", description: "Dark graphite palette with brass hardware.", location: "Delhi", coverImage: LOCAL.project5, gallery: [LOCAL.project5], category: "Bathroom", order: 5 },
    { title: "Coastal Oak", slug: "coastal-oak", description: "Light oak with coastal-inspired tones.", location: "Goa", coverImage: LOCAL.project6, gallery: [LOCAL.project6], category: "Door & Windows", order: 6 },
    { title: "Midnight Suite", slug: "midnight-suite", description: "Deep tones with layered textures.", location: "Hyderabad", coverImage: LOCAL.project7, gallery: [LOCAL.project7], category: "Whole House Solutions", order: 7 },
    { title: "Open Living", slug: "open-living", description: "Open kitchen and living integration.", location: "Chennai", coverImage: LOCAL.project8, gallery: [LOCAL.project8], category: "Furniture", order: 8 },
  ]);

  await Catalogue.insertMany([
    { title: "Classic Collection 2026", coverImage: LOCAL.catalogue1, order: 1 },
    { title: "Modern Living 2026", coverImage: LOCAL.catalogue2, order: 2 },
    { title: "Explore Modern Design", coverImage: LOCAL.catalogue3, order: 3 },
    { title: "Warm Neutrals", coverImage: LOCAL.catalogue4, order: 4 },
    { title: "Urban Kitchens", coverImage: LOCAL.catalogue5, order: 5 },
  ]);

  await Testimonial.insertMany([
    { name: "Ananya Mehta", role: "Homeowner, Mumbai", quote: "Varsovia transformed our outdated kitchen into a calm, beautiful space we actually love cooking in every day.", rating: 5, image: LOCAL.team, order: 1 },
    { name: "Rohan Kapoor", role: "Architect Partner", quote: "Their attention to detail and finish quality is exceptional. Clients always notice the difference.", rating: 5, image: LOCAL.team, order: 2 },
    { name: "Priya Shah", role: "Homeowner, Bangalore", quote: "From consultation to installation, the team was thoughtful, precise, and a pleasure to work with.", rating: 5, image: LOCAL.team, order: 3 },
  ]);

  await Showroom.insertMany([
    { name: "Varsovia Flagship", location: "Bandra, Mumbai", image: LOCAL.showroom1, address: "42 Linking Road, Bandra West", order: 1 },
    { name: "Design Studio", location: "Koregaon Park, Pune", image: LOCAL.showroom2, address: "18 North Main Road", order: 2 },
    { name: "Experience Centre", location: "Indiranagar, Bangalore", image: LOCAL.showroom3, address: "100 Feet Road, Indiranagar", order: 3 },
  ]);

  await Partner.insertMany([
    { name: "Hettich", logo: "text", order: 1 },
    { name: "Blum", logo: "text", order: 2 },
    { name: "Häfele", logo: "text", order: 3 },
    { name: "Bosch", logo: "text", order: 4 },
    { name: "Siemens", logo: "text", order: 5 },
    { name: "Grohe", logo: "text", order: 6 },
  ]);

  await Blog.insertMany(
    Array.from({ length: 6 }, (_, i) => ({
      title: "Top Trends Transforming Modern Interior Design Showrooms in 2026",
      excerpt: "For entrepreneurs, dealers, and showroom investors looking to transform modern showrooms, keeping up with design updates is essential for...",
      content: "Interior design continues to evolve with changing lifestyles and modern living needs. In 2026, homeowners are embracing spaces that are elegant, functional, and personalized.",
      date: "12 Jun 2026",
      readTime: "4 min",
      author: { name: "Courtney Henry", avatar: LOCAL.team },
      image: LOCAL.blog,
      views: 31,
      order: i + 1,
    }))
  );

  const italianMembers = Array.from({ length: 3 }, (_, i) => ({
    name: "John Smith",
    role: "Founder & Creative Director",
    image: LOCAL.team,
    teamType: "Italian",
    order: i + 1,
  }));
  const hqMembers = Array.from({ length: 3 }, (_, i) => ({
    name: "John Smith",
    role: "Founder & Creative Director",
    image: LOCAL.team,
    teamType: "Headquarter",
    order: i + 1,
  }));
  await TeamMember.insertMany([...italianMembers, ...hqMembers]);

  await FAQ.insertMany([
    { question: "Do you provide customized modular kitchens?", answer: "Yes. Every kitchen is custom-designed to match your space, cooking habits, and style preferences.", category: "Kitchen Interior", order: 1 },
    { question: "Which materials do you use for kitchen cabinets?", answer: "We use high-grade water-resistant plywood, MDF, and particle boards with acrylic, laminate, or PU finishes.", category: "Kitchen Interior", order: 2 },
    { question: "Can I choose colors and finishes?", answer: "Absolutely! We offer a wide range of colors and finishes, from matte and glossy acrylics to textured wood veneers.", category: "Kitchen Interior", order: 3 },
    { question: "How long does a kitchen installation take?", answer: "Typically, modular kitchen fabrication takes 3 to 4 weeks at our facility, and on-site assembly takes 3 to 5 days.", category: "Kitchen Interior", order: 4 },
    { question: "Do modular kitchens come with a warranty?", answer: "Yes, our modular kitchens come with a 5-year warranty covering manufacturing defects and hardware performance.", category: "Kitchen Interior", order: 5 },
    { question: "What bedroom storage options do you offer?", answer: "We design custom wardrobes, walk-in closets, under-bed storage, loft spaces, and integrated dressing tables.", category: "Bedroom Interior", order: 6 },
    { question: "Can you design a wardrobe to fit a specific niche?", answer: "Yes, all our wardrobes are tailored to fit your bedroom layout, wall niches, and ceiling heights exactly.", category: "Bedroom Interior", order: 7 },
    { question: "Which finishes are best for wardrobes?", answer: "Laminates are durable and easy to maintain, while mirrors and glass sliders make smaller bedrooms feel larger.", category: "Bedroom Interior", order: 8 },
  ]);

  // Seed Showcases — 6 items per main category tab
  const SHOWCASE_FALLBACK_IMAGES = [
    LOCAL.project1, LOCAL.project2, LOCAL.project3,
    LOCAL.project4, LOCAL.project5, LOCAL.project6,
  ];
  const SHOWCASE_CATEGORIES = [
    "Home case", "Commercial Project", "Europe",
    "Asia", "North America", "Middle East",
  ];
  const showcaseDocs = [];
  SHOWCASE_CATEGORIES.forEach((cat, ci) => {
    for (let i = 0; i < 4; i++) {
      showcaseDocs.push({
        title: `Custom Interior Project in ${cat} ${i + 1}`,
        category: cat,
        image: SHOWCASE_FALLBACK_IMAGES[(ci * 4 + i) % SHOWCASE_FALLBACK_IMAGES.length],
        location: cat,
        typeLabel: "Type",
        typeValue: ci % 2 === 0 ? "Villa(1 Floor)" : "Apartment",
        supplyArea: "Kitchen, Bedroom, Living Room",
        gallery: [
          SHOWCASE_FALLBACK_IMAGES[(ci * 4 + i) % SHOWCASE_FALLBACK_IMAGES.length],
          SHOWCASE_FALLBACK_IMAGES[(ci * 4 + i + 1) % SHOWCASE_FALLBACK_IMAGES.length],
          SHOWCASE_FALLBACK_IMAGES[(ci * 4 + i + 2) % SHOWCASE_FALLBACK_IMAGES.length],
        ],
        order: ci * 4 + i + 1,
      });
    }
  });
  await Showcase.insertMany(showcaseDocs);

  console.log("Seed complete");
  await migrateProjectCategories();
}

module.exports = seedIfEmpty;
