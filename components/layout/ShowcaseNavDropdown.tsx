import { Link } from "@/lib/i18n/navigation";
import {
  NAV_DROPDOWN_ITEM,
  NAV_DROPDOWN_ITEM_SUBTITLE,
  NAV_DROPDOWN_ITEM_TITLE,
  NAV_DROPDOWN_LINK_FEATURED,
  NAV_DROPDOWN_PANEL_WIDE,
} from "@/components/layout/navDropdownShared";
import { SHOWCASE_CATEGORY_META, SHOWCASE_TABS, type ShowcaseTab } from "@/lib/showcaseData";

type ShowcaseNavDropdownProps = {
  onNavigate?: () => void;
};

function showcaseHref(tab: ShowcaseTab) {
  if (tab === "Home case") return "/showcase";
  return `/showcase?tab=${encodeURIComponent(tab)}`;
}

function ShowcaseDropdownColumn({
  tabs,
  onNavigate,
}: {
  tabs: ShowcaseTab[];
  onNavigate?: () => void;
}) {
  return (
    <div className="min-w-0 flex-1">
      {tabs.map((tab) => {
        const meta = SHOWCASE_CATEGORY_META[tab];
        return (
          <Link key={tab} href={showcaseHref(tab)} onClick={onNavigate} className={NAV_DROPDOWN_ITEM}>
            <span className={NAV_DROPDOWN_ITEM_TITLE}>{meta.title}</span>
            <span className={NAV_DROPDOWN_ITEM_SUBTITLE}>· {meta.subtitle}</span>
          </Link>
        );
      })}
    </div>
  );
}

/** Showcase dropdown — same fonts as Interior, 2-column vertical fill */
export default function ShowcaseNavDropdown({ onNavigate }: ShowcaseNavDropdownProps) {
  const items = SHOWCASE_TABS.filter((tab) => tab !== "All");
  const leftColumn = items.filter((_, index) => index % 2 === 0);
  const rightColumn = items.filter((_, index) => index % 2 === 1);

  return (
    <div className={`${NAV_DROPDOWN_PANEL_WIDE} w-[min(92vw,580px)]`}>
      <Link href="/showcase?tab=All" onClick={onNavigate} className={NAV_DROPDOWN_LINK_FEATURED}>
        Our Showcase
      </Link>

      <div className="flex pb-1">
        <ShowcaseDropdownColumn tabs={leftColumn} onNavigate={onNavigate} />
        <ShowcaseDropdownColumn tabs={rightColumn} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

export { showcaseHref };
