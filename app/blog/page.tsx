"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const BLOG_ITEMS = Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 1),
  title: "Top Trends Transforming Modern Interior Design Showrooms in 2026",
  excerpt: "For entrepreneurs, dealers, and showroom investors looking to transform modern showrooms, keeping up with design updates is essential for...",
  date: "12 Jun 2026",
  readTime: "4 min",
  author: {
    name: "Courtney Henry",
    avatar: "/team/team.png",
  },
  image: "/blog/blog1.png",
}));

export default function BlogListingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    import("@/lib/api").then(({ fetchBlogs }) => {
      fetchBlogs().then((data) => {
        setBlogs(data.length > 0 ? data : BLOG_ITEMS);
        setLoading(false);
      });
    });
  });

  return (
    <>
      <Navbar />
      <main className="bg-[#f7f3f2] pt-[72px] pb-20 md:pb-28 min-h-screen">
        {/* 1. Hero Header */}
        <section className="px-4 pb-8 pt-10 md:px-8 md:pb-10 md:pt-16">
          <div
            className="mx-auto max-w-[1240px] px-6 py-16 text-center md:px-14 md:py-24 rounded-[16px] bg-[#F4EBEC]/50 mb-8 md:mb-12"
          >
            <h1 className="font-display text-[clamp(2.2rem,5vw,3.2rem)] font-medium tracking-[0.06em] text-[#5c3d46] uppercase">
              Our Blog
            </h1>
            <p className="mt-4 text-[clamp(0.7rem,2vw,0.85rem)] font-medium tracking-[0.24em] text-[#e85d8a] uppercase leading-relaxed">
              IDEAS, INSPIRATION & INTERIOR INSIGHTS
            </p>
          </div>
        </section>

        {/* 2. Blog Header Info */}
        <section className="section-pad mx-auto max-w-[1240px] mb-8">
          <div className="flex items-center justify-between border-b border-[#e5dcd3]/60 pb-4">
            <h2 className="text-[1.1rem] font-bold text-[#5c3d42]">
              All Blog<span className="text-[#5c3d42]/70 font-medium ml-1">(24)</span>
            </h2>

            <div className="flex items-center gap-2 text-sm text-[#5c3d42] font-semibold">
              <span>Short by :</span>
              <select
                className="rounded-md border border-[#d6d0d0] bg-white px-3 py-1.5 text-sm text-[#5c3d42] outline-none transition focus:border-[#5c3d42] cursor-pointer"
                defaultValue="all"
              >
                <option value="all">All</option>
                <option value="recent">Recent</option>
                <option value="popular">Popular</option>
              </select>
            </div>
          </div>
        </section>

        {/* 3. Blog Grid */}
        <section className="section-pad mx-auto max-w-[1240px] mb-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                className="group relative overflow-hidden rounded-[14px] bg-[#F6EAEA] shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/30 flex flex-col justify-between transition hover:shadow-[0_8px_30px_rgba(107,44,58,0.04)] cursor-pointer"
              >
                <div>
                  {/* Blog Cover Image with overlay tag */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex justify-between items-center text-white text-[0.72rem] font-semibold select-none">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#e8a0ad]" />
                        {blog.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-[#e8a0ad]" />
                        {blog.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Excerpt details */}
                  <div className="p-5 pb-3">
                    <h3 className="text-[1.05rem] font-bold text-[#5c3d42] leading-snug group-hover:text-[#e85d8a] transition duration-300">
                      {blog.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#5c3d42]/75 leading-relaxed font-medium line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <span className="mt-3 inline-block text-xs font-bold text-[#5c3d42] underline hover:text-[#e85d8a] transition duration-300">
                      Read More
                    </span>
                  </div>
                </div>

                {/* Author footer */}
                <div className="border-t border-[#e5dcd3]/40 p-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-[#5c3d42]/10 bg-white">
                    <img src={blog.author.avatar} alt={blog.author.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold text-[#5c3d42]/90">
                    {blog.author.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Pagination */}
        <section className="section-pad mx-auto max-w-[1240px] flex items-center justify-center gap-2 select-none">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#5c3d42]/60 hover:bg-[#F4EBEC] transition cursor-pointer"
          >
            &lt;
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition cursor-pointer ${
                currentPage === page
                  ? "bg-[#5c3d42] text-white"
                  : "text-[#5c3d42] hover:bg-[#F4EBEC]"
              }`}
            >
              {page}
            </button>
          ))}
          <span className="text-[#5c3d42]/60 px-1 text-xs">...</span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#5c3d42]/60 hover:bg-[#F4EBEC] transition cursor-pointer"
          >
            &gt;
          </button>
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
