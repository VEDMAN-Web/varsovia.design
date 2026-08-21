import {
  NavDropdownBody,
  NavDropdownFeatured,
  NavDropdownLink,
  NavDropdownPanel,
  NavDropdownSectionLabel,
} from "@/components/layout/NavDropdown";
import { getNavDropdownSubtitle } from "@/components/layout/navDropdownMeta";

type NavMenuDropdownProps = {
  featured: { href: string; label: string; subtitle?: string };
  sectionLabel?: string;
  links: { label: string; href: string }[];
  onNavigate?: () => void;
  getSubtitle?: (href: string) => string | undefined;
};

export default function NavMenuDropdown({
  featured,
  sectionLabel,
  links,
  onNavigate,
  getSubtitle,
}: NavMenuDropdownProps) {
  const items = links.filter((child) => child.href !== featured.href);

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
            subtitle={getSubtitle?.(child.href)}
            onNavigate={onNavigate}
          />
        ))}
      </NavDropdownBody>
    </NavDropdownPanel>
  );
}
