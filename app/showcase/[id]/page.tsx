import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Props = {
  params: Promise<{ id: string }>;
};

const SLUG_TO_CATEGORY: Record<string, string> = {
  "home-case": "Home case",
  "north-america": "North America",
  "south-america": "South America",
  "africa": "Africa",
  "commercial-project": "Commercial Project",
  "europe": "Europe",
  "australia": "Australia",
  "middle-east": "Middle East",
  "asia": "Asia",
};

// Generate static params for the 9 mock showcase items + all categories and indices
export function generateStaticParams() {
  const params: { id: string }[] = [];
  // Add backward compatibility IDs
  for (let i = 1; i <= 9; i++) {
    params.push({ id: String(i) });
  }
  // Add category specific IDs
  Object.keys(SLUG_TO_CATEGORY).forEach((slug) => {
    for (let i = 1; i <= 6; i++) {
      params.push({ id: `${slug}-${i}` });
    }
  });
  return params;
}

function getProjectById(id: string) {
  let resolvedId = id;
  if (id === "1") resolvedId = "home-case-1";
  else if (id === "2") resolvedId = "home-case-2";
  else if (id === "3") resolvedId = "home-case-3";
  else if (id === "4") resolvedId = "home-case-4";
  else if (id === "5") resolvedId = "home-case-5";
  else if (id === "6") resolvedId = "home-case-6";
  else if (id === "7") resolvedId = "commercial-project-1";
  else if (id === "8") resolvedId = "commercial-project-2";
  else if (id === "9") resolvedId = "commercial-project-3";

  const parts = resolvedId.split("-");
  if (parts.length < 2) return null;

  const indexStr = parts[parts.length - 1];
  const index = parseInt(indexStr, 10);
  const categorySlug = parts.slice(0, -1).join("-");
  const categoryName = SLUG_TO_CATEGORY[categorySlug];

  if (!categoryName || isNaN(index) || index < 1 || index > 6) {
    return null;
  }

  let title = `Custom Dark Wood Grain Cabinetry Project in Czech Republic, ${categoryName}`;
  let location = `${categoryName}`;
  let typeOrQty = { label: "Type", value: "Villa / Home" };
  let supplyArea = "Kitchen, Bedroom, Bathroom";

  if (categoryName === "Home case") {
    location = "California, USA";
    if (index === 2) {
      location = "Ontario, Canada";
      typeOrQty = { label: "Type", value: "Apartment" };
    }
  } else if (categoryName === "Commercial Project") {
    if (index === 3) {
      title = "White Kitchen with Peninsula Project in Nairobi, Kenya";
      location = "Nairobi, Kenya";
      typeOrQty = { label: "Quantity", value: "70 Units" };
    } else {
      location = index === 2 ? "Ontario, Canada" : "California, USA";
      typeOrQty = { label: "Type", value: index === 2 ? "Apartment Complex" : "Commercial Office" };
      supplyArea = "Kitchen, Wardrobes";
    }
  }

  return {
    title,
    location,
    typeOrQty,
    supplyArea,
    heroImage: "/showcase/showcase.png",
    detailsImage: "/showcase/showcase-detail.png",
  };
}

export default async function ShowcaseDetailPage({ params }: Props) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#f7f3f2] pt-[72px] pb-20 md:pb-28 min-h-screen">
        {/* 1. Hero banner */}
        <section className="relative w-full h-[50vh] min-h-[340px] md:h-[60vh] overflow-hidden">
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/10" />
        </section>

        <div className="container-1240 py-10 md:py-16 px-4">
          {/* 2. Floated Details Specification Card */}
          <div className="bg-[#F6EAEA] rounded-[16px] p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgba(107,44,58,0.02)] border border-[#e5dcd3]/30 max-w-[900px] mx-auto -mt-20 md:-mt-28 relative z-20 select-none mb-16 md:mb-24">
            <h1 className="font-display text-[1.25rem] md:text-[1.4rem] font-bold text-[#5c3d42] tracking-wide text-center leading-snug mb-6 border-b border-[#5c3d42]/15 pb-5">
              {project.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-[#5c3d42]/10">
              <div className="pt-4 sm:pt-0">
                <span className="text-[10px] uppercase tracking-wider text-[#e85d8a] font-bold block mb-1">
                  Location
                </span>
                <span className="text-sm font-semibold text-[#5c3d42]">
                  {project.location}
                </span>
              </div>
              <div className="pt-4 sm:pt-0 sm:pl-6">
                <span className="text-[10px] uppercase tracking-wider text-[#e85d8a] font-bold block mb-1">
                  {project.typeOrQty.label}
                </span>
                <span className="text-sm font-semibold text-[#5c3d42]">
                  {project.typeOrQty.value}
                </span>
              </div>
              <div className="pt-4 sm:pt-0 sm:pl-6">
                <span className="text-[10px] uppercase tracking-wider text-[#e85d8a] font-bold block mb-1">
                  Supply Area
                </span>
                <span className="text-sm font-semibold text-[#5c3d42] leading-tight">
                  {project.supplyArea}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Kitchen Details collage */}
          <section className="mb-16 md:mb-24">
            <h2 className="font-display text-xl md:text-2xl font-bold text-[#5c3d42] mb-6">
              Kitchen
            </h2>

            {/* Large horizontal image */}
            <div className="w-full aspect-[21/9] md:aspect-[2.4/1] rounded-[16px] overflow-hidden shadow-[0_8px_30px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/30 mb-8">
              <img src={project.detailsImage} alt="Kitchen overall layout" className="w-full h-full object-cover" />
            </div>

            {/* Collage elements (matching details layout in screenshots) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* Left group */}
              <div className="space-y-6">
                <div className="aspect-[4/3] rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/35">
                  <img src="/showcase/showcase-detail.png" alt="Cabinetry details" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[4/3] rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/35">
                  <img src="/showcase/showcase.png" alt="Counter space detail" className="w-full h-full object-cover" />
                </div>
              </div>
              {/* Right group */}
              <div className="space-y-6">
                <div className="aspect-[1/1] rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/35">
                  <img src="/showcase/showcase-detail.png" alt="Oven cabinet layouts" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[3/2] rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/35">
                  <img src="/showcase/showcase.png" alt="Kitchen shelving detail" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </section>

          {/* 4. Bathroom Details collage */}
          <section>
            <h2 className="font-display text-xl md:text-2xl font-bold text-[#5c3d42] mb-6">
              Bathroom
            </h2>

            {/* Large horizontal image */}
            <div className="w-full aspect-[21/9] md:aspect-[2.4/1] rounded-[16px] overflow-hidden shadow-[0_8px_30px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/30 mb-8">
              <img src={project.detailsImage} alt="Bathroom overall layout" className="w-full h-full object-cover" />
            </div>

            {/* Collage elements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* Left group */}
              <div className="space-y-6">
                <div className="aspect-[4/3] rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/35">
                  <img src="/showcase/showcase-detail.png" alt="Vanity details" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[4/3] rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/35">
                  <img src="/showcase/showcase.png" alt="Bathroom layout detail" className="w-full h-full object-cover" />
                </div>
              </div>
              {/* Right group */}
              <div className="space-y-6">
                <div className="aspect-[1/1] rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/35">
                  <img src="/showcase/showcase-detail.png" alt="Vanity cabinet layouts" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[3/2] rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(107,44,58,0.015)] border border-[#e5dcd3]/35">
                  <img src="/showcase/showcase.png" alt="Bathroom vanity shelf detail" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </section>
        </div>
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
