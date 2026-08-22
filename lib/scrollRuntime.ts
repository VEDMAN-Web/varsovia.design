/** Desktop luxury wheel only. Touch OS already has compositor momentum. */

export function shouldUseLuxuryWheel(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (window.matchMedia("(hover: none)").matches) return false;
  if (window.innerWidth < 1024) return false;
  return true;
}
