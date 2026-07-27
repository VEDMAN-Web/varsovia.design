"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Award, Compass, Cpu, Layers } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ITALIAN_TEAM = Array.from({ length: 3 }, (_, i) => ({
  id: `it-${i}`,
  name: "John Smith",
  role: "Founder & Creative Director",
  image: "/team/team.png",
}));

const HEADQUARTER_TEAM = Array.from({ length: 3 }, (_, i) => ({
  id: `hq-${i}`,
  name: "John Smith",
  role: "Founder & Creative Director",
  image: "/team/team.png",
}));

const TOOLS = [
  { name: "CAXA", icon: Compass },
  { name: "AUTOCAD", icon: Cpu },
  { name: "3D MAX", icon: Layers },
] as const;

import { useEffect, useState } from "react";

export default function OurTeamPage() {
  const [dbMembers, setDbMembers] = useState<any[]>([]);

  useEffect(() => {
    import("@/lib/api").then(({ fetchTeamMembers }) => {
      fetchTeamMembers().then((data) => {
        if (data.length > 0) setDbMembers(data);
      });
    });
  }, []);

  const dbItalian = dbMembers.filter((m) => m.teamType === "Italian");
  const dbHq = dbMembers.filter((m) => m.teamType === "Headquarter");

  const italianTeam = dbItalian.length > 0 ? dbItalian : ITALIAN_TEAM;
  const hqTeam = dbHq.length > 0 ? dbHq : HEADQUARTER_TEAM;

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
              Our Team
            </h1>
            <p className="mt-4 text-[clamp(0.7rem,2vw,0.85rem)] font-medium tracking-[0.24em] text-[#e85d8a] uppercase leading-relaxed">
              THE CREATIVE MINDS BEHIND EVERY BEAUTIFUL SPACE
            </p>
          </div>
        </section>

        {/* Intro Text */}
        <section className="px-4 mb-12">
          <p className="mx-auto max-w-4xl text-center text-[1.02rem] leading-8 text-[#5c3d46]/80 font-medium px-4 md:px-6">
            We have 3 sales teams respectively serving retail customers, commercial project contractors and franchisers. Inside each team, different sales representatives are responsible for different countries and regions. We are experts in our respective fields in order to meet different type customers&apos; needs. 3 sales teams come together in a collaborative effort to provide an excellent experience for our customer.
          </p>
        </section>

        {/* 2. Stats Block Section */}
        <section className="section-pad mx-auto max-w-[1000px] mb-20 md:mb-28">
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {/* Stat Card 1 */}
            <div className="flex items-center gap-5 bg-[#F6EAEA] p-6 rounded-[16px] shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/30 select-none">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dfc2c6]/40 text-[#5c3d42]">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-[#5c3d42]">100+</h4>
                <p className="text-xs font-semibold text-[#5c3d42]/70 mt-1 uppercase tracking-wider">
                  Successful Projects Completed
                </p>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="flex items-center gap-5 bg-[#F6EAEA] p-6 rounded-[16px] shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/30 select-none">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dfc2c6]/40 text-[#5c3d42]">
                <Award size={24} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-[#5c3d42]">03</h4>
                <p className="text-xs font-semibold text-[#5c3d42]/70 mt-1 uppercase tracking-wider">
                  Years of Excellence in Interior Solutions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Italian Design Team Grid */}
        <section className="section-pad mx-auto max-w-[1240px] mb-16 md:mb-24">
          <h2 className="font-display text-2xl font-bold text-[#5c3d42] mb-1">
            Professional Design Team
          </h2>
          <p className="text-sm font-semibold text-[#e85d8a] uppercase tracking-wider mb-4">
            Italian design team
          </p>
          <p className="text-[0.96rem] leading-7 text-[#5c3d46]/80 font-medium max-w-4xl mb-10">
            OPPOLIA has been collaborating with Italy designers and suppliers so as to enhance its global competency. We combine the updated aesthetic with functionality, in order to create exciting space tailored to customers&apos; wishes, and bring the lasting living pleasure.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {italianTeam.map((member) => (
              <div
                key={member.id}
                className="overflow-hidden rounded-[14px] bg-[#e8e2e0] shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/30 flex flex-col items-center text-center"
              >
                <div className="w-full aspect-[4/5] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Team member overlay card detail at bottom */}
                <div className="w-full bg-[#F6EAEA] py-4 border-t border-[#e5dcd3]/35">
                  <h4 className="text-sm font-bold text-[#5c3d42]">{member.role}</h4>
                  <p className="text-xs font-semibold text-[#e85d8a] mt-1 uppercase tracking-wider">
                    {member.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Headquarter Design Team Grid */}
        <section className="section-pad mx-auto max-w-[1240px] mb-16 md:mb-24">
          <h2 className="font-display text-2xl font-bold text-[#5c3d42] mb-4">
            Headquarter design team
          </h2>
          <p className="text-[0.96rem] leading-7 text-[#5c3d46]/80 font-medium max-w-4xl mb-10">
            OPPOLIA&apos;s design team has extensive design experience, regularly researches and learns design styles and concepts from different countries and regions, always pays close attention to and follows international trends, and is committed to providing customers with integrated home consulting services.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {hqTeam.map((member) => (
              <div
                key={member.id}
                className="overflow-hidden rounded-[14px] bg-[#e8e2e0] shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/30 flex flex-col items-center text-center"
              >
                <div className="w-full aspect-[4/5] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Team member overlay card detail at bottom */}
                <div className="w-full bg-[#F6EAEA] py-4 border-t border-[#e5dcd3]/35">
                  <h4 className="text-sm font-bold text-[#5c3d42]">{member.role}</h4>
                  <p className="text-xs font-semibold text-[#e85d8a] mt-1 uppercase tracking-wider">
                    {member.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Professional Design Tools Section */}
        <section className="section-pad mx-auto max-w-[1240px]">
          <h2 className="font-display text-2xl font-bold text-[#5c3d42] mb-4">
            Professional design tool
          </h2>
          <p className="text-[0.96rem] leading-7 text-[#5c3d46]/80 font-medium max-w-4xl mb-10">
            Professional design tools are adopted to assist for perfect art effect, including CAXA, CAD, 3D MAX, KD MAX, etc.
          </p>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8 lg:gap-10">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.name}
                  className="rounded-[16px] bg-[#F6EAEA] p-8 text-center shadow-[0_8px_30px_rgba(107,44,58,0.02)] border border-[#e5dcd3]/20 flex flex-col items-center select-none"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#5c3d42] shadow-[0_4px_14px_rgba(107,44,58,0.04)] mb-4">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <h4 className="font-display text-base font-bold tracking-[0.06em] text-[#5c3d46]">
                    {tool.name}
                  </h4>
                </div>
              );
            })}
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
