"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle2, Compass, Cpu, Layers, Box } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import CompanyHero from "@/components/company/CompanyHero";
import FadeInView from "@/components/company/FadeInView";
import {
  cardHoverProps,
  COMPANY_BODY,
  COMPANY_CARD,
  COMPANY_PAGE_BG,
  COMPANY_SHELL,
  PAGE_STAT_VALUE_CLASS,
  SECTION_BODY_CLASS,
  SUBSECTION_EYEBROW_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/components/company/companyLayoutShared";
import { fetchTeamMembers } from "@/lib/api";
import {
  fallbackTeamStats,
  resolveTeamMembers,
  type TeamMember,
} from "@/lib/companyData";

const STAT_ICONS = [CheckCircle2, Award] as const;

const TOOLS = [
  { name: "CAXA", icon: Compass },
  { name: "AUTOCAD", icon: Cpu },
  { name: "3D MAX", icon: Layers },
  { name: "KD MAX", icon: Box },
] as const;

function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      whileHover={cardHoverProps.whileHover}
      className="flex flex-col overflow-hidden rounded-[14px] border border-[#e5dcd3]/30 bg-[#e8e2e0] text-center shadow-[0_4px_20px_rgba(107,44,58,0.015)]"
    >
      <div className="aspect-[4/5] w-full overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
        />
      </div>
      <div className="w-full border-t border-[#e5dcd3]/35 bg-[#F6EAEA] py-4">
        <h4 className={`${SECTION_BODY_CLASS} text-sm font-semibold`}>{member.role}</h4>
        <p className={`${SUBSECTION_EYEBROW_CLASS} mt-1 text-xs`}>{member.name}</p>
      </div>
    </motion.article>
  );
}

export default function OurTeamPage() {
  const [designTeam, setDesignTeam] = useState<TeamMember[]>([]);
  const [architectTeam, setArchitectTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers()
      .then((data) => {
        const resolved = resolveTeamMembers(Array.isArray(data) ? data : []);
        setDesignTeam(resolved.designTeam);
        setArchitectTeam(resolved.architectTeam);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className={COMPANY_PAGE_BG}>
        <CompanyHero
          title="Our Team"
          subtitle="The creative minds behind every beautiful space"
        />

        <section className={`${COMPANY_SHELL} mb-12`}>
          <FadeInView>
            <p className={`mx-auto max-w-4xl text-center ${COMPANY_BODY}`}>
              We have dedicated teams serving retail customers, commercial project contractors, and whole-house
              clients. Each group brings deep expertise in its field, working together to deliver an excellent
              experience from first consultation through final installation.
            </p>
          </FadeInView>
        </section>

        <section className={`${COMPANY_SHELL} mb-20 max-w-[900px] md:mb-28`}>
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {fallbackTeamStats.map((stat, i) => {
              const Icon = STAT_ICONS[i] || CheckCircle2;
              return (
                <FadeInView key={stat.label} delay={i * 0.1}>
                  <div className={`flex items-center gap-5 px-6 py-7 ${COMPANY_CARD} select-none`}>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dfc2c6]/40 text-[#6a414d]">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4 className={PAGE_STAT_VALUE_CLASS}>{stat.value}</h4>
                      <p className={`mt-1 ${SUBSECTION_EYEBROW_CLASS} text-xs`}>{stat.label}</p>
                    </div>
                  </div>
                </FadeInView>
              );
            })}
          </div>
        </section>

        <section className={`${COMPANY_SHELL} mb-16 md:mb-24`}>
          <FadeInView>
            <h2 className={`mb-4 ${SUBSECTION_TITLE_CLASS}`}>Professional Design Team</h2>
            <p className={`mb-10 max-w-4xl ${COMPANY_BODY}`}>
              Our design team combines international aesthetics with practical functionality — researching global
              trends, refining every layout, and creating visualizations that help you see your space before
              installation begins.
            </p>
          </FadeInView>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse overflow-hidden rounded-[14px] border border-[#e5dcd3]/30 bg-[#F6EAEA]">
                    <div className="aspect-[4/5] bg-[#e8dede]/60" />
                    <div className="space-y-2 p-4">
                      <div className="mx-auto h-3 w-2/3 rounded bg-[#e8dede]/80" />
                      <div className="mx-auto h-2 w-1/2 rounded bg-[#e8dede]/60" />
                    </div>
                  </div>
                ))
              : designTeam.map((member, i) => (
                  <TeamMemberCard key={member._id} member={member} index={i} />
                ))}
          </div>
        </section>

        <section className={`${COMPANY_SHELL} mb-16 md:mb-24`}>
          <FadeInView>
            <h2 className={`mb-4 ${SUBSECTION_TITLE_CLASS}`}>Architect / Engineers</h2>
            <p className={`mb-10 max-w-4xl ${COMPANY_BODY}`}>
              Our architect and engineering team ensures structural integrity, precise technical drawings, and
              seamless coordination between design intent and on-site execution.
            </p>
          </FadeInView>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {architectTeam.map((member, i) => (
              <TeamMemberCard key={member._id} member={member} index={i} />
            ))}
          </div>
        </section>

        <section className={COMPANY_SHELL}>
          <FadeInView>
            <h2 className={`mb-4 ${SUBSECTION_TITLE_CLASS}`}>Professional Design Tools</h2>
            <p className={`mb-10 max-w-4xl ${COMPANY_BODY}`}>
              Industry-leading software supports every stage of our design process — from technical drawings and
              spatial planning to photorealistic 3D renders.
            </p>
          </FadeInView>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
            {TOOLS.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <FadeInView key={tool.name} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.35 }}
                    className={`flex flex-col items-center p-8 text-center select-none ${COMPANY_CARD}`}
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[12px] bg-white text-[#6a414d] shadow-[0_4px_14px_rgba(107,44,58,0.04)]">
                      <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <h4 className={`${SUBSECTION_EYEBROW_CLASS} text-sm`}>{tool.name}</h4>
                  </motion.div>
                </FadeInView>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
