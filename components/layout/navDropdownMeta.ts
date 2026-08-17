/** Subtitle copy for nav dropdown links — keyed by href path */
type DropdownTranslator = ((key: string) => string) & {
  has?: (key: string) => boolean;
};

export function getNavDropdownSubtitle(
  href: string,
  t: DropdownTranslator,
): string | undefined {
  if (typeof t.has === "function" && !t.has(href)) return undefined;
  try {
    const value = t(href);
    if (!value || value === href) return undefined;
    return value;
  } catch {
    return undefined;
  }
}
