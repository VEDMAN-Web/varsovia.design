"use client";

import {
  mobileSubLinkFeatured,
  mobileSubLinkRich,
  NavDropdownBody,
  NavDropdownFeatured,
  NavDropdownPanel,
  NavDropdownRichLink,
  NavDropdownSectionLabel,
} from "@/components/layout/NavDropdown";
import type { MainNavMenu } from "@/lib/mainNavigationTypes";
import { Link } from "@/lib/i18n/navigation";

type ShowcaseNavDropdownProps = {
  menu: MainNavMenu;
  onNavigate?: () => void;
};

function ShowcaseDropdownColumn({
  links,
  onNavigate,
}: {
  links: MainNavMenu["links"];
  onNavigate?: () => void;
}) {
  return (
    <div className="min-w-0 flex-1">
      {links.map((link) => (
        <NavDropdownRichLink
          key={link.href}
          href={link.href}
          title={link.title ?? link.label ?? ""}
          subtitle={link.subtitle ?? ""}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}

/** Showcase dropdown — two-column portfolio grid */
export default function ShowcaseNavDropdown({ menu, onNavigate }: ShowcaseNavDropdownProps) {
  const items = menu.links;
  const leftColumn = items.filter((_, index) => index % 2 === 0);
  const rightColumn = items.filter((_, index) => index % 2 === 1);

  return (
    <NavDropdownPanel wide>
      <NavDropdownFeatured
        href={menu.featured.href}
        label={menu.featured.label}
        subtitle={menu.featured.subtitle}
        onNavigate={onNavigate}
      />
      {menu.sectionLabel ? <NavDropdownSectionLabel>{menu.sectionLabel}</NavDropdownSectionLabel> : null}
      <NavDropdownBody className="pb-3 pt-0">
        <div className="flex divide-x divide-[#ece3df]/70">
          <ShowcaseDropdownColumn links={leftColumn} onNavigate={onNavigate} />
          <ShowcaseDropdownColumn links={rightColumn} onNavigate={onNavigate} />
        </div>
      </NavDropdownBody>
    </NavDropdownPanel>
  );
}

/** Mobile showcase accordion links */
export function MobileShowcaseLinks({
  menu,
  onNavigate,
}: {
  menu: MainNavMenu;
  onNavigate: () => void;
}) {
  return (
    <>
      <Link href={menu.featured.href} onClick={onNavigate} className={mobileSubLinkFeatured}>
        {menu.featured.label}
      </Link>
      {menu.links.map((link) => (
        <Link key={link.href} href={link.href} onClick={onNavigate} className={mobileSubLinkRich}>
          <span className="block font-outfit text-[15px] font-medium text-maroon">
            {link.title ?? link.label}
          </span>
          {link.subtitle ? (
            <span className="mt-0.5 block font-outfit text-[12px] text-[#6a414d]/65">{link.subtitle}</span>
          ) : null}
        </Link>
      ))}
    </>
  );
}
