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

export function resolveFaqsForTopic(
  topic: FaqTopic,
  apiFaqs: Array<{ category?: string; question?: string; answer?: string }>
): FaqItem[] {
  const matched = apiFaqs.filter((f) => f.category === topic && f.question && f.answer);
  if (matched.length > 0) {
    return matched.map((f) => ({ question: f.question!, answer: f.answer! }));
  }
  return FAQ_DATA[topic] || [];
}
