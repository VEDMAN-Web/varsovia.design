import { FOOTER_CONTACT } from "@/lib/footerContact";

/** Geocoded pin for Samui Office — Route 4169, Mae Nam, Ko Samui */
export const SAMUI_OFFICE_COORDS = {
  lat: 9.56218,
  lng: 100.01582,
} as const;

export const CONTACT_MAP_OFFICE = {
  label: "Samui Office",
  address: FOOTER_CONTACT.offices[0].address,
};

/** Google Maps embed — Samui Office (same as footer). */
export const CONTACT_MAP_EMBED_SRC = (() => {
  const { lat, lng } = SAMUI_OFFICE_COORDS;
  return `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=16&output=embed`;
})();
