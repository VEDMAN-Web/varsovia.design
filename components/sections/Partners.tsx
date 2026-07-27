"use client";

import { motion } from "framer-motion";

type Partner = {
  _id: string;
  name: string;
};

export default function Partners({ partners }: { partners: Partner[] }) {
  if (!partners.length) return null;

  return (
    <section className="bg-blush py-16 md:py-20">
      <div className="container-1240 text-center">
        <h2 className="heading-section text-[clamp(1.4rem,2.8vw,2.1rem)]">Our Global Partners</h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
          {partners.map((partner, i) => (
            <motion.span
              key={partner._id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="font-display text-xl tracking-[0.12em] text-maroon/70 md:text-2xl"
            >
              {partner.name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
