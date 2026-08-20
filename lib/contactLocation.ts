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

function buildEmbedSrc(lat: number, lng: number) {
  // Center only — no `q=` pin, so the branded overlay is the single marker.
  return `https://maps.google.com/maps?ll=${lat},${lng}&z=16&hl=en&t=m&output=embed`;
}

export const CONTACT_MAP_EMBED_SRC = buildEmbedSrc(
  SAMUI_OFFICE_COORDS.lat,
  SAMUI_OFFICE_COORDS.lng,
);

export const CONTACT_MAP_OPEN_HREF = `https://www.google.com/maps?q=loc:${SAMUI_OFFICE_COORDS.lat},${SAMUI_OFFICE_COORDS.lng}`;

function parseLatLng(url: string): { lat: number; lng: number } | null {
  const loc = url.match(/q=loc:(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/i);
  if (loc) return { lat: Number(loc[1]), lng: Number(loc[2]) };
  const q = url.match(/[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (q) return { lat: Number(q[1]), lng: Number(q[2]) };
  const ll = url.match(/[?&]ll=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (ll) return { lat: Number(ll[1]), lng: Number(ll[2]) };
  return null;
}

/** One-pin Google embed. CMS URLs with lat,lng are rewritten so Places nearby does not add a second marker. */
export function contactMapEmbedSrc(cmsUrl?: string) {
  const raw = String(cmsUrl || "").trim();
  const coords = parseLatLng(raw);
  if (coords && Number.isFinite(coords.lat) && Number.isFinite(coords.lng)) {
    return buildEmbedSrc(coords.lat, coords.lng);
  }
  if (raw.includes("output=embed") || raw.includes("/maps/embed")) return raw;
  return CONTACT_MAP_EMBED_SRC;
}

export function contactMapCoords(cmsUrl?: string) {
  const parsed = parseLatLng(String(cmsUrl || "").trim());
  if (parsed && Number.isFinite(parsed.lat) && Number.isFinite(parsed.lng)) {
    return parsed;
  }
  return { lat: SAMUI_OFFICE_COORDS.lat, lng: SAMUI_OFFICE_COORDS.lng };
}

export function contactMapOpenHref(cmsUrl?: string) {
  const coords = contactMapCoords(cmsUrl);
  return `https://www.google.com/maps?q=loc:${coords.lat},${coords.lng}`;
}
