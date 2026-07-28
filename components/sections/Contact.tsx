"use client";



import { motion } from "framer-motion";

import ContactFormPanel from "@/components/forms/ContactFormPanel";

import SectionHeading from "@/components/ui/SectionHeading";

import SectionShell, { SECTION_HEADING_WIDE } from "@/components/ui/SectionShell";



type ContactProps = {

  images: string[];

};



export default function Contact({ images }: ContactProps) {

  return (

    <section id="contact" className="bg-cream pb-20 pt-14 md:pb-28 md:pt-20">

      <SectionShell>

        <SectionHeading

          title="Get In touch"

          subtitle="Your dream space begins with a simple conversation"

          className={`${SECTION_HEADING_WIDE} mb-10 md:mb-20`}

        />



        <motion.div

          initial={{ opacity: 0, y: 24 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          transition={{ duration: 0.6 }}

        >

          <ContactFormPanel images={images} purpose="contact" />

        </motion.div>

      </SectionShell>

    </section>

  );

}

