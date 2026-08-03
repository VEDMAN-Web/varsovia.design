export type FooterNavLink = {
  label: string;
  href: string;
};

export type FooterLinkColumn = {
  id: string;
  links: FooterNavLink[];
};

export type FooterNavigationConfig = {
  version?: number;
  linkColumns: FooterLinkColumn[];
  legalLinks: FooterNavLink[];
  contactHeading: string;
  contactLabels: {
    email?: string;
    mobileWhatsapp?: string;
    contactNumber?: string;
  };
  socialLabels: {
    whatsapp?: string;
    facebook?: string;
  };
  copyright: string;
};
