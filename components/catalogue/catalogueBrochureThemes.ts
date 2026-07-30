import { MEDIA } from "@/lib/mediaAssets";

export type BrochureRoomKey =
  | "KITCHEN"
  | "BEDROOM"
  | "BATHROOM"
  | "FURNITURE"
  | "LIVING";

export type BrochureTheme = {
  room: BrochureRoomKey;
  /** Photo-only background (no baked catalogue artwork) */
  photo: string;
};

/** Figma home carousel — each cover shows a different room line */
export const HOME_CAROUSEL_BROCHURE_THEMES: BrochureTheme[] = [
  { room: "BEDROOM", photo: MEDIA.featured[3] },
  { room: "BATHROOM", photo: MEDIA.featured[4] },
  { room: "KITCHEN", photo: MEDIA.featured[0] },
  { room: "FURNITURE", photo: MEDIA.featured[7] },
  { room: "LIVING", photo: MEDIA.featured[5] },
];

/** Kitchen centred on first paint (Figma default) */
export const HOME_CAROUSEL_DEFAULT_ACTIVE = 2;

const ROOM_FROM_TITLE =
  /\b(kitchen|bedroom|bathroom|furniture|living)\b/i;

export function brochureThemeForIndex(index: number, title?: string): BrochureTheme {
  const base = HOME_CAROUSEL_BROCHURE_THEMES[index % HOME_CAROUSEL_BROCHURE_THEMES.length];
  if (!title?.trim()) return base;

  const match = title.match(ROOM_FROM_TITLE);
  if (!match) return base;

  const word = match[1].toUpperCase() as BrochureRoomKey;
  const fromList = HOME_CAROUSEL_BROCHURE_THEMES.find((t) => t.room === word);
  return fromList ? { ...base, room: word, photo: fromList.photo } : { ...base, room: word };
}

/** Notebook grid — rotate themes; default first card kitchen */
export function notebookBrochureTheme(index: number, title?: string): BrochureTheme {
  return brochureThemeForIndex(index, title);
}
