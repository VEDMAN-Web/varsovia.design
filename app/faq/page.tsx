"use client";

import { useState } from "react";
import { ChevronRight, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// FAQ topics list
const TOPICS = [
  "Kitchen Interior",
  "Bedroom Interior",
  "Living Room",
  "Bathroom Interior",
  "Doors & Windows",
  "Furniture",
  "Whole Home",
] as const;

type TopicType = typeof TOPICS[number];

// FAQ items grouped by topic
const FAQ_DATA: Record<TopicType, { question: string; answer: string }[]> = {
  "Kitchen Interior": [
    {
      question: "Do you provide customized modular kitchens?",
      answer: "Yes. Every kitchen is custom-designed to match your space, cooking habits, and style preferences.",
    },
    {
      question: "Which materials do you use for kitchen cabinets?",
      answer: "We use high-grade water-resistant plywood, MDF, and particle boards with acrylic, laminate, or PU finishes for durability.",
    },
    {
      question: "Can I choose colors and finishes?",
      answer: "Absolutely! We offer a wide range of colors and finishes, from matte and glossy acrylics to textured wood veneers.",
    },
    {
      question: "How long does a kitchen installation take?",
      answer: "Typically, modular kitchen fabrication takes 3 to 4 weeks at our facility, and on-site assembly takes 3 to 5 days.",
    },
    {
      question: "Do modular kitchens come with a warranty?",
      answer: "Yes, our modular kitchens come with a 5-year warranty covering manufacturing defects and hardware performance.",
    },
  ],
  "Bedroom Interior": [
    {
      question: "What bedroom storage options do you offer?",
      answer: "We design custom wardrobes, walk-in closets, under-bed storage, loft spaces, and integrated dressing tables.",
    },
    {
      question: "Can you design a wardrobe to fit a specific niche?",
      answer: "Yes, all our wardrobes are tailored to fit your bedroom layout, wall niches, and ceiling heights exactly.",
    },
    {
      question: "Which finishes are best for wardrobes?",
      answer: "Laminates are durable and easy to maintain, while mirrors and glass sliders make smaller bedrooms feel larger.",
    },
  ],
  "Living Room": [
    {
      question: "What living room furniture can you customize?",
      answer: "We create custom TV console units, wall panels, showcase units, coffee tables, and partition walls.",
    },
    {
      question: "How do you approach living room layouts?",
      answer: "We focus on seating comfort, TV viewing angles, storage optimization, and creating clear walking pathways.",
    },
  ],
  "Bathroom Interior": [
    {
      question: "Are your bathroom vanity cabinets water-resistant?",
      answer: "Yes, we use BWR (Boiling Water Resistant) plywood or HDMR panels to ensure vanity cabinets withstand moisture.",
    },
    {
      question: "What bathroom storage ideas do you suggest?",
      answer: "We suggest under-sink vanity cabinets, wall-mounted mirror cabinets, and open niche shelving for towels.",
    },
  ],
  "Doors & Windows": [
    {
      question: "What frame materials do you recommend?",
      answer: "We offer solid wood, uPVC, and high-performance aluminum frames based on weather-resistance and style needs.",
    },
    {
      question: "Do you customize door patterns?",
      answer: "Yes, we design custom main doors, sliding balcony doors, and interior flush doors in various veneers.",
    },
  ],
  "Furniture": [
    {
      question: "Can you create custom dining tables?",
      answer: "Yes, we manufacture custom marble-top, solid wood, and glass-top dining tables matching your interior style.",
    },
    {
      question: "What fabrics do you use for sofas?",
      answer: "We use premium linen, velvet, and leatherette fabrics that are stain-resistant and durable.",
    },
  ],
  "Whole Home": [
    {
      question: "What does a whole home interior design package include?",
      answer: "It covers space planning, false ceiling designs, lighting layouts, painting, custom furniture, and decor styling.",
    },
    {
      question: "How long does a full home project take?",
      answer: "A complete end-to-end home interior project typically takes 8 to 12 weeks, depending on the scale and complexity.",
    },
  ],
};

import { useEffect } from "react";

export default function FAQPage() {
  const [activeTopic, setActiveTopic] = useState<TopicType>("Kitchen Interior");
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]); // Default first question open
  const [dbFaqs, setDbFaqs] = useState<any[]>([]);

  useEffect(() => {
    import("@/lib/api").then(({ fetchFAQs }) => {
      fetchFAQs().then((data) => {
        if (data.length > 0) setDbFaqs(data);
      });
    });
  }, []);

  function toggleQuestion(index: number) {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }

  function handleTopicChange(topic: TopicType) {
    setActiveTopic(topic);
    setOpenIndexes([0]); // Reset to first question open for the new topic
  }

  const matchedFaqs = dbFaqs.filter((f) => f.category === activeTopic);
  const currentFAQs = matchedFaqs.length > 0 ? matchedFaqs : (FAQ_DATA[activeTopic] || []);

  return (
    <>
      <Navbar />
      <main className="bg-[#f7f3f2] pt-[72px] min-h-screen">
        {/* 1. Hero / Header Title */}
        <section className="px-4 pb-8 pt-10 md:px-8 md:pb-10 md:pt-16">
          <div
            className="mx-auto max-w-[1240px] px-6 py-16 text-center md:px-14 md:py-24 rounded-[16px] bg-[#F4EBEC]/50"
          >
            <h1 className="font-display text-[clamp(2.2rem,5vw,3.2rem)] font-medium tracking-[0.06em] text-[#5c3d46] uppercase">
              FAQ
            </h1>
            <p className="mt-4 text-[clamp(0.7rem,2vw,0.85rem)] font-medium tracking-[0.24em] text-[#e85d8a] uppercase leading-relaxed">
              CLEAR ANSWERS TO HELP YOU MAKE INFORMED DESIGN DECISIONS
            </p>
          </div>
        </section>

        {/* 2. Main content: Two-column layout */}
        <section className="section-pad mx-auto max-w-[1240px] pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-10 items-start">
            {/* Left Column - Topics Navigation */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#5c3d46]/50 uppercase tracking-[0.08em] pl-3 mb-6">
                Topic
              </h3>
              <ul className="space-y-4">
                {TOPICS.map((topic) => {
                  const active = activeTopic === topic;
                  return (
                    <li key={topic}>
                      <button
                        type="button"
                        onClick={() => handleTopicChange(topic)}
                        className={`flex w-full items-center justify-between py-1 transition-all border-l-2 select-none cursor-pointer ${
                          active
                            ? "border-[#5c3d42] text-[#5c3d42] font-semibold pl-4"
                            : "border-transparent text-[#5c3d42]/70 pl-3 hover:text-[#5c3d42] font-medium"
                        }`}
                      >
                        <span className="text-[0.96rem]">{topic}</span>
                        <ChevronRight
                          size={15}
                          className={`transition ${active ? "text-[#5c3d42] translate-x-1" : "text-[#5c3d42]/30"}`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right Column - FAQ Accordion */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-[#5c3d46]/50 uppercase tracking-[0.08em] mb-6">
                Questions & Answer
              </h3>
              <div className="space-y-4">
                {currentFAQs.map((faq, index) => {
                  const isOpen = openIndexes.includes(index);
                  return (
                    <div
                      key={index}
                      className="rounded-[12px] bg-[#F6EAEA] overflow-hidden shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/30 transition"
                    >
                      <button
                        type="button"
                        onClick={() => toggleQuestion(index)}
                        className="flex w-full items-center justify-between p-5 text-left transition select-none cursor-pointer hover:bg-[#F4EBEC]/45"
                      >
                        <span className="text-[1.02rem] font-semibold text-[#5c3d42] leading-snug">
                          {faq.question}
                        </span>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full text-[#5c3d42] select-none shrink-0 ml-4 border border-[#5c3d42]/10 bg-white/20">
                          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                          >
                            <div className="px-5 pb-5 pt-1 border-t border-[#ebdcd3] mt-0.5">
                              <p className="text-sm md:text-[0.95rem] text-[#5c3d42]/85 leading-relaxed font-medium">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer
        bio="Transforming homes with thoughtfully designed interiors that feel timeless, warm, and uniquely yours."
        phone="+91 98765 43210"
        email="hello@Varsoviadesign.in"
        address="SG Highway, Ahmedabad, Gujarat 380015"
      />
    </>
  );
}
