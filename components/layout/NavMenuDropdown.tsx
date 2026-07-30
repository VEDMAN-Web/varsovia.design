import {
  NavDropdownBody,
  NavDropdownFeatured,
  NavDropdownLink,
  NavDropdownPanel,
  NavDropdownSectionLabel,
} from "@/components/layout/NavDropdown";
import { NAV_DROPDOWN_SUBTITLES } from "@/components/layout/navDropdownMeta";

type NavMenuDropdownProps = {
  featured: { href: string; label: string; subtitle?: string };
  sectionLabel?: string;
  children: { label: string; href: string }[];
  onNavigate?: () => void;
};

export default function NavMenuDropdown({
  featured,
  sectionLabel,
  children,
  onNavigate,
}: NavMenuDropdownProps) {
  const items = children.filter((child) => child.href !== featured.href);

  return (
    <NavDropdownPanel>
      <NavDropdownFeatured
        href={featured.href}
        label={featured.label}
        subtitle={featured.subtitle}
        onNavigate={onNavigate}
      />
      {sectionLabel && items.length > 0 && (
        <NavDropdownSectionLabel>{sectionLabel}</NavDropdownSectionLabel>
      )}
      <NavDropdownBody>
        {items.map((child) => (
          <NavDropdownLink
            key={child.href}
            href={child.href}
            label={child.label}
            subtitle={NAV_DROPDOWN_SUBTITLES[child.href]}
            onNavigate={onNavigate}
          />
        ))}
      </NavDropdownBody>
    </NavDropdownPanel>
  );
}
