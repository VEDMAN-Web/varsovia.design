"use client";

import { useState, FormEvent } from "react";
import { Download, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Catalogue Mock Data
const CATALOGUES = Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 1),
  year: "2026",
  title: "EXPLORE KITCHEN DESIGN",
  coverImage: "/catalog/catalog.png",
}));

import { useEffect } from "react";

export default function CataloguePage() {
  const [selectedCatalog, setSelectedCatalog] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [dbCatalogues, setDbCatalogues] = useState<any[]>([]);

  useEffect(() => {
    import("@/lib/api").then(({ fetchCatalogues }) => {
      fetchCatalogues().then((data) => {
        if (data.length > 0) setDbCatalogues(data);
      });
    });
  }, []);

  const cataloguesList = dbCatalogues.length > 0 ? dbCatalogues.map((c) => ({
    id: c._id || c.id,
    year: "2026",
    title: c.title.toUpperCase(),
    coverImage: c.coverImage,
  })) : CATALOGUES;

  function handleOpenModal(id: string) {
    setSelectedCatalog(id);
    setStatus("idle");
  }

  function handleCloseModal() {
    setSelectedCatalog(null);
    setStatus("idle");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const formData = new FormData(e.currentTarget);
      const payload: Record<string, string> = {};
      formData.forEach((value, key) => {
        payload[key] = String(value);
      });
      const { submitContact } = await import("@/lib/api");
      await submitContact(payload);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#f7f3f2] pt-[72px] pb-20 md:pb-28 min-h-screen relative">
        {/* 1. Hero Header */}
        <section className="px-4 pb-8 pt-10 md:px-8 md:pb-10 md:pt-16">
          <div
            className="mx-auto max-w-[1240px] px-6 py-16 text-center md:px-14 md:py-24 rounded-[16px] bg-[#F4EBEC]/50 mb-8 md:mb-12"
          >
            <h1 className="font-display text-[clamp(2.2rem,5vw,3.2rem)] font-medium tracking-[0.06em] text-[#5c3d46] uppercase">
              Free Catalogue
            </h1>
            <p className="mt-4 text-[clamp(0.7rem,2vw,0.85rem)] font-medium tracking-[0.24em] text-[#e85d8a] uppercase leading-relaxed">
              EXPLORE OUR INTERIOR DESIGN CATALOGUE
            </p>
          </div>
        </section>

        {/* 2. Spiral Notebook Grid */}
        <section className="section-pad mx-auto max-w-[1240px] px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12 justify-center">
            {cataloguesList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenModal(item.id)}
                className="group relative cursor-pointer select-none max-w-[340px] mx-auto w-full"
              >
                {/* 3D Notebook Wrapper with custom spiral bindings */}
                <div className="relative pl-6 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:rotate-1">

                  {/* Left Side Spiral Wire Binding Loops (Drawn using CSS to match screenshot) */}
                  <div className="absolute left-1 top-4 bottom-4 w-4 flex flex-col justify-between items-center z-20 pointer-events-none">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-1.5 w-5 rounded-full bg-gradient-to-r from-gray-400 to-gray-200 border border-gray-500/20 shadow-[0_1px_2px_rgba(0,0,0,0.1)] -ml-1"
                      />
                    ))}
                  </div>

                  {/* Notebook Cover Card */}
                  <div className="relative aspect-[3/4] w-full rounded-r-[14px] rounded-l-[4px] overflow-hidden shadow-[5px_5px_15px_rgba(0,0,0,0.12)] border border-[#e5dcd3]/40 bg-[#5c3d42]">
                    {/* Background catalog image */}
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition duration-500"
                    />

                    {/* Dark gradient overlay for text legibility */}
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Text overlays matching screenshot */}
                    <div className="absolute inset-0 flex flex-col items-center justify-between py-10 px-6 text-white text-center">
                      <span className="text-sm font-bold tracking-[0.16em] opacity-80 mt-2">
                        {item.year}
                      </span>

                      <div className="space-y-1">
                        <h3 className="font-display text-[clamp(1.4rem,3.2vw,1.9rem)] font-light tracking-[0.1em] leading-tight">
                          EXPLORE
                        </h3>
                        <h3 className="font-display text-[clamp(1.5rem,3.4vw,2.1rem)] font-bold tracking-[0.08em] leading-tight">
                          KITCHEN
                        </h3>
                        <h3 className="font-display text-[clamp(1.4rem,3.2vw,1.9rem)] font-light tracking-[0.1em] leading-tight">
                          DESIGN
                        </h3>
                      </div>

                      {/* Download pill button */}
                      <div className="bg-white text-[#5c3d42] py-2 px-5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md border border-[#5c3d42]/10 transition hover:bg-[#F6EAEA] select-none">
                        Download
                        <Download size={13} />
                      </div>
                    </div>
                  </div>

                  {/* Behind Shadow Page Layer (creates paper depth) */}
                  <div className="absolute right-0 top-1 bottom-1 w-[4px] bg-white border border-[#e5dcd3]/60 rounded-r-[12px] shadow-[2px_0_5px_rgba(0,0,0,0.05)] z-10" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Catalog Details Modal Popup */}
        {selectedCatalog !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5c3d42]/30 backdrop-blur-sm transition-all duration-300">
            <div className="relative bg-[#F6EAEA] rounded-[20px] max-w-[1000px] w-full shadow-[0_12px_50px_rgba(0,0,0,0.18)] border border-[#e5dcd3]/30 overflow-hidden max-h-[90vh] flex flex-col">

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-30 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-[#5c3d42] transition hover:bg-white cursor-pointer shadow-sm select-none"
              >
                <X size={16} />
              </button>

              <div className="overflow-y-auto p-6 lg:p-8 flex-1">
                {/* Title Banner */}
                <h3 className="text-center font-display text-[1.12rem] md:text-[1.25rem] font-bold text-[#5c3d42] mb-6 tracking-wide px-4 leading-relaxed">
                  &ldquo;Complete the form to download your free design catalogue.&rdquo;
                </h3>

                {status === "success" ? (
                  /* Thank You overlay inside card on success */
                  <div className="flex flex-col items-center justify-center text-center py-10 md:py-16">
                    {/* Checkmark circle with dots */}
                    <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-[#dfc2c6]/40 mb-6 select-none">
                      <svg
                        className="h-10 w-10 text-[#5c3d42]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <div className="absolute -top-4 -right-4 h-1.5 w-1.5 rounded-full bg-[#e85d8a]" />
                      <div className="absolute -bottom-4 -left-4 h-1 w-1 rounded-full bg-[#e85d8a]" />
                      <div className="absolute top-1/2 -left-6 h-1 w-1 rounded-full bg-[#e85d8a]" />
                      <div className="absolute top-1/2 -right-6 h-1.5 w-1.5 rounded-full bg-[#e85d8a]" />
                    </div>

                    <h3 className="font-display text-[1.8rem] font-bold text-[#5c3d42] tracking-wide uppercase">
                      THANK YOU
                    </h3>
                    <p className="mt-3 text-sm font-semibold text-[#e85d8a] uppercase tracking-wider">
                      Your download is ready!
                    </p>
                    <p className="mt-4 max-w-sm text-xs font-semibold text-[#5c3d42]/85 leading-relaxed mb-6">
                      We have sent a copy of the catalogue to your email. You can also download it directly right now using the button below.
                    </p>
                    <a
                      href="/catalog/catalog.png"
                      download="Varsovia-Kitchen-Catalogue-2026.png"
                      className="rounded-[6px] bg-[#5c3d42] text-white py-3 px-8 text-sm font-semibold uppercase tracking-[0.1em] transition hover:bg-[#4a2e33] cursor-pointer inline-flex items-center gap-2 select-none"
                    >
                      Download PDF
                      <Download size={14} />
                    </a>
                  </div>
                ) : (
                  /* Two-column layout */
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left side Collage */}
                    <div className="grid grid-cols-2 gap-3 aspect-square max-w-[420px] mx-auto w-full">
                      <div className="col-span-2 overflow-hidden rounded-[8px]">
                        <img src="/Interior-kitchen/kitchen1.png" alt="kitchen detail" className="w-full h-[150px] object-cover" />
                      </div>
                      <div className="overflow-hidden rounded-[8px]">
                        <img src="/blog/blog1.png" alt="kitchen design" className="w-full h-[120px] object-cover" />
                      </div>
                      <div className="overflow-hidden rounded-[8px]">
                        <img src="/Interior-kitchen/kitchen2.png" alt="kitchen workspace" className="w-full h-[120px] object-cover" />
                      </div>
                      <div className="overflow-hidden rounded-[8px]">
                        <img src="/blog/blog.png" alt="kitchen color palette" className="w-full h-[110px] object-cover" />
                      </div>
                      <div className="overflow-hidden rounded-[8px]">
                        <img src="/Interior-kitchen/kitchen2.png" alt="kitchen lighting" className="w-full h-[110px] object-cover" />
                      </div>
                    </div>

                    {/* Right side form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Row 1: Full Name */}
                      <div>
                        <label className="mb-1 block text-xs text-[#5c3d42] font-semibold">
                          Full Name
                        </label>
                        <input
                          name="name"
                          required
                          placeholder="Enter Your Full Name"
                          className="w-full rounded-[6px] bg-[#dfc2c6] text-xs py-2 px-3 text-[#5c3d42] placeholder:text-[#5c3d42]/50 outline-none border-none"
                        />
                      </div>

                      {/* Row 2: Email Address */}
                      <div>
                        <label className="mb-1 block text-xs text-[#5c3d42] font-semibold">
                          Email Address
                        </label>
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="Enter Your Email Address"
                          className="w-full rounded-[6px] bg-[#dfc2c6] text-xs py-2 px-3 text-[#5c3d42] placeholder:text-[#5c3d42]/50 outline-none border-none"
                        />
                      </div>

                      {/* Row 3: WhatsApp Number | Phone Number */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs text-[#5c3d42] font-semibold">
                            WhatsApp Number
                          </label>
                          <input
                            name="whatsapp"
                            placeholder="Enter Your WhatsApp Number"
                            className="w-full rounded-[6px] bg-[#dfc2c6] text-xs py-2 px-3 text-[#5c3d42] placeholder:text-[#5c3d42]/50 outline-none border-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-[#5c3d42] font-semibold">
                            Phone Number
                          </label>
                          <div className="relative flex items-center bg-[#dfc2c6] rounded-[6px] overflow-hidden">
                            <div className="flex items-center gap-1 px-2 border-r border-[#5c3d42]/10 select-none shrink-0 h-full py-2">
                              <span className="text-xs leading-none">🇹🇭</span>
                              <span className="text-[7px] text-[#5c3d42]/70">▼</span>
                              <span className="text-[10px] font-semibold text-[#5c3d42] ml-0.5">+66</span>
                            </div>
                            <input
                              name="phone"
                              required
                              placeholder="Enter Your Number"
                              className="w-full bg-transparent text-xs py-2 px-2 text-[#5c3d42] placeholder:text-[#5c3d42]/50 outline-none border-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 4: City Name | Country Name */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs text-[#5c3d42] font-semibold">
                            City Name
                          </label>
                          <input
                            name="city"
                            placeholder="Enter Your City Name"
                            className="w-full rounded-[6px] bg-[#dfc2c6] text-xs py-2 px-3 text-[#5c3d42] placeholder:text-[#5c3d42]/50 outline-none border-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-[#5c3d42] font-semibold">
                            Country Name
                          </label>
                          <input
                            name="country"
                            placeholder="Enter Your Country Name"
                            className="w-full rounded-[6px] bg-[#dfc2c6] text-xs py-2 px-3 text-[#5c3d42] placeholder:text-[#5c3d42]/50 outline-none border-none"
                          />
                        </div>
                      </div>

                      {/* Row 5: Project Type */}
                      <div>
                        <label className="mb-1 block text-xs text-[#5c3d42] font-semibold">
                          Project Type
                        </label>
                        <div className="relative">
                          <select
                            name="projectType"
                            className="w-full rounded-[6px] bg-[#dfc2c6] text-xs py-2 px-3 text-[#5c3d42] outline-none appearance-none pr-8 cursor-pointer border-none"
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
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#5c3d42]/70">
                            <span className="text-[8px]">▼</span>
                          </div>
                        </div>
                      </div>

                      {/* Row 6: Message */}
                      <div>
                        <label className="mb-1 block text-xs text-[#5c3d42] font-semibold">
                          Message
                        </label>
                        <textarea
                          name="message"
                          rows={3}
                          placeholder="Tell Us a Bit About Your Kitchen Project..."
                          className="w-full rounded-[6px] bg-[#dfc2c6] text-xs py-2 px-3 text-[#5c3d42] placeholder:text-[#5c3d42]/50 outline-none resize-none border-none"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={status === "loading"}
                          className="rounded-[6px] bg-[#5c3d42] text-white py-2 px-6 text-xs font-semibold uppercase tracking-wider transition hover:bg-[#4a2e33] cursor-pointer"
                        >
                          {status === "loading" ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
