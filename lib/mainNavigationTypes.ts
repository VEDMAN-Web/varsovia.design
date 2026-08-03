export type MainNavMenuKind = "none" | "dropdown" | "showcaseMega";

export type MainNavMenuLink = {
  label?: string;
  title?: string;
  subtitle?: string;
  href: string;
};

export type MainNavMenu = {
  featured: { label: string; subtitle?: string; href: string };
  sectionLabel?: string;
  links: MainNavMenuLink[];
};

export type MainNavItem = {
  id: string;
  label: string;
  href: string;
  menuKind: MainNavMenuKind;
  menu?: MainNavMenu;
};

export type MainNavigationConfig = {
  version?: number;
  items: MainNavItem[];
};

/** Navbar-ready shape (same as API after localization). */
export type ResolvedNavItem = {
  id: string;
  label: string;
  href: string;
  hasArrow: boolean;
  menuKind: MainNavMenuKind;
  menu?: MainNavMenu;
};
