/** Fallback content for Company pages when API is empty */

import { MEDIA } from "./mediaAssets";

export type BlogAuthor = { name: string; avatar: string };

export type BlogSection = {
  type: "paragraph" | "image" | "split-left" | "split-right";
  text?: string;
  image?: string;
  imageAlt?: string;
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

export const BLOGS_PER_PAGE = 6;

export const COMPANY_EASE = [0.22, 1, 0.36, 1] as const;

const IMG = {
  f1: MEDIA.featured[0],
  f2: MEDIA.featured[1],
  f3: MEDIA.featured[2],
  f4: MEDIA.featured[3],
  f5: MEDIA.featured[4],
  f6: MEDIA.featured[5],
  f7: MEDIA.featured[6],
  a1: MEDIA.about[0],
  a2: MEDIA.about[1],
  a3: MEDIA.about[2],
};

export const fallbackBlogs: BlogPost[] = [
  {
    _id: "blog-1",
    title: "10 Interior Design Trends That Will Transform Your Home in 2026",
    excerpt:
      "From warm minimalism to sculptural lighting — discover the trends shaping beautiful, livable interiors this year.",
    category: "Trends",
    date: "Jan 12, 2026",
    readTime: "6 min",
    image: IMG.f1,
    views: 1240,
    author: { name: "Elena Varsovia", avatar: IMG.a2 },
    sections: [
      {
        type: "paragraph",
        text: "Interior design in 2026 is less about chasing novelty and more about creating spaces that feel calm, personal, and built to last. Warm neutrals, tactile materials, and thoughtful lighting are leading the way — and homeowners are prioritizing comfort as much as aesthetics.",
      },
      {
        type: "image",
        image: IMG.f2,
        imageAlt: "Warm minimalist living room",
      },
      {
        type: "split-left",
        text: "Curved silhouettes and soft edges continue to replace sharp, rigid forms. From arched doorways to rounded kitchen islands, these shapes create a sense of flow and make rooms feel more inviting without sacrificing structure.",
        image: IMG.f3,
        imageAlt: "Curved kitchen island detail",
      },
      {
        type: "split-right",
        text: "Natural stone, warm wood grains, and layered textiles add depth and character. The best interiors mix materials intentionally — pairing matte surfaces with subtle gloss, or smooth cabinetry with textured wall panels.",
        image: IMG.f4,
        imageAlt: "Natural stone and wood interior",
      },
      {
        type: "paragraph",
        text: "Whether you're refreshing a single room or planning a full home transformation, these trends offer a strong foundation. The key is choosing what resonates with how you live — and letting quality craftsmanship do the rest.",
      },
    ],
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
];

export const fallbackTeamStats: TeamStat[] = [
  { value: "100+", label: "Successful Projects Completed" },
  { value: "03", label: "Years of Excellence in Interior Solutions" },
];

export const fallbackDesignTeam: TeamMember[] = [
  {
    _id: "tm-1",
    name: "Elena Varsovia",
    role: "Senior Designer",
    image: IMG.a2,
    teamType: "Design",
  },
  {
    _id: "tm-2",
    name: "Marco Rossi",
    role: "Junior Designer",
    image: IMG.f1,
    teamType: "Design",
  },
  {
    _id: "tm-3",
    name: "Priya Shah",
    role: "Junior Designer",
    image: IMG.f3,
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
];

/** @deprecated use fallbackArchitectTeam */
export const fallbackHqTeam = fallbackArchitectTeam;

export const designTools = [
  { name: "CAXA", icon: "caxa" },
  { name: "AUTOCAD", icon: "autocad" },
  { name: "3D MAX", icon: "3dmax" },
  { name: "KD MAX", icon: "kdmax" },
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

export function normalizeBlog(raw: Partial<BlogPost> & { id?: string }): BlogPost | null {
  const id = raw._id || raw.id;
  if (!id || !raw.title) return null;
  const fallback = fallbackBlogs.find((b) => b._id === id);
  return {
    _id: id,
    title: raw.title,
    excerpt: raw.excerpt || fallback?.excerpt || "",
    content: raw.content || fallback?.content,
    date: raw.date || fallback?.date || "—",
    readTime: raw.readTime || fallback?.readTime || "—",
    category: raw.category || fallback?.category || "Design",
    image: raw.image || fallback?.image || IMG.f1,
    author: {
      name: raw.author?.name || fallback?.author.name || "Varsovia Design",
      avatar: raw.author?.avatar || fallback?.author.avatar || IMG.a2,
    },
    views: raw.views ?? fallback?.views ?? 0,
    sections: fallback?.sections || [{ type: "paragraph", text: raw.content || raw.excerpt || "" }],
  };
}

export function resolveBlogs(apiData: unknown[]): BlogPost[] {
  if (!Array.isArray(apiData) || apiData.length === 0) return fallbackBlogs;
  const normalized = apiData
    .map((item) => normalizeBlog(item as Partial<BlogPost> & { id?: string }))
    .filter(Boolean) as BlogPost[];
  return normalized.length > 0 ? normalized : fallbackBlogs;
}

export function getBlogById(id: string, apiBlog?: unknown | null): BlogPost | null {
  if (apiBlog && typeof apiBlog === "object" && "title" in apiBlog) {
    const normalized = normalizeBlog(apiBlog as Partial<BlogPost> & { id?: string });
    if (normalized) return normalized;
  }
  return fallbackBlogs.find((b) => b._id === id) ?? null;
}

export function getRelatedBlogs(currentId: string, blogs: BlogPost[], limit = 3): BlogPost[] {
  return blogs.filter((b) => b._id !== currentId).slice(0, limit);
}

export function paginateBlogs<T>(items: T[], page: number, perPage = BLOGS_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    currentPage: safePage,
    totalPages,
    totalItems: items.length,
  };
}

export function resolveTeamMembers(apiData: unknown[]): {
  designTeam: TeamMember[];
  architectTeam: TeamMember[];
} {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return { designTeam: fallbackDesignTeam, architectTeam: fallbackArchitectTeam };
  }

  const members = apiData.map((m, i) => {
    const raw = m as TeamMember;
    return {
      _id: raw._id || raw.id || `team-${i}`,
      name: raw.name || "Team Member",
      role: raw.role || "Junior Designer",
      image: raw.image || IMG.a2,
      teamType: raw.teamType,
    };
  });

  const italian = members.filter((m) => m.teamType === "Italian" || m.teamType === "Design");
  const architects = members.filter(
    (m) => m.teamType === "Architect" || m.teamType === "Headquarter" || m.teamType === "Engineer"
  );

  return {
    designTeam: (italian.length > 0 ? italian : fallbackDesignTeam).slice(0, 3),
    architectTeam: (architects.length > 0 ? architects : fallbackArchitectTeam).slice(0, 3),
  };
}

export function blogStaticParams() {
  return fallbackBlogs.map((b) => ({ id: b._id }));
}
