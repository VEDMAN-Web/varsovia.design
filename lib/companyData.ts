/** Fallback content for Company pages when API is empty */

import { getLocaleOrDefault } from "@/lib/i18n/messageCatalog";
import { hasLocalizedMap, pickLocalized } from "@/lib/i18n/pickLocalized";
import type { Locale } from "@/lib/i18n/routing";
import blogContentPl from "../messages/locale/blog.content.pl.json";
import blogContentTh from "../messages/locale/blog.content.th.json";
import { MEDIA, resolveMediaUrl } from "./mediaAssets";
import { LISTING_PAGE_SIZE, paginateItems } from "./pagination";

export type BlogAuthor = { name: string; avatar: string };

export type BlogSection = {
  type: "paragraph" | "paragraph-center" | "subheading" | "image" | "split-left" | "split-right";
  text?: string;
  image?: string;
  imageAlt?: string;
  /** Centered label under image (Figma detail captions) */
  caption?: string;
};

export type BlogPost = {
  _id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  author: BlogAuthor;
  views?: number;
  sections: BlogSection[];
};

export type TeamMember = {
  _id: string;
  id?: string;
  name: string;
  role: string;
  image: string;
  teamType?: "Italian" | "Headquarter" | "Design" | "Architect" | "Engineer";
};

export type TeamStat = {
  value: string;
  label: string;
};

export const BLOGS_PER_PAGE = LISTING_PAGE_SIZE.blog;

export const COMPANY_EASE = [0.22, 1, 0.36, 1] as const;

const IMG = {
  f1: MEDIA.featured[0],
  f2: MEDIA.featured[1],
  f3: MEDIA.featured[2],
  f4: MEDIA.featured[3],
  f5: MEDIA.featured[4],
  f6: MEDIA.featured[5],
  f7: MEDIA.featured[6],
  k1: MEDIA.interior[0],
  k2: MEDIA.interior[1],
  a1: MEDIA.about[0],
  a2: MEDIA.about[1],
  a3: MEDIA.about[2],
};

const DEFAULT_BLOG_DETAIL_INTRO =
  "Interior design continues to evolve with changing lifestyles and modern living needs. In 2026, homeowners are embracing spaces that are elegant, functional, and personalized. Whether you're renovating a single room or designing your dream home, these trends will help you create interiors that are timeless and inspiring.";

const DEFAULT_BLOG_DETAIL_AFTER_HERO =
  "Interior design continues to evolve with changing lifestyles and modern living needs. In 2026, homeowners are embracing spaces that are elegant, functional, and personalized. Whether you're renovating a single room or designing your dream home, these trends will help you create interiors that are timeless and inspiring. Soft taupes, mushroom greys, and creamy off-whites continue to dominate palettes — paired with richer accents in wood, stone, and brushed metal so rooms never feel flat or cold. Curved silhouettes and soft edges continue to replace sharp, rigid forms. From arched doorways to rounded kitchen islands, these shapes create a sense of flow and make rooms feel more inviting without sacrificing structure.";

/** Full Figma blog detail body (images, captions, splits) — used for all detail pages when CMS has no blocks */
export const FIGMA_BLOG_DETAIL_SECTIONS: BlogSection[] = [
  {
    type: "paragraph",
    text: DEFAULT_BLOG_DETAIL_INTRO,
  },
  {
    type: "image",
    image: IMG.f2,
    imageAlt: "Modern kitchen with dark cabinetry and stone surfaces",
    caption: "Warm Neutral Color Palettes",
  },
  {
    type: "paragraph",
    text: DEFAULT_BLOG_DETAIL_AFTER_HERO,
  },
  {
    type: "split-left",
    image: IMG.f3,
    imageAlt: "Kitchen interior detail",
    caption: "Warm Neutral Color Palettes",
    text: "At **Varsovia Design**, we believe every project begins with understanding our clients' unique vision and lifestyle. Our approach combines creativity, craftsmanship, and innovative design solutions to create interiors that are elegant, functional, and built to stand the test of time. Whether you're renovating a single room, designing your dream home, or planning a complete interior transformation, staying informed about the latest design trends can help you make confident decisions and achieve exceptional results.",
  },
  {
    type: "split-right",
    image: IMG.f4,
    imageAlt: "Natural stone and wood interior",
    caption: "Natural Materials & Layered Texture",
    text: "Natural stone, warm wood grains, and layered textiles add depth and character. The best interiors mix materials intentionally — pairing matte surfaces with subtle gloss, or smooth cabinetry with textured wall panels so every room feels layered, calm, and complete.",
  },
];

type BlogLocaleSlice = {
  title?: string;
  excerpt?: string;
  category?: string;
  content?: string;
};

const BLOG_BY_LOCALE: Partial<Record<Locale, Record<string, BlogLocaleSlice>>> = {
  th: blogContentTh as Record<string, BlogLocaleSlice>,
  pl: blogContentPl as Record<string, BlogLocaleSlice>,
};

export const fallbackBlogs: BlogPost[] = [
  {
    _id: "blog-1",
    title: "10 Interior Design Trends That Will Transform Your Home in 2026",
    excerpt:
      "From warm minimalism to sculptural lighting — discover the trends shaping beautiful, livable interiors this year.",
    category: "Trends",
    date: "12 March 2026",
    readTime: "6 min",
    image: IMG.f3,
    views: 1240,
    author: { name: "Courtney Henry", avatar: IMG.a1 },
    sections: FIGMA_BLOG_DETAIL_SECTIONS,
  },
  {
    _id: "blog-2",
    title: "How to Choose the Perfect Modular Kitchen for Your Home",
    excerpt:
      "Layout, storage, finishes, and workflow — a practical guide to selecting cabinetry that works beautifully every day.",
    category: "Kitchen",
    date: "Dec 28, 2025",
    readTime: "5 min",
    image: IMG.f5,
    views: 980,
    author: { name: "Marco Rossi", avatar: IMG.a3 },
    sections: [
      {
        type: "paragraph",
        text: "A modular kitchen should feel effortless — everything within reach, surfaces easy to maintain, and a layout that matches how your household actually cooks and gathers.",
      },
      {
        type: "image",
        image: IMG.f6,
        imageAlt: "Modern modular kitchen",
      },
      {
        type: "split-left",
        text: "Start with your work triangle: sink, cooktop, and refrigerator. Even in open-plan homes, keeping these three points logically connected reduces daily friction and makes the space feel intuitive.",
        image: IMG.f1,
        imageAlt: "Kitchen work triangle layout",
      },
    ],
  },
  {
    _id: "blog-3",
    title: "The Art of Layered Lighting in Modern Interiors",
    excerpt:
      "Ambient, task, and accent lighting work together to shape mood, function, and visual depth in every room.",
    category: "Lighting",
    date: "Dec 10, 2025",
    readTime: "4 min",
    image: IMG.f7,
    views: 756,
    author: { name: "Priya Shah", avatar: IMG.a1 },
    sections: [
      {
        type: "paragraph",
        text: "Great lighting is invisible until you need it — then it defines the entire atmosphere of a space. Layering three types of light gives you control from morning routines to evening entertaining.",
      },
      {
        type: "split-right",
        text: "Use recessed or cove lighting for ambient glow, pendants or under-cabinet strips for task areas, and directional spots or wall washers to highlight art, textures, or architectural details.",
        image: IMG.f3,
        imageAlt: "Layered lighting in dining area",
      },
    ],
  },
  {
    _id: "blog-4",
    title: "Small Space, Big Impact: Smart Storage Solutions",
    excerpt:
      "Clever cabinetry, vertical storage, and multi-functional furniture help compact homes feel spacious and organized.",
    category: "Storage",
    date: "Nov 22, 2025",
    readTime: "5 min",
    image: IMG.f4,
    views: 612,
    author: { name: "Elena Varsovia", avatar: IMG.a2 },
    sections: [
      {
        type: "paragraph",
        text: "Limited square footage doesn't mean compromising on style. The most successful small-space designs maximize every inch with custom joinery and thoughtful zoning.",
      },
      {
        type: "image",
        image: IMG.f2,
        imageAlt: "Compact storage wall",
      },
    ],
  },
  {
    _id: "blog-5",
    title: "Material Matters: Choosing Finishes That Age Gracefully",
    excerpt:
      "Quartz, laminates, solid wood, and veneers — how to pick surfaces that look better over time, not worse.",
    category: "Materials",
    date: "Nov 05, 2025",
    readTime: "7 min",
    image: IMG.f6,
    views: 890,
    author: { name: "Marco Rossi", avatar: IMG.a3 },
    sections: [
      {
        type: "paragraph",
        text: "Durability and beauty aren't opposites. The right finish depends on traffic, moisture exposure, and the story you want your interiors to tell as they patina over the years.",
      },
      {
        type: "split-left",
        text: "For kitchens and bathrooms, prioritize moisture-resistant cores and easy-clean surfaces. In living areas, natural wood and stone add warmth that only improves with age.",
        image: IMG.f5,
        imageAlt: "Material finish samples",
      },
    ],
  },
  {
    _id: "blog-6",
    title: "Creating a Cohesive Whole-House Design Language",
    excerpt:
      "Consistency across rooms doesn't mean repetition — learn how to carry color, texture, and proportion throughout your home.",
    category: "Whole House",
    date: "Oct 18, 2025",
    readTime: "6 min",
    image: IMG.f3,
    views: 534,
    author: { name: "Priya Shah", avatar: IMG.a1 },
    sections: [
      {
        type: "paragraph",
        text: "A unified design language ties separate rooms into a single narrative. Shared palette accents, recurring materials, and consistent hardware choices create flow from entry to bedroom.",
      },
      {
        type: "image",
        image: IMG.f7,
        imageAlt: "Cohesive open-plan interior",
      },
    ],
  },
  {
    _id: "blog-7",
    title: "Bathroom Retreats: Spa-Inspired Design at Home",
    excerpt:
      "Soft lighting, stone textures, and floating vanities turn everyday bathrooms into restorative sanctuaries.",
    category: "Bathroom",
    date: "Oct 02, 2025",
    readTime: "4 min",
    image: IMG.a3,
    views: 445,
    author: { name: "Elena Varsovia", avatar: IMG.a2 },
    sections: [
      {
        type: "paragraph",
        text: "The best bathroom designs balance hotel-like serenity with practical storage and easy maintenance — proving luxury and function can coexist.",
      },
    ],
  },
  {
    _id: "blog-8",
    title: "Color Psychology in Interior Design",
    excerpt:
      "How warm and cool tones influence mood, perceived space, and the way natural light behaves in your rooms.",
    category: "Color",
    date: "Sep 14, 2025",
    readTime: "5 min",
    image: IMG.f2,
    views: 678,
    author: { name: "Marco Rossi", avatar: IMG.a3 },
    sections: [
      {
        type: "paragraph",
        text: "Color is one of the most powerful — and most personal — tools in interior design. Understanding undertones and light interaction helps you choose palettes with confidence.",
      },
    ],
  },
  {
    _id: "blog-9",
    title: "Working With an Interior Designer: What to Expect",
    excerpt:
      "From first consultation to final installation — a transparent look at the Varsovia design process.",
    category: "Process",
    date: "Aug 30, 2025",
    readTime: "6 min",
    image: IMG.a1,
    views: 923,
    author: { name: "Priya Shah", avatar: IMG.a1 },
    sections: [
      {
        type: "paragraph",
        text: "Collaborating with a design team should feel clear and exciting. We walk through timelines, revisions, material approvals, and installation so you always know what's next.",
      },
    ],
  },
  {
    _id: "blog-10",
    title: "Top Trends Transforming Modern Interior Design Showrooms in 2026",
    excerpt:
      "From immersive displays to tactile material libraries — how leading showrooms are redefining the way clients experience design.",
    category: "Trends",
    date: "12 Jun 2026",
    readTime: "4 min",
    image: IMG.f1,
    views: 1102,
    author: { name: "Courtney Henry", avatar: IMG.a2 },
    sections: [
      {
        type: "paragraph",
        text: "Showrooms today are less static galleries and more curated journeys. Clients expect to touch finishes, visualize scale, and understand how modular systems adapt to real homes.",
      },
    ],
  },
  {
    _id: "blog-11",
    title: "Open-Plan Living Without Losing Definition",
    excerpt:
      "Zoning tricks, ceiling treatments, and furniture placement that keep open layouts feeling structured and calm.",
    category: "Living Room",
    date: "28 May 2026",
    readTime: "5 min",
    image: IMG.f2,
    views: 867,
    author: { name: "Elena Varsovia", avatar: IMG.a2 },
    sections: [
      {
        type: "paragraph",
        text: "Open plans work best when each zone has a subtle identity — through rugs, lighting levels, or partial screens — without building walls that block light.",
      },
    ],
  },
  {
    _id: "blog-12",
    title: "Bedroom Wardrobes That Maximize Every Centimeter",
    excerpt:
      "Custom internals, sliding systems, and lighting ideas for wardrobes that feel boutique-hotel refined.",
    category: "Bedroom",
    date: "14 May 2026",
    readTime: "4 min",
    image: IMG.f3,
    views: 743,
    author: { name: "Priya Shah", avatar: IMG.a1 },
    sections: [
      {
        type: "paragraph",
        text: "A well-planned wardrobe eliminates daily friction. Adjustable shelves, pull-out trays, and integrated LED strips turn storage into a daily pleasure.",
      },
    ],
  },
  {
    _id: "blog-13",
    title: "Door & Window Profiles That Frame the View",
    excerpt:
      "Slim frames, warm timber, and performance glazing — selecting openings that connect indoors with landscape.",
    category: "Doors & Windows",
    date: "30 Apr 2026",
    readTime: "6 min",
    image: IMG.f4,
    views: 591,
    author: { name: "Marco Rossi", avatar: IMG.a3 },
    sections: [
      {
        type: "paragraph",
        text: "Windows are the artwork of architectural interiors. Profile depth, handle design, and sightlines should disappear so the view remains the hero.",
      },
    ],
  },
  {
    _id: "blog-14",
    title: "Furniture Layout Mistakes — and How to Fix Them",
    excerpt:
      "Common spacing errors in sofas, dining tables, and media walls that make rooms feel smaller than they are.",
    category: "Furniture",
    date: "16 Apr 2026",
    readTime: "5 min",
    image: IMG.f5,
    views: 812,
    author: { name: "Courtney Henry", avatar: IMG.a2 },
    sections: [
      {
        type: "paragraph",
        text: "Breathing room around key pieces changes how a space feels instantly. We share simple rules of thumb designers use before specifying a single chair.",
      },
    ],
  },
  {
    _id: "blog-15",
    title: "Kitchen Islands: Size, Height, and Seating Done Right",
    excerpt:
      "Proportions, overhang depth, and power planning for islands that anchor the heart of the home.",
    category: "Kitchen",
    date: "02 Apr 2026",
    readTime: "5 min",
    image: IMG.f6,
    views: 934,
    author: { name: "Elena Varsovia", avatar: IMG.a2 },
    sections: [
      {
        type: "paragraph",
        text: "An island that's too deep or too tall disrupts workflow. Align counter height with adjacent runs and allow clear circulation on all sides.",
      },
    ],
  },
  {
    _id: "blog-16",
    title: "Sustainable Materials Without Compromising Luxury",
    excerpt:
      "Responsible sourcing, low-VOC finishes, and durable cores that meet premium aesthetic expectations.",
    category: "Materials",
    date: "19 Mar 2026",
    readTime: "7 min",
    image: IMG.f7,
    views: 688,
    author: { name: "Marco Rossi", avatar: IMG.a3 },
    sections: [
      {
        type: "paragraph",
        text: "Sustainability and luxury now share the same brief. Clients want transparency on origins and longevity without sacrificing the tactile quality they expect.",
      },
    ],
  },
  {
    _id: "blog-17",
    title: "Designing Guest Suites That Feel Like a Boutique Stay",
    excerpt:
      "Layered bedding, integrated storage, and subtle lighting for spaces your visitors will remember.",
    category: "Bedroom",
    date: "05 Mar 2026",
    readTime: "4 min",
    image: IMG.a1,
    views: 522,
    author: { name: "Priya Shah", avatar: IMG.a1 },
    sections: [
      {
        type: "paragraph",
        text: "Guest rooms deserve the same rigor as primary suites — with thoughtful privacy, luggage space, and blackout options for restful nights.",
      },
    ],
  },
  {
    _id: "blog-18",
    title: "Powder Rooms: Small Spaces, Strong First Impressions",
    excerpt:
      "Bold stone, mirrored cabinetry, and sculptural fixtures that elevate compact washrooms.",
    category: "Bathroom",
    date: "20 Feb 2026",
    readTime: "3 min",
    image: IMG.a2,
    views: 477,
    author: { name: "Courtney Henry", avatar: IMG.a2 },
    sections: [
      {
        type: "paragraph",
        text: "Powder rooms are invitations to be expressive. Because the footprint is small, invest in one memorable material or fixture rather than many competing details.",
      },
    ],
  },
  {
    _id: "blog-19",
    title: "Home Office Joinery That Hides the Clutter",
    excerpt:
      "Cable management, adjustable shelves, and acoustic panels for focused work from home.",
    category: "Furniture",
    date: "06 Feb 2026",
    readTime: "5 min",
    image: IMG.a3,
    views: 701,
    author: { name: "Elena Varsovia", avatar: IMG.a2 },
    sections: [
      {
        type: "paragraph",
        text: "Integrated desks and wall units keep workspaces calm. Plan power, task lighting, and ventilation early so technology never fights the design.",
      },
    ],
  },
  {
    _id: "blog-20",
    title: "Outdoor Kitchens for Tropical Climates",
    excerpt:
      "Ventilation, shade, and weather-resistant cabinetry for seamless indoor–outdoor entertaining.",
    category: "Kitchen",
    date: "23 Jan 2026",
    readTime: "6 min",
    image: IMG.f1,
    views: 845,
    author: { name: "Marco Rossi", avatar: IMG.a3 },
    sections: [
      {
        type: "paragraph",
        text: "Outdoor cooking zones need the same planning as interior kitchens — with added protection from sun, rain, and salt air depending on location.",
      },
    ],
  },
  {
    _id: "blog-21",
    title: "Accent Walls That Don't Feel Dated",
    excerpt:
      "Paneling, limewash, and full-height stone — modern alternatives to yesterday's feature walls.",
    category: "Trends",
    date: "09 Jan 2026",
    readTime: "4 min",
    image: IMG.f2,
    views: 563,
    author: { name: "Priya Shah", avatar: IMG.a1 },
    sections: [
      {
        type: "paragraph",
        text: "The best accent surfaces feel architectural, not decorative. Continuity with adjacent materials keeps the room cohesive while still creating focus.",
      },
    ],
  },
  {
    _id: "blog-22",
    title: "Planning a Whole-House Renovation Timeline",
    excerpt:
      "Phasing trades, lead times, and client decisions so projects stay on track from demo to styling.",
    category: "Whole House",
    date: "26 Dec 2025",
    readTime: "8 min",
    image: IMG.f3,
    views: 992,
    author: { name: "Courtney Henry", avatar: IMG.a2 },
    sections: [
      {
        type: "paragraph",
        text: "Renovations succeed when sequencing is realistic. We map dependencies between structure, MEP, joinery, and finishes before the first wall comes down.",
      },
    ],
  },
  {
    _id: "blog-23",
    title: "Children's Rooms That Grow With the Family",
    excerpt:
      "Flexible storage, durable finishes, and neutral bases that adapt as tastes change.",
    category: "Bedroom",
    date: "12 Dec 2025",
    readTime: "5 min",
    image: IMG.f4,
    views: 614,
    author: { name: "Elena Varsovia", avatar: IMG.a2 },
    sections: [
      {
        type: "paragraph",
        text: "Invest in quality bones — flooring, lighting, and built-ins — then layer personality with textiles and art that are easy to refresh over the years.",
      },
    ],
  },
  {
    _id: "blog-24",
    title: "Styling Shelves and Niches Like a Pro",
    excerpt:
      "Balance, repetition, and negative space — simple rules for displays that look intentional, not crowded.",
    category: "Living Room",
    date: "28 Nov 2025",
    readTime: "4 min",
    image: IMG.f5,
    views: 538,
    author: { name: "Priya Shah", avatar: IMG.a1 },
    sections: [
      {
        type: "paragraph",
        text: "Curated styling ties a room together. Group objects in odd numbers, vary heights, and leave breathing room so each piece can be appreciated.",
      },
    ],
  },
];

export const fallbackTeamStats: TeamStat[] = [
  { value: "100+", label: "Successful Projects Completed" },
  { value: "03", label: "Years of Excellence in Interior Solutions" },
];

export const fallbackDesignTeam: TeamMember[] = [
  {
    _id: "tm-1",
    name: "Brooklyn Simmons",
    role: "Founder & Creative Director",
    image: IMG.a1,
    teamType: "Design",
  },
  {
    _id: "tm-2",
    name: "Jenny Wilson",
    role: "Founder & Creative Director",
    image: IMG.a2,
    teamType: "Design",
  },
  {
    _id: "tm-3",
    name: "Savannah Nguyen",
    role: "Founder & Creative Director",
    image: IMG.a3,
    teamType: "Design",
  },
  {
    _id: "tm-4",
    name: "Annette Black",
    role: "Senior Interior Designer",
    image: IMG.f1,
    teamType: "Design",
  },
  {
    _id: "tm-5",
    name: "Cameron Williamson",
    role: "Design Lead — Kitchens",
    image: IMG.f2,
    teamType: "Design",
  },
  {
    _id: "tm-6",
    name: "Esther Howard",
    role: "Visualisation Specialist",
    image: IMG.f3,
    teamType: "Design",
  },
  {
    _id: "tm-7",
    name: "Robert Fox",
    role: "Materials Consultant",
    image: IMG.f4,
    teamType: "Design",
  },
  {
    _id: "tm-8",
    name: "Leslie Alexander",
    role: "Junior Designer",
    image: IMG.a1,
    teamType: "Design",
  },
  {
    _id: "tm-9",
    name: "Theresa Webb",
    role: "Design Coordinator",
    image: IMG.a2,
    teamType: "Design",
  },
];

export const fallbackArchitectTeam: TeamMember[] = [
  {
    _id: "arch-1",
    name: "Rohan Kapoor",
    role: "Lead Architect",
    image: IMG.f2,
    teamType: "Architect",
  },
  {
    _id: "arch-2",
    name: "Lisa Müller",
    role: "Structural Engineer",
    image: IMG.f7,
    teamType: "Architect",
  },
  {
    _id: "arch-3",
    name: "David Okonkwo",
    role: "Junior Engineer",
    image: IMG.a1,
    teamType: "Architect",
  },
  {
    _id: "arch-4",
    name: "James Wilson",
    role: "Project Architect",
    image: IMG.f5,
    teamType: "Architect",
  },
  {
    _id: "arch-5",
    name: "Sophie Laurent",
    role: "Technical Lead",
    image: IMG.f6,
    teamType: "Architect",
  },
  {
    _id: "arch-6",
    name: "Michael Torres",
    role: "Site Supervisor",
    image: IMG.f7,
    teamType: "Headquarter",
  },
  {
    _id: "arch-7",
    name: "Priya Sharma",
    role: "Structural Engineer",
    image: IMG.a3,
    teamType: "Engineer",
  },
  {
    _id: "arch-8",
    name: "Emma Collins",
    role: "MEP Coordinator",
    image: IMG.f2,
    teamType: "Engineer",
  },
  {
    _id: "arch-9",
    name: "Daniel Kim",
    role: "Junior Architect",
    image: IMG.f3,
    teamType: "Architect",
  },
];

/** @deprecated use fallbackArchitectTeam */
export const fallbackHqTeam = fallbackArchitectTeam;

export const designTools = [
  { name: "CAXA", icon: "caxa", image: "/team/design-tools/caxa.svg" },
  { name: "AUTO CAD", icon: "autocad", image: "/team/design-tools/autocad.svg" },
  { name: "3D MAX", icon: "3dmax", image: "/team/design-tools/3dmax.svg" },
] as const;

export const qualityGalleryImages = [
  { src: IMG.f1, alt: "Premium kitchen cabinetry detail" },
  { src: IMG.f2, alt: "Living room finish and texture" },
  { src: IMG.f3, alt: "Bedroom wardrobe craftsmanship" },
  { src: IMG.f4, alt: "Bathroom vanity and stone surface" },
];

export const aboutHeroGalleryImages = [IMG.a1, IMG.a2, IMG.a3];

export const aboutStoryCollageImages = [IMG.f1, IMG.f2, IMG.a3, IMG.f4];

/** @deprecated use aboutStoryCollageImages */
export const aboutStoryGridImages = aboutStoryCollageImages;

function resolveAuthorName(name: unknown, fallback: string): string {
  if (typeof name === "string" && name.trim()) return name;
  if (name && typeof name === "object" && !Array.isArray(name)) {
    const obj = name as Record<string, unknown>;
    const picked =
      obj.en ??
      obj.th ??
      obj.pl ??
      Object.values(obj).find((v) => typeof v === "string" && String(v).trim());
    if (typeof picked === "string" && picked.trim()) return picked;
  }
  return fallback;
}

/** Map admin CMS `{ heading, text, image }` blocks → site BlogSection layout types. */
function mapCmsBlogSections(raw: unknown, locale: Locale): BlogSection[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  const out: BlogSection[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const heading =
      pickLocalized(row.heading, locale) ||
      (typeof row.heading === "string" ? row.heading : "") ||
      "";
    const text =
      pickLocalized(row.text, locale) ||
      (typeof row.text === "string" ? row.text : "") ||
      "";
    const image = typeof row.image === "string" ? row.image.trim() : "";

    if (image && text) {
      out.push({
        type: "split-left",
        text,
        image,
        imageAlt: heading || "Blog image",
        caption: heading || undefined,
      });
      continue;
    }
    if (image) {
      out.push({
        type: "image",
        image,
        imageAlt: heading || "Blog image",
        caption: heading || undefined,
      });
      continue;
    }
    if (heading) {
      out.push({ type: "subheading", text: heading });
    }
    if (text) {
      out.push({ type: "paragraph", text });
    }
  }

  return out;
}

export function normalizeBlog(
  raw: Partial<BlogPost> & { id?: string },
  locale?: Locale,
): BlogPost | null {
  const loc = getLocaleOrDefault(locale);
  const id = String(raw._id ?? raw.id ?? "").trim();
  if (!id) return null;
  const fallback = fallbackBlogs.find((b) => b._id === id);
  const apiHasLocale =
    hasLocalizedMap(raw.title, loc) ||
    hasLocalizedMap(raw.excerpt, loc) ||
    hasLocalizedMap(raw.content, loc);
  const localePack = loc !== "en" ? BLOG_BY_LOCALE[loc]?.[id] : undefined;

  let title =
    pickLocalized(raw.title, loc) ||
    (typeof raw.title === "string" ? raw.title : "") ||
    localePack?.title ||
    fallback?.title ||
    "";
  if (!title.trim()) return null;
  let excerpt =
    pickLocalized(raw.excerpt, loc) ||
    (typeof raw.excerpt === "string" ? raw.excerpt : "") ||
    localePack?.excerpt ||
    fallback?.excerpt ||
    "";
  const contentRaw = raw.content ?? raw.excerpt;
  let content =
    pickLocalized(contentRaw, loc) ||
    (typeof contentRaw === "string" ? contentRaw : undefined) ||
    localePack?.content ||
    fallback?.content;

  if (loc !== "en" && !apiHasLocale && localePack) {
    if (localePack.title) title = localePack.title;
    if (localePack.excerpt) excerpt = localePack.excerpt;
    if (localePack.content) content = localePack.content;
  }

  const bodyText = String(content || excerpt || "").trim();
  let category =
    pickLocalized(raw.category, loc) ||
    (typeof raw.category === "string" ? raw.category : "") ||
    localePack?.category ||
    fallback?.category ||
    "Design";

  const cmsSections = mapCmsBlogSections(
    (raw as { sections?: unknown }).sections,
    loc,
  );

  return {
    _id: id,
    title,
    excerpt,
    content,
    date: raw.date || fallback?.date || "—",
    readTime: raw.readTime || fallback?.readTime || "—",
    category,
    image: raw.image || fallback?.image || IMG.f1,
    author: {
      name: resolveAuthorName(raw.author?.name, fallback?.author.name || "Varsovia Design"),
      avatar: raw.author?.avatar || fallback?.author.avatar || IMG.a2,
    },
    views: raw.views ?? fallback?.views ?? 0,
    sections:
      cmsSections.length > 0
        ? cmsSections
        : fallback?.sections ||
          (bodyText
            ? [{ type: "paragraph", text: bodyText }]
            : [{ type: "paragraph", text: raw.excerpt || title }]),
  };
}

export function resolveBlogs(apiData: unknown[], locale?: Locale): BlogPost[] {
  const loc = getLocaleOrDefault(locale);

  if (!Array.isArray(apiData) || apiData.length === 0) return [];
  return apiData
    .map((item) => normalizeBlog(item as Partial<BlogPost> & { id?: string }, loc))
    .filter(Boolean) as BlogPost[];
}

function isRichBlogSections(sections: BlogSection[]): boolean {
  if (sections.length > 1) return true;
  return sections.some(
    (s) =>
      s.type === "image" ||
      s.type === "split-left" ||
      s.type === "split-right" ||
      s.type === "subheading",
  );
}

function cloneDetailSections(sections: BlogSection[]): BlogSection[] {
  return sections.map((s) => ({ ...s }));
}

/** Apply Figma detail layout + assets for API posts that only ship plain text */
export function enrichBlogForDetailPage(blog: BlogPost): BlogPost {
  const intro =
    String(blog.content || blog.excerpt || "").trim() || DEFAULT_BLOG_DETAIL_INTRO;

  let sections = blog.sections;
  if (!isRichBlogSections(sections)) {
    sections = cloneDetailSections(FIGMA_BLOG_DETAIL_SECTIONS).map((section, index) => {
      if (index === 0 && section.type === "paragraph") {
        return { ...section, text: intro };
      }
      return section;
    });
  }

  return {
    ...blog,
    image: resolveMediaUrl(blog.image, IMG.f3),
    author: {
      ...blog.author,
      avatar: resolveMediaUrl(blog.author.avatar, IMG.a1),
    },
    sections: sections.map((section) =>
      section.image
        ? { ...section, image: resolveMediaUrl(section.image, IMG.f2) }
        : section,
    ),
  };
}

function mergeBlogDetailFromFallback(post: BlogPost, locale?: Locale): BlogPost {
  const loc = getLocaleOrDefault(locale);
  const fallback = fallbackBlogs.find((b) => b._id === post._id);
  if (!fallback) return post;
  if (loc !== "en") {
    return post;
  }
  return {
    ...post,
    sections: fallback.sections,
  };
}

/** Resolve a blog by id from API payload, static fallbacks, or an already-fetched list. */
export function getBlogById(
  id: string,
  apiBlog?: unknown | null,
  fromList?: BlogPost[],
  locale?: Locale,
): BlogPost | null {
  const needle = String(id).trim();
  if (!needle) return null;
  const loc = getLocaleOrDefault(locale);

  if (apiBlog && typeof apiBlog === "object" && "title" in apiBlog) {
    const normalized = normalizeBlog(apiBlog as Partial<BlogPost> & { id?: string }, loc);
    if (normalized) return mergeBlogDetailFromFallback(normalized, loc);
  }

  const inList = fromList?.find((b) => String(b._id) === needle);
  if (inList) return mergeBlogDetailFromFallback(inList, loc);

  const fallback = fallbackBlogs.find((b) => b._id === needle);
  if (!fallback) return null;
  return normalizeBlog(fallback, loc) ?? fallback;
}

export function getRelatedBlogs(currentId: string, blogs: BlogPost[], limit = 3): BlogPost[] {
  return blogs.filter((b) => b._id !== currentId).slice(0, limit);
}

export function paginateBlogs<T>(items: T[], page: number, perPage = BLOGS_PER_PAGE) {
  return paginateItems(items, page, perPage);
}

export type BlogSortOption = "all" | "newest" | "oldest";

function parseBlogDate(dateStr: string): number {
  const parsed = Date.parse(dateStr);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function sortBlogPosts(posts: BlogPost[], sortBy: BlogSortOption): BlogPost[] {
  if (sortBy === "all") return [...posts];
  const byNewest = [...posts].sort(
    (a, b) => parseBlogDate(b.date) - parseBlogDate(a.date)
  );
  return sortBy === "newest" ? byNewest : byNewest.reverse();
}

export function resolveTeamMembers(
  apiData: unknown[],
  locale?: Locale,
): {
  designTeam: TeamMember[];
  architectTeam: TeamMember[];
} {
  const loc = getLocaleOrDefault(locale);
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return { designTeam: fallbackDesignTeam, architectTeam: fallbackArchitectTeam };
  }

  const members = apiData.map((m, i) => {
    const raw = m as TeamMember;
    const name =
      pickLocalized(raw.name, loc) ||
      (typeof raw.name === "string" ? raw.name : "") ||
      "Team Member";
    const role =
      pickLocalized(raw.role, loc) ||
      (typeof raw.role === "string" ? raw.role : "") ||
      "Junior Designer";
    return {
      _id: raw._id || raw.id || `team-${i}`,
      name,
      role,
      image: raw.image || IMG.a2,
      teamType: raw.teamType,
    };
  });

  const italian = members.filter((m) => m.teamType === "Italian" || m.teamType === "Design");
  const architects = members.filter(
    (m) => m.teamType === "Architect" || m.teamType === "Headquarter" || m.teamType === "Engineer"
  );

  return {
    designTeam: italian.length > 0 ? italian : fallbackDesignTeam,
    architectTeam: architects.length > 0 ? architects : fallbackArchitectTeam,
  };
}

export function blogStaticParams() {
  return fallbackBlogs.map((b) => ({ id: b._id }));
}
