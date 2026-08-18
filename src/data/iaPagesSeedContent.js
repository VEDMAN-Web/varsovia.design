/** IA hub seed copy + images. Shared by defaults merge and populate script. */
function L(en, th = "", pl = "") {
  return { en, th: th || en, pl: pl || en };
}

const IMG = {
  hero: "/home/hero.jpg",
  f1: "/home/featured/feature-1.jpg",
  f2: "/home/featured/feature-2.jpg",
  f3: "/home/featured/feature-3.jpg",
  f4: "/home/featured/feature-4.jpg",
  f5: "/home/featured/feature-5.jpg",
  f6: "/home/featured/feature-6.jpg",
  f7: "/home/featured/feature-7.jpg",
  f8: "/home/featured/feature-8.jpg",
  c1: "/home/core/core-1.jpg",
  c2: "/home/core/core-2.jpg",
  c3: "/home/core/core-3.jpg",
  c4: "/home/core/core-4.jpg",
  c5: "/home/core/core-5.jpg",
  c6: "/home/core/core-6.jpg",
  p1: "/home/product/product-1.jpg",
  p2: "/home/product/product-2.jpg",
  p3: "/home/product/product-3.jpg",
  k1: "/Interior-kitchen/kitchen1.jpg",
  k2: "/Interior-kitchen/kitchen2.jpg",
  a1: "/home/about-1.jpg",
  a2: "/home/about-2.jpg",
  a3: "/home/about-3.jpg",
  s1: "/home/stories/story-1.jpg",
  s2: "/home/stories/story-2.jpg",
  s3: "/home/stories/story-3.jpg",
  contact1: "/home/contact/contact-1.jpg",
  contact2: "/home/contact/contact-2.jpg",
  contact3: "/home/contact/contact-3.jpg",
  contact4: "/home/contact/contact-4.jpg",
  contact5: "/home/contact/contact-5.jpg",
  contact6: "/home/contact/contact-6.jpg",
  blog: "/blog/blog1.jpg",
  team: "/team/team.jpg",
};

const LOC_AFFINITY = {
  "custom-furniture": ["koh-samui", "phuket", "bangkok", "pattaya", "hua-hin", "chiang-mai"],
  "interior-design": ["koh-samui", "phuket", "bangkok", "hua-hin", "chiang-mai"],
  "furniture-packages": ["koh-samui", "phuket", "pattaya", "hua-hin", "chiang-mai"],
  installation: ["koh-samui", "phuket", "bangkok", "pattaya", "hua-hin", "chiang-mai"],
  renovation: ["phuket", "bangkok", "pattaya", "chiang-mai"],
};

function clip(s, n) {
  const t = String(s || "").trim();
  return t.length <= n ? t : `${t.slice(0, n - 1).trim()}…`;
}

function hub({ slug, title, subtitle, body, image, metaTitle, metaDescription, children, sections, exploreTitle, exploreSubtitle, servicesTitle, servicesSubtitle }) {
  return {
    slug,
    indexable: false,
    metaTitle: L(clip(metaTitle || `${title} | Varsovia Design`, 60)),
    metaDescription: L(
      clip(
        metaDescription ||
          `${title} from Varsovia Design — thoughtfully designed interiors and furniture for homes across Thailand.`,
        160,
      ),
    ),
    hero: {
      title: L(title),
      subtitle: L(subtitle || ""),
      image: image || IMG.hero,
      ctaLabel: L("Get a consultation"),
      ctaHref: "/contact",
    },
    body: L(body || ""),
    sections: Array.isArray(sections) ? sections : [],
    exploreTitle: L(exploreTitle || "Explore"),
    exploreSubtitle: L(exploreSubtitle || "Choose a focus area to continue."),
    servicesTitle: L(servicesTitle || "Services in this location"),
    servicesSubtitle: L(servicesSubtitle || "How we support homes and projects here."),
    children: children || [],
  };
}

function child({
  slug,
  title,
  order,
  subtitle,
  body,
  image,
  metaTitle,
  metaDescription,
  locationSlugs,
  sections,
  relatedTitle,
}) {
  return {
    slug,
    title: L(title),
    metaTitle: L(clip(metaTitle || `${title} | Varsovia Design`, 60)),
    metaDescription: L(
      clip(
        metaDescription ||
          `${title} by Varsovia Design — premium interiors and furniture craftsmanship across Thailand.`,
        160,
      ),
    ),
    hero: {
      title: L(title),
      subtitle: L(subtitle || ""),
      image: image || "",
      ctaLabel: L("Get a consultation"),
      ctaHref: "/contact",
    },
    body: L(body || ""),
    sections: Array.isArray(sections) ? sections : [],
    relatedTitle: L(relatedTitle || ""),
    indexable: false,
    order,
    ...(locationSlugs ? { locationSlugs } : {}),
  };
}

function section(heading, text, image, imagePosition, layout) {
  return {
    heading: L(heading),
    text: L(text),
    image: image || "",
    ...(imagePosition ? { imagePosition } : {}),
    ...(layout ? { layout } : {}),
  };
}

/** Shared two-block story with distinct layouts so pages don’t look identical. */
function storyPair(a, b) {
  return [
    section(a.heading, a.text, a.image, a.imagePosition || "left", a.layout || "band"),
    section(b.heading, b.text, b.image, b.imagePosition || "right", b.layout || "spotlight"),
  ];
}

const pages = {
  furniture: hub({
    slug: "furniture",
    title: "Furniture",
    subtitle: "Kitchens, wardrobes, and fitted pieces designed for how you live.",
    image: IMG.p1,
    metaTitle: "Furniture | Varsovia Design",
    metaDescription:
      "Explore Varsovia furniture — kitchens, wardrobes, living, bedrooms, and whole-home packages crafted for Thailand homes.",
    body: "Varsovia furniture is planned around light, storage, and daily ritual. From modular kitchens to whole-house packages, every piece is specified for tropical living and finished with the same care we bring to full interiors.",
    sections: storyPair(
      {
        heading: "Designed for tropical living",
        text: "Materials, hardware, and joinery are chosen for humidity, salt air, and bright light — so kitchens and fitted pieces stay calm and durable year after year.",
        image: IMG.k1,
      },
      {
        heading: "From single rooms to whole-home packages",
        text: "Start with one kitchen or wardrobe, or brief a complete furniture language across the home. We keep proportions, finishes, and handles consistent so every room feels connected.",
        image: IMG.f8,
      },
    ),
    children: [
      child({
        slug: "kitchens",
        title: "Kitchens",
        order: 0,
        image: IMG.k1,
        subtitle: "Modular and custom kitchens built for tropical light and real cooking.",
        body: "Our kitchens balance clean architecture with practical workflow — islands, integrated appliances, durable finishes, and storage that stays calm under daily use. Designed for villas and apartments across Thailand.",
        sections: storyPair(
          {
            heading: "Workflow that feels effortless",
            text: "Islands, prep zones, and appliance placement are planned around how you cook — not just how the kitchen looks in a photo.",
            image: IMG.k2,
          },
          {
            heading: "Finishes that hold up",
            text: "We specify surfaces and hardware for Thai climate: resilient tops, quiet fronts, and detailing that stays refined with daily use.",
            image: IMG.c2,
          },
        ),
      }),
      child({
        slug: "wardrobes",
        title: "Wardrobes",
        order: 1,
        image: IMG.f2,
        subtitle: "Fitted storage systems tailored to your rooms and routines.",
        body: "Walk-in and fitted wardrobes planned around hanging, drawers, and accessories — quiet fronts, considered interiors, and materials that hold up in humid climates.",
        sections: storyPair(
          {
            heading: "Storage planned around you",
            text: "Hanging depths, drawer counts, and accessories follow your wardrobe — so mornings stay simple and rooms stay uncluttered.",
            image: IMG.f4,
          },
          {
            heading: "Quiet fronts, lasting interiors",
            text: "Clean elevations outside; organised, durable fittings inside — built for Thailand’s humidity and everyday use.",
            image: IMG.c4,
          },
        ),
      }),
      child({
        slug: "living-room",
        title: "Living Room",
        order: 2,
        image: IMG.f3,
        subtitle: "Lounge furniture and media joinery that frames gathering space.",
        body: "Sofas, media walls, shelving, and side pieces composed as one living landscape — soft, durable, and tuned to natural light.",
        sections: storyPair(
          {
            heading: "Gathering space, composed",
            text: "Seating, media, and shelving are designed as one composition so living rooms feel open, calm, and ready for everyday hosting.",
            image: IMG.s1,
          },
          {
            heading: "Tuned to natural light",
            text: "Soft materials and thoughtful proportions keep living areas comfortable in bright tropical interiors.",
            image: IMG.f1,
          },
        ),
      }),
      child({
        slug: "bedrooms",
        title: "Bedrooms",
        order: 3,
        image: IMG.f4,
        subtitle: "Calm bedroom suites with storage and rest in balance.",
        body: "Beds, bedside joinery, and wardrobe solutions that keep bedrooms uncluttered — soft tones, quiet detailing, and materials chosen for comfort.",
        sections: storyPair(
          {
            heading: "Rest without clutter",
            text: "Bedside storage, soft tones, and quiet detailing keep bedrooms serene — ready for rest after humid days.",
            image: IMG.f4,
          },
          {
            heading: "Suite-level storage",
            text: "Wardrobes and bedroom furniture share the same language so suites feel complete, not pieced together.",
            image: IMG.f2,
          },
        ),
      }),
      child({
        slug: "bathroom",
        title: "Bathroom",
        order: 4,
        image: IMG.f5,
        subtitle: "Vanities and wet-room joinery with spa-level clarity.",
        body: "Moisture-aware cabinetry, clean countertops, and storage that keeps bathrooms serene — designed to pair with your interior scheme.",
        sections: storyPair(
          {
            heading: "Moisture-aware joinery",
            text: "Vanities and wet-room storage specified for humidity — clean lines that stay calm beside stone and tile.",
            image: IMG.f5,
          },
          {
            heading: "Spa-level clarity",
            text: "Countertops, lighting-ready elevations, and storage that keeps bathrooms uncluttered and refined.",
            image: IMG.c5,
          },
        ),
      }),
      child({
        slug: "dining",
        title: "Dining",
        order: 5,
        image: IMG.f6,
        subtitle: "Tables and dining storage for everyday meals and hosting.",
        body: "Dining tables, sideboards, and seating specified as a set — proportioned for Thai homes and finished for lasting use.",
        sections: storyPair(
          {
            heading: "Everyday meals, easy hosting",
            text: "Tables and sideboards proportioned for Thai homes — generous enough for guests, calm enough for weeknights.",
            image: IMG.f6,
          },
          {
            heading: "Finished as a set",
            text: "Seating, surfaces, and storage share materials and scale so dining areas feel intentional.",
            image: IMG.s2,
          },
        ),
      }),
      child({
        slug: "doors",
        title: "Doors",
        order: 6,
        image: IMG.c3,
        subtitle: "Interior door systems that finish every room with intention.",
        body: "Flush and panel doors, hardware, and detailing coordinated with your furniture and wall finishes for a cohesive home.",
        sections: storyPair(
          {
            heading: "Doors as architecture",
            text: "Flush and panel doors with hardware that matches your furniture language — so thresholds feel finished, not afterthoughts.",
            image: IMG.c3,
          },
          {
            heading: "Coordinated detailing",
            text: "Handles, frames, and finishes align with wardrobes and cabinetry for a cohesive whole-home look.",
            image: IMG.c6,
          },
        ),
      }),
      child({
        slug: "whole-house",
        title: "Whole House",
        order: 7,
        image: IMG.f8,
        subtitle: "One furniture language from entry to bedroom.",
        body: "Whole-home furniture packages that keep materials, handles, and proportions consistent — ideal when you want a complete, coherent fit-out.",
        sections: storyPair(
          {
            heading: "One language throughout",
            text: "Materials, handles, and proportions stay consistent from entry to bedroom — so the home reads as one design, not a collection of rooms.",
            image: IMG.f8,
          },
          {
            heading: "Packages that scale",
            text: "Ideal for villas and apartments that need a complete, coherent fit-out with clear scopes and timelines.",
            image: IMG.s3,
          },
        ),
      }),
    ],
  }),

  interiorDesign: hub({
    slug: "interior-design",
    title: "Interior Design",
    subtitle: "Room-by-room interiors shaped for light, flow, and everyday living.",
    image: IMG.f1,
    metaTitle: "Interior Design | Varsovia Design",
    metaDescription:
      "Varsovia interior design for kitchens, bedrooms, bathrooms, and whole-home schemes across Thailand.",
    body: "Our interior design practice starts with how you move through a home. We plan layouts, materials, and furniture together — so each room feels intentional, calm, and ready for tropical light.",
    sections: storyPair(
      {
        heading: "Layout, light, and living",
        text: "We begin with how you move through the home — then materials and furniture follow so every room feels intentional under tropical light.",
        image: IMG.f1,
      },
      {
        heading: "Design that stays coherent",
        text: "Mood, finishes, and FF&E are coordinated as one scheme — so kitchens, bedrooms, and living areas share the same quiet quality.",
        image: IMG.k1,
      },
    ),
    children: [],
  }),

  completeInteriors: hub({
    slug: "complete-interiors",
    title: "Complete Interiors",
    subtitle: "End-to-end interiors for villas, condos, hospitality, and developments.",
    image: IMG.c1,
    metaTitle: "Complete Interiors | Varsovia Design",
    metaDescription:
      "Full interior programmes for villas, condos, hotels & resorts, and developer projects with Varsovia Design.",
    body: "Complete interiors means one accountable partner from concept through installation — design, furniture, and finish coordinated so projects stay coherent from the first drawing to handover.",
    sections: storyPair(
      {
        heading: "One partner, end to end",
        text: "Concept, furniture, and installation stay with the same team — so drawings, site, and handover speak the same language.",
        image: IMG.c1,
        layout: "overlay",
      },
      {
        heading: "Built for real projects",
        text: "Villas, condos, hospitality, and developer packages with scopes and timelines that hold through installation.",
        image: IMG.s1,
        layout: "editorial",
      },
    ),
    children: [
      child({
        slug: "villas",
        title: "Villas",
        order: 0,
        image: IMG.s1,
        subtitle: "Private villa interiors tuned to outdoor living and Thai light.",
        body: "From open-plan living to guest suites, we design villa interiors that open to gardens and sea views while staying cool, durable, and quietly luxurious.",
        sections: storyPair(
          {
            heading: "Indoor–outdoor living",
            text: "Layouts open to gardens and terraces while interiors stay cool, durable, and quietly luxurious.",
            image: IMG.s1,
          },
          {
            heading: "Suites with intention",
            text: "Guest rooms and living spaces share materials and proportion so the villa feels whole.",
            image: IMG.f3,
          },
        ),
      }),
      child({
        slug: "condos",
        title: "Condos",
        order: 1,
        image: IMG.f7,
        subtitle: "Apartment interiors that maximise space without losing calm.",
        body: "Smart storage, flexible layouts, and furniture scaled for condominium life — premium finishes without visual clutter.",
        sections: storyPair(
          {
            heading: "Space that works harder",
            text: "Storage and flexible furniture keep compact footprints calm — premium without clutter.",
            image: IMG.f7,
          },
          {
            heading: "City-ready finishes",
            text: "Materials and joinery chosen for apartment life: durable, quiet, and easy to live with.",
            image: IMG.p2,
          },
        ),
      }),
      child({
        slug: "hotels-resorts",
        title: "Hotels & Resorts",
        order: 2,
        image: IMG.c2,
        subtitle: "Hospitality interiors that feel warm, brand-true, and maintainable.",
        body: "Guest rooms, lobbies, and F&B spaces designed for atmosphere and operations — materials and joinery specified for lasting hospitality use.",
        sections: storyPair(
          {
            heading: "Atmosphere with operations in mind",
            text: "Guest rooms and public spaces designed for warmth and maintainability — hospitality-grade without feeling generic.",
            image: IMG.c2,
          },
          {
            heading: "Brand-true detailing",
            text: "Joinery and finishes specified to hold up across rooms while staying true to the property’s story.",
            image: IMG.c5,
          },
        ),
      }),
      child({
        slug: "developers",
        title: "Developers",
        order: 3,
        image: IMG.c4,
        subtitle: "Scalable interior packages for residential and mixed-use projects.",
        body: "Show units, standard apartment packages, and amenity interiors planned for rollout — consistent quality across floors and phases.",
        sections: storyPair(
          {
            heading: "Show units that sell",
            text: "Storytelling interiors for launch — then packages that roll out cleanly across floors and phases.",
            image: IMG.c4,
          },
          {
            heading: "Specs that scale",
            text: "Clear FF&E and finish standards so every unit stays on brand and on schedule.",
            image: IMG.p3,
          },
        ),
      }),
    ],
  }),

  services: hub({
    slug: "services",
    title: "Services",
    subtitle: "Design, make, and install — one clear path from idea to finished space.",
    image: IMG.c5,
    metaTitle: "Services | Varsovia Design",
    metaDescription:
      "Varsovia services: custom furniture, interior design, packages, installation, and renovation across Thailand.",
    body: "Whether you need a single custom piece or a full renovation, our services connect design intent with on-site craftsmanship — clear scopes, careful installation, and support after handover.",
    sections: storyPair(
      {
        heading: "From idea to finished space",
        text: "Design, making, and installation stay connected — so what you approve on paper is what you live with on site.",
        image: IMG.c5,
        layout: "rail",
      },
      {
        heading: "Clear scopes, careful handover",
        text: "Every service comes with defined scope and aftercare — whether you need one custom piece or a full renovation.",
        image: IMG.p2,
        layout: "spotlight",
      },
    ),
    children: [
      child({
        slug: "custom-furniture",
        title: "Custom Furniture",
        order: 0,
        image: IMG.p2,
        subtitle: "Bespoke pieces measured and made for your exact space.",
        body: "From feature kitchens to one-off joinery, we design and produce furniture that fits walls, windows, and the way you live — not generic catalogue sizes.",
        locationSlugs: LOC_AFFINITY["custom-furniture"],
        sections: storyPair(
          {
            heading: "Measured for your walls",
            text: "Pieces designed around your windows, niches, and routines — not generic catalogue sizes.",
            image: IMG.p2,
          },
          {
            heading: "Craft you can live with",
            text: "Feature kitchens and one-off joinery finished for tropical homes and daily use.",
            image: IMG.k1,
          },
        ),
      }),
      child({
        slug: "interior-design",
        title: "Interior Design",
        order: 1,
        image: IMG.f1,
        subtitle: "Full design support from mood to material schedule.",
        body: "Concept, layout, finishes, and FF&E coordination — so architecture, furniture, and styling move together.",
        locationSlugs: LOC_AFFINITY["interior-design"],
        sections: storyPair(
          {
            heading: "Mood to material schedule",
            text: "Concept, layout, and finishes coordinated so architecture and furniture move as one.",
            image: IMG.f1,
          },
          {
            heading: "FF&E that fits the story",
            text: "Furniture and styling chosen to complete the scheme — not added at the end.",
            image: IMG.f3,
          },
        ),
      }),
      child({
        slug: "furniture-packages",
        title: "Furniture Packages",
        order: 2,
        image: IMG.p3,
        subtitle: "Curated room packages ready to specify and install.",
        body: "Pre-composed sets for living, sleeping, and dining — faster decisions with Varsovia quality and coherent styling.",
        locationSlugs: LOC_AFFINITY["furniture-packages"],
        sections: storyPair(
          {
            heading: "Faster, coherent decisions",
            text: "Pre-composed living, sleeping, and dining sets — Varsovia quality without endless option paralysis.",
            image: IMG.p3,
          },
          {
            heading: "Ready to install",
            text: "Packages specified for clean site install so rooms feel finished together.",
            image: IMG.f6,
          },
        ),
      }),
      child({
        slug: "installation",
        title: "Installation",
        order: 3,
        image: IMG.c6,
        subtitle: "On-site craftsmanship and careful fitting.",
        body: "Our installation teams protect floors, align lines, and finish details — so the design you approved is what you live with.",
        locationSlugs: LOC_AFFINITY.installation,
        sections: storyPair(
          {
            heading: "Careful on site",
            text: "Floors protected, lines aligned, details finished — installation treated as part of the design.",
            image: IMG.c6,
          },
          {
            heading: "What you approved, delivered",
            text: "Site craftsmanship that matches the drawings — so handover feels complete.",
            image: IMG.contact1,
          },
        ),
      }),
      child({
        slug: "renovation",
        title: "Renovation",
        order: 4,
        image: IMG.s2,
        subtitle: "Refresh and remodel with a clear plan and finish standard.",
        body: "Kitchen and whole-home renovations that respect structure and timeline — new function without losing the soul of the space.",
        locationSlugs: LOC_AFFINITY.renovation,
        sections: storyPair(
          {
            heading: "Refresh with a plan",
            text: "Kitchen and whole-home renovations with clear scopes — new function without losing the soul of the space.",
            image: IMG.s2,
          },
          {
            heading: "Finish standards that stick",
            text: "Materials and detailing chosen to last through the next chapter of the home.",
            image: IMG.k2,
          },
        ),
      }),
    ],
  }),

  locations: hub({
    slug: "locations",
    title: "Locations",
    subtitle: "Varsovia interiors across Thailand’s key residential markets.",
    image: IMG.contact1,
    metaTitle: "Locations | Varsovia Design",
    metaDescription:
      "Varsovia Design in Koh Samui, Phuket, Bangkok, Pattaya, Hua Hin, and Chiang Mai — local projects and services.",
    body: "We work where our clients live and build — island villas, coastal homes, and city apartments. Explore a market to see services and related projects for that area.",
    sections: storyPair(
      {
        heading: "Where our clients live and build",
        text: "Island villas, coastal homes, and city apartments — local services and projects for each market.",
        image: IMG.contact1,
      },
      {
        heading: "Local knowledge, one standard",
        text: "Every location gets the same design care — tuned to climate, light, and how people live there.",
        image: IMG.s3,
      },
    ),
    children: [
      child({
        slug: "koh-samui",
        title: "Koh Samui",
        order: 0,
        image: IMG.contact2,
        subtitle: "Island villas and residences shaped for sea air and outdoor living.",
        body: "On Koh Samui we design interiors that open to terraces and gardens — durable materials, soft indoor–outdoor flow, and furniture built for tropical light.",
        sections: storyPair(
          {
            heading: "Island villas, open living",
            text: "Interiors that open to terraces and gardens — durable materials for sea air and tropical light.",
            image: IMG.contact2,
          },
          {
            heading: "Soft indoor–outdoor flow",
            text: "Furniture and finishes planned for how Samui homes actually live day to day.",
            image: IMG.s1,
          },
        ),
      }),
      child({
        slug: "phuket",
        title: "Phuket",
        order: 1,
        image: IMG.contact3,
        subtitle: "Coastal homes and resorts with refined, maintainable finishes.",
        body: "Phuket projects balance hospitality-grade durability with residential calm — from hillside villas to beachside living.",
        sections: storyPair(
          {
            heading: "Coastal calm, lasting finishes",
            text: "Hillside villas and beachside homes with hospitality-grade durability and residential quiet.",
            image: IMG.contact3,
          },
          {
            heading: "Refined for the coast",
            text: "Materials and joinery specified for salt air, bright light, and easy upkeep.",
            image: IMG.c2,
          },
        ),
      }),
      child({
        slug: "bangkok",
        title: "Bangkok",
        order: 2,
        image: IMG.contact4,
        subtitle: "City apartments and townhomes with smart storage and calm detail.",
        body: "In Bangkok we focus on light, storage, and quiet luxury — interiors that work hard in compact footprints without feeling crowded.",
        sections: storyPair(
          {
            heading: "City living, calm detail",
            text: "Apartments and townhomes with smart storage and quiet luxury for compact footprints.",
            image: IMG.contact4,
          },
          {
            heading: "Light without clutter",
            text: "Layouts and furniture that work hard without feeling crowded.",
            image: IMG.f7,
          },
        ),
      }),
      child({
        slug: "pattaya",
        title: "Pattaya",
        order: 3,
        image: IMG.contact5,
        subtitle: "Coastal living with practical, stylish furniture packages.",
        body: "Pattaya homes and investment properties get clear, livable schemes — furniture and finishes chosen for comfort and easy upkeep.",
        sections: storyPair(
          {
            heading: "Practical coastal packages",
            text: "Clear, livable schemes for homes and investment properties — comfort with easy upkeep.",
            image: IMG.contact5,
          },
          {
            heading: "Stylish and maintainable",
            text: "Furniture and finishes chosen for coastal living without high maintenance.",
            image: IMG.p3,
          },
        ),
      }),
      child({
        slug: "hua-hin",
        title: "Hua Hin",
        order: 4,
        image: IMG.contact6,
        subtitle: "Relaxed seaside homes with a quieter design pace.",
        body: "Hua Hin interiors favour breezy layouts, soft palettes, and furniture that supports weekend and long-stay living alike.",
        sections: storyPair(
          {
            heading: "A quieter seaside pace",
            text: "Breezy layouts and soft palettes for weekend homes and long stays alike.",
            image: IMG.contact6,
          },
          {
            heading: "Furniture for real living",
            text: "Pieces that support relaxed Hua Hin days — durable, calm, and easy to live with.",
            image: IMG.f6,
          },
        ),
      }),
      child({
        slug: "chiang-mai",
        title: "Chiang Mai",
        order: 5,
        image: IMG.s3,
        subtitle: "Northern residences with warmth, craft, and mountain light.",
        body: "Chiang Mai projects lean into natural materials and calm rooms — interiors that feel rooted, not generic.",
        sections: storyPair(
          {
            heading: "Warmth and mountain light",
            text: "Natural materials and calm rooms for northern residences — rooted, not generic.",
            image: IMG.s3,
          },
          {
            heading: "Craft that feels local",
            text: "Interiors that respect Chiang Mai’s pace while meeting modern living standards.",
            image: IMG.a2,
          },
        ),
      }),
    ],
  }),

  forDevelopers: hub({
    slug: "for-developers",
    title: "For Developers",
    subtitle: "Interior partners for show units, standard packages, and amenity spaces.",
    image: IMG.c4,
    metaTitle: "For Developers | Varsovia Design",
    metaDescription:
      "Partner with Varsovia Design for developer interior packages, show units, and scalable FF&E across Thailand.",
    body: "Developers need interiors that sell and scale. We deliver show-unit storytelling, repeatable apartment packages, and amenity design with clear specs, timelines, and installation support — so every phase stays on brand and on schedule.",
    sections: storyPair(
      {
        heading: "Show units that sell the vision",
        text: "Launch interiors with storytelling that buyers remember — then convert to packages that roll out cleanly across phases.",
        image: IMG.c4,
        layout: "editorial",
      },
      {
        heading: "Packages, amenities, installation",
        text: "Standard apartment packages and amenity spaces with clear specs, timelines, and installation support so every phase stays on brand.",
        image: IMG.p3,
        layout: "overlay",
      },
    ),
    children: [],
  }),

  journal: hub({
    slug: "journal",
    title: "Journal",
    subtitle: "Ideas on kitchens, materials, villas, and living in Thailand.",
    image: IMG.blog,
    metaTitle: "Journal | Varsovia Design",
    metaDescription:
      "Varsovia Journal — guides on kitchens, furniture, materials, interior design, villas, and Thailand living.",
    body: "Our journal collects practical design notes and project stories — written to help homeowners and partners make clearer decisions.",
    sections: storyPair(
      {
        heading: "Practical design notes",
        text: "Guides on kitchens, materials, and villas — written to help you make clearer decisions.",
        image: IMG.blog,
      },
      {
        heading: "Stories from real projects",
        text: "Project notes and Thailand living ideas drawn from homes we design and install.",
        image: IMG.s2,
      },
    ),
    children: [
      child({
        slug: "kitchens",
        title: "Kitchens",
        order: 0,
        image: IMG.k2,
        subtitle: "Planning notes and kitchen stories from Varsovia projects.",
        body: "Layouts, materials, and detailing for kitchens that work in tropical homes.",
        sections: [
          section(
            "Kitchen planning notes",
            "Layouts, materials, and detailing drawn from tropical home projects.",
            IMG.k2,
            "left",
          ),
        ],
      }),
      child({
        slug: "furniture",
        title: "Furniture",
        order: 1,
        image: IMG.p1,
        subtitle: "How we think about fitted furniture and freestanding pieces.",
        body: "From wardrobes to dining — articles on choosing furniture that lasts.",
        sections: [
          section(
            "Furniture that lasts",
            "Notes on fitted and freestanding pieces chosen for Thai homes.",
            IMG.p1,
            "left",
          ),
        ],
      }),
      child({
        slug: "materials",
        title: "Materials",
        order: 2,
        image: IMG.c3,
        subtitle: "Finishes and surfaces suited to Thai climate and daily use.",
        body: "Guides to materials that look refined and perform in humidity and light.",
        sections: [
          section(
            "Materials for Thai climate",
            "Finishes that look refined and perform in humidity and bright light.",
            IMG.c3,
            "left",
          ),
        ],
      }),
      child({
        slug: "interior-design",
        title: "Interior Design",
        order: 3,
        image: IMG.f1,
        subtitle: "Process and ideas behind Varsovia interiors.",
        body: "How we approach flow, light, and atmosphere room by room.",
        sections: [
          section(
            "Process and atmosphere",
            "How we approach flow, light, and atmosphere room by room.",
            IMG.f1,
            "left",
          ),
        ],
      }),
      child({
        slug: "villa-guides",
        title: "Villa Guides",
        order: 4,
        image: IMG.s1,
        subtitle: "Design advice for villas and outdoor-connected living.",
        body: "Practical notes for villa owners planning interiors with gardens and terraces.",
        sections: [
          section(
            "Villa living notes",
            "Practical advice for interiors that open to gardens and terraces.",
            IMG.s1,
            "left",
          ),
        ],
      }),
      child({
        slug: "thailand-living",
        title: "Thailand Living",
        order: 5,
        image: IMG.s2,
        subtitle: "Living well in Thailand — climate, ritual, and home.",
        body: "Stories and tips for homes that feel comfortable year-round in Thailand.",
        sections: [
          section(
            "Living well in Thailand",
            "Climate, ritual, and home — tips for comfortable year-round living.",
            IMG.s2,
            "left",
          ),
        ],
      }),
    ],
  }),

  aboutBrand: hub({
    slug: "about",
    title: "Varsovia",
    subtitle: "Design-led interiors and furniture, crafted for Thai living.",
    image: IMG.a1,
    metaTitle: "About | Varsovia Design",
    metaDescription:
      "About Varsovia Design, and partner brands Livo and Oppolia — craftsmanship and interiors for Thailand.",
    body: "Varsovia Design creates interiors and furniture for homes across Thailand. Explore our story and the brand partners that support our quality.",
    sections: storyPair(
      {
        heading: "Design-led craftsmanship",
        text: "Interiors and furniture for Thai homes — calm, durable, and planned around light and daily ritual.",
        image: IMG.a1,
      },
      {
        heading: "Brands we build with",
        text: "Explore Varsovia and partner brands that support our quality across kitchens and cabinetry.",
        image: IMG.a3,
      },
    ),
    children: [
      child({
        slug: "varsovia",
        title: "Varsovia",
        order: 0,
        image: IMG.a1,
        subtitle: "Design-led interiors and furniture, crafted for Thai living.",
        body: "Varsovia Design is a Thailand-based studio focused on calm, durable interiors — from kitchens and fitted furniture to complete villa programmes. We design with light, climate, and daily ritual in mind.",
        sections: storyPair(
          {
            heading: "Calm, durable interiors",
            text: "From kitchens and fitted furniture to complete villa programmes — designed for Thai light and climate.",
            image: IMG.a1,
          },
          {
            heading: "Craft for daily ritual",
            text: "Every project starts with how you live — then materials and furniture follow.",
            image: IMG.f1,
          },
        ),
      }),
      child({
        slug: "livo",
        title: "Livo",
        order: 1,
        image: IMG.a2,
        subtitle: "A brand partner in the Varsovia design ecosystem.",
        body: "Livo collaborates with Varsovia on selected furniture and interior programmes — bringing complementary craft and product depth to projects that need both design vision and reliable making.",
        sections: storyPair(
          {
            heading: "Partner craftsmanship",
            text: "Livo works with Varsovia on selected furniture and interior programmes where product depth meets design vision.",
            image: IMG.a2,
          },
          {
            heading: "Built for real homes",
            text: "Shared standards for finish and durability — so partner pieces feel native to Varsovia interiors.",
            image: IMG.p2,
          },
        ),
      }),
      child({
        slug: "oppolia",
        title: "Oppolia",
        order: 2,
        image: IMG.a3,
        subtitle: "A brand partner supporting refined kitchen and cabinetry solutions.",
        body: "Oppolia works alongside Varsovia where cabinetry and kitchen systems meet our design standard — refined fronts, reliable hardware, and detailing that holds up in tropical homes.",
        sections: storyPair(
          {
            heading: "Kitchens and cabinetry",
            text: "Oppolia supports Varsovia projects where kitchen systems and cabinetry need refined fronts and reliable hardware.",
            image: IMG.a3,
            layout: "spotlight",
          },
          {
            heading: "Detail that holds up",
            text: "Tropical-ready detailing aligned with Varsovia’s finish standard — calm elevations, lasting use.",
            image: IMG.k1,
            layout: "band",
          },
        ),
      }),
    ],
  }),
};


module.exports = { pages, L, hub, child, section, storyPair, IMG, LOC_AFFINITY, clip };
