/**
 * Enrich Varsovia local DB with full Group A + CMS test coverage.
 * Usage: node src/seed/enrichFullTestData.js
 * Requires API running (default http://127.0.0.1:5001) and ADMIN_KEY in .env
 */
require("dotenv").config();

const API = (process.env.TEST_API_URL || "http://127.0.0.1:5001/api").replace(/\/$/, "");
const KEY = process.env.ADMIN_KEY;

if (!KEY) {
  console.error("Missing ADMIN_KEY");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "x-admin-key": KEY,
};

function L(en, th = "", pl = "") {
  return { en, th: th || en, pl: pl || en };
}

async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status} ${JSON.stringify(json.error || json)}`);
  }
  return json.data;
}

function fillChild(child, hubLabel) {
  const title = child.title?.en || child.title || child.slug;
  const slug = child.slug;
  return {
    ...child,
    title: typeof child.title === "object" ? child.title : L(String(title)),
    metaTitle: L(`${String(title).slice(0, 40)} | Varsovia`.slice(0, 60)),
    metaDescription: L(
      `Explore ${title} with Varsovia Design — premium interiors and furniture craftsmanship in Thailand.`.slice(
        0,
        160,
      ),
    ),
    hero: {
      ...(child.hero || {}),
      title: L(String(title)),
      subtitle: L(`Test copy for ${hubLabel} → ${title}. Edit this in Admin → IA.`),
      ctaLabel: L("Get a consultation"),
      ctaHref: "/contact",
      image: child.hero?.image || "",
    },
    body: L(
      `${title} — seeded test body for Varsovia Group A QA.\n\nKeep indexable=false until real photos and copy exist (content gate).`,
    ),
    indexable: false,
    order: child.order ?? 0,
    slug,
  };
}

function fillHub(hub, label) {
  const title = hub.hero?.title?.en || hub.slug || label;
  return {
    ...hub,
    indexable: false,
    metaTitle: L(`${label} | Varsovia Design`.slice(0, 60)),
    metaDescription: L(
      `${label} hub page for Varsovia Design — seeded for full local QA of IA routes, meta, and sitemap.`.slice(
        0,
        160,
      ),
    ),
    hero: {
      ...(hub.hero || {}),
      title: L(String(title)),
      subtitle: L(`Seeded ${label} hub for end-to-end testing.`),
      ctaLabel: L("Get a consultation"),
      ctaHref: "/contact",
      image: hub.hero?.image || "",
    },
    body: L(
      `${label} hub — seeded test body.\n\nUse Admin → Varsovia → IA · ${label} to edit. Children below should all render with related modules where applicable.`,
    ),
    children: Array.isArray(hub.children)
      ? hub.children.map((c) => fillChild(c, label))
      : [],
  };
}

const EXTRA_BLOGS = [
  {
    title: L("Furniture Layouts That Feel Effortless"),
    excerpt: L("Practical furniture planning tips for villas and condos."),
    content: L("Seeded journal article for the Furniture topic."),
    category: "furniture",
    date: "2026-03-01",
    readTime: L("4 min"),
    author: { name: L("Varsovia Studio") },
    image: "/home/blog/blog-1.jpg",
    visible: true,
    order: 10,
  },
  {
    title: L("Villa Guides: Designing for Tropical Light"),
    excerpt: L("How to plan villa interiors around Thai sunlight and airflow."),
    content: L("Seeded journal article for the Villa Guides topic."),
    category: "villa-guides",
    date: "2026-03-08",
    readTime: L("5 min"),
    author: { name: L("Varsovia Studio") },
    image: "/home/blog/blog-1.jpg",
    visible: true,
    order: 11,
  },
  {
    title: L("Thailand Living: Calm Homes for Everyday Rituals"),
    excerpt: L("Materials and layouts that suit life in Thailand."),
    content: L("Seeded journal article for the Thailand Living topic."),
    category: "thailand-living",
    date: "2026-03-15",
    readTime: L("6 min"),
    author: { name: L("Varsovia Studio") },
    image: "/home/blog/blog-1.jpg",
    visible: true,
    order: 12,
  },
  {
    title: L("[Hidden] Draft article for visibility QA"),
    excerpt: L("Should not appear on public journal when visible=false."),
    content: L("Hidden blog used to test visible checkbox."),
    category: "materials",
    date: "2026-01-01",
    readTime: L("1 min"),
    author: { name: L("QA Bot") },
    image: "/home/blog/blog-1.jpg",
    visible: false,
    order: 99,
  },
];

async function main() {
  console.log(`Enriching via ${API}`);

  const site = await api("GET", "/site");
  const pages = site.pages || {};

  const nextPages = {
    furniture: fillHub(pages.furniture || { slug: "furniture", children: [] }, "Furniture"),
    interiorDesign: fillHub(
      pages.interiorDesign || { slug: "interior-design", children: [] },
      "Interior Design",
    ),
    completeInteriors: fillHub(
      pages.completeInteriors || { slug: "complete-interiors", children: [] },
      "Complete Interiors",
    ),
    services: fillHub(pages.services || { slug: "services", children: [] }, "Services"),
    locations: fillHub(pages.locations || { slug: "locations", children: [] }, "Locations"),
    forDevelopers: fillHub(
      pages.forDevelopers || { slug: "for-developers", children: [] },
      "For Developers",
    ),
    journal: fillHub(pages.journal || { slug: "journal", children: [] }, "Journal"),
    aboutBrand: fillHub(pages.aboutBrand || { slug: "about", children: [] }, "About brands"),
  };

  await api("PUT", "/site", {
    pages: nextPages,
    projectsPage: {
      indexable: false,
      metaTitle: L("Projects"),
      metaDescription: L(
        "Explore Varsovia Design projects across kitchens, bedrooms, and whole-home interiors.",
      ),
      heroTitle: L("Our Projects"),
      heroSubtitle: L("Every space, every story — seeded for QA"),
    },
    sectionCopy: {
      ...(site.sectionCopy || {}),
      featured: {
        title: L("Featured Projects"),
        subtitle: L("Designed to inspire. Built to last"),
      },
      catalogue: {
        title: L("Free Catalogue"),
        subtitle: L("Download our latest lookbook"),
      },
      products: {
        title: L("Our Products"),
        subtitle: L("Kitchens, bedrooms, and more"),
      },
      testimonials: {
        title: L("Client Stories"),
        subtitle: L("What homeowners say about Varsovia"),
      },
      coreStrengths: {
        title: L("Core Strengths"),
        subtitle: L("Why clients choose Varsovia"),
      },
      partners: {
        title: L("Our Partners"),
        subtitle: L("Trusted brands and collaborators"),
      },
      contact: {
        title: L("Contact Us"),
        subtitle: L("Tell us about your project"),
      },
    },
  });
  console.log("✓ Site IA hubs + projectsPage + sectionCopy");

  // Tag existing blogs across topics (preserve dedicated topic articles)
  const blogs = await api("GET", "/blogs");
  const PRESERVE_TOPICS = new Set([
    "furniture",
    "villa-guides",
    "thailand-living",
    "materials",
    "kitchens",
    "interior-design",
  ]);
  const topicCycle = ["kitchens", "interior-design", "materials", "furniture", "villa-guides", "thailand-living"];
  for (let i = 0; i < blogs.length; i++) {
    const b = blogs[i];
    const current =
      typeof b.category === "string" ? b.category : b.category?.en || "";
    if (PRESERVE_TOPICS.has(String(current).toLowerCase())) continue;
    await api("PUT", `/blogs/${b._id}`, {
      category: topicCycle[i % topicCycle.length],
      visible: b.visible !== false,
    });
  }
  console.log(`✓ Tagged blogs (preserved known topics)`);

  // Add missing topic blogs + one hidden
  const titles = new Set(
    blogs.map((b) => (typeof b.title === "string" ? b.title : b.title?.en || "")),
  );
  for (const blog of EXTRA_BLOGS) {
    const t = blog.title.en;
    if ([...titles].some((x) => x.includes(t.slice(0, 20)))) {
      // Ensure category sticks for seeded topic articles
      const existing = blogs.find((b) => {
        const title = typeof b.title === "string" ? b.title : b.title?.en || "";
        return title.includes(t.slice(0, 20));
      });
      if (existing) {
        await api("PUT", `/blogs/${existing._id}`, {
          category: blog.category,
          visible: blog.visible !== false,
        });
      }
      continue;
    }
    await api("POST", "/blogs", blog);
    console.log(`✓ Created blog: ${t}`);
  }

  // Force-set topic categories by title match for EXTRA set
  const blogsAfter = await api("GET", "/blogs");
  for (const blog of EXTRA_BLOGS) {
    const match = blogsAfter.find((b) => {
      const title = typeof b.title === "string" ? b.title : b.title?.en || "";
      return title.includes(blog.title.en.slice(0, 20));
    });
    if (match) {
      await api("PUT", `/blogs/${match._id}`, {
        category: blog.category,
        visible: blog.visible !== false,
      });
    }
  }
  console.log("✓ Ensured EXTRA blog topic categories");

  // Furniture IA tags + geo locations on showcases (Group A cross-linking)
  const FURNITURE_CYCLE = [
    "kitchens",
    "wardrobes",
    "living-room",
    "bedrooms",
    "bathroom",
    "dining",
    "doors",
    "whole-house",
  ];
  const LOCATION_CYCLE = [
    "Koh Samui",
    "Phuket",
    "Bangkok",
    "Pattaya",
    "Hua Hin",
    "Chiang Mai",
  ];
  const showcases = await api("GET", "/showcases");
  for (let i = 0; i < showcases.length; i++) {
    const s = showcases[i];
    const furnitureSlug = FURNITURE_CYCLE[i % FURNITURE_CYCLE.length];
    const location = LOCATION_CYCLE[i % LOCATION_CYCLE.length];
    const patch = {
      furnitureSlug,
      location: L(location),
      visible: i !== 1,
      ...(i === 1 ? { title: L("[Hidden] Showcase visibility QA") } : {}),
    };
    await api("PUT", `/showcases/${s._id}`, patch);
  }
  console.log(`✓ Tagged ${showcases.length} showcases with furnitureSlug + location`);

  // Align project locations for location-page matching QA
  const projects = await api("GET", "/projects").catch(() => []);
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    await api("PUT", `/projects/${p._id}`, {
      location: L(LOCATION_CYCLE[i % LOCATION_CYCLE.length]),
    }).catch(() => null);
  }
  if (projects.length) console.log(`✓ Updated ${projects.length} project locations`);

  const faqs = await api("GET", "/faqs");
  if (faqs[0]) await api("PUT", `/faqs/${faqs[0]._id}`, { visible: true, category: L("General") });
  if (faqs[1]) {
    await api("PUT", `/faqs/${faqs[1]._id}`, {
      visible: false,
      question: L("[Hidden] FAQ visibility QA"),
    });
    console.log("✓ One FAQ set visible=false");
  }

  const testimonials = await api("GET", "/testimonials");
  if (testimonials[1]) {
    await api("PUT", `/testimonials/${testimonials[1]._id}`, {
      visible: false,
      name: L("[Hidden] Testimonial QA"),
    });
    console.log("✓ One testimonial set visible=false");
  }

  const strengths = await api("GET", "/core-strengths");
  if (strengths[0]) {
    await api("PUT", `/core-strengths/${strengths[0]._id}`, {
      title: L("Seeded Core Strength"),
      description: L("Editable core strength used for admin → site QA."),
      visible: true,
    });
    console.log("✓ Core strength sample updated");
  }

  const partners = await api("GET", "/partners");
  if (partners[0]) {
    await api("PUT", `/partners/${partners[0]._id}`, {
      visible: true,
      name: L(partners[0].name?.en || partners[0].name || "Partner QA"),
    });
  }

  // Summary
  const afterBlogs = await api("GET", "/blogs");
  const publicBlogs = afterBlogs.filter((b) => b.visible !== false);
  const siteAfter = await api("GET", "/site");
  const iaKeys = Object.keys(siteAfter.pages || {});
  console.log("\n=== QA DATA READY ===");
  console.log(`Blogs total=${afterBlogs.length} public=${publicBlogs.length}`);
  console.log(
    `Blog topics: ${[
      ...new Set(afterBlogs.map((b) => (typeof b.category === "string" ? b.category : b.category?.en))),
    ].join(", ")}`,
  );
  console.log(`IA hubs: ${iaKeys.join(", ")}`);
  console.log(`projectsPage: ${siteAfter.projectsPage?.metaTitle?.en || siteAfter.projectsPage?.metaTitle}`);
  console.log("Open http://127.0.0.1:3000/en and admin http://127.0.0.1:3001/varsovia");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
