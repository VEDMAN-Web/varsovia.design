/** Default CMS payloads for standalone pages (FAQ, catalogue, contact, legal, SEO). */

function L(en, th = "", pl = "") {
  return { en, th: th || "", pl: pl || "" };
}

const legalPrivacyBlocks = [
  {
    heading: L("1. Who we are"),
    text: L(
      "Varsovia Design (“we”, “us”) provides modular kitchen and interior design services. This policy explains how we process personal data when you visit our website, request a consultation, download catalogues, or contact us.\n\nFor data protection enquiries, use the contact details on our Contact page or the email address listed in the site footer.",
    ),
  },
  {
    heading: L("2. Data we collect"),
    text: L(
      "We may collect: name, email address, phone number, project location, message content, and catalogue download preferences when you submit forms. We also collect technical data such as IP address, browser type, and pages visited through standard server logs and analytics (when enabled).",
    ),
  },
  {
    heading: L("3. How we use your data"),
    text: L(
      "We use your information to respond to enquiries, provide quotes and design services, send requested materials, improve our website, and comply with legal obligations. We do not sell your personal data to third parties.",
    ),
  },
  {
    heading: L("4. Legal bases (EEA / UK visitors)"),
    text: L(
      "Where applicable, we rely on: your consent (e.g. marketing where offered), performance of a contract or steps prior to contract (consultations and projects), legitimate interests (site security and improvement), and legal obligation.",
    ),
  },
  {
    heading: L("5. Retention & security"),
    text: L(
      "We retain contact and project-related data only as long as needed for the purposes above or as required by law. We apply appropriate technical and organisational measures to protect data; no method of transmission over the internet is 100% secure.",
    ),
  },
  {
    heading: L("6. Your rights"),
    text: L(
      "Depending on your location, you may have rights to access, rectify, erase, restrict, or object to processing, and to data portability. You may withdraw consent where processing is consent-based. You may lodge a complaint with your local supervisory authority.\n\nTo exercise rights, contact us using the details on the Contact page.",
    ),
  },
  {
    heading: L("7. International transfers"),
    text: L(
      "If data is processed outside your country, we ensure appropriate safeguards (such as standard contractual clauses) where required by applicable law.",
    ),
  },
  {
    heading: L("8. Changes"),
    text: L(
      "We may update this policy from time to time. The “Last updated” date at the top of this page will change when we do. Continued use of the site after changes constitutes acknowledgement of the updated policy.",
    ),
  },
];

const legalTermsBlocks = [
  {
    heading: L("1. Acceptance"),
    text: L(
      "By accessing varsoviadesign.com and related pages, you agree to these Terms of Use. If you do not agree, please do not use the site.",
    ),
  },
  {
    heading: L("2. Website content"),
    text: L(
      "Images, text, layouts, and branding on this site are owned by Varsovia Design or used under licence. You may view and share links for personal, non-commercial use. You may not copy, scrape, or republish content without written permission.",
    ),
  },
  {
    heading: L("3. Enquiries & projects"),
    text: L(
      "Information on the website is for general guidance. Quotes, timelines, materials, and warranties are confirmed only in signed agreements or written project documentation—not solely through website copy.",
    ),
  },
  {
    heading: L("4. Catalogue downloads"),
    text: L(
      "When you request a catalogue, you agree to provide accurate contact details. We may use them to fulfil your request and, where permitted, follow up about relevant products and services. You may opt out of marketing communications at any time.",
    ),
  },
  {
    heading: L("5. Acceptable use"),
    text: L(
      "You must not misuse the site (including attempting unauthorised access, introducing malware, or harassing our team). We may suspend access if we reasonably believe terms are violated.",
    ),
  },
  {
    heading: L("6. Disclaimer"),
    text: L(
      "The site is provided “as is”. We strive for accuracy but do not warrant that content is error-free or uninterrupted. To the extent permitted by law, we exclude liability for indirect or consequential loss arising from use of the site.",
    ),
  },
  {
    heading: L("7. Third-party links"),
    text: L(
      "Links to partner or social sites are provided for convenience. We are not responsible for third-party content or privacy practices.",
    ),
  },
  {
    heading: L("8. Governing law"),
    text: L(
      "These terms are governed by the laws applicable to Varsovia Design’s principal place of business, without regard to conflict-of-law rules. Courts in that jurisdiction shall have exclusive jurisdiction where permitted by mandatory consumer protection laws in your country.",
    ),
  },
  {
    heading: L("9. Contact"),
    text: L("Questions about these terms: use the Contact page or footer contact details."),
  },
];

const PAGE_CMS_DEFAULTS = {
  aboutPageSettings: {
    indexable: false,
    metaTitle: L("About Us | Varsovia Design"),
    metaDescription: L(
      "Learn about Varsovia Design — our story, values, and process for kitchens and interiors across Thailand.",
    ),
  },
  faqPage: {
    indexable: false,
    metaTitle: L("FAQ | Varsovia Design"),
    metaDescription: L(
      "Answers to common questions about Varsovia kitchens, interiors, materials, and project process.",
    ),
    heroTitle: L("FAQ"),
    heroSubtitle: L("Clear answers to help you make informed design decisions"),
  },
  cataloguePage: {
    indexable: false,
    metaTitle: L("Free Catalogue | Varsovia Design"),
    metaDescription: L(
      "Download Varsovia Design catalogues for kitchen and interior inspiration.",
    ),
    heroTitle: L("Free Catalogue"),
    heroSubtitle: L("Explore Our Interior Design Catalogue"),
  },
  contactPage: {
    indexable: false,
    metaTitle: L("Contact Us | Varsovia Design"),
    metaDescription: L(
      "Get in touch with Varsovia Design for a free consultation on modular kitchens and interiors.",
    ),
    locationTitle: L("Our Location"),
    locationSubtitle: L("Visit our showroom or reach us online — we are here to help"),
    mapEmbedUrl:
      "https://maps.google.com/maps?q=9.56218,100.01582&hl=en&z=16&output=embed",
    mapAriaLabel: L("Varsovia Design office location map"),
    showroomsTitle: L("Visit a showroom"),
    showroomsSubtitle: L(
      "Experience materials, layouts, and finishes in person at our locations.",
    ),
  },
  legalPages: {
    privacy: {
      indexable: false,
      metaTitle: L("Privacy Policy | Varsovia Design"),
      metaDescription: L(
        "Privacy Policy for Varsovia Design — personal data, cookies, your rights, and contact details.",
      ),
      title: L("Privacy Policy"),
      subtitle: L("How Varsovia Design collects, uses, and protects your information"),
      updated: L("Last updated: 31 July 2026"),
      blocks: legalPrivacyBlocks,
    },
    terms: {
      indexable: false,
      metaTitle: L("Terms of Use | Varsovia Design"),
      metaDescription: L(
        "Terms of Use for Varsovia Design website — acceptable use, intellectual property, limitations, and governing law.",
      ),
      title: L("Terms of Use"),
      subtitle: L("Terms governing use of the Varsovia Design website and services"),
      updated: L("Last updated: 31 July 2026"),
      blocks: legalTermsBlocks,
    },
  },
};

module.exports = { PAGE_CMS_DEFAULTS, L };
