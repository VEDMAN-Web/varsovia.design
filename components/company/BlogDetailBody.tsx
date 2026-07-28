"use client";

import { motion } from "framer-motion";
import { COMPANY_IMAGE_FRAME, PAGE_BODY_LEAD_CLASS } from "@/components/company/companyLayoutShared";
import type { BlogSection } from "@/lib/companyData";

type BlogDetailBodyProps = {
  sections: BlogSection[];
};

export default function BlogDetailBody({ sections }: BlogDetailBodyProps) {
  return (
    <div className="space-y-10 md:space-y-14">
      {sections.map((section, i) => {
        if (section.type === "paragraph") {
          return (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className={`${PAGE_BODY_LEAD_CLASS} max-w-[820px]`}
            >
              {section.text}
            </motion.p>
          );
        }

        if (section.type === "image" && section.image) {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className={COMPANY_IMAGE_FRAME}
            >
              <img
                src={section.image}
                alt={section.imageAlt || "Blog illustration"}
                className="aspect-[16/10] w-full object-cover md:aspect-[21/9]"
              />
            </motion.div>
          );
        }

        if ((section.type === "split-left" || section.type === "split-right") && section.image) {
          const imageFirst = section.type === "split-right";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="grid items-center gap-6 md:grid-cols-2 md:gap-10"
            >
              <div className={`${COMPANY_IMAGE_FRAME} ${imageFirst ? "md:order-1" : "md:order-2"}`}>
                <img
                  src={section.image}
                  alt={section.imageAlt || "Blog detail"}
                  className="aspect-[4/5] w-full object-cover md:aspect-[3/4]"
                />
              </div>
              <p className={`${PAGE_BODY_LEAD_CLASS} ${imageFirst ? "md:order-2" : "md:order-1"}`}>
                {section.text}
              </p>
            </motion.div>
          );
        }

        return null;
      })}
    </div>
  );
}
