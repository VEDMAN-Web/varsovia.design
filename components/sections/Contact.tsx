"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { submitContact } from "@/lib/api";

type ContactProps = {
  images: string[];
};

export default function Contact({ images }: ContactProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries()) as Record<string, string>;

    setStatus("loading");
    setMessage("");
    try {
      const res = await submitContact(payload);
      setStatus("success");
      setMessage(res.message || "Submitted successfully.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const collageImages = [
    images[0] || "/home/featured-project/feature-1.jpg",
    images[1] || "/home/about-1.png",
    images[2] || "/home/featured-project/feature-3.jpg",
    images[3] || "/home/featured-project/feature-4.jpg",
    images[4] || "/home/featured-project/feature-5.jpg",
    images[5] || "/home/about-2.png",
    images[6] || "/home/featured-project/feature-7.png",
    images[7] || "/home/featured-project/feature-8.png",
  ];

  return (
    <section id="contact" className="bg-cream py-20 md:py-28">
      <div className="container-1240">
        {/* Section Heading Centered Above Layout */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="heading-section">GET IN TOUCH</h2>
          <p className="mt-3 text-[clamp(0.65rem,1.8vw,0.72rem)] font-medium tracking-[0.22em] text-[#e85d8a] uppercase">
            YOUR DREAM SPACE BEGINS WITH A SIMPLE CONVERSATION
          </p>
        </motion.div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-12 items-stretch">
          {/* Left Side (40%) - Image Collage */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3 h-full"
          >
            {/* Left Column of Collage */}
            <div className="flex flex-col gap-3 h-full justify-between">
              <div className="relative overflow-hidden rounded-[8px] md:rounded-[12px] aspect-[4/3] w-full">
                <img src={collageImages[0]} alt="Kitchen detail 1" className="h-full w-full object-cover" />
              </div>
              <div className="relative overflow-hidden rounded-[8px] md:rounded-[12px] aspect-[3/4] w-full">
                <img src={collageImages[1]} alt="Kitchen detail 2" className="h-full w-full object-cover" />
              </div>
              <div className="relative overflow-hidden rounded-[8px] md:rounded-[12px] aspect-[4/3] w-full">
                <img src={collageImages[2]} alt="Kitchen detail 3" className="h-full w-full object-cover" />
              </div>
              <div className="relative overflow-hidden rounded-[8px] md:rounded-[12px] aspect-[4/3] w-full">
                <img src={collageImages[3]} alt="Kitchen detail 4" className="h-full w-full object-cover" />
              </div>
            </div>

            {/* Right Column of Collage */}
            <div className="flex flex-col gap-3 h-full justify-between">
              <div className="relative overflow-hidden rounded-[8px] md:rounded-[12px] aspect-[4/3] w-full">
                <img src={collageImages[4]} alt="Kitchen detail 5" className="h-full w-full object-cover" />
              </div>
              <div className="relative overflow-hidden rounded-[8px] md:rounded-[12px] aspect-[3/4] w-full">
                <img src={collageImages[5]} alt="Kitchen detail 6" className="h-full w-full object-cover" />
              </div>
              <div className="relative overflow-hidden rounded-[8px] md:rounded-[12px] aspect-[4/3] w-full">
                <img src={collageImages[6]} alt="Kitchen detail 7" className="h-full w-full object-cover" />
              </div>
              <div className="relative overflow-hidden rounded-[8px] md:rounded-[12px] aspect-[4/3] w-full">
                <img src={collageImages[7]} alt="Kitchen detail 8" className="h-full w-full object-cover" />
              </div>
            </div>
          </motion.div>

          {/* Right Side (60%) - Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#F6EAEA] rounded-[16px] md:rounded-[20px] p-6 sm:p-8 md:p-10 lg:p-12 shadow-[0_8px_30px_rgba(107,44,58,0.03)] h-full flex flex-col justify-center"
          >
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center text-center py-10 md:py-16">
                {/* Checkmark circle with dots */}
                <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-[#dfc2c6]/40 mb-6 select-none">
                  {/* Checkmark SVG */}
                  <svg
                    className="h-10 w-10 text-[#5c3d42]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {/* Decorative dots around the checkmark */}
                  <div className="absolute -top-4 -right-4 h-1.5 w-1.5 rounded-full bg-[#e85d8a]" />
                  <div className="absolute -bottom-4 -left-4 h-1 w-1 rounded-full bg-[#e85d8a]" />
                  <div className="absolute top-1/2 -left-6 h-1 w-1 rounded-full bg-[#e85d8a]" />
                  <div className="absolute top-1/2 -right-6 h-1.5 w-1.5 rounded-full bg-[#e85d8a]" />
                  <div className="absolute -top-6 left-1/2 h-1 w-1 rounded-full bg-[#e85d8a]" />
                  <div className="absolute -bottom-6 left-1/2 h-1.5 w-1.5 rounded-full bg-[#e85d8a]" />
                </div>

                <h3 className="font-display text-[1.8rem] font-bold text-[#5c3d42] tracking-wide uppercase">
                  THANK YOU
                </h3>
                <p className="mt-3 text-sm font-semibold text-[#e85d8a] uppercase tracking-wider">
                  Your request has been submitted successfully.
                </p>
                <p className="mt-4 max-w-sm text-xs font-semibold text-[#5c3d42]/85 leading-relaxed">
                  Our design expert will review your requirements and get in touch with you within 24 business hours to discuss your project.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4 md:space-y-5">
                {/* Row 1: Full Name */}
                <div>
                  <label className="mb-1.5 block text-sm text-[#5c3d42] font-semibold">
                    Full Name
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="Enter Your Full Name"
                    className="w-full rounded-[6px] bg-[#dfc2c6] text-sm py-2.5 px-4 text-[#5c3d42] placeholder:text-[#5c3d42]/50 outline-none border-none"
                  />
                </div>

                {/* Row 2: Email Address */}
                <div>
                  <label className="mb-1.5 block text-sm text-[#5c3d42] font-semibold">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Enter Your Email Address"
                    className="w-full rounded-[6px] bg-[#dfc2c6] text-sm py-2.5 px-4 text-[#5c3d42] placeholder:text-[#5c3d42]/50 outline-none border-none"
                  />
                </div>

                {/* Row 3: WhatsApp Number | Phone Number */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm text-[#5c3d42] font-semibold">
                      WhatsApp Number
                    </label>
                    <input
                      name="whatsapp"
                      placeholder="Enter Your WhatsApp Number"
                      className="w-full rounded-[6px] bg-[#dfc2c6] text-sm py-2.5 px-4 text-[#5c3d42] placeholder:text-[#5c3d42]/50 outline-none border-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-[#5c3d42] font-semibold">
                      Phone Number
                    </label>
                    <div className="relative flex items-center bg-[#dfc2c6] rounded-[6px] overflow-hidden">
                      <div className="flex items-center gap-1 px-3 border-r border-[#5c3d42]/10 select-none shrink-0 h-full py-2.5">
                        <span className="text-sm leading-none">🇹🇭</span>
                        <span className="text-[8px] text-[#5c3d42]/70">▼</span>
                        <span className="text-xs font-semibold text-[#5c3d42] ml-1">+66</span>
                      </div>
                      <input
                        name="phone"
                        required
                        placeholder="Enter Your Number"
                        className="w-full bg-transparent text-sm py-2.5 px-3 text-[#5c3d42] placeholder:text-[#5c3d42]/50 outline-none border-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: City Name | Country Name */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm text-[#5c3d42] font-semibold">
                      City Name
                    </label>
                    <input
                      name="city"
                      placeholder="Enter Your City Name"
                      className="w-full rounded-[6px] bg-[#dfc2c6] text-sm py-2.5 px-4 text-[#5c3d42] placeholder:text-[#5c3d42]/50 outline-none border-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-[#5c3d42] font-semibold">
                      Country Name
                    </label>
                    <input
                      name="country"
                      placeholder="Enter Your Country Name"
                      className="w-full rounded-[6px] bg-[#dfc2c6] text-sm py-2.5 px-4 text-[#5c3d42] placeholder:text-[#5c3d42]/50 outline-none border-none"
                    />
                  </div>
                </div>

                {/* Row 5: Project Type Dropdown */}
                <div>
                  <label className="mb-1.5 block text-sm text-[#5c3d42] font-semibold">
                    Project Type
                  </label>
                  <div className="relative">
                    <select
                      name="projectType"
                      className="w-full rounded-[6px] bg-[#dfc2c6] text-sm py-2.5 px-4 text-[#5c3d42] outline-none appearance-none pr-10 cursor-pointer border-none"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Your Project Type
                      </option>
                      <option value="Modular Kitchen">Modular Kitchen</option>
                      <option value="Wardrobe">Wardrobe</option>
                      <option value="TV Unit">TV Unit</option>
                      <option value="Interior Design">Interior Design</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#5c3d42]/70">
                      <span className="text-[10px]">▼</span>
                    </div>
                  </div>
                </div>

                {/* Row 6: Message Textarea */}
                <div>
                  <label className="mb-1.5 block text-sm text-[#5c3d42] font-semibold">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell Us a Bit About Your Kitchen Project..."
                    className="w-full rounded-[6px] bg-[#dfc2c6] text-sm py-2.5 px-4 text-[#5c3d42] placeholder:text-[#5c3d42]/50 outline-none resize-none border-none"
                  />
                </div>

                {/* Centered Submit Button and Status */}
                <div className="flex flex-col items-center gap-3 pt-4">
                  {message && (
                    <p className={`text-sm font-medium ${status === "error" ? "text-red-700" : "text-maroon"}`}>
                      {message}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="rounded-[6px] bg-[#5c3d42] text-white py-3 px-8 text-sm font-semibold uppercase tracking-[0.1em] transition hover:bg-[#4a2e33] cursor-pointer"
                  >
                    {status === "loading" ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
