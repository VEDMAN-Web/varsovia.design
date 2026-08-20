import type { Locale } from "@/lib/i18n/routing";
import { hasLocalizedMap, pickLocalized } from "@/lib/i18n/pickLocalized";
import faqContentPl from "../messages/locale/faq.content.pl.json";
import faqContentTh from "../messages/locale/faq.content.th.json";

export const FAQ_TOPICS = [
  "Kitchen Interior",
  "Bedroom Interior",
  "Living Room",
  "Bathroom Interior",
  "Doors & Windows",
  "Furniture",
  "Whole Home",
] as const;

export type FaqTopic = (typeof FAQ_TOPICS)[number];

export type FaqItem = { question: string; answer: string };

export const FAQ_DATA: Record<FaqTopic, FaqItem[]> = {
  "Kitchen Interior": [
    {
      question: "Do you provide customized modular kitchens?",
      answer:
        "Yes. Every kitchen is custom-designed to match your space, cooking habits, and style preferences.",
    },
    {
      question: "Which materials do you use for kitchen cabinets?",
      answer:
        "We use high-grade water-resistant plywood, MDF, and particle boards with acrylic, laminate, or PU finishes for durability.",
    },
    {
      question: "Can I choose colors and finishes?",
      answer:
        "Absolutely. We offer a wide range of colors and finishes, from matte and glossy acrylics to textured wood veneers.",
    },
    {
      question: "How long does a kitchen installation take?",
      answer:
        "Typically, modular kitchen fabrication takes 3 to 4 weeks at our facility, and on-site assembly takes 3 to 5 days.",
    },
    {
      question: "Do modular kitchens come with a warranty?",
      answer:
        "Yes, our modular kitchens come with a 5-year warranty covering manufacturing defects and hardware performance.",
    },
  ],
  "Bedroom Interior": [
    {
      question: "What bedroom storage options do you offer?",
      answer:
        "We design custom wardrobes, walk-in closets, under-bed storage, loft spaces, and integrated dressing tables.",
    },
    {
      question: "Can you design a wardrobe to fit a specific niche?",
      answer:
        "Yes, all our wardrobes are tailored to fit your bedroom layout, wall niches, and ceiling heights exactly.",
    },
    {
      question: "Which finishes are best for wardrobes?",
      answer:
        "Laminates are durable and easy to maintain, while mirrors and glass sliders make smaller bedrooms feel larger.",
    },
  ],
  "Living Room": [
    {
      question: "What living room furniture can you customize?",
      answer:
        "We create custom TV console units, wall panels, showcase units, coffee tables, and partition walls.",
    },
    {
      question: "How do you approach living room layouts?",
      answer:
        "We focus on seating comfort, TV viewing angles, storage optimization, and creating clear walking pathways.",
    },
  ],
  "Bathroom Interior": [
    {
      question: "Are your bathroom vanity cabinets water-resistant?",
      answer:
        "Yes, we use BWR (Boiling Water Resistant) plywood or HDMR panels to ensure vanity cabinets withstand moisture.",
    },
    {
      question: "What bathroom storage ideas do you suggest?",
      answer:
        "We suggest under-sink vanity cabinets, wall-mounted mirror cabinets, and open niche shelving for towels.",
    },
  ],
  "Doors & Windows": [
    {
      question: "What frame materials do you recommend?",
      answer:
        "We offer solid wood, uPVC, and high-performance aluminum frames based on weather-resistance and style needs.",
    },
    {
      question: "Do you customize door patterns?",
      answer:
        "Yes, we design custom main doors, sliding balcony doors, and interior flush doors in various veneers.",
    },
  ],
  Furniture: [
    {
      question: "Can you create custom dining tables?",
      answer:
        "Yes, we manufacture custom marble-top, solid wood, and glass-top dining tables matching your interior style.",
    },
    {
      question: "What fabrics do you use for sofas?",
      answer: "We use premium linen, velvet, and leatherette fabrics that are stain-resistant and durable.",
    },
  ],
  "Whole Home": [
    {
      question: "What does a whole home interior design package include?",
      answer:
        "It covers space planning, false ceiling designs, lighting layouts, painting, custom furniture, and decor styling.",
    },
    {
      question: "How long does a full home project take?",
      answer:
        "A complete end-to-end home interior project typically takes 8 to 12 weeks, depending on the scale and complexity.",
    },
  ],
};

const FAQ_BY_LOCALE: Partial<Record<Locale, Record<FaqTopic, FaqItem[]>>> = {
  th: faqContentTh as Record<FaqTopic, FaqItem[]>,
  pl: faqContentPl as Record<FaqTopic, FaqItem[]>,
};

export function getFaqDataForLocale(locale: Locale): Record<FaqTopic, FaqItem[]> {
  return FAQ_BY_LOCALE[locale] ?? FAQ_DATA;
}

export type ApiFaqRow = {
  category?: unknown;
  question?: unknown;
  answer?: unknown;
};

export function normalizeFaqsFromApi(raw: unknown[], locale: Locale) {
  if (!Array.isArray(raw)) return [] as Array<{ category: string; question: string; answer: string }>;

  return raw
    .map((row) => {
      const item = row as ApiFaqRow;
      const category =
        pickLocalized(item.category, locale) || pickLocalized(item.category, "en");
      const question = pickLocalized(item.question, locale);
      const answer = pickLocalized(item.answer, locale);
      if (!category || !question || !answer) return null;
      return { category, question, answer, _raw: item };
    })
    .filter(Boolean) as Array<{
    category: string;
    question: string;
    answer: string;
    _raw: ApiFaqRow;
  }>;
}

export function resolveFaqsForTopic(
  topic: FaqTopic,
  apiFaqs: Array<{ category?: string; question?: string; answer?: string; _raw?: ApiFaqRow }>,
  locale: Locale = "en",
  options?: { preferCms?: boolean },
): FaqItem[] {
  const preferCms = options?.preferCms === true;
  const localizedStatic = getFaqDataForLocale(locale)[topic] ?? [];

  const apiForTopic = apiFaqs.filter((f) => {
    if (!f.question || !f.answer) return false;
    return faqRowCategoryKeys(f).some((cat) => canonicalFaqTopic(cat) === topic);
  });

  if (preferCms) {
    return apiForTopic.map((f) => ({ question: f.question!, answer: f.answer! }));
  }

  if (locale !== "en" && localizedStatic.length > 0) {
    const apiHasLocaleFields = apiForTopic.some(
      (f) =>
        f._raw &&
        (hasLocalizedMap(f._raw.question, locale) || hasLocalizedMap(f._raw.answer, locale)),
    );
    const apiHasCopy = apiForTopic.some((f) => f.question && f.answer);
    if (!apiHasLocaleFields && !apiHasCopy) {
      return localizedStatic;
    }
  }

  if (apiForTopic.length > 0) {
    return apiForTopic.map((f) => ({ question: f.question!, answer: f.answer! }));
  }

  return localizedStatic.length > 0 ? localizedStatic : FAQ_DATA[topic] || [];
}

const FAQ_TOPIC_CANON: Record<string, FaqTopic> = {
  kitchen: "Kitchen Interior",
  "kitchen interior": "Kitchen Interior",
  "อินทีเรียครัว": "Kitchen Interior",
  "wnętrze kuchni": "Kitchen Interior",
  bedroom: "Bedroom Interior",
  "bedroom interior": "Bedroom Interior",
  "อินทีเรียห้องนอน": "Bedroom Interior",
  "wnętrze sypialni": "Bedroom Interior",
  "living room": "Living Room",
  "ห้องนั่งเล่น": "Living Room",
  salon: "Living Room",
  bathroom: "Bathroom Interior",
  "bathroom interior": "Bathroom Interior",
  "อินทีเรียห้องน้ำ": "Bathroom Interior",
  "wnętrze łazienki": "Bathroom Interior",
  "doors & windows": "Doors & Windows",
  "door & windows": "Doors & Windows",
  "ประตูและหน้าต่าง": "Doors & Windows",
  "drzwi i okna": "Doors & Windows",
  furniture: "Furniture",
  "เฟอร์นิเจอร์": "Furniture",
  meble: "Furniture",
  "whole home": "Whole Home",
  "whole house": "Whole Home",
  ทั้งบ้าน: "Whole Home",
  "cały dom": "Whole Home",
};

function canonicalFaqTopic(raw: unknown): FaqTopic | null {
  const cat = String(raw || "").trim().toLowerCase();
  if (!cat) return null;
  if (FAQ_TOPICS.includes(cat as FaqTopic)) return cat as FaqTopic;
  if (FAQ_TOPIC_CANON[cat]) return FAQ_TOPIC_CANON[cat];
  for (const topic of FAQ_TOPICS) {
    if (categoryMatchesTopic(cat, topic.toLowerCase())) return topic;
  }
  for (const [alias, topic] of Object.entries(FAQ_TOPIC_CANON)) {
    if (categoryMatchesTopic(cat, alias)) return topic;
  }
  return null;
}

function faqRowCategoryKeys(
  f: { category?: string; _raw?: ApiFaqRow },
): string[] {
  const keys = new Set<string>();
  const add = (value: unknown) => {
    const s = String(value || "").trim().toLowerCase();
    if (s) keys.add(s);
  };
  add(f.category);
  if (f._raw) {
    add(pickLocalized(f._raw.category, "en"));
    add(pickLocalized(f._raw.category, "th"));
    add(pickLocalized(f._raw.category, "pl"));
  }
  return [...keys];
}

function categoryMatchesTopic(cat: string, topicNorm: string): boolean {
  if (!cat) return false;
  return (
    cat === topicNorm ||
    cat.includes(topicNorm) ||
    topicNorm.includes(cat) ||
    cat.replace(/\s+/g, "") === topicNorm.replace(/\s+/g, "")
  );
}

/** Flatten Q&A across topics for FAQPage JSON-LD. */
export function collectFaqEntities(
  apiFaqs: Array<{ category?: string; question?: string; answer?: string; _raw?: ApiFaqRow }>,
  locale: Locale = "en",
  options?: { preferCms?: boolean },
): FaqItem[] {
  const seen = new Set<string>();
  const out: FaqItem[] = [];
  for (const topic of FAQ_TOPICS) {
    for (const item of resolveFaqsForTopic(topic, apiFaqs, locale, options)) {
      const key = item.question.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}
