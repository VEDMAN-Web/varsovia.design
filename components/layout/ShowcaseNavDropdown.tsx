"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import {
  mobileSubLinkFeatured,
  mobileSubLinkRich,
  NavDropdownBody,
  NavDropdownFeatured,
  NavDropdownPanel,
  NavDropdownRichLink,
  NavDropdownSectionLabel,
} from "@/components/layout/NavDropdown";
import { SHOWCASE_TABS, type ShowcaseTab } from "@/lib/showcaseData";
import { showcaseTabMessageKey } from "@/lib/showcaseTabI18n";

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
  const t = useTranslations("showcase");

  return (
    <div className="min-w-0 flex-1">
      {tabs.map((tab) => {
        const key = showcaseTabMessageKey(tab);
        return (
          <NavDropdownRichLink
            key={tab}
            href={showcaseHref(tab)}
            title={t(`categoryMeta.${key}.title`)}
            subtitle={t(`categoryMeta.${key}.subtitle`)}
            onNavigate={onNavigate}
          />
        );
      })}
    </div>
  );
}

/** Showcase dropdown — two-column portfolio grid */
export default function ShowcaseNavDropdown({ onNavigate }: ShowcaseNavDropdownProps) {
  const t = useTranslations("showcase");
  const items = SHOWCASE_TABS.filter((tab) => tab !== "All");
  const leftColumn = items.filter((_, index) => index % 2 === 0);
  const rightColumn = items.filter((_, index) => index % 2 === 1);

  return (
    <NavDropdownPanel wide>
      <NavDropdownFeatured
        href="/showcase?tab=All"
        label={t("navFeaturedTitle")}
        subtitle={t("navEverySpace")}
        onNavigate={onNavigate}
      />
      <NavDropdownSectionLabel>{t("navByRegion")}</NavDropdownSectionLabel>
      <NavDropdownBody className="pb-3 pt-0">
        <div className="flex divide-x divide-[#ece3df]/70">
          <ShowcaseDropdownColumn tabs={leftColumn} onNavigate={onNavigate} />
          <ShowcaseDropdownColumn tabs={rightColumn} onNavigate={onNavigate} />
        </div>
      </NavDropdownBody>
    </NavDropdownPanel>
  );
}

export { showcaseHref };

/** Mobile showcase accordion links */
export function MobileShowcaseLinks({ onNavigate }: { onNavigate: () => void }) {
  const t = useTranslations("showcase");
  const items = SHOWCASE_TABS.filter((tab) => tab !== "All");

  return (
    <>
      <Link href="/showcase?tab=All" onClick={onNavigate} className={mobileSubLinkFeatured}>
        {t("navFeaturedTitle")}
      </Link>
      {items.map((tab) => {
        const key = showcaseTabMessageKey(tab);
        return (
          <Link
            key={tab}
            href={showcaseHref(tab as ShowcaseTab)}
            onClick={onNavigate}
            className={mobileSubLinkRich}
          >
            <span className="block font-outfit text-[15px] font-medium text-maroon">
              {t(`categoryMeta.${key}.title`)}
            </span>
            <span className="mt-0.5 block font-outfit text-[12px] text-[#6a414d]/65">
              {t(`categoryMeta.${key}.subtitle`)}
            </span>
          </Link>
        );
      })}
    </>
  );
}
