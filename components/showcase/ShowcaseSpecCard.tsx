import { Link } from "@/lib/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import type { ShowcaseProject } from "@/lib/showcaseData";

type ShowcaseSpecCardProps = {
  project: ShowcaseProject;
  backHref: string;
};
/** Strip category suffix — Figma shows title without trailing region/category */
export function getShowcaseDisplayTitle(title: string) {
  return title
    .replace(
      /,\s*(Home case|Commercial Project|North America|South America|Africa|Europe|Australia|Middle East|Asia|USA|Canada)$/i,
      ""
    )
    .trim();
}

type SpecColumnProps = {
  label: string;
  value: string;
  showDivider?: boolean;
};

function SpecColumn({ label, value, showDivider = false }: SpecColumnProps) {
  return (
    <div className="relative px-6 py-8 sm:px-8 md:px-10 md:py-9">
      {showDivider ? (
        <div
          aria-hidden
          className="absolute bottom-6 left-0 top-6 hidden w-px sm:block"
          style={{
            background:
              "linear-gradient(180deg, rgba(106,65,77,0) 0%, rgba(106,65,77,0.22) 50%, rgba(106,65,77,0) 100%)",
          }}
        />
      ) : null}

      <p className="font-outfit text-[15px] font-bold leading-none text-[#2d2929] md:text-base">{label}</p>
      <span className="mt-2.5 mb-3 block h-px w-8 bg-[#cf5374]/85" aria-hidden />
      <p className="font-outfit text-[14px] font-normal leading-snug text-[#2d2929]/90 md:text-[15px]">{value}</p>
    </div>
  );
}

/** Figma detail spec card — cream panel, bold labels + pink accent lines */
export default function ShowcaseSpecCard({ project, backHref }: ShowcaseSpecCardProps) {
  const fields = [
    { label: "Location", value: project.location },
    { label: project.typeLabel, value: project.typeValue },
    { label: "Supply Area", value: project.supplyArea },
  ] as const;

  return (
    <article className="relative mx-auto w-full max-w-[1040px] overflow-hidden rounded-[8px] bg-[#f9f5f5] shadow-[0_12px_48px_rgba(42,34,34,0.08)]">
      <Link
        href={backHref}
        className="font-outfit inline-flex items-center gap-1.5 px-6 pt-5 text-[14px] font-medium text-[#6a414d]/65 transition hover:text-[#cf5374] sm:px-8 md:px-10 md:pt-6"
      >
        <ChevronLeft size={15} strokeWidth={2} aria-hidden />
        Back to Showcase
      </Link>

      <header className="px-6 pb-9 pt-4 text-center sm:px-10 md:px-12 md:pb-11 md:pt-5">
        <h1 className="font-outfit mx-auto max-w-[820px] text-[clamp(1.05rem,2.2vw,1.5rem)] font-bold leading-[1.45] text-[#2d2929]">
          {getShowcaseDisplayTitle(project.title)}
        </h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3">
        {fields.map((field, index) => (
          <div
            key={field.label}
            className={index > 0 ? "border-t border-[#e5dcd3]/70 sm:border-t-0" : undefined}
          >
            <SpecColumn label={field.label} value={field.value} showDivider={index > 0} />
          </div>
        ))}
      </div>
    </article>
  );}